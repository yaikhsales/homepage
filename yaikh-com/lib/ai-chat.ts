/* Chat helper for the Yai PA agents — runs on our own M1 (llm.ggmt.sg).
 *
 * Flow:
 *   1. Caller passes paSlug + user message (+ optional chat history).
 *   2. We look up the PA's config (collections it owns + system prompt).
 *   3. Fetch the most recent N docs from each owned collection. Attachments
 *      are stripped (base64 images would blow the token budget).
 *   4. Ask the M1 guard, in order:
 *        a. POST /pa/query          — the PA-aware, Mongo-grounded route.
 *        b. POST /v1/chat/completions — generic chat, with the PA system
 *           prompt + the data block as the system message.
 *      Whichever answers first wins. There is no third-party fallback: if
 *      the M1 is down the caller gets an error and shows "unavailable".
 *
 * Google Gemini was removed on 2026-09-29 — Yai runs its own models.
 *
 * Env (server-only, never REACT_APP_/NEXT_PUBLIC_):
 *   M1_LLM_URL    e.g. https://llm.ggmt.sg
 *   M1_LLM_TOKEN  bearer token for the FastAPI guard
 *   M1_LLM_MODEL  optional, defaults to qwen2.5-3b-instruct
 */

import { getDb } from "@/lib/mongo";
import { getPaConfig, type PaConfig } from "@/lib/pa-mapping";

const M1_URL = (process.env.M1_LLM_URL || "").replace(/\/$/, "");
const M1_TOKEN = process.env.M1_LLM_TOKEN || "";
const M1_MODEL = process.env.M1_LLM_MODEL || "qwen2.5-3b-instruct";
const M1_TIMEOUT_MS = Number(process.env.M1_LLM_TIMEOUT_MS || 20000);
const MAX_OUTPUT_TOKENS = 1024;

export type ChatMessage = {
  role: "user" | "model";
  text: string;
};

export type ChatRequest = {
  paSlug: string;
  message: string;
  history?: ChatMessage[];
};

export type ChatResult = {
  ok: true;
  reply: string;
  model: string;
  contextStats: {
    collection: string;
    count: number;
  }[];
  usage?: {
    promptTokens?: number;
    candidatesTokens?: number;
    totalTokens?: number;
  };
};

/** Thrown when the M1 cannot answer. The route turns this into a neutral
 *  "assistant unavailable" for the browser — provider detail stays in the log. */
export class AssistantUnavailableError extends Error {
  constructor(public readonly detail: string) {
    super("assistant-unavailable");
    this.name = "AssistantUnavailableError";
  }
}

function requireM1(): void {
  if (!M1_URL || !M1_TOKEN) {
    throw new AssistantUnavailableError(
      "M1_LLM_URL / M1_LLM_TOKEN are not set (Railway → yaikh-com → Variables)."
    );
  }
}

async function postM1(path: string, body: unknown): Promise<Response> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), M1_TIMEOUT_MS);
  try {
    return await fetch(`${M1_URL}${path}`, {
      method: "POST",
      signal: ctl.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${M1_TOKEN}`,
      },
      body: JSON.stringify(body),
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Strip attachments + ObjectIds for token-budget safety. */
function leanForContext(doc: Record<string, unknown>): Record<string, unknown> {
  const { _id, attachments, createdAt, updatedAt, ...rest } = doc as Record<string, unknown>;
  // Keep _id stringified for reference but drop attachments entirely
  return { id: String(_id ?? ""), ...rest };
}

async function buildMongoContext(
  cfg: PaConfig
): Promise<{ block: string; stats: { collection: string; count: number }[] }> {
  const db = await getDb();
  const stats: { collection: string; count: number }[] = [];
  const sections: string[] = [];

  for (const name of cfg.collections) {
    const docs = await db
      .collection(name)
      .find({})
      .sort({ date: -1, no: -1, createdAt: -1 })
      .limit(cfg.contextLimitPerCollection)
      .toArray();
    stats.push({ collection: name, count: docs.length });
    if (docs.length === 0) {
      sections.push(`## ${name} (empty)`);
    } else {
      const lean = docs.map(leanForContext);
      sections.push(`## ${name} (${docs.length} most recent)\n\`\`\`json\n${JSON.stringify(lean, null, 2)}\n\`\`\``);
    }
  }

  const block =
    `Below is the current state of your Mongo collections. Use this as the ground truth for all answers. ` +
    `Records are sorted newest-first.\n\n` +
    sections.join("\n\n");

  return { block, stats };
}

/** a. /pa/query — the guard's PA-aware route (grounded on rag_index.pa_docs). */
async function askPaQuery(
  paSlug: string,
  req: ChatRequest
): Promise<{ reply: string; model: string } | null> {
  try {
    const r = await postM1("/pa/query", {
      pa: paSlug,
      question: req.message,
      history: (req.history || []).slice(-6).map((m) => ({
        from: m.role === "user" ? "user" : "bot",
        text: m.text,
      })),
    });
    if (!r.ok) return null;
    const data = (await r.json()) as { answer?: string; model?: string };
    const answer = typeof data?.answer === "string" ? data.answer.trim() : "";
    return answer ? { reply: answer, model: data.model || "m1/pa-query" } : null;
  } catch {
    return null;
  }
}

/** b. /v1/chat/completions — generic chat with the PA prompt + data block. */
async function askCompletions(
  cfg: PaConfig,
  block: string,
  req: ChatRequest
): Promise<{ reply: string; model: string; usage?: ChatResult["usage"] }> {
  const messages = [
    { role: "system", content: `${cfg.systemPrompt}\n\n${block}` },
    ...(req.history || []).slice(-10).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    })),
    { role: "user", content: req.message },
  ];

  const r = await postM1("/v1/chat/completions", {
    model: M1_MODEL,
    messages,
    temperature: 0.4,
    max_tokens: MAX_OUTPUT_TOKENS,
  });

  if (!r.ok) {
    throw new AssistantUnavailableError(`M1 /v1/chat/completions returned ${r.status}`);
  }

  const data = (await r.json()) as {
    choices?: { message?: { content?: string } }[];
    model?: string;
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  };
  const reply = data?.choices?.[0]?.message?.content?.trim() ?? "";
  if (!reply) {
    throw new AssistantUnavailableError("M1 returned an empty completion");
  }
  return {
    reply,
    model: data.model || M1_MODEL,
    usage: data.usage
      ? {
          promptTokens: data.usage.prompt_tokens,
          candidatesTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        }
      : undefined,
  };
}

export async function runChat(req: ChatRequest): Promise<ChatResult> {
  const cfg = getPaConfig(req.paSlug);
  if (!cfg) {
    throw new Error(`Unknown PA slug: ${req.paSlug}`);
  }

  requireM1();
  const { block, stats } = await buildMongoContext(cfg);

  const grounded = await askPaQuery(req.paSlug, req);
  if (grounded) {
    return { ok: true, reply: grounded.reply, model: grounded.model, contextStats: stats };
  }

  const completion = await askCompletions(cfg, block, req);
  return {
    ok: true,
    reply: completion.reply,
    model: completion.model,
    contextStats: stats,
    usage: completion.usage,
  };
}
