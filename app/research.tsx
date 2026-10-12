'use client';
/* eslint-disable react/react-compiler -- Incoming explore questions intentionally seed the editor after navigation. */
import { useEffect, useState } from 'react';
import { BookOpen, Download, Plus, Trash2 } from 'lucide-react';
import type { SaveData, Note } from '@/lib/save';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
export default function Research({
  initial = '',
  data,
  ready,
  onNote,
  onDelete,
}: {
  initial?: string;
  data: SaveData;
  ready: boolean;
  onNote: (n: Note) => void;
  onDelete: (id: string) => void;
}) {
  const [id, setId] = useState('draft');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (initial) {
      setId(crypto.randomUUID());
      setTitle(initial);
      setText('');
      setMessage('A fresh question. Write down your prediction first.');
    }
  }, [initial]);
  const selected = data.notes.find((n) => n.id === id);
  const currentTitle = selected?.title ?? title;
  const currentText = selected?.text ?? text;
  function edit(t: string, value: string) {
    const nextId = id === 'draft' ? crypto.randomUUID() : id;
    if (id === 'draft') setId(nextId);
    setTitle(t);
    setText(value);
    if (data.notes.length >= 50 && !selected) {
      setMessage('You have 50 notes. Export a backup before starting another.');
      return;
    }
    onNote({
      id: nextId,
      title: t,
      text: value,
      updated: new Date().toISOString(),
    });
    setMessage('');
  }
  function choose(value: string) {
    const n = data.notes.find((x) => x.id === value);
    if (n) {
      setId(n.id);
      setTitle(n.title);
      setText(n.text);
      setMessage('');
    }
  }
  function remove() {
    if (selected) {
      onDelete(selected.id);
      setId('draft');
      setTitle('');
      setText('');
      setMessage(
        'Note removed from this browser. Use an older export code if you need it back.',
      );
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob(
        [
          `# ${currentTitle || 'A question worth following'}\n\n${currentText}\n`,
        ],
        { type: 'text/markdown;charset=utf-8' },
      ),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brainmaxing-notebook.md';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section>
      <div className="section-title">
        <h2>Your research desk</h2>
        <span>CURATED LESSONS. YOUR OWN THINKING.</span>
      </div>
      <div className="research-search">
        <span className="eyebrow lime">LET A QUESTION LEAD SOMEWHERE</span>
        <h2>Don&apos;t just collect facts.</h2>
        <p>
          Make a prediction, follow the explanation, and teach the idea back in
          your own words. This notebook works offline.
        </p>
      </div>
      <div className="research-columns">
        <div className="research-notebook notebook-editor">
          <div className="notebook-toolbar">
            <Select
              value={selected?.id ?? undefined}
              onValueChange={(v) => {
                if (v) choose(v);
              }}
            >
              <SelectTrigger
                aria-label="Open a saved note"
                className="note-select"
              >
                <SelectValue placeholder="Open a saved note">
                  {selected?.title || 'Open a saved note'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {data.notes.length ? (
                  data.notes.map((n) => (
                    <SelectItem value={n.id} key={n.id}>
                      {n.title || 'Untitled question'}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="empty" disabled>
                    No saved notes yet
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <button
              className="secondary"
              disabled={!ready || data.notes.length >= 50}
              onClick={() => {
                setId(crypto.randomUUID());
                setTitle('');
                setText('');
                setMessage('');
              }}
            >
              <Plus size={16} />
              New
            </button>
            {selected && (
              <AlertDialog>
                <AlertDialogTrigger
                  className="icon-danger"
                  aria-label="Delete selected note"
                >
                  <Trash2 size={16} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes it from this browser. Export a backup first
                      if you want a copy.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep note</AlertDialogCancel>
                    <AlertDialogAction onClick={remove}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <label htmlFor="note-title">Your question</label>
          <input
            id="note-title"
            value={currentTitle}
            maxLength={160}
            disabled={!ready}
            onChange={(e) => edit(e.target.value, currentText)}
            placeholder="What do I want to understand?"
          />
          <label htmlFor="notes">Your thinking</label>
          <textarea
            id="notes"
            value={currentText}
            maxLength={20000}
            disabled={!ready}
            onChange={(e) => edit(currentTitle, e.target.value)}
            placeholder={
              'I think it works like this...\n\nThe explanation says...\n\nThe evidence is...\n\nMy next question is...'
            }
            rows={14}
          />
          <div className="notebook-bottom">
            <span>
              {currentText.length.toLocaleString()} / 20,000 characters
            </span>
            <button
              className="text-button"
              disabled={!currentText && !currentTitle}
              onClick={download}
            >
              <Download size={17} />
              Export Markdown
            </button>
          </div>
          <output className="save-message">{message}</output>
          <p className="attribution">
            Notes save automatically when browser storage is available. Use Save
            & restore to back up all notes and game results together.
          </p>
        </div>
        <aside className="research-notebook">
          <span className="eyebrow lime">THE CURIOSITY LOOP</span>
          <h3>Think it through.</h3>
          <ol className="research-prompts">
            <li>
              <b>Make a prediction.</b>
              <p>Before reading, how do you think it works?</p>
            </li>
            <li>
              <b>Find the mechanism.</b>
              <p>What causes what? Name each step.</p>
            </li>
            <li>
              <b>Check the evidence.</b>
              <p>What supports the explanation? What remains uncertain?</p>
            </li>
            <li>
              <b>Explain it simply.</b>
              <p>Close the lesson. Could you teach the idea to a friend?</p>
            </li>
          </ol>
          <div className="offline-note">
            <BookOpen size={22} />
            <p>
              The Explore tab contains complete lessons on engines, networks,
              and black holes. Their source links are optional further reading
              when online.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
