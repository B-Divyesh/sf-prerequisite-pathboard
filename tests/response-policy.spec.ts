import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('static deployment policy serves a real 404 and immutable typed assets', async () => {
  const config = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8')) as {
    navigationFallback?: unknown;
    responseOverrides: Record<string, { rewrite: string }>;
    mimeTypes: Record<string, string>;
    routes: Array<{ route: string; headers?: Record<string, string> }>;
  };
  expect(config.navigationFallback).toBeUndefined();
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  expect(config.mimeTypes['.avif']).toBe('image/avif');
  for (const route of ['/assets/*', '/art/*']) {
    expect(config.routes.find((item) => item.route === route)?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
  }
  expect(config.routes.filter((item) => ['/demo', '/board', '/privacy', '/terms'].includes(item.route)).every((item) => item.headers === undefined)).toBe(true);
});

test('static 404 matches the product shell and is not indexed', async () => {
  const [notFound, sitemap] = await Promise.all([readFile('public/404.html', 'utf8'), readFile('public/sitemap.xml', 'utf8')]);
  for (const required of ['Skip to main content', 'My map', 'Version 1.2', 'rel="canonical"', 'property="og:title"', 'name="twitter:title"', 'favicon.svg', 'apple-touch-icon.png']) {
    expect(notFound).toContain(required);
  }
  expect(sitemap).not.toContain('/404');
});
