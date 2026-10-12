
import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  Brain,
  Compass,
  FlaskConical,
  Zap,
  Sparkles,
  Check,
  Target,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Focus, Logic } from './exercises';
import Explore from './explore';
import Research from './research';
import GameSession from './new-games';
import { games, shuffle, type GameId } from '@/lib/games';
import { useSave, SaveDialog } from './progress';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

function Memory({ onComplete }: { onComplete: (score: number) => void }) {
  const [phase, setPhase] = useState<
    'ready' | 'watch' | 'play' | 'win' | 'miss' | 'done'
  >('ready');
  const [round, setRound] = useState(1);
  const [pattern, setPattern] = useState<number[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [retries, setRetries] = useState(0);
  const board = useRef<HTMLDivElement>(null);
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function begin(n = 1) {
    setRound(n);
    setPicked([]);
    setPattern(
      shuffle(Array.from({ length: 16 }, (_, i) => i)).slice(0, n + 2),
    );
    setPhase('watch');
  }
  useEffect(() => {
    if (phase !== 'win') return;
    const timer = window.setTimeout(
      () => begin(round + 1),
      reduceMotion ? 150 : 900,
    );
    return () => window.clearTimeout(timer);
  }, [phase, round, reduceMotion]);
  function choose(i: number) {
    if (phase !== 'play' || picked.includes(i)) return;
    setPicked([...picked, i]);
    if (!pattern.includes(i)) {
      setRetries((r) => r + 1);
      setPhase('miss');
      return;
    }
    if (picked.length + 1 === pattern.length) {
      if (round === 5) {
        setPhase('done');
        onComplete(Math.round((5 / (5 + retries)) * 100));
      } else setPhase('win');
    }
  }
  const status = {
    ready: 'A little challenge. A clearer moment.',
    watch: `Memorize tiles ${pattern.map((n) => n + 1).join(', ')}. Hide the pattern when ready.`,
    play: `Find the ${pattern.length} tiles you just saw.`,
    win: 'Nice. Loading the next pattern…',
    miss: 'Almost. Take your time and try again.',
    done: 'Five rounds. Nicely done.',
  }[phase];
  return (
    <div className="exercise-body">
      <div className="exercise-copy">
        <span className="eyebrow lime">01 / SPATIAL MEMORY</span>
        <h2>
          Remember
          <br />
          the pattern.
        </h2>
        <p>
          Watch the tiles light up, then find them from memory. Each round adds
          one more.
        </p>
        <div className="rounds">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={
                n < round || phase === 'done'
                  ? 'complete'
                  : n === round
                    ? 'current'
                    : ''
              }
            >
              {n < round || phase === 'done' ? <Check size={14} /> : n}
            </span>
          ))}
        </div>
        <p className="game-status" aria-live="polite">
          {status}
        </p>
        <div className="button-row">
          {['ready', 'miss', 'done'].includes(phase) && (
            <button
              className="primary"
              onClick={() => {
                if (phase !== 'miss') setRetries(0);
                begin(phase === 'miss' ? round : 1);
              }}
            >
              {phase === 'ready'
                ? 'Start exercise'
                : phase === 'done'
                  ? 'Play again'
                  : 'Retry round'}
              <ArrowRight size={18} />
            </button>
          )}
          {phase === 'win' && (
            <span className="auto-next" aria-live="polite">
              <span className="auto-next-bar" />
              Next round starts automatically
            </span>
          )}
          {phase === 'watch' && (
            <button
              className="primary"
              onClick={() => {
                setPhase('play');
                requestAnimationFrame(() =>
                  board.current?.querySelector('button')?.focus(),
                );
              }}
            >
              Hide pattern & begin
              <ArrowRight size={16} />
            </button>
          )}
          {phase === 'play' && <span className="pill">Your turn</span>}
        </div>
        <span className="micro">5 rounds · Self-paced study</span>
      </div>
      <div className="board-wrap">
        <div className="board-label">
          <span>MEMORY MATRIX</span>
          <span>{String(round).padStart(2, '0')} / 05</span>
        </div>
        <div className="memory-board" ref={board}>
          {Array.from({ length: 16 }, (_, i) => {
            const lit =
              ((phase === 'watch' || phase === 'miss') &&
                pattern.includes(i)) ||
              (picked.includes(i) && pattern.includes(i));
            return (
              <button
                key={i}
                aria-label={`Tile ${i + 1}${lit ? ', highlighted' : ''}`}
                aria-pressed={picked.includes(i)}
                disabled={phase !== 'play' || picked.includes(i)}
                onClick={() => choose(i)}
                className={`tile ${lit ? 'lit' : ''} ${picked.includes(i) && !pattern.includes(i) ? 'wrong' : ''} ${phase === 'ready' && [2, 5, 9, 14].includes(i) ? 'ghost' : ''}`}
              >
                {lit ? <span className="tile-dot" /> : null}
              </button>
            );
          })}
        </div>
        <span className="micro board-foot">
          {phase === 'watch'
            ? 'LOOK CLOSELY'
            : phase === 'play'
              ? 'TRUST YOUR MEMORY'
              : 'ONE THING AT A TIME'}
        </span>
      </div>
    </div>
  );
}

const originals = [
  {
    id: 'memory',
    name: 'Memory matrix',
    category: 'Memory',
    tag: 'SPATIAL PATTERNS',
    description: 'Keep a pattern in your mind.',
  },
  {
    id: 'focus',
    name: 'Color focus',
    category: 'Attention',
    tag: 'COLOR INTERFERENCE',
    description: 'Follow the ink, ignore the word.',
  },
  {
    id: 'logic',
    name: 'Missing link',
    category: 'Reasoning',
    tag: 'NUMBER PATTERNS',
    description: 'Find the rule behind the numbers.',
  },
];
const allGames = [...originals, ...games];
export default function Home() {
  const [tab, setTab] = useState('train');
  const [game, setGame] = useState('memory');
  const [visited, setVisited] = useState(['memory']);
  const [filter, setFilter] = useState('All');
  const [lesson, setLesson] = useState('engine');
  const [question, setQuestion] = useState('');
  const save = useSave();
  function go(section: string) {
    setTab(section);
    requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>(
        `[data-main-heading="${section}"]`,
      );
      heading?.focus();
      heading?.scrollIntoView({
        block: 'start',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
    });
  }
  function pick(id: string) {
    setGame(id);
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
    requestAnimationFrame(() =>
      document.getElementById('exercise-top')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        block: 'start',
      }),
    );
  }
  function surprise() {
    const pool = allGames.filter(
      (g) => filter === 'All' || g.category === filter,
    );
    pick(shuffle(pool.map((g) => g.id))[0]);
  }
  const today = new Date().toDateString();
  const completed = save.data.sessions.filter(
    (s) => new Date(s.date).toDateString() === today,
  ).length;
  return (
    <Tabs value={tab} onValueChange={(v) => setTab(String(v))} className="app">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => go('train')}
          aria-label="Brainmaxing home"
        >
          <span className="brand-icon">
            <Brain size={23} />
          </span>
          brainmaxing
        </button>
        <TabsList className="main-nav" aria-label="Main sections">
          <TabsTrigger value="train">
            <Zap />
            Train
          </TabsTrigger>
          <TabsTrigger value="explore">
            <Compass />
            Explore
          </TabsTrigger>
          <TabsTrigger value="research">
            <FlaskConical />
            Notebook
          </TabsTrigger>
        </TabsList>
        <SaveDialog
          data={save.data}
          ready={save.ready}
          onImport={save.importData}
        />
      </header>
      <main id="main">
        <div className="intro">
          <div>
            <div className="eyebrow">THE CURIOSITY GYM</div>
            <h1>
              Unscroll. <span>Switch on.</span>
            </h1>
            <p>Small challenges. Big rabbit holes. A little space to think.</p>
          </div>
          <div className="session">
            <span className="session-icon">
              <Sparkles size={22} />
            </span>
            <div>
              <b>{completed} completed today</b>
              <span>
                {save.data.sessions.length} sessions saved on this device
              </span>
            </div>
          </div>
        </div>
        {save.error && (
          <p className="storage-error" role="alert">
            {save.error}
          </p>
        )}
        <TabsContent value="train" keepMounted>
          <div className="section-title" id="exercise-top">
            <h2 tabIndex={-1} data-main-heading="train">
              Your mental warm-up
            </h2>
            <Select
              value={game}
              onValueChange={(v) => {
                if (v) pick(v);
              }}
            >
              <SelectTrigger className="game-select" aria-label="Choose a game">
                <SelectValue>
                  {allGames.find((g) => g.id === game)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {allGames.map((g) => (
                  <SelectItem value={g.id} key={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="training-layout">
            <section className="exercise-panel" aria-label="Selected exercise">
              {visited.map((id) => (
                <div key={id} hidden={id !== game}>
                  {id === 'memory' ? (
                    <Memory
                      onComplete={(score) =>
                        save.complete({ game: id, level: 1, score })
                      }
                    />
                  ) : id === 'focus' ? (
                    <Focus
                      onComplete={(score) =>
                        save.complete({ game: id, level: 1, score })
                      }
                    />
                  ) : id === 'logic' ? (
                    <Logic
                      onComplete={(score) =>
                        save.complete({ game: id, level: 1, score })
                      }
                    />
                  ) : (
                    <GameSession
                      id={id as GameId}
                      active={tab === 'train' && id === game}
                      onComplete={(score, level) =>
                        save.complete({ game: id, level, score })
                      }
                    />
                  )}
                </div>
              ))}
            </section>
            <aside className="side-stack">
              <div className="note-card">
                <span className="eyebrow">A MOMENT, RECLAIMED</span>
                <h3>
                  Start gently.
                  <br />
                  Find your rhythm.
                </h3>
                <p>
                  One short session is enough. Choose a harder mode when you
                  feel like a challenge.
                </p>
                <div className="daily-count">
                  <strong>{completed}</strong>
                  <span>
                    sessions today
                    <br />
                    no streak to protect
                  </span>
                </div>
                <span className="micro">YOUR PACE. YOUR PRACTICE.</span>
              </div>
              <div className="small-note">
                <Target size={21} />
                <p>
                  Practice for the joy of it.
                  <br />
                  <span>
                    Scores describe these games, not your intelligence.
                  </span>
                </p>
              </div>
              {save.data.sessions.length > 0 && (
                <div className="recent-session">
                  <span className="eyebrow">LAST SESSION</span>
                  <b>
                    {
                      allGames.find((g) => g.id === save.data.sessions[0].game)
                        ?.name
                    }
                  </b>
                  <span>
                    {save.data.sessions[0].score}% ·{' '}
                    {
                      ['Gentle', 'Steady', 'Challenge'][
                        save.data.sessions[0].level - 1
                      ]
                    }
                  </span>
                </div>
              )}
            </aside>
          </div>
          <div className="section-title below challenge-title">
            <div>
              <h2>Find your kind of challenge</h2>
              <span>{allGames.length} GAMES · AT YOUR OWN PACE</span>
            </div>
            <button className="secondary surprise-button" onClick={surprise}>
              <Sparkles size={16} />
              Pick for me
            </button>
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(String(v))}>
            <TabsList className="category-tabs" aria-label="Filter games">
              {['All', 'Memory', 'Attention', 'Reasoning', 'Learning'].map(
                (c) => (
                  <TabsTrigger key={c} value={c}>
                    {c}
                  </TabsTrigger>
                ),
              )}
            </TabsList>
          </Tabs>
          <div className="game-library">
            {allGames
              .filter((g) => filter === 'All' || g.category === filter)
              .map((g) => (
                <button
                  className={`game-card ${game === g.id ? 'selected' : ''}`}
                  key={g.id}
                  onClick={() => pick(g.id)}
                  aria-pressed={game === g.id}
                >
                  <span className="game-card-top">
                    <span>{g.category}</span>
                    {games.some((x) => x.id === g.id) && (
                      <span className="new-badge">New</span>
                    )}
                  </span>
                  <span className="game-card-index">
                    {String(
                      allGames.findIndex((x) => x.id === g.id) + 1,
                    ).padStart(2, '0')}
                  </span>
                  <h3>{g.name}</h3>
                  <p>{g.description}</p>
                  <span className="card-bottom">
                    {g.tag}
                    <ArrowUpRight size={17} />
                  </span>
                </button>
              ))}
          </div>
          <p className="evidence-note">
            Memory and attention tasks include links to the research that
            inspired them. New word, math, and coding puzzles are educational
            games. Scores describe your play in this app.
          </p>
          <div className="section-title below">
            <h2>Follow a little curiosity</h2>
            <button className="text-button" onClick={() => go('explore')}>
              Explore the lab
              <ArrowUpRight size={17} />
            </button>
          </div>
          <div className="teaser-grid">
            {[
              ['engine', 'The engine', 'How does fuel become motion?'],
              ['internet', 'The internet', 'What happens when you hit send?'],
              ['space', 'Black holes', 'How can something invisible be found?'],
            ].map(([id, title, q]) => (
              <button
                className="teaser"
                key={id}
                onClick={() => {
                  setLesson(id);
                  go('explore');
                }}
              >
                <span className="teaser-num">OFFLINE DEEP DIVE</span>
                <h3>
                  {title}
                  <ArrowUpRight />
                </h3>
                <p>{q}</p>
              </button>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="explore" keepMounted>
          <h2 className="sr-only" tabIndex={-1} data-main-heading="explore">
            The curiosity lab
          </h2>
          <Explore
            initial={lesson}
            onResearch={(q) => {
              setQuestion(q);
              go('research');
            }}
          />
        </TabsContent>
        <TabsContent value="research" keepMounted>
          <h2 className="sr-only" tabIndex={-1} data-main-heading="research">
            Your curiosity notebook
          </h2>
          <Research
            initial={question}
            data={save.data}
            ready={save.ready}
            onNote={save.note}
            onDelete={save.deleteNote}
          />
        </TabsContent>
        <footer>
          <span className="brand small">
            <Brain size={18} />
            brainmaxing
          </span>
          <span>{allGames.length} games. Zero accounts. Yours to explore.</span>
          <details className="privacy">
            <summary>Privacy & offline use</summary>
            <p>
              Notes and game history are stored in this browser. The app has no
              login, analytics, or live search. Source links leave the app and
              need internet. After one online visit, this browser can cache the app for
              offline play. Export codes contain your notes and results without
              encryption. Clear browser storage to remove your local save.
              Static hosting providers may retain normal access logs.
            </p>
          </details>
        </footer>
      </main>
    </Tabs>
  );
}
