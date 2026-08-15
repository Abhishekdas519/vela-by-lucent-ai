-- =========================================================
-- VELA BY LUCENT AI - SUPABASE POSTGRESQL DATABASE SCHEMA
-- =========================================================
-- Paste and execute this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clients Table (Enterprise B2B Client Profiles)
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY DEFAULT ('client-' || substr(md5(random()::text), 1, 6)),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  industry TEXT NOT NULL DEFAULT 'B2B Software & SaaS',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'onboarding')),
  vapi_assistant_id TEXT NOT NULL,
  vapi_voice_id TEXT NOT NULL DEFAULT 'cartesia-sonic-marcus',
  vapi_voice_name TEXT NOT NULL DEFAULT 'Cartesia Sonic (Warm Authority)',
  twilio_phone_number TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  first_message TEXT NOT NULL,
  talktime_minutes_total INTEGER NOT NULL DEFAULT 1500,
  talktime_minutes_used INTEGER NOT NULL DEFAULT 0,
  active_lines INTEGER NOT NULL DEFAULT 10,
  calling_hours_start TEXT NOT NULL DEFAULT '09:00',
  calling_hours_end TEXT NOT NULL DEFAULT '18:00',
  timezone TEXT NOT NULL DEFAULT 'America/New_York (EST)',
  auto_followup_enabled BOOLEAN NOT NULL DEFAULT true,
  followup_delay_hours INTEGER NOT NULL DEFAULT 12,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Leads Table (CSV / Uploaded Prospects & Call Analytics)
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY DEFAULT ('lead-' || uuid_generate_v4()),
  client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  company TEXT NOT NULL,
  title TEXT DEFAULT 'Decision Maker',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'calling', 'completed', 'followup_queued', 'failed')),
  call_duration_seconds INTEGER DEFAULT 0,
  call_started_at TIMESTAMPTZ,
  call_ended_at TIMESTAMPTZ,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  conversion_chance INTEGER CHECK (conversion_chance BETWEEN 0 AND 100),
  ai_conclusion TEXT,
  key_objections JSONB DEFAULT '[]'::jsonb,
  transcript JSONB DEFAULT '[]'::jsonb,
  followup_draft JSONB,
  followup_scheduled_at TIMESTAMPTZ,
  followup_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Minute Transactions & Stripe Top-Ups Table
CREATE TABLE IF NOT EXISTS public.minute_transactions (
  id TEXT PRIMARY KEY DEFAULT ('tx-' || uuid_generate_v4()),
  client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
  package_id TEXT NOT NULL,
  minutes INTEGER NOT NULL,
  amount_usd NUMERIC(10, 2) NOT NULL,
  payment_intent_id TEXT,
  receipt_url TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Seed Initial Demo Client
INSERT INTO public.clients (
  id,
  company_name,
  contact_name,
  email,
  industry,
  status,
  vapi_assistant_id,
  vapi_voice_id,
  vapi_voice_name,
  twilio_phone_number,
  system_prompt,
  first_message,
  talktime_minutes_total,
  talktime_minutes_used,
  active_lines,
  calling_hours_start,
  calling_hours_end,
  auto_followup_enabled,
  followup_delay_hours
) VALUES (
  'client-1',
  'Apex Cloud Logistics',
  'Marcus Sterling',
  'marcus@apexlogistics.io',
  'Logistics & Freight Brokerage',
  'active',
  'asst_vapi_apex_logistics_01',
  'cartesia-sonic-marcus',
  'Cartesia Sonic (Warm Authority)',
  '+1 (415) 890-4321',
  'You are Vela, the autonomous outbound sales agent for Apex Cloud Logistics. You qualify 3PL prospects and schedule software demos.',
  'Hi! This is Vela calling on behalf of Apex Cloud Logistics. Do you have 60 seconds?',
  5000,
  1420,
  12,
  '09:00',
  '18:00',
  true,
  12
) ON CONFLICT (email) DO NOTHING;

-- 6. Row Level Security (RLS) Setup
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minute_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-write for active demo session" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write for transactions" ON public.minute_transactions FOR ALL USING (true) WITH CHECK (true);
