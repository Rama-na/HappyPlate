# Happy Plate — setup

Two files. `index.html` is the whole site. `Code.gs` is the bit that writes to your sheet.
No build step, no npm, no framework.

---

## 1 · Make the sheet

1. New Google Sheet → name it **Happy Plate Registrations**.
2. Copy the ID out of the URL — the long string between `/d/` and `/edit`.

## 2 · Add the script

1. In that sheet: **Extensions → Apps Script**.
2. Delete whatever's in `Code.gs` and paste in the contents of the `Code.gs` file.
3. At the top, set `SHEET_ID` to the ID you copied.
   Optional: set `NOTIFY_EMAIL` to get an email on every signup.
4. Save. Run the `testSetup` function once — it'll ask for permission
   ("Google hasn't verified this app" → *Advanced* → *Go to …*). That's your own script; approve it.
   You should see the header row appear in the sheet.

## 3 · Deploy it

1. **Deploy → New deployment → gear icon → Web app**
2. Execute as: **Me**
   Who has access: **Anyone**  ← must be *Anyone*, not "Anyone with Google account"
3. Deploy, then copy the **Web app URL** (ends in `/exec`).
4. Open `index.html`, find this line near the bottom, and paste the URL in:

```js
const ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
```

> Every time you edit `Code.gs`, use **Deploy → Manage deployments → edit → New version**,
> otherwise the live URL keeps serving the old code.

## 4 · Put it online

Pick one, all free:

| | How |
|---|---|
| **Netlify Drop** | Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Live in ~10 seconds. |
| **Vercel** | `npx vercel` in the folder, or drag-and-drop on the dashboard. |
| **GitHub Pages** | Push to a repo → Settings → Pages → Source: **GitHub Actions**. This repo already ships the deploy workflow. See [README](README.md#deploy-to-github-pages). |
| **Cloudflare Pages** | Connect the repo, no build command, output directory `/`. |

Then point a domain at it — `happyplate.club`, `jointhetable.in`, whatever you've got.
Netlify and Vercel both handle the DNS + HTTPS for you.

---

## Editing the form

Everything lives in the `COURSES` array in `index.html`. To add a question:

```js
{ key:"drinks", label:"Do you drink?", type:"single",
  options:["Yes","No","Occasionally"], error:"Pick one." }
```

Field types: `text` · `tel` · `email` · `textarea` · `single` · `multi`

Useful extras:
- `other:true` on a chip question adds a "Something else" option with a text box
- `help:"..."` puts a small grey line under the label
- `showIf:{ key:"party", not:"Just me" }` only shows the field conditionally

**If you add a question, also add it to `COLUMNS` in `Code.gs`** using the same `key`,
then redeploy a new version. Column order in the sheet follows that array.

---

## The logo in the hero

The hero now uses your real logo. It plays as a short reveal and settles on the
finished mark:

| File | Role |
|---|---|
| `logo-animation.webm` / `.mp4` | The 7-second reveal. The taupe studio background has been keyed out and the gold composited onto the page's dark ink, so it plays cleanly on the hero (and everywhere — no transparent-video support needed). |
| `logo.png` | Transparent still of the finished mark. The reveal hands off to this when it ends; it's also what shows on its own if the video can't play or motion is reduced, and it's the source for the social card and app icons. |

The reveal autoplays muted once, then cross-fades to the still. That handoff is
deliberate: a keyed video carries a little noise that varies frame to frame, so
resting on the still is what keeps the logo perfectly steady once it has landed.
There's no `poster` on the video on purpose — a poster of the finished logo would
flash before the reveal starts on its first, near-empty frame. Visitors with
"reduce motion" turned on skip the video entirely.

To use a different logo, replace those files (keep the names) — export the still
as a **transparent PNG** so it sits cleanly on the dark background. The raw JPEG
has the beige background baked in, so it can't be dropped in as-is; it needs the
background removed first.

---

## What changed from the Google Form

- Six short screens instead of one long scroll — the drop-off on a 13-question form is brutal
- The plate ring in the header fills up as you go; it's complete when you're done
- "Their name(s)" only appears if you're not coming alone
- "None" is suggested for allergies instead of leaving people stuck on a required field
- A hidden spam-trap field, so bots don't fill your sheet
- Confirmation screen uses their first name

Your existing Google Form still works and still writes to its own sheet — this is a
separate pipeline, so you can run both during the switch.
