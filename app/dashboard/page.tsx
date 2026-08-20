import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";

export default async function DashboardPage() {
  const session = await auth();
  const member = await prisma.member.findUniqueOrThrow({ where: { id: session!.user.id } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        {member.verified ? (
          <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full">
            ✓ Verified
          </span>
        ) : (
          <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
            Pending verification
          </span>
        )}
      </div>
      <ProfileForm member={member} />
    </div>
  );
}
