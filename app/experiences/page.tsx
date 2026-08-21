import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/app/components/Avatar";

export default async function ExperiencesPage() {
  const posts = await prisma.post.findMany({
    include: { author: { select: { id: true, name: true, photoUrl: true, university: true, city: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Experiences</h1>
        <Link
          href="/dashboard/experiences"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          Share your experience
        </Link>
      </div>
      <p className="text-slate-600 dark:text-stone-400 text-sm mb-8">
        Stories, tips, and experiences from verified members of the community.
      </p>

      <div className="space-y-4">
        {posts.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-stone-900 rounded-2xl border border-slate-200 dark:border-stone-800 p-6 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
          >
            <Link href={`/experiences/${p.id}`} className="block mb-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-stone-100 mb-1">{p.title}</h2>
              <p className="text-slate-600 dark:text-stone-400 text-sm line-clamp-2">{p.body}</p>
            </Link>
            <div className="flex items-center gap-2">
              <Link href={`/members/${p.author.id}`}>
                <Avatar name={p.author.name} photoUrl={p.author.photoUrl} size={24} />
              </Link>
              <p className="text-xs text-slate-400 dark:text-stone-500">
                <Link href={`/members/${p.author.id}`} className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:underline">
                  {p.author.name}
                </Link>
                {p.author.university && ` · ${p.author.university}`}
                {p.author.city && ` · ${p.author.city}`}
                {" · "}
                {p.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-slate-400 dark:text-stone-500 py-16">
            No experiences shared yet — be the first.
          </p>
        )}
      </div>
    </div>
  );
}
