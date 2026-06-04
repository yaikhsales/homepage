"use client";

import { useEffect, useState } from "react";

/* Cute round language toggle — UK = English, China = 中文.
 * Wires up Google Translate Element under the hood; click a flag and
 * the whole page re-renders in the target language.
 *
 * The Google Translate top bar is hidden via globals.css so users only
 * see our flags. The hidden #google_translate_element div hosts the
 * actual <select> that we drive programmatically.
 */

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          opts: {
            pageLanguage: string;
            includedLanguages?: string;
            autoDisplay?: boolean;
            layout?: number;
          },
          element: string
        ) => void;
      };
    };
  }
}

type Lang = "en" | "zh-CN";

export function LanguageToggle() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Persist choice across navigation
    const saved = window.localStorage.getItem("yai-lang") as Lang | null;
    if (saved === "zh-CN") setLang("zh-CN");

    // Inject Google Translate once
    if (document.getElementById("gt-script")) return;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,zh-CN",
          autoDisplay: false,
        },
        "google_translate_element"
      );
      // If user previously chose Chinese, apply it now
      if (saved === "zh-CN") {
        setTimeout(() => triggerTranslate("zh-CN"), 400);
      }
    };

    const s = document.createElement("script");
    s.id = "gt-script";
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const switchTo = (target: Lang) => {
    setLang(target);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("yai-lang", target);
    }
    triggerTranslate(target);
  };

  return (
    <>
      {/* Hidden anchor for Google's widget */}
      <div id="google_translate_element" style={{ display: "none" }} aria-hidden />

      <div className="inline-flex items-center gap-1.5">
        <FlagButton
          active={lang === "en"}
          onClick={() => switchTo("en")}
          title="English"
        >
          <UKFlag />
        </FlagButton>
        <FlagButton
          active={lang === "zh-CN"}
          onClick={() => switchTo("zh-CN")}
          title="中文"
        >
          <CNFlag />
        </FlagButton>
      </div>
    </>
  );
}

function triggerTranslate(lang: Lang) {
  // Google Translate exposes a hidden <select class="goog-te-combo"> with the language picker.
  // We programmatically set its value + dispatch 'change' to trigger the translation.
  const tryChange = (attempt = 0) => {
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = lang === "en" ? "" : lang; // Empty string restores the original (English)
      select.dispatchEvent(new Event("change"));
      return;
    }
    if (attempt < 20) setTimeout(() => tryChange(attempt + 1), 150);
  };
  tryChange();
}

function FlagButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`relative w-8 h-8 rounded-full overflow-hidden transition-all duration-200 ${
        active
          ? "ring-2 ring-yai-orange scale-110 shadow-lg"
          : "ring-1 ring-white/40 hover:ring-white opacity-70 hover:opacity-100 hover:scale-105"
      }`}
    >
      {children}
    </button>
  );
}

/* Simple circular SVG flags — readable at 32×32 */

function UKFlag() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <defs>
        <clipPath id="uk-clip">
          <circle cx="30" cy="30" r="30" />
        </clipPath>
      </defs>
      <g clipPath="url(#uk-clip)">
        {/* Navy background */}
        <rect width="60" height="60" fill="#012169" />
        {/* White diagonals (St Andrew + St Patrick) */}
        <path d="M0,0 L60,60 M60,0 L0,60" stroke="#FFFFFF" strokeWidth="10" />
        {/* Red diagonals */}
        <path d="M0,0 L60,60 M60,0 L0,60" stroke="#C8102E" strokeWidth="4" />
        {/* White cross (St George) */}
        <path d="M30,0 V60 M0,30 H60" stroke="#FFFFFF" strokeWidth="14" />
        {/* Red cross */}
        <path d="M30,0 V60 M0,30 H60" stroke="#C8102E" strokeWidth="8" />
      </g>
    </svg>
  );
}

function CNFlag() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <defs>
        <clipPath id="cn-clip">
          <circle cx="30" cy="30" r="30" />
        </clipPath>
      </defs>
      <g clipPath="url(#cn-clip)">
        {/* Red background */}
        <rect width="60" height="60" fill="#DE2910" />
        {/* Big star + 4 small stars */}
        <Star cx={15} cy={15} r={6} />
        <Star cx={26} cy={8} r={2.2} />
        <Star cx={31} cy={14} r={2.2} />
        <Star cx={31} cy={22} r={2.2} />
        <Star cx={26} cy={28} r={2.2} />
      </g>
    </svg>
  );
}

function Star({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  // Build a 5-point star polygon
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r / 2.5;
    return `${cx + rr * Math.cos(angle)},${cy + rr * Math.sin(angle)}`;
  }).join(" ");
  return <polygon points={points} fill="#FFDE00" />;
}
