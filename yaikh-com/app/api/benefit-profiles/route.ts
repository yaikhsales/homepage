/* /api/benefit-profiles
 *
 *   GET  ?employee_no=EMP-YYYY-NNNN
 *
 *   POST { employee_no, base_salary_usd, attendance_bonus_usd?, seniority_usd?,
 *          transport_usd?, meal_usd?, rice_allowance_usd?, effective_from, effective_to? }
 *        → creates a benefit profile snapshot, auto-generates BP-YYYY-NNN number
 *
 * Cambodia garment factory context: 2026 minimum wage for garment workers
 * is $204/month. Typical add-ons: attendance bonus $10 (paid only if 0 absences),
 * seniority $2/year, transport $7, meal $0.50/day, rice allowance $5.
 *
 * A worker can have multiple records over time — the active one is the most
 * recent where effective_to is null or in the future.
 *
 * Records live in Mongo collection `benefit_profiles`. Owned by HR PA.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "benefit_profiles";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const employee_no = searchParams.get("employee_no");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (employee_no) filter.employee_no = employee_no;

    const docs = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ effective_from: -1, no: -1 })
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
    const {
      employee_no, base_salary_usd, attendance_bonus_usd, seniority_usd,
      transport_usd, meal_usd, rice_allowance_usd, effective_from, effective_to,
    } = body ?? {};

    if (!employee_no || typeof base_salary_usd !== "number" || !effective_from) {
      return NextResponse.json(
        { ok: false, error: "employee_no, base_salary_usd, effective_from are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection(COLLECTION);

    const year = new Date().getFullYear();
    const last = await col
      .find({ no: { $regex: `^BP-${year}-` } })
      .sort({ no: -1 })
      .limit(1)
      .toArray();
    const lastNum = last[0]?.no?.match(/(\d+)$/)?.[1];
    const nextNum = String((lastNum ? parseInt(lastNum, 10) : 0) + 1).padStart(3, "0");
    const no = `BP-${year}-${nextNum}`;

    const now = new Date();
    const doc = {
      no,
      employee_no,
      base_salary_usd,
      attendance_bonus_usd: attendance_bonus_usd ?? 10,
      seniority_usd: seniority_usd ?? 0,
      transport_usd: transport_usd ?? 7,
      meal_usd: meal_usd ?? 0,
      rice_allowance_usd: rice_allowance_usd ?? 5,
      effective_from,
      effective_to: effective_to ?? null,
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
