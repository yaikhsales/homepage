// Server-only: parses YAI_ACCESS_CODES env var into structured access codes.
// Codes never reach the client bundle.

import "server-only";

export type CodeEntry = { code: string; label: string };

const DEFAULT_CODES =
  "YAI2026:Master code,INV-LAW-001:Lawrence (CEO),INV-VAN-001:Vancouver investor";

let cache: CodeEntry[] | null = null;

export function loadCodes(): CodeEntry[] {
  if (cache) return cache;
  const raw = process.env.YAI_ACCESS_CODES || DEFAULT_CODES;
  cache = raw
    .split(",")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const idx = pair.indexOf(":");
      if (idx < 0) return { code: pair.toUpperCase(), label: pair };
      return {
        code: pair.slice(0, idx).trim().toUpperCase(),
        label: pair.slice(idx + 1).trim(),
      };
    });
  return cache;
}

export function findCode(input: string): CodeEntry | null {
  const code = (input || "").trim().toUpperCase();
  if (!code) return null;
  return loadCodes().find((c) => c.code === code) || null;
}

export function isKnownLabel(label: string): boolean {
  return loadCodes().some((c) => c.label === label);
}
