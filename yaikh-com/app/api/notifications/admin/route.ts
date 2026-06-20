/* /api/notifications/admin — counts per Admin PA pill */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await getDb();
    const todayISO = new Date().toISOString().slice(0, 10);
    const tomorrowISO = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10);

    const [tickets, rooms, gates, yshop, visitors] = await Promise.all([
      db.collection("support_tickets").countDocuments({
        status: { $in: ["Open", "Assigned", "InProgress"] },
      }),
      db.collection("meeting_rooms").countDocuments({
        date:   { $in: [todayISO, tomorrowISO] },
        status: { $in: ["confirmed", "pending"] },
      }),
      db.collection("gate_passes").countDocuments({
        date: todayISO,
        status: "open",
      }),
      db.collection("y_shop_orders").countDocuments({ status: "pending" }),
      db.collection("visitors").countDocuments({ status: "in" }),
    ]);

    const counts: Record<string, number> = {
      "Open support tickets":   tickets,
      "Meeting room bookings":  rooms,
      "Gate passes today":      gates,
      "Y Shop orders":          yshop,
      "Visitors today":         visitors,
    };

    return NextResponse.json({ ok: true, counts });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
