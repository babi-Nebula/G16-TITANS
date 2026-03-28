-- MindCare Connect - Supabase PostgreSQL schema
-- Run this in Supabase SQL editor for production setup.

create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone_number text unique not null,
  language text not null check (language in ('en', 'am', 'om', 'so')),
  role text not null check (role in ('user', 'psychiatrist', 'admin')) default 'user',
  created_at timestamptz not null default now()
);

create table if not exists psychiatrists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references users(id) on delete cascade,
  specialty text not null,
  years_experience int not null check (years_experience >= 0),
  location text not null,
  consultation_fee_etb numeric(10, 2) not null check (consultation_fee_etb > 0),
  rating numeric(2, 1) default 0,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  psychiatrist_id uuid not null references psychiatrists(id) on delete cascade,
  appointment_at timestamptz not null,
  status text not null check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'pending',
  payment_status text not null check (payment_status in ('unpaid', 'paid', 'failed')) default 'unpaid',
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid not null references users(id) on delete cascade,
  receiver_id uuid not null references users(id) on delete cascade,
  appointment_id uuid references appointments(id) on delete set null,
  body text not null,
  sent_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid not null references appointments(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  amount_etb numeric(10, 2) not null check (amount_etb > 0),
  method text not null check (method in ('mpesa')),
  transaction_code text unique not null,
  status text not null check (status in ('success', 'failed')),
  paid_at timestamptz not null default now()
);
