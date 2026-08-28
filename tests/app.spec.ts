import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:refresh-persistence real board survives reload', async ({ page }) => {
  await page.goto('/board');
  await page.getByRole('button', { name: 'Add your first goal' }).click();
  await page.getByLabel('Concept title').fill('Understand eigenvectors');
  await page.getByLabel('What counts as enough for you?').fill('Explain the geometric meaning.');
  await page.getByRole('button', { name: 'Save concept' }).click();
  await page.getByRole('button', { name: 'Add prerequisite' }).first().click();
  await page.getByLabel('Concept title').fill('Matrix multiplication');
  await page.getByRole('button', { name: 'Save concept' }).click();
  await page.getByRole('button', { name: 'List' }).click();
  await expect(page.getByRole('heading', { name: 'Direct prerequisites' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Matrix multiplication/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /Understand eigenvectors/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Matrix multiplication/ })).toBeVisible();
});

test('@claim:list-view shows the complete sample in a linear view', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'List' }).click();
  await expect(page.locator('.list-view .concept-node')).toHaveCount(14);
  await expect(page.getByRole('heading', { name: 'Direct prerequisites' })).toBeVisible();
});

for (const route of ['/', '/demo', '/privacy', '/terms']) {
  test(`accessibility smoke test for ${route}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await page.goto(route);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}

test('@claim:import-error invalid import gives one clear recovery step', async ({ page }) => {
  await page.goto('/board');
  await page.locator('[data-import]').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"hello":true}') });
  await expect(page.getByRole('status')).toContainText('Choose a Pathboard JSON export');
});

test('@claim:license-restore verifies a pasted license', async ({ page }) => {
  await page.route('https://api.sociobot.in/api/v1/products/prerequisite-pathboard/verify?license=fixture-license', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true,"reason":"ok"}' }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Have a license? Paste it' }).click();
  await page.getByLabel('License token').fill('fixture-license');
  await page.getByRole('button', { name: 'Verify license' }).click();
  await expect(page.getByRole('status')).toContainText('Lifetime access restored');
  await page.goto('/board');
  await expect(page.getByText(/Free board:/)).toHaveCount(0);
});

test('@claim:account-free creates a real goal without sign-in', async ({ page }) => {
  await page.goto('/board');
  await expect(page.getByLabel(/email|password/i)).toHaveCount(0);
  await page.getByRole('button', { name: 'Add your first goal' }).click();
  await page.getByLabel('Concept title').fill('Understand vectors');
  await page.getByRole('button', { name: 'Save concept' }).click();
  await expect(page.getByRole('button', { name: /Understand vectors/ })).toBeVisible();
});

test('@claim:paid-history shows repairs beyond the free history window', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('sb_license:prerequisite-pathboard', 'history-fixture');
    localStorage.setItem('sb_license_verdict:prerequisite-pathboard', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.goto('/board');
  await page.getByRole('button', { name: 'Load sample map instead' }).click();
  await page.getByRole('button', { name: /^Fraction arithmetic, Not yet/ }).click();
  await page.getByRole('button', { name: 'Edit concept' }).click();
  await page.getByRole('radio', { name: 'Can explain' }).check();
  await page.getByRole('button', { name: 'Save concept' }).click();
  await expect(page.locator('.repair-log summary')).toHaveText('6 marked repairs');
  await page.locator('.repair-log summary').click();
  await expect(page.locator('.repair-log li')).toHaveCount(6);
});
