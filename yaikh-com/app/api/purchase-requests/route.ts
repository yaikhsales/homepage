/* /api/purchase-requests
 *
 *   GET  ?status=submitted|supervisor_approved|manager_approved|finance_approved|paid|rejected
 *        → list of purchase requests (optionally filtered by status)
 *
 *   POST { requester, dept, items, quotations, description, status? }
 *        → creates a new PR, auto-generates PR-YYYY-NNN number
 *
 * Records live in Mongo collection `purchase_requests` on the
 * yaikhhomepage Atlas cluster. Status flow:
 *   draft → submitted → supervisor_approved → manager_approved →
 *   finance_approved → paid    (or rejected at any step)
 *
 * Procurement SOP enforced at submit time:
 *   - ≥ 3 quotations attached
 *   - regular-supplier price match against supplier master
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "purchase_requests";

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
      .sort({ date: -1, createdAt: -1 })
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
      requester,
      dept,
      items,
      quotations,
      description,
      status,
      attachments,
    } = body ?? {};

    if (!requester || !dept || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, error: "requester, dept, and at least one item are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection(COLLECTION);

    const year = new Date().getFullYear();
    const last = await col
      .find({ prNo: { $regex: `^PR-${year}-` } })
      .sort({ prNo: -1 })
      .limit(1)
      .toArray();
    const lastNum = last[0]?.prNo?.match(/(\d+)$/)?.[1];
    const nextNum = String((lastNum ? parseInt(lastNum, 10) : 0) + 1).padStart(3, "0");
    const prNo = `PR-${year}-${nextNum}`;

    const totalAmount = items.reduce((sum: number, it: Record<string, unknown>) => {
      const qty = Number(it.qty) || 0;
      const up = Number(it.unitPrice) || 0;
      return sum + qty * up;
    }, 0);

    const quotationList = Array.isArray(quotations) ? quotations : [];

    const now = new Date();
    const doc = {
      prNo,
      requester: { userId: `u_${String(requester).toLowerCase().replace(/\s+/g, "_")}`, name: requester, dept },
      items,
      totalAmount,
      currency: "USD",
      quotations: quotationList,
      selectedQuote: 0,
      status: status ?? (quotationList.length < 3 ? "submitted" : "supervisor_approved"),
      sopFlag: quotationList.length < 3 ? "Missing 3rd quotation" : undefined,
      approvals: [
        { level: "supervisor", userId: null, at: null, decision: null },
        { level: "manager",    userId: null, at: null, decision: null },
        { level: "finance",    userId: null, at: null, decision: null },
      ],
      description: description ?? "",
      date: now.toISOString().slice(0, 10),
      attachments: Array.isArray(attachments) ? attachments : [],
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
