/* /api/support-tickets
 *
 *   GET  ?dept=&status=&nature=&assignee=&from=
 *        → recent support tickets (max 200), filtered if any param given
 *
 *   POST { from, dept, nature, subject, description, urgency?, photo? }
 *        → creates ST-YYYY-NNNN, status="Open", timeline seeded with "Created"
 *
 * Records live in Mongo collection `support_tickets`. Any department can
 * raise; the Admin team routes them via PATCH /api/support-tickets/[id].
 * Status state machine: Open → Assigned → InProgress → Fixed → Closed.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "support_tickets";

const DEPTS = ["HR", "Production", "Warehouse", "Admin", "IT", "GA", "CSR", "YAI"] as const;
const NATURES = ["Aircon", "Electric", "Water", "Cleaning", "Repair", "6S", "H&S", "Other"] as const;
const URGENCIES = ["Low", "Normal", "High", "Critical"] as const;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter: Record<string, unknown> = {};
    for (const k of ["dept", "status", "nature", "assignee", "from"]) {
      const v = searchParams.get(k);
      if (v) filter[k] = v;
    }

    const db = await getDb();
    const docs = await db
      .collection(COLLECTION)
      .find(filter)
      .sort({ createdAt: -1 })
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
    const { from, dept, nature, subject, description, urgency, photo } = body ?? {};

    if (!from || !dept || !nature || !subject || !description) {
      return NextResponse.json(
        { ok: false, error: "from, dept, nature, subject, description are required" },
        { status: 400 }
      );
    }
    if (!DEPTS.includes(dept)) {
      return NextResponse.json(
        { ok: false, error: `dept must be one of: ${DEPTS.join(", ")}` },
        { status: 400 }
      );
    }
    if (!NATURES.includes(nature)) {
      return NextResponse.json(
        { ok: false, error: `nature must be one of: ${NATURES.join(", ")}` },
        { status: 400 }
      );
    }
    const u = urgency ?? "Normal";
    if (!URGENCIES.includes(u)) {
      return NextResponse.json(
        { ok: false, error: `urgency must be one of: ${URGENCIES.join(", ")}` },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection(COLLECTION);

    const year = new Date().getFullYear();
    const last = await col
      .find({ no: { $regex: `^ST-${year}-` } })
      .sort({ no: -1 })
      .limit(1)
      .toArray();
    const lastNum = last[0]?.no?.match(/(\d+)$/)?.[1];
    const nextNum = String((lastNum ? parseInt(lastNum, 10) : 0) + 1).padStart(4, "0");
    const no = `ST-${year}-${nextNum}`;

    const now = new Date();
    const doc = {
      no,
      from,
      dept,
      nature,
      subject,
      description,
      urgency: u,
      photo: typeof photo === "string" ? photo : null,
      status: "Open",
      assignee: null,
      date: now.toISOString().slice(0, 10),
      planDate: null as string | null,
      timeline: [
        {
          dateTime: now.toISOString(),
          actor: from,
          status: "Open",
          description: `Ticket created by ${from} (${dept}) — ${subject}`,
        },
      ],
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
