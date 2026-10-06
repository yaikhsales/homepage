// CE · the Machine column's three lenses on the shared floor layout — the per-line DETAIL bodies only.
// The lines band (all ~30 lines left to right) and the fetch belong to the shared floor component
// (Yaikh PAs); these plug into it as the body under the selected line:
//   machine     — Machine Layout: every station's machine — type / model / code, presser foot, attachment,
//                 needle, LED, running / idle / DOWN with the downtime in red; the allocation figures.
//   mechanic    — Mechanic Line Plan: what the NEXT style needs on this line — machines in (available /
//                 borrow / rent / purchase, where) and out (to spare / store), keep, changeover date, the
//                 position-by-position swap (current machine → next machine).
//   requirement — Machine Requirement: have vs need (types, feet, attachments / folders), the next
//                 project's new requirements and what's missing, the Master Plan short.
// Data: {"module":"ce","view":"floor","lens":<lens>,"line":<line>} → detail (see the keys read below).
import React from "react";
import { AlertTriangle, ArrowRight, Wrench, Lightbulb, PackageCheck } from "lucide-react";

const num = (v) => (typeof v === "number" ? v.toLocaleString("en-US", { maximumFractionDigits: 1 }) : v === null || v === undefined ? "—" : String(v));
const H = ({ children, right }) => <div className="flex items-baseline justify-between gap-2 mb-1.5"><div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">{children}</div>{right && <div className="text-[11px] text-slate-500">{right}</div>}</div>;
const Panel = ({ title, right, children, className }) => <section className={`rounded-xl border border-slate-700 bg-slate-800/40 p-3 min-w-0 ${className || ""}`}><H right={right}>{title}</H>{children}</section>;
const Tile = ({ label, value, tone }) => <div className="rounded-lg border border-slate-700 bg-slate-900/60 px-2.5 py-1.5"><div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div><div className={`font-black tabular-nums text-base leading-tight ${tone || "text-white"}`}>{value}</div></div>;
const SOURCE = { available_in_store: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", available: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", borrow: "bg-sky-500/20 text-sky-300 border-sky-500/30", rent: "bg-amber-500/20 text-amber-300 border-amber-500/30", purchase: "bg-rose-500/20 text-rose-300 border-rose-500/30" };
const Src = ({ s }) => <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${SOURCE[s] || "bg-slate-500/20 text-slate-300 border-slate-500/30"}`}>{String(s || "—").replace(/_/g, " ")}</span>;
const MS = { RUNNING: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", IDLE: "bg-slate-500/20 text-slate-300 border-slate-500/30", DOWN: "bg-rose-600 text-white border-rose-700" };

/* ── Machine Layout ─────────────────────────────────────────────────────── */
export const MachineBody = ({ detail: d }) => {
  if (!d) return null;
  const st = d.stations || [];
  const k = (d.kpi && d.kpi.value) || {};
  const m = d.machines || {};
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <Tile label="Running" value={num(k.running)} tone="text-emerald-300" />
        <Tile label="Idle" value={num(k.idle)} tone="text-slate-300" />
        <Tile label="Down" value={num(k.down)} tone={k.down ? "text-rose-300" : "text-white"} />
        <Tile label="Stations" value={num(st.length)} />
        <Tile label="Layout" value={d.layout_name || d.layout || "—"} />
        {m.fabric && <Tile label="Fabric" value={m.fabric} />}
        {Array.isArray(m.colours) && m.colours.length > 0 && <Tile label="Colours" value={m.colours.join(" · ")} />}
      </div>
      <Panel title={`Machines on ${d.line || "the line"}`} right={d.order ? `${d.order} · ${d.garment || ""} · ${d.run || ""}` : undefined}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-slate-500">
              <tr>{["#", "Machine", "Model · id", "Operation", "Presser foot", "Attachment", "Needle", "LED", "Status", "Downtime"].map((c) => <th key={c} className="text-left font-normal px-2 py-1 whitespace-nowrap">{c}</th>)}</tr>
            </thead>
            <tbody>
              {st.map((s) => {
                const down = s.machine_status === "DOWN";
                return (
                  <tr key={s.no} className={`border-t border-slate-700/60 ${down ? "bg-rose-500/10" : "hover:bg-slate-800/40"}`}>
                    <td className="px-2 py-1 tabular-nums text-slate-500">{s.no}</td>
                    <td className="px-2 py-1 whitespace-nowrap"><b className="text-white">{s.type || s.machine}</b> <span className="text-slate-500">{s.machine_code}</span></td>
                    <td className="px-2 py-1 whitespace-nowrap text-slate-300">{s.model || "—"} <span className="text-slate-500">· {s.machine_id}</span></td>
                    <td className="px-2 py-1 text-slate-300">{s.operation}</td>
                    <td className="px-2 py-1 text-slate-300">{s.presser_foot || "—"}</td>
                    <td className="px-2 py-1 text-slate-300">{s.attachment || "—"}</td>
                    <td className="px-2 py-1 text-slate-300 whitespace-nowrap">{s.needle || "—"}</td>
                    <td className="px-2 py-1" title={s.led_reason || ""}>{s.led_light ? <span className="inline-flex items-center gap-1 text-amber-300"><Lightbulb size={12} />on</span> : <span className="text-slate-600">off</span>}</td>
                    <td className="px-2 py-1"><span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-bold ${MS[s.machine_status] || MS.IDLE}`}>{s.machine_status || (s.offline ? "OFF-LINE" : "—")}</span>{!down && s.idle_reason ? <span className="ml-1 text-[11px] text-slate-500">{s.idle_reason}</span> : null}</td>
                    <td className="px-2 py-1 whitespace-nowrap">{down ? <span className="inline-flex items-center gap-1 text-rose-300 font-bold"><AlertTriangle size={12} />{num(s.down_min)} min{s.cause ? <span className="font-normal"> · {s.cause}</span> : null}{s.mechanic ? <span className="font-normal text-slate-400"> · {s.mechanic}</span> : null}</span> : <span className="text-slate-600">—</span>}</td>
                  </tr>
                );
              })}
              {st.length === 0 && <tr><td colSpan={10} className="px-2 py-6 text-center text-slate-500">No stations on this line.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};

/* ── Mechanic Line Plan ─────────────────────────────────────────────────── */
export const MechanicBody = ({ detail: d }) => {
  if (!d) return null;
  const c = d.changeover || {};
  const st = d.stations || [];
  const swaps = st.filter((s) => s.change && s.change !== "keep");
  const ready = String(c.readiness || "").toLowerCase();
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <Tile label="Next run" value={c.next_order ? `${c.next_order} · ${c.next_garment || ""}` : "—"} />
        <Tile label="Changeover" value={c.changeover || "—"} />
        <Tile label="Set by" value={c.set_by || "—"} />
        <Tile label="Rent by" value={c.rent_by || "—"} tone={c.rent_by ? "text-amber-300" : undefined} />
        <Tile label="Machines in" value={"+" + num(c.in_total)} tone="text-emerald-300" />
        <Tile label="Machines out" value={"−" + num(c.out_total)} tone="text-rose-300" />
        <Tile label="Keep" value={num(c.keep)} />
        <Tile label="Readiness" value={c.readiness || "—"} tone={/risk|late|short/.test(ready) ? "text-rose-300" : /ready|ok/.test(ready) ? "text-emerald-300" : "text-amber-300"} />
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        <Panel title="Machines coming in" right={c.next_style}>
          {(c.in || []).length ? (
            <ul className="space-y-1">
              {(c.in || []).map((x, i) => (
                <li key={i} className="flex items-center gap-2 text-xs"><span className="w-5 text-right font-black text-white tabular-nums">{x.qty}×</span><span className="flex-1 min-w-0 truncate"><b className="text-white">{x.type}</b> <span className="text-slate-400">{x.name}</span></span><Src s={x.source} /><span className="text-[11px] text-slate-500 whitespace-nowrap">{x.where || ""}</span>{x.master_plan && <span className="text-[10px] text-amber-300" title="on the Master Plan">MP</span>}</li>
              ))}
            </ul>
          ) : <div className="text-xs text-slate-500">Nothing comes in for the next style.</div>}
        </Panel>
        <Panel title="Machines going out">
          {(c.out || []).length ? (
            <ul className="space-y-1">
              {(c.out || []).map((x, i) => <li key={i} className="flex items-center gap-2 text-xs"><span className="w-5 text-right font-black text-white tabular-nums">{x.qty}×</span><span className="flex-1 min-w-0 truncate"><b className="text-white">{x.type}</b> <span className="text-slate-400">{x.name}</span></span><span className="inline-flex items-center gap-1 text-[11px] text-slate-400 whitespace-nowrap"><ArrowRight size={11} />{x.to || "spare"}</span></li>)}
            </ul>
          ) : <div className="text-xs text-slate-500">Nothing goes out.</div>}
          {c.master_plan && <div className="mt-2 text-[11px] text-amber-300 flex items-center gap-1"><Wrench size={12} />Master Plan: {c.master_plan.kind} {c.master_plan.type} × {c.master_plan.n_order}{Array.isArray(c.master_plan.lines) ? " for " + c.master_plan.lines.join(", ") : ""}{c.short_master_plan ? ` · ${c.short_master_plan} short` : ""}</div>}
        </Panel>
      </div>
      <Panel title="Position by position" right={`${swaps.length} of ${st.length} positions change`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-slate-500"><tr>{["#", "Change", "Now", "Operation now", "→ Next machine", "Operation next", "Foot · attachment next", "Available"].map((h) => <th key={h} className="text-left font-normal px-2 py-1 whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {st.map((s) => {
                const cur = s.current_machine || {};
                const nx = s.next_machine || {};
                const ch = s.change || "keep";
                return (
                  <tr key={s.no} className={`border-t border-slate-700/60 ${ch === "keep" ? "text-slate-500" : "hover:bg-slate-800/40"}`}>
                    <td className="px-2 py-1 tabular-nums">{s.no}</td>
                    <td className="px-2 py-1"><span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-bold ${ch === "keep" ? "border-slate-700 text-slate-500" : ch === "swap" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : ch === "add" || ch === "in" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border-rose-500/30"}`}>{ch}</span></td>
                    <td className="px-2 py-1 whitespace-nowrap"><b className={ch === "keep" ? "" : "text-white"}>{cur.machine_code || s.machine_code}</b> <span className="opacity-70">{cur.machine || s.machine}</span></td>
                    <td className="px-2 py-1">{cur.operation || s.operation}</td>
                    <td className="px-2 py-1 whitespace-nowrap">{nx.machine_code ? <><b className={ch === "keep" ? "" : "text-white"}>{nx.machine_code}</b> <span className="opacity-70">{nx.machine}</span></> : "—"}</td>
                    <td className="px-2 py-1">{nx.operation || "—"}</td>
                    <td className="px-2 py-1 text-slate-400">{[nx.presser_foot, nx.attachment].filter(Boolean).join(" · ") || "—"}</td>
                    <td className="px-2 py-1">{s.available === true ? <span className="text-emerald-300">yes</span> : s.available === false ? <span className="text-rose-300 font-bold">no</span> : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {c.source && <div className="mt-1 text-[10px] text-slate-500">source: {c.source}</div>}
      </Panel>
    </div>
  );
};

/* ── Machine Requirement ────────────────────────────────────────────────── */
export const RequirementBody = ({ detail: d }) => {
  if (!d) return null;
  const have = d.have || [];
  const nx = d.next || {};
  const need = nx.need || [];
  const missing = d.missing || [];
  const byCode = Object.fromEntries(have.map((h) => [h.code, h]));
  const kinds = ["machine", "presser foot", "attachment / folder"];
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        <Tile label="Next project" value={nx.order ? `${nx.order} · ${nx.garment || ""}` : "—"} />
        <Tile label="Sewing from" value={nx.sewing_from || "—"} />
        <Tile label="Missing" value={num(missing.length)} tone={missing.length ? "text-rose-300" : "text-emerald-300"} />
        {kinds.map((k) => <Tile key={k} label={k + "s"} value={num(missing.filter((m) => m.kind === k).length)} tone={missing.some((m) => m.kind === k) ? "text-amber-300" : "text-slate-300"} />)}
        {d.master_plan && <Tile label="Master Plan" value={`${d.master_plan.kind} ${d.master_plan.type} × ${d.master_plan.n_order}`} tone="text-amber-300" />}
      </div>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Panel title="Have vs need — by machine type" right={nx.style}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-slate-500"><tr>{["Type", "Installed", "In use", "Needed next", "Δ", "Feet", "Attachments / folders"].map((h) => <th key={h} className="text-left font-normal px-2 py-1 whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>
                {[...new Set([...have.map((h) => h.code), ...need.map((n) => n.code)])].map((code) => {
                  const h = byCode[code] || {};
                  const n = need.find((x) => x.code === code) || {};
                  const delta = (n.needed || 0) - (h.installed || n.have || 0);
                  const feetMissing = (n.feet || []).filter((f) => !(h.feet || []).includes(f));
                  const attMissing = (n.attachments || []).filter((a) => !(h.attachments || []).includes(a));
                  return (
                    <tr key={code} className="border-t border-slate-700/60 align-top">
                      <td className="px-2 py-1 whitespace-nowrap"><b className="text-white">{code}</b> <span className="text-slate-400">{h.type || n.type}</span></td>
                      <td className="px-2 py-1 tabular-nums text-right">{num(h.installed)}</td>
                      <td className="px-2 py-1 tabular-nums text-right">{num(h.in_use)}</td>
                      <td className="px-2 py-1 tabular-nums text-right">{n.needed !== undefined ? num(n.needed) : "—"}</td>
                      <td className={`px-2 py-1 tabular-nums text-right font-bold ${delta > 0 ? "text-rose-300" : delta < 0 ? "text-slate-400" : "text-emerald-300"}`}>{n.needed !== undefined ? (delta > 0 ? "+" + delta : delta) : "—"}</td>
                      <td className="px-2 py-1 text-slate-300">{(n.feet && n.feet.length ? n.feet : h.feet || []).map((f) => <div key={f} className={feetMissing.includes(f) ? "text-rose-300" : ""}>{f}{feetMissing.includes(f) ? " ✗" : ""}</div>)}</td>
                      <td className="px-2 py-1 text-slate-300">{(n.attachments && n.attachments.length ? n.attachments : h.attachments || []).map((a) => <div key={a} className={attMissing.includes(a) ? "text-rose-300" : ""}>{a}{attMissing.includes(a) ? " ✗" : ""}</div>)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {nx.source && <div className="mt-1 text-[10px] text-slate-500">source: {nx.source}</div>}
        </Panel>
        <Panel title="What's missing for the next project" right={missing.length ? `${missing.length} items` : undefined}>
          {missing.length ? (
            <div className="space-y-2">
              {kinds.filter((k) => missing.some((m) => m.kind === k)).map((k) => (
                <div key={k}>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">{k}s</div>
                  <ul className="space-y-1">{missing.filter((m) => m.kind === k).map((m, i) => <li key={i} className="flex items-center gap-2 text-xs"><span className="w-5 text-right font-black text-white tabular-nums">{m.qty}×</span><span className="flex-1 min-w-0 truncate"><b className="text-white">{m.code}</b> <span className="text-slate-300">{m.item}</span></span><Src s={m.source} /><span className="text-[11px] text-slate-500 whitespace-nowrap">{m.where || ""}</span></li>)}</ul>
                </div>
              ))}
            </div>
          ) : <div className="flex items-center gap-2 text-xs text-emerald-300"><PackageCheck size={14} />Everything the next project needs is on the line or in store.</div>}
          {d.master_plan && <div className="mt-2 text-[11px] text-amber-300 flex items-center gap-1"><Wrench size={12} />Master Plan: {d.master_plan.kind} {d.master_plan.type} × {d.master_plan.n_order}{Array.isArray(d.master_plan.lines) ? " for " + d.master_plan.lines.join(", ") : ""}{d.short_master_plan ? ` · ${d.short_master_plan} short` : ""}</div>}
        </Panel>
      </div>
    </div>
  );
};

// lens → body, for the shared floor component's renderDetail hook
export const MACHINE_LENS_BODIES = { machine: MachineBody, mechanic: MechanicBody, requirement: RequirementBody };
export const MACHINE_LENSES = [
  { lens: "machine", view: "machine-layout", title: "Machine Layout", sub: "every station's machine, foot, attachment, needle, LED, downtime" },
  { lens: "mechanic", view: "line-plan", title: "Mechanic Line Plan", sub: "what the next style needs — machines in and out, changeover" },
  { lens: "requirement", view: "machine-requirement", title: "Machine Requirement", sub: "have vs need, the next project's missing items" },
];
export default MACHINE_LENS_BODIES;
