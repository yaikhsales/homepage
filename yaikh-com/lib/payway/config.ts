/* ABA PayWay — all the knobs you'd actually want to change, in ONE place.
 *
 * SECRETS DO NOT LIVE HERE. Merchant id, API key, RSA public key and the
 * Mongo URL stay in yaikh-com/.env.local (never committed). This file only
 * holds non-secret config: the checkout host, the endpoint paths, and a few
 * tunables. Change a URL or path here and every route/library follows. */

// Checkout host. Sandbox by default; set PAYWAY_BASE_URL in .env.local to go
// live (e.g. https://checkout.payway.com.kh). Trailing slash is trimmed.
export const PAYWAY_BASE = (process.env.PAYWAY_BASE_URL || "https://checkout-sandbox.payway.com.kh").replace(/\/$/, "");

// Every ABA endpoint we call, derived from PAYWAY_BASE. If ABA moves a path,
// change it here only.
export const PAYWAY_ENDPOINTS = {
  purchase:          `${PAYWAY_BASE}/api/payment-gateway/v1/payments/purchase`,
  checkTransaction:  `${PAYWAY_BASE}/api/payment-gateway/v1/payments/check-transaction-2`,
  generateQr:        `${PAYWAY_BASE}/api/payment-gateway/v1/payments/generate-qr`,
  transactionList:   `${PAYWAY_BASE}/api/payment-gateway/v1/payments/transaction-list-2`,
  transactionDetail: `${PAYWAY_BASE}/api/payment-gateway/v1/payments/transaction-detail`,
  refund:            `${PAYWAY_BASE}/api/merchant-portal/merchant-access/online-transaction/refund`,
} as const;

// Misc tunables (non-secret).
export const PAYWAY_CONFIG = {
  defaultCurrency: "USD" as "USD" | "KHR",
  supportEmail: "gamini@yaikh.com",
  // /subscribe payment polling
  pollIntervalMs: 3000,
  pollCeilingMs: 5 * 60_000,
} as const;
