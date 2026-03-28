"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type PaymentStatus = "pending" | "approved" | "rejected";

interface PaymentRequest {
  id: string;
  doctorName: string;
  amountEtb: number;
  requestDate: string;
  status: PaymentStatus;
  rejectionReason?: string;
}

const initialPaymentRequests: PaymentRequest[] = [
  {
    id: "pay-1001",
    doctorName: "Dr. Hana Abebe",
    amountEtb: 3200,
    requestDate: new Date().toISOString(),
    status: "pending",
  },
  {
    id: "pay-1002",
    doctorName: "Dr. Mohammed Yusuf",
    amountEtb: 2450,
    requestDate: new Date().toISOString(),
    status: "pending",
  },
  {
    id: "pay-1003",
    doctorName: "Dr. Saron Bekele",
    amountEtb: 2800,
    requestDate: new Date().toISOString(),
    status: "approved",
  },
];

export default function AdminPaymentRequestsPage() {
  const [requests, setRequests] = useState<PaymentRequest[]>(initialPaymentRequests);
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const pendingCount = useMemo(
    () => requests.filter((request) => request.status === "pending").length,
    [requests],
  );

  function updateStatus(id: string, status: PaymentStatus, rejectionReason?: string) {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
              requestDate: new Date().toISOString(),
              rejectionReason: status === "rejected" ? rejectionReason : undefined,
            }
          : request,
      ),
    );
  }

  function openRejectModal(requestId: string) {
    setRejectingRequestId(requestId);
    setRejectReason("");
    setRejectError("");
  }

  function closeRejectModal() {
    setRejectingRequestId(null);
    setRejectReason("");
    setRejectError("");
  }

  function submitRejectReason() {
    if (!rejectingRequestId) {
      return;
    }
    if (!rejectReason.trim()) {
      setRejectError("Please write a rejection reason.");
      return;
    }
    updateStatus(rejectingRequestId, "rejected", rejectReason.trim());
    closeRejectModal();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-700">Admin · Payments</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Payment Requests
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Only payment requests appear on this page. Approve or reject each request.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                Total: {requests.length}
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                Pending: {pendingCount}
              </span>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3 lg:sticky lg:top-6 lg:h-fit">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Admin Menu</h2>
            <nav className="mt-3 space-y-2 text-sm">
              <Link
                href="/admin"
                className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Doctor Directory
              </Link>
              <Link
                href="/admin/payment-requests"
                className="block rounded-xl bg-blue-50 px-3 py-2 font-semibold text-blue-700"
              >
                Payment Requests
              </Link>
              <Link
                href="/admin"
                className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Open Doctor Directory
              </Link>
              <Link
                href="/"
                className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Back Home
              </Link>
            </nav>
          </aside>

          <section className="space-y-3 lg:col-span-9">
            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{request.doctorName}</p>
                    <p className="text-xs text-slate-600">
                      Request ID: {request.id} · Updated{" "}
                      {new Date(request.requestDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">ETB {request.amountEtb}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        request.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : request.status === "rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(request.id, "approved")}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => openRejectModal(request.id)}
                    className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-100"
                  >
                    Reject
                  </button>
                </div>

                {request.status === "rejected" && request.rejectionReason && (
                  <p className="mt-3 rounded-lg bg-rose-50 p-2 text-xs text-rose-900">
                    Rejection reason: {request.rejectionReason}
                  </p>
                )}
              </article>
            ))}
          </section>
        </div>

        {rejectingRequestId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">
                  Reject Payment Request (Admin)
                </h3>
                <button
                  type="button"
                  onClick={closeRejectModal}
                  aria-label="Close reject reason popup"
                  className="rounded-lg border border-slate-300 px-2 py-1 text-lg leading-none text-slate-700 hover:bg-slate-100"
                >
                  ×
                </button>
              </div>
              <p className="mb-2 text-sm text-slate-600">
                As admin, write the rejection reason before rejecting this request.
              </p>
              <textarea
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                rows={4}
                placeholder="Write rejection reason..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
              />
              {rejectError && (
                <p className="mt-2 rounded-lg bg-rose-50 p-2 text-xs text-rose-800">{rejectError}</p>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={submitRejectReason}
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                >
                  Submit Rejection
                </button>
                <button
                  type="button"
                  onClick={closeRejectModal}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="border-t border-blue-100 bg-white/85 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 text-sm text-slate-700">
            <p>MindCare Connect Admin © {new Date().getFullYear()}</p>
            <div className="flex gap-2">
              <Link
                href="/admin"
                className="rounded-full border border-blue-300 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
              >
                Back to Admin
              </Link>
              <Link
                href="/"
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Home
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
