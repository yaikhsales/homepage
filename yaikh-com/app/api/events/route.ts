/* /api/events — read-only list of upcoming task events.
 *
 * Reads from Mongo collection `yaikh.task_events`, populated by the
 * telegram scout (_strategy-board/telegram/scout.py). Returns events
 * dated today or later, sorted by date ascending, capped at 500.
 *
 * Requires a valid yai_session cookie — same gate as the /task page.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { getDb } from "@/lib/mongo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const viewer = verifySession(cookies().get(COOKIE_NAME)?.value);
  if (!viewer) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const rows = await db
      .collection("task_events")
      .find({ date: { $gte: iso } })
      .sort({ date: 1 })
      .limit(500)
      .toArray();

    const events = rows.map((r) => {
      const slug: string = r.sourceSlug || "";
      return {
        id: String(r._id),
        date: r.date,
        title: r.titleEn || r.title,       // prefer EN; fallback to original
        titleOriginal: r.title,            // keep the KM original around
        kind: r.kind,
        source: r.source,
        sourceSlug: slug,
        logo: slug ? `/task-logos/${slug}.jpg` : "",
        status: r.status || "proposed",
        venue: r.venue || "",
        time: r.time || "",
        link: r.link || "",
      };
    });

    return NextResponse.json(
      { ok: true, count: events.length, events },
      { headers: { "Cache-Control": "private, max-age=30" } }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
