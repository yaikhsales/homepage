/* /api/interviews
 *
 *   GET  ?candidate_no=CAN-YYYY-NNN&outcome=pending|pass|fail
 *
 *   POST { candidate_no, scheduled_at, line_leader, location?, outcome?, score?, notes? }
 *        → creates an interview record, auto-generates INT-YYYY-NNN number
 *
 * Cambodia garment factory context: interviews are usually done at the factory
 * by the line leader / production supervisor for sewing operators; HR-only for
 * office roles. Walk-in candidates often interview same-day.
 *
 * Records live in Mongo collection `interviews`. Owned by HR PA.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "interviews";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const candidate_no = searchParams.get("candidate_no");
    const outcome = searchParams.get("outcome");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (candidate_no) filter.candidate_no = candidate_no;
    if (outcome) filter.outcome = outcome;

    const docs = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ scheduled_at: -1, no: -1 })
      .limit(200)
      .toArray();

    return NextResponse.json({ ok: true, count: docs.length, items: docs });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { candidate_no, scheduled_at, line_leader, location, outcome, score, notes } = body ?? {};

    if (!candidate_no || !scheduled_at || !line_leader) {
      return NextResponse.json(
        { ok: false, error: "candidate_no, scheduled_at, line_leader are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection(COLLECTION);

    const year = new Date().getFullYear();
    const last = await col
      .find({ no: { $regex: `^INT-${year}-` } })
      .sort({ no: -1 })
      .limit(1)
      .toArray();
    const lastNum = last[0]?.no?.match(/(\d+)$/)?.[1];
    const nextNum = String((lastNum ? parseInt(lastNum, 10) : 0) + 1).padStart(3, "0");
    const no = `INT-${year}-${nextNum}`;

    const now = new Date();
    const doc = {
      no,
      candidate_no,
      scheduled_at,
      line_leader,
      location: location ?? "Factory floor",
      outcome: outcome ?? "pending",
      score: typeof score === "number" ? score : null,
      notes: notes ?? null,
      createdAt: now,
      updatedAt: now,
    };

    const r = await col.insertOne(doc);
    return NextResponse.json({ ok: true, id: r.insertedId, item: doc });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
