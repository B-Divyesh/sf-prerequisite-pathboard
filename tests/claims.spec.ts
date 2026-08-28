import { test, expect } from '@playwright/test';

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

test('@claim:demo-sandbox discards demo edits on exit and reload', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: /^Fraction arithmetic, Not yet/ }).click();
  await page.getByRole('button', { name: 'Edit concept' }).click();
  await page.getByLabel('Concept title').fill('Changed only in demo');
  await page.getByRole('button', { name: 'Save concept' }).click();
  await page.reload();
  await expect(page.getByText('Changed only in demo')).toHaveCount(0);
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.getByRole('heading', { name: 'Your first route starts with a goal' })).toBeVisible();
  await expect(page.getByText('Changed only in demo')).toHaveCount(0);
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

test('@claim:all-features-included imports multiple goals and more than 25 concepts', async ({ page }) => {
  const concepts = [concept('g1', 'First goal', 'goal'), concept('g2', 'Second goal', 'goal'), ...Array.from({ length: 24 }, (_, index) => concept(`c${index}`, `Concept ${index + 1}`))];
  const board = { version: 1, name: 'Full board', concepts, edges: [], activeGoalId: 'g1', repairs: [], updatedAt: stamp };
  await page.goto('/board');
  await page.locator('[data-import]').setInputFiles({ name: 'full-board.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(board)) });
  await expect(page.getByRole('status')).toContainText('Pathboard imported');
  await expect(page.locator('[data-goal-select] option')).toHaveCount(2);
  await page.getByRole('button', { name: 'Export map' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const download = await downloadPromise;
  const exported = JSON.parse(await (await import('node:fs/promises')).readFile((await download.path())!, 'utf8'));
  expect(exported.concepts).toHaveLength(26);
});
