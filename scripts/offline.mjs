import { createHash } from 'node:crypto';

export function assetFingerprint(entries) {
  const hash = createHash('sha256');
  for (const [path, bytes] of [...entries].sort(([a], [b]) => a.localeCompare(b))) {
    hash.update(path).update('\0').update(bytes).update('\0');
  }
  return hash.digest('hex').slice(0, 20);
}

export function offlineWorker(version, assets) {
  return `const CACHE = ${JSON.stringify(`brainmaxing-${version}`)};
const ASSETS = ${JSON.stringify(assets)};
const PATHS = new Set(ASSETS);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('brainmaxing-') && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(request);
        if (response.ok && url.pathname === '/') await cache.put('/', response.clone());
        return response;
      } catch {
        return (await cache.match('/')) || Response.error();
      }
    })());
    return;
  }
  if (!PATHS.has(url.pathname) || url.search) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(url.pathname);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) await cache.put(url.pathname, response.clone());
    return response;
  })());
});
`;
}
