# MUST READ — every session, before any work

You are working in the **`yaikhsales/homepage`** monorepo. Read this file end-to-end before doing anything else. It is the single source of truth for what's wired in production and the gotchas we've already paid for.

Last verified green: **2026-06-14**.

---

## 1. The three production lanes

| Lane | Identifier | URL / location |
|---|---|---|
| **GitHub repo** | `yaikhsales/homepage` | https://github.com/yaikhsales/homepage |
| **Railway project** | `yaikh-com` (env `robust-hope / production`) | https://yaikh-com-production.up.railway.app |
| **MongoDB Atlas cluster** | `yaikhhomepage` (M0 free, AWS Singapore `ap-southeast-1`, replica set `atlas-8kkani-shard-0`) | Atlas org **TEXLINK TECHNOLO…** → project **Project 0** |

**Auto-deploy is wired:** every push to `main` on GitHub triggers a Railway build for `yaikh-com`. No manual deploy needed.

---

## 2. Repo layout (README is stale — trust this instead)

```
homepage/
├── HANDOFF.md
├── PROJECT_REPORT.md
├── README.md          ← stale; still mentions yai-plan/
├── MUST_READ.md       ← this file
├── yaikh-com/         Next.js 14 marketing site (port 3001, prod) — Mongo-wired
└── yaikh-dashboard/   Next.js 14 management dashboard — NOT yet Mongo-wired
```

`yai-plan/` no longer exists as a folder — it was absorbed into `yaikh-com/` in commit `b5e9990` (2026-06-14). The `/plan` route inside `yaikh-com` is the former portal.

---

## 3. Mongo wiring — only `yaikh-com` for now

- **Env var:** `MONGO_URL` (server-side only, set on Railway → `yaikh-com` → Variables)
- **Default DB name:** `yaikh` (override per call: `getDb("other-db")`)
- **Driver:** `mongodb ^7.3.0`
- **Helper:** `yaikh-com/lib/mongo.ts` — exports `getDb()` and `pingDb()`, singleton-cached
- **Health endpoint:** `GET /api/db-ping` → `{connected: true, ms: N}` on success, 503 with error string on failure

`yaikh-dashboard/` does **not** currently read from Mongo. If a session adds Mongo to the dashboard, mirror `lib/mongo.ts` and add `MONGO_URL` to whichever Railway service hosts the dashboard.

---

## 4. Standard local dev commands — fixed user shorthand

The user uses short phrases to mean specific things. Follow these literally — don't second-guess the port or the app.

| User says | Means |
|---|---|
| **"fire up 3001"** / "dev 3001 up" / "start 3001" | Start `yaikh-com` Next.js dev server on port **3001**, then verify `http://localhost:3001/` returns the marketing home (Ai-Native Manufacturing Intelligence Platform). |
| **"fire up dashboard"** / "start dashboard" | Start `yaikh-dashboard` CRA dev server (CRA defaults to port 3000) — for live HMR while editing dashboard source. |
| **"rebuild experience"** / "push to experience" | Run `npm run build` inside `yaikh-dashboard/` — outputs to `yaikh-com/public/experience/`, viewable at `http://localhost:3001/experience` once `yaikh-com` is up. |

### "fire up 3001" recipe

```bash
cd E:\Antigravity\yaikh-monorepo\yaikh-com
npm run dev      # binds to port 3001 per package.json
# expect "Ready in …" within ~15s
# then verify:
#   GET http://localhost:3001/           → 200 (marketing home)
#   GET http://localhost:3001/experience → 200 (dashboard CRA bundle)
#   GET http://localhost:3001/api/db-ping → {"connected":true,"ms":N}
```

If port 3001 is already taken by something else, stop the squatter — never let Next.js auto-bump to 3002 (it would silently break /api/db-ping URLs in tests and screenshots).

---

## 5. Multi-session integration & data-flow contract

Multiple sessions, possibly across multiple machines, work this monorepo in parallel. This section is the contract that keeps them out of each other's way and defines where data goes from form → Mongo → chat agent.

### 5a. Roles

- **Worker session** — edits source in your assigned folder, commits, pushes to your PA branch (see 5c). NEVER runs `npm run build`. NEVER commits `yaikh-com/public/experience/*`. NEVER pushes to Railway.
- **Integrator session** — exactly one per Dev-3001 host (currently the user's primary machine). Pulls PA branches in FIFO order, merges to `main`, rebuilds the dashboard, commits the rebuilt bundle, pushes `main`. Gatekeeper for the shared bundle.
- **User** — runs Dev 3001 on the integrator's machine and watches the merged result at `http://localhost:3001/experience`.

### 5b. Data-flow: digitalization modules → chat agent → Mongo

Each Yai chat agent (PA) consumes one or more digitalization modules. This table is the canonical ownership map. **Append a row when you add a module; correct a row if ownership changes.**

| Chat agent (PA) | Sub-modules feeding it | Mongo collections | Git branch |
|---|---|---|---|
| Accounting PA | Accountant, IEWS, Purchase Request, Bill Claim, Salary Bill, Shipping Bill | `purchase_requests`, `bill_claims`, `salary_bills`, `shipping_bills`, `journal_entries`, `iews_sync_log` | `agent/accounting` |
| HR PA | YHR, Org Chart, Training, Temporary Worker | `attendance`, `leave_requests`, `training`, `org_chart`, `temp_workers` | `agent/hr` |
| Admin PA | Support Ticket, Y Shop, Gate Pass, Meeting Room | `support_tickets`, `y_shop`, `gate_passes`, `meeting_rooms` | `agent/admin` |
| CSR PA | Digital Audit, Energy, Air, Water | `digital_audits`, `energy_meters`, `air_logs`, `water_logs` | `agent/csr` |
| Shipping PA | Shipping + MRP | `shipments`, `containers`, `materials`, `bom`, `stock` | `agent/shipping` |
| QA PA | YQMS, Call Out | `qms_defects`, `call_outs`, `audits` | `agent/qa` |
| Production PA | FC, YWIP | `production_schedule`, `wip` | `agent/production` |
| CE PA | CE | `customer_visits`, `feedback` | `agent/ce` |
| YTM PA | YTM | `machine_maintenance`, `repair_log` | `agent/ytm` |
| 4DP PA | 4DP | `designs`, `patterns`, `samples`, `specs` | `agent/4dp` |
| YPI PA | YPI | `kaizen`, `sop_reviews`, `process_optimization` | `agent/ypi` |
| Social PA | (no sub-modules yet) | `social_posts`, `social_comments` | `agent/social` |

**Not yet owned by any chat agent** — leave alone until the user revisits: Management Dashboard, SOP, System Analysis, E-GOVERNMENT.

**Where data starts → where it lands:**
1. User submits a form in `yaikh-dashboard/src/<module>/` (e.g. `src/bill-claim/`).
2. Form POSTs to `/api/<collection>` (e.g. `yaikh-com/app/api/bill-claims/route.ts`).
3. Doc lands in the named Mongo collection on the `yaikhhomepage` Atlas cluster (`yaikh` DB).
4. The owning chat agent reads its collection set + calls the LLM (see section 6) → replies in natural language.

### 5c. Branching rules

- **One branch per PA**: `agent/<pa-slug>` (e.g. `agent/accounting`, `agent/hr`).
- Worker sessions push commits to their PA branch only.
- **Never push directly to `main`** unless the change is cross-cutting (docs, build config, this file).
- **Stay in your folder** — an Accounting-PA session does not touch HR-PA source. Avatars and other shared `public/` assets are the obvious overlap risk; coordinate before touching them.

### 5d. Integrator FIFO

When a worker session is ready to land work:
1. Worker pushes to the PA branch.
2. Worker tells the user "ready to integrate `agent/<pa>`".
3. Integrator session, on the Dev-3001 machine, in order:
   a. `git pull origin main`
   b. `git merge agent/<pa> --no-ff -m "merge: <pa> — <summary>"`
   c. `npm run build` inside `yaikh-dashboard/` (skip if no dashboard source changed)
   d. Commit `yaikh-com/public/experience/*` if it changed.
   e. `git push origin main`
   f. Reload `http://localhost:3001/experience` to confirm.
4. **Next integration waits** until step 3f completes. FIFO — first ready, first merged.

This serialization prevents bundle-hash conflicts and keeps Dev 3001 showing a known-good state at every moment.

### 5e. Mongo serialization

Mongo handles concurrent writes natively — no lock needed for normal form submissions. **But** when a session wants to seed or migrate collections owned by another PA, route the seed script through the integrator: post the script for review, integrator runs it, confirms result before the next collection mutation. Prevents one session clobbering another's mid-test data.

### 5f. Railway cadence

Railway prod is **NOT** redeployed on every push. Target ~hourly batches. The integrator triggers Railway pushes intentionally, typically after a clean integration cycle + a quick smoke test on Dev 3001. Worker sessions should never say "Railway will auto-deploy now" — only the integrator says that, only when explicitly shipped.

### 5g. What you commit vs. what you DON'T

**Commit:**
- Your assigned source under `yaikh-dashboard/src/<module>/`
- New API routes under `yaikh-com/app/api/<collection>/`
- Seed scripts under `yaikh-com/scripts/`
- This file when the contract changes (and ping the user — it's a cross-session contract)

**Don't commit:**
- `yaikh-com/public/experience/*` — integrator's job
- Avatar regen or unrelated PNG churn
- `.env*` files (gitignored; double-check before staging)
- Files outside your folder ownership without coordinating

---

## 6. Chat-agent LLM strategy + GCP credits

Each PA in section 5b will eventually be backed by an LLM call that takes the user's natural-language input, reads the PA's owned Mongo collections, and returns a natural-language reply. This is the conversational layer on top of the form/dashboard data.

### 6a. Existing wiring (and what's broken)

- Both apps have `@google/genai` SDK installed (yaikh-com `^2.8.0`, yaikh-dashboard `^1.34.0`).
- `yaikh-com/.env.local` has `GOOGLE_CLOUD_PROJECT` and `GOOGLE_CLOUD_LOCATION` set — Vertex AI auth is already configured for the backend.
- ⚠️ `yaikh-dashboard/src/chatbot/gemini-api.js` currently uses a **hardcoded API key in client-side code** + falls back to an external Cloud Run endpoint. The key ends up in the public bundle. **Will be replaced** when the backend chat route is built — until then, treat that key as compromised.

### 6b. Target architecture (to build)

```
User → chat input on a PA card
     → POST /api/ai-chat/<pa-slug>     (yaikh-com, server-side)
     → backend fetches the PA's Mongo docs as context
     → Vertex AI Gemini call via @google/genai
       (no API key — uses ADC / service account via GOOGLE_CLOUD_PROJECT)
     → NL response streamed back to the chat UI
```

Backend-only. Browser never sees a key. Costs paid by GCP credits below.

### 6c. GCP credit map

Two credits live on the GCP project (as of 2026-06-15):

| Credit | Amount | Scope | What to use it for |
|---|---|---|---|
| **Free Trial** | ~$354 remaining | Any GCP service | **Default — use this for all Vertex AI Gemini API calls** powering `/api/ai-chat/<pa>`. |
| **GenAI App Builder trial** | ~$1,277 | Vertex AI Agent Builder / Search / Conversational AI **only** | Reserved. Activate later if we move to Vertex AI Search-grounded retrieval or formal Agent Builder bots. NOT usable for plain Gemini API calls. |

Cost estimate at Gemini 2.5 Flash (~$0.075/1M input, ~$0.30/1M output):
- ~2K input + ~300 output per chat turn → roughly $0.00024 per turn.
- 1,000 turns/day ≈ **$0.24/day** ≈ $87/year. The Free Trial alone covers ~4 years at that load.

Migration path if/when we need richer retrieval: ingest the relevant Mongo collections into Vertex AI Search → use Agent Builder → start eating the $1,277 GenAI App Builder credit. Until then, stay on direct Gemini calls.

---

## 7. Verify all green in 3 commands

```bash
# 1. Marketing site
curl -s -o /dev/null -w "%{http_code}\n" https://yaikh-com-production.up.railway.app/
# expect: 200

# 2. /plan route (former portal)
curl -s -o /dev/null -w "%{http_code}\n" https://yaikh-com-production.up.railway.app/plan
# expect: 307

# 3. Mongo health
curl -s https://yaikh-com-production.up.railway.app/api/db-ping
# expect: {"connected":true,"ms":<number>}
```

If any of these fail, read section 8 before debugging.

---

## 8. Gotchas we've already paid for — do NOT re-debug from scratch

### 8a. `/api/db-ping` returns 503 with `tlsv1 alert internal error: SSL alert number 80`

**Two possible causes — check in this order:**

1. **Atlas IP whitelist missing `0.0.0.0/0`.** Railway egress IPs rotate; the cluster's Network Access list must include `0.0.0.0/0`. Check: https://cloud.mongodb.com/ → project → **Network Access**. If absent, add it with comment "Railway egress — allow all" and wait ~30s.

2. **Singleton has a poisoned promise (bug in `lib/mongo.ts:42`).** The Mongo client promise is cached on first use. If the **first** connect fails (e.g., before the whitelist was open), the rejected promise is cached forever and every subsequent request returns the same stale error. **Fix: redeploy the `yaikh-com` Railway service** to reset the in-memory singleton.

If both look right but it still fails, run `nslookup -type=SRV _mongodb._tcp.yaikhhomepage.pt9xtbm.mongodb.net` to confirm the cluster's SRV record still exists.

### 8b. The poisoned-promise bug itself (open follow-up)

`yaikh-com/lib/mongo.ts` caches the connect *promise*, not the resolved client. A real fix would `.catch` the rejection and clear the cache so the next request retries. Worth a small PR, but not blocking.

### 8c. Stale README

`README.md` still references `yai-plan/` as a separate folder. It was absorbed into `yaikh-com/` (commit `b5e9990`). Don't `cd yai-plan` — it won't exist.

### 8d. Next.js server error: `Cannot find module './<id>.js'` on Dev 3001

Hit when `yaikh-com/public/experience/*` files change underneath a running Next.js dev server — webpack-runtime's chunk index points at a hash that no longer exists. Fix: stop the dev server, delete `yaikh-com/.next/`, restart `npm run dev`. The integrator should plan to run `npm run build` against the dashboard **before** starting Dev 3001 for the day, and avoid rebuilding while it's serving.

### 8e. Hardcoded Gemini API key in `yaikh-dashboard/src/chatbot/gemini-api.js`

See section 6a. Public bundle exposes the key. Don't extend that file — instead, route new chat work through the planned backend `/api/ai-chat/<pa-slug>` route. Existing key should be rotated and removed when the backend route lands.

---

## 9. Where to find the rest

- `HANDOFF.md` — broader project handoff context (long-running notes)
- `PROJECT_REPORT.md` — status / progress narrative
- `yaikh-com/README.md` and `yaikh-dashboard/README.md` (if present) — per-app dev instructions

When in doubt, re-read this file. It is updated whenever production wiring or the multi-session contract changes.
