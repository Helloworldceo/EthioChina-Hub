import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DeletePostButton } from "../DeletePostButton";
import { CommentForm } from "./CommentForm";
import { DeleteCommentButton } from "./DeleteCommentButton";
import { LikeButton } from "./LikeButton";
import { Avatar } from "@/app/components/Avatar";

export default async function ExperienceDetailPage(props: PageProps<"/experiences/[id]">) {
  const { id } = await props.params;
  const [post, session] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: { include: { author: true, likes: true }, orderBy: { createdAt: "asc" } },
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
      <Link href="/experiences" className="text-sm text-slate-400 dark:text-stone-500 hover:underline mb-6 inline-block">
        ← All experiences
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-stone-100 mb-3">{post.title}</h1>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link href={`/members/${post.author.id}`}>
            <Avatar name={post.author.name} photoUrl={post.author.photoUrl} size={28} />
          </Link>
          <p className="text-xs text-slate-400 dark:text-stone-500">
            <Link href={`/members/${post.author.id}`} className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:underline">
              {post.author.name}
            </Link>
            {post.author.university && ` · ${post.author.university}`}
            {" · "}
            {post.createdAt.toLocaleDateString()}
          </p>
        </div>
        {canDeletePost && <DeletePostButton postId={post.id} redirectTo="/experiences" />}
      </div>
      <div className="whitespace-pre-wrap text-slate-700 dark:text-stone-300 leading-relaxed mb-10">{post.body}</div>

      <div className="border-t border-slate-200 dark:border-stone-800 pt-8">
        <h2 className="font-semibold text-slate-900 dark:text-stone-100 mb-4">
          Comments {post.comments.length > 0 && `(${post.comments.length})`}
        </h2>

        <div className="space-y-4 mb-6">
          {post.comments.map((c) => {
            const canDeleteComment =
              (session?.user.role === "member" && session.user.id === c.authorId) ||
              session?.user.role === "admin";
            const liked = session?.user.role === "member" && c.likes.some((l) => l.memberId === session.user.id);
            return (
              <div key={c.id} className="bg-slate-50 dark:bg-stone-800 rounded-lg p-4">
                <p className="text-sm text-slate-700 dark:text-stone-300 mb-2">{c.body}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link href={`/members/${c.author.id}`}>
                      <Avatar name={c.author.name} photoUrl={c.author.photoUrl} size={20} />
                    </Link>
                    <p className="text-xs text-slate-400 dark:text-stone-500">
                      <Link href={`/members/${c.author.id}`} className="hover:text-emerald-700 dark:hover:text-emerald-400 hover:underline">
                        {c.author.name}
                      </Link>{" "}
                      · {c.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {commenter?.verified ? (
                      <LikeButton
                        commentId={c.id}
                        postId={post.id}
                        initialLiked={liked ?? false}
                        initialCount={c.likes.length}
                      />
                    ) : (
                      c.likes.length > 0 && (
                        <span className="text-xs text-slate-400 dark:text-stone-500">
                          ♥ {c.likes.length}
                        </span>
                      )
                    )}
                    {canDeleteComment && <DeleteCommentButton commentId={c.id} />}
                  </div>
                </div>
              </div>
            );
          })}
          {post.comments.length === 0 && (
            <p className="text-sm text-slate-400 dark:text-stone-500">No comments yet.</p>
          )}
        </div>

        {commenter?.verified ? (
          <CommentForm postId={post.id} />
        ) : commenter ? (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Only verified members can comment. An admin needs to verify your profile first.
          </p>
        ) : (
          <p className="text-sm text-slate-400 dark:text-stone-500">
            <Link href="/login" className="text-emerald-700 dark:text-emerald-400 hover:underline">
              Log in
            </Link>{" "}
            as a verified member to comment.
          </p>
        )}
      </div>
    </div>
  );
}
