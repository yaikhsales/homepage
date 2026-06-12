import React from 'react';
import {
    Upload, BarChart3, Download, FileText,
    Shield, User, Sparkles, Plus, Search,
    CheckCircle2, Camera, Bell, Info, ArrowLeft,
    Filter, Calendar, ChevronLeft, ChevronRight,
    User2, XCircle, Clock, LayoutGrid, Building2,
    Hammer, Tag, Shirt, ClipboardList,
    Zap, Factory, Microscope, MessageSquare
} from 'lucide-react';
import InspectionReportDetail from './inspection-report-detail';

const SummaryView = ({ onViewReport }) => {
    const filters = [
        { label: 'Inspector', icon: User2 },
        { label: 'Status', icon: CheckCircle2, type: 'select', options: ['All Status', 'Accepted', 'Reworked', 'Pending'] },
        { label: 'Report Type', icon: ClipboardList },
        { label: 'Supplier', icon: Building2 },
        { label: 'Project', icon: Hammer },
        { label: 'PO #', icon: Tag },
        { label: 'Style', icon: Shirt },
    ];

    const stats = [
        { label: 'TOTAL INSPECTIONS', value: '26,111', color: 'blue', icon: FileText },
        { label: 'ACCEPTED', value: '12,106', color: 'emerald', icon: CheckCircle2 },
        { label: 'REWORKED', value: '13,729', color: 'rose', icon: XCircle },
        { label: 'PENDING APPROVAL', value: '93', color: 'amber', icon: Clock },
    ];

    const tableData = [
        { no: 1, date: '01/01/2026, 02:00 AM', inspector: 'Khen Sokhorn', status: 'Accepted', type: 'Interim Inspection', etd: '01/02/2026', eta: '01/04/2026', po: 'PIC0040B', style: 'CRI411CC-01', submitted: '12/31/2025, 02:30 PM', qty: 20000, qtyInspected: 4000, total: 20000, comments: 'Supplier Booking Comments:第二次返箱后抽查 *', project: 'TRUE NORTH', sample: 80, factory: 'YY' },
        { no: 2, date: '01/01/2026, 01:30 AM', inspector: 'Choy Sreyng', status: 'Accepted', type: 'Interim Inspection', etd: '01/23/2026', eta: '01/04/2026', po: 'PIC00398', style: 'STG08817', submitted: '12/31/2025, 02:30 PM', qty: 46536, qtyInspected: 7448, total: 46536, comments: 'Supplier Booking Comments:交客人报告 *', project: 'TRUE NORTH', sample: 80, factory: 'YY' },
        { no: 3, date: '12/31/2025, 03:00 PM', inspector: 'Bin Chantha', status: 'Accepted', type: 'First output Inspection 首扎检验', etd: '02/12/2026', eta: '02/15/2026', po: 'GPRT00177B', style: 'P21-465885', submitted: '12/31/2025, 03:51 PM', qty: 1200, qtyInspected: 20, total: 1200, comments: '-', project: 'TRUE NORTH', sample: 20, factory: 'YY' },
        { no: 4, date: '12/31/2025, 02:52 PM', inspector: 'Kong Phearon', status: 'Accepted', type: 'Inline Inspection-Sewing', etd: '02/05/2026', eta: '02/08/2026', po: 'GPARI2255', style: 'RBC 02-01-10008-SU26(AG2272)', submitted: '12/31/2025, 07:08 PM', qty: 5254, qtyInspected: 200, total: 5254, comments: '-', project: 'TRUE NORTH', sample: 20, factory: 'YY' },
        { no: 5, date: '12/31/2025, 02:52 PM', inspector: 'Kong Phearon', status: 'Accepted', type: 'Inline Inspection-Sewing', etd: '01/29/2026', eta: '02/01/2026', po: 'GPARI2288-1', style: 'FFS 99-03-43950-SU26', submitted: '12/31/2025, 07:04 PM', qty: 22702, qtyInspected: 400, total: 22702, comments: 'Supplier Booking Comments:产前办 *', project: 'TRUE NORTH', sample: 1, factory: 'YY' },
        { no: 6, date: '12/31/2025, 02:49 PM', inspector: 'Kong Phearon', status: 'Accepted', type: 'First output Inspection 首扎检验', etd: '01/29/2026', eta: '02/01/2026', po: 'GPARI2239', style: 'NOMB 03-01-51985-SU26(AG2157)', submitted: '12/31/2025, 07:21 PM', qty: 2682, qtyInspected: 20, total: 2682, comments: 'Supplier Booking Comments:内衣家庭式洗水报告(机洗烘干) *', project: 'TRUE NORTH', sample: 1, factory: 'YY' },
        { no: 7, date: '12/31/2025, 02:08 PM', inspector: 'Jack', status: 'Accepted', type: 'Sweater Pre-Final Inspection', etd: '01/07/2026', eta: '01/17/2026', po: 'GMOF00123', style: 'SW-163DI-W', submitted: '12/31/2025, 04:49 PM', qty: 2000, qtyInspected: 2000, total: 2000, comments: '-', project: 'TRUE NORTH', sample: 32, factory: 'YY' },
        { no: 8, date: '12/31/2025, 02:03 PM', inspector: 'Oeur Sothu', status: 'Accepted', type: 'Inline Inspection - Cutting', etd: '02/12/2026', eta: '02/01/2026', po: 'GPARI2285', style: 'FFS 99-06-44315-SU26', submitted: '12/31/2025, 03:51 PM', qty: 1752, qtyInspected: 135, total: 1752, comments: 'Supplier Booking Comments:交客人报告 *', project: 'TRUE NORTH', sample: 80, factory: 'YY' },
    ];

    return (
        <div className="w-full max-w-[1900px] mx-auto p-4 lg:p-6 space-y-6 animate-in fade-in duration-700">
            {/* Filter Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
                    <Search size={18} className="text-indigo-500" />
                    <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Filter Inspections</h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                    {filters.map((filter, i) => (
                        <div key={i} className="space-y-2">
                            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                                <filter.icon size={14} className="text-indigo-400" />
                                {filter.label}
                            </label>
                            {filter.type === 'select' ? (
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
                                    {filter.options.map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                            ) : (
                                <div className="relative group">
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all group-hover:bg-white"
                                        placeholder={`Search ${filter.label}...`}
                                    />
                                    <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:rotate-90 transition-transform" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className={`p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative border border-gray-200 ${stat.color === 'emerald' ? 'bg-emerald-50/50' :
                        stat.color === 'rose' ? 'bg-rose-50/50' :
                            stat.color === 'amber' ? 'bg-amber-50/50' : 'bg-blue-50/50'
                        }`}>
                        <div className="relative z-10 flex flex-col gap-1">
                            <span className={`text-[11px] font-black uppercase tracking-[0.1em] ${stat.color === 'emerald' ? 'text-emerald-500' :
                                stat.color === 'rose' ? 'text-rose-500' :
                                    stat.color === 'amber' ? 'text-amber-500' : 'text-blue-500'
                                }`}>{stat.label}</span>
                            <div className="flex items-end justify-between">
                                <h4 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h4>
                                <div className={`p-2 rounded-lg ${stat.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
                                    stat.color === 'rose' ? 'bg-rose-500/10 text-rose-500' :
                                        stat.color === 'amber' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                                    }`}>
                                    <stat.icon size={22} />
                                </div>
                            </div>
                        </div>
                        {/* Decorative Background Icon */}
                        <stat.icon size={100} className={`absolute -right-4 -bottom-4 opacity-[0.05] rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-6 ${stat.color === 'emerald' ? 'text-emerald-500' :
                            stat.color === 'rose' ? 'text-rose-500' :
                                stat.color === 'amber' ? 'text-amber-500' : 'text-blue-500'
                            }`} />
                    </div>
                ))}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-black text-lg text-slate-800 leading-none">Inspection Records</h3>
                        <p className="text-sm font-bold text-slate-400 mt-1">11 records found</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] mr-4">
                            <LayoutGrid size={14} />
                            <span>Page 1 of 2</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors border border-slate-100">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors border border-slate-100">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-slate-100/50">
                            <tr>
                                {[
                                    { label: 'No.', icon: LayoutGrid },
                                    { label: 'Scheduled Date', icon: Calendar },
                                    { label: 'Inspector', icon: User2 },
                                    { label: 'Status', icon: CheckCircle2 },
                                    { label: 'Report Type', icon: FileText },
                                    { label: 'ETD', icon: Calendar },
                                    { label: 'ETA', icon: Clock },
                                    { label: 'PO #', icon: Sparkles },
                                    { label: 'Style', icon: CheckCircle2 },
                                    { label: 'Submitted Date', icon: Calendar },
                                    { label: 'Qty to Inspect', icon: LayoutGrid },
                                    { label: 'Qty Inspected', icon: CheckCircle2 },
                                    { label: 'Total PO Qty', icon: Info },
                                    { label: 'Supplier Comments', icon: MessageSquare },
                                    { label: 'Project', icon: LayoutGrid },
                                    { label: 'Sample Inspected', icon: Microscope },
                                    { label: 'Factory Name', icon: Factory },
                                    { label: 'Action', icon: Zap }
                                ].map((h, i) => (
                                    <th key={i} className="px-2 py-4 text-left whitespace-nowrap border-b border-slate-100">
                                        <div className="flex items-center gap-2 text-[11px] font-black text-gray-700 uppercase tracking-wider">
                                            <h.icon size={14} className="text-gray-700" />
                                            {h.label}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {tableData.map((row, i) => (
                                <tr key={i} className="hover:bg-indigo-50/20 transition-colors group cursor-default">
                                    <td className="px-6 py-5 text-sm font-bold text-slate-700">{row.no}</td>
                                    <td className="px-2 py-5 font-black text-slate-700 leading-tight">
                                        <div className="text-[12px]">{row.date.split(', ')[0]},</div>
                                        <div className="text-[11px] text-slate-400 mt-0.5">{row.date.split(', ')[1]}</div>
                                    </td>
                                    <td className="px-3 py-5">
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ring-4 ring-blue-500/10 mt-1" />
                                            <div className="text-sm font-bold text-slate-700 leading-tight">
                                                {row.inspector.includes(' ') ? (
                                                    row.inspector.split(' ').map((part, idx) => (
                                                        <div key={idx}>{part}</div>
                                                    ))
                                                ) : (
                                                    row.inspector
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-200 ${row.status === 'Accepted' ? 'bg-emerald-100/80 text-emerald-700 shadow-sm' :
                                            row.status === 'Pending Approval' ? 'bg-amber-100/80 text-amber-700 shadow-sm' :
                                                'bg-rose-100/80 text-rose-700 shadow-sm'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-[12px] font-bold text-gray-700 whitespace-nowrap leading-tight">
                                        {row.type.includes(' ') && /[\u4e00-\u9fa5]/.test(row.type) ? (
                                            <>
                                                <div>{row.type.split(/ ([\u4e00-\u9fa5]+)/)[0]}</div>
                                                <div className="text-[12px] text-gray-700 mt-0.5 font-medium">{row.type.match(/[\u4e00-\u9fa5]+/)[0]}</div>
                                            </>
                                        ) : (
                                            row.type
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-[12px] font-bold text-slate-600">{row.etd}</td>
                                    <td className="px-5 py-4 text-[12px] font-bold text-slate-600">{row.eta}</td>
                                    <td className="px-5 py-4 text-[12px] font-black text-indigo-600">{row.po}</td>
                                    <td className="px-5 py-4 text-[12px] font-bold text-slate-700">{row.style}</td>
                                    <td className="px-2 py-5 font-black text-slate-700 leading-tight">
                                        <div className="text-[12px]">{row.submitted.split(', ')[0]},</div>
                                        <div className="text-[11px] text-slate-400 mt-0.5">{row.submitted.split(', ')[1]}</div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="px-2.5 py-1 bg-blue-50/50 rounded-lg text-[12px] font-black text-blue-600 border border-blue-100/50">
                                            {row.qty.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className="px-2.5 py-1 bg-emerald-50/50 rounded-lg text-[12px] font-black text-emerald-600 border border-emerald-100/50">
                                            {row.qtyInspected.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center text-[11px] font-black text-slate-700">
                                        {row.total.toLocaleString()}
                                    </td>
                                    <td className="px-2 py-4 max-w-[100px]">
                                        <div className="flex items-start gap-2">
                                            <MessageSquare size={14} className="text-gray-600 shrink-0 mt-0.5" />
                                            <div className="text-[12px] font-bold text-gray-600 truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all leading-tight">
                                                {row.comments.includes(':') ? (
                                                    <>
                                                        <div>{row.comments.split(':')[0]}:</div>
                                                        <div className="text-gray-500 mt-0.5 font-medium">{row.comments.split(':')[1]}</div>
                                                    </>
                                                ) : (
                                                    row.comments
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1" />
                                            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-tight leading-tight">
                                                {row.project.includes(' ') ? (
                                                    row.project.split(' ').map((word, idx) => (
                                                        <div key={idx}>{word}</div>
                                                    ))
                                                ) : (
                                                    row.project
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-16 py-4">
                                        <span className="bg-amber-100/60 text-amber-700 px-3 py-1 rounded-full text-[12px] font-black">
                                            {row.sample}
                                        </span>
                                    </td>
                                    <td className="px-16 py-4 text-[10px] font-bold text-gray-600 uppercase">{row.factory}</td>
                                    <td className="px-4 py-4">
                                        <button
                                            onClick={onViewReport}
                                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-xl text-[10px] font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                                        >
                                            <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                                                <BarChart3 size={12} className="text-white" />
                                            </div>
                                            View Report
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const UploadView = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-transparent to-indigo-50/20">
        <div className="max-w-3xl w-full text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Upload P88 Data</h2>
            <p className="text-slate-400 font-bold text-lg mb-12">Upload CSV files to import data into the P88 system</p>

            <div className="w-full bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-2.5 border border-slate-100 mb-12 group transition-all duration-500 hover:shadow-indigo-100/80">
                <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl py-20 flex flex-col items-center justify-center text-center transition-all group-hover:bg-slate-50/50 group-hover:border-indigo-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 w-20 h-20 bg-[#EEE7FF] rounded-3xl flex items-center justify-center text-indigo-500 mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Upload size={30} strokeWidth={2.5} />
                    </div>
                    <div className="relative z-10 flex flex-col gap-3">
                        <h3 className="text-xl font-black text-slate-800">
                            Drop your CSV file here, or <span className="text-indigo-600 hover:text-indigo-800 transition-colors">browse</span>
                        </h3>
                        <p className="text-sm font-bold text-slate-400 uppercase mt-2 opacity-80">
                            Supports CSV files up to 50MB
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const P88LegacySystem = ({ onBack }) => {
    const [activeTab, setActiveTab] = React.useState('Upload P88 Data');
    const [showReport, setShowReport] = React.useState(false);

    const navItems = [
        { label: 'Upload P88 Data', icon: Upload },
        { label: 'Summary P88 Data', icon: BarChart3 },
        { label: 'Download Report', icon: Download },
        { label: 'Manual Report', icon: FileText },
    ];

    return (
        <div className="w-full min-h-screen bg-[#F1F5F9] flex flex-col font-sans">
            {showReport ? (
                <InspectionReportDetail onClose={() => setShowReport(false)} />
            ) : (
                <>
                    {/* Professional Purple Header */}
                    <div className="w-full bg-gradient-to-r from-[#5340C7] via-[#9F37B3] to-[#C9338D] p-5 shadow-2xl relative z-50">
                        <div className="w-full flex items-center justify-between gap-4 max-w-full mx-auto px-4">
                            {/* Brand Section */}
                            <div className="flex items-center gap-4 shrink-0">
                                <button
                                    onClick={onBack}
                                    className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/20 hover:scale-105 transition-all shadow-lg text-white font-black active:scale-95"
                                >
                                    <ArrowLeft size={20} strokeWidth={3} />
                                </button>
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-2xl font-black text-white leading-none tracking-tight">P88 Legacy System</h1>
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm group/pro cursor-help">
                                            <Sparkles size={11} className="text-yellow-400 fill-yellow-400" />
                                            <span className="text-[10px] font-black tracking-wider text-white uppercase">PRO</span>
                                        </div>
                                    </div>
                                    <p className="text-white/90 text-[11px] font-bold uppercase tracking-wider mt-1.5 opacity-90">Legacy Management & Control System</p>
                                </div>
                            </div>

                            {/* Navigation Bar */}
                            <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 items-center gap-1 shadow-inner">
                                {navItems.map((item) => {
                                    const isActive = activeTab === item.label;
                                    return (
                                        <button
                                            key={item.label}
                                            onClick={() => setActiveTab(item.label)}
                                            className={`relative flex flex-col items-center justify-center min-w-[110px] py-2 px-3 rounded-xl transition-all group ${isActive ? 'bg-white shadow-xl scale-105' : 'text-white hover:bg-white/5'}`}
                                        >
                                            {isActive && (
                                                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34D399]" />
                                            )}
                                            <item.icon size={18} className={`mb-1 transition-transform group-hover:scale-110 ${isActive ? 'text-[#5340C7]' : 'text-white'}`} />
                                            <span className={`text-[9px] font-black text-center whitespace-nowrap leading-tight uppercase ${isActive ? 'text-[#5340C7]' : 'text-white'}`}>
                                                {item.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Right Section: Status Indicator and User */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 py-2.5 px-5 bg-white/10 rounded-xl border border-white/20 min-w-[160px] shadow-sm backdrop-blur-sm">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-lg shadow-[0_0_10px_#34D399] shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black uppercase text-white leading-none tracking-tight">{activeTab}</span>
                                        <span className="text-[9px] font-bold text-white/60 uppercase mt-1">Active Module</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 py-2 px-4 bg-black/10 rounded-2xl border border-white/10 shadow-lg">
                                    <div className="w-10 h-10 rounded-xl bg-orange-400 flex items-center justify-center shadow-lg border border-white/10">
                                        <User className="text-white w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col pr-2">
                                        <span className="text-[12px] font-black text-white leading-tight uppercase">QA Officer</span>
                                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter mt-0.5">ID: YM7625</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    {activeTab === 'Upload P88 Data' ? <UploadView /> : <SummaryView onViewReport={() => setShowReport(true)} />}

                    {/* Subtle Gradient Overlay */}
                    <div className="fixed inset-0 pointer-events-none bg-gradient-to-tr from-indigo-500/0 via-transparent to-purple-500/0" />
                </>
            )}
        </div>
    );
};

export default P88LegacySystem;
