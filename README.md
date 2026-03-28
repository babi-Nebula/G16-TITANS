# MindCare Connect — AI & M-Pesa Mental Health Platform for Eastern Ethiopia

MindCare Connect is a startup-style, hackathon-ready full-stack web application that improves access to mental health support in Eastern Ethiopia through verified professionals, AI support, and M-Pesa payment simulation.

---

## Project Name

MindCare Connect — AI & M-Pesa Mental Health Platform for Eastern Ethiopia

## Problem Statement

Mental health services in Ethiopia are limited, especially in rural and semi-urban areas. Many individuals face barriers such as lack of access to professionals, cultural stigma, long travel distances, and lack of convenient digital payment systems.

## Project Objectives

- Provide access to verified psychiatrists and counselors
- Enable easy booking and communication
- Integrate M-Pesa for seamless payments
- Provide AI-based mental health support
- Support multiple Ethiopian languages
- Offer emergency SOS support

## Expected Significance

- Improves access to mental health care
- Reduces stigma through private digital access
- Enables early intervention
- Supports underserved communities

## Tools and Methods

- Frontend: Next.js (App Router, TypeScript, Tailwind CSS)
- Backend: Next.js API routes
- Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth (hackathon demo uses local mock auth flow)
- Payments: M-Pesa API (STK Push / C2B simulation)
- AI: OpenAI API (chat + sentiment style response; fallback mock implemented)
- SMS: Mock/placeholder API for SOS flow
- Development: Agile methodology

## Key Features

- Verified psychiatrist directory
- Booking and scheduling system
- Secure chat system
- AI mental health assistant
- SOS emergency button
- Multilingual support (Amharic, Afaan Oromo, Somali, English)
- Offline SMS simulation
- M-Pesa payment integration (simulated flow)

## M-Pesa Integration Explanation

- Simulate STK Push payment flow
- User clicks "Pay with M-Pesa"
- Payment request is sent
- Mock confirmation is returned
- Booking is confirmed after payment

## Expected Users and Impact

- Students, youth, professionals, rural communities
- Increased access to mental health support
- Reduced untreated mental health issues

---

## Application Overview

### 1) Landing Page (SaaS style)

Implemented in `app/page.tsx` with animated, mobile-responsive sections:

- Hero section with CTA
- Feature grid
- AI assistant highlight
- SOS emergency highlight
- M-Pesa explanation block
- How-it-works section
- Multilingual support section
- Privacy section
- CTA and footer

### 2) Core System

Implemented in `app/auth/page.tsx` and `app/admin/page.tsx`:

- **Authentication**: signup/login UI and local session bootstrap
- **Psychiatrist Directory**: list of verified dummy doctors + profile details
- **Booking**: select date/time and confirm flow
- **Chat**: simple secure messaging interface (mock)
- **AI Assistant**: chat interface with API-backed responses
- **SOS Button**: one-click emergency alert simulation
- **M-Pesa Payment**: payment simulation endpoint and success confirmation

---

## API Endpoints

- `POST /api/ai` - AI assistant response + sentiment hint
- `POST /api/payments/mpesa` - M-Pesa STK Push request (real API integration)
- `GET /api/payments/requests` - List payment requests for admin/user views
- `PATCH /api/payments/requests/:requestId` - Admin approve/reject a payment request
- `POST /api/sos` - Emergency SOS alert simulation

---

## Database Design

Schema file: `docs/database-schema.sql`

### Tables

- `users`
- `psychiatrists`
- `appointments`
- `messages`
- `payments`

### ER Diagram (Text)

```text
users (1) --------< appointments >-------- (1) psychiatrists
  |                        |
  |                        v
  |                    payments
  |
  +--------< messages >--------+
            sender_id receiver_id
```

---

## Use Case Diagram (Text)

```text
Actors:
  - User
  - Psychiatrist
  - Admin

User:
  - Register/Login
  - Browse psychiatrists
  - Book and pay for appointment
  - Chat with psychiatrist
  - Chat with AI assistant
  - Trigger SOS alert

Psychiatrist:
  - View appointments
  - Communicate with users
  - Support follow-up

Admin:
  - Verify psychiatrists
  - Monitor platform operations
  - Review payments and SOS logs
```

More diagrams are available in `docs/diagrams.md`.

---

## Demo Data & UI

- Dummy psychiatrists are stored in `lib/data.ts`
- Preloaded mock chat and assistant conversation is included
- Fully responsive layout across mobile/tablet/desktop
- Soft, calm mental-health color system in Tailwind classes and global CSS

---

## Project Structure

```text
.
├── app/
│   ├── api/
│   │   ├── ai/route.ts
│   │   ├── payments/mpesa/route.ts
│   │   └── sos/route.ts
│   ├── auth/page.tsx
│   ├── platform/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── doctor-card.tsx
│   ├── landing-page.tsx
│   └── platform-nav.tsx
├── lib/
│   ├── data.ts
│   ├── i18n.ts
│   ├── supabase.ts
│   └── types.ts
├── api/
│   └── README.md
├── styles/
│   └── README.md
├── docs/
│   ├── database-schema.sql
│   └── diagrams.md
└── README.md
```

---

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open:

[http://localhost:3000](http://localhost:3000)

---

## Environment Variables (Optional)

For production integration, create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
MPESA_API_KEY=your_mpesa_api_key
MPESA_STK_PUSH_URL=your_mpesa_stk_push_endpoint
MPESA_PASSWORD=base64_password_from_provider
MPESA_BUSINESS_SHORT_CODE=6564
MPESA_CALLBACK_URL=https://your-callback-url
```

For M-Pesa payments, set the `MPESA_*` variables.  
User payments are submitted to M-Pesa and then appear in Admin Payment Requests for approval/rejection.

---

## Instructions for Screenshots (Submission)

Capture these screens:

1. Landing page hero and feature sections
2. Authentication screen (signup/login)
3. Psychiatrist directory cards
4. Booking + M-Pesa payment success
5. AI assistant chat response
6. SOS alert success state
7. Mobile responsive layout view

Suggested naming:

- `01-landing.png`
- `02-auth.png`
- `03-directory.png`
- `04-booking-payment.png`
- `05-ai-assistant.png`
- `06-sos.png`
- `07-mobile-view.png`

---

## Instructions for Demo Video (Submission)

Recommended 2-4 minute flow:

1. Introduce problem and target users (20 sec)
2. Show landing page and core value proposition (25 sec)
3. Signup/Login and language selection (25 sec)
4. Browse psychiatrist directory and select provider (30 sec)
5. Book appointment and run M-Pesa simulation (35 sec)
6. Send a secure chat message and AI assistant prompt (35 sec)
7. Trigger SOS and explain emergency workflow (25 sec)
8. Close with impact and scalability vision (20 sec)

---

## Hackathon Notes

- Real M-Pesa integration is intentionally simulated
- Focus is on UI quality, user flow, and business logic
- Architecture is ready to connect to Supabase + production APIs with minimal changes
