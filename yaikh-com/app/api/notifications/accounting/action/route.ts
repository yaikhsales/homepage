/* POST /api/notifications/accounting/action
 *
 *   Body: { collection, id, toStatus }
 *
 * Advances a single record's status. Used by the Pending Items modal's
 * Approve / Advance buttons. Validates the collection is one of the
 * Accounting PA-owned collections so this endpoint can't be used as a
 * generic Mongo write tool.
 *
 * Returns: { ok, item } on success — the updated doc — so the modal
 * can refresh the row in place.
 */

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_COLLECTIONS = new Set([
  "purchase_requests",
  "bill_claims",
  "salary_bills",
  "shipping_bills",
  "iews_sync_log",
]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { collection, id, toStatus } = body ?? {};

    if (typeof collection !== "string" || !ALLOWED_COLLECTIONS.has(collection)) {
      return NextResponse.json(
        { ok: false, error: `collection must be one of: ${[...ALLOWED_COLLECTIONS].join(", ")}` },
        { status: 400 }
      );
    }
    if (typeof id !== "string" || !id) {
      return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
    }
    if (typeof toStatus !== "string" || !toStatus) {
      return NextResponse.json({ ok: false, error: "toStatus is required" }, { status: 400 });
    }

    let _id: ObjectId;
    try {
      _id = new ObjectId(id);
    } catch {
      return NextResponse.json({ ok: false, error: "id must be a valid ObjectId hex" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection(collection).findOneAndUpdate(
      { _id },
      { $set: { status: toStatus, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ ok: false, error: "record not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
