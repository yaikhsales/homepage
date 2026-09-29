# Work order · take Google Gemini out of Yai, run everything on the M1

Written 2026-09-29. Every line below was read from the code in this repo on that
date — file and line numbers are exact. Hand this to the session that owns the
chat stack.

**Why now:** Yai stopped using Gemini as a product decision a year ago, but the
code never followed. The Gemini calls are still wired, the Google credits are
exhausted, so the paths that fall through to Gemini now fail in front of
visitors. Separately, a live Google API key is hard-coded in a **public** repo.

---

## 0 · Do this first — leaked credentials (public repo)

`yaikh-dashboard/src/chatbot/gemini-api.js:7` hard-codes a Google API key
(`AQ.Ab8RN6…`) inside `getGeminiApiKey()`, two lines under a comment that says
never to do it. It is compiled into the shipped bundle:
`yaikh-com/public/experience/static/js/main.c4ed2d8b.js` — served to every
visitor of yaikh.com/experience.

The same bundle carries the M1 bearer token (`REACT_APP_M1_LLM_TOKEN`,
`gemini-api.js:23`) and the M1 URL. Anything `REACT_APP_*` is public by
definition — that token lets anyone call `llm.ggmt.sg`.

1. Revoke the Google key in AI Studio.
2. Rotate the M1 token in the FastAPI guard.
3. Remove both from the frontend; the browser should only call same-origin
   `/api/…`, with the token held server-side.

This is worth doing today even if nothing else on this list is.

---

## 1 · The 13 PAs still run on Gemini — this is the outage

`yaikh-com/lib/ai-chat.ts`

| line | what it does |
|------|--------------|
| 18 | `import { GoogleGenAI } from "@google/genai"` |
| 22 | `const MODEL = "gemini-2.5-flash"` |
| 52 | reads `GEMINI_API_KEY` |
| 108 | `new GoogleGenAI({ apiKey })` |
| 127 | `ai.models.generateContent({ … systemInstruction: cfg.systemPrompt })` |

Replace the client with a server-side `fetch` to the M1 guard's
`/v1/chat/claude`. Keep `runChat()`'s signature and return shape so callers do
not change; map `systemInstruction` → the worker's system prompt, and read the
token from `process.env.M1_LLM_TOKEN` (server-only, never `REACT_APP_*`).

## 2 · M1 worker: serve PAs, not just Big Brain

The worker currently answers Big Brain. For the PAs it needs to accept a PA id,
that PA's system prompt and its data block, and read that PA's slice of
`rag_index.pa_docs`. Owner: whoever has SSH to the M1 — not this Mac.

## 3 · Provider errors are shown to visitors

`yaikh-com/app/api/ai-chat/[pa]/route.ts:46-49` returns `err.message` straight
to the browser. That is how Google's billing text and `RESOURCE_EXHAUSTED`
appeared inside a chat bubble. Log the detail server-side; return a plain
"assistant unavailable" to the client.

## 4 · The browser still calls Google directly

Remove these call sites and route them through `/api/ai-chat/<pa>`:

- `yaikh-dashboard/src/general-ag.js:24-25` (imports), `:827`
  (`generateGeminiResponseWithFiles`), `:872` (`generateGeminiResponse`)
- `yaikh-dashboard/src/chatbot/bot-modules.js:11` (import), `:5246`
  (`generateDirectGeminiResponse`), `:5253` (`generateGeminiResponse`)
- `yaikh-dashboard/src/chatbot/bot-version2.js:21` (import)
- `yaikh-dashboard/src/chatbot/GMChat.js:3`, `:102`

Note what is already correct in `gemini-api.js`: every surface tries M1 first —
`/pa/query` then `/v1/chat/completions` for the PAs, `/v1/chat/claude` then
`/boss/query` for Big Brain. Gemini is only reached when M1 is unreachable,
returns non-OK, or is inside the `m1SkipUntil` cooldown. Cutting Gemini out means
deleting the fallback, not rewiring the primary path.

## 5 · Rebuild, or nothing ships

`/experience` serves the prebuilt CRA in `yaikh-com/public/experience/`. Run
`npm run build` in `yaikh-dashboard` and commit the rebuilt bundle with the
source, or the push looks successful and changes nothing on Railway. This is
also what finally removes the leaked key from the served JavaScript.

## 6 · Big Brain intro swallows real questions

A question asked during the intro gets a scripted reply with no LLM call. Let a
real question during the intro pass through to Claude.

---

## Still on Gemini, not urgent

- `yaikh-com/lib/ai-feed-rewrite.ts`
- `yaikh-com/lib/ai-feed-podcast.ts` (`app/api/ai-feed/podcast/route.ts`)
- `yaikh-com/lib/ai-feed.ts`
- `yaikh-com/scripts/generate-*.mjs` — image and avatar tooling

These are build-time or background jobs; no visitor sees them fail. Move them
after the chat path is clean.

---

## Order of work

1. Revoke the Google key, rotate the M1 token (§0)
2. `lib/ai-chat.ts` → M1 (§1) and stop leaking provider errors (§3)
3. M1 worker accepts PA requests (§2)
4. Delete the browser-side Gemini calls (§4)
5. `npm run build` in `yaikh-dashboard`, commit both (§5)
6. Big Brain intro (§6)
