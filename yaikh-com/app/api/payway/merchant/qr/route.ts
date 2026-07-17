/* POST /api/payway/merchant/qr — merchant generates a KHQR to collect payment.
 * Admin-only. Returns qrImage (data URI) + qrString + tran_id. */

import { NextResponse } from "next/server";
import { generateQr, paywayConfigured, isAdmin, recordPayment } from "@/lib/payway";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!paywayConfigured()) return NextResponse.json({ error: "PayWay not configured" }, { status: 503 });
  const b = await req.json().catch(() => ({}));
  const amount = Number(b.amount);
  if (!Number.isFinite(amount) || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  const currency = b.currency === "KHR" ? "KHR" : "USD";
  const r = await generateQr({
    amount,
    currency,
    first_name: typeof b.first_name === "string" ? b.first_name : undefined,
    email: typeof b.email === "string" ? b.email : undefined,
    tran_id: typeof b.tran_id === "string" && b.tran_id ? b.tran_id : undefined,
  });

  // Record the collect-payment QR so it survives ABA's 3-day list window.
  if (r?.sent_tran_id && (r?.status?.code === 0 || r?.status?.code === "0" || r?.status?.code === "00")) {
    await recordPayment({
      tran_id: String(r.sent_tran_id), amount, currency, payment_option: "abapay_khqr",
      source: "merchant-qr",
      contact_name: typeof b.first_name === "string" ? b.first_name : undefined,
      email: typeof b.email === "string" ? b.email : undefined,
    });
  }
  return NextResponse.json(r);
}
