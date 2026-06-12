import React from 'react';
import {
    Download, X, BarChart3, Clock, Calendar,
    FileText, CheckCircle2, AlertCircle, Info
} from 'lucide-react';

const InspectionReportDetail = ({ onClose, data }) => {
    // Mock data based on screenshots if data is not provided
    const report = data || {
        id: "PTCOC396",
        date: "3/6/2026",
        company: "Yorkmars (Cambodia) Garment MFG Co., LTD",
        inspectionStatus: "N/A",
        groupNo: "145177",
        title: "Inspection Summary Report",
        type: "Interim Inspection",
        typeCn: "中期检验",
        overallResult: "Pass",
        scheduledDate: "2026-01-01 01:30",
        submittedDate: "2025-12-31 14:07",
        details: {
            reportType: "Interim Inspection 中期检验",
            project: "COSTCO",
            inspector: "Choy Sreyna",
            supplier: "YM",
            totalPoQty: "46,536",
            sampleInspected: "200",
            factoryName: "YM",
            createdDate: "2026-01-20",
            submittedInspectionDate: "2025-12-31",
            lastModifiedDate: "2025-12-31",
            poNo: "PTCOC396",
            etd: "2026-01-23",
            destination: "Vancouver",
            skuNo: "STCO6817-CBK001-15-1373-CAN, STCO6817-CGN204-15-1373-CAN, STCO6817-CRD330-15-1373-CAN",
            description: "LADIES' 86% NYLON SUPPLEX 14% LYCRA SPANDEX KNITTED PANTS",
            style: "STCO6817",
            color: "BLACK [QTY : 24,930], BRICK RED [QTY : 13,296], SEA PINE [QTY : 8,310]",
            customPoNo: "",
            inspectedQty: "7,448"
        },
        conclusion: {
            result: "Pass",
            status: "Accepted",
            defects: {
                critical: 0,
                major: 3,
                minor: 3,
                total: 6
            },
            metrics: {
                defectiveUnits: 6,
                defectRate: "3%"
            }
        },
        detailedDefects: [
            { name: "C-8 2-Dirty mark/soiling-Others", qty: 3 },
            { name: "E-25 2-Stitching-Stitches: Broken", qty: 1 },
            { name: "E-3 1-Seam-Uneven seam", qty: 1 },
            { name: "B-12 3-Fabric Performance-pilling/shedding/snagging", qty: 1 }
        ],
        comments: "Supplier Booking Comments:YM D12 *"
    };

    const handleDownloadPDF = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-100 overflow-y-auto font-sans animate-in fade-in duration-300 report-root">
            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        size: A4;
                        margin: 1cm 0.8cm;
                    }
                    
                    /* Global Isolation - NO EXTERNAL CLASSES NEEDED */
                    header, 
                    nav, 
                    footer, 
                    aside,
                    #background,
                    [class*="DragonAnimation"],
                    [class*="YaiDataBot"],
                    [class*="GMChat"],
                    [aria-label="General AI Agent"],
                    .fixed:not(.report-root),
                    .sticky:not(.report-root) {
                        display: none !important;
                        visibility: hidden !important;
                    }

                    html, body {
                        background: white !important;
                        height: auto !important;
                        overflow: visible !important;
                    }

                    .report-root {
                        position: static !important;
                        display: block !important;
                        background: white !important;
                        width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        overflow: visible !important;
                    }

                    /* Hide report UI components */
                    .report-root .no-print, 
                    .report-root button,
                    .report-root .sticky-header {
                        display: none !important;
                    }

                    /* Condensing for 2-Page Flow */
                    .p-6, .p-8 { padding: 0.5rem !important; }
                    .mb-6, .mb-8 { margin-bottom: 0.5rem !important; }
                    .mt-6, .mt-8 { margin-top: 0.5rem !important; }
                    .gap-6, .gap-8 { gap: 0.5rem !important; }
                    
                    /* Specific Page Breaks */
                    .print-page-2 {
                        page-break-before: always !important;
                    }

                    /* Premium Print Fidelity */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    .shadow-sm, .shadow-md, .shadow-lg, .shadow-xl {
                        box-shadow: none !important;
                    }
                    
                    .bg-white.rounded-xl {
                        border: 1px solid #e2e8f0 !important;
                        margin-bottom: 0px !important;
                    }
                    
                    /* Grid and Table Adjustments */
                    .text-[12px] { font-size: 10px !important; }
                    .text-sm { font-size: 11px !important; }
                    .text-lg { font-size: 14px !important; }
                    .text-xl { font-size: 16px !important; }
                    .p-4 { padding: 0.6rem !important; }
                    .p-8 { padding: 1.5rem !important; }
                }
            `}} />

            {/* Header section matching screenshot 1 */}
            <div className="w-full bg-indigo-600 p-4 sticky top-0 z-10 flex items-center justify-between shadow-md sticky-header no-print">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <FileText className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-black text-white">Inspection Report</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all active:scale-95"
                    >
                        <Download size={18} />
                        Download PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all active:scale-95"
                    >
                        <X size={18} />
                        Close
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Upper Summary Section */}
                <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800">{report.id} – Inspection Summary</h2>
                            {/* <p className="text-slate-600 font-bold mt-1 text-sm">{report.company}</p> */}
                            <p className="text-slate-500 font-bold text-sm mt-1">Inspection #: {report.inspectionStatus} | Group #: {report.groupNo}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-slate-800 font-black text-lg">{report.date}</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                        <h3 className="text-center text-2xl font-black text-slate-700 mb-6">{report.title}</h3>

                        <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100 mb-6">
                            <h4 className="text-lg font-black text-slate-700">{report.type}{report.typeCn}</h4>
                            <span className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-sm">
                                {report.overallResult}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                                <p className="text-purple-600 text-sm font-black mb-1">Scheduled Inspection Date</p>
                                <p className="text-slate-800 font-black text-sm">{report.scheduledDate}</p>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                                <p className="text-emerald-600 text-sm font-black mb-1">Submitted Inspection Date</p>
                                <p className="text-slate-800 font-black text-sm">{report.submittedDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Inspection Details Grid */}
                    <div className="mt-6">
                        <h4 className="text-xl font-black text-slate-700 mb-4">Inspection Details</h4>
                        <div className="grid grid-cols-2 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            {[
                                { label: "Report Type", value: report.details.reportType },
                                { label: "Project", value: report.details.project },
                                { label: "Inspector", value: report.details.inspector },
                                { label: "Supplier", value: report.details.supplier },
                                { label: "Total PO Items Qty", value: report.details.totalPoQty },
                                { label: "Sample Inspected", value: report.details.sampleInspected },
                                { label: "Factory Name", value: report.details.factoryName },
                                { label: "Created Date", value: report.details.createdDate },
                                { label: "Submitted Inspection Date", value: report.details.submittedInspectionDate },
                                { label: "Last Modified Date", value: report.details.lastModifiedDate },
                                { label: "PO #", value: report.details.poNo },
                                { label: "ETD", value: report.details.etd },
                                { label: "Destination", value: report.details.destination, full: true },
                                { label: "SKU #", value: report.details.skuNo },
                                { label: "Description", value: report.details.description },
                                { label: "Style", value: report.details.style },
                                { label: "Color", value: report.details.color },
                                { label: "Custom PO#", value: report.details.customPoNo, full: true },
                                { label: "Inspected Qty (Pcs)", value: report.details.inspectedQty, full: true }
                            ].map((item, i) => (
                                <div key={i} className={`flex ${item.full ? 'col-span-2' : ''} border-b border-slate-100 last:border-b-0`}>
                                    <div className="w-1/3 bg-slate-50 p-4 border-r border-slate-100">
                                        <span className="text-[12px] font-black text-slate-600 uppercase tracking-tight">{item.label}</span>
                                    </div>
                                    <div className="w-2/3 p-4 flex items-center">
                                        <span className="text-sm font-bold text-slate-800">{item.value || '-'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Conclusion & Defects Section matching screenshot 2 */}
                <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 print-page-2">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Conclusion</h3>

                    <div className="grid grid-cols-2 gap-12 mb-8">
                        <div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-3">Inspection Result</p>
                            <span className="px-4 py-1.5 bg-emerald-100 text-emerald-600 rounded-lg text-xs font-black shadow-sm border border-emerald-200">
                                {report.conclusion.result}
                            </span>
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-3">Approval Status</p>
                            <span className="px-4 py-1.5 bg-emerald-100 text-emerald-600 rounded-lg text-xs font-black shadow-sm border border-emerald-200">
                                {report.conclusion.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Defect Summary Card */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-slate-700 tracking-tight uppercase">Defect Summary</h4>
                            <div className="space-y-2">
                                {[
                                    { label: "Critical", value: report.conclusion.defects.critical, color: "rose" },
                                    { label: "Major", value: report.conclusion.defects.major, color: "amber" },
                                    { label: "Minor", value: report.conclusion.defects.minor, color: "emerald" },
                                    { label: "Total Product + Quality Plan Defects", value: report.conclusion.defects.total, color: "blue", highlight: true }
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${item.highlight ? 'bg-blue-50/30' : 'bg-slate-50/50'} border-slate-100`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1 h-6 rounded-full bg-${item.color}-500 shadow-sm shadow-${item.color}-200`} />
                                            <span className={`text-[11px] font-black uppercase ${item.highlight ? 'text-blue-700' : 'text-slate-600'}`}>
                                                {item.label}
                                            </span>
                                        </div>
                                        <span className={`text-sm font-black text-${item.color}-600`}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quality Metrics Card */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-slate-700 tracking-tight uppercase">Quality Metrics</h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">Total Defective Units</span>
                                    <span className="text-sm font-black text-slate-800">{report.conclusion.metrics.defectiveUnits}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">Defect Rate</span>
                                    <span className="text-sm font-black text-slate-800">{report.conclusion.metrics.defectRate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Defects Table */}
                    <div className="mt-8">
                        <h4 className="text-sm font-black text-slate-700 mb-4 tracking-tight uppercase">Detailed Defects</h4>
                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Defect Name</th>
                                        <th className="p-4 text-right text-[11px] font-black text-slate-500 uppercase tracking-wider">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {report.detailedDefects.map((defect, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 text-sm font-bold text-slate-700">{defect.name}</td>
                                            <td className="p-4 text-right text-sm font-black text-slate-900">{defect.qty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-8">
                        <h4 className="text-sm font-black text-slate-700 mb-4 tracking-tight uppercase">Comments</h4>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-inner">
                            <p className="text-xs font-bold text-slate-600 leading-relaxed italic">{report.comments}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspectionReportDetail;
