"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { resourceSchema } from "@/lib/validations";

export type ResourceState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function createResource(_prevState: ResourceState, formData: FormData): Promise<ResourceState> {
  const admin = await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = resourceSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { title, body, category, pinned, published } = parsed.data;

  const resource = await prisma.resource.create({
    data: {
      title,
      body,
      category,
      pinned,
      authorId: admin.id,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  redirect(`/admin/resources/${resource.id}/edit`);
}

export async function updateResource(
  resourceId: string,
  _prevState: ResourceState,
  formData: FormData
): Promise<ResourceState> {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = resourceSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.resource.findUniqueOrThrow({ where: { id: resourceId } });
  const { title, body, category, pinned, published } = parsed.data;

  await prisma.resource.update({
    where: { id: resourceId },
    data: {
      title,
      body,
      category,
      pinned,
      publishedAt: published ? existing.publishedAt ?? new Date() : null,
    },
  });

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  revalidatePath(`/resources/${resourceId}`);
  return {};
}

export async function deleteResource(resourceId: string) {
  await requireAdmin();
  await prisma.resource.delete({ where: { id: resourceId } });
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
}

export async function togglePinned(resourceId: string, pinned: boolean) {
  await requireAdmin();
  await prisma.resource.update({ where: { id: resourceId }, data: { pinned } });
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
}
