import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DeletePostButton } from "../DeletePostButton";

export default async function ExperienceDetailPage(props: PageProps<"/experiences/[id]">) {
  const { id } = await props.params;
  const [post, session] = await Promise.all([
    prisma.post.findUnique({ where: { id }, include: { author: true } }),
    auth(),
  ]);

  if (!post) notFound();

  const canDelete =
    (session?.user.role === "member" && session.user.id === post.authorId) ||
    session?.user.role === "admin";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/experiences" className="text-sm text-slate-400 hover:underline mb-6 inline-block">
        ← All experiences
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 mb-3">{post.title}</h1>
      <div className="flex items-center justify-between mb-8">
        <p className="text-xs text-slate-400">
          {post.author.name}
          {post.author.university && ` · ${post.author.university}`}
          {" · "}
          {post.createdAt.toLocaleDateString()}
        </p>
        {canDelete && <DeletePostButton postId={post.id} redirectTo="/experiences" />}
      </div>
      <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">{post.body}</div>
    </div>
  );
}
