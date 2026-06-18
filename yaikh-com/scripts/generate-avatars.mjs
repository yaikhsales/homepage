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
  //
  // CRITICAL: the gap between fields uses [^{}] (no braces) so the regex
  // can't accidentally span a parent group { id: "billing-col" ... modules: [ {
  // id: "purchase-request" ... image: "..." } ] } and capture the OUTER id
  // with the INNER image. The all-[\s\S]*? gap had that bug, which is why
  // PERSONA_OVERRIDES["purchase-request"] never matched (mod.id was
  // "billing-col"). Restricting to non-brace chars forces the match to
  // stay inside one object literal.
  const out = [];
  const re = /\{\s*id:\s*"([^"]+)",[^{}]*?title:\s*"([^"]+)",[^{}]*?image:\s*"(IMG\/avatars\/[^"]+\.png)"[^{}]*?description:\s*"([^"]+)"[^{}]*?\}/g;
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
// character). Diverse SE-Asian / Khmer faces, deliberately varied.

// 30-slot diversity cycle for ~39 agents. Every slot is meant to feel like
// a visibly DIFFERENT person — not just a clothes/hair tweak on the same
// face. Mixes ethnicity broadly (Khmer, Khmer-Chinese, Khmer-Indian,
// Khmer-Vietnamese, Khmer-Thai, Khmer-Lao, Khmer-French, Khmer-Japanese,
// expat South-Asian, expat Filipina), ages 28–62, and distinctive
// physical anchors (jawline, complexion, hair texture, glasses style,
// small unique features) so the model produces faces that can't be
// confused at thumbnail size.
const DIVERSITY_VARIANTS = [
  // — Women
  "28-year-old Cambodian-Khmer woman, long straight black hair parted in the middle, almond eyes, no glasses, soft golden complexion, gentle smile, small mole near upper lip",
  "34-year-old Khmer-Chinese woman, sharp bob haircut to chin length, pale porcelain complexion, no glasses, narrow eyes, faint dimples",
  "41-year-old Khmer-Indian woman, deeply tanned warm complexion, thick wavy dark hair pulled back in a low ponytail, large expressive dark eyes, gold stud earrings, no glasses",
  "47-year-old Cambodian-Khmer woman, distinguished short pixie cut already greying at the front, tortoise-shell cat-eye reading glasses, confident slight smile, warm olive skin, faint laugh lines",
  "31-year-old Khmer-Vietnamese woman, long layered hair below the shoulders, oval face, light freckles across the nose bridge, round wire-frame glasses, fair complexion",
  "55-year-old Cambodian-Khmer woman, elegant grey-and-white short hair styled in soft waves, no glasses, deep warm complexion, dignified composed look, pearl drop earrings",
  "29-year-old Filipina-Khmer woman, naturally curly shoulder-length hair, golden-brown skin, full lips, no glasses, bright direct gaze",
  "38-year-old Khmer-Japanese woman, neat blunt-cut bob just above the shoulders, very fair complexion, monolid eyes, no glasses, restrained calm expression",
  "44-year-old Cambodian-Khmer woman, long hair worn down with a slight wave, medium brown highlights, light warm complexion, square dark-frame glasses, faint smile lines",
  "33-year-old Khmer-Thai woman, side-swept asymmetric short hair, sun-kissed honey complexion, no glasses, small nose stud, easy confident smile",
  "50-year-old Cambodian-Khmer woman, salt-and-pepper hair in a chic short cut, no glasses, warm brown complexion, strong jawline, motherly assured expression",
  "27-year-old Cambodian-Khmer woman, very long straight hair past the shoulders, fair golden complexion, no glasses, fresh youthful look, small heart-shaped face",
  "42-year-old Khmer-Indian woman, long dark hair in a single braid pulled forward over one shoulder, rich umber complexion, intelligent calm eyes, no glasses",
  "36-year-old Khmer-French woman, light brown wavy hair styled in loose curls, hazel-green eyes, fair complexion with light freckles, no glasses, warm half-smile",
  "60-year-old Cambodian-Khmer woman, fully grey hair in a neat short cut, deep warm brown complexion, kind crinkled eyes, no glasses, grandmotherly authority",
  // — Men
  "30-year-old Cambodian-Khmer man, very short cropped hair, clean-shaven, warm light-brown complexion, square jaw, no glasses, direct friendly gaze",
  "45-year-old Khmer-Chinese man, side-parted hair just starting to grey at the temples, pale complexion, rectangular dark-rimmed glasses, slim build, intellectual look",
  "39-year-old Khmer-Indian man, full neatly trimmed beard, deep mahogany complexion, thick black hair styled back, no glasses, strong brow, warm assured smile",
  "52-year-old Cambodian-Khmer man, distinguished salt-and-pepper hair, weathered tan complexion, no glasses, executive confidence, slight smile lines",
  "28-year-old Khmer-Vietnamese man, modern undercut hairstyle longer on top, light stubble, fair complexion, no glasses, fresh youthful confidence",
  "48-year-old Cambodian-Khmer man, fully bald with a neatly trimmed dark goatee, deep warm complexion, no glasses, calm grounded presence",
  "35-year-old Khmer-Thai man, longer wavy black hair styled back, sun-kissed olive complexion, no facial hair, no glasses, easy magnetic smile",
  "57-year-old Cambodian-Khmer man, fully grey hair worn longer, neat full grey beard, warm tanned complexion, gold-rimmed half-moon glasses, sage-like wise expression",
  "33-year-old Filipino-Khmer man, short curly black hair, brown complexion, clean-shaven, no glasses, broad shoulders hint, warm open smile",
  "41-year-old Khmer-Lao man, short neat hair with side part, light olive complexion, light moustache, no glasses, friendly approachable look",
  "62-year-old Cambodian-Khmer man, fully silver hair, weathered warm complexion, no glasses, deep set eyes with crinkles, statesman gravitas",
  "29-year-old Cambodian-Khmer man, very tidy short black hair, clean-shaven, fair complexion, no glasses, bright energetic young-professional vibe",
  "46-year-old Khmer-Japanese man, neat short hair greying lightly at the sides, narrow monolid eyes, pale complexion, no glasses, restrained calm presence",
  "37-year-old South-Asian expat man (Indian heritage living in Cambodia), thick dark hair styled back, deep brown complexion, full neat beard, dark-rimmed round glasses, articulate look",
  "54-year-old Cambodian-Khmer man, short greying hair, neat moustache only (no beard), warm tan complexion, no glasses, fatherly authoritative smile",
];

const STYLE_BASE =
  " Photograph this person as a high-quality professional corporate " +
  "headshot, photorealistic, NOT a cartoon, NOT a 3D-render, NOT a robot — " +
  "render as a real human being. TIGHT chest-up crop — the subject MUST " +
  "fill the entire frame: face large and dominant, shoulders touching the " +
  "left/right edges, head almost touching the top edge. Minimise empty " +
  "backdrop — no more than a thin border of background visible. Centred " +
  "and facing camera, slight friendly smile, confident expression. " +
  "Subject is BARE-HEADED — absolutely NO cap, NO hat, NO turban, NO " +
  "headwear of any kind, unless an attire override explicitly demands one. " +
  "MINIMAL clean studio backdrop — soft neutral off-white / very pale " +
  "grey, smooth even gradient, NO office, NO plants, NO furniture, NO " +
  "windows, NO desk, NO bokeh objects. Soft even studio lighting. Square " +
  "1:1 framing, sharp focus on the face, no text, no logos, no watermarks.";

// Module-specific persona overrides — replaces the diversity-cycle persona
// when a particular agent should look a specific way. Matched by `mod.id`.
const PERSONA_OVERRIDES = {
  sop:   "mid-30s Cambodian-Khmer woman, neat hair pulled back in a low bun, calm authoritative expression, no glasses",
  "e-gov": "early-40s Cambodian-Khmer woman, shoulder-length hair, dignified composed expression, subtle makeup",
  // Refinements from user feedback:
  waste:
    "38-year-old Cambodian-Khmer MAN (definitely male), neat short jet-black hair, light golden complexion, no facial hair, no glasses, environmentally-conscious calm grounded expression",
  "purchase-request":
    "Mr. Pichara Lim, a 50-year-old Cambodian-Khmer MAN (gender: male, masculine features, square jaw, strong brow). Khmer ethnicity — warm honey-brown complexion typical of Cambodian Phnom Penh professionals, wider rounded Khmer face shape, distinctive Khmer cheekbones. Short neatly side-parted jet-black hair with subtle salt-and-pepper greying at the temples. Clean-shaven (no beard, no moustache). No glasses. Dignified procurement-veteran calm expression. This is unambiguously a Khmer man — do NOT render a woman, do NOT render Indian or African features.",
  yhr:
    "35-year-old Cambodian-Khmer woman (NOT Indian, NOT South-Asian — NO bindi, NO sari), shoulder-length straight black hair, fair Khmer complexion, almond eyes, no glasses, gentle approachable HR-professional smile",
  "support-ticket":
    "Mr. Borey Chea, a 32-year-old Cambodian-Khmer MAN (gender: male). Distinctly Khmer features — warm golden-tan Phnom Penh complexion, wider rounded Khmer face shape with strong cheekbones, dark espresso-brown almond-shaped eyes. Tidy short jet-black hair with a clean side part. Clean-shaven (no beard, no moustache, no facial hair of any kind). No glasses. Warm friendly helpful customer-service smile. Khmer-Cambodian, NOT South-Asian.",
  "salary-bill":
    "36-year-old Eurasian man of Cambodian-French heritage, mixed Khmer + European features — lighter olive complexion, hazel-brown eyes, light-brown wavy hair styled neatly, slim European nose with Khmer cheekbones, clean-shaven, no glasses, polished payroll-officer look",
  "shipping-bill":
    "45-year-old Eurasian woman of Cambodian-British heritage, mixed features — fair complexion with a subtle Khmer warmth, soft ash-blonde streaks through medium-brown hair worn at shoulder length, hazel-green eyes, no glasses, composed logistics-manager expression",
  // Round 2 — break the "two near-identical East-Asian women" pattern:
  "meeting-room":
    "29-year-old Cambodian-Khmer woman (DEFINITELY Khmer, NOT Japanese, NOT Chinese, NOT Korean), warm sun-kissed Cambodian complexion, distinctively Khmer wider rounded face shape with strong cheekbones, full natural lips, dark espresso-brown eyes (NOT monolid), thick wavy black hair worn loose past the shoulders with a centre part, single small gold hoop earrings, no glasses, bright welcoming meeting-coordinator smile",
  mrp:
    "Mr. Sokha Vann, a 48-year-old Cambodian-Khmer FATHER and HUSBAND. He is a man. Masculine bone structure: broad square jaw, strong brow ridge, prominent masculine nose, visible Adam's apple, no makeup. Warm tan weathered Khmer complexion from years on factory floors. Very short military-style black hair greying at the temples. Thick black moustache (no beard). Broad shoulders, masculine chest. No glasses. Calm authoritative production-veteran expression. This is unambiguously a man — do NOT render a woman.",
  // Air — environmental monitoring agent, was rendering as African-American.
  // Anchor as Cambodian-Khmer for regional consistency.
  air:
    "Mr. Veasna Ros, a 36-year-old Cambodian-Khmer MAN (gender: male). Warm sun-tanned Khmer complexion from outdoor environmental monitoring work. Wider rounded Khmer face with distinctive Cambodian cheekbones. Short neat jet-black hair, clean-shaven (no beard, no moustache). Broad shoulders. No glasses. Calm observant expression. Cambodian-Khmer ethnicity — NOT African, NOT South-Asian, NOT East-Asian.",
};

// Module-specific appearance overrides — replaces the default business-suit
// instruction when the role demands a uniform. Matched by `mod.id`.
const APPEARANCE_OVERRIDES = {
  sop:
    " Wear the formal uniform of a Cambodian National Police officer: " +
    "dark-navy uniform tunic with shoulder epaulettes, white shirt and " +
    "navy tie, polished metal badge on the chest, ribbon bars over the " +
    "left breast pocket. NO cap, NO hat — head bare. " +
    "Skip the business-suit description above.",
  "e-gov":
    " Wear the formal Cambodian civil-servant uniform: light khaki or " +
    "olive government-administrator uniform shirt with shoulder bars and " +
    "embroidered ministry insignia on the chest, dignified posture. Skip " +
    "the business-suit description above.",
  cctv:
    " Wear a navy security-supervisor uniform with an embroidered " +
    "monitoring-control patch, a thin black tie, and a discreet earpiece. " +
    "Skip the business-suit description above.",
  "fire-alarm":
    " Wear a professional fire-marshal officer uniform: dark-red " +
    "fire-services tunic with reflective trim and shoulder epaulettes, " +
    "white shirt underneath. Skip the business-suit description above.",
};

// Default attire (used when no override matches).
const DEFAULT_ATTIRE =
  " Wear a tailored business suit — navy, charcoal or mid-grey — with a " +
  "crisp shirt and a Yai-orange (#F37021) tie if male, OR an orange silk " +
  "scarf knot at the collar if female. Keep the Yai-orange accent visible.";

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

    // Pull a deterministic but well-distributed slot — `i * 7 % len` walks
    // the persona table in a stride of 7 so adjacent agents in the module
    // list never share the same slot, breaking the "all the women in the
    // Admin column look identical" failure mode.
    const slot    = (i * 7) % DIVERSITY_VARIANTS.length;
    const persona = PERSONA_OVERRIDES[mod.id]
      || DIVERSITY_VARIANTS[slot];
    const attire  = APPEARANCE_OVERRIDES[mod.id] || DEFAULT_ATTIRE;
    // Lead the prompt with the PERSON, not the role. The model tends to
    // anchor on whatever comes first; if "AI agent named X" leads, every
    // output drifts toward a generic professional. Anchoring on the
    // specific human description forces visible variation.
    const prompt =
      `Photorealistic corporate headshot of a real human being: ${persona}. ` +
      `This person is depicted as the AI agent "${mod.title}" whose role is: ${mod.description}. ` +
      `Their face MUST visibly match every detail of the description above — ` +
      `do NOT default to a generic 30s smiling professional.` +
      attire + STYLE_BASE + themeCfg.suffix;

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
