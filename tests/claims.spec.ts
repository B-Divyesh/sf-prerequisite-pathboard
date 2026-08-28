import { test, expect } from '@playwright/test';

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

test('@claim:local-only sends no map data away from the site', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: /^Fraction arithmetic, Not yet/ }).click();
  await page.getByRole('button', { name: 'Edit concept' }).click();
  await page.getByLabel('What counts as enough for you?').fill('Private practice note');
  await page.getByRole('button', { name: 'Save concept' }).click();
  await expect(page.getByText('Private practice note')).toBeVisible();
  expect(external).toEqual([]);
});

test('@claim:demo-sandbox keeps demo edits out of the real board', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: /^Fraction arithmetic, Not yet/ }).click();
  await page.getByRole('button', { name: 'Edit concept' }).click();
  await page.getByLabel('Concept title').fill('Changed only in demo');
  await page.getByRole('button', { name: 'Save concept' }).click();
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
  const path = await download.path();
  const content = await (await import('node:fs/promises')).readFile(path!, 'utf8');
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
  const path = await download.path();
  const content = await (await import('node:fs/promises')).readFile(path!, 'utf8');
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

test('@claim:free-limit keeps one full goal free', async ({ page }) => {
  await page.goto('/board');
  await page.getByRole('button', { name: 'Add your first goal' }).click();
  await page.getByLabel('Concept title').fill('Understand vectors');
  await page.getByRole('button', { name: 'Save concept' }).click();
  await page.getByRole('button', { name: 'Add goal' }).click();
  await expect(page.getByRole('status')).toContainText('The free board includes one goal');
  await expect(page.locator('[data-concept-dialog]')).not.toBeVisible();
});

test('@claim:paid-license removes goal and concept limits', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('sb_license:prerequisite-pathboard', 'test-token');
    localStorage.setItem('sb_license_verdict:prerequisite-pathboard', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.goto('/board');
  for (const [index, title] of ['Understand vectors', 'Solve matrices'].entries()) {
    await page.getByRole('button', { name: index === 0 ? 'Add your first goal' : 'Add goal', exact: true }).click();
    await page.getByLabel('Concept title').fill(title);
    await page.getByRole('button', { name: 'Save concept' }).click();
  }
  await expect(page.getByLabel('Goal').locator('option')).toHaveCount(2);
  await expect(page.getByText(/Free board:/)).toHaveCount(0);
});

test('@claim:one-time-price shows the checkout contract', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('$24', { exact: true })).toBeVisible();
  const buy = page.getByRole('link', { name: 'Buy lifetime access' });
  await expect(buy).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/prerequisite-pathboard/checkout');
  await expect(page.getByText('one time', { exact: true })).toBeVisible();
});
