import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import GeneralAIAgent from '../general-ag';
import { useTranslation } from '../translate/TranslationContext';

// Mapping function to match module titles to sub-icon image filenames
const getSalaryBillIconImage = (title) => {
    const titleToImageMap = {
        'Monthly Salary': 'monthly-salary.png',
        'Incentive': 'weekly-incentive.png',
        'Permit Fee': 'permit-fee.png',
        'Resign Payment': 'resign-payment.png'
    };
    
    return titleToImageMap[title] || null;
};

const SalaryBill = ({ onBack }) => {
    const navigate = useNavigate();
    const { t, translateModuleTitle } = useTranslation();
    const [isBotOpen, setIsBotOpen] = useState(false);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleSubModuleClick = (module) => {
        // Navigate to respective module pages
        const routeMap = {
            'Monthly Salary': '/dashboard/monthly-salary',
            'Incentive': '/dashboard/weekly-incentive',
            'Permit Fee': '/dashboard/permit-fee',
            'Resign Payment': '/dashboard/resign-payment'
        };
        const route = routeMap[module.title];
        if (route) {
            navigate(route);
        } else {
            console.log(`${module.title} clicked - no route defined`);
        }
    };

    const salaryBillModules = [
        { 
            title: 'Monthly Salary', 
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            shadow: 'shadow-blue-200'
        },
        { 
            title: 'Incentive', 
            color: 'bg-gradient-to-br from-green-500 to-green-600',
            shadow: 'shadow-green-200'
        },
        { 
            title: 'Permit Fee', 
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            shadow: 'shadow-purple-200'
        },
        { 
            title: 'Resign Payment', 
            color: 'bg-gradient-to-br from-orange-500 to-orange-600',
            shadow: 'shadow-orange-200'
        }
    ];

    return (
        <div className="fixed inset-0 bg-gray-100 flex flex-col overflow-hidden z-[100]">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-[101]">
                <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0 relative">
                    {/* Left: Empty space for balance */}
                    <div className="flex-1"></div>
                    
                    {/* Center: Back Button, Title, and Home Button */}
                    <div className="flex items-center gap-3 sm:gap-4 justify-center flex-1">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base"
                            aria-label="Back"
                        >
                            <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                            <span className="font-medium hidden sm:inline">{t('back')}</span>
                        </button>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 px-2 sm:px-4">{t('salaryBill')}</h1>
                        <button
                            onClick={() => navigate('/')}
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gray-300 hover:border-gray-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
                            title="Home"
                        >
                            <img 
                                src="/logo.jpg" 
                                alt="Home" 
                                className="w-full h-full object-cover"
                            />
                        </button>
                    </div>
                    
                    {/* Right: Empty space for balance */}
                    <div className="flex-1"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                        {salaryBillModules.map((module, idx) => {
                            const iconImage = getSalaryBillIconImage(module.title);
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSubModuleClick(module)}
                                    className={`
                                        ${module.color} 
                                        text-white 
                                        p-6 sm:p-8 
                                        rounded-xl 
                                        shadow-lg 
                                        ${module.shadow}
                                        hover:shadow-2xl 
                                        transition-all 
                                        duration-300
                                        hover:scale-105 
                                        active:scale-95
                                        flex 
                                        flex-col 
                                        items-center 
                                        justify-center 
                                        gap-4
                                        min-h-[160px] 
                                        sm:min-h-[180px]
                                        relative
                                        overflow-hidden
                                        group
                                    `}
                                >
                                    {/* Subtle overlay for depth */}
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {/* Icon Container */}
                                    <div className="relative z-10 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-2">
                                        {iconImage ? (
                                            <img 
                                                src={`/assets/icons/sub-icons/${iconImage}`}
                                                alt={module.title}
                                                className="w-full h-full object-contain drop-shadow-2xl"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center">
                                                <div className="w-12 h-12 bg-white/30 rounded"></div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Text Label */}
                                    <span className="relative z-10 font-bold text-sm sm:text-base text-center leading-tight drop-shadow-md">
                                        {translateModuleTitle(module.title)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Bot Button - Bottom Right */}
            <button
                onClick={() => setIsBotOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label="Ask Salary Bill bot"
                title="Ask Salary Bill bot"
            >
                <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>
            
            {/* Bot Modal */}
            {isBotOpen && (
                <GeneralAIAgent 
                    onClose={() => setIsBotOpen(false)}
                    moduleContext="Salary Bill"
                />
            )}
        </div>
    );
};

export default SalaryBill;

