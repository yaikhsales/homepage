import "server-only";

import { IntegrationUnavailableError } from "@/lib/subscription-email";

export type InvoiceRequest = {
  requestId: string;
  planName: string;
  amount: number;
  companyName: string;
  country: string;
  contactName: string;
  contactEmail: string;
};

export async function createSubscriptionInvoice(input: InvoiceRequest) {
  const endpoint = process.env.INVOICE_SERVICE_URL;
  const token = process.env.INVOICE_SERVICE_TOKEN;
  if (!endpoint || !token) {
    throw new IntegrationUnavailableError("Invoice service is not configured yet.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Idempotency-Key": input.requestId,
    },
    body: JSON.stringify({
      type: "cloud_subscription_request",
      requestId: input.requestId,
      plan: { name: input.planName, amount: input.amount, currency: "USD" },
      company: { name: input.companyName, country: input.country },
      contact: { name: input.contactName, email: input.contactEmail },
      delivery: {
        customerEmail: input.contactEmail,
        internalRecipients: ["ecom@yaikh.com"],
      },
    }),
  });
  if (!response.ok) throw new Error("The invoice service could not create the request.");

  const body = await response.json().catch(() => ({})) as {
    invoiceId?: unknown; invoiceNumber?: unknown; invoiceUrl?: unknown;
  };
  return {
    invoiceId: typeof body.invoiceId === "string" ? body.invoiceId : undefined,
    invoiceNumber: typeof body.invoiceNumber === "string" ? body.invoiceNumber : undefined,
    invoiceUrl: typeof body.invoiceUrl === "string" ? body.invoiceUrl : undefined,
  };
}
