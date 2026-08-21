import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { resourceCategories } from "@/lib/validations";
import type { Prisma } from "@prisma/client";

const categoryLabels: Record<string, string> = {
  ANNOUNCEMENT: "Announcement",
  EVENT: "Event",
  GUIDE: "Guide",
  FAQ: "FAQ",
};

export default async function ResourcesPage(props: PageProps<"/resources">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const category = typeof searchParams.category === "string" ? searchParams.category : "";

  const where: Prisma.ResourceWhereInput = { publishedAt: { not: null } };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { body: { contains: q, mode: "insensitive" } },
    ];
  }
  if (category) where.category = category as Prisma.ResourceWhereInput["category"];

  const resources = await prisma.resource.findMany({
    where,
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Resources</h1>

      <form className="flex items-center gap-3 mb-8">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search resources..."
          className="flex-1 rounded-lg border border-slate-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <select name="category" defaultValue={category} className="rounded-lg border border-slate-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm">
          <option value="">All categories</option>
          {resourceCategories.map((c) => (
            <option key={c} value={c}>
              {categoryLabels[c]}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-slate-200 dark:bg-stone-700 hover:bg-slate-300 dark:hover:bg-stone-600 text-sm font-semibold px-4 py-2 rounded-lg">
          Filter
        </button>
      </form>

      <div className="space-y-4">
        {resources.map((r) => (
          <Link
            key={r.id}
            href={`/resources/${r.id}`}
            className="block bg-white dark:bg-stone-900 rounded-2xl border border-slate-200 dark:border-stone-800 p-6 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              {r.pinned && <span title="Pinned">📌</span>}
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                {categoryLabels[r.category]}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-stone-100 mb-1">{r.title}</h2>
            <p className="text-slate-600 dark:text-stone-400 text-sm line-clamp-2">{r.body}</p>
          </Link>
        ))}
        {resources.length === 0 && (
          <p className="text-center text-slate-400 dark:text-stone-500 py-16">No resources match this search yet.</p>
        )}
      </div>
    </div>
  );
}
