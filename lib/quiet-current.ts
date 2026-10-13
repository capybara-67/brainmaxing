export const quietCurrent = {
  id: 'quiet-current',
  name: 'Quiet Current',
  category: 'Reset',
  tag: 'A GENTLE UNWIND',
  description: 'Turn a few stream pieces. Let the garden flow.',
};

// Clockwise openings: north, east, south, west.
export const NORTH = 1;
export const EAST = 2;
export const SOUTH = 4;
export const WEST = 8;
export const SIZE = 5;
export const INLET = 10;
export const OUTLET = 14;
export const gardens = [
  {
    name: 'The little clearing',
    path: [10, 5, 0, 1, 2, 7, 6, 11, 16, 17, 18, 13, 14],
  },
  {
    name: 'Around the reeds',
    path: [10, 11, 16, 21, 22, 23, 18, 17, 12, 7, 8, 3, 4, 9, 14],
  },
  {
    name: 'A place to settle',
    path: [10, 5, 6, 1, 2, 3, 8, 7, 12, 17, 16, 21, 22, 23, 24, 19, 14],
  },
];

export function rotatePiece(mask: number): number {
  return ((mask << 1) & 15) | (mask >> 3);
}

function direction(from: number, to: number): number {
  if (to === from - SIZE) return NORTH;
  if (to === from + SIZE) return SOUTH;
  if (to === from + 1 && Math.floor(from / SIZE) === Math.floor(to / SIZE))
    return EAST;
  if (to === from - 1 && Math.floor(from / SIZE) === Math.floor(to / SIZE))
    return WEST;
  throw new Error('Stream pieces must share an edge.');
}

export function solutionFor(garden: number): number[] {
  const { path } = gardens[garden];
  const board = Array<number>(SIZE * SIZE).fill(0);
  path.forEach((tile, i) => {
    board[tile] =
      (i === 0 ? WEST : direction(tile, path[i - 1])) |
      (i === path.length - 1 ? EAST : direction(tile, path[i + 1]));
  });
  return board;
}

export function streamState(board: number[]): {
  wet: Set<number>;
  solved: boolean;
} {
  const wet = new Set<number>();
  const queue: number[] = [];
  if (board[INLET] & WEST) {
    wet.add(INLET);
    queue.push(INLET);
  }
  for (let i = 0; i < queue.length; i++) {
    const tile = queue[i];
    const row = Math.floor(tile / SIZE);
    const col = tile % SIZE;
    const neighbors = [
      [row > 0 ? tile - SIZE : -1, NORTH, SOUTH],
      [col < SIZE - 1 ? tile + 1 : -1, EAST, WEST],
      [row < SIZE - 1 ? tile + SIZE : -1, SOUTH, NORTH],
      [col > 0 ? tile - 1 : -1, WEST, EAST],
    ];
    for (const [next, opening, opposite] of neighbors) {
      if (
        next >= 0 &&
        !wet.has(next) &&
        board[tile] & opening &&
        board[next] & opposite
      ) {
        wet.add(next);
        queue.push(next);
      }
    }
  }
  return { wet, solved: wet.has(OUTLET) && Boolean(board[OUTLET] & EAST) };
}

export function createGarden(garden: number, random = Math.random): number[] {
  const board = solutionFor(garden).map((mask) => {
    const turns = Math.floor(random() * 4);
    for (let i = 0; i < turns; i++) mask = rotatePiece(mask);
    return mask;
  });
  // Even a lucky shuffle should leave something for the player to do.
  if (streamState(board).solved) board[INLET] = rotatePiece(board[INLET]);
  return board;
}

export function hintFor(garden: number, board: number[]): number | undefined {
  const solution = solutionFor(garden);
  return gardens[garden].path.find((tile) => board[tile] !== solution[tile]);
}

export function openingNames(mask: number): string {
  return [
    [NORTH, 'up'],
    [EAST, 'right'],
    [SOUTH, 'down'],
    [WEST, 'left'],
  ]
    .filter(([bit]) => mask & Number(bit))
    .map(([, name]) => name)
    .join(' and ');
}
