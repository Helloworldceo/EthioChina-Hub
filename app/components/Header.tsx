import Link from "next/link";
import { auth, signOut } from "@/auth";
import { MobileNav } from "./MobileNav";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-sm shadow-brand/20">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="7" r="2.6" fill="white" />
          <circle cx="18" cy="7" r="2.6" fill="white" />
          <circle cx="12" cy="18" r="2.6" fill="#d99e2d" />
          <path d="M8 8.5L10.5 15.5M16 8.5L13.5 15.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-bold text-[15px] text-stone-900 leading-tight tracking-tight">
        EthioChina Hub
      </span>
    </Link>
  );
}

function SignOutButton({ className }: { className: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button className={className} type="submit">
        Sign out
      </button>
    </form>
  );
}

export async function Header() {
  const session = await auth();
  const user = session?.user;

  const desktopLinkClass = "text-stone-600 hover:text-brand transition-colors";

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-white/85 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/resources" className={desktopLinkClass}>
            Resources
          </Link>
          <Link href="/experiences" className={desktopLinkClass}>
            Experiences
          </Link>

          {!user && (
            <>
              <Link href="/login" className={desktopLinkClass}>
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-brand hover:bg-brand-dark text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Join
              </Link>
            </>
          )}

          {user?.role === "member" && (
            <>
              <Link href="/dashboard" className={desktopLinkClass}>
                My Profile
              </Link>
              <Link href="/dashboard/requests" className={desktopLinkClass}>
                My Requests
              </Link>
              <SignOutButton className="text-stone-500 hover:text-stone-800 transition-colors" />
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link
                href="/admin"
                className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Admin
              </Link>
              <SignOutButton className="text-stone-500 hover:text-stone-800 transition-colors" />
            </>
          )}
        </nav>

        <MobileNav>
          <Link href="/resources" className="py-1.5 hover:text-brand">
            Resources
          </Link>
          <Link href="/experiences" className="py-1.5 hover:text-brand">
            Experiences
          </Link>
          {!user && (
            <>
              <Link href="/login" className="py-1.5 hover:text-brand">
                Log in
              </Link>
              <Link href="/register" className="py-1.5 text-brand font-semibold">
                Join
              </Link>
            </>
          )}
          {user?.role === "member" && (
            <>
              <Link href="/dashboard" className="py-1.5 hover:text-brand">
                My Profile
              </Link>
              <Link href="/dashboard/requests" className="py-1.5 hover:text-brand">
                My Requests
              </Link>
              <SignOutButton className="py-1.5 text-left text-stone-500" />
            </>
          )}
          {user?.role === "admin" && (
            <>
              <Link href="/admin" className="py-1.5 hover:text-brand">
                Admin
              </Link>
              <SignOutButton className="py-1.5 text-left text-stone-500" />
            </>
          )}
        </MobileNav>
      </div>
    </header>
  );
}
