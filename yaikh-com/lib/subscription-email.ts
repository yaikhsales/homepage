import "server-only";

export class IntegrationUnavailableError extends Error {}

/** Safe Microsoft Graph diagnostics. Only returned by the local development API. */
export class MicrosoftGraphError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
  ) {
    super(message);
    this.name = "MicrosoftGraphError";
  }
}

type OtpEmail = {
  email: string;
  code: string;
  planName: string;
  requestId: string;
};

function normalizedGraphErrorCode(payload: unknown) {
  const error = payload && typeof payload === "object" && "error" in payload
    ? (payload as { error?: unknown }).error
    : undefined;
  const code = error && typeof error === "object" && "code" in error
    ? (error as { code?: unknown }).code
    : typeof error === "string" ? error : undefined;
  if (typeof code !== "string") return "unknown";
  const normalized = code.trim().replace(/[^A-Za-z0-9_.-]/g, "").slice(0, 80);
  return normalized || "unknown";
}

function logGraphFailure(status: number, code: string) {
  if (process.env.NODE_ENV !== "production") {
    console.error("[subscription-otp] Microsoft Graph failure", { status, code });
  }
}

const GRAPH_REQUEST_TIMEOUT_MS = 15_000;

async function graphFetch(url: string, init: RequestInit) {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(GRAPH_REQUEST_TIMEOUT_MS) });
  } catch {
    throw new MicrosoftGraphError("Microsoft Outlook could not be reached.", 0, "network_error");
  }
}

function getMicrosoftGraphConfig() {
  const tenantId = process.env.MICROSOFT_TENANT_ID;
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const sender = process.env.MICROSOFT_SENDER_EMAIL || "ecom@yaikh.com";

  if (!tenantId || !clientId || !clientSecret) {
    throw new IntegrationUnavailableError("Email verification is not configured yet.");
  }

  return { tenantId, clientId, clientSecret, sender };
}

async function getMicrosoftGraphAccessToken(config: ReturnType<typeof getMicrosoftGraphConfig>) {
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default",
  });
  const response = await graphFetch(
    `https://login.microsoftonline.com/${encodeURIComponent(config.tenantId)}/oauth2/v2.0/token`,
    {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );
  const payload = await response.json().catch(() => null) as unknown;
  const accessToken = payload && typeof payload === "object" && "access_token" in payload
    ? (payload as { access_token?: unknown }).access_token
    : undefined;
  if (!response.ok || typeof accessToken !== "string" || !accessToken) {
    logGraphFailure(response.status, normalizedGraphErrorCode(payload));
    throw new MicrosoftGraphError(
      "Microsoft Outlook authentication failed.",
      response.status,
      normalizedGraphErrorCode(payload),
    );
  }
  return accessToken;
}

/** Sends server-side through Microsoft Graph using the ecom mailbox. */
export async function sendSubscriptionOtp(input: OtpEmail) {
  const config = getMicrosoftGraphConfig();
  const accessToken = await getMicrosoftGraphAccessToken(config);
  const response = await graphFetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(config.sender)}/sendMail`,
    {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `subscription-otp-${input.requestId}`,
    },
    body: JSON.stringify({
      message: {
        subject: "Your Yai subscription verification code",
        body: {
          contentType: "Text",
          content: `Your Yai verification code is ${input.code}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
        },
        toRecipients: [{ emailAddress: { address: input.email } }],
      },
      saveToSentItems: true,
    }),
    },
  );
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    logGraphFailure(response.status, normalizedGraphErrorCode(payload));
    throw new MicrosoftGraphError(
      "Microsoft Outlook could not deliver the verification code.",
      response.status,
      normalizedGraphErrorCode(payload),
    );
  }
}
