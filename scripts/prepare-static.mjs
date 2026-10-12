import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { assetFingerprint, offlineWorker } from './offline.mjs';

const out = join(process.cwd(), 'dist', 'client');
const entries = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile() && entry.name !== 'sw.js') {
      const url = `/${relative(out, path).split('\\').join('/')}`;
      entries.push([url, await readFile(path)]);
    }
  }
}
await walk(out);
const paths = entries.map(([path]) => path).filter(path => path !== '/index.html');
await writeFile(join(out, 'sw.js'), offlineWorker(assetFingerprint(entries), ['/', ...paths.sort()]));
