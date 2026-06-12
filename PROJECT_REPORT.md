# Yai · yaikh.com — Full Project Report

**Repository:** `yaikhsales/homepage` · **Developed by:** Texlink Technologies Co., Ltd., Phnom Penh
**Stack:** Next.js 14 (App Router) · Tailwind CSS · Framer Motion · Google Vertex AI (image generation)
**Status:** Localhost-only marketing site (not deployed) + Railway-deployed investor portal

---

## 1. What this repository contains

| Folder | App | Purpose | Port |
|---|---|---|---|
| `yaikh-com/` | **Marketing homepage** | Public face of www.yaikh.com — the Ai-Native Manufacturing Intelligence Platform (Ai MIP) | 3001 |
| `yai-plan/` | **Investor / partner portal** | Password-gated strategic business plan (live at yai-plan-production.up.railway.app) | 3000 |

Both are self-contained Next.js 14 projects: `cd <folder> && npm install && npm run dev`.

---

## 2. The product story the homepage tells

Yai is presented as the **world's first Ai-Native MIP** for Garments, Footwear, Bags
and Softgoods manufacturing — converting a factory into a full Ai-Native ecosystem
in ~1 year. The page walks a visitor (factory owner, brand buyer, or partner
reviewer from Anthropic / Google Cloud / JICA) through a 4-stage evolution:

1. **Today** — the chaos: paper reports, ledgers, scattered chats, approval-chasing
2. **Layer 1 · Digitalization** — one database; smart UIs, chat agents, mobile apps, AIoT, LLMs
3. **Layer 2 · Agentic** — Ai agents own the workflows; humans confirm, agents police SOPs
4. **Layer 3 · Full Ai** — strategic management; proven results, confident capital, clone-to-country

---

## 3. Homepage sections (top to bottom)

### 3.1 Nav
- Round registered **Yai logo** (1280×1280 source, rendered unoptimized for crispness)
- Slogan: *"One system. Simple enough to run a factory from your phone."*
- Links: Product · Customers · **Partners ▾** (transparent submenu → **Portal ↗** opens the yai-plan portal) · Pricing · Flashcards · Experience · Chat with us
- **7 round 3D flag buttons** (KH · GB · CN · JP · KR · BD · IN) — live language switcher
- **Login** pill (orange) → yai-plan portal

### 3.2 Hero
- Badges row: Cambodia flag + MADE IN CAMBODIA · ASEAN round badge · **Ai MIP** 3D gold-on-blue pill
- Headline: *Ai-Native **Manufacturing** Intelligence Platform.* (Fraunces serif, amber italic accent)
- Credit card: **Texlink Technologies Co., Ltd.** — registered in Cambodia, ICT certified,
  20 Cambodian development engineers, HK + Singapore venture advisors, Phnom Penh HQ
- Right column: **compact Dream Showcase** (auto-cycling 4-frame TV) + 4 stat cards:
  - **10** Master Ai agents · holding 100+ apps
  - **20** Certified Ai integration engineers
  - **live counter** "Xy Yd — in live development · and counting" (from 2024-05-20, recomputed hourly)
  - **40 yrs** experience in factory administration and production

### 3.3 The Platform (Layer Story)
Four animated SVG cards — every animation hand-built CSS keyframes (no JS animation loops):
- **Today**: black stick-figure office chaos — running worker, paper piles bobbing,
  cart pusher with spinning wheels, laptop-shaker with "!#@", arguing pair, panic-runner with flame
- **Layer 1**: orange data-hub (pulsing cylinder + glow ring) with 4 device corners
  (AIoT sensors / Smart UIs / Pads / LLMs) feeding dashed data streams inward
- **Layer 2**: 5 real photo-portrait agents in a constellation; speech pills always above
  heads ("Request / Defects ↑ / → GM / Machine ✕ / Fabric ↺"); amber rings on speak
- **Layer 3**: bright-yellow home zone (People · Ai · $ + READY badge) and a travelling
  3-icon team visiting 5 country factories (Bangladesh → Indonesia → India → Uzbekistan → Mexico)
  on a 12s journey loop

### 3.4 The Journey (adoption ladder) — `#customers`
8 ascending towers, 124px wide, 16px gaps, each with a **white bottom tab carrying a
big bare client number** (no "clients" word) + capacity caption:

| Step | Tower | Clients | Capacity |
|---|---|---|---|
| 1 | Cloud · Starter | **3** | Core team |
| 2 | Cloud · Growth | **2** | Dept |
| 3 | Cloud · Enterprise | **2** | Factory |
| 4 | Ai Server | **2** | Hardware |
| 4 | Administrative | **2** | Tools |
| 4 | Operation | **1** | Tools |
| 5 | Agentic | **1** | ~6 months |
| 6 | Big Ai Brain | **1** | Boss · ~1 yr |

Steps 1–3 show **real avatar-photo grids** (5 → 20 → 36 faces); Step 5 has a 4-portrait
stack + "MANY OTHERS"; Step 6 has the boss avatar + chat badge + 5 mini factories.
Headline stamp: **COMMERCIALISATION JOURNEY · STARTED JULY 2026**.

### 3.5 Partner Stack — `#partners`
Three cards, each: brand logo → colored tag pill → name → one-line relationship statement:
- **Anthropic · Claude Partner Network** — "Technical advisory partnership with the world's
  leading enterprise Ai venture — certifying our system developers."
- **Google Ai Services** — "World's most prominent Generative Ai services — integrated
  for efficient content creation."
- **JICA · Cambodia digitalisation** — "Ongoing activity partnering Asia Pacific's leading
  technology institute."

### 3.6 Pricing — `#pricing`
The **full interactive PricingStaircase**, ported 1:1 from the yai-plan portal and scaled up
(124px towers matching the Journey ladder pillar-for-pillar — verified to 0.00px alignment):
- Steps 1–3: $120 / $750 / $1,200 per year (avatar clusters, capacity labels)
- Step 4 **Ai Server — "Buy $2,500"** toggle; **Administrative (+$5K/yr)** and
  **Operation (+$10K/yr)** stay 🔒 locked until the server is bought
- Steps 5–6: Agentic + Big Ai Brain, +$5,000/yr each
- Live **Step 4 Total** panel (server paid + yearly active $) with spring animations
- Phase chips: **CHAOS → DIGITALIZATION** (blue, spans 6 towers) · **BIG AI BRAIN** (orange, spans 2)

### 3.7 Flashcards / Experience — `#impact`
A **cinematic 8-frame reel** on the navy section — 16:9 TV frame, ken-burns crossfade
every 3.6s, hover-to-pause, lower-third caption (tag pill + serif title + one-liner),
8 clickable progress dots:
- Frames 1–4: the factory-wide dream sequence (Today → L1 → L2 → L3)
- Frames 5–8: **the Accounting evolution** — photorealistic Vertex-generated scenes of one
  accountant's desk across the four eras: buried in ledgers → typing ERP forms →
  agents auto-posting vouchers → presenting forecasts at a 99.9%-accuracy analytics wall

### 3.8 CTA + Footer
- "Bring your factory into Ai." → mailto:gamini@yaikh.com
- Footer: product links, Texlink legal line, © Texlink Technologies Co., Ltd. · Made in Cambodia

---

## 4. Internationalisation — 7 languages, zero external services

`yaikh-com/app/i18n.tsx` holds a **hand-written dictionary of ~100 keys × 7 languages**:

> English · ខ្មែរ Khmer · 中文 Chinese · 日本語 Japanese · 한국어 Korean · বাংলা Bengali · हिन्दी Hindi

- React context (`LangProvider` / `useLang`) + `t(key)` lookup — translations are **fixed
  in the code at build time**; no Google Translate, no network calls
- The 7 nav flag buttons switch the live language; active flag gets an amber ring
- Covered: nav, hero, stat cards, dream/cinema captions, platform + 4 layer cards,
  journey header + capacity labels, partner cards, pricing header, CTA
- Deliberately untranslated: numbers, prices, product names (Cloud Starter, Ai MIP, Texlink)

---

## 5. Generated imagery (Google Vertex AI)

All cinema artwork is generated through Vertex AI (`gemini-2.5-flash-image`), driven by
two scripts (auth via `gcloud` ADC + `GOOGLE_CLOUD_PROJECT` in `.env.local`):

| Script | Output |
|---|---|
| `scripts/regenerate-l1.mjs` | `dream-l1.png` — Layer-1 factory scene (orange data-hub direction) |
| `scripts/generate-acc.mjs` | `acc-today/l1/l2/l3.png` — the 4 photoreal accounting-era frames |

The Layer-1 dream frame additionally gets a **radial orange `mix-blend-overlay` glow**
centred on the data hub at render time — a CSS fix that replaced multiple regeneration attempts.

39 portrait avatars (`agent-1…38.png`, `agent-boss.png`) are shared with the yai-plan portal.

---

## 6. Engineering notes & gotchas solved

- **CSS transform vs SVG transform**: CSS `transform` in keyframes *replaces* the SVG
  `transform` attribute — fixed everywhere with the outer-`<g>`-positions / inner-`<g>`-animates pattern
- **Speech-bubble pile-ups** (Layer 2): solved by placing every bubble *above* its agent,
  spreading agents to the card edges, and shortening messages to 1–2 words
- **Pixel-perfect ladder alignment**: Journey + Pricing wrappers use byte-identical structure
  (`-mx-1 px-1 → min-w-max → flex gap-4`); verified in the live DOM — all 8 pillar left-edges
  differ by **0.00px**
- **Logo crispness**: serve the raw 1280×1280 JPEG with Next `unoptimized` (the optimizer's
  recompression blurred the cursive mark)
- **Container width**: page widened from `max-w-7xl` (1280px) to **1600px** for large displays
- **Today-scene contrast**: stick figures darkened from slate-500 to gray-800/slate-900

---

## 7. Repository / account history

1. `yaikh-com` was built localhost-only, then versioned to **`Gaminigz/yaikh2026hp`** (~30 commits
   of granular history: every visual iteration committed + pushed on approval)
2. `yai-plan` lives at **`Gaminigz/ai-plan`** and deploys to Railway (unchanged by this work)
3. Both projects were combined into **this monorepo** via `git subtree add` —
   **full histories preserved** (235 commits at import time)
4. The monorepo was pushed to **`yaikhsales/homepage`** (the gamini@yaikh.com account),
   which is now the **source of truth** going forward

### The transfer war story (for posterity)
Pushing to the new account kept failing with mysterious `406 Not Acceptable` errors from
both Git Credential Manager and the GitHub CLI. Root cause: a manual *"GitHub bypass for
China VPN"* entry in the Windows hosts file pointed `api.github.com` at a github.com **web**
server IP — every OAuth token exchange died against a server that doesn't speak the API.
Removing that single hosts line (keeping the `github.com` bypass) fixed authentication
instantly. A wrong-account PAT was also created along the way; it was revoked and purged
from the local credential store.

### Credential lanes on the dev machine
| Identity | Scope | Mechanism |
|---|---|---|
| `yaikhsales` | this monorepo only | GitHub CLI keyring (`!gh auth git-credential`, repo-local) |
| `Gaminigz` | all other repos | Windows Credential Manager |

---

## 8. Running everything

```bash
# Marketing site → http://localhost:3001
cd yaikh-com && npm install && npm run dev

# Portal → http://localhost:3000
cd yai-plan && npm install && npm run dev
```

- Secrets: each app reads its own git-ignored `.env.local`
  (`GOOGLE_CLOUD_PROJECT` etc. for image generation; portal access codes for yai-plan)
- Image regeneration: `node scripts/generate-acc.mjs` / `node scripts/regenerate-l1.mjs`
  inside `yaikh-com/` (requires `gcloud auth application-default login` once)
- The marketing site is intentionally **not deployed** — localhost preview only, per project rule

---

*Report generated June 12, 2026 — built with Claude Code.*
