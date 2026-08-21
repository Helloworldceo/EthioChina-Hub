"use client";

import { useActionState } from "react";
import { adminUpdateMember, type AdminMemberEditState } from "@/lib/actions/members";
import type { Member } from "@prisma/client";

const initialState: AdminMemberEditState = {};

export function EditMemberForm({ member }: { member: Member }) {
  const action = adminUpdateMember.bind(null, member.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="bg-white dark:bg-stone-900 rounded-2xl border border-slate-200 dark:border-stone-800 p-8 space-y-4">
      {state.success && (
        <p className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm rounded-lg px-4 py-3">
          Member updated.
        </p>
      )}
      {state.error && (
        <p className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">{state.error}</p>
      )}

      <Field label="Full name" name="name" defaultValue={member.name} required error={state.fieldErrors?.name} />
      <Field label="Title" name="title" defaultValue={member.title ?? ""} error={state.fieldErrors?.title} />
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-stone-300 mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={member.bio ?? ""}
          className="w-full rounded-lg border border-slate-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {state.fieldErrors?.bio && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{state.fieldErrors.bio[0]}</p>}
      </div>
      <Field label="Phone" name="phone" defaultValue={member.phone ?? ""} error={state.fieldErrors?.phone} />
      <Field
        label="University"
        name="university"
        defaultValue={member.university ?? ""}
        error={state.fieldErrors?.university}
      />
      <Field label="City" name="city" defaultValue={member.city ?? ""} error={state.fieldErrors?.city} />
      <Field
        label="Program / Major"
        name="program"
        defaultValue={member.program ?? ""}
        error={state.fieldErrors?.program}
      />
      <Field label="WeChat ID" name="wechat" defaultValue={member.wechat ?? ""} error={state.fieldErrors?.wechat} />
      <Field
        label="Student ID / verification doc reference"
        name="studentIdOrDoc"
        defaultValue={member.studentIdOrDoc ?? ""}
        error={state.fieldErrors?.studentIdOrDoc}
      />

      <button
        type="submit"
        disabled={pending}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg"
      >
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  error?: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-stone-300 mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-lg border border-slate-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error[0]}</p>}
    </div>
  );
}
