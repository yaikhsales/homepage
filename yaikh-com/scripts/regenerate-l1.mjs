#!/usr/bin/env node
/**
 * One-shot: regenerate Layer 1 (Digitalization) scene image via Vertex AI
 * Gemini image model, with explicit colour direction: orange data hub +
 * orange workflow arrows on a cool-blue factory scene.
 *
 * Drives the same GCP $300 credit account as yai-plan/scripts/generate-images.mjs.
 * Requires:
 *   gcloud auth application-default login (one-time)
 *   gcloud auth application-default set-quota-project <PROJECT_ID>
 *   GOOGLE_CLOUD_PROJECT set in .env.local
 *
 * Usage: node scripts/regenerate-l1.mjs
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
  } catch {
    /* .env.local not present — okay if env already set */
  }
}

await loadDotEnv();

const PROJECT  = process.env.GOOGLE_CLOUD_PROJECT;
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "global";
const MODEL    = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

if (!PROJECT) {
  console.error("✗ GOOGLE_CLOUD_PROJECT not set (in .env.local or env).");
  process.exit(1);
}

const OUT = path.join(ROOT, "public", "images", "dream-l1.png");

const PROMPT = `Wide editorial isometric illustration of a Cambodian garment factory in the digitalization stage of an Ai manufacturing platform.

VISUAL COLOUR DIRECTION — strict and important:
 * The CENTRAL ELEMENT is a glowing ORANGE data hub / database cylinder at the heart of the factory floor, emitting warm orange light. This is the most visually dominant element.
 * ORANGE workflow arrows flow OUTWARD from the data hub to every department of the factory floor — sewing, cutting, finishing, packing, audit. The arrows are clearly orange (#F37021), glowing, with labels like "WRAP", "BSCI", "ILO", "Log Audit Evidence", "Load Module Data", "Finishing Data", "Uptime".
 * EVERY OTHER ELEMENT of the scene — workers in uniforms, sewing machines, cutting tables, AIoT sensors, mobile tablets, barcode scanners, fabric rolls, packing benches, walls, floor, ceiling, dashboards on monitors — is rendered in COOL BLUE tones (royal blue #1E4DAA, navy, slate, teal). NO warm tones anywhere except the central orange hub + its arrows.
 * Workers wear blue uniforms. Skin tones natural. Background is cool blue with darker navy shadows.

ACTION ELEMENTS:
 * Workers at sewing machines holding tablets that connect by orange data streams to the central hub.
 * Cutting room with markers and pattern files flowing into the hub as orange beams.
 * A "Sustainability KPI" dashboard panel on the right wall showing paper saved, CO2 reduced, traceability score — all rendered in blue with orange highlight bars.
 * Inspector with a clipboard captioned "WRAP / BSCI / ILO Log Audit Evidence" in orange tag chips.

STYLE:
 * Editorial illustration, isometric perspective, clean modern look, 16:9 wide framing, no text watermark, no logos, investor-presentation quality.
 * Two-tone brand palette ONLY: blue + orange. No reds, no browns, no warm woods.`;

const ai = new GoogleGenAI({
  vertexai: true,
  project:  PROJECT,
  location: LOCATION,
});

console.log(`→ Generating Layer 1 image (model=${MODEL}, project=${PROJECT})`);
const t0 = Date.now();

const response = await ai.models.generateContent({
  model: MODEL,
  contents: [{ role: "user", parts: [{ text: PROMPT }] }],
});

// Find the inline image part
const parts = response?.candidates?.[0]?.content?.parts ?? [];
const imgPart = parts.find((p) => p.inlineData?.data || p.inline_data?.data);
if (!imgPart) {
  console.error("✗ No image in response. Full response:");
  console.error(JSON.stringify(response, null, 2));
  process.exit(2);
}
const data = imgPart.inlineData?.data || imgPart.inline_data?.data;
const buf  = Buffer.from(data, "base64");

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, buf);

const dt = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`✓ Saved ${OUT} (${(buf.length / 1024).toFixed(0)} KB) in ${dt}s`);
