"use client";

import { useEffect } from "react";
import { useLang } from "./LanguageToggle";
import { BODY_TRANSLATIONS } from "@/lib/i18n-body";

/**
 * Walks the <main> element's text nodes and substitutes English with Chinese
 * (when lang === "zh") using BODY_TRANSLATIONS. Original English content is
 * captured on first visit per node and restored when lang flips back to "en".
 *
 * No external service (Google Translate explicitly rejected by user) — the
 * dictionary in lib/i18n-body.ts is the source of truth. Phrases missing from
 * the dict simply remain in English.
 */
export function BodyTranslator() {
  const lang = useLang();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // The store of originals lives across re-renders so we can restore EN reliably.
    // Use a Map keyed by the text node itself; we re-scan each lang change so newly
    // mounted elements are picked up too.
    const main = document.querySelector("main");
    if (!main) return;

    type Cached = { en: string };
    const storeKey = "__yaiTranslatorCache" as const;
    // Attach the cache to the document so it persists across re-renders within the SPA.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docAny = document as any;
    if (!docAny[storeKey]) docAny[storeKey] = new WeakMap<Text, Cached>();
    const cache: WeakMap<Text, Cached> = docAny[storeKey];

    const collect = (root: Node): Text[] => {
      const nodes: Text[] = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const t = node as Text;
          const parent = t.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (tag === "SCRIPT" || tag === "STYLE" || tag === "CODE") return NodeFilter.FILTER_REJECT;
          if ((t.textContent ?? "").trim().length === 0) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      let n: Node | null;
      while ((n = walker.nextNode())) nodes.push(n as Text);
      return nodes;
    };

    const nodes = collect(main);

    const applyZh = () => {
      for (const node of nodes) {
        const current = node.textContent ?? "";
        // First-touch: cache the original English
        if (!cache.has(node)) cache.set(node, { en: current });
        const original = cache.get(node)!.en;
        const trimmed = original.trim();
        if (!trimmed) continue;
        const lead = original.match(/^\s*/)?.[0] ?? "";
        const trail = original.match(/\s*$/)?.[0] ?? "";
        const zh = BODY_TRANSLATIONS[trimmed];
        if (zh) {
          node.textContent = lead + zh + trail;
        }
      }
    };

    const restoreEn = () => {
      for (const node of nodes) {
        const cached = cache.get(node);
        if (cached) node.textContent = cached.en;
      }
    };

    if (lang === "zh") applyZh();
    else restoreEn();
  }, [lang]);

  return null;
}
