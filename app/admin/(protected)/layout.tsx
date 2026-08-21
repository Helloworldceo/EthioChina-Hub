import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }
  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-stone-400 border-b border-slate-200 dark:border-stone-800 mb-8 pb-4">
        <Link href="/admin" className="hover:text-emerald-700 dark:hover:text-emerald-400">
          Overview
        </Link>
        <Link href="/admin/members" className="hover:text-emerald-700 dark:hover:text-emerald-400">
          Members
        </Link>
        <Link href="/admin/resources" className="hover:text-emerald-700 dark:hover:text-emerald-400">
          Resources
        </Link>
        <Link href="/admin/requests" className="hover:text-emerald-700 dark:hover:text-emerald-400">
          Support Requests
        </Link>
        <Link href="/admin/experiences" className="hover:text-emerald-700 dark:hover:text-emerald-400">
          Experiences
        </Link>
      </nav>
      {children}
    </div>
  );
}
