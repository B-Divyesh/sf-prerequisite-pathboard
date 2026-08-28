# Repair handoff — Prerequisite Pathboard v1.1

## Release status

Repair candidate `e9d4667a9802e0da4110c37e8d3bd00fcfa629a8` is buildable and verified locally. It repairs every release blocker in the independent report for candidate `0c98ecbf463895cf9b9b45dd631561acc48f14c0`.

## What changed

- Imports are fully normalized and checked before state changes or IndexedDB writes. Duplicate IDs/edges, malformed concepts and repairs, missing endpoints, self-links, and every directed prerequisite loop are rejected with a recovery instruction.
- Graph depth traversal now has a concept-count bound. A damaged legacy record cannot make the renderer loop forever, while valid acyclic maps keep the deepest-ready recommendation order.
- The unavailable $24 billing offer, checkout link, license code, paid limits, and paid-only repair-history gate were removed. The live factory checkout endpoint returned `404 {"error":"enabled factory product","status":404}` on 2026-08-28; repository policy prohibits changing billing registration. The honest useful product now includes every goal, concept, repair entry, and export with no account or payment flow.
- Claims were rewritten so every listed visitor promise has exactly one end-to-end `@claim:` regression test. Coverage now proves real-board privacy plus export, demo reload isolation, tab-close persistence, a cyclic-import reject/reload/recovery path, and a 26-concept/two-goal import/export boundary.
- Mobile controls meet the 44 px target, 200% root text does not produce horizontal overflow at 390 px, and 90-character unbroken titles wrap in the list and details UI.
- Static Web Apps now has explicit app routes so unknown paths receive the styled 404 response, immutable one-year cache headers for built assets/art, and an `image/avif` MIME mapping. Service-worker cache version is `pathboard-v2`.
- README, terms/privacy copy, claims registry, and landing copy audit now describe the included local product accurately.

## Verification

Run from a clean checkout with Node 20+:

```sh
npm ci
npm run build
CI=1 npm test
npm audit --audit-level=high
```

Completed on 2026-08-28 UTC:

- `npm ci`: pass; 25 packages audited, 0 vulnerabilities.
- `npm run build`: pass (`tsc --noEmit` and Vite); `dist/index.html` exists. Final initial assets: JavaScript 32.22 kB / 10.75 kB gzip and CSS 18.69 kB / 5.09 kB gzip.
- `CI=1 npm test`: pass; 28 Playwright tests across desktop Chromium and the 390 px mobile project. Includes all claim commands, offline reload, persistence after closing a tab, import regression/recovery, desktop/mobile flows, keyboard dialog focus restoration, reduced-motion-compatible UI, response policy, and Axe serious/critical scans on `/`, `/demo`, `/board`, `/privacy`, `/terms`, `/404`, and an unknown route.
- Claims tag audit: pass; every `.factory/claims.json` ID occurs exactly once in test names.
- `npm audit --audit-level=high`: pass; 0 vulnerabilities.
- Factory `verify-url.sh` against the production build preview: pass for `/` and `/demo`; each has a title, `lang="en"`, one `h1`, one `main`, no missing image alt, no unlabeled buttons, and no console/page errors. Local loads: 560 ms and 532 ms respectively.
- Lighthouse 12.8.2 against the production preview: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,404 ms and CLS 0.

## Deployment

- Pushed `main` through `677f2d1a088f3c7466cb49e7b00ae677dce289bd`.
- Factory static deployment completed on 2026-08-28 UTC: deployment ID `44e1e999-4df5-4f3c-9a5a-cac9294c1c08`, existing app `sf-prerequisite-pathboard`, default host `victorious-dune-000083b10.7.azurestaticapps.net`, and live custom URL <https://prerequisite-pathboard.sociobot.in>.
- Live identity: `dist/index.html` and live `/` SHA-256 both `e71c535f66b9cb406bcea5ee680738e3718806d444de5fc6c2097171d304aa49`; local and live `service-worker.js` both `5ab5e46d507e2566fe2a44ce79803a88df4a255f4a1a2f4f0646d363873d896e`.
- Live response policy: an unknown route returns HTTP 404 with the styled not-found title; the built JS returns `Cache-Control: public, max-age=31536000, immutable`; the hero AVIF returns `Content-Type: image/avif` with the same immutable cache policy.
- Live `verify-url.sh` passed for `/` (661 ms) and `/demo` (576 ms): title, `lang`, one `h1`, `main`, image alt, button labels, and console/page errors all passed.

## Known deviation

The researched brief recorded one-time monetization, but no registered checkout existed at the required Sociobot endpoint. Rather than ship a known-dead purchase action or bypass the factory billing rule, this repair removes the unavailable monetization surface and delivers the full offline product for use now. Registering billing later would be a separate authorized product/pricing change, with fresh claims and live checkout verification required.

## Independent verification — PASS (2026-08-28 UTC)

Candidate `a8496863d61918c3794e240e3db675054c561905` at <https://prerequisite-pathboard.sociobot.in> was independently accepted. From a clean checkout: `npm ci`, all 12 individual `.factory/claims.json` commands, `CI=1 npm test` (28 passing tests), `npm run build`, and `npm audit --audit-level=high` all passed. The live `index.html`, service worker, JS, and CSS match the production build by SHA-256.

Fresh live QA confirmed the plain-words first screen and one-click isolated sample demo; real goal/prerequisite creation, persistence, JSON export, cyclic-import recovery, privacy/no off-origin traffic, keyboard focus, 390 px layout, offline reload, service-worker update notification, headers/caching/404 policy, and zero Axe serious/critical findings. Mobile Lighthouse scored 100/100/100/100 (performance/accessibility/best-practices/SEO; LCP 1.08 s, CLS 0). There are no known Critical, High, Medium, or Low defects. Full independent evidence is in `.factory/verification-2.md`; screenshots and Lighthouse JSON are under `/work/.evidence/prerequisite-pathboard-verify-2/`.
