#!/usr/bin/env node
/**
 * Generate section hero images via Google "Nano Banana" (Gemini 2.5 Flash Image).
 *
 * Usage:
 *   1. Add GOOGLE_API_KEY=<your_key> to .env.local
 *   2. node scripts/generate-images.mjs              # generates everything
 *      node scripts/generate-images.mjs hero problem  # generates specific slugs only
 *      node scripts/generate-images.mjs --force       # regenerate even if file exists
 *
 * Output: public/images/generated/<slug>.png
 *
 * Brand notes baked into every prompt:
 *  - Royal blue (#1E4DAA) + white palette
 *  - Cambodian garment-factory context where appropriate
 *  - Editorial / investor-deck quality, no stock-photo feel
 *  - 16:9 framing
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, "..");

// Load .env.local if present (no dotenv dep — minimal hand-roll)
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
    /* .env.local not present — that's fine if env vars are already set */
  }
}

const STYLE_SUFFIX =
  " Editorial illustration style, deep royal-blue (#1E4DAA) and white palette with subtle navy and teal accents, soft cinematic lighting, clean modern feel, 16:9 wide framing, no text or logos, no watermarks, investor-presentation quality.";

const PROMPTS = [
  {
    slug: "hero",
    prompt:
      "A wide, aspirational editorial illustration of a modern Cambodian garment factory transformed by Ai — workers at sewing machines using tablets and AR overlays, soft holographic data streams floating between stations, a single executive overlooking the floor from a glass mezzanine, sunlight through large windows, a sense of order and quiet intelligence." +
      STYLE_SUFFIX,
  },
  {
    slug: "problem",
    prompt:
      "A wide editorial isometric illustration of a FRANTIC, overwhelmed back-office inside a busy Cambodian garment factory — the chaos rendered with high visual density. ALL of these are happening simultaneously in the same scene:" +
      " * a wall of overflowing filing cabinets with paper reports stacked taller than the desks, papers piled high and some sliding onto the floor;" +
      " * TWO large bound ledger books open at once on different desks, people hunched over writing in them under harsh fluorescent lighting;" +
      " * a massive wall covered in 50+ sticky notes pinned in disarray, several falling off;" +
      " * 8 to 10 smartphones on desks each showing a DIFFERENT chat-app icon (WhatsApp green, Telegram blue, WeChat green, Line green, Viber purple, KakaoTalk yellow, Messenger blue, Signal blue), chat-bubble notification overlays popping up everywhere;" +
      " * TWO managers signing different stacks of papers at the same time with pens — manual signatures, ink everywhere;" +
      " * THREE workers running through narrow corridors carrying urgent folders, motion lines showing them mid-stride;" +
      " * TWO workers waiting outside closed managers' doors with frustrated body language, thought bubbles reading 'WHERE IS THE APPROVAL?';" +
      " * THREE desks have ringing phones with vibration lines — calls coming in;" +
      " * a wall clock prominently showing late hours with a stress aura around it;" +
      " * visible through the office windows in the background: the actual garment factory floor — rows of sewing machines, tall stacks of fabric rolls, half-finished garments on hangers, workers at sewing stations;" +
      " * an overflowing printer spitting out paper, coffee cups and half-eaten food on desks, one exhausted worker slumped under stacks of paperwork. " +
      "Render from a wide isometric/bird's-eye angle so the entire mess fits in one frame. The density should feel IMMEDIATELY overwhelming and exhausting to look at — this is the chaos Yai eliminates, the contrast must hit hard. Royal-blue (#1E4DAA) and white palette with subtle navy and teal accents, slightly harsher fluorescent lighting in places to amplify the chaos, clean modern editorial illustration style, 16:9 wide framing, no logos on the artwork (thought-bubble text is fine), investor-presentation quality.",
  },
  {
    slug: "solution",
    prompt:
      "An editorial illustration of one unified Ai-native platform consolidating multiple legacy systems — a central glowing royal-blue interface in the middle, with paper, Excel grids, scattered chat bubbles, and old terminals dissolving into clean digital records flowing toward it. Garment-factory icons (sewing machines, fabric rolls) visible in the periphery." +
      STYLE_SUFFIX,
  },
  {
    slug: "architecture",
    prompt:
      "A clean editorial diagram-style illustration of a three-layer architecture stacked vertically — bottom layer 'Digitalization' (database icons, mobile devices, tablets), middle highlighted layer 'Agentic' (an Ai brain with voice and chat tendrils touching dashboards), top layer 'Full Ai' (a globe with growth charts and a stylized executive silhouette). Beneath the stack, a dashed-line 'before' panel shows paper and chat chaos being absorbed upward." +
      STYLE_SUFFIX,
  },
  {
    slug: "market",
    prompt:
      "An editorial map illustration of South-East Asia with garment-factory pins clustered in Cambodia, Vietnam, Bangladesh, and Myanmar — the Cambodia cluster glowing royal blue as the origin point, soft tendrils radiating outward to the other countries. A subtle data-flow aesthetic in the background." +
      STYLE_SUFFIX,
  },
  {
    slug: "gtm",
    prompt:
      "An editorial illustration of three reinforcing go-to-market channels meeting at a central platform — left: a founder presenting to factory owners at a seminar; middle: a handshake between a government minister and a tech founder over a digital tablet; right: garment-factory workers on their phones using a Yai worker app. The three streams converge in the centre into a single glowing royal-blue node." +
      STYLE_SUFFIX,
  },
  {
    slug: "traction",
    prompt:
      "A grounded editorial illustration of an actual Cambodian garment factory in live production — workers operating sewing machines while floor supervisors use tablets, a wall-mounted dashboard glowing with live production metrics, a manager and an owner reviewing the dashboard in the foreground. Real, working, alive — not aspirational, currently happening." +
      STYLE_SUFFIX,
  },
  {
    slug: "capital",
    prompt:
      "A striking editorial illustration of capital efficiency — a small stack of $360K representing Cambodia engineering on the left, set against towering stacks of $5M (Singapore) and $10M (US) on the right, scaled visibly. A tiny Cambodian-flag detail under the small stack. Conveys disciplined, undervalued strength rather than smug comparison." +
      STYLE_SUFFIX,
  },
  {
    slug: "team",
    prompt:
      "An editorial group illustration of a 20-person Cambodian software engineering team in a relaxed but focused workspace — diverse, mostly Cambodian, in their late twenties to forties, working on laptops with garment-factory inspired references on the walls (fabric swatches, factory blueprints, a wall display showing Ai workflows). The founder Gamini at the centre table reviewing code on a laptop." +
      STYLE_SUFFIX,
  },
];

const HELP = `Usage:
  node scripts/generate-images.mjs                  Generate every image not already on disk
  node scripts/generate-images.mjs hero problem     Generate only the listed slugs
  node scripts/generate-images.mjs --force          Regenerate everything (overwrite existing)
  node scripts/generate-images.mjs --list           Print available slugs and exit
  node scripts/generate-images.mjs --help           Show this help

Available slugs: ${PROMPTS.map(p => p.slug).join(", ")}
`;

async function main() {
  await loadDotEnv();

  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(HELP);
    return;
  }
  if (args.includes("--list")) {
    for (const p of PROMPTS) console.log(`  ${p.slug.padEnd(15)} ${p.prompt.slice(0, 80)}...`);
    return;
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("[ERROR] GOOGLE_API_KEY missing. Add it to .env.local or export it before running.");
    process.exit(1);
  }

  const force = args.includes("--force");
  const slugFilter = args.filter(a => !a.startsWith("--"));
  const tasks = slugFilter.length
    ? PROMPTS.filter(p => slugFilter.includes(p.slug))
    : PROMPTS;

  if (!tasks.length) {
    console.error(`[ERROR] No matching slugs found. Available: ${PROMPTS.map(p => p.slug).join(", ")}`);
    process.exit(1);
  }

  const outDir = path.join(ROOT, "public", "images", "generated");
  await fs.mkdir(outDir, { recursive: true });

  // Available image models from v1beta: nano-banana-pro-preview, gemini-2.5-flash-image,
  // gemini-3.1-flash-image-preview, gemini-3-pro-image-preview
  const model = process.env.GEMINI_IMAGE_MODEL || "nano-banana-pro-preview";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let okCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const { slug, prompt } of tasks) {
    const outPath = path.join(outDir, `${slug}.png`);
    if (!force) {
      try {
        await fs.access(outPath);
        console.log(`[skip] ${slug} (already exists — use --force to regenerate)`);
        skipCount++;
        continue;
      } catch { /* doesn't exist, proceed */ }
    }

    process.stdout.write(`[gen ] ${slug} ... `);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["IMAGE"] },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.log(`HTTP ${res.status}`);
        console.error(`        ${errText.slice(0, 400)}`);
        failCount++;
        continue;
      }

      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts ?? [];
      const imgPart = parts.find(p => p.inlineData || p.inline_data);
      if (!imgPart) {
        console.log("no image in response");
        console.error(`        response: ${JSON.stringify(data).slice(0, 400)}`);
        failCount++;
        continue;
      }

      const inlineData = imgPart.inlineData ?? imgPart.inline_data;
      const buf = Buffer.from(inlineData.data, "base64");
      await fs.writeFile(outPath, buf);
      const kb = (buf.length / 1024).toFixed(0);
      console.log(`OK (${kb} KB)`);
      okCount++;

      // Light pacing to avoid rate-limit hiccups on free tier
      await new Promise(r => setTimeout(r, 1200));
    } catch (e) {
      console.log(`error`);
      console.error(`        ${e.message}`);
      failCount++;
    }
  }

  console.log("");
  console.log(`Done. generated=${okCount}  skipped=${skipCount}  failed=${failCount}`);
  console.log(`Output: public/images/generated/`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
