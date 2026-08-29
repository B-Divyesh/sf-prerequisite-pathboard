# Polish round 4 — complete finding resolution

- Reviewed candidate: `2846858161bfdb426651af30493ed405d03b0ba8`
- Product repair: `b93313d fix: resolve polish round four findings`
- Production: <https://prerequisite-pathboard.sociobot.in>
- Evidence root: `/work/.evidence/prerequisite-pathboard-polish-4/`

All earlier review and polish records were read. Review 2 had no finding IDs.
The table covers every ID raised by reviews 1, 3, and 4, including recurring
findings. No finding is deferred.

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the complete claim registry, added a registry guard that requires exactly one executable `@claim:` test per claim, and removed the later untestable “not a prescribed course” promise. | Clean clone: all 14 exact `claims.json` commands pass; `claims registry gives every claim exactly one executable tagged test`; live `/` has `prescribed: false` in `live-route-a11y.json`. |
| F-1-2 | Retained 44 × 44 px navigation and controls at mobile and desktop sizes. | `390px gives every visible landing and demo control a 44px target`; `desktop home target is at least 44px high`; live desktop/mobile Axe matrix has zero violations. |
| F-1-3 | Retained the vertical mobile prerequisite preview with no horizontal keyboard trap. | `390px landing preview has no keyboard-inaccessible scroll region or axe violations`; live `/` at 390 px has zero Axe violations in `live-route-a11y.json`. |
| F-1-4 | Retained the desktop first-screen fit. | `desktop first screen keeps all three facts in view`; live desktop fact bottoms are 849 px in a 900 px viewport. |
| F-1-5 | Retained the non-landmark concept details panel outside the labelled map landmark. | Local route accessibility tests and live `/demo` desktop/mobile Axe scans report zero violations. |
| F-1-6 | Retained the complete, current static 404 shell and non-indexed sitemap. | `static 404 matches the product shell and is not indexed`; live `/polish-4-missing-route` returns HTTP 404 with one H1, one main, correct metadata, and zero Axe violations. |
| F-1-7 | Retained route-specific document, canonical, Open Graph, and Twitter metadata. | `each route updates document and social metadata`; live `/`, `/?demo=1`, `/demo`, `/board`, `/privacy`, `/terms`, and the 404 match route metadata in `live-route-a11y.json`. |
| F-1-8 | Kept **map** as the saved artifact and replaced remaining public relationship wording with **dependencies**. | `.factory/copy-audit.md`; `README uses dependencies as the one relationship term`; live landing, demo, and terms checks in `live-route-a11y.json`. |
| F-3-1 | Retained the bounded two-goal, 26-concept statement and its observable export test. | `@claim:multi-goal-map creates and exports a map with two goals and 26 concepts`; clean-clone claim command passes. |
| F-3-2 | Made the content names direct semantic H2s. | `landing section headings name their content and omit the unsupported course promise`; live heading list is `Example prerequisite map`, `Build the map in three steps`, `What the recommendation uses`, and `Included map features`. |
| F-3-3 | Retained the 44 px desktop wordmark target. | `desktop home target is at least 44px high`; live route matrix reports the current Version 1.4 shell. |
| F-4-1 | Shortened the mobile hero’s padding and title scale without changing the night-ascent composition; added a 390 × 844 first-screen regression test. | `390px first screen keeps all three facts in view`; cold live mobile fact bottoms are 730, 760, and 811 px in `live-route-a11y.json`; `live-home-mobile.png`. |
| F-4-2 | Removed “A map you wrote, not a prescribed course,” so no unregistered visitor promise remains. | `landing section headings name their content and omit the unsupported course promise`; live `/` reports `prescribed: false` in `live-route-a11y.json`. |
| F-4-3 | Promoted **Example prerequisite map**, **What the recommendation uses**, and **Included map features** from visual eyebrows to their actual H2s. | Same heading regression test; desktop/mobile live heading lists in `live-route-a11y.json`; `live-home-desktop.png`. |
| F-4-4 | Rewrote the README and remaining public relationship copy to use **dependencies**, never the ambiguous “links.” | `README uses dependencies as the one relationship term`; `.factory/copy-audit.md`. |

## Production recheck

Cold production verification passed after deployment. `verify-url.sh` found HTTP
200, no console/page errors, `lang=en`, one H1, one main, complete image alt
text, and labelled buttons. The live route matrix scanned `/`, `/?demo=1`,
`/demo`, `/board`, `/privacy`, `/terms`, and a real 404 at both 1440 × 900 and
390 × 844 with zero Axe violations. The direct demo had no IndexedDB databases,
made only same-origin requests, reset a demo-only edit, and retained its sample
on an offline reload. See `live-route-a11y.json`, `live-offline.json`,
`live-home-mobile.png`, and `live-demo-mobile.png` in the evidence root.
