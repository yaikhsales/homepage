import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * YQMSDashboard - "Iconic Wow" Edition
 * Features high-quality image icons, professional light theme, and high-fidelity aesthetics.
 */
export const YQMSDashboard = ({ onBack }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const getIcon = (name) => {
        const Icon = LucideIcons[name];
        return Icon || LucideIcons.HelpCircle;
    };

    const cards = [
        {
            title: "Cutting",
            icon: "Scissors",
            imageIcon: "cutting.png",
            color: "cyan",
            stats: "On-Track",
            label: "Ops",
            delay: "0ms",
            path: "/dashboard/yqms/qc-roving"
        },
        {
            title: "Order Data",
            icon: "Package",
            imageIcon: "analysis.png",
            color: "indigo",
            stats: "1,240",
            label: "Pending",
            delay: "50ms"
        },
        {
            title: "Washing",
            icon: "Droplets",
            imageIcon: "washing.png",
            color: "sky",
            stats: "Active",
            label: "Status",
            delay: "100ms"
        },
        {
            title: "Ironing",
            icon: "Wind",
            imageIcon: "ironing.png",
            color: "slate",
            stats: "450pcs",
            label: "Today",
            delay: "150ms"
        },
        {
            title: "OPA",
            icon: "Eye",
            imageIcon: "qa.png",
            color: "violet",
            stats: "Verified",
            label: "Quality",
            delay: "200ms"
        },
        {
            title: "QC 2 Live Dashboard",
            icon: "Activity",
            imageIcon: "YQMS.png",
            color: "red",
            stats: "LIVE",
            label: "Real-time",
            delay: "250ms",
            isLive: true
        },
        {
            title: "QC 2 MO Analysis",
            icon: "Clock",
            imageIcon: "analysis.png",
            color: "amber",
            stats: "Scheduled",
            label: "Next",
            delay: "300ms"
        },
        {
            title: "QC 2 Line Hr Trend",
            icon: "TrendingUp",
            imageIcon: "garment-analysis.png",
            color: "emerald",
            stats: "+12%",
            label: "Growth",
            delay: "350ms"
        },
        {
            title: "QC 2 Daily Summary",
            icon: "Calendar",
            imageIcon: "report.png",
            color: "orange",
            stats: "Ready",
            label: "Report",
            delay: "400ms"
        },
        {
            title: "QC 2 Weekly Analysis",
            icon: "BarChart3",
            imageIcon: "report.png",
            color: "rose",
            stats: "Finalizing",
            label: "Week 08",
            delay: "450ms"
        },
        {
            title: "QC 2 Monthly Analysis",
            icon: "PieChart",
            imageIcon: "report.png",
            color: "fuchsia",
            stats: "Processing",
            label: "February",
            delay: "500ms"
        },
        {
            title: "Packing",
            icon: "Box",
            imageIcon: "packing.png",
            color: "yellow",
            stats: "85%",
            label: "Capacity",
            delay: "550ms"
        },
        {
            title: "QC Roving",
            icon: "Search",
            imageIcon: "qc_(quality_control)_department.png",
            color: "blue",
            stats: "98.5%",
            label: "Efficiency",
            delay: "600ms",
            path: "/dashboard/yqms/cutting"
        },
    ];

    const colorMap = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        sky: "text-sky-600 bg-sky-50 border-sky-100",
        slate: "text-slate-600 bg-slate-50 border-slate-100",
        violet: "text-violet-600 bg-violet-50 border-violet-100",
        red: "text-red-600 bg-red-50 border-red-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        orange: "text-orange-600 bg-orange-50 border-orange-100",
        rose: "text-rose-600 bg-rose-50 border-rose-100",
        fuchsia: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100",
        yellow: "text-yellow-600 bg-yellow-50 border-yellow-100",
        cyan: "text-cyan-600 bg-cyan-50 border-cyan-100",
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans select-none overflow-x-hidden relative">
            {/* Minimalist Header with Back Button Integrated */}
            <header className={`sticky top-0 z-50 px-8 py-5 flex items-center justify-between bg-white border-b border-slate-200 shadow-sm transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <div className="flex items-center gap-6">
                    {/* Back Button Action at the Start (Header) */}
                    <button
                        onClick={onBack}
                        className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all text-white group"
                        title="Back to Menu"
                    >
                        <LucideIcons.ArrowLeft className="w-7 h-7 stroke-[3] group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">YQMS</h1>
                            <span className="text-sm text-slate-500 font-bold">Quality Control System</span>
                        </div>
                    </div>
                    <div className="flex items-center border-l border-slate-200 pl-6 gap-3">
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Dashboard</h1>
                            <span className="text-sm text-slate-500 font-bold"><span className="text-red-600">Real-time</span> Monitoring</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Consolidated Premium Profile Card */}
                    <button
                        onClick={() => navigate("/profile")}
                        className="group flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-5 py-2.5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all active:scale-95"
                    >
                        <div className="flex flex-col items-end border-r border-slate-100 pr-5 mr-1">
                            <span className="text-sm font-black text-slate-900 uppercase leading-none">QA Division</span>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">YM7625</span>

                            </div>
                        </div>
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-inner flex items-center justify-center overflow-hidden transition-all group-hover:scale-105">
                                <LucideIcons.User className="w-7 h-7 text-slate-400" />
                            </div>
                            {/* Online status dot positioned perfectly at the top center */}
                            <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                        </div>
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 p-8">
                <div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {cards.map((card, idx) => {
                        const IconComponent = getIcon(card.icon);
                        const colorSet = colorMap[card.color];

                        return (
                            <div
                                key={idx}
                                onClick={() => card.path && navigate(card.path)}
                                style={{
                                    animationDelay: card.delay,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                    opacity: isVisible ? 1 : 0
                                }}
                                className={`group relative bg-white rounded-3xl p-6 transition-all duration-300 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-[220px]`}
                            >
                                {/* Card Header with REAL IMAGE ICONS */}
                                <div className="flex items-center justify-between">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 bg-white border border-slate-300 shadow-sm group-hover:scale-110 group-hover:shadow-md">
                                        <img
                                            src={`/assets/icons/sub-icons/${card.imageIcon}`}
                                            alt={card.title}
                                            className="w-12 h-12 object-contain"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <div className={`hidden ${colorSet} p-3 rounded-xl`}>
                                            <IconComponent className="w-7 h-7" />
                                        </div>
                                    </div>
                                </div>

                                {card.isLive && (
                                    <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 shadow-sm">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Live</span>
                                    </div>
                                )}

                                {/* Card Body */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-black text-slate-900 uppercase mb-1">
                                        {card.title}
                                    </h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xs font-bold text-slate-600 tracking-tight">
                                            {card.stats}
                                        </span>
                                        <span className="text-xs font-bold text-slate-600">
                                            {card.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Hover Ornament */}
                                <div className="absolute top-4 right-4 text-slate-100 group-hover:text-blue-5050 transition-colors pointer-events-none opacity-20">
                                    <IconComponent size={60} strokeWidth={1} />
                                </div>

                                {/* Progress Bar Mini */}
                                <div className="mt-4 w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-1000 bg-blue-500/30 group-hover:bg-blue-600`} style={{ width: isVisible ? '60%' : '0%' }}></div>
                                </div>

                                {/* Link Indicator */}
                                <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:bg-blue-600">
                                    <LucideIcons.ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default YQMSDashboard;
