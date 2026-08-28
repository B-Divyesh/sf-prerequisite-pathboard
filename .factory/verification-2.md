# Independent product verification — PASS

## Candidate and scope

- Candidate commit: `a8496863d61918c3794e240e3db675054c561905`
- Live URL: <https://prerequisite-pathboard.sociobot.in>
- Verified: 2026-08-28 UTC from a clean checkout
- Result: **PASS — release candidate accepted**

No release-blocking defects were found. The deployment is the tested candidate, and it satisfies the researched brief's offline, local-first prerequisite-mapping job.

## Mandatory gates

### Claims first

`.factory/claims.json` exists and every listed command was run separately after `npm ci`, using the product's `/demo` entry point where applicable. All passed. The later full suite also passed (28 tests, zero failures).

| Claim ID | Result | Observable assertion |
| --- | --- | --- |
| `offline-reload` | PASS | Sample map reloads offline after service-worker readiness. |
| `local-only` | PASS | Real private note/create/export flow made no off-origin request. |
| `demo-sandbox` | PASS | Demo edit disappears on reload and after leaving demo. |
| `json-export` | PASS | Download parses with all 14 sample concepts and 14 links. |
| `markdown-export` | PASS | Download contains goal, status, and dependency text. |
| `dependency-recommendation` | PASS | Repairing Fraction arithmetic makes Approaching a value next. |
| `refresh-persistence` | PASS | Goal and prerequisite survive reload and a closed/reopened tab. |
| `list-view` | PASS | Linear list shows all 14 concepts and prerequisite grouping. |
| `import-error` | PASS | Cyclic JSON is rejected, does not persist, and valid recovery succeeds. |
| `all-features-included` | PASS | Two goals/26 concepts import and export intact. |
| `account-free` | PASS | A real goal can be created with no credential fields. |
| `repair-history` | PASS | Six marked repairs are visible after a further repair. |

### Cold first-read test

**PASS.** A fresh desktop visit (HTTP 200, no cache or prior storage) states all required facts in the first screen:

- What: “Map backward. Learn the next prerequisite.”
- For whom: “For adults rebuilding technical knowledge who need one clear concept to work on next.”
- First action: **Try it with sample data**, with the immediate outcome “Opens an isolated 14-concept calculus map.”

The action is one click, opens `/demo`, and the demo has the persistent “Demo — Sample data. Nothing is saved.” banner plus **Reset demo** and **Start for real**. Screenshot: `/work/.evidence/prerequisite-pathboard-verify-2/live-cold-desktop.png`.

## Clean checkout quality gates

```text
npm ci                         PASS; 25 packages audited, 0 vulnerabilities
each claims.json test command  PASS; 12/12
CI=1 npm test                  PASS; 28 Playwright tests, 0 failures
npm run build                  PASS; tsc --noEmit + Vite; dist/ created
npm audit --audit-level=high   PASS; 0 vulnerabilities
```

There is no separate lint script; TypeScript checking is part of the exact build. Production asset sizes are within budget:

```text
dist/assets/index-DLUcGyOU.js  32.22 kB (10.75 kB gzip)
dist/assets/index-DQtIkfnx.css 18.69 kB (5.09 kB gzip)
```

## End-to-end, boundary, and recovery evidence

- Fresh real board: created **Understand eigenvectors**, added **Matrix multiplication** as its prerequisite, switched to list view, reloaded, and retained both records. Recommendation was Matrix multiplication.
- Real-board JSON export parsed successfully with 2 concepts and 1 dependency.
- A semantically cyclic two-node import produced “This import contains a prerequisite loop. Remove the loop and try again,” left the existing board intact, and remained intact after reload.
- Demo recommendation, reset/isolation, JSON and Markdown export, list view, import recovery, 26-concept/two-goal import/export, account-free creation, and repair history are covered by the passed claim tests above.
- No account/sign-in is present; Entra validation and server concurrency/persistence checks are therefore not applicable. This is a static PWA and has no product server endpoint or product-unlock endpoint, so a rate-limit burst is not applicable.

Evidence screenshot: `/work/.evidence/prerequisite-pathboard-verify-2/live-real-board.png`.

## Live parity, privacy, policies, and PWA

- Local production and live SHA-256 values match for `index.html` (`e71c535f66b9cb406bcea5ee680738e3718806d444de5fc6c2097171d304aa49`), `service-worker.js` (`5ab5e46d507e2566fe2a44ce79803a88df4a255f4a1a2f4f0646d363873d896e`), built JS (`5a5ab138cc3138c60d42e0b54ebaf21aff0a2560749583bd28a07bf4ba42ddb0`), and CSS (`a9aec0922680260c4ec0e130361c2292479b96a8ff0d5ee53ccf97546dd79979`).
- Fresh landing/demo/real-board traffic had no off-origin requests, no console errors, and no page errors. There are no third-party fonts, analytics, account flows, or runtime AI/payment calls.
- Live responses include HSTS, CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and restrictive camera/microphone/geolocation policy. Unknown routes return HTTP 404 with the styled page. Hashed JS and art are immutable for one year; AVIF is served as `image/avif`.
- Service worker `pathboard-v2-shell` controls the live site. After one online `/demo` visit, offline reload retained Fraction arithmetic and displayed Offline. A persistent-profile update simulation seeded `pathboard-v1-shell`, re-registered the live worker, removed the old cache, and displayed “An update is ready. Reload to use it.”

## Accessibility, responsive, and performance

- Live Axe (`@axe-core/playwright`) on `/`, `/demo`, `/board`, `/privacy`, `/terms`, and `/404`: **zero serious or critical violations**.
- Routes have one `h1` and one `main`; rendered titles, `lang=en`, labels, alt text, and headings are present. Keyboard starts at the skip link; its measured visible focus is a 3 px `#8fc9cc` outline. Dialog focus/escape restoration is covered by the passing suite.
- At 390×844, the first screen and demo have no horizontal overflow; demo automatically selects the accessible list view. The 200% text, 44 px control, and 90-character unbroken-title cases pass in the mobile suite.
- Reduced-motion behavior is covered by the shipped CSS/test suite; no errors occurred in normal live flows.
- Fresh live mobile Lighthouse: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**; FCP 930 ms, LCP 1,080 ms, TBT 2 ms, CLS 0. Evidence: `/work/.evidence/prerequisite-pathboard-verify-2/lighthouse-live-mobile-retry.json`.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

The earlier verification's checkout, cyclic-import, import-limit, mobile-overflow, 404, MIME, and cache-policy findings are repaired in this candidate and were independently retested above.
