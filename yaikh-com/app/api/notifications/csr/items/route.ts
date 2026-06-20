/* GET /api/notifications/csr/items?topic=<topic>
 *
 * Returns either:
 *   • items list + nextStatusMap   (for actionable topics: Compliance, Alerts)
 *   • chart payload                 (for sensor/usage topics: Air, Water, Energy)
 *
 * Chart payload shape:
 *   { ok: true, topic, chart: { kind: "line"|"bar", series: [{x, y}], unit, summary } }
 *
 * The dashboard's in-chat agentic card knows to render an inline SVG
 * chart when `chart` is present and a row list when `items` is present.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ListTopic = {
  kind: "list";
  collection: string;
  filter: Record<string, unknown>;
  nextStatusMap: Record<string, string>;
};
type ChartTopic = {
  kind: "chart";
  collection: string;
  build: (
    db: Awaited<ReturnType<typeof getDb>>
  ) => Promise<{ kind: "line" | "bar"; series: Array<{ x: string; y: number }>; unit: string; summary: string }>;
};
type TopicConfig = ListTopic | ChartTopic;

const todayISO = () => new Date().toISOString().slice(0, 10);

const TOPICS: Record<string, TopicConfig> = {
  "Air temperature today": {
    kind: "chart",
    collection: "air_readings",
    build: async (db) => {
      const rows = await db
        .collection("air_readings")
        .find({ date: todayISO() })
        .sort({ hour: 1 })
        .toArray();
      const series = rows.map((r) => ({
        x: `${String(r.hour).padStart(2, "0")}:00`,
        y: r.tempC,
      }));
      const peak = rows.reduce((m, r) => (r.tempC > m.tempC ? r : m), rows[0] || { tempC: 0, hour: 0 });
      const alerts = rows.filter((r) => r.status === "alert").length;
      return {
        kind: "line",
        series,
        unit: "°C",
        summary: `Peak ${peak.tempC}°C at ${String(peak.hour).padStart(2, "0")}:00 · ${alerts} alert hour${alerts === 1 ? "" : "s"} (>32°C)`,
      };
    },
  },
  "Water usage log": {
    kind: "chart",
    collection: "water_usage",
    build: async (db) => {
      const rows = await db
        .collection("water_usage")
        .find({})
        .sort({ date: 1 })
        .limit(14)
        .toArray();
      const series = rows.map((r) => ({ x: r.date.slice(5), y: r.m3 }));
      const total = rows.reduce((s, r) => s + r.m3, 0);
      const avg = rows.length ? total / rows.length : 0;
      return {
        kind: "bar",
        series,
        unit: "m³/day",
        summary: `${rows.length}-day total ${total.toFixed(0)} m³ · avg ${avg.toFixed(1)} m³/day`,
      };
    },
  },
  "Energy consumption": {
    kind: "chart",
    collection: "energy_consumption",
    build: async (db) => {
      const rows = await db
        .collection("energy_consumption")
        .find({})
        .sort({ date: 1 })
        .limit(14)
        .toArray();
      const series = rows.map((r) => ({ x: r.date.slice(5), y: r.kwh }));
      const total = rows.reduce((s, r) => s + r.kwh, 0);
      const avg = rows.length ? total / rows.length : 0;
      return {
        kind: "line",
        series,
        unit: "kWh/day",
        summary: `${rows.length}-day total ${(total / 1000).toFixed(1)}k kWh · avg ${avg.toFixed(0)} kWh/day`,
      };
    },
  },
  "Compliance audits": {
    kind: "list",
    collection: "compliance_audits",
    filter: { status: { $in: ["open", "scheduled"] } },
    nextStatusMap: {
      "open":      "reviewing",
      "reviewing": "passed",
      "scheduled": "in_progress",
      "in_progress": "completed",
    },
  },
  "Environmental alerts": {
    kind: "list",
    collection: "environmental_alerts",
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
    if (!cfg) return NextResponse.json({ ok: false, error: `Unknown CSR topic: ${topic}` }, { status: 400 });

    const db = await getDb();
    if (cfg.kind === "chart") {
      const chart = await cfg.build(db);
      return NextResponse.json({ ok: true, topic, collection: cfg.collection, chart });
    }

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
