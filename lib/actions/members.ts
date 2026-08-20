"use server";

import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema, MAX_PHOTO_BYTES, ALLOWED_PHOTO_TYPES } from "@/lib/validations";

export type ProfileState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function updateOwnProfile(_prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "member") {
    return { error: "You must be logged in as a member to do this." };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = profileUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, title, bio, phone, university, city, program, wechat, studentIdOrDoc } = parsed.data;

  await prisma.member.update({
    where: { id: session.user.id },
    data: {
      name,
      title: title || null,
      bio: bio || null,
      phone: phone || null,
      university: university || null,
      city: city || null,
      program: program || null,
      wechat: wechat || null,
      studentIdOrDoc: studentIdOrDoc || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/members/${session.user.id}`);
  return { success: true };
}

export type PhotoState = { error?: string; success?: boolean };

export async function updateProfilePhoto(_prevState: PhotoState, formData: FormData): Promise<PhotoState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "member") {
    return { error: "You must be logged in as a member to do this." };
  }

  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return { error: "Please upload a JPEG, PNG, or WebP image." };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { error: "Image is too large — max 4MB." };
  }

  const extension = file.type.split("/")[1];
  const blob = await put(`profile-photos/${session.user.id}-${Date.now()}.${extension}`, file, {
    access: "public",
    addRandomSuffix: false,
  });

  await prisma.member.update({
    where: { id: session.user.id },
    data: { photoUrl: blob.url },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/members/${session.user.id}`);
  return { success: true };
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function verifyMember(memberId: string, verified: boolean) {
  const admin = await requireAdmin();
  await prisma.member.update({
    where: { id: memberId },
    data: { verified, verifiedBy: verified ? admin.id : null },
  });
  revalidatePath("/admin/members");
}

export async function deleteMember(memberId: string) {
  await requireAdmin();
  await prisma.member.delete({ where: { id: memberId } });
  revalidatePath("/admin/members");
}

export type AdminMemberEditState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function adminUpdateMember(
  memberId: string,
  _prevState: AdminMemberEditState,
  formData: FormData
): Promise<AdminMemberEditState> {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = profileUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, title, bio, phone, university, city, program, wechat, studentIdOrDoc } = parsed.data;

  await prisma.member.update({
    where: { id: memberId },
    data: {
      name,
      title: title || null,
      bio: bio || null,
      phone: phone || null,
      university: university || null,
      city: city || null,
      program: program || null,
      wechat: wechat || null,
      studentIdOrDoc: studentIdOrDoc || null,
    },
  });

  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${memberId}`);
  revalidatePath(`/members/${memberId}`);
  return { success: true };
}
