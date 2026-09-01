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
  { file: "garments.jpg",   label: "Garments" },
  { file: "bags.jpg",       label: "Bags" },
  { file: "footwear.jpg",   label: "Footwear" },
  { file: "toys.jpg",       label: "Toys" },
  { file: "furniture.jpg",  label: "Furniture" },
  { file: "carseats.jpg",   label: "Car seats" },
  { file: "homeware.jpg",   label: "Homeware" },
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
  s.addText(`Yai · Strategic DTV · Confidential · ${page}`, {
    x: 0.6, y: H - 0.42, w: 12.1, h: 0.3, fontFace: F, fontSize: 8.5, color: "94A3B8", margin: 0,
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
  const heroTop = 1.55;
  const heroH = 2.0;
  const heroMid = heroTop + heroH / 2;   // 2.55

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
  // Row 2 — split captions: "MADE IN CAMBODIA" under the flags,
  // "ASEAN" under the ASEAN logo.
  const row2Y = groupTop + Math.max(flagH, aseanH) + gRowGap;
  s.addText("MADE IN CAMBODIA", {
    x: gx, y: row2Y, w: flagsW, h: eyebrowH,
    fontFace: F, fontSize: 10.5, bold: true, color: "FFD58A",
    charSpacing: 2, align: "center", valign: "middle", margin: 0, wrap: false,
  });
  s.addText("ASEAN", {
    x: aseanX - 0.15, y: row2Y, w: aseanW + 0.3, h: eyebrowH,
    fontFace: F, fontSize: 10.5, bold: true, color: "FFD58A",
    charSpacing: 2, align: "center", valign: "middle", margin: 0, wrap: false,
  });

  // Product-photo strip removed — the branded/broken stock photos were
  // causing repeated iterations. Text-only category list instead.
  s.addText("SERVING CAMBODIA'S MANUFACTURING AND GLOBAL", {
    x: 0.9, y: 3.55, w: 11.5, h: 0.5, fontFace: F, fontSize: 17, bold: true,
    color: "FFD58A", charSpacing: 3, margin: 0, align: "center",
  });
  // Icon-above-word row — use the available bottom band properly.
  const CATS = [
    { file: "icon-garments.png",  label: "Garments" },
    { file: "icon-bags.png",      label: "Bags" },
    { file: "icon-footwear.png",  label: "Footwear" },
    { file: "icon-toys.png",      label: "Toys" },
    { file: "icon-furniture.png", label: "Furniture" },
    { file: "icon-carseats.png",  label: "Car seats" },
    { file: "icon-homeware.png",  label: "Homeware" },
  ];
  const catsY = 4.2;
  const iconSize = 1.4;
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

  s.addText(`Texlink Technologies Co., Ltd.   ·   ${TODAY}   ·   Confidential   ·   www.yaikh.com`, {
    x: 0.9, y: 7.05, w: 11.5, h: 0.3, fontFace: F, fontSize: 10, color: "8FA8D8", margin: 0,
  });
}

/* ---------- 2 · EXECUTIVE SUMMARY ---------- */
{
  const s = pres.addSlide();
  titleBlock(s, "01 / Executive summary", "Factory-tested for 5 years. Now opening the gates.");
  s.addText([
    { text: "Yai is Ai MIP — Agentic Manufacturing Intelligence. ", options: { bold: true, color: NAVY } },
    { text: "A three-layer platform that modernises a production unit from a whole-paper operation into executive Ai. It replaces the chaos most factories live in today — paper reports, ledger books, scattered chat apps, manual signatures, staff chasing approvals floor-to-floor.", options: { color: INK } },
  ], { x: 0.6, y: 1.6, w: 12.1, h: 1.1, fontFace: F, fontSize: 15, margin: 0 });
  const tw = 2.92, gap = 0.14, ty = 3.0, th = 2.5;
  statTile(s, 0.6, ty, tw, th, "10", "Ai agents stand ready", GREEN);
  statTile(s, 0.6 + (tw + gap), ty, tw, th, "20", "Engineers from Cambodia", BLUE);
  statTile(s, 0.6 + 2 * (tw + gap), ty, tw, th, "36|mo", "In development", ORANGE);
  statTile(s, 0.6 + 3 * (tw + gap), ty, tw, th, "40|yrs", "Industry experience — technical + management", NAVY);
  s.addText("5 years inside live production facilities — proven on real factory floors before a single sales call.", {
    x: 0.6, y: 5.85, w: 12.1, h: 0.5, fontFace: F, fontSize: 14, italic: true, color: GRAY, margin: 0,
  });
  footer(s, "2 / 12");
}

/* ---------- 3 · THE PROBLEM ---------- */
{
  const s = pres.addSlide();
  titleBlock(s, "02 / The problem", "Squeezed from three sides — internal, brands, government.");

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
  titleBlock(s, "03 / The solution", "An Ai platform that saves jobs.");
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
  titleBlock(s, "04 / Product architecture", "From paper to Full Ai — three Yai layers.");
  const cols = [
    {
      tag: "TODAY", name: "Traditional Factory Work",
      sub: "Disconnected & manual — what Yai replaces",
      blurb: "The reality most garment factories are stuck in today. Yai doesn't deliver this layer; it replaces it.",
      items: [
        { icon: "arch-paper.png",   label: "Paper reports" },
        { icon: "arch-books.png",   label: "Ledger books" },
        { icon: "arch-chat.png",    label: "Scattered chat" },
        { icon: "arch-signing.png", label: "Manual signing" },
      ],
      fill: "F1F5F9", line: "CBD5E1", tagBg: "CBD5E1", tagFg: "334155",
    },
    {
      tag: "LAYER 1", name: "Digitalization",
      sub: "Centralised data",
      blurb: "Excel dashboards and digital records flow into one database. The foundation for everything above.",
      items: [
        { icon: "arch-database.png", label: "One database" },
        { icon: "arch-records.png",  label: "Digital records" },
        { icon: "arch-mobile.png",   label: "Mobile apps" },
        { icon: "arch-scanner.png",  label: "AIoT & scanners" },
      ],
      fill: "FFF1E0", line: "FDBA74", tagBg: ORANGE, tagFg: "FFFFFF",
    },
    {
      tag: "LAYER 2", name: "Agentic",
      sub: "LLM-powered intelligent agents",
      blurb: "Ai agents refine workflows. Voice, text, dashboards and digital-twin visualisation on every device.",
      items: [
        { icon: "arch-voice.png",     label: "Voice-to-workflow" },
        { icon: "arch-brain.png",     label: "LLM agents" },
        { icon: "arch-dashboard.png", label: "Dashboards & DTV" },
        { icon: "arch-bot.png",       label: "Real-time guidance" },
      ],
      fill: "EFF6FF", line: "93C5FD", tagBg: BLUE, tagFg: "FFFFFF",
    },
    {
      tag: "LAYER 3", name: "Full Ai",
      sub: "Strategic management & growth",
      blurb: "Executive layer — senior management decisions, multi-factory control, expansion to new countries. Companies run their own Ai compute on solar-powered mini data centres.",
      items: [
        { icon: "arch-globe.png",     label: "Multi-country" },
        { icon: "arch-dashboard.png", label: "Predictive growth" },
        { icon: "arch-crown.png",     label: "Executive decisions" },
        { icon: "arch-computer.png",  label: "Own Ai computing" },
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
  s.addText("Adopt one layer at a time — each builds on the one below, nothing gets ripped out.", {
    x: 0.6, y: 6.9, w: 12.1, h: 0.35, fontFace: F, fontSize: 12.5, bold: true, color: BLUE, margin: 0, align: "center",
  });
  footer(s, "5 / 12");
}

/* ---------- 6 · PRICING (staircase) ---------- */
{
  const s = pres.addSlide();
  titleBlock(s, "05 / Pricing & packaging", "Start $120 · scale as the business grows.");

  // Source of truth: components/plan/PricingStaircase.tsx.
  // Bar heights step up (like the on-page staircase). Colours match the
  // yaikh.com plan page exactly.
  const steps = [
    { step: "STEP 1", stage: "Cloud · Starter",    sub: "5 key members",           price: "$120",     per: "/ yr", h: 1.5, fill: "E0F2FE", tint: BLUE },
    { step: "STEP 2", stage: "Cloud · Growth",     sub: "5 → 300 users",           price: "$750",     per: "/ yr", h: 1.8, fill: "BAE6FD", tint: BLUE },
    { step: "STEP 3", stage: "Cloud · Enterprise", sub: "300 → 1,000 users",       price: "$1,200",   per: "/ yr", h: 2.1, fill: "93C5FD", tint: BLUE },
    { step: "STEP 4", stage: "Ai Server",          sub: "Hardware · 1,000+ users", price: "$2,500",   per: "once", h: 2.4, fill: "FED7AA", tint: ORANGE },
    { step: "STEP 4", stage: "Administrative",     sub: "tools",                   price: "+ $5,000", per: "/ yr", h: 2.65, fill: "BFDBFE", tint: BLUE },
    { step: "STEP 4", stage: "Operation",          sub: "tools",                   price: "+ $10,000",per: "/ yr", h: 2.9, fill: "93C5FD", tint: BLUE },
    { step: "STEP 5", stage: "Agentic",            sub: "After ~6 months",         price: "+ $5,000", per: "/ yr · 10 agents", h: 3.1, fill: "DDD6FE", tint: "6D4FB6" },
    { step: "STEP 6", stage: "Big Ai Brain",       sub: "Boss · after ~1 year",    price: "+ $5,000", per: "/ yr · 5 factories 1 chat", h: 3.3, fill: "FED7AA", tint: ORANGE },
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
  s.addText("BIG AI BRAIN", {
    x: chartX + band1W + gap, y: baseY + 0.15, w: band2W, h: 0.4,
    fontFace: F, fontSize: 10, bold: true, color: ORANGE, charSpacing: 3,
    align: "center", valign: "middle", margin: 0,
  });

  // Footnote — e-com streams that stack on top of the packaged prices
  s.addText([
    { text: "+ 3 e-com streams (variable): ", options: { bold: true, color: NAVY } },
    { text: "Worker P2P Marketplace (take-rate/user · 100K workers)  ·  Service Provider Marketplace (take-rate + listing · ~1,000 providers)  ·  Factory Supply Marketplace (wholesale margin · 100 curated SKUs · $100K GMV/mo)", options: { color: INK } },
  ], { x: 0.6, y: baseY + 0.75, w: 12.1, h: 0.6, fontFace: F, fontSize: 11, margin: 0 });

  footer(s, "6 / 12");
}

/* ---------- 7 · TARGET CUSTOMERS ---------- */
{
  const s = pres.addSlide();
  // Slightly compressed title so the Big-tech label above the donut has
  // clean vertical space and doesn't crash into "Cambodia approach."
  s.addText("06 / TARGET CUSTOMERS", {
    x: 0.6, y: 0.15, w: 12.1, h: 0.35, fontFace: F, fontSize: 16, bold: true,
    color: ORANGE, charSpacing: 3, margin: 0,
  });
  s.addText("Cambodia approach.", {
    x: 0.6, y: 0.5, w: 12.1, h: 0.55, fontFace: F, fontSize: 26, bold: true,
    color: NAVY, margin: 0,
  });

  // Same 6 clusters, same numbers, same colours as yaikh.com /plan #customers.
  const clusters = [
    { t: "Mid-size Cambodia factories", short: "Mid-size\nfactories", labelPush: 0.35, wedgePctDx: 0.35, wedgePctRScale: 0.75, n: 800, nLabel: "~800", d: "$120 → $15,000 / yr · garment, bag, footwear · onboarded in cohorts of 3", c: BLUE },
    { t: "Government & institutional",  short: "Government",         labelPush: 0.35, forceWedgePct: true, n: 120, nLabel: "8", d: "Partnership-based · ministries + industry bodies", c: NAVY },
    { t: "Non-garment companies",       short: "Non-garment",        labelDy: -0.15, n: 1000, nLabel: "~1,000", d: "$120 – $750 / yr · hospitality, food, logistics, services on admin modules", c: "6D4FB6" },
    { t: "E-commerce cluster",          short: "E-commerce",         labelPush: 0.35, labelDx: 0.7, n: 600, nLabel: "~600", d: "Worker P2P + marketplaces · plus 100K worker GMV reach", c: ORANGE },
    { t: "Small factories",             short: "Small factories",    labelPush: 0.5, n: 200, nLabel: "~200", d: "$120 – $1,200 / yr · Cloud Starter / Growth comfort zone", c: GREEN },
    { t: "Big-tech & strategic partners",short:"Big-tech\npartners", forceWedgePct: true, wedgePctSize: 14, wedgePctRScale: 0.95, n: 80, nLabel: "7", d: "Anthropic ✓ · Google · JICA · YC · ADB · ABA · Wing", c: DARKGREEN },
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

  s.addText("App user growth path: 2,500 → 100,000 workers.", {
    x: 0.6, y: 6.9, w: 12.1, h: 0.35, fontFace: F, fontSize: 12, italic: true, color: GRAY, margin: 0,
  });
  footer(s, "7 / 12");
}

/* ---------- 8 · REGIONAL EXPANSION ---------- */
{
  const s = pres.addSlide();
  titleBlock(s, "07 / ASEAN approach", "");

  // Three countries — content placeholders, user will fill in later.
  const countries = [
    {
      flag: "hk-flag.png", name: "Hong Kong",  color: DARKGREEN, fill: "ECFDF5", line: "6EE7B7",
      bullets: ["Supplier base", "Brands offices"],
    },
    {
      flag: "kh-flag.png", name: "Cambodia",   color: ORANGE,    fill: "FFF7ED", line: "FDBA74",
      partners: [
        { file: "partner-taftac.png", label: "TAFTAC",       ratio: 207 / 70,   slotH: 0.90, maxH: 0.62 },
        { file: "partner-sbc.png",    label: "SBC Cambodia", ratio: 1521 / 597, slotH: 0.90, maxH: 0.62 },
        { file: "partner-ctrade.png", label: "CambodiaTrade",ratio: 491 / 145,  slotH: 0.90, maxH: 0.62 },
      ],
    },
    {
      flag: "sg-flag.png", name: "Singapore",  color: BLUE,      fill: "EFF6FF", line: "93C5FD",
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
      s.addText("MEMBER OF", {
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
      s.addText("Referrals to the manufactures via membership networking events and trade expos.", {
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
      s.addText("Content to be added.", {
        x: x + 0.25, y: 2.4, w: cw - 0.5, h: 0.5, fontFace: F, fontSize: 13,
        italic: true, color: GRAY, align: "left", margin: 0,
      });
    }
  });
  footer(s, "8 / 12");
}

/* ---------- 8 · PARTNERS & CUSTOMERS ---------- */
{
  const s = pres.addSlide();
  titleBlock(s, "08 / Partners & Customers", "");

  // Three columns: Partners (tech) · Strategic Partner (Yorkwell Asia) · Customers.
  const cols = [
    {
      tag: "PARTNERS", subtitle: "Ai stack",
      color: ORANGE, fill: "FFF7ED", line: "FDBA74",
      x: 0.6, w: 3.9,
      items: [
        { label: "Anthropic",          file: "partner-anthropic.png",     ratio: 1024 / 115 },
        { label: "Claude",             file: "partner-claude.png",        ratio: 1024 / 220 },
        { label: "Google for Startups",file: "partner-googlestartups.png",ratio: 969 / 124  },
      ],
    },
    {
      tag: "STRATEGIC PARTNER", subtitle: "yorkwellasia.com.hk",
      color: DARKGREEN, fill: "ECFDF5", line: "6EE7B7",
      x: 4.65, w: 4.0,
      hero: { label: "Yorkwell Asia", file: "partner-yorkwell.png", ratio: 483 / 106 },
    },
    {
      tag: "CUSTOMERS", subtitle: "Live production floors",
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
  footer(s, "9 / 12");
}

/* ---------- 10 · STARTUP SUPPORT NEEDED ---------- */
{
  const s = pres.addSlide();
  titleBlock(s, "09 / Startup support needed", "Three levers · both sides win.");

  const cards = [
    {
      no: "1",
      tag: "STRATEGIC PARTNERSHIPS",
      title: "Your external Ai dev team.",
      body: "Direct commercial. Yai already ships 60+ applications. Enterprises tune them to their workflow; we become their external Ai dev partner on a monthly fee, and keep building. Predictable revenue for us, a live Ai team for them.",
      color: ORANGE, fill: "FFF7ED", line: "FDBA74",
    },
    {
      no: "2",
      tag: "ACCESS & INTRODUCTIONS",
      title: "Doors, spaces, cost-share.",
      body: "Shared office space in new markets. Event access, with cost-share. Warm intros to institutions, governments, NGOs and funders. In return, we contribute real Yai work — a partnership deliverable, not a courtesy.",
      color: BLUE, fill: "EFF6FF", line: "93C5FD",
    },
    {
      no: "3",
      tag: "AI & DATA PARTNERSHIPS",
      title: "Data centres & infrastructure.",
      body: "Partnerships with data-centre operators and infrastructure providers — GPU capacity, colocation, edge nodes. Host Yai's inference and training close to our factories, at economics that scale with us.",
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
  s.addText("These three unlock speed. None require a change in how the platform is built.", {
    x: 0.6, y: 6.85, w: 12.1, h: 0.35,
    fontFace: F, fontSize: 12.5, italic: true, bold: true, color: BLUE,
    align: "center", margin: 0,
  });
  footer(s, "10 / 12");
}

/* ---------- 11 · THE END GAME (income + investment vs value) ---------- */
{
  const s = pres.addSlide();
  titleBlock(s, "10 / The end game", "$205K in. Customer income scaling. A $5–10M platform out.");

  // LEFT — income trajectory chart (customer base, real bookings + pipeline)
  s.addChart(pres.charts.BAR, [
    {
      name: "Customer income ($K)",
      labels: ["Q2'26", "Q3'26", "Q4'26", "Q1'27", "Q2'27"],
      values: [0.1, 2.9, 11.7, 61.2, 54.5],
    },
  ], {
    x: 0.6, y: 1.75, w: 6.6, h: 4.6, barDir: "col",
    chartColors: [GREEN],
    showTitle: true, title: "Customer income scaling · Jun 2026 → Jun 2027",
    titleFontSize: 12, titleColor: NAVY, titleFontFace: F,
    showValue: true, dataLabelPosition: "outEnd",
    dataLabelColor: NAVY, dataLabelFontSize: 11, dataLabelFontFace: F,
    catAxisLabelColor: GRAY, catAxisLabelFontFace: F, catAxisLabelFontSize: 11,
    valAxisLabelColor: GRAY, valAxisLabelFontFace: F, valAxisLabelFontSize: 10,
    valGridLine: { color: LINE, size: 0.5 }, catGridLine: { style: "none" },
    showLegend: false,
  });

  // RIGHT — investment → value story (two stacked cards + arrow between)
  card(s, 7.55, 1.75, 5.18, 2.15, { fill: "ECFDF5", line: "6EE7B7" });
  s.addText("INVESTED · END 2026", {
    x: 7.75, y: 1.9, w: 4.8, h: 0.3,
    fontFace: F, fontSize: 11, bold: true, color: DARKGREEN, charSpacing: 2, margin: 0,
  });
  s.addText("$205K", {
    x: 7.75, y: 2.2, w: 4.8, h: 1.1,
    fontFace: F, fontSize: 66, bold: true, color: DARKGREEN, margin: 0,
  });
  s.addText("17 module families · 10 agents · 3 platform layers · Cambodia team since May 2024.", {
    x: 7.75, y: 3.32, w: 4.8, h: 0.55,
    fontFace: F, fontSize: 12, color: INK, valign: "top", margin: 0,
  });

  // Down arrow between the two cards
  s.addText("↓", {
    x: 7.55, y: 3.95, w: 5.18, h: 0.4,
    fontFace: F, fontSize: 26, bold: true, color: ORANGE,
    align: "center", valign: "middle", margin: 0,
  });

  card(s, 7.55, 4.4, 5.18, 2.15, { fill: "FEF2F2", line: "FECACA" });
  s.addText("PLATFORM VALUE", {
    x: 7.75, y: 4.55, w: 4.8, h: 0.3,
    fontFace: F, fontSize: 11, bold: true, color: "B91C1C", charSpacing: 2, margin: 0,
  });
  s.addText("$5M–$10M", {
    x: 7.75, y: 4.85, w: 4.8, h: 1.1,
    fontFace: F, fontSize: 60, bold: true, color: "B91C1C", margin: 0,
  });
  s.addText("Same engineering cost in the US / EU / Singapore. A 15–28× structural advantage.", {
    x: 7.75, y: 5.97, w: 4.8, h: 0.55,
    fontFace: F, fontSize: 12, color: INK, valign: "top", margin: 0,
  });

  // Bottom takeaway — the end-game line
  s.addText([
    { text: "That's the end game — ", options: { bold: true, color: NAVY } },
    { text: "small investment, live customer income, a platform worth 25–50× what it cost to build.", options: { color: INK } },
  ], {
    x: 0.6, y: 6.65, w: 12.1, h: 0.5, fontFace: F, fontSize: 15,
    align: "center", margin: 0,
  });
  footer(s, "11 / 12");
}

/* ---------- 13 · CLOSING ---------- */
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  addRoundLogo(s, 0.9, 0.95, 1.15);
  s.addText([
    { text: "Modernising the industry.", options: { color: "FFFFFF", breakLine: true } },
    { text: "Forty years of technical & management experience —", options: { color: "FFD58A", fontSize: 26, breakLine: true } },
    { text: "now powered by Artificial Intelligence,", options: { color: "FFD58A", fontSize: 26, breakLine: true } },
    { text: "on par with any tech industry.", options: { color: "FFD58A", fontSize: 26 } },
  ], {
    x: 0.85, y: 2.4, w: 11.6, h: 3.6,
    fontFace: F, fontSize: 44, bold: true, color: "FFFFFF",
    paraSpaceAfter: 6, margin: 0,
  });
  s.addText(`www.yaikh.com   ·   Texlink Technologies Co., Ltd.   ·   ${TODAY}   ·   Confidential`, {
    x: 0.9, y: 6.75, w: 11.5, h: 0.35, fontFace: F, fontSize: 11, color: "8FA8D8", margin: 0,
  });
}

pres.writeFile({ fileName: process.argv[2] || "Yai-Pitch-Deck.pptx" }).then(() => console.log("written"));
