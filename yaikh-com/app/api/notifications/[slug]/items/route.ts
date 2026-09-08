/* /api/notifications/[slug]/items?topic=<pill> — drill-down list
 * for the 9 dynamic PAs. Returns up to 20 pending/in-progress tasks
 * for the requested pill so the chat can render them inline.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";
import { PILLS_BY_PA } from "@/lib/pa-pills";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const pills = PILLS_BY_PA[slug];
  if (!pills) {
    return NextResponse.json(
      { ok: false, error: `unknown PA slug: ${slug}` },
      { status: 404 },
    );
  }

  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");
  if (!topic || !pills.includes(topic)) {
    return NextResponse.json(
      { ok: false, error: `topic must be one of: ${pills.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const items = await db
      .collection("pa_tasks")
      .find({
        pa: slug,
        pill: topic,
        status: { $in: ["pending", "in_progress"] },
      })
      .sort({ created_at: 1 })
      .limit(20)
      .toArray();

    return NextResponse.json({
      ok: true,
      topic,
      items: items.map((t) => ({
        id: String(t._id),
        item_id: t.item_id,
        origin_pa: t.origin_pa,
        requester: t.requester,
        status: t.status,
        created_at: t.created_at,
        deadline: t.deadline,
        summary: t.summary || null,
      })),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
