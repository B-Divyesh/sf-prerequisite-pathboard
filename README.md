# Prerequisite Pathboard

Map prerequisites backward and choose the next concept to repair.

Prerequisite Pathboard is for adults rebuilding a technical subject. You add a goal, connect the ideas it depends on, and mark each concept as **Not yet**, **Can explain**, or **Can solve**. The map recommends one ready concept from only those links and statuses.

Live site: <https://prerequisite-pathboard.sociobot.in>

## Try the demo

Open <https://prerequisite-pathboard.sociobot.in/?demo=1> or run the app and visit `?demo=1`. The `/demo` URL also works.

The demo loads a 14-concept calculus map. Its edits stay separate from your real map and disappear when you leave or reload. Use **Reset demo** to restore the sample.

## What ships

- A dependency map and an accessible list view.
- One next-session recommendation from entered dependencies and statuses.
- The map stays in this browser.
- JSON and Markdown exports with every concept and dependency.
- Invalid JSON imports are rejected with a recovery step.
- After one online visit, reopen the map without a connection.
- Every goal, concept, repair entry, and export is included.

The recommendation uses only the dependencies and statuses you enter.

## Develop

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Vite serves the local site at the URL printed in the terminal. The real map uses a local IndexedDB database named `prerequisite-pathboard`.

## Test

Playwright 1.58.2 is pinned in `package.json`.

```sh
npm test
npm test -- --grep @claim:offline-reload
```

Each visitor promise in the interface and this README has a sandbox test in [.factory/claims.json](.factory/claims.json). Accessibility scans run on the landing, demo, privacy, terms, and not-found routes at desktop and mobile sizes.

## Build and deploy

```sh
npm run build
```

The exact deploy command is `npm run build`. It creates `dist/` with `dist/index.html` at its root. Deploy `dist/` as a static site. `public/staticwebapp.config.json` provides route fallback, the styled 404 response, security headers, and asset rules for Azure Static Web Apps.

The service worker needs HTTPS in production. Localhost and `127.0.0.1` also allow it for development and tests.

## Data and privacy

Your map stays in this browser. Demo changes stay separate from your real map. This app makes no tracking requests.

See [Privacy](https://prerequisite-pathboard.sociobot.in/privacy) and [Terms](https://prerequisite-pathboard.sociobot.in/terms).

## Product records

- [Visual thesis](.factory/design.md)
- [Demo contract](.factory/demo.md)
- [Claims and tests](.factory/claims.json)
- [Copy audit](.factory/copy-audit.md)
- [Build handoff](.factory/handoff.md)

## License

MIT. See [LICENSE](LICENSE).
