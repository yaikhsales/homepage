/* Running numbers for our own events, so a handout can say
 * yaikh.com/event001 instead of a 24-character id.
 *
 * Numbers come from one counter document, incremented atomically, so two
 * saves at the same moment can never get the same number. */
import "server-only";
import type { Db } from "mongodb";

const COUNTER_ID = "task_event_no";

export async function nextEventNo(db: Db): Promise<number> {
  const doc = await db
    .collection<{ _id: string; seq: number }>("counters")
    .findOneAndUpdate(
      { _id: COUNTER_ID },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: "after" }
    );
  return doc?.seq ?? 1;
}

/** 1 → "event001", 42 → "event042", 1234 → "event1234". */
export function eventSlug(no: number): string {
  return `event${String(no).padStart(3, "0")}`;
}

/** Number every event of ours that predates numbering, oldest first.
 *  Idempotent: the eventNo guard means a second run touches nothing. */
export async function backfillEventNumbers(db: Db): Promise<void> {
  const missing = await db
    .collection("task_events")
    .find({ origin: "manual", eventNo: { $exists: false } })
    .sort({ createdAt: 1 })
    .project({ _id: 1 })
    .toArray();
  for (const row of missing) {
    const no = await nextEventNo(db);
    await db
      .collection("task_events")
      .updateOne(
        { _id: row._id, eventNo: { $exists: false } },
        { $set: { eventNo: no, slug: eventSlug(no) } }
      );
  }
}
