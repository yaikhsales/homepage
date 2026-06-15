/* /api/shipping-bills
 *
 *   GET  ?category=cargo-clearance|gate-clearance|equipment|worker-fees|customs
 *        → list of shipping bills (optionally filtered)
 *
 *   POST { vendor, category, ref, description, amount, status? }
 *        → creates a new shipping bill, auto-generates SB-YYYY-NNN number
 *
 * All records live in Mongo collection `shipping_bills` on the yaikhhomepage
 * Atlas cluster. Status flows through: Submitted → Manager Approved →
 * Accounting Verified → Reimbursed.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "shipping_bills";

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
    const { vendor, category, ref, description, amount, status, attachments } = body ?? {};

    if (!vendor || !category || !description || typeof amount !== "number") {
      return NextResponse.json(
        { ok: false, error: "vendor, category, description, amount are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection(COLLECTION);

    // Next sequential number for SB-YYYY-NNN
    const year = new Date().getFullYear();
    const last = await col
      .find({ no: { $regex: `^SB-${year}-` } })
      .sort({ no: -1 })
      .limit(1)
      .toArray();
    const lastNum = last[0]?.no?.match(/(\d+)$/)?.[1];
    const nextNum = String((lastNum ? parseInt(lastNum, 10) : 100) + 1).padStart(3, "0");
    const no = `SB-${year}-${nextNum}`;

    const now = new Date();
    const doc = {
      no,
      vendor,
      category,
      ref: ref ?? "",
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
