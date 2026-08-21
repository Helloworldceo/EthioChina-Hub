import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminDeleteButton } from "./AdminDeleteButton";

export default async function AdminExperiencesPage() {
  const posts = await prisma.post.findMany({
    include: { author: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Experiences ({posts.length})</h1>
      <p className="text-sm text-slate-500 dark:text-stone-400 mb-6">
        Member-shared posts go live immediately with no approval step. Use this to remove
        spam or inappropriate content.
      </p>

      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-slate-200 dark:border-stone-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 dark:text-stone-400 border-b border-slate-200 dark:border-stone-800">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Posted</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 dark:border-stone-800 last:border-0">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/experiences/${p.id}`} target="_blank" className="hover:underline">
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-stone-400">{p.author.name}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-stone-400">{p.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <AdminDeleteButton postId={p.id} />
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-400 dark:text-stone-500">
                  No experiences posted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
