/* Seed CSR PA pill-backing collections.
 *
 * Idempotent: clears + re-inserts the 5 collections used by
 * /api/notifications/csr.
 *
 *   air_readings           → "Air temperature today"  (24h hourly)
 *   water_usage            → "Water usage log"        (last 14 days)
 *   energy_consumption     → "Energy consumption"     (last 14 days, kWh)
 *   compliance_audits      → "Compliance audits"      (open + upcoming)
 *   environmental_alerts   → "Environmental alerts"   (open)
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

const today = new Date();
const todayISO = today.toISOString().slice(0, 10);
const now = () => new Date();

/* ─── Air readings — hourly °C across factory floor today ────────────── */
const airReadings = [];
for (let h = 0; h < 24; h++) {
  // Peaks at 14:00 (~33°C), low at 06:00 (~25°C). Sinusoidal.
  const base = 29 + Math.sin(((h - 6) / 24) * Math.PI * 2) * 3.5;
  const tempC = +(base + (Math.random() - 0.5) * 0.4).toFixed(1);
  airReadings.push({
    no:       `AIR-${todayISO}-${String(h).padStart(2, "0")}`,
    date:     todayISO,
    hour:     h,
    tempC,
    humidity: +(60 + (Math.random() - 0.5) * 10).toFixed(0),
    location: "Sewing-L1",
    status:   tempC > 32 ? "alert" : "ok",
  });
}

/* ─── Water usage — last 14 days, daily m³ ──────────────────────────── */
const waterUsage = [];
for (let d = 13; d >= 0; d--) {
  const date = new Date(today.getTime() - d * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const dayOfWeek = new Date(date).getDay();
  const isSunday = dayOfWeek === 0;
  const base = isSunday ? 18 : 142;     // Sunday = minimal (cleaning only)
  const value = +(base + (Math.random() - 0.5) * 20).toFixed(1);
  waterUsage.push({ no: `WU-${date}`, date, m3: value, source: "city + bore", note: isSunday ? "no production" : null });
}

/* ─── Energy consumption — last 14 days, daily kWh ──────────────────── */
const energyConsumption = [];
for (let d = 13; d >= 0; d--) {
  const date = new Date(today.getTime() - d * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const dayOfWeek = new Date(date).getDay();
  const isSunday = dayOfWeek === 0;
  const base = isSunday ? 480 : 4280;   // Sunday baseload only
  const kwh = +(base + (Math.random() - 0.5) * 320).toFixed(0);
  energyConsumption.push({ no: `EN-${date}`, date, kwh, source: "EDC grid", note: isSunday ? "weekend baseload" : null });
}

/* ─── Compliance audits — open + upcoming ────────────────────────────── */
const compliance = [
  { no: "CA-2026-0019", scope: "BSCI",        auditor: "AmFori BSCI",    type: "third-party", scheduled: "2026-07-10", status: "scheduled",  priority: "high",   note: "Pre-audit document pull due 2026-07-01" },
  { no: "CA-2026-0020", scope: "Fire safety", auditor: "MoI Cambodia",   type: "regulatory",  scheduled: "2026-06-27", status: "scheduled",  priority: "high",   note: "Fire-drill required week prior" },
  { no: "CA-2026-0021", scope: "WRAP",        auditor: "WRAP",           type: "third-party", scheduled: "2026-08-05", status: "scheduled",  priority: "medium", note: null },
  { no: "CA-2026-0022", scope: "ISO 14001",   auditor: "Bureau Veritas", type: "third-party", scheduled: "2026-06-15", status: "open",       priority: "medium", note: "5 minor non-conformances — CAPA in progress" },
];

/* ─── Environmental alerts — open ─────────────────────────────────────── */
const environmentalAlerts = [
  { no: "EA-2026-0033", category: "Air",   severity: "high",   subject: "Sewing-L1 temp > 32°C between 14:00–16:00",     detected: `${todayISO}T14:00:00`, status: "open",      priority: "high"   },
  { no: "EA-2026-0034", category: "Water", severity: "medium", subject: "City water consumption 18% above 14-day avg",  detected: `${todayISO}T08:00:00`, status: "reviewing", priority: "medium" },
  { no: "EA-2026-0035", category: "Waste", severity: "low",    subject: "Hazardous-waste bin 75% full — schedule pickup",detected: `${todayISO}T11:30:00`, status: "open",      priority: "low"    },
];

const stamp = (doc) => ({ ...doc, createdAt: now(), updatedAt: now() });

const seedMap = {
  air_readings:         airReadings,
  water_usage:          waterUsage,
  energy_consumption:   energyConsumption,
  compliance_audits:    compliance,
  environmental_alerts: environmentalAlerts,
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
  console.log("\nCSR PA pill-backing collections seeded.");
} finally {
  await client.close();
}
