"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div
      className="relative flex min-h-screen flex-col bg-cover bg-center bg-no-repeat text-slate-800"
      style={{ backgroundImage: "url('/api/landing-image')" }}
    >
      <div className="absolute inset-0 bg-white/35 backdrop-[brightness(0.92)]" />
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

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-10 md:py-14">
        <section className="rounded-3xl border border-white/60 bg-white/78 p-6 shadow-2xl shadow-blue-200/30 backdrop-blur-md md:p-10">
          <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-wide text-blue-800">
            AI + M-Pesa Mental Health Care
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            Mental health support that feels private, local, and accessible.
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-700 md:text-base">
            MindCare Connect helps people in Eastern Ethiopia quickly reach verified
            psychiatrists, pay with M-Pesa simulation, and get emergency SOS support when
            needed.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/auth"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Book Appointment
            </Link>
            <a
              href="#about"
              className="rounded-full border border-blue-300 bg-white/70 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50"
            >
              Learn More
            </a>
            <a
              href="#sos"
              className="rounded-full border border-rose-300 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              Emergency Help
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-blue-100 bg-white p-4">
              <p className="text-xl font-bold text-blue-700">24/7</p>
              <p className="text-xs text-slate-600">AI mental health check-ins</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-white p-4">
              <p className="text-xl font-bold text-blue-700">4 Languages</p>
              <p className="text-xs text-slate-600">English, Amharic, Oromo, Somali</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-white p-4">
              <p className="text-xl font-bold text-blue-700">Fast Booking</p>
              <p className="text-xs text-slate-600">M-Pesa payment simulation flow</p>
            </div>
          </div>
        </section>

        <section id="about" className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/70 bg-white/82 p-5 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-900">Why MindCare Connect</h2>
            <p className="mt-2 text-sm text-slate-700">
              The platform reduces stigma and travel barriers by making quality support
              available from home, with a smooth digital-first experience.
            </p>
          </article>
          <article
            id="sos"
            className="rounded-2xl border border-rose-200 bg-rose-50/92 p-5 shadow-lg backdrop-blur"
          >
            <h2 className="text-lg font-semibold text-rose-800">SOS Emergency Support</h2>
            <p className="mt-2 text-sm text-rose-900">
              One tap sends an emergency alert simulation and guides the user with
              immediate safety instructions.
            </p>
          </article>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/40 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 text-center text-sm text-blue-900 md:flex-row md:text-left">
          <p>MindCare Connect © {new Date().getFullYear()}</p>
          <p>AI & M-Pesa Mental Health Platform for Eastern Ethiopia</p>
        </div>
      </footer>
    </div>
  );
}
