/* /api/workforce-master
 *
 *   GET  ?status=active|leave|resigned&line=line-1&skill_grade=operator
 *
 *   POST { name_kh, name_en?, sex, dob, hire_date, line?, section?, skill_grade,
 *          status?, nationality?, nssf_no?, contract_type? }
 *        → creates a workforce master record, auto-generates EMP-YYYY-NNNN number
 *
 * FWCMS = Foreign Workforce Centralized Management System — for Cambodia
 * garment context we use it as the workforce master: every active worker has
 * one record, status follows their lifecycle (active → leave → resigned).
 *
 * skill_grade: helper | operator | line_leader | supervisor | manager
 * contract_type: probation (1 month) | fixed (2 years) | undefined (open-ended)
 *
 * Records live in Mongo collection `workforce_master`. Owned by HR PA.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "workforce_master";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const line = searchParams.get("line");
    const skill_grade = searchParams.get("skill_grade");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (line) filter.line = line;
    if (skill_grade) filter.skill_grade = skill_grade;

    const docs = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ hire_date: -1, no: -1 })
      .limit(500)
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
      name_kh, name_en, sex, dob, hire_date, line, section,
      skill_grade, status, nationality, nssf_no, contract_type,
    } = body ?? {};

    if (!name_kh || !sex || !hire_date || !skill_grade) {
      return NextResponse.json(
        { ok: false, error: "name_kh, sex, hire_date, skill_grade are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection(COLLECTION);

    const year = new Date().getFullYear();
    const last = await col
      .find({ no: { $regex: `^EMP-${year}-` } })
      .sort({ no: -1 })
      .limit(1)
      .toArray();
    const lastNum = last[0]?.no?.match(/(\d+)$/)?.[1];
    const nextNum = String((lastNum ? parseInt(lastNum, 10) : 0) + 1).padStart(4, "0");
    const no = `EMP-${year}-${nextNum}`;

    const now = new Date();
    const doc = {
      no,
      name_kh,
      name_en: name_en ?? null,
      sex,
      dob: dob ?? null,
      hire_date,
      line: line ?? null,
      section: section ?? null,
      skill_grade,
      status: status ?? "active",
      nationality: nationality ?? "KH",
      nssf_no: nssf_no ?? null,
      contract_type: contract_type ?? "probation",
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
