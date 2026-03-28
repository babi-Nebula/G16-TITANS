"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { languageOptions } from "@/lib/i18n";
import { SupportedLanguage } from "@/lib/types";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (mode === "signup" && !fullName.trim()) {
      setError("Full name is required for signup.");
      return;
    }

    const userName = fullName.trim() || "Demo User";

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "mindcare-user",
        JSON.stringify({
          id: `user-${Date.now()}`,
          fullName: userName,
          phone,
          language,
          role: "user",
        }),
      );
    }

    router.push("/platform");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50 to-blue-50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/50 bg-white p-6 shadow-xl">
        <Link href="/" className="text-sm font-semibold text-blue-700">
          ← Back to landing page
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">MindCare Connect</h1>
        <p className="mt-1 text-sm text-slate-600">
          {mode === "signup" ? "Create your secure account" : "Log in to continue care"}
        </p>

        <div className="mt-5 inline-flex rounded-full bg-slate-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-full px-4 py-1.5 font-medium ${
              mode === "signup" ? "bg-white text-slate-900" : "text-slate-600"
            }`}
          >
            Signup
          </button>
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-full px-4 py-1.5 font-medium ${
              mode === "login" ? "bg-white text-slate-900" : "text-slate-600"
            }`}
          >
            Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === "signup" && (
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-700">Full Name</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Abdi Ahmed"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
              />
            </label>
          )}

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Phone Number</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+2519XXXXXXXX"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Preferred Language</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as SupportedLanguage)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
            >
              {languageOptions.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            {mode === "signup" ? "Create Account" : "Log In"}
          </button>
        </form>
      </div>
    </main>
  );
}
