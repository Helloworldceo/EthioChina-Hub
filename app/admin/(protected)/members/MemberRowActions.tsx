"use client";

import { useTransition } from "react";
import Link from "next/link";
import { verifyMember, deleteMember } from "@/lib/actions/members";

export function MemberRowActions({ id, verified }: { id: string; verified: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 text-sm">
      <button
        disabled={pending}
        onClick={() => startTransition(() => verifyMember(id, !verified))}
        className={verified ? "text-amber-600 hover:underline" : "text-emerald-700 hover:underline"}
      >
        {verified ? "Unverify" : "Verify"}
      </button>
      <Link href={`/admin/members/${id}`} className="text-slate-600 hover:underline">
        Edit
      </Link>
      <button
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this member? This cannot be undone.")) {
            startTransition(() => deleteMember(id));
          }
        }}
        className="text-red-600 hover:underline"
      >
        Delete
      </button>
    </div>
  );
}
