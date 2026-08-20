"use client";

import { useActionState } from "react";
import { createComment, type CommentState } from "@/lib/actions/comments";

const initialState: CommentState = {};

export function CommentForm({ postId }: { postId: string }) {
  const action = createComment.bind(null, postId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-2">
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <textarea
        name="body"
        rows={3}
        required
        placeholder="Add a comment..."
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      {state.fieldErrors?.body && <p className="text-xs text-red-600">{state.fieldErrors.body[0]}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg"
      >
        {pending ? "Posting..." : "Comment"}
      </button>
    </form>
  );
}
