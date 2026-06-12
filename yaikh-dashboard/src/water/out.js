import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import GeneralAIAgent from '../general-ag';
import { useTranslation } from '../translate/TranslationContext';

const WaterOut = ({ onBack }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [isBotOpen, setIsBotOpen] = useState(false);
    
    // Get category from navigation state, default to 'Washing'
    const category = location.state?.category || 'Washing';

    // Sample device data
    const device = {
        id: 1,
        name: `${category} Out`,
        deviceId: 'Bcc3023201230ead',
        totalWaterConsumed: 108.987
    };

    // Graph data - bell curve pattern from 00:00 to 09:00
    // Flat at 0 from 00:00 to ~05:45, peak at ~0.9 m³ around 07:00, back to 0 by ~08:15
    const graphData = [
        { time: '00:00', value: 0 },
        { time: '01:00', value: 0 },
        { time: '02:00', value: 0 },
        { time: '03:00', value: 0 },
        { time: '04:00', value: 0 },
        { time: '05:00', value: 0 },
        { time: '06:00', value: 0.3 },
        { time: '07:00', value: 0.9 },
        { time: '08:00', value: 0.1 },
        { time: '09:00', value: 0 }
    ];

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    // Render water consumption graph
    const renderWaterGraph = (data, width = 500, height = 200) => {
        const times = data.map(d => d.time);
        const padding = { top: 20, right: 20, bottom: 40, left: 50 };
        const graphWidth = width - padding.left - padding.right;
        const graphHeight = height - padding.top - padding.bottom;
        
        const maxValue = 1;
        const yScale = graphHeight / maxValue;
        
        const getX = (index) => padding.left + (index / (times.length - 1)) * graphWidth;
        const getY = (value) => padding.top + graphHeight - (value * yScale);
        
        // Create path for water consumption (shaded area)
        const areaPath = data.map((point, index) => {
            const x = getX(index);
            const y = getY(point.value);
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ') + ` L ${getX(times.length - 1)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;
        
        // Create line path
        const linePath = data.map((point, index) => {
            const x = getX(index);
            const y = getY(point.value);
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        return (
            <svg width={width} height={height} className="w-full h-full">
                {/* Grid lines */}
                {[0, 0.2, 0.4, 0.8, 1].map((value) => {
                    const y = getY(value);
                    return (
                        <line
                            key={value}
                            x1={padding.left}
                            y1={y}
                            x2={width - padding.right}
                            y2={y}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                        />
                    );
                })}
                
                {/* Y-axis labels */}
                {[0, 0.2, 0.4, 0.8, 1].map((value) => {
                    const y = getY(value);
                    return (
                        <text
                            key={value}
                            x={padding.left - 10}
                            y={y + 4}
                            textAnchor="end"
                            fontSize="10"
                            fill="#6b7280"
                        >
                            {value} m³
                        </text>
                    );
                })}
                
                {/* X-axis labels */}
                {times.map((time, index) => {
                    const x = getX(index);
                    return (
                        <text
                            key={index}
                            x={x}
                            y={height - padding.bottom + 15}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#6b7280"
                        >
                            {time}
                        </text>
                    );
                })}
                
                {/* Water consumption area (shaded) */}
                <path
                    d={areaPath}
                    fill="rgba(59, 130, 246, 0.3)"
                    stroke="none"
                />
                
                {/* Water consumption line */}
                <path
                    d={linePath}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                />
            </svg>
        );
    };

    return (
        <div className="fixed inset-0 bg-slate-100 flex flex-col animate-in fade-in duration-500 z-[200]">
            {/* Header */}
            <div className="bg-white p-4 border-b flex items-center gap-4 flex-shrink-0 shadow-sm relative z-[201]">
                <div className="w-32"></div> {/* Left spacer */}
                <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleBack} 
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 rounded transition-colors flex-shrink-0 bg-slate-600 text-white font-semibold text-sm"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={16} /> {t('back')}
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-slate-300 hover:border-slate-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
                            title={t('home')}
                        >
                            <img 
                                src="/logo.jpg" 
                                alt={t('home')} 
                                className="w-full h-full object-cover"
                            />
                        </button>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800 underline">{t('waterProductList')}</h1>
                </div>
                <div className="w-32"></div> {/* Right spacer */}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="w-full h-full">
                    {/* Dashed Border Container */}
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 bg-slate-50 h-full">
                        <div className="flex gap-6 h-full">
                            {/* Left Panel */}
                            <div className="w-80 flex-shrink-0 flex flex-col gap-4">
                                {/* Summary Statistics */}
                                <div className="bg-white rounded-lg border border-slate-300 p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm text-slate-600 mb-1">{t('totalDevice')}:</div>
                                            <div className="text-2xl font-bold text-slate-800">1</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-600 mb-1">{t('totalWaterConsumed')}:</div>
                                            <div className="text-2xl font-bold text-slate-800">{device.totalWaterConsumed} m³</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Device Information */}
                                <div className="bg-white rounded-lg border border-slate-300 p-6 flex flex-col items-center">
                                    {/* Water Meter Image/Icon */}
                                    <div className="w-48 h-48 bg-slate-800 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                                        <img 
                                            src="/assets/icons/sub-icons/water.jpg"
                                            alt={t('waterMeter')}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                console.error('Failed to load water meter image');
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Device Name */}
                                    <div className="text-center mb-2">
                                        <div className="font-bold text-slate-800 text-lg">{device.id}. {device.name}</div>
                                    </div>
                                    
                                    {/* Device ID */}
                                    <div className="text-xs text-slate-500 font-mono">
                                        {device.deviceId}
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel - Graphs */}
                            <div className="flex-1 flex flex-col gap-6">
                                {/* Graph 1 (Top) */}
                                <div className="bg-white rounded-lg border border-slate-300 p-4">
                                    <div className="h-48">
                                        {renderWaterGraph(graphData)}
                                    </div>
                                </div>

                                {/* Graph 2 (Bottom) */}
                                <div className="bg-white rounded-lg border border-slate-300 p-4">
                                    <div className="h-48">
                                        {renderWaterGraph(graphData)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bot Button - Bottom Right */}
            <button
                onClick={() => setIsBotOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label="Ask Water Out bot"
                title="Ask Water Out bot"
            >
                <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            </button>
            
            {/* Bot Modal */}
            {isBotOpen && (
                <GeneralAIAgent 
                    onClose={() => setIsBotOpen(false)}
                    moduleContext="Water Out"
                />
            )}
        </div>
    );
};

export default WaterOut;

