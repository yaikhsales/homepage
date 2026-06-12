import React, { useState, useEffect } from "react";
import {
    Search, XCircle, ChevronDown, ChevronRight, ChevronLeft, Eye,
    Calendar, Filter, Users, ClipboardList, Tag, Hammer, Building2,
    X, Check, AlertCircle, AlertTriangle, Circle
} from "lucide-react";

/**
 * DetailedReport Component - Shown when 'View' is clicked
 */
const DetailedReport = ({ data, onBack }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header / Info Bar */}
            <div className="bg-[#EFF6FF] rounded-xl border border-blue-200 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <h2 className="text-[15px] font-black text-blue-700">
                        Detailed Report (MO: {data.mo}, Line: {data.line}, Date: {data.date}) (Inspector(s): Han Saem (YM8757))
                    </h2>
                </div>
                <button
                    onClick={onBack}
                    className="w-8 h-8 rounded-full bg-white border border-rose-200 text-rose-500 flex items-center justify-center hover:bg-rose-50 transition-colors shadow-sm"
                >
                    <X size={18} strokeWidth={3} />
                </button>
            </div>

            {/* Operator Summary Legend */}
            <div className="bg-[#F8FAFC] rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Operator Summary Legend:</h3>
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-1.5">
                            <Check size={14} className="text-emerald-500 stroke-[3]" />
                            <span className="text-[11px] font-bold text-slate-600">: Checked Quantity</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <X size={14} className="text-rose-500 stroke-[3]" />
                            <span className="text-[11px] font-bold text-slate-600">: Reject Garment Count</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <AlertCircle size={14} className="text-rose-600 stroke-[3]" />
                            <span className="text-[11px] font-bold text-slate-600">: Critical Defect</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <AlertTriangle size={14} className="text-orange-500 stroke-[3]" />
                            <span className="text-[11px] font-bold text-slate-600">: Major Defect</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Circle size={14} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-[11px] font-bold text-slate-600">: Minor Defect</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overall Inspection Summary Table */}
            <div className="flex flex-col gap-3">
                <h3 className="text-[13px] font-black text-slate-800 ml-1">Overall Inspection Summary by Repetition</h3>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                <th className="px-4 py-3 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center">Inspection No.</th>
                                <th className="px-4 py-3 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center">Check Qty</th>
                                <th className="px-4 py-3 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center">Defect Parts</th>
                                <th className="px-4 py-3 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center">Defect Rate (%)</th>
                                <th className="px-4 py-3 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center">Pass Rate (%)</th>
                                <th className="px-4 py-1 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center bg-[#F8FAFC]" colSpan="2">
                                    <div className="border-b border-slate-300 pb-0.5 mb-1">SPI COUNT</div>
                                    <div className="flex">
                                        <span className="flex-1 text-[9px] border-r border-slate-300 text-slate-500 font-black">PASS</span>
                                        <span className="flex-1 text-[9px] text-slate-500 font-black">REJECT</span>
                                    </div>
                                </th>
                                <th className="px-4 py-1 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center bg-[#F8FAFC]" colSpan="2">
                                    <div className="border-b border-slate-300 pb-0.5 mb-1">MEASUREMENT</div>
                                    <div className="flex">
                                        <span className="flex-1 text-[9px] border-r border-slate-300 text-slate-500 font-black">PASS</span>
                                        <span className="flex-1 text-[9px] text-slate-500 font-black">REJECT</span>
                                    </div>
                                </th>
                                <th className="px-4 py-1 text-[11px] font-black uppercase tracking-tight text-center" colSpan="3">
                                    <div className="border-b border-slate-200 pb-0.5 mb-1">DEFECTS SUMMARY</div>
                                    <div className="flex text-[9px] font-bold">
                                        <span className="flex-1 border-r border-slate-300 text-rose-600">CRITICAL</span>
                                        <span className="flex-1 border-r border-slate-300 text-orange-600">MAJOR</span>
                                        <span className="flex-1 text-yellow-600">MINOR</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200 last:border-0">
                                <td className="px-4 py-4 text-xs font-bold text-slate-600 border-r border-slate-200">1st Inspection</td>
                                <td className="px-4 py-4 text-xs font-bold text-slate-700 border-r border-slate-200 text-center">{data.qty}</td>
                                <td className="px-4 py-4 text-xs font-bold text-slate-700 border-r border-slate-200 text-center">0</td>
                                <td className="px-4 py-4 text-xs font-bold text-slate-700 border-r border-slate-200 text-center">0.00</td>
                                <td className="px-4 py-4 text-xs font-bold text-slate-700 border-r border-slate-200 text-center">100.00</td>
                                <td className="px-4 py-4 text-xs font-black text-emerald-600 border-r border-slate-100 bg-[#F0FDFA] text-center">{data.spiPass}</td>
                                <td className="px-4 py-4 text-xs font-black text-rose-500 border-r border-slate-200 text-center">{data.spiReject}</td>
                                <td className="px-4 py-4 text-xs font-black text-emerald-600 border-r border-slate-100 bg-[#F0FDFA] text-center">{data.measPass}</td>
                                <td className="px-4 py-4 text-xs font-black text-rose-500 border-r border-slate-200 text-center">{data.measReject}</td>
                                <td className="px-4 py-4 text-xs font-black text-emerald-600 border-r border-slate-100 bg-[#F0FDFA] text-center">0</td>
                                <td className="px-4 py-4 text-xs font-black text-emerald-600 border-r border-slate-100 bg-[#F0FDFA] text-center">0</td>
                                <td className="px-4 py-4 text-xs font-black text-emerald-600 bg-[#F0FDFA] text-center">0</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Operator Inspection Summary Table */}
            <div className="flex flex-col gap-3">
                <h3 className="text-[13px] font-black text-slate-800 ml-1">Operator Inspection Summary by Repetition</h3>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                <th className="px-4 py-4 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center">Operator ID</th>
                                <th className="px-4 py-4 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center">Operation</th>
                                <th className="px-4 py-4 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center">Machine Code</th>
                                <th className="px-4 py-4 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center bg-[#F1F5F9]">1st Inspection</th>
                                <th className="px-4 py-4 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center">2nd Inspection</th>
                                <th className="px-4 py-4 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center">3rd Inspection</th>
                                <th className="px-4 py-4 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center">4th Inspection</th>
                                <th className="px-4 py-4 text-[11px] font-black uppercase tracking-tight text-center">5th Inspection</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-200 last:border-0 group">
                                <td className="px-4 py-5 text-xs font-bold text-slate-600 border-r border-slate-200">YM6423</td>
                                <td className="px-4 py-5 text-xs font-bold text-slate-600 border-r border-slate-200">双针平车贴鼴袋(2片)*2</td>
                                <td className="px-4 py-5 text-xs font-bold text-slate-600 border-r border-slate-200">301-LS-2</td>
                                <td className="px-4 py-5 text-sm font-black text-center border-r border-slate-200 bg-[#F0FDFA]">
                                    <div className="text-emerald-600 leading-tight">Pass</div>
                                    <div className="text-xs text-emerald-500">(√5 X0)</div>
                                </td>
                                <td className="px-4 py-5 text-xs font-bold text-slate-400 border-r border-slate-200 text-center">-</td>
                                <td className="px-4 py-5 text-xs font-bold text-slate-400 border-r border-slate-200 text-center">-</td>
                                <td className="px-4 py-5 text-xs font-bold text-slate-400 border-r border-slate-200 text-center">-</td>
                                <td className="px-4 py-5 text-xs font-bold text-slate-400 text-center">-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Individual Checks Repetition Label */}
            <div className="mt-2">
                <h3 className="text-[15px] font-black text-slate-800 ml-1">Inspection No: 1st Inspection</h3>
            </div>

            {/* Roving Data Details Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-12">
                <div className="bg-[#F8FAFC] px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-[13px] font-black text-slate-800">Roving Data Details (Individual Checks for this Repetition)</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            {['SPI', 'Measurement', 'Defect Status'].map(label => (
                                <label key={label} className="flex items-center gap-1.5 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{label}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                            <button className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 transition-colors">Add All</button>
                            <button className="bg-rose-500 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider hover:bg-rose-600 transition-colors">Clear All</button>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                {['Operator ID', 'Operator Name', 'TG No.', 'Operation (CH)', 'Type', 'Checked Qty', 'Defect Parts', 'SPI', 'Measurement', 'Defect Status', 'Overall Roving Status', 'Defects Found', 'Insp. Time', 'Remark'].map(h => (
                                    <th key={h} className="px-3 py-3 text-[10px] font-black uppercase tracking-tighter border-r border-slate-200 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[11, 20, 24].map((time, idx) => (
                                <tr key={idx} className="border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors group">
                                    <td className="px-3 py-3 text-[11px] font-bold text-slate-600 border-r border-slate-200">YM6423</td>
                                    <td className="px-3 py-3 text-[11px] font-bold text-slate-600 border-r border-slate-200">Pich Sovan</td>
                                    <td className="px-3 py-3 text-[11px] font-bold text-slate-600 border-r border-slate-200">15</td>
                                    <td className="px-3 py-3 text-[11px] font-bold text-slate-600 border-r border-slate-200">双针平车贴鼴袋(2片)*2</td>
                                    <td className="px-3 py-3 text-[11px] font-bold text-slate-600 border-r border-slate-200 text-center">Normal</td>
                                    <td className="px-3 py-3 text-[11px] font-black text-slate-700 border-r border-slate-200 text-center">5</td>
                                    <td className="px-3 py-3 text-[11px] font-bold text-slate-600 border-r border-slate-200 text-center">1</td>
                                    <td className="px-3 py-3 border-r border-slate-200 text-center">
                                        <div className="px-3 py-1 border border-slate-200 rounded-full text-[10px] font-black bg-[#F0FDFA] text-[#0D9488] min-w-[45px] inline-block">Pass</div>
                                    </td>
                                    <td className="px-3 py-3 border-r border-slate-200 text-center">
                                        <div className="px-3 py-1 border border-slate-200 rounded-full text-[10px] font-black bg-[#F0FDFA] text-[#0D9488] min-w-[45px] inline-block">Pass</div>
                                    </td>
                                    <td className="px-3 py-3 border-r border-slate-200 text-center">
                                        <div className="px-3 py-1 border border-slate-200 rounded-full text-[10px] font-black bg-[#F0FDFA] text-[#0D9488] min-w-[45px] inline-block">Pass</div>
                                    </td>
                                    <td className="px-3 py-3 border-r border-slate-200 text-center">
                                        <div className="px-3 py-1 border border-slate-200 rounded-full text-[10px] font-black bg-[#F0FDFA] text-[#0D9488] min-w-[45px] inline-block">Pass</div>
                                    </td>
                                    <td className="px-3 py-3 border-r border-slate-200"></td>
                                    <td className="px-3 py-3 text-[11px] font-bold text-slate-600 border-r border-slate-200 text-center">11:{time}:{idx + 28}</td>
                                    <td className="px-3 py-3 border-slate-200 text-center"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination for Detailed List */}
                <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex items-center justify-between">
                    <button className="bg-[#D1D5DB] text-slate-800 px-6 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-400 transition-all active:scale-95 shadow-sm">
                        Previous
                    </button>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Page 1 of 1</span>
                    <button className="bg-[#D1D5DB] text-slate-800 px-8 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-400 transition-all active:scale-95 shadow-sm">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * QCRovingDashboard - High-fidelity "QC Inline Roving - Summary Report"
 * Matches the user-provided screenshot design.
 */
const QCRovingDashboard = ({ onBack }) => {
    const [selectedReport, setSelectedReport] = useState(null);

    const dummyData = [
        { date: "5/1/2026", line: "1", mo: "GPAR12276-1", count: 1, qty: 15, rejects: 0, defects: 0, rate: "0.00", ratio: "0.00", spiPass: 3, spiReject: 0, measPass: 3, measReject: 0 },
        { date: "3/7/2026", line: "9", mo: "GPAR12385", count: 1, qty: 255, rejects: 7, defects: 14, rate: "5.49", ratio: "2.75", spiPass: 35, spiReject: 0, measPass: 35, measReject: 0 },
        { date: "3/7/2026", line: "30", mo: "GPRT00203", count: 1, qty: 140, rejects: 18, defects: 36, rate: "25.71", ratio: "12.86", spiPass: 26, spiReject: 0, measPass: 26, measReject: 0 },
        { date: "3/7/2026", line: "11", mo: "PTCOC408", count: 1, qty: 100, rejects: 6, defects: 13, rate: "13.00", ratio: "6.00", spiPass: 18, spiReject: 0, measPass: 18, measReject: 0 },
        { date: "3/7/2026", line: "10", mo: "PTCOC402", count: 1, qty: 130, rejects: 10, defects: 21, rate: "16.15", ratio: "7.69", spiPass: 22, spiReject: 0, measPass: 22, measReject: 0 },
        { date: "3/7/2026", line: "12", mo: "PTCOC402", count: 1, qty: 120, rejects: 10, defects: 19, rate: "15.83", ratio: "8.33", spiPass: 20, spiReject: 0, measPass: 20, measReject: 0 },
        { date: "3/7/2026", line: "18", mo: "PTCOC406", count: 1, qty: 180, rejects: 6, defects: 15, rate: "8.89", ratio: "3.33", spiPass: 30, spiReject: 0, measPass: 30, measReject: 0 },
        { date: "3/7/2026", line: "21", mo: "GPAR12378NOS", count: 1, qty: 60, rejects: 2, defects: 2, rate: "3.33", ratio: "3.33", spiPass: 4, spiReject: 2, measPass: 4, measReject: 2 },
        { date: "3/7/2026", line: "15", mo: "GPAR12356", count: 1, qty: 150, rejects: 6, defects: 10, rate: "6.67", ratio: "4.00", spiPass: 25, spiReject: 1, measPass: 26, measReject: 0 },
        { date: "3/7/2026", line: "17", mo: "YMCMT26002", count: 1, qty: 140, rejects: 0, defects: 0, rate: "0.00", ratio: "0.00", spiPass: 20, spiReject: 0, measPass: 20, measReject: 0 },
        { date: "3/7/2026", line: "25", mo: "GPAR12320", count: 1, qty: 70, rejects: 4, defects: 11, rate: "15.71", ratio: "5.71", spiPass: 8, spiReject: 0, measPass: 8, measReject: 0 },
        { date: "3/7/2026", line: "16", mo: "PTCOU062", count: 1, qty: 5, rejects: 1, defects: 1, rate: "20.00", ratio: "20.00", spiPass: 1, spiReject: 0, measPass: 1, measReject: 0 },
    ];

    const [moFilter, setMoFilter] = useState("All MO Nos");
    const [filteredData, setFilteredData] = useState(dummyData);

    useEffect(() => {
        if (moFilter === "All MO Nos") {
            setFilteredData(dummyData);
        } else {
            setFilteredData(dummyData.filter(d => d.mo === moFilter));
        }
    }, [moFilter, dummyData]);

    const getRateColor = (rate) => {
        const val = parseFloat(rate);
        if (val === 0) return "bg-[#F0FDFA] text-[#0D9488]"; // Teal/Green
        if (val < 10) return "bg-[#FFF7ED] text-[#EA580C]"; // Orange/Yellow
        return "bg-[#FEF2F2] text-[#DC2626]"; // Red
    };

    if (selectedReport) {
        return (
            <div className="min-h-screen bg-[#F1F5F9] select-none p-6 animate-in fade-in duration-500">
                <DetailedReport data={selectedReport} onBack={() => setSelectedReport(null)} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans select-none p-6 animate-in fade-in duration-500">

            {/* --- FILTER SECTION --- */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[13px] font-black text-slate-700">
                        Filter Roving Reports <span className="text-slate-400 font-bold ml-1">(Last Updated: 03/07/2026 09:58:44)</span>
                    </h3>
                </div>

                <div className="flex flex-wrap items-end gap-3">
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Start Date</label>
                        <div className="relative">
                            <input type="text" defaultValue="03/07/2026" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:border-blue-500 outline-none" />
                            <XCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">End Date</label>
                        <input type="text" placeholder="Select End Date" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-400 focus:border-blue-500 outline-none" />
                    </div>
                    {[
                        { label: "Line No", active: "All Lines" },
                        { label: "Buyer Name", active: "All Buyers" },
                        { label: "Operation", active: "All Operations" },
                        { label: "QC ID", active: "All QC IDs" },
                        { label: "MO No", active: "All MO Nos" }
                    ].map((f, i) => (
                        <div key={i} className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">{f.label}</label>
                            <div className="relative group">
                                <select
                                    value={f.label === "MO No" ? moFilter : f.active}
                                    onChange={(e) => f.label === "MO No" && setMoFilter(e.target.value)}
                                    className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:border-blue-500 outline-none cursor-pointer"
                                >
                                    <option>{f.active}</option>
                                    {f.label === "MO No" && [...new Set(dummyData.map(d => d.mo))].map(mo => (
                                        <option key={mo}>{mo}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => setMoFilter("All MO Nos")}
                        className="bg-[#3B82F6] text-white px-8 py-2 rounded-lg font-bold text-xs hover:bg-blue-600 transition-all shadow-sm active:scale-95 h-[34px]"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* --- REPORT CARD --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col gap-6">

                {/* Header Title */}
                <div className="bg-[#DBEAFE] rounded-xl py-3 shadow-sm flex items-center justify-center border border-blue-100">
                    <h1 className="text-xl font-black text-blue-900 tracking-tight uppercase">QC Inline Roving – Summary Report</h1>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                    {[
                                        "Inspection Date", "Line No", "MO No", "Inspection Count",
                                        "Checked Qty", "Reject Garment", "Defect Qty", "DEFECT RATE (%)",
                                        "DEFECT RATIO (%)"
                                    ].map((head) => (
                                        <th key={head} className="px-4 py-4 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 last:border-r-0">
                                            {head}
                                        </th>
                                    ))}
                                    <th className="px-4 py-2 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center bg-[#F8FAFC]" colSpan="2">
                                        <div className="border-b border-slate-300 pb-1 mb-1">TOTAL SPI</div>
                                        <div className="flex">
                                            <span className="flex-1 text-[9px] border-r border-slate-300 text-slate-500 font-bold">PASS</span>
                                            <span className="flex-1 text-[9px] text-slate-500 font-bold">REJECT</span>
                                        </div>
                                    </th>
                                    <th className="px-4 py-2 text-[11px] font-black uppercase tracking-tight border-r border-slate-200 text-center bg-[#F8FAFC]" colSpan="2">
                                        <div className="border-b border-slate-300 pb-1 mb-1">MEASUREMENT</div>
                                        <div className="flex">
                                            <span className="flex-1 text-[9px] border-r border-slate-300 text-slate-500 font-bold">PASS</span>
                                            <span className="flex-1 text-[9px] text-slate-500 font-bold">REJECT</span>
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-[11px] font-black uppercase tracking-tight text-center bg-[#F8FAFC] whitespace-nowrap">VIEW</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/80 transition-all border-b border-slate-200 last:border-0">
                                        <td className="px-4 py-3.5 text-xs font-bold text-slate-600 border-r border-slate-200 bg-white group-hover:bg-transparent">{row.date}</td>
                                        <td className="px-4 py-3.5 text-xs font-bold text-slate-600 border-r border-slate-200 text-center">{row.line}</td>
                                        <td className="px-4 py-3.5 text-xs font-black text-slate-700 border-r border-slate-200">{row.mo}</td>
                                        <td className="px-4 py-3.5 text-xs font-bold text-slate-600 border-r border-slate-200 text-center">{row.count}</td>
                                        <td className="px-4 py-3.5 text-xs font-black text-slate-700 border-r border-slate-200 text-center">{row.qty}</td>
                                        <td className="px-4 py-3.5 text-xs font-bold text-slate-600 border-r border-slate-200 text-center">{row.rejects}</td>
                                        <td className="px-4 py-3.5 text-xs font-bold text-slate-600 border-r border-slate-200 text-center">{row.defects}</td>
                                        <td className="px-4 py-3.5 border-r border-slate-200">
                                            <div className={`px-4 py-1.5 rounded-full text-center text-[11px] font-black inline-block min-w-[90px] leading-none ${getRateColor(row.rate)}`}>
                                                {row.rate}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 border-r border-slate-200">
                                            <div className={`px-4 py-1.5 rounded-full text-center text-[11px] font-black inline-block min-w-[90px] leading-none ${getRateColor(row.ratio)}`}>
                                                {row.ratio}
                                            </div>
                                        </td>
                                        {/* Total SPI Sub-columns */}
                                        <td className="px-2 py-3.5 text-xs font-black text-emerald-600 text-center border-r border-slate-200">{row.spiPass}</td>
                                        <td className="px-2 py-3.5 text-xs font-black text-rose-500 text-center border-r border-slate-200">{row.spiReject}</td>
                                        {/* Measurement Sub-columns */}
                                        <td className="px-2 py-3.5 text-xs font-black text-emerald-600 text-center border-r border-slate-200">{row.measPass}</td>
                                        <td className="px-2 py-3.5 text-xs font-black text-rose-500 text-center border-r border-slate-200">{row.measReject}</td>
                                        {/* Action */}
                                        <td className="px-4 py-3.5 text-center">
                                            <button
                                                onClick={() => setSelectedReport(row)}
                                                className="text-blue-500 hover:text-blue-700 hover:scale-110 transition-transform"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex items-center justify-between">
                        <button className="bg-[#D1D5DB] text-slate-800 px-6 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-400 transition-all active:scale-95 shadow-sm">
                            Previous
                        </button>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Page 1 of 1</span>
                        <button className="bg-[#D1D5DB] text-slate-800 px-8 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-400 transition-all active:scale-95 shadow-sm">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Back Button Floating */}
            <button
                onClick={onBack}
                className="fixed bottom-8 right-8 w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-blue-600 hover:scale-110 active:scale-90 transition-all z-[100] group"
            >
                <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform stroke-[3]" />
            </button>
        </div>
    );
};

export default QCRovingDashboard;