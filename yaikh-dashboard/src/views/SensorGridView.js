import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wind, Thermometer, Droplets } from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

const SensorGridView = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-100 flex flex-col animate-in fade-in duration-500 z-[200]">
            {/* Header */}
            <div className="bg-white p-4 border-b flex items-center gap-4 flex-shrink-0 shadow-sm relative z-[201]">
                <button 
                    onClick={handleBack} 
                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 rounded transition-colors flex-shrink-0 bg-slate-600 text-white font-semibold text-sm"
                    aria-label={t('goBack')}
                >
                    <ArrowLeft size={16} /> {t('back')}
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex-1">{t('airQualitySensors')}</h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((s) => (
                            <div key={s} className="bg-white border border-slate-300 rounded-xl p-6 hover:shadow-lg transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                        <Wind size={24} />
                                    </div>
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                                        {t('online')}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg mb-4">{t('sensorNode')} #{s}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-3 rounded-lg text-center">
                                        <Thermometer className="mx-auto text-red-400 mb-1" size={20} />
                                        <div className="text-xl font-bold">24°C</div>
                                        <div className="text-xs text-gray-500">{t('temp')}</div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg text-center">
                                        <Droplets className="mx-auto text-blue-400 mb-1" size={20} />
                                        <div className="text-xl font-bold">60%</div>
                                        <div className="text-xs text-gray-500">{t('humidity')}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SensorGridView;

