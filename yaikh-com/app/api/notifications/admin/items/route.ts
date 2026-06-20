/* GET /api/notifications/admin/items?topic=<topic> */

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
  "Open support tickets": {
    collection: "support_tickets",
    filter: { status: { $in: ["Open", "Assigned", "InProgress"] } },
    nextStatusMap: {
      "Open":       "Assigned",
      "Assigned":   "InProgress",
      "InProgress": "Fixed",
      "Fixed":      "Closed",
    },
  },
  "Meeting room bookings": {
    collection: "meeting_rooms",
    filter: {
      date: {
        $in: [
          new Date().toISOString().slice(0, 10),
          new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10),
        ],
      },
      status: { $in: ["confirmed", "pending"] },
    },
    nextStatusMap: {
      "pending":   "confirmed",
      "confirmed": "completed",
    },
  },
  "Gate passes today": {
    collection: "gate_passes",
    filter: {
      date: new Date().toISOString().slice(0, 10),
      status: "open",
    },
    nextStatusMap: { "open": "closed" },
  },
  "Y Shop orders": {
    collection: "y_shop_orders",
    filter: { status: "pending" },
    nextStatusMap: {
      "pending":   "fulfilled",
      "fulfilled": "completed",
    },
  },
  "Visitors today": {
    collection: "visitors",
    filter: { status: "in" },
    nextStatusMap: { "in": "out" },
  },
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic");
    if (!topic) return NextResponse.json({ ok: false, error: "topic is required" }, { status: 400 });

    const cfg = TOPICS[topic];
    if (!cfg) return NextResponse.json({ ok: false, error: `Unknown Admin topic: ${topic}` }, { status: 400 });

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
