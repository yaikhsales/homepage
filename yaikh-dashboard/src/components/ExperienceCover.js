import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "../translate/TranslationContext";
import "./ExperienceCover.css";

/* Presentation cover for /experience.
 *
 * Sits in FRONT of the working dashboard and changes nothing behind it —
 * dismissing it drops straight into the board as before.
 *
 * The six points change for every audience, so they are not baked into the
 * bundle: editing them must never need a rebuild and a Cloudflare publish.
 * Three ways in, cheapest first:
 *   1. "Edit points" on the cover itself — typed in, kept in localStorage,
 *      so the laptop that presents remembers its own set.
 *   2. ?p1=…&p2=… on the URL — a link per audience, nothing to set up.
 *      Params win over stored text and are saved as the new set.
 *   3. The defaults below, used when neither of the above says otherwise.
 *
 * Shown once per browser session. ?cover=1 forces it back, ?cover=0 skips it.
 */

const STORE_KEY = "yai-cover-points-v1";
const SEEN_KEY = "yai-cover-seen-v1";
const SLOTS = 6;
/* Points that show a page in the right half of the cover when clicked,
   by position (0 = point 1). The page loads in a frame, so the cover stays. */
const POINT_LINKS = { 0: "/about" };
const DEFAULT_POINTS = [
  "Yai & Texlink",
  "Industry Needs",
  "Our Solution",
  "Ai Nativeness",
  "Administration | Operation | Top Management",
  "See It Real",
];

/* The flags along the top of the dashboard drive this too. English, Khmer and
   Chinese are written out; the remaining flags fall back to English. The title
   is split in three so the middle word keeps its gold emphasis in every
   language. The six points themselves are typed per audience, so they are
   never translated. */
const COPY = {
  en: {
    titlePre: "Ai-Native ", titleEm: "Manufacturing", titlePost: " Intelligence Platform",
    cta: "Let's experience \u2192", edit: "Edit", done: "Done", clearAll: "Clear all",
    cover: "Cover Page",
    close: "Close", point: (n) => `Point ${n}`, dialog: "Presentation cover",
  },
  km: {
    titlePre: "វេទិកាបញ្ញា", titleEm: "ផលិតកម្ម", titlePost: " ដើមកំណើត AI",
    cta: "ចាប់ផ្តើមបទពិសោធន៍ \u2192", edit: "កែប្រែ", done: "រួចរាល់", clearAll: "សម្អាតទាំងអស់",
    cover: "ទំព័រក្រប",
    close: "បិទ", point: (n) => `ចំណុច ${n}`, dialog: "ក្របបទបង្ហាញ",
  },
  zh: {
    titlePre: "AI 原生", titleEm: "制造", titlePost: "智能平台",
    cta: "开始体验 \u2192", edit: "编辑", done: "完成", clearAll: "全部清除",
    cover: "封面",
    close: "关闭", point: (n) => `要点 ${n}`, dialog: "演示封面",
  },
};

/* The "Cover Page" button in the header brings the cover back to the front
   from anywhere in the dashboard. It fires this event; the cover listens. */
const OPEN_EVENT = "yai-cover-open";
export function openCover() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}
export function coverButtonLabel(language) {
  return (COPY[language] || COPY.en).cover;
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return Array.from({ length: SLOTS }, (_, i) => (typeof parsed[i] === "string" ? parsed[i] : ""));
  } catch {
    return null;
  }
}

function readParams(search) {
  const params = new URLSearchParams(search);
  let any = false;
  const points = Array.from({ length: SLOTS }, (_, i) => {
    const value = params.get(`p${i + 1}`);
    if (value === null) return "";
    any = true;
    return value.slice(0, 80);
  });
  return any ? points : null;
}

export default function ExperienceCover() {
  const { language } = useTranslation();
  const copy = COPY[language] || COPY.en;
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [points, setPoints] = useState(DEFAULT_POINTS);
  const [panel, setPanel] = useState(null);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const forced = params.get("cover");

    const fromUrl = readParams(search);
    const stored = readStored();
    const next = fromUrl || stored || DEFAULT_POINTS;
    setPoints(next);
    if (fromUrl) {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(fromUrl)); } catch { /* private window */ }
    }

    if (forced === "0") return;
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch { /* private window */ }
    if (forced === "1" || !seen) setVisible(true);
  }, []);

  useEffect(() => {
    const onOpen = () => {
      setEditing(false);
      setLeaving(false);
      setVisible(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  /* Leaves the cover whatever mode it is in. The X uses this, so there is
     always a way out — including mid-edit, where "Done" only ends editing. */
  const close = useCallback(() => {
    setEditing(false);
    setPanel(null);
    setLeaving(true);
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* private window */ }
    setTimeout(() => { setVisible(false); setLeaving(false); }, 420);
  }, []);

  /* Escape and the primary button: typing a point must not fire them. */
  const dismiss = useCallback(() => {
    if (editing) return;
    close();
  }, [editing, close]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (event) => {
      if (event.key !== "Escape" || editing) return;
      if (panel) setPanel(null);
      else dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, editing, panel, dismiss]);

  const setPoint = (index, value) =>
    setPoints((current) => {
      const next = [...current];
      next[index] = value.slice(0, 80);
      try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* private window */ }
      return next;
    });

  if (!visible) return null;

  /* Portalled to <body>: mounted inside the dashboard tree an ancestor
     transform makes a stacking context and the overlay renders behind
     the module tiles no matter how high its z-index is. */
  return createPortal(
    <div className={`yai-cover ${leaving ? "is-leaving" : ""}`} role="dialog" aria-label={copy.dialog}>
      {/* Always reachable, in both modes. */}
      <button type="button" className="yai-cover-close" onClick={close} aria-label={copy.close} title={copy.close}>
        ✕
      </button>

      <div className="yai-cover-head">
        <img className="yai-cover-mark" src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="Yai" />
        <div>
          {/* One line above the title: the site, then the Khmer and Chinese
              titles. All three languages are on the slide at once because the
              room reads different ones, and the flags serve one at a time. */}
          <div className="yai-cover-topline">
            <p className="yai-cover-site">www.yaikh.com</p>
            <p className="yai-cover-title-km">{COPY.km.titlePre}{COPY.km.titleEm}{COPY.km.titlePost}</p>
            <p className="yai-cover-title-zh">{COPY.zh.titlePre}{COPY.zh.titleEm}{COPY.zh.titlePost}</p>
          </div>
          <h1 className="yai-cover-title">
            {COPY.en.titlePre}<em>{COPY.en.titleEm}</em>{COPY.en.titlePost}
          </h1>
        </div>
      </div>

      <div className={`yai-cover-body ${panel ? "has-panel" : ""}`}>
        <ol className="yai-cover-points">
          {points.map((text, index) => (
          <li key={index} className={`yai-cover-point ${text ? "" : "is-empty"}`}>
            <span className="yai-cover-num" aria-hidden="true">{index + 1}</span>
            {editing ? (
              <input
                value={text}
                onChange={(event) => setPoint(index, event.target.value)}
                placeholder={copy.point(index + 1)}
                aria-label={copy.point(index + 1)}
                maxLength={80}
                className="yai-cover-input"
              />
            ) : (
              POINT_LINKS[index] && text ? (
                <button
                  type="button"
                  className={`yai-cover-text yai-cover-link ${panel === POINT_LINKS[index] ? "is-open" : ""}`}
                  onClick={() => setPanel((current) => (current === POINT_LINKS[index] ? null : POINT_LINKS[index]))}
                  aria-expanded={panel === POINT_LINKS[index]}
                >
                  {text}
                </button>
              ) : (
                <span className="yai-cover-text">{text}</span>
              )
            )}
          </li>
        ))}
        </ol>

        {panel && (
          <div className="yai-cover-panel">
            <button type="button" className="yai-cover-panel-close" onClick={() => setPanel(null)} aria-label={copy.close} title={copy.close}>
              ✕
            </button>
            <iframe className="yai-cover-frame" src={panel} title={panel} />
          </div>
        )}
      </div>

      <div className="yai-cover-actions">
        {editing ? (
          <>
            <button type="button" className="yai-cover-btn is-primary" onClick={() => setEditing(false)}>{copy.done}</button>
            <button
              type="button"
              className="yai-cover-btn"
              onClick={() => { setPoints(DEFAULT_POINTS); try { localStorage.removeItem(STORE_KEY); } catch { /* private window */ } }}
            >
              {copy.clearAll}
            </button>
          </>
        ) : (
          <>
            <button type="button" className="yai-cover-btn is-primary" onClick={close}>{copy.cta}</button>
            <button type="button" className="yai-cover-btn" onClick={() => setEditing(true)}>{copy.edit}</button>
          </>
        )}
      </div>

      <div className="yai-cover-wedge" aria-hidden="true" />
    </div>,
    document.body
  );
}
