import "server-only";

import { createHash, randomBytes, randomUUID, timingSafeEqual } from "crypto";
import { getDb } from "@/lib/mongo";
import { sendSubscriptionOtp, IntegrationUnavailableError, MicrosoftGraphError } from "@/lib/subscription-email";
import { createSubscriptionInvoice } from "@/lib/subscription-invoice";
import { ADVANCED_PLAN_AMOUNTS, isAdvancedPlan, type AdvancedPlanName } from "@/lib/subscription-plans";

const OTP_TTL_MS = 10 * 60_000;
const RESEND_COOLDOWN_MS = 60_000;
const MAX_ATTEMPTS = 5;
const MAX_EMAIL_REQUESTS_PER_DAY = 5;
const MAX_IP_REQUESTS_PER_DAY = 20;

type SubscriptionInput = {
  planName: string;
  companyName: string;
  country: string;
  contactName: string;
  contactEmail: string;
  agreed: boolean;
};

type OtpRecord = {
  requestId: string;
  planName: AdvancedPlanName;
  amount: number;
  companyName: string;
  country: string;
  contactName: string;
  contactEmail: string;
  emailHash: string;
  ipHash: string;
  otpSalt: string;
  otpHash: string;
  attempts: number;
  sendCount: number;
  resendAfter: Date;
  expiresAt: Date;
  verifiedAt?: Date;
  deliveryFailedAt?: Date;
  invoiceState: "pending" | "creating" | "created" | "failed";
  invoiceId?: string;
  invoiceNumber?: string;
  invoiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export class RequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly diagnostic?: { provider: "microsoft_graph"; status: number; code: string },
  ) {
    super(message);
    this.name = "RequestError";
  }
}

export function isRequestError(error: unknown): error is RequestError {
  return error instanceof RequestError
    || (error instanceof Error && error.name === "RequestError" && typeof (error as RequestError).status === "number");
}

function normalizedEmail(value: string) { return value.trim().toLowerCase(); }
function digest(value: string) { return createHash("sha256").update(value).digest("hex"); }
function otpDigest(salt: string, code: string) { return digest(`${salt}:${code}`); }
function randomOtp() { return String(Math.floor(100_000 + Math.random() * 900_000)); }

function validate(input: SubscriptionInput): asserts input is SubscriptionInput & { planName: AdvancedPlanName } {
  if (!isAdvancedPlan(input.planName)) throw new RequestError("Choose an advanced plan to request an invoice.", 400);
  if (!input.companyName.trim()) throw new RequestError("Enter your company name.", 400);
  if (!input.contactName.trim()) throw new RequestError("Enter a primary contact name.", 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalizedEmail(input.contactEmail))) {
    throw new RequestError("Enter a valid contact email.", 400);
  }
  if (!input.agreed) throw new RequestError("Please agree to all terms before continuing.", 400);
}

function publicOtpResult(record: Pick<OtpRecord, "requestId" | "expiresAt" | "resendAfter">) {
  const now = Date.now();
  return {
    requestId: record.requestId,
    expiresInSeconds: Math.max(0, Math.ceil((record.expiresAt.getTime() - now) / 1000)),
    resendAfterSeconds: Math.max(0, Math.ceil((record.resendAfter.getTime() - now) / 1000)),
  };
}

export async function requestSubscriptionOtp(input: SubscriptionInput, ip: string) {
  validate(input);

  const now = new Date();
  const email = normalizedEmail(input.contactEmail);
  const emailHash = digest(email);
  const ipHash = digest(ip || "unknown");
  const collection = (await getDb()).collection<OtpRecord>("subscription_otp_requests");
  const windowStart = new Date(now.getTime() - 24 * 60 * 60_000);
  const [emailCount, ipCount] = await Promise.all([
    collection.countDocuments({ emailHash, createdAt: { $gte: windowStart } }),
    collection.countDocuments({ ipHash, createdAt: { $gte: windowStart } }),
  ]);
  if (emailCount >= MAX_EMAIL_REQUESTS_PER_DAY || ipCount >= MAX_IP_REQUESTS_PER_DAY) {
    throw new RequestError("Too many verification requests. Please try again tomorrow.", 429);
  }

  const active = await collection.findOne({
    emailHash, planName: input.planName, verifiedAt: { $exists: false }, expiresAt: { $gt: now },
  });
  if (active && active.resendAfter > now) {
    throw new RequestError("Please wait one minute before requesting another code.", 429);
  }

  const code = randomOtp();
  const otpSalt = randomBytes(16).toString("hex");
  const resendAfter = new Date(now.getTime() + RESEND_COOLDOWN_MS);
  const expiresAt = new Date(now.getTime() + OTP_TTL_MS);
  const requestId = active?.requestId || randomUUID();
  const record: OtpRecord = {
    requestId,
    planName: input.planName,
    amount: ADVANCED_PLAN_AMOUNTS[input.planName],
    companyName: input.companyName.trim(),
    country: input.country.trim(),
    contactName: input.contactName.trim(),
    contactEmail: email,
    emailHash,
    ipHash,
    otpSalt,
    otpHash: otpDigest(otpSalt, code),
    attempts: 0,
    sendCount: (active?.sendCount || 0) + 1,
    resendAfter,
    expiresAt,
    invoiceState: active?.invoiceState || "pending",
    createdAt: active?.createdAt || now,
    updatedAt: now,
  };

  await collection.updateOne(
    { requestId },
    { $set: record },
    { upsert: true },
  );
  try {
    await sendSubscriptionOtp({ email, code, planName: input.planName, requestId });
  } catch (error) {
    await collection.updateOne({ requestId }, { $set: { updatedAt: new Date(), deliveryFailedAt: new Date() } });
    if (error instanceof IntegrationUnavailableError) throw new RequestError(error.message, 503);
    if (error instanceof MicrosoftGraphError) {
      throw new RequestError(
        "We could not send the verification code. Please try again shortly.",
        502,
        { provider: "microsoft_graph", status: error.status, code: error.code },
      );
    }
    throw new RequestError("We could not send the verification code. Please try again shortly.", 502);
  }
  return publicOtpResult(record);
}

export async function verifySubscriptionOtp(requestId: string, code: string) {
  if (!/^[a-f0-9-]{36}$/i.test(requestId) || !/^\d{6}$/.test(code)) {
    throw new RequestError("Enter the six-digit verification code.", 400);
  }
  const collection = (await getDb()).collection<OtpRecord>("subscription_otp_requests");
  const current = await collection.findOne({ requestId });
  if (!current) throw new RequestError("This verification request was not found. Request a new code.", 404);
  if (current.invoiceState === "created") {
    return { invoiceNumber: current.invoiceNumber, invoiceUrl: current.invoiceUrl };
  }
  const now = new Date();
  if (!current.verifiedAt) {
    if (current.expiresAt <= now) throw new RequestError("This code has expired. Request a new one.", 400);
    if (current.attempts >= MAX_ATTEMPTS) throw new RequestError("Too many incorrect attempts. Request a new code.", 429);
    const expected = Buffer.from(current.otpHash, "hex");
    const supplied = Buffer.from(otpDigest(current.otpSalt, code), "hex");
    const valid = expected.length === supplied.length && timingSafeEqual(expected, supplied);
    if (!valid) {
      await collection.updateOne({ requestId }, { $inc: { attempts: 1 }, $set: { updatedAt: now } });
      throw new RequestError("That verification code is not correct.", 400);
    }
    const updated = await collection.updateOne(
      { requestId, verifiedAt: { $exists: false }, attempts: current.attempts },
      { $set: { verifiedAt: now, updatedAt: now } },
    );
    if (!updated.modifiedCount) throw new RequestError("Please try verifying the code again.", 409);
  }

  const ready = await collection.findOne({ requestId });
  if (!ready) throw new RequestError("This verification request was not found.", 404);
  if (ready.invoiceState === "created") return { invoiceNumber: ready.invoiceNumber, invoiceUrl: ready.invoiceUrl };

  // An OTP-verification success should not depend on the optional invoice
  // system. Until the invoice integration is explicitly enabled, the commerce
  // team receives the verified request and handles invoicing separately.
  if (process.env.SUBSCRIPTION_INVOICE_ENABLED !== "true") {
    await collection.updateOne(
      { requestId },
      { $set: { invoiceState: "pending", updatedAt: new Date() } },
    );
    return {};
  }

  const invoiceClaim = await collection.updateOne(
    { requestId, invoiceState: { $in: ["pending", "failed"] } },
    { $set: { invoiceState: "creating", updatedAt: new Date() } },
  );
  if (!invoiceClaim.modifiedCount) {
    const currentInvoice = await collection.findOne({ requestId });
    if (currentInvoice?.invoiceState === "created") {
      return { invoiceNumber: currentInvoice.invoiceNumber, invoiceUrl: currentInvoice.invoiceUrl };
    }
    throw new RequestError("Your invoice request is already being created. Please wait a moment.", 409);
  }
  try {
    const invoice = await createSubscriptionInvoice({
      requestId: ready.requestId,
      planName: ready.planName,
      amount: ready.amount,
      companyName: ready.companyName,
      country: ready.country,
      contactName: ready.contactName,
      contactEmail: ready.contactEmail,
    });
    await collection.updateOne(
      { requestId },
      { $set: { invoiceState: "created", ...invoice, updatedAt: new Date() } },
    );
    return { invoiceNumber: invoice.invoiceNumber, invoiceUrl: invoice.invoiceUrl };
  } catch (error) {
    await collection.updateOne({ requestId }, { $set: { invoiceState: "failed", updatedAt: new Date() } });
    if (error instanceof IntegrationUnavailableError) throw new RequestError(error.message, 503);
    throw new RequestError("We could not create the invoice request. Please try again shortly.", 502);
  }
}
