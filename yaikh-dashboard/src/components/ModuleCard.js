import React from "react";
import { useTranslation } from '../translate/TranslationContext';

/* App-style icon for the flip front. Emoji reads as a conventional app
   icon on a phone home screen; falls back to the module initial. Keyed by
   module id so the presentation looks like real apps before revealing the
   Ai agent face. */
const MODULE_EMOJI = {
  accountant: "🧮", iews: "🌐", "purchase-request": "🛒", "bill-claim": "🧾",
  "salary-bill": "💵", "shipping-bill": "📑", yhr: "👥", "org-chart": "🗂️",
  training: "🎓", "temp-worker": "🧑‍🏭", "speak-up": "📢",
  "support-ticket": "🎫", "y-shop": "🏪", "gate-pass": "🛂",
  "meeting-room": "📅", "car-booking": "🚗", "fire-alarm": "🚨", cctv: "📹",
  "digital-audit": "✅", energy: "⚡", air: "🌬️", water: "💧", waste: "♻️",
  chemical: "🧪", shipping: "🚢", "e-government": "🏛️",
  "management-dashboard": "📊", sop: "📘", "system-analysis": "🔬",
  yqms: "🔍", "call-out": "📞", fc: "🧵", ywip: "🏭", ce: "📐", ytm: "🔧",
  "ytm-shop": "🛠️", "4dp": "🎨", ypi: "💡", mrp: "📦",
};

/* A palette of app-tile gradients; picked deterministically per module so
   each card keeps a stable colour across flips, like a home-screen grid. */
const APP_GRADIENTS = [
  "linear-gradient(135deg,#F37021,#FF9E5E)", // Yai orange
  "linear-gradient(135deg,#0055A5,#3B82F6)", // blue
  "linear-gradient(135deg,#0EA5A5,#22D3C5)", // teal
  "linear-gradient(135deg,#7C3AED,#A78BFA)", // violet
  "linear-gradient(135deg,#059669,#34D399)", // green
  "linear-gradient(135deg,#DB2777,#F472B6)", // pink
  "linear-gradient(135deg,#D97706,#FBBF24)", // amber
  "linear-gradient(135deg,#475569,#94A3B8)", // slate
];

function hashId(id = "") {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

const ModuleCard = ({ data, onClick, botVersion = 'default', onBotClick, isDropdownOpen = false, isLightOn = false, isAdministration = false, isOrangeGroup = false, isWhiteGroup = false, theme = 'normal' }) => {
  const { t, translateModuleTitle } = useTranslation();
  const isComingSoon = data.status === "coming-soon";

  const handleCardClick = () => {
    if (isComingSoon) return;
    if (botVersion === 'bot-v1' && onBotClick) {
      onBotClick(data);
      return;
    }
    if (onClick) onClick(data);
  };

  const renderIcon = () => {
    if (isComingSoon || (!data.image && !data.icon && !data.logo)) {
      const iconStyle = {
        mixBlendMode: 'normal',
        filter: 'none',
        WebkitFilter: 'none',
      };
      return (
        <div className={`relative flex items-center justify-center w-20 h-20 group-hover:w-21 group-hover:h-21 transition-all duration-300`}>
          <img
            src={`${process.env.PUBLIC_URL}/IMG/unavail.avif`}
            alt="Coming Soon"
            className={`w-full h-full object-contain transition-all duration-300 group-hover:scale-110 ${isDropdownOpen ? 'rounded-2xl' : 'rounded-3xl'}`}
            style={iconStyle}
          />
        </div>
      );
    }

    if (data.logo) {
      return (
        <div
          className={`text-3xl font-black italic ${data.color || "text-green-500"
            }`}
        >
          {data.title === "E-Invoicing"
            ? "Ei"
            : data.title === "YQMS"
              ? "Q"
              : "S"}
        </div>
      );
    }
    if (data.image) {
      const iconStyle = { mixBlendMode: 'normal', filter: 'none', WebkitFilter: 'none' };
      const rounded = isDropdownOpen ? 'rounded-2xl' : 'rounded-3xl';

      // Flip front — an app-style icon tile (emoji on a stable gradient),
      // so the constellation first reads like a conventional app grid.
      const emoji = MODULE_EMOJI[data.id] || null;
      const gradient = APP_GRADIENTS[hashId(data.id) % APP_GRADIENTS.length];
      const initial = (data.title || '?').charAt(0).toUpperCase();

      return (
        <div className="yai-flip-scene relative w-20 h-20 group-hover:w-21 group-hover:h-21 transition-all duration-300">
          {/* All cards share one timeline → they flip in unison. */}
          <div className="yai-flip-card">
            {/* FRONT — conventional app icon */}
            <div className="yai-flip-face">
              <div
                className={`w-full h-full ${rounded} flex items-center justify-center shadow-sm`}
                style={{ background: gradient }}
              >
                {emoji ? (
                  <span style={{ fontSize: 40, lineHeight: 1 }}>{emoji}</span>
                ) : (
                  <span style={{ fontFamily: 'Inter,system-ui,sans-serif', fontSize: 34, fontWeight: 800, color: '#fff' }}>
                    {initial}
                  </span>
                )}
              </div>
            </div>

            {/* BACK — the Ai agent face */}
            <div className="yai-flip-face yai-flip-back">
              <img
                src={`${process.env.PUBLIC_URL}/${data.image}`}
                alt={data.title}
                className={`w-full h-full object-contain ${rounded}`}
                style={iconStyle}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "data:image/svg+xml;utf8," +
                    encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
                         <rect width="80" height="80" rx="16" fill="#F37021"/>
                         <text x="50%" y="58%" font-family="Inter,system-ui,sans-serif" font-size="38" font-weight="800" text-anchor="middle" fill="#fff">${initial}</text>
                       </svg>`
                    );
                }}
              />
            </div>
          </div>
        </div>
      );
    }
    const IconComponent = data.icon;
    return (
      <IconComponent
        size={32}
        className={`${isComingSoon
          ? "text-black"
          : data.color || "text-slate-800"
          }`}
      />
    );
  };

  return (
    <div className="relative group w-full h-28 sm:h-32 md:h-36 hover:z-[100]">
      <div
        onClick={handleCardClick}
        className={`
              absolute inset-0 bg-white rounded-lg border border-gray-200/40 shadow-sm transition ease-in-out duration-500 flex flex-col justify-between cursor-pointer
              overflow-hidden
              ${data.highlight ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white from-60% to-orange-100' : ''}
              ${isComingSoon ? '' : 'group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-lg'}
          `}
      >
        {/* Inner Content */}
        <div className="rounded-md overflow-hidden flex justify-center items-center p-2 h-full relative">
          {renderIcon()}
        </div>

        <p className="text-gray-600 text-center font-medium text-xs sm:text-sm px-2 pb-2 line-clamp-2">
          {translateModuleTitle(data.title)}
        </p>
      </div>

      {/* Hover Popup Tooltip */}
      {data.description && !isComingSoon && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[400px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-gray-100 z-50 p-6 flex gap-5 opacity-0 invisible scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto">
          
          {/* Avatar Side */}
          <div className="shrink-0 flex items-start">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <img src={`${process.env.PUBLIC_URL}/${data.image}`} alt={data.title} className="w-16 h-16 object-contain" />
             </div>
          </div>

          {/* Text Content Side */}
          <div className="flex-1 text-left relative">
            {/* Visual Close Button */}
            <div className="absolute -top-2 -right-2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </div>

            <div className="text-[#0055A5] text-[10px] font-bold tracking-widest uppercase mb-1">
              {t(`popupTitle_${data.id.replace(/-/g, '_')}`) !== `popupTitle_${data.id.replace(/-/g, '_')}` ? t(`popupTitle_${data.id.replace(/-/g, '_')}`) : (data.popupTitle || data.title)}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
              {t(`title_${data.id.replace(/-/g, '_')}`) !== `title_${data.id.replace(/-/g, '_')}` ? t(`title_${data.id.replace(/-/g, '_')}`) : translateModuleTitle(data.title)}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              "{t(`desc_${data.id.replace(/-/g, '_')}`) !== `desc_${data.id.replace(/-/g, '_')}` ? t(`desc_${data.id.replace(/-/g, '_')}`) : data.description}"
            </p>
            <p className="text-gray-400 text-xs italic">
              {t('draftRoleNote')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
