import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/app/components/Avatar";

export default async function MemberProfilePage(props: PageProps<"/members/[id]">) {
  const { id } = await props.params;

  const [member, posts] = await Promise.all([
    prisma.member.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        title: true,
        bio: true,
        photoUrl: true,
        university: true,
        city: true,
        program: true,
        verified: true,
        createdAt: true,
      },
    }),
    prisma.post.findMany({
      where: { authorId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  if (!member) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center mb-8">
        <div className="flex justify-center mb-4">
          <Avatar name={member.name} photoUrl={member.photoUrl} size={88} />
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-stone-900">{member.name}</h1>
          {member.verified && (
            <span title="Verified member" className="text-brand">
              ✓
            </span>
          )}
        </div>
        {member.title && <p className="text-stone-500 mb-3">{member.title}</p>}
        {member.bio && (
          <p className="text-stone-700 max-w-lg mx-auto leading-relaxed mb-4">{member.bio}</p>
        )}
        <div className="flex items-center justify-center gap-3 flex-wrap text-xs text-stone-400">
          {member.university && <span>{member.university}</span>}
          {member.city && <span>· {member.city}</span>}
          {member.program && <span>· {member.program}</span>}
        </div>
        <p className="text-xs text-stone-300 mt-4">
          Member since {member.createdAt.toLocaleDateString()}
        </p>
      </div>

      <h2 className="font-semibold text-stone-900 mb-4">Experiences shared</h2>
      <div className="space-y-3">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/experiences/${p.id}`}
            className="block bg-white rounded-xl border border-stone-200 p-5 hover:border-brand/30 transition-colors"
          >
            <h3 className="font-semibold text-stone-900 mb-1">{p.title}</h3>
            <p className="text-stone-500 text-sm line-clamp-2">{p.body}</p>
          </Link>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-stone-400">No experiences shared yet.</p>
        )}
      </div>
    </div>
  );
}
