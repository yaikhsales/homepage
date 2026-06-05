import React from 'react';
import ColumnGroup from './ColumnGroup';
import { useTranslation } from '../translate/TranslationContext';

const SectionContainer = ({ section, onModuleClick, onGMChatClick, botVersion = 'default', onBotModuleClick, isDropdownOpen = false, isLightOn = false, theme = 'normal' }) => {
  const { translateModuleTitle, t } = useTranslation();
  // Central Section (Management Dashboard)
  if (section.isCentral) {
      return (
          <div className={`relative flex flex-col mx-2 shrink-0 ${isDropdownOpen ? '' : 'apple-fade-in-delay'}`}>
             {/* GM Bot Icon - Positioned absolutely at the top, doesn't affect label position */}
             <div className="absolute -top-24 left-1/2 -translate-x-1/2 group flex flex-col items-center gap-2 z-20">
                {!isDropdownOpen && <div className="absolute inset-0 rounded-full bg-purple-400/20 blur-xl group-hover:bg-purple-400/30 transition-all duration-500 scale-150"></div>}
                <button onClick={onGMChatClick} className={`relative rounded-full hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${isDropdownOpen ? 'shadow-lg' : 'shadow-2xl hover:shadow-purple-500/50'}`} aria-label="Open GM Bot Assistant">
                    <img src="/assets/modules-image/top-bot.png" alt="GM Bot Assistant" className={`w-16 h-16 rounded-full object-cover border-2 border-purple-400/50 transition-all duration-300 ${isDropdownOpen ? '' : 'group-hover:border-purple-300'}`} />
                </button>
                <div className="text-white font-semibold text-sm text-center drop-shadow-lg whitespace-nowrap">
                    My AI Agent
                </div>
             </div>

             {/* Big Label - Aligned at same level as other sections */}
             <div className="w-full text-white font-bold text-center py-2 rounded-lg mb-8 text-sm md:text-base h-[38px] flex items-center justify-center transition-all duration-300 bg-white bg-opacity-20 backdrop-blur-sm px-3 shadow-sm mt-0">
                {translateModuleTitle(section.title)}
             </div>
             
             {/* Container for Columns */}
             {section.groups && section.groups.length > 0 ? (
                 <div className="flex gap-3 items-start">
                    {section.groups.map(group => (
                        <ColumnGroup
                            key={group.id}
                            group={group}
                            onModuleClick={onModuleClick}
                            botVersion={botVersion}
                            onBotModuleClick={onBotModuleClick}
                            isDropdownOpen={isDropdownOpen}
                            isLightOn={isLightOn}
                            theme={theme}
                        />
                    ))}
                 </div>
             ) : (
                <div className="h-full w-[1px] bg-gradient-to-b from-cyan-500/50 to-transparent"></div>
             )}
          </div>
      );
  }

  // Regular Sections (Admin, Ops)
  const isAdministration = section.id === 'admin-section';
  
  return (
    <div className={`flex flex-col mx-2 ${isDropdownOpen ? '' : 'apple-fade-in-delay-2'}`}>
       {/* Big Section Label (Spans all children) */}
       <div className="w-full text-white font-bold text-center py-2 rounded-lg mb-4 text-sm md:text-base h-[38px] flex items-center justify-center transition-all duration-300 bg-white bg-opacity-20 backdrop-blur-sm px-3 md:px-4 shadow-sm">
          {translateModuleTitle(section.title)}
       </div>
       
       {/* HORIZONTAL CONNECTOR LINE - AS SEEN IN IMAGE 1 */}
       <div className="relative mb-2 px-10">
          <div className={`h-[1px] w-full ${isAdministration ? 'bg-gradient-to-r from-transparent via-white/50 to-white/50' : 'bg-gradient-to-r from-white/50 via-white/50 to-transparent'}`} />
          {/* Vertical ticks for each group? For now just the line as Image 1 shows a continuous line. */}
       </div>
       
       {/* Container for Columns */}
       <div className="flex gap-3 items-start">
          {section.groups.map(group => (
            <ColumnGroup
                key={group.id}
                group={group}
                onModuleClick={onModuleClick}
                botVersion={botVersion}
                onBotModuleClick={onBotModuleClick}
                isDropdownOpen={isDropdownOpen}
                isLightOn={isLightOn}
                isAdministration={isAdministration}
                theme={theme}
            />
          ))}
       </div>
    </div>
  );
};

export default SectionContainer;