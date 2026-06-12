# YAI Plan Portal — Next.js + Framer Motion

Password-gated, scroll-animated business plan portal. Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion. Server-side cookie auth — access codes never reach the client bundle.

## Quick start

```powershell
# from this directory
npm install
cp .env.example .env.local      # edit codes + cookie secret
npm run dev                     # http://localhost:3000
```

Open http://localhost:3000, enter a code, and you'll be redirected to `/plan` with the full 21-section plan.

## Project layout

```
yai-plan/
  app/
    layout.tsx              Root layout + Inter font
    page.tsx                Login page
    globals.css             Tailwind + brand utilities
    plan/page.tsx           Gated 21-section plan (server component)
    api/auth/route.ts       POST — verify code, set signed cookie
    api/logout/route.ts     POST — clear cookie
  components/
    login/LoginCard.tsx     Animated login card
    plan/
      Sidebar.tsx           Scroll-spy nav (mobile drawer + desktop sticky)
      Section.tsx           Scroll-fade section wrapper
      Thesis.tsx            Orange one-liner under section title
      StatCallout.tsx       Animated counter tile
      Card.tsx              Generic card + Badge
      PlanHero.tsx          Top of plan page
      StageLadder.tsx       3-stage ladder visualization
      Funnel.tsx            Animated sales funnel
      ChatDemo.tsx          Interactive AI agent chat (Section 4)
      DashboardDemo.tsx     Interactive admin dashboard (Section 13)
  lib/
    codes.ts                Server-only access code parsing
    auth.ts                 HMAC-signed session cookie
  middleware.ts             Cookie presence check on /plan/*
  tailwind.config.ts        Brand tokens
  next.config.mjs           Security headers
  .env.example              Template — copy to .env.local
```

## Auth model

Two-layer:

1. **Middleware** (edge runtime) — checks the `yai_session` cookie exists on any `/plan/*` request. If missing, redirects to `/`.
2. **Server component** (`app/plan/page.tsx`, Node runtime) — verifies the HMAC signature on the cookie value via `lib/auth.ts`. If invalid, redirects to `/`.

Codes live in the `YAI_ACCESS_CODES` environment variable as a comma-separated `CODE:label` list. Server-only — never exposed to the browser.

```env
YAI_ACCESS_CODES="YAI2026:Master code,INV-LAW-001:Lawrence (CEO),INV-VAN-001:Vancouver investor"
YAI_COOKIE_SECRET="generate-with-openssl-rand-hex-32"
```

To **add** a viewer: append to `YAI_ACCESS_CODES` and redeploy.
To **revoke**: remove the code and redeploy. Existing sessions remain valid until the cookie expires (12h default) — bump `YAI_COOKIE_SECRET` to invalidate all existing sessions immediately.

## Interactive demos

Two real scroll-triggered demos are embedded in the plan, not just static screenshots:

- **Section 4 (Product Architecture → Stage 2 reveal):** `ChatDemo` plays an autotyping conversation with the YAI Finance agent — supervisor asks for payroll summary, agent responds with data, then handles a WRAP audit pack request.
- **Section 13 (Traction & Pilots):** `DashboardDemo` renders an animated admin dashboard with counter tiles, an animated sparkline (output trend), and a live agent activity feed.

Both auto-trigger via `useInView` from Framer Motion. Both styled to look like the real product.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server (hot reload) on :3000 |
| `npm run build` | Production build |
| `npm run start` | Run the production build (after `build`) |
| `npm run lint` | Next.js lint |
| `npm run typecheck` | TypeScript no-emit check |

## Deployment

### Option A — Vercel (recommended)

1. Push to a private Git repo.
2. Import on vercel.com → it auto-detects Next.js.
3. **Environment Variables** → add `YAI_ACCESS_CODES` and `YAI_COOKIE_SECRET` (mark both as Encrypted, available in Production + Preview).
4. Add domain: `plan.yaikh.com` (or path-rewrite from `www.yaikh.com/plan` via a Vercel rewrite).

### Option B — Cloudflare Pages

1. Connect repo to Cloudflare Pages.
2. Framework preset: Next.js (or use the Cloudflare Next.js adapter `@cloudflare/next-on-pages`).
3. Add the same env vars in the Pages dashboard.
4. Add custom domain.

### Option C — Self-host on the YAI server

```powershell
npm run build
npm run start                   # serves on :3000
```

Front with nginx for HTTPS + reverse proxy to port 3000.

## Content TODOs

Search the codebase for `TBD` and `TODO` — concentrated in:

- **Section 6 (Market):** TAM dollar figures (`app/plan/page.tsx`)
- **Section 11 (Pricing):** every tier price
- **Section 16 (Financials):** ARR / cost ranges
- **Section 18 (Milestones):** Q3 revenue milestone
- **Section 20 (Resources):** sales hire budget figure
- **Section 21 (Appendix):** pilot factory specifics, founder bio

## Brand tokens

Already wired into `tailwind.config.ts`:

```
yai-orange       #F37021
yai-orange-dark  #D45D14
yai-navy         #0A2540
yai-navy-light   #163558
yai-teal         #14B8A6
yai-bg           #F7F9FC
yai-border       #E5EAF1
```

Inter font is loaded server-side via `next/font/google` (no FOIT, no extra request).

## Images

Drop product screenshots into `public/images/`:

- `demo-dashboard.png` — admin dashboard (referenced in Appendix A1)
- `demo-mobile.png` — mobile agentic chat
- `architecture.png` — system diagram

The interactive demos in Sections 4 and 13 are the primary visual proof; the static images are fallback / print-friendly references.

## Tracking views (optional)

The `/api/auth` route logs successful access to `console.log`. To persist views, edit `app/api/auth/route.ts` and add a write to your store of choice (Vercel KV, Supabase, simple Postgres, etc.) after `findCode` succeeds.

## License / confidentiality

Confidential. Do not share or redistribute without written permission from Gamini K (gamini@yaikh.com).
