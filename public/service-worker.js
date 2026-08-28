const VERSION = 'pathboard-v1';
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;
const PRECACHE = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/art/night-ascent-768.avif', '/art/night-ascent-1280.avif', '/art/night-ascent-768.webp', '/art/night-ascent-1280.webp', '/art/night-ascent-1280.jpg', '/offline.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(async (keys) => {
    const oldKeys = keys.filter((key) => key.startsWith('pathboard-') && ![SHELL, RUNTIME].includes(key));
    await Promise.all(oldKeys.map((key) => caches.delete(key)));
    await self.clients.claim();
    if (oldKeys.length) {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED' }));
    }
  }));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone(); caches.open(RUNTIME).then((cache) => cache.put(event.request, copy)); return response;
    }).catch(async () => (await caches.match(event.request)) || (await caches.match('/index.html')) || (await caches.match('/offline.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok) { const copy = response.clone(); caches.open(RUNTIME).then((cache) => cache.put(event.request, copy)); }
    return response;
  })));
});
