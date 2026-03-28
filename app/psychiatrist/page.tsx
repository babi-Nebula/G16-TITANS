"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type AppointmentStatus = "scheduled" | "completed" | "cancelled";
type PaymentRequestStatus = "pending" | "approved" | "rejected";

interface Patient {
  id: string;
  fullName: string;
  age: number;
  concern: string;
  phoneNumber: string;
  isAvailable: boolean;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

interface PaymentRequest {
  id: string;
  patientName: string;
  amountEtb: number;
  createdAt: string;
  status: PaymentRequestStatus;
  rejectionReason?: string;
}

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  text: string;
}

const initialPatients: Patient[] = [
  {
    id: "pat-1",
    fullName: "Ayan Ahmed",
    age: 22,
    concern: "Anxiety and sleep issues",
    phoneNumber: "+251912000111",
    isAvailable: true,
  },
  {
    id: "pat-2",
    fullName: "Kedir Hassan",
    age: 31,
    concern: "Work-related stress",
    phoneNumber: "+251913222333",
    isAvailable: true,
  },
  {
    id: "pat-3",
    fullName: "Samiya Nur",
    age: 27,
    concern: "Low mood and isolation",
    phoneNumber: "+251914444555",
    isAvailable: false,
  },
];

const initialAppointments: Appointment[] = [
  {
    id: "app-1",
    patientId: "pat-1",
    patientName: "Ayan Ahmed",
    date: "2026-03-30",
    time: "10:00",
    status: "scheduled",
  },
  {
    id: "app-2",
    patientId: "pat-2",
    patientName: "Kedir Hassan",
    date: "2026-03-29",
    time: "14:00",
    status: "scheduled",
  },
];

const initialPaymentRequests: PaymentRequest[] = [
  {
    id: "preq-1",
    patientName: "General payout request",
    amountEtb: 800,
    createdAt: new Date().toISOString(),
    status: "pending",
  },
  {
    id: "preq-2",
    patientName: "General payout request",
    amountEtb: 1200,
    createdAt: new Date().toISOString(),
    status: "rejected",
    rejectionReason: "Session notes were incomplete. Please update records and re-submit.",
  },
];

export default function PsychiatristPage() {
  const [patients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(
    initialPaymentRequests,
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [appointmentPatient, setAppointmentPatient] = useState<Patient | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("09:00");

  const [paymentAmount, setPaymentAmount] = useState("800");

  const [message, setMessage] = useState("");
  const notifiedPaymentRef = useRef<Set<string>>(new Set());
  const remindedAppointmentRef = useRef<Set<string>>(new Set());

  const availablePatients = useMemo(
    () => patients.filter((patient) => patient.isAvailable),
    [patients],
  );
  const approvedBalanceEtb = useMemo(
    () =>
      paymentRequests
        .filter((request) => request.status === "approved")
        .reduce((sum, request) => sum + request.amountEtb, 0),
    [paymentRequests],
  );
  const pendingAmountEtb = useMemo(
    () =>
      paymentRequests
        .filter((request) => request.status === "pending")
        .reduce((sum, request) => sum + request.amountEtb, 0),
    [paymentRequests],
  );
  const rejectedAmountEtb = useMemo(
    () =>
      paymentRequests
        .filter((request) => request.status === "rejected")
        .reduce((sum, request) => sum + request.amountEtb, 0),
    [paymentRequests],
  );

  const pushToast = useCallback((type: ToastMessage["type"], text: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    paymentRequests.forEach((request) => {
      if (request.status === "pending" || notifiedPaymentRef.current.has(request.id)) {
        return;
      }
      if (request.status === "approved") {
        pushToast(
          "success",
          `Admin approved your payment request (${request.id}) for ETB ${request.amountEtb}.`,
        );
      } else if (request.status === "rejected") {
        pushToast(
          "error",
          `Admin rejected payment request (${request.id}). Check the rejection reason.`,
        );
      }
      notifiedPaymentRef.current.add(request.id);
    });
  }, [paymentRequests, pushToast]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const now = Date.now();
      appointments.forEach((appointment) => {
        if (
          appointment.status !== "scheduled" ||
          remindedAppointmentRef.current.has(appointment.id)
        ) {
          return;
        }
        const dueTimestamp = new Date(`${appointment.date}T${appointment.time}:00`).getTime();
        const diffMs = dueTimestamp - now;

        if (diffMs > 0 && diffMs <= 5 * 60 * 1000) {
          pushToast(
            "info",
            `Appointment with ${appointment.patientName} starts in 5 minutes.`,
          );
          remindedAppointmentRef.current.add(appointment.id);
        }
      });
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [appointments, pushToast]);

  function createAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!appointmentPatient) {
      setMessage("Please choose a patient profile first.");
      return;
    }
    if (!appointmentDate) {
      setMessage("Please choose appointment date.");
      return;
    }

    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      patientId: appointmentPatient.id,
      patientName: appointmentPatient.fullName,
      date: appointmentDate,
      time: appointmentTime,
      status: "scheduled",
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setMessage(`Appointment created for ${appointmentPatient.fullName}.`);
    pushToast("success", `New appointment scheduled for ${appointmentPatient.fullName}.`);
    setAppointmentDate("");
    setAppointmentTime("09:00");
    setAppointmentPatient(null);
    setIsAppointmentModalOpen(false);
  }

  function requestPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const parsedAmount = Number(paymentAmount);
    if (!parsedAmount || parsedAmount <= 0) {
      setMessage("Please enter a valid payment amount.");
      return;
    }

    const newRequest: PaymentRequest = {
      id: `preq-${Date.now()}`,
      patientName: "General payout request",
      amountEtb: parsedAmount,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    setPaymentRequests((prev) => [newRequest, ...prev]);
    setMessage("Payment request sent to admin.");
    setPaymentAmount("800");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {toasts.length > 0 && (
          <div className="fixed right-4 top-4 z-50 space-y-2">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`w-80 rounded-xl border px-3 py-2 text-sm shadow-lg ${
                  toast.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : toast.type === "error"
                      ? "border-rose-200 bg-rose-50 text-rose-900"
                      : "border-blue-200 bg-blue-50 text-blue-900"
                }`}
              >
                {toast.text}
              </div>
            ))}
          </div>
        )}

        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-700">Psychiatrist Portal</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Appointments, Patients, and Payment Requests
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage your schedule, assign appointments, view available patients, and request
                payments from admin.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin"
                className="rounded-full border border-blue-300 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
              >
                Admin
              </Link>
              <Link
                href="/"
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Home
              </Link>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
              <p className="text-xs font-semibold text-emerald-700">Available Balance</p>
              <p className="mt-1 text-xl font-bold text-emerald-900">ETB {approvedBalanceEtb}</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3">
              <p className="text-xs font-semibold text-amber-700">Pending Requests</p>
              <p className="mt-1 text-xl font-bold text-amber-900">ETB {pendingAmountEtb}</p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3">
              <p className="text-xs font-semibold text-rose-700">Rejected Amount</p>
              <p className="mt-1 text-xl font-bold text-rose-900">ETB {rejectedAmountEtb}</p>
            </div>
          </div>
        </section>

        {message && (
          <p className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {message}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3 lg:sticky lg:top-6 lg:h-fit">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
              Psychiatrist Menu
            </h2>
            <nav className="mt-3 space-y-2 text-sm">
              <a
                href="#available-patients"
                className="block rounded-xl bg-blue-50 px-3 py-2 font-semibold text-blue-700"
              >
                Make Appointment
              </a>
              <a
                href="#my-appointments"
                className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
              >
                My Appointments
              </a>
              <a
                href="#available-patients"
                className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Available Patients
              </a>
              <a
                href="#request-payment"
                className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Request Payment (Admin)
              </a>
              <a
                href="#submitted-payments"
                className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Admin Payment Decisions
              </a>
            </nav>
          </aside>

          <section className="space-y-6 lg:col-span-9">
        <section className="grid gap-6 lg:grid-cols-1">
          <article
            id="request-payment"
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">Request Payment from Admin</h2>
            <p className="mt-1 text-xs text-slate-600">
              This request is reviewed by admin on the Payment Requests page.
            </p>
            <form onSubmit={requestPayment} className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Amount (ETB)</span>
                <input
                  type="number"
                  min="1"
                  value={paymentAmount}
                  onChange={(event) => setPaymentAmount(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                />
              </label>

              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Send Request to Admin
              </button>
            </form>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article
            id="my-appointments"
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">My Appointments</h2>
            <div className="mt-4 space-y-3">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="font-semibold text-slate-900">{appointment.patientName}</p>
                  <p className="text-sm text-slate-600">
                    {appointment.date} at {appointment.time}
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      appointment.status === "scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : appointment.status === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article
            id="available-patients"
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">Available Patients</h2>
            <p className="mt-1 text-xs text-slate-600">
              Click a patient profile to open the appointment popup.
            </p>
            <div className="mt-4 space-y-3">
              {availablePatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => {
                    setAppointmentPatient(patient);
                    setIsAppointmentModalOpen(true);
                  }}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <p className="font-semibold text-slate-900">{patient.fullName}</p>
                  <p className="text-sm text-slate-600">
                    Age {patient.age} · {patient.concern}
                  </p>
                  <p className="text-sm text-slate-600">Phone: {patient.phoneNumber}</p>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setAppointmentPatient(patient);
                      setIsAppointmentModalOpen(true);
                    }}
                    className="mt-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                  >
                    Make Appointment
                  </button>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section
          id="submitted-payments"
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">Admin Payment Decisions</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {paymentRequests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">{request.patientName}</p>
                <p className="text-sm text-slate-600">ETB {request.amountEtb}</p>
                <p className="text-xs text-slate-500">
                  Submitted: {new Date(request.createdAt).toLocaleString()}
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
                  <p className="mt-2 rounded-lg bg-rose-50 p-2 text-xs text-rose-900">
                    Admin rejection reason: {request.rejectionReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
          </section>
        </div>

        <footer className="border-t border-blue-100 bg-white/85 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 text-sm text-slate-700">
            <p>MindCare Connect Psychiatrist © {new Date().getFullYear()}</p>
            <p>Appointments · Patients · Payment Requests</p>
          </div>
        </footer>
      </div>

      {isAppointmentModalOpen && appointmentPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Make Appointment</h3>
              <button
                type="button"
                onClick={() => {
                  setIsAppointmentModalOpen(false);
                  setAppointmentPatient(null);
                }}
                aria-label="Close appointment popup"
                className="rounded-lg border border-slate-300 px-2 py-1 text-lg leading-none text-slate-700 hover:bg-slate-100"
              >
                ×
              </button>
            </div>
            <p className="text-sm font-medium text-slate-900">{appointmentPatient.fullName}</p>
            <p className="text-xs text-slate-600">{appointmentPatient.concern}</p>

            <form onSubmit={createAppointment} className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Date</span>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(event) => setAppointmentDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Time</span>
                <select
                  value={appointmentTime}
                  onChange={(event) => setAppointmentTime(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                >
                  <option value="09:00">09:00</option>
                  <option value="11:00">11:00</option>
                  <option value="14:00">14:00</option>
                  <option value="16:00">16:00</option>
                </select>
              </label>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Make Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
