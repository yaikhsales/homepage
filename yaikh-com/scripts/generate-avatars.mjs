#!/usr/bin/env node
/**
 * Generate agent-card avatars for the /experience constellation via Vertex AI
 * (Google "Nano Banana" — gemini-2.5-flash-image by default).
 *
 * Runs on Vertex AI (NOT AI Studio), so usage draws on the GCP $300 free-trial
 * credit. Reuses the auth + project from yaikh-com/.env.local.
 *
 * One-time auth:
 *   gcloud auth application-default login
 *   gcloud auth application-default set-quota-project <PROJECT_ID>
 *
 * Usage:
 *   node scripts/generate-avatars.mjs                          # default theme, all modules
 *   node scripts/generate-avatars.mjs --theme=christmas        # festive variant
 *   node scripts/generate-avatars.mjs --theme=newyear
 *   node scripts/generate-avatars.mjs --theme=midautumn
 *   node scripts/generate-avatars.mjs --theme=khmernewyear
 *   node scripts/generate-avatars.mjs --limit=3                # smoke-test on 3 modules
 *   node scripts/generate-avatars.mjs --force                  # regenerate even if file exists
 *   node scripts/generate-avatars.mjs agent-28 agent-7         # specific files only
 *
 * Output (writes to the CRA SOURCE dir so a subsequent `npm run build` picks
 * them up — writing to public/experience/ directly would be overwritten by
 * the next build):
 *   default theme  → yaikh-dashboard/public/IMG/avatars/<file>.png
 *   other themes   → yaikh-dashboard/public/IMG/avatars/themes/<theme>/<file>.png
 *
 * Style: 3D Pixar-character business portrait, navy + Yai-orange brand
 * accents, head-and-shoulders, soft pastel background. Each theme adds a
 * suffix without changing the underlying character shape.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, "..");
const MONOREPO   = path.resolve(ROOT, "..");

// ── env loader ──────────────────────────────────────────────────────────────
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
  } catch { /* fine if env vars are already set */ }
}

// ── module.js parser ────────────────────────────────────────────────────────
// We can't dynamic-import module.js (it pulls in lucide-react JSX refs), so we
// regex-walk the source and pluck the fields we need. Brittle but module.js
// only changes when someone hand-edits a module, which is exactly when this
// generator should re-run anyway.
async function extractModules() {
  const src = await fs.readFile(
    path.join(MONOREPO, "yaikh-dashboard", "src", "data", "module.js"),
    "utf-8",
  );

  // Match each `{ id: "...", title: "...", image: "IMG/avatars/...", ... description: "..." }`
  // object that lives inside a `modules: [ ... ]` array.
  const out = [];
  const re = /\{\s*id:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?image:\s*"(IMG\/avatars\/[^"]+\.png)"[\s\S]*?description:\s*"([^"]+)"[\s\S]*?\}/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const [, id, title, image, description] = m;
    out.push({ id, title, image, description });
  }
  return out;
}

// ── theme catalogue ─────────────────────────────────────────────────────────
// Photorealistic LinkedIn-style corporate headshot — matches the IEWS
// constellation portrait style (client/public/agents/*.jpg). Each portrait
// represents a HUMAN professional (NOT a robot, NOT a cartoon, NOT a 3D
// character). Diverse Southeast-Asian professionals, since the deployment
// context is Cambodia.
const STYLE_BASE =
  " Photograph this person as a high-quality professional corporate " +
  "headshot, photorealistic, NOT a cartoon, NOT a 3D-render, NOT a robot — " +
  "render as a real human being. TIGHT chest-up crop — the subject MUST " +
  "fill the entire frame: face large and dominant, shoulders touching the " +
  "left/right edges, head almost touching the top edge. Minimise empty " +
  "backdrop — no more than a thin border of background visible. Centred " +
  "and facing camera, slight friendly smile, confident expression. " +
  "Modern Southeast-Asian / Cambodian-Khmer professional in their 30s, " +
  "diverse ethnicity across portraits (vary gender, hair, complexion). " +
  "Wearing a tailored business suit — navy, charcoal or mid-grey — with a " +
  "crisp shirt and a Yai-orange (#F37021) tie OR a discreet orange pocket " +
  "square as the brand accent (women: an orange silk scarf knot, or pearl " +
  "earrings with a navy blouse). MINIMAL clean studio backdrop — soft " +
  "neutral off-white / very pale grey, smooth even gradient, NO office " +
  "scene, NO plants, NO furniture, NO windows, NO desk, NO computer, NO " +
  "glass partitions, NO bokeh objects — just the subject on a clean " +
  "seamless studio background like a professional press photo. Soft even " +
  "studio lighting. Square 1:1 framing, sharp focus on the face, no text, " +
  "no logos, no watermarks.";

const THEMES = {
  default: {
    folderSlug: null,                 // overwrites IMG/avatars/ directly
    suffix:    "",                    // pure base style
  },
  christmas: {
    folderSlug: "christmas",
    suffix:
      " Theme: Christmas. Subject wears a red Santa hat tipped at a jaunty " +
      "angle, a tiny pine sprig or holly leaf pinned to the lapel, soft " +
      "twinkling out-of-focus warm-white fairy lights in the background, " +
      "gentle hint of snowfall, palette warmed slightly with festive red " +
      "and forest green accents. Keep the navy suit and Yai-orange accent.",
  },
  newyear: {
    folderSlug: "newyear",
    suffix:
      " Theme: New Year celebration. Subject wears a slim golden party hat " +
      "or a black-tie cone hat, holds nothing but a tiny gold confetti " +
      "shower drifts around them, midnight-blue background with sparkling " +
      "champagne-gold bokeh, optional subtle fireworks behind. Keep the " +
      "navy suit and Yai-orange accent.",
  },
  midautumn: {
    folderSlug: "midautumn",
    suffix:
      " Theme: Mid-Autumn Festival. Soft warm amber lighting, a glowing " +
      "red paper lantern hovering softly behind one shoulder, a full " +
      "harvest moon as a luminous pale circle in the upper background, " +
      "subtle osmanthus-blossom particles. Keep the navy suit and " +
      "Yai-orange accent.",
  },
  khmernewyear: {
    folderSlug: "khmernewyear",
    suffix:
      " Theme: Khmer New Year (Choul Chnam Thmey). Subject wears a small " +
      "traditional Cambodian sampot scarf draped lightly over the navy " +
      "suit shoulder, a single white frangipani (champei) blossom pinned " +
      "to the lapel, soft golden-hour temple-stone background with a " +
      "subtle Angkor silhouette far in the distance, warm marigold and " +
      "gold palette accents. Keep the Yai-orange brand accent.",
  },
};

// ── CLI parsing ─────────────────────────────────────────────────────────────
function parseArgs(argv) {
  let theme = "default";
  let force = false;
  let limit = 0;
  const ids = [];
  for (const arg of argv) {
    if (arg.startsWith("--theme="))     theme = arg.slice(8);
    else if (arg === "--force")         force = true;
    else if (arg.startsWith("--limit=")) limit = parseInt(arg.slice(8), 10) || 0;
    else if (!arg.startsWith("--"))     ids.push(arg.replace(/\.png$/, ""));
  }
  if (!THEMES[theme]) {
    console.error(`Unknown theme "${theme}". Options: ${Object.keys(THEMES).join(", ")}`);
    process.exit(2);
  }
  return { theme, force, limit, ids };
}

// ── image call (with retry-on-429) ──────────────────────────────────────────
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function generateOne(ai, model, prompt, { maxRetries = 6 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseModalities: ["IMAGE"] },
      });
      const part = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data);
      if (!part) throw new Error("no image in response");
      return Buffer.from(part.inlineData.data, "base64");
    } catch (err) {
      const msg = String(err?.message || err);
      const is429 = msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota");
      if (!is429 || attempt >= maxRetries) throw err;
      // Exponential backoff: 15s, 30s, 60s, 90s, 120s, 150s — Vertex image quota
      // is per-minute so wait at least 60s after the first burst.
      const wait = attempt === 0 ? 15_000 : Math.min(150_000, 30_000 * attempt);
      console.log(`    ↻ quota — retry in ${Math.round(wait/1000)}s (attempt ${attempt + 1}/${maxRetries})`);
      await sleep(wait);
      attempt++;
    }
  }
}

// ── main ────────────────────────────────────────────────────────────────────
async function main() {
  await loadDotEnv();

  const project  = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || "global";
  const model    = process.env.GEMINI_IMAGE_MODEL    || "gemini-2.5-flash-image";
  if (!project) {
    console.error("GOOGLE_CLOUD_PROJECT not set (check yaikh-com/.env.local)");
    process.exit(1);
  }

  const { theme, force, limit, ids } = parseArgs(process.argv.slice(2));
  const themeCfg = THEMES[theme];

  let modules = await extractModules();
  if (ids.length) {
    const idSet = new Set(ids);
    modules = modules.filter(m =>
      idSet.has(m.id) || idSet.has(path.basename(m.image, ".png"))
    );
  }
  if (limit > 0) modules = modules.slice(0, limit);

  if (!modules.length) {
    console.error("No modules matched.");
    process.exit(1);
  }

  // Write to the CRA SOURCE dir so a `npm run build` in yaikh-dashboard
  // copies them into yaikh-com/public/experience/IMG/avatars/. Writing
  // directly into public/experience/ would be silently overwritten by the
  // next build.
  const outDir = themeCfg.folderSlug
    ? path.join(MONOREPO, "yaikh-dashboard", "public", "IMG", "avatars", "themes", themeCfg.folderSlug)
    : path.join(MONOREPO, "yaikh-dashboard", "public", "IMG", "avatars");
  await fs.mkdir(outDir, { recursive: true });

  console.log(`▶ theme=${theme}  model=${model}  modules=${modules.length}  out=${path.relative(MONOREPO, outDir)}`);

  const ai = new GoogleGenAI({ vertexai: true, project, location });

  let done = 0, skipped = 0, failed = 0;
  // Vertex image-gen quota is per-minute and low (often 5-10 RPM on new
  // projects). Run serially with a small spacer so we stay under the limit
  // and let the per-call retry/backoff handle the rest.
  const INTER_REQUEST_MS = 8_000;

  for (let i = 0; i < modules.length; i++) {
    const mod      = modules[i];
    const fileName = path.basename(mod.image);
    const outPath  = path.join(outDir, fileName);

    if (!force) {
      try {
        await fs.access(outPath);
        skipped++;
        console.log(`  ⏭  ${fileName} (exists)`);
        continue;
      } catch { /* fall through and generate */ }
    }

    const prompt =
      `Portrait of "${mod.title}" — an AI agent whose role: ${mod.description}` +
      STYLE_BASE + themeCfg.suffix;

    try {
      const buf = await generateOne(ai, model, prompt);
      await fs.writeFile(outPath, buf);
      done++;
      console.log(`  ✓ ${fileName}  (${mod.title})  [${done + failed}/${modules.length - skipped}]`);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${fileName}  ${err.message}`);
    }

    if (i < modules.length - 1) await sleep(INTER_REQUEST_MS);
  }

  console.log(`\n▶ done=${done}  skipped=${skipped}  failed=${failed}`);
}

main().catch(e => { console.error(e); process.exit(1); });
