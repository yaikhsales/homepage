/* /api/cctv-cameras — grid view of live cameras + face-detection alerts */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const zone   = searchParams.get("zone");
    const status = searchParams.get("status");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (zone)   filter.zone = zone;
    if (status) filter.status = status;

    const docs = await db
      .collection("cctv_cameras")
      .find(filter)
      .sort({ "grid.y": 1, "grid.x": 1 })
      .limit(200)
      .toArray();

    return NextResponse.json({ ok: true, count: docs.length, items: docs });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
