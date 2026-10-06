// YPI — Tech-pack. One order's pack as the factory's own tech pack reads: ten sections in order
// (Specification Sheet, Order Colour & Size Qty, Measurement Chart, Measurement Spec, Buyer Technical
// Sketch, Prod Sheet · Order Details, Production Instruction, Packing, Process Sheet, Thread Consumption),
// each a white sheet; tabs on screen, every sheet in one Print. Garment flats from ce/sketches.js.
// CN / EN / KH switch for the sheet headings (EN content for now).
// Data: M1 /sim/view {module:"ypi", view:"techpack", pick} → {picker, order, pages[11], progress} plus the
// section keys spec_sheet, colour_size_qty, measurement_spec (unit inches|cm, values ready-formatted),
// buyer_sketch, prod_details, production_instruction, packing, process_sheet, thread_consumption,
// languages. The construction callouts and the tech-team notes still come from the pages.
// Simulated factory, invented names only.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RefreshCw, Search, BookOpen, Scissors, LayoutGrid, Package, ClipboardCheck, Printer, ChevronLeft, ChevronRight } from "lucide-react";
import { Sketch, SketchSet, garmentsOf } from "../ce/sketches";

const API = (process.env.REACT_APP_M1_LLM_URL || "/api/m1").replace(/\/$/, "");
const num = (v) => (typeof v === "number" ? v.toLocaleString("en-US", { maximumFractionDigits: 2 }) : v === null || v === undefined ? "" : String(v));
const YPI_TABS = [
  ["techpack", "Tech-pack", BookOpen],
  ["cut-plan", "Marker & Cut Plan", Scissors],
  ["markers", "Markers", LayoutGrid],
  ["material-portal", "Material Portal", Package],
  ["bom-status", "BOM status", ClipboardCheck],
];
const STATUS = { complete: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", draft: "bg-amber-500/20 text-amber-300 border-amber-500/30", "not started": "bg-slate-500/20 text-slate-300 border-slate-500/30" };

// The ten sections, with their headings in the three languages of the pack (content stays EN for now;
// the KH headings are a first draft for Gamini's review).
const SECTIONS = [
  { key: "spec", en: "Specification Sheet", cn: "规格表", kh: "សន្លឹកលក្ខណៈបច្ចេកទេស" },
  { key: "qty", en: "Order Colour & Size Qty", cn: "订单颜色与尺码数量", kh: "បរិមាណតាមពណ៌ និងទំហំ" },
  { key: "chart", en: "Measurement Chart", cn: "尺寸测量图", kh: "គំនូសតាងរង្វាស់" },
  { key: "measure", en: "Measurement Spec", cn: "尺寸规格表", kh: "តារាងរង្វាស់" },
  { key: "buyer", en: "Buyer Technical Sketch", cn: "客户技术图", kh: "គំនូរបច្ចេកទេសអ្នកទិញ" },
  { key: "details", en: "Prod Sheet · Order Details", cn: "生产单 · 订单明细", kh: "សន្លឹកផលិតកម្ម · ព័ត៌មានបញ្ជាទិញ" },
  { key: "instruction", en: "Production Instruction", cn: "生产指示", kh: "សេចក្តីណែនាំផលិតកម្ម" },
  { key: "packing", en: "Packing", cn: "包装", kh: "ការវេចខ្ចប់" },
  { key: "process", en: "Process Sheet", cn: "工序表", kh: "សន្លឹកដំណើរការ" },
  { key: "thread", en: "Thread Consumption", cn: "用线量报告", kh: "របាយការណ៍ប្រើប្រាស់អំបោះ" },
];
const LANGS = [["en", "EN"], ["cn", "CN"], ["kh", "KH"]];
const T = {
  en: { orderRef: "ORDER REFERENCE", docType: "DOCUMENT TYPE", prepared: "PREPARED", imageComments: "IMAGE COMMENTS", majorPoints: "MAJOR POINTS", sampleByColour: "SAMPLE SIZE BY COLOUR", sizeBreakdown: "SIZE BREAKDOWN", page: "PAGE" },
  cn: { orderRef: "订单编号", docType: "文件类型", prepared: "编制日期", imageComments: "图片说明", majorPoints: "重点事项", sampleByColour: "各颜色样衣尺码", sizeBreakdown: "尺码分配", page: "页" },
  kh: { orderRef: "លេខយោងបញ្ជាទិញ", docType: "ប្រភេទឯកសារ", prepared: "រៀបចំ", imageComments: "កំណត់ចំណាំរូបភាព", majorPoints: "ចំណុចសំខាន់", sampleByColour: "ទំហំគំរូតាមពណ៌", sizeBreakdown: "ការបែងចែកទំហំ", page: "ទំព័រ" },
};

// ---- helpers over the pages' blocks ---------------------------------------------------------------
const page = (d, key) => ((d && d.pages) || []).find((p) => p.key === key) || null;
const blocks = (p) => (p && p.content && p.content.blocks) || [];
const block = (p, type, title) => blocks(p).find((b) => b.type === type && (!title || (b.title || "").toLowerCase().includes(title.toLowerCase()))) || null;

// where a point of measure sits on the front flat (x, y in % of the drawing) — by the POM's words
const POM_SPOTS = [
  [/collar|neck/, 50, 10], [/shoulder/, 50, 15], [/placket/, 50, 26], [/chest|bust/, 50, 40], [/armhole/, 76, 36], [/sleeve opening|cuff/, 90, 42], [/sleeve/, 86, 30],
  [/waistband/, 50, 12], [/waist/, 50, 58], [/front rise/, 50, 30], [/back rise/, 50, 30], [/thigh/, 36, 56], [/knee/, 34, 72], [/inseam/, 50, 72], [/outseam/, 20, 50], [/leg opening|hem opening/, 35, 92],
  [/hem|sweep|bottom/, 50, 88], [/length/, 50, 52], [/hood/, 50, 6], [/pocket/, 34, 70],
];
const pomSpot = (name, i) => { const s = POM_SPOTS.find(([re]) => re.test(String(name).toLowerCase())); return s ? { x: s[1], y: s[2] } : { x: 92, y: 10 + i * 6 }; };

// ---- sheet pieces (white paper) --------------------------------------------------------------------
const Band = ({ t, order, doc, date }) => (
  <div className="grid grid-cols-3 bg-[#1e2a4a] text-white text-[10px] tracking-wider">
    {[[t.orderRef, order], [t.docType, doc], [t.prepared, date || "—"]].map(([k, v]) => (
      <div key={k} className="px-3 py-1.5 border-r border-white/20 last:border-r-0"><div className="opacity-70">{k}</div><div className="text-sm font-black tracking-normal">{v || "—"}</div></div>
    ))}
  </div>
);
const H2 = ({ children }) => <div className="text-[11px] font-black tracking-wider uppercase bg-slate-200 text-slate-800 px-2 py-1 mt-3 mb-1.5">{children}</div>;
const KV = ({ items, cols = 2 }) => (
  <div className={`grid gap-x-4 gap-y-0.5 text-[12px] ${cols === 1 ? "grid-cols-1" : cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
    {(items || []).map(([k, v]) => <div key={k} className="flex gap-2 border-b border-dotted border-slate-300 py-0.5"><span className="text-slate-500 whitespace-nowrap">{k}</span><b className="min-w-0 truncate" title={String(v || "")}>{v === undefined || v === null || v === "" ? "—" : String(v)}</b></div>)}
  </div>
);
const Tbl = ({ cols, rows, foot, small, numRight = true }) => (
  <table className={`w-full border-collapse ${small ? "text-[10.5px]" : "text-[11.5px]"}`}>
    <thead><tr>{cols.map(([k, l]) => <th key={k} className="border border-slate-400 bg-slate-100 px-1.5 py-1 text-left font-bold whitespace-nowrap">{l}</th>)}</tr></thead>
    <tbody>
      {(rows || []).map((r, i) => (
        <tr key={i} className={r._total ? "font-bold bg-slate-50" : ""}>{cols.map(([k]) => <td key={k} className={`border border-slate-300 px-1.5 py-0.5 ${numRight && typeof r[k] === "number" ? "text-right tabular-nums" : ""}`}>{r[k] === undefined || r[k] === null ? "" : num(r[k])}</td>)}</tr>
      ))}
      {(rows || []).length === 0 && <tr><td colSpan={cols.length} className="border border-slate-300 px-2 py-3 text-center text-slate-400">—</td></tr>}
    </tbody>
    {foot && <tfoot><tr className="font-bold bg-slate-100">{cols.map(([k]) => <td key={k} className={`border border-slate-400 px-1.5 py-0.5 ${typeof foot[k] === "number" ? "text-right tabular-nums" : ""}`}>{foot[k] === undefined ? "" : num(foot[k])}</td>)}</tr></tfoot>}
  </table>
);
const Bullets = ({ items }) => <ul className="list-disc pl-5 text-[12px] space-y-0.5">{(items || []).map((x, i) => <li key={i}>{x}</li>)}</ul>;
const Rich = ({ sections }) => (sections || []).map((s) => <div key={s.h} className="mb-2"><div className="text-[12px] font-bold">{s.h}</div><Bullets items={s.items} /></div>);
const Empty = ({ what }) => <div className="text-[12px] text-slate-400 py-2">{what || "Nothing recorded on this page yet."}</div>;

// ---- the ten sections (each reads its section key; the old pages fill the few gaps) ----------------
const sizesCols = (sizes) => (sizes || []).map((z) => [z, z]);
const sizeRow = (r) => ({ ...r, ...(r.sizes || {}) });
const byGarment = (rows) => { const g = {}; (rows || []).forEach((r) => { const k = r.garment || ""; (g[k] = g[k] || []).push(r); }); return Object.entries(g); };

const Spec = ({ d, t }) => {
  const o = d.order || {};
  const S = d.spec_sheet;
  if (!S) return <Empty what="Specification sheet not issued yet." />;
  const pieces = (o.garments || []).join(" + ") || o.style;
  const sb = S.size_breakdown || {};
  const sizes = Object.keys(sb.qty || sb.ratio || {});
  return (
    <>
      <Band t={t} order={S.order_ref || o.ref} doc="SPECIFICATION SHEET" date={S.prepared && S.prepared.date ? S.prepared.date + (S.prepared.by ? " · " + S.prepared.by : "") : undefined} />
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 p-3">
        <div>
          <div className="border border-slate-300 p-2 flex justify-center"><SketchSet text={pieces} size={garmentsOf(pieces).length > 1 ? 150 : 230} /></div>
          <H2>{t.imageComments}</H2>
          {(S.image_comments || []).length ? <ul className="text-[11.5px] space-y-0.5">{S.image_comments.map((c, i) => <li key={i} className="flex gap-1.5"><b className="whitespace-nowrap">{(garmentsOf(pieces).length > 1 && c.garment ? c.garment + " · " : "") + (c.part || c.area || "")}</b><span>{c.comment || c.text}</span></li>)}</ul> : <Empty />}
        </div>
        <div>
          <KV items={[["Customer", S.customer], ["Customer style", S.customer_style], ["Order no", S.order_no], ["Order ref", S.order_ref], ["PO number", S.po_number], ["Style", o.style], ["Ex-factory", S.ex_factory], ["Order qty", S.qty ? num(S.qty) + " " + (S.qty_unit || "pcs") + (S.qty_pieces && S.qty_pieces !== S.qty ? " · " + num(S.qty_pieces) + " pcs" : "") : ""], ["Season", o.season], ["Retail pack", S.retail_pack]]} />
          <div className="mt-3 border-2 border-amber-400 bg-amber-50 p-2">
            <div className="text-[11px] font-black tracking-wider text-amber-800 mb-1">{t.majorPoints}</div>
            {(S.major_points || []).length ? <Bullets items={S.major_points} /> : <Empty what="No major points recorded." />}
          </div>
        </div>
      </div>
      <div className="px-3 pb-3 grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4">
        <div>
          <H2>{t.sampleByColour}</H2>
          <Tbl small cols={[["colour", "Colour"], ["size", "Sample size"], ["qty", "Qty"], ["remarks", "Remarks"]]} rows={S.sample_size_by_colour || []} />
        </div>
        <div>
          <H2>{t.sizeBreakdown}</H2>
          <Tbl cols={[["k", ""], ...sizesCols(sizes), ["total", "Total"]]} rows={[{ k: "Ratio", ...(sb.ratio || {}), total: Object.values(sb.ratio || {}).reduce((a, b) => a + b, 0) }, { k: "Qty", ...(sb.qty || {}), total: sb.total }]} />
        </div>
      </div>
    </>
  );
};

const Qty = ({ d, t }) => {
  const o = d.order || {};
  const C = d.colour_size_qty;
  if (!C) return <Empty what="Colour & size quantities not issued yet." />;
  const cols = [["garment", "Garment"], ["colour", "Colour"], ...sizesCols(C.sizes), ["total", "Total"]].filter(([k]) => k !== "garment" || (C.rows || []).some((r) => r.garment));
  const tot = C.totals ? { colour: "TOTAL", ...(C.totals.sizes || {}), total: C.totals.total } : undefined;
  return (
    <>
      <Band t={t} order={o.ref} doc={"ORDER COLOUR & SIZE QTY (" + (C.unit || "pcs") + ")"} date={d.spec_sheet && d.spec_sheet.prepared && d.spec_sheet.prepared.date} />
      <div className="p-3">
        <KV items={[["Style", o.style], ["Customer style", o.customer_style], ["Buyer PO", o.buyer_po], ["Ex-factory", o.ex_factory], ["Unit", C.unit], ["Sizes", (C.sizes || []).join(" · ")]]} cols={3} />
        <H2>Quantity by colour and size</H2>
        <Tbl cols={cols} rows={(C.rows || []).map(sizeRow)} foot={tot} />
      </div>
    </>
  );
};

const Chart = ({ d, t }) => {
  const o = d.order || {};
  const M = d.measurement_spec;
  if (!M) return <Empty what="Measurement spec not issued yet." />;
  const groups = byGarment(M.rows);
  return (
    <>
      <Band t={t} order={o.ref} doc="MEASUREMENT CHART" date={M.date} />
      <div className="p-3 space-y-3">
        {groups.map(([g, rows]) => (
          <div key={g} className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4">
            <div className="border border-slate-300 p-2 flex flex-col items-center">
              <Sketch text={g || (o.garments || [])[0] || o.style} size={groups.length > 1 ? 340 : 420} callouts={rows.map((r, i) => ({ no: r.code ? r.code.replace(/[^0-9]/g, "").replace(/^0+/, "") || r.no : r.no, ...pomSpot(r.description || r.area, i) }))} />
              {g && <div className="text-[11px] font-bold mt-1">{g}</div>}
            </div>
            <div>
              <H2>Points of measure{g ? " · " + g : ""}</H2>
              <Tbl small cols={[["no", "#"], ["code", "Code"], ["area", "Area"], ["description", "Point of measure"]]} rows={rows} />
            </div>
          </div>
        ))}
        <div className="text-[10px] text-slate-500">the number on the flat is the point's code number, placed at the usual spot of that measurement — garment type only, not the exact style</div>
      </div>
    </>
  );
};

const Measure = ({ d, t }) => {
  const o = d.order || {};
  const M = d.measurement_spec;
  if (!M) return <Empty what="Measurement spec not issued yet." />;
  const cols = [["no", "#"], ["code", "Code"], ["area", "Area"], ["description", "Description"], ["tol_minus", "TOL −"], ["tol_plus", "TOL +"], ...sizesCols(M.sizes), ["grade", "Grade"]];
  return (
    <>
      <Band t={t} order={o.ref} doc={"MEASUREMENT SPEC (" + (M.unit || "") + ")"} date={M.date} />
      <div className="p-3">
        <KV items={[["Version", M.version + (M.status ? " · " + M.status : "")], ["Unit", M.unit], ["Base size", M.base_size], ["Sizes", (M.sizes || []).join(" · ")], ["Measured", M.measured], ["Prepared by", M.prepared_by]]} cols={3} />
        {byGarment(M.rows).map(([g, rows]) => (
          <div key={g} className="mt-2">{g && <H2>{g}</H2>}<Tbl small cols={cols} rows={rows.map((r) => ({ ...sizeRow(r), tol_minus: "-" + r.tol_minus, tol_plus: "+" + r.tol_plus }))} numRight={false} /></div>
        ))}
        {M.note && <div className="text-[10.5px] text-slate-500 mt-1">{M.note}</div>}
      </div>
    </>
  );
};

const Buyer = ({ d, t }) => {
  const o = d.order || {};
  const B = d.buyer_sketch;
  const sk = block(page(d, "sketch"), "sketch");
  const cs = (sk && sk.callouts) || [];
  if (!B) return <Empty what="Buyer sketch not received yet." />;
  return (
    <>
      <Band t={t} order={o.ref} doc="BUYER TECHNICAL SKETCH" date={B.date} />
      <div className="p-3 grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4">
        <div>
          <div className="border border-slate-300 p-2 flex justify-center"><SketchSet text={(B.garments || o.garments || []).join(" + ") || o.style} size={(B.garments || o.garments || []).length > 1 ? 200 : 380} /></div>
          {cs.length > 0 && <><H2>Construction callouts</H2><ol className="text-[11.5px] space-y-0.5 columns-2">{cs.map((c) => <li key={c.no} className="flex gap-2 break-inside-avoid"><span className="w-5 h-5 rounded-full border border-slate-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">{c.no}</span><span><b>{c.part}</b> — {c.text}</span></li>)}</ol></>}
        </div>
        <div>
          <H2>Style information</H2>
          <KV items={[["Style ID", B.style_id], ["Description", B.short_desc], ["Department", B.department], ["Season", B.season], ["Size range", B.size_range], ["Retail price", B.retail_price], ["Garments", (B.garments || []).join(", ")]]} cols={1} />
          {(B.long_desc || []).length > 0 && <><H2>Description</H2><Bullets items={B.long_desc} /></>}
          {(B.colours || []).length > 0 && <><H2>Colours</H2><Tbl small cols={[["name", "Colour"], ["code", "Code"]]} rows={B.colours} /></>}
          {(B.thread_spec || []).length > 0 && <><H2>Thread</H2><Bullets items={B.thread_spec} /></>}
          {(B.label_instructions || []).length > 0 && <><H2>Labels</H2><Bullets items={B.label_instructions} /></>}
        </div>
      </div>
    </>
  );
};

const Details = ({ d, t }) => {
  const o = d.order || {};
  const P = d.prod_details;
  if (!P) return <Empty what="Order details not issued yet." />;
  const pr = P.processing || {};
  return (
    <>
      <Band t={t} order={P.order_ref || o.ref} doc="PROD SHEET · ORDER DETAILS" date={P.order_date} />
      <div className="p-3">
        <KV items={[["Order date", P.order_date], ["Ex-factory", P.ex_factory], ["Customer PO", P.customer_po], ["Season", P.season], ["Country of origin", P.coo], ["Qty unit", P.qty_unit]]} cols={3} />
        <div className="text-[12px] mt-1"><span className="text-slate-500">Description </span><b>{P.description}</b></div>
        <H2>Packs</H2>
        <Tbl small cols={[["pack_id", "Pack"], ["pack_name", "Name"], ["buyer_po", "Buyer PO"], ["ex_factory", "Ex-factory"], ["qty", "Qty"], ["cartons", "Cartons"]]} rows={P.packs || []} foot={P.packs_total !== undefined ? { pack_id: "TOTAL", qty: P.packs_total, cartons: (P.packs || []).reduce((a, x) => a + (x.cartons || 0), 0) } : undefined} />
        <H2>Processing requirements</H2>
        <div className="grid grid-cols-4 gap-2">
          {[["Print", pr.print], ["Embroidery", pr.embroidery], ["Washing", pr.washing], ["Heat transfer", pr.heat_transfer]].map(([name, v]) => (
            <div key={name} className="border border-slate-300 p-2 min-h-[4rem]"><div className="text-[11px] font-black uppercase tracking-wider mb-1">{name}</div><div className={`text-[12px] ${!v || /^none$/i.test(v) ? "text-slate-400" : "font-bold"}`}>{v || "—"}</div></div>
          ))}
        </div>
      </div>
    </>
  );
};

const Instruction = ({ d, t }) => {
  const o = d.order || {};
  const I = d.production_instruction;
  const old = page(d, "instruction");
  const note = page(d, "note");
  const special = page(d, "special");
  return (
    <>
      <Band t={t} order={o.ref} doc="PRODUCTION INSTRUCTION" date={old && old.updated} />
      <div className="p-3">
        {block(old, "rich") && <><H2>Instructions</H2><Rich sections={block(old, "rich").sections} /></>}
        <H2>Packing and folding</H2>
        {I && (I.packing_folding || []).length ? <Bullets items={I.packing_folding} /> : <Empty />}
        {I && <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="border-2 border-slate-800 p-3 min-h-[6rem]"><div className="text-[11px] font-black tracking-wider mb-1">SHIPPING MARK</div><div className="font-mono text-[11px] whitespace-pre-line">{(I.shipping_mark || []).join("\n") || "—"}</div></div>
          <div className="border-2 border-slate-800 p-3 min-h-[6rem]"><div className="text-[11px] font-black tracking-wider mb-1">SIDE MARK</div><div className="font-mono text-[11px] whitespace-pre-line">{(I.side_mark || []).join("\n") || "—"}</div></div>
        </div>}
        {note && <><H2>Tech team notes {note.status !== "complete" && <span className="normal-case font-normal text-amber-700">· {note.status}</span>}</H2>{blocks(note).filter((b) => b.type === "table").map((b) => <div key={b.title} className="mb-2"><div className="text-[11px] font-bold">{b.title}</div><Tbl small cols={b.columns} rows={b.rows} />{b.note && <div className="text-[10px] text-slate-500">{b.note}</div>}</div>)}{block(note, "list") && <Bullets items={block(note, "list").items} />}</>}
        {special && block(special, "list") && <><H2>Special instructions {special.status !== "complete" && <span className="normal-case font-normal text-amber-700">· {special.status}</span>}</H2><Bullets items={block(special, "list").items} /></>}
      </div>
    </>
  );
};

const Packing = ({ d, t }) => {
  const o = d.order || {};
  const K = d.packing;
  const I = d.production_instruction || {};
  if (!K) return <Empty what="Packing not issued yet." />;
  const ratio = K.carton_ratio || {};
  const tot = K.totals || {};
  const groups = byGarment(K.carton_table);
  return (
    <>
      <Band t={t} order={o.ref} doc="PACKING" date={d.spec_sheet && d.spec_sheet.prepared && d.spec_sheet.prepared.date} />
      <div className="p-3">
        <KV items={[["Carton", K.carton_pcs ? K.carton_pcs + " pcs" : ""], ["Carton size", K.carton_size], ["Ratio", Object.entries(ratio).map(([k, v]) => k + " " + v).join(" : ")], ["Cartons", tot.cartons !== undefined ? num(tot.cartons) + (tot.bom_cartons !== undefined ? " (BOM " + num(tot.bom_cartons) + ")" : "") : ""], ["Pieces", tot.pieces !== undefined ? num(tot.pieces) : ""], ["Loose pieces", tot.loose_pieces !== undefined ? num(tot.loose_pieces) + " in " + num(tot.balance_cartons) + " balance carton(s)" : ""]]} cols={3} />
        {groups.map(([g, rows]) => (
          <div key={g} className="mt-2"><H2>Carton table{g ? " · " + g : ""}</H2><Tbl small cols={[["colour", "Colour"], ["size", "Size"], ["qty", "Qty"], ["pcs_per_pack", "Pcs / carton"], ["packs", "Cartons"], ["in_packs", "In cartons"], ["loose", "Loose"]]} rows={rows} /></div>
        ))}
        {K.note && <div className="text-[10px] text-slate-500 mt-1">{K.note}</div>}
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="border-2 border-slate-800 p-3 min-h-[6rem]"><div className="text-[11px] font-black tracking-wider mb-1">SHIPPING MARK</div><div className="font-mono text-[11px] whitespace-pre-line">{(I.shipping_mark || []).join("\n") || "—"}</div></div>
          <div className="border-2 border-slate-800 p-3 min-h-[6rem]"><div className="text-[11px] font-black tracking-wider mb-1">SIDE MARK</div><div className="font-mono text-[11px] whitespace-pre-line">{(I.side_mark || []).join("\n") || "—"}</div></div>
        </div>
      </div>
    </>
  );
};

const Process = ({ d, t }) => {
  const o = d.order || {};
  const P = d.process_sheet;
  if (!P) return <Empty what="Process sheet not issued yet." />;
  const hd = P.header || {};
  const pre = P.pre_sewing || [];
  const cell = (re) => pre.filter((x) => re.test((x.item || "").toLowerCase()));
  const rest = pre.filter((x) => !/relax|spread|cut/.test((x.item || "").toLowerCase()));
  const cols = [["no", "No."], ["operation", "Operation"], ["machine", "Machine"], ["code", "Code"], ["top_thread", "Top thread"], ["bottom_thread", "Bottom thread"], ["spi", "SPI"], ["needle", "Needle"], ["stations", "St"], ["sam", "SAM"], ["key_points", "Key points"]];
  return (
    <>
      <Band t={t} order={o.ref} doc="PROCESS SHEET" date={d.spec_sheet && d.spec_sheet.prepared && d.spec_sheet.prepared.date} />
      <div className="p-3">
        <KV items={[["Product", hd.product], ["SMV", hd.smv !== undefined ? hd.smv + " min" : ""], ["Operators", hd.operators], ["Target / 8 h", hd.target_pcs_8h !== undefined ? num(hd.target_pcs_8h) + " pcs at " + hd.efficiency_pct + "%" : ""], ["Order", o.ref], ["Qty", o.qty ? num(o.qty) + " pcs" : ""]]} cols={3} />
        {(hd.targets || []).length > 1 && <div className="mt-1"><Tbl small cols={[["garment", "Garment"], ["smv", "SMV"], ["operators", "Operators"], ["target_pcs_8h", "Target / 8 h"]]} rows={hd.targets} /></div>}
        <H2>Fabric relaxing · spreading · cutting · key requirements</H2>
        <table className="w-full border-collapse text-[11px]">
          <thead><tr>{["FABRIC RELAXING", "SPREADING", "CUTTING", "KEY REQUIREMENTS"].map((h) => <th key={h} className="border border-slate-400 bg-slate-100 px-1.5 py-1 text-left font-bold w-1/4">{h}</th>)}</tr></thead>
          <tbody><tr className="align-top">{[cell(/relax/), cell(/spread/), cell(/cut/), rest].map((xs, i) => <td key={i} className="border border-slate-300 px-1.5 py-1">{xs.length ? <ul className="list-disc pl-4 space-y-0.5">{xs.map((x) => <li key={x.no}><b>{x.item}</b>{x.department ? " (" + x.department + ")" : ""}: {x.spec}</li>)}</ul> : <span className="text-slate-400">—</span>}</td>)}</tr></tbody>
        </table>
        {P.general_note && <div className="border border-rose-400 bg-rose-50 text-rose-800 text-[11px] font-bold px-2 py-1 mt-3">{P.general_note}</div>}
        {byGarment(P.operations).map(([g, rows]) => (
          <div key={g} className="mt-2"><H2>Operations{g ? " · " + g : ""}</H2><Tbl small cols={cols} rows={rows.map((r) => ({ ...r, operation: r.operation || r.name }))} foot={{ operation: "Total SAM", sam: Number(rows.reduce((a, r) => a + (Number(r.sam) || 0), 0).toFixed(2)) }} /></div>
        ))}
      </div>
    </>
  );
};

const Thread = ({ d, t }) => {
  const o = d.order || {};
  const R = d.thread_consumption;
  if (!R) return <Empty what="Thread consumption not issued yet." />;
  const totals = R.totals || {};
  const cal = R.calibration || {};
  return (
    <>
      <Band t={t} order={o.ref} doc="THREAD CONSUMPTION REPORT" date={d.spec_sheet && d.spec_sheet.prepared && d.spec_sheet.prepared.date} />
      <div className="p-3">
        <KV items={[["Style", o.style], ["Order", o.ref], ["Qty", o.qty ? num(o.qty) + " pcs" : ""], ...Object.keys(totals).map((g) => ["Total · " + g, num(totals[g]) + " m / pc" + (cal[g] ? " · calibration × " + cal[g] : "")])]} cols={3} />
        <H2>Thread consumption</H2>
        <Tbl small cols={[["garment", "Garment"], ["material", "Material"], ["spec", "Spec"], ["position", "Position"], ["usage_m_per_pcs", "m / pc"]]} rows={R.rows || []} />
        {byGarment(R.yield_rows).map(([g, rows]) => (
          <div key={g} className="mt-2"><H2>Yield{g ? " · " + g : ""}</H2><Tbl small cols={[["process", "Process"], ["machine", "Machine"], ["length_cm", "Seam cm"], ["multiple", "Stitch ×"], ["freq", "Freq"], ["seam_allow_cm", "Allow cm"], ["calc_m", "Calc m"], ["yield_m", "Yield m"]]} rows={rows} foot={{ process: "Total", yield_m: Number(rows.reduce((a, r) => a + (Number(r.yield_m) || 0), 0).toFixed(1)) }} /></div>
        ))}
        {R.note && <div className="text-[10px] text-slate-500 mt-1">{R.note}</div>}
      </div>
    </>
  );
};

const RENDER = { spec: Spec, qty: Qty, chart: Chart, measure: Measure, buyer: Buyer, details: Details, instruction: Instruction, packing: Packing, process: Process, thread: Thread };
const PRINT_CSS = "@media print { body * { visibility: hidden !important; } .tp-print, .tp-print * { visibility: visible !important; } .tp-print { position: absolute; left: 0; top: 0; width: 100%; } .tp-sheet { display: block !important; page-break-after: always; border: 0 !important; box-shadow: none !important; margin: 0 0 8mm 0 !important; } .tp-noprint { display: none !important; } }";

const TechPack = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const [pick, setPick] = useState(search.get("order") || "");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [lang, setLang] = useState("en");
  const [sec, setSec] = useState("spec");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ypi", view: "techpack", pick: pick || undefined }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "unavailable");
      setData(j);
    } catch (e) {
      setError("Tech-pack data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [pick]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (pick) setSearch({ order: pick }, { replace: true }); }, [pick, setSearch]);

  const d = data || {};
  const o = d.order || {};
  const t = T[lang] || T.en;
  const options = useMemo(() => {
    const all = (d.picker && d.picker.options) || [];
    const s = q.trim().toLowerCase();
    return s ? all.filter((x) => `${x.name} ${x.sub}`.toLowerCase().includes(s)) : all;
  }, [d.picker, q]);
  const selected = (d.picker && d.picker.selected) || pick;
  const ix = SECTIONS.findIndex((s) => s.key === sec);
  const pages = d.pages || [];
  const statusOf = (key) => { const map = { spec: "spec", qty: "order", chart: "measure", measure: "measure", buyer: "sketch", details: "order", instruction: "instruction", packing: "packing", process: "process", thread: "thread" }; const p = pages.find((x) => x.key === map[key]); return p ? p.status : ""; };

  return (
    <div className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 pb-6 pt-28 font-sans">
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; } ${PRINT_CSS}`}</style>
      {/* YPI tabs */}
      <div className="tp-noprint flex flex-wrap items-center gap-1.5 mb-2">
        {YPI_TABS.map(([v, label, Icon]) => (
          <button key={v} onClick={() => navigate(`/dashboard/ypi/${v}`)} className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${v === "techpack" ? "bg-emerald-500/20 border-emerald-500/40 text-white" : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"}`}><Icon size={13} />{label}</button>
        ))}
        <h1 className="text-lg font-black text-white leading-none ml-2">Tech-pack</h1>
        {o.ref && <span className="text-xs text-slate-400">{o.ref} · {o.style} · {num(o.qty)} pcs · {o.state}{d.progress ? ` · ${d.progress.complete}/${d.progress.of} pages complete` : ""}</span>}
        <div className="ml-auto flex items-center gap-1.5">
          <div className="inline-flex rounded-md border border-slate-700 overflow-hidden text-[11px]">{LANGS.map(([k, l]) => <button key={k} onClick={() => setLang(k)} className={`px-2 py-1 font-bold ${lang === k ? "bg-slate-200 text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{l}</button>)}</div>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1 rounded-md bg-white text-slate-900 text-xs font-bold px-2.5 py-1.5"><Printer size={13} />Print pack</button>
          <button onClick={load} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
        </div>
      </div>
      {error && <div className="tp-noprint mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}

      <div className="flex gap-3 items-start">
        {/* orders */}
        <aside className="tp-noprint w-52 flex-shrink-0 rounded-xl border border-slate-700 bg-slate-800/60 p-1.5 sticky top-28 max-h-[calc(100vh-8rem)] overflow-auto">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 mb-1.5"><Search size={12} className="text-slate-500" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order…" className="bg-transparent outline-none text-xs w-full text-white placeholder-slate-500" /></div>
          {options.map((x) => (
            <button key={x.id} onClick={() => { setPick(x.id); setSec("spec"); }} className={`w-full text-left rounded-lg px-2 py-1 mb-0.5 border ${selected === x.id ? "bg-emerald-500/20 border-emerald-500/40" : "border-transparent hover:bg-slate-700/60"}`}>
              <div className="flex items-center gap-1.5"><span className={`inline-block w-2 h-2 rounded-full ${x.tone === "green" ? "bg-emerald-400" : x.tone === "amber" ? "bg-amber-400" : "bg-slate-500"}`} /><span className="text-xs font-bold text-white">{x.name}</span><span className="ml-auto text-[10px] text-slate-500 tabular-nums">{x.count}/{x.of}</span></div>
              <div className="text-[10px] text-slate-400 truncate">{x.sub}</div>
            </button>
          ))}
          {options.length === 0 && <div className="px-2 py-4 text-xs text-slate-500">{loading ? "Loading…" : "No orders."}</div>}
        </aside>

        <main className="flex-1 min-w-0">
          {/* section tabs */}
          <div className="tp-noprint flex flex-wrap gap-1 mb-2">
            {SECTIONS.map((s, i) => {
              const st = statusOf(s.key);
              return (
                <button key={s.key} onClick={() => setSec(s.key)} className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-bold ${sec === s.key ? "bg-white text-slate-900 border-white" : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>
                  <span className="tabular-nums opacity-60">{i + 1}</span>{s[lang] || s.en}
                  {st && <span className={`inline-block w-1.5 h-1.5 rounded-full ${st === "complete" ? "bg-emerald-400" : st === "draft" ? "bg-amber-400" : "bg-slate-500"}`} title={st} />}
                </button>
              );
            })}
          </div>
          {/* the sheets: the picked one on screen, all of them in print */}
          <div className="tp-print">
            {SECTIONS.map((s, i) => {
              const R = RENDER[s.key];
              const st = statusOf(s.key);
              return (
                <div key={s.key} className={`tp-sheet rounded-xl border border-slate-600 bg-white text-slate-900 shadow-xl mb-3 ${sec === s.key ? "" : "hidden"}`}>
                  <div className="flex items-center gap-2 px-3 pt-2 text-[10px] text-slate-500">
                    <span className="font-black tracking-wider text-slate-700">{i + 1}. {s[lang] || s.en}</span>
                    {lang !== "en" && <span>· {s.en}</span>}
                    {st && <span className={`rounded-full border px-1.5 ${STATUS[st] || ""}`}>{st}</span>}
                    <span className="ml-auto">{t.page} {i + 1} / {SECTIONS.length} · {o.ref || ""} · simulated factory — invented names</span>
                  </div>
                  <div className="px-3 pb-3 pt-1">
                    <div className="border border-slate-400">{data ? <R d={d} t={t} /> : <div className="p-6 text-center text-slate-400 text-sm">{loading ? "Loading…" : "No data."}</div>}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="tp-noprint flex items-center gap-2 mt-1 text-[11px] text-slate-400">
            <button disabled={ix <= 0} onClick={() => setSec(SECTIONS[ix - 1].key)} className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 disabled:opacity-40"><ChevronLeft size={12} />prev</button>
            <button disabled={ix >= SECTIONS.length - 1} onClick={() => setSec(SECTIONS[ix + 1].key)} className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 disabled:opacity-40">next<ChevronRight size={12} /></button>
            <span className="ml-auto">{lang !== "en" ? "headings in " + lang.toUpperCase() + " · content EN until the translations land · " : ""}Print pack prints all {SECTIONS.length} sheets</span>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TechPack;
