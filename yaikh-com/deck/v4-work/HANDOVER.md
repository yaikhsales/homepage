# Yai Pitch Deck v4 — Handover (19 Sep 2026)

**Round:** US$3M **Seed** (not pre-seed) · 15 slides · Yai colours / logo · structure from the Cherub pre-seed deck (TikTok breakdown).

## Where it lives
| What | Path |
|---|---|
| Generator (source of truth) | `deck/v4-work/make-yai-deck-v4.js` |
| Images | `deck/v4-work/img-lite/` (os logos, cat3d icons, partner/customer logos, team photos) |
| Built deck | `deck/v4-work/yai-deck-v4.html` |
| Web copy (confidential) | `private/pitch-deck-v4.html` → served by `app/plan/pitch-deck/route.ts` |
| On the website | yaikh.com/plan → About Yai → **A4. Pitch Deck** (sign-in via /SDTV) |

Edit **only** in `deck/v4-work` — the session scratchpad is wiped when the app quits.

## How to work
1. `cd deck/v4-work && node make-yai-deck-v4.js all` — builds all four raise sizes (0.5m · 1m · 2m · 3m; 3m = `yai-deck-v4.html`, others `yai-deck-v4-<ask>.html`). One tier: `ASK=1m node make-yai-deck-v4.js`.
2. Preview: `python3 -m http.server 8901 --bind 127.0.0.1` → Browser pane `http://127.0.0.1:8901/yai-deck-v4.html` (1320×780). `?only=N` = one slide.
3. After each edit check the slide fits above its footer (~678px) and has no large empty bottom. Text ≥ ~17px (TV-readable).
4. Don't use headless Chrome screenshots — they hang.

## Publishing (only when Gamini says "update the web")
1. Copy every built deck into `private/` (never `/public`): `yai-deck-v4.html → private/pitch-deck-v4.html`, `yai-deck-v4-<ask>.html → private/pitch-deck-v4-<ask>.html`, and `deck/Yai-Pitch-Deck-v4-*.pdf → private/`. PDFs: headless Chrome `--print-to-pdf --window-size=1400,900` (wrap in a 90s alarm).
   Site: /plan A4 shows four small cards → `/plan/pitch-deck?ask=<ask>` (deck) and `&pdf=1` (PDF).
2. `npm run build` in `yaikh-com`
3. Commit as **yaikhsales** · `gh auth switch --user yaikhsales` · push · switch back to `Gaminigz`
4. Railway ~7 min · check `gh api repos/yaikhsales/homepage/commits/<sha>/status`
5. `/plan/pitch-deck` sends `X-Frame-Options: SAMEORIGIN` (rest of /plan is DENY) — keep it that way.

## The 15 slides (status)
| # | Slide | Status |
|---|---|---|
| 1 | Title — Ai-Native Manufacturing Intelligence for Soft Goods | ✅ |
| 2 | Problem — 4 problems: brands · government · society · ASEAN | ✅ |
| 3 | Market — 1,700 exporters · 5,000 non-manufacturing · 6,000 small businesses | ✅ |
| 4 | Why now — 4 why-nows | ✅ |
| 5 | Solution — Ai-Native Apps · Ai Agentic Support · Ai Big Brain · AIoT + 7 platform logos | ✅ |
| 6 | Who it serves — worker · supervisor · manager · owner · buyer · government | ✅ |
| 7 | Traction — 70+ apps · 14 agents · $1,200/yr · 5 customer tiles | ✅ (see open 3–4) |
| 8 | Roadmap — product + expansion 2024–2027 | ✅ |
| 9 | Landscape — ERPs · Excel/Word/E-mail/WhatsApp · Worldly/ITS/BV/SGS/ILO/BSCI/WRAP | ✅ |
| 10 | Business model — starts $120→$1,200/yr · Ai agents $2,500→$15,000 · corporate $5,000→$15,000 | ✅ |
| 11 | Path to targets — ~$100K (2024–26) · ~$0.5M (2027–28) · ~$3M (2028–30) + 9-month proof line | ✅ (see open 2) |
| 12 | The ask — 4 allocation items | ⏳ open 1 |
| 13 | Our serious competitor — Adidas MiP stack (AWS+SAP · o9 · TrusTrace · project44) vs Yai · sourced | ✅ new 19 Sep |
| 14 | Team — Arnold (founder) · Gamini (CTO) with photos · 20 Cambodian engineers · 9 partner logos | ✅ (see open 5) |
| 15 | Close — "The only Commercial Ai MiP for the Soft Goods industry." + 3 boxes: The ask (US$3M seed · 21→100) · See it live · Talk to us (Arnold · Gamini + email, WhatsApp, Telegram, WeChat, Telegram QR → t.me/GKSmartbiz) | ✅ draft (see open 6) |

## Open items — ask Gamini, don't invent numbers
1. **The Ask:** proposed $2M Growth + $1M Reserve (18 months runway & working capital) — not yet approved. Real % split unknown (45/25/15/15 are placeholders). City office = Phnom Penh? Milestones box (100 factories · Anthropic Partner Network · Layer 3 at five factories · Series A by Q4 2028) — keep or change?
2. **Slide 11:** 2027–2028 and 2028–2030 overlap in 2028 — should the last be 2029–2030? Exact number of factories upgrading in Q1 2027?
3. **Slide 7:** Yorkwell tile says "All 14 agents in play" but they move to agents Q1 2027 → suggest "Moving to 14 Ai agents · Q1 2027".
4. **Slide 7:** "Anthropic Partner Network" shown without "nominated" — application (30 Aug 2026) not confirmed yet.
5. **Slide 13:** MEF logo implies government endorsement — confirm permission.
6. **Slide 14:** "Talk to us" has names only — add email / phone / WhatsApp? Keep "Modernised industry." as the headline?
7. **Title icons:** Microsoft Fluent 3D now; Gamini wants more realistic — swap in his own images if he provides them.

8. **Four decks — BUILT 19 Sep.** Only the amount differs. $0.5M/$1M/$2M say "beyond its first 21 factories" / "21 factories and growing" / milestone "More paying factories" and reuse the $3M allocation % — still need Gamini's per-tier split, factory target and round name (pre-seed?). Edit `TIERS` in the generator.
