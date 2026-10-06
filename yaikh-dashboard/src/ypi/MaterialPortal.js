// YPI — Material Portal, BOM Status and Tech-pack. The merchandiser puts together every
// material an order needs (from the tech-pack, consumption from the marker and per
// garment), checks the bill of materials against the buyer's PO by colour and size, gets
// the approvals (lab dips, strike-offs, trim samples) and books the material POs; MRP
// then follows each PO to the factory gate. Three views: the Material Portal of one order,
// the BOM status of every order cutting in the next 60 days, and the tech-pack overview.
// Data: M1 /sim/view {module:"ypi", view:"material-portal" | "bom-status" | "techpack", pick}. Simulated.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, RefreshCw, Search, CheckCircle2, XCircle, Scissors, LayoutGrid, Package, ClipboardCheck, BookOpen } from "lucide-react";
import { NavCover, useScreenTop, Figures } from "../components/ScreenTop";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const h = React.createElement;
const num = (v) => (typeof v === "number" ? v.toLocaleString("en-US") : v === null || v === undefined ? "" : String(v));
const LIGHT = { green: "bg-emerald-400", amber: "bg-amber-400", red: "bg-rose-500 ring-2 ring-rose-500/40 animate-pulse", grey: "bg-slate-500" };
const TONE_CHIP = {
  green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  blue: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  amber: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  red: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  grey: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};
const APPROVAL_CHIP = { approved: "green", submitted: "blue", waiting: "amber", "not needed": "grey" };
const PAGE_CHIP = { complete: "green", draft: "amber", "not started": "grey" };
const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const Chip = ({ tone, children, wrap }) => <span className={`inline-block border px-2.5 py-0.5 text-xs font-semibold ${wrap ? "rounded-lg leading-tight max-w-[230px]" : "rounded-full whitespace-nowrap"} ${TONE_CHIP[tone] || TONE_CHIP.grey}`}>{children}</span>;

// The tabs that connect every YPI screen (also used by the Marker & Cut Plan screen).
const TABS = [
  ["techpack", "Tech-pack", BookOpen],
  ["cut-plan", "Marker & Cut Plan", Scissors],
  ["markers", "Markers", LayoutGrid],
  ["material-portal", "Material Portal", Package],
  ["bom-status", "BOM status", ClipboardCheck],
];
export const YpiTabs = ({ view }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-0.5 bg-slate-800 border border-slate-700 rounded-lg p-0.5 flex-wrap">
      {TABS.map(([v, label, Icon]) => (
        <button key={v} onClick={() => navigate(`/dashboard/ypi/${v}`)} className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap ${view === v ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}>
          <Icon size={13} className="hidden 2xl:block" />{label}
        </button>
      ))}
    </div>
  );
};

// Item pictures: the same small drawings as the consumption chart (mrp/MrpView.js, copied — that file does not export them).
const tile = (key) => h("rect", { key, x: 1, y: 1, width: 54, height: 34, rx: 4, fill: "#1e293b", stroke: "#475569", strokeWidth: 1 });
const PICTURES = {
  fabric: () => [
    tile("t"),
    h("rect", { key: "l", x: 13, y: 24, width: 25, height: 7, fill: "#7f97c2" }),
    h("rect", { key: "b", x: 13, y: 8, width: 27, height: 17, fill: "#6b84b0" }),
    h("ellipse", { key: "a", cx: 13, cy: 16.5, rx: 3.5, ry: 8.5, fill: "#6b84b0" }),
    h("ellipse", { key: "e", cx: 40, cy: 16.5, rx: 3.5, ry: 8.5, fill: "#4a5f85", stroke: "#cbd5e1", strokeWidth: 0.8 }),
    h("ellipse", { key: "c", cx: 40, cy: 16.5, rx: 1.2, ry: 2.8, fill: "#0b1220" }),
  ],
  thread: () => [
    tile("t"),
    h("rect", { key: "c", x: 26.5, y: 4, width: 3, height: 4, fill: "#cbd5e1" }),
    h("path", { key: "b", d: "M21 29 L35 29 L30.5 8 L25.5 8 Z", fill: "#fbbf24" }),
    ...[13, 18, 23].map((y) => h("line", { key: "w" + y, x1: 28 - (y - 3) / 4.2, x2: 28 + (y - 3) / 4.2, y1: y, y2: y + 1.5, stroke: "#b45309", strokeWidth: 0.8 })),
    h("rect", { key: "f", x: 18, y: 29, width: 20, height: 2.5, rx: 1, fill: "#cbd5e1" }),
    h("path", { key: "e", d: "M31 11 Q42 12 44 23", fill: "none", stroke: "#fbbf24", strokeWidth: 1 }),
  ],
  label: () => [
    tile("t"),
    h("rect", { key: "b", x: 11, y: 10, width: 34, height: 16, rx: 1.5, fill: "#f1f5f9" }),
    h("line", { key: "s1", x1: 14, x2: 14, y1: 11.5, y2: 24.5, stroke: "#64748b", strokeWidth: 1, strokeDasharray: "2 1.5" }),
    h("line", { key: "s2", x1: 42, x2: 42, y1: 11.5, y2: 24.5, stroke: "#64748b", strokeWidth: 1, strokeDasharray: "2 1.5" }),
    h("line", { key: "a", x1: 18, x2: 38, y1: 16, y2: 16, stroke: "#334155", strokeWidth: 2.2, strokeLinecap: "round" }),
    h("line", { key: "c", x1: 21, x2: 35, y1: 21, y2: 21, stroke: "#94a3b8", strokeWidth: 1.4, strokeLinecap: "round" }),
  ],
  "heat-seal": () => [
    tile("t"),
    h("rect", { key: "b", x: 17, y: 7, width: 22, height: 22, rx: 5, fill: "#f97316", fillOpacity: 0.85, stroke: "#fdba74", strokeWidth: 1 }),
    h("path", { key: "s", d: "M28 11.5 L30 16 L34.8 16.4 L31.2 19.6 L32.3 24.3 L28 21.8 L23.7 24.3 L24.8 19.6 L21.2 16.4 L26 16 Z", fill: "#fff7ed" }),
  ],
  zipper: () => [
    tile("t"),
    h("rect", { key: "a", x: 21, y: 3, width: 6, height: 30, fill: "#4a5f85" }),
    h("rect", { key: "b", x: 29, y: 3, width: 6, height: 30, fill: "#4a5f85" }),
    ...[5, 8, 11, 14, 17, 20, 23, 26, 29].map((y, i) => h("line", { key: "z" + y, x1: i % 2 ? 25.5 : 27, x2: i % 2 ? 29 : 30.5, y1: y, y2: y, stroke: "#cbd5e1", strokeWidth: 1.3 })),
    h("rect", { key: "s", x: 24, y: 10, width: 8, height: 6.5, rx: 1.5, fill: "#fbbf24" }),
    h("rect", { key: "p", x: 26.8, y: 16.5, width: 2.4, height: 8, rx: 1, fill: "#fbbf24" }),
  ],
  drawcord: () => [
    tile("t"),
    h("path", { key: "c", d: "M9 13 C 17 3, 23 31, 31 19 S 43 9, 47 23", fill: "none", stroke: "#e2e8f0", strokeWidth: 2.6, strokeLinecap: "round" }),
    h("circle", { key: "a", cx: 9, cy: 13, r: 2, fill: "#fbbf24" }),
    h("circle", { key: "b", cx: 47, cy: 23, r: 2, fill: "#fbbf24" }),
  ],
  elastic: () => [
    tile("t"),
    h("rect", { key: "b", x: 11, y: 12, width: 34, height: 12, rx: 2, fill: "#e2e8f0" }),
    ...[15, 19, 23, 27, 31, 35, 39].map((x) => h("line", { key: "r" + x, x1: x + 1, x2: x + 1, y1: 13, y2: 23, stroke: "#94a3b8", strokeWidth: 1 })),
    h("path", { key: "l", d: "M4 18 L9 14.5 L9 21.5 Z", fill: "#fbbf24" }),
    h("path", { key: "r", d: "M52 18 L47 14.5 L47 21.5 Z", fill: "#fbbf24" }),
  ],
  eyelet: () => [tile("t"), h("circle", { key: "r", cx: 28, cy: 18, r: 8.5, fill: "#0b1220", stroke: "#cbd5e1", strokeWidth: 4 })],
  "cord-clip": () => [
    tile("t"),
    h("line", { key: "c", x1: 28, x2: 28, y1: 3, y2: 33, stroke: "#e2e8f0", strokeWidth: 2.2 }),
    h("rect", { key: "b", x: 19, y: 10, width: 18, height: 16, rx: 6, fill: "#94a3b8", stroke: "#e2e8f0", strokeWidth: 0.8 }),
    h("circle", { key: "h", cx: 28, cy: 18, r: 3, fill: "#0b1220" }),
  ],
  button: () => [
    tile("t"),
    h("circle", { key: "b", cx: 28, cy: 18, r: 11, fill: "#94a3b8", stroke: "#e2e8f0", strokeWidth: 1 }),
    h("circle", { key: "i", cx: 28, cy: 18, r: 7.5, fill: "none", stroke: "#64748b", strokeWidth: 0.8 }),
    ...[[25, 15], [31, 15], [25, 21], [31, 21]].map((c) => h("circle", { key: "h" + c[0] + c[1], cx: c[0], cy: c[1], r: 1.5, fill: "#0b1220" })),
  ],
  "bra-pad": () => [tile("t"), h("path", { key: "p", d: "M11 26 Q28 -3 45 26 Q28 33 11 26 Z", fill: "#f1f5f9", fillOpacity: 0.9, stroke: "#cbd5e1", strokeWidth: 1 }), h("path", { key: "s", d: "M17 23 Q28 8 39 23", fill: "none", stroke: "#94a3b8", strokeWidth: 0.8 })],
  polybag: () => [
    tile("t"),
    h("rect", { key: "g", x: 19, y: 14, width: 18, height: 14, rx: 1.5, fill: "#6b84b0" }),
    h("rect", { key: "b", x: 14, y: 5, width: 28, height: 27, rx: 2, fill: "#7dd3fc", fillOpacity: 0.18, stroke: "#7dd3fc", strokeWidth: 1 }),
    h("line", { key: "s", x1: 14, x2: 42, y1: 9.5, y2: 9.5, stroke: "#7dd3fc", strokeWidth: 1 }),
    h("line", { key: "h", x1: 37, x2: 40, y1: 14, y2: 24, stroke: "#e0f2fe", strokeWidth: 1.2, strokeLinecap: "round" }),
  ],
  carton: () => [
    tile("t"),
    h("path", { key: "o", d: "M12 14 L18 7 L48 7 L42 14 Z", fill: "#c9a27e", stroke: "#7f5539", strokeWidth: 0.8 }),
    h("rect", { key: "f", x: 12, y: 14, width: 30, height: 17, fill: "#b08968", stroke: "#7f5539", strokeWidth: 0.8 }),
    h("path", { key: "s", d: "M42 14 L48 7 L48 24 L42 31 Z", fill: "#9c6f4d", stroke: "#7f5539", strokeWidth: 0.8 }),
    h("path", { key: "p", d: "M25.5 14 L31.5 7 L34.5 7 L28.5 14 L28.5 21 L25.5 21 Z", fill: "#e6ccb2" }),
  ],
  hangtag: () => [
    tile("t"),
    h("path", { key: "s", d: "M28 13 Q33 3 45 6", fill: "none", stroke: "#fbbf24", strokeWidth: 1.2, strokeLinecap: "round" }),
    h("path", { key: "b", d: "M23 8 L33 8 L37 13 L37 31 L19 31 L19 13 Z", fill: "#f1f5f9" }),
    h("circle", { key: "h", cx: 28, cy: 13, r: 1.8, fill: "#1e293b" }),
    h("line", { key: "a", x1: 23, x2: 33, y1: 20, y2: 20, stroke: "#334155", strokeWidth: 1.8, strokeLinecap: "round" }),
    h("line", { key: "c", x1: 23, x2: 30, y1: 25, y2: 25, stroke: "#94a3b8", strokeWidth: 1.3, strokeLinecap: "round" }),
  ],
};
const Picture = ({ k }) => {
  const draw = PICTURES[String(k || "").toLowerCase()];
  if (!draw) return <span className="block w-14 h-9" />;
  return h("svg", { width: 56, height: 36, viewBox: "0 0 56 36", role: "img", "aria-label": String(k), className: "block rounded" }, h("title", null, String(k)), draw());
};

// Key figures as inline "label value" spans, for the slim order line (FAIL in red).
const figTone = (x) => (x.value === "FAIL" ? "text-rose-300" : "text-white");
const FigSpans = ({ items }) => (items || []).map((x) => <span key={x.label} className="whitespace-nowrap">{x.label} <b className={`tabular-nums text-sm ${figTone(x)}`}>{num(x.value)}</b></span>);

// The six steps as connected dots: done green, in progress blue, late red and pulsing, to come grey.
const DOT = { done: "bg-emerald-400 border-emerald-300", "in progress": "bg-sky-400 border-sky-300", late: "bg-rose-500 border-rose-300 animate-pulse", "to come": "bg-slate-600 border-slate-500" };
const STATE_TEXT = { done: "text-emerald-300", "in progress": "text-sky-300", late: "text-rose-300", "to come": "text-slate-400" };
const Steps = ({ steps }) => (
  <div className="rounded-2xl border border-slate-700 bg-slate-800/40 px-4 pt-4 pb-3 mb-3 overflow-x-auto">
    <div className="grid min-w-[760px]" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      {steps.map((s, i) => (
        <div key={s.key} className="relative flex flex-col items-center text-center px-1">
          {i > 0 && <div className={`absolute top-[11px] right-1/2 w-full h-1 ${steps[i - 1].state === "done" ? "bg-emerald-500/60" : "bg-slate-600"}`} />}
          <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-black text-slate-900 ${DOT[s.state] || DOT["to come"]}`} title={s.state}>{i + 1}</div>
          <div className="mt-1.5 text-sm font-bold text-white leading-tight">{s.label}</div>
          <div className="text-[10px] text-slate-500 leading-tight">{s.what}</div>
          <div className={`text-xs font-semibold mt-0.5 ${STATE_TEXT[s.state] || ""}`}>{s.state}{s.date ? ` · ${s.date.slice(0, 6)}` : ""}</div>
          <div className="text-[11px] text-slate-400 leading-tight mt-0.5">{s.note}</div>
        </div>
      ))}
    </div>
  </div>
);

// The bill of materials, grouped Fabric / Accessories / Packing.
const Bom = ({ rows }) => {
  const groups = ["Fabric", "Accessories", "Packing"].map((g) => [g, rows.filter((r) => r.group === g)]).filter(([, rs]) => rs.length);
  const th = "px-2.5 py-2 text-[11px] font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap";
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/40 overflow-x-auto mb-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-800 text-left">
            {["", "Material", "Colour", "Size", "Per garment", "Wastage", "Needed", "On the PO", "Status", "Approval", "Material PO", "Booked on", "Supplier"].map((c, i) => <th key={i} className={th}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {groups.map(([g, rs]) => (
            <React.Fragment key={g}>
              <tr className="bg-slate-900/60 border-t border-slate-700"><td colSpan={13} className="px-3 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-300">{g} <span className="text-slate-500 font-bold normal-case tracking-normal">· {rs.length} line{rs.length === 1 ? "" : "s"}</span></td></tr>
              {rs.map((r, i) => (
                <tr key={i} className="border-t border-slate-700/60 hover:bg-slate-700/30 align-top">
                  <td className="px-2 py-1.5"><Picture k={r.picture} /></td>
                  <td className="px-2.5 py-1.5 text-sm min-w-[190px]"><div className="font-bold text-white">{r.material}</div><div className="text-[11px] text-slate-400 leading-tight">{r.description}</div></td>
                  <td className="px-2.5 py-1.5 text-sm whitespace-nowrap">{r.colour}</td>
                  <td className="px-2.5 py-1.5 text-sm font-bold">{r.size}</td>
                  <td className="px-2.5 py-1.5 text-xs text-slate-300 min-w-[130px]">{r.per_garment}</td>
                  <td className="px-2.5 py-1.5 text-sm text-right tabular-nums">{r.wastage}</td>
                  <td className="px-2.5 py-1.5 text-sm text-right tabular-nums whitespace-nowrap font-bold text-white">{r.needed_text}</td>
                  <td className="px-2.5 py-1.5 text-sm text-right tabular-nums whitespace-nowrap">{r.po_text}</td>
                  <td className="px-2.5 py-1.5 min-w-[170px]"><Chip tone={r.tone} wrap>{r.status}</Chip></td>
                  <td className="px-2.5 py-1.5 min-w-[150px]"><Chip tone={APPROVAL_CHIP[r.approval_state]} wrap>{r.approval}</Chip></td>
                  <td className="px-2.5 py-1.5 text-sm font-bold text-white whitespace-nowrap" title={r.terms}>{r.po}</td>
                  <td className="px-2.5 py-1.5 text-sm whitespace-nowrap">{r.booked_on || <span className="text-slate-500">—</span>}</td>
                  <td className="px-2.5 py-1.5 text-xs min-w-[170px]"><div className="text-slate-200">{r.supplier}</div><div className={r.source === "nominated" ? "text-violet-300 font-semibold" : "text-slate-500"}>{r.source === "nominated" ? "nominated by the customer" : "approved supplier"}</div></td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          {rows.length === 0 && <tr><td colSpan={13} className="px-4 py-10 text-center text-slate-500">Nothing to show.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

// The material POs of the order: supplier, nominated or approved, terms (back-to-back L/C), booked, value, MRP status.
const Pos = ({ pos }) => (
  <div className="flex gap-2 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: "thin", scrollbarColor: "#475569 transparent" }}>
    {(pos || []).map((p) => (
      <div key={p.po} className="flex-shrink-0 w-[260px] rounded-2xl border border-slate-700 bg-slate-800/60 px-3 py-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-black text-white">{p.po}</span>
          <span className={`text-xs font-bold tabular-nums ${p.booked === p.lines ? "text-emerald-300" : "text-amber-300"}`}>{p.booked} / {p.lines} booked</span>
        </div>
        <div className="text-xs text-slate-200 truncate" title={p.supplier}>{p.supplier}</div>
        <div className={`text-[11px] ${p.source === "nominated" ? "text-violet-300 font-semibold" : "text-slate-500"}`}>{p.source === "nominated" ? "nominated by the customer" : "approved supplier"}</div>
        <div className={`text-[11px] ${/back-to-back/.test(p.terms) ? "text-amber-200" : "text-slate-400"} truncate`} title={p.terms}>{p.terms}</div>
        <div className="text-[11px] text-slate-400 mt-0.5">{p.booked_on ? `booked ${p.booked_on}` : "not booked yet"} · {p.value ? `USD ${num(p.value)}` : "USD 0"}</div>
        <div className="text-[11px] text-slate-400 truncate" title={p.contents}>MRP: {p.mrp_status}{p.eta ? `, at factory ${p.eta}` : ""}</div>
      </div>
    ))}
  </div>
);

// The PO check: for fabric a matrix per colour (and garment) × size, garments the BOM fabric is planned to cut over the
// pieces ordered + wastage; for the rest a list, BOM quantity against the need and the need + wastage.
const PoCheck = ({ checks }) => {
  const fab = checks.filter((c) => c.unit === "garments");
  const rest = checks.filter((c) => c.unit !== "garments");
  const sizes = [];
  const groups = [];
  const byKey = {};
  fab.forEach((c) => {
    if (!sizes.includes(c.size)) sizes.push(c.size);
    const k = `${c.material}|${c.colour}`;
    if (!byKey[k]) { byKey[k] = { material: c.material, colour: c.colour, cells: {} }; groups.push(byKey[k]); }
    byKey[k].cells[c.size] = c;
  });
  sizes.sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  const kg = Object.fromEntries(rest.filter((c) => c.unit === "kg").map((c) => [`${c.material}|${c.colour}`, c]));
  const other = rest.filter((c) => c.unit !== "kg");
  const Ok = ({ ok }) => (ok ? <CheckCircle2 size={15} className="text-emerald-400 inline" aria-label="pass" /> : <XCircle size={15} className="text-rose-400 inline" aria-label="fail" />);
  const th = "px-3 py-2 text-[11px] font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap";
  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3 mb-4">
      <div className="rounded-2xl border border-slate-700 bg-slate-800/40 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-800 text-left">
              <th className={th}>Fabric · colour</th>
              {sizes.map((s) => <th key={s} className={`${th} text-right`}>{s}</th>)}
              <th className={`${th} text-right`}>kg needed / on PO</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => {
              const k = kg[`${g.material}|${g.colour}`];
              return (
                <tr key={`${g.material}|${g.colour}`} className="border-t border-slate-700/70">
                  <td className="px-3 py-1.5 text-sm whitespace-nowrap"><b className="text-white">{g.colour}</b> <span className="text-slate-400">{g.material.replace("Main fabric", "").replace(" — ", "")}</span></td>
                  {sizes.map((s) => {
                    const c = g.cells[s];
                    if (!c) return <td key={s} />;
                    return (
                      <td key={s} className="px-3 py-1.5 text-sm text-right tabular-nums whitespace-nowrap" title={`ordered ${num(c.need)}, + wastage ${num(c.with_wastage)}, planned from the BOM fabric ${num(c.bom)}`}>
                        <span className="inline-flex items-center gap-1"><span className="text-white">{num(c.bom)}</span><span className="text-slate-500 text-xs">/ {num(c.need)}</span><Ok ok={c.ok} /></span>
                      </td>
                    );
                  })}
                  <td className="px-3 py-1.5 text-sm text-right tabular-nums whitespace-nowrap">{k ? <span className="inline-flex items-center gap-1">{num(k.with_wastage)} / {num(k.bom)} <Ok ok={k.ok} /></span> : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-3 py-1.5 text-[11px] text-slate-500 border-t border-slate-700/70">Garments planned to cut from the BOM fabric / pieces ordered, per size (order + cutting allowance must be covered); fabric kg from the marker vs kg on the material PO.</div>
      </div>
      <div className="rounded-2xl border border-slate-700 bg-slate-800/40 overflow-auto" style={{ maxHeight: 360 }}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-800 text-left sticky top-0">
              {["Material", "Colour / size", "Net need", "+ wastage", "BOM", ""].map((c, i) => <th key={i} className={`${th} ${i > 1 ? "text-right" : ""}`}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {other.map((c, i) => (
              <tr key={i} className="border-t border-slate-700/70">
                <td className="px-3 py-1 text-sm text-white whitespace-nowrap">{c.material}</td>
                <td className="px-3 py-1 text-sm whitespace-nowrap">{[c.colour, c.size !== "all" ? c.size : ""].filter(Boolean).join(" · ") || <span className="text-slate-500">all</span>}</td>
                <td className="px-3 py-1 text-sm text-right tabular-nums">{num(c.need)}</td>
                <td className="px-3 py-1 text-sm text-right tabular-nums">{num(c.with_wastage)}</td>
                <td className="px-3 py-1 text-sm text-right tabular-nums text-white whitespace-nowrap">{num(c.bom)} <span className="text-slate-500 text-xs">{c.unit}</span></td>
                <td className="px-2 py-1"><Ok ok={c.ok} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Table = ({ cols, rows, onRow }) => (
  <div className="rounded-2xl border border-slate-700 bg-slate-800/40 overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-slate-800 text-left">
          {cols.map((c) => <th key={c.key} className="px-3 py-2 text-xs font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap">{c.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} onClick={onRow ? () => onRow(r) : undefined} className={`border-t border-slate-700/70 hover:bg-slate-700/40 ${onRow ? "cursor-pointer" : ""}`}>
            {cols.map((c) => (
              <td key={c.key} className={`px-3 py-1.5 text-sm ${typeof r[c.key] === "number" ? "text-right tabular-nums" : ""} ${c.key === "order" ? "font-bold text-white whitespace-nowrap" : ""} ${["cutting", "booked", "value"].includes(c.key) ? "whitespace-nowrap" : ""}`}>
                {c.key === "status" ? <Chip tone={r.tone}>{r.status}</Chip> : c.key === "state" ? <Chip tone={PAGE_CHIP[r.state]}>{r.state}</Chip> : num(r[c.key])}
              </td>
            ))}
          </tr>
        ))}
        {rows.length === 0 && <tr><td colSpan={Math.max(cols.length, 1)} className="px-4 py-10 text-center text-slate-500">Nothing to show.</td></tr>}
      </tbody>
    </table>
  </div>
);

const Picker = ({ picker, onPick, legend }) => (
  <aside className="w-full md:w-64 flex-shrink-0 rounded-2xl border border-slate-700 bg-slate-800/60 p-2 md:sticky md:top-28 overflow-y-auto" style={{ maxHeight: "calc(100vh - 8rem)", scrollbarWidth: "thin", scrollbarColor: "#475569 transparent" }}>
    <div className="px-2 pb-1 text-xs uppercase tracking-wider text-slate-400 font-bold">{picker.label} <span className="text-slate-500">({picker.options.length})</span></div>
    <div className="px-2 pb-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-400">
      {legend.map(([tone, label]) => <span key={tone} className="flex items-center gap-1"><span className={`inline-block w-2 h-2 rounded-full ${LIGHT[tone]}`} />{label}</span>)}
    </div>
    {picker.options.map((x) => (
      <button key={x.id} onClick={() => onPick(x.id)} className={`w-full text-left rounded-xl px-3 py-2 mb-1 border transition-colors ${picker.selected === x.id ? "bg-emerald-500/20 border-emerald-500/40" : "border-transparent hover:bg-slate-700/60"}`}>
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
);

const KICKER = { "material-portal": "Material Portal", "bom-status": "BOM Status", techpack: "Tech-pack" };

const MaterialPortal = ({ onBack, view: fixedView = "material-portal" }) => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const view = KICKER[fixedView] ? fixedView : "material-portal";
  const [pick, setPick] = useState(search.get("order") || "");
  const [d, setD] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [topRef, topPad] = useScreenTop();

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

  const mine = d && d.view === view ? d : null;
  const cols = (mine && mine.columns) || [];
  const rows = useMemo(() => {
    const all = (mine && mine.rows) || [];
    const s = q.trim().toLowerCase();
    return s ? all.filter((r) => Object.values(r).join(" ").toLowerCase().includes(s)) : all;
  }, [mine, q]);
  const o = mine && mine.order;

  return (
    <div ref={topRef} style={{ paddingTop: topPad }} className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-4 md:px-6 pb-6 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; }`}</style>
      <NavCover />
      {/* one toolbar line: back, title, the YPI tabs, the key figures (the Material Portal has them on its order line), search, refresh */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-2">
        <button onClick={onBack || (() => navigate("/"))} className="p-1 -ml-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white" aria-label="Back"><ArrowLeft size={18} /></button>
        <h1 className="text-lg font-black text-white leading-none whitespace-nowrap" title={(mine && mine.subtitle) || undefined}>{(mine && mine.title) || KICKER[view]}</h1>
        <YpiTabs view={view} />
        {mine && (view !== "material-portal" || !o) && <Figures items={mine.summary} fmt={num} tone={figTone} />}
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
            <Search size={14} className="text-slate-500" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={view === "bom-status" ? "Search order, customer, style…" : view === "techpack" ? "Search page…" : "Search material, colour, PO…"} className="bg-transparent outline-none text-xs w-36 text-white placeholder-slate-500" />
          </div>
          <button onClick={load} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
        </div>
      </div>

      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}

      {mine && view === "bom-status" && (
        <>
          <div className="text-xs text-slate-400 mb-1.5">Click an order to open its Material Portal.</div>
          <Table cols={cols} rows={rows} onRow={(r) => navigate(`/dashboard/ypi/material-portal?order=${encodeURIComponent(r.order)}`)} />
        </>
      )}

      {mine && view === "material-portal" && mine.picker && (
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Picker picker={mine.picker} onPick={setPick} legend={[["green", "all booked"], ["amber", "in progress"], ["red", "late"]]} />
          {o && (
            <div className="flex-1 min-w-0">
              {/* the order and its figures, one slim line */}
              <div className="rounded-xl border border-slate-700 bg-slate-800/40 px-3 py-1.5 mb-3 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 whitespace-nowrap"><span className={`inline-block w-2.5 h-2.5 rounded-full ${LIGHT[o.tone] || LIGHT.grey}`} /><b className="text-sm font-black text-white">{o.ref}</b> · customer <b className="text-white">{o.customer}</b></span>
                <span className="text-slate-300">{o.style}</span>
                <span className="whitespace-nowrap">Qty <b className="text-white tabular-nums text-sm">{num(o.qty)}</b></span>
                <span className="whitespace-nowrap">Cutting starts <b className="text-white">{o.cutting}</b>{o.days_to_cut !== null && o.days_to_cut !== undefined ? ` (in ${o.days_to_cut} days)` : ""}</span>
                <span>Colours <b className="text-white">{Object.entries(o.colours || {}).map(([c, n]) => `${c} ${num(n)}`).join(" · ")}</b></span>
                <FigSpans items={mine.summary} />
              </div>
              <Steps steps={mine.steps || []} />
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Material POs — MRP follows each one to the factory gate</div>
              <Pos pos={mine.pos} />
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Bill of materials</div>
              <Bom rows={rows} />
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                PO check — BOM against the buyer's PO by colour and size, with wastage
                {mine.po_check_ok ? <span className="normal-case tracking-normal text-emerald-300 font-semibold">pass</span> : <span className="normal-case tracking-normal text-rose-300 font-semibold">not everything is covered</span>}
              </div>
              <PoCheck checks={mine.po_check || []} />
            </div>
          )}
        </div>
      )}

      {mine && view === "techpack" && mine.picker && (
        <>
          {/* progress by customer, one slim line */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mb-3 text-[11px] text-slate-400">
            {(mine.customers || []).map((c) => (
              <span key={c.customer} className="flex items-center gap-1.5 whitespace-nowrap">
                <b className="text-xs text-white">Customer {c.customer}</b>
                <span className="inline-block w-16 h-1.5 rounded-full bg-slate-700 overflow-hidden"><span className="block h-full bg-emerald-400" style={{ width: `${c.pct}%` }} /></span>
                <b className="text-emerald-300 tabular-nums">{c.pct}%</b>
                <span>{c.orders} orders · {c.complete} complete · {c.in_progress} in progress · {c.not_started} not started</span>
              </span>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <Picker picker={mine.picker} onPick={setPick} legend={[["green", "complete"], ["amber", "in progress"], ["grey", "not started"]]} />
            {o && (
              <div className="flex-1 min-w-0">
                {/* the order, one slim line */}
                <div className="rounded-xl border border-slate-700 bg-slate-800/40 px-3 py-1.5 mb-3 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
                  <span className="whitespace-nowrap"><b className="text-sm font-black text-white">{o.ref}</b> · customer <b className="text-white">{o.customer}</b></span>
                  <span className="text-slate-300">{o.style}</span>
                  <span className="whitespace-nowrap">Qty <b className="text-white tabular-nums text-sm">{num(o.qty)}</b></span>
                  <span className="whitespace-nowrap">Cutting starts <b className="text-white">{o.cutting}</b></span>
                  <span className="whitespace-nowrap">Pages complete <b className="text-white">{o.complete} of {o.pages}</b></span>
                </div>
                <Table cols={cols} rows={rows} />
              </div>
            )}
          </div>
        </>
      )}
      <p className="mt-3 text-[11px] text-slate-500">{mine ? `${rows.length} of ${mine.total} rows · as of ${String(mine.as_of || "").replace("T", " ").slice(0, 16)} · ` : ""}Simulated factory data — no real customer, supplier or person.</p>
    </div>
  );
};

export default MaterialPortal;
