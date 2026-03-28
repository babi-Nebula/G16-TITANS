"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DoctorCard from "@/components/doctor-card";
import PlatformNav from "@/components/platform-nav";
import { psychiatrists } from "@/lib/data";
import { getCopy } from "@/lib/i18n";
import { AppUser, SupportedLanguage } from "@/lib/types";

type ChatMessage = { id: string; role: "user" | "doctor" | "assistant"; text: string };

const defaultUser: AppUser = {
  id: "demo-user",
  fullName: "Demo User",
  phone: "+251900000000",
  language: "en",
  role: "user",
};

export default function PlatformPage() {
  const [user, setUser] = useState<AppUser>(defaultUser);
  const [selectedDoctorId, setSelectedDoctorId] = useState(psychiatrists[0].id);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("09:00");
  const [bookingMessage, setBookingMessage] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "c1", role: "doctor", text: "Welcome. How can I support you today?" },
  ]);

  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState<ChatMessage[]>([
    { id: "a1", role: "assistant", text: "I am here to listen. What are you feeling now?" },
  ]);
  const [isGeneratingAssistantReply, setIsGeneratingAssistantReply] = useState(false);

  const [sosStatus, setSosStatus] = useState("");
  const [isSendingSos, setIsSendingSos] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const raw = window.localStorage.getItem("mindcare-user");
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as AppUser;
      setUser(parsed);
    } catch {
      setUser(defaultUser);
    }
  }, []);

  const selectedDoctor = useMemo(
    () => psychiatrists.find((doctor) => doctor.id === selectedDoctorId) ?? psychiatrists[0],
    [selectedDoctorId],
  );

  const localizedCopy = getCopy(user.language as SupportedLanguage);

  async function handlePayAndConfirm() {
    setBookingMessage("");
    if (!appointmentDate) {
      setBookingMessage("Please choose an appointment date before payment.");
      return;
    }

    setIsPaying(true);
    try {
      const response = await fetch("/api/payments/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: user.phone,
          amountEtb: selectedDoctor.consultationFeeEtb,
          psychiatristId: selectedDoctor.id,
          appointmentDate,
          appointmentTime,
        }),
      });

      const payload = (await response.json()) as { success: boolean; message: string };

      if (!payload.success) {
        setBookingMessage(payload.message);
        return;
      }

      setBookingMessage(localizedCopy.payment);
    } catch {
      setBookingMessage("Payment simulation failed. Please try again.");
    } finally {
      setIsPaying(false);
    }
  }

  function handleChatSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!chatInput.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `c-${Date.now()}`,
      role: "user",
      text: chatInput.trim(),
    };
    const doctorReply: ChatMessage = {
      id: `d-${Date.now()}`,
      role: "doctor",
      text: "Thank you for sharing. Let's explore one coping step for this week.",
    };

    setChatMessages((prev) => [...prev, userMessage, doctorReply]);
    setChatInput("");
  }

  async function handleAssistantSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assistantInput.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `a-user-${Date.now()}`,
      role: "user",
      text: assistantInput.trim(),
    };

    setAssistantMessages((prev) => [...prev, userMessage]);
    setAssistantInput("");
    setIsGeneratingAssistantReply(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text, language: user.language }),
      });
      const payload = (await response.json()) as { reply: string };

      setAssistantMessages((prev) => [
        ...prev,
        { id: `a-bot-${Date.now()}`, role: "assistant", text: payload.reply },
      ]);
    } catch {
      setAssistantMessages((prev) => [
        ...prev,
        {
          id: `a-fallback-${Date.now()}`,
          role: "assistant",
          text: "I hear you. Please take three deep breaths and consider booking a session for personalized support.",
        },
      ]);
    } finally {
      setIsGeneratingAssistantReply(false);
    }
  }

  async function handleSos() {
    setSosStatus("");
    setIsSendingSos(true);
    try {
      const response = await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: user.fullName,
          phoneNumber: user.phone,
          language: user.language,
        }),
      });
      const payload = (await response.json()) as { success: boolean; message: string };
      setSosStatus(payload.message || localizedCopy.emergency);
    } catch {
      setSosStatus(localizedCopy.emergency);
    } finally {
      setIsSendingSos(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <button
        type="button"
        onClick={handleSos}
        disabled={isSendingSos}
        className="fixed left-4 top-4 z-30 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-rose-500 disabled:bg-rose-300 md:text-sm"
      >
        {isSendingSos ? "Sending SOS..." : "SOS Call"}
      </button>
      <PlatformNav userName={user.fullName} />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 md:px-6">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Care Dashboard</h1>
              <p className="text-sm text-slate-600">{localizedCopy.tagline}</p>
            </div>
            <Link
              href="/"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              View Landing Page
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Verified Psychiatrist Directory</h2>
            <div className="mt-4 space-y-3">
              {psychiatrists.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  selected={doctor.id === selectedDoctor.id}
                  onSelect={setSelectedDoctorId}
                />
              ))}
            </div>
          </article>

          <article id="booking" className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Booking and M-Pesa Payment</h2>
            <p className="mt-1 text-sm text-slate-600">
              Selected psychiatrist: <strong>{selectedDoctor.fullName}</strong>
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block font-medium text-slate-700">Date</span>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(event) => setAppointmentDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-medium text-slate-700">Time</span>
                <select
                  value={appointmentTime}
                  onChange={(event) => setAppointmentTime(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                >
                  <option value="09:00">09:00</option>
                  <option value="11:00">11:00</option>
                  <option value="14:00">14:00</option>
                  <option value="16:00">16:00</option>
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={handlePayAndConfirm}
              disabled={isPaying}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isPaying
                ? "Processing STK Push simulation..."
                : `Pay with M-Pesa (ETB ${selectedDoctor.consultationFeeEtb})`}
            </button>

            {bookingMessage && (
              <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                {bookingMessage}
              </p>
            )}
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Secure Chat</h2>
            <div className="mt-4 h-64 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "ml-auto bg-blue-100 text-blue-900"
                      : "bg-white text-slate-700"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} className="mt-3 flex gap-2">
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Type a private message..."
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Send
              </button>
            </form>
          </article>

          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">AI Mental Health Assistant</h2>
            <p className="mt-1 text-sm text-slate-600">{localizedCopy.assistantPrompt}</p>
            <div className="mt-4 h-64 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-sky-50/40 p-3">
              {assistantMessages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "ml-auto bg-white text-slate-800"
                      : "bg-sky-100 text-sky-900"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleAssistantSubmit} className="mt-3 flex gap-2">
              <input
                value={assistantInput}
                onChange={(event) => setAssistantInput(event.target.value)}
                placeholder="Share how you feel..."
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={isGeneratingAssistantReply}
                className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:bg-blue-400"
              >
                {isGeneratingAssistantReply ? "Thinking..." : "Ask AI"}
              </button>
            </form>
          </article>
        </section>

        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-rose-900">SOS Emergency Support</h2>
          <p className="mt-1 text-sm text-rose-800">
            If you are in immediate distress, send an alert for emergency follow-up.
          </p>
          <button
            type="button"
            onClick={handleSos}
            disabled={isSendingSos}
            className="mt-4 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:bg-rose-300"
          >
            {isSendingSos ? "Sending SOS..." : "Trigger SOS Alert"}
          </button>
          {sosStatus && (
            <p className="mt-3 rounded-lg bg-white/80 p-3 text-sm text-rose-900">{sosStatus}</p>
          )}
        </section>
      </main>
    </div>
  );
}
