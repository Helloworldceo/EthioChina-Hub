import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const members = await prisma.member.findMany({ orderBy: { createdAt: "desc" } });

  const headers = [
    "name",
    "email",
    "phone",
    "university",
    "city",
    "program",
    "wechat",
    "verified",
    "createdAt",
  ];

  const rows = members.map((m) =>
    [
      m.name,
      m.email,
      m.phone ?? "",
      m.university ?? "",
      m.city ?? "",
      m.program ?? "",
      m.wechat ?? "",
      m.verified ? "yes" : "no",
      m.createdAt.toISOString(),
    ]
      .map((v) => csvEscape(String(v)))
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="members-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
