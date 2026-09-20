/* Yai — investor / parent-company pitch deck.
 *
 * v2 changes from the first cut:
 *   - Title + closing slides now use the actual round Yai logo from
 *     public/images/yai-logo.jpg instead of the drawn orange square.
 *   - Date on the cover updated to today (2026-08-31).
 *   - Executive-summary stat tiles: numbers are BIG, centred, filling the
 *     tile height so the values read across the room. */

const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const LOGO_PATH = path.join(__dirname, "..", "public", "images", "yai-logo.jpg");
const LOGO_DATA = "data:image/jpeg;base64," + fs.readFileSync(LOGO_PATH).toString("base64");
const TODAY = "31 August 2026";

// Product-category photos on the title slide — what Cambodia's factories
// actually make. Downloaded to scratchpad, embedded as data URIs so the
// pptx is self-contained.
const IMG_DIR = path.join(__dirname, "images");
const PRODUCTS = [
  { file: "garments.jpg",   label: "服装" },
  { file: "bags.jpg",       label: "箱包" },
  { file: "footwear.jpg",   label: "鞋类" },
  { file: "toys.jpg",       label: "玩具" },
  { file: "furniture.jpg",  label: "家具" },
  { file: "carseats.jpg",   label: "汽车座椅" },
  { file: "homeware.jpg",   label: "家居用品" },
].map((p) => ({
  ...p,
  data: "data:image/jpeg;base64," + fs.readFileSync(path.join(IMG_DIR, p.file)).toString("base64"),
}));

// Country flags for the title slide — Yai's home region.
const FLAG_DATA = ["hk-flag.png", "kh-flag.png", "sg-flag.png"].map((f) => ({
  file: f,
  data: "data:image/png;base64," + fs.readFileSync(path.join(IMG_DIR, f)).toString("base64"),
}));

// ASEAN mark for the title slide's MADE IN CAMBODIA · ASEAN eyebrow.
const ASEAN_DATA = "data:image/png;base64," + fs.readFileSync(
  path.join(__dirname, "..", "public", "images", "asean-logo-with-flags.png")
).toString("base64");

const NAVY = "0A1F47";
const BLUE = "1E4DAA";
const ORANGE = "F37021";
const GREEN = "10B981";
const DARKGREEN = "0A3327";
const INK = "1E293B";
const GRAY = "64748B";
const LINE = "E2E8F0";
const CARD = "F8FAFC";
const W = 13.33, H = 7.5;
const F = "Arial";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";

/* ---------- helpers ---------- */
function titleBlock(s, kicker, title, dark = false) {
  s.addText(kicker.toUpperCase(), {
    x: 0.6, y: 0.3, w: 12.1, h: 0.5, fontFace: F, fontSize: 20, bold: true,
    color: dark ? "FFD58A" : ORANGE, charSpacing: 3, margin: 0,
  });
  s.addText(title, {
    x: 0.6, y: 0.82, w: 12.1, h: 0.75, fontFace: F, fontSize: 30, bold: true,
    color: dark ? "FFFFFF" : NAVY, margin: 0,
  });
}
function card(s, x, y, w, h, opts = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: opts.fill || "FFFFFF" },
    line: { color: opts.line || LINE, width: opts.lineW || 1 },
  });
}
function numCircle(s, x, y, n, color) {
  s.addShape(pres.shapes.OVAL, { x, y, w: 0.42, h: 0.42, fill: { color }, line: { type: "none" } });
  s.addText(String(n), {
    x, y: y - 0.008, w: 0.42, h: 0.42, align: "center", valign: "middle",
    fontFace: F, fontSize: 13, bold: true, color: "FFFFFF", margin: 0,
  });
}
/** Big-number stat tile — number filling the tile, optional unit stacked
 *  directly under the number (same colour, smaller), small caption at the
 *  bottom. Pass "36|mo" or "40|yrs" to split number and unit; a plain string
 *  renders as a single big value. */
function statTile(s, x, y, w, h, valueSpec, label, color) {
  card(s, x, y, w, h);
  const labelH = 0.55;
  const bodyH = h - labelH - 0.15;
  const [num, unit] = String(valueSpec).split("|");
  if (unit) {
    // Two-line stack: number (huge) + unit (medium) — both same colour.
    const numH = bodyH * 0.68;
    const unitH = bodyH * 0.28;
    s.addText(num, {
      x: x + 0.15, y: y + 0.1, w: w - 0.3, h: numH,
      fontFace: F, fontSize: 92, bold: true, color,
      align: "center", valign: "bottom", margin: 0, fit: "shrink",
    });
    s.addText(unit.toUpperCase(), {
      x: x + 0.15, y: y + 0.1 + numH + 0.02, w: w - 0.3, h: unitH,
      fontFace: F, fontSize: 30, bold: true, color,
      align: "center", valign: "top", charSpacing: 2, margin: 0, fit: "shrink",
    });
  } else {
    s.addText(valueSpec, {
      x: x + 0.15, y: y + 0.1, w: w - 0.3, h: bodyH,
      fontFace: F, fontSize: 92, bold: true, color,
      align: "center", valign: "middle", margin: 0, fit: "shrink",
    });
  }
  s.addText(label.toUpperCase(), {
    x: x + 0.15, y: y + h - labelH, w: w - 0.3, h: labelH - 0.1,
    fontFace: F, fontSize: 10, bold: true, color: GRAY,
    align: "center", valign: "top", charSpacing: 1.5, margin: 0,
  });
}
function footer(s, page) {
  s.addText(`Yai · 战略 DTV · 机密 · ${page}`, {
    x: 0.6, y: H - 0.42, w: 11.4, h: 0.3, fontFace: F, fontSize: 8.5, color: "94A3B8", margin: 0,
  });
  s.addText("PD3", {
    x: W - 0.7, y: H - 0.42, w: 0.6, h: 0.3, fontFace: F, fontSize: 10, bold: true,
    color: ORANGE, align: "right", valign: "middle", margin: 0,
  });
}
function cornerPD2(s, dark = false) {
  // For slides that don't use footer() (title + closing).
  s.addText("PD3", {
    x: W - 0.7, y: H - 0.42, w: 0.6, h: 0.3, fontFace: F, fontSize: 10, bold: true,
    color: dark ? "FFD58A" : ORANGE, align: "right", valign: "middle", margin: 0,
  });
}
function addRoundLogo(s, x, y, size) {
  // Round logo — pptxgenjs `rounding: true` masks the image into a circle.
  s.addImage({
    data: LOGO_DATA,
    x, y, w: size, h: size,
    rounding: true,
  });
}

/* ---------- 1 · TITLE ---------- */
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  /* Title slide — everything on the SAME row (top-aligned):
   *   LEFT  · round Yai logo
   *   MIDDLE · Ai-Native / Intelligence Platform. title (2 lines)
   *   RIGHT · flag group (HK · KH · SG + ASEAN logo + eyebrow text)
   *
   *   All three sit vertically centred against the same hero band, so
   *   the logo, title, and flag row read as one horizontal composition.
   */
  const heroTop = 0.8;
  const heroH = 2.0;
  const heroMid = heroTop + heroH / 2;   // 1.8

  // LEFT — round Yai logo, vertically centred on the hero
  const logoSize = 1.9;
  const logoX = 1.0;
  addRoundLogo(s, logoX, heroMid - logoSize / 2, logoSize);

  // MIDDLE — title, vertically centred against the logo
  const tx = logoX + logoSize + 0.5;   // 3.4
  const tw = 6.1;                       // narrower so the flag row can sit beside it
  s.addText("Ai-Native Manufacturing\nIntelligence Platform.", {
    x: tx, y: heroTop, w: tw, h: heroH,
    fontFace: F, fontSize: 38, bold: true, color: "FFFFFF",
    valign: "middle", margin: 0,
  });

  // RIGHT — compact flag block BESIDE the title (stacked 2 rows so it
  // fits without overlapping the title text):
  //   Row 1: 3 flags + ASEAN logo
  //   Row 2: MADE IN CAMBODIA · ASEAN eyebrow
  const gx = tx + tw + 0.35;            // starts right after title
  const gRowGap = 0.12;
  const flagH = 0.45;
  const flagW = flagH * 1.5;
  const flagGap = 0.12;
  // ASEAN mark is 1:1 (1024×1024) — keep the aspect ratio square.
  const aseanW = 0.58;
  const aseanH = 0.58;
  const flagsW = FLAG_DATA.length * flagW + (FLAG_DATA.length - 1) * flagGap;
  const eyebrowH = 0.32;
  const groupH = Math.max(flagH, aseanH) + gRowGap + eyebrowH;
  const groupTop = heroMid - groupH / 2;
  const row1Top = groupTop;
  const row1MidY = row1Top + Math.max(flagH, aseanH) / 2;
  FLAG_DATA.forEach((f, i) => {
    s.addImage({
      data: f.data,
      x: gx + i * (flagW + flagGap),
      y: row1MidY - flagH / 2, w: flagW, h: flagH,
    });
  });
  const aseanX = gx + flagsW + 0.22;
  s.addImage({
    data: ASEAN_DATA,
    x: aseanX, y: row1MidY - aseanH / 2, w: aseanW, h: aseanH,
  });
  // Row 2 — split captions: "柬埔寨制造" under the flags,
  // "东盟" under the ASEAN logo.
  const row2Y = groupTop + Math.max(flagH, aseanH) + gRowGap;
  s.addText("柬埔寨制造", {
    x: gx, y: row2Y, w: flagsW, h: eyebrowH,
    fontFace: F, fontSize: 10.5, bold: true, color: "FFD58A",
    charSpacing: 2, align: "center", valign: "middle", margin: 0, wrap: false,
  });
  s.addText("东盟", {
    x: aseanX - 0.15, y: row2Y, w: aseanW + 0.3, h: eyebrowH,
    fontFace: F, fontSize: 10.5, bold: true, color: "FFD58A",
    charSpacing: 2, align: "center", valign: "middle", margin: 0, wrap: false,
  });

  // Product-photo strip removed — the branded/broken stock photos were
  // causing repeated iterations. Text-only category list instead.
  s.addText("服务柬埔寨制造业与全球市场", {
    x: 0.9, y: 2.95, w: 11.5, h: 0.4, fontFace: F, fontSize: 17, bold: true,
    color: "FFD58A", charSpacing: 3, margin: 0, align: "center",
  });
  // Icon-above-word row — use the available bottom band properly.
  const CATS = [
    { file: "icon-garments.png",  label: "服装" },
    { file: "icon-bags.png",      label: "箱包" },
    { file: "icon-footwear.png",  label: "鞋类" },
    { file: "icon-toys.png",      label: "玩具" },
    { file: "icon-furniture.png", label: "家具" },
    { file: "icon-carseats.png",  label: "汽车座椅" },
    { file: "icon-homeware.png",  label: "家居用品" },
  ];
  const catsY = 3.45;
  const iconSize = 1.2;
  const catW = 1.75;
  const totalW = CATS.length * catW;
  const startX = (W - totalW) / 2;
  CATS.forEach((c, i) => {
    const cx = startX + i * catW;
    const iconData = "data:image/png;base64," + fs.readFileSync(
      path.join(IMG_DIR, c.file),
    ).toString("base64");
    s.addImage({
      data: iconData,
      x: cx + (catW - iconSize) / 2, y: catsY, w: iconSize, h: iconSize,
    });
    s.addText(c.label, {
      x: cx, y: catsY + iconSize + 0.1, w: catW, h: 0.42,
      fontFace: F, fontSize: 18, bold: true, color: "FFFFFF",
      align: "center", valign: "middle", margin: 0,
    });
  });

  // www.yaikh.com as a big band under the product row, spanning left→right.
  s.addText("www.yaikh.com", {
    x: 0.6, y: catsY + iconSize + 0.75, w: W - 1.2, h: 1.15,
    fontFace: F, fontSize: 72, bold: true, color: "FFD58A",
    charSpacing: 8, align: "center", valign: "middle", margin: 0, fit: "shrink",
  });

  s.addText(`Texlink Technologies Co., Ltd.   ·   ${TODAY}   ·   Confidential   ·   www.yaikh.com`, {
    x: 0.9, y: 7.05, w: 11.5, h: 0.3, fontFace: F, fontSize: 10, color: "8FA8D8", margin: 0,
  });
  cornerPD2(s, true);
}

/* ---------- 2 · EXECUTIVE SUMMARY ---------- */
{
  const s = pres.addSlide();
  titleBlock(s, "01 / 执行摘要", "工厂实测五年，如今开门迎客。");
  s.addText([
    { text: "Yai 即 AI 制造智能平台 —— 代理式制造智能。", options: { bold: true, color: NAVY } },
    { text: "三层平台，将纸质作业的生产单位升级为决策级 AI，替代如今工厂普遍存在的混乱 —— 纸质报表、账簿、零散聊天工具、手写签字、员工跨楼层追签。", options: { color: INK } },
  ], { x: 0.6, y: 1.6, w: 12.1, h: 1.1, fontFace: F, fontSize: 15, margin: 0 });
  const tw = 2.92, gap = 0.14, ty = 3.0, th = 2.5;
  statTile(s, 0.6, ty, tw, th, "10", "AI 智能体待命", GREEN);
  statTile(s, 0.6 + (tw + gap), ty, tw, th, "20", "柬埔寨工程师", BLUE);
  statTile(s, 0.6 + 2 * (tw + gap), ty, tw, th, "36|mo", "研发历时", ORANGE);
  statTile(s, 0.6 + 3 * (tw + gap), ty, tw, th, "40|yrs", "行业经验 —— 技术＋管理", NAVY);
  s.addText("五年真实生产线内验证 —— 在任何一次销售洽谈之前，已在工厂车间落地。", {
    x: 0.6, y: 5.85, w: 12.1, h: 0.5, fontFace: F, fontSize: 14, italic: true, color: GRAY, margin: 0,
  });
  footer(s, "2 / 12");
}

/* ---------- 3 · THE PROBLEM ---------- */
{
  const s = pres.addSlide();
  titleBlock(s, "02 / 问题所在", "内部、品牌、政府 —— 三面挤压。");

  // Three pressure cards, top row
  const pressures = [
    { tag: "1 · INTERNAL WORKFLOW", head: "The team is demanding better", color: BLUE, fill: "EFF6FF", border: "BFDBFE",
      quote: "“We can't keep chasing signatures floor-to-floor and living in ledger books. Give us one system.”" },
    { tag: "2 · BRANDS · THE CUSTOMERS", head: "Ai everywhere, or lose the order", color: DARKGREEN, fill: "ECFDF5", border: "A7F3D0",
      quote: "“Go agentic now — no more Excel, no more emails. The factories that integrate win the orders.”" },
    { tag: "3 · GOVERNMENT + AUDITS", head: "Better compliance, on time", color: NAVY, fill: "F1F5F9", border: "CBD5E1",
      quote: "“Worker data, EMR reports, tax filings — submitted digitally, on time. Late or missing means penalties.”" },
  ];
  const cw = 4.05, gap = 0.14;
  pressures.forEach((p, i) => {
    const x = 0.6 + i * (cw + gap);
    card(s, x, 1.65, cw, 2.55, { fill: p.fill, line: p.border });
    s.addText(p.tag, { x: x + 0.22, y: 1.82, w: cw - 0.44, h: 0.32, fontFace: F, fontSize: 11, bold: true, color: p.color, charSpacing: 2, margin: 0 });
    s.addText(p.head, { x: x + 0.22, y: 2.18, w: cw - 0.44, h: 0.45, fontFace: F, fontSize: 16, bold: true, color: NAVY, margin: 0 });
    s.addText(p.quote, { x: x + 0.22, y: 2.7, w: cw - 0.44, h: 1.4, fontFace: F, fontSize: 15, italic: true, color: INK, margin: 0 });
    // Downward arrow pointing to the Owner card
    s.addText("↓", { x: x + cw / 2 - 0.2, y: 4.25, w: 0.4, h: 0.35, fontFace: F, fontSize: 22, bold: true, color: ORANGE, align: "center", margin: 0 });
  });

  // Owner card spanning full width — clearly the point being squeezed
  card(s, 0.6, 4.3, 12.1, 1.55, { fill: "FFF7ED", line: ORANGE, lineW: 2 });
  s.addText("THE OWNER · SANDWICHED BETWEEN ALL THREE", { x: 0.85, y: 4.48, w: 11.6, h: 0.32, fontFace: F, fontSize: 12, bold: true, color: ORANGE, charSpacing: 2, margin: 0 });
  s.addText("Stuck in the middle on paper — expected to satisfy internal teams, brand buyers, and government auditors, all with ledger books and chat apps.", {
    x: 0.85, y: 4.82, w: 11.6, h: 0.95, fontFace: F, fontSize: 14, bold: true, color: INK, margin: 0,
  });

  // Life on paper today — footer strip
  s.addText("LIFE ON PAPER TODAY:", { x: 0.6, y: 6.05, w: 3.2, h: 0.3, fontFace: F, fontSize: 10, bold: true, color: GRAY, charSpacing: 1.5, margin: 0 });
  s.addText("Paper reports & ledger books  ·  Scattered chat apps for approvals  ·  Manual signatures every step  ·  Staff chasing floor-to-floor  ·  No single source of truth", {
    x: 0.6, y: 6.35, w: 12.1, h: 0.45, fontFace: F, fontSize: 11.5, color: INK, margin: 0,
  });
  footer(s, "3 / 12");
}

/* ---------- 4 · THE SOLUTION ---------- */
{
  const s = pres.addSlide();
  titleBlock(s, "03 / 解决方案", "守护就业的AI平台。");
  const rows = [
    { n: "1", c: ORANGE, t: "Digitalization — centralised data", d: "Excel dashboards and digital records flow into one database. Mobile apps, tablets, AIoT & scanners on the floor." },
    { n: "2", c: BLUE, t: "Ai Agentic — agents do the chasing, following & forecasting", d: "10 Ai agents handle approvals, reports, compliance filings, chase-ups, and forward-looking forecasts across every module." },
    { n: "3", c: DARKGREEN, t: "Full Ai — executive intelligence", d: "The Big Ai Brain: owner-level answers across 5 factories in 1 chat, in Khmer, Chinese or English." },
  ];
  rows.forEach((r, i) => {
    const y = 1.75 + i * 1.55;
    card(s, 0.6, y, 7.5, 1.4);
    numCircle(s, 0.85, y + 0.45, r.n, r.c);
    s.addText(r.t, { x: 1.5, y: y + 0.14, w: 6.4, h: 0.45, fontFace: F, fontSize: 16, bold: true, color: NAVY, margin: 0 });
    s.addText(r.d, { x: 1.5, y: y + 0.6, w: 6.4, h: 0.78, fontFace: F, fontSize: 14, color: INK, margin: 0 });
  });
  // Match the height of the 3 stacked rows on the left (y=1.75 to ~6.30)
  card(s, 8.4, 1.75, 4.3, 4.55, { fill: "ECFDF5", line: "A7F3D0" });
  s.addText("WHY “SAVES JOBS”", {
    x: 8.65, y: 1.95, w: 3.8, h: 0.4, fontFace: F, fontSize: 13,
    bold: true, color: DARKGREEN, charSpacing: 2, margin: 0,
  });
  s.addText("Adopt one layer at a time — each builds on the one below, nothing gets ripped out. The same team steps up from paper to Digitalization to Agentic to Full Ai. The owner satisfies the brand and the ministry without replacing their people.", {
    x: 8.65, y: 2.5, w: 3.8, h: 3.65, fontFace: F, fontSize: 19,
    color: INK, valign: "middle", margin: 0, paraSpaceAfter: 4,
  });
  s.addText("Mindset-shift sales: convincing factory mid + top management to climb the ladder.", {
    x: 0.6, y: 6.35, w: 12.1, h: 0.4, fontFace: F, fontSize: 12, italic: true, color: GRAY, margin: 0,
  });
  footer(s, "4 / 12");
}

/* ---------- 5 · ARCHITECTURE ---------- */
/* Content pulled from components/plan/StageLadder.tsx (LAYERS array). */
{
  const s = pres.addSlide();
  titleBlock(s, "04 / 产品架构", "从纸质到全AI —— Yai 三层架构。");
  const cols = [
    {
      tag: "当今", name: "传统工厂作业",
      sub: "孤立且手工 —— Yai 所要替代的",
      blurb: "这是当今多数制衣工厂的现状。Yai 不提供此层，而是取而代之。",
      items: [
        { icon: "arch-paper.png",   label: "纸质报表" },
        { icon: "arch-books.png",   label: "账簿" },
        { icon: "arch-chat.png",    label: "零散聊天" },
        { icon: "arch-signing.png", label: "手写签字" },
      ],
      fill: "F1F5F9", line: "CBD5E1", tagBg: "CBD5E1", tagFg: "334155",
    },
    {
      tag: "第1层", name: "数字化",
      sub: "数据集中",
      blurb: "Excel 报表与数字化记录汇入统一数据库，成为上层一切的基石。",
      items: [
        { icon: "arch-database.png", label: "统一数据库" },
        { icon: "arch-records.png",  label: "数字化记录" },
        { icon: "arch-mobile.png",   label: "移动应用" },
        { icon: "arch-scanner.png",  label: "AIoT 与扫码" },
      ],
      fill: "FFF1E0", line: "FDBA74", tagBg: ORANGE, tagFg: "FFFFFF",
    },
    {
      tag: "第2层", name: "代理式",
      sub: "由大语言模型驱动的智能体",
      blurb: "AI 智能体优化流程，语音、文字、报表与数字孪生可视化，随设备即用。",
      items: [
        { icon: "arch-voice.png",     label: "语音转流程" },
        { icon: "arch-brain.png",     label: "大模型智能体" },
        { icon: "arch-dashboard.png", label: "报表与 DTV" },
        { icon: "arch-bot.png",       label: "实时指引" },
      ],
      fill: "EFF6FF", line: "93C5FD", tagBg: BLUE, tagFg: "FFFFFF",
    },
    {
      tag: "第3层", name: "全 AI",
      sub: "战略管理与增长",
      blurb: "决策层 —— 高层决策、多厂管控、拓展新国家。企业以太阳能微型数据中心运行自有 AI 算力。",
      items: [
        { icon: "arch-globe.png",     label: "多国家" },
        { icon: "arch-dashboard.png", label: "预测增长" },
        { icon: "arch-crown.png",     label: "高层决策" },
        { icon: "arch-computer.png",  label: "自有 AI 算力" },
      ],
      fill: "ECFDF5", line: "6EE7B7", tagBg: DARKGREEN, tagFg: "FBBF24",
    },
  ];
  const cw = 3.0, gap = 0.12;
  cols.forEach((c, i) => {
    const x = 0.6 + i * (cw + gap);
    card(s, x, 1.75, cw, 5.0, { fill: c.fill, line: c.line });
    // Filled tag chip (matches yaikh.com's badge look)
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.2, y: 1.9, w: 1.15, h: 0.34, rectRadius: 0.06,
      fill: { color: c.tagBg }, line: { type: "none" },
    });
    s.addText(c.tag, {
      x: x + 0.2, y: 1.9, w: 1.15, h: 0.34, fontFace: F, fontSize: 11,
      bold: true, color: c.tagFg, charSpacing: 2,
      align: "center", valign: "middle", margin: 0,
    });
    // Layer name
    s.addText(c.name, {
      x: x + 0.2, y: 2.32, w: cw - 0.4, h: 0.55, fontFace: F, fontSize: 20,
      bold: true, color: NAVY, margin: 0,
    });
    // Subtitle (italic)
    s.addText(c.sub, {
      x: x + 0.2, y: 2.92, w: cw - 0.4, h: 0.55, fontFace: F, fontSize: 13,
      italic: true, color: GRAY, margin: 0,
    });
    // Body blurb (the actual /plan text)
    s.addText(c.blurb, {
      x: x + 0.2, y: 3.5, w: cw - 0.4, h: 1.75, fontFace: F, fontSize: 13,
      color: INK, margin: 0,
    });
    // Icon + label grid — 2 columns × 2 rows to match the on-page look
    const iconSize = 0.48;
    const cellW = (cw - 0.4) / 2;
    const cellH = 0.72;
    c.items.forEach((it, j) => {
      const col = j % 2, row = Math.floor(j / 2);
      const ix = x + 0.2 + col * cellW;
      const iy = 5.35 + row * cellH;
      const iconData = "data:image/png;base64," + fs.readFileSync(
        path.join(IMG_DIR, it.icon),
      ).toString("base64");
      s.addImage({
        data: iconData,
        x: ix, y: iy, w: iconSize, h: iconSize,
      });
      s.addText(it.label, {
        x: ix + iconSize + 0.08, y: iy, w: cellW - iconSize - 0.1, h: iconSize,
        fontFace: F, fontSize: 11, color: INK,
        valign: "middle", margin: 0,
      });
    });
  });
  s.addText("逐层落地 —— 每层承接下层，无需推倒重来。", {
    x: 0.6, y: 6.9, w: 12.1, h: 0.35, fontFace: F, fontSize: 12.5, bold: true, color: BLUE, margin: 0, align: "center",
  });
  footer(s, "5 / 12");
}

/* ---------- 5b · OUR AGENTS (mirrors yaikh.com/experience layout) ---------- */
{
  const s = pres.addSlide();
  s.background = { color: "0B1121" };  // deep navy matches the app

  // Header row — Yai logo + "Yai 智能体" title, right-side kicker
  addRoundLogo(s, 0.35, 0.15, 0.8);
  s.addText("Yai 智能体", {
    x: 1.25, y: 0.2, w: 3.5, h: 0.7,
    fontFace: F, fontSize: 26, bold: true, color: "FFFFFF",
    valign: "middle", margin: 0,
  });
  s.addText("05 / 我们的智能体", {
    x: W - 3.3, y: 0.35, w: 3.1, h: 0.4,
    fontFace: F, fontSize: 12, bold: true, color: ORANGE,
    charSpacing: 3, align: "right", valign: "middle", margin: 0,
  });

  /* Three coloured category bands + per-subcolumn tile stacks that mirror
   * yaikh.com/experience exactly — no icons, plain white rounded tiles. */
  const bandY = 1.15, bandH = 0.35;
  const subY  = 1.6,  subH  = 0.3;
  const gridTop = 2.0;
  const gridBottom = 6.9;
  const rowGap = 0.06, colGap = 0.06;

  // ─── Per-column definitions — uniform sub-header width across all cats ─
  //  14 total sub-headers (7 admin + 2 mgmt + 5 ops); divide the slide's
  //  usable width so every sub-column has the same pill width, exactly like
  //  yaikh.com/experience.
  const subUnit = 0.86;                 // uniform width per sub-column
  const catGap  = 0.18;                 // gap between category groups
  const admX = 0.28;
  const admW = 7 * subUnit + 6 * colGap;
  const mgmX = admX + admW + catGap;
  const mgmW = 2 * subUnit + 1 * colGap;
  const opsX = mgmX + mgmW + catGap;
  const opsW = 5 * subUnit + 4 * colGap;
  // Exact mapping from yaikh-dashboard/src/data/module.js — SOURCE OF TRUTH.
  const cats = [
    {
      title: "管理", bandColor: BLUE, subBg: "1E3A8A",
      x: admX, w: admW,
      subs: [
        { name: "会计", tiles: ["会计", "IEWS"] },
        { name: "结算",    tiles: ["采购申请", "报销申请", "工资单", "运费单"] },
        { name: "人事",         tiles: ["YHR", "组织架构", "培训", "临时工", "反馈渠道"] },
        { name: "行政",      tiles: ["支持工单", "Y Shop", "出入证", "会议室", "用车预约", "消防警报", "监控"] },
        { name: "客户服务",        tiles: ["数字审计", "能耗", "空气", "用水", "废物", "化学品"] },
        { name: "物流",   tiles: ["物流"] },
        { name: "电子政务",      tiles: ["电子政务"] },
      ],
    },
    {
      title: "管理 AI", bandColor: DARKGREEN, subBg: "0F3C2A",
      x: mgmX, w: mgmW,
      subs: [
        { name: "看板",      tiles: ["管理看板", "SOP"] },
        { name: "数据科学", tiles: ["系统分析"] },
      ],
    },
    {
      title: "运营", bandColor: GREEN, subBg: "064E3B",
      x: opsX, w: opsW,
      subs: [
        { name: "质检",         tiles: ["YQMS", "呼叫"] },
        { name: "生产", tiles: ["FC", "YWIP", "CE", "YTM", "YTM Shop"] },
        { name: "4DP",        tiles: ["4DP"] },
        { name: "YPI",        tiles: ["YPI"] },
        { name: "MRP",        tiles: ["MRP"] },
      ],
    },
  ];

  const tileH = 0.55;
  cats.forEach((cat) => {
    // Coloured category band
    s.addShape(pres.shapes.RECTANGLE, {
      x: cat.x, y: bandY, w: cat.w, h: bandH,
      fill: { color: cat.bandColor }, line: { type: "none" },
    });
    s.addText(cat.title, {
      x: cat.x, y: bandY, w: cat.w, h: bandH,
      fontFace: F, fontSize: 13, bold: true, color: "FFFFFF",
      charSpacing: 2, align: "center", valign: "middle", margin: 0, fit: "shrink",
    });

    // Sub-header pills + per-subheader vertical tile stack
    const nSubs = cat.subs.length;
    const subW = (cat.w - colGap * (nSubs - 1)) / nSubs;
    cat.subs.forEach((sub, i) => {
      const sx = cat.x + i * (subW + colGap);
      // sub-header pill
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: sx, y: subY, w: subW, h: subH, rectRadius: 0.05,
        fill: { color: cat.subBg }, line: { type: "none" },
      });
      s.addText(sub.name, {
        x: sx, y: subY, w: subW, h: subH,
        fontFace: F, fontSize: 9, bold: true, color: "FFFFFF",
        charSpacing: 0.5, align: "center", valign: "middle", margin: 0, fit: "shrink",
      });
      // vertical text-only stack — thin border around each label, no fill
      sub.tiles.forEach((label, j) => {
        const ty = gridTop + j * (tileH + rowGap);
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
          x: sx, y: ty, w: subW, h: tileH, rectRadius: 0.06,
          fill: { type: "none" },
          line: { color: "2A3555", width: 1 },
        });
        s.addText(label, {
          x: sx + 0.03, y: ty, w: subW - 0.06, h: tileH,
          fontFace: F, fontSize: 13, bold: true, color: "FFFFFF",
          align: "center", valign: "middle", margin: 0, fit: "shrink",
        });
      });
    });
  });

  s.addText("Live dashboard · yaikh.com/experience — 60+ agents across Administration, Management & Operations.", {
    x: 0.3, y: 7.0, w: 12.5, h: 0.3, fontFace: F, fontSize: 10, italic: true,
    color: "94A3B8", align: "center", margin: 0,
  });
  cornerPD2(s, true);
}

/* ---------- 6 · PRICING (staircase) ---------- */
{
  const s = pres.addSlide();
  titleBlock(s, "06 / 定价与套餐", "起步 $120 · 随业务规模扩展。");

  // Source of truth: components/plan/PricingStaircase.tsx.
  // Bar heights step up (like the on-page staircase). Colours match the
  // yaikh.com plan page exactly.
  const steps = [
    { step: "STEP 1", stage: "云 · 起步",    sub: "5 核心成员",           price: "$120",     per: "/ yr", h: 1.5, fill: "E0F2FE", tint: BLUE },
    { step: "STEP 2", stage: "云 · 成长",     sub: "5 → 300 用户",           price: "$750",     per: "/ yr", h: 1.8, fill: "BAE6FD", tint: BLUE },
    { step: "STEP 3", stage: "云 · 企业", sub: "300 → 1,000 用户",       price: "$1,200",   per: "/ yr", h: 2.1, fill: "93C5FD", tint: BLUE },
    { step: "STEP 4", stage: "Ai Server",          sub: "Hardware · 1,000+ users", price: "$2,500",   per: "once", h: 2.4, fill: "FED7AA", tint: ORANGE },
    { step: "STEP 4", stage: "Administrative",     sub: "tools",                   price: "+ $5,000", per: "/ yr", h: 2.65, fill: "BFDBFE", tint: BLUE },
    { step: "STEP 4", stage: "Operation",          sub: "tools",                   price: "+ $10,000",per: "/ yr", h: 2.9, fill: "93C5FD", tint: BLUE },
    { step: "STEP 5", stage: "代理式",            sub: "After ~6 months",         price: "+ $5,000", per: "/ yr · 10 agents", h: 3.1, fill: "DDD6FE", tint: "6D4FB6" },
    { step: "STEP 6", stage: "大 AI 大脑",       sub: "Boss · after ~1 year",    price: "+ $5,000", per: "/ yr · 5 factories 1 chat", h: 3.3, fill: "FED7AA", tint: ORANGE },
  ];

  const chartX = 0.6, chartY = 1.7, chartH = 4.4;
  const barW = 1.4, gap = 0.12;
  const baseY = chartY + chartH; // bars grow up from here

  steps.forEach((st, i) => {
    const x = chartX + i * (barW + gap);
    const y = baseY - st.h;
    // Bar (rounded top)
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: barW, h: st.h, rectRadius: 0.08,
      fill: { color: st.fill }, line: { color: LINE, width: 0.5 },
    });
    // Step label (top of bar)
    s.addText(st.step, {
      x: x + 0.1, y: y + 0.1, w: barW - 0.2, h: 0.22,
      fontFace: F, fontSize: 8, bold: true, color: GRAY,
      charSpacing: 2, align: "center", margin: 0,
    });
    // Stage name
    s.addText(st.stage, {
      x: x + 0.08, y: y + 0.36, w: barW - 0.16, h: 0.42,
      fontFace: F, fontSize: 11, bold: true, color: NAVY,
      align: "center", margin: 0,
    });
    // Sub
    s.addText(st.sub, {
      x: x + 0.08, y: y + 0.8, w: barW - 0.16, h: 0.32,
      fontFace: F, fontSize: 8.5, color: GRAY, italic: true,
      align: "center", margin: 0,
    });
    // Price (bottom of bar)
    s.addText(st.price, {
      x: x + 0.08, y: baseY - 0.55, w: barW - 0.16, h: 0.3,
      fontFace: F, fontSize: 14, bold: true, color: st.tint,
      align: "center", margin: 0,
    });
    s.addText(st.per, {
      x: x + 0.08, y: baseY - 0.28, w: barW - 0.16, h: 0.24,
      fontFace: F, fontSize: 8, color: GRAY,
      align: "center", margin: 0,
    });
  });

  // Baseline bands — CHAOS → DIGITALIZATION (steps 1-6) · BIG AI BRAIN (7-8)
  const band1W = 6 * (barW + gap) - gap;
  const band2W = 2 * (barW + gap) - gap;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: chartX, y: baseY + 0.15, w: band1W, h: 0.4, rectRadius: 0.05,
    fill: { color: "E0E7FF" }, line: { type: "none" },
  });
  s.addText("CHAOS  →  DIGITALIZATION", {
    x: chartX, y: baseY + 0.15, w: band1W, h: 0.4,
    fontFace: F, fontSize: 10, bold: true, color: BLUE, charSpacing: 3,
    align: "center", valign: "middle", margin: 0,
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: chartX + band1W + gap, y: baseY + 0.15, w: band2W, h: 0.4, rectRadius: 0.05,
    fill: { color: "FED7AA" }, line: { type: "none" },
  });
  s.addText("大 AI 大脑", {
    x: chartX + band1W + gap, y: baseY + 0.15, w: band2W, h: 0.4,
    fontFace: F, fontSize: 10, bold: true, color: ORANGE, charSpacing: 3,
    align: "center", valign: "middle", margin: 0,
  });

  // Footnote — e-com streams that stack on top of the packaged prices
  s.addText([
    { text: "+ 3 e-com streams (variable): ", options: { bold: true, color: NAVY } },
    { text: "Worker P2P Marketplace (take-rate/user · 100K workers)  ·  Service Provider Marketplace (take-rate + listing · ~1,000 providers)  ·  Factory Supply Marketplace (wholesale margin · 100 curated SKUs · $100K GMV/mo)", options: { color: INK } },
  ], { x: 0.6, y: baseY + 0.75, w: 12.1, h: 0.6, fontFace: F, fontSize: 11, margin: 0 });

  footer(s, "7 / 12");
}

/* ---------- 7 · TARGET CUSTOMERS ---------- */
{
  const s = pres.addSlide();
  // Slightly compressed title so the Big-tech label above the donut has
  // clean vertical space and doesn't crash into "柬埔寨策略。"
  s.addText("07 / 目标客户", {
    x: 0.6, y: 0.15, w: 12.1, h: 0.35, fontFace: F, fontSize: 16, bold: true,
    color: ORANGE, charSpacing: 3, margin: 0,
  });
  s.addText("柬埔寨策略。", {
    x: 0.6, y: 0.5, w: 12.1, h: 0.55, fontFace: F, fontSize: 26, bold: true,
    color: NAVY, margin: 0,
  });

  // Same 6 clusters, same numbers, same colours as yaikh.com /plan #customers.
  const clusters = [
    { t: "柬埔寨中型工厂", short: "Mid-size\nfactories", labelPush: 0.35, wedgePctDx: 0.35, wedgePctRScale: 0.75, n: 800, nLabel: "~800", d: "$120 → $15,000/年 · 服装、箱包、鞋类 · 3家一批次接入", c: BLUE },
    { t: "政府与机构",  short: "政府",         labelPush: 0.35, forceWedgePct: true, n: 120, nLabel: "8", d: "合作制 · 部委与行业机构", c: NAVY },
    { t: "非服装企业",       short: "非服装",        labelDy: -0.15, n: 1000, nLabel: "~1,000", d: "$120–$750/年 · 餐饮、食品、物流、服务业行政模块", c: "6D4FB6" },
    { t: "电商集群",          short: "电商",         labelPush: 0.35, labelDx: 0.7, n: 600, nLabel: "~600", d: "工友 P2P 与集市 · 触达 10 万工友 GMV", c: ORANGE },
    { t: "小型工厂",             short: "小型工厂",    labelPush: 0.5, n: 200, nLabel: "~200", d: "$120–$1,200/年 · 云起步/成长舒适区", c: GREEN },
    { t: "科技巨头与战略伙伴",short:"Big-tech\npartners", forceWedgePct: true, wedgePctSize: 14, wedgePctRScale: 0.95, n: 80, nLabel: "7", d: "Anthropic ✓ · Google · JICA · YC · ADB · ABA · Wing", c: DARKGREEN },
    // (partners slice bumped from 7 to 30 so it's still visible on the donut)
  ];
  const total = 2615; // real sum after Government cluster corrected to 8

  // LEFT — donut chart with the six slices, % labels rendered on each wedge
  s.addChart(pres.charts.DOUGHNUT, [{
    name: "Reachable accounts",
    labels: clusters.map((c) => c.short || c.t),
    values: clusters.map((c) => c.n),
  }], {
    x: 0.6, y: 1.7, w: 5.6, h: 4.9,
    chartColors: clusters.map((c) => c.c),
    dataBorder: { color: "FFFFFF", pt: 2 },
    showLegend: false,
    showTitle: false,
    holeSize: 55,
    showPercent: false,
  });

  // Manual overlay — one short label per slice, positioned radially just
  // outside the donut, with a thin leader line back to the slice midpoint.
  // (Native chart labels for doughnut slices render inconsistently across
  // PowerPoint / LibreOffice — draw our own instead.)
  const cx = 0.6 + 5.6 / 2;      // chart centre x
  const cy = 1.7 + 4.9 / 2;      // chart centre y (title is disabled)
  const rOuter = 2.2;             // where slice edge sits (measured from render)
  const rLabel = 2.55;            // where the label anchor sits — clear of the ring
  const total6 = clusters.reduce((sum, c) => sum + c.n, 0);
  let acc = 0;
  // First pass: compute the natural (angular) label anchor for each slice.
  const positions = clusters.map((c) => {
    const midFrac = (acc + c.n / 2) / total6;
    acc += c.n;
    const theta = midFrac * Math.PI * 2 - Math.PI / 2;
    const r = rLabel + (c.labelPush || 0);
    return {
      c, theta,
      sx: cx + rOuter * Math.cos(theta),
      sy: cy + rOuter * Math.sin(theta),
      lx: cx + r * Math.cos(theta) + (c.labelDx || 0),
      ly: cy + r * Math.sin(theta) + (c.labelDy || 0),
    };
  });
  // Second pass: stack tiny top slices vertically instead of letting them
  // collide with each other and with the title. Anything with < 8% AND above
  // the donut centre (sy < cy) is stacked — split by which side of the top
  // it sits on so the slices don't all land in the same column.
  const FAT_THRESHOLD = 0.07;
  const tinyTop = positions.filter((p) => p.c.n / total6 < FAT_THRESHOLD && p.sy < cy);
  // Split by side of the top: default to the right when the slice sits
  // within ~0.35" of the vertical centre (essentially at 12 o'clock) —
  // "borderline" slices look better anchored to the right column.
  const eps = 0.35;
  const topLeft  = tinyTop.filter((p) => p.sx <  cx - eps).sort((a, b) => a.sy - b.sy);
  const topRight = tinyTop.filter((p) => p.sx >= cx - eps).sort((a, b) => a.sy - b.sy);
  topLeft.forEach((p, i) => {
    p.lx = cx - rLabel - 0.25;
    p.ly = cy - rOuter - 0.55 - i * 0.4;
  });
  topRight.forEach((p, i) => {
    p.lx = cx + rLabel + 0.25;
    p.ly = cy - rOuter - 0.55 - i * 0.4;
  });
  // If a slice is essentially at 12 o'clock (theta within ~0.15 rad of the
  // top), park its label directly ABOVE the wedge instead of in a side stack.
  positions.forEach((p) => {
    if (p.c.n / total6 >= FAT_THRESHOLD) return;
    // theta = -π/2 means 12 o'clock; wrap into [-π, π] to test proximity.
    let t = p.theta;
    while (t >  Math.PI) t -= 2 * Math.PI;
    while (t < -Math.PI) t += 2 * Math.PI;
    const distTo12 = Math.abs(t - (-Math.PI / 2));
    if (distTo12 < 0.2) {
      p.lx = cx;
      p.ly = cy - rOuter - 0.45;
      p.topCenter = true;
    }
  });
  const rWedgeText = rOuter * 0.86; // sit the % centred through the ring's midline (slightly outward-biased)
  positions.forEach((p) => {
    const { c, theta, sx, sy, lx, ly } = p;
    const frac = c.n / total6;
    const pctNum = Math.round(frac * 100);
    const pct = pctNum === 0 && frac > 0 ? "<1" : String(pctNum);

    // Big white % INSIDE the wedge — only if the slice is fat enough to hold
    // it, or if the cluster forces it.
    const showWedgePct = frac >= FAT_THRESHOLD || c.forceWedgePct;
    if (showWedgePct) {
      const r = rWedgeText * (c.wedgePctRScale || 1);
      const fs = c.wedgePctSize || 26;
      const boxW = Math.max(0.6, fs / 26 * 1.1);
      const boxH = Math.max(0.35, fs / 26 * 0.7);
      const wx = cx + r * Math.cos(theta) - boxW / 2 + (c.wedgePctDx || 0);
      const wy = cy + r * Math.sin(theta) - boxH / 2 + (c.wedgePctDy || 0);
      s.addText(pct + "%", {
        x: wx, y: wy, w: boxW, h: boxH,
        fontFace: F, fontSize: fs, bold: true, color: "FFFFFF",
        align: "center", valign: "middle", margin: 0,
      });
    }

    // Leader line from slice edge to label anchor — skipped for the
    // top-centre-parked labels (line is redundant when the label sits
    // directly above the wedge).
    if (!p.topCenter) {
      s.addShape(pres.shapes.LINE, {
        x: Math.min(sx, lx), y: Math.min(sy, ly),
        w: Math.abs(lx - sx) || 0.01, h: Math.abs(ly - sy) || 0.01,
        line: { color: c.c, width: 1.25 },
        flipH: lx < sx, flipV: ly < sy,
      });
    }
    // Outside label — includes the % for tiny slices (the wedge is too
    // thin to hold the % text on its own).
    const rightSide = lx >= cx;
    const shortLabel = c.short || c.t;
    const isMulti = shortLabel.includes("\n");
    const tw = 1.85;
    const th = isMulti ? 0.72 : 0.4;
    const tx = p.topCenter ? lx - tw / 2 : (rightSide ? lx + 0.05 : lx - tw - 0.05);
    const ty = ly - th / 2;
    const labelText = showWedgePct ? shortLabel : `${shortLabel}  ${pct}%`;
    s.addText(labelText, {
      x: tx, y: ty, w: tw, h: th, fontFace: F, fontSize: 14, bold: true,
      color: NAVY, valign: "middle",
      align: p.topCenter ? "center" : (rightSide ? "left" : "right"), margin: 0,
    });
  });

  // RIGHT — legend cards showing each cluster with its accent + number + one-liner
  const rx = 6.6, rw = 6.1;
  const rowH = 0.75, gap = 0.1;
  clusters.forEach((c, i) => {
    const y = 1.7 + i * (rowH + gap);
    // small colour swatch
    s.addShape(pres.shapes.OVAL, {
      x: rx, y: y + rowH / 2 - 0.16, w: 0.32, h: 0.32,
      fill: { color: c.c }, line: { type: "none" },
    });
    // number column (bold, tinted)
    s.addText(c.nLabel, {
      x: rx + 0.45, y, w: 1.15, h: rowH, fontFace: F, fontSize: 20, bold: true,
      color: c.c, valign: "middle", margin: 0,
    });
    // cluster name + description
    s.addText([
      { text: c.t, options: { bold: true, color: NAVY, fontSize: 12, breakLine: true } },
      { text: c.d, options: { color: GRAY, fontSize: 10 } },
    ], {
      x: rx + 1.65, y, w: rw - 1.65, h: rowH, fontFace: F,
      valign: "middle", margin: 0, paraSpaceAfter: 0,
    });
  });

  s.addText("App 用户增长路径：2,500 → 100,000 员工。", {
    x: 0.6, y: 6.9, w: 12.1, h: 0.35, fontFace: F, fontSize: 12, italic: true, color: GRAY, margin: 0,
  });
  footer(s, "8 / 12");
}

/* ---------- 8 · REGIONAL EXPANSION ---------- */
{
  const s = pres.addSlide();
  titleBlock(s, "08 / 东盟策略", "");

  // Three countries — content placeholders, user will fill in later.
  const countries = [
    {
      flag: "hk-flag.png", name: "香港",  color: DARKGREEN, fill: "ECFDF5", line: "6EE7B7",
      bullets: ["供应商基础", "品牌办公室"],
    },
    {
      flag: "kh-flag.png", name: "柬埔寨",   color: ORANGE,    fill: "FFF7ED", line: "FDBA74",
      partners: [
        { file: "partner-taftac.png", label: "TAFTAC",       ratio: 207 / 70,   slotH: 0.90, maxH: 0.62 },
        { file: "partner-sbc.png",    label: "SBC Cambodia", ratio: 1521 / 597, slotH: 0.90, maxH: 0.62 },
        { file: "partner-ctrade.png", label: "CambodiaTrade",ratio: 491 / 145,  slotH: 0.90, maxH: 0.62 },
      ],
    },
    {
      flag: "sg-flag.png", name: "新加坡",  color: BLUE,      fill: "EFF6FF", line: "93C5FD",
      partners: [
        { file: "partner-sfc.png",  label: "Singapore Fashion Council", ratio: 900 / 351, slotH: 0.90, maxH: 0.62, bg: NAVY },
        { file: "partner-taftc.png",label: "TaF.tc",                    ratio: 1,         slotH: 0.90, maxH: 0.62 },
        { file: "partner-esg.png",  label: "Enterprise Singapore",      ratio: 372 / 120, slotH: 0.90, maxH: 0.62 },
      ],
    },
  ];
  const cw = 4.0, gap = 0.15;
  countries.forEach((c, i) => {
    const x = 0.6 + i * (cw + gap);
    card(s, x, 1.15, cw, 5.75, { fill: c.fill, line: c.line });
    // Big flag
    const flagData = "data:image/png;base64," + fs.readFileSync(
      path.join(IMG_DIR, c.flag),
    ).toString("base64");
    // Small flag on the left, country name on the right (same row)
    const flagW = 1.1, flagH = 0.75;
    s.addImage({ data: flagData, x: x + 0.25, y: 1.4, w: flagW, h: flagH });
    s.addText(c.name, {
      x: x + 0.25 + flagW + 0.15, y: 1.4, w: cw - 0.5 - flagW - 0.15, h: flagH,
      fontFace: F, fontSize: 22, bold: true, color: NAVY,
      align: "left", valign: "middle", margin: 0,
    });

    if (c.partners) {
      // Small section caption
      s.addText("成员单位", {
        x: x + 0.25, y: 2.4, w: cw - 0.5, h: 0.3,
        fontFace: F, fontSize: 11, bold: true, color: c.color,
        charSpacing: 2, margin: 0,
      });
      // Stack three partner logos vertically, each inside a bordered tile
      const maxW = cw - 0.6; // max logo width inside padding
      let cursorY = 2.8;
      c.partners.forEach((p) => {
        // Fit the logo into (maxW × p.maxH) keeping aspect ratio
        let lw = maxW, lh = lw / p.ratio;
        if (lh > p.maxH) { lh = p.maxH; lw = lh * p.ratio; }
        // Bordered tile (framed): a bit of padding around the logo
        const pad = 0.08;
        const tileW = lw + pad * 2;
        const tileH = lh + pad * 2;
        const tileX = x + (cw - tileW) / 2;
        const tileY = cursorY + (p.maxH - lh) / 2 - pad;
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
          x: tileX, y: tileY, w: tileW, h: tileH, rectRadius: 0.05,
          fill:  { color: p.bg || "FFFFFF" },
          line:  { color: p.bg ? p.bg : "94A3B8", width: 0.75 },
        });
        // Logo on top of the tile
        const lx = tileX + pad;
        const ly = tileY + pad;
        const data = "data:image/png;base64," + fs.readFileSync(
          path.join(IMG_DIR, p.file),
        ).toString("base64");
        s.addImage({ data, x: lx, y: ly, w: lw, h: lh });
        cursorY += p.slotH;
      });
      // Footnote — what these partnerships deliver
      s.addText("通过会员社群活动与贸易展会向制造商引荐。", {
        x: x + 0.25, y: 5.75, w: cw - 0.5, h: 1.1,
        fontFace: F, fontSize: 17, bold: true, color: NAVY,
        align: "center", valign: "middle", margin: 0,
      });
    } else if (c.bullets) {
      // Simple text list — big centered bullets
      c.bullets.forEach((b, bi) => {
        const yy = 3.0 + bi * 0.9;
        // Coloured bullet dot
        s.addShape(pres.shapes.OVAL, {
          x: x + 0.55, y: yy + 0.22, w: 0.18, h: 0.18,
          fill: { color: c.color }, line: { type: "none" },
        });
        s.addText(b, {
          x: x + 0.85, y: yy, w: cw - 1.1, h: 0.6, fontFace: F, fontSize: 20,
          bold: true, color: NAVY, align: "left", valign: "middle", margin: 0,
        });
      });
    } else {
      // Placeholder line
      s.addText("内容待补充。", {
        x: x + 0.25, y: 2.4, w: cw - 0.5, h: 0.5, fontFace: F, fontSize: 13,
        italic: true, color: GRAY, align: "left", margin: 0,
      });
    }
  });
  footer(s, "9 / 12");
}

/* ---------- 8 · PARTNERS & CUSTOMERS ---------- */
{
  const s = pres.addSlide();
  titleBlock(s, "09 / 合作伙伴与客户", "");

  // Three columns: Partners (tech) · Strategic Partner (Yorkwell Asia) · Customers.
  const cols = [
    {
      tag: "合作伙伴", subtitle: "AI 技术栈",
      color: ORANGE, fill: "FFF7ED", line: "FDBA74",
      x: 0.6, w: 3.9,
      items: [
        { label: "Anthropic · Claude", file: "partner-anthropic-claude.png", ratio: 1024 / 386 },
        { label: "Google for Startups",file: "partner-googlestartups.png",   ratio: 969 / 124  },
      ],
    },
    {
      tag: "战略合作伙伴", subtitle: "yorkwellasia.com.hk",
      color: DARKGREEN, fill: "ECFDF5", line: "6EE7B7",
      x: 4.65, w: 4.0,
      hero: { label: "Yorkwell Asia", file: "partner-yorkwell.png", ratio: 483 / 106 },
    },
    {
      tag: "客户", subtitle: "实景生产线",
      color: BLUE, fill: "EFF6FF", line: "93C5FD",
      x: 8.8, w: 3.93,
      rowLayout: true,
      items: [
        { label: "Yorkmars Cambodia", desc: "Administrative and operational.",
          file: "customer-yorkmars.png", ratio: 1 },
        { label: "3SGS",                desc: "Digital audit.",
          file: "customer-3sgs.png",     ratio: 974 / 421 },
        { label: "BICNZ",               desc: "Digital audit.",
          file: "customer-bicnz.png",    ratio: 488 / 480 },
        { label: "ES Packing",          desc: "YHR.",
          file: "customer-espacking.png",ratio: 150 / 132 },
        { label: "Caswell Career",      desc: "Quality & machine maintenance.",
          file: "customer-caswell.png",  ratio: 593 / 400 },
      ],
    },
  ];

  cols.forEach((c) => {
    // Column card
    card(s, c.x, 1.15, c.w, 5.75, { fill: c.fill, line: c.line });
    // Filled tag chip
    const chipW = 2.35;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: c.x + 0.25, y: 1.4, w: chipW, h: 0.36, rectRadius: 0.06,
      fill: { color: c.color }, line: { type: "none" },
    });
    s.addText(c.tag, {
      x: c.x + 0.25, y: 1.4, w: chipW, h: 0.36,
      fontFace: F, fontSize: 11, bold: true, color: "FFFFFF",
      charSpacing: 2, align: "center", valign: "middle", margin: 0,
    });
    // Subtitle
    s.addText(c.subtitle, {
      x: c.x + 0.25, y: 1.82, w: c.w - 0.5, h: 0.35,
      fontFace: F, fontSize: 12, italic: true, color: GRAY, margin: 0,
    });

    if (c.hero) {
      // Single big centered logo (or placeholder) — hero
      const tileW = c.w - 0.6, tileH = 3.6;
      const tx = c.x + (c.w - tileW) / 2;
      const ty = 2.5;
      const labelH = 0.4;
      const logoArea = tileH - labelH - 0.1;
      if (c.hero.file) {
        const maxW = tileW;
        const maxH = logoArea;
        let lw = maxW, lh = lw / c.hero.ratio;
        if (lh > maxH) { lh = maxH; lw = lh * c.hero.ratio; }
        const lx = tx + (tileW - lw) / 2;
        const ly = ty + (maxH - lh) / 2;
        const data = "data:image/png;base64," + fs.readFileSync(
          path.join(IMG_DIR, c.hero.file),
        ).toString("base64");
        s.addImage({ data, x: lx, y: ly, w: lw, h: lh });
      } else {
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
          x: tx, y: ty, w: tileW, h: logoArea + 0.02, rectRadius: 0.08,
          fill: { color: "FFFFFF" },
          line: { color: "CBD5E1", width: 0.75, dashType: "dash" },
        });
        s.addText("LOGO", {
          x: tx, y: ty, w: tileW, h: logoArea,
          fontFace: F, fontSize: 18, bold: true, color: "94A3B8",
          charSpacing: 3, align: "center", valign: "middle", margin: 0,
        });
      }
      s.addText(c.hero.label, {
        x: tx, y: ty + logoArea + 0.1, w: tileW, h: labelH,
        fontFace: F, fontSize: 15, bold: true, color: NAVY,
        align: "center", valign: "middle", margin: 0,
      });
    } else {
      // Stacked logo placeholders — N tiles
      const startY = 2.5;
      const availH = 6.9 - startY - 0.2; // 6.9 = card end
      const n = c.items.length;
      const gap = 0.15;
      const tileH = (availH - gap * (n - 1)) / n;
      const tileW = c.w - 0.6;
      const tx = c.x + (c.w - tileW) / 2;
      c.items.forEach((it, i) => {
        const ty = startY + i * (tileH + gap);
        if (c.rowLayout) {
          // Logo on the LEFT, label + optional description on the RIGHT.
          const logoBoxW = tileW * 0.38;
          const textX = tx + logoBoxW + 0.12;
          const textW = tileW - logoBoxW - 0.15;
          if (it.file) {
            const maxW = logoBoxW;
            const maxH = tileH - 0.05;
            let lw = maxW, lh = lw / it.ratio;
            if (lh > maxH) { lh = maxH; lw = lh * it.ratio; }
            const lx = tx + (logoBoxW - lw) / 2;
            const ly = ty + (tileH - lh) / 2;
            const data = "data:image/png;base64," + fs.readFileSync(
              path.join(IMG_DIR, it.file),
            ).toString("base64");
            s.addImage({ data, x: lx, y: ly, w: lw, h: lh });
          } else {
            s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
              x: tx, y: ty, w: logoBoxW, h: tileH, rectRadius: 0.08,
              fill: { color: "FFFFFF" },
              line: { color: "CBD5E1", width: 0.75, dashType: "dash" },
            });
            s.addText("LOGO", {
              x: tx, y: ty, w: logoBoxW, h: tileH,
              fontFace: F, fontSize: 12, bold: true, color: "94A3B8",
              charSpacing: 3, align: "center", valign: "middle", margin: 0,
            });
          }
          if (it.desc) {
            const labelH = tileH * 0.42;
            s.addText(it.label, {
              x: textX, y: ty + 0.05, w: textW, h: labelH,
              fontFace: F, fontSize: 13, bold: true, color: NAVY,
              align: "left", valign: "bottom", margin: 0,
            });
            s.addText(it.desc, {
              x: textX, y: ty + labelH + 0.02, w: textW, h: tileH - labelH - 0.05,
              fontFace: F, fontSize: 11, italic: true, color: GRAY,
              align: "left", valign: "top", margin: 0,
            });
          } else {
            s.addText(it.label, {
              x: textX, y: ty, w: textW, h: tileH,
              fontFace: F, fontSize: 13, bold: true, color: NAVY,
              align: "left", valign: "middle", margin: 0,
            });
          }
        } else {
          // Column layout — logo on top, label below.
          const labelH = 0.28;
          const logoArea = tileH - labelH - 0.06;
          if (it.file) {
            const maxW = tileW;
            const maxH = logoArea;
            let lw = maxW, lh = lw / it.ratio;
            if (lh > maxH) { lh = maxH; lw = lh * it.ratio; }
            const lx = tx + (tileW - lw) / 2;
            const ly = ty + (maxH - lh) / 2;
            const data = "data:image/png;base64," + fs.readFileSync(
              path.join(IMG_DIR, it.file),
            ).toString("base64");
            s.addImage({ data, x: lx, y: ly, w: lw, h: lh });
          } else {
            s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
              x: tx, y: ty, w: tileW, h: logoArea + 0.02, rectRadius: 0.08,
              fill: { color: "FFFFFF" },
              line: { color: "CBD5E1", width: 0.75, dashType: "dash" },
            });
            s.addText("LOGO", {
              x: tx, y: ty, w: tileW, h: logoArea,
              fontFace: F, fontSize: 14, bold: true, color: "94A3B8",
              charSpacing: 3, align: "center", valign: "middle", margin: 0,
            });
          }
          s.addText(it.label, {
            x: tx + 0.1, y: ty + logoArea + 0.02, w: tileW - 0.2, h: labelH,
            fontFace: F, fontSize: 12, bold: true, color: NAVY,
            align: "center", valign: "middle", margin: 0,
          });
        }
      });
    }
  });
  footer(s, "10 / 12");
}

/* ---------- 10 · STARTUP SUPPORT NEEDED ---------- */
{
  const s = pres.addSlide();
  titleBlock(s, "10 / 所需的初创支持", "三大支点 · 双方共赢。");

  const cards = [
    {
      no: "1",
      tag: "战略合作",
      title: "你的外部 AI 研发团队。",
      body: "直接商务合作。Yai 已上线 60+ 应用；企业按需定制，我们以月费成为其外部 AI 研发合作伙伴，持续迭代。为我们带来稳定收入，为他们带来一支即用型 AI 团队。",
      color: ORANGE, fill: "FFF7ED", line: "FDBA74",
    },
    {
      no: "2",
      tag: "资源与引荐",
      title: "渠道、场地、成本共担。",
      body: "新市场共享办公空间；活动准入，成本共担；对接机构、政府、NGO 与资方。作为回馈，我们提供实打实的 Yai 产出 —— 是合作交付，而非礼节。",
      color: BLUE, fill: "EFF6FF", line: "93C5FD",
    },
    {
      no: "3",
      tag: "AI 与数据合作",
      title: "数据中心与基础设施。",
      body: "与数据中心运营商及基础设施提供方合作 —— GPU 算力、机柜托管、边缘节点。让 Yai 的推理与训练贴近工厂，随规模同步降本。",
      color: DARKGREEN, fill: "ECFDF5", line: "6EE7B7",
    },
  ];

  const cw = 3.9, gap = 0.15;
  cards.forEach((c, i) => {
    const x = 0.6 + i * (cw + gap);
    card(s, x, 1.75, cw, 4.9, { fill: c.fill, line: c.line });
    numCircle(s, x + 0.3, 1.9, c.no, c.color);
    s.addText(c.tag, {
      x: x + 0.9, y: 1.86, w: cw - 1.05, h: 0.5,
      fontFace: F, fontSize: 16, bold: true, color: c.color,
      charSpacing: 2, valign: "middle", margin: 0, fit: "shrink",
    });
    s.addText(c.title, {
      x: x + 0.3, y: 2.55, w: cw - 0.55, h: 0.7,
      fontFace: F, fontSize: 22, bold: true, color: NAVY, margin: 0,
    });
    s.addText(c.body, {
      x: x + 0.3, y: 3.3, w: cw - 0.55, h: 3.3,
      fontFace: F, fontSize: 18, color: INK,
      valign: "top", margin: 0, paraSpaceAfter: 4,
    });
  });
  s.addText("这三项打开加速通道，均无需改动平台的构建方式。", {
    x: 0.6, y: 6.85, w: 12.1, h: 0.35,
    fontFace: F, fontSize: 12.5, italic: true, bold: true, color: BLUE,
    align: "center", margin: 0,
  });
  footer(s, "11 / 12");
}

/* ---------- 11 · CLOSING ---------- */
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  addRoundLogo(s, 0.9, 0.95, 1.15);
  s.addText([
    { text: "现代化产业。", options: { color: "FFFFFF", breakLine: true } },
    { text: "四十年技术与管理经验 ——", options: { color: "FFD58A", fontSize: 26, breakLine: true } },
    { text: "如今由人工智能驱动，", options: { color: "FFD58A", fontSize: 26, breakLine: true } },
    { text: "比肩任何科技行业。", options: { color: "FFD58A", fontSize: 26 } },
  ], {
    x: 0.85, y: 2.4, w: 11.6, h: 3.6,
    fontFace: F, fontSize: 44, bold: true, color: "FFFFFF",
    paraSpaceAfter: 6, margin: 0,
  });
  s.addText(`www.yaikh.com   ·   Texlink Technologies Co., Ltd.   ·   ${TODAY}   ·   Confidential`, {
    x: 0.9, y: 6.75, w: 11.5, h: 0.35, fontFace: F, fontSize: 11, color: "8FA8D8", margin: 0,
  });
  cornerPD2(s, true);
}

pres.writeFile({ fileName: process.argv[2] || "Yai-Pitch-Deck.pptx" }).then(() => console.log("written"));
