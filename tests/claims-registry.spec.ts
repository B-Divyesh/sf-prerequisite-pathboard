import { readdir, readFile } from 'node:fs/promises';
import { test, expect } from '@playwright/test';

type Claim = { id: string; test: string };

test('claims registry gives every claim exactly one executable tagged test', async () => {
  const claims = JSON.parse(await readFile('.factory/claims.json', 'utf8')) as Claim[];
  const testFiles = (await readdir('tests')).filter((file) => file.endsWith('.spec.ts'));
  const sources = await Promise.all(testFiles.map((file) => readFile(`tests/${file}`, 'utf8')));
  const combined = sources.join('\n');

  expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length);
  for (const claim of claims) {
    expect(claim.test).toBe(`npm test -- --grep @claim:${claim.id}`);
    const tags = combined.match(new RegExp(`@claim:${claim.id}`, 'g')) ?? [];
    expect(tags).toHaveLength(1);
  }
});
