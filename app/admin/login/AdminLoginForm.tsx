"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signIn("admin-credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }
      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
      {error && <p className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</p>}
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Admin email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white font-semibold py-3 rounded-lg"
        >
          {pending ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}
