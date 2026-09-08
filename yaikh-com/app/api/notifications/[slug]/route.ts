/* /api/notifications/[slug] — per-PA pill counts for the 9 PAs
 * that don't have a bespoke static route (shipping, mrp, qa, production,
 * ce, ytm, 4dp, ypi, social).
 *
 * Reads from `pa_tasks` collection with schema:
 *   { pa: string, pill: string, item_id: string, origin_pa: string,
 *     requester: string, status: "pending"|"in_progress"|"done",
 *     created_at: Date, deadline: Date }
 *
 * Only pending + in_progress tasks are counted. Static routes for
 * accounting/hr/admin/csr take precedence over this dynamic segment.
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";
import { PILLS_BY_PA } from "@/lib/pa-pills";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const pills = PILLS_BY_PA[slug];
  if (!pills) {
    return NextResponse.json(
      { ok: false, error: `unknown PA slug: ${slug}` },
      { status: 404 },
    );
  }

  try {
    const db = await getDb();
    const col = db.collection("pa_tasks");

    const results = await Promise.all(
      pills.map((pill) =>
        col.countDocuments({
          pa: slug,
          pill,
          status: { $in: ["pending", "in_progress"] },
        }),
      ),
    );

    const counts: Record<string, number> = {};
    pills.forEach((pill, i) => {
      counts[pill] = results[i];
    });

    return NextResponse.json({ ok: true, counts });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
