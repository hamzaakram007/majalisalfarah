# Majalis Alfarah — Deployment Guide

## Stack

- **Frontend/API**: Next.js 16 on [Vercel](https://vercel.com)
- **Database/Auth/Storage**: [Supabase](https://supabase.com)
- **Payments**: [Moyasar](https://moyasar.com) (Mada, Apple Pay, cards)
- **Email**: Resend (optional)
- **WhatsApp**: Twilio (optional)

## 1. Supabase

1. Create a project at supabase.com (Pro recommended).
2. Run migration: `supabase db push` or paste `supabase/migrations/20260601000000_initial.sql` in SQL Editor.
3. Run `supabase/seed.sql` for sample products and blog.
4. Create an admin user in Authentication, then set role in SQL:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'you@example.com';
```

5. Copy URL, anon key, and service role key to env.

## 2. Vercel

1. Import the `web` folder as a new project.
2. Add environment variables from `.env.example`.
3. Set `NEXT_PUBLIC_APP_URL` to your production domain.
4. Deploy; enable Vercel Analytics in project settings.

## 3. Moyasar

1. Create merchant account and get test/live API keys.
2. Set `MOYASAR_SECRET_KEY` and `NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY`.
3. Configure webhook URL: `https://yourdomain.com/api/webhooks/moyasar`

## 4. Local development

```bash
cd web
cp .env.example .env.local
# Set ADMIN_DEMO_MODE=true to access /admin without Supabase
npm run dev
```

Open http://localhost:3000/en

## 5. Domain

Point DNS to Vercel; add custom domain in Vercel project settings.

## 6. Monitoring

- Optional: `NEXT_PUBLIC_SENTRY_DSN`
- Vercel Analytics (built-in)
- Supabase dashboard for DB metrics and backups
