import React from "react";
import { useTranslation } from '../translate/TranslationContext';

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
        <div className={`relative flex items-center justify-center ${isDropdownOpen ? 'w-14 h-14' : 'w-20 h-20 group-hover:w-21 group-hover:h-21'} transition-all duration-300`}>
          <img
            src="/IMG/unavail.avif"
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
      // Display icons in their original colors without any filters
      const iconStyle = {
        mixBlendMode: 'normal',
        filter: 'none',
        WebkitFilter: 'none',
      };

      return (
        <div className={`relative flex items-center justify-center ${isDropdownOpen ? 'w-14 h-14' : 'w-20 h-20 group-hover:w-21 group-hover:h-21'
          } transition-all duration-300`}>
          <img
            src={`/${data.image}`}
            alt={data.title}
            className={`w-full h-full object-contain transition-all duration-300 group-hover:scale-110 ${isDropdownOpen ? 'rounded-2xl' : 'rounded-3xl'
              }`}
            style={iconStyle}
          />
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
                <img src={`/${data.image}`} alt={data.title} className="w-16 h-16 object-contain" />
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
