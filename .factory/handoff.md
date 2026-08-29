# Review 4 handoff — Prerequisite Pathboard

## Outcome

**FAIL — follow-up product work is required.**

- Reviewed commit: 2846858161bfdb426651af30493ed405d03b0ba8
- Reviewed URL: https://prerequisite-pathboard.sociobot.in
- Date: 2026-08-29 UTC
- Product code changed: no
- Detailed report: .factory/review-4.md

## Verified

    fresh clean clone + npm ci       PASS
    14 exact claims.json commands   PASS
    CI=1 npm test -- --workers=1    PASS; 41 tests
    npm run build                    PASS; dist/ produced
    live Axe route/viewport matrix  PASS; zero violations
    live demo, storage, requests    PASS

The live product is one-click tryable, uses an isolated in-memory demo, resets
it, keeps demo traffic same-origin, and passes every registered claim. Routing,
404, metadata, link crawl, local/offline checks, and the documented visual
identity also verify.

## Remaining defects

1. **Blocking:** At 390 × 844, the third mandatory first-screen fact ends at
   y=854. Shorten the mobile hero and add a mobile fact-placement test.
2. **Blocking:** “not a prescribed course” is a visitor promise with no
   claims.json entry/test. Remove it or register and prove it.
3. **Minor:** The content-naming eyebrows are not the actual H2s in the
   document outline.
4. **Minor:** README calls dependencies “links” once.

## Run locally

    npm ci
    npm test
    npm run build

After implementing the four fixes, re-run the clean-clone claims matrix, the
mobile first-screen measurement, and the route/Axe matrix.
