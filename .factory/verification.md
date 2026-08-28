# Independent product verification — FAIL

## Candidate

- Product: Prerequisite Pathboard
- Work order: `prerequisite-pathboard-verify-1`
- Candidate commit: `0c98ecbf463895cf9b9b45dd631561acc48f14c0`
- Live URL: <https://prerequisite-pathboard.sociobot.in>
- Verified: 2026-08-28 UTC
- Result: **FAIL — do not release**

The free product's normal path works and the deployment matches the candidate, but the paid checkout is dead, imported cycles can persistently hang the board, and import bypasses the advertised free limits. The claims evidence also does not prove several promises it is registered against.

## Mandatory first gates

### First-read test — PASS

Cold desktop and 390 px mobile visits answer all three required questions in the first screen:

- What it does: “Map backward. Learn the next prerequisite.”
- For whom: “For adults rebuilding technical knowledge who need one clear concept to work on next.”
- What to click: “Try it with sample data,” followed by “Opens an isolated 14-concept calculus map.”

The action is visible without setup and opens `/demo` in one click. The resulting screen contains a realistic 14-concept calculus map and the persistent “Demo — Sample data. Nothing is saved” banner with **Reset demo** and **Start for real**.

Evidence: `/work/.evidence/prerequisite-pathboard/first-read-desktop.png` and `/work/.evidence/prerequisite-pathboard/live-mobile-first.png`.

### Claims test gate — test commands PASS, claims contract FAIL

`.factory/claims.json` exists. Every listed command was run from the clean candidate after `npm ci`; the consolidated `npm test` run also executed the whole set. Playwright recorded `status: passed` and no failed test IDs. There is exactly one `@claim:<id>` tag for each registry entry.

| Claim | Declared test result | Observable evidence |
| --- | --- | --- |
| `offline-reload` | PASS | `/demo` reloads offline with Fraction arithmetic selected and Offline shown. |
| `local-only` | PASS | Declared request interception found no external request. Independent real-board flow also used only the product origin. |
| `demo-sandbox` | PASS | Edited demo data was absent after leaving. Independent reload restored the original sample. |
| `json-export` | PASS | Parsed download contained 14 concepts and 14 edges. |
| `markdown-export` | PASS | Download contained the goal, status, and dependency text. |
| `dependency-recommendation` | PASS | Repairing Fraction arithmetic changed the recommendation to Approaching a value. |
| `refresh-persistence` | PASS | Declared reload assertion passed. Independent tab-close/reopen also retained the goal. |
| `list-view` | PASS | All 14 sample concepts and Direct prerequisites appeared. |
| `import-error` | PASS | Invalid structure produced a recovery instruction; a following valid import succeeded. |
| `free-limit` | PASS as written; **claim false** | The test checks only refusal of a second UI-created goal. An import accepted 26 concepts and two goals. |
| `paid-license` | PASS as fixture | Test writes a cached verdict directly and adds only two goals; it does not verify a license or exceed the 25-concept boundary. |
| `one-time-price` | PASS as markup | Test checks `$24`, “one time,” and the URL string. The URL itself returns 404. |
| `license-restore` | PASS as fixture | Recorded valid response enabled paid access. A live invalid response correctly cleared the token. |
| `account-free` | PASS | A goal was created without credential fields. |
| `paid-history` | PASS as fixture | Six repair entries were visible with a cached fixture verdict. |

The claims contract still fails because tests must prove the full observable promise, not just related markup or a narrower case. Specific deficiencies:

- `free-limit` never tests the 25/26 concept boundary or import; independent QA disproved the claim.
- `one-time-price` never follows the purchase link; the advertised checkout is unregistered and returns 404.
- `paid-license` does not run recorded verification and does not cross the free concept boundary before asserting “unlimited.”
- `refresh-persistence` does not test tab close, and `local-only` covers demo edits rather than a real private note. Independent QA found those behaviors work, but the declared tests do not prove their full claims.
- Visitor-facing statements including “no ads or analytics,” demo edits disappearing on reload, exported files never being sent, and no payment-provider code being embedded are not separately listed and tested in the registry.

## Release-blocking defects

### Critical — advertised paid checkout returns 404

`GET https://api.sociobot.in/api/v1/products/prerequisite-pathboard/checkout` returns:

```text
HTTP/2 404
{"error":"enabled factory product","status":404}
```

The landing page, board, README, and terms advertise a $24 one-time purchase, but a visitor cannot buy it. The link crawler found this as the only dead link. The `one-time-price` test checks only the `href`, so it misses the broken transaction.

Expected: the Sociobot endpoint redirects to hosted checkout for the registered production product.

### High — a cyclic import persists and hangs the board

Reproduction:

1. On `/board`, import a version-1 JSON file containing goal `g`, concept `p`, and edges `p → g` and `g → p`.
2. Import validation accepts it and persists it.
3. Rendering never completes. The isolated browser probe had to be terminated after 12 seconds (`exit 124`); the page was no longer responsive.

`validateBoard` checks endpoint existence but not cycles. `persist` writes the accepted state before `depthFromGoal` repeatedly increases depths around the cycle. Because the bad state is in IndexedDB, reopening `/board` re-enters the hang until site storage is cleared.

Expected: reject cycles before writing anything and announce a recovery step.

### High — import bypasses free limits and makes the pricing claim false

Fresh unlicensed context, `/board`:

- A 25-concept/one-goal import was accepted and correctly blocked adding a 26th concept.
- A 26-concept/two-goal import was also accepted with “Pathboard imported.”
- The free banner then showed `2/1 goal · 26/25 concepts`, and the goal selector contained two goals.

Expected: an unlicensed import must reject or safely trim a board beyond one goal/25 concepts, without data loss. Current behavior bypasses both paid limits.

### High — the claims registry is incomplete and several tests under-assert promises

The claim-test limitations listed above violate the attached claims acceptance contract. This independently blocks release even though all commands return zero.

## Other defects

### Medium — mobile accessibility does not meet target-size or 200% text requirements

At 390×844, measured interactive targets below 44 CSS px include the 20–23 px-high header links, the 36 px demo reset button, the 22 px **Start for real** link, 43 px board/list/add/connect controls, and 21 px footer links.

With root text enlarged to 200%, the 390 px page becomes 461 px wide and clips the headline and supporting copy at the right edge. Evidence: `/work/.evidence/prerequisite-pathboard/mobile-text-200.png`.

### Medium — maximum-length titles break the mobile board

A valid 90-character unbroken title creates a 2,140.5 px-wide concept node inside the 390 px list view. Recommendation, selector, node, and detail text are visibly clipped. Evidence: `/work/.evidence/prerequisite-pathboard/mobile-90-char-title.png`.

Expected: wrap long tokens with `overflow-wrap`/`min-width: 0` and preserve the viewport.

### Medium — missing routes return HTTP 200

Both `/definitely-not-a-real-route-qa` and `/404` return HTTP 200. Client-side content changes to the styled not-found page, but the response status is not 404. This conflicts with the required real 404 response and misleads crawlers/caches.

### Medium — production cache and AVIF response policies miss the contract

- Hashed JS/CSS and images all return `Cache-Control: public, must-revalidate, max-age=30`; hashed assets are not long-lived/immutable.
- `.avif` files return `Content-Type: application/octet-stream` rather than `image/avif`.

The AVIF still decoded in Chromium, but the response metadata is incorrect. Brotli compression is enabled for JS and CSS.

## Functional and boundary coverage

| Area | Result | Evidence |
| --- | --- | --- |
| Create a real goal and prerequisite | PASS | Keyboard-only flow created Understand eigenvectors and Matrix multiplication. |
| Status and next recommendation | PASS | Can solve prerequisite made the goal the ready next concept; sample repair advanced as documented. |
| Refresh and tab-close persistence | PASS | IndexedDB state survived reload and a closed/reopened tab in the same browser context. |
| Demo isolation/reset | PASS | Demo edits disappeared after exit and reload; real IndexedDB was not read in demo tests. |
| JSON/Markdown export | PASS | Downloads parsed and contained the documented sample graph evidence. |
| Invalid structure and recovery | PASS | Invalid object was rejected; a valid import immediately afterward succeeded. |
| Duplicate/cycle UI connection recovery | PASS | UI reported the duplicate and loop, then accepted a valid pair. |
| Semantically cyclic imported JSON | **FAIL** | Persistent hang described above. |
| Free 25-concept UI boundary | PASS | 25 imported; add action refused at the boundary. |
| Free limit through import | **FAIL** | 26 concepts and two goals imported. |
| Paid purchase | **FAIL** | Checkout GET returns 404. |
| Invalid live license | PASS | Verification returned invalid; UI retained the dialog, explained recovery, and removed local token. |

## Accessibility, responsive behavior, and motion

- Live Axe scans on `/`, `/demo`, `/board`, `/privacy`, `/terms`, `/404`, and an unknown route found zero serious/critical violations.
- Each tested page has one `h1`, one `main`, route-specific title, `lang="en"`, and no console/page errors in normal flows.
- Worker `verify-url.sh`: HTTP 200, load 911 ms, one `h1`, `main` present, zero missing alt attributes, zero unlabeled buttons, zero console/page errors.
- Keyboard navigation reaches the skip link and all core controls. Focus is a visible 3 px cyan outline. Native dialogs focus the title field, trap focus, close with Escape, and restore the opener. SPA navigation and Back move focus to the new `h1`.
- Reduced motion is detected; transforms are removed and durations become `0.01 ms`.
- Normal layouts have no horizontal document overflow at desktop or 390 px. Mobile defaults to the complete list view.
- The failures for touch size, 200% text, and long titles remain as listed above.
- The intentional dark-only treatment is documented in `.factory/design.md`; contrast checks in Axe pass.

## Privacy, security, and external traffic

- A fresh real-board create/edit/export flow issued three requests, all to `https://prerequisite-pathboard.sociobot.in`; the private QA note was not transmitted.
- Landing and demo loads use only same-origin assets. There are no CDN fonts, third-party scripts, analytics calls, embedded Azure/OpenAI credentials, or sign-in flow.
- License verification is the only runtime API call and goes to `api.sociobot.in` after explicit user action.
- Live responses include HSTS, CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and restrictive camera/microphone/geolocation policy. Normal loads have no CSP errors.
- Sign-in/Entra verification: not applicable; the product has no account or sign-in.
- Backend concurrency/health identity: not applicable; this is a static PWA. Candidate/deployment identity was established with byte hashes below.

### Billing API rate limiting — PASS

A burst of 40 rapid invalid-license verification requests produced 30 HTTP 200 responses followed by 10 HTTP 429 responses. The first observed 429 was request 31 and included `Retry-After: 4`.

## PWA/offline verification

- Chrome reports a valid manifest with no errors, 192/512 icons, maskable purpose, standalone display, and `/board?v=1` start URL.
- After one online `/demo` visit and service-worker readiness, an offline reload retained the sample and showed Offline.
- An offline navigation to previously unvisited `/privacy` loaded the correct route through the shell fallback.
- Cache keys were `pathboard-v1-shell` and `pathboard-v1-runtime`; shell, hashed JS/CSS, sample route, manifest, art, and fallback were present.
- Update simulation seeded `pathboard-v0-shell`, then registered v1. The old cache was removed and the UI displayed “An update is ready. Reload to use it.”
- No console/page errors occurred in these checks.

## Build, parity, and performance

### Clean candidate gates

```text
npm ci                         PASS; 24 packages, 0 vulnerabilities
npm test                       PASS; 21 Playwright tests, 0 failed
npm run build                  PASS; tsc --noEmit + Vite production build
npm audit --audit-level=high   PASS; 0 vulnerabilities
```

There is no lint script in `package.json`. There is no separate unit-test command; the available suite is Playwright integration/claim coverage.

Build output:

```text
dist/index.html                  1.76 kB (0.62 kB gzip)
dist/assets/index-Wf7da0ut.js  35.13 kB (11.56 kB gzip)
dist/assets/index-BahKO3Xh.css 18.58 kB (5.09 kB gzip)
```

The initial JS, CSS, font (none), and hero-image budgets pass.

### Live candidate identity — PASS

Local production and live SHA-256 hashes match:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `a1730a0a184685ba2c91422e1abfbb9424be0ef23fe12555bea2f41f8baa148f` |
| `service-worker.js` | `cc5db68d4a6062052a8be52f39cc08cdcb716e8e36239e8732da2a0e798878c5` |
| `manifest.webmanifest` | `fc129208aaf046a71126c78d72f052d160634242a86f9f87ee20344dddac101b` |
| built JS | `1bd14bfdc5a8a84e4bcb3391d86aeb14cd7f64054ee974f0e3377139f5837317` |
| built CSS | `f4cd55f9d22afe8239f3a4f4672cc51c09a7718cdd22c39bd282efffd083fc2f` |

### Live mobile Lighthouse — PASS

- Performance 98
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 0.91 s; LCP 1.09 s; Speed Index 0.91 s; TBT 155 ms; CLS 0
- Total transferred weight 36,221 bytes
- A four-action recommendation flow produced a maximum Event Timing interaction duration of 112 ms, below the 200 ms interaction budget.

Evidence JSON: `/work/.evidence/prerequisite-pathboard/lighthouse-live-2.json`.

## Visual/product assessment

The night-ascent identity is product-specific and matches `.factory/design.md`: dark teal terrain, amber trail markers, Georgia/system typography, asymmetric landscape layout, and route-lighting motion. The original art provenance and source prompt are recorded. The interface does not look like a generic framework template. The manual workflow correctly avoids automatic curriculum or mastery claims; an AI addition is not warranted by this brief.

## Release decision

**FAIL.** Do not release candidate `0c98ecbf463895cf9b9b45dd631561acc48f14c0` until all Critical and High findings are fixed, the corresponding claims are strengthened, and the full matrix is rerun. The accessibility and HTTP-policy Medium findings should also be resolved before claiming the factory definition of done.
