/* /api/candidates
 *
 *   GET  ?stage=new|screening|interview|offer|rejected|hired&job_posting_no=JP-YYYY-NNN
 *
 *   POST { name_kh, name_en?, sex, dob?, nid?, phone, address_province, source,
 *          job_posting_no?, referred_by?, stage? }
 *        → creates a candidate, auto-generates CAN-YYYY-NNN number
 *
 * Cambodia garment factory context: applicants come from FB ads, walk-ins,
 * employee referrals (most common — referrer gets a small bonus on confirmation),
 * and Khmer job portals. address_province tracks the 25 KH provinces.
 *
 * Records live in Mongo collection `candidates`. Owned by HR PA.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "candidates";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const stage = searchParams.get("stage");
    const job_posting_no = searchParams.get("job_posting_no");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (stage) filter.stage = stage;
    if (job_posting_no) filter.job_posting_no = job_posting_no;

    const docs = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ createdAt: -1, no: -1 })
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
      name_kh, name_en, sex, dob, nid, phone, address_province,
      source, job_posting_no, referred_by, stage,
    } = body ?? {};

    if (!name_kh || !sex || !phone || !source) {
      return NextResponse.json(
        { ok: false, error: "name_kh, sex, phone, source are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection(COLLECTION);

    const year = new Date().getFullYear();
    const last = await col
      .find({ no: { $regex: `^CAN-${year}-` } })
      .sort({ no: -1 })
      .limit(1)
      .toArray();
    const lastNum = last[0]?.no?.match(/(\d+)$/)?.[1];
    const nextNum = String((lastNum ? parseInt(lastNum, 10) : 0) + 1).padStart(3, "0");
    const no = `CAN-${year}-${nextNum}`;

    const now = new Date();
    const doc = {
      no,
      name_kh,
      name_en: name_en ?? null,
      sex,
      dob: dob ?? null,
      nid: nid ?? null,
      phone,
      address_province: address_province ?? null,
      source,
      job_posting_no: job_posting_no ?? null,
      referred_by: referred_by ?? null,
      stage: stage ?? "new",
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
