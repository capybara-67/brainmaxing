# Brainmaxing

A browser-based collection of short games and interactive explainers. It has 19 games across memory, attention, reasoning, and learning, plus a notebook that stays on the current device.

[Open Brainmaxing](https://brainmaxing-lab.yerboljantumar.chatgpt.site)

## Run

Use Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run typecheck
npm run build
npm start
```

The production build produces static files in `dist/client`. `npm start` serves them at localhost:3002; set `PORT` to change it. Sites settings live in `.openai/hosting.json`.

## Games

Memory: Memory matrix, Signal stream, Path echo, Reverse relay, Order recall.

Attention: Color focus, Arrow focus, Rule shift, Hold fire, Find the match.

Reasoning: Missing link, Turn it over, Mental math, Odd one out, Number sense.

Learning: Word links, Recall trail, Word forge, Bit by bit.

The game library supports category filters, a game selector, and random selection. The shared session runner handles difficulty, study/answer phases, feedback, completion, and pause behavior for timed tasks. Game definitions and trial generation live in `lib/games.ts`.

## Progress and notebook

Results and notes use local browser storage. Export a save code or download a backup to move them to another device. Imports validate the format, merge sessions by ID, and preserve conflicting notes as separate copies. Save codes are not encrypted. Corrupt existing storage is preserved while new work stays in memory.

The app needs no account or API key. Games and bundled explainers work after the page loads; external source links need internet. After one online visit, a service worker caches the app, fonts, and bundled explainers for offline use. Saves stay on the device; there is no cross-device sync.

## Checks and limits

The 30 automated tests cover trial generation at all difficulties, answer consistency, balanced scoring, export/import, malformed saves, and offline-cache updates. TypeScript and production builds pass. Browser checks cover complete game sessions and reload persistence.

This is a React app built with Vite. It runs entirely in the browser, so it does not need server rendering or a server framework. Fonts are bundled locally. The current lockfile passes `npm audit` with zero findings.

Offline cache versions use hashes of file contents, so equally sized updates still invalidate old files. Failed responses and unrelated requests cannot replace the cached home page.

Some tasks link to the research that inspired them. The games are recreational and educational; scores describe these sessions and do not measure intelligence or establish health benefits.
