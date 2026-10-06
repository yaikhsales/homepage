// HR · Organization chart — Gamini's master chart: a box tree from the General Manager down to and ENDING
// at the leaders (GM → factory managers / department managers → supervisors → leaders), every box "Title —
// YAI####" with its team size; a sewing supervisor carries "Line 1" / "Line 2" buttons, a section supervisor
// one button for its section, a leader its line — each opens the section-by-section chart (the custom
// chart: compact ID grids) scrolled to that line. The ~920 workers are never drawn here. A second tab,
// "By department", shows group → department → section with headcounts, present / on leave, heads and
// people loaded in place.
// Data: {"module":"hr","view":"org-tree"} → tree[], mgmt; people of a node from {"view":"employees", …}.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, ChevronDown, ChevronRight, ExternalLink, Users, LayoutGrid } from "lucide-react";
import { NavCover, useScreenTop } from "../components/ScreenTop";
import { post, num, GROUP, LEVEL, Person, RoleIcon, HrNav, Chip } from "./hr";

const DEPT_KEY = { "Accounting / Finance": "accounting", "Admin (office, canteen, dorm, drivers, Y-Shop)": "admin", "CSR — Compliance": "csr", Cutting: "cutting", Embroidery: "embroidery", "Factory management": "factory", Finishing: "finishing", "General management": "gm", HR: "hr", IT: "it", "Maintenance (YTM mechanics)": "ytm", "Merchandising (YPI, incl. sample room & CAD)": "ypi", Packaging: "packaging", "Planning (4DP, incl. MRP desk)": "4dp", Printing: "printing", "QC / QA": "qa" };
const deptKey = (label, id) => DEPT_KEY[label] || (id ? String(id).split("/")[1] : "") || label;

// the people of a node, loaded in place (first page of the directory for that node)
const People = ({ node, onPerson }) => {
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    let live = true;
    const body = { view: "employees", page: 1 };
    if (node.kind === "group") body.group = node.id;
    if (node.kind === "department") body.department = deptKey(node.label, node.id);
    if (node.kind === "section") { body.department = deptKey(node.parentLabel, node.id); if (/^Line L\d+/.test(node.label)) body.line = node.label.replace("Line ", ""); else body.search = node.label; }
    if (node.kind === "mgmt") body.search = node.emp_no;
    post(body).then((j) => live && setD(j)).catch(() => live && setErr("People are unavailable right now."));
    return () => { live = false; };
  }, [node]);
  if (err) return <div className="text-xs text-amber-200">{err}</div>;
  if (!d) return <div className="text-xs text-slate-500">Loading people…</div>;
  const rows = d.rows || [];
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {rows.map((p) => <Person key={p.emp_no} p={p} onClick={() => onPerson(p.emp_no)} />)}
      {d.pages > 1 && <span className="text-[11px] text-slate-500">first {rows.length} of {num((d.summary || []).find((x) => x.label === "Matching")?.value)} — open the directory for all</span>}
      {rows.length === 0 && <span className="text-xs text-slate-500">No people listed here.</span>}
    </div>
  );
};

// one box of the department tree
const Box = ({ node, depth, open, toggle, showPeople, togglePeople, onPerson, group, parentLabel }) => {
  const navigate = useNavigate();
  const g = GROUP[group] || GROUP.operations;
  const kids = node.children || [];
  const isOpen = open.has(node.id);
  const people = showPeople.has(node.id);
  const pct = node.count ? Math.round(((node.present || 0) / node.count) * 100) : 0;
  const toDirectory = () => {
    const q = new URLSearchParams();
    if (node.kind === "group") q.set("group", node.id);
    if (node.kind === "department") q.set("department", deptKey(node.label, node.id));
    if (node.kind === "section") { q.set("department", deptKey(parentLabel, node.id)); if (/^Line L\d+/.test(node.label)) q.set("line", node.label.replace("Line ", "")); else q.set("search", node.label); }
    navigate("/dashboard/hr/employees?" + q.toString());
  };
  return (
    <div className="relative" style={{ marginLeft: depth ? 22 : 0 }}>
      {depth > 0 && <div className="absolute -left-3 top-0 bottom-0 border-l border-slate-700" />}
      <div className={`rounded-xl border bg-slate-800/60 px-3 py-2 mb-1.5 ${g.box} ${node.kind === "group" ? "border-2" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          {kids.length > 0 ? <button onClick={() => toggle(node.id)} className="p-0.5 rounded hover:bg-slate-700 text-slate-400" aria-label={isOpen ? "collapse" : "expand"}>{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button> : <span className="w-5" />}
          <span className={`font-black text-white ${node.kind === "group" ? "text-base" : "text-sm"}`}>{node.label}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500">{node.kind}</span>
          <Chip cls={g.chip}><Users size={11} className="inline mr-1 -mt-0.5" />{num(node.count)}</Chip>
          <span className="text-[11px] text-slate-400">present <b className="text-emerald-300">{num(node.present)}</b> · on leave <b className="text-amber-300">{num(node.on_leave)}</b> · {pct}% in</span>
          <span className="ml-auto flex items-center gap-1">
            <button onClick={() => togglePeople(node.id)} className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${people ? "bg-white text-slate-900 border-white" : "border-slate-600 text-slate-300 hover:bg-slate-700"}`}>{people ? "hide people" : "people"}</button>
            <button onClick={toDirectory} className="inline-flex items-center gap-1 rounded-md border border-sky-500/50 text-sky-300 hover:bg-sky-500/10 px-2 py-0.5 text-[11px] font-bold"><ExternalLink size={11} />directory</button>
          </span>
        </div>
        {(node.heads || []).length > 0 && <div className="mt-1.5 flex flex-wrap gap-1.5">{node.heads.map((hd) => <Person key={hd.emp_no} p={{ ...hd, level: hd.level || (/General/.test(hd.title) ? "gm" : /Factory Manager/.test(hd.title) ? "factory_manager" : /Manager/.test(hd.title) ? "manager" : /Supervisor/.test(hd.title) ? "supervisor" : "leader") }} onClick={() => onPerson(hd.emp_no)} />)}</div>}
        {people && <div className="mt-2 border-t border-slate-700/60 pt-2"><People node={{ ...node, parentLabel }} onPerson={onPerson} /></div>}
      </div>
      {isOpen && kids.map((k) => <Box key={k.id} node={k} depth={depth + 1} open={open} toggle={toggle} showPeople={showPeople} togglePeople={togglePeople} onPerson={onPerson} group={group} parentLabel={node.label} />)}
    </div>
  );
};

// the way down from a management box: a sewing supervisor "Supervisor · L01–L02" gets "Line 1" and "Line 2",
// a line leader "Line Leader · L07" gets "Line 7", a section supervisor / leader "Supervisor · Cutting" gets
// "Cutting" — each opens the section-by-section chart scrolled to that line / section's ID grid
const waysDown = (node) => {
  const t = String(node.title || "");
  const range = t.match(/L(\d+)\s*[–-]\s*L(\d+)/);
  if (range) { const out = []; for (let i = Number(range[1]); i <= Number(range[2]); i++) out.push({ label: "Line " + i, q: "line=L" + String(i).padStart(2, "0") }); return out; }
  const one = t.match(/L(\d+)\s*$/);
  if (one) return [{ label: "Line " + Number(one[1]), q: "line=L" + String(one[1]).padStart(2, "0") }];
  const sec = t.match(/·\s*(.+)$/);
  if (sec && node.level !== "gm" && node.level !== "factory_manager" && !/^F\d$/.test(sec[1].trim())) return [{ label: sec[1].trim(), q: "section=" + encodeURIComponent(sec[1].trim()) }];
  return [];
};

// one box of the master chart: title + ID, team size, the buttons down to the ID grids; ends at the leaders
const MBox = ({ node, depth, open, toggle, onPerson }) => {
  const navigate = useNavigate();
  const kids = node.children || [];
  const isOpen = open.has(node.emp_no);
  const L = LEVEL[node.level] || LEVEL.manager;
  const ways = waysDown(node);
  return (
    <div className="relative" style={{ marginLeft: depth ? 22 : 0 }}>
      {depth > 0 && <div className="absolute -left-3 top-0 bottom-0 border-l border-slate-700" />}
      <div className={`rounded-xl border bg-slate-800/60 px-3 py-2 mb-1.5 ${L.ring} ${node.level === "gm" ? "border-2" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          {kids.length > 0 ? <button onClick={() => toggle(node.emp_no)} className="p-0.5 rounded hover:bg-slate-700 text-slate-400" aria-label={isOpen ? "collapse" : "expand"}>{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button> : <span className="w-5" />}
          <RoleIcon level={node.level} size={16} />
          <button onClick={() => onPerson(node.emp_no)} className="font-black text-white text-sm hover:underline">{node.title} <span className="text-slate-400 font-bold">— {node.emp_no}</span></button>
          <span className="text-[11px] text-slate-400">team <b className="text-white">{num(node.team)}</b>{kids.length ? <span> · {num(kids.length)} direct</span> : null}</span>
          <span className="ml-auto flex flex-wrap items-center gap-1">
            {ways.map((w) => <button key={w.q} onClick={() => navigate("/dashboard/hr/sections?" + w.q)} className="inline-flex items-center gap-1 rounded-md border border-sky-500/50 bg-sky-500/10 text-sky-200 hover:bg-sky-500/25 px-2 py-0.5 text-[11px] font-bold"><LayoutGrid size={11} />{w.label}</button>)}
            {node.level === "leader" && node.untitled_direct > 0 && <span className="inline-flex items-center gap-1 rounded-md border border-slate-600 text-slate-300 px-2 py-0.5 text-[11px] font-bold"><Users size={11} />{num(node.untitled_direct)} workers</span>}
          </span>
        </div>
      </div>
      {isOpen && kids.map((k) => <MBox key={k.emp_no} node={k} depth={depth + 1} open={open} toggle={toggle} onPerson={onPerson} />)}
    </div>
  );
};
const collect = (nodes, kinds, out = []) => { (nodes || []).forEach((n) => { if (kinds.includes(n.kind)) out.push(n.id); collect(n.children, kinds, out); }); return out; };
const collectM = (node, out = []) => { if (!node) return out; if ((node.children || []).length) out.push(node.emp_no); (node.children || []).forEach((c) => collectM(c, out)); return out; };

const OrgChart = ({ onBack }) => {
  const navigate = useNavigate();
  const [topRef, topPad] = useScreenTop();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("mgmt");
  const [open, setOpen] = useState(() => new Set());
  const [showPeople, setShowPeople] = useState(() => new Set());
  const [mopen, setMopen] = useState(() => new Set());
  const back = () => (onBack ? onBack() : navigate(-1));
  const onPerson = useCallback((no) => navigate("/dashboard/hr/employee/" + no), [navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const j = await post({ view: "org-tree" });
      setData(j);
      setOpen(new Set(collect(j.tree, ["group"])));
      setMopen(new Set([j.mgmt && j.mgmt.emp_no, ...((j.mgmt && j.mgmt.children) || []).map((c) => c.emp_no)].filter(Boolean)));
    } catch (e) {
      setError("The organization chart is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const d = data || {};
  const tree = d.tree || [];
  const mgmt = d.mgmt;
  const toggle = (id) => setOpen((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const togglePeople = (id) => setShowPeople((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const toggleM = (id) => setMopen((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const gm = useMemo(() => (mgmt ? { emp_no: mgmt.emp_no, title: mgmt.title, level: mgmt.level } : null), [mgmt]);

  return (
    <div ref={topRef} style={{ paddingTop: topPad }} className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 md:px-5 pb-8 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; }`}</style>
      <NavCover />
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button onClick={back} className="p-1 -ml-1 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={18} /></button>
        <h1 className="text-lg font-black text-white leading-none">Organization chart</h1>
        <HrNav current="org-chart-master" />
        <div className="ml-auto flex flex-wrap gap-x-3 text-xs text-slate-400">{(d.summary || []).map((x) => <span key={x.label} className="whitespace-nowrap">{x.label} <b className="text-white tabular-nums">{num(x.value)}</b></span>)}</div>
        <button onClick={load} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
      </div>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden text-xs">{[["mgmt", "Master chart"], ["dept", "By department"]].map(([k, l]) => <button key={k} onClick={() => setMode(k)} className={`px-3 py-1 font-bold ${mode === k ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{l}</button>)}</div>
        {mode === "dept" ? <><button onClick={() => setOpen(new Set(collect(tree, ["group", "department", "section"])))} className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700">expand all</button><button onClick={() => setOpen(new Set(collect(tree, ["group"])))} className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700">departments only</button><button onClick={() => { setOpen(new Set()); setShowPeople(new Set()); }} className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700">collapse all</button></> : <><button onClick={() => setMopen(new Set(collectM(mgmt)))} className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700">expand all</button><button onClick={() => setMopen(new Set([mgmt && mgmt.emp_no].filter(Boolean)))} className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700">collapse all</button></>}
        <button onClick={() => navigate("/dashboard/hr/sections")} className="inline-flex items-center gap-1 rounded-md border border-sky-500/50 bg-sky-500/10 text-sky-200 hover:bg-sky-500/25 px-2 py-1 text-[11px] font-bold"><LayoutGrid size={12} />section-by-section chart (all ID grids)</button>
        <span className="text-[11px] text-slate-500">GM → Factory Managers → Supervisors → Leaders; the workers are in the section chart (ID grids) · titles for management, employee numbers for everyone · no names</span>
        <span className="ml-auto flex gap-1.5"><Chip cls={GROUP.operations.chip}>Operations</Chip><Chip cls={GROUP.administrative.chip}>Administrative</Chip></span>
      </div>

      {mode === "dept" && tree.length > 0 && (
        <div>
          {gm && <div className="rounded-xl border-2 border-amber-400 bg-slate-800/60 px-3 py-2 mb-2 inline-flex items-center gap-3"><RoleIcon level="gm" size={18} /><button onClick={() => onPerson(gm.emp_no)} className="font-black text-white hover:underline">{gm.title}</button><span className="text-[11px] text-slate-400">{gm.emp_no} · {num(mgmt.team)} people · {num(mgmt.direct)} direct</span></div>}
          <div className="grid gap-3 xl:grid-cols-2 items-start">
            {tree.map((g) => <div key={g.id}><Box node={g} depth={0} open={open} toggle={toggle} showPeople={showPeople} togglePeople={togglePeople} onPerson={onPerson} group={g.id} parentLabel="" /></div>)}
          </div>
        </div>
      )}
      {mode === "mgmt" && mgmt && <MBox node={mgmt} depth={0} open={mopen} toggle={toggleM} onPerson={onPerson} />}
      {!data && <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">{loading ? "Loading the organization…" : ""}</div>}
      <p className="mt-3 text-[10px] text-slate-500">{d.as_of ? `As of ${String(d.as_of).replace("T", " ").slice(0, 16)} · ` : ""}simulated factory — employee numbers and roles only, no real person</p>
    </div>
  );
};

export default OrgChart;
