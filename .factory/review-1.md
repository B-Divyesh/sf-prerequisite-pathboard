# Adversarial first-read review 1 — Prerequisite Pathboard

- Work order: `prerequisite-pathboard-review-1`
- Candidate: `0140dbee4e5d6247138d269493733bfe1ecc0def`
- Live URL: <https://prerequisite-pathboard.sociobot.in>
- Reviewed: 2026-08-28 UTC
- Viewports: 390 × 844 mobile and 1440 × 900 desktop, each in a fresh Chromium context
- Verdict: **FAIL**

The first read and demo are clear, and all 12 registered claim commands pass. The product still has eight findings. Three are blocking: an earlier claims-coverage defect remains, the earlier mobile target-size defect is only partly fixed, and the mobile landing page has a serious keyboard-access violation.

## Findings

### F-1-1 — BLOCKING — The claims registry still omits visitor promises

**Exact quotes and locations**

- Landing, “See the structure”: “Every line comes from a dependency you enter.”
- Landing and README: “The board does not generate a curriculum or predict mastery.” / “This product does not generate a curriculum or diagnose mastery.”
- README, “What ships”: “Local storage in IndexedDB.”
- README, “Data and privacy”: “Demo state stays in page memory.”
- README, “Data and privacy”: “There is no account system, analytics, or payment-provider code.”
- Live `/privacy`: “Prerequisite Pathboard has no account system, ads, or analytics.”
- README, “Test”: “Each promise in the interface and this README has a sandbox test in `.factory/claims.json`.”

**Why this fails**

These are observable product, storage, privacy, or implementation promises, but `.factory/claims.json` has no entries that state and test them. The current `dependency-recommendation` test verifies the recommendation, not that every rendered line corresponds to an entered edge. `local-only` verifies no off-origin request during one real-board flow, not the claimed IndexedDB mechanism, in-memory demo implementation, absence of analytics, or absence of payment-provider code. The README's meta-claim that every promise has a sandbox test is therefore false.

This reopens the earlier verification finding “claims registry is incomplete.” That report specifically named the analytics, demo-reload, exported-file, and payment-provider statements. The repair broadened several tests but did not cover or remove every quoted promise.

**Concrete fix**

- Add a `rendered-edges` claim and test that compares all displayed graph paths with the stored edges after adding and removing a dependency.
- Either add a `manual-input-only` claim/test or replace the curriculum/diagnosis copy with the already registered sentence: “The recommendation uses only the dependencies and statuses you enter.”
- Either test the named IndexedDB database and prove demo actions do not change IndexedDB, localStorage, or sessionStorage, or replace the implementation claims with the registered device-local and demo-isolation wording.
- Add a `no-tracking` claim that asserts the complete landing, demo, and real-board flow makes only expected static GET requests and no beacon/analytics calls. Add a static source assertion for payment-provider code, or remove that phrase.
- Only then retain the README sentence claiming complete promise coverage.

### F-1-2 — BLOCKING — The earlier 44 px mobile target finding is only partly fixed

**Exact location and measurement**

At 390 × 844 on every app route:

- Header home link “Pathboard”: **41 × 32 px**.
- Header “Demo” link: **39 × 44 px**.

`src/style.css` gives navigation links a 44 px minimum height, but the mobile `.wordmark` has no 44 px minimum and the links have no 44 px minimum width. `tests/mobile.spec.ts` checks only the heights of Demo, My board, and Privacy. It does not inspect width or the home link, despite naming the test “44px controls.”

**Why this fails**

The attached accessibility contract requires touch targets of at least 44 px. The home target is undersized in both dimensions, and Demo is undersized in width. A phone user can miss these compact header targets. This is the same target-size defect recorded in `.factory/verification.md`, so the incomplete repair is blocking under the history rule.

**Concrete fix**

Set both `min-width: 44px` and `min-height: 44px` for the mobile wordmark and compact navigation links while retaining spacing between adjacent targets. Replace the named-link height loop with a test that measures both dimensions of every visible non-inline interactive target at 390 px, including the home link.

### F-1-3 — BLOCKING — The mobile landing preview cannot be scrolled by keyboard

**Exact location**

Live `/` at 390 × 844, `.mini-board`:

> `<div class="mini-board" aria-label="Example prerequisite path">`

Live Axe 4.10 reports `scrollable-region-focusable`, impact **serious**: “Element should have focusable content” or “Element should be focusable.” The region uses `overflow-x: auto` and has neither a focusable child nor `tabindex="0"`.

**Why this fails**

The four-node prerequisite example overflows horizontally on a phone. A keyboard user cannot focus and scroll it, so some of the landing explanation is unreachable. The shipped Axe test runs `/` only at the desktop project viewport and misses this mobile-only failure.

**Concrete fix**

Prefer a vertical or wrapping preview at the mobile breakpoint so all four nodes are visible without horizontal scrolling. If horizontal scrolling remains, make the region keyboard-focusable, give it a visible focus style and a useful accessible label, and verify arrow-key scrolling. Run Axe on `/` in the 390 px project and fail on all serious/critical results.

### F-1-4 — Major — The three required facts are below the desktop first screen

**Exact location**

At 1440 × 900, `.plain-facts` starts at y = 892 and ends at y = 974. None of these three text lines is visible before scrolling:

- “Works offline after the first visit.”
- “Your map stays on this device.”
- “Every goal, concept, and export is included.”

**Why this fails**

The plain-words first-screen contract requires the action and three short privacy/offline/price facts in the first screen. The oversized desktop headline and vertical spacing leave only an 8 px sliver of the facts container above the fold.

**Concrete fix**

Reduce the desktop headline size or vertical padding enough that the bottom of the third fact is within a 900 px viewport. Add a 1440 × 900 assertion that all three fact list items are fully inside the viewport.

### F-1-5 — Minor — The demo details panel creates a nested landmark violation

**Exact location**

Live `/demo`, `.selected-panel`:

> `<aside class="selected-panel">`

It sits inside the labelled `.path-area` section. Axe reports `landmark-complementary-is-top-level`, impact **moderate**: “Aside should not be contained in another landmark.”

**Why this fails**

Nested region/complementary landmarks make the screen-reader landmark list less predictable on the product's main try-out screen.

**Concrete fix**

Move the complementary panel outside the labelled region, or change the wrapper/panel to non-landmark elements while preserving an explicit heading. Extend the live/local Axe gate to include moderate landmark failures.

### F-1-6 — Minor — The deployed 404 does not use the site's current structure or metadata

**Exact location**

Live `/404` and unknown routes serve `public/404.html`, which has:

- footer text “Version 1.0” while every app route says “Version 1.1”;
- no skip link;
- no “My board” header link;
- no canonical, Open Graph, Twitter, favicon, or apple-touch metadata;
- HTTP 200 at the explicitly listed `/404` sitemap URL, although an unknown path correctly returns HTTP 404.

**Why this fails**

The 404 looks related but is not the consistent header/footer required on every route, announces stale release information, and lacks the site's standard metadata. Listing `/404` in `sitemap.xml` as a successful URL also presents an error document as indexable content.

**Concrete fix**

Generate the 404 from the shared shell or keep the static file synchronized: add the skip link, the full current navigation/footer, version 1.1, favicon and required metadata. Remove `/404` from the sitemap and test the designed page through an actually missing URL that returns 404.

### F-1-7 — Minor — Route social metadata keeps describing the landing page

**Exact location**

On `/demo`, `/board`, `/privacy`, and `/terms`, the title, description, and canonical update correctly. Open Graph and Twitter metadata remain:

> “Prerequisite Pathboard — Map what to learn next”

> “Map prerequisites backward and choose the next concept to repair.”

For example, `/privacy` therefore shares a landing-page title and description instead of privacy-page metadata.

**Why this fails**

Copied or shared deep links describe the wrong route. The site-structure metadata is only partly route-aware.

**Concrete fix**

Add route-specific Open Graph and Twitter title/description values to `routeInfo` and update them with the document title, description, and canonical during navigation. Assert them for every route.

### F-1-8 — Minor — Public copy changes names and exposes two unexplained technical terms

**Exact quotes and locations**

- Landing: “A route you wrote,” “The whole pathboard is included,” “Start your board,” and “Your map remains local.”
- README “What ships”: “Local storage in IndexedDB.” and “Offline reload after the first visit through a service worker.”

**Why this fails**

The same user-created artifact is called a route, pathboard, board, and map. “The whole pathboard is included” also makes no sense without a price or plan to be included in. IndexedDB and service worker are implementation terms in the user-facing feature list. No sentence exceeds 22 words and the action buttons use verbs, but these terminology and jargon issues violate the one-word-per-concept rule.

**Concrete fix**

Use **map** for the saved artifact and reserve **route** only for one goal-to-prerequisite chain. Rewrite the heading as “Use the full map without limits” and the action as “Start your map.” In “What ships,” use “The map stays in this browser” and “After one online visit, reopen the map without a connection.” Keep IndexedDB and service-worker details only in Develop/Deploy.

## 1. Cold first read

### Before scrolling, in my own words

| Question | Mobile, 390 × 844 | Desktop, 1440 × 900 |
| --- | --- | --- |
| What does this do? | It maps a technical goal backward through prerequisites and chooses the next ready concept. | Same. |
| For whom? | Adults rebuilding technical knowledge. | Same. |
| What should I click first? | **Try it with sample data.** | **Try it with sample data.** |

The required first-read questions pass. The exact text doing the work is “Map backward. Learn the next prerequisite,” “For adults rebuilding technical knowledge who need one clear concept to work on next,” and “Try it with sample data,” followed by “Opens an isolated 14-concept calculus map.” The desktop facts placement still fails separately as F-1-4.

No console or page errors occurred on either cold load. Screenshots were captured before scrolling at `/tmp/pathboard-review.lBKR9G/evidence/first-mobile.png` and `first-desktop.png`.

## 2. Copy audit

Counts use lexical words; a URL, code token, or version is one word. The tables include headings, controls, labels, status fragments, image alt text, and footer copy so out-of-context headings and actions are not skipped. Repeated header/footer labels are shown at their distinct locations. No copy unit exceeds 22 words. No banned marketing adjective appears. Buttons pass the result-naming verb check. Flags point to F-1-8 unless noted.

### Landing page

| Location / exact copy | Words | Result |
| --- | ---: | --- |
| Header: “Pathboard” | 1 | F-1-8: use the product name or consistent artifact term |
| Header: “Demo” | 1 | Pass, navigation label |
| Header: “My board” | 2 | F-1-8: artifact term |
| Header: “Privacy” | 1 | Pass |
| Header status: “Online” | 1 | Pass |
| Eyebrow: “A map for relearning” | 4 | Pass |
| H1 sentence: “Map backward.” | 2 | Pass |
| H1 sentence: “Learn the next prerequisite.” | 4 | Pass |
| “For adults rebuilding technical knowledge who need one clear concept to work on next.” | 14 | Pass |
| Action: “Try it with sample data” | 5 | Pass: result-naming verb |
| “Opens an isolated 14-concept calculus map.” | 6 | Pass |
| “Works offline after the first visit.” | 6 | Pass; placement F-1-4 |
| “Your map stays on this device.” | 6 | Pass; placement F-1-4 |
| “Every goal, concept, and export is included.” | 7 | Pass; placement F-1-4 |
| Image alt: “A chain of warm trail lights climbs toward an observatory on a dark mountain ridge.” | 15 | Pass |
| Art label: “Next session” | 2 | Pass |
| Art value: “Fraction arithmetic” | 2 | Pass |
| “Nothing below it is still marked ‘Not yet.’” | 8 | Pass |
| Eyebrow: “See the structure” | 3 | Pass |
| H2: “A route you wrote, not a prescribed course” | 8 | F-1-8: inconsistent artifact term |
| “Every line comes from a dependency you enter.” | 8 | F-1-1: unlisted claim |
| “Statuses help the board find the first unresolved step.” | 9 | Pass under `dependency-recommendation` |
| Preview label: “Example prerequisite path” | 3 | Pass |
| “Fraction arithmetic — Not yet” | 4 | Pass |
| “Algebraic simplification — Not yet” | 4 | Pass |
| “Difference quotients — Can explain” | 4 | Pass |
| “Explain a derivative — Goal” | 4 | Pass |
| Eyebrow: “How it works” | 3 | Pass |
| H2: “Build the route in three moves” | 6 | Pass: route means the dependency chain |
| H3: “Name the goal” | 3 | Pass |
| “Write the exact idea or problem you want to handle.” | 10 | Pass |
| H3: “Work backward” | 2 | Pass |
| “Add only the concepts your goal depends on.” | 8 | Pass |
| H3: “Mark and choose” | 3 | Pass |
| “Update each status.” | 3 | Pass |
| “The board points to one ready repair.” | 7 | Pass under `dependency-recommendation` |
| Eyebrow: “Clear boundaries” | 2 | Pass |
| H2: “A reasoning aid, not a diagnosis” | 6 | Pass as a heading; supporting claim is F-1-1 |
| “The board does not generate a curriculum or predict mastery.” | 10 | F-1-1: unlisted claim |
| “It uses only the dependencies and statuses you enter.” | 9 | Pass under `dependency-recommendation` |
| “Export every concept and connection as JSON or Markdown.” | 9 | Pass under export claims |
| “No account is required.” | 4 | Pass under `account-free` |
| Eyebrow: “Keep the map for the long term” | 7 | Pass |
| H2: “The whole pathboard is included” | 5 | F-1-8: vague and inconsistent |
| “Add every goal and concept you need.” | 7 | Pass under `all-features-included` |
| “Offline use, list view, repair history, and both exports are included.” | 11 | Pass under listed claims |
| “Your map remains local to this browser.” | 7 | Pass under `local-only` |
| Action: “Start your board” | 3 | Verb passes; term flagged F-1-8 |
| “Export JSON or Markdown whenever you want a copy.” | 9 | Pass under export claims |
| Footer: “Prerequisite Pathboard” | 2 | Pass, product name |
| Footer sentence: “Map backward.” | 2 | Pass |
| Footer sentence: “Choose one repair.” | 3 | Pass |
| Footer links: “Privacy” / “Terms” | 1 / 1 | Pass |
| “Built by Param Factory (opens in a new tab)” | 9 | Pass |
| “Version 1.1 · Original generated artwork” | 5 | Pass |

### README

| Location / exact copy | Words | Result |
| --- | ---: | --- |
| H1: “Prerequisite Pathboard” | 2 | Pass, document title |
| “Map prerequisites backward and choose the next concept to repair.” | 10 | Pass |
| “Prerequisite Pathboard is for adults rebuilding a technical subject.” | 9 | Pass |
| “You add a goal, connect the ideas it depends on, and mark each concept as Not yet, Can explain, or Can solve.” | 22 | Pass at hard cap; consider splitting |
| “The board recommends one ready concept from only those links and statuses.” | 12 | Pass |
| “Live site: https://prerequisite-pathboard.sociobot.in” | 3 | Pass |
| H2: “Try the demo” | 3 | Pass |
| “Open https://prerequisite-pathboard.sociobot.in/demo or run the app and visit /demo.” | 9 | Pass |
| “The demo loads a 14-concept calculus map.” | 7 | Pass; observed by export/sample test |
| “Its edits stay separate from your real board and disappear when you leave or reload.” | 15 | Pass under `demo-sandbox` |
| “Use Reset demo to restore the sample.” | 7 | Pass |
| H2: “What ships” | 2 | Pass |
| “A dependency board and an accessible list view.” | 8 | Pass under `list-view` |
| “One next-session recommendation from entered dependencies and statuses.” | 8 | Pass under `dependency-recommendation` |
| “Local storage in IndexedDB.” | 4 | F-1-1 and F-1-8: unlisted mechanism and jargon |
| “The map stays on the device.” | 6 | Pass under `local-only` |
| “JSON and Markdown exports with every concept and dependency.” | 9 | Pass under export claims |
| “Invalid JSON imports are rejected with a recovery step.” | 9 | Pass under `import-error` |
| “Offline reload after the first visit through a service worker.” | 10 | F-1-8: user-facing jargon; claim itself is listed |
| “Every goal, concept, repair entry, and export is included.” | 9 | Pass under listed claims |
| “This product does not generate a curriculum or diagnose mastery.” | 10 | F-1-1: unlisted claim |
| H2: “Develop” | 1 | Pass |
| “Requires Node.js 20 or newer.” | 5 | Pass, developer context |
| Commands: “npm install” / “npm run dev” | 2 / 3 | Pass, developer context |
| “Vite serves the local site at the URL printed in the terminal.” | 12 | Pass, developer context |
| “The real board uses a local IndexedDB database named prerequisite-pathboard.” | 10 | Pass as scoped developer detail; coverage issue remains F-1-1 |
| H2: “Test” | 1 | Pass |
| “Playwright 1.58.2 is pinned in package.json.” | 6 | Pass, developer context |
| Commands: “npm test” / “npm test -- --grep @claim:offline-reload” | 2 / 5 | Pass |
| “Each promise in the interface and this README has a sandbox test in .factory/claims.json.” | 14 | F-1-1: false meta-claim |
| “Accessibility scans run on the landing, demo, privacy, and terms routes.” | 11 | Pass, but mobile coverage misses F-1-3 |
| “A 390 px mobile path is included.” | 7 | Pass |
| H2: “Build and deploy” | 3 | Pass |
| Command: “npm run build” | 3 | Pass |
| “The exact deploy command is npm run build.” | 8 | Pass |
| “It creates dist/ with dist/index.html at its root.” | 8 | Pass; clean build confirmed |
| “Deploy dist/ as a static site.” | 6 | Pass |
| “public/staticwebapp.config.json provides route fallback, the styled 404 response, security headers, and asset rules for Azure Static Web Apps.” | 18 | Pass, developer context |
| “The service worker needs HTTPS in production.” | 7 | Pass, developer context |
| “Localhost and 127.0.0.1 also allow it for development and tests.” | 10 | Pass, developer context |
| H2: “Data and privacy” | 3 | Pass |
| “Real map data never goes to an app server.” | 9 | Pass under `local-only` |
| “Demo state stays in page memory.” | 6 | F-1-1: unlisted mechanism |
| “There is no account system, analytics, or payment-provider code.” | 9 | F-1-1: partly unlisted |
| “See Privacy and Terms.” | 4 | Pass |
| H2: “Product records” | 2 | Pass |
| Link labels: “Visual thesis” / “Demo contract” / “Claims and tests” / “Copy audit” / “Build handoff” | 2 / 2 / 3 / 2 / 2 | Pass |
| H2: “License” | 1 | Pass |
| “MIT.” | 1 | Pass |
| “See LICENSE.” | 2 | Pass |

## 3. Demo and sandbox

**PASS.** From a fresh context, one click on **Try it with sample data** opened `/demo`. Before further interaction, the page showed:

- H1 “Choose the next concept to repair”;
- 14 concept controls with realistic derivative prerequisites;
- recommendation “Fraction arithmetic”;
- banner “Demo — Sample data. Nothing is saved.”;
- visible **Reset demo** and **Start for real** actions.

Changing Fraction arithmetic to “Demo-only change” affected the demo. **Reset demo** removed it and restored Fraction arithmetic with the status “Sample map reset.” A separately created and fully persisted real goal survived entering, editing, and leaving demo; the demo edit did not appear on the real board. IndexedDB exposed only the real `prerequisite-pathboard` database.

All observed demo and real-flow requests were same-origin. After service-worker readiness, setting the fresh context offline and reloading `/demo` retained “Fraction arithmetic” and changed the network label to “Offline.”

## 4. Claims

The repository was cloned without hardlinks to `/tmp/pathboard-review.lBKR9G/clean`, followed by `npm ci`. Each exact command from `.factory/claims.json` was then run separately.

| Claim ID | Result | Evidence asserted by the registered test |
| --- | --- | --- |
| `offline-reload` | PASS | Demo reloads offline with Fraction arithmetic and Offline shown. |
| `local-only` | PASS | Real note/create/export flow has no off-origin request. |
| `demo-sandbox` | PASS | Demo edits disappear on reload and do not enter the real board. |
| `json-export` | PASS | JSON contains 14 concepts and 14 edges. |
| `markdown-export` | PASS | Markdown contains the goal, status, and dependency text. |
| `dependency-recommendation` | PASS | Repairing Fraction arithmetic makes Approaching a value next. |
| `refresh-persistence` | PASS | Goal and prerequisite survive reload and a closed/reopened tab. |
| `list-view` | PASS | Linear view contains all 14 concepts and grouped headings. |
| `import-error` | PASS | Cyclic import is rejected before persistence and valid recovery succeeds. |
| `all-features-included` | PASS | Two goals and 26 concepts import and export intact. |
| `account-free` | PASS | A real goal is created without credential fields. |
| `repair-history` | PASS | All six repair entries remain visible. |

Each claim tag occurs exactly once in `tests/`. No listed claim is untested and no registered test fails. The unlisted claims are F-1-1.

## 5. History verification

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. I read `.factory/handoff.md`, `.factory/verification.md`, and `.factory/verification-2.md`, then rechecked every earlier defect live and in code.

| Earlier finding | Current result |
| --- | --- |
| Dead $24 checkout | Fixed: no price, checkout, license, or Sociobot billing link is exposed. |
| Cyclic import persists and hangs | Fixed: `import-error` passes; code validates cycles before persistence. |
| Import bypasses free limits | Fixed by honest scope change: the full product is included; 26 concepts/two goals pass import/export. |
| Claims registry incomplete / under-asserted | **Not fully fixed: reopened as F-1-1 (blocking).** |
| Mobile targets and 200% text | **Partly fixed: 200% text passes, but targets remain undersized; reopened as F-1-2 (blocking).** |
| 90-character titles overflow | Fixed: clean full suite passes the mobile unbroken-title case. |
| Unknown routes return 200 | Fixed for actual unknown URLs: live response is 404. The explicit `/404`/sitemap inconsistency is F-1-6. |
| Hashed assets lack immutable caching | Fixed: built JS returns `public, max-age=31536000, immutable`. |
| AVIF has the wrong MIME type | Fixed: live response is `image/avif`. |
| Refresh test omitted tab close | Fixed: registered test closes and reopens a tab. |
| Local-only test used demo instead of real data | Fixed: registered test creates a real private note and exports it. |
| Visual identity could be generic | No earlier defect and no regression: the night-ascent art, asymmetrical layout, palette, type, and trail-marker grammar remain distinct. |

## 6. Structure, accessibility, and quality gates

| Check | Result |
| --- | --- |
| Route titles | Pass: home uses “Product — what it does”; other routes use “Route — Product.” |
| One H1, one main, `lang=en` | Pass on `/`, `/demo`, `/board`, `/privacy`, `/terms`, `/404`, and an unknown URL. |
| Description and canonical | Pass on app routes; static 404 fails under F-1-6. |
| Open Graph/Twitter/favicon | Present on app routes; route content issue F-1-7 and static 404 issue F-1-6. |
| Designed real 404 | Unknown URL returns 404 with a designed page; consistency defects are F-1-6. |
| Deep links | Pass for demo, board, privacy, and terms. |
| History and focus | Pass: forward and Back navigation focus the new H1 after route change. |
| Dead-link crawl | Pass: every internal route and `hello-factory.sociobot.in` returned 200; mail links are explicit. |
| Header/footer | Pass on app routes; static 404 fails F-1-6. |
| Mobile overflow / 200% text | Pass in the shipped suite. |
| Touch targets | Fail F-1-2. |
| Axe | Fail: serious mobile landing F-1-3 and moderate demo F-1-5. Other checked routes have no violations. |
| Reduced motion | Pass in CSS and shipped tests. |
| Console/page errors | Pass on normal 200 routes. The browser reports the expected failed document request for an actual 404. |
| `verify-url.sh` | Pass for live `/` and `/demo`: titles, language, H1/main, alt text, labels, and console checks. |
| Full clean-clone test suite | Pass: 28/28. |
| Clean build | Pass: JS 32.22 kB / 10.75 kB gzip; CSS 18.69 kB / 5.09 kB gzip; `dist/` created. |
| Dependency audit | Pass: 0 vulnerabilities. |
| Visual identity | Pass: product-specific night-ascent system, not a generic SaaS template. |

## 7. Missed leverage

No finding. Import, JSON export, Markdown export, local persistence, accessible list view, and offline use cover the obvious extensions implied by the brief. Sync would conflict with the current device-local promise unless made explicit and optional. AI would not improve the brief's deliberate user-authored dependency model and is correctly absent; no provider key or decorative AI surface exists.

## What would make this perfect

Resolve F-1-1 through F-1-8, then rerun the review from a fresh context and clean clone. In particular, make every visitor promise a registered observable test, audit every mobile target rather than a named subset, run Axe at 390 px, keep all three facts fully above the desktop fold, and generate the 404/metadata from the same route-aware shell. A perfect next round has zero findings, including no moderate Axe result, no stale route metadata, and no terminology exception.
