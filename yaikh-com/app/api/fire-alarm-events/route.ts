/* /api/fire-alarm-events — list life-safety events for the Admin module page. */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type   = searchParams.get("type");
    const status = searchParams.get("status");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (type)   filter.type = type;
    if (status) filter.status = status;

    const docs = await db
      .collection("fire_alarm_events")
      .find(filter)
      .sort({ detectedAt: -1, _id: -1 })
      .limit(200)
      .toArray();

    return NextResponse.json({ ok: true, count: docs.length, items: docs });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
