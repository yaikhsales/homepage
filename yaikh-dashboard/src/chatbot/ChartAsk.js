// "Ask the PAs for a chart" — Gamini 2026-10-06: command the PAs (local
// Qwen on the M1) to pull data from any module and show it as a chart.
// /boss/chart picks one of M1's chart builders and computes the numbers
// from the live sim data; answered charts pin as cards (kept per page in
// this browser). If the chart route is not there yet, the question goes to
// /boss/query and the PAs' text answer is pinned instead.
import React, { useEffect, useState } from "react";
import { Send, X, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { askBossChart, askBossQuery } from "./gemini-api";

const PA_NAME = {
  "4dp": "4DP PA", ypi: "YPI PA", mrp: "MRP PA", fc: "FC PA", ce: "CE PA", production: "Production PA", qa: "QA PA",
  ytm: "YTM PA", hr: "HR PA", admin: "Admin PA", csr: "CSR PA", shipping: "Shipping PA", accounting: "Accounting PA", social: "Social PA",
};
const COLORS = ["#10b981", "#60a5fa", "#f472b6", "#fbbf24", "#a78bfa", "#22d3ee", "#fb923c", "#fb7185"];
const EXAMPLES = [
  "Fabric lots on hold by supplier",
  "Sewing efficiency by line, last 7 days",
  "Absence rate by department",
  "Overtime hours by section this month",
];
// null / missing = a gap (no run that day), never drawn as 0
const num = (v) => (v == null || v === "" || Number.isNaN(Number(v)) ? null : Number(v));
const fmt = (v) => (typeof v === "number" ? (Math.abs(v) >= 1000 ? Math.round(v).toLocaleString() : String(Math.round(v * 100) / 100)) : String(v ?? ""));

/* bar / line / pie, single or multi series, plain SVG */
export function Chart({ c, dark }) {
  const ink = dark ? "#94a3b8" : "#64748b";
  const grid = dark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const x = Array.isArray(c.x) ? c.x : [];
  const series = Array.isArray(c.series) && c.series.length
    ? c.series.map((s, i) => ({ name: s.name, y: (s.y || []).map(num), color: COLORS[i % COLORS.length] }))
    : [{ name: c.unit || "", y: (c.y || []).map(num), color: COLORS[0] }];
  if (!x.length || !series.some((s) => s.y.some((v) => v != null))) return <div className="text-xs opacity-60">No data points.</div>;

  if (c.type === "pie") {
    const ys = series[0].y.map((v) => v || 0), tot = ys.reduce((a, b) => a + Math.max(b, 0), 0) || 1;
    let a0 = -Math.PI / 2;
    const R = 60, C = 70;
    return (
      <div className="flex items-center gap-4 flex-wrap">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {ys.map((v, i) => {
            const a1 = a0 + (Math.max(v, 0) / tot) * Math.PI * 2;
            const large = a1 - a0 > Math.PI ? 1 : 0;
            const d = `M${C},${C} L${C + R * Math.cos(a0)},${C + R * Math.sin(a0)} A${R},${R} 0 ${large} 1 ${C + R * Math.cos(a1)},${C + R * Math.sin(a1)} Z`;
            a0 = a1;
            return <path key={i} d={d} fill={COLORS[i % COLORS.length]} />;
          })}
        </svg>
        <div className="space-y-1 text-xs">
          {x.map((lab, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
              <span className={dark ? "text-slate-300" : "text-slate-700"}>{lab}</span>
              <span className="opacity-60 ml-auto pl-2">{fmt(ys[i])} ({Math.round((ys[i] / tot) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const W = 520, H = 200, L = 44, B = 40, T = 10;
  const all = series.flatMap((s) => s.y).filter((v) => v != null), max = Math.max(...all, 0), min = Math.min(0, ...all);
  const sy = (v) => T + (H - T - B) * (1 - (v - min) / (max - min || 1));
  const cw = (W - L - 6) / x.length;
  const step = Math.ceil(x.length / 12);
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      {[0, 0.5, 1].map((f) => {
        const v = min + (max - min) * f, yy = sy(v);
        return <g key={f}><line x1={L} x2={W - 4} y1={yy} y2={yy} stroke={grid} /><text x={L - 4} y={yy + 3} fontSize="9" textAnchor="end" fill={ink}>{fmt(v)}</text></g>;
      })}
      {c.type === "line"
        ? series.map((s, si) => (
          <g key={si}>
            <path d={s.y.map((v, i) => (v == null ? "" : `${i && s.y[i - 1] != null ? "L" : "M"}${(L + cw * (i + 0.5)).toFixed(1)},${sy(v).toFixed(1)}`)).join(" ")} fill="none" stroke={s.color} strokeWidth="2" />
            {s.y.map((v, i) => (v == null ? null : <circle key={i} cx={L + cw * (i + 0.5)} cy={sy(v)} r="2.5" fill={s.color}><title>{`${x[i]}: ${fmt(v)}`}</title></circle>))}
          </g>
        ))
        : series.map((s, si) => {
          const bw = (cw * 0.75) / series.length;
          return s.y.map((v, i) => (v == null ? null :
            <rect key={`${si}-${i}`} x={L + cw * i + cw * 0.125 + bw * si} y={Math.min(sy(v), sy(0))} width={Math.max(bw - 1, 1)} height={Math.abs(sy(0) - sy(v))} rx="2" fill={s.color}>
              <title>{`${x[i]}${s.name ? ` · ${s.name}` : ""}: ${fmt(v)}`}</title>
            </rect>
          ));
        })}
      {series.length > 1 && series.map((s, si) => (
        <g key={`lg${si}`}><rect x={L + si * 110} y={0} width="8" height="8" rx="2" fill={s.color} /><text x={L + 12 + si * 110} y={8} fontSize="9" fill={ink}>{String(s.name).slice(0, 18)}</text></g>
      ))}
      {x.map((lab, i) => (i % step === 0 ? (
        <text key={i} x={L + cw * (i + 0.5)} y={H - B + 12} fontSize="9" fill={ink} textAnchor="end" transform={`rotate(-30 ${L + cw * (i + 0.5)} ${H - B + 12})`}>{String(lab).slice(0, 14)}</text>
      ) : null))}
    </svg>
  );
}

const load = (k) => { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch { return []; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };

const ChartAsk = ({ storageKey = "yai-chart-cards", dark = true }) => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cards, setCards] = useState(() => load(storageKey));
  const [busy, setBusy] = useState(null);
  const [miss, setMiss] = useState(null); // {note, examples}
  const [catalog, setCatalog] = useState([]); // M1's chart list — "More charts"
  const [showCat, setShowCat] = useState(false);
  useEffect(() => { askBossChart({ catalog: true }).then((r) => { if (r && Array.isArray(r.charts)) setCatalog(r.charts); }).catch(() => {}); }, []);
  useEffect(() => save(storageKey, cards.slice(0, 8)), [cards, storageKey]);

  const ask = async (text, key) => {
    const req = (text || q).trim();
    if (!req || busy) return;
    setQ(""); setMiss(null); setBusy(req); setShowCat(false);
    const r = await askBossChart(key ? { key } : req);
    if (r.status === "ok") {
      setCards((c) => [{ id: Date.now(), kind: "chart", req, ...r }, ...c].slice(0, 8));
    } else if (r.status === "nofit") {
      const why = r.reason ? `${r.reason[0].toUpperCase()}${r.reason.slice(1)}.` : (r.note || r.error || "No chart for that yet.");
      setMiss({ note: why, examples: Array.isArray(r.examples) && r.examples.length ? r.examples : EXAMPLES });
    } else {
      const t = await askBossQuery(req, []);
      if (t) setCards((c) => [{ id: Date.now(), kind: "text", req, title: req, answer: t.answer, routed_to: t.routed_to }, ...c].slice(0, 8));
      else setMiss({ note: "The PAs could not be reached just now — try again in a moment.", examples: [] });
    }
    setBusy(null);
  };

  const box = dark ? "bg-slate-800 border-white/10 text-slate-100" : "bg-white border-slate-200 text-slate-800 shadow-sm";
  const sub = dark ? "text-slate-400" : "text-slate-500";
  return (
    <div>
      <div className={`rounded-xl border p-3 ${box}`}>
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 size={16} className="text-emerald-500" />
          <div className="text-sm font-semibold">Ask the PAs for a chart</div>
          <div className={`text-[11px] ${sub} hidden sm:block`}>— they pull it from the modules; numbers come from live data</div>
        </div>
        <div className="flex items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} maxLength={200}
            placeholder="e.g. sewing efficiency by line, last 7 days"
            className={`flex-1 min-w-0 rounded-full px-4 py-2 text-sm outline-none border ${dark ? "bg-white/5 border-white/15 text-white placeholder-white/40 focus:border-emerald-400" : "bg-slate-50 border-slate-300 focus:border-emerald-500"}`} />
          <button onClick={() => ask()} disabled={!!busy} className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:brightness-110 disabled:opacity-50" title="Ask"><Send size={15} /></button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {EXAMPLES.map((e) => (
            <button key={e} onClick={() => ask(e)} disabled={!!busy} className={`text-[11px] rounded-full px-2 py-0.5 border ${dark ? "border-white/15 text-slate-300 hover:bg-white/10" : "border-slate-300 text-slate-600 hover:bg-slate-100"}`}>{e}</button>
          ))}
          {catalog.length > 0 && (
            <button onClick={() => setShowCat((v) => !v)} className="text-[11px] rounded-full px-2 py-0.5 text-emerald-500 font-semibold hover:underline">
              {showCat ? "Hide" : `More charts (${catalog.length})`}
            </button>
          )}
        </div>
        {showCat && (
          <div className={`mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 max-h-64 overflow-y-auto rounded-lg p-2 ${dark ? "bg-black/20" : "bg-slate-50"}`}>
            {catalog.map((c) => (
              <button key={c.key} onClick={() => ask(c.title, c.key)} disabled={!!busy} title={c.description}
                className={`text-left text-xs rounded px-2 py-1 ${dark ? "hover:bg-white/10 text-slate-200" : "hover:bg-white text-slate-700"}`}>
                {c.title} <span className={sub}>· {(c.pa || []).map((p) => PA_NAME[p] || p).join(", ")}</span>
              </button>
            ))}
          </div>
        )}
        {busy && <div className={`text-xs mt-2 italic animate-pulse ${sub}`}>Asking the PAs: “{busy}”…</div>}
        {miss && (
          <div className={`text-xs mt-2 ${sub}`}>
            {miss.note}
            {miss.examples.length > 0 && <> Try: {miss.examples.slice(0, 4).map((e) => <button key={e} onClick={() => ask(e)} className="underline mr-2">{e}</button>)}</>}
          </div>
        )}
      </div>

      {cards.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
          {cards.map((c) => (
            <div key={c.id} className={`rounded-xl border p-3 ${box}`}>
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{c.title || c.req}</div>
                  <div className={`text-[11px] ${sub}`}>asked: “{c.req}”{c.unit ? ` · ${c.unit}` : ""}</div>
                </div>
                <button onClick={() => setCards((x) => x.filter((y) => y.id !== c.id))} className={`p-1 rounded ${dark ? "hover:bg-white/10" : "hover:bg-slate-100"}`} title="Remove"><X size={14} /></button>
              </div>
              <div className="mt-2">
                {c.kind === "chart" ? <Chart c={c} dark={dark} /> : <div className="text-sm leading-snug whitespace-pre-wrap">{c.answer}</div>}
              </div>
              {c.note && <div className={`text-[11px] mt-1 ${sub}`}>{c.note}</div>}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {(c.routed_to || []).length > 0 && <span className={`text-[10px] ${sub}`}>Answered by</span>}
                {(c.routed_to || []).map((p) => (
                  <span key={p} className="text-[11px] rounded-full px-2 py-0.5 bg-emerald-500/15 border border-emerald-400/30 text-emerald-600">{PA_NAME[p] || p}</span>
                ))}
                {c.link && <button onClick={() => navigate(c.link)} className="ml-auto text-[11px] text-emerald-500 hover:underline">↗ open the screen</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartAsk;
