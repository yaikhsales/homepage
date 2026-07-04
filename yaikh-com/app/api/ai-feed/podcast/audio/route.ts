/**
 * GET /api/ai-feed/podcast/audio[?date=YYYY-MM-DD]
 * Streams an episode's WAV from Mongo. Defaults to today. Serves bytes
 * only — generation happens via POST /api/ai-feed/podcast.
 */

import { NextRequest, NextResponse } from "next/server";
import { getEpisodeAudio, todayKey } from "@/lib/ai-feed-podcast";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const raw = req.nextUrl.searchParams.get("date");
    const date = raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : todayKey();
    const audio = await getEpisodeAudio(date);
    if (!audio) {
      return NextResponse.json({ ok: false, error: "no episode ready" }, { status: 404 });
    }
    const isPast = date < todayKey();
    return new NextResponse(new Uint8Array(audio), {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": String(audio.length),
        // Past episodes never change; today's can be re-cut if generation reruns.
        "Cache-Control": isPast ? "public, max-age=86400, immutable" : "public, max-age=900",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
