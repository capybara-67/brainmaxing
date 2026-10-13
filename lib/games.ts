export type GameId =
  | 'nback'
  | 'path'
  | 'reverse'
  | 'pairs'
  | 'retrieval'
  | 'flanker'
  | 'switch'
  | 'inhibit'
  | 'search'
  | 'rotation'
  | 'arithmetic'
  | 'ordering'
  | 'anagram'
  | 'oddity'
  | 'magnitude'
  | 'binary'
  | 'total'
  | 'compass'
  | 'count'
  | 'analogy'
  | 'deduction'
  | 'code';
export type Game = {
  id: GameId;
  name: string;
  category: string;
  tag: string;
  description: string;
  instructions: string;
  evidence: string;
  source?: string;
  url?: string;
  visual?: boolean;
  timed?: boolean;
  fresh?: boolean;
};
export const games: Game[] = [
  {
    id: 'total',
    name: 'Running total',
    category: 'Memory',
    tag: 'MENTAL UPDATING',
    description: 'Keep a total as the numbers change.',
    instructions:
      'Start at zero. Apply each addition or subtraction as it appears, then choose the final total from memory. Harder modes add more steps and larger changes.',
    evidence:
      'A recreational mental arithmetic and memory exercise. Feedback walks through every update so you can check your approach.',
    fresh: true,
  },
  {
    id: 'compass',
    name: 'Compass recall',
    category: 'Memory',
    tag: 'DIRECTION TRACKING',
    description: 'Remember the turns. Find your heading.',
    instructions:
      'Remember the starting direction, then imagine each turn in order. Left and right are quarter turns; turn around means a half turn. Choose your final heading after the instructions are hidden.',
    evidence:
      'A recreational direction and sequence puzzle. The turns are imaginary; you can stay seated and study each step at your own pace.',
    fresh: true,
  },
  {
    id: 'count',
    name: 'Letter lookout',
    category: 'Attention',
    tag: 'SELECTIVE COUNTING',
    description: 'Count the target among lookalikes.',
    instructions:
      'Count only the target letter in the grid. The target stays visible. Harder modes use bigger grids and similar-looking distractors. There is no timer.',
    evidence:
      'A recreational visual attention exercise. This letter grid is not a standardized attention assessment.',
    visual: true,
    fresh: true,
  },
  {
    id: 'analogy',
    name: 'Connection builder',
    category: 'Learning',
    tag: 'WORD RELATIONSHIPS',
    description: 'Find the relationship. Complete the pair.',
    instructions:
      'Find how the first two words relate, then complete a second pair with the same relationship. Harder modes use less direct connections. Feedback explains each link.',
    evidence:
      'An educational word relationship puzzle using curated examples. It practices the vocabulary and relationships in these questions.',
    fresh: true,
  },
  {
    id: 'deduction',
    name: 'Clue line',
    category: 'Reasoning',
    tag: 'LOGICAL DEDUCTION',
    description: 'Put the clues together. Find the order.',
    instructions:
      'People stand in a line from left to right. Use every clue to choose who occupies the requested position. Clues stay visible; harder modes add more people and mix their wording.',
    evidence:
      'A recreational deduction puzzle. Each set of clues determines one complete ordering, explained after your answer.',
    fresh: true,
  },
  {
    id: 'code',
    name: 'Code cracker',
    category: 'Reasoning',
    tag: 'RULE DISCOVERY',
    description: 'Decode a rule from worked examples.',
    instructions:
      'Use the input-output examples to find a rule, then apply it to a new input. Gentle adds a fixed amount, Steady multiplies, and Challenge multiplies then adds. These are the only possible rule types.',
    evidence:
      'An educational arithmetic rule puzzle. The allowed rule family is specified because a few examples can otherwise fit many patterns.',
    fresh: true,
  },
  {
    id: 'nback',
    name: 'Signal stream',
    category: 'Memory',
    tag: 'N-BACK',
    description: 'Keep the recent past in mind.',
    instructions:
      'Study the opening letters. For each new letter, decide whether it matches the one shown the stated number of steps earlier.',
    evidence:
      'Inspired by the n-back task, which studies continuous updating of recent information. Our short, self-paced letter game is an adaptation.',
    source: 'Kirchner, 1958',
    url: 'https://pubmed.ncbi.nlm.nih.gov/13539317/',
  },
  {
    id: 'path',
    name: 'Path echo',
    category: 'Memory',
    tag: 'SPATIAL SEQUENCE',
    description: 'Follow a trail. Play it back.',
    instructions:
      'Step through the highlighted pads, one at a time. Then tap them in the same order. You control the study pace.',
    evidence:
      'Inspired by the Corsi block-tapping task used to study visuospatial short-term memory. This labeled grid and manual pacing differ from standardized testing.',
    source: 'Kessels et al., 2000',
    url: 'https://doi.org/10.1207/S15324826AN0704_8',
    visual: true,
  },
  {
    id: 'reverse',
    name: 'Reverse relay',
    category: 'Memory',
    tag: 'BACKWARD RECALL',
    description: 'Hold the digits. Reverse the order.',
    instructions:
      'Study one digit at a time, then type the sequence backward. You can edit your answer before submitting.',
    evidence:
      'Backward serial recall is studied in memory research. Attention, presentation, and visuospatial strategies all affect performance; this is not a pure measure of intelligence.',
    source: 'St Clair-Thompson & Allen, 2013',
    url: 'https://pubmed.ncbi.nlm.nih.gov/23263876/',
  },
  {
    id: 'pairs',
    name: 'Word links',
    category: 'Learning',
    tag: 'PAIRED ASSOCIATES',
    description: 'Make unexpected connections.',
    instructions:
      'Study a small set of word pairs. Then choose the missing partner for each cue. This is a recognition version, with choices to keep it approachable.',
    evidence:
      'Paired-associate experiments examine learning and retrieval. Recognition choices in this game are easier than the unassisted recall used in much of this research.',
    source: 'Karpicke & Roediger, 2008',
    url: 'https://doi.org/10.1126/science.1152408',
  },
  {
    id: 'retrieval',
    name: 'Recall trail',
    category: 'Learning',
    tag: 'RETRIEVAL PRACTICE',
    description: 'Meet an idea. Bring it back.',
    instructions:
      'Answer six questions, learn from the feedback, then revisit three of them after other questions. Mistakes tell you what to revisit.',
    evidence:
      'General-knowledge experiments found that testing with feedback improved later retention. This short session practices retrieval; it does not establish long-term gains.',
    source: 'Butler et al., 2008',
    url: 'https://pubmed.ncbi.nlm.nih.gov/18605878/',
  },
  {
    id: 'flanker',
    name: 'Arrow focus',
    category: 'Attention',
    tag: 'FLANKER TASK',
    description: 'Find the signal in the crowd.',
    instructions:
      'Choose the direction of the middle arrow. The surrounding arrows may agree or try to distract you. No deadline.',
    evidence:
      'Inspired by the Eriksen flanker paradigm. The original experiments used letters; arrows here are a visual adaptation for distraction practice.',
    source: 'Eriksen & Eriksen, 1974',
    url: 'https://doi.org/10.3758/BF03203267',
    visual: true,
  },
  {
    id: 'switch',
    name: 'Rule shift',
    category: 'Attention',
    tag: 'TASK SWITCHING',
    description: 'New rule. Fresh perspective.',
    instructions:
      'Follow the text cue: ODD / EVEN or BELOW / ABOVE 5. The number 5 never appears. Read the rule each time.',
    evidence:
      'Cued task-switching experiments include parity and magnitude judgments. Our untimed accuracy game does not measure laboratory switch costs.',
    source: 'Schneider & Logan, 2011',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3074508/',
  },
  {
    id: 'inhibit',
    name: 'Hold fire',
    category: 'Attention',
    tag: 'GO / NO-GO',
    description: 'Sometimes the move is to wait.',
    instructions:
      'Press once for a circle. Let the window finish without pressing for an X. Start each trial when ready. Leaving this game pauses it.',
    evidence:
      'Go/no-go research examines response inhibition and learned stimulus-response associations. Practice may reflect those mappings, not a general improvement in self-control.',
    source: 'Verbruggen & Logan, 2008',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2597400/',
    timed: true,
  },
  {
    id: 'search',
    name: 'Find the match',
    category: 'Attention',
    tag: 'VISUAL SEARCH',
    description: 'Look closely. Is it there?',
    instructions:
      'Look for a filled circle. Decide whether it is present among the other shapes. The target stays visible, and there is no time limit.',
    evidence:
      'Feature-integration research compares searches for individual features and combinations. This shape-and-fill game is a simplified visual-search adaptation.',
    source: 'Treisman & Gelade, 1980',
    url: 'https://doi.org/10.1016/0010-0285(80)90005-5',
    visual: true,
  },
  {
    id: 'rotation',
    name: 'Turn it over',
    category: 'Reasoning',
    tag: 'MENTAL ROTATION',
    description: 'A new angle. The same shape?',
    instructions:
      'Compare the shapes. Could a rotation alone make them match, or has the second shape been mirrored? No time limit.',
    evidence:
      'Cooper studied recognition of rotated two-dimensional shapes. Keeping a reference visible and using simple block shapes are adaptations in this game.',
    source: 'Cooper, 1975',
    url: 'https://doi.org/10.1016/0010-0285(75)90003-1',
    visual: true,
  },
  {
    id: 'arithmetic',
    name: 'Mental math',
    category: 'Reasoning',
    tag: 'ARITHMETIC',
    description: 'Work the numbers in your head.',
    instructions:
      'Solve eight short arithmetic problems. Harder modes add multiplication and two-step expressions. Take your time; accuracy earns the score.',
    evidence:
      'An educational arithmetic game, with a worked explanation after every answer. Scores describe this session only.',
  },
  {
    id: 'ordering',
    name: 'Order recall',
    category: 'Memory',
    tag: 'SORTED RECALL',
    description: 'Remember the numbers. Put them in order.',
    instructions:
      'Study the numbers one at a time. Hide them, then choose the list sorted from smallest to largest. Harder modes add more numbers.',
    evidence:
      'A recreational memory and sorting puzzle. Manual study pacing makes this practice rather than a standardized assessment.',
  },
  {
    id: 'anagram',
    name: 'Word forge',
    category: 'Learning',
    tag: 'LETTER PUZZLES',
    description: 'Turn scrambled letters into a word.',
    instructions:
      'Use the clue to find the word made from the scrambled letters. All answer options have the same length. Feedback shows the intended word.',
    evidence:
      'A vocabulary puzzle using a small curated word bank. This is educational play, not a test of language ability.',
  },
  {
    id: 'oddity',
    name: 'Odd one out',
    category: 'Reasoning',
    tag: 'CLASSIFICATION',
    description: 'Find the item that breaks the rule.',
    instructions:
      'Three items share a property and one does not. Choose the exception, then read the explanation. Each level uses a different kind of rule.',
    evidence:
      'A recreational classification puzzle. Every question gives a specific rule in its feedback because categories can otherwise be ambiguous.',
  },
  {
    id: 'magnitude',
    name: 'Number sense',
    category: 'Reasoning',
    tag: 'NUMERICAL COMPARISON',
    description: 'Different forms. Which number is bigger?',
    instructions:
      'Compare two quantities. Gentle mode uses whole numbers, Steady uses fractions, and Challenge compares fractions with decimals. Equal is a valid answer.',
    evidence:
      'An educational comparison game. Explanations show the numerical values so you can check the reasoning.',
  },
  {
    id: 'binary',
    name: 'Bit by bit',
    category: 'Learning',
    tag: 'BINARY NUMBERS',
    description: 'Decode the language of bits.',
    instructions:
      'Read a binary number and choose its decimal value. Each bit contributes its place value when it is 1. Harder modes add more bits.',
    evidence:
      'A computer-science learning game. It practices base-two place values and gives a worked sum after each answer.',
  },
];
export function shuffle<T>(
  input: readonly T[],
  random: () => number = Math.random,
): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const randomInt = (n: number) => Math.floor(Math.random() * n);
export type Trial = {
  prompt: string;
  answer: string;
  choices?: string[];
  stimulus?: string;
  study?: string[];
  pads?: number[];
  sequence?: string;
  shapes?: string[];
  angle?: number;
  mirror?: boolean;
  reason: string;
  condition?: string;
  lines?: string[];
};
const words = [
  ['harbor', 'velvet'],
  ['candle', 'forest'],
  ['pocket', 'river'],
  ['ladder', 'cloud'],
  ['marble', 'garden'],
  ['window', 'comet'],
  ['anchor', 'ribbon'],
  ['meadow', 'lantern'],
];
const facts = [
  {
    q: 'In a four-stroke gasoline engine, what starts combustion?',
    a: 'A spark',
    o: ['A spark', 'The exhaust valve', 'A gear'],
    why: 'A spark ignites the compressed air–fuel mixture. Expanding gases then push the piston.',
  },
  {
    q: 'Which part turns piston motion into rotation?',
    a: 'The crankshaft',
    o: ['The crankshaft', 'The spark plug', 'The fuel tank'],
    why: 'A connecting rod transfers the piston’s force to the crankshaft.',
  },
  {
    q: 'What is a small unit of data sent through a network called?',
    a: 'A packet',
    o: ['A packet', 'A piston', 'An orbit'],
    why: 'Networks split messages into packets so connections can share network resources.',
  },
  {
    q: 'What do routers do?',
    a: 'Forward packets',
    o: ['Forward packets', 'Store all websites', 'Create electricity'],
    why: 'Routers forward packets toward their destinations across interconnected networks.',
  },
  {
    q: 'What is a black hole’s event horizon?',
    a: 'A boundary of no return',
    o: ['A boundary of no return', 'A solid shell', 'A glowing star'],
    why: 'Once light crosses inward, it cannot escape outward from the event horizon.',
  },
  {
    q: 'Where does the glow around a black hole come from?',
    a: 'Surrounding matter',
    o: ['Surrounding matter', 'Light from its interior', 'Its solid surface'],
    why: 'Hot matter outside the horizon can emit light. The glow does not escape from inside.',
  },
];
// Each entry includes the relationship explicitly, avoiding ambiguous feedback.
const analogies: readonly (readonly [
  string,
  string,
  string,
  readonly string[],
  string,
][])[] = [
  [
    [
      'Bird : nest',
      'Bee',
      'hive',
      ['web', 'den', 'pond'],
      'A bird lives in a nest; a bee lives in a hive.',
    ],
    [
      'Hand : glove',
      'Foot',
      'sock',
      ['hat', 'belt', 'scarf'],
      'A glove covers a hand; a sock covers a foot.',
    ],
    [
      'Dog : puppy',
      'Cat',
      'kitten',
      ['calf', 'foal', 'cub'],
      'A puppy is a young dog; a kitten is a young cat.',
    ],
    [
      'Hot : cold',
      'Day',
      'night',
      ['sun', 'noon', 'light'],
      'Hot and cold are opposites; day and night are opposites.',
    ],
    [
      'Eye : see',
      'Ear',
      'hear',
      ['taste', 'touch', 'smell'],
      'Eyes are used to see; ears are used to hear.',
    ],
    [
      'Fish : swim',
      'Bird',
      'fly',
      ['dig', 'crawl', 'gallop'],
      'Swimming is characteristic movement for fish; flying is characteristic movement for birds.',
    ],
  ],
  [
    [
      'Painter : brush',
      'Writer',
      'pen',
      ['canvas', 'ruler', 'hammer'],
      'A painter uses a brush to create; a writer uses a pen.',
    ],
    [
      'Page : book',
      'Brick',
      'wall',
      ['roof', 'window', 'paint'],
      'Pages make up a book; bricks make up a wall.',
    ],
    [
      'Minute : hour',
      'Month',
      'year',
      ['week', 'day', 'season'],
      'An hour contains minutes; a year contains months.',
    ],
    [
      'Seed : plant',
      'Egg',
      'chick',
      ['nest', 'feather', 'shell'],
      'A seed can develop into a plant; a fertilized chicken egg can develop into a chick.',
    ],
    [
      'Thermometer : temperature',
      'Scale',
      'weight',
      ['length', 'speed', 'time'],
      'A thermometer measures temperature; a weighing scale measures weight.',
    ],
    [
      'Library : books',
      'Museum',
      'exhibits',
      ['tickets', 'roads', 'recipes'],
      'A library houses books; a museum houses exhibits.',
    ],
  ],
  [
    [
      'Drought : scarce water',
      'Famine',
      'scarce food',
      ['heavy rain', 'strong wind', 'bright light'],
      'Drought involves a shortage of water; famine involves a shortage of food.',
    ],
    [
      'Compass : direction',
      'Clock',
      'time',
      ['distance', 'pressure', 'volume'],
      'A compass indicates direction; a clock indicates time.',
    ],
    [
      'Editor : manuscript',
      'Mechanic',
      'vehicle',
      ['recipe', 'garden', 'fabric'],
      'An editor corrects a manuscript; a mechanic repairs a vehicle.',
    ],
    [
      'Blueprint : building',
      'Recipe',
      'dish',
      ['menu', 'plate', 'shop'],
      'A blueprint guides construction of a building; a recipe guides preparation of a dish.',
    ],
    [
      'Evaporation : liquid to gas',
      'Melting',
      'solid to liquid',
      ['gas to liquid', 'liquid to solid', 'solid to gas'],
      'Evaporation changes liquid to gas; melting changes solid to liquid.',
    ],
    [
      'Encrypt : decrypt',
      'Compress',
      'decompress',
      ['duplicate', 'delete', 'compile'],
      'Decryption reverses encryption; decompression reverses compression.',
    ],
  ],
] as const;

export function createTrials(id: GameId, level: number): Trial[] {
  const difficulty = Number.isFinite(level)
    ? Math.min(3, Math.max(1, Math.trunc(level)))
    : 1;
  const count = 8;
  function choicesFor(value: number) {
    const delta = shuffle([-10, -5, -3, -2, -1, 1, 2, 3, 5, 10]).slice(0, 3);
    return shuffle([value, ...delta.map((d) => value + d)]).map(String);
  }
  if (id === 'total')
    return Array.from({ length: 5 }, () => {
      const changes = Array.from(
        { length: difficulty + 2 },
        () =>
          (randomInt(difficulty === 1 ? 5 : 12) + 1) * (randomInt(2) ? 1 : -1),
      );
      let total = 0;
      const steps = changes.map((change) => {
        total += change;
        return `${change > 0 ? '+' : '−'}${Math.abs(change)} → ${total}`;
      });
      return {
        prompt: 'Starting at zero, what is the final total?',
        study: changes.map((n) => `${n > 0 ? '+' : '−'}${Math.abs(n)}`),
        answer: String(total),
        choices: choicesFor(total),
        reason: `Start at 0. ${steps.join('; ')}. Final total: ${total}.`,
      };
    });
  if (id === 'compass')
    return Array.from({ length: 5 }, () => {
      const headings = ['North', 'East', 'South', 'West'];
      const start = randomInt(4);
      const turns = Array.from(
        { length: difficulty + 1 },
        () => shuffle(difficulty === 3 ? [-1, 1, 2] : [-1, 1])[0],
      );
      const turnName = (n: number) =>
        n === -1 ? 'Turn left' : n === 1 ? 'Turn right' : 'Turn around';
      let heading = start;
      const steps = turns.map((turn) => {
        heading = (heading + turn + 4) % 4;
        return `${turnName(turn)} → ${headings[heading]}`;
      });
      return {
        prompt: 'Which direction are you facing now?',
        study: [`Face ${headings[start]}`, ...turns.map(turnName)],
        answer: headings[heading],
        choices: headings,
        reason: `Start facing ${headings[start]}. ${steps.join('; ')}.`,
      };
    });
  if (id === 'count')
    return Array.from({ length: count }, () => {
      const side = difficulty + 2;
      const family = shuffle(
        difficulty === 1 ? ['A', 'B', 'C', 'D'] : ['M', 'N', 'W', 'H'],
      );
      const target = family[0];
      const hits = randomInt(side * side - 1) + 1;
      const cells = shuffle([
        ...Array.from({ length: hits }, () => target),
        ...Array.from(
          { length: side * side - hits },
          () => family[randomInt(3) + 1],
        ),
      ]);
      const rows = Array.from({ length: side }, (_, row) =>
        cells.slice(row * side, (row + 1) * side),
      );
      return {
        prompt: `How many ${target} letters are in the grid?`,
        lines: rows.map((row) => row.join(' ')),
        answer: String(hits),
        choices: shuffle([
          hits,
          ...shuffle(
            Array.from({ length: side * side + 1 }, (_, i) => i).filter(
              (n) => n !== hits,
            ),
          ).slice(0, 3),
        ]).map(String),
        reason: `Counts by row, top to bottom: ${rows.map((row) => row.filter((letter) => letter === target).length).join(' + ')} = ${hits}. Count one row at a time to keep your place.`,
      };
    });
  if (id === 'analogy')
    return shuffle(analogies[difficulty - 1]).map(
      ([pair, cue, answer, distractors, reason]) => ({
        prompt: 'Complete the second pair using the same relationship.',
        lines: [pair, `${cue} : ?`],
        answer,
        choices: shuffle([answer, ...distractors]),
        reason,
      }),
    );
  if (id === 'deduction')
    return Array.from({ length: count }, () => {
      const order = shuffle([
        'Ava',
        'Ben',
        'Cara',
        'Drew',
        'Eli',
        'Finn',
        'Gia',
      ]).slice(0, difficulty + 2);
      const position = randomInt(order.length);
      const clues = order
        .slice(0, -1)
        .map((name, i) =>
          difficulty > 1 && randomInt(2)
            ? `${order[i + 1]} is to the right of ${name}.`
            : `${name} is to the left of ${order[i + 1]}.`,
        );
      return {
        prompt: `Who is in position ${position + 1}, counting from the left?`,
        lines: shuffle(clues),
        answer: order[position],
        choices: shuffle(order),
        reason: `The clues give this order from left to right: ${order.join(' → ')}. Position ${position + 1} is ${order[position]}.`,
      };
    });
  if (id === 'code')
    return Array.from({ length: count }, () => {
      const multiplier = difficulty === 1 ? 1 : randomInt(4) + 2;
      const offset = difficulty === 2 ? 0 : randomInt(9) + 1;
      const input = randomInt(7) + 5;
      const output = (n: number) => n * multiplier + offset;
      const rule =
        difficulty === 1
          ? `add ${offset}`
          : `multiply by ${multiplier}${offset ? `, then add ${offset}` : ''}`;
      return {
        prompt: `Rule type: ${difficulty === 1 ? 'add a fixed amount' : difficulty === 2 ? 'multiply by a fixed amount' : 'multiply, then add a fixed amount'}. What is the missing output?`,
        lines: [`1 → ${output(1)}`, `3 → ${output(3)}`, `${input} → ?`],
        answer: String(output(input)),
        choices: choicesFor(output(input)),
        reason: `The rule is: ${rule}. ${input} ${multiplier === 1 ? '' : `× ${multiplier} `}${offset ? `+ ${offset} ` : ''}= ${output(input)}.`,
      };
    });
  if (id === 'arithmetic')
    return Array.from({ length: count }, () => {
      const a = randomInt(difficulty === 1 ? 20 : 13) + 1,
        b = randomInt(difficulty === 1 ? 20 : 13) + 1,
        c = randomInt(10) + 1;
      const multiply = difficulty > 1;
      const answer = multiply ? a * b + (difficulty === 3 ? c : 0) : a + b;
      const expression = multiply
        ? `${a} × ${b}${difficulty === 3 ? ` + ${c}` : ''}`
        : `${a} + ${b}`;
      return {
        prompt: 'What is the result?',
        stimulus: expression,
        answer: String(answer),
        choices: choicesFor(answer),
        reason: `${expression} = ${answer}.${difficulty === 3 ? ` Multiply first: ${a} × ${b} = ${a * b}, then add ${c}.` : ''}`,
      };
    });
  if (id === 'ordering')
    return Array.from({ length: 5 }, () => {
      const nums = shuffle(Array.from({ length: 30 }, (_, i) => i + 1)).slice(
        0,
        difficulty + 2,
      );
      const sorted = [...nums].sort((a, b) => a - b);
      const permutations = [sorted.join(' · ')];
      for (let i = 0; permutations.length < 4 && i < 100; i++) {
        const candidate = shuffle(nums).join(' · ');
        if (!permutations.includes(candidate)) permutations.push(candidate);
      }
      return {
        prompt: 'Which list is sorted from smallest to largest?',
        study: nums.map(String),
        answer: sorted.join(' · '),
        choices: shuffle(permutations),
        reason: `In ascending order: ${sorted.join(' < ')}.`,
      };
    });
  if (id === 'anagram') {
    const bank = [
      ['river', 'Flowing water'],
      ['cloud', 'Water droplets in the sky'],
      ['plant', 'A living thing with roots'],
      ['brain', 'The organ inside your skull'],
      ['light', 'What makes objects visible'],
      ['forest', 'A large area of trees'],
      ['planet', 'A world orbiting a star'],
      ['socket', 'An endpoint for network communication'],
      ['binary', 'A number system using 0 and 1'],
      ['memory', 'What holds information for later'],
      ['network', 'A collection of connected devices'],
      ['compile', 'Translate source into another program form'],
      ['pointer', 'A value that refers to a memory location'],
      ['browser', 'An application for viewing websites'],
      ['package', 'A bundle of reusable software'],
    ];
    const size = [5, 6, 7][difficulty - 1];
    return shuffle(bank.filter(([word]) => word.length === size)).map(
      ([word, clue]) => {
        let scrambled = shuffle([...word]).join('');
        if (scrambled === word) scrambled = word.slice(1) + word[0];
        return {
          prompt: clue,
          stimulus: scrambled.toUpperCase(),
          answer: word,
          choices: shuffle([
            word,
            ...shuffle(
              bank
                .filter(([w]) => w.length === size && w !== word)
                .map(([w]) => w),
            ).slice(0, 3),
          ]),
          reason: `${scrambled.toUpperCase()} rearranges to ${word.toUpperCase()}: ${clue.toLowerCase()}.`,
        };
      },
    );
  }
  if (id === 'oddity') {
    const sets = [
      [
        [
          ['cat', 'dog', 'horse', 'eagle'],
          'eagle',
          'The eagle is a bird; the other three are mammals.',
        ],
        [
          ['red', 'blue', 'green', 'circle'],
          'circle',
          'Circle is a shape; the other three are colors.',
        ],
        [
          ['apple', 'pear', 'peach', 'carrot'],
          'carrot',
          'Carrot is a root vegetable; the others are fruits.',
        ],
        [
          ['violin', 'guitar', 'cello', 'flute'],
          'flute',
          'Flute is a wind instrument; the others use strings.',
        ],
      ],
      [
        [['2', '3', '5', '9'], '9', '9 is composite; 2, 3 and 5 are prime.'],
        [
          ['4', '16', '25', '27'],
          '27',
          '27 is not a perfect square; 4, 16 and 25 are.',
        ],
        [['8', '16', '32', '48'], '48', '48 is not a power of 2.'],
        [['12', '18', '24', '25'], '25', '25 is not divisible by 6.'],
      ],
      [
        [
          ['stack', 'queue', 'tree', 'compiler'],
          'compiler',
          'A compiler translates programs; the others are data structures.',
        ],
        [
          ['HTTP', 'FTP', 'DNS', 'HTML'],
          'HTML',
          'HTML is a markup language; the others are network protocols.',
        ],
        [
          ['AND', 'OR', 'NOT', 'LOOP'],
          'LOOP',
          'A loop repeats instructions; the others are Boolean operations.',
        ],
        [
          ['binary', 'decimal', 'hexadecimal', 'variable'],
          'variable',
          'Variable names stored data; the others are number systems.',
        ],
      ],
    ];
    return shuffle(sets[difficulty - 1]).map(([items, answer, reason]) => ({
      prompt: 'Which item does not fit the stated group?',
      answer: answer as string,
      choices: shuffle(items as string[]),
      reason: reason as string,
    }));
  }
  if (id === 'magnitude')
    return Array.from({ length: count }, () => {
      const a = randomInt(10) + 1,
        b = randomInt(10) + 1;
      const left = difficulty === 1 ? a : a / (difficulty === 2 ? 4 : 8),
        right = difficulty === 1 ? b : b / 4;
      const displayLeft =
        difficulty === 1 ? String(a) : `${a}/${difficulty === 2 ? 4 : 8}`;
      const displayRight = difficulty === 2 ? `${b}/4` : String(right);
      return {
        prompt: 'Which value is larger?',
        stimulus: `${displayLeft} vs ${displayRight}`,
        answer: left > right ? 'Left' : left < right ? 'Right' : 'Equal',
        choices: ['Left', 'Equal', 'Right'],
        reason: `Left = ${left}; right = ${right}. ${left === right ? 'The values are equal.' : `${left > right ? 'Left' : 'Right'} is larger.`}`,
      };
    });
  if (id === 'binary')
    return Array.from({ length: count }, () => {
      const bits = difficulty + 2;
      const value = randomInt(2 ** bits);
      const binary = value.toString(2).padStart(bits, '0');
      const terms = [...binary].flatMap((bit, i) =>
        bit === '1' ? [String(2 ** (bits - i - 1))] : [],
      );
      return {
        prompt: 'Convert these bits to decimal.',
        stimulus: binary,
        answer: String(value),
        choices: shuffle([
          value,
          ...shuffle(
            Array.from({ length: 2 ** bits }, (_, i) => i).filter(
              (n) => n !== value,
            ),
          ).slice(0, 3),
        ]).map(String),
        reason: `${binary}₂ = ${terms.length ? terms.join(' + ') : '0'} = ${value}₁₀.`,
      };
    });
  if (id === 'nback') {
    const n = difficulty;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const sequence = Array.from(
      { length: n },
      () => letters[randomInt(letters.length)],
    );
    const matchFlags = shuffle([
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
    ]);
    return matchFlags.map((match, index) => {
      const earlier = sequence[sequence.length - n];
      const letter = match
        ? earlier
        : shuffle(letters.filter((x) => x !== earlier))[0];
      sequence.push(letter);
      return {
        prompt: `Does this letter match ${n} step${n > 1 ? 's' : ''} back?`,
        stimulus: letter,
        study: index === 0 ? sequence.slice(0, n) : undefined,
        answer: match ? 'Match' : 'Different',
        choices: ['Match', 'Different'],
        reason: `${n} step${n > 1 ? 's' : ''} earlier was ${earlier}. This letter is ${letter}.`,
        condition: match ? 'match' : 'different',
      };
    });
  }
  if (id === 'path' || id === 'reverse')
    return Array.from({ length: 5 }, () => {
      const length = difficulty + 2;
      const seq =
        id === 'path'
          ? shuffle([...Array(9).keys()])
              .slice(0, length)
              .map(String)
          : Array.from({ length }, () => String(randomInt(10)));
      return {
        prompt:
          id === 'path'
            ? 'Tap the pads in the order you saw them.'
            : 'Enter the digits in reverse order.',
        study: seq,
        answer: id === 'path' ? seq.join(',') : [...seq].reverse().join(''),
        pads: id === 'path' ? seq.map(Number) : undefined,
        reason:
          id === 'path'
            ? `The path was ${seq.map((x) => Number(x) + 1).join(' → ')}.`
            : `${seq.join(' · ')} backward is ${[...seq].reverse().join(' · ')}.`,
      };
    });
  if (id === 'pairs') {
    const pairs = shuffle(words).slice(0, difficulty + 3);
    return shuffle(pairs).map(([cue, target], i) => ({
      prompt: `What went with “${cue}”?`,
      answer: target,
      choices: shuffle([
        target,
        ...shuffle(words.map((p) => p[1]).filter((x) => x !== target)).slice(
          0,
          3,
        ),
      ]),
      study: i === 0 ? pairs.map((p) => p.join(' → ')) : undefined,
      reason: `The pair was ${cue} → ${target}. Try making a vivid connection between them.`,
    }));
  }
  if (id === 'retrieval') {
    const ordered = shuffle(facts);
    return [...ordered, ...shuffle(ordered).slice(0, 3)].map((f, i) => ({
      prompt: f.q,
      answer: f.a,
      choices: shuffle(f.o),
      reason: f.why,
      condition: i < 6 ? 'first' : 'revisit',
    }));
  }
  if (id === 'flanker')
    return shuffle([true, true, true, true, false, false, false, false]).map(
      (same, i) => {
        const center = i % 2 === 0 ? '←' : '→';
        const flank = same ? center : center === '←' ? '→' : '←';
        const side = difficulty === 3 ? 3 : 2;
        return {
          prompt: 'Which way does the middle arrow point?',
          stimulus: flank.repeat(side) + center + flank.repeat(side),
          answer: center === '←' ? 'Left' : 'Right',
          choices: ['Left', 'Right'],
          reason: `The middle arrow pointed ${center === '←' ? 'left' : 'right'}.`,
          condition: same ? 'aligned' : 'conflicting',
        };
      },
    );
  if (id === 'switch')
    return Array.from({ length: count }, (_, i) => {
      const value = shuffle([1, 2, 3, 4, 6, 7, 8, 9])[0];
      const parity =
        difficulty === 1 ? Math.floor(i / 2) % 2 === 0 : randomInt(2) === 0;
      return {
        prompt: parity ? 'ODD / EVEN' : 'BELOW / ABOVE 5',
        stimulus: String(value),
        answer: parity
          ? value % 2
            ? 'Odd'
            : 'Even'
          : value < 5
            ? 'Below 5'
            : 'Above 5',
        choices: parity ? ['Odd', 'Even'] : ['Below 5', 'Above 5'],
        reason: parity
          ? `${value} is ${value % 2 ? 'odd' : 'even'}.`
          : `${value} is ${value < 5 ? 'below' : 'above'} 5.`,
      };
    });
  if (id === 'inhibit')
    return shuffle([
      true,
      true,
      true,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
    ]).map((go) => ({
      prompt: 'Circle: press. X: wait.',
      stimulus: go ? '○' : '×',
      answer: go ? 'press' : 'wait',
      reason: go
        ? 'Circle means press once.'
        : 'X means wait until the window closes.',
      condition: go ? 'go' : 'no-go',
    }));
  if (id === 'search')
    return shuffle([true, true, true, true, false, false, false, false]).map(
      (present) => {
        const choices = difficulty === 1 ? ['□'] : ['□', '■', '○'];
        const items = Array.from(
          { length: [9, 16, 25][difficulty - 1] },
          () => choices[randomInt(choices.length)],
        );
        if (present) items[randomInt(items.length)] = '●';
        return {
          prompt: 'Is there a filled circle ●?',
          shapes: items,
          answer: present ? 'Present' : 'Absent',
          choices: ['Present', 'Absent'],
          reason: present
            ? 'There was a filled circle in the array.'
            : 'There were no filled circles in this array.',
        };
      },
    );
  if (id !== 'rotation') throw new Error(`Unknown game: ${id}`);
  return shuffle([true, true, true, true, false, false, false, false]).map(
    (mirror) => ({
      prompt: 'Same shape, or a mirror image?',
      mirror,
      angle: shuffle(
        difficulty === 1
          ? [0, 90]
          : difficulty === 2
            ? [90, 180]
            : [90, 180, 270],
      )[0],
      answer: mirror ? 'Mirror' : 'Same',
      choices: ['Same', 'Mirror'],
      reason: mirror
        ? 'The second shape was reflected. Rotation alone cannot make them match.'
        : 'The second shape was only rotated. Its handedness stayed the same.',
    }),
  );
}
export function isCorrect(trial: Trial, answer: string) {
  return (
    trial.answer === answer.trim().replace(/\s/g, '') || trial.answer === answer
  );
}
export function performanceScore(
  id: string,
  answers: { correct: boolean; condition?: string }[],
): number {
  if (!answers.length) return 0;
  if (id === 'inhibit' || id === 'nback') {
    const categories =
      id === 'inhibit' ? ['go', 'no-go'] : ['match', 'different'];
    const rates = categories.map((c) => {
      const a = answers.filter((x) => x.condition === c);
      return a.length ? a.filter((x) => x.correct).length / a.length : 0;
    });
    return Math.round((rates[0] + rates[1]) * 50);
  }
  return Math.round(
    (answers.filter((x) => x.correct).length / answers.length) * 100,
  );
}

export const allGameIds = [
  'memory',
  'focus',
  'logic',
  ...games.map((game) => game.id),
];
