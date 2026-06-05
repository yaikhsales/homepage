#!/usr/bin/env node
/**
 * Build the Yai investor pitch deck (PPTX).
 *   node scripts/build-deck.mjs
 * Output: public/downloads/yai-plan-deck.pptx
 *
 * 1 cover slide + 17 content slides matching the public plan portal.
 * Brand: royal blue #1E4DAA, white, orange #F37021 accents.
 */

import path from "node:path";
import fs from "node:fs/promises";
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

const LOGO_PATH = path.join(ROOT, "public/images/yai-logo.jpg");

// Reusable footer + header brand strip on content slides
// Logo intentionally omitted from content slides — text brand line is enough,
// and embedding the 300KB logo on every slide bloats the file to 6MB.
function addBrandFrame(slide, kicker, title) {
  // Left orange accent bar — matches sidebar active-section marker
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: SH, fill: { color: ORANGE }, line: { color: ORANGE },
  });

  // Brand line top-right
  slide.addText("TEXLINK TECHNOLOGIES", {
    x: 7.6, y: 0.30, w: 2.0, h: 0.20,
    fontSize: 8, fontFace: FONT_BODY, color: NAVY, bold: true, align: "right",
    charSpacing: 3, margin: 0,
  });
  slide.addText("STRATEGIC DTV", {
    x: 7.6, y: 0.50, w: 2.0, h: 0.20,
    fontSize: 7, fontFace: FONT_BODY, color: ORANGE, bold: true, align: "right",
    charSpacing: 4, margin: 0,
  });

  // Kicker (orange small caps)
  slide.addText(kicker, {
    x: 0.55, y: 0.45, w: 6, h: 0.3,
    fontSize: 10, fontFace: FONT_BODY, color: ORANGE, bold: true,
    charSpacing: 4, margin: 0,
  });

  // Title (large bold navy)
  slide.addText(title, {
    x: 0.55, y: 0.75, w: 8.4, h: 0.85,
    fontSize: 30, fontFace: FONT_HEADER, color: NAVY, bold: true, margin: 0,
  });

  // Footer line
  slide.addShape(pres.shapes.LINE, {
    x: 0.55, y: SH - 0.45, w: SW - 1.1, h: 0,
    line: { color: LINE, width: 0.5 },
  });
  slide.addText("Yai · Investor Plan · June 2026", {
    x: 0.55, y: SH - 0.4, w: 4, h: 0.25,
    fontSize: 8, fontFace: FONT_BODY, color: SUBTEXT, margin: 0,
  });
}

/** Small content card (used for stat/bullet blocks) */
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
      x: x + 0.18, y: y + h - 0.4, w: w - 0.2, h: 0.32,
      fontSize: 9, color: SUBTEXT, margin: 0,
    });
  }
}

/** Bullet block at given position */
function bulletBlock(slide, x, y, w, h, items, color = TEXT) {
  slide.addText(
    items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1 } })),
    { x, y, w, h, fontSize: 13, fontFace: FONT_BODY, color, paraSpaceAfter: 6, margin: 0 }
  );
}

// ────────────────────────────────────────────────────────────
// COVER SLIDE
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: NAVY };

  // Decorative gradient-like overlay using a soft blue rectangle (no native gradients)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 6, y: 0, w: 4, h: SH, fill: { color: BLUE, transparency: 60 }, line: { color: BLUE, transparency: 100 },
  });
  // Orange accent bar — left edge
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.25, h: SH, fill: { color: ORANGE }, line: { color: ORANGE },
  });

  // Yai logo
  try {
    slide.addImage({ path: LOGO_PATH, x: 0.7, y: 0.6, w: 1.2, h: 1.2 });
  } catch { /* skip */ }

  // Brand line
  slide.addText("TEXLINK TECHNOLOGIES", {
    x: 2.1, y: 0.7, w: 5, h: 0.3,
    fontSize: 14, fontFace: FONT_BODY, color: WHITE, bold: true,
    charSpacing: 4, margin: 0,
  });
  slide.addText("STRATEGIC DTV", {
    x: 2.1, y: 1.05, w: 5, h: 0.25,
    fontSize: 10, fontFace: FONT_BODY, color: ORANGE, bold: true,
    charSpacing: 5, margin: 0,
  });

  // Title
  slide.addText("Ai-Native Manufacturing", {
    x: 0.7, y: 2.3, w: 8.6, h: 0.8,
    fontSize: 42, fontFace: FONT_HEADER, color: WHITE, bold: true, margin: 0,
  });
  slide.addText("Intelligence Platform.", {
    x: 0.7, y: 3.0, w: 8.6, h: 0.8,
    fontSize: 42, fontFace: FONT_HEADER, color: WHITE, bold: true, margin: 0,
  });

  // Small AI MIP badge
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: 4.0, w: 1.0, h: 0.32, fill: { color: WHITE }, line: { color: WHITE }, rectRadius: 0.16,
  });
  slide.addText("AI MIP", {
    x: 0.7, y: 4.0, w: 1.0, h: 0.32,
    fontSize: 11, fontFace: FONT_BODY, color: NAVY, bold: true, align: "center", valign: "middle", margin: 0,
  });

  // Tagline
  slide.addText("Factory-tested for 5 years inside live production facilities — opening its gates to the industry June 2026.", {
    x: 0.7, y: 4.45, w: 8.6, h: 0.5,
    fontSize: 12, fontFace: FONT_BODY, color: "CADCFC", italic: true, margin: 0,
  });

  // Footer / date
  slide.addText("YAI  ·  INVESTOR PLAN  ·  JUNE 2026", {
    x: 0.7, y: SH - 0.55, w: 8.6, h: 0.3,
    fontSize: 9, fontFace: FONT_BODY, color: WHITE, bold: true,
    charSpacing: 5, margin: 0,
  });
}

// ────────────────────────────────────────────────────────────
// 01 — EXECUTIVE SUMMARY
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "01 / EXECUTIVE SUMMARY", "Executive Summary");

  slide.addText(
    "Yai is Ai MIP — Agentic Manufacturing Intelligence. A three-layer platform that modernises a production unit from a whole-paper-based operation into executive Ai.",
    { x: 0.55, y: 1.7, w: 9, h: 0.7, fontSize: 13, color: TEXT, italic: true, bold: true, margin: 0 }
  );

  // 4 stat cards in a row
  statCard(slide, 0.55, 2.55, 2.10, 1.5, "AI AGENTS",        "10",      "Stand ready",                 BLUE);
  statCard(slide, 2.80, 2.55, 2.10, 1.5, "ENGINEERS",        "20",      "From Cambodia",               ORANGE);
  statCard(slide, 5.05, 2.55, 2.10, 1.5, "DEVELOPMENT",      "36 mo",   "Factory-tested",              GREEN);
  statCard(slide, 7.30, 2.55, 2.15, 1.5, "INDUSTRY XP",      "40 yrs",  "Technical + management",      PURPLE);

  // Bottom strip
  slide.addText("Three Yai layers stacked on top:  Digitalisation  →  Agentic  →  Full Ai", {
    x: 0.55, y: 4.30, w: 9, h: 0.3, fontSize: 11, color: NAVY, bold: true, margin: 0,
  });
  bulletBlock(slide, 0.55, 4.65, 9, 0.8, [
    "Digitalisation — paper, Excel and chat replaced by one database + barcode/QR/AIoT + mobile apps.",
    "Agentic — LLM-powered intelligent agents process voice + text, run logistics, refine workflows.",
    "Full Ai — strategic management, predictive growth, multi-factory orchestration, global expansion.",
  ]);
}

// ────────────────────────────────────────────────────────────
// 02 — THE PROBLEM (The Sandwich)
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "02 / THE PROBLEM", "The Sandwich.");

  slide.addText(
    "Cambodia's garment industry is squeezed between Chinese ownership/management practices and Western buyer demands — paper, Excel and scattered chat apps in the middle.",
    { x: 0.55, y: 1.7, w: 9, h: 0.7, fontSize: 13, color: TEXT, italic: true, margin: 0 }
  );

  // 3 cards: chaos | failed software | compliance
  statCard(slide, 0.55, 2.55, 2.95, 2.10, "FACTORY FLOOR",   "Paper",    "Bundle tallies, defect tags, attendance registers, hand-written OT slips, 4 chat apps per buyer.",  ORANGE);
  statCard(slide, 3.70, 2.55, 2.95, 2.10, "LEGACY ATTEMPTS", "$2M",      "~20 ERP / MES / HR / payroll systems bought. None integrated, none updated.",                       BLUE);
  statCard(slide, 6.85, 2.55, 2.60, 2.10, "COMPLIANCE",       "Mandate", "Cambodian Ministry of Environment now requires digital filing. Late = penalty.",                  GREEN);

  slide.addText("Lost INFORMATION  ·  Lost EFFICIENCY  ·  No SUSTAINABILITY", {
    x: 0.55, y: 4.78, w: 9, h: 0.3,
    fontSize: 11, color: NAVY, bold: true, margin: 0, charSpacing: 2,
  });
}

// ────────────────────────────────────────────────────────────
// 03 — THE SOLUTION
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "03 / THE SOLUTION", "An Ai Platform that Saves Jobs.");

  slide.addText(
    "One Ai-native platform consolidates legacy systems — paper, Excel and chat apps flow into one source of truth. Workers keep their jobs; the work gets smarter.",
    { x: 0.55, y: 1.7, w: 9, h: 0.7, fontSize: 13, color: TEXT, italic: true, margin: 0 }
  );

  bulletBlock(slide, 0.55, 2.55, 9, 2.5, [
    "One database — barcodes, QR scanners, AIoT sensors, mobile apps, tablets — single source of truth.",
    "Agentic layer — Claude/GPT/Gemini-powered agents speak Khmer, refine workflows, talk to HR for workers.",
    "Full-Ai layer — solar-powered Ai Server unlocks own-LLM inference; 5G bonding for rural factories.",
    "Worker-respecting — every screen and voice assistant speaks Khmer. No HR detour. No duplicate forms.",
    "Compliance-ready — digital worker data, EMR, tax filings, labour reports — filed on time, every time.",
  ]);
}

// ────────────────────────────────────────────────────────────
// 04 — PRODUCT ARCHITECTURE
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "04 / PRODUCT ARCHITECTURE", "From Paper to Full Ai — Three Yai Layers.");

  // 3 horizontal layer cards
  const layerY = 1.8;
  const layerH = 3.0;
  const layerW = 2.95;
  const gap = 0.1;

  const layers = [
    { label: "LAYER 1", title: "Digitalisation", color: ORANGE, body: "Centralised data — Excel + paper records flow into ONE database. Barcode + QR scanners, AIoT sensors, mobile apps, tablets. Initial workflow streamlining, one source of truth." },
    { label: "LAYER 2", title: "Agentic",         color: BLUE,   body: "LLM-powered intelligent agents. Voice-to-workflow, text instructions interpreted by LLM, geolocation + logistics optimisation, intuitive dashboards, real-time Ai guidance refining workflows." },
    { label: "LAYER 3", title: "Full Ai",         color: GREEN,  body: "Strategic management + growth. Higher-level decision-making, predictive business growth, multi-factory management, business expansion, global growth." },
  ];

  layers.forEach((l, i) => {
    const x = 0.55 + i * (layerW + gap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: layerY, w: layerW, h: layerH,
      fill: { color: WHITE }, line: { color: LINE, width: 0.75 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: layerY, w: layerW, h: 0.5,
      fill: { color: l.color }, line: { color: l.color },
    });
    slide.addText(l.label, {
      x: x + 0.15, y: layerY + 0.07, w: layerW - 0.3, h: 0.18,
      fontSize: 8, color: WHITE, bold: true, charSpacing: 3, margin: 0,
    });
    slide.addText(l.title, {
      x: x + 0.15, y: layerY + 0.25, w: layerW - 0.3, h: 0.3,
      fontSize: 16, color: WHITE, bold: true, margin: 0,
    });
    slide.addText(l.body, {
      x: x + 0.18, y: layerY + 0.7, w: layerW - 0.36, h: layerH - 0.85,
      fontSize: 11, color: TEXT, margin: 0,
    });
  });

  slide.addText("Each step right of TODAY (Q2 2026) is value added on the same engineering base.", {
    x: 0.55, y: 4.95, w: 9, h: 0.25, fontSize: 10, color: SUBTEXT, italic: true, margin: 0,
  });
}

// ────────────────────────────────────────────────────────────
// 05 — AGENTS & SKILLS
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "05 / AGENTS & SKILLS", "The Agents & Their Skills.");

  slide.addText("17 module families across Administration and Operations groups — each with its own Ai skills.", {
    x: 0.55, y: 1.7, w: 9, h: 0.4, fontSize: 12, color: TEXT, italic: true, margin: 0,
  });

  // Two columns: Admin (blue) + Ops (green)
  const adminModules = [
    "Admin Core · PR · Shop · Approvals · APP",
    "HR · Pay · Org · LMS · Ai CCTV",
    "Digital Audit · 8S · AIoT · Waste",
    "Gate Pass · CTPAT",
    "Car Booking  ★ AGENTIC",
    "Accounting (Full + GDT)",
    "Speak Up · Worker Voice",
    "Corporate Financials + IEWS",
    "Cambodia E-Gov + E-Invoice",
  ];
  const opsModules = [
    "Platform · Laravel + Mongo + Mobile + AIoT + Ai Server",
    "YTM · Machine Maintenance + TPM Shop",
    "YQMS · Quality Mgmt (6 stages + Fini Check)",
    "YPI · Technical Specs (3-language)",
    "YPM / CE · Motion · SMV  ★ AGENTIC",
    "Product Dev · Sample Room",
    "4DP · Planning Brain (4 dirs × 4 levels)",
    "MRP + Logistics (Inbound + Outbound)",
    "YWIP · 13-Dept Production Flow",
  ];

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 2.25, w: 4.4, h: 2.85, fill: { color: SOFT_BG }, line: { color: BLUE, width: 1 },
  });
  slide.addText("ADMINISTRATION", {
    x: 0.7, y: 2.35, w: 4, h: 0.25, fontSize: 9, color: BLUE, bold: true, charSpacing: 3, margin: 0,
  });
  bulletBlock(slide, 0.7, 2.62, 4.1, 2.4, adminModules, TEXT);

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.05, y: 2.25, w: 4.4, h: 2.85, fill: { color: SOFT_BG }, line: { color: GREEN, width: 1 },
  });
  slide.addText("PLATFORM + OPERATIONS", {
    x: 5.2, y: 2.35, w: 4, h: 0.25, fontSize: 9, color: GREEN, bold: true, charSpacing: 3, margin: 0,
  });
  bulletBlock(slide, 5.2, 2.62, 4.1, 2.4, opsModules, TEXT);
}

// ────────────────────────────────────────────────────────────
// 06 — PRICING & PACKAGING
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "06 / PRICING & PACKAGING", "Pricing & Packaging.");

  slide.addText("Six-step staircase — land at $120 / yr, expand to $5K Big Ai Brain as the customer commits.", {
    x: 0.55, y: 1.7, w: 9, h: 0.4, fontSize: 12, color: TEXT, italic: true, margin: 0,
  });

  const steps = [
    { step: "1", name: "Cloud Starter",      price: "$120 / yr",      sub: "5 key members",                    color: BLUE },
    { step: "2", name: "Cloud Growth",       price: "$750 / yr",      sub: "5 → 300 users",                    color: BLUE },
    { step: "3", name: "Cloud Enterprise",   price: "$1,200 / yr",    sub: "300 → 1,000 users",                color: BLUE },
    { step: "4", name: "Ai Server + Tools",  price: "$2,500 + $3.5K", sub: "1,000+ users · Admin + Ops Tools", color: GREEN },
    { step: "5", name: "Agentic Add-on",     price: "$5,000 / yr",    sub: "10 agents + 35 mini-agents",       color: PURPLE },
    { step: "6", name: "Big Ai Brain",       price: "$5,000 / yr",    sub: "Boss · 5 factories · 1 chat",      color: ORANGE },
  ];

  const sx = 0.55, sy = 2.30, sw = 1.50, sh = 2.55, sgap = 0.07;
  steps.forEach((s, i) => {
    const x = sx + i * (sw + sgap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: sy, w: sw, h: sh, fill: { color: WHITE }, line: { color: LINE, width: 0.75 },
    });
    // Step number tab on top
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: sy, w: sw, h: 0.42, fill: { color: s.color }, line: { color: s.color },
    });
    slide.addText("STEP " + s.step, {
      x: x + 0.1, y: sy + 0.05, w: sw - 0.2, h: 0.18,
      fontSize: 7, color: WHITE, bold: true, charSpacing: 3, margin: 0,
    });
    slide.addText(s.name, {
      x: x + 0.1, y: sy + 0.22, w: sw - 0.2, h: 0.2,
      fontSize: 9, color: WHITE, bold: true, margin: 0,
    });
    slide.addText(s.price, {
      x: x + 0.1, y: sy + 0.55, w: sw - 0.2, h: 0.5,
      fontSize: 14, color: NAVY, bold: true, margin: 0,
    });
    slide.addText(s.sub, {
      x: x + 0.1, y: sy + sh - 1.4, w: sw - 0.2, h: 1.2,
      fontSize: 9, color: SUBTEXT, margin: 0,
    });
  });
}

// ────────────────────────────────────────────────────────────
// 07 — TARGET CUSTOMERS
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "07 / TARGET CUSTOMERS", "Target Customers.");

  slide.addText("Hong-Kong / Cambodian factory owners running 1–5 garment sites — already burned $2M+ on legacy ERPs that don't talk to each other.", {
    x: 0.55, y: 1.7, w: 9, h: 0.7, fontSize: 13, color: TEXT, italic: true, margin: 0,
  });

  statCard(slide, 0.55, 2.55, 2.95, 1.5, "ANCHOR MARKET",  "Cambodia",  "300+ addressable factories",  BLUE);
  statCard(slide, 3.70, 2.55, 2.95, 1.5, "BUYER PROFILE",  "1–5 sites", "$2M+ legacy spend, frustrated", ORANGE);
  statCard(slide, 6.85, 2.55, 2.60, 1.5, "WORKER REACH",   "100K+",      "Garment workers per platform", GREEN);

  bulletBlock(slide, 0.55, 4.20, 9, 1.05, [
    "Big-tech segments: Anthropic CPN · Google Cloud APAC · JICA · ADB / IFC · ABA + Wing.",
    "Mid-size factory cohort: 50–500-machine sewing lines, ready for digital lift-off.",
    "Workers: pay-rate awareness, Khmer-first interface, no-HR-queue self-service.",
  ]);
}

// ────────────────────────────────────────────────────────────
// 08 — TECHNOLOGY STACK
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "08 / TECHNOLOGY STACK", "Technology Stack.");

  bulletBlock(slide, 0.55, 1.85, 9, 0.7, [
    "Backbone — Laravel + MongoDB (Ai-native data shape). Solid for write-heavy factory telemetry.",
  ]);
  bulletBlock(slide, 0.55, 2.45, 9, 0.7, [
    "Mobile — native Android + iOS apps for workers, supervisors, owners. Built for low-end devices.",
  ]);
  bulletBlock(slide, 0.55, 3.05, 9, 0.7, [
    "AIoT — MQTT + TUYA · SMART Gate · SMART Camera · 5G bonding for rural factories · 5G WiFi for workers.",
  ]);
  bulletBlock(slide, 0.55, 3.65, 9, 0.7, [
    "Ai layer — LLM APIs (Claude · GPT · Gemini); agentic chat in mobile app; own Ai Server option.",
  ]);
  bulletBlock(slide, 0.55, 4.25, 9, 0.7, [
    "Edge — solar-powered mini-PC Ai Server (Step 4); 5G internal WiFi mesh for workers on the floor.",
  ]);
}

// ────────────────────────────────────────────────────────────
// 09 — TEAM
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "09 / TEAM", "Engineering — 5 Clusters · 20 Engineers.");

  slide.addText("Cambodia-based. Each cluster owns its slice of the platform end-to-end.", {
    x: 0.55, y: 1.7, w: 9, h: 0.4, fontSize: 12, color: TEXT, italic: true, margin: 0,
  });

  const clusters = [
    { name: "Texlink Admin",      sub: "HR · Sales · Training",        color: BLUE,    pct: "60/20/20" },
    { name: "Architecture",       sub: "HR sys · Pay sys",             color: ORANGE,  pct: "70/30"    },
    { name: "Neural Net + Finance", sub: "Financial · Admin",          color: "0A3327", pct: "70/30"   },
    { name: "Mobile Apps",        sub: "Android · iOS · Worker apps",  color: "14B8A6", pct: "60/20/20" },
    { name: "Operations Systems", sub: "Production · QA · MRP · YPI · YTM", color: "1E3A8A", pct: "80/20" },
  ];

  const cy = 2.25, ch = 2.75, cw = 1.78, cgap = 0.08;
  clusters.forEach((c, i) => {
    const x = 0.55 + i * (cw + cgap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: cy, w: cw, h: ch, fill: { color: WHITE }, line: { color: LINE, width: 0.75 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: cy, w: cw, h: 0.55, fill: { color: c.color }, line: { color: c.color },
    });
    slide.addText("GROUP " + (i + 1), {
      x: x + 0.1, y: cy + 0.08, w: cw - 0.2, h: 0.18,
      fontSize: 7, color: WHITE, bold: true, charSpacing: 3, margin: 0,
    });
    slide.addText(c.name, {
      x: x + 0.1, y: cy + 0.25, w: cw - 0.2, h: 0.28,
      fontSize: 10, color: WHITE, bold: true, margin: 0,
    });
    slide.addText(c.sub, {
      x: x + 0.1, y: cy + 0.65, w: cw - 0.2, h: 1.4,
      fontSize: 9, color: TEXT, margin: 0,
    });
    slide.addText(c.pct, {
      x: x + 0.1, y: cy + ch - 0.6, w: cw - 0.2, h: 0.45,
      fontSize: 18, color: c.color, bold: true, align: "center", margin: 0,
    });
    slide.addText("skill / xp mix", {
      x: x + 0.1, y: cy + ch - 0.25, w: cw - 0.2, h: 0.2,
      fontSize: 7, color: SUBTEXT, italic: true, align: "center", margin: 0,
    });
  });

  slide.addText("19 engineers in 5 clusters + Sophy + Bonus pool · Cambodia-anchored, ASEAN expansion from Year 2.", {
    x: 0.55, y: 5.10, w: 9, h: 0.25, fontSize: 9, color: SUBTEXT, italic: true, margin: 0,
  });
}

// ────────────────────────────────────────────────────────────
// 10 — CAPITAL EFFICIENCY
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "10 / CAPITAL EFFICIENCY", "The Capital Efficiency Story.");

  slide.addText("$205K of Cambodia engineering built what Singapore would price at $5M and the US at $10M.", {
    x: 0.55, y: 1.7, w: 9, h: 0.7, fontSize: 13, color: TEXT, italic: true, margin: 0,
  });

  // 3-column comparison
  const colY = 2.55, colH = 2.40, colW = 2.95, colGap = 0.10;
  const cols = [
    { tag: "CAMBODIA · 🇰🇭", value: "$205K", sub: "Through Q2 2026 (today). Engineering + early hardware. 5-year live pilots.", color: GREEN },
    { tag: "SINGAPORE · 3×", value: "$5M",   sub: "Equivalent build cost at SEA-tier salaries.",                                color: ORANGE },
    { tag: "UNITED STATES · 8×", value: "$10M+", sub: "Equivalent build cost at US engineering rates.",                          color: BLUE },
  ];
  cols.forEach((c, i) => {
    const x = 0.55 + i * (colW + colGap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: colY, w: colW, h: colH, fill: { color: WHITE }, line: { color: LINE, width: 0.75 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: colY, w: 0.1, h: colH, fill: { color: c.color }, line: { color: c.color },
    });
    slide.addText(c.tag, {
      x: x + 0.2, y: colY + 0.15, w: colW - 0.3, h: 0.22,
      fontSize: 8, color: c.color, bold: true, charSpacing: 2, margin: 0,
    });
    slide.addText(c.value, {
      x: x + 0.2, y: colY + 0.40, w: colW - 0.3, h: 0.9,
      fontSize: 40, color: NAVY, bold: true, margin: 0,
    });
    slide.addText(c.sub, {
      x: x + 0.2, y: colY + 1.35, w: colW - 0.3, h: 1.0,
      fontSize: 10, color: TEXT, margin: 0,
    });
  });

  slide.addText("Projected through Q2 2027: ~$349K cumulative spend (salaries + capex + buffer).", {
    x: 0.55, y: 5.05, w: 9, h: 0.25, fontSize: 9, color: SUBTEXT, italic: true, margin: 0,
  });
}

// ────────────────────────────────────────────────────────────
// 11 — GO-TO-MARKET MILESTONES
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "11 / GO-TO-MARKET MILESTONES", "Go-to-Market Milestones.");

  const ms = [
    { q: "Q1 · FOUNDATION",  body: "3–5 paid contracts. Anthropic CPN application + initial review cleared." },
    { q: "Q2 · VALIDATION",  body: "10+ customers. Ministry of Environment digital-compliance pilot signed." },
    { q: "Q3 · EXPANSION",   body: "20+ customers. Regional ASEAN pilot (Vietnam or Bangladesh)." },
    { q: "Q4 · SCALE",       body: "30+ customers. Stage 3 funding round scoped. CCAF certification achieved." },
  ];

  const my = 1.95, mh = 0.78, gap = 0.12;
  ms.forEach((m, i) => {
    const y = my + i * (mh + gap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.55, y, w: 9, h: mh, fill: { color: SOFT_BG }, line: { color: LINE, width: 0.5 },
    });
    slide.addShape(pres.shapes.OVAL, {
      x: 0.7, y: y + 0.18, w: 0.42, h: 0.42, fill: { color: BLUE }, line: { color: BLUE },
    });
    slide.addText(String(i + 1), {
      x: 0.7, y: y + 0.18, w: 0.42, h: 0.42,
      fontSize: 14, color: WHITE, bold: true, align: "center", valign: "middle", margin: 0,
    });
    slide.addText(m.q, {
      x: 1.25, y: y + 0.12, w: 7.8, h: 0.25,
      fontSize: 11, color: BLUE, bold: true, charSpacing: 2, margin: 0,
    });
    slide.addText(m.body, {
      x: 1.25, y: y + 0.38, w: 7.8, h: 0.4,
      fontSize: 11, color: TEXT, margin: 0,
    });
  });
}

// ────────────────────────────────────────────────────────────
// 12 — TRACTION & PILOTS
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "12 / TRACTION & PILOTS", "Traction & Pilots.");

  slide.addText("5 years inside live garment-factory production. Real workers. Real shifts. Real defects. Real data.", {
    x: 0.55, y: 1.7, w: 9, h: 0.7, fontSize: 13, color: TEXT, italic: true, margin: 0,
  });

  statCard(slide, 0.55, 2.60, 2.95, 1.55, "PILOT SITES",     "2",       "Anonymised live factories",   BLUE);
  statCard(slide, 3.70, 2.60, 2.95, 1.55, "YEARS RUNNING",   "5 yrs",   "Continuous in-production use", GREEN);
  statCard(slide, 6.85, 2.60, 2.60, 1.55, "AGENTIC MODULES", "2 ★",     "Car Booking · YPM/CE",          ORANGE);

  bulletBlock(slide, 0.55, 4.30, 9, 1.0, [
    "All 18 module families exercised on the floor — not a sandbox build.",
    "Dashboards run live for owners + managers; tablets in supervisors' hands; mobile apps in workers' pockets.",
    "Operational evidence available for buyer / investor reference calls.",
  ]);
}

// ────────────────────────────────────────────────────────────
// 13 — OC & LIVE BUDGET UPDATE
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "13 / OC & LIVE BUDGET", "OC & Live Budget Update.");

  slide.addText("Live P&L roll-up · sourced from admin (Sales · Salaries · Capex). Income → Expenses → Capex → Net.", {
    x: 0.55, y: 1.7, w: 9, h: 0.4, fontSize: 12, color: TEXT, italic: true, margin: 0,
  });

  statCard(slide, 0.55, 2.30, 2.20, 2.50, "01 · INCOME",   "11",      "Streams · 8 SaaS + 3 e-com",     GREEN);
  statCard(slide, 2.95, 2.30, 2.20, 2.50, "02 · EXPENSES", "20",      "Active engineers · salary base", BLUE);
  statCard(slide, 5.35, 2.30, 2.20, 2.50, "03 · CAPEX",    "7 cats",  "Computers · Villa · Ai fees",    ORANGE);
  statCard(slide, 7.75, 2.30, 1.70, 2.50, "04 · NET",      "Today",   "Income − (Salaries + Capex)",    NAVY);

  slide.addText("Section 13 is live — investors can drill into Income / Expenses / Capex / Net at any time on the portal.", {
    x: 0.55, y: 4.90, w: 9, h: 0.25, fontSize: 9, color: SUBTEXT, italic: true, margin: 0,
  });
}

// ────────────────────────────────────────────────────────────
// 14 — COMPETITIVE LANDSCAPE
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "14 / COMPETITIVE LANDSCAPE", "Competitive Landscape.");

  const colY = 1.85, colH = 3.30, colW = 2.95, colGap = 0.10;
  const cols = [
    { tag: "INCUMBENT ERPs",   value: "SAP · Oracle",   sub: "English-only · $millions to deploy · 18+ months · no factory floor.", color: ORANGE },
    { tag: "DEFAULT TOOL",     value: "Excel + Chat",   sub: "Zero cost, zero integration. The chaos Yai is built to replace.",   color: BLUE },
    { tag: "YAI",              value: "Ai-Native MIP",  sub: "Khmer-first · Cambodia-anchored · factory-native · Ai from day one · solar-powered Ai Server.", color: GREEN },
  ];
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
      x: x + 0.18, y: colY + 1.25, w: colW - 0.36, h: 1.9,
      fontSize: 11, color: TEXT, margin: 0,
    });
  });
}

// ────────────────────────────────────────────────────────────
// 15 — RISKS & MITIGATIONS
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "15 / RISKS & MITIGATIONS", "Risks & Mitigations.");

  const risks = [
    { r: "Slow adoption / change resistance", m: "Anchor on government compliance mandate + buyer audits — paper isn't optional anymore." },
    { r: "Technical complexity overwhelms team", m: "5 years of live pilot validation. Architecture proven before commercial open." },
    { r: "Capital intensity in Year 1–2", m: "$205K capital efficiency proves we can scale on modest funding. Path to $5M revenue with under $1M raised." },
    { r: "Geographic concentration in Cambodia", m: "Cambodia is anchor not ceiling. ASEAN expansion Year 2; global Year 4–5." },
    { r: "LLM cost / dependency", m: "Step 4 own-Ai-Server (solar-powered) cuts inference cost + sovereignty for factory data." },
  ];
  const ry = 1.85, rh = 0.65, gap = 0.05;
  risks.forEach((it, i) => {
    const y = ry + i * (rh + gap);
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.55, y, w: 9, h: rh, fill: { color: SOFT_BG }, line: { color: LINE, width: 0.5 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.55, y, w: 0.08, h: rh, fill: { color: ORANGE }, line: { color: ORANGE },
    });
    slide.addText(it.r, {
      x: 0.75, y: y + 0.08, w: 4.0, h: rh - 0.1,
      fontSize: 11, color: NAVY, bold: true, margin: 0, valign: "middle",
    });
    slide.addText(it.m, {
      x: 4.85, y: y + 0.08, w: 4.7, h: rh - 0.1,
      fontSize: 10, color: TEXT, margin: 0, valign: "middle",
    });
  });
}

// ────────────────────────────────────────────────────────────
// 16 — RESOURCE REQUIREMENTS
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "16 / RESOURCE REQUIREMENTS", "Resource Requirements.");

  slide.addText("Modest funding ask — Year 1–2 path to commercial open and 30+ paying customers.", {
    x: 0.55, y: 1.7, w: 9, h: 0.4, fontSize: 12, color: TEXT, italic: true, margin: 0,
  });

  statCard(slide, 0.55, 2.40, 2.95, 2.30, "RAISE TARGET",   "$1M",   "Year 1 runway: team scale + first 10 customers.",      BLUE);
  statCard(slide, 3.70, 2.40, 2.95, 2.30, "HEADCOUNT GROWTH", "20 → 60", "Year 1 → Year 3. Cambodia-anchored.",              ORANGE);
  statCard(slide, 6.85, 2.40, 2.60, 2.30, "BURN PACE",      "$30–40K", "Per month from Jun 2026. Cambodia salary efficiency.", GREEN);

  bulletBlock(slide, 0.55, 4.85, 9, 0.4, [
    "Use of funds: 60% engineering + sales hires · 25% Ai-Server hardware build-out · 15% ASEAN sales travel + GTM.",
  ]);
}

// ────────────────────────────────────────────────────────────
// 17 — APPENDIX
// ────────────────────────────────────────────────────────────
{
  const slide = pres.addSlide();
  slide.background = { color: WHITE };
  addBrandFrame(slide, "17 / APPENDIX", "Appendix.");

  slide.addText("Supporting material — demos, diagrams, references, and contact.", {
    x: 0.55, y: 1.7, w: 9, h: 0.4, fontSize: 12, color: TEXT, italic: true, margin: 0,
  });

  bulletBlock(slide, 0.55, 2.30, 9, 0.7, [
    "A1. Demo screenshots — admin dashboard + mobile agentic chat. Live demos in the portal.",
  ]);
  bulletBlock(slide, 0.55, 2.85, 9, 0.7, [
    "A2. Architecture diagrams — three-layer stack + AIoT mesh.",
  ]);
  bulletBlock(slide, 0.55, 3.40, 9, 0.7, [
    "A3. Pilot factory references — anonymised. Available on request under NDA.",
  ]);
  bulletBlock(slide, 0.55, 3.95, 9, 0.7, [
    "A4. Founder bio — Gamini K, Director, Texlink Technologies Co., Ltd. (Cambodia).",
  ]);

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 4.75, w: 9, h: 0.5, fill: { color: SOFT_BG }, line: { color: ORANGE, width: 1 },
  });
  slide.addText("Live portal · admin/sales/salaries/capex feeders + investor view · yai-plan-production.up.railway.app", {
    x: 0.7, y: 4.78, w: 8.7, h: 0.45,
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
console.log(`✓ Built deck → ${outPath}`);
