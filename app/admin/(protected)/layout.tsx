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
      <nav className="flex items-center gap-6 text-sm font-medium text-slate-600 border-b border-slate-200 mb-8 pb-4">
        <Link href="/admin" className="hover:text-emerald-700">
          Overview
        </Link>
        <Link href="/admin/members" className="hover:text-emerald-700">
          Members
        </Link>
        <Link href="/admin/resources" className="hover:text-emerald-700">
          Resources
        </Link>
        <Link href="/admin/requests" className="hover:text-emerald-700">
          Support Requests
        </Link>
      </nav>
      {children}
    </div>
  );
}
