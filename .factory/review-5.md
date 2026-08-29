# Adversarial first-read review 5 — Prerequisite Pathboard

- Work order: `prerequisite-pathboard-review-5`
- Candidate reviewed: `63488c0ece5cd064d9592d04e36bbf0d0fe057ac`
- Live URL: <https://prerequisite-pathboard.sociobot.in>
- Reviewed: 2026-08-29 UTC
- Contexts: fresh Chromium contexts at 390 × 844 and 1440 × 900

## Verdict: PASS

There are **zero findings**. The cold first read, sample flow, claims, sandbox
isolation, earlier-finding history, routing, copy, accessibility, and link
checks all verify. This is a PASS rather than a conditional acceptance: no
blocking, major, minor, or untested claim remains.

## 1. Cold first read

Before scrolling, both fresh contexts answered the required questions.

| Question | Answer from the first screen |
| --- | --- |
| What does it do? | It maps a technical learning goal backward through its prerequisites and suggests the first unresolved concept to repair. |
| For whom? | Adults rebuilding technical knowledge. |
| What should I click first? | **Try it with sample data**. The adjacent text says it opens an isolated 14-concept calculus map. |

The text doing that work is: “Map backward. Learn the next prerequisite.”,
“For adults rebuilding technical knowledge who need one clear concept to work
on next.”, and “Try it with sample data.” No first-read blocking finding.

All three first-screen facts were visible without scrolling. Their bottom
coordinates were 730, 760, and 811 px at 390 × 844, and 849 px at 1440 × 900.
Normal loads had no console or page errors.

## 2. Copy audit

Counts use whitespace-separated words; product names, version strings, labels,
and code tokens count as one item where applicable. This lists every landing
copy unit and every prose sentence/heading in the README. No unit exceeds 22
words. No banned marketing wording, unexplained user-facing jargon,
inconsistent map/dependency term, non-informative heading, or non-result-naming
button was found. Therefore there are no proposed rewrites.

### Landing page

| Exact copy | Words | Check |
| --- | ---: | --- |
| Pathboard | 1 | Navigation label |
| Demo | 1 | Navigation label |
| My map | 2 | Navigation label |
| Privacy | 1 | Navigation label |
| Online | 1 | Status |
| A map for relearning | 4 | Context label |
| Map backward. | 2 | H1 sentence |
| Learn the next prerequisite. | 4 | H1 sentence |
| For adults rebuilding technical knowledge who need one clear concept to work on next. | 14 | Plain audience/outcome |
| Try it with sample data | 5 | Result-naming action |
| Opens an isolated 14-concept calculus map. | 6 | Demo outcome; verified by demo/export flow |
| Works offline after the first visit. | 6 | `offline-reload` |
| Your map stays on this device. | 6 | `local-only` |
| Create multiple goals, track repairs, and export your map. | 9 | `multi-goal-map`, `repair-history`, export claims |
| Next session | 2 | Product label |
| Fraction arithmetic | 2 | Sample concept |
| Nothing below it is still marked “Not yet.” | 8 | Sample-state explanation |
| Example prerequisite map | 3 | H2 names its section |
| Every line comes from a dependency you enter. | 8 | `rendered-edges` |
| Statuses help the map find the first unresolved step. | 9 | `dependency-recommendation` |
| Fraction arithmetic — Not yet | 4 | Sample node |
| Algebraic simplification — Not yet | 4 | Sample node |
| Difference quotients — Can explain | 4 | Sample node |
| Explain a derivative — Goal | 4 | Sample node |
| How it works | 3 | Process label |
| Build the map in three steps | 6 | H2 names its section |
| Name the goal | 3 | H3 |
| Write the exact idea or problem you want to handle. | 10 | Instruction |
| Work backward | 2 | H3 |
| Add only the concepts your goal depends on. | 8 | Instruction |
| Mark and choose | 3 | H3 |
| Update each status. | 3 | Instruction |
| The map points to one ready repair. | 7 | `dependency-recommendation` |
| What the recommendation uses | 4 | H2 names its section |
| The recommendation uses only the dependencies and statuses you enter. | 10 | `dependency-recommendation` |
| Export your map as JSON or Markdown. | 7 | `json-export`, `markdown-export` |
| No account is required. | 4 | `account-free` |
| Included map features | 3 | H2 names its section |
| Create multiple goals, track repairs, and export your map. | 9 | Registered claims; repeated deliberately |
| After one online visit, use the list view, repair history, and JSON or Markdown export. | 14 | `offline-reload`, `list-view`, `repair-history`, export claims |
| Your map remains local to this browser. | 7 | `local-only` |
| Start your map | 3 | Result-naming action |
| Export JSON or Markdown whenever you want a copy. | 9 | Export claims |
| Prerequisite Pathboard | 2 | Footer product name |
| Map backward. | 2 | Footer sentence |
| Choose one repair. | 3 | Footer sentence |
| Terms | 1 | Footer link |
| Built by Param Factory | 4 | Footer link |
| Opens in a new tab | 5 | Accessible external-link notice |
| Version 1.4 · Original generated artwork | 5 | Build/provenance label |

### README

| Exact copy | Words | Check |
| --- | ---: | --- |
| Prerequisite Pathboard | 2 | Document H1 |
| Map prerequisites backward and choose the next concept to repair. | 10 | Plain summary |
| Prerequisite Pathboard is for adults rebuilding a technical subject. | 9 | Audience |
| You add a goal, connect the ideas it depends on, and mark each concept as Not yet, Can explain, or Can solve. | 22 | At cap; clear and useful |
| The map recommends one ready concept from the dependencies and statuses you enter. | 12 | `dependency-recommendation` |
| Live site: https://prerequisite-pathboard.sociobot.in | 3 | Link |
| Try the demo | 3 | H2 |
| Open https://prerequisite-pathboard.sociobot.in/?demo=1 or run the app and visit ?demo=1. | 9 | Demo instruction |
| The /demo URL also works. | 4 | Route instruction |
| The demo loads a 14-concept calculus map. | 7 | Demo/export flow verifies sample |
| Its edits stay separate from your real map and disappear when you leave or reload. | 15 | `demo-sandbox` |
| Use Reset demo to restore the sample. | 7 | Demo instruction |
| What ships | 2 | H2 |
| A dependency map and an accessible list view. | 8 | `list-view` |
| One next-session recommendation from entered dependencies and statuses. | 8 | `dependency-recommendation` |
| The map stays in this browser. | 6 | `local-only` |
| JSON and Markdown exports with every concept and dependency. | 9 | Export claims |
| Invalid JSON imports are rejected with a recovery step. | 9 | `import-error` |
| After one online visit, reopen the map without a connection. | 10 | `offline-reload` |
| Create multiple goals, track repairs, and export your map. | 9 | Registered claims |
| The recommendation uses only the dependencies and statuses you enter. | 10 | `dependency-recommendation` |
| Develop | 1 | H2 |
| Requires Node.js 20 or newer. | 5 | Developer instruction |
| Vite serves the local site at the URL printed in the terminal. | 12 | Developer instruction |
| The real map uses a local IndexedDB database named prerequisite-pathboard. | 10 | Developer implementation note |
| Test | 1 | H2 |
| Playwright 1.58.2 is pinned in package.json. | 6 | Developer instruction |
| Each visitor promise in the interface and this README has a sandbox test in .factory/claims.json. | 14 | Confirmed by claim registry/test audit |
| Accessibility scans run on the landing, demo, privacy, terms, and not-found routes at desktop and mobile sizes. | 14 | Developer verification note |
| Build and deploy | 3 | H2 |
| The exact deploy command is npm run build. | 8 | Developer instruction |
| It creates dist/ with dist/index.html at its root. | 8 | Build outcome |
| Deploy dist/ as a static site. | 6 | Deployment instruction |
| public/staticwebapp.config.json provides route fallback, the styled 404 response, security headers, and asset rules for Azure Static Web Apps. | 18 | Developer implementation note |
| The service worker needs HTTPS in production. | 7 | Developer instruction |
| Localhost and 127.0.0.1 also allow it for development and tests. | 10 | Developer instruction |
| Data and privacy | 3 | H2 |
| Your map stays in this browser. | 6 | `local-only` |
| Demo changes stay separate from your real map. | 8 | `demo-sandbox` |
| This app makes no tracking requests. | 7 | `no-tracking` |
| See Privacy and Terms. | 4 | Links |
| Product records | 2 | H2 |
| Visual thesis / Demo contract / Claims and tests / Copy audit / Build handoff | 2 / 2 / 3 / 2 / 2 | Document links |
| License | 1 | H2 |
| MIT. | 1 | License sentence |
| See LICENSE. | 2 | Link instruction |

## 3. Demo and sandbox

**PASS.** One tap on the first-screen action entered `/?demo=1`. The first
product screen already showed the 14-concept calculus map, the “Fraction
arithmetic” next-session recommendation, five repair records, and the
persistent banner: “Demo”, “Sample data. Nothing is saved.”, “Reset demo”, and
“Start for real”. No setup or account was required.

Changing Fraction arithmetic to **Can explain** changed the next-session
recommendation to **Approaching a value**. **Reset demo** restored the sample.
Leaving by **Start for real** opened an empty real board after its asynchronous
board load; it did not retain the sample. A fresh demo context had no IndexedDB
database before leaving. The demo request log contained only
`https://prerequisite-pathboard.sociobot.in`.

## 4. Claims and clean-clone gates

I made a separate clean clone at `/tmp/pathboard-review5-clean.XUfv4o`, ran
`npm ci`, and ran every exact command listed by `.factory/claims.json`:

| Claim id | Result |
| --- | --- |
| offline-reload | Pass |
| local-only | Pass |
| demo-sandbox | Pass |
| json-export | Pass |
| markdown-export | Pass |
| dependency-recommendation | Pass |
| rendered-edges | Pass |
| refresh-persistence | Pass |
| list-view | Pass |
| import-error | Pass |
| multi-goal-map | Pass |
| account-free | Pass |
| no-tracking | Pass |
| repair-history | Pass |

`CI=1 npm test -- --workers=1` passed all 46 tests. `npm run build` passed and
produced `dist/`. The registry test confirms exactly one executable tagged test
for every registered claim. The current landing and README claim-like copy maps
to those entries; no unlisted visitor claim was found.

## 5. History verification

I read every earlier `review-*.md`, `polish-*.md`, and the current handoff.
The live site and current source confirm each earlier finding is actually fixed:

| Earlier finding | Live/code confirmation |
| --- | --- |
| F-1-1 claims coverage; F-4-2 recurrence | 14-entry registry, exact tagged tests, and no unsupported prescribed-course wording. |
| F-1-2 mobile targets; F-3-3 desktop wordmark | All visible header controls measure at least 44 × 44 px at 390 px; wordmark is 116 × 44 px at desktop. |
| F-1-3 keyboard preview | The 390 px preview is vertical, non-overflowing, and live Axe has no violation. |
| F-1-4 desktop facts; F-4-1 mobile facts | All three fact lines fit in both tested first screens. |
| F-1-5 nested landmark | Details are a non-landmark panel; Axe is clean on `/demo`. |
| F-1-6 stale/incomplete 404 | Unknown paths return 404 with the current shared shell, one H1/main, legal links, route metadata, and no sitemap entry. |
| F-1-7 route social metadata | Each route now has its own title, description, canonical, OG, and Twitter values. |
| F-1-8 terminology; F-4-4 relationship wording | Public product copy consistently uses **map** and **dependencies**. |
| F-3-1 capacity claim | Copy gives a tested bounded capability: two goals and 26 concepts. |
| F-3-2/F-4-3 heading semantics | Content names are direct H2s: Example prerequisite map, Build the map in three steps, What the recommendation uses, and Included map features. |

## 6. Structure, privacy, accessibility, and visual identity

- `/`, `/?demo=1`, `/demo`, `/board`, `/privacy`, and `/terms` returned 200;
  an unknown route returned 404.
- Every checked route at both viewports had one H1 and one main, route-specific
  title/description/canonical/OG/Twitter metadata, `lang="en"`, favicon, and
  apple-touch icon. All live Axe scans had zero violations.
- Forward navigation and browser Back moved focus to the new H1 and updated the
  polite route announcer. Internal links, the external Param Factory link, and
  explicit `mailto:` links resolved correctly; no dead link was found.
- Request logging for landing, demo, and real-board flows found only same-origin
  product traffic. There is no external runtime font, script, tracker, provider
  key, payment embed, or decorative AI surface.
- The night-ascent art, dark teal/ember palette, Georgia/system pairing,
  asymmetric editorial landing layout, trail-marker controls, and reduced-motion
  policy match `.factory/design.md` and are distinct from a generic SaaS
  template.

## 7. Missed leverage

No finding. The brief implies local persistence, offline use, sample data,
accessible non-graph access, recovery from invalid import, and portable export;
all are present and exercised. An AI feature would not improve this deliberately
user-authored dependency tool, so its absence is appropriate.

## What would make this perfect

The product is currently at the stated zero-finding standard. Keep the same
discipline on future changes: preserve the one-click isolated demo, exact
claim-test coverage, 390 px/desktop first-screen bounds, route metadata, and
the user-authored (rather than diagnostic) recommendation boundary.
