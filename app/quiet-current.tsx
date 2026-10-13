import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  Droplets,
  Leaf,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  createGarden,
  EAST,
  gardens,
  hintFor,
  INLET,
  NORTH,
  openingNames,
  OUTLET,
  rotatePiece,
  SIZE,
  solutionFor,
  SOUTH,
  streamState,
  WEST,
} from '@/lib/quiet-current';

type Phase = 'ready' | 'play' | 'flowing' | 'done';
const endpoints = [
  [NORTH, 50, 0],
  [EAST, 100, 50],
  [SOUTH, 50, 100],
  [WEST, 0, 50],
];

export default function QuietCurrent({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('ready');
  const [garden, setGarden] = useState(0);
  const [board, setBoard] = useState(() => solutionFor(0));
  const [history, setHistory] = useState<number[][]>([]);
  const [hint, setHint] = useState<number>();
  const [message, setMessage] = useState(
    'Three small gardens. One thing at a time.',
  );
  const completed = useRef(false);
  const boardRef = useRef<HTMLFieldSetElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const { wet, solved } = streamState(board);

  useEffect(() => {
    if (phase === 'flowing' || phase === 'done') continueRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    if (phase === 'done' && !completed.current) {
      completed.current = true;
      onComplete();
    }
  }, [phase, onComplete]);

  function begin(index: number) {
    completed.current = false;
    setGarden(index);
    setBoard(createGarden(index));
    setHistory([]);
    setHint(undefined);
    setPhase('play');
    setMessage(
      'Turn the pieces to connect the spring on the left to the pond on the right.',
    );
    requestAnimationFrame(() =>
      boardRef.current?.querySelector<HTMLButtonElement>('button')?.focus(),
    );
  }

  function update(next: number[], tile?: number) {
    if (phase !== 'play') return;
    setHistory((previous) => [...previous, board]);
    setBoard(next);
    setHint(tile);
    if (streamState(next).solved) {
      const last = garden === gardens.length - 1;
      setPhase(last ? 'done' : 'flowing');
      setMessage(
        last
          ? 'All three gardens are flowing. Your break is complete.'
          : 'The water found its way. Take a moment, then continue when you like.',
      );
    } else if (tile !== undefined) {
      setMessage(
        `A nudge: the piece in row ${Math.floor(tile / SIZE) + 1}, column ${(tile % SIZE) + 1} now points along the stream.`,
      );
    } else {
      const flowing = streamState(next).wet.size;
      setMessage(
        flowing
          ? `Water reaches ${flowing} ${flowing === 1 ? 'piece' : 'pieces'}. Follow it toward the pond.`
          : 'Start at the spring on the left. Its first piece needs an opening to the left.',
      );
    }
  }

  function nudge() {
    const tile = hintFor(garden, board);
    if (tile === undefined) return;
    const next = [...board];
    next[tile] = solutionFor(garden)[tile];
    update(next, tile);
  }

  function undo() {
    if (!history.length || phase !== 'play') return;
    setBoard(history[history.length - 1]);
    setHistory((previous) => previous.slice(0, -1));
    setHint(undefined);
    setMessage('Last turn undone. There is plenty of room to try things.');
  }

  return (
    <div className="new-game quiet-current">
      <div className="new-game-info quiet-copy">
        <span className="eyebrow quiet-eyebrow">
          <Leaf size={14} /> A GENTLE UNWIND
        </span>
        <h2>Quiet Current</h2>
        <p>
          A tiny garden. A wandering stream. A little room to breathe after all
          that scrolling.
        </p>
        <ol className="quiet-instructions">
          <li>
            <span>01</span> Turn a stream piece with a tap or click.
          </li>
          <li>
            <span>02</span> Join the water from spring to pond.
          </li>
          <li>
            <span>03</span> Let three little gardens come to life.
          </li>
        </ol>
        <div
          className="quiet-progress"
          aria-label={`${phase === 'done' ? 3 : garden + (phase === 'flowing' ? 1 : 0)} of 3 gardens restored`}
        >
          {gardens.map((item, i) => (
            <span
              key={item.name}
              className={
                i < garden ||
                phase === 'done' ||
                (i === garden && phase === 'flowing')
                  ? 'restored'
                  : i === garden
                    ? 'current'
                    : ''
              }
            >
              {i < garden ||
              phase === 'done' ||
              (i === garden && phase === 'flowing') ? (
                <Check size={15} />
              ) : (
                <Leaf size={15} />
              )}
            </span>
          ))}
          <small>
            {phase === 'done'
              ? 'Three gardens, gently restored.'
              : `Garden ${garden + 1} of 3`}
          </small>
        </div>
        {phase === 'ready' && (
          <button className="primary quiet-start" onClick={() => begin(0)}>
            Take a quiet break <ArrowRight size={17} />
          </button>
        )}
        {phase === 'play' && (
          <div className="quiet-actions">
            <button className="secondary" onClick={nudge}>
              <Sparkles size={16} /> Give me a nudge
            </button>
            <button
              className="quiet-undo"
              onClick={undo}
              disabled={!history.length}
            >
              <RotateCcw size={16} /> Undo
            </button>
          </div>
        )}
        {phase === 'flowing' && (
          <button
            className="primary quiet-start"
            ref={continueRef}
            onClick={() => begin(garden + 1)}
          >
            Next little garden <ArrowRight size={17} />
          </button>
        )}
        {phase === 'done' && (
          <div className="quiet-ending">
            <h3>You can leave it here.</h3>
            <p>
              Look away from the screen. Notice something around you. The garden
              will keep.
            </p>
            <button
              className="secondary"
              ref={continueRef}
              onClick={() => begin(0)}
            >
              <RotateCcw size={16} /> Another quiet visit
            </button>
            <span className="micro">
              BREAK COMPLETE · SAVED ON THIS DEVICE WHEN AVAILABLE
            </span>
          </div>
        )}
        <output className="quiet-status">{message}</output>
        <span className="micro quiet-footnote">
          SELF-PACED · NO TIMER · SOUND-FREE
        </span>
      </div>
      <div
        className={`quiet-garden ${solved && phase !== 'ready' ? 'garden-restored' : ''}`}
      >
        <div className="quiet-garden-title">
          <span>{gardens[garden].name}</span>
          <span>{String(garden + 1).padStart(2, '0')} / 03</span>
        </div>
        <div className="quiet-landscape">
          <div className="quiet-source">
            <Droplets size={19} />
            <span>Spring</span>
          </div>
          <fieldset
            className="quiet-board"
            ref={boardRef}
            aria-label="Garden stream. Tap a piece to turn it clockwise. Use Tab to move and Enter or Space to turn."
          >
            {board.map((mask, tile) => {
              const filled = wet.has(tile) && phase !== 'ready';
              const stream = (
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  {endpoints
                    .filter(([bit]) => mask & bit)
                    .map(([bit, x, y]) => (
                      <path
                        key={bit}
                        className="stream-bed"
                        d={`M50 50 L${x} ${y}`}
                      />
                    ))}
                  <circle className="stream-center" cx="50" cy="50" r="12" />
                  {endpoints
                    .filter(([bit]) => mask & bit)
                    .map(([bit, x, y]) => (
                      <path
                        key={bit}
                        className="stream-water"
                        d={`M50 50 L${x} ${y}`}
                      />
                    ))}
                  <circle className="water-center" cx="50" cy="50" r="5" />
                </svg>
              );
              const className = `quiet-piece ${filled ? 'wet' : ''} ${hint === tile ? 'nudged' : ''} ${tile === INLET ? 'inlet' : tile === OUTLET ? 'outlet' : ''}`;
              return mask ? (
                <button
                  key={tile}
                  className={className}
                  disabled={phase !== 'play'}
                  aria-label={`Row ${Math.floor(tile / SIZE) + 1}, column ${(tile % SIZE) + 1}, ${tile === INLET ? 'spring piece, ' : tile === OUTLET ? 'pond piece, ' : ''}open ${openingNames(mask)}${filled ? ', water flowing' : ''}. Turn clockwise.`}
                  onClick={() => {
                    const next = [...board];
                    next[tile] = rotatePiece(mask);
                    update(next);
                  }}
                >
                  {stream}
                </button>
              ) : (
                <div key={tile} className="quiet-plant" aria-hidden="true">
                  <Leaf size={tile % 3 === 0 ? 24 : 16} />
                  <span />
                </div>
              );
            })}
          </fieldset>
          <div
            className={`quiet-pond ${solved && phase !== 'ready' ? 'pond-full' : ''}`}
          >
            <span className="pond-rings" />
            <span>Pond</span>
          </div>
        </div>
        <div className="quiet-garden-caption">
          <Leaf size={15} />
          <span>
            {phase === 'ready'
              ? 'A small place to put your attention.'
              : solved
                ? 'Nothing to chase. Just a little water flowing.'
                : 'Follow the water. Take your time.'}
          </span>
        </div>
      </div>
    </div>
  );
}
