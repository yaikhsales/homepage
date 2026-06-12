import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

// Mapping function to match category titles to icon image filenames
const getWaterIconImage = (title) => {
    const titleToImageMap = {
        'Washing': 'washing.png',
        'Rain Water Collect': 'rain-water-collect.png',
        'Building 1': 'building.png',
        'Building 2': 'building.png',
        'Building 3': 'building.png',
        'Boiler': 'boiler.png',
        'Canteen': 'canteen.png',
        'Office': 'office.png',
        'Staff Room': 'staff-room.png'
    };
    
    return titleToImageMap[title] || 'water.jpg';
};

const Water = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleBack = () => {
        if (selectedCategory) {
            setSelectedCategory(null);
        } else if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleSubModuleClick = (category, subModule) => {
        // Navigate to water/in or water/out with category parameter
        const path = subModule === 'In' ? '/dashboard/water/in' : '/dashboard/water/out';
        navigate(path, { state: { category } });
    };

    const waterCategories = [
        { 
            title: 'Washing',
            titleKey: 'washing',
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            shadow: 'shadow-blue-200'
        },
        { 
            title: 'Rain Water Collect',
            titleKey: 'rainWaterCollect',
            color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
            shadow: 'shadow-cyan-200'
        },
        { 
            title: 'Building 1',
            titleKey: 'building1',
            color: 'bg-gradient-to-br from-green-500 to-green-600',
            shadow: 'shadow-green-200'
        },
        { 
            title: 'Building 2',
            titleKey: 'building2',
            color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            shadow: 'shadow-emerald-200'
        },
        { 
            title: 'Building 3',
            titleKey: 'building3',
            color: 'bg-gradient-to-br from-teal-500 to-teal-600',
            shadow: 'shadow-teal-200'
        },
        { 
            title: 'Boiler',
            titleKey: 'boiler',
            color: 'bg-gradient-to-br from-orange-500 to-orange-600',
            shadow: 'shadow-orange-200'
        },
        { 
            title: 'Canteen',
            titleKey: 'canteen',
            color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
            shadow: 'shadow-yellow-200'
        },
        { 
            title: 'Office',
            titleKey: 'office',
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            shadow: 'shadow-purple-200'
        },
        { 
            title: 'Staff Room',
            titleKey: 'staffRoom',
            color: 'bg-gradient-to-br from-pink-500 to-pink-600',
            shadow: 'shadow-pink-200'
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
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 px-2 sm:px-4">{t('water')}</h1>
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
                {!selectedCategory ? (
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
                            {waterCategories.map((category, idx) => {
                                const iconImage = getWaterIconImage(category.title);
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleCategoryClick(category.title)}
                                        className={`
                                            ${category.color} 
                                            text-white 
                                            p-6 sm:p-8 
                                            rounded-xl 
                                            shadow-lg 
                                            ${category.shadow}
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
                                        <div className="relative z-10 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-2 bg-white rounded-lg p-2 sm:p-3 shadow-lg">
                                            {iconImage ? (
                                                <img 
                                                    src={`/assets/water/${iconImage}`}
                                                    alt={category.title}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-white/20 rounded-lg flex items-center justify-center">
                                                    <div className="w-12 h-12 bg-white/30 rounded"></div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Text Label */}
                                        <span className="relative z-10 font-bold text-sm sm:text-base text-center leading-tight drop-shadow-md">
                                            {category.titleKey ? t(category.titleKey) : category.title}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                            >
                                <ArrowLeft size={20} />
                                <span>{t('back')}</span>
                            </button>
                            <h2 className="text-xl font-bold text-gray-800">
                                {waterCategories.find(cat => cat.title === selectedCategory)?.titleKey 
                                    ? t(waterCategories.find(cat => cat.title === selectedCategory).titleKey)
                                    : selectedCategory}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button
                                onClick={() => handleSubModuleClick(selectedCategory, 'In')}
                                className="bg-gradient-to-br from-sky-400 to-sky-500 text-white p-10 rounded-xl shadow-lg shadow-sky-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-5 min-h-[200px] relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-white rounded-xl p-4 sm:p-5 shadow-xl">
                                    <img 
                                        src="/assets/icons/sub-icons/water.jpg"
                                        alt={t('in')}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <span className="relative z-10 font-bold text-lg sm:text-xl drop-shadow-md">{t('in')}</span>
                            </button>
                            <button
                                onClick={() => handleSubModuleClick(selectedCategory, 'Out')}
                                className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-10 rounded-xl shadow-lg shadow-orange-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-5 min-h-[200px] relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-white rounded-xl p-4 sm:p-5 shadow-xl">
                                    <img 
                                        src="/assets/icons/sub-icons/water.jpg"
                                        alt={t('out')}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <span className="relative z-10 font-bold text-lg sm:text-xl drop-shadow-md">{t('out')}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Water;

