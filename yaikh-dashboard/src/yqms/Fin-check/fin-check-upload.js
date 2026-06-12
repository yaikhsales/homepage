import React from 'react';
import {
    Upload, FileBox, Database, CheckCircle2, AlertCircle, ArrowLeft,
    ShoppingCart, FileText, Printer, Ruler, Edit, Eye, Box, RefreshCw, Layers, Search, Shield, User,
    CloudUpload, Scissors, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';

const BWAWSpecUploadView = () => {
    const [currentPage, setCurrentPage] = React.useState(1);

    const page1Data = [
        { mo: "PTAF0393R", style: "122F0571", qty: "4,202", colors: 1, colorList: "300 ANTIQUE GREEN ACID", sizes: 7 },
        { mo: "PTAF0384", style: "122F0574", qty: "4,083", colors: 2, colorList: "900 CASUAL BLACK, 200 MOOD INDIGO", sizes: 6 },
        { mo: "PTAF0395", style: "122F0604", qty: "10,000", colors: 1, colorList: "406 DELICIOSO ACID WASH", sizes: 6 },
        { mo: "PTAF0394R", style: "122F0604", qty: "3,793", colors: 1, colorList: "108 LIGHT LEAFY CAMO", sizes: 6 },
        { mo: "PTAF0302", style: "134F0424", qty: "3,000", colors: 2, colorList: "200 SKY CAPTAIN, 122 804B", sizes: 6 },
        { mo: "PTAF0394T", style: "122F0604", qty: "207", colors: 1, colorList: "108 LIGHT LEAFY CAMO", sizes: 4 },
        { mo: "PTAF0408", style: "134F0428", qty: "5,996", colors: 2, colorList: "122 BFC07-142, 200 MOOD INDIGO", sizes: 6 },
        { mo: "PTAF0407", style: "134F0428", qty: "4,326", colors: 2, colorList: "300 SYCAMORE ACID WASH, 400 CHOCOLATE BROWN ACID WASH", sizes: 6 },
        { mo: "PTAF0305", style: "128A0215", qty: "1,500", colors: 1, colorList: "110 VANILLA ICE", sizes: 6 },
        { mo: "PTAF0237", style: "128A0215", qty: "4,784", colors: 3, colorList: "320 SEAGRASS, 900 CASUAL BLACK, ...", sizes: 6 },
    ];

    const page2Data = [
        { mo: "PTAF0305", style: "128A0215", qty: "1,500", colors: 1, colorList: "110 VANILLA ICE", sizes: 40 },
        { mo: "PTAF0419", style: "122F0575", qty: "3,330", colors: 1, colorList: "108 LIGHT PONY AOP", sizes: 40 },
        { mo: "PTAF0420", style: "122F0766", qty: "2,267", colors: 1, colorList: "416 CHOCOLATE BROWN ACID WASH", sizes: 40 },
        { mo: "PTAF0411R", style: "122F0573", qty: "3,753", colors: 1, colorList: "300 DARKEST SPRUCE", sizes: 40 },
        { mo: "PTAF0421R", style: "122F0604", qty: "3,645", colors: 1, colorList: "906 BBAW", sizes: 40 },
        { mo: "PTAF0422T", style: "122F0604", qty: "220", colors: 1, colorList: "112 B04B", sizes: 40 },
        { mo: "PTAF0422R", style: "122F0604", qty: "1,863", colors: 1, colorList: "112 B04B", sizes: 40 },
        { mo: "PTAF0394R", style: "122F0604", qty: "3,793", colors: 1, colorList: "108 LIGHT LEAFY CAMO", sizes: 40 },
        { mo: "PTAF0302", style: "134F0424", qty: "3,000", colors: 2, colorList: "200 SKY CAPTAIN, 122 B04B", sizes: 40 },
        { mo: "PTAF0237", style: "128A0215", qty: "4,784", colors: 3, colorList: "320 SEAGRASS, 900 CASUAL BLACK, ...", sizes: 40 },
    ];

    const currentData = currentPage === 1 ? page1Data : page2Data;

    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-10">
            {/* Dropzone Container - Smaller */}
            <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 flex flex-col items-center p-8 gap-6">
                <div className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center group hover:border-[#314CB6]/40 transition-all cursor-pointer bg-slate-50/50">
                    <div className="w-14 h-14 bg-[#EEE7FF] rounded-xl flex items-center justify-center text-[#6366F1] mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <CloudUpload className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-1">Before and After Wash Measurement Specs</h3>
                    <p className="text-gray-400 font-bold text-sm">Drag & drop your Excel file here or click to browse</p>
                </div>

                {/* Centered Actions */}
                <div className="flex items-center justify-center gap-4">
                    <button className="flex items-center gap-3 px-10 py-3 bg-[#7D8ADF] text-white rounded-xl font-black text-xs tracking-[0.2em] uppercase hover:bg-[#5D70D6] transition-all shadow-lg hover:shadow-[#5D70D6]/30">
                        <FileText className="w-4 h-4" />
                        Preview
                    </button>
                    <button className="flex items-center gap-3 px-12 py-3 bg-[#4EE39D] text-white rounded-xl font-black text-xs tracking-[0.2em] uppercase hover:bg-[#34D399] transition-all shadow-lg hover:shadow-[#34D399]/30">
                        <CheckCircle2 className="w-4 h-4" />
                        Save
                    </button>
                </div>
            </div>

            {/* Table Section - Larger */}
            <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
                {/* Table Header Area */}
                <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                            <Layers className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-xl text-gray-900">Uploaded Spec Status</h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#F59E0B] text-white rounded-lg font-black text-[10px] uppercase tracking-wider shadow-sm hover:bg-[#D97706] transition-colors">
                            <RefreshCw className="w-3.5 h-3.5" /> Fix Issues
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg font-black text-[10px] uppercase tracking-wider shadow-sm hover:bg-[#4338CA] transition-colors">
                            <Shield className="w-3.5 h-3.5" /> Fix TOL
                        </button>
                        <div className="relative ml-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter by MO No..."
                                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-blue-400 w-48"
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-2">
                    <div className="overflow-hidden border border-gray-200 rounded-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-200">
                                    <th className="px-6 py-4 text-[12px] font-black text-gray-700 uppercase">MO NO</th>
                                    <th className="px-6 py-4 text-[12px] font-black text-gray-700 uppercase">STYLE</th>
                                    <th className="px-6 py-4 text-[12px] font-black text-gray-700 uppercase">QTY</th>
                                    <th className="px-6 py-4 text-[12px] font-black text-gray-700 uppercase text-center">COLORS</th>
                                    <th className="px-6 py-4 text-[12px] font-black text-gray-700 uppercase">COLOR LIST</th>
                                    <th className="px-6 py-4 text-[12px] font-black text-gray-700 border-r border-gray-200 uppercase text-center">SIZES</th>
                                    <th className="px-6 py-4 text-[12px] font-black text-gray-700 border-r border-gray-200 uppercase text-center bg-yellow-100/40">B/W ISSUES</th>
                                    <th className="px-6 py-4 text-[12px] font-black text-gray-700 uppercase text-center bg-rose-100/40">A/W ISSUES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((row, i) => (
                                    <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-4 text-xs font-black text-[#5D70D6]">{row.mo}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-500">{row.style}</td>
                                        <td className="px-6 py-4 text-xs font-black text-slate-800">{row.qty}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-600 text-center">{row.colors}</td>
                                        <td className="px-6 py-4 text-[10px] font-black text-slate-500">{row.colorList}</td>
                                        <td className="px-6 py-4 text-xs font-black text-slate-800 text-center border-r border-gray-100">{row.sizes}</td>
                                        <td className="px-6 py-4 bg-slate-50/30 text-center border-r border-gray-100">
                                            <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 mx-auto w-fit">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span className="text-[9px] font-black uppercase tracking-tighter">OK</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 bg-slate-50/30 text-center">
                                            <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 mx-auto w-fit">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span className="text-[9px] font-black uppercase tracking-tighter">OK</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Footer */}
                <div className="p-6 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-400">
                        Showing page <span className="text-gray-600">{currentPage}</span> of <span className="text-gray-600">60</span> (593 records)
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:bg-gray-50 transition-colors border border-gray-200"
                        >
                            <ChevronLeft className="w-3 h-3" />
                        </button>
                        {[1, 2, 3, 4, 5].map((p) => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                className={`w-6 h-6 rounded-md text-sm font-black transition-all ${currentPage === p ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {p}
                            </button>
                        ))}
                        <span className="text-gray-300 px-2 font-black">...</span>
                        <button
                            onClick={() => setCurrentPage(60)}
                            className={`w-6 h-6 rounded-md text-sm font-black transition-all ${currentPage === 60 ? 'bg-[#314CB6] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            60
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(60, currentPage + 1))}
                            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:bg-gray-50 transition-colors border border-gray-200"
                        >
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FinCheckUpload = ({ onBack }) => {
    const [activeLeftTab, setActiveLeftTab] = React.useState('YorkSys\nOrders');
    const [activeRightTab, setActiveRightTab] = React.useState('Upload\nOrder');

    const navItems = [
        // Left Section (Indices 0-5)
        { icon: ShoppingCart, label: "YorkSys\nOrders", section: 'left' },
        { icon: Upload, label: "BW/AW\nSpec Upload", section: 'left' },
        { icon: Printer, label: "MES.\nPrint", section: 'left' },
        { icon: Ruler, label: "BW\nMes. Specs", section: 'left' },
        { icon: FileText, label: "AW\nMes. Specs", section: 'left' },
        { icon: Edit, label: "Modify\nDT Spec", section: 'left' },
        // Right Section (Indices 6-10)
        { icon: CloudUpload, label: "Upload\nOrder", section: 'right' },
        { icon: Eye, label: "View\nOrders", section: 'right' },
        { icon: Layers, label: "Product\nType", section: 'right' },
        { icon: RefreshCw, label: "Sync from\nCutting", section: 'right' },
        { icon: Scissors, label: "RIB\nContent", section: 'right' }
    ];

    const activeLeftItem = navItems.find(item => item.label === activeLeftTab) || navItems[0];
    const activeRightItem = navItems.find(item => item.label === activeRightTab) || navItems[6];

    const isBWAWView = activeLeftTab === "BW/AW\nSpec Upload";

    return (
        <div className="w-full min-h-screen bg-[#F1F5F9] flex flex-col">
            {/* Professional Blue Header */}
            <div className="w-full bg-gradient-to-r from-[#5340C7] via-[#9F37B3] to-[#C9338D] text-white p-4 shadow-lg relative z-50 rounded-xl">
                <div className="flex items-center justify-between gap-4 max-w-full mx-auto px-4">
                    {/* Brand Section */}
                    <div className="flex items-center gap-4 shrink-0">
                        {/* Back Button */}
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all group shadow-sm active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5 text-white transition-transform group-hover:-translate-x-0.5" />
                        </button>

                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold leading-none tracking-tight uppercase flex flex-col">
                                <span className="text-xl font-black">Fin Check System |</span>
                                <span className="text-xl font-black -mt-0.5">Measurements</span>
                            </h1>
                            <p className="text-white text-[10px] font-bold uppercase mt-1">QA Measurement & Specification System</p>
                        </div>

                        {/* PRO Badge */}
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm ml-2">
                            <Sparkles size={11} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-[10px] font-black tracking-wider text-white">PRO</span>
                        </div>
                    </div>

                    {/* Centered Navigation Bar */}
                    <div className="flex-1 max-w-5xl bg-white/10 backdrop-blur-md rounded-[1.2rem] p-2 border border-white/10 flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {navItems.map((item, i) => {
                            const isActive = item.section === 'left'
                                ? activeLeftTab === item.label
                                : activeRightTab === item.label;

                            return (
                                <React.Fragment key={i}>
                                    {i === 6 && <div className="w-[1px] h-10 bg-white/20 mx-2 shrink-0" />}
                                    <div
                                        onClick={() => {
                                            if (item.section === 'left') setActiveLeftTab(item.label);
                                            else setActiveRightTab(item.label);
                                        }}
                                        className={`flex flex-col items-center justify-center min-w-[85px] h-16 rounded-xl transition-all cursor-pointer relative group ${isActive ? 'bg-white text-[#314CB6] shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-2 border-white/50' : 'text-white/60 hover:bg-white/10'}`}
                                    >
                                        {isActive && (
                                            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-white shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                                        )}
                                        <item.icon className={`w-4 h-4 mb-1.5 transition-transform group-hover:scale-110 ${isActive ? 'text-[#314CB6]' : 'text-white'}`} />
                                        <span className={`text-[10px] font-black text-center whitespace-pre-line leading-[1.1] tracking-tight ${isActive ? 'text-[#314CB6]' : 'text-white'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Right System Boxes */}
                    <div className="flex items-center gap-4 shrink-0">
                        {/* Status Box */}
                        <div className="flex items-center gap-3 py-2 px-4 bg-white/10 rounded-2xl border border-white/10 min-w-[130px] shadow-sm">
                            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34D399] shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
                                    {activeRightTab.replace('\n', ' ')}
                                </span>
                                <span className="text-[8px] font-bold text-white/40 uppercase mt-0.5 whitespace-nowrap">Active Module</span>
                            </div>
                        </div>

                        {/* User Box */}
                        <div className="flex items-center gap-3 py-2 px-4 bg-white/5 rounded-2xl border border-white/10">
                            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shrink-0">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-white leading-none">QA Officer</span>
                                <span className="text-[9px] font-bold text-white/40 uppercase mt-1">ID: YM7625</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col items-center ${isBWAWView ? 'justify-start pt-10' : 'justify-center'} px-10 bg-gradient-to-br from-gray-50/50 to-gray-50/50 overflow-y-auto`}>
                <div className="w-full">
                    {isBWAWView ? (
                        <BWAWSpecUploadView />
                    ) : (
                        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 flex flex-col items-center p-8 gap-10">
                                {/* Dropzone Container */}
                                <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center text-center group hover:border-[#314CB6]/40 transition-all cursor-pointer bg-slate-50/50">
                                    <div className="w-16 h-16 bg-[#F0EEFF] rounded-2xl flex items-center justify-center text-[#6366F1] mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                        <CloudUpload className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-[1.2rem] font-black text-slate-800 mb-2">
                                        {activeLeftTab.replace('\n', ' ')} | Drag & drop your .xls file here
                                    </h3>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap">or click to browse from your computer</p>
                                </div>

                                {/* Centered Actions */}
                                <div className="flex items-center justify-center gap-4">
                                    <button className="flex items-center gap-3 px-10 py-3.5 bg-[#7D8ADF] text-white rounded-xl font-black text-xs tracking-[0.2em] uppercase hover:bg-[#5D70D6] transition-all shadow-lg hover:shadow-[#5D70D6]/30">
                                        <Eye className="w-4 h-4" />
                                        Preview
                                    </button>
                                    <button className="flex items-center gap-3 px-12 py-3.5 bg-[#4EE39D] text-white rounded-xl font-black text-xs tracking-[0.2em] uppercase hover:bg-[#34D399] transition-all shadow-lg hover:shadow-[#34D399]/30">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Optional Back Shortcut */}

            </div>
        </div>
    );
};

export default FinCheckUpload;
