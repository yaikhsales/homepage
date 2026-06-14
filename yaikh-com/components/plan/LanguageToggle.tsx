"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

/* Round UK / China flag toggle. NO Google Translate dependency.
 * Writes the chosen language to localStorage + dispatches a 'yai-lang-changed' event.
 * Consumers (Sidebar, anything that uses translate()) listen for that event and re-render. */

export function LanguageToggle() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" ? localStorage.getItem("yai-lang") : null) as Lang | null;
    if (saved === "zh") setLang("zh");
  }, []);

  const switchTo = (target: Lang) => {
    setLang(target);
    if (typeof window === "undefined") return;
    localStorage.setItem("yai-lang", target);
    window.dispatchEvent(new CustomEvent<Lang>("yai-lang-changed", { detail: target }));
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <FlagButton active={lang === "en"} onClick={() => switchTo("en")} title="English">
        <UKFlag />
      </FlagButton>
      <FlagButton active={lang === "zh"} onClick={() => switchTo("zh")} title="中文">
        <CNFlag />
      </FlagButton>
    </div>
  );
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

function UKFlag() {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      <defs>
        <clipPath id="uk-clip">
          <circle cx="30" cy="30" r="30" />
        </clipPath>
      </defs>
      <g clipPath="url(#uk-clip)">
        <rect width="60" height="60" fill="#012169" />
        <path d="M0,0 L60,60 M60,0 L0,60" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M0,0 L60,60 M60,0 L0,60" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 V60 M0,30 H60" stroke="#FFFFFF" strokeWidth="14" />
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
        <rect width="60" height="60" fill="#DE2910" />
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
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r / 2.5;
    return `${cx + rr * Math.cos(angle)},${cy + rr * Math.sin(angle)}`;
  }).join(" ");
  return <polygon points={points} fill="#FFDE00" />;
}

/* Public hook: any client component can read the current language + re-render on change. */
export function useLang(): Lang {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("yai-lang") as Lang | null;
    if (saved === "zh") setLang("zh");
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Lang>).detail;
      if (detail === "en" || detail === "zh") setLang(detail);
    };
    window.addEventListener("yai-lang-changed", handler);
    return () => window.removeEventListener("yai-lang-changed", handler);
  }, []);
  return lang;
}
