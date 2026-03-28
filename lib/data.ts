import { Psychiatrist } from "./types";

export const psychiatrists: Psychiatrist[] = [
  {
    id: "psy-1",
    fullName: "Dr. Hana Abebe",
    specialty: "Trauma & Anxiety",
    languages: ["en", "am"],
    yearsExperience: 11,
    location: "Harar",
    rating: 4.8,
    bio: "Focuses on trauma-informed care for youth and women in low-access communities.",
    consultationFeeEtb: 800,
  },
  {
    id: "psy-2",
    fullName: "Dr. Mohammed Yusuf",
    specialty: "Depression & Stress Disorders",
    languages: ["en", "so", "om"],
    yearsExperience: 9,
    location: "Jigjiga",
    rating: 4.7,
    bio: "Supports working professionals and students with structured evidence-based therapy.",
    consultationFeeEtb: 750,
  },
  {
    id: "psy-3",
    fullName: "Dr. Saron Bekele",
    specialty: "Family & Relationship Counseling",
    languages: ["en", "am", "om"],
    yearsExperience: 7,
    location: "Dire Dawa",
    rating: 4.6,
    bio: "Helps couples and families improve communication and emotional safety.",
    consultationFeeEtb: 700,
  },
];

export const featureCards = [
  {
    title: "Verified Psychiatrist Directory",
    description: "Find licensed professionals by language, specialty, and location.",
  },
  {
    title: "M-Pesa Payment Flow",
    description: "Book sessions with a one-tap STK Push simulation for fast checkout.",
  },
  {
    title: "AI Mental Health Assistant",
    description: "Receive 24/7 supportive check-ins and coping suggestions.",
  },
  {
    title: "Emergency SOS Support",
    description: "Trigger urgent alerts with immediate follow-up guidance.",
  },
  {
    title: "Secure Messaging",
    description: "Chat privately with providers before and after appointments.",
  },
  {
    title: "Multilingual by Design",
    description: "English, Amharic, Afaan Oromo, and Somali experiences built in.",
  },
];
