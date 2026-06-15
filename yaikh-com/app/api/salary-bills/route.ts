/* /api/salary-bills
 *
 *   GET → list of salary bills (payroll batches + allowances)
 *
 *   POST { period, cycle, headcount, gross, nssf, tax, net, note, status? }
 *        → creates a new salary bill, auto-generates SAL-YYYY-MM-DD number
 *
 * Records live in Mongo collection `salary_bills`. Cambodia garment factory
 * pays staff on 10th + 25th of each month; NSSF + tax + permit fees layer on.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "salary_bills";

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection(COLLECTION)
      .find({})
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
    const { period, cycle, headcount, gross, nssf, tax, net, note, status, attachments } = body ?? {};

    if (!period || !cycle || typeof net !== "number") {
      return NextResponse.json(
        { ok: false, error: "period, cycle, net are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const now = new Date();
    const doc = {
      no: `SAL-${period.replace(/[^0-9]/g, "-")}`,
      period,
      cycle,
      headcount: headcount ?? 0,
      gross: gross ?? 0,
      nssf: nssf ?? 0,
      tax: tax ?? 0,
      net,
      paidVia: null,
      status: status ?? "Submitted",
      date: now.toISOString().slice(0, 10),
      note: note ?? "",
      attachments: Array.isArray(attachments) ? attachments : [],
      createdAt: now,
      updatedAt: now,
    };

    const r = await db.collection(COLLECTION).insertOne(doc);
    return NextResponse.json({ ok: true, id: r.insertedId, item: doc });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
