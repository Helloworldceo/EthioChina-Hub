import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "member") {
    redirect("/");
  }

  return <div className="max-w-3xl mx-auto px-4 py-10">{children}</div>;
}
