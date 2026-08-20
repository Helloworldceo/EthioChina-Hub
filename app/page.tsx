import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          A home base for Ethiopians in China
        </h1>
        <p className="text-slate-600 text-lg mb-8">
          Connect with the community, find verified resources on visas, housing, and academics,
          and get support when you need it.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Join the community
          </Link>
          <Link
            href="/resources"
            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-lg"
          >
            Browse resources
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mt-20">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-lg mb-2">Verified directory</h2>
          <p className="text-slate-600 text-sm">
            A member directory, verified by community admins, to help students connect with
            others at their university or in their city.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-lg mb-2">Resource hub</h2>
          <p className="text-slate-600 text-sm">
            Announcements, events, guides, and FAQs — published and kept up to date by the
            community&apos;s admins.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-lg mb-2">Support requests</h2>
          <p className="text-slate-600 text-sm">
            File a request for visa, housing, academic, financial, or emergency support, and
            track its status until it&apos;s resolved.
          </p>
        </div>
      </div>
    </div>
  );
}
