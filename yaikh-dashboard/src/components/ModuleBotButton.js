import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import GeneralAIAgent from '../general-ag';

// Sub-modules owned by the Accounting PA — bubble must wear the
// green/emerald PA palette so the user reads it as the same agent
// they meet in the home BotModules dropdown.
const ACCOUNTING_BUBBLE_MODULES = new Set([
    'Purchase Request', 'Show List Request', 'Master List',
    'Purchaser Workspace', 'My Confirm Received', 'Documents Joiner',
    'Bill Claim', 'Salary Bill', 'Shipping Bill', 'IEWS', 'Accountant',
]);

/**
 * Reusable bot button component for sub-modules
 * @param {string} moduleName - The name of the module to display in the bot
 * @param {string} ariaLabel - Accessibility label for the button
 * @param {string} title - Tooltip text for the button
 */
const ModuleBotButton = ({ moduleName, ariaLabel, title }) => {
    const [isBotOpen, setIsBotOpen] = useState(false);
    const isAccountingBubble = ACCOUNTING_BUBBLE_MODULES.has(moduleName);
    const bubbleGradient = isAccountingBubble
        ? 'from-green-500 to-emerald-500'
        : 'from-orange-500 to-amber-500';

    return (
        <>
            {/* Bot Button - Bottom Right */}
            <button
                onClick={() => setIsBotOpen(true)}
                className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r ${bubbleGradient} text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group`}
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

