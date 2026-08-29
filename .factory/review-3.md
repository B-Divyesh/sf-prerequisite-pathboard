# Adversarial first-read review 3 — Prerequisite Pathboard

- Work order: `prerequisite-pathboard-review-3`
- Reviewed: 2026-08-29 UTC
- Candidate: `2ed071cdc4d9e4b0ec2fc605a698a27f3235b382`
- Live URL: <https://prerequisite-pathboard.sociobot.in>
- Methods: fresh Chromium contexts at 390 × 844 and 1440 × 900; clean local clone at `/tmp/pathboard-review3.uLwvXy`
- Verdict: **FAIL**

The first read, one-click demo, registered tests, route structure, and visual identity verify. Three findings remain. One is blocking because the visitor-facing “without limits” promise and its registered claim cannot be proven by the registered test. A PASS requires zero findings.

## Findings

### F-3-1 — BLOCKING — “Without limits” is an unprovable visitor claim

**Exact quotes and locations**

- Landing, included-features section heading: “Use the full map without limits”
- Landing, included-features copy: “Add every goal and concept you need.”
- README, “What ships”: “Every goal, concept, repair entry, and export is included.”
- `.factory/claims.json`, `all-features-included`: “Every goal, concept, and export is included.”

**Verification**

The only registered test imports and exports exactly two goals and 26 concepts. It proves that example, not an unlimited number of goals or concepts. The app has no stated, tested limit, so “without limits” cannot be established with a finite sandbox test. The README assertion that every visitor promise has a sandbox test is therefore not currently true. This reopens the substantive claims-coverage requirement checked by F-1-1.

**Why this misleads**

A visitor can reasonably read “without limits” as a capacity guarantee. The product has not named a limit or provided a testable bound.

**Concrete fix**

Remove the unlimited promise and make the copy match the observable test: change the heading to “Included map features”; change the landing sentence to “Create multiple goals, track repairs, and export your map.”; change the README sentence to “Create multiple goals, track repairs, and export your map.” Update the claim to name the tested minimum: “Creates and exports a map with two goals and 26 concepts.” Alternatively, document a real capacity limit and add a boundary test for it.

### F-3-2 — Minor — Three section labels do not name their content plainly

**Exact quotes and locations**

- Landing eyebrow above the example: “See the structure”
- Landing eyebrow above recommendation boundaries: “Clear boundaries”
- Landing eyebrow above included features: “Keep the map for the long term”
- Landing process heading: “Build the map in three moves”

**Why this loses a cold reader**

The labels are generic cues rather than names for the content that follows. “Moves” is also a metaphor where “steps” is plain. A screen-reader heading list or a quick phone scan does not tell the visitor that these sections are an example map, recommendation rules, included features, and three setup steps.

**Concrete fix**

Rename them respectively to “Example prerequisite map”, “What the recommendation uses”, “Included map features”, and “Build the map in three steps”.

### F-3-3 — Minor — Desktop home target is below the stated 44 px target size

**Exact location and measurement**

At 1440 × 900, the header home link “Pathboard” measures **115.58 × 32 px**. The live stylesheet gives `.wordmark` no desktop `min-height`; the 44 px rule appears only in the 620 px mobile media query. Other header navigation controls measure at least 44 px high.

**Why this matters**

The product’s accessibility and site-structure contracts specify 44 px targets. A wide touch device still has the undersized home target.

**Concrete fix**

Give `.wordmark` `min-height: 44px` and a vertically centered inline-flex layout at every breakpoint. Extend the target-size test to evaluate the home link at desktop as well as 390 px.

## 1. Cold first read

Before scrolling, both fresh contexts answered all required questions:

| Question | Answer from the first screen |
| --- | --- |
| What does this do? | It maps a technical goal backward through prerequisites and selects the next concept to repair. |
| For whom? | Adults rebuilding technical knowledge. |
| What should I click first? | **Try it with sample data**. |

The exact copy is “Map backward. Learn the next prerequisite.”, “For adults rebuilding technical knowledge who need one clear concept to work on next.”, and “Try it with sample data”, followed by “Opens an isolated 14-concept calculus map.” All three product facts were fully visible: their bottom edges were 834 px at mobile and 849 px at desktop. There were no application console or page errors on either normal cold load and all normal-load requests were same-origin.

Screenshots: `/tmp/pathboard-review3-evidence/first-mobile.png` and `/tmp/pathboard-review3-evidence/first-desktop.png`.

## 2. Copy audit

Counts treat a URL, product name, code token, and version as one word. Headings, controls, alt text, labels, and footer copy are included so the audit covers every landing and README sentence or user-facing copy unit. No audited sentence exceeds 22 words. F-3-1 through F-3-2 are the copy flags; no banned marketing adjective or inconsistent saved-artifact term was found.

### Landing page

| Exact copy | Words | Result |
| --- | ---: | --- |
| Pathboard / Demo / My map / Privacy | 1 / 1 / 2 / 1 | Pass: navigation |
| A map for relearning | 4 | Pass |
| Map backward. Learn the next prerequisite. | 6 | Pass: job headline |
| For adults rebuilding technical knowledge who need one clear concept to work on next. | 14 | Pass |
| Try it with sample data | 5 | Pass: result-naming action |
| Opens an isolated 14-concept calculus map. | 6 | Pass |
| Works offline after the first visit. | 6 | Registered `offline-reload` claim |
| Your map stays on this device. | 6 | Registered `local-only` claim |
| Every goal, concept, and export is included. | 7 | F-3-1 |
| A chain of warm trail lights climbs toward an observatory on a dark mountain ridge. | 15 | Pass: useful alt text |
| Next session / Fraction arithmetic / Nothing below it is still marked “Not yet.” | 2 / 2 / 8 | Pass |
| See the structure | 3 | F-3-2 |
| A map you wrote, not a prescribed course | 8 | Pass |
| Every line comes from a dependency you enter. | 8 | Registered `rendered-edges` claim |
| Statuses help the map find the first unresolved step. | 9 | Registered `dependency-recommendation` claim |
| Fraction arithmetic — Not yet / Algebraic simplification — Not yet / Difference quotients — Can explain / Explain a derivative — Goal | 4 / 4 / 4 / 4 | Pass: example labels |
| How it works | 3 | Pass |
| Build the map in three moves | 6 | F-3-2 |
| Name the goal / Write the exact idea or problem you want to handle. | 3 / 10 | Pass |
| Work backward / Add only the concepts your goal depends on. | 2 / 8 | Pass |
| Mark and choose / Update each status. | 3 / 3 | Pass |
| The map points to one ready repair. | 7 | Registered `dependency-recommendation` claim |
| Clear boundaries | 2 | F-3-2 |
| A reasoning aid for your own map | 7 | Pass |
| The recommendation uses only the dependencies and statuses you enter. | 10 | Registered `dependency-recommendation` claim |
| Export every concept and connection as JSON or Markdown. | 9 | Registered export claims |
| No account is required. | 4 | Registered `account-free` claim |
| Keep the map for the long term | 7 | F-3-2 |
| Use the full map without limits | 7 | F-3-1 |
| Add every goal and concept you need. | 7 | F-3-1 |
| Offline use, list view, repair history, and both exports are included. | 10 | Registered feature claims |
| Your map remains local to this browser. | 7 | Registered `local-only` claim |
| Start your map / Export JSON or Markdown whenever you want a copy. | 3 / 9 | Pass |
| Prerequisite Pathboard / Map backward. Choose one repair. | 2 / 5 | Pass: footer |
| Privacy / Terms / Built by Param Factory (opens in a new tab) | 1 / 1 / 9 | Pass: links |
| Version 1.2 · Original generated artwork | 5 | Pass: provenance |

### README

| Exact copy | Words | Result |
| --- | ---: | --- |
| Prerequisite Pathboard | 2 | Pass: document heading |
| Map prerequisites backward and choose the next concept to repair. | 10 | Pass |
| Prerequisite Pathboard is for adults rebuilding a technical subject. | 9 | Pass |
| You add a goal, connect the ideas it depends on, and mark each concept as Not yet, Can explain, or Can solve. | 22 | Pass: hard cap, readable instruction |
| The map recommends one ready concept from only those links and statuses. | 12 | Registered `dependency-recommendation` claim |
| Live site: https://prerequisite-pathboard.sociobot.in | 3 | Pass |
| Try the demo | 3 | Pass |
| Open https://prerequisite-pathboard.sociobot.in/?demo=1 or run the app and visit `?demo=1`. | 9 | Pass |
| The `/demo` URL also works. | 5 | Pass |
| The demo loads a 14-concept calculus map. | 7 | Registered demo/export evidence |
| Its edits stay separate from your real map and disappear when you leave or reload. | 15 | Registered `demo-sandbox` claim |
| Use Reset demo to restore the sample. | 7 | Pass: result-naming action |
| What ships | 2 | Pass |
| A dependency map and an accessible list view. | 8 | Registered `list-view` claim |
| One next-session recommendation from entered dependencies and statuses. | 8 | Registered `dependency-recommendation` claim |
| The map stays in this browser. | 6 | Registered `local-only` claim |
| JSON and Markdown exports with every concept and dependency. | 9 | Registered export claims |
| Invalid JSON imports are rejected with a recovery step. | 9 | Registered `import-error` claim |
| After one online visit, reopen the map without a connection. | 10 | Registered `offline-reload` claim |
| Every goal, concept, repair entry, and export is included. | 9 | F-3-1 |
| The recommendation uses only the dependencies and statuses you enter. | 10 | Registered `dependency-recommendation` claim |
| Develop / Requires Node.js 20 or newer. / `npm install` / `npm run dev` | 1 / 5 / 2 / 3 | Pass: developer instructions |
| Vite serves the local site at the URL printed in the terminal. | 12 | Pass: developer instruction |
| The real map uses a local IndexedDB database named `prerequisite-pathboard`. | 10 | Pass: developer instruction |
| Test / Playwright 1.58.2 is pinned in `package.json`. | 1 / 6 | Pass: developer instruction |
| `npm test` / `npm test -- --grep @claim:offline-reload` | 2 / 5 | Pass: commands |
| Each visitor promise in the interface and this README has a sandbox test in `.factory/claims.json`. | 14 | F-3-1: false while unlimited wording remains |
| Accessibility scans run on the landing, demo, privacy, terms, and not-found routes at desktop and mobile sizes. | 15 | Pass: local suite confirms |
| Build and deploy / `npm run build` / The exact deploy command is `npm run build`. | 3 / 3 / 8 | Pass: developer instructions |
| It creates `dist/` with `dist/index.html` at its root. | 8 | Pass |
| Deploy `dist/` as a static site. | 6 | Pass |
| `public/staticwebapp.config.json` provides route fallback, the styled 404 response, security headers, and asset rules for Azure Static Web Apps. | 18 | Pass: developer instruction |
| The service worker needs HTTPS in production. | 7 | Pass: developer instruction |
| Localhost and `127.0.0.1` also allow it for development and tests. | 10 | Pass: developer instruction |
| Data and privacy / Your map stays in this browser. | 3 / 6 | Registered `local-only` claim |
| Demo changes stay separate from your real map. | 8 | Registered `demo-sandbox` claim |
| This app makes no tracking requests. | 7 | Registered `no-tracking` claim |
| See Privacy and Terms. | 4 | Pass |
| Product records / Visual thesis / Demo contract / Claims and tests / Copy audit / Build handoff | 2 / 2 / 2 / 3 / 2 / 2 | Pass: document links |
| License / MIT. See LICENSE. | 1 / 3 | Pass |

## 3. Demo and sandbox

**PASS.** One tap on the first-screen action opens the sample immediately. The first demo screen showed the H1 “Choose the next concept to repair”, a realistic calculus map containing 14 concepts, the recommendation “Fraction arithmetic”, and the persistent banner “Demo / Sample data. Nothing is saved. / Reset demo / Start for real”.

Changing Fraction arithmetic to Can explain moved the recommendation to Approaching a value. Reloading restored Fraction arithmetic; Reset demo also restored it. A real map was created first in the same fresh context. Demo mode left the only IndexedDB database, `prerequisite-pathboard`, unchanged and the real map was present after leaving demo. The direct live flow made only same-origin requests.

## 4. Claims and clean-clone quality gates

I created a non-hardlinked clean clone, ran `npm ci`, and ran every exact command from `.factory/claims.json` separately. All 14 passed. `CI=1 npm test -- --workers=1` also passed all 39 tests (`test-results/.last-run.json` reports `status: passed` and no failed tests), and `npm run build` passed and produced `dist/`.

| Claim ID | Declared test |
| --- | --- |
| offline-reload | PASS |
| local-only | PASS |
| demo-sandbox | PASS |
| json-export | PASS |
| markdown-export | PASS |
| dependency-recommendation | PASS |
| rendered-edges | PASS |
| refresh-persistence | PASS |
| list-view | PASS |
| import-error | PASS |
| all-features-included | PASS as a test; coverage is blocking F-3-1 |
| account-free | PASS |
| no-tracking | PASS |
| repair-history | PASS |

The request log confirms the privacy/offline flows use the product origin only. No AI feature, provider key, external script, or third-party font was found. The untestable unlimited wording is the only remaining claims-coverage finding.

## 5. Earlier-review and handoff history

I read `review-1.md`, `review-2.md`, `polish-1.md`, both verification reports, the prior handoff, and the current handoff. The live site and current source confirm the following results.

| Earlier finding or repair | Current verification |
| --- | --- |
| F-1-1 claims coverage | Partly regressed as F-3-1: the unlimited/included wording still exceeds its test. All other earlier coverage repairs remain present. |
| F-1-2 mobile target sizes | Fixed at 390 px; all visible mobile landing/demo controls measured at least 44 px. Desktop wordmark remains F-3-3. |
| F-1-3 keyboard-inaccessible mobile preview | Fixed: the preview fits at 390 px and the mobile Axe test passes. |
| F-1-4 desktop facts below fold | Fixed: all fact bottoms are within 900 px. |
| F-1-5 nested landmark | Fixed: the selected panel is no longer an aside landmark within the map landmark. |
| F-1-6 404/sitemap mismatch | Fixed: unknown live URL returned HTTP 404 with the current designed shell; sitemap omits `/404`. |
| F-1-7 route social metadata | Fixed: route-specific title, description, canonical, OG, and Twitter values are present. |
| F-1-8 terminology/jargon | Saved object remains consistently “map”; developer terms remain in developer sections. F-3-2 is a separate heading-clarity issue. |
| Earlier checkout, cycle-import, import-limit, responsive, asset policy, and persistence findings | Fixed by current tests and source: no checkout is advertised, cyclic imports are rejected before persistence, multi-goal/26-concept import works, and current responsive/policy tests pass. |

## 6. Structure, accessibility, and visual check

- `/`, `/demo`, `/board`, `/privacy`, and `/terms` returned 200. The unknown URL returned 404. `robots.txt` and the sitemap are present, and every linked internal URL plus Param Factory returned 200.
- Each checked route had `lang="en"`, one main landmark, one H1, a route-specific title, description, canonical, OG/Twitter metadata, favicon, and apple touch icon.
- Client navigation and browser Back moved focus to the destination H1: `/demo` focused “Choose the next concept to repair”; Back focused the landing H1.
- Header/footer, skip link, Privacy, and Terms are consistent, including on the static 404. The app’s local Axe suite passed for home, demo, board, privacy, terms, and both not-found paths; no normal-flow console/page errors were observed.
- The night-ascent art, dark teal/ember palette, Georgia/system type pairing, trail-marker shapes, and asymmetric hero match `.factory/design.md`. This is a distinct, product-specific visual system rather than a generic SaaS template.

F-3-3 remains the target-size exception.

## 7. Missed leverage

No additional feature finding. The brief’s apparent high-value extensions are already present: isolated sample data, local persistence, offline reload, import/export, invalid-import recovery, repair history, and an accessible list view. AI would not improve the stated user-authored dependency model and is correctly absent.

## What would make this perfect

Remove or bound the unlimited capacity promise, use direct content-naming section labels, and make the desktop wordmark a 44 px target. Then rerun all registered claim commands, the 390 px and desktop target checks, and the route/Axe matrix.
