"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerMember, type RegisterState } from "@/lib/actions/auth";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerMember, initialState);

  if (state.success) {
    return (
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-slate-200 dark:border-stone-800 p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">You&apos;re registered!</h2>
        <p className="text-slate-600 dark:text-stone-400 mb-6">
          Your account has been created. Log in to complete your profile — an admin will verify
          it once you have.
        </p>
        <Link
          href="/login"
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="bg-white dark:bg-stone-900 rounded-2xl border border-slate-200 dark:border-stone-800 p-8 space-y-4">
      {state.error && (
        <p className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">{state.error}</p>
      )}

      <Field label="Full name" name="name" required error={state.fieldErrors?.name} />
      <Field label="Email" name="email" type="email" required error={state.fieldErrors?.email} />
      <Field
        label="Password"
        name="password"
        type="password"
        required
        error={state.fieldErrors?.password}
        hint="At least 8 characters"
      />
      <Field label="Phone" name="phone" error={state.fieldErrors?.phone} />
      <Field label="University" name="university" error={state.fieldErrors?.university} />
      <Field label="City" name="city" error={state.fieldErrors?.city} />
      <Field label="Program / Major" name="program" error={state.fieldErrors?.program} />
      <Field label="WeChat ID" name="wechat" error={state.fieldErrors?.wechat} />

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string[];
  hint?: string;
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
        type={type}
        required={required}
        className="w-full rounded-lg border border-slate-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      {hint && !error && <p className="text-xs text-slate-400 dark:text-stone-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error[0]}</p>}
    </div>
  );
}
