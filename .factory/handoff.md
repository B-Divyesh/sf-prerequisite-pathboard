# Review 3 handoff — Prerequisite Pathboard

## Outcome

Adversarial review 3 is **FAIL**. No product code was modified. The complete
report is in `.factory/review-3.md`.

## Verification performed

- Fresh live Chromium checks at 390 × 844 and 1440 × 900.
- One-click demo entry, initial 14-concept sample, reset, reload isolation,
  real IndexedDB preservation, and same-origin request logging.
- Clean clone at `/tmp/pathboard-review3.uLwvXy`; `npm ci`, every one of the
  14 exact `claims.json` commands, `CI=1 npm test -- --workers=1` (39 passed),
  and `npm run build` (created `dist/`).
- Live route, link, metadata, Back/focus, 404, history, privacy, and visual
  identity checks.

## Remaining work

1. Remove or bound the untestable “without limits” and “every goal” claims;
   align `.factory/claims.json` and its test with the exact observable promise.
2. Rename four vague landing labels to content-naming headings.
3. Make the desktop home wordmark at least 44 px high and add a desktop target
   assertion.

## Evidence

- `/tmp/pathboard-review3-evidence/first-mobile.png`
- `/tmp/pathboard-review3-evidence/first-desktop.png`
- `/tmp/pathboard-review3-evidence/demo-first-mobile.png`
- `/tmp/pathboard-review3-evidence/cold.json`
- `/tmp/pathboard-review3-evidence/live-flow.json`

## How to verify again

```sh
npm ci
npm test
npm run build
```

Open `http://127.0.0.1:4173/?demo=1` for the isolated sample map.
