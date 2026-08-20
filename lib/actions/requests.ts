"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { supportRequestSchema, requestStatuses } from "@/lib/validations";

export type RequestState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function submitSupportRequest(_prevState: RequestState, formData: FormData): Promise<RequestState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "member") {
    return { error: "You must be logged in as a member to submit a request." };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = supportRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.supportRequest.create({
    data: {
      memberId: session.user.id,
      category: parsed.data.category,
      description: parsed.data.description,
    },
  });

  revalidatePath("/dashboard/requests");
  revalidatePath("/admin/requests");
  return { success: true };
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function assignRequest(requestId: string, adminId: string | null) {
  await requireAdmin();
  await prisma.supportRequest.update({
    where: { id: requestId },
    data: { assignedTo: adminId },
  });
  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${requestId}`);
}

export async function updateRequestStatus(requestId: string, status: (typeof requestStatuses)[number]) {
  await requireAdmin();
  await prisma.supportRequest.update({
    where: { id: requestId },
    data: {
      status,
      resolvedAt: status === "RESOLVED" ? new Date() : null,
    },
  });
  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${requestId}`);
  revalidatePath("/dashboard/requests");
}

export type NoteState = { error?: string };

export async function addInternalNote(requestId: string, _prevState: NoteState, formData: FormData): Promise<NoteState> {
  const admin = await requireAdmin();
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Note can't be empty." };

  await prisma.internalNote.create({
    data: { requestId, authorId: admin.id, body },
  });

  revalidatePath(`/admin/requests/${requestId}`);
  return {};
}
