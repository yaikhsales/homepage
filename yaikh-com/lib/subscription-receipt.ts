import "server-only";

import type { PaymentRecord } from "@/lib/payway";

export type SubscriptionReceipt = {
  receiptId?: string;
  receiptNumber?: string;
  receiptUrl?: string;
  mock?: boolean;
};

type CompanyBank = {
  _id?: unknown;
  account_number?: unknown;
  account_type?: unknown;
  deleted?: unknown;
};

const COMPANY_BANK_ACCOUNT_NUMBER = process.env.COMPANY_BANK_ACCOUNT_NUMBER || "015671377";

export function receiptServiceLiveConfigured() {
  return Boolean(
    process.env.RECEIPT_SERVICE_URL
    && process.env.RECEIPT_SERVICE_TOKEN
    && process.env.COMPANY_BANKS_SERVICE_URL,
  );
}

async function getKhrCompanyBankId() {
  const endpoint = process.env.COMPANY_BANKS_SERVICE_URL;
  if (!endpoint) throw new Error("Company-bank service is not configured.");

  const token = process.env.COMPANY_BANKS_SERVICE_TOKEN || process.env.RECEIPT_SERVICE_TOKEN;
  const response = await fetch(endpoint, {
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!response.ok) throw new Error(`Company-bank service returned ${response.status}.`);

  const body = await response.json().catch(() => ({})) as { data?: unknown };
  const bank = Array.isArray(body.data)
    ? (body.data as CompanyBank[]).find((candidate) => (
      candidate.account_number === COMPANY_BANK_ACCOUNT_NUMBER
      && candidate.account_type === "KHR"
      && candidate.deleted !== true
    ))
    : undefined;
  if (!bank || typeof bank._id !== "string") {
    throw new Error("Configured KHR company bank account was not found.");
  }
  return bank._id;
}

export async function createSubscriptionReceipt(payment: PaymentRecord): Promise<SubscriptionReceipt> {
  const endpoint = process.env.RECEIPT_SERVICE_URL;
  const token = process.env.RECEIPT_SERVICE_TOKEN;
  if (!payment.plan || !payment.company || !payment.contact_name || !payment.email) {
    throw new Error("Payment record is missing receipt details.");
  }
  if (!payment.subtotal_amount || !payment.vat_amount || !payment.fixed_rate) {
    throw new Error("Payment record is missing the tax or fixed-rate details.");
  }
  // Local/default mode: prove the exact contract without making an external call.
  // It becomes live only when the receipt and company-bank service env vars are set.
  if (!endpoint || !token || !process.env.COMPANY_BANKS_SERVICE_URL) {
    return { receiptNumber: `MOCK-${payment.tran_id}`, mock: true };
  }
  const bankId = await getKhrCompanyBankId();

  const response = await fetch(endpoint, {
    method: "POST",
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Idempotency-Key": payment.tran_id,
    },
    body: JSON.stringify({
      external_reference: payment.tran_id,
      status: "paid",
      payment_method: payment.payment_option || "abapay_khqr",
      plan_name: payment.plan,
      company_name: payment.company,
      company_country: payment.country,
      contact_name: payment.contact_name,
      contact_email: payment.email,
      currency: "KHR",
      // The receipt service calculates VAT from this base amount and category.
      // Do not send the VAT-inclusive ABA payment total here.
      original_amount: payment.subtotal_amount,
      is_fixed_rate: true,
      fixed_rate: payment.fixed_rate,
      category_type: "vat",
      bank_id: bankId,
    }),
  });
  if (!response.ok) throw new Error(`Receipt service returned ${response.status}.`);

  const body = await response.json().catch(() => ({})) as {
    receipt_id?: unknown; receipt_number?: unknown; receipt_url?: unknown;
  };
  return {
    receiptId: typeof body.receipt_id === "string" ? body.receipt_id : undefined,
    receiptNumber: typeof body.receipt_number === "string" ? body.receipt_number : undefined,
    receiptUrl: typeof body.receipt_url === "string" ? body.receipt_url : undefined,
  };
}
