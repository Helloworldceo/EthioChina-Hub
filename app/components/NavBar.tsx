import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function NavBar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-emerald-700">
          EthioChina Hub
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/resources" className="hover:text-emerald-700">
            Resources
          </Link>
          {!user && (
            <>
              <Link href="/login" className="hover:text-emerald-700">
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
              >
                Join
              </Link>
            </>
          )}
          {user?.role === "member" && (
            <>
              <Link href="/dashboard" className="hover:text-emerald-700">
                My Profile
              </Link>
              <Link href="/dashboard/requests" className="hover:text-emerald-700">
                My Requests
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="hover:text-emerald-700" type="submit">
                  Sign out
                </button>
              </form>
            </>
          )}
          {user?.role === "admin" && (
            <>
              <Link href="/admin" className="hover:text-emerald-700">
                Admin
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="hover:text-emerald-700" type="submit">
                  Sign out
                </button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
