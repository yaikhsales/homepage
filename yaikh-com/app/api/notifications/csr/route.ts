/* /api/notifications/csr — counts per CSR PA pill, from the M1's CSR skills (the same simulated
 * factory the CSR cards show), so the pill numbers match the cards.
 *
 * Source: POST {M1_LLM_URL}/pa/skills {"pa":"csr"} → alerts, reminders, tasks, forecasts, each with a
 * `link` into a CSR screen. A pill counts the skill items that point at its topic:
 *   Air    = distinct zones named in the air alerts (an alert per limit lists its zones in `refs`)
 *   Water  = alerts + reminders + tasks linking /csr/water
 *   Energy = alerts + reminders + tasks + forecasts linking /csr/energy
 *   Audits = tasks (approvals) + reminders (audit deadlines) linking /csr/digital-audit
 *   Alerts = every alert the CSR PA raises (air, chemical, …)
 * The pill keys are the CSR PA's own labels (bot-modules.js SHORT_LABEL maps them to Air / Water / …).
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const M1_URL = (process.env.M1_LLM_URL || "").replace(/\/$/, "");
const M1_TOKEN = process.env.M1_LLM_TOKEN || "";
const TIMEOUT_MS = Number(process.env.M1_LLM_TIMEOUT_MS || 20000);

type Item = { link?: string; refs?: unknown; count?: number };
type Skills = { ok?: boolean; alerts?: Item[]; reminders?: Item[]; tasks?: Item[]; forecasts?: Item[] };

const linksTo = (x: Item, topic: string) => typeof x.link === "string" && x.link.includes(`/csr/${topic}`);

export async function GET() {
  if (!M1_URL || !M1_TOKEN) {
    return NextResponse.json({ ok: false, error: "The CSR counts are unavailable right now." }, { status: 503 });
  }
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const upstream = await fetch(`${M1_URL}/pa/skills`, {
      method: "POST",
      signal: ctl.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${M1_TOKEN}` },
      body: JSON.stringify({ pa: "csr" }),
      cache: "no-store",
    });
    if (!upstream.ok) {
      console.error(`[api/notifications/csr] upstream ${upstream.status}`);
      return NextResponse.json({ ok: false, error: "The CSR counts are unavailable right now." }, { status: 503 });
    }
    const s = (await upstream.json()) as Skills;
    const alerts = s.alerts || [], reminders = s.reminders || [], tasks = s.tasks || [], forecasts = s.forecasts || [];
    const all = [...alerts, ...reminders, ...tasks, ...forecasts];

    const airZones = new Set<string>();
    alerts.filter((a) => linksTo(a, "air")).forEach((a) => (Array.isArray(a.refs) ? a.refs : []).forEach((z) => airZones.add(String(z))));
    const airCount = airZones.size || alerts.filter((a) => linksTo(a, "air")).reduce((n, a) => n + (Number(a.count) || 1), 0);

    const counts: Record<string, number> = {
      "Air temperature today":  airCount,
      "Water usage log":        all.filter((x) => linksTo(x, "water")).length,
      "Energy consumption":     all.filter((x) => linksTo(x, "energy")).length,
      "Compliance audits":      [...tasks, ...reminders].filter((x) => linksTo(x, "digital-audit") || linksTo(x, "audit")).length,
      "Environmental alerts":   alerts.length,
    };
    return NextResponse.json({ ok: true, counts, source: "m1/pa/skills" });
  } catch (err) {
    console.error("[api/notifications/csr]", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ ok: false, error: "The CSR counts are unavailable right now." }, { status: 503 });
  } finally {
    clearTimeout(timer);
  }
}
