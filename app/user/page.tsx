"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface UserSession {
  id: string;
  fullName: string;
  phone: string;
  language: string;
}

interface UserPaymentRequest {
  id: string;
  payerName: string;
  phoneNumber: string;
  amountEtb: number;
  merchantRequestId: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

const defaultUser: UserSession = {
  id: "guest-user",
  fullName: "Demo User",
  phone: "+251900000000",
  language: "en",
};

export default function UserPage() {
  const [user, setUser] = useState<UserSession>(defaultUser);
  const [amountEtb, setAmountEtb] = useState("5");
  const [isPaying, setIsPaying] = useState(false);
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState<UserPaymentRequest[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const raw = window.localStorage.getItem("mindcare-user");
    if (!raw) {
      return;
    }
    try {
      setUser(JSON.parse(raw) as UserSession);
    } catch {
      setUser(defaultUser);
    }
  }, []);

  useEffect(() => {
    void loadMyRequests();
  }, [user.phone]);

  async function loadMyRequests() {
    try {
      const response = await fetch("/api/payments/requests");
      const payload = (await response.json()) as {
        success: boolean;
        requests: UserPaymentRequest[];
      };
      const mine = (payload.requests ?? []).filter((request) => request.phoneNumber === user.phone);
      setRequests(mine);
    } catch {
      // Keep silent for initial empty state.
    }
  }

  async function handlePayWithMpesa() {
    setMessage("");
    const parsedAmount = Number(amountEtb);
    if (!parsedAmount || parsedAmount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    setIsPaying(true);
    try {
      const response = await fetch("/api/payments/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payerName: user.fullName,
          phoneNumber: user.phone,
          amountEtb: parsedAmount,
          accountReference: "Fast",
          transactionDesc: "Fast Payment",
        }),
      });
      const payload = (await response.json()) as {
        success: boolean;
        message?: string;
        error?: { errorMessage?: string };
      };
      if (!response.ok || !payload.success) {
        setMessage(
          payload.error?.errorMessage
            ? `${payload.message ?? "Payment request failed."} (${payload.error.errorMessage})`
            : (payload.message ?? "Payment request failed."),
        );
        return;
      }
      setMessage("M-Pesa payment request submitted. Admin can now approve or reject it.");
      setAmountEtb("5");
      await loadMyRequests();
    } catch {
      setMessage("Could not submit M-Pesa request.");
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-700">User Portal</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Welcome, {user.fullName}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Your account has been created successfully. You can now continue booking and
                support workflows.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Home
              </Link>
              <Link
                href="/psychiatrist"
                className="rounded-full border border-blue-300 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
              >
                Psychiatrist Portal
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">USER ID</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{user.id}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">PHONE</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{user.phone}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">LANGUAGE</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{user.language.toUpperCase()}</p>
          </article>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Next Steps</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>Browse available psychiatrists and choose a suitable specialist.</li>
            <li>Book your appointment and complete M-Pesa payment simulation.</li>
            <li>Use AI support and SOS options when urgent help is needed.</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Pay with M-Pesa</h2>
          <p className="mt-1 text-sm text-slate-600">
            Submit an M-Pesa STK push request using your account phone number.
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-700">Amount (ETB)</span>
              <input
                type="number"
                min="1"
                value={amountEtb}
                onChange={(event) => setAmountEtb(event.target.value)}
                className="w-44 rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
              />
            </label>
            <button
              type="button"
              disabled={isPaying}
              onClick={() => void handlePayWithMpesa()}
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:bg-green-300"
            >
              {isPaying ? "Submitting..." : "Pay with M-Pesa"}
            </button>
          </div>
          {message && (
            <p className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</p>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">My Payment Requests</h2>
          <div className="mt-3 space-y-3">
            {requests.length === 0 && (
              <p className="text-sm text-slate-600">No payment requests submitted yet.</p>
            )}
            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
              >
                <p className="text-sm font-semibold text-slate-900">ETB {request.amountEtb}</p>
                <p className="text-xs text-slate-600">
                  Merchant ID: {request.merchantRequestId} · Updated{" "}
                  {new Date(request.updatedAt).toLocaleString()}
                </p>
                <span
                  className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    request.status === "approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : request.status === "rejected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {request.status}
                </span>
                {request.status === "rejected" && request.rejectionReason && (
                  <p className="mt-2 rounded-lg bg-rose-50 p-2 text-xs text-rose-800">
                    Rejection reason: {request.rejectionReason}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
