# Independent verification handoff

## Status: FAIL — do not release

- Product: Prerequisite Pathboard
- Candidate: `0c98ecbf463895cf9b9b45dd631561acc48f14c0`
- Live URL: <https://prerequisite-pathboard.sociobot.in>
- Verified: 2026-08-28 UTC
- Full report: [`.factory/verification.md`](verification.md)

The live deployment matches the candidate byte-for-byte for the HTML, manifest, service worker, JS, and CSS. The free happy path is useful and the automated suite is green, but release is blocked.

## Release blockers

1. **Critical:** the advertised $24 checkout endpoint returns HTTP 404 instead of redirecting to hosted checkout.
2. **High:** a cyclic version-1 JSON import is accepted and persisted, then hangs `/board`; the user must clear site storage to recover.
3. **High:** an unlicensed import accepts 26 concepts and two goals, producing `2/1 goal · 26/25 concepts` and bypassing paid limits.
4. **High:** claim tests under-assert the free-limit, paid-license, one-time-price, persistence, and privacy promises; several visitor-facing privacy/demo statements are unlisted.

Medium findings cover sub-44 px mobile targets, clipping at 200% text size, broken 90-character unspaced titles, HTTP 200 for missing pages, 30-second caching on hashed assets, and the wrong AVIF MIME type.

## What passed

- Cold first-read and one-click isolated sample demo.
- `npm ci`, all 21 Playwright tests, `tsc --noEmit`, production build, and high-severity dependency audit.
- Real goal/prerequisite/status/recommendation flow, IndexedDB reload and tab-close persistence, demo reset/isolation, exports, and ordinary invalid-input recovery.
- Desktop and 390 px normal layouts, keyboard focus/focus restoration, reduced motion, and zero Axe serious/critical findings on all routes.
- Same-origin-only real map flow; no analytics, CDN fonts/scripts, secrets, or sign-in.
- PWA manifest, offline demo and deep-route reload, cache cleanup, and update toast.
- License verification API rate limit: first 429 at request 31 in a burst of 40, with `Retry-After: 4`.
- Lighthouse mobile: 98 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.09 s, CLS 0, measured interaction duration 112 ms.
- Bundle: 11.56 kB gzip JS and 5.09 kB gzip CSS.

## Reproduce and verify

```sh
npm ci
npm test
npm run build
npm audit --audit-level=high
```

Key manual reproductions and exact response evidence are in `.factory/verification.md`. The verifier changed documentation only; product source was not modified.

## Next steps

1. Register/enable the production Sociobot product and verify that checkout redirects and a real return license verifies.
2. Validate imported boards fully before persistence: reject cycles and malformed concept/repair fields with an announced recovery step.
3. Apply free limits atomically to imports, and add boundary tests for 25/26 concepts and one/two goals.
4. Replace markup-only/partial claim tests with end-to-end assertions and register every privacy/demo promise.
5. Fix mobile touch targets, 200% text reflow, long-token wrapping, real 404 status, immutable caching for hashed assets, and `image/avif` mapping.
6. Rerun every claim command and the full independent verification matrix against the repaired deployment.
