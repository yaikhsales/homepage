// YPI — Marker & Cut Plan. The marker room makes one marker per colour and garment
// part (the size ratio laid out on the fabric width); the cut plan turns the order's
// quantity by colour and size into lays, dye lot by dye lot, and the fabric warehouse
// releases the rolls of every lay on its date and shift (the same lines as FC Fabric
// Issuing). Two views: the cut plan of one order, and the list of markers.
// Data: M1 /sim/view {module:"ypi", view:"cut-plan" | "markers", pick}. Simulated.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, Search, CheckCircle2, XCircle } from "lucide-react";
import { YpiTabs } from "./MaterialPortal";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const num = (v) => (typeof v === "number" ? v.toLocaleString("en-US") : v === null || v === undefined ? "" : String(v));
const LIGHT = { green: "bg-emerald-400", amber: "bg-amber-400", grey: "bg-slate-500" };
const CHIP = {
  cut: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "cutting now": "bg-sky-500/20 text-sky-300 border-sky-500/30",
  planned: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  made: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "to make": "bg-slate-500/20 text-slate-300 border-slate-500/30",
};
const chip = (s) => CHIP[s] || (/hold/.test(String(s)) ? "bg-rose-500/20 text-rose-300 border-rose-500/30" : "bg-slate-500/20 text-slate-300 border-slate-500/30");
const NOWRAP = new Set(["date", "dye_lot", "cage", "ratio", "shift", "colour", "part"]);
const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const SIZE_COLOUR = { XXS: "#67e8f9", XS: "#38bdf8", S: "#34d399", M: "#fbbf24", L: "#fb923c", XL: "#f472b6", XXL: "#a78bfa", XXXL: "#94a3b8" };

// A simple marker drawing: the marker's length × width as a rectangle, one block per garment in the ratio (two rows,
// big sizes nested with small ones), each block coloured by its size; the block's filled area is the efficiency, the
// dark space around it the waste.
const MarkerDiagram = ({ m }) => {
  const W = 248;
  const H = Math.max(44, Math.min(110, Math.round((W * m.width_cm) / 100 / m.length_m)));
  const seq = [];
  Object.entries(m.ratio || {}).forEach(([s, k]) => { for (let i = 0; i < k; i += 1) seq.push(s); });
  seq.sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  const rows = [seq.filter((_, i) => i % 2 === 0), seq.filter((_, i) => i % 2 === 1).reverse()];
  const grade = (s) => 1 + 0.06 * (SIZE_ORDER.indexOf(s) - 3);
  const k = Math.sqrt((m.efficiency || 85) / 100);
  const rh = H / 2;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Marker ${m.marker}: ${m.ratio_text}, ${m.length_m} m × ${m.width_cm} cm`} className="block">
      <rect x={0.5} y={0.5} width={W - 1} height={H - 1} rx={3} fill="#0b1220" stroke="#475569" />
      {rows.map((row, r) => {
        const tot = row.reduce((a, s) => a + grade(s), 0) || 1;
        let x = 0;
        return row.map((s, i) => {
          const w = (W * grade(s)) / tot;
          const bw = w * k, bh = rh * k;
          const el = (
            <g key={`${r}-${i}`}>
              <rect x={x + (w - bw) / 2} y={r * rh + (rh - bh) / 2} width={bw} height={bh} rx={4} fill={SIZE_COLOUR[s] || "#94a3b8"} fillOpacity={0.8} />
              {bw > 18 && bh > 12 && <text x={x + w / 2} y={r * rh + rh / 2 + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#0f172a">{s}</text>}
            </g>
          );
          x += w;
          return el;
        });
      })}
    </svg>
  );
};

const Tiles = ({ items }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {(items || []).map((x) => (
      <div key={x.label} className="rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-1.5 min-w-[140px]">
        <div className="text-[10px] uppercase tracking-wider text-slate-400">{x.label}</div>
        <div className="text-xl font-black tabular-nums leading-tight text-white">{num(x.value)}</div>
      </div>
    ))}
  </div>
);

const Table = ({ cols, rows, chipKey = "status" }) => (
  <div className="rounded-2xl border border-slate-700 bg-slate-800/40 overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-slate-800 text-left">
          {cols.map((c) => <th key={c.key} className="px-3 py-2 text-xs font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap">{c.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t border-slate-700/70 hover:bg-slate-700/40">
            {cols.map((c) => (
              <td key={c.key} className={`px-3 py-1.5 text-sm ${typeof r[c.key] === "number" ? "text-right tabular-nums" : ""} ${c.key === "marker" || c.key === "order" ? "font-bold text-white whitespace-nowrap" : ""} ${NOWRAP.has(c.key) ? "whitespace-nowrap" : ""}`}>
                {c.key === chipKey && r[c.key] ? <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${chip(r[c.key])}`}>{r[c.key]}</span> : num(r[c.key])}
              </td>
            ))}
          </tr>
        ))}
        {rows.length === 0 && <tr><td colSpan={Math.max(cols.length, 1)} className="px-4 py-10 text-center text-slate-500">Nothing to show.</td></tr>}
      </tbody>
    </table>
  </div>
);

// The size check as a matrix: one row per colour (and garment part), one column per size; in each cell the pieces
// planned to cut over the pieces ordered, with a green tick or a red mark.
const SizeCheck = ({ checks, multi }) => {
  const sizes = [];
  const groups = [];
  const byKey = {};
  (checks || []).forEach((c) => {
    if (!sizes.includes(c.size)) sizes.push(c.size);
    const key = `${c.colour}|${c.part}`;
    if (!byKey[key]) { byKey[key] = { colour: c.colour, part: c.part, cells: {} }; groups.push(byKey[key]); }
    byKey[key].cells[c.size] = c;
  });
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/40 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-800 text-left">
            <th className="px-3 py-2 text-xs font-bold text-slate-300 uppercase tracking-wider">Colour{multi ? " · garment" : ""}</th>
            {sizes.map((s) => <th key={s} className="px-3 py-2 text-xs font-bold text-slate-300 uppercase tracking-wider text-right"><span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: SIZE_COLOUR[s] }} />{s}</th>)}
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={`${g.colour}|${g.part}`} className="border-t border-slate-700/70">
              <td className="px-3 py-1.5 text-sm font-bold text-white whitespace-nowrap">{g.colour}{multi ? <span className="font-normal text-slate-400"> · {g.part}</span> : null}</td>
              {sizes.map((s) => {
                const c = g.cells[s];
                if (!c) return <td key={s} />;
                return (
                  <td key={s} className="px-3 py-1.5 text-sm text-right tabular-nums whitespace-nowrap" title={`${c.result}${c.over ? ` (${c.over} over the order)` : ""}`}>
                    <span className="inline-flex items-center gap-1.5">
                      <span className={c.ok ? "text-white" : "text-rose-300 font-bold"}>{num(c.planned)}</span>
                      <span className="text-slate-500 text-xs">/ {num(c.ordered)}</span>
                      {c.ok ? <CheckCircle2 size={15} className="text-emerald-400" aria-label="covered" /> : <XCircle size={15} className="text-rose-400" aria-label={c.result} />}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CutPlan = ({ onBack, view: fixedView = "cut-plan" }) => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const view = fixedView === "markers" ? "markers" : "cut-plan";
  const [pick, setPick] = useState(search.get("order") || "");
  const [d, setD] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ypi", view, pick: pick || undefined }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error("unavailable");
      setD(j);
      setError("");
    } catch (e) {
      setError("YPI data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [view, pick]);

  useEffect(() => { load(); }, [load]);

  const cols = (d && d.columns) || [];
  const rows = useMemo(() => {
    const all = (d && d.rows) || [];
    const s = q.trim().toLowerCase();
    return s ? all.filter((r) => Object.values(r).join(" ").toLowerCase().includes(s)) : all;
  }, [d, q]);
  const isPlan = view === "cut-plan" && d && d.view === "cut-plan";
  const picker = isPlan ? d.picker : null;
  const o = isPlan ? d.order : null;
  const multi = Boolean(o && o.parts && o.parts.length > 1);

  return (
    <div className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-4 md:px-6 pb-6 pt-28 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; }`}</style>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack || (() => navigate("/"))} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={22} /></button>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">YPI · Marker &amp; Cut Plan · simulated factory</div>
            <h1 className="text-2xl font-black text-white leading-tight">{(d && d.title) || (view === "markers" ? "Markers" : "Marker & Cut Plan")}</h1>
            <p className="text-sm text-slate-400 max-w-5xl">{(d && d.subtitle) || "Loading…"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <YpiTabs view={view} />
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
            <Search size={16} className="text-slate-500" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={view === "markers" ? "Search order, colour, marker…" : "Search lay, colour, lot…"} className="bg-transparent outline-none text-sm w-48 text-white placeholder-slate-500" />
          </div>
          <button onClick={load} className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /></button>
        </div>
      </div>

      {error && <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 px-4 py-3 text-sm">{error}</div>}

      {d && view === "markers" && d.view === "markers" && (
        <>
          <Tiles items={d.summary} />
          <Table cols={cols} rows={rows} />
        </>
      )}

      {isPlan && (
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <aside className="w-full md:w-64 flex-shrink-0 rounded-2xl border border-slate-700 bg-slate-800/60 p-2 md:sticky md:top-28 overflow-y-auto" style={{ maxHeight: "calc(100vh - 8rem)", scrollbarWidth: "thin", scrollbarColor: "#475569 transparent" }}>
            <div className="px-2 pb-1 text-xs uppercase tracking-wider text-slate-400 font-bold">{picker.label}</div>
            <div className="px-2 pb-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className={`inline-block w-2 h-2 rounded-full ${LIGHT.green}`} />all cut</span>
              <span className="flex items-center gap-1"><span className={`inline-block w-2 h-2 rounded-full ${LIGHT.amber}`} />cutting now</span>
              <span className="flex items-center gap-1"><span className={`inline-block w-2 h-2 rounded-full ${LIGHT.grey}`} />planned</span>
            </div>
            {picker.options.map((x) => (
              <button key={x.id} onClick={() => setPick(x.id)} className={`w-full text-left rounded-xl px-3 py-2 mb-1 border transition-colors ${picker.selected === x.id ? "bg-emerald-500/20 border-emerald-500/40" : "border-transparent hover:bg-slate-700/60"}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-white leading-tight">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${LIGHT[x.tone] || LIGHT.grey}`} title={x.tone} />
                    {x.name}
                  </span>
                  <span className="text-xs font-bold tabular-nums text-emerald-300">{num(x.count)} / {num(x.of)}</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">{x.sub}</div>
              </button>
            ))}
          </aside>

          <div className="flex-1 min-w-0">
            {/* the order */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/40 px-4 py-3 mb-3 flex flex-wrap items-center gap-x-6 gap-y-1">
              <div>
                <div className="text-lg font-black text-white leading-tight">{o.ref} <span className="text-slate-400 font-bold text-sm">· customer {o.customer}</span></div>
                <div className="text-sm text-slate-300">{o.style}</div>
              </div>
              <div className="text-sm"><span className="text-slate-400">Qty</span> <b className="text-white tabular-nums">{num(o.qty)}</b></div>
              <div className="text-sm"><span className="text-slate-400">Cutting</span> <b className="text-white">{o.cut_from} → {o.cut_to}</b></div>
              <div className="text-sm"><span className="text-slate-400">Colours</span> <b className="text-white">{Object.entries(o.colours || {}).map(([c, n]) => `${c} ${num(n)}`).join(" · ")}</b></div>
              <div className="text-sm"><span className="text-slate-400">Cutting allowance</span> <b className="text-white">{o.allowance}%</b></div>
            </div>
            <Tiles items={d.summary} />

            {/* the markers */}
            <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Markers</div>
            <div className="flex gap-3 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: "thin", scrollbarColor: "#475569 transparent" }}>
              {(d.markers || []).map((m) => (
                <div key={m.marker} className="flex-shrink-0 rounded-2xl border border-slate-700 bg-slate-800/60 p-3 w-[274px]">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-black text-white truncate">{m.marker}</span>
                    <span className="text-lg font-black text-emerald-300 tabular-nums">{m.efficiency}%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mb-1.5 truncate">{m.colour}{multi ? ` · ${m.part}` : ""} · {m.ratio_text} · {m.garments}-way{m.doubled ? " (ratio doubled)" : ""}</div>
                  <MarkerDiagram m={m} />
                  <div className="mt-1.5 grid grid-cols-2 gap-x-3 text-[11px] text-slate-300 tabular-nums">
                    <span>Length <b className="text-white">{m.length_m.toFixed(2)} m</b></span>
                    <span>Width <b className="text-white">{m.width_cm} cm</b></span>
                    <span>Per garment <b className="text-white">{m.cons_m.toFixed(3)} m</b></span>
                    <span><b className="text-white">{m.cons_g} g</b> <span className="text-slate-500">(MRP {m.mrp_g} g)</span></span>
                    <span>Lays <b className="text-white">{m.lays}</b></span>
                    <span>Plies <b className="text-white">{num(m.plies)}</b></span>
                  </div>
                </div>
              ))}
            </div>

            {/* the size check */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">
              Size check — planned to cut / ordered
              {d.size_check_ok ? <span className="normal-case tracking-normal text-emerald-300 font-semibold">every size covered</span> : <span className="normal-case tracking-normal text-rose-300 font-semibold">not every size covered — a lot is on hold</span>}
            </div>
            <div className="mb-4"><SizeCheck checks={d.size_check} multi={multi} /></div>

            {/* the lays */}
            <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Lays — the warehouse releases the rolls of each lay on its date and shift</div>
            <Table cols={cols} rows={rows} />
          </div>
        </div>
      )}
      <p className="mt-3 text-[11px] text-slate-500">{d ? `${rows.length} of ${d.total} rows · as of ${String(d.as_of || "").replace("T", " ").slice(0, 16)} · ` : ""}Simulated factory data — no real customer, supplier or person.</p>
    </div>
  );
};

export default CutPlan;
