import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/app/components/Avatar";
import type { Prisma } from "@prisma/client";

export default async function MembersDirectoryPage(props: PageProps<"/members">) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const university = typeof searchParams.university === "string" ? searchParams.university : "";
  const city = typeof searchParams.city === "string" ? searchParams.city : "";

  const where: Prisma.MemberWhereInput = { verified: true };
  if (q) {
    where.name = { contains: q, mode: "insensitive" };
  }
  if (university) where.university = university;
  if (city) where.city = city;

  const [members, universities, cities] = await Promise.all([
    prisma.member.findMany({
      where,
      select: { id: true, name: true, title: true, photoUrl: true, university: true, city: true },
      orderBy: { name: "asc" },
    }),
    prisma.member.findMany({
      where: { verified: true, university: { not: null } },
      select: { university: true },
      distinct: ["university"],
      orderBy: { university: "asc" },
    }),
    prisma.member.findMany({
      where: { verified: true, city: { not: null } },
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    }),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Member Directory</h1>
      <p className="text-stone-500 dark:text-stone-400 text-sm mb-8">
        Verified members of the community — find others at your university or city.
      </p>

      <form className="flex flex-wrap items-center gap-3 mb-8">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name..."
          className="flex-1 min-w-[180px] rounded-lg border border-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <select name="university" defaultValue={university} className="rounded-lg border border-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm">
          <option value="">All universities</option>
          {universities.map((u) => (
            <option key={u.university} value={u.university!}>
              {u.university}
            </option>
          ))}
        </select>
        <select name="city" defaultValue={city} className="rounded-lg border border-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm">
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c.city} value={c.city!}>
              {c.city}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-sm font-semibold px-4 py-2 rounded-lg">
          Filter
        </button>
      </form>

      <div className="grid sm:grid-cols-2 gap-4">
        {members.map((m) => (
          <Link
            key={m.id}
            href={`/members/${m.id}`}
            className="flex items-center gap-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 hover:border-brand/30 transition-colors"
          >
            <Avatar name={m.name} photoUrl={m.photoUrl} size={44} />
            <div className="min-w-0">
              <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">{m.name}</p>
              <p className="text-xs text-stone-400 dark:text-stone-500 truncate">
                {m.title || [m.university, m.city].filter(Boolean).join(" · ") || "Member"}
              </p>
            </div>
          </Link>
        ))}
        {members.length === 0 && (
          <p className="text-sm text-stone-400 dark:text-stone-500 col-span-2 text-center py-16">
            No verified members match this search yet.
          </p>
        )}
      </div>
    </div>
  );
}
