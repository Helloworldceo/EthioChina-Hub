import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="6" cy="7" r="2.6" fill="white" />
                  <circle cx="18" cy="7" r="2.6" fill="white" />
                  <circle cx="12" cy="18" r="2.6" fill="#d99e2d" />
                  <path d="M8 8.5L10.5 15.5M16 8.5L13.5 15.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </span>
              <span className="font-bold text-stone-900 dark:text-stone-100">EthioChina Hub</span>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-xs">
              A community platform for Ethiopians in China — connect, find resources, and get
              support, wherever you are in the country.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wide mb-3">
              Community
            </p>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li>
                <Link href="/resources" className="hover:text-brand transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="hover:text-brand transition-colors">
                  Experiences
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-brand transition-colors">
                  Join the community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wide mb-3">
              Get Help
            </p>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li>
                <Link href="/dashboard/requests" className="hover:text-brand transition-colors">
                  Submit a support request
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand transition-colors">
                  Log in
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-100 dark:border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-400 dark:text-stone-500">
            &copy; {new Date().getFullYear()} EthioChina Hub. Built for the community.
          </p>
          <a
            href="https://github.com/Helloworldceo/EthioChina-Hub"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-stone-400 dark:text-stone-500 hover:text-brand transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
