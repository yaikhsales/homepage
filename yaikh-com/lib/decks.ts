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
