# Independent product verification 3 — PASS

## Candidate and decision

- Product: Prerequisite Pathboard
- Work order: `prerequisite-pathboard-verify-3`
- Candidate commit: `1aae672a1eedc42c8ddc35768246a7a3fce7293e`
- Live URL: <https://prerequisite-pathboard.sociobot.in>
- Verified: 2026-08-29 UTC from the supplied clean checkout
- Result: **PASS — release candidate accepted**

Fresh evidence shows that the deployed static PWA matches the candidate and completes the brief's real job: a learner can build a goal-backward prerequisite map, mark knowledge states, receive one dependency-derived next step, keep the map locally, and export it.

## Mandatory gates

### Claims-first gate — PASS

`.factory/claims.json` exists. After `npm ci`, all 14 listed commands were run separately, in registry order. Every command passed. Each registered `@claim:<id>` tag occurs exactly once in the test suite. The later complete suite also passed.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `offline-reload` | PASS | `/demo` reloaded offline with Fraction arithmetic and the Offline indicator. |
| `local-only` | PASS | Real create/note/export traffic stayed on the product origin. |
| `demo-sandbox` | PASS | Demo edits disappeared and the real IndexedDB record remained unchanged. |
| `json-export` | PASS | Parsed sample export contained 14 concepts and 14 dependencies. |
| `markdown-export` | PASS | Download contained the goal, status, and dependency text. |
| `dependency-recommendation` | PASS | Repairing Fraction arithmetic advanced the recommendation to Approaching a value. |
| `rendered-edges` | PASS | Adding/removing a prerequisite kept rendered lines and exported dependencies aligned. |
| `refresh-persistence` | PASS | A goal and prerequisite survived reload and tab close/reopen. |
| `list-view` | PASS | The non-graph view showed all 14 sample concepts and grouped headings. |
| `import-error` | PASS | A cyclic import was rejected before persistence; a valid import then succeeded. |
| `multi-goal-map` | PASS | Two goals and 26 concepts were created/imported and exported intact. |
| `account-free` | PASS | A real goal was created without credential fields or sign-in. |
| `no-tracking` | PASS | Landing, demo, and real-board requests stayed same-origin; tracker/payment embeds were absent. |
| `repair-history` | PASS | A sixth repair was added and all six history entries remained visible. |

### Cold first-read gate — PASS

A fresh desktop page and a fresh 390×844 page answer the three required questions immediately:

- What it does: “Map backward. Learn the next prerequisite.”
- For whom: “For adults rebuilding technical knowledge who need one clear concept to work on next.”
- What to click first: **Try it with sample data**, followed by “Opens an isolated 14-concept calculus map.”

The action is visible on both sizes and opens `/?demo=1` in one click. The resulting workspace already contains the calculus map and shows the persistent “Demo — Sample data. Nothing is saved.” banner, **Reset demo**, and **Start for real**.

Evidence:

- `/work/.evidence/prerequisite-pathboard-verify-3/live-cold-desktop.png`
- `/work/.evidence/prerequisite-pathboard-verify-3/live-cold-mobile.png`
- `/work/.evidence/prerequisite-pathboard-verify-3/live-mobile-demo.png`

## Clean-checkout quality gates

```text
npm ci                         PASS; 24 packages added, 0 vulnerabilities
14 exact claims.json commands PASS; 14/14
npm test                       PASS; 41 Playwright tests, 0 failures
npm run build                  PASS; tsc --noEmit + Vite production build
npm audit --audit-level=high   PASS; 0 vulnerabilities
```

There is no separate lint script. Type checking is part of the exact production build. `dist/` was produced successfully.

Production assets are within budget:

```text
JavaScript  33.47 kB raw / 10.95 kB transferred
CSS         18.92 kB raw / 5.30 kB transferred
Mobile AVIF 12.57 kB
Fonts       0 kB; system fonts only
```

## End-to-end and adversarial exercise

- Keyboard-created **Explain integration by parts**, then added **Product rule** as a prerequisite. The recommendation first became Product rule.
- Marking Product rule **Can solve** advanced the recommendation to Explain integration by parts and added one visible repair-history entry.
- Empty required title submission stayed in the dialog and exposed the invalid input.
- A self-connection was refused with “That connection would create a loop.”
- A cyclic JSON import was refused; reload retained the prior valid map; importing the valid export immediately afterward succeeded.
- The real export parsed as two concepts, one dependency, and one repair.
- Real state survived reload and opening a new tab in the same browser context.
- A 91-character typed title stopped at the 90-character boundary. The resulting unbroken title remained visible without horizontal overflow at 390 px.
- Demo edit, reset, and **Start for real** restored the separate real map. A separate fresh demo context had no IndexedDB databases before or after editing, and reload restored the original sample.
- JSON/Markdown sample exports, two-goal/26-concept import/export, list view, malformed repair rejection, deletion/edge behavior, and recovery are also covered by the passing complete suite.

## Accessibility, responsive behavior, and motion

- Independent live Axe scans on `/`, `/demo`, `/board`, `/privacy`, `/terms`, `/404`, and a missing route found **zero violations** (therefore zero serious/critical findings).
- Every tested route has `lang="en"`, one `h1`, one `main`, and the expected route title.
- The supplied `verify-url.sh` passed: HTTP 200, 682 ms load, one H1, main present, no missing alt text, no unnamed buttons, and no console/page errors. Evidence: `/work/.evidence/prerequisite-pathboard-verify-3/verify-url/verify.json`.
- Keyboard navigation starts at the skip link. Its measured focus is a visible 3 px `#8fc9cc` outline. Enter/Space operate the goal, prerequisite, editor, status, and save controls. Dialog focus moves to the title and Escape closes the connection dialog.
- At 390 px there is no document overflow at normal or 200% root text size. All measured visible controls are at least 44×44 CSS px. The demo defaults to the complete list view.
- With `prefers-reduced-motion: reduce`, the media query matches and sampled animation/transition durations are reduced to `0.01 ms`.
- The intentional single dark theme, palette, type, spacing, motion policy, original art prompt, and provenance are documented in `.factory/design.md` and match the live product.

## Privacy, requests, headers, and links

- Playwright recorded the complete real create/edit/export, demo, and return-to-real flow. All requests used `https://prerequisite-pathboard.sociobot.in`; no user-entered content was sent off-origin.
- Fresh demo editing created no IndexedDB database. Real data used only the local `prerequisite-pathboard` database.
- No analytics, third-party scripts, CDN fonts, account flow, runtime AI call, payment embed, or product-unlock call is present.
- Browser response headers include HSTS, same-origin CSP with `frame-ancestors 'none'`, `nosniff`, `strict-origin-when-cross-origin`, and restrictive camera/microphone/geolocation permissions.
- Hashed JS/CSS and art use `Cache-Control: public, max-age=31536000, immutable`; the HTML, manifest, and service worker use a 30-second revalidation policy. AVIF is served as `image/avif`.
- All live internal routes and the external Param Factory footer link returned 200. `mailto:` links are explicit. A truly unknown route returned HTTP 404 with the styled not-found page; Chromium's expected failed-navigation 404 diagnostic was the only console line on that intentionally missing URL.
- Sign-in/Entra testing is not applicable because the product requires no sign-in. API allowance/rate-limit testing is not applicable because this static PWA has no server-side or product-unlock endpoint.

## PWA and offline behavior

- Chromium reported a valid manifest with no errors. It declares standalone display, product colors, `/board?v=2`, and decoded 192×192 and 512×512 maskable icons. The apple-touch icon is 180×180 and the social card is 1200×630.
- After an online `/demo` visit and service-worker readiness, offline reload retained the sample and displayed Offline.
- While still offline, navigation to previously unvisited `/privacy` loaded the correct route through the shell fallback.
- Live caches were `pathboard-v4-shell` and `pathboard-v4-runtime`; the shell, manifest, art, fallback, demo navigation, and hashed JS/CSS were present.
- Update simulation seeded `pathboard-v3-shell`; activation removed it, created `pathboard-v4-shell`, and showed “An update is ready. Reload to use it.”

## Deployment parity and performance

The checkout HEAD is the requested candidate. Local production output and live deployment were compared byte-for-byte: all 19 deployable files tested matched, including HTML, service worker, manifest, icons, art, fallback pages, social card, JS, CSS, and source map.

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `f0f9762794846b8488a10cf1547b97807754d8e9522850e754ca6711e6052b72` |
| `service-worker.js` | `9d2ca0c2423aca7ac4031190a6d1984a2871fe7774fb93328008de743fc7c3ee` |
| `assets/index-DQ3wDiKq.js` | `3227830a05b13f9d2d56e6897212a46036f8d667088fe0cf140c33de2ab0a3e0` |
| `assets/index-DJkPGc5X.css` | `def202c98250b28f92d6747e9f42544e7a083659c4e225a66fc201822fc0f263` |

Fresh Lighthouse 12.8.2 against the live `/demo` route:

- Performance 99
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 1.09 s; LCP 1.16 s; Speed Index 1.09 s; TBT 131.5 ms; CLS 0
- Total transferred weight 22,804 bytes
- A four-action repair flow's maximum observed Event Timing duration was 56 ms, below the 200 ms interaction budget.

Evidence: `/work/.evidence/prerequisite-pathboard-verify-3/lighthouse-live.json`.

## Claims/copy cross-check and scope

Landing, privacy, demo, and README claim-like statements map to the 14 registered claims. The copy audit contains no sentence over 22 words and no banned marketing term. The product avoids diagnosis, curriculum generation, hosted content, and mastery prediction. AI is not warranted for this manual dependency-reasoning job.

README, MIT license, privacy, terms, demo documentation, design thesis, robots, sitemap, 404, metadata, and deployment policy are present.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Release decision

**PASS.** Candidate `1aae672a1eedc42c8ddc35768246a7a3fce7293e` is accepted at the tested production URL. No unresolved release defect was found.
