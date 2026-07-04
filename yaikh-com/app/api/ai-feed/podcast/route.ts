/**
 * GET  /api/ai-feed/podcast  → today's episode status (never triggers TTS —
 *                              crawlers hitting GET must not cost money).
 * POST /api/ai-feed/podcast  → generate today's episode if missing
 *                              (idempotent; concurrent calls share one claim).
 */

import { NextResponse } from "next/server";
import { getEpisodeMeta, ensureEpisode, todayKey } from "@/lib/ai-feed-podcast";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function unconfigured(): NextResponse | null {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { ok: false, reason: "unconfigured", error: "GEMINI_API_KEY not set on this deployment" },
      { status: 503 }
    );
  }
  if (!process.env.MONGO_URL) {
    return NextResponse.json(
      { ok: false, reason: "unconfigured", error: "MONGO_URL not set on this deployment" },
      { status: 503 }
    );
  }
  return null;
}

export async function GET() {
  const bad = unconfigured();
  if (bad) return bad;
  try {
    const meta = await getEpisodeMeta(todayKey());
    return NextResponse.json({ ok: true, exists: !!meta, episode: meta });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function POST() {
  const bad = unconfigured();
  if (bad) return bad;
  try {
    const meta = await ensureEpisode(todayKey());
    const status = meta.status === "failed" ? 500 : 200;
    return NextResponse.json({ ok: meta.status !== "failed", episode: meta }, { status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
