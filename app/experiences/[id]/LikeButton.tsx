"use client";

import { useState, useTransition } from "react";
import { toggleCommentLike } from "@/lib/actions/comments";

export function LikeButton({
  commentId,
  postId,
  initialLiked,
  initialCount,
}: {
  commentId: string;
  postId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));
    startTransition(async () => {
      await toggleCommentLike(commentId, postId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={`flex items-center gap-1 text-xs disabled:opacity-60 ${
        liked ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-slate-400 dark:text-stone-500 hover:text-slate-600 dark:hover:text-stone-400"
      }`}
    >
      <span>{liked ? "♥" : "♡"}</span>
      <span>{count > 0 ? count : ""}</span>
    </button>
  );
}
