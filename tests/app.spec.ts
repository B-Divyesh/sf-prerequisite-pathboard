import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:refresh-persistence real board survives refresh and tab close', async ({ page, context }) => {
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
  const reopened = await context.newPage();
  await page.close();
  await reopened.goto('/board');
  await expect(reopened.getByRole('button', { name: /Understand eigenvectors/ })).toBeVisible();
  await expect(reopened.getByRole('button', { name: /Matrix multiplication/ })).toBeVisible();
});

test('@claim:list-view shows the complete sample in a linear view', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'List' }).click();
  await expect(page.locator('.list-view .concept-node')).toHaveCount(14);
  await expect(page.getByRole('heading', { name: 'Direct prerequisites' })).toBeVisible();
});

for (const route of ['/', '/demo', '/board', '/privacy', '/terms', '/404', '/definitely-not-a-real-route-qa']) {
  test(`accessibility smoke test for ${route}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    await page.goto(route);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}

test('each route updates document and social metadata', async ({ page }) => {
  for (const [route, title, description] of [
    ['/', 'Prerequisite Pathboard — Map what to learn next', 'Map prerequisites backward and choose the next concept to repair.'],
    ['/demo', 'Demo — Prerequisite Pathboard', 'Try a sample prerequisite map without saving changes to your real data.'],
    ['/board', 'My map — Prerequisite Pathboard', 'Map your goal backward and choose the next prerequisite to repair.'],
    ['/privacy', 'Privacy — Prerequisite Pathboard', 'How Prerequisite Pathboard keeps your map in this browser.'],
    ['/terms', 'Terms — Prerequisite Pathboard', 'Terms for using Prerequisite Pathboard as a local planning aid.']
  ] as const) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description);
  }
});

test('keyboard opens, closes, and restores focus from the goal dialog', async ({ page }) => {
  await page.goto('/board');
  const opener = page.getByRole('button', { name: 'Add your first goal' });
  await opener.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('Concept title')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('the first-screen demo action opens the isolated query-string demo and reset controls', async ({ page }) => {
  await page.goto('/');
  const demoAction = page.getByRole('link', { name: 'Try it with sample data' });
  await expect(demoAction).toHaveAttribute('href', '/?demo=1');
  await demoAction.click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByRole('complementary', { name: 'Demo mode' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start for real' })).toBeVisible();
  await expect(page.locator('#next-title')).toHaveText('Fraction arithmetic');
});

test('invalid import gives one clear recovery step', async ({ page }) => {
  await page.goto('/board');
  await page.locator('[data-import]').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"hello":true}') });
  await expect(page.getByRole('status')).toContainText('Choose a Pathboard JSON export');
});

test('@claim:account-free creates a real goal without sign-in', async ({ page }) => {
  await page.goto('/board');
  await expect(page.getByLabel(/email|password/i)).toHaveCount(0);
  await page.getByRole('button', { name: 'Add your first goal' }).click();
  await page.getByLabel('Concept title').fill('Understand vectors');
  await page.getByRole('button', { name: 'Save concept' }).click();
  await expect(page.getByRole('button', { name: /Understand vectors/ })).toBeVisible();
});

test('does not expose an unavailable checkout endpoint', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('$24', { exact: true })).toHaveCount(0);
  await expect(page.locator('a[href*="api.sociobot.in"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Start your map' })).toHaveAttribute('href', '/board');
});

test('@claim:repair-history shows every marked repair', async ({ page }) => {
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
