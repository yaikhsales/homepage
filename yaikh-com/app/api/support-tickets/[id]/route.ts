/* /api/support-tickets/[id]
 *
 *   PATCH { action, actor, ...payload }
 *        action="assign"      → status=Assigned,    needs payload.assignee, optional planDate
 *        action="in-progress" → status=InProgress,  optional note
 *        action="fix"         → status=Fixed,       optional note (recommended)
 *        action="close"       → status=Closed,      optional note
 *        action="reopen"      → status=Open,        optional reason
 *
 *   Each PATCH atomically updates {status, assignee?, planDate?, updatedAt}
 *   and $push'es a new event onto the timeline array.
 */

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const COLLECTION = "support_tickets";

type Action = "assign" | "in-progress" | "fix" | "close" | "reopen";
const ACTION_TO_STATUS: Record<Action, string> = {
  assign: "Assigned",
  "in-progress": "InProgress",
  fix: "Fixed",
  close: "Closed",
  reopen: "Open",
};

function asObjectId(id: string): ObjectId | null {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const _id = asObjectId(params.id);
    if (!_id) {
      return NextResponse.json({ ok: false, error: "Invalid ticket id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { action, actor, assignee, planDate, note, reason } = body ?? {};

    if (!action || !(action in ACTION_TO_STATUS)) {
      return NextResponse.json(
        { ok: false, error: `action must be one of: ${Object.keys(ACTION_TO_STATUS).join(", ")}` },
        { status: 400 }
      );
    }
    if (!actor || typeof actor !== "string") {
      return NextResponse.json(
        { ok: false, error: "actor (the person performing the action) is required" },
        { status: 400 }
      );
    }
    if (action === "assign" && (!assignee || typeof assignee !== "string")) {
      return NextResponse.json(
        { ok: false, error: "assign requires payload.assignee" },
        { status: 400 }
      );
    }

    const status = ACTION_TO_STATUS[action as Action];
    const now = new Date();

    let eventDesc = "";
    switch (action) {
      case "assign":
        eventDesc = `Ticket assigned to ${assignee}${planDate ? ` — plan date ${planDate}` : ""} by ${actor}.`;
        break;
      case "in-progress":
        eventDesc = `Work started by ${actor}.${note ? ` Note: ${note}` : ""}`;
        break;
      case "fix":
        eventDesc = `Marked fixed by ${actor}.${note ? ` Resolution: ${note}` : ""}`;
        break;
      case "close":
        eventDesc = `Closed by ${actor}.${note ? ` Note: ${note}` : ""}`;
        break;
      case "reopen":
        eventDesc = `Reopened by ${actor}.${reason ? ` Reason: ${reason}` : ""}`;
        break;
    }

    const set: Record<string, unknown> = { status, updatedAt: now };
    if (action === "assign") {
      set.assignee = assignee;
      if (planDate) set.planDate = planDate;
    }

    const db = await getDb();
    const col = db.collection(COLLECTION);

    // Cast to any: the MongoDB driver's UpdateFilter<Document> can't
    // infer that `timeline` is an array on an untyped collection, so
    // $push.timeline fails strict typecheck. Runtime is correct — the
    // schema doc lists timeline as an array of events.
    const r = await col.findOneAndUpdate(
      { _id },
      {
        $set: set,
        $push: {
          timeline: {
            dateTime: now.toISOString(),
            actor,
            status,
            description: eventDesc,
          },
        },
      } as any,
      { returnDocument: "after" }
    );

    const doc = (r as any)?.value ?? r;
    if (!doc) {
      return NextResponse.json({ ok: false, error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item: doc });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
