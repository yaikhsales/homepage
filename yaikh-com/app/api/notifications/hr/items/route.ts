/* GET /api/notifications/hr/items?topic=<topic>
 *
 * Returns the records that contribute to a given HR PA topic's notification
 * count, plus metadata the action card needs to advance each record's status.
 *
 *   {
 *     ok: true,
 *     topic: "Open leave requests",
 *     collection: "leave_requests",
 *     nextStatusMap: { "pending": "approved", ... },
 *     items: [ {...mongoDoc}, ... ]
 *   }
 *
 * Topic keys match the suggestedAction `text` field on the hr-bot in
 * bot-modules.js (PREDEFINED_BOTS) so the dashboard can look up topic
 * config by pill label directly.
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
  "Attendance today": {
    collection: "attendance_today",
    filter: {
      date: new Date().toISOString().slice(0, 10),
      status: { $in: ["absent", "late"] },
    },
    nextStatusMap: {
      "absent": "follow-up scheduled",
      "late":   "warning issued",
    },
  },
  "Open leave requests": {
    collection: "leave_requests",
    filter: { status: "pending" },
    nextStatusMap: {
      "pending":  "approved",
      "approved": "completed",
    },
  },
  "Training schedule": {
    collection: "training_sessions",
    filter: {
      status: "scheduled",
      date: {
        $gte: new Date().toISOString().slice(0, 10),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      },
    },
    nextStatusMap: {
      "scheduled": "in_progress",
      "in_progress": "completed",
    },
  },
  "Org chart updates": {
    collection: "org_chart_changes",
    filter: { status: "pending" },
    nextStatusMap: {
      "pending":  "approved",
      "approved": "applied",
    },
  },
  "Temp worker requests": {
    collection: "temp_worker_requests",
    filter: { status: "pending" },
    nextStatusMap: {
      "pending":   "approved",
      "approved":  "fulfilled",
    },
  },
  "Speak Up": {
    collection: "speak_up_grievances",
    filter: { status: { $in: ["open", "reviewing"] } },
    nextStatusMap: {
      "open":      "reviewing",
      "reviewing": "resolved",
      "resolved":  "closed",
    },
  },
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic");
    if (!topic) return NextResponse.json({ ok: false, error: "topic is required" }, { status: 400 });

    const cfg = TOPICS[topic];
    if (!cfg) return NextResponse.json({ ok: false, error: `Unknown HR topic: ${topic}` }, { status: 400 });

    const db = await getDb();
    const items = await db
      .collection(cfg.collection)
      .find(cfg.filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(50)
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
