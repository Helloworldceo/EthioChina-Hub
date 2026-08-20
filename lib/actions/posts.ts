"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { postSchema } from "@/lib/validations";

export type PostState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function createPost(_prevState: PostState, formData: FormData): Promise<PostState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "member") {
    return { error: "You must be logged in as a member to post." };
  }

  const member = await prisma.member.findUniqueOrThrow({ where: { id: session.user.id } });
  if (!member.verified) {
    return { error: "Only verified members can share experiences. An admin needs to verify your profile first." };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.post.create({
    data: {
      authorId: session.user.id,
      title: parsed.data.title,
      body: parsed.data.body,
    },
  });

  revalidatePath("/experiences");
  revalidatePath("/dashboard/experiences");
  return { success: true };
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const post = await prisma.post.findUniqueOrThrow({ where: { id: postId } });
  const isOwner = session.user.role === "member" && post.authorId === session.user.id;
  const isAdmin = session.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/experiences");
  revalidatePath("/dashboard/experiences");
  revalidatePath("/admin/experiences");
}
