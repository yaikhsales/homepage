// The fabric warehouse as a plan you can play with: 30 aisles. Along both sides
// of each aisle's walkway (yellow lines) stand 8 blocks; one block is a stack of
// three steel cages: level 1 at the bottom (B), 2 in the middle (M), 3 at the top
// (T). Cage A09-R8-3 = aisle A09, side R, block 8, level 3 (T). Every cage is one
// cell, coloured by state or by customer. The two rows of aisles (A01-A15 and
// A16-A30) sit in a strip that scrolls sideways. Hover a cell to see what is in
// it, click an aisle to open it enlarged, click a cage card for its full detail.
// Ordinary fabric is in aisles A01-A28. A29 is the rack for damaged rolls and
// A30 the rack for fabric returned from cutting, which is kept by weight in
// bags (kg and bags, no rolls).
// Data: M1 /sim/view {module:"fc", view:"warehouse"} (+ cage for the roll list).
// Simulated factory — every order, lot and price is invented.
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw, Search, X } from "lucide-react";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const STATE = {
  stored: { color: "#38bdf8", short: "Stored" },
  issuing: { color: "#34d399", short: "Issuing to cutting" },
  hold: { color: "#f43f5e", short: "On hold" },
  returned: { color: "#a78bfa", short: "Returned" },
  damaged: { color: "#fb923c", short: "Damaged" },
  reserved: { color: "#fbbf24", short: "Reserved" },
};
const CUSTOMER = { AA: "#38bdf8", BB: "#fbbf24", CC: "#34d399", DD: "#f472b6" };
const EMPTY = "rgba(148,163,184,0.13)";
const ROW_LETTERS = "LRABCDEF";
const num = (v) => (typeof v === "number" ? v.toLocaleString("en-US") : v);
const usd = (v) => `USD ${Math.round(v || 0).toLocaleString("en-US")}`;
const ZONE = { returns: { label: "returns", text: "text-violet-300", badge: "bg-violet-500/20 text-violet-300", name: "returns rack · bags by weight" }, damaged: { label: "damaged", text: "text-orange-300", badge: "bg-orange-500/20 text-orange-300", name: "damaged fabric rack" } };
const STATE_WORD = { hold: "on hold" };
const plural = (n, w) => `${num(n)} ${w}${n === 1 ? "" : "s"}`;
// what a cage holds, in its own unit: returned fabric is bags by weight, everything else is rolls
const holds = (c) => (c.state === "returned" ? plural(c.bags || 0, "bag") : plural(c.rolls || 0, "roll"));
// a cage's level as the warehouse names it: 1 bottom (B), 2 middle (M), 3 top (T)
const LEVEL = { 1: { tag: "B", name: "bottom" }, 2: { tag: "M", name: "middle" }, 3: { tag: "T", name: "top" } };
const levelTag = (l) => (LEVEL[l] || { tag: String(l) }).tag;
// "A09-R8-3" -> {side: "R", block: 8, level: 3}
const cagePos = (id) => { const m = /^A\d{2}-([A-Z])(\d+)-(\d+)$/.exec(id || ""); return m ? { side: m[1], block: +m[2], level: +m[3] } : null; };
const posSay = (id) => { const p = cagePos(id); return p ? `Side ${p.side} · block ${p.block} · level ${p.level} — ${levelTag(p.level)}${LEVEL[p.level] ? ` (${LEVEL[p.level].name})` : ""}` : ""; };
const WALK = "#facc15"; // the yellow lines that mark the walkway
// today's cell (before the redraw) was fluid: the strip width shared by 15 aisles, two rows of 3 cells each;
// the owner asked for double that. Never smaller than 18 px.
const cellFor = (w) => Math.max(18, Math.floor((2 * (((Math.max(900, w) - 84) / 15 - 15) / 2 - 2)) / 3));

const WarehouseMap = ({ onBack }) => {
  const [d, setD] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [colourBy, setColourBy] = useState("state"); // "state" or "customer"
  const [stateOn, setStateOn] = useState(null); // legend toggle: show only this state
  const [custOn, setCustOn] = useState(null); // legend toggle: show only this customer
  const [q, setQ] = useState("");
  const [aisle, setAisle] = useState(""); // the aisle opened below the map; the fullest in value until one is clicked
  const [cageId, setCageId] = useState(null);
  const [rolls, setRolls] = useState(null); // {cage, rows} — the roll list of the chosen cage
  const [tip, setTip] = useState(null); // {id, x, y, below}
  const [stripW, setStripW] = useState(1200); // width of the map strip, for the cell size
  const [edge, setEdge] = useState({ left: true, right: false, from: "", to: "" }); // what the strip shows now
  const stripBox = useRef(null);
  const strip = useRef(null);

  const post = (body) => fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "fc", view: "warehouse", ...body }) });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await post({});
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error("unavailable");
      setD(j);
      setAisle((cur) => cur || ((j.aisles || []).reduce((best, a) => (!best || a.value > best.value ? a : best), null) || {}).aisle || "A01");
      setError("");
    } catch (e) {
      setError("Warehouse data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // the roll list of the chosen cage
  useEffect(() => {
    let live = true;
    setRolls(null);
    if (!cageId) return undefined;
    (async () => {
      try {
        const r = await post({ cage: cageId });
        const j = await r.json();
        if (live && r.ok && j.ok) setRolls({ cage: cageId, rows: j.rows || [] });
      } catch (e) { /* the detail card still shows the cage without its roll list */ }
    })();
    return () => { live = false; };
  }, [cageId, d]);

  const byCage = useMemo(() => {
    const m = {};
    ((d && d.cages) || []).forEach((c) => {
      m[c.cage] = { ...c, hay: [c.cage, c.order, c.order_id, `customer ${c.customer}`, c.colour, c.fabric, c.lot, c.state, c.cause, c.next_step, c.claim_no, c.container, ...(c.lots || []).map((x) => x.lot)].join(" ").toLowerCase() };
    });
    return m;
  }, [d]);

  const words = useMemo(() => q.trim().toLowerCase().split(/\s+/).filter(Boolean), [q]);
  const filtering = !!(stateOn || custOn || words.length);
  const bright = useCallback((c) => !!c && (!stateOn || c.state === stateOn) && (!custOn || c.customer === custOn) && words.every((w) => c.hay.includes(w)), [stateOn, custOn, words]);
  const paint = useCallback((c) => (colourBy === "customer" ? CUSTOMER[c.customer] || "#94a3b8" : (STATE[c.state] || {}).color || "#94a3b8"), [colourBy]);

  const found = useMemo(() => {
    const xs = Object.values(byCage).filter(bright);
    return { cages: xs.length, rolls: xs.reduce((s, c) => s + (c.rolls || 0), 0), bags: xs.reduce((s, c) => s + (c.bags || 0), 0), value: xs.reduce((s, c) => s + (c.value || 0), 0), aisles: new Set(xs.map((c) => c.aisle)).size };
  }, [byCage, bright]);

  const counts = useMemo(() => {
    const s = {}; const cu = {};
    Object.values(byCage).forEach((c) => { s[c.state] = (s[c.state] || 0) + 1; if (c.state !== "reserved") cu[c.customer] = (cu[c.customer] || 0) + 1; });
    return { s, cu };
  }, [byCage]);

  const lay = (d && d.layout) || {};
  const slots = lay.slots_per_row || 8;
  const levels = lay.cages_per_slot || 3;
  const rowNames = ROW_LETTERS.slice(0, lay.rows_per_aisle || 2).split("");
  const aisles = (d && d.aisles) || [];
  const A = aisles.find((a) => a.aisle === aisle);
  const idx = aisles.findIndex((a) => a.aisle === aisle);
  const go = (k) => { if (aisles.length) { setAisle(aisles[(idx + k + aisles.length) % aisles.length].aisle); setCageId(null); } };
  const chosen = cageId ? byCage[cageId] : null;

  const cell = cellFor(stripW);
  const bGap = Math.max(3, Math.round(cell / 6)); // between two blocks
  const walkH = Math.max(12, Math.round(cell * 0.7)); // the walkway strip
  const cellStyle = (c, id) => {
    const on = c && (!filtering || bright(c));
    const st = { width: cell, height: cell, borderRadius: 2 };
    if (!c) st.background = EMPTY;
    else if (c.state === "reserved") { st.background = "transparent"; st.boxShadow = `inset 0 0 0 1.5px ${paint(c)}`; } else st.background = paint(c);
    st.opacity = c ? (on ? 1 : 0.14) : filtering ? 0.45 : 1;
    if (id === cageId) st.outline = "2px solid #fff";
    return st;
  };

  // the plan of all aisles; one listener for the whole map
  const onMapOver = (e) => {
    const id = e.target && e.target.dataset ? e.target.dataset.cage : null;
    if (!id) { if (tip) setTip(null); return; }
    if (tip && tip.id === id) return;
    const r = e.target.getBoundingClientRect();
    setTip({ id, x: Math.min(Math.max(r.left + r.width / 2, 150), window.innerWidth - 150), y: r.top < 190 ? r.bottom + 8 : r.top - 8, below: r.top < 190 });
  };
  const onMapClick = (e) => {
    const el = e.target.closest ? e.target.closest("[data-aisle]") : null;
    if (!el) return;
    setAisle(el.dataset.aisle);
    const id = e.target.dataset ? e.target.dataset.cage : null;
    setCageId(id && byCage[id] ? id : null);
  };

  // the strip: its width sets the cell size; scrolling keeps the ‹ › buttons and the "showing" note up to date
  useEffect(() => {
    const el = stripBox.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(() => setStripW(el.clientWidth));
    ro.observe(el);
    setStripW(el.clientWidth);
    return () => ro.disconnect();
  }, [d]);
  const onStrip = useCallback(() => {
    const el = strip.current;
    if (!el) return;
    const all = [...el.querySelectorAll("[data-aisle]")]; const top = all.slice(0, Math.ceil(all.length / 2)); // the first row of aisles
    const seen = top.filter((x) => x.offsetLeft + x.offsetWidth / 2 > el.scrollLeft && x.offsetLeft + x.offsetWidth / 2 < el.scrollLeft + el.clientWidth).map((x) => x.dataset.aisle);
    const twin = (a) => { const i = all.findIndex((x) => x.dataset.aisle === a) + top.length; return all[i] ? all[i].dataset.aisle : ""; };
    setEdge({ left: el.scrollLeft <= 2, right: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2, from: seen[0] || "", to: seen[seen.length - 1] || "",
      from2: twin(seen[0]), to2: twin(seen[seen.length - 1]), wide: el.scrollWidth > el.clientWidth + 2 });
    setTip(null);
  }, []);
  useEffect(() => { onStrip(); }, [onStrip, cell, d]);
  // slide the strip (never the page) so this aisle is in view
  const showAisle = useCallback((a) => {
    const el = strip.current; const x = el && el.querySelector(`[data-aisle="${a}"]`);
    if (!x) return;
    if (x.offsetLeft >= el.scrollLeft && x.offsetLeft + x.offsetWidth <= el.scrollLeft + el.clientWidth) return;
    el.scrollTo({ left: Math.max(0, x.offsetLeft - (el.clientWidth - x.offsetWidth) / 2), behavior: "smooth" });
  }, []);
  useEffect(() => { if (aisle) showAisle(aisle); }, [aisle, showAisle, cell]);
  const firstFound = useMemo(() => {
    if (!words.length) return "";
    return Object.values(byCage).filter(bright).map((c) => c.aisle).sort()[0] || "";
  }, [byCage, bright, words]);
  useEffect(() => { if (firstFound) showAisle(firstFound); }, [firstFound, showAisle]);
  const slide = (k) => {
    const el = strip.current; const x = el && el.querySelector("[data-aisle]");
    if (el && x) el.scrollBy({ left: k * 3 * (x.offsetWidth + 8), behavior: "smooth" });
  };

  // one side of an aisle in the overview: 8 blocks in a line, each a stack of 3 cells (T on top, B at the bottom)
  const side = (a, r) => (
    <div className="flex items-stretch" style={{ gap: 3 }}>
      <div className="flex flex-col justify-center pointer-events-none text-[10px] font-black text-slate-400" style={{ width: 9 }}>{r}</div>
      <div className="flex flex-col pointer-events-none text-slate-500 font-bold" style={{ gap: 2, fontSize: Math.min(10, Math.max(8, cell * 0.45)), width: 8 }}>
        {Array.from({ length: levels }, (_, i) => <div key={i} className="flex items-center justify-end" style={{ height: cell }}>{levelTag(levels - i)}</div>)}
      </div>
      <div className="flex" style={{ gap: bGap }}>
        {Array.from({ length: slots }, (_, b) => (
          <div key={b} className="flex flex-col" style={{ gap: 2 }}>
            {Array.from({ length: levels }, (_, i) => {
              const id = `${a.aisle}-${r}${b + 1}-${levels - i}`;
              return <div key={id} data-cage={id} style={cellStyle(byCage[id], id)} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
  // the walkway between the two sides, edged with yellow lines; block numbers along it
  const walkway = (big) => (
    <div className="flex items-center pointer-events-none" style={{ height: big ? 26 : walkH, borderTop: `1px solid ${WALK}`, borderBottom: `1px solid ${WALK}`, background: "rgba(250,204,21,0.05)", margin: big ? "6px 0" : "3px 0" }}>
      {big ? null : <div style={{ width: 9 + 3 + 8 + 3 }} />}
      <div className={big ? "grid w-full gap-1.5" : "flex"} style={big ? { gridTemplateColumns: `repeat(${slots}, minmax(0, 1fr))` } : { gap: bGap }}>
        {Array.from({ length: slots }, (_, b) => <div key={b} className="text-center tabular-nums text-yellow-200/70 font-bold" style={big ? { fontSize: 11 } : { width: cell, fontSize: Math.min(10, Math.max(8, cell * 0.42)) }}>{b + 1}</div>)}
      </div>
    </div>
  );

  const map = useMemo(() => {
    if (!d) return null;
    return (
      <div className="grid gap-2 w-max" style={{ gridTemplateColumns: `repeat(${Math.ceil(aisles.length / 2) || 1}, max-content)` }}>
        {aisles.map((a) => (
          <div key={a.aisle} data-aisle={a.aisle} className={`rounded-lg border px-1.5 pb-1.5 cursor-pointer ${a.aisle === aisle ? "border-white bg-slate-700/70" : "border-slate-700 bg-slate-900/60 hover:border-slate-400"}`}>
            <div className="flex items-baseline justify-between text-[11px] leading-5 pointer-events-none">
              <b className={a.aisle === aisle ? "text-white" : "text-slate-300"}>{a.aisle}</b>
              <span className={ZONE[a.zone] ? ZONE[a.zone].text : "text-slate-500"}>{ZONE[a.zone] ? ZONE[a.zone].label : a.in_use ? `${a.in_use}/${a.cages}` : ""}</span>
            </div>
            {rowNames.map((r, i) => <React.Fragment key={r}>{i > 0 && walkway(false)}{side(a, r)}</React.Fragment>)}
          </div>
        ))}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d, byCage, aisle, cageId, colourBy, stateOn, custOn, words, cell]);

  const tipCage = tip ? byCage[tip.id] : null;
  const chip = (on) => `flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition ${on ? "border-white bg-slate-700 text-white" : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500"}`;

  // one cage of the enlarged aisle, as a readable card
  // the tag in the top-left corner of a cage card: block number and level, e.g. "8·T"
  const tag = (id, light) => {
    const p = cagePos(id) || {};
    return <span data-level={levelTag(p.level)} title={posSay(id)} className={`shrink-0 rounded px-1 font-mono text-[10px] font-black leading-4 ${light ? "bg-slate-200 text-slate-900" : "bg-slate-700/80 text-slate-400"}`}>{p.block}·{levelTag(p.level)}</span>;
  };
  const CARD_H = 88;
  const card = (id) => {
    const c = byCage[id];
    if (!c) return <div key={id} data-card={id} title={`${id} · ${posSay(id)}`} className={`rounded-lg border border-dashed border-slate-700/70 px-1.5 py-1 text-[11px] text-slate-600 min-w-0 ${filtering ? "opacity-50" : ""}`} style={{ minHeight: CARD_H }}><div className="flex">{tag(id, false)}</div><div className="mt-0.5">empty</div></div>;
    const on = !filtering || bright(c);
    const sc = (STATE[c.state] || {}).color;
    return (
      <button key={id} data-card={id} type="button" onClick={() => setCageId(id === cageId ? null : id)} title={`${id} · ${posSay(id)}`}
        className={`text-left rounded-lg border bg-slate-900/70 px-1.5 py-1 leading-tight min-w-0 ${id === cageId ? "border-white ring-1 ring-white" : "border-slate-700 hover:border-slate-400"}`}
        style={{ minHeight: CARD_H, opacity: on ? 1 : 0.2, borderLeft: `4px solid ${paint(c)}` }}>
        <div className="flex items-center justify-between gap-1 text-[11px]">
          {tag(id, true)}
          <span className="truncate font-semibold" style={{ color: sc }}>{STATE_WORD[c.state] || c.state}</span>
        </div>
        <div className="truncate text-[12px] font-bold text-white mt-0.5">{c.order}</div>
        <div className="truncate text-[11px] text-slate-300">{c.colour}</div>
        <div className="truncate font-mono text-[10px] text-slate-400">{c.lot}</div>
        {c.state === "reserved"
          ? <div className="truncate text-[11px] text-slate-300 tabular-nums">{c.expected_rolls} rolls expected</div>
          : <div className="flex items-baseline justify-between gap-1 text-[10px] text-slate-300 tabular-nums whitespace-nowrap"><b className="text-[11px] text-white">{holds(c)}</b><span className="truncate">{usd(c.value)}</span></div>}
      </button>
    );
  };

  const line = (label, value) => (value === "" || value === undefined || value === null ? null : (
    <div className="flex justify-between gap-3 border-b border-slate-700/60 py-1 text-[13px]"><span className="text-slate-400 shrink-0">{label}</span><span className="text-right text-white font-medium break-words min-w-0">{value}</span></div>
  ));

  return (
    <div className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-4 md:px-6 pb-6 pt-28 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; }`}</style>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={22} /></button>
          <div>
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Fabric Control · Warehouse · simulated factory</div>
            <h1 className="text-2xl font-black text-white leading-tight">{d ? d.title : "Fabric Warehouse"}{d && d.day ? <span className="ml-2 text-base font-semibold text-slate-400">{d.day}</span> : null}</h1>
            <p className="text-sm text-slate-400 max-w-5xl">{d ? d.subtitle : "Loading…"}</p>
          </div>
        </div>
        <button onClick={load} className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /></button>
      </div>

      {error && <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 px-4 py-3 text-sm">{error}</div>}

      {d && (
        <>
          <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-3">
            {/* figures in one row */}
            <div className="flex flex-wrap items-stretch gap-2">
              {d.summary.map((x) => (
                <div key={x.label} className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-1.5 min-w-[120px]">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">{x.label}</div>
                  <div className={`text-xl font-black tabular-nums leading-tight ${x.label === "Value on hold" ? "text-rose-300" : x.label.includes("returned") ? "text-violet-300" : x.label.includes("damaged") ? "text-orange-300" : "text-white"}`}>{num(x.value)}</div>
                </div>
              ))}
            </div>

            {/* legend (each entry is a toggle), colour switch, search */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {(d.states || []).map((s) => (
                <button key={s.key} type="button" title={s.label} onClick={() => setStateOn(stateOn === s.key ? null : s.key)} className={chip(stateOn === s.key)} style={{ opacity: stateOn && stateOn !== s.key ? 0.45 : 1 }}>
                  <span className="inline-block w-3 h-3 rounded-sm" style={s.key === "reserved" ? { boxShadow: `inset 0 0 0 2px ${STATE[s.key].color}` } : { background: (STATE[s.key] || {}).color || "#94a3b8" }} />
                  {(STATE[s.key] || {}).short || s.label} <span className="tabular-nums text-slate-400">{counts.s[s.key] || 0}</span>
                </button>
              ))}
              <span className="flex items-center gap-1.5 px-1 text-xs text-slate-500"><span className="inline-block w-3 h-3 rounded-sm" style={{ background: EMPTY }} />empty</span>
              <div className="flex items-center rounded-full border border-slate-700 bg-slate-900/60 p-0.5 text-xs font-semibold">
                <span className="px-2 text-slate-400">Colour by</span>
                {["state", "customer"].map((k) => (
                  <button key={k} type="button" onClick={() => setColourBy(k)} className={`rounded-full px-2.5 py-1 ${colourBy === k ? "bg-emerald-500/25 text-emerald-200" : "text-slate-300 hover:text-white"}`}>{k}</button>
                ))}
              </div>
              {(colourBy === "customer" || custOn) && Object.keys(counts.cu).sort().map((k) => (
                <button key={k} type="button" onClick={() => setCustOn(custOn === k ? null : k)} className={chip(custOn === k)} style={{ opacity: custOn && custOn !== k ? 0.45 : 1 }}>
                  <span className="inline-block w-3 h-3 rounded-sm" style={{ background: CUSTOMER[k] || "#94a3b8" }} />customer {k} <span className="tabular-nums text-slate-400">{counts.cu[k]}</span>
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                {filtering && <span className="text-xs text-slate-300"><b className="text-white tabular-nums">{num(found.cages)}</b> cages in {found.aisles} aisles · <b className="text-white tabular-nums">{num(found.rolls)}</b> rolls{found.bags ? <> · <b className="text-white tabular-nums">{num(found.bags)}</b> bags</> : null} · <b className="text-white tabular-nums">{usd(found.value)}</b></span>}
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order, customer, colour, fabric, lot" aria-label="Search the warehouse"
                    className="w-64 rounded-xl border border-slate-700 bg-slate-900 pl-8 pr-7 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
                  {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"><X size={14} /></button>}
                </div>
                {filtering && <button type="button" onClick={() => { setQ(""); setStateOn(null); setCustOn(null); }} className="rounded-xl border border-slate-700 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-700">Show all</button>}
              </div>
            </div>

            {/* the plan of the warehouse: a strip that slides sideways (the page itself never scrolls sideways) */}
            <style>{`.wh-strip{scrollbar-width:auto;scrollbar-color:#34d399 #1e293b}
.wh-strip::-webkit-scrollbar{height:14px}
.wh-strip::-webkit-scrollbar-track{background:#1e293b;border-radius:8px;border:1px solid #334155}
.wh-strip::-webkit-scrollbar-thumb{background:#10b981;border-radius:8px;border:3px solid #1e293b}
.wh-strip::-webkit-scrollbar-thumb:hover{background:#34d399}`}</style>
            <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-400">
              <span>Aisles {aisles.length ? `${aisles[0].aisle}–${aisles[Math.ceil(aisles.length / 2) - 1].aisle} on top, ${aisles[Math.ceil(aisles.length / 2)] ? aisles[Math.ceil(aisles.length / 2)].aisle : ""}–${aisles[aisles.length - 1].aisle} below` : ""}{edge.wide && edge.from ? <> · showing <b className="text-slate-200">{edge.from}–{edge.to}</b>{edge.from2 ? <> and <b className="text-slate-200">{edge.from2}–{edge.to2}</b></> : null} — slide with ‹ › or the green bar under the map</> : null}</span>
            </div>
            <div ref={stripBox} className="mt-1 flex items-stretch gap-1.5 min-w-0">
              <button type="button" onClick={() => slide(-1)} disabled={edge.left} aria-label="Slide the map left"
                className={`shrink-0 w-8 rounded-xl border text-2xl font-black leading-none flex items-center justify-center ${edge.left ? "border-slate-800 text-slate-700" : "border-emerald-500/60 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/30"}`}>‹</button>
              <div ref={strip} onScroll={onStrip} className="wh-strip relative flex-1 min-w-0 overflow-x-auto overflow-y-hidden pb-1" onMouseOver={onMapOver} onMouseLeave={() => setTip(null)} onClick={onMapClick}>{map}</div>
              <button type="button" onClick={() => slide(1)} disabled={edge.right} aria-label="Slide the map right"
                className={`shrink-0 w-8 rounded-xl border text-2xl font-black leading-none flex items-center justify-center ${edge.right ? "border-slate-800 text-slate-700" : "border-emerald-500/60 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/30"}`}>›</button>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Each box is one aisle: side L above, side R below, the walkway between them (yellow lines). Along each side stand 8 blocks, numbered 1–8 on the walkway; a block is a stack of 3 cages — T top (level 3), M middle (level 2), B bottom (level 1). Hover a cage, click an aisle to open it below. Ordinary fabric is stored in A01–A28; A29 is the rack for damaged rolls and A30 the rack for fabric returned from cutting, kept by weight in bags.</div>
          </div>

          {/* the chosen aisle, enlarged */}
          {A && (
            <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-800/40 p-3">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-1 py-1">
                  <button onClick={() => go(-1)} className="p-1.5 hover:bg-slate-700 rounded-lg" aria-label="Previous aisle"><ChevronLeft size={18} /></button>
                  <span className="px-2 text-sm font-bold text-white tabular-nums">Aisle {A.aisle}</span>
                  <button onClick={() => go(1)} className="p-1.5 hover:bg-slate-700 rounded-lg" aria-label="Next aisle"><ChevronRight size={18} /></button>
                </div>
                {ZONE[A.zone] && <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${ZONE[A.zone].badge}`}>{ZONE[A.zone].name}</span>}
                <span className="text-sm text-slate-300"><b className="text-white">{A.in_use}</b> of {A.cages} cages in use{A.rolls || !A.bags ? <> · <b className="text-white">{num(A.rolls)}</b> rolls</> : null}{A.bags ? <> · <b className="text-white">{num(A.bags)}</b> bags</> : null} · <b className="text-white">{num(A.kg)}</b> kg · <b className="text-white">{usd(A.value)}</b></span>
                <span className="flex flex-wrap items-center gap-x-3 text-xs text-slate-400">
                  {Object.keys(STATE).filter((k) => A.states[k]).map((k) => <span key={k} className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: STATE[k].color }} />{A.states[k]} {STATE_WORD[k] || k}</span>)}
                </span>
              </div>
              <div className="grid gap-3 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px]">
                {/* the aisle as it stands: side L, the walkway, side R; each block a stack of 3 cages, T on top */}
                <div className="wh-strip min-w-0 overflow-x-auto pb-1">
                  <div style={{ minWidth: slots * 104 + (slots - 1) * 6 }}>
                    {rowNames.map((r, ri) => (
                      <React.Fragment key={r}>
                        {ri > 0 && walkway(true)}
                        <div className="mb-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold">Side {r} · blocks 1–{slots} · each block 3 cages: T top, M middle, B bottom</div>
                        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${slots}, minmax(0, 1fr))` }}>
                          {Array.from({ length: slots }, (_, b) => (
                            <div key={b} className="flex flex-col gap-1 min-w-0 rounded-lg bg-slate-950/30 p-0.5">
                              {Array.from({ length: levels }, (_, i) => card(`${A.aisle}-${r}${b + 1}-${levels - i}`))}
                            </div>
                          ))}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                {/* full detail of the chosen cage */}
                <div className="min-w-0 rounded-xl border border-slate-700 bg-slate-900/70 p-3 self-start">
                  {!chosen && <div className="text-sm text-slate-400">Click a cage card to see everything about it: order, lot, rolls or bags, value, dates and what is inside.</div>}
                  {chosen && (
                    <>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="font-mono text-lg font-black text-white">{chosen.cage}</div>
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: `${(STATE[chosen.state] || {}).color}33`, color: (STATE[chosen.state] || {}).color }}>{(STATE[chosen.state] || {}).short || chosen.state}</span>
                      </div>
                      {chosen.state === "damaged"
                        ? <div className="mb-1 rounded-lg px-2 py-1 text-xs bg-orange-500/15 text-orange-200">Damaged — taken out of stock, not issued to cutting. Cause and next step are below.</div>
                        : chosen.note && <div className={`mb-1 rounded-lg px-2 py-1 text-xs ${chosen.state === "hold" ? "bg-rose-500/15 text-rose-200" : "bg-slate-800 text-slate-300"}`}>{chosen.note}</div>}
                      {line("Position", posSay(chosen.cage))}
                      {line("Order", chosen.order_id ? `${chosen.order} (${chosen.order_id})` : chosen.order)}
                      {line("Order status", chosen.order_note)}
                      {line("Customer", chosen.customer)}
                      {line("Fabric", chosen.fabric)}
                      {line("Colour", chosen.colour)}
                      {line("Lot (dye batch)", chosen.lot)}
                      {chosen.state === "reserved"
                        ? <>{line("Rolls expected", chosen.expected_rolls)}{line("Kg expected", num(chosen.expected_kg))}{line("Value expected", usd(chosen.expected_value))}</>
                        : <>{chosen.state === "returned" ? line("Bags in the cage", chosen.bags) : chosen.state === "damaged" ? line("Damaged rolls", chosen.rolls) : line("Rolls in the cage", `${chosen.rolls} of ${chosen.rolls_received} received`)}{line("Kg", num(chosen.kg))}{line("Value", usd(chosen.value))}</>}
                      {line("Price", `USD ${Number(chosen.price_kg).toFixed(2)} per kg`)}
                      {line(chosen.state === "returned" ? "Returned on" : chosen.state === "damaged" ? "Found on" : "Arrived", chosen.arrived)}
                      {chosen.state === "damaged" && <>{line("Cause", chosen.cause)}{line("Next step", chosen.next_step)}{line("Insurance claim", chosen.claim_no)}{line("Container", chosen.container)}</>}
                      {line("Issue to cutting", chosen.issue_from ? `${chosen.issue_from} – ${chosen.issue_to}` : "")}
                      {line("Next in this cage", chosen.next)}
                      {chosen.lots && chosen.lots.length > 0 && (
                        <div className="mt-2">
                          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Returned lots</div>
                          {chosen.lots.map((x) => <div key={x.lot} className="flex justify-between gap-2 text-xs py-0.5"><span className="font-mono text-slate-300 truncate">{x.lot}</span><span className="shrink-0 text-slate-300">{x.colour} · {plural(x.bags || 0, "bag")} · {num(x.kg)} kg · {usd(x.value)}</span></div>)}
                        </div>
                      )}
                      {chosen.state !== "reserved" && (
                        <div className="mt-2">
                          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">{chosen.state === "returned" ? "Bags" : chosen.state === "damaged" ? "Damaged rolls" : "Rolls"} in this cage{rolls && rolls.cage === chosen.cage ? ` (${rolls.rows.length})` : ""}</div>
                          {!(rolls && rolls.cage === chosen.cage) && <div className="text-xs text-slate-500">Loading…</div>}
                          {rolls && rolls.cage === chosen.cage && rolls.rows.length === 0 && <div className="text-xs text-slate-500">{chosen.state === "returned" || chosen.state === "damaged" ? "Nothing listed for this cage." : "No rolls left — the last ones go to cutting today."}</div>}
                          {rolls && rolls.cage === chosen.cage && rolls.rows.length > 0 && (
                            <div className="max-h-56 overflow-y-auto pr-1">
                              {rolls.rows.map((x) => <div key={x.roll} className="flex justify-between gap-2 text-xs py-0.5 tabular-nums"><span className="font-mono text-slate-300 truncate">{x.roll}</span><span className="shrink-0 text-slate-400">{x.content ? `${x.content} · ` : ""}{x.net_kg} kg · {usd(x.value)}</span></div>)}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* what is in the cage under the pointer */}
      {tip && (
        <div className="fixed z-50 pointer-events-none rounded-lg border border-slate-600 bg-slate-950/95 px-3 py-2 text-xs shadow-xl" style={{ left: tip.x, top: tip.y, transform: `translate(-50%, ${tip.below ? "0" : "-100%"})`, width: 280 }}>
          <div className="flex items-center justify-between gap-2"><b className="font-mono text-white">{tip.id} <span className="rounded bg-slate-200 px-1 text-[10px] text-slate-900">{(cagePos(tip.id) || {}).block}·{levelTag((cagePos(tip.id) || {}).level)}</span></b>{tipCage ? <span className="font-bold" style={{ color: (STATE[tipCage.state] || {}).color }}>{(STATE[tipCage.state] || {}).short}</span> : <span className="text-slate-500">empty</span>}</div>
          <div className="text-slate-400">{posSay(tip.id)}</div>
          {tipCage && (
            <>
              <div className="text-white font-semibold">{tipCage.order} · customer {tipCage.customer}</div>
              <div className="text-slate-300">{tipCage.colour} · {tipCage.fabric}</div>
              <div className="font-mono text-slate-400">{tipCage.lot}</div>
              <div className="text-slate-200 tabular-nums">{tipCage.state === "reserved" ? `${tipCage.expected_rolls} rolls expected · ${usd(tipCage.expected_value)}` : `${holds(tipCage)} · ${num(tipCage.kg)} kg · ${usd(tipCage.value)}`}</div>
              {tipCage.note && <div className="mt-0.5 text-slate-400">{tipCage.note}</div>}
            </>
          )}
        </div>
      )}

      <p className="mt-3 text-[11px] text-slate-500">
        {d ? `As of ${String(d.as_of).replace("T", " ").slice(0, 19)} · ` : ""}Simulated warehouse — orders, lots and prices are invented.
        {d && d.prices ? ` Price per kg: ${d.prices.map((p) => `${p.fabric} USD ${Number(p.usd_per_kg).toFixed(2)}`).join(" · ")}.` : ""}
      </p>
    </div>
  );
};

export default WarehouseMap;
