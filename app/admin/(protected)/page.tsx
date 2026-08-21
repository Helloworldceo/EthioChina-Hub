import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [totalMembers, verifiedMembers, publishedResources, requestsByStatus, requestsByCategory] =
    await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { verified: true } }),
      prisma.resource.count({ where: { publishedAt: { not: null } } }),
      prisma.supportRequest.groupBy({ by: ["status"], _count: true }),
      prisma.supportRequest.groupBy({ by: ["category"], _count: true }),
    ]);

  const statusCounts = Object.fromEntries(requestsByStatus.map((r) => [r.status, r._count]));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total members" value={totalMembers} href="/admin/members" />
        <StatCard label="Verified members" value={verifiedMembers} href="/admin/members?verified=true" />
        <StatCard label="Published resources" value={publishedResources} href="/admin/resources" />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-slate-200 dark:border-stone-800 p-6">
          <h2 className="font-semibold mb-4">Requests by status</h2>
          <div className="space-y-2">
            {["OPEN", "IN_PROGRESS", "RESOLVED"].map((s) => (
              <div key={s} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-stone-400">{s.replace("_", " ")}</span>
                <span className="font-semibold">{statusCounts[s] ?? 0}</span>
              </div>
            ))}
          </div>
          <Link href="/admin/requests" className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline mt-4 inline-block">
            View all requests →
          </Link>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-slate-200 dark:border-stone-800 p-6">
          <h2 className="font-semibold mb-4">Requests by category</h2>
          <div className="space-y-2">
            {requestsByCategory.map((r) => (
              <div key={r.category} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-stone-400">{r.category}</span>
                <span className="font-semibold">{r._count}</span>
              </div>
            ))}
            {requestsByCategory.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-stone-500">No requests filed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="bg-white dark:bg-stone-900 rounded-2xl border border-slate-200 dark:border-stone-800 p-6 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
    >
      <p className="text-3xl font-bold text-slate-900 dark:text-stone-100">{value}</p>
      <p className="text-sm text-slate-500 dark:text-stone-400 mt-1">{label}</p>
    </Link>
  );
}
