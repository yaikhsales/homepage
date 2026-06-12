import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

const WasteDashboardView = ({ onBack }) => {
    const { t } = useTranslation();
    const wasteTypes = [t('totalWaste'), t('recycled'), t('landfill'), t('hazardous')];
    
    return (
        <div className="bg-slate-50 rounded-xl shadow-2xl h-[600px] m-4 animate-in fade-in duration-500 flex flex-col overflow-hidden">
            <div className="bg-purple-700 text-white p-4 flex items-center gap-4 shadow-md">
                <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 hover:bg-white/30 rounded-lg bg-white/10">
                    <ArrowLeft size={18} /> {t('back')}
                </button>
                <h2 className="text-xl font-bold">{t('wasteManagementAnalytics')}</h2>
            </div>
            <div className="p-6 grid grid-cols-3 gap-6 flex-1 overflow-auto">
                <div className="col-span-3 grid grid-cols-4 gap-4 mb-2">
                    {wasteTypes.map((t, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
                            <div className="text-gray-500 text-xs uppercase font-bold">{t}</div>
                            <div className="text-2xl font-bold text-slate-800">
                                {Math.floor(Math.random() * 500)} kg
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm flex flex-col items-center justify-center">
                    <h3 className="font-bold text-gray-700 mb-6 self-start">{t('composition')}</h3>
                    <div className="w-48 h-48 rounded-full border-[20px] border-purple-200 border-t-purple-600 border-r-pink-500"></div>
                    <div className="flex gap-4 mt-6 text-xs font-bold">
                        <span className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-purple-600 rounded-full"></div> {t('plastic')}
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-pink-500 rounded-full"></div> {t('paper')}
                        </span>
                    </div>
                </div>
                <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-gray-700 mb-4">{t('monthlyTrend')}</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[30, 45, 20, 60, 40, 70, 50, 80, 55, 45, 65, 90].map((h, i) => (
                            <div key={i} className="w-full bg-purple-100 rounded-t-lg relative group">
                                <div
                                    className="absolute bottom-0 w-full bg-purple-600 rounded-t-lg transition-all duration-500"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WasteDashboardView;

