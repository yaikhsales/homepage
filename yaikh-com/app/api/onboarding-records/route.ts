/* /api/onboarding-records
 *
 *   GET  ?employee_no=EMP-YYYY-NNNN&status=pending|complete
 *
 *   POST { employee_no, hire_date, line_assignment, factory_id,
 *          nid_copy?, family_book?, nssf_registered?, orientation_done?, status? }
 *        → creates an onboarding record, auto-generates ONB-YYYY-NNN number
 *
 * Cambodia garment factory context: onboarding checklist covers NID copy,
 * family book photocopy, NSSF registration (mandatory), factory ID issue,
 * and orientation (safety, line work). Probation = 1 month, then confirmed.
 *
 * Records live in Mongo collection `onboarding_records`. Owned by HR PA.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "onboarding_records";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const employee_no = searchParams.get("employee_no");
    const status = searchParams.get("status");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (employee_no) filter.employee_no = employee_no;
    if (status) filter.status = status;

    const docs = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ hire_date: -1, no: -1 })
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
      employee_no, hire_date, line_assignment, factory_id,
      nid_copy, family_book, nssf_registered, orientation_done, status,
    } = body ?? {};

    if (!employee_no || !hire_date || !factory_id) {
      return NextResponse.json(
        { ok: false, error: "employee_no, hire_date, factory_id are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection(COLLECTION);

    const year = new Date().getFullYear();
    const last = await col
      .find({ no: { $regex: `^ONB-${year}-` } })
      .sort({ no: -1 })
      .limit(1)
      .toArray();
    const lastNum = last[0]?.no?.match(/(\d+)$/)?.[1];
    const nextNum = String((lastNum ? parseInt(lastNum, 10) : 0) + 1).padStart(3, "0");
    const no = `ONB-${year}-${nextNum}`;

    const checklist = {
      nid_copy: !!nid_copy,
      family_book: !!family_book,
      nssf_registered: !!nssf_registered,
      orientation_done: !!orientation_done,
    };
    const auto_status = Object.values(checklist).every(Boolean) ? "complete" : "pending";

    const now = new Date();
    const doc = {
      no,
      employee_no,
      hire_date,
      line_assignment: line_assignment ?? null,
      factory_id,
      ...checklist,
      status: status ?? auto_status,
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
