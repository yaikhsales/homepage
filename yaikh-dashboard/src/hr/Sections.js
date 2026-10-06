// HR · the CUSTOM organization chart — section by section: every sewing line and every section as a card
// with its people as a compact grid of ID NUMBERS (no box per person) — e.g. "Line L07 — 25 operators +
// 1 fold & pack + 3 QC · leader YAI0058", "Cutting — 8 IDs". Each ID opens the profile. Opened from the
// master chart's "Line 1" / "Line 2" / section buttons with ?line=L01 or ?section=Cutting, which scrolls to
// and highlights that card; without a query it is the overview of all lines and sections.
// Data: {"module":"hr","view":"employees","page_size":500,"page":n} — every employee, grouped here.
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, Search, Users } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";
import { post, num, GROUP, LEVEL, HrNav, Chip, RoleIcon } from "./hr";

const PAGE = 400; // the view returns at most 400 rows a page whatever page_size says
const isLine = (s) => /^Line L\d+/.test(s || "");
const lineOf = (s) => (isLine(s) ? s.replace("Line ", "") : "");
// "25 operators + 1 fold & pack + 3 QC" from the positions in a section
const mix = (rows) => {
  const c = {};
  rows.forEach((r) => { if (r.level !== "worker" && r.level !== "staff") return; const p = String(r.position || ""); const k = /operator/i.test(p) ? "operators" : /fold|pack/i.test(p) ? "fold & pack" : /QC|quality|check/i.test(p) ? "QC" : /mechanic/i.test(p) ? "mechanics" : p.toLowerCase(); c[k] = (c[k] || 0) + 1; });
  return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v} ${k}`).join(" + ");
};

const Sections = ({ onBack }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [params] = useSearchParams();
  const want = { line: params.get("line") || "", section: params.get("section") || "", department: params.get("department") || "" };
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("");
  const refs = useRef({});
  const back = () => (onBack ? onBack() : navigate(-1));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // page through until a short page — the server's `pages` is computed from the asked size, not the served one
      let all = [];
      for (let p = 1; p <= 10; p++) { const j = await post({ view: "employees", page: p, page_size: PAGE }); const got = j.rows || []; all = all.concat(got); if (got.length < PAGE) break; }
      setRows(all);
    } catch (e) {
      setError("The section chart is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  // group → department → section cards; a line is its own card
  const cards = useMemo(() => {
    const m = new Map();
    (rows || []).forEach((r) => {
      const key = `${r.group}|${r.department}|${r.section || ""}`;
      if (!m.has(key)) m.set(key, { key, group: r.group, department: r.department, section: r.section || "", line: lineOf(r.section), factory: r.factory, people: [] });
      m.get(key).people.push(r);
    });
    const order = (c) => (c.group === "operations" ? 0 : 1) * 1000 + (c.line ? Number(c.line.replace("L", "")) : 500);
    return [...m.values()].map((c) => { const leaders = c.people.filter((p) => p.level === "leader" || p.level === "supervisor" || p.level === "manager" || p.level === "factory_manager" || p.level === "gm"); const workers = c.people.filter((p) => !leaders.includes(p)); return { ...c, leaders, workers, present: c.people.filter((p) => /present/.test(String(p.today))).length }; }).sort((a, b) => order(a) - order(b));
  }, [rows]);
  const shown = useMemo(() => { const s = q.trim().toLowerCase(); return cards.filter((c) => (!group || c.group === group) && (!s || `${c.section} ${c.department} ${c.line} ${c.factory}`.toLowerCase().includes(s) || c.people.some((p) => p.emp_no.toLowerCase() === s || String(p.aliases || "").toLowerCase().includes(s)))); }, [cards, q, group]);
  const hit = (c) => (want.line && c.line === want.line) || (want.section && (c.section === want.section || c.department === want.section)) || (!want.line && !want.section && want.department && c.department === want.department);
  useEffect(() => { if (!rows) return; const c = cards.find(hit); if (c && refs.current[c.key]) setTimeout(() => refs.current[c.key].scrollIntoView({ behavior: "smooth", block: "start" }), 150); }, [rows, cards]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={topRef} style={{ paddingTop: topPad }} className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; }`}</style>
      <NavCover />
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button onClick={back} className="p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={18} /></button>
        <h1 className="text-lg font-black text-white leading-none">Section-by-section chart</h1>
        <HrNav current="sections" />
        <span className="text-xs text-slate-400">{rows ? `${num(rows.length)} people in ${cards.length} lines and sections` : ""}{want.line ? ` · showing line ${want.line}` : want.section ? ` · showing ${want.section}` : ""}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden text-[11px]">{[["", "all"], ["operations", "Operations"], ["administrative", "Administrative"]].map(([k, l]) => <button key={k} onClick={() => setGroup(k)} className={`px-2 py-1 font-bold ${group === k ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{l}</button>)}</div>
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1"><Search size={13} className="text-slate-500" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="L07, cutting, YAI0259…" className="bg-transparent outline-none text-xs w-40 text-white placeholder-slate-500" /></div>
          <button onClick={load} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
        </div>
      </div>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}
      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {shown.map((c) => {
          const on = hit(c);
          const g = GROUP[c.group] || GROUP.operations;
          return (
            <section key={c.key} ref={(el) => { refs.current[c.key] = el; }} className={`rounded-2xl border bg-slate-800/40 p-3 min-w-0 ${on ? "border-sky-400 ring-2 ring-sky-400/60" : g.box}`}>
              <div className="flex flex-wrap items-baseline gap-2 mb-1">
                <span className="text-base font-black text-white">{c.line ? `Line ${c.line}` : c.section || c.department}</span>
                {c.line && <span className="text-[11px] text-slate-500">{c.department}</span>}
                {!c.line && c.section && c.section !== c.department && <span className="text-[11px] text-slate-500">{c.department}</span>}
                <Chip cls={g.chip}><Users size={11} className="inline mr-1 -mt-0.5" />{num(c.people.length)}</Chip>
                <span className="text-[11px] text-slate-400">{c.factory}{c.present ? ` · ${c.present} present` : ""}</span>
              </div>
              <div className="text-[11px] text-slate-400 mb-2">{mix(c.people) || "—"}{c.leaders.length ? " · " + c.leaders.map((l) => `${(l.title || (LEVEL[l.level] || {}).label || "").replace(/ · .*$/, "")} ${l.emp_no}`).join(", ") : ""}</div>
              <div className="flex flex-wrap gap-1">
                {c.leaders.map((p) => <button key={p.emp_no} onClick={() => navigate("/dashboard/hr/employee/" + p.emp_no)} title={`${p.title || p.position} · ${p.today}`} className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-black text-white hover:bg-slate-700 ${(LEVEL[p.level] || LEVEL.staff).ring}`}><RoleIcon level={p.level} size={11} />{p.emp_no}</button>)}
                {c.workers.map((p) => <button key={p.emp_no} onClick={() => navigate("/dashboard/hr/employee/" + p.emp_no)} title={`${p.position}${p.grade ? " · grade " + p.grade : ""} · ${p.today}${p.aliases ? " · " + p.aliases : ""}`} className={`rounded-md border px-1.5 py-0.5 text-[11px] font-bold tabular-nums hover:bg-slate-700 ${/absent/.test(String(p.today)) ? "border-rose-500/50 text-rose-200" : /leave/.test(String(p.today)) ? "border-amber-500/50 text-amber-200" : "border-slate-700 text-slate-200"}`}>{p.emp_no}</button>)}
              </div>
            </section>
          );
        })}
        {!rows && <div className="col-span-full rounded-2xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">{loading ? "Loading all 1,032 people…" : ""}</div>}
        {rows && shown.length === 0 && <div className="col-span-full text-sm text-slate-500 py-6 text-center">No line or section matches.</div>}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-3 text-[10px] text-slate-500"><span>ID = employee number, click for the profile · ringed IDs = the section's leader / supervisor · red = absent today, amber = on leave</span><span className="flex gap-1.5"><Chip cls={GROUP.operations.chip}>Operations</Chip><Chip cls={GROUP.administrative.chip}>Administrative</Chip></span></div>
      <p className="mt-2 text-[10px] text-slate-500">simulated factory — employee numbers and roles only, no real person</p>
    </div>
  );
};

export default Sections;
