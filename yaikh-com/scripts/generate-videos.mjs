#!/usr/bin/env node
/**
 * Generate short marketing videos via Google "Veo" on VERTEX AI.
 *
 * Runs against Vertex AI (not AI Studio) so usage draws on the GCP $300 free-trial credit.
 *
 * !! COST WARNING !! Veo is the expensive one. Veo 3 runs roughly $0.40/second of video,
 * so the $300 credit only buys ~12 minutes of video TOTAL. This script therefore does NOT
 * generate everything by default — you must name the slug(s) you want, or pass --prompt.
 *
 * Usage:
 *   1. One-time auth (uses your own Google login, no API key):
 *        gcloud auth application-default login
 *        gcloud auth application-default set-quota-project <PROJECT_ID>
 *   2. Set GOOGLE_CLOUD_PROJECT in .env.local (the project holding your $300 credit).
 *   3. Generate:
 *        node scripts/generate-videos.mjs --list                 # show built-in slugs
 *        node scripts/generate-videos.mjs hero                   # generate one built-in slug
 *        node scripts/generate-videos.mjs hero solution          # generate several
 *        node scripts/generate-videos.mjs --prompt "..." out     # ad-hoc prompt -> out.mp4
 *        node scripts/generate-videos.mjs hero --force           # overwrite existing
 *
 * Env knobs:
 *   GOOGLE_CLOUD_PROJECT   (required) project that holds the $300 credit
 *   VEO_LOCATION           region for Veo (default us-central1; Veo is region-limited)
 *   VEO_MODEL              default veo-3.1-fast-generate-preview (cheaper). For top quality:
 *                          VEO_MODEL=veo-3.1-generate-preview
 *   VEO_DURATION_SECONDS   default 8
 *   VEO_OUTPUT_GCS         optional gs:// bucket prefix; if set, output goes to GCS and the
 *                          script prints the URI instead of downloading bytes.
 *
 * Output: public/videos/generated/<slug>.mp4
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

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
    /* .env.local not present — fine if env vars are already set */
  }
}

const STYLE_SUFFIX =
  " Cinematic editorial style, deep royal-blue (#1E4DAA) and white palette, soft cinematic lighting, " +
  "smooth slow camera movement, premium investor-presentation quality, 16:9, no on-screen text or logos.";

const PROMPTS = [
  {
    slug: "hero",
    prompt:
      "A slow, aspirational push-in across the floor of a modern Cambodian garment factory transformed by AI — " +
      "workers at sewing machines glance at tablets, soft holographic data streams drift between stations, " +
      "sunlight pours through tall windows, an executive watches calmly from a glass mezzanine." +
      STYLE_SUFFIX,
  },
  {
    slug: "solution",
    prompt:
      "Scattered paper documents, Excel grids and chat bubbles gently dissolve into glowing particles that " +
      "flow inward and assemble into one clean, unified royal-blue dashboard interface at the centre of frame." +
      STYLE_SUFFIX,
  },
  {
    slug: "market",
    prompt:
      "An elegant animated map of South-East Asia; a royal-blue glow ignites over Cambodia, then soft light " +
      "tendrils radiate outward to Vietnam, Bangladesh and Myanmar, leaving a subtle data-flow trail." +
      STYLE_SUFFIX,
  },
];

const HELP = `Usage:
  node scripts/generate-videos.mjs --list              Show built-in slugs and exit
  node scripts/generate-videos.mjs hero                Generate one built-in slug
  node scripts/generate-videos.mjs hero solution       Generate several built-in slugs
  node scripts/generate-videos.mjs --prompt "..." name Generate an ad-hoc prompt -> name.mp4
  node scripts/generate-videos.mjs hero --force        Overwrite existing files
  node scripts/generate-videos.mjs --help              Show this help

COST: Veo ~ $0.40/sec — the $300 credit is only ~12 min of video. Generate sparingly.

Available slugs: ${PROMPTS.map(p => p.slug).join(", ")}
`;

async function main() {
  await loadDotEnv();

  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) { console.log(HELP); return; }
  if (args.includes("--list")) {
    for (const p of PROMPTS) console.log(`  ${p.slug.padEnd(12)} ${p.prompt.slice(0, 80)}...`);
    return;
  }

  const project = process.env.GOOGLE_CLOUD_PROJECT;
  if (!project) {
    console.error("[ERROR] GOOGLE_CLOUD_PROJECT missing. Set it in .env.local (the project that holds your $300 credit).");
    console.error("        Then run: gcloud auth application-default login");
    process.exit(1);
  }

  // Veo is region-limited; "global" is not valid for Veo. Default to us-central1.
  const location = process.env.VEO_LOCATION || "us-central1";
  const model    = process.env.VEO_MODEL || "veo-3.1-fast-generate-preview";
  const durationSeconds = Number(process.env.VEO_DURATION_SECONDS || 8);
  const outputGcsUri = process.env.VEO_OUTPUT_GCS || undefined;

  const ai = new GoogleGenAI({ vertexai: true, project, location });
  console.log(`[info] Vertex AI  project=${project}  location=${location}  model=${model}  dur=${durationSeconds}s`);

  const force = args.includes("--force");

  // Build the task list: either an ad-hoc --prompt, or named built-in slugs.
  let tasks;
  const promptIdx = args.indexOf("--prompt");
  if (promptIdx !== -1) {
    const adhocPrompt = args[promptIdx + 1];
    const name = args.find((a, i) => !a.startsWith("--") && i !== promptIdx + 1) || "adhoc";
    if (!adhocPrompt) { console.error("[ERROR] --prompt needs a quoted prompt string after it."); process.exit(1); }
    tasks = [{ slug: name, prompt: adhocPrompt }];
  } else {
    const slugFilter = args.filter(a => !a.startsWith("--"));
    if (!slugFilter.length) {
      console.error("[ERROR] Name at least one slug (cost safety — won't auto-generate all videos).");
      console.error(HELP);
      process.exit(1);
    }
    tasks = PROMPTS.filter(p => slugFilter.includes(p.slug));
    if (!tasks.length) {
      console.error(`[ERROR] No matching slugs. Available: ${PROMPTS.map(p => p.slug).join(", ")}`);
      process.exit(1);
    }
  }

  const outDir = path.join(ROOT, "public", "videos", "generated");
  await fs.mkdir(outDir, { recursive: true });

  let okCount = 0, skipCount = 0, failCount = 0;

  for (const { slug, prompt } of tasks) {
    const outPath = path.join(outDir, `${slug}.mp4`);
    if (!force) {
      try { await fs.access(outPath); console.log(`[skip] ${slug} (exists — use --force)`); skipCount++; continue; }
      catch { /* doesn't exist, proceed */ }
    }

    console.log(`[gen ] ${slug} ... starting Veo job (this can take a few minutes)`);
    try {
      let operation = await ai.models.generateVideos({
        model,
        prompt,
        config: {
          aspectRatio: "16:9",
          numberOfVideos: 1,
          durationSeconds,
          ...(outputGcsUri ? { outputGcsUri } : {}),
        },
      });

      // Poll the long-running operation until the video is ready.
      while (!operation.done) {
        await new Promise(r => setTimeout(r, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
        process.stdout.write(".");
      }
      process.stdout.write("\n");

      const videos = operation.response?.generatedVideos ?? [];
      if (!videos.length) {
        console.log(`       no video returned`);
        console.error(`       response: ${JSON.stringify(operation.response).slice(0, 400)}`);
        failCount++;
        continue;
      }

      const v = videos[0].video ?? videos[0];
      if (v?.videoBytes) {
        const buf = Buffer.from(v.videoBytes, "base64");
        await fs.writeFile(outPath, buf);
        const mb = (buf.length / (1024 * 1024)).toFixed(2);
        console.log(`[ok  ] ${slug} -> ${path.relative(ROOT, outPath)} (${mb} MB)`);
        okCount++;
      } else if (v?.uri) {
        // GCS output (because VEO_OUTPUT_GCS was set, or the model returned a URI).
        console.log(`[ok  ] ${slug} -> ${v.uri}  (stored in GCS; download with: gsutil cp "${v.uri}" "${outPath}")`);
        okCount++;
      } else {
        console.log(`       video object had neither bytes nor uri`);
        console.error(`       video: ${JSON.stringify(v).slice(0, 400)}`);
        failCount++;
      }
    } catch (e) {
      console.log(`[fail] ${slug}`);
      console.error(`       ${e?.message || e}`);
      failCount++;
    }
  }

  console.log("");
  console.log(`Done. generated=${okCount}  skipped=${skipCount}  failed=${failCount}`);
  console.log(`Output: public/videos/generated/`);
}

main().catch(e => { console.error(e); process.exit(1); });
