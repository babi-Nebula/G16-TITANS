"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-white via-blue-50/40 to-sky-50 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-white/30 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <p className="text-lg font-semibold text-blue-700">MindCare Connect</p>
          <nav className="flex items-center gap-4 text-sm font-medium md:gap-6">
            <Link href="/">Home</Link>
            <a href="#about">About</a>
            <Link href="/auth">Book Now</Link>
          </nav>
          <Link
            href="#sos"
            className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 sm:inline-flex"
          >
            SOS
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16" />
    </div>
  );
}
