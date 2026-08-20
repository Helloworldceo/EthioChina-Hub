"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema } from "@/lib/validations";

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

  const { name, phone, university, city, program, wechat, studentIdOrDoc } = parsed.data;

  await prisma.member.update({
    where: { id: session.user.id },
    data: {
      name,
      phone: phone || null,
      university: university || null,
      city: city || null,
      program: program || null,
      wechat: wechat || null,
      studentIdOrDoc: studentIdOrDoc || null,
    },
  });

  revalidatePath("/dashboard");
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

  const { name, phone, university, city, program, wechat, studentIdOrDoc } = parsed.data;

  await prisma.member.update({
    where: { id: memberId },
    data: {
      name,
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
  return { success: true };
}
