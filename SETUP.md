# Setup — connecting the reservation form

The site is fully built and deployable on its own. This document covers the one
piece that needs your Google account: sending registrations into a Sheet.

Until you finish these steps the form still validates and moves through all six
courses, but the final step shows *"This form isn't connected yet"* rather than
pretending a registration was saved.

---

## 1 · Create the Sheet

1. Make a new Google Sheet. Name it whatever you like.
2. Copy its ID from the URL — the part between `/d/` and `/edit`.

## 2 · Add the script

1. In the Sheet: **Extensions → Apps Script**.
2. Delete the placeholder and paste in the contents of **`Code.gs`** from this repo.
3. At the top of the script, set:
   ```js
   const SHEET_ID = 'the id you copied';
   ```
4. Optionally set `NOTIFY_EMAIL` to get an email on every registration.
5. Run `testSetup` once from the editor. Google will ask you to authorise it.
   This creates the header row and confirms the connection.

## 3 · Deploy it as a Web App

1. **Deploy → New deployment → Web app**.
2. *Execute as:* **Me**.
3. *Who has access:* **Anyone**.
4. Deploy, then copy the **`/exec`** URL.

> "Anyone" means anyone who knows the URL can POST to it. That's what lets the
> site submit without a backend. The script only ever appends a row.

## 4 · Point the site at it

Open **`src/lib/reservation.ts`** and replace the placeholder:

```ts
export const ENDPOINT = 'https://script.google.com/macros/s/…/exec';
```

Commit and push — the deploy workflow rebuilds and publishes automatically.

---

## How submission works

`src/lib/reservation.ts` owns the whole contract:

- Every answer is flattened to one string per column by `resolveField`.
  Multi-selects join with `, `; a hidden conditional field sends `—`.
- The payload keys are the `key` values in `src/data/courses.ts`, and they must
  match `COLUMNS` in `Code.gs`. **Add a field in one place, add it in the other.**
- A hidden `website` field is a spam trap. Bots fill it in; `Code.gs` silently
  drops any submission that has it set.
- Apps Script often can't return usable CORS headers, so a failed readable
  request retries once with `mode: 'no-cors'`. The row still lands in the Sheet;
  the browser just can't read the reply.

## Editing the questions

`src/data/courses.ts` is the whole form. Each field takes:

| key | meaning |
|---|---|
| `type` | `text` · `tel` · `email` · `textarea` · `single` · `multi` |
| `options` | the chips, for `single` / `multi` |
| `other` | adds a "Something else" chip with a free-text box |
| `showIf` | `{ key, not }` — only show when another answer isn't that value |
| `help` / `placeholder` | supporting text |
| `error` | the message shown when it fails validation |

Validation lives in `isFilled`: email is pattern-checked, phone numbers need at
least eight digits, and hidden fields always pass.

## Upcoming dinners

`src/data/dinners.ts` currently holds **sample events**. Replace them with real
ones — set `open: false` to show a dinner as fully booked with a waitlist
button instead of a reserve button.
