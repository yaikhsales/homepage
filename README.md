# Yai — yaikh.com

One repository, two apps:

| Folder | App | What it is | Port |
|---|---|---|---|
| `yaikh-com/` | Marketing site | Public homepage for www.yaikh.com — Ai-Native Manufacturing Intelligence Platform | 3001 |
| `yai-plan/` | Investor / partner portal | Password-gated strategic plan portal (deployed on Railway) | 3000 |

Both are Next.js 14 App Router projects. Each folder is self-contained —
`cd` into it, `npm install`, `npm run dev`.

## Quick start

```bash
# Marketing site → http://localhost:3001
cd yaikh-com && npm install && npm run dev

# Portal → http://localhost:3000
cd yai-plan && npm install && npm run dev
```

## Notes

- Secrets live in each app's `.env.local` (git-ignored). Required keys are
  documented inside each folder's README.
- `yai-plan` production runs on Railway from its original deployment;
  this monorepo is the combined source of truth going forward.
- Developed by Texlink Technologies Co., Ltd. — Phnom Penh, Cambodia.
