/* /api/fire-alarm-sensors — per-sensor health for the floor-plan view */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const building = searchParams.get("building");
    const state    = searchParams.get("state");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (building) filter.building = building;
    if (state)    filter.state = state;

    const docs = await db
      .collection("fire_alarm_sensors")
      .find(filter)
      .sort({ building: 1, row: 1, col: 1 })
      .limit(2000)
      .toArray();

    return NextResponse.json({ ok: true, count: docs.length, items: docs });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
