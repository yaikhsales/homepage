"use client";

import { useEffect } from "react";
import { useLang } from "./LanguageToggle";
import { translateBodyAuto } from "@/lib/i18n-body";

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

    const zhOf = (en: string): string | null => {
      const trimmed = en.trim();
      if (!trimmed) return null;
      const zh = translateBodyAuto(trimmed);
      if (!zh) return null;
      const lead = en.match(/^\s*/)?.[0] ?? "";
      const trail = en.match(/\s*$/)?.[0] ?? "";
      return lead + zh + trail;
    };

    const translateNode = (node: Text) => {
      const current = node.textContent ?? "";
      let entry = cache.get(node);
      if (!entry) {
        entry = { en: current };
        cache.set(node, entry);
      } else {
        // React may rewrite a node we already translated (e.g. "Detail" →
        // "Hide detail" on toggle). If the current text is neither our own
        // translation of the cached original nor the original itself, the
        // node has new English content — re-cache it.
        const expected = zhOf(entry.en) ?? entry.en;
        if (current !== expected && current !== entry.en) entry.en = current;
      }
      const next = zhOf(entry.en);
      // Write only on change so re-runs are idempotent (keeps the
      // MutationObserver from feeding on its own writes).
      if (next && node.textContent !== next) node.textContent = next;
    };

    const applyZh = () => {
      for (const node of collect(main)) translateNode(node);
    };

    const restoreEn = () => {
      for (const node of collect(main)) {
        const cached = cache.get(node);
        if (cached && node.textContent !== cached.en) node.textContent = cached.en;
      }
    };

    if (lang === "zh") {
      applyZh();
      // Content mounted AFTER the language switch (accordion details, admin-fed
      // tables, React re-renders) must be translated too — watch the tree.
      const mo = new MutationObserver(() => {
        mo.disconnect(); // don't observe our own writes
        applyZh();
        mo.observe(main, { childList: true, characterData: true, subtree: true });
      });
      mo.observe(main, { childList: true, characterData: true, subtree: true });
      return () => mo.disconnect();
    }
    restoreEn();
  }, [lang]);

  return null;
}
