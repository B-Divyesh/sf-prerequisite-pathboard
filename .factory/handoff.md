# Review handoff — Prerequisite Pathboard

## Outcome

Adversarial first-read review 1 is complete. Verdict: **FAIL** with eight findings in `.factory/review-1.md`; F-1-1 through F-1-3 are blocking. Product code was not modified.

## What was checked

- Cold live loads at 390 × 844 and 1440 × 900 before scrolling.
- Every landing-page and README copy unit with word counts and plain-words flags.
- One-click demo content, banner, reset, real-data isolation, storage, same-origin traffic, and offline reload.
- Every `.factory/claims.json` command separately from a no-hardlink clean clone.
- Full test/build/audit gates, live accessibility scans, route metadata, 404 behavior, navigation focus, link crawl, response headers, and historical defects.
- Missed AI/import/export/sync leverage.

## Verification results

```text
npm ci                                      PASS
12 individual claim commands                PASS (12/12)
CI=1 npm test                               PASS (28/28)
npm run build                               PASS
npm audit --audit-level=high                PASS (0 vulnerabilities)
verify-url.sh / and /demo                   PASS
live offline demo reload                    PASS
live unknown-route HTTP status              PASS (404)
live mobile Axe                              FAIL (1 serious on /; 1 moderate on /demo)
```

The production build emits 32.22 kB JavaScript (10.75 kB gzip) and 18.69 kB CSS (5.09 kB gzip).

## Findings left for the repair worker

- F-1-1: unlisted visitor claims remain despite the README's complete-coverage statement.
- F-1-2: mobile Pathboard and Demo header targets are below 44 × 44 px; the current test misses them.
- F-1-3: the mobile landing preview is horizontally scrollable but not keyboard-focusable.
- F-1-4: all three plain facts sit below the 1440 × 900 first screen.
- F-1-5: the demo selected panel is a nested complementary landmark.
- F-1-6: the static 404 has stale version/navigation and incomplete metadata.
- F-1-7: deep-route Open Graph and Twitter copy remains landing-page copy.
- F-1-8: artifact terminology changes between map, board, pathboard, and route; the README exposes avoidable implementation jargon.

## Evidence

The committed review is `.factory/review-1.md`. Ephemeral screenshots and verifier output are under `/tmp/pathboard-review.lBKR9G/evidence/`; the disposable clean clone used for claim execution is `/tmp/pathboard-review.lBKR9G/clean/`.
