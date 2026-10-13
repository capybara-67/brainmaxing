import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Eye,
  Pause,
  Trophy,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  createTrials,
  games,
  isCorrect,
  performanceScore,
  type GameId,
  type Trial,
} from '@/lib/games';
export default function GameSession({
  id,
  active,
  onComplete,
}: {
  id: GameId;
  active: boolean;
  onComplete: (score: number, level: number) => void;
}) {
  const game = games.find((g) => g.id === id)!;
  const [level, setLevel] = useState(1);
  const [phase, setPhase] = useState<
    'intro' | 'study' | 'prepare' | 'play' | 'feedback' | 'done'
  >('intro');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [round, setRound] = useState(0);
  const [studyIndex, setStudyIndex] = useState(0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState<
    { correct: boolean; condition?: string }[]
  >([]);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(true);
  const pressedRef = useRef(false);
  const answeredRef = useRef(false);
  const completedRef = useRef(false);
  const focusRef = useRef<HTMLDivElement>(null);
  const trial = trials[round];
  const waitMs = [3000, 2200, 1500][level - 1];
  const respond = useCallback(
    (value: string) => {
      if (phase !== 'play' || answeredRef.current) return;
      answeredRef.current = true;
      setInput(value);
      setAnswers((a) => [
        ...a,
        { correct: isCorrect(trial, value), condition: trial.condition },
      ]);
      setPhase('feedback');
    },
    [phase, trial],
  );
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    if (id !== 'inhibit' || phase !== 'play' || !active || !visible) return;
    const timer = setTimeout(
      () => respond(pressedRef.current ? 'press' : 'wait'),
      waitMs,
    );
    return () => clearTimeout(timer);
  }, [id, phase, round, active, visible, waitMs, respond]);
  function phaseFor(t: Trial) {
    return t.study ? 'study' : id === 'inhibit' ? 'prepare' : 'play';
  }
  function start() {
    const next = createTrials(id, level);
    setTrials(next);
    setRound(0);
    setStudyIndex(0);
    setInput('');
    setAnswers([]);
    setPressed(false);
    pressedRef.current = false;
    answeredRef.current = false;
    completedRef.current = false;
    setPhase(phaseFor(next[0]));
    focusRef.current?.focus();
  }
  function next() {
    if (round === trials.length - 1) {
      const finalAnswers = answers;
      setPhase('done');
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete(performanceScore(id, finalAnswers), level);
      }
    } else {
      setRound((r) => r + 1);
      setStudyIndex(0);
      setInput('');
      setPressed(false);
      pressedRef.current = false;
      answeredRef.current = false;
      setPhase(phaseFor(trials[round + 1]));
    }
    focusRef.current?.focus();
  }
  function studyNext() {
    if (id === 'pairs' || studyIndex === (trial.study?.length ?? 1) - 1) {
      setPhase('play');
      setInput('');
      focusRef.current?.focus();
    } else setStudyIndex((i) => i + 1);
  }
  function press() {
    if (phase === 'play' && active && visible && !pressedRef.current) {
      pressedRef.current = true;
      setPressed(true);
    }
  }
  function pad(n: number) {
    if (phase !== 'play') return;
    const list = input ? input.split(',') : [];
    if (list.length >= (trial.pads?.length ?? 0)) return;
    setInput([...list, String(n)].join(','));
  }
  const progress =
    phase === 'done' ? 100 : trials.length ? (round / trials.length) * 100 : 0;
  const currentAnswer = answers[round];
  return (
    <div className="new-game">
      <div className="new-game-info">
        <span className="eyebrow lime">{game.tag}</span>
        <h2>{game.name}</h2>
        <p>{game.instructions}</p>
        {phase === 'intro' || phase === 'done' ? (
          <>
            <Tabs
              value={String(level)}
              onValueChange={(v) => setLevel(Number(v))}
            >
              <TabsList
                className="difficulty-tabs"
                aria-label="Choose difficulty"
              >
                <TabsTrigger value="1">Gentle</TabsTrigger>
                <TabsTrigger value="2">Steady</TabsTrigger>
                <TabsTrigger value="3">Challenge</TabsTrigger>
              </TabsList>
            </Tabs>
            <button className="primary" onClick={start}>
              {phase === 'done' ? 'Play again' : 'Start exercise'}
              <ArrowRight size={18} />
            </button>
          </>
        ) : (
          <div className="run-meta">
            <span>
              Round {round + 1} / {trials.length}
            </span>
            <span>{['Gentle', 'Steady', 'Challenge'][level - 1]}</span>
            <Progress value={progress} aria-label="Session progress" />
          </div>
        )}
        <span className="micro block-note">
          {game.timed
            ? `${waitMs / 1000}s response window · no speed bonus`
            : 'Self-paced · no speed bonus'}
        </span>
        {game.visual && (
          <span className="access-note">
            <Eye size={14} />
            Visual task. Try Reverse relay or Recall trail for text-based play.
          </span>
        )}
        <details className="evidence">
          <summary>Behind the game</summary>
          <p>{game.evidence}</p>
          {game.url && (
            <a href={game.url} target="_blank" rel="noreferrer">
              {game.source}
              <ArrowUpRight size={14} />
            </a>
          )}
          <p className="micro">
            {game.url ? 'Study link needs internet. ' : ''}This game is
            recreational practice.
          </p>
        </details>
      </div>
      <div
        className={`game-arena ${phase === 'feedback' ? (currentAnswer?.correct ? 'arena-correct' : 'arena-retry') : ''}`}
        ref={focusRef}
        tabIndex={-1}
        aria-label={`${game.name} play area`}
      >
        {phase === 'intro' && (
          <div className="game-intro">
            <div
              className={`game-glyph ${game.fresh ? 'fresh-glyph' : ''}`}
              aria-hidden="true"
            >
              {
                {
                  nback: 'A → B → A',
                  path: '1 → 2 → 3',
                  reverse: '4 1 8 → ?',
                  pairs: 'harbor ↔ velvet',
                  retrieval: 'Learn. Recall.',
                  flanker: '→ → ← → →',
                  switch: 'ODD / EVEN',
                  inhibit: '○   ×',
                  search: '●   □   ○',
                  rotation: '↻',
                  arithmetic: '12 × 3',
                  ordering: '9 · 2 · 6',
                  anagram: 'C L O U D',
                  oddity: 'One of these…',
                  magnitude: '½ vs 0.75',
                  binary: '0 1 0 1',
                  total: '+4 −2 +7',
                  compass: 'N → E → ?',
                  count: 'M N M W',
                  analogy: 'Find the link.',
                  deduction: 'A → ? → C',
                  code: '3 → 12',
                }[id]
              }
            </div>
            <p>{game.description}</p>
            <span className="micro">
              {game.timed
                ? 'START EACH ROUND WHEN READY'
                : 'A LITTLE SPACE TO THINK'}
            </span>
          </div>
        )}
        {phase === 'study' && (
          <>
            <span className="eyebrow">
              {id === 'pairs'
                ? 'STUDY THE PAIRS'
                : `STUDY ${studyIndex + 1} / ${trial.study!.length}`}
            </span>
            {id === 'path' ? (
              <div className="path-grid">
                {[...Array(9).keys()].map((n) => (
                  <div
                    key={n}
                    className={
                      n === Number(trial.study![studyIndex])
                        ? 'path-pad lit'
                        : 'path-pad'
                    }
                  >
                    {n + 1}
                  </div>
                ))}
              </div>
            ) : id === 'pairs' ? (
              <div className="pair-study">
                {trial.study!.map((pair) => (
                  <p key={pair}>{pair}</p>
                ))}
              </div>
            ) : (
              <div
                className={`study-symbol ${id === 'compass' ? 'study-direction' : ''}`}
                aria-live="polite"
              >
                {trial.study![studyIndex]}
              </div>
            )}
            {id === 'path' && (
              <span className="sr-only" aria-live="polite">
                Pad {Number(trial.study![studyIndex]) + 1}
              </span>
            )}
            <button className="primary" onClick={studyNext}>
              {id === 'pairs' || studyIndex === trial.study!.length - 1
                ? 'Hide and begin'
                : 'Next item'}
              <ArrowRight size={17} />
            </button>
          </>
        )}
        {phase === 'prepare' && (
          <div className="game-intro">
            <Pause size={32} />
            <h3>Ready for round {round + 1}?</h3>
            <p>
              Circle: press once.
              <br />
              X: wait {waitMs / 1000} seconds.
            </p>
            <button
              className="primary"
              onClick={() => {
                setPressed(false);
                pressedRef.current = false;
                answeredRef.current = false;
                setPhase('play');
              }}
            >
              Show the signal
              <ArrowRight size={17} />
            </button>
          </div>
        )}
        {(phase === 'play' || phase === 'feedback') && (
          <>
            <div className="trial-prompt" aria-live="polite">
              {trial.prompt}
            </div>
            {trial.lines && (
              <div
                className={`trial-lines ${id === 'count' ? 'letter-grid' : ''}`}
                aria-label={
                  id === 'count' ? 'Letter grid, read row by row' : undefined
                }
              >
                {trial.lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
            {trial.stimulus && (
              <div
                className={`trial-symbol ${id === 'flanker' ? 'flanker' : ''}`}
                aria-label={
                  id === 'inhibit'
                    ? trial.stimulus === '○'
                      ? 'Circle'
                      : 'X'
                    : undefined
                }
              >
                {trial.stimulus}
              </div>
            )}
            {id === 'search' && (
              <div
                className="search-array"
                style={{
                  gridTemplateColumns: `repeat(${Math.sqrt(trial.shapes!.length)},1fr)`,
                }}
                aria-label="Visual search array"
              >
                {trial.shapes!.map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
            )}
            {id === 'rotation' && (
              <div className="rotation-pair">
                <Shape />
                <Shape angle={trial.angle} mirror={trial.mirror} />
              </div>
            )}
            {id === 'path' && (
              <>
                <div className="path-grid">
                  {[...Array(9).keys()].map((n) => (
                    <button
                      key={n}
                      aria-label={`Pad ${n + 1}`}
                      disabled={phase !== 'play'}
                      onClick={() => pad(n)}
                      className={`path-pad ${input.split(',').includes(String(n)) && input ? 'selected' : ''}`}
                    >
                      {n + 1}
                    </button>
                  ))}
                </div>
                <p className="sequence-entry">
                  {input
                    ? input
                        .split(',')
                        .map((x) => Number(x) + 1)
                        .join(' → ')
                    : 'Your path will appear here'}
                </p>
                {phase === 'play' && (
                  <div className="button-row">
                    <button
                      className="secondary"
                      onClick={() => setInput('')}
                      disabled={!input}
                    >
                      Clear
                    </button>
                    <button
                      className="primary"
                      disabled={
                        !input || input.split(',').length !== trial.pads!.length
                      }
                      onClick={() => respond(input)}
                    >
                      Check path
                      <Check size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
            {id === 'reverse' && phase === 'play' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  respond(input);
                }}
                className="reverse-form"
              >
                <label htmlFor="reverse-entry">Your reversed sequence</label>
                <input
                  autoComplete="off"
                  id="reverse-entry"
                  inputMode="numeric"
                  value={input}
                  maxLength={9}
                  onChange={(e) =>
                    setInput(e.target.value.replace(/[^0-9]/g, ''))
                  }
                  placeholder="Type the digits"
                />
                <button
                  className="primary"
                  disabled={input.length !== trial.answer.length}
                >
                  Check sequence
                  <Check size={16} />
                </button>
              </form>
            )}
            {trial.choices && (
              <div className="choice-grid">
                {trial.choices.map((choice) => (
                  <button
                    key={choice}
                    disabled={phase !== 'play'}
                    className={
                      phase === 'feedback'
                        ? choice === trial.answer
                          ? 'choice-correct'
                          : choice === input
                            ? 'choice-wrong'
                            : ''
                        : ''
                    }
                    onClick={() => respond(choice)}
                  >
                    {choice}
                    {phase === 'feedback' && choice === trial.answer && (
                      <Check size={17} />
                    )}
                  </button>
                ))}
              </div>
            )}
            {id === 'inhibit' && phase === 'play' && (
              <>
                <button
                  className={`signal-button ${pressed ? 'pressed' : ''}`}
                  disabled={!active || !visible || pressed}
                  onClick={press}
                >
                  {pressed ? 'Press registered' : 'Press for ○'}
                </button>
                <p className="signal-status" aria-live="polite">
                  {!active || !visible
                    ? 'Paused. The window restarts when you return.'
                    : pressed
                      ? 'Wait for the response window to close.'
                      : `Respond within ${waitMs / 1000} seconds.`}
                </p>
                <div
                  className="signal-timer"
                  key={`${round}-${active}-${visible}`}
                  style={{
                    animationDuration: `${waitMs}ms`,
                    animationPlayState:
                      active && visible ? 'running' : 'paused',
                  }}
                />
              </>
            )}
            {phase === 'feedback' && (
              <div className="trial-feedback" aria-live="polite">
                <b>
                  {currentAnswer?.correct
                    ? 'Nicely done.'
                    : 'A useful clue for next time.'}
                </b>
                <p>{trial.reason}</p>
                <button className="primary" onClick={next}>
                  {round === trials.length - 1
                    ? 'Finish session'
                    : 'Next round'}
                  <ArrowRight size={17} />
                </button>
              </div>
            )}
          </>
        )}
        {phase === 'done' && (
          <div className="game-result">
            <Trophy size={34} />
            <span className="eyebrow">SESSION COMPLETE</span>
            <strong>
              {performanceScore(id, answers)}
              <small>%</small>
            </strong>
            <p>
              {answers.filter((a) => a.correct).length} of {answers.length}{' '}
              correct
            </p>
            {(id === 'inhibit' || id === 'nback') && (
              <span className="micro">Score balances both response types.</span>
            )}
            <h3>A little practice, well spent.</h3>
            <p>
              {performanceScore(id, answers) >= 85 && level < 3
                ? 'Feeling good? You can try the next difficulty.'
                : 'Stay with this level, or take a break. No rush.'}
            </p>
            <span className="micro">
              Saved on this device when storage is available.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
function Shape({
  angle = 0,
  mirror = false,
}: {
  angle?: number;
  mirror?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 140 140"
      // Inline SVG needs an image role to expose the whole shape as one graphic.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role="img"
      aria-label="Asymmetric block shape"
      className="rotation-shape"
    >
      <g
        transform={`translate(70 70) rotate(${angle}) scale(${mirror ? -1 : 1} 1) translate(-30 -45)`}
      >
        {[
          [0, 0],
          [0, 30],
          [0, 60],
          [30, 60],
        ].map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="28"
            height="28"
            rx="2"
            fill="currentColor"
          />
        ))}
      </g>
    </svg>
  );
}
