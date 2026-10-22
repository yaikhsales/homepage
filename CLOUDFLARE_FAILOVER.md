# YAI Cloudflare standby — session runbook

Last verified: 22 October 2026, Cambodia time. Railway hosts the homepage/API; the experience frontend is routed through Cloudflare.

## 1. Use the standby now

- Client demo: **https://yaikh.com/experience/** (Cloudflare frontend).
- Direct standby: https://yai-backup.gamini.workers.dev/experience/
- Homepage: https://yai-backup.gamini.workers.dev/
- Database check: https://yai-backup.gamini.workers.dev/api/db-ping
- Cloudflare account: **Gamini@ggmt.sg's Account**, ID `4e6f113aa77ceb0c3b4f7631b828e495`.
- Cloudflare dashboard: Workers & Pages → **yai-backup**.
- Primary Railway: project `robust-hope`, environment `production`, service `yaikh-com`.

Give clients the normal yaikh.com experience URL. The frontend runs on Cloudflare; the Mac only builds/publishes. If an old redirect is cached, use https://yaikh.com/experience/?release=c6e68381.

**Live routing:** YaiKH account `e45374d7eecce58154aa480b37c21863`, Worker `yai-experience-router`, route `yaikh.com/experience*`, fail-open to origin. Source: `ops/cloudflare/experience-router/worker.js`. This proxies public GET/HEAD SPA assets to `yai-backup`, strips credentials, and preserves the client hostname. Homepage and `/api/*` remain Railway; this is frontend routing, not full automatic failover. No DNS/email records changed.

**Rollback:** in YaiKH → Workers & Pages → yai-experience-router → Domains, remove only route `yaikh.com/experience*`; existing Railway DNS resumes serving that path. Acquire the same shared deployment lock before any route/code change. Do not delete the Worker or change DNS as a rollback.

## 2. Verified state and limits

The standby was deployed from main `c6e68381` using OpenNext 1.14.0 and Wrangler 4.151.3. Published Worker version: `01f85e19-8f90-4c9d-9470-4d4a9ccd9c8b`.

Verified in the browser:
- Actual yaikh.com experience loads bundle `main.80d9d06b.js` and TV / Mobile / iPad screens.
- Uploaded clips play on phone and iPad from same-origin `/experience/assets/yai-feed/` URLs (readyState 4, playback advancing).
- HEAD/GET both `/experience` and `/experience/` return 200 with `X-Yai-Experience-Origin: cloudflare`. The router normalizes the upstream entry path and follows its canonical redirect internally. Entry responses use `Cache-Control: no-store`, avoiding the former slash redirect loop. The homepage Experience → Meet Yai Agents path was verified in the browser.
- `/api/db-ping` returns `connected:true` against MongoDB Atlas.

**This is not yet complete provider-independent failover:**
- `M1_LLM_URL` still targets the Railway-hosted M1 guard. AI/simulated-factory services can fail if that service fails.
- `NEWSROOM_FEED_URL` still targets a Railway-hosted feed.
- Native Chromium/Puppeteer PDF generation is not validated on Workers and needs a supported alternative before promising PDF parity.
- Payment, sign-in, uploads and agent flows still require end-to-end checks. Do not trigger real payments as a smoke test.
- No automatic GitHub-to-Cloudflare deployment pipeline is configured yet. Publishing below is manual.

Do not market this as a complete replacement until remaining upstreams and critical flows are verified independently of Railway.

## Mandatory rule: one publisher; every other session waits

**Before any build/upload/publish to shared Worker `yai-backup`, acquire the shared Git deployment lock. No lock = no publish.** Sessions can continue editing and pushing their own feature branches while waiting, but cannot publish the shared Worker or change its secrets/routes. This is a cooperative lock: all sessions must follow this runbook; Cloudflare's dashboard does not enforce it automatically.

From the repository root:

```sh
python3 ops/cloudflare/deploy-lock.py status
python3 ops/cloudflare/deploy-lock.py acquire --owner YOUR_CHAT_ID --commit HEAD
```

`acquire` prints a lock token on success. Record it. If it reports **BUSY**, stop deployment and wait for the owner to release it. Do not create a second shared publisher. The remote Git ref is created atomically, so two machines cannot both acquire it. Do not use main as the lock ref.

The lock covers **final source refresh, build, upload, production checks and handoff**, not just upload. After acquiring, fetch/check main again and include previously merged work; do not publish a stale checkout that removes another session's update. Before the actual deployment, check ownership:

```sh
python3 ../ops/cloudflare/deploy-lock.py check --token YOUR_LOCK_TOKEN
```

The command above assumes the deployment working directory is `yaikh-com`. After successful live verification and a recorded handoff, release from the repository root:

```sh
python3 ops/cloudflare/deploy-lock.py release --token YOUR_LOCK_TOKEN
```

If publishing fails, the owner must report the failure and keep the lock until the deployment is stopped and the site is in a known state, then release it with the reason. A stale lock must never be stolen on a timer: inspect its owner, confirm no upload/deploy is running, and obtain the owner's handoff or the user's instruction. Release uses the exact token so one session cannot silently remove a different owner's lock. Preview Workers must have separate names and must not alter shared secrets or routes.

**Queue:** one designated integrator accepts session requests in FIFO order. Others wait for an explicit release. Git locking prevents overlap; FIFO order is coordinated by the integrator, not automatically scheduled by the script.

## 3. Publish an update to Cloudflare

Use a clean checkout of the latest integrated `origin/main`. Never upload another session's uncommitted work. Never use `railway redeploy` to publish the Cloudflare copy.

1. Fetch main. Create/reuse a suitable isolated managed worktree from `origin/main` (use the app worktree tool when available).
2. Confirm the intended commit and inspect its changes. Coordinate shared dashboard integration under MUST_READ.md; one integrator builds/publishes at a time.
3. If dashboard source changed, install its dependencies and run `npm run build` in `yaikh-dashboard`. This creates the CRA bundle under `yaikh-com/public/experience`. Verify the new feature is in that bundle.
4. In the isolated checkout, prepare the Next.js app:

```sh
cd yaikh-com
npm ci
npm install --save-dev @opennextjs/cloudflare@1.14.0 wrangler@4.151.3
cp ../ops/cloudflare/wrangler.jsonc ./wrangler.jsonc
cp ../ops/cloudflare/open-next.config.ts ./open-next.config.ts
node node_modules/@opennextjs/cloudflare/dist/cli/index.js build
python3 ../ops/cloudflare/prepare-assets.py
node node_modules/wrangler/bin/wrangler.js deploy --dry-run
node node_modules/wrangler/bin/wrangler.js deploy
```

Requirements: a supported Node.js version, npm, Python 3, ffmpeg and ffprobe. These commands modify dependencies only in the isolated deployment checkout. Review/commit any permanent deployment changes separately; do not overwrite the primary package lock blindly.

`prepare-assets.py` removes only unreferenced historical CRA bundles from generated Cloudflare assets and re-encodes videos above 25 MiB. It leaves repository originals unchanged. Re-run it after EVERY OpenNext build. Its video handling lowers resolution/bitrate to fit Cloudflare's asset limit. First upload can take several minutes; subsequent unchanged assets are reused.

Do not rerun the build after preparing media without preparing assets again. Do not invoke automatic Next.js migration/upgrade tools casually: the latest adapter rejected this app's Next.js 14 dependency. Revalidate pinned versions when upgrading.

The current Worker compressed bundle was approximately 2.81 MiB. Check plan limits on every upgrade; never purchase an upgrade or enable billable products without user approval.

## 4. Cloudflare authentication

```sh
node node_modules/wrangler/bin/wrangler.js whoami
```

Confirm the account ID above. If not authenticated:

```sh
node node_modules/wrangler/bin/wrangler.js login --browser=false --scopes account:read user:read workers:write workers_scripts:write workers_tail:read
```

Open the CLI-generated OAuth link in the user's browser. Explain the permissions and have the user approve the consent screen; do not paste credentials into chat. OAuth secrets live in Wrangler's credential store, not the repo. Do not read or copy the OAuth token into instructions.

Other products (DNS routes, R2, etc.) may require separate permissions. Do not request broad unrelated scopes just to remove CLI warnings.

## 5. Secrets — already configured

Fourteen application settings were copied to Cloudflare secrets after explicit user approval. Do not overwrite them on every deployment and do not put them into wrangler.jsonc, Git, public assets or chat output.

Names only:
`MONGO_URL`, `GEMINI_API_KEY`, `M1_LLM_URL`, `M1_LLM_TOKEN`, `NEWSROOM_FEED_URL`, `NEWSROOM_FEED_TOKEN`, `PAYWAY_API_KEY`, `PAYWAY_BASE_URL`, `PAYWAY_MERCHANT_ID`, `PAYWAY_RSA_PUBLIC_KEY`, `PAYWAY_TRANSACTION_LIFETIME_MINUTES`, `SUBSCRIPTION_INVOICE_REQUESTS_ENABLED`, `SUBSCRIPTION_KHR_PER_USD`, `SUBSCRIPTION_RECEIPTS_ENABLED`.

For replacements, use Cloudflare Worker secrets via Wrangler or dashboard. Never copy Railway system variables/private hostnames as application settings. Transfer secrets only to the authorized account/service, without printing values or storing a temporary plaintext export.

Railway reported a security incident and recommended credential rotation. Rotation has NOT been completed by this session. Coordinate new credentials at each provider and update both hosts before retiring old ones; take care not to break payments or database access. Do not treat copied credentials as confirmed uncompromised.

## 6. Verify before handing the URL to clients

1. Open standby `/experience/` visibly in the in-app browser.
2. Verify the requested change in the actual UI; capture a screenshot and include it in the handoff.
3. Open `/api/db-ping` and confirm `connected:true`. Do not stop at HTTP 200 alone.
4. Check one representative module with real read-only data and its sign-in behavior.
5. Check required image/video/document paths, nested dashboard routes and home navigation.
6. Verify AI and newsroom separately; their current Railway dependencies matter.
7. Record Git SHA, Worker version, URL, passed checks and outstanding issues.

Python urllib probes returned 403 from this environment while the same URLs worked in the browser. Do not declare the service down from that probe alone; inspect browser UI and Worker logs.

## 7. Switching traffic / returning to Railway

For now, manual fallback means sharing the Cloudflare URL. Keep both releases aligned; preserve compatible database schemas and ensure jobs, emails and scheduled actions do not run twice.

Changing `yaikh.com` DNS or enabling a traffic router is a separate operation. Verify domain/account access, TLS, host routing, cookies, upstream independence and health checks first. Prepare a reversible change and obtain any required approval; never change unrelated `ggmt.sg` routes.

When Railway resumes, deploy the SAME tested integrated commit there and verify it. Keep the Cloudflare standby available. Do not delete or roll back shared database data to switch application hosts.

## 8. Common errors

| Message | Action |
|---|---|
| Railway: deploys paused | Use the Cloudflare URL. Repeated Railway retries do not override the provider pause. |
| Asset too large / 25 MiB | Run generated-asset preparation after build; keep originals intact. |
| Compatibility date in the future | Use the tested `2026-10-19` setting; do not use tomorrow in the provider's UTC clock. |
| Worker bundle too large | Inspect compressed size and supported plan limits; do not silently enable billing. |
| Wrong/missing Apps tiles | Compare deployed manifest/commit and integrated CRA source. Refresh and verify the actual UI. |
| AI/newsroom fails while UI works | Inspect the documented Railway upstream dependency; do not call the entire standby healthy. |
| Mongo fails | Inspect encrypted configuration, TLS/network access and Worker logs; do not expose credentials or broadly weaken database access. |
