# Polish handoff — Prerequisite Pathboard

## Outcome

Polish round 1 repaired every finding in `.factory/review-1.md` and all
unresolved earlier verification findings. The product remains a static,
offline-capable Vite PWA with its night-ascent visual system.

- Repair commit: `84dbea9551ef678c548b1c9639a1c72f5bcd32ab`
- Branch: `main`; pushed to `origin`
- Deployment: `/opt/fleet/lib/deploy-static.sh prerequisite-pathboard dist`
- Live URL: <https://prerequisite-pathboard.sociobot.in>
- Demo URL: <https://prerequisite-pathboard.sociobot.in/?demo=1>

## What changed

- Added the direct, isolated `?demo=1` entry point. It shows the sample-map
  banner, Reset demo, and Start for real controls; demo edits never change the
  real IndexedDB record.
- Completed the claims registry with rendered-edge and no-tracking coverage,
  and strengthened demo isolation to inspect the real stored record.
- Reworked mobile targets and preview layout, corrected the desktop first
  screen, removed the nested landmark, and added desktop/mobile Axe coverage.
- Made Open Graph/Twitter metadata route-aware; synchronized the static 404
  shell, its metadata, navigation/footer, and sitemap behavior.
- Rewrote map terminology and README user-facing storage/offline language;
  refreshed the copy audit and catalog description.

## Verification

Clean-clone evidence used `/tmp/pathboard-clean.foc6rK`:

```text
git clone --no-hardlinks /work/repo /tmp/pathboard-clean.foc6rK  PASS
npm ci                                                        PASS (0 vulnerabilities)
14 exact claims.json commands, each run separately           PASS (14/14)
CI=1 npm test -- --workers=1                                 PASS (39/39)
npm run build                                                 PASS
npm audit --audit-level=high                                 PASS (0 vulnerabilities)
```

The production build emits 33.47 kB JavaScript (10.89 kB gzip) and 18.91 kB
CSS (5.14 kB gzip). `dist/index.html` is at the output root.

Live verification after deployment:

```text
verify-url.sh https://prerequisite-pathboard.sociobot.in     PASS
live mobile Axe: /, ?demo=1, /demo, /board, /privacy, /terms PASS (0 violations)
live unknown route                                            PASS (HTTP 404)
live mobile Lighthouse                                       100 / 100 / 100 / 100
```

Lighthouse details: FCP 1.0 s, LCP 1.1 s, TBT 70 ms, CLS 0.
Evidence is in `/work/.evidence/prerequisite-pathboard-polish-1/`, including
`verify.json`, `live-review.json`, `live-home-desktop.png`,
`live-home-mobile.png`, `live-demo-mobile.png`, and
`lighthouse-live-mobile.json`.

## How to run

```sh
npm ci
npm test
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/?demo=1` to exercise the isolated sample map.
There are no known gaps.
