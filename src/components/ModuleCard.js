import React from "react";
import { useTranslation } from '../translate/TranslationContext';

const ModuleCard = ({ data, onClick, botVersion = 'default', onBotClick, isDropdownOpen = false, isLightOn = false, isAdministration = false, isOrangeGroup = false, isWhiteGroup = false, theme = 'normal' }) => {
  const { translateModuleTitle } = useTranslation();
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
    <div
      onClick={handleCardClick}
      className={`
            bg-white rounded-lg border-2 shadow-sm transition ease-in-out duration-500 flex flex-col justify-between cursor-pointer w-full
            h-28 sm:h-32 md:h-36 relative group overflow-hidden
            bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white from-60% ${data.highlight ? 'to-orange-200' : 'to-green-200'}
            ${isComingSoon ? '' : 'hover:-translate-y-1 hover:scale-105 hover:shadow-lg'}
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
  );
};

export default ModuleCard;
