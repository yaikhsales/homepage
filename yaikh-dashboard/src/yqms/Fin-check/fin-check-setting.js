import React from 'react';
import {
    FileText, Camera, Package, Activity, Factory,
    User, Plus, Edit2, Trash2, Shield, Settings, ArrowLeft, Sparkles
} from 'lucide-react';

const FinCheckSetting = ({ onBack }) => {
    const [activeTab, setActiveTab] = React.useState('header');

    const tabs = [
        { id: 'header', label: 'Header', icon: FileText },
        { id: 'photos', label: 'Photos', icon: Camera },
        { id: 'packing', label: 'Packing', icon: Package },
        { id: 'production', label: 'Production', icon: Activity },
        { id: 'subcon', label: 'Sub-Con Factory', icon: Factory },
    ];

    const settingsRows = [
        { id: 1, title: 'Order Type', options: ['New Order', 'New Repeat', 'N/A'] },
        { id: 2, title: 'Samples Available?', options: ['Yes', 'No', 'N/A'] },
        { id: 3, title: 'Lab Analysis & Testing', options: ['Conform', 'Non-Conform', 'N/A'] },
        { id: 4, title: 'Master Carton Requirements?', options: ['Conform', 'Non-Conform', 'N/A'] },
        { id: 5, title: 'Drop Test?', options: ['Conform', 'Non-Conform', 'N/A'] },
        { id: 6, title: 'Price?', options: ['Conform', 'Non-Conform', 'N/A'] },
        { id: 7, title: 'Hang Tags?', options: ['Conform', 'Non-Conform', 'N/A'] },
        { id: 8, title: 'Labels?', options: ['Conform', 'Non-Conform', 'N/A'] },
        { id: 9, title: 'Composition', options: ['Conform', 'Non-Conform', 'N/A'] },
    ];

    return (
        <div className="w-full flex flex-col min-h-screen bg-[#F8FAFC]">
            {/* High-Fidelity Purple Header */}
            <div className="w-full bg-gradient-to-r from-[#5340C7] via-[#9F37B3] to-[#C9338D] p-4 shadow-xl rounded-lg">
                <div className="w-full flex items-center justify-between gap-8">
                    {/* Brand/Title & Back */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md hover:bg-white/30 transition-all active:scale-95 group border border-white/30 shadow-lg"
                        >
                            <ArrowLeft className="text-white w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>

                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                            <Settings className="text-white w-6 h-6" />
                        </div>
                        <div className="text-white">
                            <div className="flex items-center gap-2 text-left">
                                <h1 className="text-xl font-black tracking-tight uppercase text-left">Fin Check System | Settings</h1>
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm group/pro cursor-help">
                                    <Sparkles size={12} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-[10px] font-black tracking-wider text-white">PRO</span>
                                </span>
                            </div>
                            <p className="text-white/70 text-sm font-bold">Configure System Settings</p>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center bg-black/10 rounded-2xl p-1.5 backdrop-blur-md border border-white/40">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'bg-white shadow-lg scale-105' : 'text-white hover:text-white hover:bg-white/5'}`}
                            >
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#6366F1]' : 'text-current'}`} />
                                <span className={`text-[9px] font-black uppercase tracking-tighter ${activeTab === tab.id ? 'text-[#6366F1]' : 'text-current'}`}>
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Active Section Info */}
                    <div className="hidden xl:flex gap-4 bg-white/10 rounded-2xl px-6 py-3 backdrop-blur-md border border-white/40">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <div className="flex flex-col">
                            <span className="text-white text-[10px] font-black uppercase tracking-widest">Header</span>
                            <span className="text-white/60 text-[9px] font-bold uppercase tracking-tighter">Active Section</span>
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-4 bg-black/10 rounded-2xl p-2 pr-6 backdrop-blur-md border border-white/40">
                        <div className="w-10 h-10 rounded-xl bg-orange-400 flex items-center justify-center shadow-lg">
                            <User className="text-white w-6 h-6" />
                        </div>
                        <div className="text-left leading-none">
                            <p className="text-white text-xs font-black uppercase tracking-tight">QA Officer</p>
                            <p className="text-white/60 text-[9px] font-bold mt-1 uppercase tracking-tighter">ID: YM7625</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Table Area */}
            <div className="w-full p-4">
                {/* Action Bar */}
                <div className="flex justify-end mb-3">
                    <button className="flex items-center gap-3 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm transition-all shadow-lg hover:shadow-xl active:scale-95 uppercase tracking-tight">
                        <Plus size={18} />
                        Add New Row
                    </button>
                </div>

                {/* Table Header */}
                <div className="bg-indigo-600 rounded-t-lg shadow-lg p-4 grid grid-cols-[2fr_1fr_120px] items-center px-8">
                    <span className="text-white text-sm font-black uppercase">Main Data</span>
                    <span className="text-white text-sm font-black uppercase">Options</span>
                    <span className="text-white text-sm font-black uppercase text-center">Actions</span>
                </div>

                {/* Table Body Rows */}
                <div className="bg-white rounded-b-lg shadow-2xl border-x border-b border-slate-200 overflow-hidden">
                    {settingsRows.map((row, idx) => (
                        <div
                            key={row.id}
                            className={`grid grid-cols-[2fr_1fr_120px] items-center p-5 px-8 transition-colors hover:bg-indigo-50/30 ${idx !== settingsRows.length - 1 ? 'border-b border-slate-100' : ''}`}
                        >
                            {/* Title Column */}
                            <span className="text-slate-700 font-bold text-[13px] tracking-tight">{row.title}</span>

                            {/* Options Column */}
                            <div className="flex items-center gap-2">
                                {row.options.map((opt, i) => (
                                    <span
                                        key={i}
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border transition-all cursor-pointer
                                            ${i === 0 ? 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}
                                    >
                                        {opt}
                                    </span>
                                ))}
                            </div>

                            {/* Actions Column */}
                            <div className="flex items-center justify-center gap-2">
                                <button className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                    <Edit2 size={14} />
                                </button>
                                <button className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
};

export default FinCheckSetting;
