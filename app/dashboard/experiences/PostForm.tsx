"use client";

import { useActionState } from "react";
import { createPost, type PostState } from "@/lib/actions/posts";

const initialState: PostState = {};

export function PostForm() {
  const [state, formAction, pending] = useActionState(createPost, initialState);

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      {state.success && (
        <p className="bg-emerald-50 text-emerald-700 text-sm rounded-lg px-4 py-3">
          Posted! Your experience is now visible to everyone.
        </p>
      )}
      {state.error && (
        <p className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{state.error}</p>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="e.g. My visa renewal experience in Shanghai"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {state.fieldErrors?.title && (
          <p className="text-xs text-red-600 mt-1">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-slate-700 mb-1">
          Your story
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={8}
          placeholder="Share what happened, what you learned, or advice for others..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {state.fieldErrors?.body && (
          <p className="text-xs text-red-600 mt-1">{state.fieldErrors.body[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg"
      >
        {pending ? "Posting..." : "Post experience"}
      </button>
    </form>
  );
}
