"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export type RegisterState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function registerMember(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password, phone, university, city, program, wechat } = parsed.data;

  const existing = await prisma.member.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists. Try logging in instead." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.member.create({
    data: {
      name,
      email,
      passwordHash,
      phone: phone || null,
      university: university || null,
      city: city || null,
      program: program || null,
      wechat: wechat || null,
    },
  });

  return { success: true };
}
