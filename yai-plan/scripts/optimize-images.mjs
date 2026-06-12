#!/usr/bin/env node
/**
 * Resize + recompress generated PNGs in place so the plan page is light
 * enough to render on weak devices and embedded webviews.
 *
 *   node scripts/optimize-images.mjs
 *
 * - Caps width at 1100px (images display ≤700px; 1100 covers retina)
 * - Re-encodes PNG with palette quantization + max compression
 * - Overwrites in place (same filename → no code changes)
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

sharp.cache(false); // don't hold file handles (Windows read+write-same-path)

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, "..", "public", "images", "generated");
const MAX_W = 1100;

const files = (await fs.readdir(DIR)).filter((f) => f.toLowerCase().endsWith(".png"));
let beforeTotal = 0, afterTotal = 0;

for (const f of files) {
  const p = path.join(DIR, f);
  const input = await fs.readFile(p); // read fully first, no lingering handle on the path
  const before = input.length;
  const buf = await sharp(input)
    .resize({ width: MAX_W, withoutEnlargement: true })
    .png({ compressionLevel: 9, effort: 10, palette: true, quality: 82 })
    .toBuffer();
  // only overwrite if we actually shrank it
  if (buf.length < before) await fs.writeFile(p, buf);
  const after = Math.min(buf.length, before);
  beforeTotal += before; afterTotal += after;
  console.log(
    `  ${f.padEnd(26)} ${(before / 1024).toFixed(0).padStart(5)} KB -> ${(after / 1024).toFixed(0).padStart(5)} KB  (${Math.round((1 - after / before) * 100)}% smaller)`
  );
}

console.log("");
console.log(`Total: ${(beforeTotal / 1024 / 1024).toFixed(2)} MB -> ${(afterTotal / 1024 / 1024).toFixed(2)} MB  (${Math.round((1 - afterTotal / beforeTotal) * 100)}% smaller)`);
