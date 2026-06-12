import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Download, Search, Calendar, BarChart3, Mail } from 'lucide-react';

const Boiler = ({ onBack }) => {
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState('2025-01-23');
    const [toDate, setToDate] = useState('2025-12-23');

    // Sample daily waste data
    const dailyWasteData = [
        { date: '2025-12-20', totalWaste: 125.50, records: 8 },
        { date: '2025-12-19', totalWaste: 98.75, records: 6 },
        { date: '2025-12-18', totalWaste: 142.30, records: 10 },
        { date: '2025-12-17', totalWaste: 87.20, records: 5 },
        { date: '2025-12-16', totalWaste: 156.80, records: 12 },
        { date: '2025-12-15', totalWaste: 103.45, records: 7 },
        { date: '2025-12-14', totalWaste: 119.60, records: 9 }
    ];

    // Sample boiler categories data
    const boilerCategories = [
        { name: 'Steam Boiler', value: 0.45 },
        { name: 'Hot Water Boiler', value: 0.32 },
        { name: 'Waste Heat Boiler', value: 0.18 },
        { name: 'Electric Boiler', value: 0.05 }
    ];

    const totalBoiler = dailyWasteData.reduce((sum, item) => sum + item.totalWaste, 0).toFixed(2);
    const daysTracked = dailyWasteData.length;

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleAddBoiler = () => {
        console.log('Add Boiler');
    };

    const handleExport = () => {
        console.log('Export');
    };

    const handleSearch = () => {
        console.log('Search date range:', fromDate, 'to', toDate);
    };

    const handleClear = () => {
        setFromDate('');
        setToDate('');
    };

    // Render bar chart with sample data
    const renderBarChart = (width = 800, height = 300) => {
        const padding = { top: 20, right: 20, bottom: 50, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // Generate ticks from 0 to 1.0 with 0.1 intervals
        const ticks = [];
        for (let i = 0; i <= 10; i++) {
            ticks.push(i * 0.1);
        }

        const maxValue = Math.max(...boilerCategories.map(c => c.value), 0.5);
        const barWidth = chartWidth / boilerCategories.length - 10;

        return (
            <svg width={width} height={height} className="w-full h-full">
                {/* Grid lines */}
                {ticks.map((value) => {
                    const x = padding.left + (value / 1.0) * chartWidth;
                    return (
                        <line
                            key={value}
                            x1={x}
                            y1={padding.top}
                            x2={x}
                            y2={height - padding.bottom}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                            strokeDasharray="2,2"
                        />
                    );
                })}
                
                {/* X-axis */}
                <line
                    x1={padding.left}
                    y1={padding.top + chartHeight}
                    x2={width - padding.right}
                    y2={padding.top + chartHeight}
                    stroke="#e5e7eb"
                    strokeWidth="2"
                />
                
                {/* X-axis labels */}
                {ticks.map((value) => {
                    const x = padding.left + (value / 1.0) * chartWidth;
                    return (
                        <text
                            key={value}
                            x={x}
                            y={height - padding.bottom + 20}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#6b7280"
                        >
                            {value.toFixed(1)}
                        </text>
                    );
                })}
                
                {/* X-axis title */}
                <text
                    x={width / 2}
                    y={height - 5}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#6b7280"
                    fontWeight="600"
                >
                    Quantity (kg)
                </text>

                {/* Bar chart bars */}
                {boilerCategories.map((category, index) => {
                    const barHeight = (category.value / maxValue) * chartHeight;
                    const x = padding.left + index * (chartWidth / boilerCategories.length) + 5;
                    const y = padding.top + chartHeight - barHeight;
                    return (
                        <g key={index}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill={index === 0 ? '#3b82f6' : index === 1 ? '#8b5cf6' : index === 2 ? '#ec4899' : '#f59e0b'}
                                rx={4}
                            />
                            <text
                                x={x + barWidth / 2}
                                y={y - 5}
                                textAnchor="middle"
                                fontSize="11"
                                fill="#374151"
                                fontWeight="600"
                            >
                                {(category.value * 100).toFixed(0)}%
                            </text>
                            <text
                                x={x + barWidth / 2}
                                y={padding.top + chartHeight + 20}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#6b7280"
                            >
                                {category.name}
                            </text>
                        </g>
                    );
                })}
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
                            <ArrowLeft size={16} /> Back
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-slate-300 hover:border-slate-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
                            title="Home"
                        >
                            <img 
                                src="/logo.jpg" 
                                alt="Home" 
                                className="w-full h-full object-cover"
                            />
                        </button>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">Boiler Product Analytics</h1>
                </div>
                <div className="w-32"></div> {/* Right spacer */}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="w-full h-full">
                    {/* White Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Control Bar */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            {/* Date Range Selector */}
                            <span className="text-slate-700 font-semibold">From</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                            </div>
                            <span className="text-slate-700 font-semibold">To</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                            </div>
                            
                            {/* Action Buttons */}
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <Search size={16} />
                                Search
                            </button>
                            <button
                                onClick={handleClear}
                                className="px-4 py-2 bg-white text-slate-700 border-2 border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2 ml-auto"
                            >
                                <Download size={16} />
                                Export
                            </button>
                            <button
                                onClick={handleAddBoiler}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Add Boiler
                            </button>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white flex items-center justify-between">
                                <div>
                                    <div className="text-sm opacity-90 mb-1">Total Boiler</div>
                                    <div className="text-3xl font-bold">{totalBoiler}</div>
                                    <div className="text-sm opacity-90 mt-1">kilograms</div>
                                </div>
                                <BarChart3 size={48} className="opacity-80" />
                            </div>
                            <div className="bg-purple-600 rounded-lg p-6 text-white flex items-center justify-between">
                                <div>
                                    <div className="text-sm opacity-90 mb-1">Days Tracked</div>
                                    <div className="text-3xl font-bold">{daysTracked}</div>
                                    <div className="text-sm opacity-90 mt-1">period</div>
                                </div>
                                <Mail size={48} className="opacity-80" />
                            </div>
                        </div>

                        {/* Daily Waste Data Section */}
                        <div className="bg-white border border-slate-300 rounded-lg p-6 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <h3 className="text-lg font-bold text-slate-800">Daily Waste Data</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-100 border-b border-slate-300">
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">DATE</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">TOTAL WASTE (KG)</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">RECORDS</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dailyWasteData.map((item, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                <td className="px-4 py-3 text-sm text-slate-800">{item.date}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-slate-800">{item.totalWaste.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{item.records}</td>
                                                <td className="px-4 py-3">
                                                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* All Boiler Categories Section */}
                        <div className="bg-white border border-slate-300 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                                <h3 className="text-lg font-bold text-slate-800">All Boiler Categories</h3>
                            </div>
                            <div className="h-80">
                                {renderBarChart()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Boiler;

