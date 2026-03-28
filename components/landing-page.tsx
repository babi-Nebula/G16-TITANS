"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const emergencyDoctors = [
  { name: "Dr. Hana Abebe", phone: "+251911223344", specialty: "Trauma & Anxiety" },
  { name: "Dr. Mohammed Yusuf", phone: "+251922334455", specialty: "Depression & Stress" },
  { name: "Dr. Saron Bekele", phone: "+251933445566", specialty: "Family Counseling" },
];

export default function LandingPage() {
  const [isAboutTransitioning, setIsAboutTransitioning] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const router = useRouter();

  function openAboutWithTransition(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (isAboutTransitioning) {
      return;
    }
    setIsAboutTransitioning(true);
    window.setTimeout(() => {
      router.push("/about");
    }, 280);
  }

  return (
    <div
      className={`relative flex min-h-screen flex-col bg-cover bg-center bg-no-repeat transition-opacity duration-300 ${
        isAboutTransitioning ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundImage: "url('/api/landing-image')" }}
    >
      <div className="absolute inset-0 bg-black/20" />

      <header className="relative z-20 border-b border-white/30 bg-white/35">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <p className="text-lg font-bold text-white drop-shadow">Mind Care</p>
          <nav className="flex items-center gap-2 rounded-xl border border-white/50 bg-white/45 px-2 py-1 text-sm font-medium text-slate-800">
            <Link href="/" className="rounded-lg px-3 py-1.5 hover:bg-white/70">
              Home
            </Link>
            <Link href="/patient" className="rounded-lg px-3 py-1.5 hover:bg-white/70">
              Patient Portal
            </Link>
            <a href="/about" onClick={openAboutWithTransition} className="rounded-lg px-3 py-1.5 hover:bg-white/70">
              About
            </a>
            <button
              type="button"
              onClick={() => setIsSosOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-rose-100 px-3 py-1.5 font-semibold text-rose-700 shadow-[0_0_0_0_rgba(225,29,72,0.7)] animate-pulse hover:bg-rose-200"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-600" />
              </span>
              ⚠ SOS
            </button>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 md:px-6 md:py-10">
        <section className="flex min-h-[calc(100vh-140px)] w-full flex-col justify-between p-5 md:p-8">
          <div>
          <h1 className="text-center text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)] md:text-6xl">
            Mind Care
          </h1>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/patient"
              className="rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:from-indigo-500 hover:via-blue-500 hover:to-cyan-400"
            >
              Book Appointment
            </Link>
            <a
              href="/about"
              onClick={openAboutWithTransition}
              className="rounded-full border border-indigo-200 bg-white/85 px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-white"
            >
              Learn More
            </a>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm">
              <p className="text-3xl font-bold text-indigo-700">24/7</p>
              <p className="text-sm text-slate-600">AI mental health check-ins</p>
            </article>
            <article className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm">
              <p className="text-3xl font-bold text-cyan-700">4 Languages</p>
              <p className="text-sm text-slate-600">English, Amharic, Oromo, Somali</p>
            </article>
            <article className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm">
              <p className="text-3xl font-bold text-fuchsia-700">Fast Booking</p>
              <p className="text-sm text-slate-600">M-Pesa payment simulation flow</p>
            </article>
          </div>
          </div>

          <section
            id="sos"
            className="mt-16 rounded-xl border border-rose-200 bg-rose-50/90 p-4 text-rose-900 shadow-lg"
          >
            <p className="text-sm font-semibold">⚠ SOS Emergency Support</p>
            <p className="mt-1 text-sm">
              For urgent help, use the SOS flow to alert support and follow immediate safety
              instructions.
            </p>
            <button
              type="button"
              onClick={() => setIsSosOpen(true)}
              className="mt-3 flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white animate-pulse hover:bg-rose-500"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
              </span>
              Open Doctor Call Options
            </button>
          </section>
        </section>

      </main>

      {isSosOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-rose-100 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-rose-800">Emergency Doctor Call Options</h2>
              <button
                type="button"
                onClick={() => setIsSosOpen(false)}
                aria-label="Close SOS popup"
                className="rounded-lg border border-slate-300 px-2 py-1 text-lg leading-none text-slate-700 hover:bg-slate-100"
              >
                ×
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Choose a doctor below and tap call immediately.
            </p>
            <div className="mt-4 space-y-3">
              {emergencyDoctors.map((doctor) => (
                <div
                  key={doctor.phone}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{doctor.name}</p>
                    <p className="text-xs text-slate-600">{doctor.specialty}</p>
                    <p className="text-xs text-slate-500">{doctor.phone}</p>
                  </div>
                  <a
                    href={`tel:${doctor.phone}`}
                    className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-500"
                  >
                    Call Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
