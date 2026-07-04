/**
 * GET /api/ai-feed/podcast/audio → streams today's episode WAV from Mongo.
 * Serves bytes only — generation happens via POST /api/ai-feed/podcast.
 */

import { NextResponse } from "next/server";
import { getEpisodeAudio, todayKey } from "@/lib/ai-feed-podcast";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const audio = await getEpisodeAudio(todayKey());
    if (!audio) {
      return NextResponse.json({ ok: false, error: "no episode ready" }, { status: 404 });
    }
    return new NextResponse(new Uint8Array(audio), {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": String(audio.length),
        // Same episode all day — let the browser/CDN cache it.
        "Cache-Control": "public, max-age=900",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
