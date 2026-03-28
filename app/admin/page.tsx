"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type AccountStatus = "active" | "suspended";

interface DoctorRecord {
  id: string;
  name: string;
  username: string;
  password: string;
  profilePhoto: string;
  documentPhoto: string;
  phoneNumber: string;
  nationalIdNumber: string;
  nationalIdDocumentPhoto: string;
  specialty: string;
  accountStatus: AccountStatus;
  isOnline: boolean;
  updatedAt: string;
}

interface DoctorFormState {
  name: string;
  username: string;
  password: string;
  profilePhoto: string;
  documentPhoto: string;
  phoneNumber: string;
  nationalIdNumber: string;
  nationalIdDocumentPhoto: string;
  specialty: string;
  isOnline: boolean;
}

const initialDoctors: DoctorRecord[] = [
  {
    id: "doc-1",
    name: "Dr. Hana Abebe",
    username: "hana.abebe",
    password: "Hana@12345",
    profilePhoto: "/globe.svg",
    documentPhoto: "/file.svg",
    phoneNumber: "+251911223344",
    nationalIdNumber: "ET-HA-983217",
    nationalIdDocumentPhoto: "/file.svg",
    specialty: "Trauma & Anxiety",
    accountStatus: "active",
    isOnline: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "doc-2",
    name: "Dr. Mohammed Yusuf",
    username: "mohammed.yusuf",
    password: "Mohammed@12345",
    profilePhoto: "/globe.svg",
    documentPhoto: "/file.svg",
    phoneNumber: "+251922334455",
    nationalIdNumber: "ET-MY-120987",
    nationalIdDocumentPhoto: "/file.svg",
    specialty: "Depression & Stress Disorders",
    accountStatus: "active",
    isOnline: false,
    updatedAt: new Date().toISOString(),
  },
];

const emptyForm: DoctorFormState = {
  name: "",
  username: "",
  password: "",
  profilePhoto: "",
  documentPhoto: "",
  phoneNumber: "",
  nationalIdNumber: "",
  nationalIdDocumentPhoto: "",
  specialty: "",
  isOnline: false,
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function AdminPage() {
  const [doctors, setDoctors] = useState<DoctorRecord[]>(initialDoctors);
  const [form, setForm] = useState<DoctorFormState>(emptyForm);
  const [editForm, setEditForm] = useState<DoctorFormState>(emptyForm);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const onlineCount = useMemo(
    () => doctors.filter((doctor) => doctor.isOnline).length,
    [doctors],
  );
  const suspendedCount = useMemo(
    () => doctors.filter((doctor) => doctor.accountStatus === "suspended").length,
    [doctors],
  );

  function updateField<K extends keyof DoctorFormState>(key: K, value: DoctorFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateEditField<K extends keyof DoctorFormState>(
    key: K,
    value: DoctorFormState[K],
  ) {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePhotoUpload(
    event: ChangeEvent<HTMLInputElement>,
    target: "profilePhoto" | "documentPhoto" | "nationalIdDocumentPhoto",
  ) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    updateField(target, dataUrl);
  }

  async function handleEditPhotoUpload(
    event: ChangeEvent<HTMLInputElement>,
    target: "profilePhoto" | "documentPhoto" | "nationalIdDocumentPhoto",
  ) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    updateEditField(target, dataUrl);
  }

  function resetForm() {
    setForm(emptyForm);
  }

  function closeEditModal() {
    setEditingDoctorId(null);
    setEditForm(emptyForm);
  }

  function openAddModal() {
    setForm(emptyForm);
    setIsAddModalOpen(true);
  }

  function closeAddModal() {
    setIsAddModalOpen(false);
    setForm(emptyForm);
  }

  function handleSuspendDoctor(id: string) {
    setDoctors((prev) =>
      prev.map((doctor) => {
        if (doctor.id !== id) {
          return doctor;
        }
        const willSuspend = doctor.accountStatus !== "suspended";
        return {
          ...doctor,
          accountStatus: willSuspend ? "suspended" : "active",
          isOnline: willSuspend ? false : doctor.isOnline,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
    setMessage("Doctor status updated.");
  }

  function handleRemoveDoctor(id: string) {
    const target = doctors.find((doctor) => doctor.id === id);
    if (!target) {
      return;
    }
    const approved = window.confirm(`Remove ${target.name} from the doctor directory?`);
    if (!approved) {
      return;
    }
    setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));
    if (editingDoctorId === id) {
      closeEditModal();
    }
    setMessage("Doctor removed successfully.");
  }

  function startEdit(doctor: DoctorRecord) {
    setEditForm({
      name: doctor.name,
      username: doctor.username,
      password: doctor.password,
      profilePhoto: doctor.profilePhoto,
      documentPhoto: doctor.documentPhoto,
      phoneNumber: doctor.phoneNumber,
      nationalIdNumber: doctor.nationalIdNumber,
      nationalIdDocumentPhoto: doctor.nationalIdDocumentPhoto,
      specialty: doctor.specialty,
      isOnline: doctor.isOnline,
    });
    setEditingDoctorId(doctor.id);
    setMessage(`Editing profile: ${doctor.name}`);
  }

  function validateForm(targetForm: DoctorFormState) {
    if (!targetForm.name.trim()) return "Name is required.";
    if (!targetForm.username.trim()) return "Username is required.";
    if (!targetForm.password.trim()) return "Password is required.";
    if (!targetForm.phoneNumber.trim()) return "Phone number is required.";
    if (!targetForm.nationalIdNumber.trim()) return "National ID number is required.";
    if (!targetForm.specialty.trim()) return "Specialty is required.";
    if (!targetForm.profilePhoto.trim()) return "Profile photo is required.";
    if (!targetForm.documentPhoto.trim()) return "Document photo is required.";
    if (!targetForm.nationalIdDocumentPhoto.trim())
      return "National ID document photo is required.";
    return "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateForm(form);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    const newDoctor: DoctorRecord = {
      id: `doc-${Date.now()}`,
      ...form,
      accountStatus: "active",
      updatedAt: new Date().toISOString(),
    };
    setDoctors((prev) => [newDoctor, ...prev]);
    setMessage("Doctor added successfully.");
    setIsAddModalOpen(false);
    resetForm();
  }

  function handleSaveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingDoctorId) {
      return;
    }

    const validationError = validateForm(editForm);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    setDoctors((prev) =>
      prev.map((doctor) =>
        doctor.id === editingDoctorId
          ? { ...doctor, ...editForm, updatedAt: new Date().toISOString() }
          : doctor,
      ),
    );
    setMessage("Doctor profile updated successfully.");
    closeEditModal();
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-blue-50 px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-7xl flex-1 space-y-6">
        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-blue-700">Admin Dashboard</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
                Doctor Verification & Profile Management
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Add doctors, upload identity evidence, edit records, and monitor live
                availability.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                Total Doctors: {doctors.length}
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                Online: {onlineCount}
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                Suspended: {suspendedCount}
              </span>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3 lg:sticky lg:top-6 lg:h-fit">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Admin Menu</h2>
            <nav className="mt-3 space-y-2 text-sm">
              <button
                type="button"
                onClick={openAddModal}
                className="block w-full rounded-xl bg-blue-50 px-3 py-2 text-left font-semibold text-blue-700"
              >
                Add Doctor
              </button>
              <a
                href="#doctor-list"
                className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Doctor Directory
              </a>
              <a
                href="/admin/payment-requests"
                className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Payment Requests
              </a>
              <a
                href="/admin/payment-requests"
                className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Open Payment Requests
              </a>
              <Link
                href="/"
                className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Back Home
              </Link>
            </nav>
            <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Live status:</span> monitor and
                update doctor online/offline availability.
              </p>
              <p>
                <span className="font-semibold text-slate-800">Account controls:</span> suspend,
                unsuspend, or remove doctors.
              </p>
            </div>
          </aside>

          <section className="grid gap-6 lg:col-span-9 lg:grid-cols-1">
            <article
              id="doctor-list"
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Registered Doctors</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openAddModal}
                  className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  Add Doctor
                </button>
                <Link
                  href="/"
                  className="rounded-full border border-blue-300 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                >
                  Back Home
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {doctors.map((doctor) => (
                <section
                  key={doctor.id}
                  className={`rounded-2xl border p-4 ${
                    editingDoctorId === doctor.id
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Image
                      src={doctor.profilePhoto}
                      alt={`${doctor.name} profile`}
                      width={64}
                      height={64}
                      unoptimized
                      className="h-16 w-16 rounded-full border border-slate-200 bg-white object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{doctor.name}</p>
                      <p className="truncate text-sm text-slate-600">{doctor.specialty}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            doctor.isOnline
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {doctor.isOnline ? "online" : "offline"}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            doctor.accountStatus === "suspended"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {doctor.accountStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-slate-700">
                    <p>Phone: {doctor.phoneNumber}</p>
                    <p>Username: {doctor.username}</p>
                    <p>Password: {doctor.password}</p>
                    <p>National ID: {doctor.nationalIdNumber}</p>
                    <p className="text-xs text-slate-500">
                      Last updated: {new Date(doctor.updatedAt).toLocaleString()}
                    </p>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    Document photos are available in the Edit popup.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(doctor)}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                    >
                      Edit Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSuspendDoctor(doctor.id)}
                      className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                    >
                      {doctor.accountStatus === "suspended" ? "Unsuspend" : "Suspend"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoctor(doctor.id)}
                      className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-100"
                    >
                      Remove
                    </button>
                  </div>
                </section>
              ))}
            </div>
            </article>

          </section>
        </div>

        {editingDoctorId && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/45 p-4">
            <div className="flex min-h-full items-center justify-center">
              <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Edit Doctor Profile</h3>
                <button
                  type="button"
                  onClick={closeEditModal}
                  aria-label="Close edit popup"
                  className="rounded-lg border border-slate-300 px-3 py-1 text-lg font-semibold leading-none text-slate-700 hover:bg-slate-100"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Name</span>
                    <input
                      value={editForm.name}
                      onChange={(event) => updateEditField("name", event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Phone Number</span>
                    <input
                      value={editForm.phoneNumber}
                      onChange={(event) => updateEditField("phoneNumber", event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Username</span>
                    <input
                      value={editForm.username}
                      onChange={(event) => updateEditField("username", event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Password</span>
                    <input
                      type="text"
                      value={editForm.password}
                      onChange={(event) => updateEditField("password", event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">National ID Number</span>
                    <input
                      value={editForm.nationalIdNumber}
                      onChange={(event) => updateEditField("nationalIdNumber", event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Specialty</span>
                    <input
                      value={editForm.specialty}
                      onChange={(event) => updateEditField("specialty", event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                    />
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Profile Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => void handleEditPhotoUpload(event, "profilePhoto")}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Document Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => void handleEditPhotoUpload(event, "documentPhoto")}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">
                      National ID Document Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        void handleEditPhotoUpload(event, "nationalIdDocumentPhoto")
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {editForm.profilePhoto && (
                    <Image
                      src={editForm.profilePhoto}
                      alt="Edit profile preview"
                      width={96}
                      height={96}
                      unoptimized
                      className="h-20 w-20 rounded-full border border-slate-200 bg-white object-cover"
                    />
                  )}
                  {editForm.documentPhoto && (
                    <Image
                      src={editForm.documentPhoto}
                      alt="Edit document photo preview"
                      width={320}
                      height={120}
                      unoptimized
                      className="h-24 w-full rounded-lg border border-slate-200 bg-white object-cover"
                    />
                  )}
                  {editForm.nationalIdDocumentPhoto && (
                    <Image
                      src={editForm.nationalIdDocumentPhoto}
                      alt="Edit national ID preview"
                      width={320}
                      height={120}
                      unoptimized
                      className="h-24 w-full rounded-lg border border-slate-200 bg-white object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            </div>
          </div>
        )}

        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/45 p-4">
            <div className="flex min-h-full items-center justify-center">
              <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Add New Doctor</h3>
                <button
                  type="button"
                  onClick={closeAddModal}
                  aria-label="Close add popup"
                  className="rounded-lg border border-slate-300 px-3 py-1 text-lg font-semibold leading-none text-slate-700 hover:bg-slate-100"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Name</span>
                    <input
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Phone Number</span>
                    <input
                      value={form.phoneNumber}
                      onChange={(event) => updateField("phoneNumber", event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Username</span>
                    <input
                      value={form.username}
                      onChange={(event) => updateField("username", event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Password</span>
                    <input
                      type="text"
                      value={form.password}
                      onChange={(event) => updateField("password", event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">National ID Number</span>
                    <input
                      value={form.nationalIdNumber}
                      onChange={(event) => updateField("nationalIdNumber", event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Specialty</span>
                    <input
                      value={form.specialty}
                      onChange={(event) => updateField("specialty", event.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-blue-200 focus:ring"
                    />
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Profile Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => void handlePhotoUpload(event, "profilePhoto")}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">Document Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => void handlePhotoUpload(event, "documentPhoto")}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700">
                      National ID Document Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => void handlePhotoUpload(event, "nationalIdDocumentPhoto")}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                    />
                  </label>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {form.profilePhoto && (
                    <Image
                      src={form.profilePhoto}
                      alt="New profile preview"
                      width={96}
                      height={96}
                      unoptimized
                      className="h-20 w-20 rounded-full border border-slate-200 bg-white object-cover"
                    />
                  )}
                  {form.documentPhoto && (
                    <Image
                      src={form.documentPhoto}
                      alt="New document photo preview"
                      width={320}
                      height={120}
                      unoptimized
                      className="h-24 w-full rounded-lg border border-slate-200 bg-white object-cover"
                    />
                  )}
                  {form.nationalIdDocumentPhoto && (
                    <Image
                      src={form.nationalIdDocumentPhoto}
                      alt="New national ID preview"
                      width={320}
                      height={120}
                      unoptimized
                      className="h-24 w-full rounded-lg border border-slate-200 bg-white object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Add Doctor
                  </button>
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-6 border-t border-blue-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-sm text-slate-700 md:flex-row md:text-left">
          <p>MindCare Connect Admin © {new Date().getFullYear()}</p>
          <p>Manage doctors, credentials, and account status</p>
        </div>
      </footer>
    </main>
  );
}
