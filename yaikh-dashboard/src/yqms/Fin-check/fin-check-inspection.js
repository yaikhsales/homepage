import React from 'react';
import {
    ArrowLeft, Upload, ChevronRight, FileType, Activity, Settings, Calendar,
    Shield, Sparkles, Plus, Search, LayoutGrid, Layout, Camera, Info, Bug,
    ClipboardCheck, History, Bell, User, Box, QrCode, CheckCircle2, MoreVertical, FileText
} from 'lucide-react';

const FinCheckInspection = ({ onBack, selectedStyle, setSelectedStyle, view, setView, defects, updateDefect, decision, setDecision }) => {
    const [activeNavTab, setActiveNavTab] = React.useState('Order');
    const [activeSectionTab, setActiveSectionTab] = React.useState('Single');
    const [inspectionType, setInspectionType] = React.useState('First Inspection');
    const [searchQuery, setSearchQuery] = React.useState('');

    // Style Selection View
    if (view === 'selection') {
        return (
            <div className="w-full flex flex-col min-h-screen bg-[#F0F4F8]">
                {/* High-Fidelity Header */}
                <div className="w-full bg-gradient-to-r from-[#5340C7] via-[#9F37B3] to-[#C9338D] p-4 shadow-xl relative z-50 rounded-b-xl">
                    <div className="w-full flex items-center justify-between gap-4 px-4">
                        {/* Brand Section */}
                        <div className="flex items-center gap-4 shrink-0">
                            <button
                                onClick={onBack}
                                className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center border border-white/20 hover:scale-105 transition-all shadow-lg text-white font-black active:scale-95"
                            >
                                <ArrowLeft size={20} strokeWidth={3} />
                            </button>
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/40">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-black text-white leading-tight flex items-center gap-2">
                                    Fin Check | Inspection
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                                        <Sparkles size={12} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-[10px] font-black tracking-wider text-white">PRO</span>
                                    </div>
                                </h1>
                                <p className="text-white/80 text-[10px] font-bold uppercase mt-0.5">Quality Inspection Data Collection</p>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex-1 max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/40 flex items-center gap-1 mx-4">
                            {[
                                { id: 'Order', icon: LayoutGrid, count: null },
                                { id: 'Header', icon: Layout, count: null },
                                { id: 'Photos', icon: Camera, count: null },
                                { id: 'Info', icon: Info, count: null },
                                { id: 'Defects', icon: Bug, count: null },
                                { id: 'Summary', icon: ClipboardCheck, count: null },
                                { id: 'History', icon: History, count: null },
                                { id: 'Notifications', icon: Bell, count: 1 }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveNavTab(tab.id)}
                                    className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all relative group ${activeNavTab === tab.id ? 'bg-white shadow-lg scale-105' : 'text-white hover:text-white hover:bg-white/5'}`}
                                >
                                    {tab.count !== null && (
                                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#EF4444] rounded-full flex items-center justify-center text-[11px] font-black text-white ring-[2.5px] ring-[#9F37B3] shadow-lg z-10">
                                            {tab.count}
                                        </div>
                                    )}
                                    {activeNavTab === tab.id && (
                                        <div className="absolute top-1 right-1 translate-x-1/2 -mt-2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34D399]" />
                                    )}
                                    <tab.icon size={18} className={`mb-1 transition-transform group-hover:scale-110 ${activeNavTab === tab.id ? 'text-[#6366F1]' : 'text-current'}`} />
                                    <span className={`text-[9px] font-black uppercase tracking-tighter ${activeNavTab === tab.id ? 'text-[#6366F1]' : 'text-current'}`}>
                                        {tab.id}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4 shrink-0">
                            <div className="flex items-center gap-3 py-2 px-4 bg-white/10 rounded-2xl border border-white/40">
                                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34D399] shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase text-white leading-none">Order</span>
                                    <span className="text-[8px] font-bold text-white/50 uppercase mt-0.5">All saved</span>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2.5 bg-white text-[#6366F1] rounded-xl font-black text-[11px] uppercase tracking-wider shadow-lg hover:bg-gray-50 transition-all border border-white/50">
                                <Plus size={16} strokeWidth={3} />
                                New Inspection
                            </button>
                            <div className="flex items-center gap-3 py-2 px-4 bg-black/10 rounded-2xl border border-white/40">
                                <div className="w-9 h-9 rounded-xl bg-orange-400 flex items-center justify-center shadow-lg">
                                    <User className="text-white w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-white leading-none">QA Officer</span>
                                    <span className="text-[9px] font-bold text-white/50 uppercase mt-1">ID: YM7625</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-Header Area */}
                <div className="w-full px-4 py-4">
                    <div className="w-full max-w-8xl mx-auto flex flex-col gap-4">
                        {/* Purple Module Header */}
                        <div className="w-full bg-[#8B5CF6] p-3 rounded-xl flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white">
                                    <Box size={20} />
                                </div>
                                <h3 className="text-white font-black text-xl tracking-tight uppercase">Order</h3>
                            </div>
                            <div className="flex items-center bg-white rounded-xl p-1 gap-1 shadow-inner border border-slate-200">
                                {[
                                    { id: 'Scan QR', icon: QrCode },
                                    { id: 'Single', icon: CheckCircle2 },
                                    { id: 'Multi', icon: Activity },
                                    { id: 'Batch', icon: LayoutGrid }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSectionTab(item.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold  transition-all ${activeSectionTab === item.id ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-200' : 'text-slate-400 hover:bg-slate-50'}`}
                                    >
                                        <item.icon size={14} />
                                        {item.id}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Conditional Secondary Header or Filter Card */}
                        {activeSectionTab === 'Scan QR' ? (
                            /* Thin Instruction Bar for Scan QR */
                            <div className="w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2.5">
                                <p className="text-gray-500 text-[12px] font-bold">Scan a QR code to load an existing inspection report.</p>
                            </div>
                        ) : (
                            /* Filter Card for Order/Single/Multi/Batch */
                            <div className="w-full bg-white rounded-2xl shadow-xl p-4 border border-slate-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-current/10 shadow-sm">
                                        <Box size={14} />
                                    </div>
                                    <p className="text-gray-600 text-sm font-bold">Select a single order for Inspection.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {/* Date Picker Mock */}
                                    <div className="relative flex-1 group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-4 h-4" />
                                        <input
                                            type="text"
                                            value="02/20/2026"
                                            readOnly
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-12 pr-10 text-slate-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
                                        />
                                    </div>

                                    {/* Inspection Type Toggle */}
                                    <div className="flex items-center bg-slate-50 rounded-xl p-0.5 border border-slate-200 flex-[1.5]">
                                        {['First Inspection', 'Re-Inspection'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setInspectionType(type)}
                                                className={`flex-1 py-2 pl-10 pr-4 rounded-lg text-sm font-black transition-all ${inspectionType === type ? 'bg-white text-emerald-600 shadow-lg border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Order Search */}
                                    <div className="relative flex-[2]">
                                        <div className="absolute -top-6 left-0 flex items-center gap-1.5">
                                            <span className="text-[10px] font-black text-gray-600 uppercase">Order No</span>
                                        </div>
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                            <input
                                                type="text"
                                                placeholder="Search MO Number..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-12 pr-6 text-slate-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Main Content Area - Dynamic based on Tab */}
                        {activeSectionTab === 'Scan QR' ? (
                            /* Scan QR View */
                            <div className="w-full bg-white rounded-xl shadow-xl p-10 border border-slate-100 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4 shadow-sm">
                                    <QrCode size={32} />
                                </div>
                                <h3 className="text-[28px] font-black text-slate-800 mb-10">Previous Inspection Report</h3>

                                <div className="w-full grid grid-cols-2 gap-20 max-w-6xl">
                                    {/* Manual Entry Column */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 shadow-sm border border-blue-100/50">
                                                <FileText size={20} />
                                            </div>
                                            <span className="text-xl font-black text-slate-800">Manual Entry</span>
                                        </div>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                placeholder="Enter Report ID"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-10 text-lg font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800"
                                            />
                                            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#7D8ADF] rounded-xl flex items-center justify-center text-white shadow-xl hover:bg-[#5D70D6] transition-all hover:scale-105 active:scale-95">
                                                <Search size={24} strokeWidth={3} />
                                            </button>
                                        </div>
                                        <p className="text-[13px] font-bold text-slate-400 pl-4">Type the unique ID found on the top of the report.</p>
                                    </div>

                                    {/* Scan QR Column */}
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="p-2.5 bg-purple-50 rounded-2xl text-purple-600 shadow-sm border border-purple-100/50">
                                                <Camera size={20} />
                                            </div>
                                            <span className="text-xl font-black text-slate-800">Scan QR Code</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <button className="flex flex-col items-center justify-center gap-5 p-10 border-2 border-dashed border-slate-200 rounded-[2rem] hover:bg-slate-50 hover:border-indigo-300 transition-all group/cam relative overflow-hidden">
                                                <div className="p-4 bg-white rounded-2xl shadow-lg text-purple-600 group-hover/cam:scale-110 transition-transform border border-slate-50 relative z-10">
                                                    <Camera size={28} />
                                                </div>
                                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest relative z-10">Use Camera</span>
                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-indigo-50/50 opacity-0 group-hover/cam:opacity-100 transition-opacity" />
                                            </button>
                                            <button className="flex flex-col items-center justify-center gap-5 p-10 border-2 border-dashed border-slate-200 rounded-[2rem] hover:bg-slate-50 hover:border-indigo-300 transition-all group/up relative overflow-hidden">
                                                <div className="p-4 bg-white rounded-2xl shadow-lg text-blue-600 group-hover/up:scale-110 transition-transform border border-slate-50 relative z-10">
                                                    <Upload size={28} />
                                                </div>
                                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest relative z-10">Upload Image</span>
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/50 opacity-0 group-hover/up:opacity-100 transition-opacity" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Center Empty State (Order/Single View) */
                            <div className="w-full bg-white rounded-2xl shadow-xl p-24 border border-slate-100 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6 shadow-inner">
                                    <Search size={40} className="stroke-[1.5]" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2 mt-4">Search for an Order</h3>
                                <p className="text-slate-400 font-bold max-w-sm text-sm">Enter an MO Number to load order details for inspection.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default FinCheckInspection;
