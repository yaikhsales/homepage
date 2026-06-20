/* Seed Admin PA pill-backing collections.
 *
 * Idempotent: clears + re-inserts the 4 pill-backing collections used
 * by /api/notifications/admin. Run after deploying the route changes.
 *
 *   meeting_rooms        → "Meeting room bookings" (today's + tomorrow's)
 *   gate_passes          → "Gate passes today"     (open + active)
 *   y_shop_orders        → "Y Shop orders"         (pending fulfillment)
 *   visitors             → "Visitors today"        (signed in, not out)
 *
 * support_tickets is seeded separately by seed-support-tickets.mjs.
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
if (!uri) {
  console.error("MONGO_URL missing — set it in yaikh-com/.env.local first");
  process.exit(1);
}

const todayISO = new Date().toISOString().slice(0, 10);
const tomorrowISO = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10);
const now = () => new Date();

/* ─── Meeting room bookings ──────────────────────────────────────────── */
const meetingRooms = [
  { no: "MR-2026-0042", room: "Boardroom",       organizer: "Sok Pisey",   subject: "Q3 planning kickoff",            date: todayISO,    start: "09:00", end: "10:30", attendees: 8,  status: "confirmed" },
  { no: "MR-2026-0043", room: "Training Room A", organizer: "HR · Onb",    subject: "New-hire orientation",           date: todayISO,    start: "13:00", end: "16:00", attendees: 12, status: "confirmed" },
  { no: "MR-2026-0044", room: "Boardroom",       organizer: "Production",  subject: "Style PO-2026-091 ramp review",   date: todayISO,    start: "15:30", end: "16:30", attendees: 6,  status: "confirmed" },
  { no: "MR-2026-0045", room: "Small Room 1",    organizer: "QA Lead",     subject: "Defect-rate weekly review",       date: tomorrowISO, start: "08:30", end: "09:30", attendees: 4,  status: "confirmed" },
  { no: "MR-2026-0046", room: "Boardroom",       organizer: "GM Office",   subject: "Buyer call — Heng Vichea team",   date: tomorrowISO, start: "11:00", end: "12:00", attendees: 5,  status: "pending" },
];

/* ─── Gate passes (active today) ─────────────────────────────────────── */
const gatePasses = [
  { no: "GP-2026-0188", type: "material-out", who: "Forklift L2 → Warehouse",          item: "Empty packaging trolleys ×6",    purpose: "Return",          host: "WH Supervisor",   date: todayISO, time: "08:12", status: "open" },
  { no: "GP-2026-0189", type: "visitor",     who: "Mr. Tan Hai (Buyer audit)",         item: null,                              purpose: "QA inspection",   host: "QA Manager",      date: todayISO, time: "09:45", status: "open" },
  { no: "GP-2026-0190", type: "material-in", who: "Driver — Supplier truck KH-7211",   item: "Fabric rolls — Style 091 ×220m", purpose: "Raw material",    host: "WH Supervisor",   date: todayISO, time: "10:20", status: "open" },
  { no: "GP-2026-0191", type: "visitor",     who: "MFAIC inspector — work permit",     item: null,                              purpose: "Compliance",      host: "HR Manager",      date: todayISO, time: "11:00", status: "open" },
  { no: "GP-2026-0192", type: "material-out", who: "Courier — Cambo Express",           item: "Sample box × 1 to buyer Tokyo",  purpose: "Sample courier",  host: "Merchandising",   date: todayISO, time: "14:15", status: "open" },
];

/* ─── Y Shop orders (in-house staff store) ──────────────────────────── */
const yShopOrders = [
  { no: "YS-2026-0312", customer: "Sok Pisey (L1)",   items: [{ sku: "snack-002", name: "Mama instant noodle pack", qty: 4 }],          total_usd: 1.60, status: "pending",  paidVia: null },
  { no: "YS-2026-0313", customer: "Heng Vichea (L1)", items: [{ sku: "uniform-shirt", name: "Replacement uniform shirt", qty: 1 }],     total_usd: 6.50, status: "pending",  paidVia: null },
  { no: "YS-2026-0314", customer: "Ros Sokha (L2)",   items: [{ sku: "drink-001", name: "Bottled water 1L", qty: 6 }],                  total_usd: 2.40, status: "pending",  paidVia: null },
  { no: "YS-2026-0315", customer: "Mao Sreyleak (L3)",items: [{ sku: "ppe-mask", name: "Surgical mask 50-pack", qty: 1 }],              total_usd: 3.00, status: "fulfilled",paidVia: "deduct-payroll" },
];

/* ─── Visitors today (active, not yet checked out) ──────────────────── */
const visitors = [
  { no: "VST-2026-0061", name: "Mr. Tan Hai",        company: "Tokyo Apparel Co.", host: "QA Manager",   purpose: "Buyer QA audit",     checkIn: `${todayISO}T09:45:00`, checkOut: null, status: "in",  badge: "V-061" },
  { no: "VST-2026-0062", name: "MFAIC Inspector",    company: "MFAIC Cambodia",    host: "HR Manager",   purpose: "Work-permit compliance", checkIn: `${todayISO}T11:00:00`, checkOut: null, status: "in",  badge: "V-062" },
  { no: "VST-2026-0063", name: "Driver — KH-7211",   company: "Fabric supplier",   host: "WH Supervisor",purpose: "Raw-material delivery",  checkIn: `${todayISO}T10:20:00`, checkOut: `${todayISO}T11:30:00`, status: "out", badge: "V-063" },
];

const stamp = (doc) => ({ ...doc, createdAt: now(), updatedAt: now() });

const seedMap = {
  meeting_rooms: meetingRooms,
  gate_passes:   gatePasses,
  y_shop_orders: yShopOrders,
  visitors:      visitors,
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
  console.log("\nAdmin PA pill-backing collections seeded.");
} finally {
  await client.close();
}
