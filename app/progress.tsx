'use client';
/* eslint-disable react/react-compiler -- localStorage hydration must happen after the browser mounts. */
import { useEffect, useRef, useState } from 'react';
import { Download, Upload, Check, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  EMPTY,
  SAVE_KEY,
  validateSave,
  exportSave,
  importSave,
  mergeSaves,
  type SaveData,
  type Session,
  type Note,
} from '@/lib/save';
export function useSave() {
  const [data, setData] = useState<SaveData>(EMPTY);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const preserveUnreadableSave = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      const next: SaveData = raw
        ? validateSave(JSON.parse(raw))
        : { version: 1, sessions: [], notes: [] };
      const legacy = localStorage.getItem('brainmaxing-notes');
      if (!raw && legacy)
        next.notes = [
          {
            id: 'legacy',
            title: 'Earlier notebook',
            text: legacy.slice(0, 20000),
            updated: new Date().toISOString(),
          },
        ];
      setData(next);
    } catch {
      preserveUnreadableSave.current = true;
      setError(
        'Your earlier save could not be loaded and has been left untouched. New work stays in memory. Download a backup before closing this page.',
      );
    }
    setReady(true);
  }, []);
  function persist(next: SaveData) {
    if (!ready) return;
    setData(validateSave(next));
    if (preserveUnreadableSave.current) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
      setError('');
    } catch {
      setError(
        'Could not save on this device. Keep this page open and export your save code.',
      );
    }
  }
  function complete(s: Omit<Session, 'id' | 'date'>) {
    if (!ready) return;
    const next = {
      ...data,
      sessions: [
        { ...s, id: crypto.randomUUID(), date: new Date().toISOString() },
        ...data.sessions,
      ].slice(0, 500),
    };
    persist(next);
  }
  function note(n: Note) {
    persist({
      ...data,
      notes: [n, ...data.notes.filter((x) => x.id !== n.id)],
    });
  }
  function deleteNote(id: string) {
    persist({ ...data, notes: data.notes.filter((n) => n.id !== id) });
  }
  return {
    data,
    ready,
    error,
    complete,
    note,
    deleteNote,
    importData: (d: SaveData) => persist(mergeSaves(data, d)),
  };
}
export function SaveDialog({
  data,
  ready,
  onImport,
}: {
  data: SaveData;
  ready: boolean;
  onImport: (d: SaveData) => void;
}) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [candidate, setCandidate] = useState<SaveData | null>(null);
  const [exported, setExported] = useState('');
  function generate() {
    setExported(exportSave(data));
    setMessage('Save code ready. It includes your notes and game results.');
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(exported);
      setMessage('Copied. Keep this code somewhere safe.');
    } catch {
      setMessage('Clipboard unavailable. Select and copy the code manually.');
    }
  }
  function download() {
    const text = exportSave(data);
    const url = URL.createObjectURL(
      new Blob([text], { type: 'text/plain;charset=utf-8' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brainmaxing-save.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function inspect() {
    try {
      setCandidate(importSave(code));
      setMessage(
        'Code checked. Importing merges game history and preserves conflicting notes as separate copies.',
      );
    } catch (e) {
      setCandidate(null);
      setMessage(e instanceof Error ? e.message : 'Invalid code.');
    }
  }
  return (
    <Dialog>
      <DialogTrigger className="save-trigger" disabled={!ready}>
        <Download size={16} />
        <span>Save & restore</span>
      </DialogTrigger>
      <DialogContent className="save-dialog">
        <DialogTitle>Take your progress with you.</DialogTitle>
        <DialogDescription>
          No account needed. Export a code, then paste it on another device.
          Base64 is a portable encoding, not encryption.
        </DialogDescription>
        <div className="export-row">
          <button className="primary" onClick={generate}>
            <Copy size={16} />
            Create code
          </button>
          <button className="secondary" onClick={download}>
            <Download size={16} />
            Download backup
          </button>
        </div>
        {exported && (
          <>
            <label htmlFor="export-code">Your export code</label>
            <textarea
              id="export-code"
              readOnly
              value={exported}
              rows={3}
              onFocus={(e) => e.target.select()}
            />
            <button className="text-button" onClick={() => void copy()}>
              Copy code
              <Copy size={15} />
            </button>
          </>
        )}
        <hr />
        <label htmlFor="import-code">Restore from a code</label>
        <textarea
          id="import-code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setCandidate(null);
            setMessage('');
          }}
          maxLength={2000000}
          rows={3}
          placeholder="BMX1...."
        />
        <button className="secondary" onClick={inspect} disabled={!code.trim()}>
          <Upload size={16} />
          Check code
        </button>
        {candidate && (
          <div className="import-preview">
            <p>
              {candidate.sessions.length} game results ·{' '}
              {candidate.notes.length} notes
            </p>
            <button
              className="primary"
              onClick={() => {
                try {
                  onImport(candidate);
                  setCandidate(null);
                  setCode('');
                  setMessage('Imported. Your progress and notes are merged.');
                } catch (e) {
                  setMessage(e instanceof Error ? e.message : 'Import failed.');
                }
              }}
            >
              Merge this save
              <Check size={16} />
            </button>
          </div>
        )}
        <output className="save-message">{message}</output>
      </DialogContent>
    </Dialog>
  );
}
