// Server-only: admin login + signed admin cookie.
// Passcode-only model: just enter 012026 (overridable via YAI_ADMIN_PASS env).
// Username field removed from the UI — passcode alone is sufficient.

import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "yai_admin";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  return process.env.YAI_COOKIE_SECRET || "dev-only-secret-change-in-production";
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret() + ":admin").update(payload).digest("hex");
}

export function makeAdminCookie(label: string): string {
  const enc = Buffer.from(label, "utf-8").toString("base64url");
  return `${enc}.${sign(label)}`;
}

export function verifyAdminCookie(value: string | undefined | null): string | null {
  if (!value) return null;
  const dot = value.indexOf(".");
  if (dot < 0) return null;
  const enc = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!enc || !sig) return null;
  try {
    const label = Buffer.from(enc, "base64url").toString("utf-8");
    const expected = sign(label);
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
    return label;
  } catch {
    return null;
  }
}

/** Passcode-only check — username ignored. Override passcode via YAI_ADMIN_PASS env. */
export function checkAdminCreds(_user: string, pass: string): string | null {
  const expectedPass = process.env.YAI_ADMIN_PASS || "012026";
  if (pass === expectedPass) {
    return "admin";
  }
  return null;
}
