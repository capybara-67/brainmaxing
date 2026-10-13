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

test('running totals and direction recall agree with their study steps', () => {
  for (const level of [1, 2, 3]) {
    for (let sample = 0; sample < 30; sample++) {
      for (const trial of createTrials('total', level)) {
        const sum = trial.study!.reduce(
          (total, step) => total + Number(step.replace('−', '-')),
          0,
        );
        assert.equal(Number(trial.answer), sum);
        assert.equal(trial.study!.length, level + 2);
      }
      const headings = ['North', 'East', 'South', 'West'];
      for (const trial of createTrials('compass', level)) {
        let heading = headings.indexOf(trial.study![0].replace('Face ', ''));
        for (const step of trial.study!.slice(1)) {
          heading =
            (heading +
              (step === 'Turn left' ? -1 : step === 'Turn right' ? 1 : 2) +
              4) %
            4;
        }
        assert.equal(trial.answer, headings[heading]);
        assert.equal(trial.study!.length, level + 2);
      }
    }
  }
});

test('letter counts match the visible grid at every difficulty', () => {
  for (const level of [1, 2, 3]) {
    for (let sample = 0; sample < 30; sample++) {
      for (const trial of createTrials('count', level)) {
        const target = trial.prompt.match(/How many (\w) letters/)![1];
        const letters = trial.lines!.join('').replace(/\s/g, '');
        assert.equal(letters.length, (level + 2) ** 2);
        assert.equal(
          Number(trial.answer),
          [...letters].filter((letter) => letter === target).length,
        );
        assert.ok(
          trial.choices!.every(
            (choice) => Number(choice) >= 0 && Number(choice) <= letters.length,
          ),
        );
      }
    }
  }
});

test('deduction clues admit exactly one ordering with the advertised answer', () => {
  function permutations(items: string[]): string[][] {
    if (items.length <= 1) return [items];
    return items.flatMap((item, i) =>
      permutations(items.filter((_, j) => j !== i)).map((rest) => [
        item,
        ...rest,
      ]),
    );
  }
  for (const level of [1, 2, 3]) {
    for (const trial of createTrials('deduction', level)) {
      const valid = permutations(trial.choices!).filter((order) =>
        trial.lines!.every((line) => {
          const [, a, side, b] = line.match(
            /^(\w+) is to the (left|right) of (\w+)\.$/,
          )!;
          return side === 'left'
            ? order.indexOf(a) < order.indexOf(b)
            : order.indexOf(a) > order.indexOf(b);
        }),
      );
      assert.equal(valid.length, 1);
      const position = Number(trial.prompt.match(/position (\d+)/)![1]);
      assert.equal(trial.answer, valid[0][position - 1]);
    }
  }
});

test('code examples determine the answer within the stated rule family', () => {
  for (const level of [1, 2, 3]) {
    for (let sample = 0; sample < 30; sample++) {
      for (const trial of createTrials('code', level)) {
        const examples = trial.lines!.map((line) =>
          line.split(' → ').map(Number),
        );
        const multiplier =
          (examples[1][1] - examples[0][1]) / (examples[1][0] - examples[0][0]);
        const offset = examples[0][1] - examples[0][0] * multiplier;
        assert.equal(
          Number(trial.answer),
          examples[2][0] * multiplier + offset,
        );
        if (level === 1) assert.equal(multiplier, 1);
        if (level === 2) assert.equal(offset, 0);
        if (level === 3) assert.ok(multiplier > 1 && offset > 0);
      }
    }
  }
});
