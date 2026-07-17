/**
 * Generates an AI icon for every dashboard agent module using Gemini
 * image generation (gemini-2.5-flash-image), prompted by each module's
 * own function description. Keys out the white background to transparent
 * and writes square PNGs to yaikh-dashboard/public/IMG/icons/<id>.png.
 *
 * Run from yaikh-com/ (has @google/genai + sharp + GEMINI_API_KEY):
 *   node scripts/gen-agent-icons.mjs [--only=accountant,cctv] [--force]
 */

import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import { readFileSync, mkdirSync, existsSync, writeFileSync } from "node:fs";
import path from "node:path";

const MODEL = "gemini-2.5-flash-image";
const OUT_DIR = path.resolve("../yaikh-dashboard/public/IMG/icons");
const MODULE_JS = path.resolve("../yaikh-dashboard/src/data/module.js");

const ICON_STYLE =
  "Flat modern vector app icon, bold simple geometric shapes, thick clean " +
  "outlines, a warm orange (#F37021) and deep navy (#0A1F47) colour scheme " +
  "with a couple of accent colours, centered, the subject fills the whole " +
  "frame edge to edge, absolutely NO text, NO letters, NO words, NO numbers. " +
  "Plain pure solid white (#FFFFFF) background only — nothing else in the " +
  "background. Crisp, professional, single clear symbol.";

/** Parse id + description pairs out of the (nested) module.js data file.
 *  Slice the file at each `id: "..."` and pull the first description that
 *  appears before the next id — robust to nesting. */
function loadModules() {
  const src = readFileSync(MODULE_JS, "utf8");
  const idRe = /id:\s*"([^"]+)"/g;
  const marks = [];
  let m;
  while ((m = idRe.exec(src))) marks.push({ id: m[1], at: m.index });

  const out = [];
  const seen = new Set();
  for (let i = 0; i < marks.length; i++) {
    const { id, at } = marks[i];
    if (id.endsWith("-col") || id.endsWith("-section")) continue;
    if (seen.has(id)) continue;
    const end = i + 1 < marks.length ? marks[i + 1].at : src.length;
    const slice = src.slice(at, end);
    const d = slice.match(/description:\s*"((?:[^"\\]|\\.)*)"/);
    if (!d) continue;
    seen.add(id);
    out.push({ id, description: d[1].replace(/\\"/g, '"').replace(/^I\s+/, "").trim() });
  }
  return out;
}

/** White (and near-white) → transparent, then trim + square + resize. */
async function keyOutWhite(pngBuf) {
  const { data, info } = await sharp(pngBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // near-white → transparent; feather the edge a little
    if (r > 250 && g > 250 && b > 250) {
      data[i + 3] = 0;
    } else if (r > 235 && g > 235 && b > 235) {
      data[i + 3] = Math.min(data[i + 3], 90);
    }
  }
  return sharp(data, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 10 })            // crop the now-transparent margins
    .resize(320, 320, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function genOne(ai, mod) {
  const prompt = `Design an icon that represents this factory-operations role: "${mod.description}". ${ICON_STYLE}`;
  const res = await ai.models.generateContent({ model: MODEL, contents: prompt });
  const part = (res.candidates?.[0]?.content?.parts || []).find((p) => p.inlineData?.data);
  if (!part) throw new Error("no image returned");
  const raw = Buffer.from(part.inlineData.data, "base64");
  const keyed = await keyOutWhite(raw);
  writeFileSync(path.join(OUT_DIR, `${mod.id}.png`), keyed);
  return keyed.length;
}

async function main() {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");
  mkdirSync(OUT_DIR, { recursive: true });

  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const only = onlyArg ? onlyArg.split("=")[1].split(",") : null;
  const force = process.argv.includes("--force");

  let mods = loadModules();
  if (only) mods = mods.filter((m) => only.includes(m.id));
  if (!force) mods = mods.filter((m) => !existsSync(path.join(OUT_DIR, `${m.id}.png`)));

  console.log(`generating ${mods.length} icons → ${OUT_DIR}`);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  for (const mod of mods) {
    try {
      const bytes = await genOne(ai, mod);
      console.log(`  ✓ ${mod.id.padEnd(20)} ${(bytes / 1024).toFixed(0)}kb`);
    } catch (e) {
      console.log(`  ✗ ${mod.id.padEnd(20)} ${e.message?.slice(0, 80)}`);
    }
  }
  console.log("done");
}

main().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
