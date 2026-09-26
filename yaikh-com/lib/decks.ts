/* The decks listed in /plan Appendix A4. Shared by the two routes that serve
 * them: /plan/pitch-deck?ask=… (HTML) and /plan/pitch-deck/<name>.pdf (PDF).
 * Files live in /private (NOT /public) — both routes check the yai_session
 * cookie first. Source of truth for the decks themselves:
 * deck/v4-work/make-yai-deck-v4.js. */

export const DECKS: Record<string, { html: string; pdf: string }> = {
  "0.5m": { html: "pitch-deck-v4-0.5m.html", pdf: "Yai-Pitch-Deck-v4-0.5M.pdf" },
  "1m": { html: "pitch-deck-v4-1m.html", pdf: "Yai-Pitch-Deck-v4-1M.pdf" },
  "2m": { html: "pitch-deck-v4-2m.html", pdf: "Yai-Pitch-Deck-v4-2M.pdf" },
  "3m": { html: "pitch-deck-v4.html", pdf: "Yai-Pitch-Deck-v4-3M.pdf" },
  // 5th deck — internal, for Arnold's client conversations.
  client: { html: "pitch-deck-v4-client.html", pdf: "Price and Client.pdf" },
  // 6th document — "How Yai Big Brain runs": the M1 setup explanation page (web only, no PDF).
  m1: { html: "m1-setup.html", pdf: "" },
  // 7th document — the About deck (company · founders · the Ai-Native MiP), 4 slides.
  about: { html: "about-deck.html", pdf: "Yai-About-Deck.pdf" },
  // 8th document — the platform deck: the About page, the Ai-Native MiP and the
  // AIoT sustainability platform, no founders. 3 slides.
  platform: { html: "platform-deck.html", pdf: "Yai-Platform-Deck.pdf" },
  // 9th document — the EDF Startup Investment Package 2 application deck (US$100,000 ask), 6 slides.
  edf: { html: "edf-deck.html", pdf: "Yai — SIPP Cohort 2.pdf" },
  // 10th document — the printed tri-fold brochure (PDF only, no web version).
  brochure: { html: "", pdf: "Yai Tri-Fold Brochure.pdf" },
};

/* Phones decide what a link is from its ending: a URL with no ".pdf" opens as a
 * web page, so "share" sends the link instead of the file. Every PDF therefore
 * also has its own /plan/pitch-deck/<file>.pdf address. */
export const PDF_BY_FILE: Record<string, string> = Object.fromEntries(
  Object.values(DECKS).filter((d) => d.pdf).map((d) => [d.pdf, d.pdf]),
);

export const pdfHref = (ask: string) => {
  const pdf = DECKS[ask]?.pdf;
  return pdf ? `/plan/pitch-deck/${encodeURIComponent(pdf)}` : "";
};

/* Content-Disposition for a PDF: HTTP headers are Latin-1 only, so a name with
 * an em dash ("Yai — SIPP Cohort 2.pdf") must be sent ASCII-safe, with the real
 * UTF-8 name in filename* (RFC 5987). `attachment` makes phones save/share the
 * file itself instead of the link. */
export const pdfDisposition = (name: string, mode: "inline" | "attachment" = "attachment") => {
  const ascii = name.replace(/[^\x20-\x7e]/g, "-").replace(/"/g, "");
  return `${mode}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`;
};
