/* POST /api/events/translate-title — Khmer for an event title, to check
 * before saving. Session-gated: only staff creating events call it, and it
 * spends Gemini quota. */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { translateTitleToKhmer } from "@/lib/khmer-title";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!verifySession(cookies().get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  let title = "";
  try {
    const body = await request.json();
    title = typeof body?.title === "string" ? body.title.trim().slice(0, 200) : "";
  } catch { /* fall through */ }
  if (title.length < 2) {
    return NextResponse.json({ ok: false, error: "Type the English title first." }, { status: 400 });
  }
  try {
    const { km, back } = await translateTitleToKhmer(title);
    return NextResponse.json({ ok: true, km, back });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Translation failed." },
      { status: 502 }
    );
  }
}
