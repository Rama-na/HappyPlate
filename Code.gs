/**
 * Happy Plate Supper Club — registration endpoint
 * Receives a POST from the site and appends one row to a Google Sheet.
 */

// ── 1. Set these two ────────────────────────────────────────────────
const SHEET_ID  = 'PASTE_YOUR_SPREADSHEET_ID_HERE'; // from the sheet URL, between /d/ and /edit
const SHEET_TAB = 'Registrations';

// Optional: get an email every time someone registers. Leave '' for none.
const NOTIFY_EMAIL = '';

// ── 2. Column order in the sheet ────────────────────────────────────
// [ Sheet header , key sent by the site ]
const COLUMNS = [
  ['Timestamp',               'timestamp'],
  ['Full name',               'fullName'],
  ['WhatsApp number',         'whatsapp'],
  ['Email address',           'email'],
  ['Age group',               'ageGroup'],
  ['What they do',            'work'],
  ['About them',              'about'],
  ['Why Happy Plate',         'why'],
  ['First supper club?',      'firstTime'],
  ['Food preference',         'food'],
  ['Allergies / restrictions','allergies'],
  ["Who's joining",           'party'],
  ['Guest names',             'guests'],
  ['Conversation topics',     'topics'],
  ['Waitlist',                'waitlist'],
  ['Source',                  'source'],
];

// ── 3. Handlers ─────────────────────────────────────────────────────
function doPost(e) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (err) { return out_({ ok: false, error: 'busy' }); }

  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // spam trap — the site keeps this field hidden and empty
    if (body.website) return out_({ ok: true });

    body.timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    body.source = body.source || 'website';

    const sheet = sheet_();
    sheet.appendRow(COLUMNS.map(function (c) {
      const v = body[c[1]];
      if (Array.isArray(v)) return v.join(', ');
      return v == null ? '' : String(v);
    }));

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        'New seat request — ' + (body.fullName || 'Unknown'),
        COLUMNS.map(function (c) { return c[0] + ': ' + (body[c[1]] || ''); }).join('\n')
      );
    }

    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return out_({ ok: true, status: 'Happy Plate endpoint is live' });
}

// ── 4. Helpers ──────────────────────────────────────────────────────
function sheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(SHEET_TAB) || ss.insertSheet(SHEET_TAB);

  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUMNS.map(function (c) { return c[0]; }));
    sh.getRange(1, 1, 1, COLUMNS.length)
      .setFontWeight('bold')
      .setBackground('#E7C090')
      .setFontColor('#1D1712');
    sh.setFrozenRows(1);
    sh.setColumnWidths(1, COLUMNS.length, 170);
  }
  return sh;
}

function out_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run this once from the editor to check the connection and create headers.
function testSetup() {
  const sh = sheet_();
  Logger.log('Connected to: ' + sh.getParent().getName() + ' → ' + sh.getName());
}
