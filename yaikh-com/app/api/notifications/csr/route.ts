/* /api/notifications/csr — counts per CSR PA pill */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await getDb();
    const todayISO = new Date().toISOString().slice(0, 10);

    const [airAlerts, waterDays, energyDays, complianceOpen, alertsOpen] = await Promise.all([
      // Air pill = readings flagged "alert" today (temp > 32°C)
      db.collection("air_readings").countDocuments({ date: todayISO, status: "alert" }),
      // Water pill = days logged in the last 14 days
      db.collection("water_usage").countDocuments({}),
      // Energy pill = days logged in the last 14 days
      db.collection("energy_consumption").countDocuments({}),
      // Compliance pill = open + soon-scheduled (any non-passed audit)
      db.collection("compliance_audits").countDocuments({
        status: { $in: ["open", "scheduled"] },
      }),
      // Alerts pill = open environmental alerts
      db.collection("environmental_alerts").countDocuments({
        status: { $in: ["open", "reviewing"] },
      }),
    ]);

    const counts: Record<string, number> = {
      "Air temperature today":  airAlerts,
      "Water usage log":        waterDays,
      "Energy consumption":     energyDays,
      "Compliance audits":      complianceOpen,
      "Environmental alerts":   alertsOpen,
    };

    return NextResponse.json({ ok: true, counts });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
