#!/usr/bin/env node
/**
 * Resize every avatar PNG in yaikh-dashboard/public/IMG/avatars/ from
 * Vertex's 1024×1024 output down to 512×512 and re-encode as a tight PNG.
 *
 * Why: cards display at 80×80 (~160px on retina), so 1024×1024 PNGs are
 * pure git/network bloat. Shrinking to 512×512 keeps the headshots crisp
 * on retina while cutting the on-disk payload by ~70%.
 *
 * Usage: node scripts/optimize-avatars.mjs
 *
 * Borrows sharp from yai-plan/node_modules so we don't need to install
 * another copy in yaikh-com.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, "..");
const MONOREPO   = path.resolve(ROOT, "..");

// Borrow yai-plan's sharp installation. On Windows, ESM dynamic import
// requires file:// URLs for absolute paths, not raw drive-letter paths.
const sharpPath = path.join(MONOREPO, "yai-plan", "node_modules", "sharp", "lib", "index.js");
const sharp = (await import(pathToFileURL(sharpPath).href)).default;

const AVATARS_DIR = path.join(MONOREPO, "yaikh-dashboard", "public", "IMG", "avatars");

const files = (await fs.readdir(AVATARS_DIR))
  .filter(f => f.endsWith(".png"))
  .filter(f => !f.startsWith("themes")); // skip theme subfolders if any

let saved = 0, skipped = 0;
for (const f of files) {
  const p = path.join(AVATARS_DIR, f);
  const before = (await fs.stat(p)).size;

  // Skip files that are already small — never upscale a 16 KB JPG-disguised
  // .png up to 300 KB just because sharp can.
  const meta = await sharp(p).metadata();
  if ((meta.width || 0) <= 512 && (meta.height || 0) <= 512) {
    skipped++;
    continue;
  }

  const buf = await sharp(p)
    .resize(512, 512, { fit: "cover" })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();

  await fs.writeFile(p, buf);
  const after = buf.length;
  saved += before - after;
  console.log(`  ${f.padEnd(28)} ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB`);
}
console.log(`\n▶ skipped ${skipped} (already ≤512px)`);

console.log(`\n▶ saved ${(saved / 1024 / 1024).toFixed(1)} MB across ${files.length} files`);
