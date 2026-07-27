# Happy Plate Supper Club

A single-page registration site for the Happy Plate Supper Club. Guests move
through six short "courses" and their answers land in a Google Sheet.

No build step, no framework, no npm — it's plain static HTML/CSS/JS, so it
hosts anywhere. This repo is set up to deploy to **GitHub Pages** automatically.

**Live:** https://rama-na.github.io/happyplate/

---

## What's in here

| File | What it is |
|---|---|
| `index.html` | The entire site — markup, styles, and the six-course form logic. |
| `Code.gs` | Google Apps Script that receives a submission and appends a row to your Sheet. |
| `SETUP.md` | Step-by-step for wiring up the Google Sheet + Apps Script endpoint. |
| `logo-animation.webm` / `.mp4` | The animated logo reveal that plays in the hero. |
| `logo.png` | Transparent still of the finished logo — the reveal settles onto it, and it stands in when motion is reduced. Also the icon/card source. |
| `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | Site icons. |
| `og-image.png` | 1200×630 social-share card shown when the link is posted to WhatsApp, Instagram, etc. |
| `site.webmanifest` | PWA manifest so the site can be "added to home screen". |
| `robots.txt`, `sitemap.xml` | Search-engine basics. |
| `404.html` | Branded not-found page. |
| `.nojekyll` | Tells GitHub Pages to serve files as-is (no Jekyll processing). |
| `.github/workflows/static.yml` | Deploys the site to Pages on every push (and on demand from the Actions tab). |

---

## Deploy to GitHub Pages

The workflow does the publishing; you just have to switch Pages on once.

1. In the repo: **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. That's it. `.github/workflows/static.yml` runs on every push to the deploy
   branch and publishes the whole folder. You can also trigger it by hand from
   the **Actions** tab (*Deploy static content to Pages* → *Run workflow*).

> The workflow is wired to deploy from the branch it lives on. If you'd rather
> deploy from `main`, edit the `branches:` line at the top of `static.yml`.

Your site goes live at `https://<user>.github.io/<repo>/` — for this repo,
https://rama-na.github.io/happyplate/.

### Custom domain (optional)

1. Add a file named `CNAME` at the repo root containing just your domain, e.g.:
   ```
   happyplate.club
   ```
2. Point the domain's DNS at GitHub Pages ([GitHub's guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).
3. Update the absolute URLs so social previews and search engines point at the
   new domain — search these files for `rama-na.github.io/happyplate` and swap in
   your domain:
   - `index.html` (canonical, Open Graph, Twitter, JSON-LD)
   - `robots.txt`, `sitemap.xml`

---

## Connect the form to your Google Sheet

The form won't record anything until you point it at an Apps Script endpoint.
Full walkthrough is in **[SETUP.md](SETUP.md)** — the short version:

1. Create a Google Sheet, open **Extensions → Apps Script**, and paste in `Code.gs`.
2. Set `SHEET_ID` (from the sheet URL). Optionally set `NOTIFY_EMAIL`.
3. **Deploy → New deployment → Web app**, *Execute as: Me*, *Who has access: Anyone*.
4. Copy the `/exec` URL and paste it into `index.html`:
   ```js
   const ENDPOINT = "https://script.google.com/macros/s/…/exec";
   ```
5. Commit and push — the deploy workflow ships it.

> The site is safe to publish before it's connected: until a valid endpoint is
> set, the final step shows *"This form isn't connected yet."* instead of failing silently.

---

## Editing the form

Every question lives in the `COURSES` array near the bottom of `index.html`.
See the **Editing the form** section of [SETUP.md](SETUP.md) for field types
(`text` · `tel` · `email` · `textarea` · `single` · `multi`) and options like
conditional fields and "Something else" chips. If you add a question, add its
`key` to `COLUMNS` in `Code.gs` too, then redeploy the Apps Script.

---

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
