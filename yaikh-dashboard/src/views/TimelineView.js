import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

const TimelineView = ({ onBack, onAdd }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-white rounded-xl shadow-2xl h-[600px] m-4 animate-in fade-in duration-500 flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
                <div className="w-32"></div> {/* Left spacer */}
                <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-200 rounded-lg bg-slate-100">
                            <ArrowLeft size={18} /> {t('back')}
                        </button>
                        <a
                            href="/"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-slate-300 hover:border-slate-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
                            title={t('home')}
                        >
                            <img 
                                src="/logo.jpg" 
                                alt={t('home')} 
                                className="w-full h-full object-cover"
                            />
                        </a>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{t('meetingRoomBooking')}</h2>
                </div>
                <button
                    onClick={onAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={16} /> {t('newBooking')}
                </button>
            </div>
            <div className="flex-1 p-6 overflow-auto">
                <div className="flex mb-4 pl-32 border-b pb-2">
                    {[9, 10, 11, 12, 13, 14, 15, 16, 17].map(h => (
                        <div key={h} className="flex-1 text-center text-xs font-bold text-gray-400">
                            {h}:00
                        </div>
                    ))}
                </div>
                {[t('roomALarge'), t('roomBSmall'), t('confHall'), t('projectRoom')].map((room, i) => (
                    <div key={i} className="flex items-center mb-6 h-12 relative group">
                        <div className="w-32 font-bold text-slate-700 text-sm">{room}</div>
                        <div className="flex-1 bg-slate-100 h-10 rounded-lg relative overflow-hidden">
                            <div
                                className="absolute top-1 bottom-1 bg-blue-500 rounded-md opacity-80 text-white text-[10px] flex items-center justify-center font-bold truncate px-2 border border-blue-600 shadow-sm"
                                style={{ left: `${(i * 15) + 10}%`, width: '20%' }}
                            >
                                {t('teamSync')}
                            </div>
                            {i % 2 === 0 && (
                                <div
                                    className="absolute top-1 bottom-1 bg-green-500 rounded-md opacity-80 text-white text-[10px] flex items-center justify-center font-bold truncate px-2 border border-green-600 shadow-sm"
                                    style={{ left: '60%', width: '15%' }}
                                >
                                    {t('clientCall')}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineView;

