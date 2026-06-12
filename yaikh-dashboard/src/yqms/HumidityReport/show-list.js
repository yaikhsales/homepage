import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Check,
    FileText,
    LayoutGrid,
    Plus,
    Clock,
    Calendar,
    Image as ImageIcon,
    ArrowLeft,
    Shield,
    Sparkles,
    User,
    X,
    Download,
    Eye,
    FileEdit,
    Trash2,
    CheckCircle,
    Video
} from 'lucide-react';

import { useTranslation } from '../../translate/TranslationContext';
import HumidityReportDetail from './HumidityReportDetail';
import VideoViewer from '../../components/VideoViewer';
import DocumentViewer from '../../components/DocumentViewer';
import ModuleBotButton from '../../components/ModuleBotButton';

const HUMIDITY_VIDEO_PATH = '/assets/short-video-training/Humidity.mp4';
const HUMIDITY_REPORT_PATH = '/assets/report-training/yhr-report.xlsx';

const HumidityReportList = ({ onBack }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState('Qc-daily-report');
    const [showDetail, setShowDetail] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);

    const tabs = [
        { id: 'Inspection', label: 'Inspection', icon: Check },
        { id: 'Qc-daily-report', label: 'Qc-daily-report', icon: FileText },
        { id: 'Dashboard', label: 'Dashboard', icon: LayoutGrid },
    ];

    const [filters, setFilters] = useState({
        startDate: '02/23/2026',
        endDate: '02/23/2026',
        factoryStyle: '',
        buyerStyle: '',
        customer: ''
    });

    const reports = [
        {
            id: 'GPAF6134-1', factoryStyle: 'GPAF6134', buyerStyle: 'S261340014', customer: 'ANF', date: '3/4/2026', item: 1, result: 'Passed', status: 'Pending',
            fabrication: 'COTTON 100%', color: 'WHITE', beforeDry: '08:00 AM', afterDry: 'N/A', spec: '50%',
            sections: { top: { body: '35', status: 'PASS' }, middle: { body: '36', status: 'PASS' }, bottom: { body: '35', status: 'PASS' } }
        },
        {
            id: 'GPAR12392-1', factoryStyle: 'GPAR12392', buyerStyle: 'FFS 99-06-60284-R-SU26', customer: 'Aritzia', date: '3/4/2026', item: 1, result: 'Passed', status: 'Pending',
            fabrication: 'LINEN BLEND', color: 'BEIGE', beforeDry: '09:15 AM', afterDry: 'N/A', spec: '45%',
            sections: { top: { body: '32', status: 'PASS' }, middle: { body: '33', status: 'PASS' }, bottom: { body: '32', status: 'PASS' } }
        },
        {
            id: 'GPAR12246', factoryStyle: 'GPAR12246', buyerStyle: 'SJCY 02-01-48347-SP26(RMG0565)', customer: 'Aritzia', date: '3/4/2026', item: 1, result: 'Passed', status: 'Pending',
            fabrication: 'POLYESTER 78%, SPANDEX 22%', color: 'BLACK', beforeDry: '10:30 AM', afterDry: 'N/A', spec: '52%',
            sections: { top: { body: '38', status: 'PASS' }, middle: { body: '39', status: 'PASS' }, bottom: { body: '38', status: 'PASS' } }
        },
        {
            id: 'GPAR12243', factoryStyle: 'GPAR12243', buyerStyle: 'CPTR 02-01-10080-SU26', customer: 'Aritzia', date: '3/4/2026', item: 1, result: 'Passed', status: 'Pending',
            fabrication: 'NYLON 100%', color: 'NAVY', beforeDry: '11:45 AM', afterDry: 'N/A', spec: '48%',
            sections: { top: { body: '34', status: 'PASS' }, middle: { body: '35', status: 'PASS' }, bottom: { body: '34', status: 'PASS' } }
        },
        {
            id: 'GPAF6133', factoryStyle: 'GPAF6133', buyerStyle: 'S261340014', customer: 'ANF', date: '3/4/2026', item: 1, result: 'Passed', status: 'Pending',
            fabrication: 'COTTON MIX', color: 'GREY', beforeDry: '01:00 PM', afterDry: 'N/A', spec: '50%',
            sections: { top: { body: '36', status: 'PASS' }, middle: { body: '37', status: 'PASS' }, bottom: { body: '36', status: 'PASS' } }
        },
        {
            id: 'GPAR12397', factoryStyle: 'GPAR12397', buyerStyle: 'FFS 99-06-41367-R-SU26', customer: 'Aritzia', date: '3/4/2026', item: 1, result: 'Passed', status: 'Pending',
            fabrication: 'SILK 100%', color: 'CREAM', beforeDry: '02:15 PM', afterDry: 'N/A', spec: '55%',
            sections: { top: { body: '42', status: 'PASS' }, middle: { body: '43', status: 'PASS' }, bottom: { body: '42', status: 'PASS' } }
        },
        {
            id: 'GPAF6134-2', factoryStyle: 'GPAF6134', buyerStyle: 'S261340014', customer: 'ANF', date: '3/4/2026', item: 1, result: 'Passed', status: 'Pending',
            fabrication: 'JERSEY', color: 'BLUE', beforeDry: '03:30 PM', afterDry: 'N/A', spec: '50%',
            sections: { top: { body: '37', status: 'PASS' }, middle: { body: '38', status: 'PASS' }, bottom: { body: '37', status: 'PASS' } }
        },
        {
            id: 'GPAR12392-2', factoryStyle: 'GPAR12392', buyerStyle: 'FFS 99-06-60284-R-SU26', customer: 'Aritzia', date: '3/4/2026', item: 1, result: 'Passed', status: 'Pending',
            fabrication: 'LINEN BLEND', color: 'OLIVE', beforeDry: '04:45 PM', afterDry: 'N/A', spec: '45%',
            sections: { top: { body: '33', status: 'PASS' }, middle: { body: '34', status: 'PASS' }, bottom: { body: '33', status: 'PASS' } }
        },
        {
            id: 'PTCOC406A', factoryStyle: 'PTCOC406A', buyerStyle: 'STCO7191', customer: 'Costco', date: '3/6/2026', item: 2, result: 'Passed', status: 'Pending',
            fabrication: 'TWILL', color: 'KHAKI', beforeDry: '09:00 AM', afterDry: 'N/A', spec: '40%',
            sections: { top: { body: '30', status: 'PASS' }, middle: { body: '31', status: 'PASS' }, bottom: { body: '30', status: 'PASS' } }
        },
        {
            id: 'GPAR12395', factoryStyle: 'GPAR12395', buyerStyle: 'FFS 99-03-44503-SU26', customer: 'Aritzia', date: '3/3/2026', item: 1, result: 'Passed', status: 'Pending',
            fabrication: 'SATIN', color: 'MAROON', beforeDry: '11:00 AM', afterDry: 'N/A', spec: '42%',
            sections: { top: { body: '31', status: 'PASS' }, middle: { body: '32', status: 'PASS' }, bottom: { body: '31', status: 'PASS' } }
        }
    ];

    return (
        <div className="w-full flex flex-col min-h-screen bg-[#F0F4F8]">
            {/* High-Fidelity Header */}
            <div className="w-full bg-gradient-to-r from-[#5340C7] via-[#9F37B3] to-[#C9338D] p-4 shadow-xl relative z-50 rounded-xl">
                <div className="w-full flex items-center justify-between gap-4 px-4">
                    {/* Brand Section */}
                    <div className="flex items-center gap-4 shrink-0">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center border border-white/20 hover:scale-105 transition-all shadow-lg text-white font-black active:scale-95"
                        >
                            <ArrowLeft size={20} strokeWidth={3} />
                        </button>

                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/40">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black text-white leading-tight flex items-center gap-2">
                                {t('humidityReport')} | {t('qcDailyReport')}
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                                    <Sparkles size={12} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-[10px] font-black tracking-wider text-white">PRO</span>
                                </div>
                            </h1>
                            <p className="text-white/80 text-[10px] font-bold uppercase mt-0.5">Humidity Level Monitoring & Control</p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4 shrink-0">
                        <button
            onClick={() => setSelectedVideo(HUMIDITY_VIDEO_PATH)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
        >
            <Video size={20} className="text-blue-600" />
        </button>
                        <button
                            onClick={() => setSelectedDocument(HUMIDITY_REPORT_PATH)}
                            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 border border-white/40 text-white shadow-lg transition-all"
                            title="Report Training"
                        >
                            <FileText size={16} />
                        </button>
                        <button
                            onClick={() => {
                                // Simulate bulk export
                                alert('Exporting all reports to Excel...');
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/40 rounded-xl text-xs font-black text-white transition-all active:scale-95 shadow-lg"
                        >
                            <Download size={16} /> EXPORT SUMMARY
                        </button>

                        <div className="flex items-center gap-3 py-2 px-4 bg-black/10 rounded-2xl border border-white/40">
                            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
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

            {/* Tab Navigation */}
            <div className="bg-white border-b border-slate-200 px-6 pt-2">
                <div className="flex items-center gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                if (tab.id === 'Inspection') {
                                    navigate('/dashboard/yqms/aquaboy');
                                } else {
                                    setActiveTab(tab.id);
                                }
                            }}
                            className={`flex items-center gap-2 py-4 px-1 transition-all relative ${activeTab === tab.id
                                ? 'text-blue-600 font-bold'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <tab.icon size={16} />
                            <span className="text-sm font-bold uppercase tracking-tight">{tab.label.toUpperCase()}</span>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6 space-y-4 max-w-[1600px] mx-auto w-full">
                {/* Filter Section */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex flex-wrap items-end gap-4">
                        {/* Date Range */}
                        <div className="flex-1 min-w-[320px] space-y-2">
                            <div className="flex items-center gap-4">
                                <label className="text-[13px] font-bold text-slate-500">Date Range</label>
                                <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-lg border border-slate-100">
                                    {['TODAY', '7 DAYS', '30 DAYS'].map(p => (
                                        <button key={p} className="text-[9px] font-black px-3 py-1 rounded-md text-slate-400 hover:text-slate-600 uppercase transition-all hover:bg-white shadow-sm hover:shadow">
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={filters.startDate}
                                        className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all shadow-sm"
                                    />
                                </div>
                                <span className="text-slate-400 font-bold text-xs">to</span>
                                <div className="relative flex-1">
                                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={filters.endDate}
                                        className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Factory Style No */}
                        <div className="w-56 space-y-2">
                            <label className="text-[13px] font-bold text-slate-500">Factory Style No</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search Style No..."
                                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 placeholder:text-slate-300 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Buyer Style */}
                        <div className="w-56 space-y-2">
                            <label className="text-[13px] font-bold text-slate-500">Buyer Style</label>
                            <input
                                type="text"
                                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all shadow-sm"
                            />
                        </div>

                        {/* Customer */}
                        <div className="w-48 space-y-2">
                            <label className="text-[13px] font-bold text-slate-500">Customer</label>
                            <input
                                type="text"
                                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all shadow-sm"
                            />
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => {
                                alert('Generating CSV for selected date range...');
                            }}
                            className="w-10 h-10 bg-[#f89898] flex items-center justify-center rounded-lg text-white hover:bg-[#f68080] transition-all shadow-md active:scale-95 border-b-2 border-red-300"
                        >
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* Table Header Row */}
                    <div className="px-6 py-4 bg-blue-50/50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg text-white">
                                <FileText size={18} />
                            </div>
                            <h2 className="text-lg font-black text-slate-800 tracking-tight">Saved Humidity Reports</h2>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">100 reports (Page 1 of 50)</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-left text-sm font-black text-slate-800 uppercase">Factory Style</th>
                                    <th className="px-6 py-4 text-left text-sm font-black text-slate-800 uppercase">Buyer Style</th>
                                    <th className="px-6 py-4 text-left text-sm font-black text-slate-800 uppercase">Customer</th>
                                    <th className="px-6 py-4 text-center text-sm font-black text-slate-800 uppercase">Date</th>
                                    <th className="px-6 py-4 text-center text-sm font-black text-slate-800 uppercase">Item</th>
                                    <th className="px-6 py-4 text-center text-sm font-black text-slate-800 uppercase">Results</th>
                                    <th className="px-6 py-4 text-center text-sm font-black text-slate-800 uppercase">Approval Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-black text-slate-800 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-700">{report.factoryStyle}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-slate-600">{report.buyerStyle}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{report.customer}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-bold text-slate-500">{report.date}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-50 text-purple-600 text-[11px] font-black">
                                                {report.item}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-black  ${report.result === 'Passed'
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                : 'bg-rose-50 text-rose-600 border border-rose-100'
                                                }`}>
                                                {report.result === 'Passed' ? <Check size={12} strokeWidth={4} /> : <X size={12} strokeWidth={4} />}
                                                {report.result}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-400 border border-orange-200 text-[11px] font-black">
                                                {report.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-all">
                                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                                                    <CheckCircle size={14} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedReport(report);
                                                        setShowDetail(true);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Eye size={14} strokeWidth={3} />
                                                </button>
                                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-50 border border-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                                                    <FileEdit size={14} />
                                                </button>
                                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-end">
                        <div className="flex items-center gap-1">
                            <button className="px-4 py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest disabled:opacity-50">Previous</button>
                            <div className="flex items-center gap-1 px-2">
                                {[1, 2, 3, 4, '...', 50].map((p, i) => (
                                    <button
                                        key={i}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${p === 1
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                            : 'text-slate-500 hover:bg-white hover:shadow-sm'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button className="px-4 py-2 text-[11px] font-bold text-slate-700 hover:text-blue-600 uppercase tracking-widest">Next</button>
                        </div>
                    </div>
                </div>
            </div>

            {showDetail && (
                <HumidityReportDetail
                    data={selectedReport}
                    onClose={() => setShowDetail(false)}
                />
            )}

            {selectedVideo && (
                <VideoViewer
                    videoPath={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}

            {selectedDocument && (
                <DocumentViewer
                    documentPath={selectedDocument}
                    onClose={() => setSelectedDocument(null)}
                />
            )}

            <ModuleBotButton moduleName="YQMS - Humidity Aquaboy" />
        </div>
    );
};

export default HumidityReportList;
