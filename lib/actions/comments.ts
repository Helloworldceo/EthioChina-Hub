"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validations";

export type CommentState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createComment(postId: string, _prevState: CommentState, formData: FormData): Promise<CommentState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "member") {
    return { error: "You must be logged in as a member to comment." };
  }

  const member = await prisma.member.findUniqueOrThrow({ where: { id: session.user.id } });
  if (!member.verified) {
    return { error: "Only verified members can comment. An admin needs to verify your profile first." };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = commentSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.comment.create({
    data: { postId, authorId: session.user.id, body: parsed.data.body },
  });

  revalidatePath(`/experiences/${postId}`);
  return {};
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUniqueOrThrow({ where: { id: commentId } });
  const isOwner = session.user.role === "member" && comment.authorId === session.user.id;
  const isAdmin = session.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new Error("Unauthorized");
  }

  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/experiences/${comment.postId}`);
}
