import React from 'react';
import ModuleCard from './ModuleCard';
import { useTranslation } from '../translate/TranslationContext';

const ColumnGroup = ({ group, onModuleClick, botVersion = 'default', onBotModuleClick, isDropdownOpen = false, isLightOn = false, isAdministration = false, isOperations = false, theme = 'normal' }) => {
  const { translateModuleTitle } = useTranslation();
  // Check if this group should have orange styling (QA, Production, DT Sync, 4DP, YPI, MRP)
  const isOrangeGroup = group.id === 'qa-col' || group.id === 'prod-col' || group.id === 'dtsync-col' || group.id === '4dp-col' || group.id === 'ypi-col' || group.id === 'mrp-col';
  // Check if this group should have white styling (PRE PRO, Production Materials)
  const isWhiteGroup = group.id === 'prepro-col' || group.id === 'prodmat-col';
  
  return (
    <div className="flex flex-col w-[110px] sm:w-[120px] md:w-[130px] shrink-0">
      {/* Sub Label - Always show frame, even if title is empty - Big label size matching QA but rounded */}
      <div className="mb-5 flex justify-center h-[38px] items-center">
        <div className={`w-full text-center py-2 rounded-lg text-sm md:text-base font-semibold flex items-center justify-center transition-all duration-300 bg-white bg-opacity-20 backdrop-blur-sm px-3 shadow-sm ${group.title ? 'text-white' : 'text-transparent'}`}>
            {group.title ? translateModuleTitle(group.title) : ''}
        </div>
      </div>
      
      {/* Vertical Stack of Modules */}
      <div className="flex flex-col gap-1">
        {group.modules.map((mod, idx) => (
          <div 
            key={idx}
            className={isDropdownOpen ? '' : 'apple-fade-in-delay'}
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