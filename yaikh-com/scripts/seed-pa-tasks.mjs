/* Seed sample pa_tasks so the /api/notifications/<slug> endpoints
 * return non-zero counts for the 9 dynamic PAs.
 *
 * Run from yaikh-com dir (auto-loads MONGO_URL from .env.local):
 *   node scripts/seed-pa-tasks.mjs
 *
 * Or explicitly with Railway env:
 *   railway run node scripts/seed-pa-tasks.mjs
 *
 * Idempotent — deletes prior seed docs (meta.source: "seed_pa_tasks_v1")
 * before re-inserting.
 */

import { MongoClient } from "mongodb";
import fs from "node:fs";
import path from "node:path";

// Auto-load .env.local if MONGO_URL isn't already in the environment
if (!process.env.MONGO_URL) {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const txt = fs.readFileSync(envPath, "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) {
        // Strip surrounding quotes if present
        process.env[m[1]] = m[2].replace(/^["'](.*)["']$/, "$1");
      }
    }
    console.log(`Loaded env from ${envPath}`);
  }
}

const uri = process.env.MONGO_URL;
if (!uri) {
  console.error("MONGO_URL not set — expected in .env.local or via `railway run`.");
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

// Realistic scenario templates per pill — one line the user actually
// wants to read when they tap the pill. Each returns a random variant.
const SCENARIOS = {
  "Container plan":         () => `${rand(1,3)} container${rand(1,3)>1?"s":""} delayed by ${rand(2,6)} days — ETA slip to ${dayName(rand(3,12))}. Buyer needs new ETD.`,
  "Customs clearance":      () => `Container ${cnum()} held at ${pick(["SHV","LM17"])} customs — ${pick(["HS-code query","fumigation cert missing","duty payment pending"])}, needs broker follow-up.`,
  "Delivery schedule":      () => `PO-${rand(2026,2027)}-${rand(30,80)} finishing lags plan by ${rand(2,7)} days — outbound container booking to re-slot.`,
  "Inventory levels":       () => `Fabric lot ${cnum()} on ${pick(["Line A","Line B","Line C"])} short ${rand(30,200)} m — Cutting will run out in ${rand(1,3)} days.`,
  "Material plan":          () => `New PO ${rand(50,80)}k pcs polo needs BOM sign-off — 4DP delivered tech-pack ${rand(1,4)} days ago.`,
  "BOM review":             () => `Style YTM-${pick(["P","T","J"])}-${rand(100,199)} BOM revised by buyer — trim substitution needs MRP approval.`,
  "Stock alerts":           () => `${pick(["Overlock loopers","Needle bars","Timing belts","Zip 15cm nickel"])} below reorder point — only ${rand(2,5)} left.`,
  "Supplier orders":        () => `PO to ${pick(["China Silk Mill","VN Trim House","Long An Dye Co"])} — quote received US$${rand(2,25)*1000}, awaiting 3-quote comparison.`,
  "Reorder points":         () => `${rand(3,7)} SKUs breached reorder point this week — auto-PRs generated, awaiting Accounting approval.`,

  "Recent defect inspections": () => `Inline round on ${pick(["Sewing-A","Sewing-B","Finishing"])} — ${rand(4,18)} defects flagged, top cause: ${pick(["skipped stitches","broken needles","label misalign"])}.`,
  "Customer complaints":       () => `Complaint YAI-2026-${rand(80,120)} from ${pick(["BuyerCo","TargetCo","EU-Direct"])} — ${pick(["colour bleeding","measurement off","seam burst"])}, 4M analysis due in ${rand(1,4)} days.`,
  "Open call-outs":            () => `Call Out from Line ${pick(["A","B","C"])} supervisor — ${pick(["fabric shade mismatch","machine oil stain","trim wrong colour"])}, needs QA + ${pick(["MRP","YTM","4DP"])} response.`,
  "Third-party audits":        () => `${pick(["SGS","Intertek","TUV"])} audit scheduled for ${dayName(rand(3,20))} — checklist ${rand(60,95)}% complete, ${rand(2,8)} items still to close.`,
  "Quality reports":           () => `${pick(["Weekly defect summary","PSA holds report","4M closure log"])} due to management by ${dayName(rand(1,3))}.`,

  "Today's production plan":   () => `Line ${pick(["A","B","C"])} plan today: ${rand(600,1400)} pcs of PO-${rand(30,80)} — currently at ${rand(30,90)}% by mid-shift.`,
  "WIP by line":               () => `WIP total ${rand(15000,22000)} pcs — Line ${pick(["A","B","C"])} highest at ${rand(6000,9000)} pcs; check bottleneck.`,
  "Cutting throughput":        () => `Cutting output ${rand(3500,4600)} pcs today vs plan ${rand(3800,4400)} — ${pick(["ahead","behind","on"])} plan by ${rand(50,400)} pcs.`,
  "Finishing throughput":      () => `Finishing output ${rand(3400,3900)} pcs today — matches sewing draw within ${rand(1,5)}%.`,
  "Production status":         () => `PO-2026-${rand(30,80)} at ${rand(30,90)}% complete, ETD ${dayName(rand(7,25))}; ${pick(["on track","1 day slip","2 days slip"])}.`,

  "Standard time updates":     () => `Style YTM-${pick(["P","T","J"])}-${rand(100,199)} — SMV revision from ${rand(12,25)} to ${rand(11,24)} min after 3-cycle time-study, awaiting Production sign-off.`,
  "Productivity by line":      () => `Line ${pick(["A","B","C"])} productivity ${rand(65,88)}% — below 80% trigger, line-balance review needed.`,
  "Machine allocation":        () => `Next week plan needs ${rand(2,6)} more ${pick(["button-hole","bar-tack","overlock"])} machines on Line ${pick(["A","B","C"])} — reallocation pending.`,
  "Skill inventory":           () => `${rand(3,9)} operators promoted to Level ${rand(3,5)} this month — skill matrix update pending in YHR.`,
  "Cost center summary":       () => `CC-${pick(["1001","1002","1003","2000","3000"])} cost per garment variance ${rand(2,9)}% vs standard — needs review before month-end close.`,

  "Machine downtime":          () => `Machine M-${pick(["A","B","C"])}${rand(1,90).toString().padStart(3,"0")} down ${rand(15,180)} min today — cause: ${pick(["needle-bar","motor overheat","timing belt","PLC error"])}.`,
  "Repair queue":              () => `${rand(3,9)} machines in repair queue — oldest ticket ${rand(1,4)} days open, waiting on spare parts.`,
  "Maintenance schedule":      () => `PM due ${dayName(rand(1,7))} on ${rand(4,12)} machines — need ${rand(2,4)} technicians allocated.`,
  "Late maintenance alerts":   () => `Machine M-${pick(["A","B","C"])}${rand(1,90).toString().padStart(3,"0")} PM overdue by ${rand(3,10)} days — needs immediate scheduling.`,
  "Spare parts stock":         () => `${pick(["Overlock loopers","Needle bars","Timing belts","Motor brushes"])} below min stock (${rand(1,3)} left, min ${rand(6,12)}) — PR to Accounting pending.`,

  "Sample approvals":          () => `Sample for style YTM-${pick(["P","T","J"])}-${rand(100,199)} awaiting buyer approval — sent ${rand(1,5)} days ago, target 5-day turnaround.`,
  "Pattern review queue":      () => `${rand(2,5)} patterns in review — buyer BuyerCo needs pocket-placement revision on YTM-P-${rand(100,199)}.`,
  "Spec sheets":               () => `Tech-pack for PO-2026-${rand(30,80)} needs ${pick(["measurement","construction","care label"])} revision from 4DP before production hand-off.`,
  "Trim approvals":            () => `${pick(["Button","Zipper","Hangtag","Label"])} approval on style YTM-${pick(["P","T","J"])}-${rand(100,199)} — swatch sent to buyer ${rand(1,4)} days ago.`,
  "Design roadmap":            () => `FW-2026-27 roadmap: ${rand(6,14)} styles in pattern, ${rand(3,8)} in sample, ${rand(2,5)} ready for production hand-off.`,

  "Open Kaizen projects":      () => `Kaizen KZN-2026-${rand(10,30)} on ${pick(["Line B changeover","Cutting layout","Finishing flow"])} — ${rand(30,80)}% complete, target ${dayName(rand(10,40))}.`,
  "SOP review queue":          () => `SOP-${pick(["QA","YTM","HR","PROD"])}-${rand(1,30).toString().padStart(3,"0")} due for annual review — last revised ${rand(300,400)} days ago.`,
  "Efficiency audits":         () => `Efficiency audit on Line ${pick(["A","B","C"])} scheduled ${dayName(rand(3,15))} — checklist ${rand(0,60)}% prepped.`,
  "Process optimization":      () => `${pick(["Button-hole parallel setup","Cutting layout change","Trim kit pre-assembly"])} — pilot on ${pick(["Line A","Line B"])} showed ${rand(4,12)}% efficiency gain.`,
  "Improvement KPIs":          () => `${pick(["Energy per garment","Water per garment","Defect rate","OTIF"])} tracking ${pick(["above","below"])} target this week — review at management meeting.`,

  "TikTok comments":           () => `${rand(5,25)} unreplied comments on ${pick(["team-dance clip","factory tour","new-line reveal"])} post from ${rand(1,4)} days ago.`,
  "Facebook comments":         () => `${rand(3,15)} unreplied comments — ${rand(1,3)} are ${pick(["quality complaint","buyer enquiry","recruitment interest"])}.`,
  "YouTube comments":          () => `${rand(2,12)} comments on latest sample-room-tour video — reply SLA ${rand(4,12)}h old.`,
  "Instagram comments":        () => `${rand(4,18)} unreplied comments — mostly on ${pick(["sustainability post","team feature","product close-up"])}.`,
  "LinkedIn comments":         () => `${rand(2,8)} unreplied comments on latest ${pick(["WRAP certification","GRS milestone","factory-expansion"])} post from a buyer contact.`,
};

function cnum() {
  const l = ["ABCD","TCLU","MSKU","MSCU","GESU"][rand(0,4)];
  return `${l}${rand(1000000,9999999)}`;
}
function dayName(daysFromNow) {
  const d = new Date(Date.now() + daysFromNow * 86400_000);
  return d.toISOString().slice(0,10);
}

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
  const client = new MongoClient(uri);
  await client.connect();
  // MUST match lib/mongo.ts getDb() default ("yaikh") so the API can see us.
  const db = client.db("yaikh");
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
          summary: (SCENARIOS[pill] || (() => `${pill} item raised ${ageDays} day${ageDays === 1 ? "" : "s"} ago.`))(),
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
