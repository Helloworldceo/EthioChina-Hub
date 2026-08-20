"use client";

import { useTransition } from "react";
import { assignRequest, updateRequestStatus } from "@/lib/actions/requests";
import { requestStatuses } from "@/lib/validations";

export function RequestControls({
  requestId,
  status,
  assignedTo,
  admins,
}: {
  requestId: string;
  status: string;
  assignedTo: string | null;
  admins: { id: string; name: string }[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-slate-700">
        Status
        <select
          defaultValue={status}
          disabled={pending}
          onChange={(e) =>
            startTransition(() =>
              updateRequestStatus(requestId, e.target.value as (typeof requestStatuses)[number])
            )
          }
          className="ml-2 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
        >
          {requestStatuses.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-slate-700">
        Assigned to
        <select
          defaultValue={assignedTo ?? ""}
          disabled={pending}
          onChange={(e) => startTransition(() => assignRequest(requestId, e.target.value || null))}
          className="ml-2 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
        >
          <option value="">Unassigned</option>
          {admins.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
