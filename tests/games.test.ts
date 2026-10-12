import test from 'node:test';
import assert from 'node:assert/strict';
import {
  games,
  createTrials,
  isCorrect,
  performanceScore,
  shuffle,
} from '../lib/games.ts';

for (const game of games) {
  test(`${game.id}: playable trials at all three difficulties`, () => {
    for (const level of [1, 2, 3]) {
      for (let sample = 0; sample < 30; sample++) {
        const trials = createTrials(game.id, level);
        assert.ok(trials.length >= 4);
        for (const trial of trials) {
          assert.ok(trial.prompt && trial.answer && trial.reason);
          assert.equal(isCorrect(trial, trial.answer), true);
          if (trial.choices) {
            assert.equal(new Set(trial.choices).size, trial.choices.length);
            assert.ok(trial.choices.includes(trial.answer));
          }
          if (game.id === 'ordering') {
            const sorted = trial
              .study!.map(Number)
              .sort((a, b) => a - b)
              .join(' · ');
            assert.equal(trial.answer, sorted);
          }
          if (game.id === 'binary')
            assert.equal(Number(trial.answer), parseInt(trial.stimulus!, 2));
        }
      }
    }
  });
}
test('balanced scoring cannot be gamed by always pressing', () => {
  const responses = [
    { correct: true, condition: 'go' },
    { correct: true, condition: 'go' },
    { correct: false, condition: 'no-go' },
  ];
  assert.equal(performanceScore('inhibit', responses), 50);
  assert.equal(
    performanceScore('nback', [
      { correct: true, condition: 'match' },
      { correct: false, condition: 'different' },
    ]),
    50,
  );
});
test('perfect and empty sessions stay within score limits', () => {
  assert.equal(performanceScore('arithmetic', []), 0);
  assert.equal(
    performanceScore('arithmetic', [{ correct: true }, { correct: true }]),
    100,
  );
  assert.equal(performanceScore('arithmetic', [{ correct: false }]), 0);
});
test('shuffle preserves input and every item', () => {
  const values = [1, 2, 3, 4, 5];
  const output = shuffle(values, () => 0.5);
  assert.deepEqual(values, [1, 2, 3, 4, 5]);
  assert.deepEqual([...output].sort(), values);
});
test('n-back sequence agrees with the advertised answer', () => {
  for (const n of [1, 2, 3]) {
    const trials = createTrials('nback', n);
    const sequence = [...trials[0].study!];
    for (const trial of trials) {
      const previous = sequence[sequence.length - n];
      assert.equal(
        trial.answer,
        trial.stimulus === previous ? 'Match' : 'Different',
      );
      sequence.push(trial.stimulus!);
    }
  }
});
