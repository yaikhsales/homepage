/* GET /api/notifications/accounting/items?topic=<topic>
 *
 * Returns the records that contribute to a given Accounting PA topic's
 * notification count, plus metadata the action modal needs to advance
 * each record's status:
 *
 *   {
 *     ok: true,
 *     topic: "Bill claims to verify",
 *     collection: "bill_claims",
 *     nextStatusMap: { "Manager Approved": "Accounting Verified", ... },
 *     items: [ {...mongoDoc}, ... ]
 *   }
 *
 * Topic keys match the suggestedAction text on the accounting-bot in
 * bot-modules.js (PREDEFINED_BOTS) so the dashboard can look up by
 * pill label directly.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type TopicConfig = {
  collection: string;
  filter: Record<string, unknown>;
  nextStatusMap: Record<string, string>;
};

const TOPICS: Record<string, TopicConfig> = {
  "Pending PR approvals": {
    collection: "purchase_requests",
    filter: { status: { $in: ["draft", "submitted", "supervisor_approved", "manager_approved"] } },
    nextStatusMap: {
      "draft":               "submitted",
      "submitted":           "supervisor_approved",
      "supervisor_approved": "manager_approved",
      "manager_approved":    "finance_approved",
      "finance_approved":    "paid",
    },
  },
  "Bill claims to verify": {
    collection: "bill_claims",
    filter: { status: { $in: ["Manager Approved"] } },
    nextStatusMap: {
      "Submitted":            "Manager Approved",
      "Manager Approved":     "Accounting Verified",
      "Accounting Verified":  "Reimbursed",
    },
  },
  "Salary bill status": {
    collection: "salary_bills",
    filter: { status: { $in: ["Submitted", "Accounting Review"] } },
    nextStatusMap: {
      "Submitted":           "Accounting Review",
      "Accounting Review":   "Accounting Verified",
      "Accounting Verified": "Finance Approved",
      "Finance Approved":    "Paid",
    },
  },
  "Unpaid shipping bills": {
    collection: "shipping_bills",
    filter: { status: { $nin: ["Reimbursed", "Paid", "Closed", "Rejected"] } },
    nextStatusMap: {
      "Submitted":            "Manager Approved",
      "Manager Approved":     "Accounting Verified",
      "Accounting Verified":  "Reimbursed",
    },
  },
  "IEWS e-invoice queue": {
    collection: "iews_sync_log",
    filter: {},
    nextStatusMap: {},
  },
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic");
    if (!topic) {
      return NextResponse.json({ ok: false, error: "topic query param is required" }, { status: 400 });
    }
    const cfg = TOPICS[topic];
    if (!cfg) {
      return NextResponse.json({ ok: false, error: `Unknown topic: ${topic}` }, { status: 404 });
    }

    const db = await getDb();
    const items = await db
      .collection(cfg.collection)
      .find(cfg.filter)
      .sort({ date: -1, createdAt: -1 })
      .limit(50)
      .project({ attachments: 0 }) // strip base64 photos from list view
      .toArray();

    return NextResponse.json({
      ok: true,
      topic,
      collection: cfg.collection,
      nextStatusMap: cfg.nextStatusMap,
      items,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
