import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = process.cwd();
const out = join(root, 'dist', 'client');
const files = [];

async function walk(dir) {
  for (const entry of await readdir(dir)) {
    const path = join(dir, entry);
    const info = await stat(path);
    if (info.isDirectory()) await walk(path);
    else files.push(`/${relative(out, path).split('/').join('/')}`);
  }
}

await walk(out);

const hash = files.sort().join('|').length.toString(36);
const urls = JSON.stringify(['/', ...files.filter((file) => file !== '/sw.js')]);
const sw = `const CACHE='brainmaxing-${hash}';\nconst ASSETS=${urls};\nself.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});\nself.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('brainmaxing-')&&key!==CACHE).map(key=>caches.delete(key)))) .then(()=>self.clients.claim()))});\nself.addEventListener('fetch',event=>{const request=event.request;if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;if(request.mode==='navigate'){event.respondWith(fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('/',copy));return response}).catch(()=>caches.match('/')));return;}event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));return response})))})\n`;

await writeFile(join(out, 'sw.js'), sw);

const htmlPath = join(out, 'index.html');
const html = await readFile(htmlPath, 'utf8');
if (!html.includes('/sw.js')) {
  await writeFile(
    htmlPath,
    html.replace('</body>', `<script>if('serviceWorker'in navigator){addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}</script></body>`),
  );
}
