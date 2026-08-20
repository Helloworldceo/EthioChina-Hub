import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RequestControls } from "./RequestControls";
import { NotesSection } from "./NotesSection";

export default async function AdminRequestDetailPage(props: PageProps<"/admin/requests/[id]">) {
  const { id } = await props.params;

  const [request, admins] = await Promise.all([
    prisma.supportRequest.findUnique({
      where: { id },
      include: {
        member: true,
        internalNotes: { include: { author: true }, orderBy: { createdAt: "asc" } },
      },
    }),
    prisma.admin.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!request) notFound();

  return (
    <div>
      <Link href="/admin/requests" className="text-sm text-slate-400 hover:underline mb-6 inline-block">
        ← All requests
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">{request.member.name}</h1>
            <p className="text-sm text-slate-500">{request.member.email}</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {request.category}
          </span>
        </div>
        <p className="text-slate-700 whitespace-pre-wrap mb-6">{request.description}</p>

        <RequestControls
          requestId={request.id}
          status={request.status}
          assignedTo={request.assignedTo}
          admins={admins}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <NotesSection requestId={request.id} notes={request.internalNotes} />
      </div>
    </div>
  );
}
