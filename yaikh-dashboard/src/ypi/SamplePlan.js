// YPI — Sample Development Plan. The sample room is a mini factory (cut, sew,
// pack); each stage's samples go by courier to the brand office (USA / Canada /
// Hong Kong) for approval; rejected stages repeat; PP approval + quotation
// acceptance confirm the order onto the Master Plan.
// Data: M1 /sim/view {module:"ypi", view:"sample-plan", pick}. Simulated.
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw, FlaskConical, CheckCircle2, XCircle } from "lucide-react";
import { NavCover, useScreenTop, Figures } from "../components/ScreenTop";
import { YpiTabs, Picker, Chip } from "./MaterialPortal";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const num = (v) => (typeof v === "number" ? v.toLocaleString("en-US") : v == null ? "" : String(v));

const STATUS_TONE = (s) => {
  const t = String(s || "").toLowerCase();
  if (t.includes("approve")) return "green";
  if (t.includes("reject")) return "red";
  if (t.includes("sent") || t.includes("brand") || t.includes("courier")) return "blue";
  if (t.includes("sew") || t.includes("cut") || t.includes("making") || t.includes("running")) return "amber";
  return "grey";
};

const SamplePlan = () => {
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
      const r = await fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ypi", view: "sample-plan", pick: pick || undefined }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error("unavailable");
      setD(j); setError("");
    } catch (e) {
      setError("YPI data is unavailable right now. Please try again in a moment.");
    } finally { setLoading(false); }
  }, [pick]);
  useEffect(() => { load(); }, [load]);

  const o = d && d.order;
  return (
    <div ref={wrapRef} className="min-h-screen bg-slate-900 text-white yai-pa-aware" style={{ paddingTop: padTop }}>
      <NavCover />
      <div className="px-4 pb-10 max-w-[1700px] mx-auto">
        {/* one-line header */}
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <FlaskConical size={18} className="text-emerald-300" />
          <h1 className="text-base font-black whitespace-nowrap">{(d && d.title) || "Sample Development Plan"}</h1>
          <span className="text-xs text-slate-400 truncate flex-1 min-w-0">{d && d.subtitle}</span>
          <YpiTabs view="sample-plan" />
          <button onClick={load} className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700" title="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
        </div>

        {error && <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-200 px-4 py-3 text-sm mb-3">{error}</div>}
        {d && <Figures items={d.summary} fmt={num} />}

        {/* milestones strip — quotation → initial meeting → … → order confirmed */}
        {d && Array.isArray(d.milestones) && (
          <div className="mt-3 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 flex items-start gap-0 overflow-x-auto">
            {d.milestones.map((m, i) => (
              <React.Fragment key={m.key || i}>
                {i > 0 && <div className={`mt-2.5 h-0.5 w-10 flex-shrink-0 ${m.done ? "bg-emerald-400" : "bg-slate-600"}`} />}
                <div className="flex flex-col items-center text-center w-36 flex-shrink-0 px-1">
                  {m.done ? <CheckCircle2 size={18} className="text-emerald-400" /> : <span className="w-[18px] h-[18px] rounded-full border-2 border-slate-500 inline-block" />}
                  <span className="text-[11px] leading-tight mt-1 text-slate-200">{m.label}</span>
                  <span className={`text-[10px] mt-0.5 ${m.done ? "text-emerald-300" : "text-slate-500"}`}>{m.date}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="mt-3 flex gap-3 items-start">
          {/* stage table */}
          <div className="flex-1 min-w-0 rounded-xl border border-slate-700 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-800 text-slate-300 uppercase tracking-wide text-[10px]">
                <tr>
                  {["Stage", "Qty", "Sample materials", "Cut", "Sew", "Pack", "Meeting", "Sent to", "At the brand", "Comments", "Approved by", "Status"].map((hd) => (
                    <th key={hd} className="text-left px-2 py-2 whitespace-nowrap">{hd}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(d ? d.rows : []).map((r, i) => (
                  <tr key={i} className={`border-t border-slate-700/60 align-top ${r.remake ? "bg-rose-500/10" : i % 2 ? "bg-slate-800/40" : ""}`}>
                    <td className="px-2 py-2 min-w-[150px]">
                      <div className="font-bold flex items-center gap-1">{r.remake && <XCircle size={12} className="text-rose-400" />}{r.stage}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">{r.purpose}</div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">{r.qty}</td>
                    <td className="px-2 py-2 min-w-[180px] text-slate-300">{r.materials}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{r.cut}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{r.sew}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{r.pack}</td>
                    <td className="px-2 py-2 min-w-[120px] text-slate-300">{r.meeting}</td>
                    <td className="px-2 py-2 min-w-[120px]">{r.sent_to}{r.courier ? <div className="text-[10px] text-slate-400">{r.courier}</div> : null}</td>
                    <td className="px-2 py-2 whitespace-nowrap">{r.date}</td>
                    <td className="px-2 py-2 min-w-[160px] text-slate-300">{r.comments}</td>
                    <td className="px-2 py-2 min-w-[110px]">{r.approved_by}</td>
                    <td className="px-2 py-2"><Chip tone={STATUS_TONE(r.status)}>{r.status}</Chip></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* order picker */}
          {d && d.picker && (
            <div className="w-72 flex-shrink-0">
              <Picker picker={d.picker} onPick={setPick} legend={[["green", "all approved"], ["amber", "in sampling"], ["red", "rejected / repeat"]]} />
              {o && (
                <div className="mt-2 rounded-xl border border-slate-700 bg-slate-800/60 p-3 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-white">{o.ref} · {o.style}</div>
                  <div>{num(o.qty)} pcs → {o.office}</div>
                  <div>{Object.entries(o.colours || {}).map(([c, q]) => `${c} ${num(q)}`).join(" · ")}</div>
                  <div>Sizes {Array.isArray(o.sizes) ? o.sizes.join(" ") : ""} · courier {o.courier_days} days</div>
                  <div>Cutting {o.cutting}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SamplePlan;
