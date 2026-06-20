/* /api/gate-passes — list gate-control records for the Admin module page.
 *
 *   GET ?type=worker-in|worker-out|truck-in|truck-out|material-in|material-out|visitor
 *       &status=open|closed|in|out
 *       &date=YYYY-MM-DD
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type   = searchParams.get("type");
    const status = searchParams.get("status");
    const date   = searchParams.get("date");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (type)   filter.type = type;
    if (status) filter.status = status;
    if (date)   filter.date = date;

    const docs = await db
      .collection("gate_passes")
      .find(filter)
      .sort({ time: -1, _id: -1 })
      .limit(300)
      .toArray();

    return NextResponse.json({ ok: true, count: docs.length, items: docs });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
