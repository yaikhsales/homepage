// HR · Organization chart — the master chart as a classic TOP-DOWN BOX TREE (Gamini's reference: the
// classic org-chart look — GM box at the top centre, connector lines down, managers side by side,
// supervisors under them, leaders as the bottom row). Our own drawing, no template.
//   • one unit of ~1,000 workers: GM → ONE Factory Manager → the sewing supervisors (one per two lines)
//     and the section supervisors → leaders; the QC manager and the administrative managers under the GM
//   • the Factory Manager has ~30 direct reports, so his row is laid out as wrapped rows GROUPED by kind
//     (Sewing / Sections / Assistants) with a spine-and-bus connector per group, so it fits a screen
//   • every box: a role-colour header strip (Operations vs Administrative, the GM amber), a generic
//     silhouette avatar (no photo, no name), the title ("Supervisor · L01–L02"), the location (F1–F4), the
//     YAI ID and the team size; elbow connectors; click a box to collapse / expand its branch (the leaders
//     are collapsed by default so the chart stays readable); Line / section buttons on supervisor and leader
//     boxes jump to the section-by-section ID chart
//   • pan (drag), zoom (wheel / pinch / + −), fit to screen, 100 %
// Data: the `mgmt` tree of {"module":"hr","view":"org-tree"} — simulated factory, roles and IDs only.
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LayoutGrid, Users, ZoomIn, ZoomOut, Maximize2, Scan, ChevronsDownUp, ChevronsUpDown, MapPin } from "lucide-react";
import { num, LEVEL, RoleIcon } from "./hr";

/* ── geometry ─────────────────────────────────────────────────────────────────────────────────── */
const BW = 200, BH = 108;        // one box
const GX = 14, GY = 56;          // gap between siblings · between a parent and its children
const COLS = 8;                  // columns of a wrapped row
const WRAP_AT = 12;              // a parent with more children than this (the Factory Manager: ~30) gets wrapped rows grouped by kind
const ROW_GAP = 46, GROUP_GAP = 40, LABEL_H = 32;

// the colour of the header strip: the GM amber, the production branches (Factory Manager, QC) the
// Operations green, every other branch under the GM the Administrative violet
const STRIP = {
  gm: { bg: "#b45309", text: "#fde68a", ring: "#f59e0b" },
  operations: { bg: "#047857", text: "#a7f3d0", ring: "#10b981" },
  administrative: { bg: "#6d28d9", text: "#ddd6fe", ring: "#8b5cf6" },
};
const branchOf = (node, parentBranch) => {
  if (!parentBranch) return "gm";
  if (parentBranch !== "gm") return parentBranch;
  return node.level === "factory_manager" || /QC|QA|Quality/i.test(node.title || "") ? "operations" : "administrative";
};
const GROUP_LABEL = { "sewing supervisor": "Sewing", "section supervisor": "Sections", assistant: "Assistants", supervisor: "Supervisors", manager: "Managers", leader: "Leaders" };

// the way down from a box: a sewing supervisor "Supervisor · L01–L02" gets "Line 1" and "Line 2", a line
// leader "Line Leader · L07" gets "Line 7", a section supervisor / leader "Supervisor · Cutting" gets
// "Cutting" — each opens the section-by-section chart scrolled to that line / section's ID grid
export const waysDown = (node) => {
  const t = String(node.title || "");
  const range = t.match(/L(\d+)\s*[–-]\s*L(\d+)/);
  if (range) { const out = []; for (let i = Number(range[1]); i <= Number(range[2]); i++) out.push({ label: "Line " + i, q: "line=L" + String(i).padStart(2, "0") }); return out; }
  const one = t.match(/L(\d+)\s*$/);
  if (one) return [{ label: "Line " + Number(one[1]), q: "line=L" + String(one[1]).padStart(2, "0") }];
  const sec = t.match(/·\s*(.+)$/);
  if (sec && node.level !== "gm" && node.level !== "factory_manager" && node.level !== "manager" && !/^F\d$/.test(sec[1].trim())) return [{ label: sec[1].trim(), q: "section=" + encodeURIComponent(sec[1].trim()) }];
  return [];
};

/* ── layout: measure every subtree, then place boxes and draw the connectors ───────────────────── */
const groupKids = (kids) => {
  const out = [];
  kids.forEach((k) => { const key = k.kind || k.level || "other"; let g = out.find((x) => x.key === key); if (!g) { g = { key, label: GROUP_LABEL[key] || key, kids: [] }; out.push(g); } g.kids.push(k); });
  return out;
};
const measure = (node, open) => {
  const kids = open.has(node.emp_no) ? node.children || [] : [];
  if (kids.length === 0) return { node, w: BW, h: BH, kids: [] };
  const ms = kids.map((k) => measure(k, open));
  if (kids.length <= WRAP_AT) {
    const w = Math.max(BW, ms.reduce((s, m) => s + m.w, 0) + GX * (ms.length - 1));
    const h = BH + GY + Math.max(...ms.map((m) => m.h));
    return { node, w, h, kids: ms, mode: "row" };
  }
  // wrapped rows, grouped by kind
  const groups = groupKids(kids).map((g) => {
    const members = g.kids.map((k) => ms.find((m) => m.node === k));
    // rows of up to COLS members, each member as wide as its own subtree (an expanded supervisor takes
    // the room for its leaders without widening every other cell)
    const cols = Math.min(members.length, COLS);
    const rows = [];
    for (let i = 0; i < members.length; i += cols) rows.push(members.slice(i, i + cols));
    const rowH = rows.map((r) => Math.max(...r.map((m) => m.h)));
    const rowW = rows.map((r) => r.reduce((s, m) => s + m.w, 0) + GX * (r.length - 1));
    const w = Math.max(...rowW);
    const h = LABEL_H + rowH.reduce((s, x) => s + x, 0) + ROW_GAP * (rows.length - 1);
    return { ...g, members, cols, rows, rowH, rowW, w, h };
  });
  const gw = groups.reduce((s, g) => s + g.w, 0) + GROUP_GAP * (groups.length - 1);
  return { node, w: Math.max(BW, gw), h: BH + GY + Math.max(...groups.map((g) => g.h)), kids: ms, mode: "wrap", groups };
};
const place = (m, x, y, branch, out) => {
  const cx = x + m.w / 2;                       // the box, centred over its subtree
  const bx = cx - BW / 2;
  const b = branchOf(m.node, branch);
  out.boxes.push({ node: m.node, x: bx, y, branch: b, open: m.kids.length > 0 });
  if (m.kids.length === 0) return;
  const bottom = y + BH, bus = bottom + GY / 2, childY = bottom + GY;
  if (m.mode === "row") {
    const total = m.kids.reduce((s, k) => s + k.w, 0) + GX * (m.kids.length - 1);
    let kx = x + (m.w - total) / 2;
    const centres = [];
    m.kids.forEach((k) => { centres.push(kx + k.w / 2); place(k, kx, childY, b, out); kx += k.w + GX; });
    out.edges.push(`M${cx},${bottom}V${bus}`);
    if (centres.length > 1) out.edges.push(`M${centres[0]},${bus}H${centres[centres.length - 1]}`);
    centres.forEach((c) => out.edges.push(`M${c},${bus}V${childY}`));
    return;
  }
  // wrapped groups: a bus under the parent, a spine down the left of every group, a bus above every row
  const total = m.groups.reduce((s, g) => s + g.w, 0) + GROUP_GAP * (m.groups.length - 1);
  let gx = x + (m.w - total) / 2;
  const spines = [];
  m.groups.forEach((g) => {
    const spine = gx - 9;
    spines.push(spine);
    out.labels.push({ x: gx, y: childY + 4, text: g.label, n: g.members.length, branch: b });
    let rowTop = childY + LABEL_H;
    g.rows.forEach((row, ri) => {
      const rowBus = rowTop - 13;
      const centres = [];
      let left = gx;
      row.forEach((mem) => { centres.push(left + mem.w / 2); place(mem, left, rowTop, b, out); left += mem.w + GX; });
      out.edges.push(`M${spine},${rowBus}H${centres[centres.length - 1]}`);
      centres.forEach((c) => out.edges.push(`M${c},${rowBus}V${rowTop}`));
      if (ri === g.rows.length - 1) out.edges.push(`M${spine},${bus}V${rowBus}`);
      rowTop += g.rowH[ri] + ROW_GAP;
    });
    gx += g.w + GROUP_GAP;
  });
  out.edges.push(`M${cx},${bottom}V${bus}`);
  out.edges.push(`M${Math.min(cx, spines[0])},${bus}H${Math.max(cx, spines[spines.length - 1])}`);
};
export const layout = (root, open) => {
  const m = measure(root, open);
  const out = { boxes: [], edges: [], labels: [], w: m.w + 40, h: m.h + 40 };
  place(m, 20, 20, null, out);
  return out;
};

/* ── one box ──────────────────────────────────────────────────────────────────────────────────── */
const TreeBox = ({ b, isOpen, onToggle, onPerson, moved }) => {
  const navigate = useNavigate();
  const n = b.node, L = LEVEL[n.level] || LEVEL.staff, S = STRIP[b.branch] || STRIP.operations;
  const kids = (n.children || []).length;
  const ways = waysDown(n);
  const stop = (e) => e.stopPropagation();
  return (
    <div className={`absolute select-none rounded-lg overflow-hidden bg-slate-800 shadow-lg shadow-black/40 ${kids ? "cursor-pointer" : "cursor-default"}`} style={{ left: b.x, top: b.y, width: BW, height: BH, border: `2px solid ${S.ring}` }} onClick={() => { if (!moved.current && kids) onToggle(n.emp_no); }} title={`${n.title} — ${n.emp_no}${kids ? (isOpen ? " · click to collapse" : " · click to expand") : ""}`}>
      <div className="flex items-center gap-1.5 px-2 h-6 text-[10px] font-black uppercase tracking-wider" style={{ background: S.bg, color: S.text }}>
        <RoleIcon level={n.level} size={12} className="opacity-90" />
        <span className="truncate">{L.label}</span>
        {n.location && <span className="ml-auto inline-flex items-center gap-0.5 rounded-sm bg-black/25 px-1 py-px text-[9px] normal-case tracking-normal font-bold"><MapPin size={9} />{n.location}</span>}
      </div>
      <div className="flex gap-2 px-2 pt-1.5">
        <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center flex-shrink-0 text-slate-300" aria-hidden><User size={20} /></div>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-black text-white leading-tight truncate" title={n.title}>{n.title}</div>
          <button onClick={(e) => { stop(e); onPerson(n.emp_no); }} className="text-[11px] font-bold text-sky-300 hover:underline leading-tight">{n.emp_no}</button>
          <div className="text-[10px] text-slate-400 leading-tight">team <b className="text-white tabular-nums">{num(n.team)}</b>{n.level === "leader" && n.untitled_direct ? <span> · {num(n.untitled_direct)} workers</span> : kids ? <span> · {num(kids)} direct</span> : null}</div>
        </div>
      </div>
      {ways.length > 0 && <div className="absolute left-1.5 right-1.5 bottom-1 flex gap-1 overflow-hidden">{ways.map((w) => <button key={w.q} onClick={(e) => { stop(e); navigate("/dashboard/hr/sections?" + w.q); }} className="inline-flex items-center gap-0.5 rounded border border-sky-500/50 bg-sky-500/15 text-sky-200 hover:bg-sky-500/35 px-1.5 py-px text-[10px] font-bold whitespace-nowrap"><LayoutGrid size={9} />{w.label}</button>)}</div>}
      {kids > 0 && <div className={`absolute left-1/2 -translate-x-1/2 -bottom-px rounded-t px-1.5 text-[9px] font-black leading-4 ${isOpen ? "bg-slate-600 text-slate-200" : "bg-white text-slate-900"}`} title={isOpen ? "collapse" : `expand ${kids}`}>{isOpen ? "−" : `+${kids}`}</div>}
    </div>
  );
};

/* ── the chart: pan · zoom · fit ──────────────────────────────────────────────────────────────── */
const withKids = (node, out = []) => { if (!node) return out; if ((node.children || []).length) out.push(node.emp_no); (node.children || []).forEach((c) => withKids(c, out)); return out; };
// the readable default: everything down to the supervisors; the leaders folded away
export const defaultOpen = (mgmt) => new Set([mgmt && mgmt.emp_no, ...((mgmt && mgmt.children) || []).filter((c) => (c.children || []).length).map((c) => c.emp_no)].filter(Boolean));

const OrgTree = ({ mgmt, onPerson, open, setOpen }) => {
  const view = useRef(null);
  const moved = useRef(false);
  const drag = useRef(null);
  const pinch = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0, s: 0.6 });
  const g = useMemo(() => layout(mgmt, open), [mgmt, open]);
  const toggle = useCallback((id) => setOpen((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; }), [setOpen]);

  const fit = useCallback(() => {
    const el = view.current; if (!el) return;
    const s = Math.max(0.1, Math.min(1, (el.clientWidth - 16) / g.w, (el.clientHeight - 16) / g.h));
    setT({ s, x: (el.clientWidth - g.w * s) / 2, y: 8 });
  }, [g.w, g.h]);
  const zoomAt = useCallback((factor, px, py) => setT((o) => {
    const s = Math.max(0.1, Math.min(2.5, o.s * factor));
    return { s, x: px - (px - o.x) * (s / o.s), y: py - (py - o.y) * (s / o.s) };
  }), []);
  const zoomCentre = (factor) => { const el = view.current; zoomAt(factor, el ? el.clientWidth / 2 : 0, el ? el.clientHeight / 2 : 0); };
  // the backbone of the chart is the Factory Manager (≈900 of the 1,000 people under him), so the opening
  // view and "100%" centre on him with the GM's row at the top; the GM is a short pan to the right
  const focusX = useCallback(() => { const f = g.boxes.find((b) => b.node.level === "factory_manager") || g.boxes[0]; return f ? f.x + BW / 2 : g.w / 2; }, [g]);
  const hundred = () => { const el = view.current; if (!el) return; setT({ s: 1, x: el.clientWidth / 2 - focusX(), y: 8 }); };

  // the first view: the top of the chart at a readable size, centred on the Factory Manager
  useLayoutEffect(() => {
    const el = view.current; if (!el) return;
    const s = Math.max(0.75, Math.min(1, (el.clientWidth - 16) / g.w));
    setT({ s, x: el.clientWidth / 2 - focusX() * s, y: 8 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mgmt]);

  // wheel = zoom around the cursor (a trackpad pinch arrives as a ctrl+wheel); must be non-passive
  useEffect(() => {
    const el = view.current; if (!el) return;
    const onWheel = (e) => { e.preventDefault(); const r = el.getBoundingClientRect(); zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)), e.clientX - r.left, e.clientY - r.top); };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e) => {
    if (e.pointerType === "touch" && pinch.current) return;
    if (drag.current && e.pointerType === "touch") { const d = drag.current; pinch.current = { a: d.id, b: e.pointerId, ax: d.cx, ay: d.cy, bx: e.clientX, by: e.clientY, d0: Math.hypot(e.clientX - d.cx, e.clientY - d.cy) || 1, s: t.s, x: t.x, y: t.y }; return; }
    drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, cx: e.clientX, cy: e.clientY, x: t.x, y: t.y };
    moved.current = false;
    e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    const p = pinch.current;
    if (p && (e.pointerId === p.a || e.pointerId === p.b)) {
      if (e.pointerId === p.a) { p.ax = e.clientX; p.ay = e.clientY; } else { p.bx = e.clientX; p.by = e.clientY; }
      const d = Math.hypot(p.bx - p.ax, p.by - p.ay), d0 = p.d0;
      const r = view.current.getBoundingClientRect();
      const mx = (p.ax + p.bx) / 2 - r.left, my = (p.ay + p.by) / 2 - r.top;
      const s = Math.max(0.1, Math.min(2.5, p.s * (d / d0)));
      setT({ s, x: mx - (mx - p.x) * (s / p.s), y: my - (my - p.y) * (s / p.s) });
      moved.current = true;
      return;
    }
    const dr = drag.current; if (!dr || e.pointerId !== dr.id) return;
    dr.cx = e.clientX; dr.cy = e.clientY;
    if (Math.hypot(e.clientX - dr.sx, e.clientY - dr.sy) > 4) moved.current = true;
    if (moved.current) setT((o) => ({ ...o, x: dr.x + e.clientX - dr.sx, y: dr.y + e.clientY - dr.sy }));
  };
  const onPointerUp = (e) => {
    if (pinch.current && (e.pointerId === pinch.current.a || e.pointerId === pinch.current.b)) { pinch.current = null; drag.current = null; return; }
    if (drag.current && e.pointerId === drag.current.id) drag.current = null;
  };

  const Btn = ({ onClick, title, children }) => <button onClick={onClick} title={title} className="inline-flex items-center gap-1 rounded-md border border-slate-600 bg-slate-800/90 px-2 py-1 text-[11px] font-bold text-slate-200 hover:bg-slate-700">{children}</button>;
  return (
    <div className="relative rounded-xl border border-slate-700 bg-slate-900/70 overflow-hidden" style={{ height: "max(520px, calc(100vh - 250px))" }}>
      <div ref={view} className="absolute inset-0 touch-none" style={{ cursor: "grab", backgroundImage: "radial-gradient(#334155 1px, transparent 1px)", backgroundSize: "24px 24px" }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <div className="absolute left-0 top-0" style={{ width: g.w, height: g.h, transform: `translate(${t.x}px, ${t.y}px) scale(${t.s})`, transformOrigin: "0 0" }}>
          <svg className="absolute left-0 top-0 pointer-events-none" width={g.w} height={g.h}>
            <path d={g.edges.join(" ")} fill="none" stroke="#64748b" strokeWidth={2} strokeLinecap="round" />
          </svg>
          {g.labels.map((l) => <div key={l.text + l.x} className="absolute text-[11px] font-black uppercase tracking-wider" style={{ left: l.x, top: l.y, color: (STRIP[l.branch] || STRIP.operations).text }}>{l.text} <span className="text-slate-500 normal-case tracking-normal font-bold">· {l.n}</span></div>)}
          {g.boxes.map((b) => <TreeBox key={b.node.emp_no} b={b} isOpen={open.has(b.node.emp_no)} onToggle={toggle} onPerson={onPerson} moved={moved} />)}
        </div>
      </div>
      <div className="absolute left-2 top-2 flex flex-wrap gap-1 items-center">
        <Btn onClick={() => zoomCentre(1.25)} title="Zoom in"><ZoomIn size={13} /></Btn>
        <Btn onClick={() => zoomCentre(0.8)} title="Zoom out"><ZoomOut size={13} /></Btn>
        <Btn onClick={fit} title="Fit the whole chart on screen"><Maximize2 size={13} />fit</Btn>
        <Btn onClick={hundred} title="Actual size, from the top"><Scan size={13} />100%</Btn>
        <span className="text-[10px] text-slate-500 tabular-nums px-1">{Math.round(t.s * 100)}%</span>
        <Btn onClick={() => setOpen(new Set(withKids(mgmt)))} title="Open every branch down to the leaders"><ChevronsUpDown size={13} />expand all</Btn>
        <Btn onClick={() => setOpen(defaultOpen(mgmt))} title="Back to the readable default: down to the supervisors"><ChevronsDownUp size={13} />to supervisors</Btn>
        <Btn onClick={() => setOpen(new Set([mgmt && mgmt.emp_no].filter(Boolean)))} title="Only the GM and the managers"><Users size={13} />managers only</Btn>
      </div>
      <div className="absolute right-2 bottom-2 text-[10px] text-slate-500 bg-slate-900/70 rounded px-2 py-1">drag to pan · wheel / pinch to zoom · click a box to fold or unfold its branch · {g.boxes.length} boxes</div>
    </div>
  );
};

export default OrgTree;
