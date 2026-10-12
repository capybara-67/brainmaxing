import { useState } from 'react';
import { shuffle } from '@/lib/games';
import { ArrowRight } from 'lucide-react';
const colors = [
  { name: 'Coral', hex: '#ff9c90' },
  { name: 'Blue', hex: '#88b9ff' },
  { name: 'Lime', hex: '#c3f76a' },
  { name: 'Violet', hex: '#c4a0ff' },
];
const trial = () => ({
  word: Math.floor(Math.random() * 4),
  ink: Math.floor(Math.random() * 4),
});
export function Focus({ onComplete }: { onComplete: (score: number) => void }) {
  const [active, setActive] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [item, setItem] = useState({ word: 0, ink: 2 });
  const [answer, setAnswer] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  function start() {
    setActive(true);
    setDone(false);
    setScore(0);
    setRound(0);
    setItem(trial());
    setAnswer(null);
  }
  function choose(n: number) {
    if (answer !== null) return;
    setAnswer(n);
    if (n === item.ink) setScore((s) => s + 1);
  }
  function next() {
    if (round === 9) {
      const finalScore = score;
      setDone(true);
      setActive(false);
      onComplete(Math.round((finalScore / 10) * 100));
    } else {
      setRound((r) => r + 1);
      setItem(trial());
      setAnswer(null);
    }
  }
  return (
    <div className="exercise-body">
      <div className="exercise-copy">
        <span className="eyebrow lime">02 / SELECTIVE ATTENTION</span>
        <h2>
          Follow the color.
          <br />
          Ignore the word.
        </h2>
        <p>
          Read the ink, not the label. Choose the color the word is printed in.
        </p>
        <p className="game-status focus-status" aria-live="polite">
          {done
            ? `${score} of 10 correct. Practice finished.`
            : active
              ? `Round ${round + 1} of 10 · ${score} correct`
              : 'Ten choices. One thing to focus on.'}
        </p>
        {!active && (
          <button className="primary" onClick={start}>
            {done ? 'Play again' : 'Start exercise'}
            <ArrowRight size={18} />
          </button>
        )}
        <span className="micro block-note">
          No speed score · Accuracy comes first
        </span>
      </div>
      <div className="focus-area">
        <div className="eyebrow">WHAT COLOR IS THE INK?</div>
        <div className="color-word" style={{ color: colors[item.ink].hex }}>
          {done ? 'Done!' : colors[item.word].name}
        </div>
        <div className="color-choices">
          {colors.map((c, i) => (
            <button
              disabled={!active || answer !== null}
              key={c.name}
              onClick={() => choose(i)}
            >
              <span className="ink-swatch" style={{ background: c.hex }} />
              {c.name}
            </button>
          ))}
        </div>
        {active && answer !== null && (
          <div className="answer-feedback" aria-live="polite">
            <p>
              {answer === item.ink
                ? 'Correct. You stayed with the ink.'
                : `The ink was ${colors[item.ink].name.toLowerCase()}. Try the next one.`}
            </p>
            <button className="text-button" onClick={next}>
              {round === 9 ? 'Finish' : 'Next word'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
const puzzles = [
  {
    seq: '2, 4, 8, 16, ?',
    options: [18, 24, 32, 64],
    answer: 32,
    why: 'Each term doubles. 16 × 2 = 32.',
  },
  {
    seq: '1, 4, 9, 16, ?',
    options: [20, 25, 32, 36],
    answer: 25,
    why: 'These are square numbers: 1², 2², 3², 4². Next is 5² = 25.',
  },
  {
    seq: '3, 6, 11, 18, ?',
    options: [24, 25, 27, 30],
    answer: 27,
    why: 'The gaps are 3, 5, and 7. Add the next odd gap, 9, to get 27.',
  },
  {
    seq: '1, 1, 2, 3, 5, ?',
    options: [6, 7, 8, 10],
    answer: 8,
    why: 'Each number is the sum of the two before it. 3 + 5 = 8.',
  },
  {
    seq: '81, 27, 9, 3, ?',
    options: [0, 1, 2, 6],
    answer: 1,
    why: 'Divide by 3 each time. 3 ÷ 3 = 1.',
  },
  {
    seq: '2, 3, 5, 8, 12, ?',
    options: [15, 16, 17, 18],
    answer: 17,
    why: 'Add 1, then 2, then 3, then 4. The next gap is 5: 12 + 5 = 17.',
  },
  {
    seq: '5, 10, 8, 16, 14, ?',
    options: [12, 21, 28, 30],
    answer: 28,
    why: 'Alternate doubling and subtracting 2. Next, double 14 to get 28.',
  },
];
export function Logic({ onComplete }: { onComplete: (score: number) => void }) {
  const [order, setOrder] = useState([0, 1, 2, 3, 4]);
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const p = puzzles[order[round]];
  function start() {
    setOrder(shuffle([...puzzles.keys()]).slice(0, 5));
    setRound(0);
    setScore(0);
    setDone(false);
    setStarted(true);
    setAnswer(null);
  }
  function choose(n: number) {
    if (answer !== null) return;
    setAnswer(n);
    if (n === p.answer) setScore((s) => s + 1);
  }
  function next() {
    if (round === 4) {
      const finalScore = score;
      setDone(true);
      onComplete(Math.round((finalScore / 5) * 100));
    } else {
      setRound((r) => r + 1);
      setAnswer(null);
    }
  }
  return (
    <div className="exercise-body">
      <div className="exercise-copy">
        <span className="eyebrow lime">03 / PATTERN REASONING</span>
        <h2>
          Find the
          <br />
          missing link.
        </h2>
        <p>
          Look for a simple rule connecting the numbers. Choose what comes next.
        </p>
        <p className="game-status focus-status" aria-live="polite">
          {done
            ? `${score} of 5 correct. You followed the clues.`
            : started
              ? `Puzzle ${round + 1} of 5 · ${score} correct`
              : 'Five patterns. Take all the time you need.'}
        </p>
        {(!started || done) && (
          <button className="primary" onClick={start}>
            {done ? 'New set' : 'Start exercise'}
            <ArrowRight size={18} />
          </button>
        )}
        <span className="micro block-note">
          Each answer includes the reasoning
        </span>
      </div>
      <div className="logic-area">
        <span className="eyebrow">WHAT COMES NEXT?</span>
        <div className="number-sequence">{done ? 'Set complete' : p.seq}</div>
        <div className="color-choices">
          {p.options.map((n) => (
            <button
              disabled={!started || done || answer !== null}
              key={n}
              onClick={() => choose(n)}
            >
              {n}
            </button>
          ))}
        </div>
        {answer !== null && !done && (
          <div className="answer-feedback" aria-live="polite">
            <p>
              {answer === p.answer
                ? 'Exactly. '
                : `The intended answer is ${p.answer}. `}
              {p.why}
            </p>
            <button className="text-button" onClick={next}>
              {round === 4 ? 'Finish' : 'Next puzzle'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
