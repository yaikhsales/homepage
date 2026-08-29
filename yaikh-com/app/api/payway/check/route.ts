/* POST /api/payway/check — server-side verification of a purchase.
 * The browser popup's "success" event is NOT proof of payment; the
 * subscribe page must gate its success state on this. Returns
 * { paid, code, status } where code 0 = APPROVED. */

import { NextResponse } from "next/server";
import {
  checkTransaction, paywayConfigured, markPayment, getPayment,
  claimReceiptDelivery, markReceiptDelivery, expirePendingPayment,
  PAYWAY_TRANSACTION_LIFETIME_MINUTES,
} from "@/lib/payway";
import { createSubscriptionReceipt, receiptServiceLiveConfigured } from "@/lib/subscription-receipt";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const RECEIPT_DELIVERY_ENABLED = process.env.SUBSCRIPTION_RECEIPTS_ENABLED === "true";

async function deliverReceipt(tranId: string) {
  const existing = await getPayment(tranId);
  if (!existing || existing.source !== "subscribe") return null;

  if (receiptServiceLiveConfigured() && existing.receipt_status === "POSTED") {
    return { status: "posted" as const, number: existing.receipt_number, url: existing.receipt_url };
  }

  const claimed = await claimReceiptDelivery(tranId);
  if (!claimed) {
    const latest = await getPayment(tranId);
    return latest?.receipt_status === "POSTED"
      ? { status: "posted" as const, number: latest.receipt_number, url: latest.receipt_url }
      : { status: "processing" as const };
  }

  try {
    const receipt = await createSubscriptionReceipt(claimed);
    await markReceiptDelivery(tranId, {
      receipt_status: receipt.mock ? "MOCK" : "POSTED",
      receipt_id: receipt.receiptId,
      receipt_number: receipt.receiptNumber,
      receipt_url: receipt.receiptUrl,
    });
    return receipt.mock
      ? { status: "mock" as const, number: receipt.receiptNumber }
      : { status: "posted" as const, number: receipt.receiptNumber, url: receipt.receiptUrl };
  } catch (error) {
    await markReceiptDelivery(tranId, {
      receipt_status: "FAILED",
      receipt_error: error instanceof Error ? error.message.slice(0, 160) : "Receipt delivery failed.",
    });
    return { status: "pending" as const };
  }
}

export async function POST(req: Request) {
  if (!paywayConfigured()) {
    return NextResponse.json({ error: "PayWay not configured" }, { status: 503 });
  }
  const { tran_id } = (await req.json().catch(() => ({}))) as { tran_id?: string };
  if (!tran_id) {
    return NextResponse.json({ error: "Missing tran_id" }, { status: 400 });
  }
  const res = await checkTransaction(tran_id);
  const data = (res && typeof res === "object" && res.data) || {};
  const code = data.payment_status_code;
  const paid = code === 0;
  let status = typeof data.payment_status === "string" ? data.payment_status : null;

  // Keep our ledger in sync with the live ABA status.
  let receipt: Awaited<ReturnType<typeof deliverReceipt>> = null;
  if (paid) {
    await markPayment(tran_id, { paid: true });
    receipt = RECEIPT_DELIVERY_ENABLED
      ? await deliverReceipt(tran_id)
      : null;
  } else if (typeof data.payment_status === "string" && /DECLIN|CANCEL|REFUND/i.test(data.payment_status)) {
    const s = data.payment_status.toUpperCase();
    await markPayment(tran_id, { status: s.includes("REFUND") ? "REFUNDED" : s.includes("CANCEL") ? "CANCELLED" : "DECLINED" });
  } else if (Number(code) === 2 && (res?.status?.code === "00" || res?.status?.code === 0)) {
    // ABA still says PENDING. Only expire after the signed lifetime has elapsed;
    // the atomic PENDING filter prevents overwriting a concurrent approval.
    const existing = await getPayment(tran_id);
    const createdAt = existing ? Date.parse(existing.created_at) : Number.NaN;
    const expiresAt = existing?.expires_at
      ? Date.parse(existing.expires_at)
      : createdAt + PAYWAY_TRANSACTION_LIFETIME_MINUTES * 60_000;
    if (existing?.status === "EXPIRED") {
      // ABA keeps an unpaid transaction as PENDING after its checkout lifetime.
      // Preserve our terminal ledger state on repeat admin checks.
      status = "EXPIRED";
    } else if (existing?.status === "PENDING" && Number.isFinite(expiresAt) && expiresAt <= Date.now()) {
      if (await expirePendingPayment(tran_id)) status = "EXPIRED";
    }
  }

  return NextResponse.json({
    paid,
    code: code ?? null,
    status,
    raw_status: res?.status ?? null,
    receipt,
  });
}
