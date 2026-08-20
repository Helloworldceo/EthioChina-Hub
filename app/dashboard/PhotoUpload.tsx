"use client";

import { useActionState, useState } from "react";
import { updateProfilePhoto, type PhotoState } from "@/lib/actions/members";
import { Avatar } from "@/app/components/Avatar";

const initialState: PhotoState = {};

export function PhotoUpload({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  const [state, formAction, pending] = useActionState(updateProfilePhoto, initialState);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-slate-200 p-8 mb-6 flex items-center gap-6">
      <Avatar name={name} photoUrl={preview ?? photoUrl} size={72} />
      <div className="flex-1">
        {state.success && <p className="text-emerald-700 text-sm mb-2">Photo updated.</p>}
        {state.error && <p className="text-red-600 text-sm mb-2">{state.error}</p>}
        <input
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
          className="text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-semibold hover:file:bg-emerald-100"
        />
        <button
          type="submit"
          disabled={pending}
          className="block mt-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          {pending ? "Uploading..." : "Upload photo"}
        </button>
      </div>
    </form>
  );
}
