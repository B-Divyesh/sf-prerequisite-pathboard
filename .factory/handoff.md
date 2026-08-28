# Prerequisite Pathboard v1 handoff

## What was built

- A complete Vite + TypeScript offline PWA at `/`, `/demo`, `/board`, `/privacy`, `/terms`, and `/404`.
- A learner-authored prerequisite graph with goal and concept nodes, directed dependencies, cycle prevention, notes, and three explicit statuses.
- A deterministic next-session recommendation. It uses only entered dependencies and statuses, with the deepest ready prerequisite chosen first.
- Coordinated graph and accessible list views. Both expose the same concepts as native buttons.
- Real-data persistence in IndexedDB, refresh recovery, import validation, and JSON and Markdown exports.
- An isolated one-click demo in page memory. It contains a realistic 14-concept derivatives map and never opens the real database.
- Empty, storage error, import error, offline, and 404 states. Destructive deletion uses a named confirmation.
- A hand-written service worker with versioned caches, app-shell precaching, route fallback, cache cleanup, and update messaging.
- A PWA manifest, maskable install icons, theme colors, metadata, canonical URLs, social card, robots file, sitemap, and Azure Static Web Apps routing and security headers.
- A free tier with one goal and 25 concepts. A $24 one-time Sociobot license adds unlimited goals, concepts, and visible repair history.
- License return-token capture, daily cached verification, offline optimistic access, invalid-license reconciliation, and paste-to-restore.
- Privacy and terms pages. No analytics, runtime fonts, third-party scripts, or payment-provider code are present.

## Visual system and artwork

The implemented direction is cinematic environmental art: a night ascent toward an observatory, with warm trail lights standing in for prerequisites. The palette, type, spacing, interaction grammar, motion, reduced-motion path, and prompt are recorded in `.factory/design.md`.

The original source is `assets/src/night-ascent.png`, generated on August 28, 2026 with `/opt/fleet/lib/gen-image.sh` and the factory image deployment. It was visually checked for text, marks, people, and unintended symbols. Responsive AVIF and WebP assets plus a JPEG fallback ship in `public/art/`. The phone AVIF and WebP are both 16 KB. The original prompt and provenance are stored beside the source.

## Verification

- `npm test`: 21 Playwright tests pass in Chromium, including every `@claim` entry, offline reload, IndexedDB persistence, import errors, license fixtures, the list view, Axe scans, console-error checks, and a 390×844 mobile path.
- `npm run build`: passes with Vite 6.4.3 and creates `dist/index.html`.
- Production bundle: 11.56 KB gzip JavaScript and 5.09 KB gzip CSS. The phone hero asset is 16 KB.
- `npm audit --audit-level=high`: zero vulnerabilities.
- Lighthouse 12.4 mobile, final production build, `/`: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- Lighthouse metrics: LCP 1.37 s, CLS 0, transferred bytes 36,290. Lighthouse did not emit lab INP because the run had no interaction; the browser interaction suite passed without timing failures.
- A second Lighthouse run on `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, CLS 0.
- The claims registry is `.factory/claims.json`. Every claim has one directly runnable grep command.
- The landing copy audit is `.factory/copy-audit.md`. No sentence exceeds 22 words and no banned term remains.

## Run and deploy

```sh
npm install
npm test
npm run build
```

Deploy the generated `dist/` directory. Its `index.html` is at the root, as required by the work order.

## Known gaps and next steps

- The factory must register `prerequisite-pathboard` with the Sociobot billing service and configure its production return URL before paid checkout can complete. The application already uses the contract URL and does not hardcode a billing product ID.
- There is intentionally no curriculum generation, mastery prediction, account, or cloud sync. Those are outside the researched v1 scope.
- Large maps use horizontal scrolling in graph view. The list view remains the complete linear alternative.
