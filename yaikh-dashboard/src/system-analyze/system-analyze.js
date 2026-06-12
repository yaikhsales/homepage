import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Download, RotateCcw, BarChart3, Users, FileText, Eye } from 'lucide-react';
import { useTranslation } from '../translate/TranslationContext';

const SystemAnalyze = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState('2025-12-01');
    const [endDate, setEndDate] = useState('2025-12-23');
    const [selectedFilter, setSelectedFilter] = useState('');

    const moduleData = [
        { name: t('gatePass'), requests: 1005, users: 327, details: 3 },
        { name: t('shopManagement'), requests: 5870, users: 900, details: 3 },
        { name: t('ticketManagement'), requests: 241, users: 96, details: 3 },
        { name: t('purchaseRequest'), requests: 0, users: 0, details: 0 },
        { name: t('myCarBooking'), requests: 99, users: 12, details: 0 },
        { name: t('meetingRoom'), requests: 82, users: 20, details: 0 }
    ];

    const totalRequests = moduleData.reduce((sum, mod) => sum + mod.requests, 0);
    const totalUsers = moduleData.reduce((sum, mod) => sum + mod.users, 0);

    // User Distribution data (percentages)
    const userDistributionData = [
        { name: t('shopManagement'), value: 38.2, color: '#3b82f6' },
        { name: t('gatePass'), value: 37.6, color: '#10b981' },
        { name: t('ticketManagement'), value: 10.2, color: '#f59e0b' },
        { name: t('purchaseRequest'), value: 8.4, color: '#ef4444' },
        { name: t('myCarBooking'), value: 3.4, color: '#06b6d4' },
        { name: t('meetingRoom'), value: 2.2, color: '#8b5cf6' }
    ];

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const handleApplyFilter = () => {
        console.log('Apply filter:', { startDate, endDate, selectedFilter });
    };

    const handleReset = () => {
        setStartDate('2025-12-01');
        setEndDate('2025-12-23');
        setSelectedFilter('');
    };

    const handleExport = () => {
        console.log('Export report');
    };

    const handleQuickFilter = (filter) => {
        setSelectedFilter(filter);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        switch (filter) {
            case 'today':
                setStartDate(today.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
                break;
            case 'yesterday':
                setStartDate(yesterday.toISOString().split('T')[0]);
                setEndDate(yesterday.toISOString().split('T')[0]);
                break;
            case 'last7days':
                setStartDate(last7Days.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
                break;
            case 'last30days':
                setStartDate(last30Days.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
                break;
            case 'thismonth':
                setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
                break;
            case 'lastmonth':
                setStartDate(firstDayOfLastMonth.toISOString().split('T')[0]);
                setEndDate(lastDayOfLastMonth.toISOString().split('T')[0]);
                break;
            default:
                break;
        }
    };

    // Render Module Requests Bar Chart
    const renderModuleRequestsChart = () => {
        const width = 600;
        const height = 300;
        const padding = { top: 20, right: 20, bottom: 50, left: 60 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        const maxValue = 3000;
        const barWidth = chartWidth / moduleData.length - 10;

        return (
            <svg width={width} height={height} className="w-full h-full">
                {/* Grid lines */}
                {[0, 500, 1000, 1500, 2000, 2500, 3000].map((value) => {
                    const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
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
                {[0, 500, 1000, 1500, 2000, 2500, 3000].map((value) => {
                    const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
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
                
                {/* Bars */}
                {moduleData.map((item, index) => {
                    const barHeight = (item.requests / maxValue) * chartHeight;
                    const x = padding.left + index * (barWidth + 10);
                    const y = padding.top + chartHeight - barHeight;
                    
                    return (
                        <g key={index}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill="#3b82f6"
                                rx="4"
                            />
                            <text
                                x={x + barWidth / 2}
                                y={height - padding.bottom + 20}
                                textAnchor="middle"
                                fontSize="10"
                                fill="#6b7280"
                                transform={`rotate(-45 ${x + barWidth / 2} ${height - padding.bottom + 20})`}
                            >
                                {item.name}
                            </text>
                        </g>
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
                    transform={`rotate(-90 15 ${height / 2})`}
                >
                    Requests
                </text>
            </svg>
        );
    };

    // Render User Distribution Donut Chart
    const renderDonutChart = () => {
        const size = 250;
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - 30;
        const innerRadius = radius * 0.5;

        let currentAngle = -90;
        const total = userDistributionData.reduce((sum, item) => sum + item.value, 0);

        const paths = userDistributionData.map((item, index) => {
            const angle = (item.value / 100) * 360;
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
                <text
                    x={centerX}
                    y={centerY - 10}
                    textAnchor="middle"
                    fontSize="24"
                    fontWeight="bold"
                    fill="#1f2937"
                >
                    {totalUsers}
                </text>
                <text
                    x={centerX}
                    y={centerY + 15}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                >
                    {t('totalUsers')}
                </text>
            </svg>
        );
    };

    // Render System Overview Combined Chart
    const renderSystemOverviewChart = () => {
        const width = 600;
        const height = 300;
        const padding = { top: 20, right: 60, bottom: 50, left: 60 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        const maxRequests = 6000;
        const maxUsers = 1200;
        const barWidth = chartWidth / moduleData.length - 10;

        return (
            <svg width={width} height={height} className="w-full h-full">
                {/* Grid lines for requests */}
                {[0, 1000, 2000, 3000, 4000, 5000, 6000].map((value) => {
                    const y = padding.top + chartHeight - (value / maxRequests) * chartHeight;
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
                
                {/* Left Y-axis labels (Requests) */}
                {[0, 1000, 2000, 3000, 4000, 5000, 6000].map((value) => {
                    const y = padding.top + chartHeight - (value / maxRequests) * chartHeight;
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
                
                {/* Right Y-axis labels (Users) */}
                {[0, 200, 400, 600, 800, 1000, 1200].map((value) => {
                    const y = padding.top + chartHeight - (value / maxUsers) * chartHeight;
                    return (
                        <text
                            key={value}
                            x={width - padding.right + 10}
                            y={y + 4}
                            textAnchor="start"
                            fontSize="10"
                            fill="#10b981"
                        >
                            {value}
                        </text>
                    );
                })}
                
                {/* Bars (Requests) */}
                {moduleData.map((item, index) => {
                    const barHeight = (item.requests / maxRequests) * chartHeight;
                    const x = padding.left + index * (barWidth + 10);
                    const y = padding.top + chartHeight - barHeight;
                    
                    return (
                        <rect
                            key={`bar-${index}`}
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            fill="#3b82f6"
                            rx="4"
                        />
                    );
                })}
                
                {/* Line (Users) */}
                <polyline
                    points={moduleData.map((item, index) => {
                        const x = padding.left + index * (barWidth + 10) + barWidth / 2;
                        const y = padding.top + chartHeight - (item.users / maxUsers) * chartHeight;
                        return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                
                {/* Line points */}
                {moduleData.map((item, index) => {
                    const x = padding.left + index * (barWidth + 10) + barWidth / 2;
                    const y = padding.top + chartHeight - (item.users / maxUsers) * chartHeight;
                    return (
                        <circle
                            key={`point-${index}`}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#10b981"
                        />
                    );
                })}
                
                {/* X-axis labels */}
                {moduleData.map((item, index) => {
                    const x = padding.left + index * (barWidth + 10) + barWidth / 2;
                    return (
                        <text
                            key={index}
                            x={x}
                            y={height - padding.bottom + 20}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#6b7280"
                            transform={`rotate(-45 ${x} ${height - padding.bottom + 20})`}
                        >
                            {item.name}
                        </text>
                    );
                })}
                
                {/* Y-axis titles */}
                <text
                    x={15}
                    y={height / 2}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#6b7280"
                    fontWeight="600"
                    transform={`rotate(-90 15 ${height / 2})`}
                >
                    {t('totalRequests')}
                </text>
                <text
                    x={width - 15}
                    y={height / 2}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#10b981"
                    fontWeight="600"
                    transform={`rotate(90 ${width - 15} ${height / 2})`}
                >
                    {t('uniqueUsers')}
                </text>
            </svg>
        );
    };

    return (
        <div className="fixed inset-0 bg-slate-100 flex flex-col animate-in fade-in duration-500 z-[200]">
            {/* Header */}
            <div className="bg-white p-6 border-b flex items-center justify-between flex-shrink-0 shadow-sm relative z-[201]">
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
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-800">{t('systemAnalyticsDashboard')}</h1>
                        <p className="text-slate-600 text-sm">{t('realtimeInsightsAndPerformanceMetrics')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <BarChart3 className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-600">{t('totalSystemRequests')}</div>
                            <div className="text-lg font-bold text-slate-800">{totalRequests.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Users className="text-green-600" size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-600">{t('uniqueActiveUsers')}</div>
                            <div className="text-lg font-bold text-slate-800">1,273</div>
                        </div>
                    </div>
                    <div className="text-sm text-slate-600">
                        <div className="font-semibold">{t('activePeriod')}</div>
                        <div>2025-10-01 - 2025-12-23</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Filter Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="text-slate-600" size={18} />
                                <span className="text-sm text-slate-700 font-semibold">{t('startDate')}</span>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="text-slate-600" size={18} />
                                <span className="text-sm text-slate-700 font-semibold">{t('endDate')}</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {[t('today'), t('yesterday'), t('last7Days'), t('last30Days'), t('thisMonth'), t('lastMonth')].map((filter) => {
                                    const filterKey = filter.toLowerCase().replace(/\s+/g, '');
                                    return (
                                        <button
                                            key={filter}
                                            onClick={() => handleQuickFilter(filterKey)}
                                            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                                                selectedFilter === filterKey
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                        >
                                            {filter}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex gap-2 ml-auto">
                                <button
                                    onClick={handleApplyFilter}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    {t('applyFilter')}
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors flex items-center gap-2"
                                >
                                    <RotateCcw size={16} />
                                    {t('reset')}
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <Download size={16} />
                                    {t('exportReport')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">{t('realtimeAnalyticsDashboard')}</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Module Requests Chart */}
                            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">{t('moduleRequests')}</h3>
                                <div className="h-64">
                                    {renderModuleRequestsChart()}
                                </div>
                            </div>

                            {/* User Distribution Chart */}
                            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">{t('userDistribution')}</h3>
                                <div className="h-64 flex items-center justify-center">
                                    {renderDonutChart()}
                                </div>
                                <div className="mt-4 space-y-2">
                                    {userDistributionData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-slate-700">{item.name}</span>
                                            </div>
                                            <span className="font-semibold text-slate-800">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* System Overview Chart */}
                            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">{t('systemOverview')}</h3>
                                <div className="h-64">
                                    {renderSystemOverviewChart()}
                                </div>
                                <div className="mt-4 flex items-center gap-4 justify-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-blue-600 rounded"></div>
                                        <span className="text-sm text-slate-700">{t('totalRequests')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-slate-700">{t('uniqueUsers')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('module')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('totalRequests')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('uniqueUsers')}</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">{t('details')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {moduleData.map((item, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50 hover:bg-blue-50'}>
                                            <td className="px-4 py-3 text-sm font-semibold text-slate-800">{item.name}</td>
                                            <td className="px-4 py-3 text-sm text-slate-700">{item.requests.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-sm text-slate-700">{item.users.toLocaleString()}</td>
                                            <td className="px-4 py-3">
                                                <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1">
                                                    <Eye size={14} />
                                                    {item.details}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-blue-50 border-t-2 border-blue-200">
                                        <td className="px-4 py-3 text-sm font-bold text-slate-800">{t('total')}</td>
                                        <td className="px-4 py-3 text-sm font-bold text-slate-800">{totalRequests.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm font-bold text-slate-800">1,373</td>
                                        <td className="px-4 py-3"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemAnalyze;

