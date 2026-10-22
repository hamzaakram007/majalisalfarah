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

## 6. Daily social product posts

The admin **Social** page (`/admin/social`) rotates one catalog product per day to Facebook, Instagram, and/or a Zapier/Make webhook.

1. Run migration `supabase/migrations/20260604000000_social_posts.sql`.
2. Set `CRON_SECRET` in Vercel (Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`).
3. Connect destinations (any combination):
   - **Zapier / Make**: set `SOCIAL_WEBHOOK_URL` to a Catch Hook, then map `caption`, `product.image_url`, and `product.url` to Instagram/Facebook/TikTok actions.
   - **Facebook Page**: `META_PAGE_ID` + `META_PAGE_ACCESS_TOKEN`
   - **Instagram Business**: same page token + `META_INSTAGRAM_BUSINESS_ACCOUNT_ID` (image URL must be publicly reachable)
4. In admin → Social: enable daily posting, pick platforms, save.
5. Cron hits `/api/cron/social-post` daily at **06:00 UTC** (09:00 Asia/Riyadh). Use **Post next product now** to test.

Without Meta/webhook keys, posts succeed in **mock mode** and still appear in Social history (useful for local demo with `ADMIN_DEMO_MODE=true`).

## 7. Monitoring

- Optional: `NEXT_PUBLIC_SENTRY_DSN`
- Vercel Analytics (built-in)
- Supabase dashboard for DB metrics and backups
