// YPI — Tech-pack. One order's pack as the factory's own tech pack reads: ten sections in order
// (Specification Sheet, Order Colour & Size Qty, Measurement Chart, Measurement Spec, Buyer Technical
// Sketch, Prod Sheet · Order Details, Production Instruction, Packing, Process Sheet, Thread Consumption),
// each a white sheet; tabs on screen, every sheet in one Print. Garment flats from ce/sketches.js.
// CN / EN / KH switch: the sheet headings stay bilingual ("7. 生产指示 · Production Instruction"); the content comes
// from the server in the chosen language (body.lang "cn" | "kh" → guard tp_i18n) and the screen's own labels from UI.
// Garment names also come as *_en (garments_en, garment_en, description_en, item_en) for the sketch and POM lookups.
// Data: M1 /sim/view {module:"ypi", view:"techpack", pick, lang?} → {picker, order, pages[11], progress} plus the
// section keys spec_sheet, colour_size_qty, measurement_spec (unit inches|cm, values ready-formatted),
// buyer_sketch, prod_details, production_instruction, packing, process_sheet, thread_consumption,
// languages (buyer_sketch carries prepared + callouts). The tech-team notes still come from the pages.
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
// The screen's own labels in CN / KH (the content itself comes translated from the server). Keyed by the EN text.
const UI = {
  "SPECIFICATION SHEET": ["规格表", "សន្លឹកលក្ខណៈបច្ចេកទេស"], "ORDER COLOUR & SIZE QTY": ["订单颜色及尺码数量", "បរិមាណតាមពណ៌ និងទំហំ"],
  "MEASUREMENT CHART": ["尺寸测量图", "គំនូសតាងរង្វាស់"], "MEASUREMENT SPEC": ["尺寸规格表", "តារាងរង្វាស់"], "BUYER TECHNICAL SKETCH": ["客户款式图", "គំនូរបច្ចេកទេសអ្នកទិញ"],
  "PROD SHEET · ORDER DETAILS": ["生产单 · 订单明细", "សន្លឹកផលិតកម្ម · ព័ត៌មានបញ្ជាទិញ"], "PRODUCTION INSTRUCTION": ["生产指示", "សេចក្តីណែនាំផលិតកម្ម"],
  "PACKING": ["包装", "ការវេចខ្ចប់"], "PROCESS SHEET": ["工序表", "សន្លឹកដំណើរការ"], "THREAD CONSUMPTION REPORT": ["用线量报告", "របាយការណ៍ប្រើប្រាស់អំបោះ"],
  Customer: ["客户", "អតិថិជន"], "Customer style": ["客户款号", "លេខម៉ូដអតិថិជន"], "Order no": ["订单号", "លេខបញ្ជាទិញ"], "Order ref": ["订单编号", "លេខយោងបញ្ជាទិញ"],
  "PO number": ["PO号", "លេខ PO"], Style: ["款式", "ម៉ូដ"], "Ex-factory": ["出厂", "ចេញពីរោងចក្រ"], "Order qty": ["订单数量", "បរិមាណបញ្ជាទិញ"], Season: ["季节", "រដូវ"],
  "Retail pack": ["零售包装", "ការវេចខ្ចប់លក់រាយ"], pcs: ["件", "ដុំ"], "Specification sheet not issued yet.": ["规格表尚未发出。", "សន្លឹកលក្ខណៈបច្ចេកទេស មិនទាន់ចេញ។"],
  "No major points recorded.": ["未记录重点事项。", "មិនទាន់កត់ត្រាចំណុចសំខាន់។"], "Nothing recorded on this page yet.": ["本页尚无记录。", "ទំព័រនេះមិនទាន់មានកំណត់ត្រា។"],
  Colour: ["颜色", "ពណ៌"], "Sample size": ["样衣尺码", "ទំហំគំរូ"], Qty: ["数量", "បរិមាណ"], Remarks: ["备注", "កំណត់សម្គាល់"], Total: ["合计", "សរុប"], TOTAL: ["合计", "សរុប"],
  Ratio: ["配比", "សមាមាត្រ"], "Colour & size quantities not issued yet.": ["颜色及尺码数量尚未发出。", "បរិមាណតាមពណ៌ និងទំហំ មិនទាន់ចេញ។"], "Buyer PO": ["客户PO", "PO អ្នកទិញ"],
  Unit: ["单位", "ឯកតា"], Sizes: ["尺码", "ទំហំ"], "Quantity by colour and size": ["按颜色及尺码数量", "បរិមាណតាមពណ៌ និងទំហំ"], Garment: ["款式", "សម្លៀកបំពាក់"],
  "Measurement spec not issued yet.": ["尺寸规格表尚未发出。", "តារាងរង្វាស់ មិនទាន់ចេញ។"], "Points of measure": ["度量部位", "ចំណុចវាស់"], Code: ["代码", "កូដ"], Area: ["部位", "ផ្នែក"],
  "Point of measure": ["度量部位", "ចំណុចវាស់"],
  "the number on the flat is the point's code number, placed at the usual spot of that measurement — garment type only, not the exact style":
    ["平面图上的数字是度量代码编号，标在该尺寸的常规位置——只按服装类型，不是本款的准确位置", "លេខលើគំនូរ គឺលេខកូដនៃចំណុចវាស់ ដាក់នៅកន្លែងធម្មតានៃរង្វាស់នោះ — តាមប្រភេទសម្លៀកបំពាក់ប៉ុណ្ណោះ មិនមែនម៉ូដពិតប្រាកដទេ"],
  Description: ["描述", "ការពិពណ៌នា"], "TOL −": ["公差 −", "កម្រិតអនុញ្ញាត −"], "TOL +": ["公差 +", "កម្រិតអនុញ្ញាត +"], Grade: ["档差", "គម្លាតទំហំ"], Version: ["版本", "កំណែ"],
  "Base size": ["基码", "ទំហំគោល"], Measured: ["量法", "របៀបវាស់"], "Prepared by": ["编制人", "រៀបចំដោយ"], "Buyer sketch not received yet.": ["尚未收到客户款式图。", "មិនទាន់ទទួលបានគំនូររបស់អ្នកទិញ។"],
  "Construction callouts": ["工艺说明", "ចំណុចបច្ចេកទេសដេរ"], "Style information": ["款式资料", "ព័ត៌មានម៉ូដ"], "Style ID": ["款号", "លេខម៉ូដ"], Department: ["部门", "ផ្នែក"],
  "Size range": ["尺码范围", "ចន្លោះទំហំ"], "Retail price": ["零售价", "តម្លៃលក់រាយ"], Garments: ["款式", "សម្លៀកបំពាក់"], Colours: ["颜色", "ពណ៌"], Thread: ["缝线", "អំបោះ"],
  Labels: ["唛头", "ស្លាក"], "Order details not issued yet.": ["订单明细尚未发出。", "ព័ត៌មានបញ្ជាទិញ មិនទាន់ចេញ។"], "Order date": ["下单日期", "ថ្ងៃបញ្ជាទិញ"],
  "Customer PO": ["客户PO", "PO អតិថិជន"], "Country of origin": ["原产国", "ប្រទេសដើម"], "Qty unit": ["数量单位", "ឯកតាបរិមាណ"], Packs: ["包装分配", "កញ្ចប់"], Pack: ["包装号", "កញ្ចប់"],
  Name: ["名称", "ឈ្មោះ"], Cartons: ["箱数", "ចំនួនកាតុង"], "Processing requirements": ["加工要求", "តម្រូវការដំណើរការបន្ថែម"], Print: ["印花", "បោះពុម្ព"], Embroidery: ["绣花", "ប៉ាក់"],
  Washing: ["洗水", "បោក"], "Heat transfer": ["热转印", "បោះពុម្ពកម្ដៅ"], Instructions: ["指示", "សេចក្តីណែនាំ"], "Packing and folding": ["包装及折叠", "ការវេចខ្ចប់ និងការបត់"],
  "Tech team notes": ["技术部备注", "កំណត់ចំណាំក្រុមបច្ចេកទេស"], "Special instructions": ["特别指示", "សេចក្តីណែនាំពិសេស"], "SHIPPING MARK": ["正唛 SHIPPING MARK", "សញ្ញាដឹកជញ្ជូន SHIPPING MARK"],
  "SIDE MARK": ["侧唛 SIDE MARK", "សញ្ញាចំហៀង SIDE MARK"], "Packing not issued yet.": ["包装资料尚未发出。", "ការវេចខ្ចប់ មិនទាន់ចេញ។"], Carton: ["外箱", "កាតុង"], "Carton size": ["外箱尺寸", "ទំហំកាតុង"],
  Pieces: ["件数", "ចំនួនដុំ"], "Loose pieces": ["散件", "ដុំរាយ"], "Carton table": ["装箱表", "តារាងកាតុង"], Size: ["尺码", "ទំហំ"], "Pcs / carton": ["件/箱", "ដុំ / កាតុង"],
  "In cartons": ["已装箱", "ក្នុងកាតុង"], Loose: ["散件", "រាយ"], "Process sheet not issued yet.": ["工序表尚未发出。", "សន្លឹកដំណើរការ មិនទាន់ចេញ។"], Product: ["产品", "ផលិតផល"],
  Operators: ["作业员", "កម្មករ"], "Target / 8 h": ["目标/8小时", "គោលដៅ / 8 ម៉ោង"], Order: ["订单", "ការបញ្ជាទិញ"], min: ["分钟", "នាទី"],
  "Fabric relaxing · spreading · cutting · key requirements": ["松布 · 拉布 · 裁剪 · 重点要求", "ការបន្ធូរក្រណាត់ · ការក្រាល · ការកាត់ · តម្រូវការសំខាន់"],
  "FABRIC RELAXING": ["松布", "ការបន្ធូរក្រណាត់"], SPREADING: ["拉布", "ការក្រាលក្រណាត់"], CUTTING: ["裁剪", "ការកាត់"], "KEY REQUIREMENTS": ["重点要求", "តម្រូវការសំខាន់"],
  Operations: ["工序", "ប្រតិបត្តិការ"], "No.": ["序号", "ល.រ"], Operation: ["工序", "ប្រតិបត្តិការ"], Machine: ["机器", "ម៉ាស៊ីន"], "Top thread": ["面线", "អំបោះលើ"],
  "Bottom thread": ["底线", "អំបោះក្រោម"], SPI: ["针距", "ចាក់/អ៊ីញ"], Needle: ["机针", "ម្ជុល"], St: ["工位", "ទីតាំង"], "Key points": ["要点", "ចំណុចសំខាន់"], "Total SAM": ["总SAM", "SAM សរុប"],
  "Thread consumption not issued yet.": ["用线量尚未发出。", "ការប្រើប្រាស់អំបោះ មិនទាន់ចេញ។"], "Thread consumption": ["用线量", "ការប្រើប្រាស់អំបោះ"], Material: ["物料", "សម្ភារៈ"],
  Spec: ["规格", "លក្ខណៈ"], Position: ["位置", "ទីតាំង"], "m / pc": ["米/件", "m / ដុំ"], Yield: ["用量", "ទិន្នផល"], Process: ["工序", "ដំណើរការ"], "Seam cm": ["缝长 cm", "ប្រវែងថ្នេរ cm"],
  "Stitch ×": ["线迹倍数", "មេគុណស្នាមដេរ"], Freq: ["次数", "ចំនួនដង"], "Allow cm": ["缝份 cm", "រឹមថ្នេរ cm"], "Calc m": ["计算米数", "គណនា m"], "Yield m": ["用量米数", "ទិន្នផល m"],
  "calibration ×": ["校准 ×", "តម្រឹម ×"], "simulated factory — invented names": ["模拟工厂——名称均为虚构", "រោងចក្រក្លែងធ្វើ — ឈ្មោះប្រឌិត"], "Loading…": ["加载中…", "កំពុងផ្ទុក…"],
  "No data.": ["无数据。", "គ្មានទិន្នន័យ។"], "Print pack": ["打印制单", "បោះពុម្ពឯកសារ"], prev: ["上一页", "មុន"], next: ["下一页", "បន្ទាប់"], "pages complete": ["页已完成", "ទំព័របានបញ្ចប់"],
  "Order…": ["订单…", "ការបញ្ជាទិញ…"], "No orders.": ["无订单。", "គ្មានការបញ្ជាទិញ។"], "Tech-pack": ["制单", "ឯកសារបច្ចេកទេស"],
  complete: ["已完成", "បានបញ្ចប់"], draft: ["草稿", "សេចក្តីព្រាង"], "not started": ["未开始", "មិនទាន់ចាប់ផ្ដើម"],
  "Tech-pack data is unavailable right now. Please try again in a moment.": ["制单数据暂时无法读取，请稍后再试。", "ទិន្នន័យឯកសារបច្ចេកទេស មិនអាចប្រើបានឥឡូវនេះទេ។ សូមព្យាយាមម្ដងទៀតបន្តិចទៀត។"],
};
const tr = (lang) => (s) => (lang === "en" || !UI[s] ? s : UI[s][lang === "cn" ? 0 : 1]);
const NONE = ["none", "无", "គ្មាន"];
// numbers with their words, in the language's order
const FMT = {
  en: { loose: (a, b) => `${a} in ${b} balance carton(s)`, target: (a, e) => `${a} pcs at ${e}%`, printAll: (n) => `Print pack prints all ${n} sheets` },
  cn: { loose: (a, b) => `${a}件，装${b}个尾箱`, target: (a, e) => `${a}件（效率${e}%）`, printAll: (n) => `打印制单会打印全部${n}张表` },
  kh: { loose: (a, b) => `${a} ដុំ ក្នុងកាតុងសល់ ${b}`, target: (a, e) => `${a} ដុំ (ប្រសិទ្ធភាព ${e}%)`, printAll: (n) => `បោះពុម្ពឯកសារ បោះពុម្ពសន្លឹកទាំង ${n}` },
};
// Khmer and Chinese glyphs: Kantumruy Pro / Khmer OS Battambang are loaded by the app (index.css, index.html); the system fonts follow
const FONT_I18N = { fontFamily: 'Inter, "Kantumruy Pro", "Khmer OS Battambang", "Noto Sans Khmer", "Khmer Sangam MN", "Khmer UI", "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif' };
// the EN garment name of a translated one (sketch lookup), from the order's garments / garments_en
const enOf = (d, g) => { const o = (d && d.order) || {}; const i = (o.garments || []).indexOf(g); return (i >= 0 && (o.garments_en || [])[i]) || g; };
const trOf = (d, g) => { const o = (d && d.order) || {}; const i = (o.garments_en || []).indexOf(g); return (i >= 0 && (o.garments || [])[i]) || g; };

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
    {[[t.orderRef, order], [t.docType, t.L(doc)], [t.prepared, date || "—"]].map(([k, v]) => (
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
const Empty = ({ what, t }) => <div className="text-[12px] text-slate-400 py-2">{t ? t.L(what || "Nothing recorded on this page yet.") : what || "Nothing recorded on this page yet."}</div>;

// ---- the ten sections (each reads its section key; the old pages fill the few gaps) ----------------
const sizesCols = (sizes) => (sizes || []).map((z) => [z, z]);
const sizeRow = (r) => ({ ...r, ...(r.sizes || {}) });
const byGarment = (rows) => { const g = {}; (rows || []).forEach((r) => { const k = r.garment || ""; (g[k] = g[k] || []).push(r); }); return Object.entries(g); };

const Spec = ({ d, t }) => {
  const o = d.order || {};
  const S = d.spec_sheet;
  if (!S) return <Empty t={t} what="Specification sheet not issued yet." />;
  const pieces = (o.garments_en || o.garments || []).join(" + ") || o.style;
  const sb = S.size_breakdown || {};
  const sizes = Object.keys(sb.qty || sb.ratio || {});
  return (
    <>
      <Band t={t} order={S.order_ref || o.ref} doc="SPECIFICATION SHEET" date={S.prepared && S.prepared.date ? S.prepared.date + (S.prepared.by ? " · " + S.prepared.by : "") : undefined} />
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 p-3">
        <div>
          <div className="border border-slate-300 p-2 flex justify-center"><SketchSet text={pieces} size={garmentsOf(pieces).length > 1 ? 150 : 230} /></div>
          <H2>{t.imageComments}</H2>
          {(S.image_comments || []).length ? <ul className="text-[11.5px] space-y-0.5">{S.image_comments.map((c, i) => <li key={i} className="flex gap-1.5"><b className="whitespace-nowrap">{(garmentsOf(pieces).length > 1 && c.garment ? c.garment + " · " : "") + (c.part || c.area || "")}</b><span>{c.comment || c.text}</span></li>)}</ul> : <Empty t={t} />}
        </div>
        <div>
          <KV items={[["Customer", S.customer], ["Customer style", S.customer_style], ["Order no", S.order_no], ["Order ref", S.order_ref], ["PO number", S.po_number], ["Style", o.style], ["Ex-factory", S.ex_factory], ["Order qty", S.qty ? num(S.qty) + " " + (S.qty_unit || t.L("pcs")) + (S.qty_pieces && S.qty_pieces !== S.qty ? " · " + num(S.qty_pieces) + " " + t.L("pcs") : "") : ""], ["Season", o.season], ["Retail pack", S.retail_pack]].map(([k, v]) => [t.L(k), v])} />
          <div className="mt-3 border-2 border-amber-400 bg-amber-50 p-2">
            <div className="text-[11px] font-black tracking-wider text-amber-800 mb-1">{t.majorPoints}</div>
            {(S.major_points || []).length ? <Bullets items={S.major_points} /> : <Empty t={t} what="No major points recorded." />}
          </div>
        </div>
      </div>
      <div className="px-3 pb-3 grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4">
        <div>
          <H2>{t.sampleByColour}</H2>
          <Tbl small cols={[["colour", t.L("Colour")], ["size", t.L("Sample size")], ["qty", t.L("Qty")], ["remarks", t.L("Remarks")]]} rows={S.sample_size_by_colour || []} />
        </div>
        <div>
          <H2>{t.sizeBreakdown}</H2>
          <Tbl cols={[["k", ""], ...sizesCols(sizes), ["total", t.L("Total")]]} rows={[{ k: t.L("Ratio"), ...(sb.ratio || {}), total: Object.values(sb.ratio || {}).reduce((a, b) => a + b, 0) }, { k: t.L("Qty"), ...(sb.qty || {}), total: sb.total }]} />
        </div>
      </div>
    </>
  );
};

const Qty = ({ d, t }) => {
  const o = d.order || {};
  const C = d.colour_size_qty;
  if (!C) return <Empty t={t} what="Colour & size quantities not issued yet." />;
  const cols = [["garment", t.L("Garment")], ["colour", t.L("Colour")], ...sizesCols(C.sizes), ["total", t.L("Total")]].filter(([k]) => k !== "garment" || (C.rows || []).some((r) => r.garment));
  const tot = C.totals ? { colour: t.L("TOTAL"), ...(C.totals.sizes || {}), total: C.totals.total } : undefined;
  return (
    <>
      <Band t={t} order={o.ref} doc={t.L("ORDER COLOUR & SIZE QTY") + " (" + (C.unit || t.L("pcs")) + ")"} date={d.spec_sheet && d.spec_sheet.prepared && d.spec_sheet.prepared.date} />
      <div className="p-3">
        <KV items={[["Style", o.style], ["Customer style", o.customer_style], ["Buyer PO", o.buyer_po], ["Ex-factory", o.ex_factory], ["Unit", C.unit], ["Sizes", (C.sizes || []).join(" · ")]].map(([k, v]) => [t.L(k), v])} cols={3} />
        <H2>{t.L("Quantity by colour and size")}</H2>
        <Tbl cols={cols} rows={(C.rows || []).map(sizeRow)} foot={tot} />
      </div>
    </>
  );
};

const Chart = ({ d, t }) => {
  const o = d.order || {};
  const M = d.measurement_spec;
  if (!M) return <Empty t={t} what="Measurement spec not issued yet." />;
  const groups = byGarment(M.rows);
  return (
    <>
      <Band t={t} order={o.ref} doc="MEASUREMENT CHART" date={M.date} />
      <div className="p-3 space-y-3">
        {groups.map(([g, rows]) => (
          <div key={g} className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4">
            <div className="border border-slate-300 p-2 flex flex-col items-center">
              <Sketch text={(rows[0] && rows[0].garment_en) || enOf(d, g) || (o.garments_en || o.garments || [])[0] || o.style} size={groups.length > 1 ? 340 : 420} callouts={rows.map((r, i) => ({ no: r.code ? r.code.replace(/[^0-9]/g, "").replace(/^0+/, "") || r.no : r.no, ...pomSpot(r.description_en || r.description || r.area, i) }))} />
              {g && <div className="text-[11px] font-bold mt-1">{g}</div>}
            </div>
            <div>
              <H2>{t.L("Points of measure")}{g ? " · " + g : ""}</H2>
              <Tbl small cols={[["no", "#"], ["code", t.L("Code")], ["area", t.L("Area")], ["description", t.L("Point of measure")]]} rows={rows} />
            </div>
          </div>
        ))}
        <div className="text-[10px] text-slate-500">{t.L("the number on the flat is the point's code number, placed at the usual spot of that measurement — garment type only, not the exact style")}</div>
      </div>
    </>
  );
};

const Measure = ({ d, t }) => {
  const o = d.order || {};
  const M = d.measurement_spec;
  if (!M) return <Empty t={t} what="Measurement spec not issued yet." />;
  const cols = [["no", "#"], ["code", t.L("Code")], ["area", t.L("Area")], ["description", t.L("Description")], ["tol_minus", t.L("TOL −")], ["tol_plus", t.L("TOL +")], ...sizesCols(M.sizes), ["grade", t.L("Grade")]];
  return (
    <>
      <Band t={t} order={o.ref} doc={t.L("MEASUREMENT SPEC") + " (" + (M.unit || "") + ")"} date={M.date} />
      <div className="p-3">
        <KV items={[["Version", M.version + (M.status ? " · " + M.status : "")], ["Unit", M.unit], ["Base size", M.base_size], ["Sizes", (M.sizes || []).join(" · ")], ["Measured", M.measured], ["Prepared by", M.prepared_by]].map(([k, v]) => [t.L(k), v])} cols={3} />
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
  if (!B) return <Empty t={t} what="Buyer sketch not received yet." />;
  const garments = B.garments || o.garments || [];
  const enG = (g) => { const i = garments.indexOf(g); return (i >= 0 && (B.garments_en || [])[i]) || enOf(d, g); };
  // the numbered construction points: buyer_sketch.callouts first (x / y in % on the front flat, numbered
  // across both pieces of a set), else the old sketch page's
  const old = block(page(d, "sketch"), "sketch");
  const cs = (B.callouts && B.callouts.length ? B.callouts : (old && old.callouts) || []).map((c) => ({ ...c, garment: c.garment || (old && trOf(d, old.part)) || garments[0] }));
  const forGarment = (g) => cs.filter((c) => garments.length < 2 || !c.garment || c.garment === g);
  return (
    <>
      <Band t={t} order={o.ref} doc="BUYER TECHNICAL SKETCH" date={B.prepared && B.prepared.date ? B.prepared.date + (B.prepared.by ? " · " + B.prepared.by : "") : B.date} />
      <div className="p-3 grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4">
        <div>
          <div className="border border-slate-300 p-2 flex flex-wrap justify-center gap-3">
            {(garments.length ? garments : [o.style]).map((g) => (
              <div key={g} className="flex flex-col items-center"><Sketch text={enG(g)} size={garments.length > 1 ? 300 : 420} callouts={forGarment(g).map((c) => ({ no: c.no, x: c.x, y: c.y }))} />{garments.length > 1 && <div className="text-[11px] font-bold">{g}</div>}</div>
            ))}
          </div>
          {cs.length > 0 && <><H2>{t.L("Construction callouts")}</H2><ol className="text-[11.5px] space-y-0.5 columns-2">{cs.map((c) => <li key={c.no} className="flex gap-2 break-inside-avoid"><span className="w-5 h-5 rounded-full border border-slate-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">{c.no}</span><span><b>{(garments.length > 1 && c.garment ? c.garment + " · " : "") + (c.part || "")}</b> — {c.text}</span></li>)}</ol></>}
        </div>
        <div>
          <H2>{t.L("Style information")}</H2>
          <KV items={[["Style ID", B.style_id], ["Description", B.short_desc], ["Department", B.department], ["Season", B.season], ["Size range", B.size_range], ["Retail price", B.retail_price], ["Garments", garments.join(", ")]].map(([k, v]) => [t.L(k), v])} cols={1} />
          {(B.long_desc || []).length > 0 && <><H2>{t.L("Description")}</H2><Bullets items={B.long_desc} /></>}
          {(B.colours || []).length > 0 && <><H2>{t.L("Colours")}</H2><Tbl small cols={[["name", t.L("Colour")], ["code", t.L("Code")]]} rows={B.colours} /></>}
          {(B.thread_spec || []).length > 0 && <><H2>{t.L("Thread")}</H2><Bullets items={B.thread_spec} /></>}
          {(B.label_instructions || []).length > 0 && <><H2>{t.L("Labels")}</H2><Bullets items={B.label_instructions} /></>}
        </div>
      </div>
    </>
  );
};

const Details = ({ d, t }) => {
  const o = d.order || {};
  const P = d.prod_details;
  if (!P) return <Empty t={t} what="Order details not issued yet." />;
  const pr = P.processing || {};
  return (
    <>
      <Band t={t} order={P.order_ref || o.ref} doc="PROD SHEET · ORDER DETAILS" date={P.order_date} />
      <div className="p-3">
        <KV items={[["Order date", P.order_date], ["Ex-factory", P.ex_factory], ["Customer PO", P.customer_po], ["Season", P.season], ["Country of origin", P.coo], ["Qty unit", P.qty_unit]].map(([k, v]) => [t.L(k), v])} cols={3} />
        <div className="text-[12px] mt-1"><span className="text-slate-500">{t.L("Description")} </span><b>{P.description}</b></div>
        <H2>{t.L("Packs")}</H2>
        <Tbl small cols={[["pack_id", t.L("Pack")], ["pack_name", t.L("Name")], ["buyer_po", t.L("Buyer PO")], ["ex_factory", t.L("Ex-factory")], ["qty", t.L("Qty")], ["cartons", t.L("Cartons")]]} rows={P.packs || []} foot={P.packs_total !== undefined ? { pack_id: t.L("TOTAL"), qty: P.packs_total, cartons: (P.packs || []).reduce((a, x) => a + (x.cartons || 0), 0) } : undefined} />
        <H2>{t.L("Processing requirements")}</H2>
        <div className="grid grid-cols-4 gap-2">
          {[["Print", pr.print], ["Embroidery", pr.embroidery], ["Washing", pr.washing], ["Heat transfer", pr.heat_transfer]].map(([name, v]) => (
            <div key={name} className="border border-slate-300 p-2 min-h-[4rem]"><div className="text-[11px] font-black uppercase tracking-wider mb-1">{t.L(name)}</div><div className={`text-[12px] ${!v || NONE.includes(String(v).trim().toLowerCase()) ? "text-slate-400" : "font-bold"}`}>{v || "—"}</div></div>
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
        {block(old, "rich") && <><H2>{t.L("Instructions")}</H2><Rich sections={block(old, "rich").sections} /></>}
        <H2>{t.L("Packing and folding")}</H2>
        {I && (I.packing_folding || []).length ? <Bullets items={I.packing_folding} /> : <Empty t={t} />}
        {I && <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="border-2 border-slate-800 p-3 min-h-[6rem]"><div className="text-[11px] font-black tracking-wider mb-1">{t.L("SHIPPING MARK")}</div><div className="font-mono text-[11px] whitespace-pre-line">{(I.shipping_mark || []).join("\n") || "—"}</div></div>
          <div className="border-2 border-slate-800 p-3 min-h-[6rem]"><div className="text-[11px] font-black tracking-wider mb-1">{t.L("SIDE MARK")}</div><div className="font-mono text-[11px] whitespace-pre-line">{(I.side_mark || []).join("\n") || "—"}</div></div>
        </div>}
        {note && <><H2>{t.L("Tech team notes")} {note.status !== "complete" && <span className="normal-case font-normal text-amber-700">· {t.L(note.status)}</span>}</H2>{blocks(note).filter((b) => b.type === "table").map((b) => <div key={b.title} className="mb-2"><div className="text-[11px] font-bold">{b.title}</div><Tbl small cols={b.columns} rows={b.rows} />{b.note && <div className="text-[10px] text-slate-500">{b.note}</div>}</div>)}{block(note, "list") && <Bullets items={block(note, "list").items} />}</>}
        {special && block(special, "list") && <><H2>{t.L("Special instructions")} {special.status !== "complete" && <span className="normal-case font-normal text-amber-700">· {t.L(special.status)}</span>}</H2><Bullets items={block(special, "list").items} /></>}
      </div>
    </>
  );
};

const Packing = ({ d, t }) => {
  const o = d.order || {};
  const K = d.packing;
  const I = d.production_instruction || {};
  if (!K) return <Empty t={t} what="Packing not issued yet." />;
  const ratio = K.carton_ratio || {};
  const tot = K.totals || {};
  const groups = byGarment(K.carton_table);
  return (
    <>
      <Band t={t} order={o.ref} doc="PACKING" date={d.spec_sheet && d.spec_sheet.prepared && d.spec_sheet.prepared.date} />
      <div className="p-3">
        <KV items={[["Carton", K.carton_pcs ? K.carton_pcs + " " + t.L("pcs") : ""], ["Carton size", K.carton_size], ["Ratio", Object.entries(ratio).map(([k, v]) => k + " " + v).join(" : ")], ["Cartons", tot.cartons !== undefined ? num(tot.cartons) + (tot.bom_cartons !== undefined ? " (BOM " + num(tot.bom_cartons) + ")" : "") : ""], ["Pieces", tot.pieces !== undefined ? num(tot.pieces) : ""], ["Loose pieces", tot.loose_pieces !== undefined ? t.F.loose(num(tot.loose_pieces), num(tot.balance_cartons)) : ""]].map(([k, v]) => [t.L(k), v])} cols={3} />
        {groups.map(([g, rows]) => (
          <div key={g} className="mt-2"><H2>{t.L("Carton table")}{g ? " · " + g : ""}</H2><Tbl small cols={[["colour", t.L("Colour")], ["size", t.L("Size")], ["qty", t.L("Qty")], ["pcs_per_pack", t.L("Pcs / carton")], ["packs", t.L("Cartons")], ["in_packs", t.L("In cartons")], ["loose", t.L("Loose")]]} rows={rows} /></div>
        ))}
        {K.note && <div className="text-[10px] text-slate-500 mt-1">{K.note}</div>}
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="border-2 border-slate-800 p-3 min-h-[6rem]"><div className="text-[11px] font-black tracking-wider mb-1">{t.L("SHIPPING MARK")}</div><div className="font-mono text-[11px] whitespace-pre-line">{(I.shipping_mark || []).join("\n") || "—"}</div></div>
          <div className="border-2 border-slate-800 p-3 min-h-[6rem]"><div className="text-[11px] font-black tracking-wider mb-1">{t.L("SIDE MARK")}</div><div className="font-mono text-[11px] whitespace-pre-line">{(I.side_mark || []).join("\n") || "—"}</div></div>
        </div>
      </div>
    </>
  );
};

const Process = ({ d, t }) => {
  const o = d.order || {};
  const P = d.process_sheet;
  if (!P) return <Empty t={t} what="Process sheet not issued yet." />;
  const hd = P.header || {};
  const pre = P.pre_sewing || [];
  const itemEn = (x) => (x.item_en || x.item || "").toLowerCase();  // the EN item sorts the rows into the four columns
  const cell = (re) => pre.filter((x) => re.test(itemEn(x)));
  const rest = pre.filter((x) => !/relax|spread|cut/.test(itemEn(x)));
  const cols = [["no", "No."], ["operation", "Operation"], ["machine", "Machine"], ["code", "Code"], ["top_thread", "Top thread"], ["bottom_thread", "Bottom thread"], ["spi", "SPI"], ["needle", "Needle"], ["stations", "St"], ["sam", "SAM"], ["key_points", "Key points"]].map(([k, l]) => [k, t.L(l)]);
  return (
    <>
      <Band t={t} order={o.ref} doc="PROCESS SHEET" date={d.spec_sheet && d.spec_sheet.prepared && d.spec_sheet.prepared.date} />
      <div className="p-3">
        <KV items={[["Product", hd.product], ["SMV", hd.smv !== undefined ? hd.smv + " " + t.L("min") : ""], ["Operators", hd.operators], ["Target / 8 h", hd.target_pcs_8h !== undefined ? t.F.target(num(hd.target_pcs_8h), hd.efficiency_pct) : ""], ["Order", o.ref], ["Qty", o.qty ? num(o.qty) + " " + t.L("pcs") : ""]].map(([k, v]) => [t.L(k), v])} cols={3} />
        {(hd.targets || []).length > 1 && <div className="mt-1"><Tbl small cols={[["garment", t.L("Garment")], ["smv", "SMV"], ["operators", t.L("Operators")], ["target_pcs_8h", t.L("Target / 8 h")]]} rows={hd.targets} /></div>}
        <H2>{t.L("Fabric relaxing · spreading · cutting · key requirements")}</H2>
        <table className="w-full border-collapse text-[11px]">
          <thead><tr>{["FABRIC RELAXING", "SPREADING", "CUTTING", "KEY REQUIREMENTS"].map((h) => <th key={h} className="border border-slate-400 bg-slate-100 px-1.5 py-1 text-left font-bold w-1/4">{t.L(h)}</th>)}</tr></thead>
          <tbody><tr className="align-top">{[cell(/relax/), cell(/spread/), cell(/cut/), rest].map((xs, i) => <td key={i} className="border border-slate-300 px-1.5 py-1">{xs.length ? <ul className="list-disc pl-4 space-y-0.5">{xs.map((x) => <li key={x.no}><b>{x.item}</b>{x.department ? " (" + x.department + ")" : ""}: {x.spec}</li>)}</ul> : <span className="text-slate-400">—</span>}</td>)}</tr></tbody>
        </table>
        {P.general_note && <div className="border border-rose-400 bg-rose-50 text-rose-800 text-[11px] font-bold px-2 py-1 mt-3">{P.general_note}</div>}
        {byGarment(P.operations).map(([g, rows]) => (
          <div key={g} className="mt-2"><H2>{t.L("Operations")}{g ? " · " + g : ""}</H2><Tbl small cols={cols} rows={rows.map((r) => ({ ...r, operation: r.operation || r.name }))} foot={{ operation: t.L("Total SAM"), sam: Number(rows.reduce((a, r) => a + (Number(r.sam) || 0), 0).toFixed(2)) }} /></div>
        ))}
      </div>
    </>
  );
};

const Thread = ({ d, t }) => {
  const o = d.order || {};
  const R = d.thread_consumption;
  if (!R) return <Empty t={t} what="Thread consumption not issued yet." />;
  const totals = R.totals || {};
  const cal = R.calibration || {};
  return (
    <>
      <Band t={t} order={o.ref} doc="THREAD CONSUMPTION REPORT" date={d.spec_sheet && d.spec_sheet.prepared && d.spec_sheet.prepared.date} />
      <div className="p-3">
        <KV items={[[t.L("Style"), o.style], [t.L("Order"), o.ref], [t.L("Qty"), o.qty ? num(o.qty) + " " + t.L("pcs") : ""], ...Object.keys(totals).map((g) => [t.L("Total") + " · " + trOf(d, g), num(totals[g]) + " " + t.L("m / pc") + (cal[g] ? " · " + t.L("calibration ×") + " " + cal[g] : "")])]} cols={3} />
        <H2>{t.L("Thread consumption")}</H2>
        <Tbl small cols={[["garment", t.L("Garment")], ["material", t.L("Material")], ["spec", t.L("Spec")], ["position", t.L("Position")], ["usage_m_per_pcs", t.L("m / pc")]]} rows={R.rows || []} />
        {byGarment(R.yield_rows).map(([g, rows]) => (
          <div key={g} className="mt-2"><H2>{t.L("Yield")}{g ? " · " + g : ""}</H2><Tbl small cols={[["process", t.L("Process")], ["machine", t.L("Machine")], ["length_cm", t.L("Seam cm")], ["multiple", t.L("Stitch ×")], ["freq", t.L("Freq")], ["seam_allow_cm", t.L("Allow cm")], ["calc_m", t.L("Calc m")], ["yield_m", t.L("Yield m")]]} rows={rows} foot={{ process: t.L("Total"), yield_m: Number(rows.reduce((a, r) => a + (Number(r.yield_m) || 0), 0).toFixed(1)) }} /></div>
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
      // the content in the chosen language: the server translates it (lang "cn" | "kh"); EN sends no lang (unchanged response)
      const r = await fetch(`${API}/sim/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ module: "ypi", view: "techpack", pick: pick || undefined, lang: lang !== "en" ? lang : undefined }) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "unavailable");
      setData(j);
    } catch (e) {
      setError("Tech-pack data is unavailable right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, [pick, lang]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (pick) setSearch({ order: pick }, { replace: true }); }, [pick, setSearch]);

  const d = data || {};
  const o = d.order || {};
  const t = { ...(T[lang] || T.en), L: tr(lang), F: FMT[lang] || FMT.en };
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
    <div className="yai-pa-aware min-h-screen bg-slate-900 text-slate-200 px-3 pb-6 pt-28 font-sans" lang={lang === "cn" ? "zh-Hans" : lang === "kh" ? "km" : "en"} style={lang !== "en" ? FONT_I18N : undefined}>
      <style>{`body.yai-pa-open .yai-pa-aware { padding-right: 436px; } ${PRINT_CSS}`}</style>
      {/* YPI tabs */}
      <div className="tp-noprint flex flex-wrap items-center gap-1.5 mb-2">
        {YPI_TABS.map(([v, label, Icon]) => (
          <button key={v} onClick={() => navigate(`/dashboard/ypi/${v}`)} className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${v === "techpack" ? "bg-emerald-500/20 border-emerald-500/40 text-white" : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"}`}><Icon size={13} />{label}</button>
        ))}
        <h1 className="text-lg font-black text-white leading-none ml-2">{t.L("Tech-pack")}</h1>
        {o.ref && <span className="text-xs text-slate-400">{o.ref} · {o.style} · {num(o.qty)} {t.L("pcs")} · {o.state}{d.progress ? ` · ${d.progress.complete}/${d.progress.of} ${t.L("pages complete")}` : ""}</span>}
        <div className="ml-auto flex items-center gap-1.5">
          <div className="inline-flex rounded-md border border-slate-700 overflow-hidden text-[11px]">{LANGS.map(([k, l]) => <button key={k} onClick={() => setLang(k)} className={`px-2 py-1 font-bold ${lang === k ? "bg-slate-200 text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{l}</button>)}</div>
          <button onClick={() => window.print()} disabled={loading} className="inline-flex items-center gap-1 rounded-md bg-white text-slate-900 text-xs font-bold px-2.5 py-1.5 disabled:opacity-50"><Printer size={13} />{t.L("Print pack")}</button>
          <button onClick={load} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700" aria-label="Refresh"><RefreshCw size={14} className={loading ? "animate-spin" : ""} /></button>
        </div>
      </div>
      {error && <div className="tp-noprint mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{t.L(error)}</div>}

      <div className="flex gap-3 items-start">
        {/* orders */}
        <aside className="tp-noprint w-52 flex-shrink-0 rounded-xl border border-slate-700 bg-slate-800/60 p-1.5 sticky top-28 max-h-[calc(100vh-8rem)] overflow-auto">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 mb-1.5"><Search size={12} className="text-slate-500" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.L("Order…")} className="bg-transparent outline-none text-xs w-full text-white placeholder-slate-500" /></div>
          {options.map((x) => (
            <button key={x.id} onClick={() => { setPick(x.id); setSec("spec"); }} className={`w-full text-left rounded-lg px-2 py-1 mb-0.5 border ${selected === x.id ? "bg-emerald-500/20 border-emerald-500/40" : "border-transparent hover:bg-slate-700/60"}`}>
              <div className="flex items-center gap-1.5"><span className={`inline-block w-2 h-2 rounded-full ${x.tone === "green" ? "bg-emerald-400" : x.tone === "amber" ? "bg-amber-400" : "bg-slate-500"}`} /><span className="text-xs font-bold text-white">{x.name}</span><span className="ml-auto text-[10px] text-slate-500 tabular-nums">{x.count}/{x.of}</span></div>
              <div className="text-[10px] text-slate-400 truncate">{x.sub}</div>
            </button>
          ))}
          {options.length === 0 && <div className="px-2 py-4 text-xs text-slate-500">{loading ? t.L("Loading…") : t.L("No orders.")}</div>}
        </aside>

        <main className="flex-1 min-w-0">
          {/* section tabs */}
          <div className="tp-noprint flex flex-wrap gap-1 mb-2">
            {SECTIONS.map((s, i) => {
              const st = statusOf(s.key);
              return (
                <button key={s.key} onClick={() => setSec(s.key)} className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-bold ${sec === s.key ? "bg-white text-slate-900 border-white" : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>
                  <span className="tabular-nums opacity-60">{i + 1}</span>{s[lang] || s.en}
                  {st && <span className={`inline-block w-1.5 h-1.5 rounded-full ${st === "complete" ? "bg-emerald-400" : st === "draft" ? "bg-amber-400" : "bg-slate-500"}`} title={t.L(st)} />}
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
                    {st && <span className={`rounded-full border px-1.5 ${STATUS[st] || ""}`}>{t.L(st)}</span>}
                    <span className="ml-auto">{t.page} {i + 1} / {SECTIONS.length} · {o.ref || ""} · {t.L("simulated factory — invented names")}</span>
                  </div>
                  <div className="px-3 pb-3 pt-1">
                    <div className="border border-slate-400">{data ? <R d={d} t={t} /> : <div className="p-6 text-center text-slate-400 text-sm">{loading ? t.L("Loading…") : t.L("No data.")}</div>}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="tp-noprint flex items-center gap-2 mt-1 text-[11px] text-slate-400">
            <button disabled={ix <= 0} onClick={() => setSec(SECTIONS[ix - 1].key)} className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 disabled:opacity-40"><ChevronLeft size={12} />{t.L("prev")}</button>
            <button disabled={ix >= SECTIONS.length - 1} onClick={() => setSec(SECTIONS[ix + 1].key)} className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 disabled:opacity-40">{t.L("next")}<ChevronRight size={12} /></button>
            <span className="ml-auto">{t.F.printAll(SECTIONS.length)}</span>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TechPack;
