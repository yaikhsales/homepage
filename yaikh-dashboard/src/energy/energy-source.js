import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Zap, Flame, Sun, Battery, Activity,
    TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
    Plus, Edit, Trash2, Settings, RefreshCw, Download
} from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

const EnergySource = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedSource, setSelectedSource] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [liveTime, setLiveTime] = useState(new Date());
    const [animatePulse, setAnimatePulse] = useState(true);

    // Live clock
    useEffect(() => {
        const timer = setInterval(() => setLiveTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Energy sources data
    const [sources] = useState([
        {
            id: 1,
            name: 'Main Grid (EDC)',
            type: 'grid',
            icon: Zap,
            color: 'blue',
            status: 'active',
            capacity: 500,
            currentLoad: 342,
            voltage: 380,
            frequency: 50.02,
            powerFactor: 0.92,
            dailyConsumption: 2840,
            monthlyConsumption: 85200,
            cost: 0.16,
            efficiency: 98.5,
            uptime: 99.2,
            location: 'Main Substation',
            contractedPower: '500 kVA',
            trend: 'up',
            trendValue: '+3.2%',
            hourlyData: [210, 245, 280, 312, 342, 320, 295, 310, 342, 330, 315, 342],
        },
        {
            id: 2,
            name: 'Diesel Generator A',
            type: 'diesel',
            icon: Flame,
            color: 'orange',
            status: 'standby',
            capacity: 200,
            currentLoad: 0,
            voltage: 380,
            frequency: 50.0,
            powerFactor: 0.85,
            dailyConsumption: 0,
            monthlyConsumption: 1200,
            cost: 0.45,
            efficiency: 78,
            uptime: 92.5,
            location: 'Generator Room A',
            contractedPower: '200 kVA',
            trend: 'stable',
            trendValue: '0%',
            fuelLevel: 85,
            fuelCapacity: '2000 L',
            hourlyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 3,
            name: 'Diesel Generator B',
            type: 'diesel',
            icon: Flame,
            color: 'red',
            status: 'maintenance',
            capacity: 200,
            currentLoad: 0,
            voltage: 0,
            frequency: 0,
            powerFactor: 0,
            dailyConsumption: 0,
            monthlyConsumption: 1050,
            cost: 0.45,
            efficiency: 0,
            uptime: 85.0,
            location: 'Generator Room B',
            contractedPower: '200 kVA',
            trend: 'down',
            trendValue: '-100%',
            fuelLevel: 62,
            fuelCapacity: '2000 L',
            hourlyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 4,
            name: 'Solar PV System',
            type: 'solar',
            icon: Sun,
            color: 'yellow',
            status: 'active',
            capacity: 120,
            currentLoad: 87,
            voltage: 380,
            frequency: 50.0,
            powerFactor: 1.0,
            dailyConsumption: 520,
            monthlyConsumption: 15600,
            cost: 0.0,
            efficiency: 91,
            uptime: 96.8,
            location: 'Rooftop - Building A & B',
            contractedPower: '120 kWp',
            trend: 'up',
            trendValue: '+8.5%',
            hourlyData: [0, 0, 0, 5, 25, 55, 75, 90, 87, 95, 80, 60],
        },
        {
            id: 5,
            name: 'Battery Storage (ESS)',
            type: 'battery',
            icon: Battery,
            color: 'green',
            status: 'charging',
            capacity: 100,
            currentLoad: -35,
            voltage: 380,
            frequency: 50.0,
            powerFactor: 0.99,
            dailyConsumption: -280,
            monthlyConsumption: -8400,
            cost: 0.0,
            efficiency: 95,
            uptime: 99.8,
            location: 'Energy Storage Room',
            contractedPower: '100 kWh',
            trend: 'up',
            trendValue: 'Charging',
            batteryLevel: 72,
            batteryCapacity: '100 kWh',
            hourlyData: [80, 75, 70, 68, 65, 70, 75, 80, 72, 68, 65, 72],
        },
    ]);

    const handleBack = () => {
        if (onBack) onBack();
        else navigate(-1);
    };

    const totalCapacity = sources.filter(s => s.status === 'active' || s.status === 'charging').reduce((sum, s) => sum + s.capacity, 0);
    const totalLoad = sources.reduce((sum, s) => sum + Math.max(0, s.currentLoad), 0);
    const solarContribution = sources.find(s => s.type === 'solar');
    const solarPercent = solarContribution ? ((solarContribution.currentLoad / totalLoad) * 100).toFixed(1) : 0;

    const statusConfig = {
        active: { label: 'Active', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
        standby: { label: 'Standby', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
        maintenance: { label: 'Maintenance', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
        charging: { label: 'Charging', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
        offline: { label: 'Offline', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
    };

    const colorConfig = {
        blue: { bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', ring: 'ring-blue-200' },
        orange: { bg: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', ring: 'ring-orange-200' },
        red: { bg: 'bg-red-500', light: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', ring: 'ring-red-200' },
        yellow: { bg: 'bg-yellow-500', light: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', ring: 'ring-yellow-200' },
        green: { bg: 'bg-green-500', light: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', ring: 'ring-green-200' },
    };

    // Mini sparkline renderer
    const renderSparkline = (data, color) => {
        const max = Math.max(...data, 1);
        const width = 120;
        const height = 40;
        const padding = 4;
        const graphW = width - padding * 2;
        const graphH = height - padding * 2;
        const points = data.map((v, i) => {
            const x = padding + (i / (data.length - 1)) * graphW;
            const y = padding + graphH - (v / max) * graphH;
            return `${x},${y}`;
        }).join(' ');
        const areaPoints = [
            `${padding},${padding + graphH}`,
            ...data.map((v, i) => `${padding + (i / (data.length - 1)) * graphW},${padding + graphH - (v / max) * graphH}`),
            `${padding + graphW},${padding + graphH}`,
        ].join(' ');

        const strokeColor = color === 'blue' ? '#3b82f6' : color === 'orange' ? '#f97316' : color === 'red' ? '#ef4444' : color === 'yellow' ? '#eab308' : '#22c55e';
        const fillColor = color === 'blue' ? '#bfdbfe' : color === 'orange' ? '#fed7aa' : color === 'red' ? '#fecaca' : color === 'yellow' ? '#fef08a' : '#bbf7d0';

        return (
            <svg width={width} height={height} className="w-full">
                <polygon points={areaPoints} fill={fillColor} opacity="0.5" />
                <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    };

    // Circular gauge
    const CircularGauge = ({ value, max, color, label, unit }) => {
        const radius = 36;
        const circumference = 2 * Math.PI * radius;
        const pct = Math.min(value / max, 1);
        const offset = circumference * (1 - pct);
        const strokeColor = color === 'blue' ? '#3b82f6' : color === 'orange' ? '#f97316' : color === 'yellow' ? '#eab308' : color === 'green' ? '#22c55e' : '#ef4444';

        return (
            <div className="flex flex-col items-center gap-1">
                <div className="relative w-20 h-20">
                    <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
                        <circle cx="44" cy="44" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
                        <circle
                            cx="44" cy="44" r={radius}
                            fill="none" stroke={strokeColor} strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-slate-800">{value}</span>
                        <span className="text-[10px] text-slate-500">{unit}</span>
                    </div>
                </div>
                <span className="text-xs text-slate-600 font-medium">{label}</span>
            </div>
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
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">Energy Source Management</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <div className="text-xs text-slate-500">Live Monitor</div>
                        <div className="text-sm font-mono font-bold text-green-600 flex items-center gap-1">
                            <span className={`w-2 h-2 bg-green-500 rounded-full ${animatePulse ? 'animate-pulse' : ''}`}></span>
                            {liveTime.toLocaleTimeString()}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
                    >
                        <Plus size={16} /> Add Source
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Zap size={20} className="text-blue-600" />
                                </div>
                                <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">Live</span>
                            </div>
                            <div className="text-2xl font-bold text-slate-800">{totalLoad.toFixed(0)} <span className="text-sm font-normal text-slate-500">kW</span></div>
                            <div className="text-xs text-slate-500 mt-1">Total Active Load</div>
                            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${(totalLoad / totalCapacity * 100).toFixed(0)}%` }}></div>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">{(totalLoad / totalCapacity * 100).toFixed(0)}% of {totalCapacity} kW capacity</div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <Sun size={20} className="text-yellow-600" />
                                </div>
                                <span className="text-xs text-yellow-600 font-semibold bg-yellow-50 px-2 py-0.5 rounded-full">Solar</span>
                            </div>
                            <div className="text-2xl font-bold text-slate-800">{solarPercent}%</div>
                            <div className="text-xs text-slate-500 mt-1">Solar Contribution</div>
                            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${solarPercent}%` }}></div>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">87 kW / {totalLoad.toFixed(0)} kW total</div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Activity size={20} className="text-green-600" />
                                </div>
                                <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">Today</span>
                            </div>
                            <div className="text-2xl font-bold text-slate-800">3,360 <span className="text-sm font-normal text-slate-500">kWh</span></div>
                            <div className="text-xs text-slate-500 mt-1">Total Daily Consumption</div>
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingUp size={12} className="text-green-500" />
                                <span className="text-xs text-green-600 font-medium">+2.1% vs yesterday</span>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Settings size={20} className="text-purple-600" />
                                </div>
                                <span className="text-xs text-slate-500 font-semibold bg-slate-50 px-2 py-0.5 rounded-full">{sources.length} Sources</span>
                            </div>
                            <div className="text-2xl font-bold text-slate-800">
                                {sources.filter(s => s.status === 'active' || s.status === 'charging').length}
                                <span className="text-sm font-normal text-slate-500"> / {sources.length}</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">Sources Online</div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-xs text-slate-500">Active</span>
                                <span className="w-2 h-2 bg-yellow-500 rounded-full ml-1"></span>
                                <span className="text-xs text-slate-500">Standby</span>
                                <span className="w-2 h-2 bg-red-500 rounded-full ml-1"></span>
                                <span className="text-xs text-slate-500">Maint.</span>
                            </div>
                        </div>
                    </div>

                    {/* Source Cards Grid */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Energy Sources Overview</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {sources.map((source) => {
                                const cfg = colorConfig[source.color];
                                const sts = statusConfig[source.status] || statusConfig.offline;
                                const Icon = source.icon;
                                const loadPercent = source.capacity > 0 ? Math.abs(source.currentLoad / source.capacity * 100).toFixed(0) : 0;

                                return (
                                    <div
                                        key={source.id}
                                        onClick={() => setSelectedSource(source)}
                                        className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${selectedSource?.id === source.id ? `border-blue-400 ring-2 ring-blue-100` : 'border-slate-200'}`}
                                    >
                                        {/* Card Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 ${cfg.bg} rounded-xl flex items-center justify-center shadow-sm`}>
                                                    <Icon size={24} className="text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-sm leading-tight">{source.name}</h3>
                                                    <p className="text-xs text-slate-500 mt-0.5">{source.location}</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${sts.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${sts.dot} ${source.status === 'active' ? 'animate-pulse' : ''}`}></span>
                                                {sts.label}
                                            </span>
                                        </div>

                                        {/* Load Gauge */}
                                        <div className="mb-4">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <span className="text-xs text-slate-500">Current Load</span>
                                                <span className={`text-sm font-bold ${cfg.text}`}>
                                                    {source.currentLoad < 0 ? `${Math.abs(source.currentLoad)} kW ↓` : `${source.currentLoad} kW`}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${cfg.bg} rounded-full transition-all duration-700`}
                                                    style={{ width: `${loadPercent}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-slate-400">0 kW</span>
                                                <span className="text-xs text-slate-400">{loadPercent}%</span>
                                                <span className="text-xs text-slate-400">{source.capacity} kW</span>
                                            </div>
                                        </div>

                                        {/* Special indicators */}
                                        {source.type === 'diesel' && typeof source.fuelLevel !== 'undefined' && (
                                            <div className="mb-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs text-slate-500">Fuel Level</span>
                                                    <span className={`text-xs font-bold ${source.fuelLevel < 30 ? 'text-red-600' : 'text-orange-600'}`}>{source.fuelLevel}%</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${source.fuelLevel < 30 ? 'bg-red-500' : 'bg-orange-400'}`}
                                                        style={{ width: `${source.fuelLevel}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                        {source.type === 'battery' && typeof source.batteryLevel !== 'undefined' && (
                                            <div className="mb-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs text-slate-500">Battery Level</span>
                                                    <span className="text-xs font-bold text-green-600">{source.batteryLevel}%</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: `${source.batteryLevel}%` }}></div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Sparkline */}
                                        <div className="mb-3">
                                            <div className="text-xs text-slate-400 mb-1">12-hr trend</div>
                                            {renderSparkline(source.hourlyData, source.color)}
                                        </div>

                                        {/* Stats row */}
                                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                                            <div className="text-center">
                                                <div className={`text-sm font-bold ${cfg.text}`}>{source.voltage}V</div>
                                                <div className="text-xs text-slate-400">Voltage</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-sm font-bold ${cfg.text}`}>{source.efficiency > 0 ? `${source.efficiency}%` : '-'}</div>
                                                <div className="text-xs text-slate-400">Efficiency</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-sm font-bold ${cfg.text}`}>{source.uptime}%</div>
                                                <div className="text-xs text-slate-400">Uptime</div>
                                            </div>
                                        </div>

                                        {/* Alerts */}
                                        {source.status === 'maintenance' && (
                                            <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg p-2">
                                                <AlertTriangle size={12} />
                                                Scheduled maintenance in progress
                                            </div>
                                        )}
                                        {source.type === 'diesel' && source.fuelLevel < 30 && (
                                            <div className="mt-3 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 rounded-lg p-2">
                                                <AlertTriangle size={12} />
                                                Low fuel — refill required!
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Detail Panel */}
                    {selectedSource && (() => {
                        const cfg = colorConfig[selectedSource.color];
                        const Icon = selectedSource.icon;
                        return (
                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                                <div className={`${cfg.bg} p-4 flex items-center justify-between`}>
                                    <div className="flex items-center gap-3">
                                        <Icon size={24} className="text-white" />
                                        <h3 className="text-white font-bold text-lg">{selectedSource.name} — Detail View</h3>
                                    </div>
                                    <button onClick={() => setSelectedSource(null)} className="text-white/70 hover:text-white text-xl font-bold">×</button>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <CircularGauge value={Math.abs(selectedSource.currentLoad)} max={selectedSource.capacity} color={selectedSource.color} label="Load (kW)" unit="kW" />
                                        <CircularGauge value={selectedSource.voltage} max={400} color={selectedSource.color} label="Voltage" unit="V" />
                                        <CircularGauge value={selectedSource.frequency} max={52} color={selectedSource.color} label="Frequency" unit="Hz" />
                                        <CircularGauge value={(selectedSource.powerFactor * 100).toFixed(0)} max={100} color={selectedSource.color} label="Power Factor" unit="%" />
                                    </div>
                                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div className="bg-slate-50 rounded-lg p-3">
                                            <div className="text-slate-500 text-xs mb-1">Daily Consumption</div>
                                            <div className="font-bold text-slate-800">{Math.abs(selectedSource.dailyConsumption).toLocaleString()} kWh</div>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-3">
                                            <div className="text-slate-500 text-xs mb-1">Monthly Consumption</div>
                                            <div className="font-bold text-slate-800">{Math.abs(selectedSource.monthlyConsumption).toLocaleString()} kWh</div>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-3">
                                            <div className="text-slate-500 text-xs mb-1">Unit Cost</div>
                                            <div className="font-bold text-slate-800">${selectedSource.cost.toFixed(2)}/kWh</div>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-3">
                                            <div className="text-slate-500 text-xs mb-1">Contracted Power</div>
                                            <div className="font-bold text-slate-800">{selectedSource.contractedPower}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-3">
                                        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                                            <Edit size={14} /> Edit Source
                                        </button>
                                        <button className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
                                            <Download size={14} /> Export Report
                                        </button>
                                        <button className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
                                            <RefreshCw size={14} /> Refresh
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Power Balance Summary */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h2 className="text-base font-bold text-slate-800 mb-4">Power Balance Summary</h2>
                        <div className="space-y-3">
                            {sources.map(s => {
                                const cfg = colorConfig[s.color];
                                const Icon = s.icon;
                                const pct = s.capacity > 0 ? Math.abs(s.currentLoad / s.capacity * 100) : 0;
                                return (
                                    <div key={s.id} className="flex items-center gap-4">
                                        <div className={`w-8 h-8 ${cfg.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                            <Icon size={16} className="text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-slate-700 truncate">{s.name}</span>
                                                <span className={`text-sm font-bold ${cfg.text} flex-shrink-0 ml-2`}>
                                                    {s.currentLoad < 0 ? `${Math.abs(s.currentLoad)} kW ↑` : `${s.currentLoad} kW`}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${cfg.bg} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-400 w-12 text-right flex-shrink-0">{pct.toFixed(0)}%</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnergySource;
