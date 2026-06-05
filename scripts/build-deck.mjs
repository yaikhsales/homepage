#!/usr/bin/env node
/**
 * Build the Yai investor pitch deck (PPTX).
 *   node scripts/build-deck.mjs    (or `npm run gen:deck`)
 * Output: public/downloads/yai-plan-deck.pptx
 *
 * 1 cover slide + 17 content slides matching the public plan portal,
 * with rich imagery embedded throughout (section hero illustrations,
 * Three-Yai-Layers cards, real team portraits, 36 agent avatars, etc.).
 */

import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, "..");

const NAVY    = "0A1F47";
const BLUE    = "1E4DAA";
const ORANGE  = "F37021";
const GREEN   = "10B981";
const PURPLE  = "8B5CF6";
const TEAL    = "14B8A6";
const WHITE   = "FFFFFF";
const TEXT    = "1F2937";
const SUBTEXT = "64748B";
const SOFT_BG = "F8FAFC";
const LINE    = "E2E8F0";

const FONT_HEADER = "Calibri";
const FONT_BODY   = "Calibri";

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
pres.author = "Texlink Technologies";
pres.company = "Yai · Texlink Technologies Co., Ltd.";
pres.title = "Yai · Ai-Native Manufacturing Intelligence Platform";

const SW = 10;
const SH = 5.625;

const IMG_DIR    = path.join(ROOT, "public/images/generated");
const TEAM_DIR   = path.join(ROOT, "public/images/team/portraits");
const LOGO_PATH  = path.join(ROOT, "public/images/yai-logo.jpg");

function img(name) {
  const p = path.join(IMG_DIR, name);
  return existsSync(p) ? p : null;
}
function portrait(alias) {
  const p = path.join(TEAM_DIR, alias + ".png");
  return existsSync(p) ? p : null;
}

// Reusable header strip on every content slide
function addBrandFrame(slide, kicker, title) {
  // Orange accent bar — left edge (matches sidebar active marker)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: SH, fill: { color: ORANGE }, line: { color: ORANGE },
  });

  // Brand line top-right (no logo image to keep file size down)
  slide.addText("TEXLINK TECHNOLOGIES", {
    x: 7.5, y: 0.25, w: 2.1, h: 0.20,
    fontSize: 8, fontFace: FONT_BODY, color: NAVY, bold: true, align: "right",
    charSpacing: 3, margin: 0,
  });
  slide.addText("STRATEGIC DTV", {
    x: 7.5, y: 0.45, w: 2.1, h: 0.20,
    fontSize: 7, fontFace: FONT_BODY, color: ORANGE, bold: true, align: "right",
    charSpacing: 4, margin: 0,
  });

  // Kicker (orange small caps)
  slide.addText(kicker, {
    x: 0.55, y: 0.25, w: 6, h: 0.25,
    fontSize: 10, fontFace: FONT_BODY, color: ORANGE, bold: true,
    charSpacing: 4, margin: 0,
  });

  // Title (large bold navy)
  slide.addText(title, {
    x: 0.55, y: 0.55, w: 8.4, h: 0.75,
    fontSize: 28, fontFace: FONT_HEADER, color: NAVY, bold: true, margin: 0,
  });

  // Footer line
  slide.addShape(pres.shapes.LINE, {
    x: 0.55, y: SH - 0.4, w: SW - 1.1, h: 0,
    line: { color: LINE, width: 0.5 },
  });
  slide.addText("Yai · Investor Plan · June 2026", {
    x: 0.55, y: SH - 0.35, w: 5, h: 0.25,
    fontSize: 8, fontFace: FONT_BODY, color: SUBTEXT, margin: 0,
  });
}

// Stat card helper
function statCard(slide, x, y, w, h, label, value, sub, accentColor) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: WHITE }, line: { color: LINE, width: 0.75 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.08, h, fill: { color: accentColor }, line: { color: accentColor },
  });
  slide.addText(label, {
    x: x + 0.18, y: y + 0.08, w: w - 0.2, h: 0.22,
    fontSize: 8, color: SUBTEXT, bold: true, charSpacing: 2, margin: 0,
  });
  slide.addText(value, {
    x: x + 0.18, y: y + 0.3, w: w - 0.2, h: 0.55,
    fontSize: 26, color: NAVY, bold: true, margin: 0,
  });
  if (sub) {
    slide.addText(sub, {
      x: x + 0.18, y: y + h - 0.5, w: w - 0.2, h: 0.42,
      fontSize: 9, color: SUBTEXT, margin: 0,
    });
  }
}

function bulletBlock(slide, x, y, w, h, items, color = TEXT, fontSize = 12) {
  slide.addText(
    items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1 } })),
    { x, y, w, h, fontSize, fontFace: FONT_BODY, color, paraSpaceAfter: 6, margin: 0 }
  );
}

// ════════════════════════════════════════════════════════════
// COVER SLIDE
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: NAVY };

  // Hero image as right-half background
  const hero = img("hero.png");
  if (hero) {
    slide.addImage({ path: hero, x: 5.5, y: 0, w: 4.5, h: SH, sizing: { type: "cover", w: 4.5, h: SH } });
  }
  // Navy gradient overlay on the image side to keep text readable
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: 0, w: 4.5, h: SH, fill: { color: NAVY, transparency: 50 }, line: { color: NAVY, transparency: 100 },
  });
  // Orange accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.25, h: SH, fill: { color: ORANGE }, line: { color: ORANGE },
  });

  if (existsSync(LOGO_PATH)) {
    slide.addImage({ path: LOGO_PATH, x: 0.7, y: 0.55, w: 1.1, h: 1.1 });
  }
  slide.addText("TEXLINK TECHNOLOGIES", {
    x: 2.0, y: 0.65, w: 5, h: 0.3,
    fontSize: 13, color: WHITE, bold: true, charSpacing: 4, margin: 0,
  });
  slide.addText("STRATEGIC DTV", {
    x: 2.0, y: 0.97, w: 5, h: 0.25,
    fontSize: 9, color: ORANGE, bold: true, charSpacing: 5, margin: 0,
  });

  slide.addText("Ai-Native", {
    x: 0.7, y: 2.0, w: 5.5, h: 0.7, fontSize: 40, color: WHITE, bold: true, margin: 0,
  });
  slide.addText("Manufacturing", {
    x: 0.7, y: 2.55, w: 5.5, h: 0.7, fontSize: 40, color: WHITE, bold: true, margin: 0,
  });
  slide.addText("Intelligence", {
    x: 0.7, y: 3.10, w: 5.5, h: 0.7, fontSize: 40, color: WHITE, bold: true, margin: 0,
  });
  slide.addText("Platform.", {
    x: 0.7, y: 3.65, w: 5.5, h: 0.7, fontSize: 40, color: ORANGE, bold: true, margin: 0,
  });

  // AI MIP badge
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: 4.45, w: 0.95, h: 0.32, fill: { color: WHITE }, line: { color: WHITE }, rectRadius: 0.16,
  });
  slide.addText("AI MIP", {
    x: 0.7, y: 4.45, w: 0.95, h: 0.32,
    fontSize: 11, color: NAVY, bold: true, align: "center", valign: "middle", margin: 0,
  });

  slide.addText("Factory-tested for 5 years inside live production — opening its gates June 2026.", {
    x: 0.7, y: 4.85, w: 6.5, h: 0.4, fontSize: 11, color: "CADCFC", italic: true, margin: 0,
  });

  slide.addText("YAI · INVESTOR PLAN · JUNE 2026", {
    x: 0.7, y: SH - 0.45, w: 5, h: 0.3,
    fontSize: 8, color: WHITE, bold: true, charSpacing: 5, margin: 0,
  });
}

// ════════════════════════════════════════════════════════════
// 01 — EXECUTIVE SUMMARY (image right + stats left)
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "01 / EXECUTIVE SUMMARY", "Executive Summary");

  const hero = img("hero.png");
  if (hero) {
    slide.addImage({
      path: hero, x: 5.7, y: 1.45, w: 4.05, h: 3.65, sizing: { type: "cover", w: 4.05, h: 3.65 },
    });
  }

  slide.addText(
    "Yai is Ai MIP — Agentic Manufacturing Intelligence. A three-layer platform that modernises production from whole-paper-based to executive Ai.",
    { x: 0.55, y: 1.45, w: 5.0, h: 0.95, fontSize: 12, color: TEXT, italic: true, bold: true, margin: 0 }
  );

  statCard(slide, 0.55, 2.55, 2.50, 1.20, "AI AGENTS",   "10",       "Stand ready",          BLUE);
  statCard(slide, 3.10, 2.55, 2.50, 1.20, "ENGINEERS",   "20",       "From Cambodia",        ORANGE);
  statCard(slide, 0.55, 3.85, 2.50, 1.20, "DEVELOPMENT", "36 mo",    "Factory-tested",       GREEN);
  statCard(slide, 3.10, 3.85, 2.50, 1.20, "INDUSTRY XP", "40 yrs",   "Tech + management",    PURPLE);
}

// ════════════════════════════════════════════════════════════
// 02 — THE SANDWICH (problem image right)
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "02 / THE PROBLEM", "The Sandwich.");

  const heroImg = img("problem.png");
  if (heroImg) {
    slide.addImage({
      path: heroImg, x: 5.7, y: 1.45, w: 4.05, h: 3.65, sizing: { type: "cover", w: 4.05, h: 3.65 },
    });
  }

  slide.addText(
    "Cambodia's garment industry is squeezed between Chinese ownership / management practices and Western buyer audits — paper, Excel and 4 chat apps in the middle.",
    { x: 0.55, y: 1.45, w: 5.0, h: 1.05, fontSize: 12, color: TEXT, italic: true, margin: 0 }
  );

  statCard(slide, 0.55, 2.65, 2.50, 1.20, "FLOOR CHAOS",      "Paper",    "Tally sheets, defect tags",  ORANGE);
  statCard(slide, 3.10, 2.65, 2.50, 1.20, "LEGACY ATTEMPTS",  "$2M",      "~20 systems · none integrated", BLUE);
  statCard(slide, 0.55, 3.95, 2.50, 1.20, "COMPLIANCE",        "Mandate",  "Ministry of Environment",   GREEN);
  statCard(slide, 3.10, 3.95, 2.50, 1.20, "TIME COST",        "24 hr",    "Audit-panic binder runs",   PURPLE);
}

// ════════════════════════════════════════════════════════════
// 03 — THE SOLUTION (solution image right)
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "03 / THE SOLUTION", "An Ai Platform that Saves Jobs.");

  const sol = img("solution.png");
  if (sol) {
    slide.addImage({ path: sol, x: 5.7, y: 1.45, w: 4.05, h: 3.65, sizing: { type: "cover", w: 4.05, h: 3.65 } });
  }

  slide.addText(
    "One Ai-native platform consolidates legacy systems. Workers keep their jobs — the work gets smarter.",
    { x: 0.55, y: 1.45, w: 5.0, h: 0.7, fontSize: 12, color: TEXT, italic: true, margin: 0 }
  );

  bulletBlock(slide, 0.55, 2.20, 5.0, 2.85, [
    "One database — barcodes, QR, AIoT sensors, mobile apps. Single source of truth.",
    "Agentic layer — Claude / GPT / Gemini agents speak Khmer + run workflows for workers.",
    "Full-Ai layer — solar-powered Ai Server enables own-LLM inference + 5G bonding.",
    "Worker-respecting — every screen + voice assistant in Khmer. No HR detour.",
    "Compliance-ready — EMR, worker, tax, labour data filed digitally on time.",
  ], TEXT, 11);
}

// ════════════════════════════════════════════════════════════
// 04 — PRODUCT ARCHITECTURE (3 layer image cards)
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "04 / PRODUCT ARCHITECTURE", "From Paper to Full Ai — Three Yai Layers.");

  const layerY = 1.55;
  const layerH = 3.4;
  const layerW = 2.95;
  const gap = 0.10;

  const layers = [
    { label: "LAYER 1", title: "Digitalisation", color: ORANGE,  img: "layer-digitalization.png", body: "Centralised data — Excel + paper records flow into ONE database. Barcode + QR, AIoT, mobile apps. One source of truth." },
    { label: "LAYER 2", title: "Agentic",        color: BLUE,    img: "layer-agentic.png",        body: "LLM-powered agents. Voice-to-workflow, text interpretation, logistics optimisation, real-time Ai guidance." },
    { label: "LAYER 3", title: "Full Ai",        color: GREEN,   img: "layer-full-ai.png",        body: "Strategic management. Predictive growth, multi-factory orchestration, business expansion, global growth." },
  ];

  layers.forEach((l, i) => {
    const x = 0.55 + i * (layerW + gap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: layerY, w: layerW, h: layerH,
      fill: { color: WHITE }, line: { color: LINE, width: 0.75 },
    });
    // Image at top
    const layerImg = img(l.img);
    if (layerImg) {
      slide.addImage({
        path: layerImg, x: x + 0.05, y: layerY + 0.05, w: layerW - 0.1, h: 1.5,
        sizing: { type: "cover", w: layerW - 0.1, h: 1.5 },
      });
    }
    // Coloured stripe under image
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: layerY + 1.6, w: layerW, h: 0.42,
      fill: { color: l.color }, line: { color: l.color },
    });
    slide.addText(l.label, {
      x: x + 0.12, y: layerY + 1.62, w: layerW - 0.24, h: 0.18,
      fontSize: 7, color: WHITE, bold: true, charSpacing: 3, margin: 0,
    });
    slide.addText(l.title, {
      x: x + 0.12, y: layerY + 1.78, w: layerW - 0.24, h: 0.22,
      fontSize: 14, color: WHITE, bold: true, margin: 0,
    });
    slide.addText(l.body, {
      x: x + 0.15, y: layerY + 2.15, w: layerW - 0.3, h: layerH - 2.2,
      fontSize: 10, color: TEXT, margin: 0,
    });
  });
}

// ════════════════════════════════════════════════════════════
// 05 — AGENTS & SKILLS (grid of real agent avatars)
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "05 / AGENTS & SKILLS", "The Agents & Their Skills.");

  slide.addText("17 module families across Administration + Operations — each with its own Ai agents.", {
    x: 0.55, y: 1.45, w: 9, h: 0.3, fontSize: 11, color: TEXT, italic: true, margin: 0,
  });

  // Grid of agent avatars (rows of 12, with cluster colour ring colour-coding)
  const avatarSize = 0.55;
  const startX = 0.55, startY = 1.9;
  const cols = 12;
  const total = 24;
  const gridW = SW - 1.1;
  const cellW = gridW / cols;
  for (let i = 0; i < total; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const x = startX + c * cellW + (cellW - avatarSize) / 2;
    const y = startY + r * (avatarSize + 0.15);
    const agentImg = img(`agent-${i + 1}.png`);
    if (agentImg) {
      slide.addImage({
        path: agentImg, x, y, w: avatarSize, h: avatarSize,
        sizing: { type: "cover", w: avatarSize, h: avatarSize },
        rounding: true,
      });
    }
  }

  // 4 module-group chips at the bottom
  const chipY = 3.85, chipH = 1.20, chipGap = 0.10;
  const chipW = (SW - 1.1 - chipGap * 3) / 4;
  const chips = [
    { label: "ADMINISTRATION", count: "9 modules", color: BLUE },
    { label: "PLATFORM",       count: "1 module · core",  color: NAVY },
    { label: "OPERATIONS",     count: "8 modules", color: GREEN },
    { label: "AGENTIC ★",      count: "2 live",    color: ORANGE },
  ];
  chips.forEach((ch, i) => {
    const x = 0.55 + i * (chipW + chipGap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: chipY, w: chipW, h: chipH,
      fill: { color: WHITE }, line: { color: ch.color, width: 1.5 },
    });
    slide.addText(ch.label, {
      x: x + 0.12, y: chipY + 0.18, w: chipW - 0.24, h: 0.25,
      fontSize: 9, color: ch.color, bold: true, charSpacing: 3, margin: 0,
    });
    slide.addText(ch.count, {
      x: x + 0.12, y: chipY + 0.55, w: chipW - 0.24, h: 0.55,
      fontSize: 18, color: NAVY, bold: true, margin: 0,
    });
  });
}

// ════════════════════════════════════════════════════════════
// 06 — PRICING & PACKAGING (6-step staircase)
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "06 / PRICING & PACKAGING", "Pricing & Packaging.");

  slide.addText("Six-step staircase — land at $120 / yr, expand step by step to $5K Big Ai Brain.", {
    x: 0.55, y: 1.45, w: 9, h: 0.3, fontSize: 11, color: TEXT, italic: true, margin: 0,
  });

  const steps = [
    { step: "1", name: "Cloud Starter",     price: "$120 / yr",     sub: "5 key members",                    color: BLUE },
    { step: "2", name: "Cloud Growth",      price: "$750 / yr",     sub: "5 → 300 users",                    color: BLUE },
    { step: "3", name: "Cloud Enterprise",  price: "$1,200 / yr",   sub: "300 → 1,000 users",                color: BLUE },
    { step: "4", name: "Ai Server + Tools", price: "$2.5K + $3.5K", sub: "1,000+ users · Admin + Ops Tools", color: GREEN },
    { step: "5", name: "Agentic Add-on",    price: "$5,000 / yr",   sub: "10 agents + 35 mini",              color: PURPLE },
    { step: "6", name: "Big Ai Brain",      price: "$5,000 / yr",   sub: "Boss · 5 factories · 1 chat",      color: ORANGE },
  ];

  const sx = 0.55, sy = 1.95, sw = 1.50, sh = 3.0, sgap = 0.07;
  steps.forEach((s, i) => {
    const x = sx + i * (sw + sgap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: sy + (i % 2 === 0 ? 0 : 0.25), w: sw, h: sh, fill: { color: WHITE }, line: { color: LINE, width: 0.75 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: sy + (i % 2 === 0 ? 0 : 0.25), w: sw, h: 0.42, fill: { color: s.color }, line: { color: s.color },
    });
    slide.addText("STEP " + s.step, {
      x: x + 0.1, y: sy + (i % 2 === 0 ? 0.05 : 0.30), w: sw - 0.2, h: 0.18,
      fontSize: 7, color: WHITE, bold: true, charSpacing: 3, margin: 0,
    });
    slide.addText(s.name, {
      x: x + 0.1, y: sy + (i % 2 === 0 ? 0.22 : 0.47), w: sw - 0.2, h: 0.2,
      fontSize: 9, color: WHITE, bold: true, margin: 0,
    });
    slide.addText(s.price, {
      x: x + 0.1, y: sy + (i % 2 === 0 ? 0.55 : 0.80), w: sw - 0.2, h: 0.5,
      fontSize: 14, color: NAVY, bold: true, margin: 0,
    });
    slide.addText(s.sub, {
      x: x + 0.1, y: sy + (i % 2 === 0 ? 1.20 : 1.45), w: sw - 0.2, h: 1.7,
      fontSize: 9, color: SUBTEXT, margin: 0,
    });
  });
}

// ════════════════════════════════════════════════════════════
// 07 — TARGET CUSTOMERS (boss-meets-yai scene)
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "07 / TARGET CUSTOMERS", "Target Customers.");

  const boss = img("boss-meets-yai.png");
  if (boss) {
    slide.addImage({ path: boss, x: 5.7, y: 1.45, w: 4.05, h: 3.65, sizing: { type: "cover", w: 4.05, h: 3.65 } });
  }

  slide.addText("HK / Cambodian factory owners running 1–5 garment sites — already burned $2M+ on legacy ERPs.", {
    x: 0.55, y: 1.45, w: 5.0, h: 0.85, fontSize: 12, color: TEXT, italic: true, margin: 0,
  });

  statCard(slide, 0.55, 2.45, 2.50, 1.10, "ANCHOR",   "Cambodia",  "300+ factories",  BLUE);
  statCard(slide, 3.10, 2.45, 2.50, 1.10, "PROFILE",  "1–5 sites", "$2M+ legacy",     ORANGE);
  statCard(slide, 0.55, 3.65, 2.50, 1.10, "WORKERS",  "100K+",     "Garment workers", GREEN);
  statCard(slide, 3.10, 3.65, 2.50, 1.10, "MARKETS",  "ASEAN 3×",  "Vietnam · BD · ID", PURPLE);
}

// ════════════════════════════════════════════════════════════
// 08 — TECHNOLOGY STACK (architecture image right)
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "08 / TECHNOLOGY STACK", "Technology Stack.");

  const arch = img("architecture.png");
  if (arch) {
    slide.addImage({ path: arch, x: 5.7, y: 1.45, w: 4.05, h: 3.65, sizing: { type: "cover", w: 4.05, h: 3.65 } });
  }

  bulletBlock(slide, 0.55, 1.45, 5.0, 3.6, [
    "Backbone — Laravel + MongoDB (Ai-native shape). Write-heavy factory telemetry.",
    "Mobile — native Android + iOS, built for low-end devices on the floor.",
    "AIoT — MQTT + TUYA · SMART Gate · SMART Camera · 5G bonding for rural sites.",
    "Ai layer — LLM APIs (Claude · GPT · Gemini); agentic chat in mobile app.",
    "Edge — solar-powered mini-PC Ai Server (Step 4) for own-LLM inference.",
    "Connectivity — 5G internal WiFi mesh for workers on the floor.",
  ], TEXT, 11);
}

// ════════════════════════════════════════════════════════════
// 09 — TEAM (real portraits arranged by cluster)
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "09 / TEAM", "Engineering — 5 Clusters · 20 Engineers.");

  const clusters = [
    { name: "Texlink Admin",          color: BLUE,   members: ["daly", "phanny", "khun"] },
    { name: "Architecture",           color: ORANGE, members: ["rich", "thida", "michael", "sam"] },
    { name: "Neural Net + Finance",   color: "0A3327", members: ["virot", "menghorng", "seangleng", "noch"] },
    { name: "Mobile Apps",            color: TEAL,   members: ["samnang", "chhay", "chetra"] },
    { name: "Operations Systems",     color: "1E3A8A", members: ["dilan", "yasomi", "alen", "heang", "sokhim"] },
  ];

  const startY = 1.45;
  const rowH = 0.75;
  const portraitSize = 0.55;
  clusters.forEach((c, i) => {
    const y = startY + i * (rowH);
    // Cluster name chip (left)
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.55, y: y + 0.10, w: 2.4, h: 0.5,
      fill: { color: c.color }, line: { color: c.color },
    });
    slide.addText(c.name, {
      x: 0.65, y: y + 0.10, w: 2.2, h: 0.5,
      fontSize: 11, color: WHITE, bold: true, valign: "middle", margin: 0,
    });
    slide.addText(`${c.members.length} engineer${c.members.length === 1 ? "" : "s"}`, {
      x: 2.95, y: y + 0.10, w: 1.0, h: 0.5,
      fontSize: 9, color: SUBTEXT, italic: true, valign: "middle", margin: 0,
    });

    // Member portraits (right)
    c.members.forEach((alias, j) => {
      const p = portrait(alias);
      if (p) {
        slide.addImage({
          path: p, x: 4.05 + j * (portraitSize + 0.10), y: y + 0.05, w: portraitSize, h: portraitSize,
          sizing: { type: "cover", w: portraitSize, h: portraitSize },
          rounding: true,
        });
      }
    });
  });

  slide.addText("Cambodia-anchored · 20 engineers + Sophy + Bonus pool · ASEAN expansion Year 2.", {
    x: 0.55, y: 5.10, w: 9, h: 0.22, fontSize: 9, color: SUBTEXT, italic: true, margin: 0,
  });
}

// ════════════════════════════════════════════════════════════
// 10 — CAPITAL EFFICIENCY (capital.png + 3-column)
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "10 / CAPITAL EFFICIENCY", "The Capital Efficiency Story.");

  const cap = img("capital.png");
  if (cap) {
    slide.addImage({ path: cap, x: 5.7, y: 1.45, w: 4.05, h: 3.55, sizing: { type: "cover", w: 4.05, h: 3.55 } });
  }

  slide.addText("$205K of Cambodia engineering built what Singapore prices at $5M and the US at $10M+.", {
    x: 0.55, y: 1.45, w: 5.0, h: 0.85, fontSize: 12, color: TEXT, italic: true, margin: 0,
  });

  // 3 small stat cards on the left
  statCard(slide, 0.55, 2.45, 5.0, 0.85, "CAMBODIA  🇰🇭",     "$205K",  "Through Q2 2026 — actual build",       GREEN);
  statCard(slide, 0.55, 3.40, 5.0, 0.85, "SINGAPORE · 3×",   "$5M",    "Equivalent at SEA-tier rates",         ORANGE);
  statCard(slide, 0.55, 4.35, 5.0, 0.85, "UNITED STATES · 8×", "$10M+",  "Equivalent at US engineering rates", BLUE);
}

// ════════════════════════════════════════════════════════════
// 11 — GO-TO-MARKET MILESTONES (gtm.png + numbered milestones)
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "11 / GO-TO-MARKET MILESTONES", "Go-to-Market Milestones.");

  const gtm = img("gtm.png");
  if (gtm) {
    slide.addImage({ path: gtm, x: 5.7, y: 1.45, w: 4.05, h: 3.65, sizing: { type: "cover", w: 4.05, h: 3.65 } });
  }

  const ms = [
    { q: "Q1 · FOUNDATION",  body: "3–5 paid contracts · Anthropic CPN review cleared." },
    { q: "Q2 · VALIDATION",  body: "10+ customers · Ministry pilot signed." },
    { q: "Q3 · EXPANSION",   body: "20+ customers · regional ASEAN pilot." },
    { q: "Q4 · SCALE",       body: "30+ customers · CCAF cert · Stage 3 scoped." },
  ];
  const my = 1.65, mh = 0.78, gap = 0.08;
  ms.forEach((m, i) => {
    const y = my + i * (mh + gap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.55, y, w: 5.0, h: mh, fill: { color: SOFT_BG }, line: { color: LINE, width: 0.5 },
    });
    slide.addShape(pres.shapes.OVAL, {
      x: 0.7, y: y + 0.18, w: 0.42, h: 0.42, fill: { color: BLUE }, line: { color: BLUE },
    });
    slide.addText(String(i + 1), {
      x: 0.7, y: y + 0.18, w: 0.42, h: 0.42,
      fontSize: 14, color: WHITE, bold: true, align: "center", valign: "middle", margin: 0,
    });
    slide.addText(m.q, {
      x: 1.25, y: y + 0.12, w: 3.8, h: 0.25,
      fontSize: 10, color: BLUE, bold: true, charSpacing: 2, margin: 0,
    });
    slide.addText(m.body, {
      x: 1.25, y: y + 0.36, w: 3.8, h: 0.4,
      fontSize: 10, color: TEXT, margin: 0,
    });
  });
}

// ════════════════════════════════════════════════════════════
// 12 — TRACTION & PILOTS (workers-solution + stats)
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "12 / TRACTION & PILOTS", "Traction & Pilots.");

  const trac = img("workers-solution.png") || img("traction.png");
  if (trac) {
    slide.addImage({ path: trac, x: 5.7, y: 1.45, w: 4.05, h: 3.65, sizing: { type: "cover", w: 4.05, h: 3.65 } });
  }

  slide.addText("5 years inside live garment-factory production. Real workers. Real shifts. Real defects.", {
    x: 0.55, y: 1.45, w: 5.0, h: 0.85, fontSize: 12, color: TEXT, italic: true, margin: 0,
  });

  statCard(slide, 0.55, 2.45, 2.50, 1.10, "PILOT SITES",   "2",      "Anonymised live",        BLUE);
  statCard(slide, 3.10, 2.45, 2.50, 1.10, "YEARS RUNNING", "5 yrs",  "Continuous",             GREEN);
  statCard(slide, 0.55, 3.65, 2.50, 1.10, "AGENTIC ★",     "2",      "Car Booking · YPM/CE",   ORANGE);
  statCard(slide, 3.10, 3.65, 2.50, 1.10, "MODULE FAMILIES","18",     "All exercised on floor", PURPLE);
}

// ════════════════════════════════════════════════════════════
// 13 — OC & LIVE BUDGET (Income → Expenses → Capex → Net)
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "13 / OC & LIVE BUDGET", "OC & Live Budget Update.");

  slide.addText("Live P&L roll-up · sourced from admin (Sales · Salaries · Capex).", {
    x: 0.55, y: 1.45, w: 9, h: 0.3, fontSize: 11, color: TEXT, italic: true, margin: 0,
  });

  // 4 large cards in 2x2 grid
  const cw = 4.45, ch = 1.65, cx = 0.55, cy = 1.85, cgapX = 0.10, cgapY = 0.15;
  const cards = [
    { num: "01", tag: "INCOME",   v: "11 streams", sub: "8 SaaS + 3 e-com · Jun 2026 start", color: GREEN },
    { num: "02", tag: "EXPENSES", v: "20 active",  sub: "Engineers · salary base",            color: BLUE },
    { num: "03", tag: "CAPEX",    v: "7 cats",     sub: "Computers · Villa · Ai Fees",        color: ORANGE },
    { num: "04", tag: "NET",      v: "Live",       sub: "Income − (Salaries + Capex)",        color: NAVY },
  ];
  cards.forEach((c, i) => {
    const r = Math.floor(i / 2), col = i % 2;
    const x = cx + col * (cw + cgapX);
    const y = cy + r * (ch + cgapY);
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cw, h: ch, fill: { color: WHITE }, line: { color: LINE, width: 0.75 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.10, h: ch, fill: { color: c.color }, line: { color: c.color },
    });
    slide.addText(`${c.num} · ${c.tag}`, {
      x: x + 0.22, y: y + 0.15, w: cw - 0.3, h: 0.25,
      fontSize: 10, color: c.color, bold: true, charSpacing: 3, margin: 0,
    });
    slide.addText(c.v, {
      x: x + 0.22, y: y + 0.45, w: cw - 0.3, h: 0.65,
      fontSize: 32, color: NAVY, bold: true, margin: 0,
    });
    slide.addText(c.sub, {
      x: x + 0.22, y: y + ch - 0.45, w: cw - 0.3, h: 0.4,
      fontSize: 11, color: SUBTEXT, margin: 0,
    });
  });
}

// ════════════════════════════════════════════════════════════
// 14 — COMPETITIVE LANDSCAPE (3-column)
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "14 / COMPETITIVE LANDSCAPE", "Competitive Landscape.");

  const cols = [
    { tag: "INCUMBENT ERPs",  value: "SAP · Oracle",  sub: "English-only · $millions · 18+ months deploy · no factory floor.",  color: ORANGE },
    { tag: "DEFAULT TOOL",    value: "Excel + Chat",  sub: "Zero cost, zero integration. The chaos Yai replaces.",              color: BLUE },
    { tag: "YAI",             value: "Ai-Native MIP", sub: "Khmer-first · factory-native · Ai from day one · solar-powered Ai Server.", color: GREEN },
  ];
  const colY = 1.55, colH = 3.50, colW = 2.95, colGap = 0.10;
  cols.forEach((c, i) => {
    const x = 0.55 + i * (colW + colGap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: colY, w: colW, h: colH, fill: { color: WHITE }, line: { color: LINE, width: 0.75 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: colY, w: colW, h: 0.42, fill: { color: c.color }, line: { color: c.color },
    });
    slide.addText(c.tag, {
      x: x + 0.15, y: colY + 0.09, w: colW - 0.3, h: 0.22,
      fontSize: 9, color: WHITE, bold: true, charSpacing: 3, margin: 0,
    });
    slide.addText(c.value, {
      x: x + 0.15, y: colY + 0.55, w: colW - 0.3, h: 0.65,
      fontSize: 22, color: NAVY, bold: true, margin: 0,
    });
    slide.addText(c.sub, {
      x: x + 0.18, y: colY + 1.25, w: colW - 0.36, h: 2.0,
      fontSize: 11, color: TEXT, margin: 0,
    });
  });
}

// ════════════════════════════════════════════════════════════
// 15 — RISKS & MITIGATIONS
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "15 / RISKS & MITIGATIONS", "Risks & Mitigations.");

  const risks = [
    { r: "Adoption / change resistance", m: "Government compliance mandate + buyer audits — paper isn't optional." },
    { r: "Technical complexity",          m: "5 years of live pilot validation. Architecture proven before commercial open." },
    { r: "Capital intensity Year 1–2",    m: "$205K capital efficiency proves scale on modest funding. <$1M raise needed." },
    { r: "Geographic concentration",      m: "Cambodia is anchor not ceiling. ASEAN Year 2; global Year 4–5." },
    { r: "LLM cost / dependency",         m: "Step 4 own-Ai-Server (solar-powered) cuts inference cost + data sovereignty." },
  ];
  const ry = 1.55, rh = 0.65, gap = 0.05;
  risks.forEach((it, i) => {
    const y = ry + i * (rh + gap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.55, y, w: 9, h: rh, fill: { color: SOFT_BG }, line: { color: LINE, width: 0.5 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.55, y, w: 0.08, h: rh, fill: { color: ORANGE }, line: { color: ORANGE },
    });
    slide.addText(it.r, {
      x: 0.75, y: y + 0.05, w: 4.0, h: rh - 0.1,
      fontSize: 11, color: NAVY, bold: true, margin: 0, valign: "middle",
    });
    slide.addText(it.m, {
      x: 4.85, y: y + 0.05, w: 4.7, h: rh - 0.1,
      fontSize: 10, color: TEXT, margin: 0, valign: "middle",
    });
  });
}

// ════════════════════════════════════════════════════════════
// 16 — RESOURCE REQUIREMENTS
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "16 / RESOURCE REQUIREMENTS", "Resource Requirements.");

  const market = img("market.png");
  if (market) {
    slide.addImage({ path: market, x: 5.7, y: 1.45, w: 4.05, h: 3.65, sizing: { type: "cover", w: 4.05, h: 3.65 } });
  }

  slide.addText("Modest funding ask — Year 1–2 path to commercial open + 30+ paying customers.", {
    x: 0.55, y: 1.45, w: 5.0, h: 0.85, fontSize: 12, color: TEXT, italic: true, margin: 0,
  });

  statCard(slide, 0.55, 2.45, 5.0, 0.85, "RAISE TARGET",      "$1M",       "Year 1 runway · team scale + first 10 customers", BLUE);
  statCard(slide, 0.55, 3.40, 5.0, 0.85, "HEADCOUNT GROWTH", "20 → 60",   "Year 1 → 3 · Cambodia-anchored",                  ORANGE);
  statCard(slide, 0.55, 4.35, 5.0, 0.85, "BURN PACE",        "$30–40K",  "Per month from Jun 2026",                          GREEN);
}

// ════════════════════════════════════════════════════════════
// 17 — APPENDIX
// ════════════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "17 / APPENDIX", "Appendix.");

  slide.addText("Supporting material — demos, diagrams, references, and contact.", {
    x: 0.55, y: 1.45, w: 9, h: 0.3, fontSize: 11, color: TEXT, italic: true, margin: 0,
  });

  bulletBlock(slide, 0.55, 1.95, 9, 2.65, [
    "A1. Demo screenshots — admin dashboard + mobile agentic chat (live demos in the portal).",
    "A2. Architecture diagrams — three-layer stack + AIoT mesh.",
    "A3. Pilot factory references — anonymised, available on request under NDA.",
    "A4. Founder bio — Gamini K, Director, Texlink Technologies Co., Ltd. (Cambodia).",
  ], TEXT, 13);

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 4.7, w: 9, h: 0.55, fill: { color: SOFT_BG }, line: { color: ORANGE, width: 1 },
  });
  slide.addText("Live portal · yai-plan-production.up.railway.app · admin feeders + investor view", {
    x: 0.7, y: 4.72, w: 8.7, h: 0.5,
    fontSize: 11, color: NAVY, bold: true, valign: "middle", margin: 0,
  });
}

// ────────────────────────────────────────────────────────────
// Write file
// ────────────────────────────────────────────────────────────
const outDir = path.join(ROOT, "public", "downloads");
await fs.mkdir(outDir, { recursive: true });
const outPath = path.join(outDir, "yai-plan-deck.pptx");

await pres.writeFile({ fileName: outPath });
const stat = await fs.stat(outPath);
console.log(`✓ Built deck → ${outPath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
