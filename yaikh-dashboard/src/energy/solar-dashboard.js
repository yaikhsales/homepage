import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Sun, Zap, TrendingUp, TrendingDown,
    Cloud, CloudRain, Wind, Thermometer, Battery,
    BarChart2, Activity, Download, RefreshCw, Clock
} from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

const SolarDashboard = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedPeriod, setSelectedPeriod] = useState('today');
    const [liveTime, setLiveTime] = useState(new Date());
    const [sunAngle, setSunAngle] = useState(0);

    // Live clock and sun animation
    useEffect(() => {
        const timer = setInterval(() => {
            setLiveTime(new Date());
            // Animate sun position based on time of day (6am-6pm arc)
            const now = new Date();
            const hours = now.getHours() + now.getMinutes() / 60;
            const angle = ((hours - 6) / 12) * 180;
            setSunAngle(Math.max(0, Math.min(180, angle)));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

    // Simulated data
    const currentPower = 87.4; // kW
    const peakPower = 112.5;
    const panelCapacity = 120;
    const dailyGeneration = 520; // kWh today
    const monthlyGeneration = 15600; // kWh this month
    const yearlyGeneration = 185000; // kWh this year
    const co2Saved = (yearlyGeneration * 0.55 / 1000).toFixed(1); // tonnes
    const treesEquivalent = Math.round(yearlyGeneration * 0.55 / 21.77);
    const batteryLevel = 72;
    const irradiance = 845; // W/m²
    const panelTemp = 52.3;
    const efficiency = 91.2;
    const inverterEfficiency = 97.5;

    // Hourly generation data (kW, hours 0-23)
    const hourlyGeneration = {
        today: [0, 0, 0, 0, 0, 0, 2, 18, 42, 68, 87, 98, 105, 112, 108, 95, 74, 48, 22, 8, 1, 0, 0, 0],
        yesterday: [0, 0, 0, 0, 0, 0, 1, 15, 38, 62, 80, 92, 99, 105, 102, 89, 68, 42, 18, 5, 0, 0, 0, 0],
    };

    const periodData = {
        today: { label: 'Today', generation: 520, revenue: '$83.2', peak: '112.5 kW @ 13:00', co2: '286 kg' },
        week: { label: 'This Week', generation: 3640, revenue: '$582.4', peak: '115.2 kW', co2: '2002 kg' },
        month: { label: 'This Month', generation: 15600, revenue: '$2,496', peak: '119.8 kW', co2: '8580 kg' },
        year: { label: 'This Year', generation: 185000, revenue: '$29,600', peak: '120 kW', co2: '101.75 t' },
    };

    // Panel array - 4 rows x 8 columns = 32 panels
    const panelRows = 4;
    const panelCols = 8;
    const panelStatuses = Array.from({ length: panelRows * panelCols }, (_, i) => {
        if (i === 14 || i === 21) return 'fault';
        if (i === 7 || i === 22) return 'low';
        return 'normal';
    });

    // Inverters data
    const inverters = [
        { id: 1, name: 'Inverter A', power: 32.5, efficiency: 97.8, status: 'active', temp: 48.2 },
        { id: 2, name: 'Inverter B', power: 28.9, efficiency: 97.2, status: 'active', temp: 45.6 },
        { id: 3, name: 'Inverter C', power: 26.0, efficiency: 97.5, status: 'active', temp: 47.1 },
    ];

    // Weather data
    const weather = { condition: 'Partly Cloudy', temp: 32, humidity: 68, windSpeed: 12 };

    // SVG Chart renderer
    const renderBarChart = (data, color = '#eab308') => {
        const current = liveTime.getHours();
        const w = 640; const h = 120; const pad = { t: 8, r: 8, b: 24, l: 40 };
        const maxVal = Math.max(...data, 1);
        const gw = w - pad.l - pad.r;
        const gh = h - pad.t - pad.b;
        const barW = (gw / data.length) - 2;

        return (
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
                {/* Y grid */}
                {[0, 25, 50, 75, 100].map(pct => {
                    const y = pad.t + gh - (pct / 100) * gh;
                    const val = (pct / 100) * maxVal;
                    return (
                        <g key={pct}>
                            <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                            <text x={pad.l - 4} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{val.toFixed(0)}</text>
                        </g>
                    );
                })}
                {/* Bars */}
                {data.map((v, i) => {
                    const x = pad.l + i * (gw / data.length) + 1;
                    const barH = (v / maxVal) * gh;
                    const y = pad.t + gh - barH;
                    const isCurrent = i === current;
                    return (
                        <g key={i}>
                            <rect x={x} y={y} width={barW} height={barH}
                                fill={isCurrent ? '#f59e0b' : i < current ? color : '#e2e8f0'}
                                rx="2" opacity={isCurrent ? 1 : 0.8}
                            />
                            {(i % 3 === 0) && (
                                <text x={x + barW / 2} y={h - pad.b + 12} textAnchor="middle" fontSize="8" fill="#94a3b8">{`${i}h`}</text>
                            )}
                        </g>
                    );
                })}
                {/* Current power line */}
                <line x1={pad.l} y1={pad.t + gh - (currentPower / maxVal) * gh}
                    x2={w - pad.r} y2={pad.t + gh - (currentPower / maxVal) * gh}
                    stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" />
                <text x={w - pad.r - 2} y={pad.t + gh - (currentPower / maxVal) * gh - 2}
                    textAnchor="end" fontSize="8" fill="#ef4444" fontWeight="bold">Now</text>
            </svg>
        );
    };

    // Sun arc
    const SunArc = () => {
        const r = 80;
        const cx = 120;
        const cy = 100;
        const startX = cx - r;
        const startY = cy;
        const endX = cx + r;
        const endY = cy;
        const rad = (sunAngle * Math.PI) / 180;
        const sunX = cx + r * Math.cos(Math.PI - rad);
        const sunY = cy - r * Math.sin(Math.PI - rad);
        const isDay = sunAngle > 0 && sunAngle < 180;

        return (
            <svg viewBox="0 0 240 110" className="w-full max-w-[240px]">
                {/* Arc path */}
                <path d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
                    fill="none" stroke="#e2e8f0" strokeWidth="3" />
                {/* Elapsed arc */}
                {isDay && (
                    <path d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${sunX} ${sunY}`}
                        fill="none" stroke="#fbbf24" strokeWidth="3" />
                )}
                {/* Horizon */}
                <line x1={startX - 8} y1={cy} x2={endX + 8} y2={cy} stroke="#e2e8f0" strokeWidth="1.5" />
                {/* Sun */}
                {isDay && (
                    <g>
                        <circle cx={sunX} cy={sunY} r="10" fill="#fbbf24" />
                        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
                            const sr = (a * Math.PI) / 180;
                            return (
                                <line key={a}
                                    x1={sunX + 12 * Math.cos(sr)} y1={sunY + 12 * Math.sin(sr)}
                                    x2={sunX + 16 * Math.cos(sr)} y2={sunY + 16 * Math.sin(sr)}
                                    stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"
                                />
                            );
                        })}
                    </g>
                )}
                {/* Labels */}
                <text x={startX - 2} y={cy + 16} textAnchor="middle" fontSize="9" fill="#94a3b8">6:00</text>
                <text x={cx} y={cy + 16} textAnchor="middle" fontSize="9" fill="#94a3b8">12:00</text>
                <text x={endX + 2} y={cy + 16} textAnchor="middle" fontSize="9" fill="#94a3b8">18:00</text>
            </svg>
        );
    };

    return (
        <div className="fixed inset-0 bg-slate-50 flex flex-col animate-in fade-in duration-500 z-[200]">
            {/* Header */}
            <div className="bg-white p-4 border-b flex items-center gap-4 flex-shrink-0 shadow-sm relative z-[201]">
                <div className="w-32"></div>
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
                            <img src="/logo.jpg" alt={t('home')} className="w-full h-full object-cover" />
                        </button>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Sun size={22} className="text-yellow-500" /> Solar PV Dashboard
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-xs text-slate-500">Live</div>
                        <div className="text-sm font-mono font-bold text-green-600 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            {liveTime.toLocaleTimeString()}
                        </div>
                    </div>
                    <button className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors text-sm">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto space-y-5">

                    {/* Top Hero Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                        {/* Current Power Card */}
                        <div className="lg:col-span-1 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl p-6 text-white shadow-lg shadow-yellow-200">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-yellow-100 text-sm font-medium">Current Power Output</p>
                                    <div className="text-5xl font-bold mt-1">{currentPower}</div>
                                    <div className="text-yellow-100 text-lg">kW</div>
                                </div>
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                    <Sun size={40} className="text-white" />
                                </div>
                            </div>
                            <div className="h-1.5 bg-white/30 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-white rounded-full" style={{ width: `${(currentPower / panelCapacity * 100).toFixed(0)}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-yellow-100">
                                <span>0 kW</span>
                                <span>{(currentPower / panelCapacity * 100).toFixed(0)}% of {panelCapacity} kWp</span>
                                <span>{panelCapacity} kW</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm">
                                <TrendingUp size={14} />
                                <span className="text-yellow-100">Peak today: {peakPower} kW @ 13:00</span>
                            </div>
                        </div>

                        {/* Sun Arc + Weather */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center">
                            <p className="text-sm font-semibold text-slate-600 mb-2">Sun Position</p>
                            <SunArc />
                            <div className="grid grid-cols-4 gap-3 mt-2 w-full">
                                <div className="text-center">
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                                        <Thermometer size={16} className="text-orange-500" />
                                    </div>
                                    <div className="text-sm font-bold text-slate-800">{weather.temp}°C</div>
                                    <div className="text-xs text-slate-400">Ambient</div>
                                </div>
                                <div className="text-center">
                                    <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                                        <Cloud size={16} className="text-sky-500" />
                                    </div>
                                    <div className="text-sm font-bold text-slate-800">{weather.humidity}%</div>
                                    <div className="text-xs text-slate-400">Humidity</div>
                                </div>
                                <div className="text-center">
                                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                                        <Wind size={16} className="text-teal-500" />
                                    </div>
                                    <div className="text-sm font-bold text-slate-800">{weather.windSpeed} m/s</div>
                                    <div className="text-xs text-slate-400">Wind</div>
                                </div>
                                <div className="text-center">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                                        <Zap size={16} className="text-yellow-500" />
                                    </div>
                                    <div className="text-sm font-bold text-slate-800">{irradiance}</div>
                                    <div className="text-xs text-slate-400">W/m²</div>
                                </div>
                            </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Today Generation', value: `${dailyGeneration}`, unit: 'kWh', color: 'yellow', icon: Sun, trend: '+5.2%' },
                                { label: 'This Month', value: `${(monthlyGeneration / 1000).toFixed(1)}`, unit: 'MWh', color: 'blue', icon: BarChart2, trend: '+2.1%' },
                                { label: 'Panel Efficiency', value: `${efficiency}`, unit: '%', color: 'green', icon: Activity, trend: 'Normal' },
                                { label: 'CO₂ Saved (Year)', value: co2Saved, unit: 't', color: 'teal', icon: TrendingUp, trend: 'Cumulative' },
                            ].map((m, i) => {
                                const Icon = m.icon;
                                const colors = {
                                    yellow: 'bg-yellow-100 text-yellow-600',
                                    blue: 'bg-blue-100 text-blue-600',
                                    green: 'bg-green-100 text-green-600',
                                    teal: 'bg-teal-100 text-teal-600',
                                };
                                return (
                                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                        <div className={`w-8 h-8 ${colors[m.color]} rounded-lg flex items-center justify-center mb-2`}>
                                            <Icon size={16} />
                                        </div>
                                        <div className="text-xl font-bold text-slate-800">{m.value}<span className="text-sm font-normal text-slate-400 ml-1">{m.unit}</span></div>
                                        <div className="text-xs text-slate-500">{m.label}</div>
                                        <div className="text-xs text-green-600 mt-1 font-medium">{m.trend}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Period Selector + Chart */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-slate-800">Generation History</h2>
                            <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
                                {['today', 'week', 'month', 'year'].map(p => (
                                    <button key={p} onClick={() => setSelectedPeriod(p)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${selectedPeriod === p ? 'bg-yellow-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            {renderBarChart(hourlyGeneration.today)}
                            <div className="text-xs text-slate-400 text-center mt-1">Hour of day (kW)</div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                            {Object.entries(periodData[selectedPeriod]).map(([k, v]) => (
                                <div key={k} className="text-center">
                                    <div className="text-sm font-bold text-slate-800">{v}</div>
                                    <div className="text-xs text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Panel Array + Inverters */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                        {/* Panel Array Heatmap */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-slate-800">Panel Array Status</h2>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded"></span>Normal</span>
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-300 rounded"></span>Low</span>
                                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded"></span>Fault</span>
                                </div>
                            </div>
                            <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${panelCols}, 1fr)` }}>
                                {panelStatuses.map((status, i) => (
                                    <div
                                        key={i}
                                        title={`Panel ${i + 1}: ${status}`}
                                        className={`aspect-[4/3] rounded cursor-pointer hover:opacity-80 transition-opacity ${status === 'fault' ? 'bg-red-400' : status === 'low' ? 'bg-orange-300' : 'bg-yellow-400'}`}
                                    />
                                ))}
                            </div>
                            <div className="mt-3 text-xs text-slate-500 flex justify-between">
                                <span>Total Panels: {panelRows * panelCols}</span>
                                <span className="text-red-500 font-medium">⚠ 2 faults, 2 low output</span>
                                <span>Panel Temp: {panelTemp}°C</span>
                            </div>
                        </div>

                        {/* Inverters */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <h2 className="text-base font-bold text-slate-800 mb-4">Inverter Status</h2>
                            <div className="space-y-4">
                                {inverters.map(inv => (
                                    <div key={inv.id} className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                    <Zap size={18} className="text-yellow-600" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-800 text-sm">{inv.name}</div>
                                                    <div className="text-xs text-slate-500">{inv.power} kW output</div>
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                {inv.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 text-center">
                                            <div>
                                                <div className="text-sm font-bold text-yellow-600">{inv.power} kW</div>
                                                <div className="text-xs text-slate-400">Power</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-blue-600">{inv.efficiency}%</div>
                                                <div className="text-xs text-slate-400">Efficiency</div>
                                            </div>
                                            <div>
                                                <div className={`text-sm font-bold ${inv.temp > 50 ? 'text-orange-600' : 'text-slate-700'}`}>{inv.temp}°C</div>
                                                <div className="text-xs text-slate-400">Temp</div>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(inv.power / 40) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Battery + Environmental Impact */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                        {/* Battery Status */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <h2 className="text-base font-bold text-slate-800 mb-4">Battery Storage Status</h2>
                            <div className="flex items-center gap-6">
                                {/* Battery visual */}
                                <div className="flex items-center gap-2">
                                    <div className="relative w-16 h-28 border-2 border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-green-400 transition-all duration-1000 animate-pulse"
                                            style={{ height: `${batteryLevel}%` }}
                                        ></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-sm font-bold text-slate-800 z-10">{batteryLevel}%</span>
                                        </div>
                                    </div>
                                    <div className="w-4 h-8 bg-slate-300 rounded-sm mx-auto"></div>
                                </div>
                                <div className="flex-1 space-y-3">
                                    {[
                                        { label: 'State of Charge', value: `${batteryLevel}%`, color: 'green' },
                                        { label: 'Capacity', value: '100 kWh', color: 'blue' },
                                        { label: 'Status', value: 'Charging', color: 'green' },
                                        { label: 'Charge Rate', value: '35 kW', color: 'yellow' },
                                        { label: 'Est. Full Charge', value: '2h 15m', color: 'slate' },
                                        { label: 'Cycles Today', value: '0.7', color: 'slate' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500">{item.label}</span>
                                            <span className={`font-semibold text-${item.color}-600`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Environmental Impact */}
                        <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-xl p-5 shadow-sm">
                            <h2 className="text-base font-bold text-slate-800 mb-4">🌱 Environmental Impact</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                                    <div className="text-3xl mb-1">🌍</div>
                                    <div className="text-2xl font-bold text-green-700">{co2Saved}t</div>
                                    <div className="text-xs text-slate-500">CO₂ Saved This Year</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                                    <div className="text-3xl mb-1">🌳</div>
                                    <div className="text-2xl font-bold text-green-700">{treesEquivalent}</div>
                                    <div className="text-xs text-slate-500">Trees Equivalent</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                                    <div className="text-3xl mb-1">⚡</div>
                                    <div className="text-2xl font-bold text-yellow-600">{(yearlyGeneration / 1000).toFixed(0)} MWh</div>
                                    <div className="text-xs text-slate-500">Clean Energy Generated</div>
                                </div>
                                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                                    <div className="text-3xl mb-1">💰</div>
                                    <div className="text-2xl font-bold text-blue-600">$29.6K</div>
                                    <div className="text-xs text-slate-500">Cost Savings (Year)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SolarDashboard;
