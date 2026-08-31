/* ABA PayWay — server-side signing. The documented hash field order and
 * payment_gate-not-in-hash behavior must remain exact. API credentials never
 * leave the server. */

import crypto from "crypto";
import { PAYWAY_ENDPOINTS, PAYWAY_TRANSACTION_LIFETIME_MINUTES } from "./config";

// Secrets stay in env; non-secret host/paths live in ./config.
const MERCHANT_ID = process.env.PAYWAY_MERCHANT_ID || "";
const API_KEY = process.env.PAYWAY_API_KEY || "";

export const PURCHASE_URL = PAYWAY_ENDPOINTS.purchase;

export function paywayConfigured(): boolean {
  return Boolean(MERCHANT_ID && API_KEY);
}

const reqTime = () => new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
const hmac = (str: string) => crypto.createHmac("sha512", API_KEY).update(str).digest("base64");

export interface PurchaseInput {
  tran_id?: string;
  amount: number | string;
  currency?: "USD" | "KHR";
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  payment_option?: string;
  type?: "purchase" | "pre-auth";
  lifetime?: number; // transaction lifetime in minutes
  view_type?: "popup";
  continue_success_url?: string; // Redirect target after a successful ABA payment
}

// Purchase params + hash (documented field order, exact). Empty optional values
// contribute nothing to the hash and are removed before the form is submitted.
export function buildPurchaseParams(input: PurchaseInput): Record<string, string> {
  const p: Record<string, string> = {
    req_time: reqTime(),
    merchant_id: MERCHANT_ID,
    tran_id: input.tran_id || "T" + Date.now(),
    amount: String(input.amount ?? "1.00"),
    items: "",
    shipping: "", // optional; removed from the submitted form below
    firstname: input.firstname || "",
    lastname: input.lastname || "",
    email: input.email || "",
    phone: input.phone || "",
    type: input.type === "pre-auth" ? "pre-auth" : "purchase",
    payment_option: input.payment_option ?? "",
    return_url: "",
    cancel_url: "",
    continue_success_url: input.continue_success_url || "",
    return_deeplink: "",
    currency: input.currency || "USD",
    custom_fields: "",
    return_params: "",
    payout: "",
    lifetime: String(input.lifetime ?? PAYWAY_TRANSACTION_LIFETIME_MINUTES),
    additional_params: "",
    google_pay_token: "",
    // ABA onboarding requires merchants with their own confirmation page to
    // skip PayWay's success screen and continue to our verified result route.
    skip_success_page: "1",
  };
  p.view_type = input.view_type ?? "popup";
  const b4 =
    p.req_time + p.merchant_id + p.tran_id + p.amount + p.items + p.shipping +
    p.firstname + p.lastname + p.email + p.phone + p.type + p.payment_option +
    p.return_url + p.cancel_url + p.continue_success_url + p.return_deeplink +
    p.currency + p.custom_fields + p.return_params + p.payout + p.lifetime +
    p.additional_params + p.google_pay_token + p.skip_success_page;
  p.hash = hmac(b4);
  return Object.fromEntries(
    Object.entries(p).filter(([, value]) => value !== ""),
  );
}

// Sign for the hosted-checkout popup: payment_gate=0 (NOT hashed) makes PayWay
// 302 to its hosted checkout page, which the official popup iframe needs.
export function signForPopup(input: PurchaseInput) {
  const params = buildPurchaseParams(input);
  params.payment_gate = "0";
  return { action: PURCHASE_URL, params };
}

async function postJSON(url: string, payload: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const raw = await res.text();
  try { return JSON.parse(raw); } catch { return raw.slice(0, 2000); }
}

// Check transaction (≤7 days). Hash = req_time + merchant_id + tran_id.
// Response nests under body.data.payment_status_code (0 = APPROVED).
export async function checkTransaction(tran_id: string) {
  const rt = reqTime();
  return postJSON(PAYWAY_ENDPOINTS.checkTransaction, {
    req_time: rt,
    merchant_id: MERCHANT_ID,
    tran_id,
    hash: hmac(rt + MERCHANT_ID + tran_id),
  });
}

// Railway/host env editors often store multiline PEMs with literal "\n" — restore
// real newlines so crypto.publicEncrypt can parse the key (else refund 500s).
const RSA_PUB = (process.env.PAYWAY_RSA_PUBLIC_KEY || "").replace(/\\n/g, "\n");
export function refundConfigured(): boolean {
  if (!RSA_PUB) return false;
  try {
    crypto.createPublicKey(RSA_PUB);
    return true;
  } catch {
    return false;
  }
}

// RSA-encrypt JSON in PKCS1 117-byte chunks (1024-bit key), base64 the whole.
// Used for merchant_auth on refund. Ported verbatim from server.js rsaEncrypt.
function rsaEncrypt(obj: unknown): string {
  const data = Buffer.from(typeof obj === "string" ? obj : JSON.stringify(obj));
  const chunks: Buffer[] = [];
  for (let i = 0; i < data.length; i += 117) {
    chunks.push(crypto.publicEncrypt(
      { key: RSA_PUB, padding: crypto.constants.RSA_PKCS1_PADDING },
      data.subarray(i, i + 117),
    ));
  }
  return Buffer.concat(chunks).toString("base64");
}

// ─── QR API (generate-qr) — merchant collects payment by showing a QR. ───
// Its own hash order (see server.js generateQr). Success status.code === 0
// (number, not "00"); returns qrImage (base64 PNG data URI) + qrString.
export interface QrInput {
  tran_id?: string;
  amount: number | string;
  currency?: "USD" | "KHR";
  first_name?: string;
  email?: string;
  phone?: string;
  payment_option?: string; // default abapay_khqr
  lifetime?: number;       // minutes
}
export async function generateQr(i: QrInput) {
  const p: Record<string, string | number> = {
    req_time: reqTime(),
    merchant_id: MERCHANT_ID,
    tran_id: i.tran_id || "Q" + Date.now(),
    first_name: i.first_name || "",
    last_name: "",
    email: i.email || "",
    phone: i.phone || "",
    amount: Number(i.amount ?? 0.01),
    currency: i.currency || "USD",
    purchase_type: "purchase",
    payment_option: i.payment_option || "abapay_khqr",
    items: "", callback_url: "", return_deeplink: "", custom_fields: "",
    return_params: "", payout: "",
    lifetime: Number(i.lifetime ?? 30),
    qr_image_template: "template3_color",
  };
  p.hash = hmac(String(p.req_time) + p.merchant_id + p.tran_id + p.amount + p.items +
    p.first_name + p.last_name + p.email + p.phone + p.purchase_type +
    p.payment_option + p.callback_url + p.return_deeplink + p.currency +
    p.custom_fields + p.return_params + p.payout + p.lifetime + p.qr_image_template);
  const r = await postJSON(PAYWAY_ENDPOINTS.generateQr, p);
  return { sent_tran_id: p.tran_id, ...r };
}

// ─── Transaction list ───  hash = req_time+mid+from_date+to_date+from_amount+to_amount+status+page+pagination
export interface TxnListFilter {
  from_date?: string; to_date?: string;
  from_amount?: string; to_amount?: string;
  status?: string; page?: number; pagination?: number;
}
export async function transactionList(f: TxnListFilter = {}) {
  const rt = reqTime();
  const v = (x: unknown) => (x === undefined || x === null || x === "" ? "" : String(x));
  const payload: Record<string, string | number> = { req_time: rt, merchant_id: MERCHANT_ID };
  for (const k of ["from_date", "to_date", "from_amount", "to_amount", "status", "page", "pagination"] as const)
    if (f[k] !== undefined && f[k] !== "") payload[k] = f[k] as string | number;
  payload.hash = hmac(rt + MERCHANT_ID + v(f.from_date) + v(f.to_date) +
    v(f.from_amount) + v(f.to_amount) + v(f.status) + v(f.page) + v(f.pagination));
  return postJSON(PAYWAY_ENDPOINTS.transactionList, payload);
}

// ─── Transaction detail ───  hash = req_time+mid+tran_id  (rate limit 10/min)
export async function transactionDetail(tran_id: string) {
  const rt = reqTime();
  return postJSON(PAYWAY_ENDPOINTS.transactionDetail, {
    req_time: rt, merchant_id: MERCHANT_ID, tran_id, hash: hmac(rt + MERCHANT_ID + tran_id),
  });
}

// ─── Refund (full/partial, within 30 days) ───
// merchant_auth = RSA({mc_id,tran_id,refund_amount}); hash = request_time+mid+merchant_auth
export async function refund(tran_id: string, refund_amount: number | string) {
  const rt = reqTime();
  const auth = rsaEncrypt({ mc_id: MERCHANT_ID, tran_id, refund_amount: String(refund_amount) });
  return postJSON(PAYWAY_ENDPOINTS.refund, {
    request_time: rt, merchant_id: MERCHANT_ID, merchant_auth: auth, hash: hmac(rt + MERCHANT_ID + auth),
  });
}
