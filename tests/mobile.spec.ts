import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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
  const undersized = await page.locator('a, button, select, textarea, input:not([type="hidden"]):not([type="radio"])').evaluateAll((items) => items
    .filter((item) => {
      const box = item.getBoundingClientRect();
      const style = getComputedStyle(item);
      return box.width > 0 && box.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    })
    .map((item) => {
      const box = item.getBoundingClientRect();
      return { name: (item.getAttribute('aria-label') || item.textContent || item.tagName).trim(), width: box.width, height: box.height };
    })
    .filter((item) => item.width < 44 || item.height < 44));
  expect(undersized).toEqual([]);

  await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
  await page.goto('/board');
  await page.getByRole('button', { name: 'Add your first goal' }).click();
  await page.getByLabel('Concept title').fill('x'.repeat(90));
  await page.getByRole('button', { name: 'Save concept' }).click();
  await page.getByRole('button', { name: 'List' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.getByRole('button', { name: new RegExp(`x{90}`) })).toBeVisible();
});

test('390px landing preview has no keyboard-inaccessible scroll region or axe violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const preview = page.locator('.mini-board');
  expect(await preview.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations).toEqual([]);
});

test('390px gives every visible landing and demo control a 44px target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/?demo=1']) {
    await page.goto(route);
    const undersized = await page.locator('a, button, select, textarea, input:not([type="hidden"]):not([type="radio"])').evaluateAll((items) => items
      .filter((item) => {
        const box = item.getBoundingClientRect();
        const style = getComputedStyle(item);
        return box.width > 0 && box.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      })
      .map((item) => {
        const box = item.getBoundingClientRect();
        return { name: (item.getAttribute('aria-label') || item.textContent || item.tagName).trim(), width: box.width, height: box.height };
      })
      .filter((item) => item.width < 44 || item.height < 44));
    expect(undersized).toEqual([]);
  }
});

test('desktop first screen keeps all three facts in view', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const item of await page.locator('.plain-facts li').all()) {
    const box = await item.boundingBox();
    expect(box && box.y >= 0 && box.y + box.height <= 900).toBe(true);
  }
});
