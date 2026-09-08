/* Seed sample pa_tasks so the /api/notifications/<slug> endpoints
 * return non-zero counts for the 9 dynamic PAs.
 *
 * Run: railway run node scripts/seed-pa-tasks.mjs
 * (uses the project's MONGO_URL from Railway env)
 *
 * Idempotent — deletes prior seed docs (meta.source: "seed_pa_tasks_v1")
 * before re-inserting.
 */

import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL;
if (!uri) {
  console.error("MONGO_URL not set. Run with: railway run node scripts/seed-pa-tasks.mjs");
  process.exit(1);
}

const PILLS_BY_PA = {
  shipping:   ["Container plan", "Customs clearance", "Delivery schedule", "Inventory levels", "Material plan"],
  mrp:        ["Material plan", "BOM review", "Stock alerts", "Supplier orders", "Reorder points"],
  qa:         ["Recent defect inspections", "Customer complaints", "Open call-outs", "Third-party audits", "Quality reports"],
  production: ["Today's production plan", "WIP by line", "Cutting throughput", "Finishing throughput", "Production status"],
  ce:         ["Standard time updates", "Productivity by line", "Machine allocation", "Skill inventory", "Cost center summary"],
  ytm:        ["Machine downtime", "Repair queue", "Maintenance schedule", "Late maintenance alerts", "Spare parts stock"],
  "4dp":      ["Sample approvals", "Pattern review queue", "Spec sheets", "Trim approvals", "Design roadmap"],
  ypi:        ["Open Kaizen projects", "SOP review queue", "Efficiency audits", "Process optimization", "Improvement KPIs"],
  social:     ["TikTok comments", "Facebook comments", "YouTube comments", "Instagram comments", "LinkedIn comments"],
};

const ORIGIN_MAP = {
  shipping:   ["mrp", "ce", "ytm", "buyer"],
  mrp:        ["4dp", "production", "qa", "supplier"],
  qa:         ["production", "buyer", "mrp", "shipping"],
  production: ["mrp", "qa", "ytm", "ce"],
  ce:         ["production", "hr", "ytm", "4dp"],
  ytm:        ["production", "qa", "admin"],
  "4dp":      ["buyer", "mrp", "production", "ce"],
  ypi:        ["production", "qa", "ce", "hr"],
  social:     ["buyer", "public", "csr", "management"],
};

const SAMPLE_REQUESTERS = [
  "Sopheara Meas", "Vichetr Kim", "Sreymom Chan", "Rithy Ly",
  "Vichea Ly", "Pisey Meas", "Chanthou Sokha", "Bunthorn Chea",
  "Sopheara Nou", "Sokun Prak", "Vichetr Ung", "Chantha Meng",
];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const col = db.collection("pa_tasks");

  // Wipe prior seed
  const wiped = await col.deleteMany({ "meta.source": "seed_pa_tasks_v1" });
  console.log(`Wiped ${wiped.deletedCount} prior seed_pa_tasks_v1 docs.`);

  await col.createIndex({ pa: 1, pill: 1, status: 1 });
  await col.createIndex({ pa: 1, created_at: 1 });

  const now = new Date();
  const docs = [];

  for (const [pa, pills] of Object.entries(PILLS_BY_PA)) {
    for (const pill of pills) {
      // Random count 1-8 per pill so badges vary and stay realistic
      const count = rand(1, 8);
      for (let i = 0; i < count; i++) {
        const ageDays = rand(0, 12);
        const created_at = new Date(now.getTime() - ageDays * 86400_000);
        const deadline = new Date(created_at.getTime() + rand(3, 14) * 86400_000);
        docs.push({
          pa,
          pill,
          item_id: `${pa.toUpperCase()}-${pill.slice(0, 3).replace(/\s/g, "").toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
          origin_pa: pick(ORIGIN_MAP[pa]),
          requester: pick(SAMPLE_REQUESTERS),
          status: Math.random() < 0.15 ? "in_progress" : "pending",
          summary: `${pill} item raised ${ageDays} day${ageDays === 1 ? "" : "s"} ago — awaiting ${pa} action.`,
          created_at,
          deadline,
          meta: { source: "seed_pa_tasks_v1", seq: i },
        });
      }
    }
  }

  if (docs.length) {
    const res = await col.insertMany(docs);
    console.log(`Inserted ${res.insertedCount} pa_tasks across ${Object.keys(PILLS_BY_PA).length} PAs.`);
  }

  console.log("\nPer-PA task counts:");
  for (const pa of Object.keys(PILLS_BY_PA)) {
    const total = await col.countDocuments({ pa, status: { $in: ["pending", "in_progress"] } });
    console.log(`  ${pa.padEnd(12)} ${total}`);
  }

  await client.close();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
