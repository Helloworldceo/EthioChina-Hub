"use client";

import { useTransition } from "react";
import Link from "next/link";
import { deleteResource, togglePinned } from "@/lib/actions/resources";

export function ResourceRowActions({ id, pinned }: { id: string; pinned: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 text-sm">
      <button
        disabled={pending}
        onClick={() => startTransition(() => togglePinned(id, !pinned))}
        className={pinned ? "text-amber-600 hover:underline" : "text-slate-600 hover:underline"}
      >
        {pinned ? "Unpin" : "Pin"}
      </button>
      <Link href={`/admin/resources/${id}/edit`} className="text-slate-600 hover:underline">
        Edit
      </Link>
      <button
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this resource? This cannot be undone.")) {
            startTransition(() => deleteResource(id));
          }
        }}
        className="text-red-600 hover:underline"
      >
        Delete
      </button>
    </div>
  );
}
