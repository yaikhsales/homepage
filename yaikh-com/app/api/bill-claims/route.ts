/* /api/bill-claims
 *
 *   GET  ?category=petrol|meal|transport|coffee|courier|parking
 *        → list of bill claims (optionally filtered)
 *
 *   POST { claimant, dept, category, description, amount, status? }
 *        → creates a new claim, auto-generates BC-YYYY-NNN number
 *
 * Records live in Mongo collection `bill_claims`. These are small
 * petty-cash items that don't go through the PR/3-quotation process.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "bill_claims";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;

    const docs = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ date: -1, no: -1 })
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
    const { claimant, dept, category, description, amount, status, attachments } = body ?? {};

    if (!claimant || !dept || !category || !description || typeof amount !== "number") {
      return NextResponse.json(
        { ok: false, error: "claimant, dept, category, description, amount are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection(COLLECTION);

    const year = new Date().getFullYear();
    const last = await col
      .find({ no: { $regex: `^BC-${year}-` } })
      .sort({ no: -1 })
      .limit(1)
      .toArray();
    const lastNum = last[0]?.no?.match(/(\d+)$/)?.[1];
    const nextNum = String((lastNum ? parseInt(lastNum, 10) : 10) + 1).padStart(3, "0");
    const no = `BC-${year}-${nextNum}`;

    const now = new Date();
    const doc = {
      no,
      claimant,
      dept,
      category,
      description,
      amount,
      status: status ?? "Submitted",
      date: now.toISOString().slice(0, 10),
      attachments: Array.isArray(attachments) ? attachments : [],
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
