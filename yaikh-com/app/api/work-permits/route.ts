/* /api/work-permits
 *
 *   GET  ?employee_no=EMP-YYYY-NNNN&status=active|expired|renewed&expiring_within_days=30
 *
 *   POST { employee_no, permit_no?, issued_at, expires_at, fee_usd, mlvt_url?, status? }
 *        → creates a work permit record, auto-generates WP-YYYY-NNN number
 *
 * Cambodia MLVT (Ministry of Labour and Vocational Training) issues work permits
 * for foreign workers — annual renewal, fees vary by role/seniority. mlvt_url is
 * the e-receipt or status link from https://www.mlvt.gov.kh/ when available.
 *
 * Records live in Mongo collection `work_permits`. Owned by HR PA.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "work_permits";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const employee_no = searchParams.get("employee_no");
    const status = searchParams.get("status");
    const expiring_within_days = searchParams.get("expiring_within_days");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (employee_no) filter.employee_no = employee_no;
    if (status) filter.status = status;
    if (expiring_within_days) {
      const days = parseInt(expiring_within_days, 10);
      if (!isNaN(days)) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() + days);
        filter.expires_at = { $lte: cutoff.toISOString().slice(0, 10) };
        filter.status = "active";
      }
    }

    const docs = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ expires_at: 1, no: -1 })
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
    const { employee_no, permit_no, issued_at, expires_at, fee_usd, mlvt_url, status } = body ?? {};

    if (!employee_no || !issued_at || !expires_at) {
      return NextResponse.json(
        { ok: false, error: "employee_no, issued_at, expires_at are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection(COLLECTION);

    const year = new Date().getFullYear();
    const last = await col
      .find({ no: { $regex: `^WP-${year}-` } })
      .sort({ no: -1 })
      .limit(1)
      .toArray();
    const lastNum = last[0]?.no?.match(/(\d+)$/)?.[1];
    const nextNum = String((lastNum ? parseInt(lastNum, 10) : 0) + 1).padStart(3, "0");
    const no = `WP-${year}-${nextNum}`;

    const now = new Date();
    const doc = {
      no,
      employee_no,
      permit_no: permit_no ?? null,
      issued_at,
      expires_at,
      fee_usd: typeof fee_usd === "number" ? fee_usd : 0,
      mlvt_url: mlvt_url ?? null,
      status: status ?? "active",
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
