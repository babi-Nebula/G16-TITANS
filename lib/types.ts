export type SupportedLanguage = "en" | "am" | "om" | "so";

export type UserRole = "user" | "psychiatrist" | "admin";

export interface AppUser {
  id: string;
  fullName: string;
  phone: string;
  language: SupportedLanguage;
  role: UserRole;
}

export interface Psychiatrist {
  id: string;
  fullName: string;
  specialty: string;
  languages: SupportedLanguage[];
  yearsExperience: number;
  location: string;
  rating: number;
  bio: string;
  consultationFeeEtb: number;
}

export interface Appointment {
  id: string;
  userId: string;
  psychiatristId: string;
  appointmentDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "failed";
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  body: string;
  sentAt: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  userId: string;
  amountEtb: number;
  method: "mpesa";
  transactionCode: string;
  status: "success" | "failed";
  paidAt: string;
}
