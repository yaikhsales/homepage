// YPI — Garment Costing / Order Quotation (lives inside the Material Portal
// group). FOB a piece = material (from the BOM) + CM (SAM × cost per minute)
// + subcontract processes + logistics (contracted container routes) +
// overhead + testing + profit; shown against the brand's target.
// Data: M1 /sim/view {module:"ypi", view:"costing", pick}. Simulated.
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw, Calculator } from "lucide-react";
import { NavCover, useScreenTop, Figures } from "../components/ScreenTop";
import { YpiTabs, Picker, Chip } from "./MaterialPortal";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const num = (v) => (typeof v === "number" ? v.toLocaleString("en-US") : v == null ? "" : String(v));
const usd = (v) => (typeof v === "number" ? `USD ${v.toLocaleString("en-US", { minimumFractionDigits: v < 10 ? 3 : 0, maximumFractionDigits: v < 10 ? 3 : 0 })}` : v);

const Costing = () => {
  const [wrapRef, padTop] = useScreenTop();
  const [params, setParams] = useSearchParams();
  const pick = params.get("pick") || "";
  const setPick = (id) => setParams(id ? { pick: id } : {});
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ypi", view: "costing", pick: pick || undefined }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error("unavailable");
      setD(j); setError("");
    } catch (e) {
      setError("YPI data is unavailable right now. Please try again in a moment.");
    } finally { setLoading(false); }
  }, [pick]);
  useEffect(() => { load(); }, [load]);

  const o = d && d.order;
  const cpm = d && d.cpm;
  return (
    <div ref={wrapRef} className="min-h-screen bg-slate-900 text-white yai-pa-aware" style={{ paddingTop: padTop }}>
      <NavCover />
      <div className="px-4 pb-10 max-w-[1700px] mx-auto">
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <Calculator size={18} className="text-emerald-300" />
          <h1 className="text-base font-black whitespace-nowrap">{(d && d.title) || "Garment Costing"}</h1>
          <span className="text-xs text-slate-400 truncate flex-1 min-w-0">{d && d.subtitle}</span>
          <YpiTabs view="costing" />
          <button onClick={load} className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700" title="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
        </div>

        {error && <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-200 px-4 py-3 text-sm mb-3">{error}</div>}
        {d && <Figures items={d.summary} fmt={num} />}
        {o && (
          <div className="mt-2 text-xs text-slate-300">
            FOB <span className="font-bold text-white">{usd(o.fob)}</span> vs target <span className="font-bold text-white">{usd(o.target)}</span>{" "}
            <Chip tone={o.gap >= 0 ? "green" : "red"}>{o.gap >= 0 ? "+" : "−"}USD {Math.abs(o.gap).toFixed(2)} a piece</Chip>{" "}
            · order value {usd(o.value)} · margin {o.margin}%
          </div>
        )}

        <div className="mt-3 flex gap-3 items-start">
          <div className="flex-1 min-w-0 space-y-3">
            {/* cost sheet */}
            <div className="rounded-xl border border-slate-700 overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-800 text-slate-300 uppercase tracking-wide text-[10px]">
                  <tr>{["Part", "Cost item", "How it is worked out", "Per piece", "Total", "Note"].map((hd) => <th key={hd} className="text-left px-2 py-2 whitespace-nowrap">{hd}</th>)}</tr>
                </thead>
                <tbody>
                  {(d ? d.rows : []).map((r, i) => (
                    <tr key={i} className={`border-t border-slate-700/60 align-top ${i % 2 ? "bg-slate-800/40" : ""}`}>
                      <td className="px-2 py-1.5 whitespace-nowrap text-slate-400">{r.part}</td>
                      <td className="px-2 py-1.5 font-bold whitespace-nowrap">{r.item}</td>
                      <td className="px-2 py-1.5 min-w-[220px] text-slate-300">{r.basis}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{typeof r.per_piece === "number" ? r.per_piece.toFixed(3) : r.per_piece}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums whitespace-nowrap">{num(r.total)}</td>
                      <td className="px-2 py-1.5 min-w-[180px] text-slate-400">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CPM block */}
            {cpm && (
              <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">Cost per minute — {cpm.month}</div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-300">
                  <span>Factory cost <b className="text-white">USD {num(cpm.factory_cost)}</b></span>
                  <span>Earned minutes <b className="text-white">{num(cpm.earned_minutes)}</b></span>
                  <span>Pieces <b className="text-white">{num(cpm.pieces)}</b></span>
                  <span>Avg SAM <b className="text-white">{cpm.avg_sam}</b></span>
                  <span>Operators <b className="text-white">{num(cpm.operators)}</b> on {cpm.lines} lines</span>
                  <span>Efficiency <b className="text-white">{cpm.efficiency}%</b></span>
                  <span>CPM <b className="text-emerald-300">USD {cpm.cpm}</b></span>
                </div>
                {cpm.rule && <div className="text-[10px] text-slate-500 mt-1">{cpm.rule}</div>}
              </div>
            )}

            {/* contracted logistics routes */}
            {d && Array.isArray(d.routes) && d.routes.length > 0 && (
              <div className="rounded-xl border border-slate-700 overflow-x-auto">
                <div className="px-3 pt-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Contracted container routes</div>
                <table className="w-full text-xs">
                  <thead className="text-slate-300 uppercase tracking-wide text-[10px]">
                    <tr>{(d.route_columns || []).map(([k, lbl]) => <th key={k} className="text-left px-3 py-2 whitespace-nowrap">{lbl}</th>)}</tr>
                  </thead>
                  <tbody>
                    {d.routes.map((r, i) => (
                      <tr key={i} className={`border-t border-slate-700/60 align-top ${i % 2 ? "bg-slate-800/40" : ""}`}>
                        {(d.route_columns || []).map(([k]) => <td key={k} className="px-3 py-1.5 text-slate-300 min-w-[90px]">{Array.isArray(r[k]) ? r[k].join(", ") : num(r[k])}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* rules */}
            {d && d.rules && (
              <div className="text-[10px] text-slate-500">
                Rules: overhead {d.rules.overhead_pct}% + USD {num(d.rules.order_fixed_usd)} fixed per order · profit {d.rules.profit_pct}% · testing USD {d.rules.test_per_colour_usd} per colour.
              </div>
            )}
          </div>

          {d && d.picker && (
            <div className="w-72 flex-shrink-0">
              <Picker picker={d.picker} onPick={setPick} legend={[["green", "at or above target"], ["red", "below target"]]} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Costing;
