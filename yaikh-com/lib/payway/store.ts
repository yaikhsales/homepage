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
import { PAYWAY_TRANSACTION_LIFETIME_MINUTES } from "./config";

const COLLECTION = "payments";

export function paymentsEnabled(): boolean {
  return Boolean(process.env.MONGO_URL);
}

export type PaymentStatus = "PENDING" | "APPROVED" | "DECLINED" | "REFUNDED" | "CANCELLED" | "EXPIRED";
export type ReceiptStatus = "PENDING" | "POSTING" | "POSTED" | "MOCK" | "FAILED" | "DISABLED";

export interface PaymentRecord {
  tran_id: string;
  amount: number;
  currency: string;
  subtotal_amount?: number;
  vat_amount?: number;
  is_fixed_rate?: boolean;
  fixed_rate?: number;
  payment_option?: string;      // abapay_khqr for website subscriptions
  status: PaymentStatus;
  refunded_amount?: number;
  refund_remark?: string;
  plan?: string;
  company?: string;
  country?: string;
  contact_name?: string;
  email?: string;
  source: "subscribe" | "merchant-qr";
  created_at: string;           // ISO
  expires_at?: string;
  expired_at?: string;
  paid_at?: string;
  updated_at: string;
  aba_trace_id?: string;
  receipt_status?: ReceiptStatus;
  receipt_id?: string;
  receipt_number?: string;
  receipt_url?: string;
  receipt_error?: string;
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
  patch: Partial<Pick<PaymentRecord, "status" | "refunded_amount" | "refund_remark" | "aba_trace_id">> & { paid?: boolean },
): Promise<void> {
  if (!paymentsEnabled()) return;
  const now = new Date().toISOString();
  const set: Record<string, unknown> = { updated_at: now };
  if (patch.status) set.status = patch.status;
  if (patch.refunded_amount != null) set.refunded_amount = patch.refunded_amount;
  if (patch.refund_remark) set.refund_remark = patch.refund_remark;
  if (patch.aba_trace_id) set.aba_trace_id = patch.aba_trace_id;
  if (patch.paid) { set.status = "APPROVED"; set.paid_at = now; }
  try {
    const c = await col();
    await c.updateOne({ tran_id }, { $set: set });
  } catch (e) {
    console.warn("[payments-store] markPayment failed:", (e as Error).message);
  }
}

/** Mark an ABA-confirmed unpaid transaction expired without overwriting a concurrent approval. */
export async function expirePendingPayment(tran_id: string): Promise<boolean> {
  if (!paymentsEnabled()) return false;
  const now = new Date().toISOString();
  try {
    const result = await (await col()).updateOne(
      { tran_id, status: "PENDING" },
      { $set: { status: "EXPIRED", expired_at: now, updated_at: now } },
    );
    return result.modifiedCount === 1;
  } catch (e) {
    console.warn("[payments-store] expirePendingPayment failed:", (e as Error).message);
    return false;
  }
}

/** Expire ledger rows whose signed ABA checkout lifetime has elapsed. */
export async function expireStalePendingPayments(): Promise<number> {
  if (!paymentsEnabled()) return 0;
  const now = new Date().toISOString();
  const legacyCutoff = new Date(
    Date.now() - PAYWAY_TRANSACTION_LIFETIME_MINUTES * 60_000,
  ).toISOString();
  try {
    const result = await (await col()).updateMany(
      {
        status: "PENDING",
        source: "subscribe",
        $or: [
          { expires_at: { $lte: now } },
          { expires_at: { $exists: false }, created_at: { $lte: legacyCutoff } },
        ],
      },
      { $set: { status: "EXPIRED", expired_at: now, updated_at: now } },
    );
    return result.modifiedCount;
  } catch (e) {
    console.warn("[payments-store] expireStalePendingPayments failed:", (e as Error).message);
    return 0;
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

/** Atomically reserve a paid subscription for receipt delivery. */
export async function claimReceiptDelivery(tran_id: string): Promise<PaymentRecord | null> {
  if (!paymentsEnabled()) return null;
  try {
    const result = await (await col()).findOneAndUpdate(
      {
        tran_id,
        status: "APPROVED",
        $or: [
          { receipt_status: { $exists: false } },
          { receipt_status: "PENDING" },
          { receipt_status: "MOCK" },
          { receipt_status: "FAILED" },
        ],
      },
      { $set: { receipt_status: "POSTING", receipt_error: undefined, updated_at: new Date().toISOString() } },
      { returnDocument: "after" },
    );
    return result ?? null;
  } catch (e) {
    console.warn("[payments-store] claimReceiptDelivery failed:", (e as Error).message);
    return null;
  }
}

export async function markReceiptDelivery(
  tran_id: string,
  patch: Pick<PaymentRecord, "receipt_status"> & Partial<Pick<PaymentRecord, "receipt_id" | "receipt_number" | "receipt_url" | "receipt_error">>,
): Promise<void> {
  if (!paymentsEnabled()) return;
  try {
    await (await col()).updateOne(
      { tran_id },
      { $set: { ...patch, updated_at: new Date().toISOString() } },
    );
  } catch (e) {
    console.warn("[payments-store] markReceiptDelivery failed:", (e as Error).message);
  }
}
