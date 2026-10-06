// YPI — Tech-pack: the Prod Sheet. Eleven pages per order, in the order the factory's own
// system shows them (Specification Sheet … Overview), each complete / draft / not started.
// Read-only demo: "View Details" only; editing (Form View) is in the real YPI.
// Data: M1 /sim/view {module:"ypi", view:"techpack", pick} → {picker, pages[{key, title, status,
// by, updated, content:{blocks}}], progress, order}. Simulated factory, invented data.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RefreshCw, Search, BookOpen, Scissors, LayoutGrid, Package, ClipboardCheck, Eye, Lock } from "lucide-react";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const num = (v) => (typeof v === "number" ? v.toLocaleString("en-US", { maximumFractionDigits: 2 }) : v === null || v === undefined ? "" : String(v));
const LIGHT = { green: "bg-emerald-400", amber: "bg-amber-400", red: "bg-rose-500", grey: "bg-slate-500" };
const STATUS = {
  complete: { dot: "bg-emerald-400", chip: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  draft: { dot: "bg-amber-400", chip: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  "not started": { dot: "bg-slate-500", chip: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
};
const YPI_TABS = [
  ["techpack", "Tech-pack", BookOpen],
  ["cut-plan", "Marker & Cut Plan", Scissors],
  ["markers", "Markers", LayoutGrid],
  ["material-portal", "Material Portal", Package],
  ["bom-status", "BOM status", ClipboardCheck],
];
const SWATCH = { white: "#e2e8f0", black: "#1f2937", navy: "#1e3a8a", grey: "#9ca3af", burgundy: "#7f1d1d", "forest green": "#166534", charcoal: "#374151", olive: "#4d5b23", sand: "#d6c7a1", "sky blue": "#7dd3fc" };

// ---- garment outlines, drawn in a 100 × 100 box (the callout x / y are % of this box)
const OUTLINES = {
  tee: {
    body: "M38,8 Q50,17 62,8 L78,12 L96,32 L87,42 L77,35 L77,95 L23,95 L23,35 L13,42 L4,32 L22,12 Z",
    lines: ["M40,9.5 Q50,19.5 60,9.5", "M23,91 L77,91", "M93.5,30 L84.5,40", "M6.5,30 L15.5,40"],
  },
  polo: {
    body: "M38,8 Q50,14 62,8 L78,12 L96,32 L87,42 L77,35 L77,95 L23,95 L23,35 L13,42 L4,32 L22,12 Z",
    lines: ["M38,8 L43,15 L50,10 L57,15 L62,8", "M47.5,10 L47.5,26 L52.5,26 L52.5,10", "M23,91 L77,91", "M93,29.5 L84,39.5", "M7,29.5 L16,39.5", "M23,88 L26,88", "M77,88 L74,88"],
    dots: [[50, 14], [50, 19], [50, 24]],
  },
  hoodie: {
    body: "M36,12 L64,12 L80,16 L97,82 L88,86 L77,40 L77,96 L23,96 L23,40 L12,86 L3,82 L20,16 Z",
    lines: ["M36,12 C30,4 34,-4 50,-4 C66,-4 70,4 64,12", "M40,12 Q50,3 60,12", "M50,12 L50,96", "M23,89 L77,89", "M95,76 L86,80", "M5,76 L14,80", "M28,64 L40,62 L40,80 L28,82", "M72,64 L60,62 L60,80 L72,82"],
    dots: [[44, 17], [56, 17]],
  },
  pants: {
    body: "M27,4 L73,4 L77,96 L56,96 L50,36 L44,96 L23,96 Z",
    lines: ["M27.3,11 L72.7,11", "M28,14 L34,26", "M72,14 L66,26", "M47,11 L45,20", "M53,11 L55,20", "M23.4,89 L44.6,89", "M55.4,89 L76.6,89", "M50,11 L50,36"],
    dots: [[47, 8], [53, 8]],
  },
  shorts: {
    body: "M26,6 L74,6 L80,62 L54,64 L50,40 L46,64 L20,62 Z",
    lines: ["M26.5,13 L73.5,13", "M27,15 L32,28", "M73,15 L68,28", "M47,13 L45,21", "M53,13 L55,21", "M20.5,57 L46.6,59", "M53.4,59 L79.5,57", "M50,13 L50,40"],
    dots: [[47, 10], [53, 10]],
  },
  leggings: {
    body: "M30,4 L70,4 L68,40 L62,96 L54,96 L50,34 L46,96 L38,96 L32,40 Z",
    lines: ["M30.2,14 L69.8,14", "M47,33 L50,30 L53,33 L50,40 Z", "M38.3,92 L45.8,92", "M54.2,92 L61.7,92"],
  },
  bra: {
    body: "M30,8 L36,8 L42,28 Q50,34 58,28 L64,8 L70,8 L80,48 L80,88 L20,88 L20,48 Z",
    lines: ["M20,76 L80,76", "M27,50 Q37,38 47,52", "M53,52 Q63,38 73,50", "M33,26 Q50,40 67,26"],
  },
};

const Garment = ({ outline, fill = "#0f172a", stroke = "#cbd5e1", sw = 0.8 }) => {
  const g = OUTLINES[outline] || OUTLINES.tee;
  return (
    <g>
      <path d={g.body} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      {(g.lines || []).map((d, i) => <path key={i} d={d} fill="none" stroke={stroke} strokeWidth={sw * 0.6} strokeDasharray={i === 0 ? undefined : "1.6 1.2"} />)}
      {(g.dots || []).map(([x, y], i) => <circle key={`d${i}`} cx={x} cy={y} r={1.1} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />)}
    </g>
  );
};

// Technical sketch: the garment with numbered arrows to text bubbles on both sides.
const Sketch = ({ b }) => {
  const W = 400, H = 220, X = (x) => 100 + 2 * x, Y = (y) => 10 + 2 * y;
  const cs = b.callouts || [];
  const left = [], right = [];
  [...cs].sort((a, c) => a.y - c.y).forEach((c) => {
    if (c.x < 50) left.push(c);
    else if (c.x > 50) right.push(c);
    else (left.length <= right.length ? left : right).push(c);
  });
  const slot = (side) => side.sort((a, c) => a.y - c.y).map((c, i) => ({ ...c, sy: 10 + (i + 0.5) * (200 / side.length) }));
  const L = slot(left), R = slot(right);
  return (
    <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full">
        <defs>
          <marker id="tp-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 Z" fill="#fbbf24" /></marker>
        </defs>
        <g transform="translate(100,10) scale(2)"><Garment outline={b.outline} /></g>
        {L.map((c) => <line key={`l${c.no}`} x1={92} y1={c.sy} x2={X(c.x)} y2={Y(c.y)} stroke="#fbbf24" strokeWidth="0.8" markerEnd="url(#tp-arrow)" />)}
        {R.map((c) => <line key={`r${c.no}`} x1={308} y1={c.sy} x2={X(c.x)} y2={Y(c.y)} stroke="#fbbf24" strokeWidth="0.8" markerEnd="url(#tp-arrow)" />)}
        {cs.map((c) => (
          <g key={`n${c.no}`}>
            <circle cx={X(c.x)} cy={Y(c.y)} r="5" fill="#f59e0b" />
            <text x={X(c.x)} y={Y(c.y) + 2.3} textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#0f172a">{c.no}</text>
          </g>
        ))}
      </svg>
      {[...L.map((c) => ({ ...c, side: "l" })), ...R.map((c) => ({ ...c, side: "r" }))].map((c) => (
        <div key={`b${c.no}`} className="absolute rounded-lg border border-amber-400/40 bg-slate-900/90 px-2 py-1 text-[11px] leading-snug text-slate-200 shadow"
          style={{ left: c.side === "l" ? "0%" : "77%", width: "23%", top: `${(c.sy / H) * 100}%`, transform: "translateY(-50%)" }}>
          <span className="font-bold text-amber-300">{c.no}. {c.part}</span> — {c.text}
        </div>
      ))}
    </div>
  );
};

const Thumb = ({ outline, view, fill }) => (
  <svg viewBox="-5 -5 110 110" className="w-full h-24">
    <Garment outline={outline} fill={fill || "#1e293b"} sw={1.2} />
    {view === "back" && <text x="50" y="60" textAnchor="middle" fontSize="10" fill="#94a3b8">BACK</text>}
    {view === "detail" && <circle cx="50" cy="16" r="14" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />}
    {view === "artwork" && <rect x="40" y="26" width="20" height="12" rx="2" fill="#f97316" fillOpacity="0.8" />}
  </svg>
);

// ---- generic blocks
const Title = ({ children }) => <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">{children}</div>;

const Table = ({ b }) => {
  const cols = b.columns || [];
  const isNum = (v) => typeof v === "number";
  // footer: total SMV under the Process Sheet, total metres under Thread Consumptions
  const foot = b.total_smv !== undefined ? { operation: "Total SMV", operators: num(b.operators), smv: `${Number(b.total_smv).toFixed(2)} min` }
    : b.total_m !== undefined ? { operation: "Thread per garment", metres: `${num(b.total_m)} m`, share: "100%" } : null;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700">
      <table className="w-full text-sm">
        <thead className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider">
          <tr>{cols.map(([k, l]) => <th key={k} className="px-2.5 py-1.5 text-left font-semibold whitespace-nowrap">{l}</th>)}</tr>
        </thead>
        <tbody>
          {(b.rows || []).map((r, i) => (
            <tr key={i} className={`border-t border-slate-700/60 ${r._total ? "bg-slate-800/60 font-bold text-white" : "hover:bg-slate-800/40"}`}>
              {cols.map(([k]) => <td key={k} className={`px-2.5 py-1 ${isNum(r[k]) ? "tabular-nums text-right" : ""} ${k === "pom" || k === "operation" || k === "finding" ? "text-white" : ""}`}>{num(r[k])}</td>)}
            </tr>
          ))}
        </tbody>
        {foot && (
          <tfoot>
            <tr className="border-t border-slate-600 bg-slate-800/60 font-bold text-white">
              {cols.map(([k]) => <td key={k} className={`px-2.5 py-1.5 ${k === "operation" ? "" : "text-right tabular-nums"}`}>{foot[k] === undefined ? "" : foot[k]}</td>)}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

const Block = ({ b }) => {
  const wrap = (body, note) => <section className="mb-4">{b.title && <Title>{b.title}</Title>}{body}{note && b.note && <div className="mt-1 text-[11px] text-slate-400">{b.note}</div>}</section>;
  switch (b.type) {
    case "note":
      return <div className={`mb-3 rounded-xl border px-3 py-2 text-sm ${b.tone === "amber" ? "border-amber-500/30 bg-amber-500/10 text-amber-200" : "border-slate-600 bg-slate-800/60 text-slate-300"}`}>{b.text}</div>;
    case "fields":
      return wrap(
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-1 rounded-xl border border-slate-700 bg-slate-800/40 px-3 py-2">
          {(b.items || []).map(([k, v]) => <div key={k} className="text-sm flex gap-2"><span className="text-slate-400 whitespace-nowrap">{k}</span><b className="text-white font-semibold">{num(v)}</b></div>)}
        </div>);
    case "list":
      return wrap(<ul className="list-disc pl-5 space-y-0.5 text-sm text-slate-200">{(b.items || []).map((x, i) => <li key={i}>{x}</li>)}</ul>);
    case "rich":
      return wrap(
        <div className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-2 space-y-2">
          {(b.sections || []).map((s) => (
            <div key={s.h}><div className="text-sm font-bold text-emerald-300">{s.h}</div>
              <ul className="list-disc pl-5 text-sm text-slate-200 space-y-0.5">{(s.items || []).map((x, i) => <li key={i}>{x}</li>)}</ul></div>
          ))}
        </div>);
    case "table":
      return wrap(<Table b={b} />, true);
    case "sketch":
      return wrap(<div className="rounded-xl border border-slate-700 bg-slate-950/60 p-2"><Sketch b={b} /></div>);
    case "images":
      return wrap(
        <div className="flex flex-wrap gap-2">
          {(b.items || []).map((x, i) => (
            <figure key={i} className="w-36 rounded-xl border border-slate-700 bg-slate-800/40 p-1.5"><Thumb outline={x.outline} view={x.view} /><figcaption className="text-[11px] text-slate-400 leading-tight">{x.caption}</figcaption></figure>
          ))}
        </div>);
    case "product":
      return wrap(
        <div className="flex flex-wrap gap-3 items-start">
          {(b.parts || []).map((p) => (
            <div key={p.name} className="w-48 rounded-xl border border-slate-700 bg-slate-800/40 p-2">
              <Thumb outline={p.outline} fill={SWATCH[b.colour] || "#334155"} />
              <div className="text-xs text-slate-300 text-center">{p.name} · {b.colour}</div>
            </div>
          ))}
          <div className="flex-1 min-w-[200px]"><div className="text-xs font-bold text-slate-400 mb-1">Comments / notes</div>
            <ul className="list-disc pl-5 text-sm text-slate-200 space-y-0.5">{(b.notes || []).map((x, i) => <li key={i}>{x}</li>)}</ul></div>
        </div>);
    case "stats":
      return wrap(<div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">{(b.items || []).map((x) => <span key={x.label}><span className="text-slate-400">{x.label}</span> <b className="text-white tabular-nums">{num(x.value)}</b></span>)}</div>);
    case "customers":
      return wrap(
        <div className="rounded-xl border border-slate-700 overflow-hidden">
          {(b.items || []).map((c) => (
            <div key={c.customer} className="flex items-center gap-3 px-3 py-1.5 border-t border-slate-700/60 first:border-t-0 text-sm">
              <b className="w-28 text-white">Customer {c.customer}</b>
              <span className="w-20 text-slate-400 tabular-nums">{c.orders} orders</span>
              <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden"><div className="h-full bg-emerald-400" style={{ width: `${c.pct}%` }} /></div>
              <b className="w-12 text-right text-emerald-300 tabular-nums">{c.pct}%</b>
              <span className="hidden md:inline text-xs text-slate-400 w-64">{c.complete} complete · {c.in_progress} in progress · {c.not_started} not started</span>
            </div>
          ))}
        </div>);
    default:
      return null;
  }
};

const TechPack = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const [pick, setPick] = useState(search.get("order") || "");
  const [tab, setTab] = useState(search.get("tab") || "spec");
  const [d, setD] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ypi", view: "techpack", pick: pick || undefined }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error("unavailable");
      setD(j);
      setError("");
    } catch (e) {
      setError("Tech-pack data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [pick]);

  useEffect(() => { load(); }, [load]);

  const setParam = (k, v) => { const n = new URLSearchParams(search); n.set(k, v); setSearch(n, { replace: true }); };
  const choose = (id) => { setPick(id); setParam("order", id); };
  const chooseTab = (k) => { setTab(k); setParam("tab", k); };

  const opts = useMemo(() => {
    const all = (d && d.picker && d.picker.options) || [];
    const s = q.trim().toLowerCase();
    return s ? all.filter((x) => `${x.id} ${x.sub}`.toLowerCase().includes(s)) : all;
  }, [d, q]);
  const onSearchKey = (e) => {
    if (e.key !== "Enter") return;
    const s = q.trim().toUpperCase();
    const hit = ((d && d.picker && d.picker.options) || []).find((x) => x.id === s) || (opts.length === 1 ? opts[0] : null);
    if (hit) choose(hit.id);
  };

  const pages = (d && d.pages) || [];
  const page = pages.find((p) => p.key === tab) || pages[0];
  const pr = (d && d.progress) || null;
  const sel = d && d.picker ? d.picker.selected : "";
  const o = (d && d.order) || {};

  return (
    <div className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-4 md:px-6 pb-6 pt-28 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; }`}</style>

      {/* one toolbar line */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h1 className="text-xl font-black text-white leading-tight whitespace-nowrap mr-1">Tech-pack — {sel || "…"}</h1>
        {pr && <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold tabular-nums ${pr.complete === pr.of ? STATUS.complete.chip : pr.complete || pr.draft ? STATUS.draft.chip : STATUS["not started"].chip}`}>{pr.complete}/{pr.of} pages complete</span>}
        <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-1 py-0.5 flex-wrap">
          {YPI_TABS.map(([v, label, Icon]) => (
            <button key={v} onClick={() => navigate(`/dashboard/ypi/${v}`)} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${v === "techpack" ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 ml-auto">
          <Search size={15} className="text-slate-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onSearchKey} placeholder="Order no. (e.g. YAIAA6)" className="bg-transparent outline-none text-sm w-40 text-white placeholder-slate-500" />
        </div>
        <button onClick={load} className="p-2 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={15} className={loading ? "animate-spin" : ""} /></button>
      </div>

      {/* the eleven Prod Sheet tabs */}
      {pages.length > 0 && (
        <div className="flex gap-0.5 overflow-x-auto border-b border-slate-700 mb-3" style={{ scrollbarWidth: "thin" }}>
          {pages.map((p) => (
            <button key={p.key} onClick={() => chooseTab(p.key)} title={`${p.title} — ${p.status}`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold whitespace-nowrap border-b-2 -mb-px ${page && page.key === p.key ? "border-emerald-400 text-emerald-300" : "border-transparent text-slate-400 hover:text-white"}`}>
              <span className={`inline-block w-2 h-2 rounded-full ${(STATUS[p.status] || STATUS["not started"]).dot}`} />{p.title}
            </button>
          ))}
        </div>
      )}

      {error && <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 px-4 py-3 text-sm">{error}</div>}

      {d && d.picker && (
        <div className="flex flex-col md:flex-row gap-3 items-start">
          {/* orders with status lights */}
          <aside className="w-full md:w-56 flex-shrink-0 rounded-2xl border border-slate-700 bg-slate-800/60 p-1.5 md:sticky md:top-28 overflow-y-auto" style={{ maxHeight: "calc(100vh - 9rem)", scrollbarWidth: "thin", scrollbarColor: "#475569 transparent" }}>
            <div className="px-2 pb-1 flex flex-wrap gap-x-3 text-[10px] text-slate-400">
              <span className="font-bold uppercase tracking-wider">Orders ({opts.length})</span>
              {[["green", "complete"], ["amber", "in progress"], ["grey", "not started"]].map(([t, l]) => <span key={t} className="flex items-center gap-1"><span className={`inline-block w-2 h-2 rounded-full ${LIGHT[t]}`} />{l}</span>)}
            </div>
            {opts.map((x) => (
              <button key={x.id} onClick={() => choose(x.id)} className={`w-full text-left rounded-lg px-2.5 py-1.5 mb-0.5 border ${sel === x.id ? "bg-emerald-500/20 border-emerald-500/40" : "border-transparent hover:bg-slate-700/60"}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-white"><span className={`inline-block w-2.5 h-2.5 rounded-full ${LIGHT[x.tone] || LIGHT.grey}`} />{x.name}</span>
                  <span className="text-[11px] font-bold tabular-nums text-emerald-300">{x.count}/{x.of}</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">{x.sub}</div>
              </button>
            ))}
          </aside>

          {/* the chosen page */}
          {page && (
            <div className="flex-1 min-w-0 rounded-2xl border border-slate-700 bg-slate-800/30 p-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-sm">
                <span className="text-slate-400">Order no.</span>
                <span className="rounded-lg border border-slate-600 bg-slate-900 px-2 py-0.5 font-bold text-white">{sel}</span>
                <span className="text-slate-400">{o.style} · customer {o.customer}</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${(STATUS[page.status] || STATUS["not started"]).chip}`}>{page.no}. {page.title} — {page.status}</span>
                <span className="text-xs text-slate-400">{page.by}{page.updated ? ` · updated ${page.updated}` : ""}</span>
                <div className="ml-auto flex items-center gap-0.5 rounded-lg border border-slate-700 bg-slate-900 p-0.5 text-xs font-bold">
                  <button disabled title="editing is in the real YPI" className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-500 cursor-not-allowed"><Lock size={12} />Form View</button>
                  <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300"><Eye size={12} />View Details</button>
                </div>
              </div>
              {((page.content && page.content.blocks) || []).map((b, i) => <Block key={`${page.key}-${i}`} b={b} />)}
            </div>
          )}
        </div>
      )}
      <p className="mt-3 text-[11px] text-slate-500">{d ? `As of ${String(d.as_of || "").replace("T", " ").slice(0, 16)} · ` : ""}Simulated factory data — no real customer, supplier or person.</p>
    </div>
  );
};

export default TechPack;
