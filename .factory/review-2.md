# Adversarial first-read review 2 — Prerequisite Pathboard

- Work order: `prerequisite-pathboard-review-2`
- Reviewed: 2026-08-28 UTC
- Candidate: `e7066406633ccfbce3e20c3ce845c3eeabd9c437`
- Live URL: <https://prerequisite-pathboard.sociobot.in>
- Viewports: fresh Chromium contexts at 390 × 844 and 1440 × 900
- Verdict: **PASS**

There are zero findings. This review reran the complete checklist rather than
accepting the prior polish report.

## 1. Cold first read

Before scrolling, both fresh contexts gave the same unambiguous answer:

| Question | Answer from the first screen |
| --- | --- |
| What does it do? | It maps prerequisites backwards for a technical learning goal and recommends the next concept to repair. |
| For whom? | Adults rebuilding technical knowledge. |
| What should I click first? | **Try it with sample data**. |

The exact first-screen copy is “Map backward. Learn the next prerequisite.”,
“For adults rebuilding technical knowledge who need one clear concept to work
on next.”, and “Try it with sample data”. The immediate outcome is stated as
“Opens an isolated 14-concept calculus map.” All three plain facts were fully
visible at both viewports. There were no console or page errors.

Evidence: `/tmp/pathboard-review2-evidence/first-mobile.png` and
`/tmp/pathboard-review2-evidence/first-desktop.png`.

## 2. Copy audit

Word counts treat a URL, product name, version, and code token as one word.
Navigation labels, controls, image labels, and footer text are included so no
public wording is skipped. No landing or README sentence exceeds 22 words.
No banned marketing wording, unexplained user-facing jargon, inconsistent map
terminology, contextless heading, or non-result-naming action button was found.
Developer-only terms such as Vite, Playwright, IndexedDB, and service worker
are confined to the Develop, Test, or Build and deploy instructions.

### Landing page

| Text | Words | Check |
| --- | ---: | --- |
| Pathboard / Demo / My map / Privacy | 1 / 1 / 2 / 1 | Pass: navigation labels |
| A map for relearning | 4 | Pass |
| Map backward. Learn the next prerequisite. | 6 | Pass: headline is six words |
| For adults rebuilding technical knowledge who need one clear concept to work on next. | 14 | Pass |
| Try it with sample data | 5 | Pass: result-naming action |
| Opens an isolated 14-concept calculus map. | 6 | Pass |
| Works offline after the first visit. | 6 | Pass: registered claim |
| Your map stays on this device. | 6 | Pass: registered claim |
| Every goal, concept, and export is included. | 7 | Pass: registered claim |
| A chain of warm trail lights climbs toward an observatory on a dark mountain ridge. | 15 | Pass: image alt |
| Next session / Fraction arithmetic / Nothing below it is still marked “Not yet.” | 2 / 2 / 8 | Pass |
| See the structure / A map you wrote, not a prescribed course | 3 / 8 | Pass |
| Every line comes from a dependency you enter. Statuses help the map find the first unresolved step. | 8 / 9 | Pass: registered rendered-edge and recommendation claims |
| Fraction arithmetic — Not yet / Algebraic simplification — Not yet / Difference quotients — Can explain / Explain a derivative — Goal | 4 / 4 / 4 / 4 | Pass |
| How it works / Build the map in three moves | 3 / 6 | Pass |
| Name the goal / Write the exact idea or problem you want to handle. | 3 / 10 | Pass |
| Work backward / Add only the concepts your goal depends on. | 2 / 8 | Pass |
| Mark and choose / Update each status. The map points to one ready repair. | 3 / 10 | Pass |
| Clear boundaries / A reasoning aid for your own map | 2 / 7 | Pass |
| The recommendation uses only the dependencies and statuses you enter. | 10 | Pass: registered claim |
| Export every concept and connection as JSON or Markdown. No account is required. | 9 / 4 | Pass: registered claims |
| Keep the map for the long term / Use the full map without limits | 7 / 7 | Pass |
| Add every goal and concept you need. Offline use, list view, repair history, and both exports are included. | 17 | Pass: registered claims |
| Your map remains local to this browser. | 8 | Pass: registered claim |
| Start your map / Export JSON or Markdown whenever you want a copy. | 3 / 9 | Pass: action and registered claims |
| Prerequisite Pathboard / Map backward. Choose one repair. | 2 / 5 | Pass: footer |
| Privacy / Terms / Built by Param Factory (opens in a new tab) / Version 1.2 · Original generated artwork | 1 / 1 / 9 / 5 | Pass |

### README

| Text | Words | Check |
| --- | ---: | --- |
| Prerequisite Pathboard | 2 | Pass: document heading |
| Map prerequisites backward and choose the next concept to repair. | 10 | Pass |
| Prerequisite Pathboard is for adults rebuilding a technical subject. | 9 | Pass |
| You add a goal, connect the ideas it depends on, and mark each concept as Not yet, Can explain, or Can solve. | 22 | Pass: at cap, still one readable instruction |
| The map recommends one ready concept from only those links and statuses. | 12 | Pass: registered claim |
| Live site: URL | 3 | Pass |
| Try the demo | 3 | Pass |
| Open URL or run the app and visit `?demo=1`. The `/demo` URL also works. | 9 / 5 | Pass |
| The demo loads a 14-concept calculus map. | 7 | Pass |
| Its edits stay separate from your real map and disappear when you leave or reload. | 15 | Pass: registered claim |
| Use Reset demo to restore the sample. | 7 | Pass: result-naming action |
| What ships | 2 | Pass |
| A dependency map and an accessible list view. | 8 | Pass: registered claim |
| One next-session recommendation from entered dependencies and statuses. | 8 | Pass: registered claim |
| The map stays in this browser. | 6 | Pass: registered claim |
| JSON and Markdown exports with every concept and dependency. | 9 | Pass: registered claims |
| Invalid JSON imports are rejected with a recovery step. | 9 | Pass: registered claim |
| After one online visit, reopen the map without a connection. | 10 | Pass: registered claim |
| Every goal, concept, repair entry, and export is included. | 9 | Pass: registered claims |
| The recommendation uses only the dependencies and statuses you enter. | 10 | Pass: registered claim |
| Develop / Requires Node.js 20 or newer. / `npm install` / `npm run dev` | 1 / 5 / 2 / 3 | Pass: developer instructions |
| Vite serves the local site at the URL printed in the terminal. | 12 | Pass: developer instruction |
| The real map uses a local IndexedDB database named `prerequisite-pathboard`. | 10 | Pass: precise developer instruction |
| Test / Playwright 1.58.2 is pinned in `package.json`. | 1 / 6 | Pass: developer instruction |
| `npm test` / `npm test -- --grep @claim:offline-reload` | 2 / 5 | Pass: commands |
| Each visitor promise in the interface and this README has a sandbox test in `.factory/claims.json`. | 14 | Pass: confirmed by this review |
| Accessibility scans run on the landing, demo, privacy, terms, and not-found routes at desktop and mobile sizes. | 15 | Pass: confirmed by this review |
| Build and deploy / `npm run build` | 3 / 3 | Pass: developer instruction |
| The exact deploy command is `npm run build`. | 8 | Pass |
| It creates `dist/` with `dist/index.html` at its root. | 8 | Pass: build confirmed |
| Deploy `dist/` as a static site. | 6 | Pass |
| `public/staticwebapp.config.json` provides route fallback, the styled 404 response, security headers, and asset rules for Azure Static Web Apps. | 18 | Pass: developer instruction |
| The service worker needs HTTPS in production. | 7 | Pass: developer instruction |
| Localhost and `127.0.0.1` also allow it for development and tests. | 10 | Pass: developer instruction |
| Data and privacy / Your map stays in this browser. | 3 / 6 | Pass: registered claim |
| Demo changes stay separate from your real map. This app makes no tracking requests. | 8 / 7 | Pass: registered claims |
| See Privacy and Terms. | 4 | Pass |
| Product records / Visual thesis / Demo contract / Claims and tests / Copy audit / Build handoff | 2 / 2 / 2 / 3 / 2 / 2 | Pass |
| License / MIT. See LICENSE. | 1 / 3 | Pass |

## 3. Demo and sandbox

**PASS.** A fresh 390 px visit clicked **Try it with sample data** once and
opened `/?demo=1`. Before further interaction it showed the H1 “Choose the
next concept to repair”, a realistic 14-concept calculus map, the recommendation
“Fraction arithmetic”, and the persistent banner “Demo — Sample data. Nothing
is saved.” with **Reset demo** and **Start for real**.

**Reset demo** produced “Sample map reset.” The demo flow made no off-origin
request. The clean claim test separately created a real IndexedDB map, changed
a demo concept, reloaded and left demo, then confirmed the demo edit disappeared
and the real stored record was unchanged. The offline claim test waited for the
service worker, disconnected the network, reloaded `/demo`, and retained the
sample and Offline status.

Evidence: `/tmp/pathboard-review2-evidence/demo-first-mobile.png`.

## 4. Claims and clean-clone gates

I cloned the repository without hardlinks to `/tmp/pathboard-review2.OMw0aT`,
ran `npm ci`, then ran every exact command in `.factory/claims.json` separately.
All 14 passed. Each `@claim:` tag occurs exactly once in `tests/`.

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
| all-features-included | PASS |
| account-free | PASS |
| no-tracking | PASS |
| repair-history | PASS |

The clean checkout also passed `CI=1 npm test -- --workers=1` (39/39),
`npm run build` (created `dist/`), and `npm audit --audit-level=high` (zero
vulnerabilities). The test report records `status: passed` and no failed tests.

All claim-like landing and README statements map to the above registry. The
same live-page check found privacy and demo wording covered by `local-only`,
`demo-sandbox`, `account-free`, and `no-tracking`; no unlisted product claim
was found.

## 5. Earlier-review history

Every finding from review 1 was verified live and in the current code.

| Earlier ID | Result |
| --- | --- |
| F-1-1 claims coverage | Fixed: the registry now has rendered-edge and no-tracking tests; current wording is covered. |
| F-1-2 mobile target sizes | Fixed: fresh 390 px measurements found all visible controls at least 44 × 44 px. |
| F-1-3 keyboard-inaccessible preview | Fixed: the mobile preview fits without horizontal scrolling; live Axe is clean. |
| F-1-4 desktop facts below fold | Fixed: all facts were visible at 1440 × 900. |
| F-1-5 nested landmark | Fixed: live Axe found no violations. |
| F-1-6 static 404/sitemap mismatch | Fixed: unknown URL returned HTTP 404 with the designed current shell; `/404` is absent from the sitemap. |
| F-1-7 route social metadata | Fixed: each route supplied matching title, description, canonical, Open Graph, and Twitter metadata. |
| F-1-8 terminology and jargon | Fixed: the saved object is consistently “map”; user-facing wording is plain. |

The earlier verification findings for checkout, cyclic import, import limits,
refresh coverage, asset policy/MIME, and responsive layout remain fixed under
the current claim and regression suites. No regression was observed.

## 6. Structure, accessibility, and visual review

- Valid routes `/`, `/demo`, `/board`, `/privacy`, and `/terms` returned 200;
  an unknown route returned 404. Sitemap lists only real routes. All internal
  links and the Param Factory link returned 200; mail links are explicit.
- Each checked route had `lang="en"`, exactly one `<main>` and H1, route-specific
  title/description/canonical/Open Graph/Twitter metadata, favicon, and apple
  touch icon. The title pattern is product plus plain description for home and
  route plus product for other pages.
- Client navigation and Back moved focus to the new H1. Header/footer, skip
  link, Privacy, and Terms were present throughout, including the real 404.
- Live Axe scans on home, demo, board, privacy, terms, and unknown 404 at both
  390 px and desktop returned zero violations. There were no normal-route
  console or page errors.
- The night-ascent identity matches the recorded visual thesis: original ridge
  art, teal/ember map palette, editorial asymmetry, trail-marker controls, and
  reduced-motion implementation. It is not a generic SaaS template.

## 7. Missed leverage

No finding. The brief's obvious useful extensions are present: JSON and Markdown
export, import with recovery, offline use, local persistence, accessible list
view, and a one-click sandbox. AI would conflict with the stated deliberate,
user-authored dependency model and is correctly absent; no provider key or
decorative AI feature is exposed.

## What would make this perfect

Maintain this evidence discipline on future changes: keep the first screen at
the tested mobile and desktop sizes, preserve isolated demo storage, add a
claim test before adding any visitor promise, and rerun the route/Axe matrix
when changing the shared shell. This round has no remaining product work.
