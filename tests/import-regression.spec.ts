import { test, expect } from '@playwright/test';

const stamp = '2026-08-28T12:00:00.000Z';
const node = (id: string, title: string, kind: 'goal' | 'concept') => ({ id, title, notes: '', kind, status: 'not_yet', createdAt: stamp, updatedAt: stamp });

test('@claim:import-error rejects a cyclic import before persistence and recovers', async ({ page }) => {
  const cyclic = {
    version: 1,
    name: 'Broken loop',
    concepts: [node('goal', 'Goal', 'goal'), node('prerequisite', 'Prerequisite', 'concept')],
    edges: [
      { id: 'edge-1', prerequisiteId: 'prerequisite', dependentId: 'goal' },
      { id: 'edge-2', prerequisiteId: 'goal', dependentId: 'prerequisite' }
    ],
    activeGoalId: 'goal', repairs: [], updatedAt: stamp
  };
  await page.goto('/board');
  await page.locator('[data-import]').setInputFiles({ name: 'cyclic.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(cyclic)) });
  await expect(page.getByRole('status')).toContainText('contains a prerequisite loop');
  await expect(page.getByRole('heading', { name: 'Your first map starts with a goal' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Your first map starts with a goal' })).toBeVisible();

  const valid = { ...cyclic, name: 'Recovered board', edges: [cyclic.edges[0]] };
  await page.locator('[data-import]').setInputFiles({ name: 'valid.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(valid)) });
  await expect(page.getByRole('status')).toContainText('Pathboard imported');
  await expect(page.getByRole('button', { name: /Goal, goal/ })).toBeVisible();
});

test('malformed repair entries are rejected before persistence', async ({ page }) => {
  const malformed = { version: 1, name: 'Bad repair', concepts: [node('goal', 'Goal', 'goal')], edges: [], activeGoalId: 'goal', repairs: [{ id: 'r1', conceptId: 'missing', conceptTitle: 'Missing', status: 'solve', at: stamp }], updatedAt: stamp };
  await page.goto('/board');
  await page.locator('[data-import]').setInputFiles({ name: 'bad-repair.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(malformed)) });
  await expect(page.getByRole('status')).toContainText('repair entry is incomplete');
  await expect(page.getByRole('heading', { name: 'Your first map starts with a goal' })).toBeVisible();
});
