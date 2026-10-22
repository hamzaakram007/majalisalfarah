# Majalis Alfarah — Full Ecommerce Ecosystem

Production-grade bilingual (EN/AR) furniture ecommerce platform for Majalis Alfarah — custom Saudi sofas, foam, and majlis decor.

## Features

- Bilingual storefront with RTL Arabic
- Product catalog, cart, checkout, order tracking
- Moyasar payments (mock mode without API keys)
- Sofa customizer & quote requests
- Callback requests, loyalty program, blog, gallery
- Admin dashboard (orders, products, quotes, payments, social auto-post)
- Daily social product posts (Facebook / Instagram / Zapier webhook; mock without credentials)
- WhatsApp & email notifications (mock without credentials)
- Supabase Postgres with RLS (optional mock data fallback)

## Quick start

```bash
npm install
cp .env.example .env.local
# ADMIN_DEMO_MODE=true for admin without Supabase
npm run dev
```

- Store: http://localhost:3000/en
- Admin: http://localhost:3000/admin (demo mode or Supabase admin login)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run test` | Unit tests (Vitest) |
| `npm run lint` | ESLint |

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel + Supabase + Moyasar setup.

## Legacy static site

The original HTML bundle remains in `../majalisalfarah/` for reference.
