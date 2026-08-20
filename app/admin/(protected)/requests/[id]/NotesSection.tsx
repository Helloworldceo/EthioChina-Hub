"use client";

import { useActionState } from "react";
import { addInternalNote, type NoteState } from "@/lib/actions/requests";

const initialState: NoteState = {};

type Note = {
  id: string;
  body: string;
  createdAt: Date;
  author: { name: string };
};

export function NotesSection({ requestId, notes }: { requestId: string; notes: Note[] }) {
  const action = addInternalNote.bind(null, requestId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div>
      <h2 className="font-semibold text-slate-900 mb-3">Internal notes</h2>
      <div className="space-y-3 mb-4">
        {notes.map((n) => (
          <div key={n.id} className="bg-slate-50 rounded-lg p-4 text-sm">
            <p className="text-slate-700">{n.body}</p>
            <p className="text-xs text-slate-400 mt-2">
              {n.author.name} · {n.createdAt.toLocaleString()}
            </p>
          </div>
        ))}
        {notes.length === 0 && <p className="text-sm text-slate-400">No internal notes yet.</p>}
      </div>

      <form action={formAction} className="flex items-start gap-2">
        <textarea
          name="body"
          rows={2}
          required
          placeholder="Add an internal note (not visible to the member)..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          {pending ? "Adding..." : "Add"}
        </button>
      </form>
      {state.error && <p className="text-xs text-red-600 mt-2">{state.error}</p>}
    </div>
  );
}
