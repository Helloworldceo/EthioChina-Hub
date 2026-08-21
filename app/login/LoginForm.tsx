"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signIn("member-credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-slate-200 dark:border-stone-800 p-8 space-y-5">
      {error && <p className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">{error}</p>}

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-stone-300 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-slate-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-stone-300 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-slate-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg"
        >
          {pending ? "Logging in..." : "Log in"}
        </button>
      </form>

      {googleEnabled && (
        <>
          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-stone-500">
            <div className="flex-1 h-px bg-slate-200 dark:bg-stone-800" />
            OR
            <div className="flex-1 h-px bg-slate-200 dark:bg-stone-800" />
          </div>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full border border-slate-300 dark:border-stone-700 hover:bg-slate-50 dark:hover:bg-stone-800 font-semibold py-3 rounded-lg"
          >
            Continue with Google
          </button>
        </>
      )}

      <p className="text-center text-sm text-slate-500 dark:text-stone-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-emerald-700 dark:text-emerald-400 font-medium">
          Register
        </Link>
      </p>
      <p className="text-center text-xs text-slate-400 dark:text-stone-500">
        Forgot your password? Ask a community admin to reset it for you.
      </p>
    </div>
  );
}
