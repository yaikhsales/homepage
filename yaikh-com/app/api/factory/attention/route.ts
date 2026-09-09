/* GET /api/factory/attention
 *
 * Yai's "matters for your attention" — cross-PA scan of the pa_tasks
 * inbox, returns the top N items the boss should probably look at first.
 * Priority = age (older first), status (in_progress ahead of pending),
 * and a small PA weight (safety / QA / cash first).
 *
 * Response: { ok, matters: [{pa, pill, summary, age_days, item_id, origin_pa, requester}] }
 */

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PA_WEIGHT: Record<string, number> = {
  qa: 5,          // Quality holds cost the most
  accounting: 4,  // Cash + tax lands on the GM's desk
  ytm: 4,         // Machines down = line stopped
  production: 4,
  hr: 3,          // People issues escalate fast
  csr: 3,         // Buyer audits + compliance
  admin: 2,
  shipping: 3,
  mrp: 3,
  ce: 2,
  "4dp": 2,
  ypi: 1,
  social: 1,
};

const PA_LABEL: Record<string, string> = {
  accounting: "Accounting", hr: "HR", admin: "Admin", csr: "CSR",
  shipping: "Shipping", mrp: "MRP", qa: "QA", production: "Production",
  ce: "CE", ytm: "YTM", "4dp": "4DP", ypi: "YPI", social: "Social",
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Math.max(1, Math.min(20, parseInt(url.searchParams.get("limit") || "3", 10)));
    // Comma-separated item_ids already shown to the boss — skip them.
    const excludeParam = url.searchParams.get("exclude") || "";
    const excluded = new Set(excludeParam.split(",").map((s) => s.trim()).filter(Boolean));

    const db = await getDb();
    const now = Date.now();

    // Pull enough candidates from Mongo, we'll re-rank in memory.
    const raw = await db
      .collection("pa_tasks")
      .find({ status: { $in: ["pending", "in_progress"] } })
      .sort({ created_at: 1 })
      .limit(400)
      .toArray();

    const ranked = raw
      .filter((t) => !excluded.has(t.item_id))
      .map((t) => {
        const ageDays = Math.max(0, Math.floor((now - new Date(t.created_at).getTime()) / 86400_000));
        const burningBoost = t.priority === "burning" ? 20 : 0;
        const inProgressBoost = t.status === "in_progress" ? 2 : 0;
        const paW = PA_WEIGHT[t.pa] || 1;
        const score = burningBoost + ageDays * 2 + inProgressBoost + paW;
        return { t, ageDays, score };
      })
      .sort((a, b) => b.score - a.score);

    // De-dup per PA — max 1 item per PA per batch so we cycle departments.
    const perPaCount: Record<string, number> = {};
    const picked: typeof ranked = [];
    for (const row of ranked) {
      const paCount = perPaCount[row.t.pa] || 0;
      if (paCount >= 1) continue;
      picked.push(row);
      perPaCount[row.t.pa] = paCount + 1;
      if (picked.length >= limit) break;
    }
    // If we still need more, allow a 2nd item per PA.
    if (picked.length < limit) {
      for (const row of ranked) {
        if (picked.includes(row)) continue;
        const paCount = perPaCount[row.t.pa] || 0;
        if (paCount >= 2) continue;
        picked.push(row);
        perPaCount[row.t.pa] = paCount + 1;
        if (picked.length >= limit) break;
      }
    }

    return NextResponse.json({
      ok: true,
      matters: picked.map(({ t, ageDays }) => ({
        pa: t.pa,
        pa_label: PA_LABEL[t.pa] || t.pa,
        pill: t.pill,
        summary: t.summary,
        age_days: ageDays,
        item_id: t.item_id,
        origin_pa: t.origin_pa,
        requester: t.requester,
        status: t.status,
        burning: t.priority === "burning",
      })),
      totalOpen: raw.length,
      shownExcluded: excluded.size,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
