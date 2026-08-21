import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MemberRowActions } from "./MemberRowActions";
import type { Prisma } from "@prisma/client";

export default async function AdminMembersPage(props: PageProps<"/admin/members">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const verifiedFilter = typeof searchParams.verified === "string" ? searchParams.verified : "";

  const where: Prisma.MemberWhereInput = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { university: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
    ];
  }
  if (verifiedFilter === "true") where.verified = true;
  if (verifiedFilter === "false") where.verified = false;

  const members = await prisma.member.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Members ({members.length})</h1>
        <a
          href="/api/admin/members/export"
          className="bg-slate-800 hover:bg-slate-900 dark:bg-stone-700 dark:hover:bg-stone-600 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          Export CSV
        </a>
      </div>

      <form className="flex items-center gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search name, email, university, city..."
          className="flex-1 rounded-lg border border-slate-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <select
          name="verified"
          defaultValue={verifiedFilter}
          className="rounded-lg border border-slate-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
        <button type="submit" className="bg-slate-200 dark:bg-stone-700 hover:bg-slate-300 dark:hover:bg-stone-600 text-sm font-semibold px-4 py-2 rounded-lg">
          Filter
        </button>
      </form>

      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-slate-200 dark:border-stone-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 dark:text-stone-400 border-b border-slate-200 dark:border-stone-800">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">University</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-slate-100 dark:border-stone-800 last:border-0">
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-stone-400">{m.email}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-stone-400">{m.university ?? "—"}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-stone-400">{m.city ?? "—"}</td>
                <td className="px-4 py-3">
                  {m.verified ? (
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                      Verified
                    </span>
                  ) : (
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <MemberRowActions id={m.id} verified={m.verified} />
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400 dark:text-stone-500">
                  No members match this search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-slate-400 dark:text-stone-500 mt-4">
        <Link href="/admin" className="hover:underline">
          ← Back to overview
        </Link>
      </p>
    </div>
  );
}
