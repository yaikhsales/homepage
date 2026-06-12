#!/usr/bin/env node
/**
 * Generate the 4 "Accounting evolution" frames for the Impact cinema via
 * Vertex AI Gemini image model — photorealistic, NOT cartoon/SVG.
 *
 * Frames: acc-today.png · acc-l1.png · acc-l2.png · acc-l3.png
 * Same auth + env mechanics as scripts/regenerate-l1.mjs.
 *
 * Usage: node scripts/generate-acc.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, "..");

async function loadDotEnv() {
  const envPath = path.join(ROOT, ".env.local");
  try {
    const text = await fs.readFile(envPath, "utf-8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let value = m[2];
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (process.env[m[1]] === undefined) process.env[m[1]] = value;
    }
  } catch { /* fine if env already set */ }
}

await loadDotEnv();

const PROJECT  = process.env.GOOGLE_CLOUD_PROJECT;
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "global";
const MODEL    = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

if (!PROJECT) {
  console.error("✗ GOOGLE_CLOUD_PROJECT not set.");
  process.exit(1);
}

const STYLE = `STYLE — applies to every detail:
 * PHOTOREALISTIC editorial photography look. Real people, real office, natural skin tones, realistic lighting. NOT a cartoon, NOT an illustration, NOT isometric, NOT flat vector.
 * Cambodian garment-factory accounting office setting. Staff in smart-casual office wear.
 * Brand palette accents: cool blue tones dominate the environment (#1E4DAA navy-blue), with warm orange (#F37021) appearing only as small accents (folder spines, screen highlights, lanyards).
 * 16:9 wide framing, investor-presentation quality, cinematic depth of field. No text watermark, no logos.`;

const FRAMES = [
  {
    out: "acc-today.png",
    prompt: `Photorealistic scene: an overwhelmed accountant in a garment factory office BEFORE digitalisation.

 * A tired Cambodian accountant at a desk completely buried in PAPER: tall stacks of ledger books, binders, voucher piles, receipts in trays. A desktop calculator with paper roll, rubber stamps, carbon-copy invoice books.
 * Filing cabinets overflowing behind. A colleague carrying another armful of folders toward the desk.
 * Fluorescent office lighting, slightly cluttered and stressful atmosphere — but realistic, like documentary photography of a real factory office in 2015.

${STYLE}`,
  },
  {
    out: "acc-l1.png",
    prompt: `Photorealistic scene: the SAME garment-factory accounting office after DIGITALIZATION (Layer 1).

 * The desk is now CLEAN — zero paper. The same accountant sits upright typing data into an accounting form on a large desktop monitor: a clear ERP voucher-entry screen with input fields, dropdowns and a submit button visible.
 * She is clicking a mouse and typing — manual data entry, but digital. A second monitor shows a simple spreadsheet-style ledger.
 * Modern office feel: tidy desk, a tablet docked at the side, a barcode scanner. Filing cabinets in the background now mostly empty, one small neat folder tray.
 * Bright, calmer lighting than the paper era — visible relief, but the human is still doing all the clicking.

${STYLE}`,
  },
  {
    out: "acc-l2.png",
    prompt: `Photorealistic scene: the SAME accounting office in the AGENTIC era (Layer 2) — Ai agents do the processing.

 * The accountant now sits back RELAXED with a cup of coffee, supervising. The main monitor shows an Ai assistant chat panel processing a queue of vouchers BY ITSELF — rows of entries getting green check-marks one after another, an "auto-posted" status column.
 * A subtle glowing blue Ai assistant orb/avatar on screen. Her hand rests on a tablet showing one approval request — a single tap to confirm.
 * No keyboard frenzy, no paper: the machine works, the human confirms. Office is calm, modern, blue-lit screens.

${STYLE}`,
  },
  {
    out: "acc-l3.png",
    prompt: `Photorealistic scene: the SAME accountant in the FULL AI era (Layer 3) — analysis instead of data entry.

 * The accountant now stands in front of a large wall display in a small meeting room, PRESENTING insights to two managers: the screen shows rich financial analytics — cash-flow forecast curves trending up, cost breakdowns, a large "99.9% accuracy" KPI badge, predictive budget scenarios.
 * She gestures at the forecast chart confidently — her role has become analyst/advisor, not clerk.
 * Premium, slightly darker executive-room lighting with the screens glowing blue, small warm orange accents in the charts.

${STYLE}`,
  },
];

const ai = new GoogleGenAI({ vertexai: true, project: PROJECT, location: LOCATION });

for (const f of FRAMES) {
  const OUT = path.join(ROOT, "public", "images", f.out);
  console.log(`→ Generating ${f.out} ...`);
  const t0 = Date.now();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: f.prompt }] }],
  });
  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  const imgPart = parts.find((p) => p.inlineData?.data || p.inline_data?.data);
  if (!imgPart) {
    console.error(`✗ No image for ${f.out}. Response:`, JSON.stringify(response).slice(0, 500));
    process.exit(2);
  }
  const data = imgPart.inlineData?.data || imgPart.inline_data?.data;
  const buf  = Buffer.from(data, "base64");
  await fs.writeFile(OUT, buf);
  console.log(`✓ ${f.out} (${(buf.length / 1024).toFixed(0)} KB) in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}
console.log("✓ All 4 accounting frames done.");
