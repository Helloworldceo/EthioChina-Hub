import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditMemberForm } from "./EditMemberForm";

export default async function AdminEditMemberPage(props: PageProps<"/admin/members/[id]">) {
  const { id } = await props.params;
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{member.name}</h1>
        <span className="text-sm text-slate-400">{member.email}</span>
      </div>
      <EditMemberForm member={member} />
      <p className="text-sm text-slate-400 mt-4">
        <Link href="/admin/members" className="hover:underline">
          ← Back to members
        </Link>
      </p>
    </div>
  );
}
