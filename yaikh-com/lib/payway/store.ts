/* Durable payment records in MongoDB.
 *
 * WHY: ABA's transaction-list only returns the last 3 days, but refunds are
 * allowed for 30 days — so we can't rely on ABA to find older payments. We
 * also want the customer context ABA doesn't return (company, plan, email).
 * This store is our own 30-day+ ledger; ABA stays the source of truth for
 * money, this is best-effort metadata.
 *
 * All functions no-op safely when MONGO_URL is unset (paymentsEnabled()===false)
 * and swallow errors so a Mongo hiccup never breaks the ABA payment flow. */

import { getDb } from "@/lib/mongo";

const COLLECTION = "payments";

export function paymentsEnabled(): boolean {
  return Boolean(process.env.MONGO_URL);
}

export type PaymentStatus = "PENDING" | "APPROVED" | "DECLINED" | "REFUNDED" | "CANCELLED";

export interface PaymentRecord {
  tran_id: string;
  amount: number;
  currency: string;
  payment_option?: string;      // abapay_khqr | cards | ""
  status: PaymentStatus;
  refunded_amount?: number;
  plan?: string;
  company?: string;
  contact_name?: string;
  email?: string;
  source: "subscribe" | "merchant-qr";
  created_at: string;           // ISO
  paid_at?: string;
  updated_at: string;
  aba_trace_id?: string;
}

async function col() {
  const db = await getDb();
  return db.collection<PaymentRecord>(COLLECTION);
}

/** Insert a new PENDING payment (idempotent on tran_id). Best-effort. */
export async function recordPayment(
  input: Omit<PaymentRecord, "status" | "created_at" | "updated_at"> & { status?: PaymentStatus },
): Promise<void> {
  if (!paymentsEnabled()) return;
  const now = new Date().toISOString();
  try {
    const c = await col();
    await c.updateOne(
      { tran_id: input.tran_id },
      {
        $setOnInsert: { ...input, status: input.status ?? "PENDING", created_at: now },
        $set: { updated_at: now },
      },
      { upsert: true },
    );
  } catch (e) {
    console.warn("[payments-store] recordPayment failed:", (e as Error).message);
  }
}

/** Patch status / paid_at / refunded_amount for a transaction. Best-effort. */
export async function markPayment(
  tran_id: string,
  patch: Partial<Pick<PaymentRecord, "status" | "refunded_amount" | "aba_trace_id">> & { paid?: boolean },
): Promise<void> {
  if (!paymentsEnabled()) return;
  const now = new Date().toISOString();
  const set: Record<string, unknown> = { updated_at: now };
  if (patch.status) set.status = patch.status;
  if (patch.refunded_amount != null) set.refunded_amount = patch.refunded_amount;
  if (patch.aba_trace_id) set.aba_trace_id = patch.aba_trace_id;
  if (patch.paid) { set.status = "APPROVED"; set.paid_at = now; }
  try {
    const c = await col();
    await c.updateOne({ tran_id }, { $set: set });
  } catch (e) {
    console.warn("[payments-store] markPayment failed:", (e as Error).message);
  }
}

export interface PaymentFilter {
  from?: string; to?: string;   // ISO date boundaries on created_at
  status?: PaymentStatus;
  limit?: number;
}

/** List payments from our ledger (newest first). Returns [] if disabled/empty. */
export async function listPayments(f: PaymentFilter = {}): Promise<PaymentRecord[]> {
  if (!paymentsEnabled()) return [];
  try {
    const c = await col();
    const q: Record<string, unknown> = {};
    if (f.from || f.to) {
      const range: Record<string, string> = {};
      if (f.from) range.$gte = f.from;
      if (f.to) range.$lte = f.to;
      q.created_at = range;
    }
    if (f.status) q.status = f.status;
    return await c.find(q).sort({ created_at: -1 }).limit(f.limit ?? 500).toArray();
  } catch (e) {
    console.warn("[payments-store] listPayments failed:", (e as Error).message);
    return [];
  }
}

export async function getPayment(tran_id: string): Promise<PaymentRecord | null> {
  if (!paymentsEnabled()) return null;
  try {
    const c = await col();
    return await c.findOne({ tran_id });
  } catch { return null; }
}
