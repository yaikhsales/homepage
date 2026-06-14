import React from 'react';
import ColumnGroup from './ColumnGroup';
import { useTranslation } from '../translate/TranslationContext';

const SectionContainer = ({ section, onModuleClick, onGMChatClick, botVersion = 'default', onBotModuleClick, isDropdownOpen = false, isLightOn = false, theme = 'normal' }) => {
  const { translateModuleTitle, t } = useTranslation();
  // Central Section (Management Dashboard)
  if (section.isCentral) {
      return (
          <div className={`relative flex flex-col mx-2 shrink-0 hover:z-[100] ${isDropdownOpen ? '' : 'apple-fade-in-delay'}`}>
             {/* My (orange Yai logo) task agent — inline row, logo IS the
                 click target. Hover glow on the logo only, text flanks it. */}
             <div className="absolute -top-24 left-1/2 -translate-x-1/2 group z-20 flex items-center gap-3 whitespace-nowrap">
                <span className="text-white font-bold text-3xl drop-shadow-lg">My</span>
                <div className="relative flex-shrink-0 w-14 h-14">
                  {!isDropdownOpen && <div className="absolute inset-0 rounded-full bg-yai-orange/30 blur-xl group-hover:bg-yai-orange/50 transition-all duration-500 scale-150"></div>}
                  <button
                    onClick={onGMChatClick}
                    aria-label="Open My Task Agent"
                    className={`relative block w-14 h-14 rounded-full hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yai-orange focus:ring-offset-2 focus:ring-offset-slate-900 ${isDropdownOpen ? 'shadow-lg' : 'shadow-2xl hover:shadow-yai-orange/50'}`}
                  >
                    <img
                      src="/assets/modules-image/top-bot.png"
                      alt="Yai"
                      className={`w-14 h-14 rounded-full object-cover border-2 border-yai-orange/60 transition-all duration-300 ${isDropdownOpen ? '' : 'group-hover:border-yai-orange'}`}
                    />
                  </button>
                </div>
                <span className="text-white font-bold text-3xl drop-shadow-lg">task agent</span>
             </div>

             {/* Big Label — lighter emerald base (emerald-800 → emerald-600 → emerald-500)
                 with a strong Yai-orange aroma glow on the right edge. Mirrors the
                 brightness of the Admin / Ops blue bars, just green instead of blue. */}
             <div
               className="w-full text-white font-bold text-center py-2 rounded-lg mb-8 text-sm md:text-base h-[38px] flex items-center justify-center transition-all duration-300 backdrop-blur-sm px-3 shadow-md border border-emerald-800/70 mt-0"
               style={{
                 backgroundColor: '#021E16',
                 backgroundImage:
                   'radial-gradient(ellipse at 95% 50%, rgba(243,112,33,0.22) 0%, transparent 70%),' +
                   'linear-gradient(135deg, #021E16 0%, #032E22 50%, #064E3B 100%)',
               }}
             >
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
                            isCentral={true}
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
  const isOperations = section.title === 'Operations';

  return (
    <div className={`relative flex flex-col mx-2 hover:z-[100] ${isDropdownOpen ? '' : 'apple-fade-in-delay-2'}`}>
       {/* Big Section Label — Operations uses light-mint base; Administration
           stays deep Yai-blue. Both share the Yai-orange aroma on the right. */}
       <div
         className={`w-full text-white font-bold text-center py-2 rounded-lg mb-4 text-sm md:text-base h-[38px] flex items-center justify-center transition-all duration-300 backdrop-blur-sm px-3 md:px-4 shadow-md border ${isOperations ? 'border-emerald-300/60' : 'border-yai-blue/50'}`}
         style={
           isOperations
             ? {
                 backgroundImage:
                   'radial-gradient(ellipse at 95% 50%, rgba(243,112,33,0.55) 0%, transparent 60%),' +
                   'linear-gradient(135deg, rgba(16,185,129,0.85) 0%, rgba(52,211,153,0.75) 50%, rgba(110,231,183,0.65) 100%)',
               }
             : {
                 backgroundImage:
                   'radial-gradient(ellipse at 95% 50%, rgba(243,112,33,0.55) 0%, transparent 60%),' +
                   'linear-gradient(135deg, rgba(10,31,71,0.90) 0%, rgba(30,77,170,0.78) 50%, rgba(30,64,175,0.65) 100%)',
               }
         }
       >
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
                isOperations={isOperations}
                theme={theme}
            />
          ))}
       </div>
    </div>
  );
};

export default SectionContainer;