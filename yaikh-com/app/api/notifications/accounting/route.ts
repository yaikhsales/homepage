/* /api/notifications/accounting
 *
 * Returns pending-item counts per Accounting PA suggested-action topic
 * so the dashboard can render a red badge with the count on each pill.
 *
 *   GET → {
 *     ok: true,
 *     counts: {
 *       "Pending PR approvals":   number,
 *       "Bill claims to verify":  number,
 *       "Salary bill status":     number,
 *       "Unpaid shipping bills":  number,
 *       "IEWS e-invoice queue":   number,
 *     }
 *   }
 *
 * Keys MUST match the `text` field of the corresponding suggestedAction
 * in bot-modules.js → PREDEFINED_BOTS → accounting-bot — that's how the
 * frontend looks up the badge value.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await getDb();

    const [prPending, bcToVerify, salReview, sbUnpaid] = await Promise.all([
      // PR awaiting any approval step (not yet finance-approved or paid)
      db.collection("purchase_requests").countDocuments({
        status: { $in: ["draft", "submitted", "supervisor_approved", "manager_approved"] },
      }),
      // Bill claims sitting in the Accounting verify queue
      db.collection("bill_claims").countDocuments({
        status: { $in: ["Manager Approved"] },
      }),
      // Salary batches the accounting team still needs to act on
      db.collection("salary_bills").countDocuments({
        status: { $in: ["Submitted", "Accounting Review"] },
      }),
      // Shipping bills not yet reimbursed
      db.collection("shipping_bills").countDocuments({
        status: { $nin: ["Reimbursed", "Paid", "Closed", "Rejected"] },
      }),
    ]);

    const counts: Record<string, number> = {
      "Pending PR approvals":  prPending,
      "Bill claims to verify": bcToVerify,
      "Salary bill status":    salReview,
      "Unpaid shipping bills": sbUnpaid,
      "IEWS e-invoice queue":  0,
    };

    return NextResponse.json({ ok: true, counts });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
