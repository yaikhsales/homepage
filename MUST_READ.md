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

## 5. Verify all green in 3 commands

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

If any of these fail, read section 6 before debugging.

---

## 6. Gotchas we've already paid for — do NOT re-debug from scratch

### 6a. `/api/db-ping` returns 503 with `tlsv1 alert internal error: SSL alert number 80`

**Two possible causes — check in this order:**

1. **Atlas IP whitelist missing `0.0.0.0/0`.** Railway egress IPs rotate; the cluster's Network Access list must include `0.0.0.0/0`. Check: https://cloud.mongodb.com/ → project → **Network Access**. If absent, add it with comment "Railway egress — allow all" and wait ~30s.

2. **Singleton has a poisoned promise (bug in `lib/mongo.ts:42`).** The Mongo client promise is cached on first use. If the **first** connect fails (e.g., before the whitelist was open), the rejected promise is cached forever and every subsequent request returns the same stale error. **Fix: redeploy the `yaikh-com` Railway service** to reset the in-memory singleton.

If both look right but it still fails, run `nslookup -type=SRV _mongodb._tcp.yaikhhomepage.pt9xtbm.mongodb.net` to confirm the cluster's SRV record still exists.

### 6b. The poisoned-promise bug itself (open follow-up)

`yaikh-com/lib/mongo.ts` caches the connect *promise*, not the resolved client. A real fix would `.catch` the rejection and clear the cache so the next request retries. Worth a small PR, but not blocking.

### 6c. Stale README

`README.md` still references `yai-plan/` as a separate folder. It was absorbed into `yaikh-com/` (commit `b5e9990`). Don't `cd yai-plan` — it won't exist.

---

## 7. Parallel-session etiquette

Multiple sessions run against this repo simultaneously. To avoid stomping:

- **Branch off `main` for non-trivial work.** Pushing straight to `main` is fine for tiny isolated changes (docs, one-file fixes), but anything multi-file should be a branch + PR.
- **Pull before you start.** `git pull --rebase origin main` — other sessions may have pushed in the last 5 minutes.
- **Stay in your folder.** If your task is `yaikh-com/`, don't touch `yaikh-dashboard/` files, and vice versa. Avatars and shared `public/` are the obvious overlap risks.
- **Don't change `MONGO_URL`, `MUST_READ.md`, or `lib/mongo.ts` without coordinating** — those are cross-session contracts.
- **Don't redeploy Railway** unless your work needs it. Pushing to `main` already triggers a build; manual redeploys can cancel in-flight ones from other sessions.

---

## 8. Where to find the rest

- `HANDOFF.md` — broader project handoff context (long-running notes)
- `PROJECT_REPORT.md` — status / progress narrative
- `yaikh-com/README.md` and `yaikh-dashboard/README.md` (if present) — per-app dev instructions

When in doubt, re-read this file. It is updated whenever production wiring changes.
