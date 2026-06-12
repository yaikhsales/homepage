import React, { useState } from 'react';
import {
    ArrowLeft, LayoutGrid, FileText, BarChart3, Download,
    Bot, ShieldCheck, Bell, FileCode2, Search, Filter,
    Calendar, Save, RotateCcw, Trash2, MoreVertical, Info,
    CheckCircle2, Clock, Users, Sparkles, Settings2, Hash,
    Layers, Box, UserCircle, Truck, Factory, ChevronDown
} from 'lucide-react';

const FinCheckReport = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('Reports');

    const tabs = [
        { id: 'Reports', icon: FileText, label: 'Reports' },
        { id: 'Analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'Export', icon: Download, label: 'Export' },
        { id: 'AI', icon: Bot, label: 'AI' },
        { id: 'Assignees', icon: ShieldCheck, label: 'Assignees' },
        { id: 'Notify', icon: Bell, label: 'Notify Group' },
        { id: 'Modify', icon: FileCode2, label: 'Modify' }
    ];

    const reportData = [
        {
            id: "1",
            date: "2/19/2026",
            reportId: "9862276448",
            poLine: "716801",
            orderNo: "GPRT0017DB",
            custStyle: "P21-453411",
            reportName: "Final Inspection",
            qaId: "YNAR93",
            qaName: "Ny Danet",
            factory: "YM",
            sampleSize: 80,
            createdDate: "2/19/2026",
            createdTime: "03:31 PM",
            updatedDate: "2/19/2026",
            updatedTime: "03:32 PM",
            qaStatus: "PENDING",
            leaderDecision: "PENDING"
        },
        {
            id: "2",
            date: "2/19/2028",
            reportId: "2012455540",
            poLine: "-",
            orderNo: "YMCMT26003",
            custStyle: "SC26-0006",
            reportName: "Inline Inspection-Sewing",
            qaId: "YM6438",
            qaName: "Mili Lutchansotheary",
            factory: "YM",
            sampleSize: 60,
            createdDate: "2/19/2026",
            createdTime: "03:28 PM",
            updatedDate: "2/19/2026",
            updatedTime: "03:33 PM",
            qaStatus: "COMPLETED",
            leaderDecision: "APPROVE"
        },
        {
            id: "3",
            date: "2/19/2026",
            reportId: "R794717100",
            poLine: "-",
            orderNo: "YMCMH26001",
            custStyle: "RDW262SD01",
            reportName: "Inline Inspection-Sewing",
            qaId: "YM6438",
            qaName: "Mili Lutchansotheary",
            factory: "YM",
            sampleSize: 80,
            createdDate: "2/19/2026",
            createdTime: "03:24 PM",
            updatedDate: "2/19/2026",
            updatedTime: "03:26 PM",
            qaStatus: "COMPLETED",
            leaderDecision: "PENDING"
        },
        {
            id: "4",
            date: "2/19/2026",
            reportId: "7294979555",
            poLines: ["4500278887", "4500278888", "4500278889"],
            orderNo: "GPAR12343NOS",
            custStyle: "FFS 88-03-44504-SU26",
            reportName: "Final Inspection",
            qaId: "YM6845",
            qaName: "Oui Dina",
            factory: "YM",
            sampleSize: 200,
            createdDate: "2/18/2026",
            createdTime: "03:18 PM",
            updatedDate: "2/19/2026",
            updatedTime: "03:37 PM",
            qaStatus: "PENDING",
            leaderDecision: "PENDING"
        },
        {
            id: "5",
            date: "2/19/2028",
            reportId: "5292105119",
            poLine: "-",
            orderNo: "YMCMT26002",
            custStyle: "SC26-0011",
            reportName: "Inline Inspection-Sewing",
            qaId: "YM6438",
            qaName: "Mili Lutchansotheary",
            factory: "YM",
            sampleSize: 140,
            createdDate: "2/18/2026",
            createdTime: "03:14 PM",
            updatedDate: "2/19/2026",
            updatedTime: "03:33 PM",
            qaStatus: "COMPLETED",
            leaderDecision: "PENDING"
        },
        {
            id: "6",
            date: "2/20/2026",
            reportId: "3134303022",
            poLines: ["4500277229", "4500277230", "4500277231"],
            orderNo: "GPAR12299",
            custStyle: "FFS 99-03-44504-SU26",
            reportName: "Inline Inspection-Sewing",
            qaId: "YM7960",
            qaName: "Koeng Phearom",
            factory: "YM",
            sampleSize: 40,
            createdDate: "2/20/2026",
            createdTime: "08:13 AM",
            updatedDate: "2/20/2026",
            updatedTime: "08:23 AM",
            qaStatus: "PENDING",
            leaderDecision: "PENDING"
        },
        {
            id: "7",
            date: "2/20/2026",
            reportId: "8803317912",
            poLines: ["4500278884", "4500278885", "4500278886"],
            orderNo: "GPARI2344NOS",
            custStyle: "FFS 99-06-41367-R-SU26",
            reportName: "Final Inspection",
            qaId: "YM6845",
            qaName: "Oui Dina",
            factory: "YM",
            sampleSize: 200,
            createdDate: "2/20/2026",
            createdTime: "07:50 AM",
            updatedDate: "2/20/2026",
            updatedTime: "08:34 AM",
            qaStatus: "PENDING",
            leaderDecision: "PENDING"
        },
        {
            id: "8",
            date: "2/20/2026",
            reportId: "9924255744",
            poLines: ["4500281518", "4500281519", "4500281520"],
            orderNo: "GPARI2378NOS",
            custStyle: "FFS 99-06-41367-R-SU26",
            reportName: "EMB First Output",
            qaId: "YM8463",
            qaName: "Mit Korona",
            factory: "Datung",
            sampleSize: 25,
            createdDate: "2/20/2026",
            createdTime: "07:44 AM",
            updatedDate: "2/20/2026",
            updatedTime: "07:47 AM",
            qaStatus: "COMPLETED",
            leaderDecision: "PENDING"
        },
        {
            id: "9",
            date: "2/20/2026",
            reportId: "4878420398",
            poLines: ["4500275870", "4500275921", "4500275922"],
            orderNo: "GPAR12251",
            custStyle: "FFS 99-03-43950-SU26(CB10)",
            reportName: "Inline Inspection-Sewing",
            qaId: "YM8491",
            qaName: "Phet Chheng",
            factory: "YM",
            sampleSize: 40,
            createdDate: "2/20/2026",
            createdTime: "07:43 AM",
            updatedDate: "2/20/2026",
            updatedTime: "08:22 AM",
            qaStatus: "COMPLETED",
            leaderDecision: "PENDING"
        },
        {
            id: "10",
            date: "2/20/2026",
            reportId: "3307962804",
            poLine: "718665",
            orderNo: "GPRT00203",
            custStyle: "RO2-494491",
            reportName: "Inline Inspection-Sewing",
            qaId: "YM8857",
            qaName: "Bin Chantha",
            factory: "YM",
            sampleSize: 80,
            createdDate: "2/20/2026",
            createdTime: "07:38 AM",
            updatedDate: "2/20/2026",
            updatedTime: "08:06 AM",
            qaStatus: "PENDING",
            leaderDecision: "PENDING"
        },
        {
            id: "11",
            date: "2/20/2026",
            reportId: "4982640852",
            poLines: ["4500277235", "4500277236", "4500277237"],
            orderNo: "GPAR12307",
            custStyle: "FFS 99-03-43950-SU26",
            reportName: "EMB First Output",
            qaId: "YM8463",
            qaName: "Mit Korona",
            factory: "Datung",
            sampleSize: 25,
            createdDate: "2/20/2026",
            createdTime: "07:34 AM",
            updatedDate: "2/20/2026",
            updatedTime: "07:43 AM",
            qaStatus: "COMPLETED",
            leaderDecision: "PENDING"
        }
    ];

    return (
        <div className="w-full flex flex-col min-h-screen bg-[#F1F5F9]">
            {/* High-Fidelity Header */}
            <div className="w-full bg-gradient-to-r from-[#5340C7] via-[#9F37B3] to-[#C9338D] p-4 flex flex-col gap-4 rounded-lg">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="w-10 h-10 bg-[#FBBF24] rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-all text-white font-black">
                            <ArrowLeft size={20} strokeWidth={3} />
                            <span className="sr-only">YQMS</span>
                        </button>
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/20">
                            <LayoutGrid size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h1 className="text-white font-black text-2xl tracking-tight">Fincheck | Reports</h1>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm group/pro cursor-help">
                                    <Sparkles size={11} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-[10px] font-black tracking-wider text-white">PRO</span>
                                </div>
                            </div>
                            <p className="text-white text-[13px] font-bold opacity-90">All Inspection Reports</p>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center bg-white/10 rounded-2xl p-1 border border-white/40 backdrop-blur-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col items-center justify-center w-20 py-2 rounded-xl transition-all gap-1 ${activeTab === tab.id
                                    ? 'font-black bg-white'
                                    : 'hover:bg-white/20'
                                    }`}
                            >
                                <tab.icon size={18} className={activeTab === tab.id ? 'text-purple-500' : 'text-white'} />
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${activeTab === tab.id ? 'text-purple-500' : 'text-white'}`}>
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-2.5 shadow-lg border border-white/80">
                        <div className="w-10 h-10 rounded-xl bg-orange-400 flex items-center justify-center border border-white/20">
                            <Users size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col pr-4">
                            <span className="text-[12px] font-black text-white leading-tight">QA Officer</span>
                            <span className="text-[10px] font-bold text-white/80">YM7625</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full flex flex-col p-4 gap-4">
                {/* Advanced Filters */}
                <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
                                <Filter size={18} />
                            </div>
                            <h2 className="text-base font-black text-[#0A2540]">Filters</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-black hover:bg-indigo-100 transition-all border border-indigo-100">
                                <Save size={14} />
                                SAVE FILTER
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[11px] font-black hover:bg-emerald-100 transition-all border border-emerald-100">
                                <RotateCcw size={14} />
                                RESET/DEFAULT
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[11px] font-black hover:bg-rose-100 transition-all border border-rose-100">
                                <Trash2 size={14} />
                                RESET ALL
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
                        {[
                            { label: "START DATE", value: "02/19/2026", icon: Calendar, type: 'date' },
                            { label: "END DATE", value: "02/19/2026", icon: Calendar, type: 'date' },
                            { label: "REPORT ID", placeholder: "10-digit ID..", icon: Hash },
                            { label: "QA ID", placeholder: "Search ID or N..", icon: Users },
                            { label: "ORDER NO", placeholder: "Search Order..", icon: Search },
                            { label: "REPORT NAME", placeholder: "Select Reports..", icon: FileText, isSelect: true },
                            { label: "ORDER TYPE", icon: Layers, isSelect: true, default: "All Types" },
                            { label: "PRODUCT TYPE", icon: Box, isSelect: true, placeholder: "Select Products.." },
                            { label: "CUST. STYLE", placeholder: "Search Style..", icon: Search },
                            { label: "BUYER", icon: UserCircle, isSelect: true, placeholder: "Select Buyers.." },
                            { label: "SUPPLIER", icon: Truck, isSelect: true, placeholder: "Select Suppliers.." },
                            { label: "EXT. FACTORY", icon: Factory, isSelect: true, placeholder: "Select External.." }
                        ].map((filter, i) => (
                            <div key={i} className="flex flex-col gap-1.5">
                                <label className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1.5">
                                    {filter.icon && <filter.icon size={12} className="text-indigo-400" />}
                                    {filter.label}
                                </label>
                                <div className="relative group">
                                    {filter.isSelect ? (
                                        <div className="relative">
                                            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-[11px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 appearance-none">
                                                <option>{filter.default || filter.placeholder || `Select..`}</option>
                                            </select>
                                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                defaultValue={filter.value}
                                                placeholder={filter.placeholder}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-[11px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                                            />
                                            {filter.type === 'date' && (
                                                <Calendar size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Results Header */}
                <div className="w-full bg-white rounded-lg shadow-sm border p-6 border-slate-200 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <FileText size={20} />
                            </div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-[#0A2540]">Results</h2>
                                <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-3 py-1 rounded-full border border-slate-200">52</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {["QA Status..", "Leader Decision..", "Season..", "Filter PO Line..."].map((ph, i) => (
                                    <input key={i} type="text" placeholder={ph} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold text-slate-600 w-36" />
                                ))}
                            </div>
                            <button className="flex items-center gap-2 px-6 py-2 bg-white text-red-600 rounded-xl text-[12px] font-black border border-red-300 shadow-sm hover:bg-red-50">
                                <Settings2 size={16} />
                                CUSTOMIZE
                            </button>
                        </div>
                    </div>



                    {/* Table Container */}
                    <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full border-collapse min-w-[1200px]">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Date</th>
                                    <th className="px-4 py-4 text-left text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Report ID</th>
                                    <th className="px-4 py-4 text-left text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">PO Line</th>
                                    <th className="px-4 py-4 text-left text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Order No</th>
                                    <th className="px-4 py-4 text-left text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Cust. Style</th>
                                    <th className="px-4 py-4 text-left text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Report Name</th>
                                    <th className="px-4 py-4 text-left text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">QA ID</th>
                                    <th className="px-4 py-4 text-left text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Factory</th>
                                    <th className="px-4 py-4 text-center text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Sample Size</th>
                                    <th className="px-4 py-4 text-left text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Created Date</th>
                                    <th className="px-4 py-4 text-left text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Updated Date</th>
                                    <th className="px-4 py-4 text-center text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">QA Status</th>
                                    <th className="px-4 py-4 text-center text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Resubmission</th>
                                    <th className="px-4 py-4 text-center text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Leader Dec..</th>
                                    <th className="px-4 py-4 text-center text-[12px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reportData.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group h-16">
                                        <td className="px-6 py-2 align-middle">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-300" />
                                                <span className="text-xs font-black text-[#0A2540] whitespace-nowrap">{row.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 align-middle">
                                            <button className="text-blue-600 hover:underline text-[11px] font-black tracking-tight">{row.reportId}</button>
                                        </td>
                                        <td className="px-4 py-2 align-middle">
                                            <div className="flex flex-col justify-center min-h-[40px]">
                                                {row.poLines ? (
                                                    <div className="flex flex-col leading-tight">
                                                        {row.poLines.map((l, i) => (
                                                            <span key={i} className="text-[9px] font-bold text-slate-500">{l}</span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] font-bold text-slate-400">{row.poLine}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 align-middle text-[11px] font-black text-[#0A2540]">{row.orderNo}</td>
                                        <td className="px-4 py-2 align-middle text-[11px] font-bold text-slate-500 italic whitespace-nowrap">{row.custStyle}</td>
                                        <td className="px-4 py-2 align-middle text-[11px] font-bold text-slate-600 leading-tight min-w-[150px]">{row.reportName}</td>
                                        <td className="px-4 py-2 align-middle">
                                            <div className="flex items-center gap-2 min-w-[180px]">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center border border-slate-200">
                                                    <Users size={14} className="text-slate-400" />
                                                </div>
                                                <div className="flex flex-col leading-tight">
                                                    <span className="text-[11px] font-black text-[#0A2540]">{row.qaId}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 truncate max-w-[100px] mt-1">{row.qaName}</span>
                                                </div>
                                                <Info size={14} className="text-slate-300 flex-shrink-0 ml-auto" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 align-middle text-[11px] font-black text-slate-600">{row.factory}</td>
                                        <td className="px-4 py-2 align-middle text-center">
                                            <span className="text-sm font-black text-blue-700">{row.sampleSize}</span>
                                        </td>
                                        <td className="px-4 py-2 align-middle">
                                            <div className="flex flex-col leading-tight">
                                                <span className="text-[11px] font-black text-[#0A2540]">{row.createdDate}</span>
                                                <div className="flex items-center gap-1 text-slate-400 mt-1">
                                                    <Clock size={10} />
                                                    <span className="text-[10px] font-bold uppercase">{row.createdTime}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 align-middle">
                                            <div className="flex flex-col leading-tight">
                                                <span className="text-[11px] font-black text-[#0A2540]">{row.updatedDate}</span>
                                                <div className="flex items-center gap-1 text-slate-400 mt-1">
                                                    <Clock size={10} />
                                                    <span className="text-[10px] font-bold uppercase">{row.updatedTime}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2 align-middle">
                                            <div className={`mx-auto flex items-center justify-center gap-2 px-2 py-1 rounded-full border ${row.qaStatus === 'COMPLETED'
                                                ? 'bg-emerald-100 text-emerald-600 border-emerald-200'
                                                : 'bg-red-100 text-red-600 border-red-200'
                                                }`}>
                                                <span className="text-[9px] font-black tracking-widest lowercase first-letter:uppercase">{row.qaStatus}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 align-middle text-center">
                                            <span className="text-sm text-slate-300">N/A</span>
                                        </td>
                                        <td className="px-6 py-2 align-middle">
                                            <div className={`mx-auto flex items-center justify-center gap-2 px-2 py-1 rounded-full border ${row.leaderDecision === 'APPROVE'
                                                ? 'bg-emerald-100 text-emerald-600 border-emerald-200 '
                                                : 'bg-red-100 text-red-600 border-red-200'
                                                }`}>
                                                <span className="text-[9px] font-black tracking-widest lowercase first-letter:uppercase">{row.leaderDecision}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 align-middle text-center">
                                            <button className="p-2 text-slate-300 hover:text-blue-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            PAGE 1 OF 2
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 bg-slate-50 text-slate-300 rounded-xl text-[11px] font-black border border-slate-200 cursor-not-allowed">
                                PREVIOUS
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center bg-white text-[#0A2540] rounded-xl text-[11px] font-black border border-slate-200 shadow-sm">
                                1
                            </button>
                            <button className="px-6 py-2 bg-white text-[#0A2540] rounded-xl text-[11px] font-black border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
                                NEXT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinCheckReport;
