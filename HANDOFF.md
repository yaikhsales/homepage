# HANDOFF — continue from another machine

**Written:** June 12, 2026 · machine shutdown mid-task. Everything important is PUSHED.
**Repo:** `github.com/yaikhsales/homepage` (account gamini@yaikh.com / yaikhsales)

## State at handoff — what is DONE ✅

1. Monorepo on yaikhsales/homepage contains FOUR things, all pushed (HEAD = `cfc053a`):
   - `yaikh-com/` — marketing homepage (Next.js, port 3001)
   - `yai-plan/` — investor portal (Next.js, port 3000; Railway still deploys from old Gaminigz/ai-plan)
   - `yaikh-dashboard/` — **the REAL agents platform** (CRA/React 19), subtree-imported
     with FULL history from yaikhsales/yaikh-demo-v2 at its commit `f45fdfb`
   - `PROJECT_REPORT.md` — full build documentation
2. The placeholder demo replica (`yaikh-demo/`) was removed (commit `ad3ddb8`).
3. yaikh-com's nav "Experience" link opens `http://localhost:3002` — that's where
   yaikh-dashboard must run.

## To CONTINUE on the new machine 🔧

```bash
# 1. clone (log in as yaikhsales — gh CLI device flow works)
gh auth login          # choose HTTPS + web browser, authorize as yaikhsales
gh repo clone yaikhsales/homepage
cd homepage

# 2. dashboard (the Experience app) on port 3002
cd yaikh-dashboard
npm install
echo "PORT=3002"    >  .env.local
echo "BROWSER=none" >> .env.local
npm start            # → http://localhost:3002

# 3. marketing site on port 3001 (separate terminal)
cd ../yaikh-com && npm install && npm run dev   # → http://localhost:3001
```

`.env` (Gemini key, agent URL/token) is committed inside `yaikh-dashboard/` so the
app runs out of the box. `.env.local` (PORT only) is machine-local — create as above.

## Remaining task list (was mid-flight) 📋

- [ ] Verify Experience link: yaikh.com (3001) → opens dashboard (3002)
- [ ] Decide fate of the now-redundant separate repos:
      `yaikhsales/yaikh-demo-v2` (imported — can be archived) and
      `yaikhsales/yaikh-demo-v1` (older variant — archive or keep as backup)
- [ ] ⚠️ SECURITY: `yaikh-dashboard/.env` holds a LIVE Gemini API key + agent token
      in a PUBLIC repo (now in homepage too). Recommended: make repo private
      (`gh repo edit yaikhsales/homepage --visibility private`), strip `.env` from
      git (keep `.env.example`), rotate the Gemini key in AI Studio.
- [ ] Old-machine leftovers (E: drive): `yaikh-com` (archive copy), `yaikh-demo-v1`
      folder, `yaikh-monorepo` (already pushed, safe). Nothing unpushed remains.

## Context for the assistant on the next machine 🤖

Working rules established: monorepo = single source of truth; commit + push after
each approved batch (as yaikhsales); the marketing site stays localhost-only; brand
spells "Ai" not "AI"; user gives short one-word approvals — ship immediately.
Read `PROJECT_REPORT.md` for the full build history and architecture.
