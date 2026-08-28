import './style.css';
import { sampleBoard } from './sample';
import { emptyBoard, type BoardState, type Concept, type KnowledgeStatus } from './types';
import { ancestors, depthFromGoal, recommendation, statusLabel, toMarkdown, uid, validateBoard, wouldCreateCycle } from './model';
import { loadBoard, saveBoard } from './storage';
import { BUY_URL, captureLicense, clearLicense, hasPaidLicense, storeLicense, verifyLicense } from './license';

const app = document.querySelector<HTMLDivElement>('#app')!;
let state: BoardState = emptyBoard();
let isDemo = false;
let selectedId: string | null = null;
let view: 'board' | 'list' = matchMedia('(max-width: 620px)').matches ? 'list' : 'board';
let storageError = '';
let toastTimer = 0;

const esc = (value: string): string => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);

const routeInfo: Record<string, { title: string; description: string }> = {
  '/': { title: 'Prerequisite Pathboard — Map what to learn next', description: 'Map a technical goal backward through its prerequisites, then choose one small concept to repair next.' },
  '/demo': { title: 'Demo — Prerequisite Pathboard', description: 'Try a sample prerequisite map without saving changes to your real data.' },
  '/board': { title: 'My board — Prerequisite Pathboard', description: 'Map your goal backward and choose the next prerequisite to repair.' },
  '/privacy': { title: 'Privacy — Prerequisite Pathboard', description: 'How Prerequisite Pathboard stores your map and license on your device.' },
  '/terms': { title: 'Terms — Prerequisite Pathboard', description: 'Terms for using Prerequisite Pathboard and its one-time license.' },
  '/404': { title: 'Page not found — Prerequisite Pathboard', description: 'This path does not exist.' }
};

function currentPath(): string {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  return routeInfo[path] ? path : '/404';
}

function setMetadata(path: string): void {
  const info = routeInfo[path];
  document.title = info.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = info.description;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = `https://prerequisite-pathboard.sociobot.in${path === '/' ? '/' : path}`;
}

function header(): string {
  return `<a class="skip-link" href="#main">Skip to main content</a>
    <header class="site-header">
      <a class="wordmark" href="/" data-nav aria-label="Prerequisite Pathboard home"><span class="route-mark" aria-hidden="true">⌁</span> Pathboard</a>
      <nav aria-label="Main navigation">
        <a href="/demo" data-nav>Demo</a><a href="/board" data-nav>My board</a><a href="/privacy" data-nav>Privacy</a>
      </nav>
      <span class="network-state" data-network>${navigator.onLine ? 'Online' : 'Offline'}</span>
    </header>`;
}

function footer(): string {
  return `<footer class="site-footer">
    <p><strong>Prerequisite Pathboard</strong><br><span>Map backward. Choose one repair.</span></p>
    <nav aria-label="Footer navigation"><a href="/privacy" data-nav>Privacy</a><a href="/terms" data-nav>Terms</a><a href="https://hello-factory.sociobot.in" target="_blank" rel="noreferrer">Built by Param Factory <span class="sr-only">(opens in a new tab)</span></a></nav>
    <p class="build-id">Version 1.0 · Original generated artwork</p>
  </footer>`;
}

function shell(main: string): string {
  return `${header()}${main}${footer()}<div class="toast" role="status" aria-live="polite" data-toast></div><div class="route-announcer sr-only" aria-live="polite"></div>`;
}

function landingPage(): string {
  return shell(`<main id="main">
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">A map for relearning</p>
        <h1 tabindex="-1">Map backward. Learn the next prerequisite.</h1>
        <p class="hero-intro">For adults rebuilding technical knowledge who need one clear concept to work on next.</p>
        <div class="hero-action"><a class="button primary" href="/demo" data-nav>Try it with sample data</a><span>Opens an isolated 14-concept calculus map.</span></div>
        <ul class="plain-facts" aria-label="Product facts"><li>Works offline after the first visit.</li><li>Your map stays on this device.</li><li>One goal is free. Lifetime access costs $24.</li></ul>
      </div>
      <div class="hero-art">
        <picture><source type="image/webp" srcset="/art/night-ascent-768.webp 768w, /art/night-ascent-1280.webp 1280w" sizes="(max-width: 760px) 100vw, 58vw"><img src="/art/night-ascent-1280.jpg" width="1280" height="853" fetchpriority="high" alt="A chain of warm trail lights climbs toward an observatory on a dark mountain ridge."></picture>
        <div class="trail-note"><span>Next session</span><strong>Fraction arithmetic</strong><small>Nothing below it is still marked “Not yet.”</small></div>
      </div>
    </section>

    <section class="preview-section" aria-labelledby="preview-title">
      <div class="section-heading"><p class="eyebrow">See the structure</p><h2 id="preview-title">A route you wrote, not a prescribed course</h2><p>Every line comes from a dependency you enter. Statuses help the board find the first unresolved step.</p></div>
      <div class="mini-board" aria-label="Example prerequisite path">
        <div class="mini-node ready">Fraction arithmetic <span>Not yet</span></div><span class="mini-edge" aria-hidden="true">→</span>
        <div class="mini-node">Algebraic simplification <span>Not yet</span></div><span class="mini-edge" aria-hidden="true">→</span>
        <div class="mini-node known">Difference quotients <span>Can explain</span></div><span class="mini-edge" aria-hidden="true">→</span>
        <div class="mini-node goal">Explain a derivative <span>Goal</span></div>
      </div>
    </section>

    <section class="steps" aria-labelledby="steps-title"><div class="section-heading"><p class="eyebrow">How it works</p><h2 id="steps-title">Build the route in three moves</h2></div>
      <ol><li><span>01</span><h3>Name the goal</h3><p>Write the exact idea or problem you want to handle.</p></li><li><span>02</span><h3>Work backward</h3><p>Add only the concepts your goal depends on.</p></li><li><span>03</span><h3>Mark and choose</h3><p>Update each status. The board points to one ready repair.</p></li></ol>
    </section>

    <section class="limits" aria-labelledby="limits-title"><div><p class="eyebrow">Clear boundaries</p><h2 id="limits-title">A reasoning aid, not a diagnosis</h2></div><div><p>The board does not generate a curriculum or predict mastery. It uses only the dependencies and statuses you enter.</p><p>Export every concept and connection as JSON or Markdown. No account is required.</p></div></section>

    <section class="pricing" aria-labelledby="pricing-title"><div><p class="eyebrow">Keep the map for the long term</p><h2 id="pricing-title">One useful goal is free</h2><p>Build one goal with up to 25 concepts. Offline use, list view, and both exports stay free.</p></div><div class="price-panel"><p class="price"><strong>$24</strong> <span>one time</span></p><p>Add unlimited goals and concepts. Keep a full repair history.</p><a class="button primary" href="${BUY_URL}">Buy lifetime access</a><button class="text-button" type="button" data-open-license>Have a license? Paste it</button><small>Sociobot/Dodo is the merchant of record.</small></div></section>
    ${licenseDialog()}
  </main>`);
}

function demoBanner(): string {
  return `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo</strong><span>Sample data. Nothing is saved.</span><button type="button" data-reset-demo>Reset demo</button><a href="/board" data-nav>Start for real</a></aside>`;
}

function appPage(): string {
  const goals = state.concepts.filter((item) => item.kind === 'goal');
  const goal = goals.find((item) => item.id === state.activeGoalId) ?? goals[0] ?? null;
  if (goal && state.activeGoalId !== goal.id) state.activeGoalId = goal.id;
  const next = recommendation(state, goal?.id ?? null);
  const paid = isDemo || hasPaidLicense();
  return shell(`${isDemo ? demoBanner() : ''}<main id="main" class="workspace">
    <section class="workspace-head">
      <div><p class="eyebrow">${isDemo ? 'Sample calculus map' : 'Your local map'}</p><h1 tabindex="-1">Choose the next concept to repair</h1><p>Map the prerequisites yourself. The recommendation follows only those links.</p></div>
      <div class="workspace-actions"><button class="button primary" type="button" data-add-goal>Add goal</button><button class="button secondary" type="button" data-export-menu>Export map</button><label class="button secondary file-button">Import JSON<input type="file" accept="application/json,.json" data-import></label></div>
    </section>
    ${storageError ? `<div class="error-banner" role="alert">${esc(storageError)} Changes will stay on this screen. Export JSON before closing it.</div>` : ''}
    ${!paid ? `<div class="free-note"><span>Free board: ${goals.length}/1 goal · ${state.concepts.length}/25 concepts</span><a href="${BUY_URL}">Buy lifetime access for $24</a></div>` : ''}
    ${goals.length === 0 ? emptyWorkspace() : boardWorkspace(goal!, next)}
    ${conceptDialog()}
    ${connectionDialog()}
    ${exportDialog()}
    ${licenseDialog()}
  </main>`);
}

function emptyWorkspace(): string {
  return `<section class="empty-workspace" aria-labelledby="empty-title"><div class="empty-trail" aria-hidden="true"><i></i><i></i><i></i></div><div><h2 id="empty-title">Your first route starts with a goal</h2><p>Goals and their prerequisites will appear here. Name one idea you want to explain or solve.</p><button class="button primary" type="button" data-add-goal>Add your first goal</button><button class="text-button" type="button" data-load-sample>Load sample map instead</button></div></section>`;
}

function boardWorkspace(goal: Concept, next: Concept | null): string {
  const relevant = ancestors(state, goal.id);
  const count = relevant.size;
  return `<section class="recommendation" aria-labelledby="next-title"><div class="beacon" aria-hidden="true"></div><div><p class="eyebrow">Next session</p><h2 id="next-title">${next ? esc(next.title) : 'No unresolved step is ready'}</h2><p>${next ? 'Its entered prerequisites are already marked “Can explain” or “Can solve.”' : 'Mark a prerequisite as known, or add the missing step below this goal.'}</p></div>${next ? `<button class="button primary" type="button" data-select="${next.id}">Open this concept</button>` : ''}</section>
    <div class="board-toolbar">
      <label>Goal<select data-goal-select>${state.concepts.filter((item) => item.kind === 'goal').map((item) => `<option value="${item.id}" ${item.id === goal.id ? 'selected' : ''}>${esc(item.title)}</option>`).join('')}</select></label>
      <div class="view-switch" role="group" aria-label="Choose board view"><button type="button" data-view="board" aria-pressed="${view === 'board'}">Board</button><button type="button" data-view="list" aria-pressed="${view === 'list'}">List</button></div>
      <span>${count} concept${count === 1 ? '' : 's'} on this route</span>
      <button type="button" data-add-prerequisite>Add prerequisite</button><button type="button" data-connect>Connect concepts</button>
    </div>
    <section class="path-area" aria-label="Prerequisite map">
      ${view === 'board' ? graphView(goal.id, next?.id ?? null) : listView(goal.id, next?.id ?? null)}
      ${selectedPanel()}
    </section>
    ${state.repairs.length ? `<details class="repair-log"><summary>${state.repairs.length} marked repair${state.repairs.length === 1 ? '' : 's'}</summary><ol>${state.repairs.slice().reverse().slice(0, isDemo || hasPaidLicense() ? 100 : 5).map((item) => `<li><span>${esc(item.conceptTitle)}</span><span>${statusLabel[item.status]}</span><time datetime="${item.at}">${new Date(item.at).toLocaleDateString()}</time></li>`).join('')}</ol></details>` : ''}`;
}

function layout(goalId: string): { items: Array<Concept & { x: number; y: number; depth: number }>; width: number; height: number } {
  const relevant = ancestors(state, goalId);
  const depths = depthFromGoal(state, goalId);
  const maxDepth = Math.max(...depths.values());
  const groups = new Map<number, Concept[]>();
  state.concepts.filter((item) => relevant.has(item.id)).forEach((item) => {
    const depth = depths.get(item.id) ?? 0;
    groups.set(depth, [...(groups.get(depth) ?? []), item]);
  });
  const height = Math.max(420, ...[...groups.values()].map((group) => group.length * 126 + 48));
  const items = [...groups.entries()].flatMap(([depth, group]) => group.sort((a, b) => a.title.localeCompare(b.title)).map((item, index) => ({ ...item, depth, x: (maxDepth - depth) * 260 + 30, y: 40 + index * 126 + Math.max(0, (height - group.length * 126) / 2 - 24) })));
  return { items, width: (maxDepth + 1) * 260 + 40, height };
}

function graphView(goalId: string, nextId: string | null): string {
  const data = layout(goalId);
  const byId = new Map(data.items.map((item) => [item.id, item]));
  const paths = state.edges.map((edge) => {
    const from = byId.get(edge.prerequisiteId); const to = byId.get(edge.dependentId);
    if (!from || !to) return '';
    const x1 = from.x + 210, y1 = from.y + 43, x2 = to.x, y2 = to.y + 43;
    return `<path d="M${x1} ${y1} C${x1 + 60} ${y1},${x2 - 60} ${y2},${x2} ${y2}" class="${from.status !== 'not_yet' ? 'lit' : ''}"/>`;
  }).join('');
  return `<div class="graph-scroll" tabindex="0" aria-label="Scrollable graph view. Use the list view for a linear reading order."><div class="graph-stage" style="width:${data.width}px;height:${data.height}px"><svg aria-hidden="true" width="${data.width}" height="${data.height}" viewBox="0 0 ${data.width} ${data.height}">${paths}</svg>${data.items.map((item) => nodeButton(item, nextId, `left:${item.x}px;top:${item.y}px`)).join('')}</div></div>`;
}

function nodeButton(item: Concept, nextId: string | null, style = ''): string {
  return `<button type="button" class="concept-node status-${item.status} ${item.id === selectedId ? 'selected' : ''} ${item.id === nextId ? 'recommended' : ''}" style="${style}" data-select="${item.id}" aria-label="${esc(item.title)}, ${item.kind === 'goal' ? 'goal, ' : ''}${statusLabel[item.status]}${item.id === nextId ? ', next session recommendation' : ''}"><span>${esc(item.title)}</span><small>${item.kind === 'goal' ? 'Goal · ' : ''}${statusLabel[item.status]}</small></button>`;
}

function listView(goalId: string, nextId: string | null): string {
  const relevant = ancestors(state, goalId);
  const depths = depthFromGoal(state, goalId);
  const grouped = [...new Set(depths.values())].sort((a, b) => a - b);
  return `<div class="list-view">${grouped.map((depth) => `<section aria-labelledby="depth-${depth}"><h3 id="depth-${depth}">${depth === 0 ? 'Goal' : depth === 1 ? 'Direct prerequisites' : `${depth} steps before the goal`}</h3><ul>${state.concepts.filter((item) => relevant.has(item.id) && depths.get(item.id) === depth).sort((a, b) => a.title.localeCompare(b.title)).map((item) => `<li>${nodeButton(item, nextId)}</li>`).join('')}</ul></section>`).join('')}</div>`;
}

function selectedPanel(): string {
  const item = state.concepts.find((concept) => concept.id === selectedId);
  if (!item) return `<aside class="selected-panel"><p class="eyebrow">Concept details</p><h2>Select a concept</h2><p>Open any trail marker to edit its status, title, or notes.</p></aside>`;
  const prerequisites = state.edges.filter((edge) => edge.dependentId === item.id).map((edge) => state.concepts.find((concept) => concept.id === edge.prerequisiteId)).filter(Boolean) as Concept[];
  return `<aside class="selected-panel"><p class="eyebrow">${item.kind === 'goal' ? 'Goal' : 'Concept'}</p><h2>${esc(item.title)}</h2><p>${item.notes ? esc(item.notes) : 'No notes yet.'}</p><dl><div><dt>Status</dt><dd>${statusLabel[item.status]}</dd></div><div><dt>Prerequisites</dt><dd>${prerequisites.length ? prerequisites.map((concept) => esc(concept.title)).join(', ') : 'None entered'}</dd></div></dl><div class="panel-actions"><button class="button primary" type="button" data-edit="${item.id}">Edit concept</button><button class="button secondary" type="button" data-add-prerequisite="${item.id}">Add prerequisite</button></div></aside>`;
}

function conceptDialog(): string {
  return `<dialog data-concept-dialog><form method="dialog" data-concept-form><div class="dialog-head"><div><p class="eyebrow" data-dialog-eyebrow>New trail marker</p><h2 data-dialog-title>Add a prerequisite</h2></div><button class="icon-button" value="cancel" aria-label="Close dialog">×</button></div><input type="hidden" name="conceptId"><input type="hidden" name="kind"><input type="hidden" name="dependentId"><label>Concept title<input name="title" maxlength="90" required autocomplete="off"></label><label>What counts as enough for you?<textarea name="notes" maxlength="400" rows="4"></textarea></label><fieldset><legend>Current status</legend><label><input type="radio" name="status" value="not_yet" checked> Not yet</label><label><input type="radio" name="status" value="explain"> Can explain</label><label><input type="radio" name="status" value="solve"> Can solve</label></fieldset><p class="form-error" role="alert" data-form-error></p><div class="dialog-actions"><button class="button secondary" value="cancel">Cancel</button><button class="button primary" value="default" data-save-concept>Save concept</button></div><button class="danger-link" type="button" data-delete-concept hidden>Delete this concept</button></form></dialog>`;
}

function connectionDialog(): string {
  const options = state.concepts.map((item) => `<option value="${item.id}">${esc(item.title)}</option>`).join('');
  return `<dialog data-connection-dialog><form method="dialog" data-connection-form><div class="dialog-head"><div><p class="eyebrow">Add one dependency</p><h2>Connect two concepts</h2></div><button class="icon-button" value="cancel" aria-label="Close dialog">×</button></div><label>Prerequisite<select name="prerequisiteId" required>${options}</select></label><label>Needed for<select name="dependentId" required>${options}</select></label><p class="form-hint">The prerequisite will appear before the second concept.</p><p class="form-error" role="alert" data-connection-error></p><div class="dialog-actions"><button class="button secondary" value="cancel">Cancel</button><button class="button primary" value="default" data-save-connection>Connect concepts</button></div></form></dialog>`;
}

function exportDialog(): string {
  return `<dialog data-export-dialog><div class="dialog-head"><div><p class="eyebrow">Portable by design</p><h2>Export your whole map</h2></div><button class="icon-button" data-close-dialog aria-label="Close dialog">×</button></div><p>Both files include every goal, concept, status, and dependency.</p><div class="export-options"><button class="button primary" type="button" data-export="json">Export JSON</button><button class="button secondary" type="button" data-export="markdown">Export Markdown</button></div></dialog>`;
}

function licenseDialog(): string {
  return `<dialog data-license-dialog><form method="dialog" data-license-form><div class="dialog-head"><div><p class="eyebrow">Restore purchase</p><h2>Paste your license</h2></div><button class="icon-button" value="cancel" aria-label="Close dialog">×</button></div><label>License token<input name="license" required autocomplete="off" spellcheck="false"></label><p class="form-hint">The token stays on this device. It is sent only to Sociobot for verification.</p><p class="form-error" role="alert" data-license-error></p><div class="dialog-actions"><button class="button secondary" value="cancel">Cancel</button><button class="button primary" value="default" data-save-license>Verify license</button></div>${hasPaidLicense() ? '<button class="danger-link" type="button" data-remove-license>Remove license from this device</button>' : ''}</form></dialog>`;
}

function privacyPage(): string {
  return shell(`<main id="main" class="prose-page"><p class="eyebrow">Privacy</p><h1 tabindex="-1">Your map stays on your device</h1><p class="lede">Prerequisite Pathboard has no account system, ads, or analytics.</p><h2>What is stored</h2><p>Your real pathboard is stored in your browser’s IndexedDB database. A license token and its latest verdict are stored in localStorage. Demo edits stay in memory and disappear when you leave or reload.</p><h2>What is sent</h2><p>Your concepts, notes, statuses, and exported files are never sent by this app. When you add a license, the token goes to <code>api.sociobot.in</code> to check whether it is active.</p><h2>What you control</h2><p>You can export your map as JSON or Markdown. Clear this site’s browser storage to remove local data. You can also remove a saved license inside the board.</p><p>Effective: August 28, 2026. Questions: <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a></p></main>`);
}

function termsPage(): string {
  return shell(`<main id="main" class="prose-page"><p class="eyebrow">Terms</p><h1 tabindex="-1">Use the board as a planning aid</h1><p class="lede">Prerequisite Pathboard helps you record your own learning dependencies. It does not diagnose knowledge or promise results.</p><h2>Using the product</h2><p>You are responsible for the concepts and links you enter. Keep exports if the map matters to you. Browser data can be lost when storage is cleared.</p><h2>Free and paid use</h2><p>The free version includes one goal with up to 25 concepts. A $24 one-time purchase adds unlimited goals, unlimited concepts, and full repair history for this product version.</p><h2>Payment and refunds</h2><p>Sociobot/Dodo is the merchant of record. Checkout, receipts, and refunds are handled there. A refunded or revoked license stops paid access.</p><h2>Availability</h2><p>The software is provided as is, without a guarantee of uninterrupted availability. You retain ownership of the map you create.</p><p>Effective: August 28, 2026. Questions: <a href="mailto:support@sociobot.in">support@sociobot.in</a></p></main>`);
}

function notFoundPage(): string {
  return shell(`<main id="main" class="not-found"><p class="eyebrow">Trail marker 404</p><h1 tabindex="-1">This path ends here</h1><p>The page may have moved. Your saved map is not affected.</p><a class="button primary" href="/" data-nav>Return to the pathboard</a></main>`);
}

async function render(focusHeading = false): Promise<void> {
  const path = currentPath();
  setMetadata(path);
  if (path === '/demo') {
    if (!isDemo) state = sampleBoard();
    isDemo = true;
    selectedId ??= recommendation(state, state.activeGoalId)?.id ?? null;
    app.innerHTML = appPage();
  } else if (path === '/board') {
    isDemo = false;
    try { state = await loadBoard(); storageError = ''; } catch { state = emptyBoard(); storageError = 'The saved map could not be opened.'; }
    if (selectedId && !state.concepts.some((item) => item.id === selectedId)) selectedId = null;
    app.innerHTML = appPage();
  } else if (path === '/privacy') app.innerHTML = privacyPage();
  else if (path === '/terms') app.innerHTML = termsPage();
  else if (path === '/404') app.innerHTML = notFoundPage();
  else app.innerHTML = landingPage();
  bindEvents();
  if (focusHeading) {
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('main h1');
      heading?.focus();
      const announcer = document.querySelector<HTMLElement>('.route-announcer');
      if (announcer && heading) announcer.textContent = heading.textContent ?? '';
    });
  }
}

function navigate(path: string): void {
  if (isDemo && path !== '/demo') state = emptyBoard();
  history.pushState({}, '', path);
  void render(true);
}

async function persist(message = ''): Promise<void> {
  state.updatedAt = new Date().toISOString();
  if (!isDemo) {
    try { await saveBoard(state); storageError = ''; }
    catch { storageError = 'The browser could not save this change.'; }
  }
  await render();
  if (message) showToast(message);
}

function showToast(message: string): void {
  const toast = document.querySelector<HTMLElement>('[data-toast]');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 3200);
}

function canAdd(kind: Concept['kind']): boolean {
  if (isDemo || hasPaidLicense()) return true;
  if (kind === 'goal' && state.concepts.some((item) => item.kind === 'goal')) {
    showToast('The free board includes one goal. Lifetime access adds more.'); return false;
  }
  if (state.concepts.length >= 25) { showToast('The free board includes 25 concepts. Export stays available.'); return false; }
  return true;
}

function openConceptDialog(kind: Concept['kind'], dependentId = '', conceptId = ''): void {
  if (!conceptId && !canAdd(kind)) return;
  const dialog = document.querySelector<HTMLDialogElement>('[data-concept-dialog]')!;
  const form = dialog.querySelector<HTMLFormElement>('[data-concept-form]')!;
  const item = state.concepts.find((concept) => concept.id === conceptId);
  form.reset();
  (form.elements.namedItem('conceptId') as HTMLInputElement).value = item?.id ?? '';
  (form.elements.namedItem('kind') as HTMLInputElement).value = item?.kind ?? kind;
  (form.elements.namedItem('dependentId') as HTMLInputElement).value = dependentId;
  (form.elements.namedItem('title') as HTMLInputElement).value = item?.title ?? '';
  (form.elements.namedItem('notes') as HTMLTextAreaElement).value = item?.notes ?? '';
  (form.elements.namedItem('status') as RadioNodeList).value = item?.status ?? 'not_yet';
  dialog.querySelector<HTMLElement>('[data-dialog-eyebrow]')!.textContent = item ? (item.kind === 'goal' ? 'Edit goal' : 'Edit trail marker') : (kind === 'goal' ? 'New destination' : 'New trail marker');
  dialog.querySelector<HTMLElement>('[data-dialog-title]')!.textContent = item ? item.title : (kind === 'goal' ? 'Add a goal' : 'Add a prerequisite');
  const deleteButton = dialog.querySelector<HTMLButtonElement>('[data-delete-concept]')!;
  deleteButton.hidden = !item;
  dialog.showModal();
  requestAnimationFrame(() => (form.elements.namedItem('title') as HTMLInputElement).focus());
}

function download(content: string, filename: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function bindEvents(): void {
  document.querySelectorAll<HTMLElement>('[data-nav]').forEach((element) => element.addEventListener('click', (event) => {
    if (!(event.currentTarget instanceof HTMLAnchorElement) || event.currentTarget.origin !== location.origin) return;
    event.preventDefault(); navigate(event.currentTarget.pathname);
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-add-goal]').forEach((button) => button.addEventListener('click', () => openConceptDialog('goal')));
  document.querySelectorAll<HTMLButtonElement>('[data-add-prerequisite]').forEach((button) => button.addEventListener('click', () => openConceptDialog('concept', button.dataset.addPrerequisite || selectedId || state.activeGoalId || '')));
  document.querySelectorAll<HTMLButtonElement>('[data-select]').forEach((button) => button.addEventListener('click', () => { selectedId = button.dataset.select!; void render(); }));
  document.querySelectorAll<HTMLButtonElement>('[data-edit]').forEach((button) => button.addEventListener('click', () => openConceptDialog('concept', '', button.dataset.edit)));
  document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((button) => button.addEventListener('click', () => { view = button.dataset.view as 'board' | 'list'; void render(); }));
  document.querySelector<HTMLSelectElement>('[data-goal-select]')?.addEventListener('change', (event) => { state.activeGoalId = (event.target as HTMLSelectElement).value; selectedId = null; void persist('Goal changed.'); });
  document.querySelector<HTMLButtonElement>('[data-reset-demo]')?.addEventListener('click', () => { state = sampleBoard(); selectedId = recommendation(state, state.activeGoalId)?.id ?? null; void render(); showToast('Sample map reset.'); });
  document.querySelector<HTMLButtonElement>('[data-load-sample]')?.addEventListener('click', () => { state = sampleBoard(); state.name = 'My derivatives map'; void persist('Sample map copied to your board.'); });
  document.querySelector<HTMLButtonElement>('[data-connect]')?.addEventListener('click', () => document.querySelector<HTMLDialogElement>('[data-connection-dialog]')?.showModal());
  document.querySelector<HTMLButtonElement>('[data-export-menu]')?.addEventListener('click', () => document.querySelector<HTMLDialogElement>('[data-export-dialog]')?.showModal());
  document.querySelectorAll<HTMLButtonElement>('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => button.closest('dialog')?.close()));
  document.querySelectorAll<HTMLButtonElement>('[data-open-license]').forEach((button) => button.addEventListener('click', () => document.querySelector<HTMLDialogElement>('[data-license-dialog]')?.showModal()));

  const conceptForm = document.querySelector<HTMLFormElement>('[data-concept-form]');
  conceptForm?.addEventListener('submit', (event) => {
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null;
    if (!submitter?.hasAttribute('data-save-concept')) return;
    event.preventDefault();
    const data = new FormData(conceptForm);
    const conceptId = String(data.get('conceptId') ?? '');
    const title = String(data.get('title') ?? '').trim();
    const kind = String(data.get('kind')) as Concept['kind'];
    const status = String(data.get('status')) as KnowledgeStatus;
    const notes = String(data.get('notes') ?? '').trim();
    const dependentId = String(data.get('dependentId') ?? '');
    if (!title) { conceptForm.querySelector<HTMLElement>('[data-form-error]')!.textContent = 'Enter a title before saving.'; return; }
    const now = new Date().toISOString();
    if (conceptId) {
      const item = state.concepts.find((concept) => concept.id === conceptId)!;
      const repaired = item.status === 'not_yet' && status !== 'not_yet';
      Object.assign(item, { title, notes, status, updatedAt: now });
      if (repaired) state.repairs.push({ id: uid('repair'), conceptId, conceptTitle: title, status, at: now });
      selectedId = conceptId;
    } else {
      const id = uid(kind);
      state.concepts.push({ id, title, notes, kind, status, createdAt: now, updatedAt: now });
      if (kind === 'goal') state.activeGoalId = id;
      if (dependentId) state.edges.push({ id: uid('edge'), prerequisiteId: id, dependentId });
      selectedId = id;
    }
    conceptForm.closest('dialog')?.close(); void persist(conceptId ? 'Concept updated.' : `${kind === 'goal' ? 'Goal' : 'Prerequisite'} added.`);
  });
  conceptForm?.querySelector<HTMLButtonElement>('[data-delete-concept]')?.addEventListener('click', () => {
    const id = (conceptForm.elements.namedItem('conceptId') as HTMLInputElement).value;
    const item = state.concepts.find((concept) => concept.id === id);
    if (!item || !confirm(`Delete “${item.title}” and its connections?`)) return;
    state.concepts = state.concepts.filter((concept) => concept.id !== id);
    state.edges = state.edges.filter((edge) => edge.prerequisiteId !== id && edge.dependentId !== id);
    if (state.activeGoalId === id) state.activeGoalId = state.concepts.find((concept) => concept.kind === 'goal')?.id ?? null;
    selectedId = null; conceptForm.closest('dialog')?.close(); void persist('Concept deleted.');
  });

  const connectionForm = document.querySelector<HTMLFormElement>('[data-connection-form]');
  connectionForm?.addEventListener('submit', (event) => {
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null;
    if (!submitter?.hasAttribute('data-save-connection')) return;
    event.preventDefault();
    const data = new FormData(connectionForm); const prerequisiteId = String(data.get('prerequisiteId')); const dependentId = String(data.get('dependentId'));
    const error = connectionForm.querySelector<HTMLElement>('[data-connection-error]')!;
    if (state.edges.some((item) => item.prerequisiteId === prerequisiteId && item.dependentId === dependentId)) { error.textContent = 'That prerequisite is already connected.'; return; }
    if (wouldCreateCycle(state, prerequisiteId, dependentId)) { error.textContent = 'That connection would create a loop. Choose a different pair.'; return; }
    state.edges.push({ id: uid('edge'), prerequisiteId, dependentId }); connectionForm.closest('dialog')?.close(); void persist('Concepts connected.');
  });

  document.querySelectorAll<HTMLButtonElement>('[data-export]').forEach((button) => button.addEventListener('click', () => {
    if (button.dataset.export === 'json') download(JSON.stringify(state, null, 2), 'prerequisite-pathboard.json', 'application/json');
    else download(toMarkdown(state), 'prerequisite-pathboard.md', 'text/markdown');
    button.closest('dialog')?.close(); showToast(`${button.dataset.export === 'json' ? 'JSON' : 'Markdown'} exported.`);
  }));
  document.querySelector<HTMLInputElement>('[data-import]')?.addEventListener('change', async (event) => {
    const input = event.target as HTMLInputElement; const file = input.files?.[0]; if (!file) return;
    try { state = validateBoard(JSON.parse(await file.text())); selectedId = null; await persist('Pathboard imported.'); }
    catch (error) { showToast(`${error instanceof Error ? error.message : 'The file could not be read.'} Choose a Pathboard JSON export.`); }
  });

  const licenseForm = document.querySelector<HTMLFormElement>('[data-license-form]');
  licenseForm?.addEventListener('submit', async (event) => {
    const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null;
    if (!submitter?.hasAttribute('data-save-license')) return;
    event.preventDefault(); const token = String(new FormData(licenseForm).get('license') ?? '').trim();
    if (!token) return; storeLicense(token); submitter.disabled = true; submitter.textContent = 'Checking…';
    const valid = await verifyLicense();
    if (valid === false) { clearLicense(); licenseForm.querySelector<HTMLElement>('[data-license-error]')!.textContent = 'This license is not active. Check the token or buy a new license.'; submitter.disabled = false; submitter.textContent = 'Verify license'; return; }
    licenseForm.closest('dialog')?.close(); await render(); showToast(valid ? 'Lifetime access restored.' : 'License saved. It will be checked when you are online.');
  });
  licenseForm?.querySelector<HTMLButtonElement>('[data-remove-license]')?.addEventListener('click', () => { clearLicense(); licenseForm.closest('dialog')?.close(); void render(); showToast('License removed from this device.'); });
}

window.addEventListener('popstate', () => void render(true));
window.addEventListener('online', () => { document.querySelectorAll<HTMLElement>('[data-network]').forEach((item) => item.textContent = 'Online'); showToast('Back online.'); });
window.addEventListener('offline', () => { document.querySelectorAll<HTMLElement>('[data-network]').forEach((item) => item.textContent = 'Offline'); showToast('You are offline. Saved maps still work.'); });

captureLicense();
void render();
void verifyLicense().then((valid) => { if (valid === false) { void render(); showToast('The saved license is no longer active.'); } });

if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/service-worker.js').catch(() => undefined));
  navigator.serviceWorker.addEventListener('message', (event) => { if (event.data?.type === 'SW_UPDATED') showToast('An update is ready. Reload to use it.'); });
}
