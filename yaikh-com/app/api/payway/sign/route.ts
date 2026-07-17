/* POST /api/payway/sign — signs an ABA PayWay purchase for the hosted-checkout
 * popup. Returns { action, params } the browser drops into the hidden form.
 * The API key stays server-side. */

import { NextResponse } from "next/server";
import { signForPopup, paywayConfigured, type PurchaseInput, recordPayment } from "@/lib/payway";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!paywayConfigured()) {
    return NextResponse.json({ error: "PayWay not configured" }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as Partial<PurchaseInput>;
  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }
  // "" = ABA popup shows its method chooser; "abapay_khqr" / "cards" pre-select one.
  const opt = body.payment_option;
  const payment_option = opt === "abapay_khqr" || opt === "cards" ? opt : "";

  // Pre-generate the tran_id so we can point ABA's "Continue" button back to us.
  // ABA redirects the top window to continue_success_url ONLY when the payer
  // clicks Continue on its own success screen — so our success page never shows early.
  const tran_id = "T" + Date.now();
  const origin = req.headers.get("origin") || new URL(req.url).origin;
  const continue_success_url = `${origin}/subscribe?paid=${tran_id}`;

  const currency = body.currency === "KHR" ? "KHR" : "USD";
  const signed = signForPopup({
    tran_id,
    amount: amount.toFixed(2),
    currency,
    firstname: body.firstname,
    email: body.email,
    payment_option,
    continue_success_url,
  });

  // Durable record so we can find/refund this beyond ABA's 3-day list window.
  const b = body as Record<string, unknown>;
  await recordPayment({
    tran_id, amount, currency, payment_option, source: "subscribe",
    plan: typeof b.plan === "string" ? b.plan : undefined,
    company: typeof b.company === "string" ? b.company : undefined,
    contact_name: typeof b.contact_name === "string" ? b.contact_name : undefined,
    email: typeof body.email === "string" ? body.email : undefined,
  });

  return NextResponse.json(signed);
}
