# Polish round 1 — finding resolution

Candidate repaired: `84dbea9551ef678c548b1c9639a1c72f5bcd32ab`  
Live check: <https://prerequisite-pathboard.sociobot.in>

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added `rendered-edges` and `no-tracking` claims; strengthened `demo-sandbox` to prove the real IndexedDB record remains unchanged; removed untestable curriculum/diagnosis and implementation wording. | Clean clone: all 14 exact claim commands pass. `@claim:rendered-edges`, `@claim:no-tracking`, and `@claim:demo-sandbox`; `live-review.json`. |
| F-1-2 | Mobile wordmark and nav links now have 44 × 44 px minimum targets. The mobile suite measures every visible landing and demo control, including home. | `390px gives every visible landing and demo control a 44px target`; live `headerTargets` is 44 × 44 or larger in `live-review.json`. |
| F-1-3 | The mobile preview stacks vertically, has no horizontal overflow, and gets a mobile Axe scan. | `390px landing preview has no keyboard-inaccessible scroll region or axe violations`; live `mobilePreviewFits: true`; `live-home-mobile.png`. |
| F-1-4 | Reduced desktop hero height, padding, and display scale so all three facts are inside a 1440 × 900 first screen. | `desktop first screen keeps all three facts in view`; live fact bottoms are 849 px in `live-review.json`; `live-home-desktop.png`. |
| F-1-5 | Moved the details panel out of the labelled map region and changed it to a non-landmark container. Axe now fails on any severity. | Desktop and live demo Axe both report zero violations; `live-demo-mobile.png`. |
| F-1-6 | Rebuilt static 404 with skip link, full navigation/footer, version 1.2, canonical/social/icon metadata, and removed `/404` from sitemap. | `static 404 matches the product shell and is not indexed`; live unknown route returns HTTP 404; `live-404.html`. |
| F-1-7 | Added route-specific Open Graph/Twitter title and description data, updated on every SPA navigation. | `each route updates document and social metadata`; live `/demo`, `/board`, `/privacy`, and `/terms` metadata in `live-review.json`. |
| F-1-8 | Standardized the saved artifact as **map**; revised landing, README, 404, and copy audit; moved developer details out of feature copy. | `.factory/copy-audit.md`; `CI=1 npm test -- --workers=1` passes; cold live first-screen screenshots. |

The direct demo contract is also verified at `/?demo=1`: a fresh live visit
shows the sample banner, Reset demo, and Start for real before any setup.
