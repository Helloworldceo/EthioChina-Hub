import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { RequestForm } from "./RequestForm";

const statusStyles: Record<string, string> = {
  OPEN: "bg-amber-100 text-amber-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
};

const statusLabels: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

export default async function MyRequestsPage() {
  const session = await auth();
  const requests = await prisma.supportRequest.findMany({
    where: { memberId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Support Requests</h1>
      <RequestForm />

      <div className="space-y-3 mt-8">
        {requests.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {r.category}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[r.status]}`}>
                {statusLabels[r.status]}
              </span>
            </div>
            <p className="text-slate-700 text-sm">{r.description}</p>
            <p className="text-xs text-slate-400 mt-3">
              Filed {r.createdAt.toLocaleDateString()}
              {r.resolvedAt && ` · Resolved ${r.resolvedAt.toLocaleDateString()}`}
            </p>
          </div>
        ))}
        {requests.length === 0 && (
          <p className="text-center text-slate-400 py-10">You haven&apos;t filed any requests yet.</p>
        )}
      </div>
    </div>
  );
}
