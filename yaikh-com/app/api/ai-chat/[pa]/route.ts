/* /api/ai-chat/[pa]
 *
 *   POST { message: string, history?: { role, text }[] }
 *
 *   → calls Gemini 2.5 Flash via @google/genai with GEMINI_API_KEY,
 *     reading recent docs from the PA's owned Mongo collections as
 *     ground-truth context. Returns NL reply + usage stats.
 *
 * Routing: dynamic by PA slug. Only slugs registered in
 * lib/pa-mapping.ts → PA_REGISTRY are accepted (we start with
 * "accounting" — others come online as their wiring lands).
 *
 * Errors that block (400/500) come back as { ok: false, error }.
 */

import { NextResponse } from "next/server";
import { runChat, type ChatMessage } from "@/lib/ai-chat";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

type Params = { params: { pa: string } };

export async function POST(req: Request, { params }: Params) {
  const { pa } = params;
  try {
    const body = await req.json().catch(() => ({}));
    const message: string | undefined = body?.message;
    const history: ChatMessage[] | undefined = body?.history;

    if (typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "Body must include a non-empty `message` string." },
        { status: 400 }
      );
    }

    const result = await runChat({
      paSlug: pa,
      message: message.trim(),
      history: Array.isArray(history) ? history : undefined,
    });

    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = msg.startsWith("Unknown PA slug") ? 404 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
