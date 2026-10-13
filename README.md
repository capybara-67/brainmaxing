# Brainmaxing

A browser-based collection of short games and interactive explainers. It has 25 games across memory, attention, reasoning, and learning, plus a notebook that stays on the current device.

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

Memory: Memory matrix, Signal stream, Path echo, Reverse relay, Order recall, Running total, Compass recall.

Attention: Color focus, Arrow focus, Rule shift, Hold fire, Find the match, Letter lookout.

Reasoning: Missing link, Turn it over, Mental math, Odd one out, Number sense, Clue line, Code cracker.

Learning: Word links, Recall trail, Word forge, Bit by bit, Connection builder.

The six latest games are marked New in the library. Each has Gentle, Steady, and Challenge modes, self-paced rounds, answer explanations, and results saved on this device. Running total and Compass recall hide their study steps before asking for an answer; Letter lookout, Clue line, and Code cracker keep their clues visible.

The game library supports category filters, a game selector, and random selection. The shared session runner handles difficulty, study/answer phases, feedback, completion, and pause behavior for timed tasks. Game definitions and trial generation live in `lib/games.ts`.

## Progress and notebook

Results and notes use local browser storage. Export a save code or download a backup to move them to another device. Imports validate the format, merge sessions by ID, and preserve conflicting notes as separate copies. Save codes are not encrypted. Corrupt existing storage is preserved while new work stays in memory.

The app needs no account or API key. Games and bundled explainers work after the page loads; external source links need internet. After one online visit, a service worker caches the app, fonts, and bundled explainers for offline use. Saves stay on the device; there is no cross-device sync.

## Checks and limits

The 40 automated tests cover trial generation at all difficulties, answer consistency, memory updates, letter counts, uniquely solvable deduction clues, code rules, balanced scoring, export/import for every game, malformed saves, and offline-cache updates. TypeScript, lint, and production builds pass. The latest six games have not yet had a browser playthrough because computer-use permissions were unavailable during development.

This is a React app built with Vite. It runs entirely in the browser, so it does not need server rendering or a server framework. Fonts are bundled locally. The current lockfile passes `npm audit` with zero findings.

Offline cache versions use hashes of file contents, so equally sized updates still invalidate old files. Failed responses and unrelated requests cannot replace the cached home page.

Some tasks link to the research that inspired them. The games are recreational and educational; scores describe these sessions and do not measure intelligence or establish health benefits.

## Fonts

Geist and Geist Mono are by the [Geist Project Authors](https://github.com/vercel/geist-font), distributed under the SIL Open Font License. The font notices are included in `public/licenses/` and in the static build.
