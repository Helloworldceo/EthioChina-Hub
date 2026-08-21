"use client";

import { useActionState, useState } from "react";
import { adminResetMemberPassword, type ResetPasswordState } from "@/lib/actions/members";

const initialState: ResetPasswordState = {};

export function ResetPasswordForm({ memberId }: { memberId: string }) {
  const action = adminResetMemberPassword.bind(null, memberId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm text-slate-600 dark:text-stone-400 hover:underline">
        Reset password
      </button>
    );
  }

  return (
    <form action={formAction} className="bg-slate-50 dark:bg-stone-800 rounded-lg p-4 mt-2 space-y-3">
      <p className="text-xs text-slate-500 dark:text-stone-400">
        Sets a new password for this member directly. Share it with them yourself — there&apos;s no
        email flow yet.
      </p>
      {state.success && <p className="text-emerald-700 dark:text-emerald-400 text-sm">Password updated.</p>}
      {state.error && <p className="text-red-600 dark:text-red-400 text-sm">{state.error}</p>}
      <input
        type="password"
        name="newPassword"
        placeholder="New password (min 8 characters)"
        required
        minLength={8}
        className="w-full rounded-lg border border-slate-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-slate-800 hover:bg-slate-900 dark:bg-stone-700 dark:hover:bg-stone-600 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          {pending ? "Setting..." : "Set new password"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-slate-500 dark:text-stone-400 px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
