import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requestCategories, requestStatuses } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

const statusStyles: Record<string, string> = {
  OPEN: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  RESOLVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default async function AdminRequestsPage(props: PageProps<"/admin/requests">) {
  const searchParams = await props.searchParams;
  const category = typeof searchParams.category === "string" ? searchParams.category : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const where: Prisma.SupportRequestWhereInput = {};
  if (category) where.category = category as Prisma.SupportRequestWhereInput["category"];
  if (status) where.status = status as Prisma.SupportRequestWhereInput["status"];

  const requests = await prisma.supportRequest.findMany({
    where,
    include: { member: { select: { name: true, email: true } }, assignedAdmin: { select: { name: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  const counts = await prisma.supportRequest.groupBy({
    by: ["status"],
    _count: true,
  });
  const countsByStatus = Object.fromEntries(counts.map((c) => [c.status, c._count]));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Support Requests</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {requestStatuses.map((s) => (
          <div key={s} className="bg-white dark:bg-stone-900 rounded-2xl border border-slate-200 dark:border-stone-800 p-5 text-center">
            <p className="text-2xl font-bold">{countsByStatus[s] ?? 0}</p>
            <p className="text-xs text-slate-500 dark:text-stone-400 uppercase tracking-wide mt-1">{s.replace("_", " ")}</p>
          </div>
        ))}
      </div>

      <form className="flex items-center gap-3 mb-6">
        <select name="category" defaultValue={category} className="rounded-lg border border-slate-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm">
          <option value="">All categories</option>
          {requestCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status} className="rounded-lg border border-slate-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {requestStatuses.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-slate-200 dark:bg-stone-700 hover:bg-slate-300 dark:hover:bg-stone-600 text-sm font-semibold px-4 py-2 rounded-lg">
          Filter
        </button>
      </form>

      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-slate-200 dark:border-stone-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 dark:text-stone-400 border-b border-slate-200 dark:border-stone-800">
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned</th>
              <th className="px-4 py-3">Filed</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 dark:border-stone-800 last:border-0">
                <td className="px-4 py-3 font-medium">{r.member.name}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-stone-400">{r.category}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[r.status]}`}>
                    {r.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-stone-400">{r.assignedAdmin?.name ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-stone-400">{r.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/requests/${r.id}`} className="text-emerald-700 dark:text-emerald-400 hover:underline">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400 dark:text-stone-500">
                  No requests match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
