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
  // Room 1 — Head office training (long block)
  { no: "MR-2026-0042", room: "Room 1",          category: "training",      organizer: "Head Office · L&D",     subject: "Leadership training — all department heads", date: todayISO, start: "08:30", end: "17:00", attendees: 14, status: "in-progress" },
  // Merchandising
  { no: "MR-2026-0043", room: "Boardroom",       category: "merchandising", organizer: "Merch · Sok Pisey",     subject: "Style PO-2026-091 final-sample review with buyer", date: todayISO, start: "10:00", end: "11:30", attendees: 7,  status: "confirmed" },
  { no: "MR-2026-0049", room: "Boardroom",       category: "merchandising", organizer: "Merch · Lim Sopheak",   subject: "Fabric supplier negotiation — Q3 prices",          date: tomorrowISO, start: "13:30", end: "15:30", attendees: 5,  status: "pending" },
  // Quality
  { no: "MR-2026-0044", room: "Small Room 1",    category: "quality",       organizer: "QA Manager",            subject: "Weekly defect-rate review — all lines",  date: todayISO, start: "14:00", end: "15:00", attendees: 6,  status: "confirmed" },
  { no: "MR-2026-0050", room: "Small Room 1",    category: "quality",       organizer: "QA Manager",            subject: "Pre-audit walkthrough (BSCI prep)",       date: tomorrowISO, start: "09:00", end: "11:00", attendees: 4,  status: "pending" },
  // Government / compliance training
  { no: "MR-2026-0045", room: "Training Room A", category: "government",    organizer: "MLVT inspector + HR",   subject: "Government — work-permit compliance training", date: todayISO, start: "13:00", end: "16:00", attendees: 18, status: "in-progress", external: true },
  { no: "MR-2026-0051", room: "Training Room A", category: "government",    organizer: "MoI Fire Marshal",      subject: "Government — annual fire-safety training",     date: tomorrowISO, start: "08:00", end: "12:00", attendees: 22, status: "confirmed", external: true },
  // Onboarding / HR
  { no: "MR-2026-0046", room: "Training Room B", category: "hr",            organizer: "HR · Onboarding Lead",  subject: "New-hire orientation — 12 candidates",   date: todayISO, start: "08:00", end: "10:00", attendees: 12, status: "confirmed" },
  // Internal ops
  { no: "MR-2026-0047", room: "Boardroom",       category: "ops",           organizer: "Production Manager",    subject: "Daily production huddle",                 date: todayISO, start: "07:30", end: "08:00", attendees: 5,  status: "confirmed" },
  { no: "MR-2026-0048", room: "Boardroom",       category: "ops",           organizer: "GM Office",             subject: "Q3 budget review with Finance + GM",      date: tomorrowISO, start: "10:00", end: "12:00", attendees: 6,  status: "pending" },
];

/* ─── Gate passes (active today) ─────────────────────────────────────── */
const gatePasses = [
  // Materials
  { no: "GP-2026-0188", type: "material-out", who: "Forklift L2 → Warehouse",          item: "Empty packaging trolleys ×6",    purpose: "Return",          host: "WH Supervisor",   date: todayISO, time: "08:12", status: "open" },
  { no: "GP-2026-0190", type: "material-in",  who: "Driver — Supplier truck KH-7211",  item: "Fabric rolls — Style 091 ×220m", purpose: "Raw material",    host: "WH Supervisor",   date: todayISO, time: "10:20", status: "open" },
  { no: "GP-2026-0192", type: "material-out", who: "Courier — Cambo Express",          item: "Sample box × 1 to buyer Tokyo",  purpose: "Sample courier",  host: "Merchandising",   date: todayISO, time: "14:15", status: "open" },
  // Visitors
  { no: "GP-2026-0189", type: "visitor",      who: "Mr. Tan Hai (Buyer audit)",        item: null,                              purpose: "QA inspection",   host: "QA Manager",      date: todayISO, time: "09:45", status: "open" },
  { no: "GP-2026-0191", type: "visitor",      who: "MFAIC inspector — work permit",    item: null,                              purpose: "Compliance",      host: "HR Manager",      date: todayISO, time: "11:00", status: "open" },
  // Trucks (vehicle gate logs)
  { no: "GP-2026-0193", type: "truck-in",     who: "Truck KH-7211 (Supplier)",         item: "Fabric — 220m rolls",             purpose: "Inbound delivery", host: "Security · Gate-1", date: todayISO, time: "10:18", plate: "KH-7211", driver: "Em Kosal",      status: "open" },
  { no: "GP-2026-0194", type: "truck-out",    who: "Truck KH-7211 (Supplier)",         item: "Empty truck",                     purpose: "Departure",       host: "Security · Gate-1", date: todayISO, time: "11:05", plate: "KH-7211", driver: "Em Kosal",      status: "closed" },
  { no: "GP-2026-0195", type: "truck-in",     who: "Reefer KH-3490 (Export)",          item: "Empty container",                 purpose: "Stuffing — PO-091",host: "Security · Gate-1", date: todayISO, time: "13:30", plate: "KH-3490", driver: "Long Sothy",    status: "open" },
  { no: "GP-2026-0196", type: "truck-out",    who: "Cambo Express van KH-1188",        item: "Sample box ×1",                   purpose: "Sample courier",  host: "Security · Gate-1", date: todayISO, time: "14:18", plate: "KH-1188", driver: "Vorn Chea",     status: "closed" },
  // Workers (clock-in/out at the gate)
  { no: "GP-2026-0197", type: "worker-in",    who: "Sok Pisey (EMP-2026-0001)",        item: null,                              purpose: "Shift start L1",  host: "Security · Gate-2", date: todayISO, time: "07:25", emp: "EMP-2026-0001", line: "L1", status: "in" },
  { no: "GP-2026-0198", type: "worker-in",    who: "Heng Vichea (EMP-2026-0002)",      item: null,                              purpose: "Shift start L1 (late)", host: "Security · Gate-2", date: todayISO, time: "07:48", emp: "EMP-2026-0002", line: "L1", status: "in", flag: "late" },
  { no: "GP-2026-0199", type: "worker-out",   who: "Ros Sokha (EMP-2026-0004)",        item: null,                              purpose: "Early leave (approved LR)", host: "Security · Gate-2", date: todayISO, time: "11:00", emp: "EMP-2026-0004", line: "L2", status: "out" },
  { no: "GP-2026-0200", type: "worker-in",    who: "Mao Sreyleak (EMP-2026-0005)",     item: null,                              purpose: "Late arrival — sick note", host: "Security · Gate-2", date: todayISO, time: "10:15", emp: "EMP-2026-0005", line: "L3", status: "in", flag: "sick" },
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

/* ─── Car bookings (shared company vehicles) ────────────────────────── */
const carBookings = [
  // Buyer visits
  { no: "CAR-2026-0044", category: "buyer-visit", vehicle: "Camry · KH-2178",    driver: "Khun Sokchea",  requester: "Sales · Sok Pisey",    purpose: "Buyer pickup — Tokyo Apparel (Mr. Tan Hai) Airport → factory", date: todayISO,    start: "13:00", end: "16:00", passengers: 2, status: "confirmed" },
  { no: "CAR-2026-0050", category: "buyer-visit", vehicle: "Camry · KH-2178",    driver: "Khun Sokchea",  requester: "Sales · Sok Pisey",    purpose: "Buyer return — Tokyo Apparel → Airport", date: tomorrowISO, start: "10:00", end: "12:00", passengers: 2, status: "pending" },
  // Training transport
  { no: "CAR-2026-0048", category: "training",    vehicle: "Van H1 · KH-4188",   driver: "Mao Sopheak",   requester: "HR · Onb Lead",        purpose: "12 new hires → BSCI training centre (Phnom Penh)", date: tomorrowISO, start: "07:00", end: "17:00", passengers: 12, status: "confirmed" },
  { no: "CAR-2026-0051", category: "training",    vehicle: "Van H2 · KH-5599",   driver: "Sok Heng",      requester: "QA Manager",           purpose: "QA team → Auditor refresher (CamControl HQ)", date: tomorrowISO, start: "08:00", end: "16:00", passengers: 6,  status: "pending" },
  // Medical / hospital
  { no: "CAR-2026-0052", category: "medical",     vehicle: "Hilux · KH-9921",    driver: "Vorn Dany",     requester: "HR · Safety Officer",  purpose: "URGENT — Heng Vichea (L1) → Calmette Hospital (suspected dehydration)", date: todayISO,    start: "11:35", end: "13:00", passengers: 2,  status: "in-progress", priority: "high" },
  // Government / compliance
  { no: "CAR-2026-0047", category: "government",  vehicle: "Camry · KH-2178",    driver: "Khun Sokchea",  requester: "GM Office",            purpose: "MoC compliance visit — Phnom Penh",            date: tomorrowISO, start: "08:30", end: "13:00", passengers: 1,  status: "pending" },
  { no: "CAR-2026-0053", category: "government",  vehicle: "Hilux · KH-9921",    driver: "Vorn Dany",     requester: "HR Manager",           purpose: "MLVT work-permit office submission",            date: todayISO,    start: "08:00", end: "11:00", passengers: 2,  status: "confirmed" },
  // Logistics / port
  { no: "CAR-2026-0045", category: "logistics",   vehicle: "Hilux · KH-9921",    driver: "Vorn Dany",     requester: "Logistics · Heng V.",  purpose: "Sihanoukville port — clearance docs", date: todayISO, start: "06:30", end: "20:00", passengers: 1,  status: "in-progress" },
  // New-hire pickup
  { no: "CAR-2026-0046", category: "hr",          vehicle: "Van H1 · KH-4188",   driver: "Mao Sopheak",   requester: "HR · Ros Sokha",       purpose: "New-hire pickup — Kandal village",  date: tomorrowISO, start: "07:00", end: "10:00", passengers: 5,  status: "pending" },
];

/* ─── Fire-alarm events (sensor pulls + scheduled drills) ───────────── */
const fireAlarmEvents = [
  { no: "FA-2026-0011", type: "drill",       location: "Whole factory", trigger: "scheduled",       detectedAt: "2026-06-27T10:30:00", clearedAt: null,                          severity: "info",   status: "scheduled", note: "Quarterly drill — fire-marshal led" },
  { no: "FA-2026-0012", type: "false-alarm", location: "Sewing-L2",     trigger: "smoke sensor 12", detectedAt: "2026-06-17T15:42:00", clearedAt: "2026-06-17T15:47:00",         severity: "low",    status: "closed",    note: "Steam from ironing station; sensor recalibrated" },
  { no: "FA-2026-0013", type: "real-event",  location: "Warehouse-2",   trigger: "smoke sensor 03", detectedAt: "2026-06-10T03:15:00", clearedAt: "2026-06-10T03:32:00",         severity: "medium", status: "closed",    note: "Forklift overheating — isolated, full report filed" },
  { no: "FA-2026-0014", type: "maintenance", location: "Sewing-L1",     trigger: "annual service",  detectedAt: "2026-06-30T09:00:00", clearedAt: null,                          severity: "info",   status: "scheduled", note: "Vendor: SafetyFirst Cambodia. 6 detectors due service." },
];

/* ─── CCTV incidents / health ────────────────────────────────────────── */
const cctvIncidents = [
  { no: "CCTV-2026-0028", camera: "CAM-12 (Main Gate)",  type: "device-offline",   detectedAt: `${todayISO}T07:14:00`, clearedAt: null, status: "open",     priority: "high",   note: "Camera shows no feed since 07:14 — possible PoE failure" },
  { no: "CCTV-2026-0029", camera: "CAM-04 (Warehouse-1)", type: "motion-after-hrs", detectedAt: "2026-06-18T22:47:00", clearedAt: "2026-06-18T22:51:00", status: "resolved", priority: "medium", note: "Confirmed: security guard rounds" },
  { no: "CCTV-2026-0030", camera: "CAM-19 (Canteen)",     type: "device-offline",   detectedAt: "2026-06-16T13:00:00", clearedAt: "2026-06-16T15:30:00", status: "resolved", priority: "low",    note: "Power-strip tripped; restored" },
];

/* ─── Fire-alarm sensors — floor-plan view across the site ──────────────
 * 5 buildings, each with a grid of sensors. Most green (ok), a few
 * low-battery (orange), a few faulty (red). x/y are 0–100 % of the
 * building footprint so the floor plan SVG can scale freely.
 */
const BUILDINGS = [
  { id: "B1", name: "Sewing-1",  cols: 6, rows: 3 }, // 18 sensors
  { id: "B2", name: "Sewing-2",  cols: 6, rows: 3 }, // 18
  { id: "B3", name: "Cutting",   cols: 4, rows: 3 }, // 12
  { id: "B4", name: "Warehouse", cols: 5, rows: 2 }, // 10
  { id: "B5", name: "Office",    cols: 3, rows: 2 }, // 6
];
// 7 anomalies: 2 low-battery (orange), 5 faulty (red). Placed deterministically.
const ANOMALIES = {
  "B1-r0-c3": { state: "low-battery", battery: 11, note: "Replace battery — under 15%" },
  "B2-r1-c2": { state: "faulty",      battery: 0,  note: "No response since 2026-06-15; vendor ticket open" },
  "B2-r2-c5": { state: "low-battery", battery: 13, note: "Battery warning" },
  "B3-r0-c1": { state: "faulty",      battery: 0,  note: "Sensor head loose — visual confirm needed" },
  "B3-r2-c3": { state: "faulty",      battery: 0,  note: "Stuck-alarm condition cleared at panel; needs swap" },
  "B4-r1-c4": { state: "faulty",      battery: 0,  note: "Heat-detector reading flat-line" },
  "B5-r0-c2": { state: "faulty",      battery: 0,  note: "Smoke-detector LED dead" },
};
const fireAlarmSensors = [];
for (const b of BUILDINGS) {
  for (let r = 0; r < b.rows; r++) {
    for (let c = 0; c < b.cols; c++) {
      const sensorNo = `FS-${b.id}-${String(r * b.cols + c + 1).padStart(3, "0")}`;
      const key = `${b.id}-r${r}-c${c}`;
      const a = ANOMALIES[key];
      const xPct = +(((c + 0.5) / b.cols) * 100).toFixed(1);
      const yPct = +(((r + 0.5) / b.rows) * 100).toFixed(1);
      fireAlarmSensors.push({
        no:           sensorNo,
        building:     b.id,
        buildingName: b.name,
        row:          r,
        col:          c,
        xPct,
        yPct,
        type:         (r === 0 ? "smoke" : (r === 1 ? "heat" : "manual-pull")),
        state:        a ? a.state : "ok",
        battery:      a ? a.battery : (85 + Math.floor(Math.random() * 15)),
        lastCheckedAt: `${todayISO}T06:00:00`,
        note:         a ? a.note : null,
      });
    }
  }
}

/* ─── CCTV cameras — grid view of live feeds ───────────────────────────
 * Each tile = one camera. One camera has a high-confidence face match
 * flagged by AI face-scan at the Main Gate — surfaces as a red badge
 * in the grid.
 */
const cctvCameras = [
  { no: "CAM-01", location: "Main Gate · Inbound",  zone: "perimeter", grid: { x: 0, y: 0 }, status: "live",    resolution: "1080p", lastFrameAt: `${todayISO}T10:42:00` },
  { no: "CAM-02", location: "Main Gate · Outbound", zone: "perimeter", grid: { x: 1, y: 0 }, status: "live",    resolution: "1080p", lastFrameAt: `${todayISO}T10:42:00`,
    faceAlert: { id: "FACE-2026-0042", confidence: 0.94, matchedAgainst: "Unknown — not in registered staff DB", capturedAt: `${todayISO}T10:38:00`, priority: "high", note: "Loitering near gate for 6 minutes — face not matched. Security dispatched." } },
  { no: "CAM-03", location: "Reception",            zone: "lobby",     grid: { x: 2, y: 0 }, status: "live",    resolution: "1080p", lastFrameAt: `${todayISO}T10:42:00` },
  { no: "CAM-04", location: "Warehouse-1 Floor",    zone: "warehouse", grid: { x: 3, y: 0 }, status: "live",    resolution: "1080p", lastFrameAt: `${todayISO}T10:42:00` },
  { no: "CAM-05", location: "Warehouse-2 Floor",    zone: "warehouse", grid: { x: 0, y: 1 }, status: "live",    resolution: "1080p", lastFrameAt: `${todayISO}T10:42:00` },
  { no: "CAM-06", location: "Sewing-L1 Aisle",      zone: "production",grid: { x: 1, y: 1 }, status: "live",    resolution: "1080p", lastFrameAt: `${todayISO}T10:42:00` },
  { no: "CAM-07", location: "Sewing-L2 Aisle",      zone: "production",grid: { x: 2, y: 1 }, status: "live",    resolution: "1080p", lastFrameAt: `${todayISO}T10:42:00` },
  { no: "CAM-08", location: "Sewing-L3 Aisle",      zone: "production",grid: { x: 3, y: 1 }, status: "live",    resolution: "1080p", lastFrameAt: `${todayISO}T10:42:00` },
  { no: "CAM-09", location: "Cutting Floor",        zone: "production",grid: { x: 0, y: 2 }, status: "live",    resolution: "1080p", lastFrameAt: `${todayISO}T10:42:00` },
  { no: "CAM-10", location: "Packing Floor",        zone: "production",grid: { x: 1, y: 2 }, status: "live",    resolution: "1080p", lastFrameAt: `${todayISO}T10:42:00` },
  { no: "CAM-11", location: "Canteen",              zone: "common",    grid: { x: 2, y: 2 }, status: "live",    resolution: "720p",  lastFrameAt: `${todayISO}T10:42:00` },
  { no: "CAM-12", location: "Main Gate Backup",     zone: "perimeter", grid: { x: 3, y: 2 }, status: "offline", resolution: "1080p", lastFrameAt: `${todayISO}T07:14:00`, note: "Possible PoE failure since 07:14" },
];

const stamp = (doc) => ({ ...doc, createdAt: now(), updatedAt: now() });

const seedMap = {
  meeting_rooms:       meetingRooms,
  gate_passes:         gatePasses,
  y_shop_orders:       yShopOrders,
  visitors:            visitors,
  car_bookings:        carBookings,
  fire_alarm_events:   fireAlarmEvents,
  fire_alarm_sensors:  fireAlarmSensors,
  cctv_incidents:      cctvIncidents,
  cctv_cameras:        cctvCameras,
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
