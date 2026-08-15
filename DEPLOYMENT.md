# 🚀 Vela by Lucent AI - Deployment Guide

This repository contains the complete full-stack code for **Vela by Lucent AI**, configured for instant deployment on **GitHub**, **Vercel**, and **Supabase** with custom domain support.

---

## 1. Push to GitHub as `vela-by-lucent-final-final`

### Option A: Direct Export from Google AI Studio UI (Easiest)
1. In the top-right header of Google AI Studio Build, click on the **Share / Export** (or **Settings ⚙️**) icon.
2. Select **Export to GitHub** (or **Download ZIP**).
3. Set the repository name to:
   ```
   vela-by-lucent-final-final
   ```
4. Choose **Public** or **Private** and click **Create Repository**.

### Option B: Using Git CLI (if working with the downloaded ZIP)
```bash
git init
git add .
git commit -m "Initial commit - Vela by Lucent AI enterprise sales platform"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/vela-by-lucent-final-final.git
git push -u origin main
```

---

## 2. Deploy to Vercel (Free & Instant)

1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your imported GitHub repository: **`vela-by-lucent-final-final`**.
3. Vercel will automatically detect `vite` and the pre-configured `vercel.json`.
4. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Google AI Studio / Gemini API Key)*
   - `VITE_SUPABASE_URL`: *(Your Supabase project URL - optional)*
   - `VITE_SUPABASE_ANON_KEY`: *(Your Supabase anon key - optional)*
   - `STRIPE_SECRET_KEY`: *(Your Stripe secret key - optional)*
   - `VAPI_API_KEY`: *(Your Vapi API key - optional)*
5. Click **Deploy**. Your site will be live within ~60 seconds.

---

## 3. Set Up Supabase Database (Free Cloud Database)

1. Create a free account at [supabase.com](https://supabase.com) and create a **New Project**.
2. Open the **SQL Editor** tab on the left sidebar.
3. Open `supabase/schema.sql` from this repository, paste the entire SQL script, and click **Run**.
4. This will instantly create:
   - `clients`: Enterprise client accounts and telephony quotas
   - `leads`: Lead queues, transcripts, AI conclusions, and 0–100% conversion scores
   - `minute_transactions`: Stripe top-up records and talktime balance tracking
   - Row Level Security (RLS) policies and demo seed data

---

## 4. Connect Your Custom Domain on Vercel

1. In your Vercel Project Dashboard, navigate to **Settings** → **Domains**.
2. Enter your custom domain (e.g. `yourdomain.com` or `app.yourdomain.com`) and click **Add**.
3. Configure your DNS records with your registrar (GoDaddy, Namecheap, Cloudflare, etc.):
   - **Type A**: `@` pointing to `76.76.21.21` (Vercel IP)
   - **CNAME**: `www` pointing to `cname.vercel-dns.com`
4. Vercel will automatically provision a free SSL certificate within 2–5 minutes.
