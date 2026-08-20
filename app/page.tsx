import Link from "next/link";

const features = [
  {
    title: "Verified directory",
    body: "A member directory, verified by community admins, to help students connect with others at their university or in their city.",
    icon: (
      <path d="M9 7a3 3 0 100 6 3 3 0 000-6zM3 20c0-3 2.5-5.5 6-5.5S15 17 15 20M17 8a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM21 20c0-2.5-1.8-4.6-4.2-5.3" />
    ),
  },
  {
    title: "Resource hub",
    body: "Announcements, events, guides, and FAQs — published and kept up to date by the community's admins.",
    icon: <path d="M4 5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM14 3v5h5M8 13h8M8 17h5" />,
  },
  {
    title: "Experiences",
    body: "Stories and advice shared by verified members — real experiences from people who've navigated the same things you're facing.",
    icon: <path d="M4 4h16v12H8l-4 4V4z" />,
  },
  {
    title: "Support requests",
    body: "File a request for visa, housing, academic, financial, or emergency support, and track its status until it's resolved.",
    icon: <path d="M12 22s8-4.5 8-11V6l-8-3-8 3v5c0 6.5 8 11 8 11zM9 12l2 2 4-4" />,
  },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 bg-brand/10 text-brand-dark text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full mb-6">
          A community, wherever you are
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-5 tracking-tight leading-[1.1]">
          A home base for{" "}
          <span className="bg-gradient-to-r from-brand to-gold bg-clip-text text-transparent">
            Ethiopians in China
          </span>
        </h1>
        <p className="text-stone-600 text-lg mb-9 leading-relaxed">
          Connect with the community, find verified resources on visas, housing, and academics,
          and get support when you need it.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="bg-brand hover:bg-brand-dark text-white font-semibold px-7 py-3.5 rounded-xl shadow-sm shadow-brand/20 transition-colors"
          >
            Join the community
          </Link>
          <Link
            href="/resources"
            className="bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-semibold px-7 py-3.5 rounded-xl transition-colors"
          >
            Browse resources
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-24">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-2xl border border-stone-200 p-6 hover:border-brand/30 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-4">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-brand-dark">
                {f.icon}
              </svg>
            </div>
            <h2 className="font-semibold text-stone-900 mb-2">{f.title}</h2>
            <p className="text-stone-500 text-sm leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
