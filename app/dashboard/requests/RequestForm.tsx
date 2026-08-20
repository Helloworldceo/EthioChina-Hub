"use client";

import { useActionState } from "react";
import { submitSupportRequest, type RequestState } from "@/lib/actions/requests";
import { requestCategories } from "@/lib/validations";

const initialState: RequestState = {};

const categoryLabels: Record<string, string> = {
  VISA: "Visa",
  HOUSING: "Housing",
  ACADEMIC: "Academic",
  FINANCIAL: "Financial",
  EMERGENCY: "Emergency",
  OTHER: "Other",
};

export function RequestForm() {
  const [state, formAction, pending] = useActionState(submitSupportRequest, initialState);

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      {state.success && (
        <p className="bg-emerald-50 text-emerald-700 text-sm rounded-lg px-4 py-3">
          Request submitted. An admin will review it soon.
        </p>
      )}
      {state.error && (
        <p className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{state.error}</p>
      )}

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          {requestCategories.map((c) => (
            <option key={c} value={c}>
              {categoryLabels[c]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
          Describe your situation
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {state.fieldErrors?.description && (
          <p className="text-xs text-red-600 mt-1">{state.fieldErrors.description[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg"
      >
        {pending ? "Submitting..." : "Submit request"}
      </button>
    </form>
  );
}
