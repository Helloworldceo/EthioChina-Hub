import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PostForm } from "./PostForm";
import { DeletePostButton } from "@/app/experiences/DeletePostButton";

export default async function MyExperiencesPage() {
  const session = await auth();
  const [member, posts] = await Promise.all([
    prisma.member.findUniqueOrThrow({ where: { id: session!.user.id } }),
    prisma.post.findMany({
      where: { authorId: session!.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Share an Experience</h1>

      {member.verified ? (
        <PostForm />
      ) : (
        <p className="bg-amber-50 text-amber-700 text-sm rounded-lg px-4 py-3">
          Only verified members can post. An admin needs to verify your profile first — check
          back once you&apos;re verified.
        </p>
      )}

      <h2 className="text-lg font-semibold mt-10 mb-4">Your posts</h2>
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/experiences/${p.id}`} className="font-semibold text-slate-900 hover:underline">
                {p.title}
              </Link>
              <DeletePostButton postId={p.id} redirectTo="/dashboard/experiences" />
            </div>
            <p className="text-slate-600 text-sm line-clamp-2">{p.body}</p>
            <p className="text-xs text-slate-400 mt-2">{p.createdAt.toLocaleDateString()}</p>
          </div>
        ))}
        {posts.length === 0 && <p className="text-slate-400 text-sm">You haven&apos;t posted anything yet.</p>}
      </div>
    </div>
  );
}
