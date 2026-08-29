# Polish round 3 — zero-finding resolution

Candidate repaired: `addb17324af8cd88d16d886b9a61c4542e977950`  
Production: <https://prerequisite-pathboard.sociobot.in>

The review history was read in full: `review-1.md`, `review-2.md`,
`review-3.md`, and `polish-1.md`. Review 2 recorded zero findings. Every
finding from reviews 1 and 3 is mapped below; no finding is deferred.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 — claims coverage | Preserved the earlier rendered-edge, demo-isolation, and no-tracking coverage. Replaced the unbounded capacity wording with a bounded `multi-goal-map` claim and test. | Clean clone: all 14 exact `claims.json` commands passed. `@claim:rendered-edges`, `@claim:demo-sandbox`, `@claim:no-tracking`, and `@claim:multi-goal-map`; live same-origin flow: `/work/.evidence/prerequisite-pathboard-polish-3/live-privacy-requests.json`. |
| F-1-2 — mobile touch targets | Retained 44 × 44 px mobile controls and added the same 44 px minimum height to the desktop home wordmark. | `390px gives every visible landing and demo control a 44px target`; `desktop home target is at least 44px high`; live `wordmarkHeight: 44` in `live-recheck-final.json`. |
| F-1-3 — keyboard-inaccessible mobile preview | Kept the mobile preview in its vertical, non-scrolling layout. | `390px landing preview has no keyboard-inaccessible scroll region or axe violations`; live `mobile.previewFits: true`, `homeAxeViolations: 0`; screenshot `/work/.evidence/prerequisite-pathboard-polish-3/live-home-mobile.png`. |
| F-1-4 — facts below desktop fold | Retained the shortened desktop hero and verified the revised third fact still fits. | `desktop first screen keeps all three facts in view`; live fact bottoms are `849, 849, 849` in a 900 px viewport; screenshot `/work/.evidence/prerequisite-pathboard-polish-3/live-home-desktop.png`. |
| F-1-5 — nested landmark | Kept concept details as a non-landmark panel outside the labelled map area. | Local and live Playwright Axe route scans report zero violations; live `/demo` mobile screenshot: `/work/.evidence/prerequisite-pathboard-polish-3/live-demo-mobile.png`. |
| F-1-6 — stale/incomplete 404 | Retained the full static shell, current 1.3 build label, legal links, metadata, and omitted `/404` from the sitemap. | `static 404 matches the product shell and is not indexed`; live `/polish-3-missing-route` returns HTTP 404 with one main, one H1, matching metadata, and zero Axe violations in `live-recheck-final.json`. |
| F-1-7 — landing metadata on deep routes | Retained route-specific document, canonical, Open Graph, and Twitter values. | `each route updates document and social metadata`; live `/`, `/?demo=1`, `/demo`, `/board`, `/privacy`, `/terms`, and the 404 all match their expected titles and canonical URLs in `live-recheck-final.json`. |
| F-1-8 — inconsistent/jargon copy | Kept **map** as the saved artifact, left implementation terms in developer documentation, and refreshed the copy audit. | `.factory/copy-audit.md`; clean-clone test/build pass; cold live landing screenshot `/work/.evidence/prerequisite-pathboard-polish-3/live-home-desktop.png`. |
| F-3-1 — unprovable “without limits” claim | Removed “without limits” and “every goal” promises. Landing and README now say “Create multiple goals, track repairs, and export your map.” The claim names the tested bound: two goals and 26 concepts. | `@claim:multi-goal-map creates and exports a map with two goals and 26 concepts`; all 14 clean-clone claim commands pass; live probe reports `oldCapacityWords: false` in `live-recheck-final.json`. |
| F-3-2 — vague section labels | Renamed labels to **Example prerequisite map**, **What the recommendation uses**, **Included map features**, and **Build the map in three steps**. | Live probe recorded the three eyebrow labels in `live-recheck-final.json`; screenshot `/work/.evidence/prerequisite-pathboard-polish-3/live-home-desktop.png`; `.factory/copy-audit.md`. |
| F-3-3 — desktop home target | Added `.wordmark { min-height: 44px; }` at every breakpoint and synchronized the static 404 wordmark. | `desktop home target is at least 44px high`; live width × height is `116 × 44` in `live-recheck-final.json`. |

## Live recheck

Cold production checks passed after deployment. The first action has href
`/?demo=1`; it opened the 14-concept sample with the persistent Demo banner,
**Reset demo**, and **Start for real**. A temporary demo edit reset to
Fraction arithmetic, no IndexedDB database existed in the fresh demo context,
and leaving demo opened an empty real board. Offline reload retained the sample
under `pathboard-v4-shell` and displayed Offline.

The evidence is `/work/.evidence/prerequisite-pathboard-polish-3/live-recheck-final.json`.
