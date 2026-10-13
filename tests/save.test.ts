import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EMPTY,
  exportSave,
  importSave,
  mergeSaves,
  validateSave,
} from '../lib/save.ts';
import { allGameIds } from '../lib/games.ts';

test('exports and imports a validated save code', () => {
  const data = {
    ...EMPTY,
    sessions: [
      {
        id: 's1',
        game: 'nback',
        level: 2,
        score: 75,
        date: new Date('2026-09-14T12:00:00Z').toISOString(),
      },
    ],
    notes: [
      {
        id: 'n1',
        title: 'Engine',
        text: 'Spark, piston, crankshaft.',
        updated: new Date('2026-09-14T12:00:00Z').toISOString(),
      },
    ],
  };
  assert.deepEqual(importSave(exportSave(data)), data);
});

test('rejects damaged save codes', () => {
  const code = exportSave(EMPTY);
  assert.throws(() => importSave(`${code}x`), /incomplete|damaged/);
});

test('merges saves without overwriting note conflicts', () => {
  const updated = new Date('2026-09-14T12:00:00Z').toISOString();
  const merged = mergeSaves(
    validateSave({
      version: 1,
      sessions: [],
      notes: [{ id: 'same', title: 'A', text: 'one', updated }],
    }),
    validateSave({
      version: 1,
      sessions: [],
      notes: [{ id: 'same', title: 'A', text: 'two', updated }],
    }),
  );
  assert.equal(merged.notes.length, 2);
  assert.ok(merged.notes.some((note) => note.title.includes('imported')));
});

test('every game survives save-code round trips', () => {
  for (const game of allGameIds) {
    const data = {
      version: 1 as const,
      notes: [],
      sessions: [
        { id: game, game, level: 3, score: 100, date: '2026-10-12T12:00:00Z' },
      ],
    };
    assert.deepEqual(importSave(exportSave(data)), data);
  }
});
test('rejects out-of-range scores, blank IDs and duplicate records', () => {
  const session = {
    id: 's',
    game: 'focus',
    level: 1,
    score: 100,
    date: '2026-10-12T12:00:00Z',
  };
  assert.throws(() =>
    validateSave({
      version: 1,
      notes: [],
      sessions: [{ ...session, score: 110 }],
    }),
  );
  assert.throws(() =>
    validateSave({
      version: 1,
      notes: [],
      sessions: [{ ...session, id: ' ' }],
    }),
  );
  assert.throws(() =>
    validateSave({ version: 1, notes: [], sessions: [session, session] }),
  );
});
