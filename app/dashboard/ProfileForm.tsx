"use client";

import { useActionState } from "react";
import { updateOwnProfile, type ProfileState } from "@/lib/actions/members";
import type { Member } from "@prisma/client";

const initialState: ProfileState = {};

export function ProfileForm({ member }: { member: Member }) {
  const [state, formAction, pending] = useActionState(updateOwnProfile, initialState);

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
      {state.success && (
        <p className="bg-emerald-50 text-emerald-700 text-sm rounded-lg px-4 py-3">
          Profile updated.
        </p>
      )}
      {state.error && (
        <p className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{state.error}</p>
      )}

      <Field label="Full name" name="name" defaultValue={member.name} required error={state.fieldErrors?.name} />
      <Field
        label="Title"
        name="title"
        defaultValue={member.title ?? ""}
        hint="e.g. Computer Science Student at Tsinghua University"
        error={state.fieldErrors?.title}
      />
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={member.bio ?? ""}
          placeholder="A short bio others will see on your public profile."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {state.fieldErrors?.bio && <p className="text-xs text-red-600 mt-1">{state.fieldErrors.bio[0]}</p>}
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
        hint="A student ID number or reference an admin can use to verify you."
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
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  error?: string[];
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      {hint && !error && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error[0]}</p>}
    </div>
  );
}
