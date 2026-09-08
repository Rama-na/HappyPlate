# Happy Plate — A Supper Club

An intimate supper club where strangers share one long table, a set menu, and an
evening worth staying late for. The site is a long-form scrolling invitation
that ends in the reservation form.

**Live:** https://rama-na.github.io/HappyPlate/

---

## Stack

| | |
|---|---|
| **React 19 + TypeScript** | built with **Vite** |
| **GSAP + ScrollTrigger** | every scroll-linked animation |
| **Lenis** | smooth scrolling, driven off GSAP's ticker so the two share one clock |
| **Self-hosted Cormorant Garamond + Inter** | no third-party font request |

No CSS framework — the design system lives in `src/styles/global.css`.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173/HappyPlate/
npm run build      # typecheck + production build into dist/
npm run preview    # serve the built site exactly as Pages will
```

`vite.config.ts` sets `base: '/HappyPlate/'` to match the Pages path. That path
is **case-sensitive** — if the repository is ever renamed, update `base` and the
absolute URLs in `index.html`, `public/robots.txt` and `public/sitemap.xml`.

## Deploying

`.github/workflows/static.yml` installs, builds, and publishes `dist/` to Pages
on every push to the deploy branch (and on demand from the Actions tab). The one
manual step is **Settings → Pages → Source → GitHub Actions**.

## Connecting the reservation form

The form is fully built but inert until it has somewhere to post. Open
**`src/lib/reservation.ts`** and set:

```ts
export const ENDPOINT = 'https://script.google.com/macros/s/…/exec';
```

Until then the last step shows *"This form isn't connected yet"* rather than
losing a registration. Full walkthrough in **[SETUP.md](SETUP.md)**.

## Editing content

Everything a non-developer needs to change is data, not JSX:

| File | What it holds |
|---|---|
| `src/data/dinners.ts` | upcoming dinners — **currently sample events**, replace them |
| `src/data/courses.ts` | the six reservation courses and their fields |
| `src/data/site.ts` | club name, Instagram and contact email (blank → link hidden) |

Add a field to `courses.ts` and you must add its `key` to `COLUMNS` in
`Code.gs`, then redeploy the Apps Script — the sheet's column order is driven
from there.

## Structure

```
src/
  animations/     lenis.ts, gsap.ts — smooth scroll + the shared animation language
  components/     one file per section, plus motion/ primitives
  data/           courses, dinners, site config
  lib/            asset paths, reservation submit logic
  styles/         global.css (design system), sections.css, reservation.css
  assets/         photography, fonts, image manifest
```

## Photography

All imagery is the club's own, cropped from the supplied originals to remove
baked-in text and social-post furniture, then emitted at several widths as WebP
with JPEG fallbacks (`src/assets/images.ts`).

There is **no food photography yet**. The gallery deliberately shows the room
and the table as it is laid rather than stock plates, and the copy talks about
the menu without describing dishes. Drop real course photography into the
manifest when it exists.

## Motion and accessibility

Everything scroll-linked runs through GSAP inside a `gsap.context`, so tweens
and ScrollTriggers are reverted on unmount. `prefers-reduced-motion` is honoured
throughout: Lenis never starts, parallax and scrubs are skipped, and the intro
is bypassed — content renders in its final state. The intro also plays only once
per session (`sessionStorage`).

## A note on React Bits

The brief asked for React Bits components. Its registry (`reactbits.dev`) is
blocked by the network this was built on, so `src/components/motion/` holds
hand-built equivalents — `BlurText`, `SplitText`, `ScrollReveal`,
`AnimatedContent` — with the same names and prop shapes. See
[`src/components/motion/README.md`](src/components/motion/README.md) for how to
swap in the real ones.
