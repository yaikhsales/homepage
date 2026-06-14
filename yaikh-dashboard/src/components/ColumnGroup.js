import React from 'react';
import ModuleCard from './ModuleCard';
import { useTranslation } from '../translate/TranslationContext';

const ColumnGroup = ({ group, onModuleClick, botVersion = 'default', onBotModuleClick, isDropdownOpen = false, isLightOn = false, isAdministration = false, isOperations = false, isCentral = false, theme = 'normal' }) => {
  const { translateModuleTitle } = useTranslation();
  // Check if this group should have orange styling (QA, Production, DT Sync, 4DP, YPI, MRP)
  const isOrangeGroup = group.id === 'qa-col' || group.id === 'prod-col' || group.id === 'dtsync-col' || group.id === '4dp-col' || group.id === 'ypi-col' || group.id === 'mrp-col';
  // Check if this group should have white styling (PRE PRO, Production Materials)
  const isWhiteGroup = group.id === 'prepro-col' || group.id === 'prodmat-col';
  
  return (
    <div className="relative flex flex-col w-[110px] sm:w-[120px] md:w-[130px] shrink-0 hover:z-[100]">
      {/* Sub Label - Always show frame, even if title is empty - Big label size matching QA but rounded
          Central section (Management Dashboard children) → dark emerald to match
          the section header. Admin / Ops → Yai-blue with orange-aroma glow. */}
      <div className="mb-5 flex justify-center h-[38px] items-center">
        <div
          className={`w-full text-center py-2 rounded-lg text-sm md:text-base font-semibold flex items-center justify-center transition-all duration-300 backdrop-blur-sm px-3 shadow-sm border ${isCentral ? 'border-emerald-800/60' : isOperations ? 'border-emerald-300/50' : 'border-yai-blue/40'} ${group.title ? 'text-white' : 'text-transparent'}`}
          style={
            isCentral
              ? {
                  backgroundColor: '#021E16',
                  backgroundImage:
                    'radial-gradient(ellipse at 95% 50%, rgba(243,112,33,0.20) 0%, transparent 70%),' +
                    'linear-gradient(135deg, #021E16 0%, #032E22 50%, #064E3B 100%)',
                }
              : isOperations
              ? {
                  backgroundImage:
                    'radial-gradient(ellipse at 95% 50%, rgba(243,112,33,0.45) 0%, transparent 60%),' +
                    'linear-gradient(135deg, rgba(16,185,129,0.75) 0%, rgba(52,211,153,0.65) 50%, rgba(110,231,183,0.55) 100%)',
                }
              : {
                  backgroundImage:
                    'radial-gradient(ellipse at 95% 50%, rgba(243,112,33,0.45) 0%, transparent 60%),' +
                    'linear-gradient(135deg, rgba(10,31,71,0.80) 0%, rgba(30,77,170,0.68) 50%, rgba(30,64,175,0.55) 100%)',
                }
          }
        >
            {group.title ? translateModuleTitle(group.title) : ''}
        </div>
      </div>
      
      {/* Vertical Stack of Modules */}
      <div className="flex flex-col gap-1">
        {group.modules.map((mod, idx) => (
          <div 
            key={idx}
            className={`relative hover:z-[100] ${isDropdownOpen ? '' : 'apple-fade-in-delay'}`}
            style={isDropdownOpen ? {} : { 
              animationDelay: `${0.6 + idx * 0.1}s`,
              opacity: 0 
            }}
          >
            <ModuleCard
              data={mod}
              onClick={onModuleClick}
              botVersion={botVersion}
              onBotClick={onBotModuleClick}
              isDropdownOpen={isDropdownOpen}
              isLightOn={isLightOn}
              isAdministration={isAdministration}
              isOrangeGroup={isOrangeGroup}
              isWhiteGroup={isWhiteGroup}
              theme={theme}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnGroup;