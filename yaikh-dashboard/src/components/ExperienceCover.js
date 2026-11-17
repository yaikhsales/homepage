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
const SLIDES_KEY = "yai-cover-slides-v2"; // v2: v1 saved "off" whenever a point was opened
const SLIDE_MS = 6000;

/* Event slideshow for the empty half of the cover (registration desk).
   Same eight pictures and captions as the yaikh.com homepage reel. */
const SLIDES = [
  { img: "/images/dream-today.png", tag: ["Today", "បច្ចុប្បន្ន", "今天"], title: ["The chaos most factories live in", "ភាពវឹកវរក្នុងរោងចក្រភាគច្រើនសព្វថ្ងៃ", "大多数工厂身处的混乱"] },
  { img: "/images/dream-l1.png", tag: ["Layer 1 · Digitalization", "ស្រទាប់ទី១ · ឌីជីថលូបនីយកម្ម", "第1层 · 数字化"], title: ["One database, all factory data", "មូលដ្ឋានទិន្នន័យតែមួយ ទិន្នន័យរោងចក្រទាំងអស់", "一个数据库，全部工厂数据"] },
  { img: "/images/dream-l2.png", tag: ["Layer 2 · Agentic", "ស្រទាប់ទី២ · ប្រព័ន្ធភ្នាក់ងារ AI", "第2层 · 智能体"], title: ["Ai agents own the workflows", "ភ្នាក់ងារ AI គ្រប់គ្រងលំហូរការងារ", "AI智能体掌管工作流"] },
  { img: "/images/dream-l3.png", tag: ["Layer 3 · Full Ai", "ស្រទាប់ទី៣ · AI ពេញលេញ", "第3层 · 全面AI"], title: ["Executive command", "មជ្ឈមណ្ឌលបញ្ជាថ្នាក់ដឹកនាំ", "高管指挥中心"] },
  { img: "/images/acc-today.png", tag: ["Accounting · Today", "គណនេយ្យ · បច្ចុប្បន្ន", "会计 · 今天"], title: ["Buried in paper ledgers", "ជាប់គាំងក្នុងសៀវភៅបញ្ជីក្រដាស", "埋在纸质账本里"] },
  { img: "/images/acc-l1.png", tag: ["Accounting · Layer 1", "គណនេយ្យ · ស្រទាប់ទី១", "会计 · 第1层"], title: ["Forms replace paper", "ទម្រង់ជំនួសក្រដាស", "表单取代纸张"] },
  { img: "/images/acc-l2.png", tag: ["Accounting · Layer 2", "គណនេយ្យ · ស្រទាប់ទី២", "会计 · 第2层"], title: ["Agents post the vouchers", "ភ្នាក់ងារ AI ធ្វើការកត់ត្រាបង្កាន់ដៃស្វ័យប្រវត្តិ", "智能体自动过账"] },
  { img: "/images/acc-l3.png", tag: ["Accounting · Layer 3", "គណនេយ្យ · ស្រទាប់ទី៣", "会计 · 第3层"], title: ["Analysis, not data entry", "ការវិភាគ មិនមែនការបញ្ចូលទិន្នន័យ", "做分析，而非录入"] },
];
const LANG_INDEX = { en: 0, km: 1, zh: 2 };

/* Screen-size presets for the stage. The cover already fits itself to the
   window; these scale its text up or down on top of that. Click the active
   one again to go back to automatic. */
const MODE_KEY = "yai-cover-screen-v1";
const SCREEN_MODES = [
  { key: "laptop", scale: 0.9, label: "Laptop", icon: <svg viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="10" rx="1.5" /><path d="M2.5 18.5h19" /></svg> },
  { key: "desktop", scale: 1.05, label: "Desktop", icon: <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M9 20h6M12 16v4" /></svg> },
  { key: "tv", scale: 1.3, label: "TV", icon: <svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="12.5" rx="1.5" /><path d="M8 21h8M9 2.5l3 2.5 3-2.5" /></svg> },
  { key: "wide", scale: 0.8, label: "Wide stage", icon: <svg viewBox="0 0 24 24"><rect x="1.5" y="8" width="21" height="8" rx="1.5" /></svg> },
];
const SEEN_KEY = "yai-cover-seen-v1";
const SLOTS = 6;
/* Points that show a page in the right half of the cover when clicked,
   by position (0 = point 1). The page loads in a frame, so the cover stays. */
const POINT_LINKS = { 0: "/about?embed=1", 1: "/?embed=evolution", 2: "slides:solution", 3: "slides:native", 4: "slides:teams" };
/* A point linked to "slides:<name>" plays only these slides (by their place in
   SLIDES) in the right half, instead of opening a page. */
/* Ai Nativeness: one split picture, what Yai is not (left) and what it is
   (right). Its labels are page text, so they stay sharp and spelled right. */
const NATIVE_SLIDE = {
  img: "/images/ai-native-yai.jpg",
  tag: ["Ai Nativeness", "បច្ចេកវិទ្យា AI ពីមូលដ្ឋានគ្រឹះ", "AI 原生"],
  title: [
    "Built on Ai itself, not Ai added on top of old systems",
    "បង្កើតឡើងដោយផ្អែកលើ AI ផ្ទាល់ មិនមែនគ្រាន់តែបន្ថែម AI ពីលើប្រព័ន្ធចាស់នោះឡើយ",
    "基于 AI 本身构建，而非在旧系统上叠加 AI",
  ],
  split: [
    {
      mark: "✕",
      head: ["Not Ai-native", "មិនមែនជា AI ពីកំណើត", "非 AI 原生"],
      sub: "Ai taped onto old systems · piles of documents to analyse · data typed in again for the Ai",
    },
    {
      mark: "✓",
      head: ["Ai-native · Yai", "AI ពីកំណើត · Yai", "AI 原生 · Yai"],
      sub: "Built on Apple, Gemini & Claude Ai itself · one ecosystem for Administration, Operation & Top Management",
    },
  ],
};
/* Point 5: a small inverted triangle around Yai, with Operation and Top
   Management on the top corners and Administration at the bottom point. The
   triangle, logo and three words are drawn into the picture. */
const TEAMS_SLIDE = {
  img: "/images/teams-yai.jpg",
  alt: "Operation and Top Management on the top corners, Administration at the bottom point, Yai in the middle",
};
const SLIDE_SETS = { solution: [1, 4, 6].map((i) => SLIDES[i]), native: [NATIVE_SLIDE], teams: [TEAMS_SLIDE] };
const slideSet = (panel) => SLIDE_SETS[panel.slice(7)] || SLIDES;
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
    cta: "Let's experience \u2192", edit: "Edit", exit: "Exit", done: "Done", clearAll: "Clear all",
    cover: "Cover Page", slides: "Slideshow",
    close: "Close", point: (n) => `Point ${n}`, dialog: "Presentation cover",
  },
  km: {
    titlePre: "វេទិកាបញ្ញា", titleEm: "ផលិតកម្ម", titlePost: " កម្រិត AI-Native",
    cta: "ចាប់ផ្តើមបទពិសោធន៍ \u2192", edit: "កែប្រែ", exit: "ចាកចេញ", done: "រួចរាល់", clearAll: "សម្អាតទាំងអស់",
    cover: "ទំព័រក្រប", slides: "បញ្ចាំងស្លាយ",
    close: "បិទ", point: (n) => `ចំណុច ${n}`, dialog: "ក្របបទបង្ហាញ",
  },
  zh: {
    titlePre: "AI 原生", titleEm: "制造", titlePost: "智能平台",
    cta: "开始体验 \u2192", edit: "编辑", exit: "退出", done: "完成", clearAll: "全部清除",
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
/* Pages that are short for their width get a narrower frame, so they are drawn
   bigger and fill the panel instead of leaving its lower half empty. */
const FRAME_WIDTHS = { "/?embed=evolution": 1100 };
function ScaledFrame({ src }) {
  const frameWidth = FRAME_WIDTHS[src] || FRAME_WIDTH;
  const box = useRef(null);
  const [size, setSize] = useState({ scale: 1, height: 900 });
  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const fit = () => {
      const scale = el.clientWidth / frameWidth || 1;
      setSize({ scale, height: el.clientHeight / scale });
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [frameWidth]);
  return (
    <div ref={box} className="yai-cover-frame-box">
      <iframe
        className="yai-cover-frame"
        src={src}
        title={src}
        style={{ width: frameWidth, height: size.height, transform: `scale(${size.scale})` }}
      />
    </div>
  );
}

function Slideshow({ language, items = SLIDES }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    items.forEach((slide) => { const img = new Image(); img.src = slide.img; });
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), SLIDE_MS);
    return () => clearInterval(timer);
  }, [items]);
  const lang = LANG_INDEX[language] ?? 0;
  return (
    <div className="yai-cover-slides" aria-roledescription="slideshow">
      {items.map((slide, i) => (
        <figure key={slide.img} className={`yai-cover-slide ${i === index ? "is-on" : ""}`} aria-hidden={i !== index}>
          <img src={slide.img} alt={slide.alt || (slide.title ? slide.title[lang] : slide.split.map((h) => h.head[0]).join(", "))} />
          {slide.split && (
            <div className={`yai-cover-slide-split ${slide.light ? "is-light" : ""}`} style={{ gridTemplateColumns: `repeat(${slide.split.length}, 1fr)` }}>
              {slide.split.map((side, k) => (
                <div key={k} className={slide.light ? "" : k ? "is-yes" : "is-no"}>
                  <span className="yai-cover-slide-tr">
                    <span className="yai-cover-point-km">{side.head[1]}</span>
                    <span>{side.head[2]}</span>
                  </span>
                  <strong>{side.mark && <span aria-hidden="true">{side.mark} </span>}{side.head[0]}</strong>
                  <small>{side.sub}</small>
                </div>
              ))}
            </div>
          )}
          {/* English is the main line, as on the points; Khmer and Chinese
              sit small above it so the whole room can read the slide. */}
          {slide.title && <figcaption>
            <span className="yai-cover-slide-tag">{slide.tag[0]}</span>
            <span className="yai-cover-slide-tr">
              <span className="yai-cover-point-km">{slide.title[1]}</span>
              <span>{slide.title[2]}</span>
            </span>
            <span className="yai-cover-slide-title">{slide.title[0]}</span>
          </figcaption>}
        </figure>
      ))}
      <div className="yai-cover-slide-dots" hidden={items.length < 2}>
        {items.map((slide, i) => (
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
  "Industry Needs": ["តម្រូវការក្នុងវិស័យឧស្សាហកម្ម", "行业需求"],
  "Our Solution": ["ដំណោះស្រាយរបស់យើង", "我们的解决方案"],
  "Ai Nativeness": ["បច្ចេកវិទ្យា AI ពីមូលដ្ឋានគ្រឹះ", "AI 原生"],
  "Administration | Operation | Top Management": ["រដ្ឋបាល · ប្រតិបត្តិការ · ថ្នាក់គ្រប់គ្រងកំពូល", "行政 · 运营 · 高层管理"],
  "See It Real": ["ទស្សនាការអនុវត្តជាក់ស្តែង", "亲眼见证"],
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
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem(MODE_KEY) || ""; } catch { return ""; }
  });
  const pickMode = (key) => {
    setMode((current) => {
      const next = current === key ? "" : key;
      try { localStorage.setItem(MODE_KEY, next); } catch { /* private window */ }
      return next;
    });
  };
  const scale = (SCREEN_MODES.find((m) => m.key === mode) || {}).scale || 1;
  const [slides, setSlides] = useState(() => {
    // On unless someone switched it off on this browser.
    try { return localStorage.getItem(SLIDES_KEY) !== "0"; } catch { return true; }
  });
  /* The switch beside the exit: on closes whatever is open in the right half
     and runs the slideshow. Opening a page from a point only covers the
     slideshow; closing the page brings it back. */
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
    <div className={`yai-cover ${leaving ? "is-leaving" : ""}`} role="dialog" aria-label={copy.dialog} style={{ "--s": scale }}>
      {/* Always reachable, in both modes. */}

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
        {/* One compact toolbar: screen size, slideshow, start, exit. Editing the
            points opens with a double-click on the list. */}
        <div className="yai-cover-tools">
          <div className="yai-cover-modes" role="group" aria-label="Screen size">
            {SCREEN_MODES.map((m) => (
              <button
                key={m.key}
                type="button"
                className={mode === m.key ? "is-on" : ""}
                onClick={() => pickMode(m.key)}
                aria-pressed={mode === m.key}
                aria-label={m.label}
                title={mode === m.key ? `${m.label} (click again for automatic)` : m.label}
              >
                {m.icon}
              </button>
            ))}
          </div>
          <label className="yai-cover-switch" title={copy.slides}>
            <span>{copy.slides}</span>
            <input type="checkbox" role="switch" checked={slides} onChange={toggleSlides} aria-label={copy.slides} />
            <span className="yai-cover-switch-track" aria-hidden="true"><span /></span>
          </label>
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
                <button type="button" className="yai-cover-btn" onClick={close}>{copy.exit}</button>
              </>
            )}
        </div>
      </div>

      <div className={`yai-cover-body ${panel || slides ? "has-panel" : ""}`}>
        <ol className="yai-cover-points" onDoubleClick={() => setEditing(true)}>
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
          <div className={`yai-cover-panel ${panel.startsWith("slides:") ? "is-slides" : ""}`}>
            <button type="button" className="yai-cover-panel-close" onClick={() => setPanel(null)} aria-label={copy.close} title={copy.close}>
              ✕
            </button>
            {panel.startsWith("slides:") ? (
              <Slideshow key={panel} language={language} items={slideSet(panel)} />
            ) : (
              <ScaledFrame src={panel} />
            )}
          </div>
        )}
      </div>


      <div className="yai-cover-wedge" aria-hidden="true" />
    </div>,
    document.body
  );
}
