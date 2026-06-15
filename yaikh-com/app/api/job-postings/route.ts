/* /api/job-postings
 *
 *   GET  ?status=open|closed|filled
 *        → list of job postings (optionally filtered)
 *
 *   POST { title, dept, line, headcount_target, channel, status?, posted_at?, closing_at?, jd_url? }
 *        → creates a new job posting, auto-generates JP-YYYY-NNN number
 *
 * Cambodia garment factory context: postings come from FB pages,
 * Khmer job sites (CamHR, BongThom), or referral networks. headcount_target
 * is per production line/section.
 *
 * Records live in Mongo collection `job_postings`. Owned by HR PA.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "job_postings";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const docs = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ posted_at: -1, no: -1 })
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
    const { title, dept, line, headcount_target, channel, status, posted_at, closing_at, jd_url } = body ?? {};

    if (!title || !dept || typeof headcount_target !== "number" || !channel) {
      return NextResponse.json(
        { ok: false, error: "title, dept, headcount_target, channel are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection(COLLECTION);

    const year = new Date().getFullYear();
    const last = await col
      .find({ no: { $regex: `^JP-${year}-` } })
      .sort({ no: -1 })
      .limit(1)
      .toArray();
    const lastNum = last[0]?.no?.match(/(\d+)$/)?.[1];
    const nextNum = String((lastNum ? parseInt(lastNum, 10) : 0) + 1).padStart(3, "0");
    const no = `JP-${year}-${nextNum}`;

    const now = new Date();
    const doc = {
      no,
      title,
      dept,
      line: line ?? null,
      headcount_target,
      channel,
      status: status ?? "open",
      posted_at: posted_at ?? now.toISOString().slice(0, 10),
      closing_at: closing_at ?? null,
      jd_url: jd_url ?? null,
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
