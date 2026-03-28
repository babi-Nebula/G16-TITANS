"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { psychiatrists } from "@/lib/data";
import { Psychiatrist } from "@/lib/types";

interface PatientProfile {
  id: string;
  fullName: string;
  email: string;
  age: number;
  isAnonymous: boolean;
  authProvider: "manual" | "google";
}

interface PatientAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  feeEtb: number;
  paymentStatus: "pending" | "paid" | "failed";
}

const storageProfileKey = "mindcare-patient-profile";
const storageAppointmentsKey = "mindcare-patient-appointments";

export default function PatientPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);

  const [selectedDoctor, setSelectedDoctor] = useState<Psychiatrist | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("09:00");
  const [mpesaPhone, setMpesaPhone] = useState("+251900000000");

  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sortedDoctors = useMemo(
    () => [...psychiatrists].sort((a, b) => b.rating - a.rating),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const rawProfile = window.localStorage.getItem(storageProfileKey);
    const rawAppointments = window.localStorage.getItem(storageAppointmentsKey);

    if (rawProfile) {
      try {
        setPatientProfile(JSON.parse(rawProfile) as PatientProfile);
      } catch {
        setPatientProfile(null);
      }
    }

    if (rawAppointments) {
      try {
        setAppointments(JSON.parse(rawAppointments) as PatientAppointment[]);
      } catch {
        setAppointments([]);
      }
    }
  }, []);

  function persistAppointments(next: PatientAppointment[]) {
    setAppointments(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageAppointmentsKey, JSON.stringify(next));
    }
  }

  function saveProfile(profile: PatientProfile) {
    setPatientProfile(profile);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageProfileKey, JSON.stringify(profile));
    }
  }

  function handleManualSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    const parsedAge = Number(age);
    if (!parsedAge || parsedAge < 1) {
      setError("Please enter a valid age.");
      return;
    }

    if (!isAnonymous && !fullName.trim()) {
      setError("Full name is required unless anonymous is selected.");
      return;
    }

    const profile: PatientProfile = {
      id: `patient-${Date.now()}`,
      fullName: isAnonymous ? "Anonymous Patient" : fullName.trim(),
      email: email.trim().toLowerCase(),
      age: parsedAge,
      isAnonymous,
      authProvider: "manual",
    };

    saveProfile(profile);
    setMessage("Patient account created. You can now select a doctor and book an appointment.");
  }

  function handleGoogleSignup() {
    setMessage("");
    setError("");

    const profile: PatientProfile = {
      id: `patient-google-${Date.now()}`,
      fullName: "Google User",
      email: `google-user-${Date.now()}@gmail.com`,
      age: 25,
      isAnonymous: false,
      authProvider: "google",
    };

    saveProfile(profile);
    setMessage("Signed up with Google successfully. You can now book an appointment.");
  }

  async function handleBookAndPay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!patientProfile) {
      setError("Please complete signup first.");
      return;
    }

    if (!selectedDoctor) {
      setError("Please select a doctor.");
      return;
    }

    if (!appointmentDate) {
      setError("Please choose appointment date.");
      return;
    }

    if (!mpesaPhone.trim()) {
      setError("M-Pesa phone number is required for payment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const paymentResponse = await fetch("/api/payments/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payerName: patientProfile.fullName,
          phoneNumber: mpesaPhone.trim(),
          amountEtb: selectedDoctor.consultationFeeEtb,
          accountReference: selectedDoctor.fullName,
          transactionDesc: `Appointment with ${selectedDoctor.fullName}`,
        }),
      });

      const paymentPayload = (await paymentResponse.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!paymentResponse.ok || !paymentPayload.success) {
        setError(paymentPayload.message ?? "Payment failed. Appointment was not created.");
        return;
      }

      const newAppointment: PatientAppointment = {
        id: `apt-${Date.now()}`,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.fullName,
        appointmentDate,
        appointmentTime,
        feeEtb: selectedDoctor.consultationFeeEtb,
        paymentStatus: "paid",
      };

      const nextAppointments = [newAppointment, ...appointments];
      persistAppointments(nextAppointments);
      setAppointmentDate("");
      setAppointmentTime("09:00");
      setSelectedDoctor(null);
      setMessage("Appointment booked and payment request submitted successfully.");
    } catch {
      setError("Could not reach payment service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-700">Patient Portal</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Signup, Choose Doctor, Book Appointment, and Pay
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Create your patient profile, browse doctors, select one specialist, and complete
                payment to confirm your booking.
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

        {message && (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </p>
        )}

        {error && (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Patient Signup</h2>
            <p className="mt-1 text-sm text-slate-600">
              Full name is optional if you choose anonymous mode.
            </p>

            <form onSubmit={handleManualSignup} className="mt-4 space-y-3">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(event) => setIsAnonymous(event.target.checked)}
                />
                Signup as anonymous patient
              </label>

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">
                  Full Name {isAnonymous ? "(optional)" : ""}
                </span>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder={isAnonymous ? "Anonymous mode enabled" : "Abdi Ahmed"}
                  disabled={isAnonymous}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring disabled:bg-slate-100"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Age</span>
                <input
                  type="number"
                  min="1"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  placeholder="24"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Create Patient Account
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Continue with Google
            </button>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Book Appointment and Pay</h2>
            <p className="mt-1 text-sm text-slate-600">
              Select a doctor first, then set date/time and complete payment.
            </p>

            {patientProfile ? (
              <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm">
                <p className="font-semibold text-slate-900">{patientProfile.fullName}</p>
                <p className="text-slate-700">{patientProfile.email}</p>
                <p className="text-slate-700">Age: {patientProfile.age}</p>
                <p className="text-xs text-slate-500">
                  Auth provider:{" "}
                  {patientProfile.authProvider === "google" ? "Google signup" : "Manual signup"}
                </p>
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Signup is required before appointment booking.
              </p>
            )}

            <form onSubmit={handleBookAndPay} className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">Selected Doctor</span>
                <input
                  value={
                    selectedDoctor
                      ? `${selectedDoctor.fullName} (ETB ${selectedDoctor.consultationFeeEtb})`
                      : ""
                  }
                  readOnly
                  placeholder="Select a doctor from the list below"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-700"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Appointment Date</span>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(event) => setAppointmentDate(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Appointment Time</span>
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
              </div>

              <label className="block text-sm">
                <span className="mb-1 block font-medium text-slate-700">M-Pesa Phone Number</span>
                <input
                  value={mpesaPhone}
                  onChange={(event) => setMpesaPhone(event.target.value)}
                  placeholder="+2519XXXXXXXX"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:bg-emerald-300"
              >
                {isSubmitting ? "Processing payment..." : "Book Appointment and Pay"}
              </button>
            </form>
          </article>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Doctors List</h2>
          <p className="mt-1 text-sm text-slate-600">
            Browse all available doctors and select one for your appointment.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {sortedDoctors.map((doctor) => (
              <article
                key={doctor.id}
                className={`rounded-2xl border p-4 ${
                  selectedDoctor?.id === doctor.id
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{doctor.fullName}</h3>
                    <p className="text-sm text-slate-700">{doctor.specialty}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    ⭐ {doctor.rating}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-700">{doctor.bio}</p>

                <div className="mt-3 grid gap-1 text-sm text-slate-700">
                  <p>Experience: {doctor.yearsExperience} years</p>
                  <p>Location: {doctor.location}</p>
                  <p>Languages: {doctor.languages.map((item) => item.toUpperCase()).join(", ")}</p>
                  <p className="font-semibold text-slate-900">Consultation Fee: ETB {doctor.consultationFeeEtb}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDoctor(doctor)}
                  className="mt-3 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  {selectedDoctor?.id === doctor.id ? "Selected" : "Select Doctor"}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">My Appointments</h2>
          <div className="mt-3 space-y-3">
            {appointments.length === 0 && (
              <p className="text-sm text-slate-600">No appointments yet.</p>
            )}
            {appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
              >
                <p className="text-sm font-semibold text-slate-900">{appointment.doctorName}</p>
                <p className="text-xs text-slate-600">
                  {appointment.appointmentDate} at {appointment.appointmentTime}
                </p>
                <p className="text-xs text-slate-600">Fee: ETB {appointment.feeEtb}</p>
                <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                  {appointment.paymentStatus}
                </span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
