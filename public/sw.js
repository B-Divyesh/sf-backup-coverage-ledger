const CACHE = 'bcl-shell-v5';
const SHELL = ['/404.html', '/404.css', '/assets/proof-lattice-480.webp'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const response = await fetch('/');
    const html = await response.clone().text();
    await cache.put('/index-shell', response);
    const assets = [...html.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map((match) => match[1]);
    await cache.addAll([...SHELL, ...new Set(assets)]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.open(CACHE).then((cache) => cache.match('/index-shell'))));
    return;
  }
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.open(CACHE).then((cache) => cache.match(url.pathname).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok) event.waitUntil(cache.put(url.pathname, response.clone()));
    return response;
  }))));
});
