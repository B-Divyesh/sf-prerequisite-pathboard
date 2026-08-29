# Independent product verification 4 — PASS

## Candidate and decision

- Product: Prerequisite Pathboard
- Work order: `prerequisite-pathboard-verify-4`
- Candidate commit: `0cfdb03764e1b0dd88811c10354835e818a73c53`
- Live URL: <https://prerequisite-pathboard.sociobot.in>
- Verified: 2026-08-29 UTC from the supplied clean checkout
- Result: **PASS — release candidate accepted**

Fresh evidence confirms the deployed static PWA is the candidate and completes
the brief's job. A learner can build a goal-backward dependency map, mark what
they can explain or solve, receive one next repair derived from their entries,
keep the map locally, and export it.

## Mandatory first gates

### Claims-first gate — PASS

`.factory/claims.json` exists. The clean checkout initially had no installed
packages, so the literal pre-install invocations could not initialize
Playwright. After the required `npm ci`, every listed command was rerun
separately and all 14 observable claim tests passed. The full suite also checks
that every registry entry has exactly one executable `@claim:<id>` test.

| Claim | Result | Evidence asserted by its registered test |
| --- | --- | --- |
| `offline-reload` | PASS | `/demo` reloads offline with the sample and Offline indicator. |
| `local-only` | PASS | A real private note/create/export flow makes no off-origin request. |
| `demo-sandbox` | PASS | Demo edits disappear and do not change the real IndexedDB record. |
| `json-export` | PASS | The sample export contains 14 concepts and 14 dependencies. |
| `markdown-export` | PASS | Markdown contains the goal, status, and dependency text. |
| `dependency-recommendation` | PASS | Repairing Fraction arithmetic advances the next concept. |
| `rendered-edges` | PASS | Rendered graph lines remain equal to entered/exported dependencies. |
| `refresh-persistence` | PASS | A goal and prerequisite survive reload and tab close/reopen. |
| `list-view` | PASS | The accessible linear view shows all 14 sample concepts and groups. |
| `import-error` | PASS | A cyclic import is rejected before persistence and valid recovery works. |
| `multi-goal-map` | PASS | Two goals and 26 concepts create/import/export intact. |
| `account-free` | PASS | A real goal is created with no credentials or sign-in. |
| `no-tracking` | PASS | Landing, demo, and real-board requests remain same-origin. |
| `repair-history` | PASS | A sixth repair is added and all six entries remain visible. |

### Cold first-read gate — PASS

A fresh desktop visit answers all three required questions in the first screen:

- What it does: “Map backward. Learn the next prerequisite.”
- For whom: “For adults rebuilding technical knowledge who need one clear
  concept to work on next.”
- What to click: **Try it with sample data**, followed by “Opens an isolated
  14-concept calculus map.”

The action is visible on desktop and at 390 × 844. One click opens
`/?demo=1`, already populated with the 14-concept calculus map, Fraction
arithmetic as the next session, and the persistent **Demo / Sample data.
Nothing is saved / Reset demo / Start for real** banner.

Evidence:

- `/work/.evidence/prerequisite-pathboard-verify-4/first-read-cold-desktop.png`
- `/work/.evidence/prerequisite-pathboard-verify-4/first-read-demo-desktop.png`
- `/work/.evidence/prerequisite-pathboard-verify-4/live-mobile-cold.png`
- `/work/.evidence/prerequisite-pathboard-verify-4/live-mobile-demo.png`

## Clean-checkout quality gates

```text
npm ci                                      PASS; 24 packages, 0 vulnerabilities
14 exact claims.json commands               PASS; 14/14
CI=1 npm test -- --workers=1                PASS; 46/46 Playwright tests
npm run build                               PASS; tsc --noEmit + Vite
npm audit --audit-level=high                PASS; 0 vulnerabilities
```

There is no separate lint script. Type checking is part of the exact production
build. `dist/` was produced with these budget results:

```text
JavaScript  33.36 kB raw / 10.81 kB gzip
CSS         18.93 kB raw / 5.15 kB gzip
Fonts        0 kB; system fonts only
Mobile AVIF 12.57 kB
```

## End-to-end and recovery exercise

- Created **Explain Bayes theorem**, added **Conditional probability** as its
  prerequisite, and added a private success note.
- The recommendation became Conditional probability. Marking that prerequisite
  **Can solve** advanced the recommendation to Explain Bayes theorem and added
  one repair-history entry.
- Reload retained both concepts. JSON export parsed as two concepts, one
  dependency, and one repair.
- An empty required title was rejected. The 90-character title boundary,
  two-goal/26-concept case, malformed repair input, and delete/edge consistency
  are exercised by the passing full suite. A self-loop was also refused live.
- A cyclic JSON import returned “This import contains a prerequisite loop,” did
  not replace the saved map, and a valid import immediately afterward worked.
- A keyboard-only run tabbed to the empty-state action, created a goal and a
  prerequisite, and activated List view with Space. Dialog focus starts in the
  title field, Escape closes it, and focus returns to its opener.
- SPA navigation, Back, and Forward update the title, focus the new H1, and
  populate the polite route announcement.

## Live privacy, headers, and links

- Fresh landing, demo, real create/edit/export, legal-route, and return-to-real
  flows made same-origin requests only. No user-entered data left the origin.
- A fresh demo had no IndexedDB database, localStorage key, or sessionStorage
  key before or after editing. Reload discarded the edit and restored the
  bundled sample.
- Browser response headers include HSTS, `nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive
  camera/microphone/geolocation policy, and a same-origin CSP with
  `frame-ancestors 'none'`.
- HTML, manifest, and service worker use 30-second revalidation. Hashed JS/CSS
  and art use `public, max-age=31536000, immutable`. AVIF is served as
  `image/avif`.
- All visible internal links and the Param Factory footer link returned 200;
  mail links are explicit. A genuinely unknown path returned HTTP 404 with the
  styled not-found document.
- No analytics, third-party script/font, runtime AI, product API, payment,
  product-unlock, or authentication endpoint exists. API allowance/429 and
  Entra authority checks are therefore not applicable; no allowance was
  observed because this artifact has no server-side endpoint.

The privacy, landing, demo, and README promises map to the 14 registered
claims. No unlisted visitor-reliant claim was found. AI is not missed leverage
for this deliberately learner-authored dependency tool.

## Accessibility and responsive behavior

- Independent live Axe scans of `/`, `/demo`, `/board`, `/privacy`, and
  `/terms` found zero violations, hence zero serious/critical findings. The
  complete local suite also scans both not-found paths.
- Each tested route has `lang="en"`, one H1, and one main landmark. Images have
  alt text and controls have names.
- At 390 × 844 there is no horizontal overflow, every visible landing/demo
  control is at least 44 × 44 CSS px, and all three first-screen facts end by
  811 px. The demo selects the linear list view on mobile.
- At 200% text size, the 390 px landing retains its H1 and demo action without
  horizontal overflow.
- Keyboard focus exposes the skip link with a 3 px cyan outline. Forms have
  labels, native required validation, announced errors, and managed dialog
  focus.
- With `prefers-reduced-motion: reduce`, transition and animation duration is
  0.01 ms and smooth scrolling is disabled.
- `/opt/fleet/lib/verify-url.sh` passed: 605 ms load, no console/page errors,
  title/lang/main/H1/alt/button checks pass. Evidence:
  `/work/.evidence/prerequisite-pathboard-verify-4/verify-url/verify.json`.

## PWA and performance

- Chromium reports a valid manifest with no errors, standalone display,
  product colors, versioned `/board?v=3` start URL, and decoded 192/512 maskable
  icons. The apple-touch icon is 180 × 180 and social card is 1200 × 630.
- After an online `/demo` visit, an offline reload retained Fraction arithmetic
  and displayed Offline.
- Live caches are `pathboard-v5-shell` and `pathboard-v5-runtime`. An actual
  replacement registration removed a seeded old cache and displayed “An update
  is ready. Reload to use it.”
- Fresh mobile Lighthouse: Performance 96, Accessibility 100, Best Practices
  100, SEO 100; FCP 981 ms, LCP 1,131 ms, TBT 235 ms, CLS 0, transferred weight
  35,497 bytes. A separate four-action repair flow had a maximum observed event
  duration of 48 ms, below the 200 ms interaction budget.
- Lighthouse evidence:
  `/work/.evidence/prerequisite-pathboard-verify-4/lighthouse-live-mobile.json`.

## Deployment identity

All 19 deployable files produced from the candidate match the live response
byte-for-byte, including HTML, service worker, manifest, icons, art, offline and
404 pages, social metadata assets, JS, CSS, and source map. Representative
SHA-256 values:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `8995a26405cc701e5cf0a1aa275fb3aa04562e27a95f0a59a72149efc770ae9c` |
| `service-worker.js` | `96a966761c957e4956106ef05e0eaed4bbe95caaa52435fce9bddfa45fc197f5` |
| `assets/index-ChIUHYWA.js` | `679116417c6cc86429608af7aaaa59b10a98afda8c40d0103f74d6b9014312f7` |
| `assets/index-Dgwga2Vc.css` | `634cfbe3b94580175183cb9ca584541c6f3c48622509c14bb62b100a9b07fffb` |

This fresh parity check supersedes any earlier deployment-only failure report.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Release decision

**PASS.** Candidate `0cfdb03764e1b0dd88811c10354835e818a73c53` is
accepted at the tested production URL. No unresolved release defect was found.
