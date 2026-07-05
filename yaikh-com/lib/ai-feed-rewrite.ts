/**
 * Rewrites feed items in Yai's editorial voice using Gemini 2.5 Flash.
 *
 * One batched call per rebuild (revalidate=900 => ~4/hour), so per-day
 * cost stays in the pennies. If GEMINI_API_KEY is unset (e.g. local dev
 * without a key), the pass-through returns the original items verbatim
 * so the page still renders — never blocks on missing config.
 */

import { GoogleGenAI, Type } from "@google/genai";

const MODEL = "gemini-2.5-flash";
const MAX_OUTPUT_TOKENS = 4096;

type RewriteInput = {
  source: string;
  title: string;
  summary: string;
};

type RewriteOutput = {
  title: string;
  summary: string;
};

const SYSTEM = `You are the editor of "Yai Ai feed" — a live Ai news brief for a
manufacturing-industry audience (garment, footwear, bags, softgoods factories
in Cambodia and Asia). Rewrite each incoming headline and summary in a
punchy, factual editorial voice.

Rules:
- Never invent facts, quotes, numbers or entities. Only reshape what's given.
- Title: <= 85 characters. Present tense. Concrete. No clickbait, no emoji, no all-caps.
- Summary: 1–2 sentences (<= 240 characters total). Plain English. If the story
  has an obvious relevance angle for factory operators, hint at it in one clause.
- Preserve any proper nouns exactly as written.
- Return ONLY a JSON array in the same order as the input.`;

function passthrough(items: RewriteInput[]): RewriteOutput[] {
  return items.map((it) => ({ title: it.title, summary: it.summary }));
}

export async function rewriteBatch(items: RewriteInput[]): Promise<RewriteOutput[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || items.length === 0) return passthrough(items);

  const ai = new GoogleGenAI({ apiKey });

  const userJson = JSON.stringify(
    items.map((it, i) => ({ i, source: it.source, title: it.title, summary: it.summary })),
    null,
    2
  );

  try {
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: [
        { role: "user", parts: [{ text: `${SYSTEM}\n\nInput:\n${userJson}` }] },
      ],
      config: {
        temperature: 0.4,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        // Thinking tokens count against maxOutputTokens on 2.5 Flash —
        // structured rewriting needs the budget for output, not deliberation.
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
            },
            required: ["title", "summary"],
          },
        },
      },
    });

    const text = res.text?.trim();
    if (!text) return passthrough(items);
    const parsed = JSON.parse(text) as RewriteOutput[];
    if (!Array.isArray(parsed) || parsed.length !== items.length) {
      return passthrough(items);
    }
    // Guarantee we never lose an item: use rewrite when both fields present,
    // fall back to the raw one otherwise.
    return parsed.map((p, i) => ({
      title: p.title?.trim() || items[i].title,
      summary: p.summary?.trim() || items[i].summary,
    }));
  } catch (err) {
    console.error("[ai-feed-rewrite] Gemini call failed:", err);
    return passthrough(items);
  }
}
