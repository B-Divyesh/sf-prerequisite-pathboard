import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const stamp = '2026-08-28T12:00:00.000Z';
const concept = (id: string, title: string, kind: 'goal' | 'concept' = 'concept') => ({ id, title, notes: '', kind, status: 'not_yet', createdAt: stamp, updatedAt: stamp });

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Choose the next concept to repair');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.getByText('Fraction arithmetic', { exact: true }).first()).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#next-title')).toHaveText('Fraction arithmetic');
  await expect(page.locator('[data-network]')).toHaveText('Offline');
});

test('@claim:local-only sends real notes and exports nowhere else', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/board');
  await page.getByRole('button', { name: 'Add your first goal' }).click();
  await page.getByLabel('Concept title').fill('Private goal');
  await page.getByLabel('What counts as enough for you?').fill('Private practice note');
  await page.getByRole('button', { name: 'Save concept' }).click();
  await page.getByRole('button', { name: 'Export map' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  await downloadPromise;
  expect(external).toEqual([]);
});

test('@claim:demo-sandbox discards demo edits without changing the real IndexedDB record', async ({ page }) => {
  await page.goto('/board');
  await page.getByRole('button', { name: 'Add your first goal' }).click();
  await page.getByLabel('Concept title').fill('Real map stays unchanged');
  await page.getByRole('button', { name: 'Save concept' }).click();
  const readStoredTitle = () => page.evaluate(async () => new Promise<string | undefined>((resolve, reject) => {
    const request = indexedDB.open('prerequisite-pathboard', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const tx = request.result.transaction('boards', 'readonly');
      const read = tx.objectStore('boards').get('primary');
      read.onerror = () => reject(read.error);
      read.onsuccess = () => resolve(read.result?.concepts?.[0]?.title);
    };
  }));
  await expect.poll(readStoredTitle).toBe('Real map stays unchanged');
  await page.goto('/demo');
  await page.getByRole('button', { name: /^Fraction arithmetic, Not yet/ }).click();
  await page.getByRole('button', { name: 'Edit concept' }).click();
  await page.getByLabel('Concept title').fill('Changed only in demo');
  await page.getByRole('button', { name: 'Save concept' }).click();
  await page.reload();
  await expect(page.getByText('Changed only in demo')).toHaveCount(0);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('button', { name: /Real map stays unchanged/ })).toBeVisible();
  await expect(page.getByText('Changed only in demo')).toHaveCount(0);
  await expect.poll(readStoredTitle).toBe('Real map stays unchanged');
});

test('@claim:json-export exports every sample concept and dependency', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Export map' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const download = await downloadPromise;
  const content = await (await import('node:fs/promises')).readFile((await download.path())!, 'utf8');
  const data = JSON.parse(content);
  expect(download.suggestedFilename()).toBe('prerequisite-pathboard.json');
  expect(data.concepts).toHaveLength(14);
  expect(data.edges).toHaveLength(14);
});

test('@claim:markdown-export exports the map as readable Markdown', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Export map' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).click();
  const download = await downloadPromise;
  const content = await (await import('node:fs/promises')).readFile((await download.path())!, 'utf8');
  expect(download.suggestedFilename()).toBe('prerequisite-pathboard.md');
  expect(content).toContain('# Relearn derivatives');
  expect(content).toContain('**Fraction arithmetic** — Not yet');
  expect(content).toContain('needs Fraction arithmetic, Exponent laws');
});

test('@claim:dependency-recommendation updates from entered links and statuses', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('#next-title')).toHaveText('Fraction arithmetic');
  await page.getByRole('button', { name: /^Fraction arithmetic, Not yet/ }).click();
  await page.getByRole('button', { name: 'Edit concept' }).click();
  await page.getByRole('radio', { name: 'Can explain' }).check();
  await page.getByRole('button', { name: 'Save concept' }).click();
  await expect(page.locator('#next-title')).toHaveText('Approaching a value');
});

test('@claim:rendered-edges renders only dependencies the visitor enters', async ({ page }) => {
  await page.goto('/board');
  await page.getByRole('button', { name: 'Add your first goal' }).click();
  await page.getByLabel('Concept title').fill('Explain vectors');
  await page.getByRole('button', { name: 'Save concept' }).click();
  await page.getByRole('button', { name: 'Add prerequisite' }).first().click();
  await page.getByLabel('Concept title').fill('Vector addition');
  await page.getByRole('button', { name: 'Save concept' }).click();
  await expect(page.locator('.graph-stage path')).toHaveCount(1);
  await page.getByRole('button', { name: 'Export map' }).click();
  const firstDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const firstPath = await (await firstDownload).path();
  expect(JSON.parse(await readFile(firstPath!, 'utf8')).edges).toHaveLength(1);
  page.on('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: /^Vector addition/ }).click();
  await page.getByRole('button', { name: 'Edit concept' }).click();
  await page.getByRole('button', { name: 'Delete this concept' }).click();
  await expect(page.locator('.graph-stage path')).toHaveCount(0);
  await page.getByRole('button', { name: 'Export map' }).click();
  const secondDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const secondPath = await (await secondDownload).path();
  expect(JSON.parse(await readFile(secondPath!, 'utf8')).edges).toHaveLength(0);
});

test('@claim:no-tracking makes no tracking requests or embeds', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.getByRole('link', { name: 'Start for real' }).click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  const source = await Promise.all(['index.html', 'src/main.ts', 'src/storage.ts'].map((file) => readFile(file, 'utf8')));
  expect(source.join('\n')).not.toMatch(/google-analytics|googletagmanager|analytics\.track|stripe\.com|checkout\.js/i);
});

test('@claim:multi-goal-map creates and exports a map with two goals and 26 concepts', async ({ page }) => {
  const concepts = [concept('g1', 'First goal', 'goal'), concept('g2', 'Second goal', 'goal'), ...Array.from({ length: 24 }, (_, index) => concept(`c${index}`, `Concept ${index + 1}`))];
  const board = { version: 1, name: 'Full board', concepts, edges: [], activeGoalId: 'g1', repairs: [], updatedAt: stamp };
  await page.goto('/board');
  await page.getByRole('button', { name: 'Add your first goal' }).click();
  await page.getByLabel('Concept title').fill('First created goal');
  await page.getByRole('button', { name: 'Save concept' }).click();
  await page.getByRole('button', { name: 'Add goal' }).click();
  await page.getByLabel('Concept title').fill('Second created goal');
  await page.getByRole('button', { name: 'Save concept' }).click();
  await expect(page.locator('[data-goal-select] option')).toHaveCount(2);
  await page.locator('[data-import]').setInputFiles({ name: 'full-board.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(board)) });
  await expect(page.getByRole('status')).toContainText('Pathboard imported');
  await expect(page.locator('[data-goal-select] option')).toHaveCount(2);
  await page.getByRole('button', { name: 'Export map' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const download = await downloadPromise;
  const exported = JSON.parse(await (await import('node:fs/promises')).readFile((await download.path())!, 'utf8'));
  expect(exported.concepts).toHaveLength(26);
  expect(exported.concepts.filter((item: { kind: string }) => item.kind === 'goal')).toHaveLength(2);
});
