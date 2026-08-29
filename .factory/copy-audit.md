# Landing copy audit

Audited August 29, 2026 for polish round 4. The first screen says what the
map does, who it is for, and what the sample action opens. Every landing and
README copy unit is 22 words or fewer and avoids the banned words.

| Landing text | Words | Result |
| --- | ---: | --- |
| Pathboard / Demo / My map / Privacy | 1 / 1 / 2 / 1 | Pass: navigation |
| A map for relearning | 4 | Pass |
| Map backward. Learn the next prerequisite. | 6 | Pass: job headline |
| For adults rebuilding technical knowledge who need one clear concept to work on next. | 14 | Pass |
| Try it with sample data | 5 | Pass: result-naming action |
| Opens an isolated 14-concept calculus map. | 6 | Pass |
| Works offline after the first visit. | 6 | Claim: `offline-reload` |
| Your map stays on this device. | 6 | Claim: `local-only` |
| Create multiple goals, track repairs, and export your map. | 9 | Claims: `multi-goal-map`, `repair-history`, exports |
| Example prerequisite map | 3 | Pass: semantic section heading |
| Every line comes from a dependency you enter. | 8 | Claim: `rendered-edges` |
| Statuses help the map find the first unresolved step. | 9 | Claim: `dependency-recommendation` |
| Build the map in three steps | 6 | Pass: names the process |
| Name the goal / Work backward / Mark and choose | 3 / 2 / 3 | Pass: task headings |
| Write the exact idea or problem you want to handle. | 10 | Pass |
| Add only the concepts your goal depends on. | 8 | Pass |
| Update each status. The map points to one ready repair. | 10 | Claim: `dependency-recommendation` |
| What the recommendation uses | 4 | Pass: semantic section heading |
| The recommendation uses only the dependencies and statuses you enter. | 10 | Claim: `dependency-recommendation` |
| Export your map as JSON or Markdown. No account is required. | 9 / 4 | Claims: exports, `account-free` |
| Included map features | 3 | Pass: semantic section heading |
| Create multiple goals, track repairs, and export your map. | 9 | Claims: `multi-goal-map`, repairs, exports |
| After one online visit, use the list view, repair history, and JSON or Markdown export. | 14 | Claims: offline, list, repairs, exports |
| Your map remains local to this browser. | 7 | Claim: `local-only` |
| Start your map / Export JSON or Markdown whenever you want a copy. | 3 / 9 | Pass: result-naming actions |
| Prerequisite Pathboard / Map backward. Choose one repair. | 2 / 5 | Pass: footer |

## README copy check

The README's product sentences use the same terms and map each product claim
to a registered test. Developer-only references to IndexedDB, Vite,
Playwright, and the service worker remain in Develop, Test, or Build.

| README text | Words | Result |
| --- | ---: | --- |
| Map prerequisites backward and choose the next concept to repair. | 10 | Pass |
| The map recommends one ready concept from the dependencies and statuses you enter. | 12 | Claim: `dependency-recommendation` |
| The recommendation follows only the dependencies you enter. | 8 | Claim: `dependency-recommendation` |
| The demo loads a 14-concept calculus map. | 7 | Claim coverage: demo/export tests |
| Its edits stay separate from your real map and disappear when you leave or reload. | 15 | Claim: `demo-sandbox` |
| Create multiple goals, track repairs, and export your map. | 9 | Claims: `multi-goal-map`, repairs, exports |
| After one online visit, reopen the map without a connection. | 10 | Claim: `offline-reload` |
| This app makes no tracking requests. | 7 | Claim: `no-tracking` |

## Terminology table

| Concept | One term used |
| --- | --- |
| Saved visual and data structure | map |
| Learning destination | goal |
| Required idea | prerequisite |
| Map item | concept |
| Knowledge state | status |
| Suggested work unit | next session |
| Completed gap | repair |
| Trial environment | demo |

Catalog description: “Map prerequisites backward to choose the next concept to repair.” (10 words, 64 characters.)
