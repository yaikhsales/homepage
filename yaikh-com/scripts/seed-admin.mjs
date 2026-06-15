/* Migrate admin section JSON snapshots from data/*.json into Mongo
 * collection `admin_kv`. Run once after deploying the
 * Mongo-backed admin-mongo.ts helpers.
 *
 *   node scripts/seed-admin.mjs
 *
 * Idempotent — re-running overwrites the previous Mongo value with
 * whatever is in the JSON file (newer-wins-by-disk semantics for the
 * seed phase). After the migration lands, the admin POST endpoints
 * write straight to Mongo and the JSON file becomes a backup
 * snapshot only.
 */

import { MongoClient } from "mongodb";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env.local");

if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, "utf-8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      let v = m[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      process.env[m[1]] = v;
    }
  }
}

const uri = process.env.MONGO_URL;
if (!uri) {
  console.error("MONGO_URL missing — set it in yaikh-com/.env.local first");
  process.exit(1);
}

const DATA_DIR = path.resolve(__dirname, "..", "data");

/** [section name (Mongo _id), file basename]. Add a row as each admin tab is wired. */
const SECTIONS = [
  ["sales-income",   "sales-income.json"],
  ["salary-history", "salary-history.json"],
  ["expenses",       "expenses.json"],
  ["budget-actuals", "budget-actuals.json"],
  ["about",          "about.json"],
  ["events",         "events.json"],
];

async function main() {
  console.log("Connecting to Atlas…");
  const client = await new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  }).connect();
  const db = client.db("yaikh");
  const col = db.collection("admin_kv");

  for (const [name, file] of SECTIONS) {
    const fp = path.join(DATA_DIR, file);
    if (!fs.existsSync(fp)) {
      console.log(`  skip ${name} (no ${file} on disk)`);
      continue;
    }
    try {
      const payload = JSON.parse(fs.readFileSync(fp, "utf-8"));
      await col.updateOne(
        { _id: name },
        {
          $set: {
            _id: name,
            payload,
            _updatedAt: new Date(),
          },
        },
        { upsert: true }
      );
      const size = fs.statSync(fp).size;
      console.log(`  ✓ ${name} (${size} bytes)`);
    } catch (err) {
      console.error(`  ✗ ${name} failed:`, err.message);
    }
  }

  await client.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
