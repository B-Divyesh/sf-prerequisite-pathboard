# Demo sandbox

- URL: `https://prerequisite-pathboard.sociobot.in/?demo=1` (local: `http://localhost:5173/?demo=1`). The equivalent `/demo` route also works.
- Sample: a 14-concept map for explaining derivatives, with 14 user-authored dependencies and five completed repairs.
- Expected first recommendation: **Fraction arithmetic**. Mark it “Can explain” and **Approaching a value** becomes next.
- Reset: use **Reset demo** in the persistent demo banner.
- Leave: use **Start for real**. Demo changes are discarded.
- Namespace: demo state is held only in page memory. It never opens or writes the real IndexedDB database named `prerequisite-pathboard`; `@claim:demo-sandbox` verifies the real record remains unchanged.
- Offline: visit `/demo` once, wait for the page to settle, then disconnect and reload. The service worker supplies the app shell and sample data remains bundled in the JavaScript.
