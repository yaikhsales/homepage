import React from "react";
import { useTranslation } from "../translate/TranslationContext";

/* Three language flags — Khmer · English · Chinese. Drives the whole UI
   (module titles via TranslationContext) AND the chat: gemini-api.js sends
   `lang` from localStorage('app-language') so Big Brain answers in it.
   Default comes from the browser language (see TranslationContext). */
const LANG_FLAGS = [
  { code: "km", cc: "kh", label: "ខ្មែរ",   title: "ភាសាខ្មែរ · Khmer" },
  { code: "en", cc: "gb", label: "EN",     title: "English" },
  { code: "zh", cc: "cn", label: "中文",   title: "中文 · Chinese" },
];
export const LangFlags = () => {
  const { language, changeLanguage } = useTranslation();
  return (
    <div
      className="flex items-center gap-2 rounded-full bg-slate-900/70 backdrop-blur px-2 py-1 border border-white/15"
      title="Language · ភាសា · 语言"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {LANG_FLAGS.map((f) => {
        const active = language === f.code;
        return (
          <button
            key={f.code}
            type="button"
            onClick={() => changeLanguage(f.code)}
            title={f.title}
            aria-label={f.title}
            aria-pressed={active}
            className={`flex items-center gap-1.5 rounded-full px-2 py-1 transition-all ${
              active
                ? "bg-white/15 ring-2 ring-orange-400/80 scale-105"
                : "opacity-60 hover:opacity-100 hover:bg-white/10"
            }`}
          >
            <img
              src={`https://flagcdn.com/w40/${f.cc}.png`}
              srcSet={`https://flagcdn.com/w80/${f.cc}.png 2x`}
              width="28"
              height="20"
              alt={f.title}
              className="rounded-[3px] shadow"
              style={{ objectFit: "cover" }}
            />
            <span className="text-xs font-bold text-white/90">{f.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LangFlags;
