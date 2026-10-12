import { allGameIds } from './games.ts';
export type Session = {
  id: string;
  game: string;
  level: number;
  score: number;
  date: string;
};
export type Note = { id: string; title: string; text: string; updated: string };
export type SaveData = { version: 1; sessions: Session[]; notes: Note[] };
export const EMPTY: SaveData = { version: 1, sessions: [], notes: [] };
export const SAVE_KEY = 'brainmaxing-save-v1';
const ids = new Set(allGameIds);
const validString = (v: unknown, max: number) =>
  typeof v === 'string' && v.length <= max;
const validId = (v: unknown) =>
  validString(v, 100) && String(v).trim().length > 0;
const validDate = (v: unknown) =>
  typeof v === 'string' && v.length < 40 && Number.isFinite(Date.parse(v));
const record = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
export function validateSave(v: unknown): SaveData {
  if (
    !record(v) ||
    v.version !== 1 ||
    !Array.isArray(v.sessions) ||
    !Array.isArray(v.notes) ||
    v.sessions.length > 500 ||
    v.notes.length > 50
  )
    throw new Error('This is not a supported Brainmaxing save.');
  const sessions = v.sessions.map((s) => {
    if (
      !record(s) ||
      !validId(s.id) ||
      typeof s.game !== 'string' ||
      !ids.has(s.game) ||
      !Number.isInteger(s.level) ||
      Number(s.level) < 1 ||
      Number(s.level) > 3 ||
      !Number.isInteger(s.score) ||
      Number(s.score) < 0 ||
      Number(s.score) > 100 ||
      !validDate(s.date)
    )
      throw new Error('This save contains an invalid game result.');
    return {
      id: String(s.id),
      game: String(s.game),
      level: Number(s.level),
      score: Number(s.score),
      date: String(s.date),
    };
  });
  const notes = v.notes.map((n) => {
    if (
      !record(n) ||
      !validId(n.id) ||
      !validString(n.title, 160) ||
      !validString(n.text, 20000) ||
      !validDate(n.updated)
    )
      throw new Error('This save contains an invalid notebook entry.');
    return {
      id: String(n.id),
      title: String(n.title),
      text: String(n.text),
      updated: String(n.updated),
    };
  });
  if (
    new Set(sessions.map((s) => s.id)).size !== sessions.length ||
    new Set(notes.map((n) => n.id)).size !== notes.length
  )
    throw new Error('This save contains duplicate record IDs.');
  return { version: 1, sessions, notes };
}
function checksum(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}
export function exportSave(data: SaveData): string {
  const json = JSON.stringify(validateSave(data));
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  const b64 = btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `BMX1.${b64}.${checksum(b64)}`;
}
export function importSave(code: string): SaveData {
  const text = code.trim();
  if (text.length > 2000000) throw new Error('This code is too large.');
  const parts = text.split('.');
  if (
    parts.length !== 3 ||
    parts[0] !== 'BMX1' ||
    !/^[\w-]+$/.test(parts[1]) ||
    checksum(parts[1]) !== parts[2]
  )
    throw new Error(
      'The code is incomplete or damaged. Copy the whole BMX1 code.',
    );
  try {
    const bytes = Uint8Array.from(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')),
      (c) => c.charCodeAt(0),
    );
    return validateSave(
      JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)),
    );
  } catch (e) {
    if (e instanceof Error && e.message.startsWith('This save')) throw e;
    throw new Error('This code could not be read as a Brainmaxing save.');
  }
}
export function mergeSaves(current: SaveData, incoming: SaveData): SaveData {
  const sessions = new Map(current.sessions.map((s) => [s.id, s]));
  for (const s of incoming.sessions)
    if (!sessions.has(s.id)) sessions.set(s.id, s);
  const notes = new Map(current.notes.map((n) => [n.id, n]));
  for (const n of incoming.notes) {
    const existing = notes.get(n.id);
    if (!existing) notes.set(n.id, n);
    else if (existing.text !== n.text || existing.title !== n.title) {
      const id = `import-${checksum(n.id + n.title + n.text)}`;
      if (!notes.has(id))
        notes.set(id, {
          ...n,
          id,
          title: n.title.slice(0, 145) + ' (imported)',
        });
    }
  }
  if (notes.size > 50)
    throw new Error(
      'This import would exceed 50 notes. Export a backup and remove unused notes first.',
    );
  return {
    version: 1,
    sessions: [...sessions.values()]
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
      .slice(0, 500),
    notes: [...notes.values()],
  };
}
