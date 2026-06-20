/* /api/speak-up
 *
 *   GET  ?status=open|reviewing|resolved|closed  &category=Wage|Safety|...
 *        → list of grievances (optionally filtered)
 *
 *   POST { category, subject, body, line?, priority? }
 *        → submits an anonymous grievance. Auto-generates a unique
 *          number (SU-YYYY-NNNN) and an anonymous alias. The submitter
 *          NEVER has to provide their real name — that's the whole
 *          point of Speak Up.
 *
 * Stored in Mongo collection `speak_up_grievances` on the yaikhhomepage
 * Atlas cluster. Status flow: open → reviewing → resolved → closed.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "speak_up_grievances";

const CATEGORIES = ["Wage", "Safety", "Harassment", "Hours", "Environment", "Other"];
const PRIORITIES = ["low", "medium", "high"];

/* Generate a friendly anonymous alias. Pairs an adjective with an
 * animal (or "anon-<LINE>-NNNN") so workers can recognise their own
 * submission later without exposing identity. */
function generateAlias(line?: string): string {
  const adj = ["blue", "red", "green", "silver", "swift", "quiet", "bold", "wise", "lucky", "calm"];
  const noun = ["fox", "owl", "tiger", "river", "stone", "panda", "hawk", "wolf", "lotus", "cobra"];
  const a = adj[Math.floor(Math.random() * adj.length)];
  const n = noun[Math.floor(Math.random() * noun.length)];
  const num = Math.floor(10 + Math.random() * 90);
  if (line) return `anon-${line}-${num}${Math.floor(10 + Math.random() * 90)}`;
  return `${a}-${n}-${num}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const db = await getDb();
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const docs = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ submittedAt: -1, createdAt: -1 })
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
    const { category, subject, body: text, line, priority } = body ?? {};

    if (!category || !CATEGORIES.includes(category)) {
      return NextResponse.json(
        { ok: false, error: `category must be one of: ${CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }
    if (typeof subject !== "string" || subject.trim().length < 4) {
      return NextResponse.json({ ok: false, error: "subject is required (min 4 chars)" }, { status: 400 });
    }
    if (typeof text !== "string" || text.trim().length < 10) {
      return NextResponse.json({ ok: false, error: "body is required (min 10 chars)" }, { status: 400 });
    }
    const safePriority = PRIORITIES.includes(priority) ? priority : "medium";

    const db = await getDb();
    const col = db.collection(COLLECTION);

    const year = new Date().getFullYear();
    const last = await col
      .find({ no: { $regex: `^SU-${year}-` } })
      .sort({ no: -1 })
      .limit(1)
      .toArray();
    const lastNum = last[0]?.no?.match(/(\d+)$/)?.[1];
    const nextNum = String((lastNum ? parseInt(lastNum, 10) : 0) + 1).padStart(4, "0");
    const no = `SU-${year}-${nextNum}`;

    const now = new Date();
    const doc = {
      no,
      alias: generateAlias(line),
      category,
      subject: subject.trim(),
      body: text.trim(),
      line: line || null,
      priority: safePriority,
      status: "open",
      submittedAt: now.toISOString(),
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
