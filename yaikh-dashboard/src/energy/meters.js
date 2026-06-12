import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gauge } from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

const Meters = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Sample device data
    const devices = [
        {
            id: 1,
            name: 'New boiler',
            deviceId: 'b8fbe8708a8a49709c9b',
            energyData: {
                a: [10, 12, 15, 18, 20, 25, 30, 35],
                b: [5, 6, 8, 10, 12, 15, 18, 20],
                c: [8, 9, 11, 13, 15, 18, 22, 25],
                d: [3, 4, 5, 6, 7, 9, 11, 13],
                total: [26, 31, 39, 47, 54, 67, 81, 93]
            }
        },
        {
            id: 2,
            name: 'Pressing',
            deviceId: 'a7c8d9e0f1a2b3c4d5e6',
            energyData: {
                a: [15, 16, 18, 20, 22, 28, 35, 42],
                b: [8, 9, 10, 12, 14, 18, 22, 26],
                c: [10, 11, 13, 15, 17, 21, 26, 30],
                d: [4, 5, 6, 7, 8, 10, 12, 14],
                total: [37, 41, 47, 54, 61, 77, 95, 112]
            }
        },
        {
            id: 3,
            name: 'Air-Compressor',
            deviceId: 'c9d0e1f2a3b4c5d6e7f8',
            energyData: {
                a: [12, 13, 15, 17, 19, 24, 30, 38],
                b: [6, 7, 8, 9, 10, 13, 16, 20],
                c: [9, 10, 12, 14, 16, 20, 25, 30],
                d: [3, 4, 5, 6, 7, 9, 11, 13],
                total: [30, 34, 40, 46, 52, 66, 82, 101]
            }
        },
        {
            id: 4,
            name: 'Secondary SP',
            deviceId: 'd0e1f2a3b4c5d6e7f8a9',
            energyData: {
                a: [18, 19, 20, 22, 25, 30, 38, 45],
                b: [10, 11, 12, 14, 16, 20, 25, 30],
                c: [12, 13, 14, 16, 18, 22, 28, 33],
                d: [5, 6, 7, 8, 9, 11, 14, 17],
                total: [45, 49, 53, 60, 68, 83, 105, 125]
            }
        },
        {
            id: 5,
            name: 'Raw pile source',
            deviceId: 'e1f2a3b4c5d6e7f8a9b0',
            energyData: {
                a: [20, 21, 23, 26, 30, 38, 48, 58],
                b: [12, 13, 14, 16, 18, 23, 29, 35],
                c: [15, 16, 18, 20, 23, 29, 36, 43],
                d: [6, 7, 8, 9, 10, 13, 16, 19],
                total: [53, 57, 63, 71, 81, 103, 129, 155]
            }
        },
        {
            id: 6,
            name: 'Oilbox',
            deviceId: 'f2a3b4c5d6e7f8a9b0c1',
            energyData: {
                a: [14, 15, 17, 19, 22, 28, 35, 42],
                b: [7, 8, 9, 10, 12, 15, 19, 23],
                c: [10, 11, 13, 15, 17, 21, 26, 31],
                d: [4, 5, 6, 7, 8, 10, 12, 15],
                total: [35, 39, 45, 51, 59, 74, 92, 111]
            }
        }
    ];

    // Generate more devices to reach 20 total
    const generateMoreDevices = () => {
        const moreDevices = [];
        const names = ['Generator', 'Cooling System', 'Heating Unit', 'Ventilation', 'Lighting System', 'Motor A', 'Motor B', 'Pump System', 'Compressor 2', 'Boiler 2', 'Turbine', 'Transformer', 'Switch Gear', 'Control Panel'];
        for (let i = 7; i <= 20; i++) {
            moreDevices.push({
                id: i,
                name: names[i - 7] || `Device ${i}`,
                deviceId: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 10)}`,
                energyData: {
                    a: Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 10),
                    b: Array.from({ length: 8 }, () => Math.floor(Math.random() * 30) + 5),
                    c: Array.from({ length: 8 }, () => Math.floor(Math.random() * 40) + 8),
                    d: Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) + 3),
                    total: Array.from({ length: 8 }, () => Math.floor(Math.random() * 150) + 30)
                }
            });
        }
        return [...devices, ...moreDevices];
    };

    const [allDevices] = useState(generateMoreDevices());
    const totalDevices = allDevices.length;
    const totalEnergyConsumed = allDevices.reduce((sum, device) => {
        return sum + device.energyData.total.reduce((a, b) => a + b, 0);
    }, 0);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleExportAll = () => {
        console.log('Export all meters record');
    };

    const handleHourlyReport = () => {
        console.log('Generate hourly report');
    };

    // Render energy consumption graph
    const renderEnergyGraph = (energyData, width = 400, height = 150) => {
        const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '08:00'];
        const padding = { top: 20, right: 20, bottom: 30, left: 50 };
        const graphWidth = width - padding.left - padding.right;
        const graphHeight = height - padding.top - padding.bottom;
        
        const maxValue = Math.max(...energyData.total, 1000);
        const yScale = graphHeight / maxValue;
        
        const getX = (index) => padding.left + (index / (times.length - 1)) * graphWidth;
        const getY = (value) => padding.top + graphHeight - (value * yScale);
        
        // Create path for total energy (shaded area)
        const totalPath = energyData.total.map((value, index) => {
            const x = getX(index);
            const y = getY(value);
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ') + ` L ${getX(times.length - 1)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;
        
        // Create paths for individual lines
        const createPath = (data) => {
            return data.map((value, index) => {
                const x = getX(index);
                const y = getY(value);
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ');
        };

        return (
            <svg width={width} height={height} className="w-full h-full">
                {/* Grid lines */}
                {[0, 200, 400, 600, 800, 1000].map((value) => {
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
                {[0, 200, 400, 600, 800, 1000].map((value) => {
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
                            {value}
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
                
                {/* Total Energy Consumed (shaded area) */}
                <path
                    d={totalPath}
                    fill="rgba(239, 68, 68, 0.2)"
                    stroke="none"
                />
                
                {/* Energy Consumed A (blue line) */}
                <path
                    d={createPath(energyData.a)}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                />
                
                {/* Energy Consumed B (orange line) */}
                <path
                    d={createPath(energyData.b)}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                />
                
                {/* Energy Consumed C (teal line) */}
                <path
                    d={createPath(energyData.c)}
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="2"
                />
                
                {/* Energy Consumed D (purple line) */}
                <path
                    d={createPath(energyData.d)}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                />
                
                {/* Y-axis label */}
                <text
                    x={padding.left - 30}
                    y={height / 2}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                    transform={`rotate(-90 ${padding.left - 30} ${height / 2})`}
                >
                    Kw.H
                </text>
            </svg>
        );
    };

    return (
        <div className="fixed inset-0 bg-white flex flex-col animate-in fade-in duration-500 z-[200]">
            {/* Header */}
            <div className="bg-white p-4 border-b flex items-center justify-between flex-shrink-0 shadow-sm relative z-[201]">
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
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">{t('metersDeviceList')}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExportAll}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm"
                    >
                        {t('exportAllMetersRecord')}
                    </button>
                    <button
                        onClick={handleHourlyReport}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm"
                    >
                        {t('hourlyReport')}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex gap-6">
                        {/* Summary Panel */}
                        <div className="w-64 flex-shrink-0">
                            <div className="bg-white border border-slate-300 rounded-lg p-6">
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-slate-600 mb-1">{t('totalDevice')}:</div>
                                        <div className="text-2xl font-bold text-slate-800">{totalDevices}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-slate-600 mb-1">{t('totalEnergyConsumed')}:</div>
                                        <div className="text-2xl font-bold text-slate-800">{totalEnergyConsumed.toFixed(1)}Kw.H</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Device List */}
                        <div className="flex-1 space-y-4">
                            {allDevices.map((device) => (
                                <div key={device.id} className="bg-white border border-slate-300 rounded-lg p-4 flex gap-6">
                                    {/* Device Info Card */}
                                    <div className="w-48 flex-shrink-0 flex flex-col items-center justify-center border-r border-slate-200 pr-4">
                                        <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center mb-3">
                                            <Gauge size={32} className="text-white" />
                                        </div>
                                        <div className="text-center">
                                            <div className="font-bold text-slate-800 mb-1">{device.id}. {device.name}</div>
                                            <div className="text-xs text-slate-500 font-mono">{device.deviceId}</div>
                                        </div>
                                    </div>

                                    {/* Energy Consumption Graph */}
                                    <div className="flex-1 min-w-0">
                                        <div className="h-40">
                                            {renderEnergyGraph(device.energyData)}
                                        </div>
                                        {/* Legend */}
                                        <div className="flex items-center gap-4 mt-2 text-xs">
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-0.5 bg-blue-500"></div>
                                                <span className="text-slate-600">{t('energyConsumedA')}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-0.5 bg-orange-500"></div>
                                                <span className="text-slate-600">{t('energyConsumedB')}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-0.5 bg-teal-500"></div>
                                                <span className="text-slate-600">{t('energyConsumedC')}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-0.5 bg-purple-500"></div>
                                                <span className="text-slate-600">{t('energyConsumedD')}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-3 bg-red-500/20 border border-red-500"></div>
                                                <span className="text-slate-600">{t('totalEnergyConsumed')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Meters;

