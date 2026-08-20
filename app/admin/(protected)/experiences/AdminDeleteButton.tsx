"use client";

import { useTransition } from "react";
import { deletePost } from "@/lib/actions/posts";

export function AdminDeleteButton({ postId }: { postId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (confirm("Remove this post? This cannot be undone.")) {
          startTransition(() => deletePost(postId));
        }
      }}
      className="text-red-600 hover:underline text-sm disabled:opacity-60"
    >
      {pending ? "Removing..." : "Remove"}
    </button>
  );
}
