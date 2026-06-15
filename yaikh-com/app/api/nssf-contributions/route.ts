/* /api/nssf-contributions
 *
 *   GET  ?period=YYYY-MM&status=draft|submitted|paid
 *
 *   POST { period, run_date, worker_count, employer_share_usd, employee_share_usd,
 *          total_usd, status? }
 *        → creates a NSSF monthly batch record, auto-generates NSSF-YYYY-MM number
 *
 * NSSF = National Social Security Fund (Cambodia, https://enterprise.nssf.gov.kh).
 * Mandatory monthly contribution: 1.3% occupational risk (employer-only) +
 * 3.4% health care (2.6% employer + 0.8% employee) on insurable salary,
 * filed by the 15th of the following month.
 *
 * Records live in Mongo collection `nssf_contributions`. Owned by HR PA.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "nssf_contributions";

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
      period, run_date, worker_count, employer_share_usd,
      employee_share_usd, total_usd, status,
    } = body ?? {};

    if (!period || !/^\d{4}-\d{2}$/.test(period) || typeof worker_count !== "number") {
      return NextResponse.json(
        { ok: false, error: "period (YYYY-MM), worker_count are required" },
        { status: 400 }
      );
    }

    const no = `NSSF-${period}`;

    const db = await getDb();
    const col = db.collection(COLLECTION);
    const existing = await col.findOne({ no });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: `NSSF batch ${no} already exists` },
        { status: 409 }
      );
    }

    const employer = typeof employer_share_usd === "number" ? employer_share_usd : 0;
    const employee = typeof employee_share_usd === "number" ? employee_share_usd : 0;

    const now = new Date();
    const doc = {
      no,
      period,
      run_date: run_date ?? now.toISOString().slice(0, 10),
      worker_count,
      employer_share_usd: employer,
      employee_share_usd: employee,
      total_usd: typeof total_usd === "number" ? total_usd : employer + employee,
      status: status ?? "draft",
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
