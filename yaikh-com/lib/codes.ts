// Server-only: parses YAI_ACCESS_CODES env var into structured access codes.
// Codes never reach the client bundle.

import "server-only";

export type CodeEntry = { code: string; label: string };

// Baseline codes — always present, so a Railway env edit is never the
// bottleneck for the gates we ship with the app. YAI_ACCESS_CODES env
// adds more and can override a baseline entry by matching its code.
const BASELINE_CODES = [
  "012026:Master code",
  "GK12@#:Gamini task",
  "TL25@#:Texlink task",
];

let cache: CodeEntry[] | null = null;

function parsePair(pair: string): CodeEntry | null {
  const trimmed = pair.trim();
  if (!trimmed) return null;
  const idx = trimmed.indexOf(":");
  if (idx < 0) return { code: trimmed.toUpperCase(), label: trimmed };
  return {
    code: trimmed.slice(0, idx).trim().toUpperCase(),
    label: trimmed.slice(idx + 1).trim(),
  };
}

export function loadCodes(): CodeEntry[] {
  if (cache) return cache;
  const byCode = new Map<string, CodeEntry>();
  for (const pair of BASELINE_CODES) {
    const e = parsePair(pair);
    if (e) byCode.set(e.code, e);
  }
  const raw = process.env.YAI_ACCESS_CODES || "";
  for (const pair of raw.split(",")) {
    const e = parsePair(pair);
    if (e) byCode.set(e.code, e); // env overrides baseline by code
  }
  cache = Array.from(byCode.values());
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
