import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { assetFingerprint, offlineWorker } from '../scripts/offline.mjs';

function worker(fetcher = async () => new Response('online')) {
  const handlers = {};
  const stores = new Map([['unrelated-app', new Map()], ['brainmaxing-old', new Map()]]);
  const cache = new Map([['/', new Response('offline home')], ['/assets/app.js', new Response('script')]]);
  stores.set('brainmaxing-new', cache);
  const self = {
    location: { origin: 'https://example.test' },
    addEventListener: (name, fn) => { handlers[name] = fn; },
    skipWaiting: async () => {},
    clients: { claim: async () => {} },
  };
  const caches = {
    keys: async () => [...stores.keys()],
    delete: async name => stores.delete(name),
    open: async name => ({
      addAll: async paths => { for (const path of paths) cache.set(path, new Response('installed')); },
      match: async path => stores.get(name)?.get(path)?.clone(),
      put: async (path, response) => cache.set(path, response),
    }),
  };
  vm.runInNewContext(offlineWorker('new', ['/', '/assets/app.js']), { self, caches, fetch: fetcher, URL, Response });
  const request = async (path, mode = 'navigate', method = 'GET') => {
    let result;
    handlers.fetch({ request: { url: new URL(path, self.location.origin).href, mode, method }, respondWith: p => { result = p; } });
    return result && await result;
  };
  return { handlers, stores, cache, request };
}

test('cache identity changes when equally sized file contents change', () => {
  assert.notEqual(assetFingerprint([['/a.js', Buffer.from('one')]]), assetFingerprint([['/a.js', Buffer.from('two')]]));
  assert.equal(assetFingerprint([['/b', '2'], ['/a', '1']]), assetFingerprint([['/a', '1'], ['/b', '2']]));
});
test('activation removes only obsolete Brainmaxing caches', async () => {
  const w = worker(); let pending;
  w.handlers.activate({ waitUntil: p => { pending = p; } }); await pending;
  assert.deepEqual([...w.stores.keys()].sort(), ['brainmaxing-new', 'unrelated-app']);
});
test('offline navigation falls back to the cached home', async () => {
  const w = worker(async () => { throw new Error('offline'); });
  assert.equal(await (await w.request('/')).text(), 'offline home');
});
test('failed and unrelated navigation never replace the offline home', async () => {
  const w = worker(async () => new Response('server error', { status: 503 }));
  assert.equal((await w.request('/')).status, 503);
  assert.equal(await w.cache.get('/').text(), 'offline home');
  const other = worker(); await other.request('/not-found');
  assert.equal(await other.cache.get('/').text(), 'offline home');
});
test('only bundled assets are intercepted and cached', async () => {
  const w = worker();
  assert.equal(await (await w.request('/assets/app.js', 'cors')).text(), 'script');
  for (const path of ['/unbounded.json', '/assets/app.js?different', 'https://other.test/assets/app.js']) {
    assert.equal(await w.request(path, 'cors'), undefined);
  }
  assert.equal(await w.request('/', 'navigate', 'POST'), undefined);
});
