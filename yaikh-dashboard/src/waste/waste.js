import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Download, FileText, Calendar, BarChart3, Mail } from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

const Waste = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [fromDate, setFromDate] = useState('2020-11-21');
    const [toDate, setToDate] = useState('2020-11-21');

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleAddWaste = () => {
        console.log('Add Waste');
    };

    const handleUseWaste = () => {
        console.log('Use Waste');
    };

    const handleExport = () => {
        console.log('Export');
    };

    const handleExportPDF = () => {
        console.log('Export as PDF');
    };

    const handleApply = () => {
        console.log('Apply date range:', fromDate, 'to', toDate);
    };

    const handleClear = () => {
        setFromDate('');
        setToDate('');
    };

    // Donut chart data
    const donutData = [
        { name: t('directProductionWaste'), value: 1084, color: '#3b82f6' },
        { name: t('generalWaste'), value: 70, color: '#ec4899' }
    ];

    const totalWaste = donutData.reduce((sum, item) => sum + item.value, 0);

    // Horizontal bar chart data
    const barChartData = [
        { name: t('directProductionWasteCutting'), value: 950, color: '#3b82f6' },
        { name: t('directProductionWasteSewing'), value: 120, color: '#ec4899' },
        { name: t('generalWasteOrganicWaste'), value: 70, color: '#eab308' },
        { name: t('generalWasteConfused'), value: 25, color: '#14b8a6' }
    ];

    const maxBarValue = Math.max(...barChartData.map(d => d.value));

    // Render donut chart
    const renderDonutChart = (data, size = 200) => {
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - 20;
        const innerRadius = radius * 0.6;

        let currentAngle = -90; // Start from top
        const total = data.reduce((sum, item) => sum + item.value, 0);

        const paths = data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (item.value / total) * 360;
            
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            currentAngle = endAngle;

            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;

            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);

            const x3 = centerX + innerRadius * Math.cos(endAngleRad);
            const y3 = centerY + innerRadius * Math.sin(endAngleRad);
            const x4 = centerX + innerRadius * Math.cos(startAngleRad);
            const y4 = centerY + innerRadius * Math.sin(startAngleRad);

            const largeArc = angle > 180 ? 1 : 0;

            const outerPath = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
            const innerPath = `M ${centerX} ${centerY} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x3} ${y3} Z`;
            const fullPath = `${outerPath} ${innerPath}`;

            return (
                <path
                    key={index}
                    d={fullPath}
                    fill={item.color}
                    stroke="white"
                    strokeWidth="2"
                />
            );
        });

        return (
            <svg width={size} height={size} className="mx-auto">
                {paths}
            </svg>
        );
    };

    // Render horizontal bar chart
    const renderBarChart = (data, width = 600, height = 200) => {
        const padding = { top: 20, right: 20, bottom: 40, left: 150 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        const barHeight = chartHeight / data.length - 10;
        const maxValue = Math.max(...data.map(d => d.value));

        return (
            <svg width={width} height={height} className="w-full h-full">
                {/* Bars */}
                {data.map((item, index) => {
                    const barWidth = (item.value / maxValue) * chartWidth;
                    const y = padding.top + index * (barHeight + 10);
                    
                    return (
                        <g key={index}>
                            <rect
                                x={padding.left}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill={item.color}
                                rx="4"
                            />
                            <text
                                x={padding.left - 10}
                                y={y + barHeight / 2 + 4}
                                textAnchor="end"
                                fontSize="11"
                                fill="#6b7280"
                            >
                                {item.name}
                            </text>
                            <text
                                x={padding.left + barWidth + 5}
                                y={y + barHeight / 2 + 4}
                                fontSize="11"
                                fill="#1f2937"
                                fontWeight="600"
                            >
                                {item.value} kg
                            </text>
                        </g>
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
                {[0, 200, 400, 600, 800, 1000].map((value) => {
                    const x = padding.left + (value / maxValue) * chartWidth;
                    return (
                        <g key={value}>
                            <line
                                x1={x}
                                y1={padding.top + chartHeight}
                                x2={x}
                                y2={padding.top + chartHeight + 5}
                                stroke="#6b7280"
                                strokeWidth="1"
                            />
                            <text
                                x={x}
                                y={padding.top + chartHeight + 20}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#6b7280"
                            >
                                {value}
                            </text>
                        </g>
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
                    {t('quantityKg')}
                </text>
            </svg>
        );
    };

    // Render line chart (empty)
    const renderLineChart = (width = 600, height = 200) => {
        const padding = { top: 20, right: 20, bottom: 40, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        return (
            <svg width={width} height={height} className="w-full h-full">
                {/* Grid lines */}
                {[0, 200, 400, 600, 800, 1000, 1200].map((value) => {
                    const y = padding.top + chartHeight - (value / 1200) * chartHeight;
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
                {[0, 200, 400, 600, 800, 1000, 1200].map((value) => {
                    const y = padding.top + chartHeight - (value / 1200) * chartHeight;
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
                
                {/* Y-axis title */}
                <text
                    x={15}
                    y={height / 2}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#6b7280"
                    fontWeight="600"
                    transform={`rotate(-90, 15, ${height / 2})`}
                >
                    {t('wasteKg')}
                </text>
                
                {/* X-axis */}
                <line
                    x1={padding.left}
                    y1={padding.top + chartHeight}
                    x2={width - padding.right}
                    y2={padding.top + chartHeight}
                    stroke="#e5e7eb"
                    strokeWidth="2"
                />
                
                {/* X-axis title */}
                <text
                    x={width / 2}
                    y={height - 5}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#6b7280"
                    fontWeight="600"
                >
                    {t('date')}
                </text>
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
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">{t('wasteProductAnalytics')}</h1>
                </div>
                <div className="w-32"></div> {/* Right spacer */}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="w-full h-full">
                    {/* White Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Action Buttons */}
                        <div className="flex justify-end items-center gap-3 mb-4">
                            <button
                                onClick={handleAddWaste}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={16} />
                                {t('addWaste')}
                            </button>
                            <button
                                onClick={handleUseWaste}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={16} />
                                {t('useWaste')}
                            </button>
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors flex items-center gap-2"
                            >
                                <Download size={16} />
                                {t('export')}
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <FileText size={16} />
                                {t('exportAsPDF')}
                            </button>
                        </div>

                        {/* Date Range Selector */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-slate-700 font-semibold">{t('from')}</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                            </div>
                            <span className="text-slate-700 font-semibold">{t('to')}</span>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                            </div>
                            <button
                                onClick={handleApply}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                {t('apply')}
                            </button>
                            <button
                                onClick={handleClear}
                                className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-400 transition-colors"
                            >
                                {t('clear')}
                            </button>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-blue-600 rounded-lg p-6 text-white flex items-center justify-between">
                                <div>
                                    <div className="text-sm opacity-90 mb-1">Total Waste</div>
                                    <div className="text-3xl font-bold">1,154.00 kg</div>
                                </div>
                                <BarChart3 size={48} className="opacity-80" />
                            </div>
                            <div className="bg-purple-600 rounded-lg p-6 text-white flex items-center justify-between">
                                <div>
                                    <div className="text-sm opacity-90 mb-1">Days Tracked</div>
                                    <div className="text-3xl font-bold">1 day tracked</div>
                                </div>
                                <Mail size={48} className="opacity-80" />
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Waste by Main Category - Donut Chart */}
                            <div className="bg-white border border-slate-300 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Waste by Main Category</h3>
                                <div className="flex items-center justify-center mb-4">
                                    {renderDonutChart(donutData)}
                                </div>
                                <div className="space-y-2">
                                    {donutData.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-sm text-slate-700">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Daily Waste Trend - Line Chart */}
                            <div className="bg-white border border-slate-300 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Daily Waste Trend</h3>
                                <p className="text-xs text-slate-500 mb-4">Showing data from 11/21/2020 to 11/21/2020</p>
                                <div className="h-48">
                                    {renderLineChart()}
                                </div>
                            </div>
                        </div>

                        {/* All Waste Categories - Horizontal Bar Chart */}
                        <div className="bg-white border border-slate-300 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">All Waste Categories</h3>
                            <p className="text-xs text-slate-500 mb-4">Showing data from 11/21/2020 to 11/21/2020</p>
                            <div className="h-64">
                                {renderBarChart(barChartData)}
                            </div>
                        </div>

                        {/* Detailed Category Breakdown */}
                        <div className="bg-white border border-slate-300 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800">Detailed Category Breakdown</h3>
                                <p className="text-xs text-slate-500">From 11/21/2020 to 11/21/2020</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Direct Production Waste */}
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 mb-2">Direct Production Waste</h4>
                                    <div className="text-sm text-slate-600 mb-3">2 main categories</div>
                                    <div className="text-sm text-slate-600 mb-4">4 sub categories</div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-600">Total Waste (kg):</span>
                                            <span className="text-sm font-bold text-slate-800">1,084.00 kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-600">Direct Production Waste (kg):</span>
                                            <span className="text-sm font-bold text-slate-800">1,084.00 kg</span>
                                        </div>
                                    </div>
                                </div>

                                {/* General Waste */}
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                    <h4 className="font-bold text-slate-800 mb-2">General Waste</h4>
                                    <div className="text-sm text-slate-600 mb-3">2 main categories</div>
                                    <div className="text-sm text-slate-600 mb-4">2 sub categories</div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-600">Total Waste (kg):</span>
                                            <span className="text-sm font-bold text-slate-800">70.00 kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-600">General Waste (kg):</span>
                                            <span className="text-sm font-bold text-slate-800">70.00 kg</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Card */}
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <h4 className="font-bold text-slate-800 mb-4">Summary</h4>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600">Total Waste (kg):</span>
                                        <span className="text-lg font-bold text-blue-600">1,154.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Waste;

