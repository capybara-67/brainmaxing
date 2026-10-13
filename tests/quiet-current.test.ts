import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createGarden,
  EAST,
  gardens,
  hintFor,
  INLET,
  OUTLET,
  rotatePiece,
  SIZE,
  solutionFor,
  streamState,
  WEST,
} from '../lib/quiet-current.ts';
import { exportSave, importSave } from '../lib/save.ts';

test('every garden has one continuous spring-to-pond solution', () => {
  gardens.forEach(({ path }, garden) => {
    assert.equal(new Set(path).size, path.length);
    const solution = solutionFor(garden);
    const { wet, solved } = streamState(solution);
    assert.equal(solved, true);
    assert.equal(wet.size, path.length);
    assert.ok(solution[INLET] & WEST);
    assert.ok(solution[OUTLET] & EAST);
    for (const mask of solution.filter(Boolean)) {
      assert.equal(mask.toString(2).split('1').length - 1, 2);
      let rotated = mask;
      for (let i = 0; i < 4; i++) rotated = rotatePiece(rotated);
      assert.equal(rotated, mask);
    }
  });
});

test('shuffles are unsolved and nudges always reach a complete garden', () => {
  gardens.forEach(({ path }, garden) => {
    for (const random of [
      () => 0,
      () => 0.25,
      () => 0.5,
      () => 0.75,
      Math.random,
    ]) {
      for (let sample = 0; sample < 20; sample++) {
        const board = createGarden(garden, random);
        assert.equal(streamState(board).solved, false);
        const solution = solutionFor(garden);
        for (
          let step = 0;
          step < path.length && !streamState(board).solved;
          step++
        ) {
          const tile = hintFor(garden, board);
          assert.notEqual(tile, undefined);
          assert.notEqual(board[tile!], solution[tile!]);
          board[tile!] = solution[tile!];
        }
        assert.equal(streamState(board).solved, true);
        assert.equal(hintFor(garden, board), undefined);
      }
    }
  });
});

test('water needs matching openings and cannot wrap across a row', () => {
  const board = Array<number>(SIZE * SIZE).fill(0);
  board[INLET] = WEST | EAST;
  board[INLET + 1] = WEST | EAST;
  board[INLET + 2] = EAST | 1;
  assert.deepEqual([...streamState(board).wet], [INLET, INLET + 1]);
  const wrap = Array<number>(SIZE * SIZE).fill(WEST | EAST);
  wrap[OUTLET] = 1 | 4;
  assert.equal(streamState(wrap).wet.has(9), false);
  assert.equal(streamState(wrap).solved, false);
});

test('a quiet break survives save export and import', () => {
  const save = {
    version: 1 as const,
    notes: [],
    sessions: [
      {
        id: 'quiet-session',
        game: 'quiet-current',
        level: 1,
        score: 100,
        date: '2026-10-13T12:00:00.000Z',
      },
    ],
  };
  assert.deepEqual(importSave(exportSave(save)), save);
});
