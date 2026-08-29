# Polish round 3 handoff — Prerequisite Pathboard

## Outcome

All findings in adversarial reviews 1 and 3 are repaired. Review 2 had no
findings. Commit `addb17324af8cd88d16d886b9a61c4542e977950` is pushed to
`main` and deployed to <https://prerequisite-pathboard.sociobot.in>.

Deployment used the static work-order configuration and succeeded as Azure
Static Web Apps deployment `741a9aa3-3e13-4f55-9f8a-566494ba88e7`.

## What changed

- Removed the unprovable unlimited-capacity copy. The product now makes the
  bounded, tested promise that it creates and exports a map with two goals and
  26 concepts.
- Rewrote the landing labels to name their content and changed “moves” to
  “steps”. The first screen still states the job, audience, direct sample
  action, and three facts in the first viewport.
- Made the desktop home wordmark a 44 px high target, including on the static
  404 page.
- Kept and retested the isolated `?demo=1` sample, reset/start-for-real
  controls, offline PWA behavior, local-only data, real URLs, focus handling,
  metadata, privacy/terms links, mobile layout, and product-specific
  night-ascent visual system.

The detailed finding map is in `.factory/polish-3.md`.

## Exact verification evidence

### Clean clone

Non-hardlinked clean clone: `/tmp/pathboard-polish3-clean.Yjwrpw/repo`.

```text
npm ci                                      PASS (24 packages; 0 vulnerabilities)
all 14 exact claims.json commands           PASS, run separately
CI=1 npm test -- --workers=1                PASS (41 Playwright tests)
npm run build                               PASS; dist/index.html created
npm audit --audit-level=high                PASS (0 vulnerabilities)
```

The registered claim tags each occur exactly once and all pass: offline reload,
local-only, demo sandbox, JSON export, Markdown export, dependency
recommendation, rendered edges, refresh persistence, list view, import
recovery, multi-goal map, account-free, no tracking, and repair history.

Production build sizes:

```text
dist/assets/index-DQ3wDiKq.js   33.47 kB (10.85 kB gzip)
dist/assets/index-DJkPGc5X.css  18.92 kB (5.15 kB gzip)
```

### Live production recheck

- `/opt/fleet/lib/verify-url.sh` passed for the production root: HTTP 200,
  title, `lang=en`, one H1, main landmark, image alt text, no unnamed buttons,
  and no console/page errors. Evidence:
  `/work/.evidence/prerequisite-pathboard-polish-3/live-root/verify.json`.
- Live Playwright Axe scans have zero violations on `/`, `/?demo=1`, `/demo`,
  `/board`, `/privacy`, `/terms`, and an actual 404. This is the supported
  fallback for this container because `@axe-core/cli` could not locate a
  system Chrome binary; the Playwright Axe integration uses the preinstalled
  browser directly.
- The cold live recheck passed: all valid routes return 200; the missing route
  returns 404; every route has one main and H1; title/canonical/Open Graph/
  Twitter metadata match; Back and client navigation move focus to the H1.
  Evidence: `/work/.evidence/prerequisite-pathboard-polish-3/live-recheck-final.json`.
- The direct `?demo=1` path showed 14 sample concepts, the persistent banner,
  Reset demo, and Start for real. Its fresh context had no IndexedDB database;
  reset restored Fraction arithmetic; Start for real opened an empty real
  board. Offline reload showed Fraction arithmetic and Offline with
  `pathboard-v4-shell`.
- A landing → demo → real-board live flow made four requests, all to the
  product origin. Evidence:
  `/work/.evidence/prerequisite-pathboard-polish-3/live-privacy-requests.json`.
- Live root, demo, board, privacy, terms, and Param Factory links return 200.
  The CSP, HSTS, referrer, content-type, and permissions headers are recorded
  in `/work/.evidence/prerequisite-pathboard-polish-3/live-headers.txt`.
- Local and live SHA-256 values match for `index.html`, the service worker,
  current JS, and CSS. The live service worker reports `pathboard-v4-shell`.
- Lighthouse mobile result for the live demo: Performance 100, Accessibility
  100, Best Practices 100, SEO 100; FCP 0.2 s, LCP 0.2 s, TBT 0 ms, CLS 0.
  JSON: `/work/.evidence/prerequisite-pathboard-polish-3/lighthouse-live-mobile.json`.

Live screenshots:

- `/work/.evidence/prerequisite-pathboard-polish-3/live-home-desktop.png`
- `/work/.evidence/prerequisite-pathboard-polish-3/live-home-mobile.png`
- `/work/.evidence/prerequisite-pathboard-polish-3/live-demo-desktop.png`
- `/work/.evidence/prerequisite-pathboard-polish-3/live-demo-mobile.png`

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh prerequisite-pathboard dist
```

`dist/` is the deployment root and contains `index.html`.

## Known gaps and next steps

None. There are no unresolved product, accessibility, privacy, routing, demo,
or review findings.
