import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ResourceRowActions } from "./ResourceRowActions";

export default async function AdminResourcesPage() {
  const resources = await prisma.resource.findMany({
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Resources ({resources.length})</h1>
        <Link
          href="/admin/resources/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          + New resource
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Pinned</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium">{r.title}</td>
                <td className="px-4 py-3 text-slate-600">{r.category}</td>
                <td className="px-4 py-3">
                  {r.publishedAt ? (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      Published
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{r.pinned ? "📌" : ""}</td>
                <td className="px-4 py-3">
                  <ResourceRowActions id={r.id} pinned={r.pinned} />
                </td>
              </tr>
            ))}
            {resources.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  No resources yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-slate-400 mt-4">
        <Link href="/admin" className="hover:underline">
          ← Back to overview
        </Link>
      </p>
    </div>
  );
}
