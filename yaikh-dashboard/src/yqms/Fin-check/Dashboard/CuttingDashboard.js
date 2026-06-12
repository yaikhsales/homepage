import React, { useState, useEffect } from "react";
import {
    ArrowLeft, Search, Filter, Calendar, BarChart3,
    PieChart, Clock, CheckCircle2, AlertCircle, XCircle,
    Download, LayoutGrid, List, ChevronDown, User,
    Building2, Hammer, Tag, Shirt, ClipboardList,
    Maximize2, MoreHorizontal, TrendingUp, Scissors,
    CheckCircle, AlertTriangle, Info, RefreshCw,
    FileText, Settings, Users, Percent, Trash2, Box, Package,
    ChevronLeft, Eye, MoreVertical, ThumbsUp, ThumbsDown, Zap, Bug,
    ClipboardCheck
} from "lucide-react";

/**
 * QCRovingDashboard - High-fidelity reproduction of the "Cutting Inspection Dashboard"
 * Matches the user-provided screenshots layout and color scheme.
 */
const QCRovingDashboard = ({ onBack }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("Overview");
    const [viewMode, setViewMode] = useState('Dashboard'); // 'Dashboard' or 'Report'
    const [selectedReport, setSelectedReport] = useState(null); // Report data for detail view

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const navTabs = [
        { label: "Overview", icon: LayoutGrid },
        { label: "Measurement Failure - By Style & IE Table", icon: List },
        { label: "Measurement Failure - By Style & Spread Table", icon: List },
        { label: "Measurement Failure by Spread Table", icon: Search },
        { label: "Fabric Defect Analysis", icon: Info },
        { label: "Cutting Defect Analysis", icon: Scissors },
        { label: "Overall Trend Analysis", icon: TrendingUp },
    ];

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans select-none overflow-x-hidden p-6 gap-6">

            {/* --- HEADER --- */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 bg-[#DCE8FF] text-[#3B82F6] rounded-lg font-bold w-fit hover:bg-blue-200 transition-colors"
                >
                    <ArrowLeft size={18} strokeWidth={3} />
                    Cutting Home
                </button>
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-700">Cutting Inspection Dashboard - Version 1.0</h1>
                    <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setViewMode("Dashboard")}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "Dashboard" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-500 hover:bg-slate-50"}`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setViewMode("Report")}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === "Report" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-500 hover:bg-slate-50"}`}
                        >
                            Detailed Report
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === "Dashboard" && (
                <>

                    {/* --- NAVIGATION TABS --- */}
                    <div className="flex flex-wrap gap-3">
                        {navTabs.map((tab) => {
                            const isActive = activeTab === tab.label;
                            return (
                                <button
                                    key={tab.label}
                                    onClick={() => setActiveTab(tab.label)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all w-28 sm:w-32 h-32 gap-3 shadow-sm
                                ${isActive
                                            ? "bg-[#3B82F6] text-white border-blue-500 shadow-blue-200"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-blue-400"}`}
                                >
                                    <tab.icon size={24} strokeWidth={isActive ? 3 : 2} className={isActive ? "text-white" : "text-blue-600"} />
                                    <span className={`text-xs font-bold text-center`}>
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* --- FILTER BAR --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-wrap items-end gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500">Start Date</label>
                            <input type="date" defaultValue="2026-02-28" className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500">End Date</label>
                            <input type="date" defaultValue="2026-03-06" className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div className="flex flex-col gap-2 flex-grow min-w-[150px]">
                            <label className="text-xs font-bold text-slate-500">Buyer</label>
                            <div className="relative group">
                                <select className="appearance-none w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>All Buyers</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 flex-grow min-w-[150px]">
                            <label className="text-xs font-bold text-slate-500">MO No</label>
                            <div className="relative group">
                                <select className="appearance-none w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>All MOs</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 flex-grow min-w-[150px]">
                            <label className="text-xs font-bold text-slate-500">Table No</label>
                            <div className="relative group">
                                <select className="appearance-none w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>All Tables</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 flex-grow min-w-[150px]">
                            <label className="text-xs font-bold text-slate-500">Garment Type</label>
                            <div className="relative group">
                                <select className="appearance-none w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>All Types</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 flex-grow min-w-[150px]">
                            <label className="text-xs font-bold text-slate-500">Emp ID</label>
                            <div className="relative group">
                                <select className="appearance-none w-full bg-[#F8FAFC] border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-700 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>All Inspectors</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div className="flex gap-3 h-[42px]">
                            <button className="bg-[#2563EB] text-white px-6 rounded-lg hover:bg-blue-700 transition-colors">
                                <CheckCircle size={20} />
                            </button>
                            <button className="bg-[#5D6679] text-white px-6 rounded-lg hover:bg-slate-600 transition-colors">
                                <RefreshCw size={20} />
                            </button>
                        </div>
                    </div>

                    {/* --- DATA CARDS SECTIONS --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Bundle Data */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
                            <h2 className="text-lg font-black text-slate-700">Bundle Data</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Total Inspected Reports", val: "168", icon: FileText, color: "blue" },
                                    { label: "Total Bundle Qty", val: "9,969", icon: Box, color: "blue" },
                                    { label: "Bundle Qty Check", val: "1,698", icon: ClipboardList, color: "blue" },
                                    { label: "Total Inspected Sizes", val: "12", icon: LayoutGrid, color: "blue" },
                                ].map((item, i) => (
                                    <div key={i} className="bg-[#F8FAFC] p-4 rounded-xl flex items-center gap-4 border border-slate-200">
                                        <div className="w-10 h-10 bg-[#DCE8FF] text-[#3B82F6] rounded-xl flex items-center justify-center shrink-0">
                                            <item.icon size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</span>
                                            <span className="text-xl font-black text-slate-700 leading-none">{item.val}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inspection Data */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
                            <h2 className="text-lg font-black text-slate-700">Inspection Data</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Total Inspection Qty", val: "25,470", icon: Search, color: "blue" },
                                    { label: "Total PCS", val: "25,425", icon: LayoutGrid, color: "blue" },
                                    { label: "Total Pass", val: "25,240", icon: CheckCircle2, color: "emerald" },
                                    { label: "AQL Results", val: "N/A", icon: User, color: "blue" },
                                ].map((item, i) => (
                                    <div key={i} className="bg-[#F8FAFC] p-4 rounded-xl flex items-center gap-4 border border-slate-200">
                                        <div className={`w-10 h-10 ${item.label === "Total Pass" ? "bg-[#DCFCE7] text-[#10B981]" : "bg-[#DCE8FF] text-[#3B82F6]"} rounded-xl flex items-center justify-center shrink-0`}>
                                            <item.icon size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</span>
                                            <span className="text-xl font-black text-slate-700 leading-none">{item.val}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Results Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
                            <h2 className="text-lg font-black text-slate-700">Results Section</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Total Reject", val: "185", icon: Trash2, color: "rose" },
                                    { label: "Reject Measurement", val: "92", icon: Hammer, color: "rose" },
                                    { label: "Reject Defects", val: "93", icon: Scissors, color: "rose" },
                                    { label: "Pass Rate", val: "99.27 %", icon: Percent, color: "emerald" },
                                ].map((item, i) => {
                                    const isPositive = item.label === "Pass Rate";
                                    return (
                                        <div key={i} className={`p-4 rounded-xl flex items-center gap-4 border ${isPositive ? "bg-[#F0FDF4] border-[#DCFCE7]" : "bg-[#FEF2F2] border-[#FEE2E2]"}`}>
                                            <div className={`w-10 h-10 ${isPositive ? "bg-[#DCFCE7] text-[#10B981]" : "bg-[#FEE2E2] text-[#EF4444]"} rounded-xl flex items-center justify-center shrink-0`}>
                                                <item.icon size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</span>
                                                <span className={`text-xl font-black ${isPositive ? "text-slate-800" : "text-slate-800"} leading-none`}>{item.val}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* --- CHARTS SECTION 1 --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Pass Rate by MO No */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black text-slate-700">Pass Rate by MO No</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex bg-slate-100 rounded-lg p-0.5">
                                        <button className="bg-blue-600 text-white px-3 py-1 text-[10px] font-bold rounded-md flex items-center gap-1">
                                            <TrendingUp size={12} /> Top
                                        </button>
                                        <button className="text-slate-500 px-3 py-1 text-[10px] font-bold rounded-md flex items-center gap-1">
                                            <TrendingUp className="rotate-180" size={12} /> Bottom
                                        </button>
                                    </div>
                                    <select className="bg-slate-50 text-[10px] font-bold rounded-lg px-2 py-1 focus:outline-none">
                                        <option>5</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-8">
                                <div className="flex flex-col gap-3">
                                    <span className="text-[10px] font-black text-slate-600 uppercase">Legend</span>
                                    {[
                                        { color: "bg-[#10B981]", text: ">= 98% (Excellent)" },
                                        { color: "bg-[#F59E0B]", text: "95% - 97.99% (Good)" },
                                        { color: "bg-[#F97316]", text: "90% - 94.99% (Warning)" },
                                        { color: "bg-[#EF4444]", text: "< 90% (Alert)" }
                                    ].map((l, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded ${l.color}`}></div>
                                            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{l.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex-1 flex flex-col gap-6 font-bold text-xs">
                                    {["GPAR12396", "GPAR12387", "GPAR12403", "GPAR12399", "GPAR12404"].map((mo) => (
                                        <div key={mo} className="flex items-center gap-4">
                                            <span className="w-16 text-slate-700 text-right">{mo}</span>
                                            <div className="flex-1 h-8 bg-slate-100 rounded flex justify-end">
                                                <div className="h-full bg-[#10B981] rounded-r w-full"></div>
                                            </div>
                                            <span className="text-slate-700 font-bold">100.00%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pass Rate by Garment Type */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
                            <h3 className="text-lg font-black text-slate-700">Pass Rate by Garment Type</h3>
                            <div className="flex gap-8">
                                <div className="flex flex-col gap-3">
                                    <span className="text-[10px] font-black text-slate-600 uppercase">Legend</span>
                                    {[
                                        { color: "bg-[#10B981]", text: ">= 98%" },
                                        { color: "bg-[#F59E0B]", text: "95% - 98%" },
                                        { color: "bg-[#F97316]", text: "90% - 95%" },
                                        { color: "bg-[#EF4444]", text: "< 90%" }
                                    ].map((l, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded ${l.color}`}></div>
                                            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{l.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex-1 flex flex-col gap-10 font-bold text-xs mt-4">
                                    {[
                                        { label: "Zipper Jacket", val: "99.47%" },
                                        { label: "Top", val: "99.25%" },
                                        { label: "Bottom", val: "99.22%" }
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-4">
                                            <span className="w-20 text-slate-700 text-right">{item.label}</span>
                                            <div className="flex-1 h-8 bg-slate-100 rounded">
                                                <div className="h-full bg-[#10B981] rounded w-full"></div>
                                            </div>
                                            <span className="text-slate-700 font-bold">{item.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pass Rate by Date */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
                            <h3 className="text-lg font-black text-slate-700">Pass Rate by Date</h3>
                            <div className="flex-1 relative h-64 border-l border-b border-slate-200 mt-12 mr-4">
                                {/* Major Grid lines */}
                                {[101, 97, 93, 89, 85].map((val) => (
                                    <div key={val} className="absolute left-0 w-full border-t border-slate-100 border-dashed" style={{ bottom: `${(val - 85) * (100 / 16)}%` }}>
                                        <span className="absolute -left-10 -top-2 text-[10px] font-bold text-slate-400">{val}%</span>
                                    </div>
                                ))}

                                {/* Benchmark Lines (98%, 95%, 90%) with labels */}
                                {[
                                    { val: 98, color: "text-emerald-500", border: "border-emerald-200" },
                                    { val: 95, color: "text-amber-500", border: "border-amber-200" },
                                    { val: 90, color: "text-orange-500", border: "border-orange-200" }
                                ].map((b) => (
                                    <div key={b.val} className={`absolute left-0 w-full border-t border-dashed ${b.border} flex items-center justify-start`} style={{ bottom: `${(b.val - 85) * (100 / 16)}%` }}>
                                        <span className={`bg-white px-2 -translate-y-1/2 ml-4 text-[9px] font-bold ${b.color} tracking-tight`}>-{b.val}%-</span>
                                    </div>
                                ))}

                                {/* SVG Chart - Responsive Stretch */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 256" preserveAspectRatio="none" overflow="visible">
                                    <defs>
                                        <linearGradient id="gradient-line" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>

                                    {/* Area Fill */}
                                    <path
                                        d="M 50 32 L 230 28 L 410 22 L 590 28 L 770 26 L 950 28 V 256 H 50 Z"
                                        fill="url(#gradient-line)"
                                        className="transition-all duration-1000"
                                    />

                                    {/* Line Path */}
                                    <path
                                        d="M 50 32 L 230 28 L 410 22 L 590 28 L 770 26 L 950 28"
                                        fill="none"
                                        stroke="#8B5CF6"
                                        strokeWidth="4"
                                        strokeLinejoin="round"
                                        className="transition-all duration-1000"
                                    />

                                    {/* Points */}
                                    {[
                                        { x: 50, y: 32, label: "98.88%", type: "min" },
                                        { x: 230, y: 28, label: "99.12%" },
                                        { x: 410, y: 22, label: "99.63%", type: "max" },
                                        { x: 590, y: 28, label: "99.12%" },
                                        { x: 770, y: 26, label: "99.26%" },
                                        { x: 950, y: 28, label: "99.20%" }
                                    ].map((p, i) => (
                                        <g key={i}>
                                            <circle cx={p.x} cy={p.y} r="8" fill="#EF4444" className="stroke-white stroke-[4px] shadow-sm" />
                                            {p.label && !p.type && (
                                                <text x={p.x} y={p.y - 15} textAnchor="middle" className="text-[22px] font-black fill-slate-600">{p.label}</text>
                                            )}
                                        </g>
                                    ))}
                                </svg>

                                {/* Markers - MIN/MAX Pills (Percentage based left) */}
                                <div className="absolute" style={{ left: '5%', top: '15px', transform: 'translate(-50%, -100%)' }}>
                                    <div className="bg-[#EF4444] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm whitespace-nowrap">MIN:98.88%</div>
                                </div>
                                <div className="absolute" style={{ left: '41%', top: '5px', transform: 'translate(-50%, -100%)' }}>
                                    <div className="bg-[#10B981] text-white text-[9px] font-black px-2 py-1 rounded shadow-sm whitespace-nowrap">MAX:99.63%</div>
                                </div>

                                <div className="absolute -bottom-6 left-0 w-full flex px-2">
                                    {["2/28", "3/2", "3/3", "3/4", "3/5", "3/6"].map((d, i) => (
                                        <span key={d} className="flex-1 text-[10px] font-bold text-slate-500 text-center">{d}</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-center text-[10px] font-bold text-slate-400 mt-10">Year: 2026</p>
                        </div>
                    </div>

                    {/* --- MEASUREMENT POINT FAILURE ANALYSIS --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col gap-8">
                        <h3 className="text-lg font-black text-slate-700">Measurement Point Failure Analysis by Garment Type (Total)</h3>

                        <div className="flex items-center justify-center gap-10">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-[#818CF8]"></div>
                                <span className="text-xs font-bold text-slate-600">Bottom</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-[#34D399]"></div>
                                <span className="text-xs font-bold text-slate-600">Top</span>
                            </div>
                        </div>

                        <div className="h-64 border-l border-b border-slate-200 relative mt-4">
                            {/* Y-Axis Grid */}
                            {[0, 5, 10, 15, 20].map((val) => (
                                <div key={val} className="absolute left-0 w-full border-t border-slate-200 border-dashed" style={{ bottom: `${val * 5}%` }}>
                                    <span className="absolute -left-8 -top-2 text-[10px] font-bold text-slate-400">{val}</span>
                                </div>
                            ))}
                            <div className="absolute -left-14 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-black text-slate-400 whitespace-nowrap">Total Failures</div>

                            {/* Bars Container */}
                            <div className="absolute inset-0 flex items-end justify-between px-8">
                                {[
                                    { label: "Front Left Length", val: 19, type: "Bottom" },
                                    { label: "Front Right Length", val: 18, type: "Bottom" },
                                    { label: "Back Left Length", val: 14, type: "Bottom" },
                                    { label: "Back Right Length", val: 9, type: "Bottom" },
                                    { label: "Back Chest Width", val: 10, type: "Top" },
                                    { label: "Front Chest Width", val: 9, type: "Top" },
                                    { label: "Front Body Length", val: 5, type: "Top" },
                                    { label: "Right Bicep Width", val: 3, type: "Top" },
                                    { label: "Back Body Length", val: 2, type: "Top" },
                                    { label: "Left Sleeve Length", val: 2, type: "Top" },
                                    { label: "Left Bicep Width", val: 1, type: "Top" },
                                ].map((bar, i) => (
                                    <div key={i} className="flex flex-col items-center group relative h-full justify-end" style={{ width: "8%" }}>
                                        <span className="absolute bottom-full mb-1 text-[11px] font-black text-slate-700">{bar.val}</span>
                                        <div
                                            className={`w-full rounded-t-lg transition-all duration-1000 ${bar.type === "Bottom" ? "bg-[#818CF8]" : "bg-[#34D399]"}`}
                                            style={{ height: `${isVisible ? bar.val * 5 : 0}%`, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        ></div>
                                        <div className="absolute -bottom-2 translate-y-full text-[10px] font-bold text-slate-500 rotate-45 origin-left whitespace-nowrap mt-2">
                                            {bar.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-16 text-center text-[11px] font-black text-slate-400 uppercase tracking-wider">
                            Measurement Points (Grouped by Garment Type)
                        </div>
                    </div>

                    <style jsx>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(0.5);
                    cursor: pointer;
                }
            `}</style>
                </>
            )}

            {viewMode === "Report" && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                    {/* --- REPORT FILTER BAR --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-2 ml-auto self-end flex-shrink-0">
                            <button className="bg-blue-600 text-white h-8 px-4 rounded-md font-bold text-xs flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                                <Search size={14} />
                                Search
                            </button>
                            <button className="bg-slate-700 text-white h-8 px-4 rounded-md font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm">
                                <XCircle size={14} />
                                Clear
                            </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
                            {[
                                { label: "Start Date", type: "text", val: "03/06/2026", width: "w-32" },
                                { label: "End Date", type: "text", val: "03/06/2026", width: "w-32", hasClear: true },
                                { label: "Buyer", type: "select", placeholder: "Buyer", width: "w-48" },
                                { label: "MO No", type: "select", placeholder: "MO", width: "w-48" },
                                { label: "Table No", type: "select", placeholder: "Table", width: "w-32" },
                                { label: "Color", type: "select", placeholder: "Color", width: "w-40" },
                                { label: "Garment Type", type: "select", placeholder: "Garment Type", width: "w-48" },
                                { label: "Spread Table", type: "select", placeholder: "Spread Table", width: "w-48" },
                                { label: "Material", type: "select", placeholder: "Material", width: "w-48" },
                                { label: "QC ID", type: "select", placeholder: "QC ID", width: "w-40" },
                            ].map((f, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-slate-500">{f.label}</label>
                                    <div className="relative">
                                        {f.type === "text" ? (
                                            <div className="relative">
                                                <input type="text" defaultValue={f.val} className={`${f.width} bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs font-bold text-slate-700 outline-none`} />
                                                {f.hasClear && <XCircle size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 fill-white" />}
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <select className={`${f.width} bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs font-bold text-slate-400 appearance-none outline-none cursor-pointer`}>
                                                    <option>{f.placeholder}</option>
                                                </select>
                                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}


                        </div>
                        <span className="text-[11px] font-bold text-slate-500 italic">Showing 14 of 14 reports.</span>
                    </div>

                    {/* --- ICON DETAILS & OPTIONS --- */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 pt-5 pb-3 flex flex-col gap-4 relative">
                        <h4 className="text-sm font-black text-slate-700">Icon Details:</h4>

                        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                            {[
                                { label: "Total Bundle Qty", icon: Package, color: "text-blue-500" },
                                { label: "No of Bundle Qty Checked", icon: ClipboardList, color: "text-blue-500" },
                                { label: "Total Inspected Qty", icon: Search, color: "text-blue-500" },
                                { label: "Total Inspected Size", icon: Maximize2, color: "text-blue-500" },
                                { label: "Total Completed Qty", icon: CheckCircle2, color: "text-emerald-500" },
                                { label: "Pass", icon: ThumbsUp, color: "text-emerald-500" },
                                { label: "Reject", icon: ThumbsDown, color: "text-rose-500" },
                                { label: "Reject Measurements", icon: AlertTriangle, color: "text-amber-500" },
                                { label: "Reject Defects", icon: Bug, color: "text-purple-500" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <item.icon size={16} className={item.color} />
                                    <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-1">
                            {["Marker Ratio", "Layer Details", "Bundle Details", "Inspection Details"].map((opt) => (
                                <label key={opt} className="flex items-center gap-1.5 cursor-pointer group">
                                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                                    <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600">{opt}</span>
                                </label>
                            ))}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border border-slate-200 border-collapse min-w-[1600px]">
                                <thead className="bg-[#F8FAFC]">
                                    <tr>
                                        {[
                                            "Inspection Date", "Buyer", "MO No", "Table No", "Buyer Style",
                                            "Spread Table", "Material", "Lot Nos", "QC ID", "Color",
                                            "Garment Type", "Marker No", "Pass Rate (%)", "Results", "Report", "Action"
                                        ].map((head) => (
                                            <th key={head} className="px-4 py-4 text-[11px] font-black text-slate-500 border-b border-slate-200 whitespace-nowrap uppercase tracking-wider border-l border-r">
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { date: "3/6/2026", buyer: "Aritzia", mo: "GPAR12373", table: "T 10", style: "FFS 99-06-41367-R-SU26", spread: "D", material: "AR-FLC30/1=330/7IFFS(YD)-Heavy Peach", lot: ["LE527354A", "LE527355B"], qcId: "YM3479", color: "ADMIRAL", type: "Bottom", marker: "KI", passRate: "100.00", result: "PASS" },
                                        { date: "3/6/2026", buyer: "Aritzia", mo: "GPAR12373", table: "T 9", style: "FFS 99-06-41367-R-SU26", spread: "C", material: "AR-FLC30/1=330/7IFFS(YD)-Heavy Peach", lot: ["LE527354A", "LE527355B"], qcId: "YM3479", color: "ADMIRAL", type: "Bottom", marker: "KI", passRate: "97.78", result: "PASS" },
                                        { date: "3/6/2026", buyer: "Aritzia", mo: "GPAR12404", table: "T 13", style: "FFS 99-26-49101-SU26", spread: "K", material: "AR-FLC30/1=330/7IFFS(YD)-Heavy Peach", lot: ["LE527390A"], qcId: "YM8254", color: "RICH MOCHA BROWN", type: "Bottom", marker: "KI", passRate: "100.00", result: "PASS" },
                                        { date: "3/6/2026", buyer: "Aritzia", mo: "GPAR12404", table: "T 8", style: "FFS 99-26-49101-SU26", spread: "H", material: "AR-FLC30/1=330/7IFFS(YD)-Heavy Peach", lot: ["LE525136A"], qcId: "YM7523", color: "HEATHER CHROME", type: "Bottom", marker: "K2", passRate: "100.00", result: "PASS" },
                                        { date: "3/6/2026", buyer: "Aritzia", mo: "GPAR12405", table: "T 17", style: "FFS 99-26-46013-SU26", spread: "I", material: "AR-FLC30/1=330/7IFFS(YD)-Peach", lot: ["LE526174A"], qcId: "YM8254", color: "MILKSHAKE PINK", type: "Bottom", marker: "K3", passRate: "100.00", result: "PASS" },
                                        { date: "3/6/2026", buyer: "Aritzia", mo: "GPAR12405", table: "T 19", style: "FFS 99-26-46013-SU26", spread: "E", material: "AR-FLC30/1=330/7IFFS(YD)-Peach", lot: ["LE526174A"], qcId: "YM7523", color: "MILKSHAKE PINK", type: "Bottom", marker: "K3", passRate: "100.00", result: "PASS" },
                                        { date: "3/6/2026", buyer: "Aritzia", mo: "GPAR12407", table: "T 1", style: "FFS 99-06-52283-SU26", spread: "J", material: "AR-FLC30/1=330/7IFFS(YD)-Peach", lot: ["LE526171A"], qcId: "YM8254", color: "MILKSHAKE PINK", type: "Bottom", marker: "KI", passRate: "100.00", result: "PASS" },
                                        { date: "3/6/2026", buyer: "Aritzia", mo: "GPAR12407", table: "T 2", style: "FFS 99-06-52283-SU26", spread: "J", material: "AR-FLC30/1=330/7IFFS(YD)-Peach", lot: ["LE526170A", "LE526171A"], qcId: "YM8254", color: "MILKSHAKE PINK", type: "Bottom", marker: "KI", passRate: "97.78", result: "PASS" },
                                        { date: "3/6/2026", buyer: "Aritzia", mo: "GPAR12407", table: "T 5", style: "FFS 99-06-52283-SU26", spread: "G", material: "AR-FLC30/1=330/7IFFS(YD)-Heavy Peach", lot: ["LE527466A"], qcId: "YM7523", color: "HEATHER CPCKE PNK", type: "Bottom", marker: "KI", passRate: "100.00", result: "PASS" },
                                        { date: "3/6/2026", buyer: "Costco", mo: "PTCOC402", table: "T 122", style: "CR127BCC", spread: "A", material: "CNO-KFC1321", lot: ["0001420217AK", "0001420217AU"], qcId: "YM3479", color: "BLACK", type: "Top", marker: "K33", passRate: "100.00", result: "PASS" },
                                        { date: "3/6/2026", buyer: "Costco", mo: "PTCOC406", table: "T 18,19,70,71", style: "STCO7191", spread: "F", material: "CNO-KFC1319", lot: ["260103008"], qcId: "YM7523", color: "DEJA VU BLUE", type: "Top", marker: "KI", passRate: "97.04", result: "FAIL" },
                                        { date: "3/6/2026", buyer: "Costco", mo: "PTCOC406", table: "T 20+21+76+77", style: "STCO7191", spread: "F", material: "CNO-KFC1319", lot: ["260103008"], qcId: "YM7523", color: "DEJA VU BLUE", type: "Top", marker: "KI", passRate: "100.00", result: "PASS" },
                                        { date: "3/6/2026", buyer: "Costco", mo: "PTCOC406", table: "T 75", style: "STCO7191", spread: "F", material: "CNO-KFC1319", lot: ["260103008"], qcId: "YM7523", color: "DEJA VU BLUE", type: "Top", marker: "KI", passRate: "99.26", result: "PASS" },
                                        { date: "3/6/2026", buyer: "Costco", mo: "PTCOC406", table: "T 75", style: "STCO7191", spread: "F", material: "CNO-KFC1319", lot: ["260103008"], qcId: "YM7523", color: "DEJA VU BLUE", type: "Top", marker: "KI", passRate: "100.00", result: "PASS" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-[#F8FAFC] transition-colors border-b border-slate-200 last:border-0 border-l border-r">
                                            <td className="px-4 py-4 text-xs font-bold text-slate-600 border-l border-r">{row.date}</td>
                                            <td className="px-4 py-4 text-xs font-bold text-slate-600 border-l border-r">{row.buyer}</td>
                                            <td className="px-4 py-4 text-xs font-bold text-slate-600 border-l border-r">{row.mo}</td>
                                            <td className="px-4 py-4 text-xs text-center font-bold text-slate-600 border-l border-r">{row.table}</td>
                                            <td className="px-4 py-4 text-xs font-bold text-slate-600 max-w-xs border-l border-r">{row.style}</td>
                                            <td className="px-4 py-4 text-xs text-center font-bold text-slate-600 truncate border-l border-r">{row.spread}</td>
                                            <td className="px-4 py-4 text-xs font-bold text-slate-600 max-w-xs border-l border-r">{row.material}</td>
                                            <td className="px-4 py-4 text-xs font-bold text-slate-600 border-l border-r">
                                                <div className="flex flex-wrap gap-1">
                                                    {row.lot.map((l, j) => (
                                                        <span key={j} className="bg-[#EDF2F7] text-slate-500 text-center text-[10px] px-1.5 py-0.5 rounded-full border border-slate-300 font-bold">{l}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-xs text-center font-bold text-slate-600 border-l border-r">{row.qcId}</td>
                                            <td className="px-4 py-4 text-xs font-bold text-slate-600 border-l border-r">{row.color}</td>
                                            <td className="px-4 py-4 text-xs text-center font-bold text-slate-600 border-l border-r">{row.type}</td>
                                            <td className="px-4 py-4 text-xs text-center font-bold text-slate-600 truncate border-l border-r">{row.marker}</td>
                                            <td className="px-4 py-4 text-[13px] text-center font-black text-slate-900 border-l border-r">{row.passRate}</td>
                                            <td className="px-4 py-4 border-l border-r  text-center">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest ${row.result === "PASS" ? "bg-[#D1FAE5] text-[#059669]" : "bg-[#FEE2E2] text-[#DC2626]"}`}>
                                                    {row.result}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 border-l border-r text-center">
                                                <button
                                                    onClick={() => setSelectedReport(row)}
                                                    className="text-blue-500 hover:text-blue-700 transition-colors"
                                                >
                                                    <Eye size={17} />
                                                </button>
                                            </td>
                                            <td className="px-4 py-4 border-l border-r text-center">
                                                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                                    <MoreVertical size={17} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* --- INSPECTION DETAIL VIEW (FULL PAGE) --- */}
            {viewMode === 'Report' && selectedReport && (
                <div className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="max-w-[1600px] mx-auto p-6 flex flex-col gap-2 pb-20">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4 sticky top-0 bg-slate-50 z-10">
                            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                Cutting Inspection Report — MO No: {selectedReport.mo}, Table No: {selectedReport.table}
                            </h1>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>

                        {/* --- PRODUCTION & MATERIAL OVERVIEW (Order, Fabric, Table, Marker) --- */}
                        {/* --- PRODUCTION & MATERIAL OVERVIEW (Order, Fabric, Table, Marker) --- */}
                        <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col gap-8 shadow-sm">
                            <h2 className="text-lg font-black text-blue-700 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white"><ClipboardList size={16} /></div>
                                Production & Material Overview
                            </h2>

                            <div className="grid grid-cols-1 gap-8">
                                {/* 1. Order Details */}
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Order Details</h3>
                                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-[#F8FAFC] border-b border-slate-200">
                                                <tr>
                                                    {["Buyer", "Buyer Style", "Color", "Lot No", "Order Quantity"].map((h, i) => (
                                                        <th key={i} className="px-4 py-2 text-[10px] font-black uppercase text-slate-900 border-r border-slate-200 last:border-0 text-center">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="text-[11px] font-bold text-slate-600">
                                                <tr>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">{selectedReport.buyer}</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">{selectedReport.style}</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">{selectedReport.color}</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">LE527468A</td>
                                                    <td className="px-4 py-3 text-center">2753</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* 2. Fabric Details */}
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Fabric Details</h3>
                                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-[#F8FAFC] border-b border-slate-200">
                                                <tr>
                                                    {["Fabric Type", "Material", "Roll Quantity", "Spread Yards", "Unit", "Gross Kgs", "Net Kgs", "Total TTL Roll"].map((h, i) => (
                                                        <th key={i} className="px-4 py-2 text-[10px] font-black uppercase text-slate-900 border-r border-slate-200 last:border-0 text-center">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="text-[11px] font-bold text-slate-600">
                                                <tr>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">A</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">{selectedReport.material}</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">5</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">255.27</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">YDS</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">146.72</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">144.99</td>
                                                    <td className="px-4 py-3 text-center">0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* 3. Cutting Table Details */}
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Cutting Table Details</h3>
                                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead className="bg-[#F8FAFC] border-b border-slate-200">
                                                    <tr>
                                                        {["Spread Table", "Table No", "Layers (P/A)", "Pcs", "Marker", "Marker Length"].map((h, i) => (
                                                            <th key={i} className="px-2 py-2 text-[10px] font-black uppercase text-slate-900 border-r border-slate-200 last:border-0 text-center">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="text-[11px] font-bold text-slate-600">
                                                    <tr>
                                                        <td className="px-2 py-3 border-r border-slate-200 text-center">{selectedReport.spread}</td>
                                                        <td className="px-2 py-3 border-r border-slate-200 text-center">27</td>
                                                        <td className="px-2 py-3 border-r border-slate-200 text-center">48 / 48</td>
                                                        <td className="px-2 py-3 border-r border-slate-200 text-center">816</td>
                                                        <td className="px-2 py-3 border-r border-slate-200 text-center">K2</td>
                                                        <td className="px-2 py-3 text-center">5.152</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* 4. Marker Ratio */}
                                    <div className="flex flex-col gap-3">
                                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Marker Ratio</h3>
                                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                                            <table className="w-full text-left">
                                                <thead className="bg-[#F8FAFC] border-b border-slate-200">
                                                    <tr>
                                                        {["2XS", "XS", "S", "M", "L"].map((h, i) => (
                                                            <th key={i} className="px-4 py-2 text-[10px] font-black uppercase text-slate-900 border-r border-slate-200 last:border-0 text-center">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="text-[11px] font-bold text-slate-600">
                                                    <tr>
                                                        <td className="px-4 py-3 border-r border-slate-200 text-center">2</td>
                                                        <td className="px-4 py-3 border-r border-slate-200 text-center">5</td>
                                                        <td className="px-4 py-3 border-r border-slate-200 text-center">6</td>
                                                        <td className="px-4 py-3 border-r border-slate-200 text-center">3</td>
                                                        <td className="px-4 py-3 text-center">1</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5. Inspection Summary Card */}
                        <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col gap-8 shadow-sm">
                            <h2 className="text-lg font-black text-blue-700 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white"><Search size={16} /></div>
                                Overall Inspection Summary
                            </h2>
                            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-[#F8FAFC] border-b border-slate-200">
                                        <tr>
                                            {["Size", "Total Inspected", "cutting.totalPass", "cutting.totalReject", "Reject Measurements", "Reject Defects", "Pass Rate (%)"].map((h, i) => (
                                                <th key={i} className="px-4 py-2 text-[10px] font-black uppercase text-slate-900 border-r border-slate-200 last:border-0 text-center">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-[11px] font-bold text-slate-600">
                                        {[
                                            { size: "2XS", total: 60, pass: 60, reject: 0, measurements: 0, defects: 0, rate: "100.00" },
                                            { size: "S", total: 120, pass: 120, reject: 0, measurements: 0, defects: 0, rate: "100.00" },
                                            { size: "XS", total: 30, pass: 30, reject: 0, measurements: 0, defects: 0, rate: "100.00" },
                                            { size: "Total", total: 210, pass: 210, reject: 0, measurements: 0, defects: 0, rate: "100.00" },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="border-b border-slate-200 last:border-0">
                                                <td className="px-4 py-3 border-r border-slate-200 text-center">{row.size}</td>
                                                <td className="px-4 py-3 border-r border-slate-200 text-center">{row.total}</td>
                                                <td className="px-4 py-3 border-r border-slate-200 text-center">{row.pass}</td>
                                                <td className="px-4 py-3 border-r border-slate-200 text-center">{row.reject}</td>
                                                <td className="px-4 py-3 border-r border-slate-200 text-center">{row.measurements}</td>
                                                <td className="px-4 py-3 border-r border-slate-200 text-center">{row.defects}</td>
                                                <td className="px-4 py-3 text-center font-black text-slate-900">{row.rate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 5. Inspection Summary Card */}
                        <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col gap-8 shadow-sm">
                            <h2 className="text-lg font-black text-blue-700 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white"><Search size={16} /></div>
                                Overall Inspection Summary
                            </h2>
                            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-[#F8FAFC] border-b border-slate-200">
                                        <tr>
                                            {["Size", "Total Inspected", "Pass", "Reject", "Reject measurements", "Reject Defects", "Pass Rate (%)"].map((h, i) => (
                                                <th key={i} className="px-4 py-2 text-[10px] font-black uppercase text-slate-900 border-r border-slate-200 last:border-0 text-center">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-[11px] font-bold text-slate-600">
                                        {[
                                            { size: "L", total: 90, pass: 90, reject: 0, measurements: 0, defects: 0, rate: "100.00" },
                                            { size: "XS", total: 45, pass: 45, reject: 0, measurements: 0, defects: 0, rate: "100.00" },
                                            { size: "Total", total: 135, pass: 135, reject: 0, measurements: 0, defects: 0, rate: "100.00" },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="border-b border-slate-200 last:border-0">
                                                <td className="px-4 py-3 border-r border-slate-200 text-center">{row.size}</td>
                                                <td className="px-4 py-3 border-r border-slate-200 text-center">{row.total}</td>
                                                <td className="px-4 py-3 border-r border-slate-200 text-center">{row.pass}</td>
                                                <td className="px-4 py-3 border-r border-slate-200 text-center">{row.reject}</td>
                                                <td className="px-4 py-3 border-r border-slate-200 text-center">{row.measurements}</td>
                                                <td className="px-4 py-3 border-r border-slate-200 text-center">{row.defects}</td>
                                                <td className="px-4 py-3 text-center font-black text-slate-900">{row.rate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* --- SIZE L SECTION --- */}
                        <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col gap-8 shadow-sm">
                            <h2 className="text-lg font-black text-blue-700 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white"><Package size={16} /></div>
                                Inspection Detail Summary By Size: L
                            </h2>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-sm font-black text-slate-800">Size Summary for L</h3>
                                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
                                    <table className="w-full text-left min-w-[1200px]">
                                        <thead className="bg-[#F8FAFC] border-b border-slate-200">
                                            <tr>
                                                {["Bundle No", "Serial Letter", "Part Name", "Total Pcs :", "Pass", "Reject", "Reject Measurements", "Reject Defects", "Pass Rate (%)"].map((h, i) => (
                                                    <th key={i} className="px-4 py-2 text-[10px] font-black uppercase text-slate-900 border-r border-slate-200 last:border-0 text-center">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="text-[11px] font-bold text-slate-600">
                                            {[
                                                { b: 1, part: "Front Left (1)" },
                                                { b: 2, part: "Back Left (2)" },
                                                { b: 3, part: "Front Right (3)" },
                                                { b: 4, part: "Back Right (4)" },
                                                { b: 5, part: "Pocket Left (5)" },
                                                { b: 6, part: "Pocket Right (6)" }
                                            ].map((item) => (
                                                <tr key={item.b} className="border-b border-slate-200 last:border-0 hover:bg-slate-50">
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center whitespace-pre-line">{item.b}</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">F</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">{item.part}</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">
                                                        <div>15</div>
                                                        <div className="text-[10px] text-slate-600">T:5, M:5, B:5</div>
                                                    </td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">
                                                        <div>15</div>
                                                        <div className="text-[10px] text-slate-600">T:5, M:5, B:5</div>
                                                    </td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">
                                                        <div>0</div>
                                                        <div className="text-[10px] text-slate-600">T:0, M:0, B:0</div>
                                                    </td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">
                                                        <div>0</div>
                                                        <div className="text-[10px] text-slate-600">T:1, M:0, B:0</div>
                                                    </td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">
                                                        <div>0</div>
                                                        <div className="text-[10px] text-slate-600">T:0, M:0, B:0</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="font-black text-slate-900">100.00</div>
                                                        <div className="text-[9px] text-slate-600">T:100% M:100% B:100%</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Measurements sections for all 6 bundles of L */}
                            <div className="flex flex-col gap-6">
                                {[
                                    { b: 1, part: "Front Left" },
                                    { b: 2, part: "Back Left" },
                                    { b: 3, part: "Front Right" },
                                    { b: 4, part: "Back Right" },
                                    { b: 5, part: "Pocket Left" },
                                    { b: 6, part: "Pocket Right" }
                                ].map((bundle) => (
                                    <div key={bundle.b} className="flex flex-col gap-2">
                                        <h3 className="text-[11px] font-black text-slate-800 italic">Measurement Data for Bundle No: {bundle.b}; Part Name: {bundle.part}</h3>
                                        <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
                                            <table className="w-full text-[10px] min-w-[1200px]">
                                                <thead className="bg-[#F8FAFC] border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-4 py-1.5 border-r border-slate-200 font-black min-w-[180px]">Measurement Points</th>
                                                        {["T1", "T2", "T3", "T4", "T5", "M1", "M2", "M3", "M4", "M5", "B1", "B2", "B3", "B4", "B5"].map((pt, i) => (
                                                            <th key={i} className="px-1 py-1.5 border-r border-slate-200 font-black text-center">{pt}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="font-bold">
                                                    <tr className="border-b border-slate-100">
                                                        <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700 italic">{bundle.part} Crotch Width</td>
                                                        {Array(15).fill(0).map((_, i) => (
                                                            <td key={i} className={`px-1 py-1.5 border-r border-slate-100 text-center ${bundle.b === 1 && i === 12 ? "bg-red-50 text-red-500" : (i % 3 === 0 || i === 1) ? "bg-green-50 text-green-600" : "text-slate-400"}`}>
                                                                {bundle.b === 1 && i === 12 ? "-1/8" : (i % 3 === 0 || i === 1) ? "0" : "1/8"}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700 italic">{bundle.part} Length</td>
                                                        {Array(15).fill(0).map((_, i) => (
                                                            <td key={i} className={`px-1 py-1.5 border-r border-slate-100 text-center ${i % 2 === 0 ? "bg-green-50 text-green-600" : "text-slate-400"}`}>
                                                                {i % 2 === 0 ? "1/8" : "-1/8"}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-[10px] text-slate-600 italic">Defect Details for Bundle No: {bundle.b}; Part Name: {bundle.part} - No defects recorded for this part.</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- SIZE XS SECTION --- */}
                        <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col gap-8 shadow-sm">
                            <h2 className="text-lg font-black text-blue-700 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white"><Package size={16} /></div>
                                Inspection Detail Summary By Size: XS
                            </h2>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-sm font-black text-slate-800">Size Summary for XS</h3>
                                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
                                    <table className="w-full text-left min-w-[1200px]">
                                        <thead className="bg-[#F8FAFC] border-b border-slate-200">
                                            <tr>
                                                {["Bundle No", "Serial Letter", "Part Name", "Total Pcs :", "Pass", "Reject", "Reject Measurements", "Reject Defects", "Pass Rate (%)"].map((h, i) => (
                                                    <th key={i} className="px-4 py-2 text-[10px] font-black uppercase text-slate-900 border-r border-slate-200 last:border-0 text-center">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="text-[11px] font-bold text-slate-600">
                                            {[
                                                { b: 1, part: "Front Left (1)" },
                                                { b: 2, part: "Back Left (2)" },
                                                { b: 3, part: "Back Right (4)" }
                                            ].map((item) => (
                                                <tr key={item.b} className="border-b border-slate-200 last:border-0 hover:bg-slate-50">
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center whitespace-pre-line">{item.b}</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">B</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">{item.part}</td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">
                                                        <div>15</div>
                                                        <div className="text-[10px] text-slate-400">T:5, M:5, B:5</div>
                                                    </td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">
                                                        <div>15</div>
                                                        <div className="text-[10px] text-slate-400">T:5, M:5, B:5</div>
                                                    </td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">
                                                        <div>0</div>
                                                        <div className="text-[10px] text-slate-400">T:0, M:0, B:0</div>
                                                    </td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">
                                                        <div>0</div>
                                                        <div className="text-[10px] text-slate-400">T:0, M:0, B:0</div>
                                                    </td>
                                                    <td className="px-4 py-3 border-r border-slate-200 text-center">
                                                        <div>0</div>
                                                        <div className="text-[10px] text-slate-400">T:0, M:0, B:0</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="font-black text-slate-900">100.00</div>
                                                        <div className="text-[9px] text-slate-400">T:100% M:100% B:100%</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Measurements sections for size XS bundles */}
                            <div className="flex flex-col gap-6">
                                {[
                                    { b: 1, part: "Front Left" },
                                    { b: 2, part: "Back Left" },
                                    { b: 3, part: "Back Right" }
                                ].map((bundle) => (
                                    <div key={bundle.b} className="flex flex-col gap-2">
                                        <h3 className="text-[11px] font-black text-slate-800 italic">Measurement Data for Bundle No: {bundle.b}; Part Name: {bundle.part}</h3>
                                        <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
                                            <table className="w-full text-[10px] min-w-[1200px]">
                                                <thead className="bg-[#F8FAFC] border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-4 py-1.5 border-r border-slate-200 font-black min-w-[180px]">Measurement Points</th>
                                                        {["T1", "T2", "T3", "T4", "T5", "M1", "M2", "M3", "M4", "M5", "B1", "B2", "B3", "B4", "B5"].map((pt, i) => (
                                                            <th key={i} className="px-1 py-1.5 border-r border-slate-200 font-black text-center">{pt}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="font-bold">
                                                    <tr className="border-b border-slate-100">
                                                        <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700 italic">{bundle.part} Crotch Width</td>
                                                        {Array(15).fill(0).map((_, i) => (
                                                            <td key={i} className={`px-1 py-1.5 border-r border-slate-100 text-center ${i === 4 ? "bg-red-50 text-red-500" : (i % 3 === 0 || i === 1) ? "bg-green-50 text-green-600" : "text-slate-400"}`}>
                                                                {i === 4 ? "-1/8" : (i % 3 === 0 || i === 1) ? "0" : "1/8"}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-1.5 border-r border-slate-200 text-slate-700 italic">{bundle.part} Length</td>
                                                        {Array(15).fill(0).map((_, i) => (
                                                            <td key={i} className={`px-1 py-1.5 border-r border-slate-100 text-center ${i % 2 === 0 ? "bg-green-50 text-green-600" : "text-slate-400"}`}>
                                                                {i % 2 === 0 ? "1/8" : i === 3 ? "-1/8" : "0"}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-[10px] text-slate-600 italic">Defect Details for Bundle No: {bundle.b}; Part Name: {bundle.part} - No defects recorded for this part.</p>
                                    </div>
                                ))}
                            </div>

                            {/* 7. Cutting Issues */}
                            <div className="flex flex-col gap-2 mt-4">
                                <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Cutting Issues</h2>
                                <p className="text-xs text-slate-600 pl-4 border-l-2 border-slate-200 italic">No cutting issues reported for this size.</p>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default QCRovingDashboard;
