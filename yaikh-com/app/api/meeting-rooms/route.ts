/* /api/meeting-rooms — read meeting-room bookings for the Admin module page */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const room     = searchParams.get("room");
    const category = searchParams.get("category");
    const status   = searchParams.get("status");
    const date     = searchParams.get("date");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (room)     filter.room = room;
    if (category) filter.category = category;
    if (status)   filter.status = status;
    if (date)     filter.date = date;

    const docs = await db
      .collection("meeting_rooms")
      .find(filter)
      .sort({ date: 1, start: 1 })
      .limit(200)
      .toArray();

    return NextResponse.json({ ok: true, count: docs.length, items: docs });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
