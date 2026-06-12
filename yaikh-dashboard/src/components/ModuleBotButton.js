import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import GeneralAIAgent from '../general-ag';

/**
 * Reusable bot button component for sub-modules
 * @param {string} moduleName - The name of the module to display in the bot
 * @param {string} ariaLabel - Accessibility label for the button
 * @param {string} title - Tooltip text for the button
 */
const ModuleBotButton = ({ moduleName, ariaLabel, title }) => {
    const [isBotOpen, setIsBotOpen] = useState(false);

    return (
        <>
            {/* Bot Button - Bottom Right */}
            <button
                onClick={() => setIsBotOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label={ariaLabel || `Ask ${moduleName} bot`}
                title={title || `Ask ${moduleName} bot`}
            >
                <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>
            
            {/* Bot Modal */}
            {isBotOpen && (
                <GeneralAIAgent 
                    onClose={() => setIsBotOpen(false)}
                    moduleContext={moduleName}
                />
            )}
        </>
    );
};

export default ModuleBotButton;

