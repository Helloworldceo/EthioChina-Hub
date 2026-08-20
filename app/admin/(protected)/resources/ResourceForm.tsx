"use client";

import { useActionState } from "react";
import { resourceCategories } from "@/lib/validations";
import type { ResourceState } from "@/lib/actions/resources";

const initialState: ResourceState = {};

type Defaults = {
  title?: string;
  body?: string;
  category?: string;
  pinned?: boolean;
  published?: boolean;
};

export function ResourceForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (state: ResourceState, formData: FormData) => Promise<ResourceState>;
  defaults?: Defaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
      {state.error && (
        <p className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{state.error}</p>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={defaults?.title}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {state.fieldErrors?.title && (
          <p className="text-xs text-red-600 mt-1">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={defaults?.category ?? "ANNOUNCEMENT"}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          {resourceCategories.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0) + c.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-slate-700 mb-1">
          Body
        </label>
        <textarea
          id="body"
          name="body"
          defaultValue={defaults?.body}
          required
          rows={10}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {state.fieldErrors?.body && (
          <p className="text-xs text-red-600 mt-1">{state.fieldErrors.body[0]}</p>
        )}
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" name="pinned" value="true" defaultChecked={defaults?.pinned} />
          Pin to top
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input type="checkbox" name="published" value="true" defaultChecked={defaults?.published ?? true} />
          Published (visible to members)
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
