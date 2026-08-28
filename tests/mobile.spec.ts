import { test, expect } from '@playwright/test';

test('390px first screen and demo remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Map backward. Learn the next prerequisite.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /Fraction arithmetic/ })).toBeVisible();
});

test('390px supports 200% text, 44px controls, and unbroken 90-character titles', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await expect(page.getByRole('heading', { name: 'Map backward. Learn the next prerequisite.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  for (const name of ['Demo', 'My board', 'Privacy']) {
    const box = await page.getByLabel('Main navigation').getByRole('link', { name }).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }

  await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
  await page.goto('/board');
  await page.getByRole('button', { name: 'Add your first goal' }).click();
  await page.getByLabel('Concept title').fill('x'.repeat(90));
  await page.getByRole('button', { name: 'Save concept' }).click();
  await page.getByRole('button', { name: 'List' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.getByRole('button', { name: new RegExp(`x{90}`) })).toBeVisible();
});
