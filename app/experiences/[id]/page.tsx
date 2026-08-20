import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DeletePostButton } from "../DeletePostButton";
import { CommentForm } from "./CommentForm";
import { DeleteCommentButton } from "./DeleteCommentButton";

export default async function ExperienceDetailPage(props: PageProps<"/experiences/[id]">) {
  const { id } = await props.params;
  const [post, session] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
      },
    }),
    auth(),
  ]);

  if (!post) notFound();

  const commenter =
    session?.user.role === "member"
      ? await prisma.member.findUnique({ where: { id: session.user.id } })
      : null;

  const canDeletePost =
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
        {canDeletePost && <DeletePostButton postId={post.id} redirectTo="/experiences" />}
      </div>
      <div className="whitespace-pre-wrap text-slate-700 leading-relaxed mb-10">{post.body}</div>

      <div className="border-t border-slate-200 pt-8">
        <h2 className="font-semibold text-slate-900 mb-4">
          Comments {post.comments.length > 0 && `(${post.comments.length})`}
        </h2>

        <div className="space-y-4 mb-6">
          {post.comments.map((c) => {
            const canDeleteComment =
              (session?.user.role === "member" && session.user.id === c.authorId) ||
              session?.user.role === "admin";
            return (
              <div key={c.id} className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-700 mb-2">{c.body}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    {c.author.name} · {c.createdAt.toLocaleDateString()}
                  </p>
                  {canDeleteComment && <DeleteCommentButton commentId={c.id} />}
                </div>
              </div>
            );
          })}
          {post.comments.length === 0 && (
            <p className="text-sm text-slate-400">No comments yet.</p>
          )}
        </div>

        {commenter?.verified ? (
          <CommentForm postId={post.id} />
        ) : commenter ? (
          <p className="text-sm text-amber-600">
            Only verified members can comment. An admin needs to verify your profile first.
          </p>
        ) : (
          <p className="text-sm text-slate-400">
            <Link href="/login" className="text-emerald-700 hover:underline">
              Log in
            </Link>{" "}
            as a verified member to comment.
          </p>
        )}
      </div>
    </div>
  );
}
