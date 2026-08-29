# Adversarial first-read review 4 — Prerequisite Pathboard

- Work order: prerequisite-pathboard-review-4
- Reviewed: 2026-08-29 UTC
- Candidate: 2846858161bfdb426651af30493ed405d03b0ba8
- Live URL: https://prerequisite-pathboard.sociobot.in
- Methods: fresh Chromium contexts at 390 × 844 and 1440 × 900; a non-hardlinked clean clone at /tmp/prerequisite-pathboard-review4
- Verdict: **FAIL**

The cold landing page explains the job, audience, and first click. The one-tap
demo, registered claims, routing, metadata, accessibility scans, and link crawl
verify. Four findings remain; two are blocking.

## Findings

### F-4-1 (recurrence of F-1-4) — BLOCKING — The third required fact is below the 390 px first screen

**Exact quote and measurement**

Cold live landing at 390 × 844:

> “Create multiple goals, track repairs, and export your map.”

The third required fact occupies y = **813–854 px**. The viewport ends at 844
px, so its final 10 px and final line are below the fold. The first two facts
end at 773 px and 803 px. The 1440 × 900 desktop page passes: all three end at
849 px.

**Why this fails**

The plain-words and site-structure contracts require all three short facts in
the first screen. Earlier reports recorded the facts-placement repair as
passing at both review viewports. A phone visitor instead receives a clipped
third fact before scrolling.

**Code/test check and concrete fix**

The mobile rule in src/style.css gives .hero-copy a 600 px minimum height and
72 px vertical padding. tests/mobile.spec.ts checks the facts only at 1440 ×
900, so all 41 tests pass without checking the phone fold. Reduce mobile hero
padding, title scale, or fact spacing until the last fact's bottom is at most
844 px. Add a 390 × 844 assertion for each .plain-facts li while retaining the
desktop assertion.

### F-4-2 (recurrence of F-1-1) — BLOCKING — A visitor promise is not registered or tested

**Exact quote and location**

Landing, example-map H2:

> “A map you wrote, not a prescribed course”

“Not a prescribed course” promises behaviour a visitor can rely on.
.factory/claims.json has no claim for it. The closest entry,
dependency-recommendation, proves a recommendation changes with entered
dependencies and statuses; it neither states nor tests the absence of a
prescribed course. The README meta-claim, “Each visitor promise in the
interface and this README has a sandbox test in .factory/claims.json,” is
therefore false.

**Why this fails**

The claims contract requires every visitor-reliant statement to have one
registered observable test or to be removed. This reopens the claims-coverage
defect F-1-1; the other coverage repairs remain valid.

**Concrete fix**

Use the content-naming heading “Example prerequisite map” and remove the
untested clause. If retaining the promise, add a manual-map-only claim and a
clean-real-board test that proves a new board is empty until the visitor adds
its own goal and prerequisites, and that the recommendation uses only those
entries.

### F-4-3 — Minor — Content names are not the semantic headings in the document outline

**Exact locations**

| Visible eyebrow (a paragraph) | H2 exposed to a heading list |
| --- | --- |
| “Example prerequisite map” | “A map you wrote, not a prescribed course” |
| “What the recommendation uses” | “A reasoning aid for your own map” |
| “Included map features” | “Create multiple goals, track repairs, and export your map” |

**Why this loses a cold reader**

The eyebrow labels are plain, but they are not headings. The actual H2s
describe a mood or make a product claim instead of naming the section. A
screen-reader heading list does not plainly identify an example map,
recommendation inputs, or included features.

**Concrete fix**

Make “Example prerequisite map”, “What the recommendation uses”, and
“Included map features” the corresponding H2s. Move useful current sentences
into body copy, deleting the unlisted clause in F-4-2.

### F-4-4 — Minor — README calls dependencies “links” once

**Exact quote and location**

README introduction:

> “The map recommends one ready concept from only those links and statuses.”

The landing, claims registry, demo documentation, and board use
“dependencies” for this relationship.

**Why this matters and concrete fix**

“Links” is less specific and creates a second term for the core data the
visitor enters. Rewrite it as: “The map recommends one ready concept from the
dependencies and statuses you enter.”

## 1. Cold first read

Before scrolling, both fresh contexts answered all three questions.

| Question | Answer from the first screen |
| --- | --- |
| What does this do? | It maps prerequisites backwards and identifies the next prerequisite to repair. |
| For whom? | Adults rebuilding technical knowledge. |
| What should I click first? | **Try it with sample data**. |

The exact copy is “Map backward. Learn the next prerequisite.”, “For adults
rebuilding technical knowledge who need one clear concept to work on next.”,
and “Try it with sample data”, followed by “Opens an isolated 14-concept
calculus map.” There were no normal-load console or page errors, and all
requests were same-origin. F-4-1 separately clips the mandatory third fact.

## 2. Copy audit

Counts treat a URL, product name, version, code token, and numbered label as
one word. The tables cover public landing text and every README sentence,
heading, control, and list item. No unit exceeds 22 words. No banned marketing
adjective appears. Primary actions name their results. Flags are F-4-2 through
F-4-4.

### Landing page

| Exact copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Pathboard / Demo / My map / Privacy / Online | 1 / 1 / 2 / 1 / 1 | Pass: navigation/status |
| A map for relearning | 4 | Pass |
| Map backward. / Learn the next prerequisite. | 2 / 4 | Pass: H1 |
| For adults rebuilding technical knowledge who need one clear concept to work on next. | 14 | Pass |
| Try it with sample data | 5 | Pass: result-naming action |
| Opens an isolated 14-concept calculus map. | 6 | Pass: states outcome |
| Works offline after the first visit. | 6 | Registered offline-reload; placement F-4-1 |
| Your map stays on this device. | 6 | Registered local-only; placement F-4-1 |
| Create multiple goals, track repairs, and export your map. | 9 | Registered multi-goal/export/repair claims; placement F-4-1 |
| A chain of warm trail lights climbs toward an observatory on a dark mountain ridge. | 15 | Pass: image alt |
| Next session / Fraction arithmetic / Nothing below it is still marked “Not yet.” | 2 / 2 / 8 | Pass |
| Example prerequisite map | 3 | F-4-3: not semantic heading |
| A map you wrote, not a prescribed course | 8 | F-4-2 and F-4-3 |
| Every line comes from a dependency you enter. | 8 | Registered rendered-edges |
| Statuses help the map find the first unresolved step. | 9 | Registered dependency-recommendation |
| Fraction arithmetic — Not yet / Algebraic simplification — Not yet / Difference quotients — Can explain / Explain a derivative — Goal | 4 / 4 / 4 / 4 | Pass: example labels |
| How it works / Build the map in three steps | 3 / 6 | Pass |
| Name the goal / Write the exact idea or problem you want to handle. | 3 / 10 | Pass |
| Work backward / Add only the concepts your goal depends on. | 2 / 8 | Pass |
| Mark and choose / Update each status. The map points to one ready repair. | 3 / 10 | Registered recommendation claim |
| What the recommendation uses | 4 | F-4-3: not semantic heading |
| A reasoning aid for your own map | 7 | F-4-3 |
| The recommendation uses only the dependencies and statuses you enter. | 10 | Registered dependency-recommendation |
| Export your map as JSON or Markdown. / No account is required. | 7 / 4 | Registered export/account claims |
| Included map features | 3 | F-4-3: not semantic heading |
| Create multiple goals, track repairs, and export your map | 9 | F-4-3: move below an included-features H2 |
| Works offline. / Use the list view, repair history, and JSON or Markdown export. | 2 / 11 | Registered offline/list/repair/export claims |
| Your map remains local to this browser. | 7 | Registered local-only |
| Start your map / Export JSON or Markdown whenever you want a copy. | 3 / 9 | Pass: result-naming action/outcome |
| Prerequisite Pathboard / Map backward. Choose one repair. | 2 / 5 | Pass: footer |
| Privacy / Terms / Built by Param Factory (opens in a new tab) | 1 / 1 / 9 | Pass: footer links |
| Version 1.3 · Original generated artwork | 5 | Pass: provenance |

### README

| Exact copy | Words | Result |
| --- | ---: | --- |
| Prerequisite Pathboard | 2 | Pass: document title |
| Map prerequisites backward and choose the next concept to repair. | 10 | Pass |
| Prerequisite Pathboard is for adults rebuilding a technical subject. | 9 | Pass |
| You add a goal, connect the ideas it depends on, and mark each concept as Not yet, Can explain, or Can solve. | 22 | Pass: hard cap |
| The map recommends one ready concept from only those links and statuses. | 12 | F-4-4 |
| Live site: https://prerequisite-pathboard.sociobot.in | 3 | Pass |
| Try the demo | 3 | Pass: heading |
| Open https://prerequisite-pathboard.sociobot.in/?demo=1 or run the app and visit ?demo=1. | 9 | Pass |
| The /demo URL also works. | 5 | Pass |
| The demo loads a 14-concept calculus map. | 7 | Covered by demo/export tests |
| Its edits stay separate from your real map and disappear when you leave or reload. | 15 | Registered demo-sandbox |
| Use Reset demo to restore the sample. | 7 | Pass: result-naming action |
| What ships | 2 | Pass: README feature heading |
| A dependency map and an accessible list view. | 8 | Registered list-view |
| One next-session recommendation from entered dependencies and statuses. | 8 | Registered dependency-recommendation |
| The map stays in this browser. | 6 | Registered local-only |
| JSON and Markdown exports with every concept and dependency. | 9 | Registered export claims |
| Invalid JSON imports are rejected with a recovery step. | 9 | Registered import-error |
| After one online visit, reopen the map without a connection. | 10 | Registered offline-reload |
| Create multiple goals, track repairs, and export your map. | 9 | Registered multi-goal/export/repair claims |
| The recommendation uses only the dependencies and statuses you enter. | 10 | Registered dependency-recommendation |
| Develop / Requires Node.js 20 or newer. / npm install / npm run dev | 1 / 5 / 2 / 3 | Pass: developer instructions |
| Vite serves the local site at the URL printed in the terminal. | 12 | Pass: developer instruction |
| The real map uses a local IndexedDB database named prerequisite-pathboard. | 10 | Pass: scoped developer detail |
| Test / Playwright 1.58.2 is pinned in package.json. | 1 / 6 | Pass: developer instruction |
| npm test / npm test -- --grep @claim:offline-reload | 2 / 5 | Pass: commands |
| Each visitor promise in the interface and this README has a sandbox test in .factory/claims.json. | 14 | F-4-2: false |
| Accessibility scans run on the landing, demo, privacy, terms, and not-found routes at desktop and mobile sizes. | 15 | Pass: confirmed |
| Build and deploy / npm run build | 3 / 3 | Pass: developer instructions |
| The exact deploy command is npm run build. | 8 | Pass |
| It creates dist/ with dist/index.html at its root. | 8 | Pass |
| Deploy dist/ as a static site. | 6 | Pass |
| public/staticwebapp.config.json provides route fallback, the styled 404 response, security headers, and asset rules for Azure Static Web Apps. | 18 | Pass: developer instruction |
| The service worker needs HTTPS in production. | 7 | Pass: developer instruction |
| Localhost and 127.0.0.1 also allow it for development and tests. | 10 | Pass: developer instruction |
| Data and privacy / Your map stays in this browser. | 3 / 6 | Registered local-only |
| Demo changes stay separate from your real map. / This app makes no tracking requests. | 8 / 7 | Registered demo/tracking claims |
| See Privacy and Terms. | 4 | Pass |
| Product records / Visual thesis / Demo contract / Claims and tests / Copy audit / Build handoff | 2 / 2 / 2 / 3 / 2 / 2 | Pass: record links |
| License / MIT. / See LICENSE. | 1 / 1 / 2 | Pass |

## 3. Demo and sandbox

**PASS.** A fresh mobile context opened ?demo=1 directly and immediately showed
the working product: “Choose the next concept to repair”, a realistic
14-concept calculus map, and “Fraction arithmetic” as the next session. The
persistent banner read:

> Demo — Sample data. Nothing is saved. — Reset demo — Start for real

**Reset demo** produced “Sample map reset.” The fresh demo context had no
IndexedDB databases, localStorage keys, or sessionStorage keys. Its request log
contained only the product origin. The passed registered demo-sandbox test also
created a real map, edited demo data, reloaded, left demo, and confirmed that
the real IndexedDB record stayed unchanged.

## 4. Claims and clean-clone gates

I created the clean clone above, ran npm ci, then ran every command listed in
.factory/claims.json independently. All 14 passed. CI=1 npm test -- --workers=1
passed all 41 tests; npm run build passed and produced dist/.

| Claim ID | Result |
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
| multi-goal-map | PASS |
| account-free | PASS |
| no-tracking | PASS |
| repair-history | PASS |

The tests prove their registered claims, but not F-4-2's separate promise. The
production build has 33.47 kB JavaScript raw (10.85 kB gzip) and 18.92 kB CSS
raw (5.15 kB gzip).

## 5. Earlier findings and history

I read every earlier review, polish report, verification report, and handoff.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 claims coverage | **Not fully fixed:** F-4-2 is an unlisted visitor promise. All other current claim coverage passes. |
| F-1-2 mobile targets | Fixed: visible landing/demo controls are at least 44 × 44 px at 390 px; desktop home is 44 px high. |
| F-1-3 keyboard preview | Fixed: preview stacks without horizontal overflow; live Axe is clean. |
| F-1-4 first-screen facts | Desktop repair remains fixed; F-4-1 finds the third fact clipped at 390 × 844. |
| F-1-5 nested landmark | Fixed: live demo Axe has zero violations. |
| F-1-6 404/sitemap | Fixed: unknown URL returns styled HTTP 404; sitemap omits /404. |
| F-1-7 social metadata | Fixed: checked routes have route-specific titles, descriptions, canonical, OG, and Twitter metadata. |
| F-1-8 terminology/jargon | Saved artifact remains “map”; F-4-4 is a separate dependency-term inconsistency. |
| F-3-1 bounded capacity | Fixed: copy and test name two goals and 26 concepts. |
| F-3-2 vague labels | Visible eyebrow labels are fixed; F-4-3 finds they are not semantic headings. |
| F-3-3 desktop home target | Fixed: live home target is 44 px high. |

Checkout, import/cycle recovery, persistence, asset policy, responsive, and
tracking repairs remain covered by the clean suite and live checks.

## 6. Structure, accessibility, privacy, and visual identity

- /, /demo, /board, /privacy, and /terms returned HTTP 200; an unknown route
  returned styled HTTP 404. Every landing link, including the Param Factory
  footer link, returned 200.
- Live Axe 4.10.2 scans at 390 × 844 and 1440 × 900 found zero violations on
  home, demo, board, privacy, terms, and a missing route. Each checked route
  has lang=en, one H1, and one main.
- Titles follow the required pattern and remain below 60 characters. Route
  descriptions, canonical links, OG/Twitter metadata, favicon, and apple-touch
  icon are present. Navigation and browser Back move focus to the destination
  H1. Header/footer/skip/legal links are consistent, including the 404.
- Cold and demo request logs were same-origin only. No third-party font/script,
  tracking request, AI endpoint, provider key, or payment embed appeared.
- The original night-ascent art, dark teal/ember palette, Georgia/system type
  pairing, trail-marker controls, and asymmetric composition match
  .factory/design.md. This is distinct from a generic SaaS template.

## 7. Missed leverage

No additional feature finding. The brief's obvious capabilities are present:
isolated sample data, local persistence, offline reload, JSON/Markdown export,
JSON import and recovery, repair history, and a non-graph list view. AI would
not improve the deliberately user-authored dependency model and is correctly
absent.

## What would make this perfect

Keep all three facts within the 390 × 844 first screen and add that regression
test; remove or test the non-prescribed-course promise; promote the three
content names into real H2s; and use “dependencies” in the README. Then rerun
the clean-clone claim commands, full suite, build, and mobile cold-load check.
A PASS requires all four findings to be gone.

