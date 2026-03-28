import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-6 py-12">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100/50 md:p-10">
        <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
          About MindCare Connect
        </p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
          AI & M-Pesa Mental Health Platform for Eastern Ethiopia
        </h1>
        <p className="mt-4 text-slate-700">
          MindCare Connect helps people access private and culturally inclusive mental
          health support through verified psychiatrists, secure chat, AI assistance, and
          emergency SOS workflows.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="font-semibold text-slate-900">What We Solve</h2>
            <p className="mt-2 text-sm text-slate-700">
              Limited specialist access, social stigma, travel burden, and payment friction
              for underserved communities.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="font-semibold text-slate-900">How We Help</h2>
            <p className="mt-2 text-sm text-slate-700">
              Verified provider discovery, appointment booking, M-Pesa simulation, and
              multilingual support in English, Amharic, Afaan Oromo, and Somali.
            </p>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full border border-blue-300 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Back to Home
          </Link>
          <Link
            href="/patient"
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Patient Portal
          </Link>
        </div>
      </div>
    </main>
  );
}
