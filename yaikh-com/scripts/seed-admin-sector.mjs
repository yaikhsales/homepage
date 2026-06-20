/* Seed the Admin + CSR sector with extra reference data the PAs need:
 *
 *   y_shop                 — product catalog (snacks, uniforms, PPE…)
 *   digital_audit_plans    — Audit Plan records (BSCI / WRAP / ISO)
 *   compliance_certificates — issued + expiring certs
 *   checklist_6s_records   — recent 6S audit scores per department
 *
 * Run after seed-admin-pa.mjs + seed-csr.mjs to fill in the sector.
 */

import { MongoClient } from "mongodb";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      let v = m[2];
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      process.env[m[1]] = v;
    }
  }
}
const uri = process.env.MONGO_URL;
if (!uri) { console.error("MONGO_URL missing"); process.exit(1); }

const now = () => new Date();

/* ─── Y Shop catalog (products workers can order via Y Shop) ────────── */
const yShop = [
  // Snacks / drinks
  { sku: "snack-001", category: "snack",   name: "Mama instant noodle (chicken)", price_usd: 0.40, stock: 240, unit: "pack" },
  { sku: "snack-002", category: "snack",   name: "Mama instant noodle (pork)",    price_usd: 0.40, stock: 180, unit: "pack" },
  { sku: "snack-003", category: "snack",   name: "Salted peanuts 100g",          price_usd: 0.60, stock: 95,  unit: "pack" },
  { sku: "snack-004", category: "snack",   name: "Banana chips 60g",             price_usd: 0.50, stock: 120, unit: "pack" },
  { sku: "drink-001", category: "drink",   name: "Bottled water 1L",             price_usd: 0.40, stock: 600, unit: "bottle" },
  { sku: "drink-002", category: "drink",   name: "Iced coffee can",              price_usd: 0.65, stock: 220, unit: "can" },
  { sku: "drink-003", category: "drink",   name: "Sparkling water 330ml",        price_usd: 0.55, stock: 80,  unit: "can" },
  // Uniform / PPE
  { sku: "uniform-shirt", category: "uniform", name: "Replacement uniform shirt", price_usd: 6.50, stock: 45, unit: "piece" },
  { sku: "uniform-pant",  category: "uniform", name: "Replacement uniform pant",  price_usd: 7.50, stock: 32, unit: "piece" },
  { sku: "ppe-mask",      category: "ppe",     name: "Surgical mask 50-pack",     price_usd: 3.00, stock: 110,unit: "pack" },
  { sku: "ppe-glove",     category: "ppe",     name: "Cotton gloves",             price_usd: 0.80, stock: 280,unit: "pair" },
  { sku: "ppe-earplug",   category: "ppe",     name: "Foam earplugs",             price_usd: 0.30, stock: 540,unit: "pair" },
  // Stationery
  { sku: "stat-pen",      category: "stat",    name: "Pen, blue",                 price_usd: 0.20, stock: 460,unit: "piece" },
  { sku: "stat-notebook", category: "stat",    name: "A5 notebook",               price_usd: 1.00, stock: 95, unit: "piece" },
];

/* ─── Digital Audit Plans (third-party + buyer audits) ─────────────── */
const digitalAuditPlans = [
  { no: "AP-2026-0008", scope: "BSCI annual",            auditor: "AmFori BSCI",         scheduled: "2026-07-10", duration_days: 2, lead: "QA Manager",     status: "scheduled",  documents: ["doc-bsci-prep-checklist.pdf"], note: "Pre-audit document pull due 2026-07-01" },
  { no: "AP-2026-0009", scope: "WRAP renewal",           auditor: "WRAP",                scheduled: "2026-08-05", duration_days: 3, lead: "Compliance Lead", status: "scheduled",  documents: ["doc-wrap-pre-questionnaire.pdf"], note: "Bronze cert renewal cycle" },
  { no: "AP-2026-0010", scope: "ISO 14001 surveillance", auditor: "Bureau Veritas",      scheduled: "2026-06-15", duration_days: 1, lead: "EHS Manager",     status: "in_progress",documents: ["doc-iso-14001-capa-tracker.xlsx"], note: "5 minor NCs from last cycle — CAPA in progress" },
  { no: "AP-2026-0011", scope: "Fire-safety (MoI)",      auditor: "MoI Fire Marshal",    scheduled: "2026-06-27", duration_days: 1, lead: "Admin Manager",   status: "scheduled",  documents: ["doc-fire-drill-evidence.pdf"], note: "Drill required week prior" },
  { no: "AP-2026-0012", scope: "Buyer audit · Tokyo",    auditor: "Tokyo Apparel Co.",   scheduled: "2026-07-20", duration_days: 1, lead: "QA Manager",     status: "scheduled",  documents: ["doc-buyer-coc-pack.pdf"], note: "Style PO-2026-091" },
  { no: "AP-2026-0013", scope: "OEKO-TEX",               auditor: "Hohenstein",          scheduled: "2026-09-12", duration_days: 2, lead: "Fabric QA",       status: "scheduled",  documents: [], note: "Standard 100 product class II" },
];

/* ─── Compliance Certificates (issued + expiring) ──────────────────── */
const complianceCertificates = [
  { no: "CC-2025-0044", title: "BSCI Audit Report 2025",  scope: "Social", issuedBy: "AmFori BSCI",     issuedAt: "2025-07-15", validUntil: "2026-07-15", rating: "B", status: "expiring", note: "Renewal scheduled AP-2026-0008" },
  { no: "CC-2025-0045", title: "ISO 14001:2015 Cert",     scope: "Environmental", issuedBy: "Bureau Veritas", issuedAt: "2025-06-20", validUntil: "2028-06-19", rating: "Pass", status: "valid",   note: null },
  { no: "CC-2025-0046", title: "WRAP Bronze Cert",        scope: "Social", issuedBy: "WRAP",            issuedAt: "2025-08-12", validUntil: "2026-08-11", rating: "Bronze", status: "expiring", note: "Renewal in flight" },
  { no: "CC-2024-0039", title: "Fire-Safety Certificate", scope: "Safety", issuedBy: "MoI Cambodia",    issuedAt: "2024-07-01", validUntil: "2025-07-01", rating: "Pass", status: "expired",  note: "Renewed verbally; new cert pending issuance" },
  { no: "CC-2026-0001", title: "Better Work Cambodia",    scope: "Labour", issuedBy: "ILO Better Work", issuedAt: "2026-01-15", validUntil: "2027-01-14", rating: "Compliant", status: "valid", note: null },
];

/* ─── 6S checklist records (recent audits per department) ──────────── */
const checklist6sRecords = [
  { no: "6S-2026-0142", dept: "Cutting",    score: 88, max: 100, auditor: "QA Lead",      auditedAt: "2026-06-18", findings: 2, status: "passed",  note: "1 broken trolley wheel, 1 mislabelled rack" },
  { no: "6S-2026-0143", dept: "Sewing",     score: 92, max: 100, auditor: "QA Lead",      auditedAt: "2026-06-18", findings: 1, status: "passed",  note: "L2 thread waste bin overflowing" },
  { no: "6S-2026-0144", dept: "Finishing",  score: 79, max: 100, auditor: "QA Lead",      auditedAt: "2026-06-17", findings: 4, status: "review",  note: "Iron-station electrical cables tangled" },
  { no: "6S-2026-0145", dept: "Packing",    score: 90, max: 100, auditor: "QA Lead",      auditedAt: "2026-06-17", findings: 1, status: "passed",  note: null },
  { no: "6S-2026-0146", dept: "Warehouse",  score: 73, max: 100, auditor: "QA Lead",      auditedAt: "2026-06-16", findings: 5, status: "review",  note: "Fork-lift parking lines worn; needs repaint" },
  { no: "6S-2026-0147", dept: "Canteen",    score: 95, max: 100, auditor: "EHS Manager",  auditedAt: "2026-06-19", findings: 0, status: "passed",  note: "Excellent" },
];

const stamp = (doc) => ({ ...doc, createdAt: now(), updatedAt: now() });

const seedMap = {
  y_shop:                     yShop,
  digital_audit_plans:        digitalAuditPlans,
  compliance_certificates:    complianceCertificates,
  checklist_6s_records:       checklist6sRecords,
};

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db("yaikh");
  for (const [name, docs] of Object.entries(seedMap)) {
    const col = db.collection(name);
    await col.deleteMany({});
    if (docs.length > 0) await col.insertMany(docs.map(stamp));
    console.log(`✓ ${name}: ${docs.length} docs`);
  }
  console.log("\nAdmin + CSR sector reference data seeded.");
} finally {
  await client.close();
}
