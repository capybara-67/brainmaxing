/* eslint-disable jsx-a11y/prefer-tag-over-role, react/react-compiler -- Inline SVG diagrams need an accessible image role, and lesson selection follows parent navigation. */
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  Check,
  Flame,
  Network,
  Orbit,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
export const lessons = [
  {
    id: 'engine',
    name: 'The engine',
    icon: Flame,
    tag: 'MECHANICAL WORLDS',
    question: 'How does a little fuel move a whole car?',
    intro: 'Follow energy from a drop of fuel to a turning wheel.',
    steps: [
      [
        'Intake',
        'The piston moves down as the intake valve opens. In this simplified gasoline engine, air and fuel enter the cylinder.',
      ],
      [
        'Compression',
        'The valves close. The piston moves up and squeezes the mixture into a smaller space.',
      ],
      [
        'Power',
        'A spark starts combustion. Expanding gases push the piston down. A connecting rod turns this motion into crankshaft rotation.',
      ],
      [
        'Exhaust',
        'The exhaust valve opens. The piston moves up and pushes the spent gases out. Then the cycle starts again.',
      ],
    ],
    ask: 'Which part turns the piston’s up-and-down movement into rotation?',
    options: ['The exhaust valve', 'The crankshaft', 'The spark plug'],
    answer: 1,
    why: 'The connecting rod transfers force from the piston to the rotating crankshaft.',
    wonder: 'Why does a diesel engine not need a spark plug?',
    source: 'US Department of Energy',
    url: 'https://www.energy.gov/cmei/vehicles/articles/internal-combustion-engine-basics',
  },
  {
    id: 'internet',
    name: 'The internet',
    icon: Network,
    tag: 'INVISIBLE SYSTEMS',
    question: 'What actually happens when you hit send?',
    intro:
      'A message travels as many small pieces, across a network of networks.',
    steps: [
      [
        'Break it up',
        'Data is split into packets. Each packet carries a payload and information that helps the network deliver it.',
      ],
      [
        'Find a path',
        'Routers forward packets toward their destination. Packets can take different routes through interconnected networks.',
      ],
      [
        'Cross the distance',
        'Bits travel as signals through cables, fiber, and radio links. The internet is physical infrastructure, as well as shared rules.',
      ],
      [
        'Put it together',
        'The receiving system reassembles the data. Reliable protocols such as TCP can detect missing data and arrange retransmission.',
      ],
    ],
    ask: 'Why split a message into packets?',
    options: [
      'So connections can share the network',
      'So every packet takes one fixed path',
      'To remove the need for cables',
    ],
    answer: 0,
    why: 'Packet switching lets many connections share network resources.',
    wonder: 'How does DNS turn a website name into an address?',
    source: 'Cloudflare Learning Center',
    url: 'https://www.cloudflare.com/learning/network-layer/how-does-the-internet-work/',
  },
  {
    id: 'space',
    name: 'Black holes',
    icon: Orbit,
    tag: 'COSMIC QUESTIONS',
    question: 'How can something invisible be found?',
    intro: 'Separate the black hole from the glowing material around it.',
    steps: [
      [
        'The boundary',
        'The event horizon is a boundary of no return. Once something crosses inward, even light cannot escape outward.',
      ],
      [
        'The surroundings',
        'Gas outside a black hole can form a hot accretion disk. Its glow comes from the surrounding matter, not from inside the event horizon.',
      ],
      [
        'The clues',
        'Astronomers study nearby stars, hot gas, and gravitational waves to learn about black holes. Different observations reveal different properties.',
      ],
      [
        'The next question',
        'An image of a black hole shows its dark shadow against glowing surroundings. It does not show the interior. What lies inside remains a frontier of physics.',
      ],
    ],
    ask: 'Where does the glow around a black hole come from?',
    options: [
      'Light escaping the interior',
      'Hot matter outside the horizon',
      'The event horizon acting like a lamp',
    ],
    answer: 1,
    why: 'Matter outside the horizon can emit light before it falls in.',
    wonder: 'How can gravitational waves reveal a black hole merger?',
    source: 'NASA Science',
    url: 'https://science.nasa.gov/universe/black-holes/anatomy/',
  },
];
function Diagram({ id, step }: { id: string; step: number }) {
  if (id === 'engine') {
    const y = [145, 77, 145, 77][step];
    return (
      <svg
        viewBox="0 0 360 300"
        role="img"
        aria-label={`${lessons[0].steps[step][0]} stroke: piston ${step % 2 === 0 ? 'down' : 'up'}`}
      >
        <defs>
          <pattern
            id="engineGrid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 0H0V20"
              fill="none"
              stroke="#d4ddda"
              strokeWidth=".6"
            />
          </pattern>
        </defs>
        <rect width="360" height="300" fill="url(#engineGrid)" />
        <path
          d="M112 44V200M248 44V200M112 44H248"
          fill="none"
          stroke="#75897f"
          strokeWidth="5"
        />
        <rect
          x="116"
          y="48"
          width="128"
          height={y - 48}
          fill={step === 2 ? '#c49352' : '#739785'}
          opacity=".4"
        />
        <path
          d={`M180 ${y + 15} L${step % 2 === 0 ? 210 : 154} 233`}
          stroke="#647e72"
          strokeWidth="13"
        />
        <circle
          cx="180"
          cy="246"
          r="35"
          fill="none"
          stroke="#7b8f83"
          strokeWidth="7"
        />
        <path
          d={`M180 246L${step % 2 === 0 ? 210 : 154} 233`}
          stroke="#294cba"
          strokeWidth="10"
        />
        <rect x="116" y={y} width="128" height="24" rx="3" fill="#a5b4cf" />
        <path
          d={`M133 29V${step === 0 ? 68 : 43}M225 29V${step === 3 ? 68 : 43}`}
          stroke={step === 0 || step === 3 ? '#294cba' : '#7d8e87'}
          strokeWidth="8"
        />
        <path d="M180 31V54" stroke="#294cba" strokeWidth="5" />
        <text x="16" y="114" fill="#64766a" fontSize="12">
          CYLINDER
        </text>
        <path d="M83 110H108" stroke="#879b8d" />
        <text x="258" y={y + 17} fill="#294cba" fontSize="12">
          PISTON
        </text>
        <text x="234" y="269" fill="#64766a" fontSize="12">
          CRANKSHAFT
        </text>
      </svg>
    );
  }
  if (id === 'internet')
    return (
      <div className="network-diagram">
        {[
          'Split into packets',
          'Choose a route',
          'Transmit signals',
          'Reassemble data',
        ].map((label, i) => (
          <div
            key={label}
            className={i === step ? 'network-node active' : 'network-node'}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            <b>{label}</b>
            {i < 3 && <ArrowRight size={20} />}
          </div>
        ))}
      </div>
    );
  return (
    <svg
      viewBox="0 0 360 300"
      role="img"
      aria-label="Schematic of a black hole: event horizon surrounded by matter, not to scale"
    >
      <ellipse
        cx="180"
        cy="150"
        rx="145"
        ry="61"
        fill="none"
        stroke="#9a89bb"
        strokeWidth="18"
        opacity=".5"
      />
      <circle
        cx="180"
        cy="150"
        r="69"
        fill="#26354b"
        stroke="#294cba"
        strokeWidth="3"
      />
      <circle
        cx="180"
        cy="150"
        r="86"
        fill="none"
        stroke="#889ea0"
        strokeDasharray="3 6"
      />
      <path d="M182 219V257H274M268 125L302 71" fill="none" stroke="#85979a" />
      <text x="186" y="275" fill="#294cba" fontSize="12">
        EVENT HORIZON
      </text>
      <text x="214" y="59" fill="#74638f" fontSize="12">
        SURROUNDING MATTER
      </text>
    </svg>
  );
}
function Lesson({
  index,
  onResearch,
}: {
  index: number;
  onResearch: (q: string) => void;
}) {
  const l = lessons[index];
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  return (
    <div className="lesson-content">
      <div className="lesson-heading">
        <span className="eyebrow lime">{l.tag}</span>
        <h2>{l.question}</h2>
        <p>{l.intro}</p>
      </div>
      <div className="lesson-grid">
        <div className="diagram-panel">
          <div className="board-label">
            <span>THE WORKING MODEL</span>
            <span>0{step + 1} / 04</span>
          </div>
          <Diagram id={l.id} step={step} />
          <span className="micro">
            {l.id === 'engine'
              ? 'SIMPLIFIED FOUR-STROKE GASOLINE ENGINE'
              : 'CONCEPTUAL DIAGRAM · NOT TO SCALE'}
          </span>
        </div>
        <div className="lesson-steps">
          <span className="eyebrow">STEP {step + 1} OF 4</span>
          <h3>{l.steps[step][0]}</h3>
          <p>{l.steps[step][1]}</p>
          <Progress aria-label="Lesson progress" value={(step + 1) * 25} />
          <div className="step-controls">
            <button
              className="secondary"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              <ChevronLeft size={17} />
              Back
            </button>
            <button
              className="primary"
              disabled={step === 3}
              onClick={() => setStep((s) => s + 1)}
            >
              Next step
              <ArrowRight size={17} />
            </button>
          </div>
          <a
            className="source-link"
            href={l.url}
            target="_blank"
            rel="noreferrer"
          >
            Source: {l.source}
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <div className="quiz-panel">
        <span className="eyebrow">MAKE IT STICK</span>
        <h3>{l.ask}</h3>
        <div className="quiz-options">
          {l.options.map((o, i) => (
            <button
              className={
                answer !== null && i === l.answer
                  ? 'correct'
                  : answer === i
                    ? 'incorrect'
                    : ''
              }
              disabled={answer !== null}
              onClick={() => setAnswer(i)}
              key={o}
            >
              {o}
              {answer !== null && i === l.answer && <Check size={16} />}
            </button>
          ))}
        </div>
        {answer !== null && (
          <p className="quiz-feedback" aria-live="polite">
            {answer === l.answer ? 'You got it. ' : 'Keep exploring. '}
            {l.why}
          </p>
        )}
      </div>
      <button className="rabbit-hole" onClick={() => onResearch(l.wonder)}>
        <span>
          <span className="eyebrow">THE NEXT RABBIT HOLE</span>
          <b>{l.wonder}</b>
        </span>
        <ArrowUpRight />
      </button>
    </div>
  );
}
export default function Explore({
  initial = 'engine',
  onResearch,
}: {
  initial?: string;
  onResearch: (q: string) => void;
}) {
  const [selected, setSelected] = useState(initial);
  useEffect(() => setSelected(initial), [initial]);
  return (
    <Tabs
      value={selected}
      onValueChange={(v) => setSelected(String(v))}
      className="explore-section"
    >
      <div className="section-title">
        <h2>The curiosity lab</h2>
        <span>UNDERSTAND IT. DON’T JUST READ IT.</span>
      </div>
      <TabsList className="lesson-tabs" aria-label="Choose a lesson">
        {lessons.map((l) => (
          <TabsTrigger key={l.id} value={l.id}>
            <l.icon size={18} />
            {l.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {lessons.map((l, i) => (
        <TabsContent value={l.id} key={l.id} keepMounted>
          <Lesson index={i} onResearch={onResearch} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
