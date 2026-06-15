/* /api/payroll-runs
 *
 *   GET  ?period=YYYY-MM&status=draft|finalized|paid
 *
 *   POST { period, run_date, worker_count, gross_total_usd, deductions_total_usd,
 *          net_total_usd, nssf_total_usd, status?, paid_via?, salary_bill_no? }
 *        → creates a payroll run record, auto-generates PAY-YYYY-MM number
 *
 * Boundary contract — HR owns the CALCULATION (this collection), Accounting
 * owns the BILL (`salary_bills` collection). When this run is finalized,
 * HR hands off to Accounting by setting `salary_bill_no` to the SAL-YYYY-NNN
 * record that pays this run. Payment via ABA bulk transfer or Wing.
 *
 * Cambodia garment factory cadence: monthly run on the 25th, paid by month-end.
 *
 * Records live in Mongo collection `payroll_runs`. Owned by HR PA.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "payroll_runs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period");
    const status = searchParams.get("status");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (period) filter.period = period;
    if (status) filter.status = status;

    const docs = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ period: -1 })
      .limit(60)
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
    const {
      period, run_date, worker_count, gross_total_usd, deductions_total_usd,
      net_total_usd, nssf_total_usd, status, paid_via, salary_bill_no,
    } = body ?? {};

    if (!period || !/^\d{4}-\d{2}$/.test(period) || typeof worker_count !== "number" || typeof gross_total_usd !== "number") {
      return NextResponse.json(
        { ok: false, error: "period (YYYY-MM), worker_count, gross_total_usd are required" },
        { status: 400 }
      );
    }

    const no = `PAY-${period}`;

    const db = await getDb();
    const col = db.collection(COLLECTION);
    const existing = await col.findOne({ no });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: `Payroll run ${no} already exists` },
        { status: 409 }
      );
    }

    const now = new Date();
    const doc = {
      no,
      period,
      run_date: run_date ?? now.toISOString().slice(0, 10),
      worker_count,
      gross_total_usd,
      deductions_total_usd: deductions_total_usd ?? 0,
      net_total_usd: net_total_usd ?? gross_total_usd - (deductions_total_usd ?? 0),
      nssf_total_usd: nssf_total_usd ?? 0,
      status: status ?? "draft",
      paid_via: paid_via ?? null,
      salary_bill_no: salary_bill_no ?? null,
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
