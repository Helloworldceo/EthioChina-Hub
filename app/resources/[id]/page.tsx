import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

const categoryLabels: Record<string, string> = {
  ANNOUNCEMENT: "Announcement",
  EVENT: "Event",
  GUIDE: "Guide",
  FAQ: "FAQ",
};

export default async function ResourceDetailPage(props: PageProps<"/resources/[id]">) {
  const { id } = await props.params;
  const resource = await prisma.resource.findUnique({ where: { id } });

  if (!resource || !resource.publishedAt) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/resources" className="text-sm text-slate-400 hover:underline mb-6 inline-block">
        ← All resources
      </Link>
      <div className="flex items-center gap-2 mb-3">
        {resource.pinned && <span title="Pinned">📌</span>}
        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
          {categoryLabels[resource.category]}
        </span>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">{resource.title}</h1>
      <p className="text-xs text-slate-400 mb-8">
        Published {resource.publishedAt.toLocaleDateString()}
      </p>
      <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed">
        {resource.body}
      </div>
    </div>
  );
}
