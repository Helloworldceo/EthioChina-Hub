"use client";

import { useTransition } from "react";
import { deleteComment } from "@/lib/actions/comments";

export function DeleteCommentButton({ commentId }: { commentId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => deleteComment(commentId))}
      className="text-red-600 hover:underline text-xs disabled:opacity-60"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
