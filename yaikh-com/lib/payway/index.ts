/* ABA PayWay module — one import surface for everything.
 *
 *   import { signForPopup, isAdmin, recordPayment, PAYWAY_ENDPOINTS } from "@/lib/payway";
 *
 * Layout:
 *   config.ts  — host, endpoint paths, tunables (no secrets)
 *   client.ts  — signing + all ABA API calls (server-side; API key never leaves)
 *   guard.ts   — admin-cookie gate for merchant routes
 *   store.ts   — durable Mongo ledger (best-effort; no-op without MONGO_URL)
 *
 * Secrets live in yaikh-com/.env.local, never here. */
export * from "./config";
export * from "./client";
export * from "./guard";
export * from "./store";
