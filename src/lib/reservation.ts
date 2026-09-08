import { COURSES, OTHER, type Field } from '../data/courses';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PASTE YOUR APPS SCRIPT WEB APP URL HERE
 * ─────────────────────────────────────────────────────────────────────────────
 * Deploy Code.gs as a Web App (Execute as: Me · Who has access: Anyone), then
 * drop the /exec URL in below. Until it's set, the form validates and shows a
 * "not connected yet" notice instead of silently losing a registration.
 */
export const ENDPOINT = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

export type Answers = Record<string, string | string[] | undefined>;
export type Others = Record<string, string | undefined>;

const isConfigured = (url: string) => /^https:\/\/script\.google\.com\//.test(url);

/** Conditional fields: visible only when the controlling answer isn't the excluded one. */
export function isVisible(field: Field, answers: Answers): boolean {
  if (!field.showIf) return true;
  const v = answers[field.showIf.key];
  return Boolean(v) && v !== field.showIf.not;
}

export function isFilled(field: Field, answers: Answers, others: Others): boolean {
  if (!isVisible(field, answers)) return true;
  const v = answers[field.key];
  const other = (others[field.key] ?? '').trim();

  if (field.type === 'multi') {
    const list = Array.isArray(v) ? v : [];
    if (!list.length) return false;
    if (list.includes(OTHER) && !other) return false;
    return true;
  }
  if (field.type === 'single') {
    if (!v) return false;
    if (v === OTHER && !other) return false;
    return true;
  }

  const s = typeof v === 'string' ? v.trim() : '';
  if (!s) return false;
  if (field.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
  if (field.type === 'tel') return (s.match(/\d/g) ?? []).length >= 8;
  return true;
}

/** Flatten one field to the single string the sheet column expects. */
export function resolveField(field: Field, answers: Answers, others: Others): string {
  const v = answers[field.key];
  const other = (others[field.key] ?? '').trim();

  if (field.type === 'multi') {
    const list = Array.isArray(v) ? v : [];
    return list.map((x) => (x === OTHER ? other : x)).filter(Boolean).join(', ');
  }
  if (field.type === 'single') {
    return v === OTHER ? other : ((v as string) ?? '');
  }
  if (!isVisible(field, answers)) return '—';
  return typeof v === 'string' ? v.trim() : '';
}

export function buildPayload(answers: Answers, others: Others, honey: string): Record<string, string> {
  const payload: Record<string, string> = { source: 'happyplate.site', website: honey };
  COURSES.flatMap((c) => c.fields).forEach((f) => {
    payload[f.key] = resolveField(f, answers, others);
  });
  return payload;
}

export class NotConnectedError extends Error {
  constructor() {
    super('no-endpoint');
    this.name = 'NotConnectedError';
  }
}

/**
 * Post the registration. Apps Script often can't send usable CORS headers, so a
 * failed readable request retries opaquely — the row still lands in the sheet.
 */
export async function submitReservation(payload: Record<string, string>): Promise<void> {
  if (!isConfigured(ENDPOINT)) throw new NotConnectedError();

  try {
    const res = await fetch(ENDPOINT, { method: 'POST', body: JSON.stringify(payload) });
    const out = (await res.json()) as { ok?: boolean; error?: string };
    if (!out.ok) throw new Error(out.error ?? 'sheet-error');
  } catch {
    await fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
  }
}
