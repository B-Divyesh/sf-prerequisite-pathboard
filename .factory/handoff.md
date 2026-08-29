# Polish round 4 handoff — Prerequisite Pathboard

## Outcome

**PASS — all cumulative review findings are resolved and deployed.**

- Reviewed candidate: `2846858161bfdb426651af30493ed405d03b0ba8`
- Product repair commit: `b93313d fix: resolve polish round four findings`
- Production URL: <https://prerequisite-pathboard.sociobot.in>
- Deployment: Static Web Apps deployment `1ad8e94f-ecda-4ab7-ab87-9fb433f4d3f0`
- Evidence: `/work/.evidence/prerequisite-pathboard-polish-4/`

## What changed

- Fixed the 390 × 844 landing fold: the third required fact now ends at 811 px,
  and a mobile regression test enforces the complete first screen.
- Removed the untestable prescribed-course promise.
- Made the example map, recommendation inputs, and included features real H2
  headings; the heading list is now useful without the visual eyebrows.
- Standardized public relationship wording on **dependencies**.
- Kept the one-click `?demo=1` sandbox, banner, reset, start-for-real action,
  local-only behavior, real 404, metadata, privacy/legal links, and night-ascent
  visual identity. The release increments the PWA cache to `pathboard-v5`.
- Added a registry test that makes a missing or duplicated claim tag fail the
  suite. `.factory/claims.json` continues to list all 14 observable claims.

## Verification

Final clean clone: `/tmp/prerequisite-pathboard-polish4-final.uh7c8n` at
`5bad214339b12d8d04bcf8560d5aa653942661d6`.

```text
npm ci                                      PASS; 0 vulnerabilities
14 exact .factory/claims.json commands      PASS; each invoked independently
CI=1 npm test -- --workers=1                PASS; 46 tests
npm run build                               PASS; dist/index.html produced
npm audit --audit-level=high                PASS; 0 vulnerabilities
```

Build output remains within the static-PWA budget:

```text
JavaScript  33.36 kB raw / 10.81 kB gzip
CSS         18.93 kB raw / 5.15 kB gzip
```

Post-deploy checks:

- `/opt/fleet/lib/verify-url.sh` passed against the production root: 797 ms
  cold load, no console/page errors, title/lang/main/H1/alt/button checks pass.
- Live Playwright + Axe scanned the landing, query-string demo, `/demo`, board,
  privacy, terms, and a real missing route at desktop and 390 × 844 mobile:
  zero Axe violations. Route titles, canonical links, Open Graph/Twitter
  metadata, header/footer, focusable shell, and styled 404 all verified.
- Direct `?demo=1` starts with the sample, persistent banner, **Reset demo**,
  and **Start for real**. It made same-origin requests only, created no
  IndexedDB database, discarded a demo-only edit on reset, and reloaded offline
  with **Fraction arithmetic** and the **Offline** indicator.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0, 35 KiB transfer.
- Live headers retain same-origin CSP with `frame-ancestors 'none'`, HSTS,
  `nosniff`, strict referrer policy, immutable hashed asset caching, and AVIF
  image MIME types.

## Evidence files

- `verify-url/verify.json` and screenshots
- `live-route-a11y.json`, `live-home-mobile.png`, `live-home-desktop.png`, and
  `live-demo-mobile.png`
- `live-offline.json`
- `lighthouse-live-mobile.json`

## Known gaps / next steps

None. The product remains a local-first PWA with no account, backend, payment
flow, third-party scripts, or runtime AI dependency.
