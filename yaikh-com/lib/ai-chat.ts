/* Gemini-backed chat helper for the Yai PA agents.
 *
 * Flow:
 *   1. Caller passes paSlug + user message (+ optional chat history).
 *   2. We look up the PA's config (collections it owns + system prompt).
 *   3. Fetch the most recent N docs from each owned collection. Attachments
 *      are stripped (base64 images would blow the token budget).
 *   4. Build a structured-data block and prepend it as the model's first
 *      reply context, then add history + user message.
 *   5. Call Gemini 2.5 Flash via @google/genai with GEMINI_API_KEY.
 *   6. Return the reply text + the model name we used + token counts (for
 *      cost tracking later).
 *
 * Key handling: GEMINI_API_KEY is server-only — never exposed to the
 * browser. If it's missing we throw a clear error pointing at .env.local.
 */

import { GoogleGenAI } from "@google/genai";
import { getDb } from "@/lib/mongo";
import { getPaConfig, type PaConfig } from "@/lib/pa-mapping";

const MODEL = "gemini-2.5-flash";
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

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to yaikh-com/.env.local (AI Studio → Create API key)."
    );
  }
  return key;
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

export async function runChat(req: ChatRequest): Promise<ChatResult> {
  const cfg = getPaConfig(req.paSlug);
  if (!cfg) {
    throw new Error(`Unknown PA slug: ${req.paSlug}`);
  }

  const apiKey = getApiKey();
  const { block, stats } = await buildMongoContext(cfg);

  const ai = new GoogleGenAI({ apiKey });

  // Build the conversation. First "user/model" pair carries the data context
  // so subsequent turns can reference it without re-sending it every time.
  const contents: Array<{ role: "user" | "model"; parts: { text: string }[] }> = [
    { role: "user", parts: [{ text: block }] },
    { role: "model", parts: [{ text: "Got it — I'll use these records as ground truth." }] },
  ];

  // Append prior history (most recent ~10 turns to stay cheap).
  if (req.history && req.history.length) {
    for (const h of req.history.slice(-10)) {
      contents.push({ role: h.role, parts: [{ text: h.text }] });
    }
  }

  // Final user turn.
  contents.push({ role: "user", parts: [{ text: req.message }] });

  const result = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction: cfg.systemPrompt,
      temperature: 0.4,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    },
  });

  const reply =
    typeof result.text === "string"
      ? result.text
      : (result.candidates?.[0]?.content?.parts?.[0]?.text ?? "");

  const usageRaw = (result as unknown as { usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; totalTokenCount?: number } }).usageMetadata;
  const usage = usageRaw
    ? {
        promptTokens: usageRaw.promptTokenCount,
        candidatesTokens: usageRaw.candidatesTokenCount,
        totalTokens: usageRaw.totalTokenCount,
      }
    : undefined;

  return {
    ok: true,
    reply: reply || "(Empty reply — the model returned no text. Try rephrasing.)",
    model: MODEL,
    contextStats: stats,
    usage,
  };
}
