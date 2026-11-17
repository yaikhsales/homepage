import React, { useCallback, useEffect, useRef, useState } from "react";
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
const SLIDES_KEY = "yai-cover-slides-v1";
const SLIDE_MS = 6000;

/* Event slideshow for the empty half of the cover (registration desk).
   Same eight pictures and captions as the yaikh.com homepage reel. */
const SLIDES = [
  { img: "/images/dream-today.png", tag: ["Today", "បច្ចុប្បន្ន", "今天"], title: ["The chaos most factories live in", "ភាពវឹកវរដែលរោងចក្រភាគច្រើនកំពុងជួប", "大多数工厂身处的混乱"] },
  { img: "/images/dream-l1.png", tag: ["Layer 1 · Digitalization", "ស្រទាប់ទី១ · ឌីជីថលូបនីយកម្ម", "第1层 · 数字化"], title: ["One database, all factory data", "មូលដ្ឋានទិន្នន័យតែមួយ ទិន្នន័យរោងចក្រទាំងអស់", "一个数据库，全部工厂数据"] },
  { img: "/images/dream-l2.png", tag: ["Layer 2 · Agentic", "ស្រទាប់ទី២ · ភ្នាក់ងារ Ai", "第2层 · 智能体"], title: ["Ai agents own the workflows", "ភ្នាក់ងារ Ai គ្រប់គ្រងលំហូរការងារ", "Ai智能体掌管工作流"] },
  { img: "/images/dream-l3.png", tag: ["Layer 3 · Full Ai", "ស្រទាប់ទី៣ · Ai ពេញលេញ", "第3层 · 全面Ai"], title: ["Executive command", "បញ្ជាការថ្នាក់ដឹកនាំ", "高管指挥中心"] },
  { img: "/images/acc-today.png", tag: ["Accounting · Today", "គណនេយ្យ · បច្ចុប្បន្ន", "会计 · 今天"], title: ["Buried in paper ledgers", "កប់ក្នុងសៀវភៅបញ្ជីក្រដាស", "埋在纸质账本里"] },
  { img: "/images/acc-l1.png", tag: ["Accounting · Layer 1", "គណនេយ្យ · ស្រទាប់ទី១", "会计 · 第1层"], title: ["Forms replace paper", "ទម្រង់ជំនួសក្រដាស", "表单取代纸张"] },
  { img: "/images/acc-l2.png", tag: ["Accounting · Layer 2", "គណនេយ្យ · ស្រទាប់ទី២", "会计 · 第2层"], title: ["Agents post the vouchers", "ភ្នាក់ងារកត់ត្រាបង្កាន់ដៃ", "智能体自动过账"] },
  { img: "/images/acc-l3.png", tag: ["Accounting · Layer 3", "គណនេយ្យ · ស្រទាប់ទី៣", "会计 · 第3层"], title: ["Analysis, not data entry", "ការវិភាគ មិនមែនការបញ្ចូលទិន្នន័យ", "做分析，而非录入"] },
];
const LANG_INDEX = { en: 0, km: 1, zh: 2 };
const SEEN_KEY = "yai-cover-seen-v1";
const SLOTS = 6;
/* Points that show a page in the right half of the cover when clicked,
   by position (0 = point 1). The page loads in a frame, so the cover stays. */
const POINT_LINKS = { 0: "/about?embed=1" };
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
    cover: "Cover Page", slides: "Slideshow",
    close: "Close", point: (n) => `Point ${n}`, dialog: "Presentation cover",
  },
  km: {
    titlePre: "វេទិកាបញ្ញា", titleEm: "ផលិតកម្ម", titlePost: " ដើមកំណើត AI",
    cta: "ចាប់ផ្តើមបទពិសោធន៍ \u2192", edit: "កែប្រែ", done: "រួចរាល់", clearAll: "សម្អាតទាំងអស់",
    cover: "ទំព័រក្រប", slides: "បញ្ចាំងរូបភាព",
    close: "បិទ", point: (n) => `ចំណុច ${n}`, dialog: "ក្របបទបង្ហាញ",
  },
  zh: {
    titlePre: "AI 原生", titleEm: "制造", titlePost: "智能平台",
    cta: "开始体验 \u2192", edit: "编辑", done: "完成", clearAll: "全部清除",
    cover: "封面", slides: "幻灯片",
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

/* "A | B | C" shows as three lines, so long points stay narrow. */
function lines(text) {
  const parts = text.split(/\s*\|\s*/).filter(Boolean);
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </React.Fragment>
  ));
}

/* Shows a page at full desktop width and shrinks it to fit the panel, so it
   keeps its real layout instead of reflowing into a narrow phone layout. */
const FRAME_WIDTH = 1440;
function ScaledFrame({ src }) {
  const box = useRef(null);
  const [size, setSize] = useState({ scale: 1, height: 900 });
  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const fit = () => {
      const scale = el.clientWidth / FRAME_WIDTH || 1;
      setSize({ scale, height: el.clientHeight / scale });
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={box} className="yai-cover-frame-box">
      <iframe
        className="yai-cover-frame"
        src={src}
        title={src}
        style={{ width: FRAME_WIDTH, height: size.height, transform: `scale(${size.scale})` }}
      />
    </div>
  );
}

function Slideshow({ language }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    SLIDES.forEach((slide) => { const img = new Image(); img.src = slide.img; });
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(timer);
  }, []);
  const lang = LANG_INDEX[language] ?? 0;
  return (
    <div className="yai-cover-slides" aria-roledescription="slideshow">
      {SLIDES.map((slide, i) => (
        <figure key={slide.img} className={`yai-cover-slide ${i === index ? "is-on" : ""}`} aria-hidden={i !== index}>
          <img src={slide.img} alt={slide.title[lang]} />
          <figcaption>
            <span className="yai-cover-slide-tag">{slide.tag[lang]}</span>
            <span className="yai-cover-slide-title">{slide.title[lang]}</span>
          </figcaption>
        </figure>
      ))}
      <div className="yai-cover-slide-dots">
        {SLIDES.map((slide, i) => (
          <button key={slide.img} type="button" className={i === index ? "is-on" : ""} onClick={() => setIndex(i)} aria-label={`${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

/* Small Khmer and Chinese line shown above a point, keyed by its English
   text. A point typed in through Edit has no entry, so it shows English only. */
const POINT_TRANSLATIONS = {
  "Yai & Texlink": ["Yai និង Texlink", "Yai 与 Texlink"],
  "Industry Needs": ["តម្រូវការឧស្សាហកម្ម", "行业需求"],
  "Our Solution": ["ដំណោះស្រាយរបស់យើង", "我们的解决方案"],
  "Ai Nativeness": ["ភាពដើមកំណើត AI", "AI 原生"],
  "Administration | Operation | Top Management": ["រដ្ឋបាល · ប្រតិបត្តិការ · ថ្នាក់ដឹកនាំកំពូល", "行政 · 运营 · 高层管理"],
  "See It Real": ["មើលឃើញជាក់ស្តែង", "亲眼见证"],
};

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
  const [slides, setSlides] = useState(() => {
    try { return localStorage.getItem(SLIDES_KEY) === "1"; } catch { return false; }
  });
  /* The switch beside the exit: on closes whatever is open in the right half
     and runs the slideshow; opening a page from a point turns it off. */
  const toggleSlides = () => {
    setSlides((on) => {
      const next = !on;
      if (next) { setPanel(null); setEditing(false); }
      try { localStorage.setItem(SLIDES_KEY, next ? "1" : "0"); } catch { /* private window */ }
      return next;
    });
  };
  const openPanel = (url) => {
    setPanel((current) => (current === url ? null : url));
    setSlides(false);
    try { localStorage.setItem(SLIDES_KEY, "0"); } catch { /* private window */ }
  };

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
      <label className="yai-cover-switch" title={copy.slides}>
        <span>{copy.slides}</span>
        <input type="checkbox" role="switch" checked={slides} onChange={toggleSlides} aria-label={copy.slides} />
        <span className="yai-cover-switch-track" aria-hidden="true"><span /></span>
      </label>
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

      <div className={`yai-cover-body ${panel || slides ? "has-panel" : ""}`}>
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
              <div className="yai-cover-point-label">
              {POINT_TRANSLATIONS[text] && (
                <span className="yai-cover-point-tr">
                  <span className="yai-cover-point-km">{POINT_TRANSLATIONS[text][0]}</span>
                  <span>{POINT_TRANSLATIONS[text][1]}</span>
                </span>
              )}
              {POINT_LINKS[index] && text ? (
                <button
                  type="button"
                  className={`yai-cover-text yai-cover-link ${panel === POINT_LINKS[index] ? "is-open" : ""}`}
                  onClick={() => openPanel(POINT_LINKS[index])}
                  aria-expanded={panel === POINT_LINKS[index]}
                >
                  {lines(text)}
                </button>
              ) : (
                <span className="yai-cover-text">{lines(text)}</span>
              )}
              </div>
            )}
          </li>
        ))}
        </ol>

        {slides && !panel && (
          <div className="yai-cover-panel is-slides">
            <Slideshow language={language} />
          </div>
        )}

        {panel && (
          <div className="yai-cover-panel">
            <button type="button" className="yai-cover-panel-close" onClick={() => setPanel(null)} aria-label={copy.close} title={copy.close}>
              ✕
            </button>
            <ScaledFrame src={panel} />
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
