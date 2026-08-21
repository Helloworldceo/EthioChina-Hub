import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";
import { PhotoUpload } from "./PhotoUpload";

export default async function DashboardPage() {
  const session = await auth();
  const member = await prisma.member.findUniqueOrThrow({ where: { id: session!.user.id } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className="flex items-center gap-3">
          {member.verified ? (
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
              ✓ Verified
            </span>
          ) : (
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold px-3 py-1 rounded-full">
              Pending verification
            </span>
          )}
          <Link href={`/members/${member.id}`} className="text-sm text-emerald-700 dark:text-emerald-400 hover:underline">
            View public profile →
          </Link>
        </div>
      </div>
      <PhotoUpload name={member.name} photoUrl={member.photoUrl} />
      <ProfileForm member={member} />
    </div>
  );
}
