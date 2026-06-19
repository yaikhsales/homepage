/* /api/notifications/hr
 *
 * Returns pending-item counts per HR PA suggested-action topic so the
 * dashboard can render a red badge with the count on each pill.
 *
 *   GET → {
 *     ok: true,
 *     counts: {
 *       "Attendance today":     number,  // absences + lates today
 *       "Open leave requests":  number,
 *       "Training schedule":    number,  // sessions in next 30 days
 *       "Org chart updates":    number,
 *       "Temp worker requests": number,
 *     }
 *   }
 *
 * Keys MUST match the `text` field of the corresponding suggestedAction
 * on the hr-bot in bot-modules.js → PREDEFINED_BOTS — that's how the
 * frontend looks up the badge value per pill.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await getDb();
    const todayISO = new Date().toISOString().slice(0, 10);
    const in30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const [attentionToday, leaveOpen, trainingNext30, orgPending, tempPending] = await Promise.all([
      // Attendance items that need HR attention today (absent + late)
      db.collection("attendance_today").countDocuments({
        date: todayISO,
        status: { $in: ["absent", "late"] },
      }),
      db.collection("leave_requests").countDocuments({ status: "pending" }),
      db.collection("training_sessions").countDocuments({
        status: "scheduled",
        date: { $gte: todayISO, $lte: in30 },
      }),
      db.collection("org_chart_changes").countDocuments({ status: "pending" }),
      db.collection("temp_worker_requests").countDocuments({ status: "pending" }),
    ]);

    const counts: Record<string, number> = {
      "Attendance today":     attentionToday,
      "Open leave requests":  leaveOpen,
      "Training schedule":    trainingNext30,
      "Org chart updates":    orgPending,
      "Temp worker requests": tempPending,
    };

    return NextResponse.json({ ok: true, counts });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
