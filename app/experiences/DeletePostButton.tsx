"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePost } from "@/lib/actions/posts";

export function DeletePostButton({ postId, redirectTo }: { postId: string; redirectTo: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this experience? This cannot be undone.")) {
          startTransition(async () => {
            await deletePost(postId);
            router.push(redirectTo);
          });
        }
      }}
      className="text-red-600 dark:text-red-400 hover:underline text-sm disabled:opacity-60"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
