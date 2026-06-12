import React, { useRef, useState } from 'react';
import {
    Download, X, FileText, CheckCircle2, AlertCircle,
    Camera, Shield, Sparkles, User, Info, Calendar, Clock,
    Layout, Printer, Check, FileDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormalHumidityReport } from './export-pdf';

const HumidityReportDetail = ({ onClose, data }) => {
    const reportRef = useRef(null);
    const printRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Default data mapping based on screenshot
    const report = data || {
        id: "GPAR12394",
        buyerStyle: "FFS 99-03-44504-SU26",
        spec: "52%",
        date: "3/10/2026",
        customer: "Aritzia",
        fabrication: "COTTON 78%, POLYESTER 22%",
        color: "PANORAMA BLUE",
        beforeDry: "7:58 AM",
        afterDry: "N/A",
        sections: {
            top: { body: "36", status: "PASS" },
            middle: { body: "40", status: "PASS" },
            bottom: { body: "35", status: "PASS" }
        },
        totalResult: "PASS",
        photo: null // Placeholder for photo
    };

    const handleDownloadPDF = async () => {
        if (isGenerating) return;
        setIsGenerating(true);

        try {
            // Target the formal hidden element
            const element = printRef.current;
            if (!element) throw new Error("Export element not found");

            // Ensure it's rendered and measurable by moving it off-screen 
            // instead of using display: none on parent
            const originalStyle = element.style.cssText;
            element.style.position = 'fixed';
            element.style.top = '0';
            element.style.left = '-9999px';
            element.style.display = 'block';
            element.style.visibility = 'visible';

            // Wait a frame for browser to layout
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: true, // Enable logging for debugging
                backgroundColor: "#ffffff",
                width: 1120, // Match the fixed width of formal-report-container
                windowWidth: 1120
            });

            // Restore style
            element.style.cssText = originalStyle;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'l',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Humidity-Inspection-Record-${report.id}.pdf`);
        } catch (error) {
            console.error('PDF Export failed:', error);
            alert(`PDF Export failed: ${error.message}. Please try again.`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
            {/* 1. Formal Export Layout (Hidden via off-screen positioning) */}
            <div className="absolute left-[-9999px] top-0 no-print" aria-hidden="true">
                <FormalHumidityReport ref={printRef} report={report} />
            </div>

            {/* 2. Interactive Modal View */}
            <div className="bg-white w-full max-w-[1400px] h-fit rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col border border-slate-200">
                {/* Header Container */}
                <div ref={reportRef} className="bg-white p-8">
                    {/* Top Banner Section */}
                    <div className="bg-[#E6F9F0] rounded-2xl p-6 flex items-center justify-between mb-8 border border-[#D1F2E1]">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-[#B7EBD0] rounded-2xl flex items-center justify-center text-[#2DA44E] shadow-sm">
                                <FileText size={32} />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-black text-[#2DA44E] tracking-tight leading-none mb-3">Inspection History</h1>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-white rounded-lg text-xs font-black text-[#2DA44E] border border-[#B7EBD0]">{report.id || data?.factoryStyle}</span>
                                    <div className="w-1 h-1 rounded-full bg-[#B7EBD0]" />
                                    <span className="px-3 py-1 bg-white rounded-lg text-xs font-black text-[#2DA44E] border border-[#B7EBD0]">{report.buyerStyle || data?.buyerStyle}</span>
                                    <div className="w-1 h-1 rounded-full bg-[#B7EBD0]" />
                                    <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-black text-[#2DA44E] border border-[#B7EBD0] uppercase">SPEC (BODY): {report.spec || "52%"}</span>
                                    <div className="w-1 h-1 rounded-full bg-[#B7EBD0]" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 no-print">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#2DA44E] text-[#2DA44E] rounded-xl text-xs font-black hover:bg-emerald-50 transition-all active:scale-95 uppercase tracking-wider">
                                <Check size={16} strokeWidth={3} /> APPROVE REPORT
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#E14D2A] text-[#E14D2A] rounded-xl text-xs font-black hover:bg-red-50 transition-all active:scale-95 uppercase tracking-wider"
                            >
                                <Printer size={16} strokeWidth={3} /> PRINT
                            </button>
                            <button
                                onClick={handleDownloadPDF}
                                disabled={isGenerating}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#FD5D5D] text-white rounded-xl text-xs font-black shadow-lg shadow-red-200 hover:bg-[#e05252] transition-all active:scale-95 uppercase tracking-wider"
                            >
                                <FileDown size={16} strokeWidth={3} />
                                {isGenerating ? 'Exporting...' : 'Export PDF'}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-300 transition-all active:scale-95"
                            >
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="border border-slate-100 rounded-2xl overflow-hidden mb-8 shadow-sm">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th rowSpan="2" className="px-4 py-6 text-center text-[11px] font-black text-slate-800 uppercase tracking-tight w-16">N°</th>
                                    <th rowSpan="2" className="px-4 py-6 text-center text-[11px] font-black text-slate-800 uppercase tracking-tight w-28">DATE</th>
                                    <th rowSpan="2" className="px-4 py-6 text-center text-[11px] font-black text-slate-800 uppercase tracking-tight">CUSTOMER</th>
                                    <th rowSpan="2" className="px-4 py-6 text-center text-[11px] font-black text-slate-800 uppercase tracking-tight">FABRICATION</th>
                                    <th rowSpan="2" className="px-4 py-6 text-center text-[11px] font-black text-slate-800 uppercase tracking-tight">COLOR</th>
                                    <th rowSpan="2" className="px-4 py-6 text-center text-[11px] font-black text-slate-800 uppercase tracking-tight">BEFORE DRY</th>
                                    <th rowSpan="2" className="px-4 py-6 text-center text-[11px] font-black text-slate-800 uppercase tracking-tight">AFTER DRY</th>
                                    <th colSpan="2" className="px-4 py-3 text-center text-[11px] font-black text-slate-800 uppercase tracking-tight border-b border-slate-100">TOP SECTION</th>
                                    <th colSpan="2" className="px-4 py-3 text-center text-[11px] font-black text-slate-800 uppercase tracking-tight border-b border-slate-100">MIDDLE SECTION</th>
                                    <th colSpan="2" className="px-4 py-3 text-center text-[11px] font-black text-slate-800 uppercase tracking-tight border-b border-slate-100">BOTTOM SECTION</th>
                                    <th rowSpan="2" className="px-4 py-6 text-center text-[11px] font-black text-slate-800 uppercase tracking-tight">TOTAL RESULT</th>
                                    <th rowSpan="2" className="px-4 py-6 text-center text-[11px] font-black text-slate-800 uppercase tracking-tight">PHOTOS</th>
                                </tr>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-2 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider text-center border-l border-slate-100">BODY</th>
                                    <th className="px-2 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider text-center">STATUS</th>
                                    <th className="px-2 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider text-center border-l border-slate-100">BODY</th>
                                    <th className="px-2 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider text-center">STATUS</th>
                                    <th className="px-2 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider text-center border-l border-slate-100">BODY</th>
                                    <th className="px-2 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider text-center">STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Subheader Label */}
                                <tr className="bg-[#F8FFF9]">
                                    <td colSpan="14" className="px-6 py-2 border-b border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                                                    <Check size={10} className="text-emerald-500" strokeWidth={4} />
                                                </div>
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">ITEM 1</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">ITEM RESULT:</span>
                                                <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full border border-emerald-100 shadow-sm">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                    <span className="text-[8px] font-black text-emerald-600 uppercase">PASS</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr className="group">
                                    <td className="px-4 py-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-black text-slate-400 group-hover:text-slate-800 transition-colors">Check</span>
                                            <span className="text-sm font-black text-slate-800">1</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 text-center text-xs font-bold text-slate-600">{report.date || data?.date}</td>
                                    <td className="px-4 py-6 text-center text-xs font-bold text-slate-600">{report.customer || data?.customer}</td>
                                    <td className="px-4 py-6 text-center text-[10px] font-bold text-slate-500 leading-snug w-40">{report.fabrication}</td>
                                    <td className="px-4 py-6 text-center text-[10px] font-black text-slate-800 uppercase tracking-widest">{report.color}</td>
                                    <td className="px-4 py-6 text-center text-xs font-bold text-slate-600">{report.beforeDry}</td>
                                    <td className="px-4 py-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{report.afterDry}</td>

                                    {/* Top Section */}
                                    <td className="px-2 py-6 text-center border-l border-slate-50">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-black text-slate-800 mb-0.5">{report.sections.top.body}</span>
                                            <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest">PASS</span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-6 text-center">
                                        <div className="inline-flex items-center gap-1.5 bg-[#EEFFF6] text-[#2DA44E] px-3 py-1.5 rounded-full border border-[#D1F2E1]">
                                            <div className="w-1.5 h-1.5 bg-[#2DA44E] rounded-full" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">PASS</span>
                                        </div>
                                    </td>

                                    {/* Middle Section */}
                                    <td className="px-2 py-6 text-center border-l border-slate-50">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-black text-slate-800 mb-0.5">{report.sections.middle.body}</span>
                                            <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest">PASS</span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-6 text-center">
                                        <div className="inline-flex items-center gap-1.5 bg-[#EEFFF6] text-[#2DA44E] px-3 py-1.5 rounded-full border border-[#D1F2E1]">
                                            <div className="w-1.5 h-1.5 bg-[#2DA44E] rounded-full" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">PASS</span>
                                        </div>
                                    </td>

                                    {/* Bottom Section */}
                                    <td className="px-2 py-6 text-center border-l border-slate-50">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-black text-slate-800 mb-0.5">{report.sections.bottom.body}</span>
                                            <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest">PASS</span>
                                        </div>
                                    </td>
                                    <td className="px-2 py-6 text-center">
                                        <div className="inline-flex items-center gap-1.5 bg-[#EEFFF6] text-[#2DA44E] px-3 py-1.5 rounded-full border border-[#D1F2E1]">
                                            <div className="w-1.5 h-1.5 bg-[#2DA44E] rounded-full" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">PASS</span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-6 text-center">
                                        <div className="inline-flex items-center gap-1.5 bg-[#EEFFF6] text-[#2DA44E] px-3 py-1.5 rounded-full border border-[#D1F2E1]">
                                            <div className="w-1.5 h-1.5 bg-[#2DA44E] rounded-full" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">PASS</span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-6 text-center">
                                        <div className="w-14 h-10 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group/img cursor-zoom-in">
                                            <div className="absolute inset-0 bg-slate-800/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-all">
                                                <Camera size={14} className="text-white" />
                                            </div>
                                            <img src="https://images.unsplash.com/photo-1558444458-54451f215091?q=80&w=2670&auto=format&fit=crop" alt="Inspection" className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between no-print">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">TOTAL NODES</span>
                            <span className="text-sm font-black text-slate-800">1 Entries</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-[#2DA44E] text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-[0.1em] shadow-lg shadow-emerald-100 hover:bg-[#258a41] transition-all active:scale-95"
                        >
                            CLOSE DETAIL
                        </button>
                    </div>
                </div>

                {/* Print Styles */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        .no-print { display: none !important; }
                        body { background: white !important; }
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                        @page { size: landscape; margin: 10mm; }
                    }
                `}} />
            </div>
        </div>
    );
};

export default HumidityReportDetail;
