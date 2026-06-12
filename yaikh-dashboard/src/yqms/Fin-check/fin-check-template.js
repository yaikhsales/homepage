import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    Layout, Plus, Search, MoreHorizontal, FileText, ArrowLeft,
    GripVertical, CheckCircle2, XCircle, Info, Camera,
    Layers, MapPin, Bug, Ruler, ClipboardCheck, User,
    Trash2, Edit, ChevronRight, Shield, Sparkles
} from 'lucide-react';

const PPSheetContent = () => {
    const sheetRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownloadPDF = async () => {
        if (isGenerating) return;
        setIsGenerating(true);

        if (!sheetRef.current) {
            setIsGenerating(false);
            return;
        }

        try {
            const element = sheetRef.current;

            const canvas = await html2canvas(element, {
                scale: 1.5,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
                onclone: (clonedDoc) => {
                    const clonedElement = clonedDoc.querySelector('[ref]');
                    if (clonedElement) clonedElement.style.animation = 'none';
                }
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = pdfHeight;
            let position = 0;
            const pageHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`PP-Report-${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div ref={sheetRef} className="flex flex-col gap-0 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-10">
            {/* MAIN HEADER FOR THE SHEET */}
            <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">PP Meeting Analysis Report</h2>
                        <p className="text-slate-500 text-xs font-bold">Pre-Production Quality Control Sheet / 产前质量控制表</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Live Auto-Save</span>
                    </div>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isGenerating}
                        className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2 ${isGenerating
                            ? 'bg-slate-400 text-slate-100 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating...
                            </>
                        ) : (
                            'Download PDF'
                        )}
                    </button>
                </div>
            </div>

            <div className="p-8 flex flex-col gap-4">
                {/* PP MEETING REPORT */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-100 to-slate-100 px-6 py-4 flex items-center gap-3">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <h3 className="text-slate-800 font-black text-sm uppercase">Basic Information / 基本信息</h3>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-gradient-to-b from-white to-slate-50/30">
                        <div className="flex flex-col gap-2.5">
                            <label className="text-xs font-black text-slate-700 uppercase ml-1">Style / 款号</label>
                            <div className="relative group">
                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                                <input type="text" placeholder="Enter Style No..." className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all shadow-sm" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <label className="text-xs font-black text-slate-700 uppercase ml-1">Qty / 数量</label>
                            <div className="relative group">
                                <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                                <input type="text" placeholder="0" className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all shadow-sm" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <label className="text-xs font-black text-slate-700 uppercase ml-1">Date / 日期</label>
                            <div className="relative group">
                                <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 group-hover:text-amber-600 transition-colors" />
                                <input type="text" defaultValue="03/07/2026" className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-amber-50 focus:border-amber-500 outline-none transition-all shadow-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* MATERIAL AVAILABILITY */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-100 to-slate-100 px-6 py-4 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <h3 className="text-slate-800 font-black text-sm uppercase">Material Availability / 物料可用性</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 bg-white">
                        {[
                            { label: "PP / Size Set / Ref samples 复制样衣", type: "status" },
                            { label: "Approval Swatches 布办", type: "status" },
                            { label: "Approval Full Size Spec 各跳尺寸表", type: "status" },
                            { label: "Approval Trim card 物料卡", type: "status" },
                            { label: "Sample Comments 客人评语", type: "status" },
                            { label: "Approval Print / Embroidery 印花、绣花", type: "status" },
                            { label: "Hand feel Standard 手感样", type: "status" },
                            { label: "Fabric inspection result 验布结果", type: "passfail" },
                            { label: "Approval Washing Standard 洗水样", type: "status" },
                            { label: "Other 其他", type: "input" }
                        ].map((item, idx) => (
                            <div key={idx} className={`flex items-center justify-between p-6 border-slate-200 group hover:bg-slate-50/80 transition-all ${idx % 2 === 0 ? 'lg:border-r' : ''} ${idx >= 2 ? 'border-t' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${idx % 2 === 0 ? 'bg-indigo-50 text-indigo-500' : 'bg-blue-50 text-blue-500'}`}>
                                        {idx + 1}
                                    </div>
                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight max-w-[200px] leading-tight">{item.label}</span>
                                </div>

                                {item.type === "status" && (
                                    <div className="flex bg-slate-100/80 p-1 rounded-xl gap-1 border border-slate-200/50">
                                        <button className="w-10 h-10 flex items-center justify-center bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-200 transition-all hover:scale-105 active:scale-95"><CheckCircle2 size={18} strokeWidth={3} /></button>
                                        <button className="w-10 h-10 flex items-center justify-center bg-rose-500 text-white rounded-lg shadow-lg shadow-rose-200 transition-all hover:scale-105 active:scale-95"><XCircle size={18} strokeWidth={2} /></button>
                                        <button className="px-4 h-10 text-slate-400 text-[10px] font-black uppercase tracking-wider hover:text-slate-600 hover:bg-white rounded-lg">N/A</button>
                                    </div>
                                )}

                                {item.type === "passfail" && (
                                    <div className="flex bg-slate-100/80 p-1 rounded-xl gap-1 border border-slate-200/50">
                                        <button className="px-5 h-10 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all hover:scale-105 active:scale-95">Pass</button>
                                        <button className="px-5 h-10 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-rose-500 hover:bg-white transition-all">Fail</button>
                                        <button className="px-5 h-10 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-slate-600 hover:bg-white transition-all">N/A</button>
                                    </div>
                                )}

                                {item.type === "input" && (
                                    <input type="text" placeholder="Specify..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold w-64 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-inner" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RISK ANALYSIS & CRITICAL OPERATION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* RISK ANALYSIS */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
                        <div className="bg-gradient-to-r from-slate-100 to-slate-100 px-6 py-4 flex items-center gap-3">
                            <Info className="w-5 h-5 text-red-600" />
                            <h3 className="text-slate-800 font-black text-sm uppercase">Risk Analysis & Prevention / 风险分析</h3>
                        </div>
                        <div className="p-0">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 border-t border-slate-200">
                                        <th className="px-8 py-4 text-[14px] font-bold text-slate-600 text-left w-1/2 border-r border-slate-200">Risk Analysis 风险分析</th>
                                        <th className="px-8 py-4 text-[14px] font-bold text-slate-600 text-left">Risk Preventive Action 预防风险措施</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="group">
                                        <td className="p-8 border-r border-slate-200 align-top bg-white">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-black text-orange-600">1</div>
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Identified Risk</span>
                                                </div>
                                                <textarea placeholder="Describe potential quality or production risks..." className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-6 text-sm font-bold text-slate-700 min-h-[160px] focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all resize-none shadow-inner" />
                                            </div>
                                        </td>
                                        <td className="p-8 align-top bg-white">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-600">A</div>
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Corrective Strategy</span>
                                                </div>
                                                <textarea placeholder="Propose clear preventive actions or solutions..." className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-6 text-sm font-bold text-slate-700 min-h-[160px] focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-50 outline-none transition-all resize-none shadow-inner" />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="p-6 bg-slate-50/30 border-t border-slate-200 flex flex-col items-center justify-center">
                                <button className="flex items-center justify-center gap-3 w-full py-5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-orange-600 hover:border-orange-400 hover:bg-orange-50 transition-all font-black text-xs uppercase tracking-widest group shadow-sm bg-white">
                                    <Plus className="w-5 h-5 group-hover:scale-125 transition-transform" />
                                    <span className="text-center">Add New Risk Entry</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CRITICAL OPERATION */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="bg-gradient-to-r from-slate-100 to-slate-100 px-6 py-4 flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-orange-600" />
                            <h3 className="text-slate-800 font-black text-sm uppercase">Critical Operation / 重点部位</h3>
                        </div>
                        <div className="p-8 flex flex-col gap-6 bg-gradient-to-b from-white to-slate-50/30 flex-1">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="h-px flex-1 bg-slate-100" />
                                    <span className="text-xs font-black text-purple-600 bg-purple-100 px-4 py-1.5 rounded-full uppercase tracking-tight shadow-sm border border-purple-200">Operation 01</span>
                                    <div className="h-px flex-1 bg-slate-100" />
                                </div>
                                <textarea placeholder="Describe focusing areas, SPI, or specific requirements..." className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-sm font-bold text-slate-700 min-h-[120px] focus:ring-4 focus:ring-purple-50 focus:border-purple-500 outline-none transition-all shadow-sm resize-none" />
                            </div>
                            <button className="flex items-center justify-center gap-3 w-full py-4 bg-purple-50 text-purple-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-100 transition-all border border-purple-100 shadow-sm active:scale-95">
                                <Plus className="w-4 h-4 stroke-[3px]" />
                                <span className="text-center">Add Critical Operation</span>
                            </button>
                        </div>
                    </div>

                    {/* OTHER COMMENTS */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="bg-gradient-to-r from-slate-100 to-slate-100 px-6 py-4 flex items-center gap-3">
                            <FileText className="w-5 h-5 text-orange-600" />
                            <h3 className="text-slate-800 font-black text-sm uppercase">Other Comments / 其他评语</h3>
                        </div>
                        <div className="p-8 flex flex-col gap-6 bg-gradient-to-b from-white to-slate-50/30 flex-1">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="h-px flex-1 bg-slate-100" />
                                    <span className="text-xs font-black text-teal-600 bg-teal-100 px-4 py-1.5 rounded-full uppercase tracking-tight shadow-sm border border-teal-200">Note 01</span>
                                    <div className="h-px flex-1 bg-slate-100" />
                                </div>
                                <textarea placeholder="Add any general remarks or shipping requirements..." className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-sm font-bold text-slate-700 min-h-[120px] focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none transition-all shadow-sm resize-none" />
                            </div>
                            <button className="flex items-center justify-center gap-3 w-full py-4 bg-teal-50 text-teal-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-100 transition-all border border-teal-100 shadow-sm active:scale-95">
                                <Plus className="w-4 h-4 stroke-[3px]" />
                                <span className="text-center">Add General Comment</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ATTENDANCE */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-100 to-slate-100 px-6 py-4 flex items-center gap-3">
                        <User className="w-5 h-5 text-pink-600" />
                        <h3 className="text-slate-800 font-black text-sm uppercase">Department Attendance / 签名</h3>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 bg-gradient-to-b from-white to-slate-50/30">
                        {[
                            { label: "Merchandiser (跟单)", icon: User, color: "indigo" },
                            { label: "Technical (技术部)", icon: Ruler, color: "blue" },
                            { label: "Cutting (裁床)", icon: Layers, color: "orange" },
                            { label: "QA & QC", icon: Shield, color: "emerald" },
                            { label: "Sewing (车间)", icon: Layout, color: "purple" },
                            { label: "Mechanic (机修)", icon: Bug, color: "rose" },
                            { label: "Ironing (烫部)", icon: Sparkles, color: "amber" },
                            { label: "Packing (包装)", icon: FileText, color: "teal" }
                        ].map((dept, idx) => (
                            <div key={idx} className="flex flex-col gap-3 group">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-xs font-black text-slate-700 leading-none transition-colors">{dept.label}</label>
                                    <dept.icon className={`w-3.5 h-3.5 text-slate-700 group-focus-within:text-emerald-500 transition-all`} />
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                    <input type="text" placeholder="ID or Name..." className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all shadow-sm" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* IMAGES */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-100 to-slate-100 px-6 py-4 flex items-center gap-3">
                        <Camera className="w-5 h-5 text-slate-800" />
                        <h3 className="text-slate-800 font-black text-sm uppercase">Images / 图片</h3>
                    </div>
                    <div className="p-8 pb-12 flex flex-col gap-6 bg-white min-h-[300px] relative">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-tight">Captured Images (0/10)</h4>
                        </div>

                        <div className="flex">
                            {/* Vertical Action Group */}
                            <div className="w-[90px] h-[180px] rounded-xl border-2 border-dashed border-slate-200 flex flex-col overflow-hidden bg-slate-50/30">
                                <button className="flex-1 flex items-center justify-center hover:bg-slate-50 transition-colors group">
                                    <Camera size={24} className="text-pink-600 group-hover:text-pink-500 transition-colors" />
                                </button>
                                <div className="h-px bg-slate-200 w-full" />
                                <button className="flex-1 flex items-center justify-center hover:bg-slate-50 transition-colors group">
                                    <div className="w-6 h-6 border-2 border-slate-300 rounded-md flex items-center justify-center group-hover:border-blue-500 transition-colors">
                                        <Plus size={16} className="text-blue-600 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Centered Placeholder Text */}
                        <div className="absolute bottom-12 left-0 right-0 text-center">
                            <p className="text-[13px] font-bold text-slate-400 italic">No images added yet. Click camera or upload icons to add.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FinCheckTemplate = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState("Reports");
    const navItems = [
        { icon: FileText, label: "Reports", active: true },
        { icon: Layout, label: "Header Preview" },
        { icon: Camera, label: "Photo Sections" },
        { icon: MapPin, label: "Defect Locations" },
        { icon: Bug, label: "Defect Selection" },
        { icon: Ruler, label: "Measurements" },
        { icon: ClipboardCheck, label: "PP Sheet" }
    ];

    const templateData = [
        {
            no: 1,
            type: "Pilot Run-Sewing",
            meas: "Before",
            meas2: "After",
            head: true,
            pics: true,
            defects: ["FR", "WMS", "CLA", "TA", "LF", "WA"],
            photos: ["Lab test & testing...", "Product", "PHOTOS ATTACH...", "Packing, Packagi..."],
            line: true, tab: false, col: true, stage: false, meth: "AQL", qty: 5, ctn: false, scan: false, qplan: false, conc: true
        },
        {
            no: 2,
            type: "First Output Sewing",
            meas: "Before",
            meas2: "After",
            head: true,
            pics: true,
            defects: ["FR", "WMS", "CLA", "TA", "LF"],
            photos: ["Lab test & testing...", "Product", "PHOTOS ATTACH...", "Packing, Packagi..."],
            line: true, tab: false, col: true, stage: false, meth: "Fixed", qty: 5, ctn: false, scan: false, qplan: false, conc: true
        },
        {
            no: 3,
            type: "Inline Inspection-Sewing",
            meas: "Before",
            meas2: "After",
            head: true,
            pics: true,
            defects: ["FR", "WMS", "CLA", "TA", "LF", "WA", "IR"],
            photos: ["Lab test & testing...", "Product", "PHOTOS ATTACH...", "Packing, Packagi..."],
            line: true, tab: false, col: true, stage: false, meth: "Fixed", qty: 28, ctn: false, scan: true, qplan: false, conc: true
        },
        {
            no: 4,
            type: "First output Finishing",
            meas: "After",
            meas2: "No",
            head: true,
            pics: true,
            defects: ["FR", "WMS", "CLA", "TA", "LF", "WA", "IR", "PC"],
            photos: ["Lab test & testing...", "Packing, Packagi...", "PHOTOS ATTACH...", "Product"],
            line: false, tab: false, col: true, stage: false, meth: "Fixed", qty: 5, ctn: false, scan: false, qplan: false, conc: true
        },
        {
            no: 5,
            type: "Inline Inspection-Finishing",
            meas: "After",
            meas2: "No",
            head: true,
            pics: true,
            defects: ["FR", "WMS", "CLA", "TA", "LF", "WA", "IR", "PC"],
            photos: ["Lab test & testing...", "Product", "PHOTOS ATTACH...", "Packing, Packagi..."],
            line: false, tab: true, col: true, stage: false, meth: "Fixed", qty: 25, ctn: false, scan: false, qplan: false, conc: true
        },
        {
            no: 6,
            type: "Interim Inspection",
            meas: "After",
            meas2: "No",
            head: true,
            pics: true,
            defects: ["FR", "WMS", "CLA", "TA", "LF", "WA", "IR", "PC"],
            photos: ["Dummy View", "PHOTOS ATTACH...", "Packing, Packagi...", "Lab test & testing...", "Product", "SHIPPING MARK..."],
            line: false, tab: false, col: true, stage: true, meth: "AQL", qty: 0, ctn: false, scan: false, qplan: true, conc: true
        },
        {
            no: 7,
            type: "First output Carton",
            meas: "No",
            meas2: "No",
            head: true,
            pics: true,
            defects: ["CLA", "FC", "TA"],
            photos: ["Lab test & testing...", "PHOTOS ATTACH...", "SHIPPING MARK...", "Packing, Packagi...", "Product"],
            line: false, tab: false, col: true, stage: true, meth: "AQL", qty: 0, ctn: true, scan: false, qplan: false, conc: true
        },
        {
            no: 8,
            type: "Pre-Final Inspection",
            meas: "After",
            meas2: "No",
            head: true,
            pics: true,
            defects: ["FB", "WMS", "CLA", "TA", "LE", "WA", "IR", "PC"],
            photos: ["Dummy View", "Lab test & testing...", "PHOTOS ATTACH...", "Packing, Packagi...", "Product", "SHIPPING MARK..."],
            line: false, tab: false, col: true, stage: true, meth: "AQL", qty: 0, ctn: false, scan: false, qplan: true, conc: true
        },
        {
            no: 9,
            type: "Final Inspection",
            meas: "After",
            meas2: "No",
            head: true,
            pics: true,
            defects: ["FR", "WMS", "CLA", "TA", "LF", "WA", "IR", "PC"],
            photos: ["Dummy View", "Lab test & testing...", "Product", "PHOTOS ATTACH...", "SHIPPING MARK...", "Packing, Packagi..."],
            line: false, tab: false, col: true, stage: true, meth: "AQL", qty: 0, ctn: false, scan: false, qplan: true, conc: true
        },
        {
            no: 10,
            type: "EMB Interim",
            meas: "No",
            meas2: "No",
            head: true,
            pics: true,
            defects: ["EMB"],
            photos: ["Product", "PHOTOS ATTACH...", "Packing, Packagi..."],
            line: false, tab: false, col: true, stage: false, meth: "AQL", qty: 0, ctn: false, scan: false, qplan: true, conc: true
        },
        {
            no: 11,
            type: "Printing Interim",
            meas: "No",
            meas2: "No",
            head: true,
            pics: true,
            defects: ["PRI"],
            photos: ["Product", "PHOTOS ATTACH...", "Packing, Packagi..."],
            line: false, tab: false, col: true, stage: false, meth: "AQL", qty: 0, ctn: false, scan: false, qplan: true, conc: true
        },
        {
            no: 12,
            type: "EMB Frist Output",
            meas: "No",
            meas2: "No",
            head: true,
            pics: true,
            defects: ["EMB"],
            photos: ["PHOTOS ATTACH...", "Packing List & La...", "Product"],
            line: false, tab: false, col: false, stage: false, meth: "Fixed", qty: 25, ctn: false, scan: false, qplan: true, conc: true
        },
        {
            no: 13,
            type: "Printing First Output",
            meas: "No",
            meas2: "No",
            head: true,
            pics: true,
            defects: ["PRI"],
            photos: ["PHOTOS ATTACH...", "Packing List & La...", "Product"],
            line: false, tab: false, col: false, stage: false, meth: "Fixed", qty: 25, ctn: false, scan: false, qplan: true, conc: true
        }
    ];

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col">
            {/* Header with Visual Polish */}
            <div className="w-full bg-gradient-to-r from-[#5340C7] via-[#9F37B3] to-[#C9338D] text-white p-4 shadow-xl relative z-50 rounded-xl">
                <div className="flex items-center justify-between gap-2 max-w-full mx-auto px-6">
                    {/* Brand Section */}
                    <div className="flex items-center gap-4 shrink-0">
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/40 hover:bg-white/20 transition-all group active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5 text-white transition-transform group-hover:-translate-x-0.5" />
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/40">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black leading-tight flex items-center gap-2">
                                Fin Check | Templates
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm group/pro cursor-help">
                                    <Sparkles size={12} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-[10px] font-black tracking-wider">PRO</span>
                                </div>
                            </h1>
                            <p className="text-white/70 text-sm font-bold mt-0.5">Manage Inspection Templates & Configurations</p>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex-1 max-w-3xl bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/40 flex items-center gap-2 mx-6 overflow-x-auto no-scrollbar">
                        {navItems.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveTab(item.label)}
                                className={`flex flex-col items-center justify-center min-w-[100px] h-14 rounded-xl transition-all cursor-pointer relative group ${activeTab === item.label ? 'bg-white text-[#9333EA] shadow-lg' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
                            >
                                {activeTab === item.label && (
                                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                                )}
                                <item.icon className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${activeTab === item.label ? 'text-[#9333EA]' : 'text-white'}`} />
                                <span className={`text-[12px] font-black text-center ${activeTab === item.label ? 'text-xs' : 'text-white'}`}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Active Status & User */}
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="flex items-center gap-3 py-2 px-4 bg-white/10 rounded-2xl border border-white/40">
                            <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#34D399]" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-white leading-none">{activeTab}</span>
                                <span className="text-[8px] font-bold text-white/40 uppercase mt-0.5">Active Section</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 py-2 px-4 bg-white/10 rounded-2xl border border-white/40">
                            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white leading-none">QA Officer</span>
                                <span className="text-[8px] font-bold text-white/40 uppercase mt-0.5">ID: YM7625</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="px-6 py-6 flex flex-col gap-6 flex-1 overflow-y-auto">
                {activeTab === "Reports" ? (
                    <>
                        {/* Section Title & Primary Action */}
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Manage Report Templates</h2>
                                <p className="text-slate-400 text-sm font-bold">Configure report structures and categories. <span className="text-indigo-500 cursor-pointer hover:underline">Drag rows to reorder.</span></p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-indigo-200">
                                <Plus className="w-4 h-4 stroke-[3px]" />
                                Add New Report
                            </button>
                        </div>

                        {/* Banner Alert */}
                        <div className="w-full bg-[#EEF2FF] border border-blue-200 rounded-lg p-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                                <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[13px] font-black text-indigo-700">Drag and Drop to Reorder</span>
                                <span className="text-[11px] font-bold text-indigo-400">Use the grip handle or drag any row to change the template order. Changes are saved automatically.</span>
                            </div>
                        </div>

                        {/* Dynamic Configuration Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto no-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[1250px]">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="p-2 text-center w-10"><GripVertical className="w-4 h-4 text-slate-300 mx-auto" /></th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase">NO</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase">REPORT TYPE</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">MEAS.</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">MEAS 2</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">HEAD</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">PICS</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase">DEFECT CATEGORIES</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase">PHOTO SECTIONS</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">LINE</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">TAB</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">COL</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">STAGE</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">METH</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">QTY</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">CTN</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">SCAN</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">Q.PLAN</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">CONC</th>
                                        <th className="p-2 text-[12px] font-black text-slate-400 uppercase text-center">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {templateData.map((row) => (
                                        <tr key={row.no} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group cursor-grab active:cursor-grabbing">
                                            <td className="p-2 text-center opacity-20 group-hover:opacity-100"><GripVertical className="w-4 h-4 mx-auto" /></td>
                                            <td className="p-2 border-r border-slate-50">
                                                <div className="w-7 h-7 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 text-xs font-black mx-auto border border-indigo-100">
                                                    {row.no}
                                                </div>
                                            </td>
                                            <td className="p-2 border-r border-slate-50 max-w-[200px]">
                                                <span className="text-sm font-bold text-slate-700">{row.type}</span>
                                            </td>
                                            {/* MEAS Column */}
                                            <td className="p-2 text-center border-r border-slate-50">
                                                {row.meas === "No" ? (
                                                    <div className="flex items-center justify-center gap-1.5 text-slate-300">
                                                        <XCircle className="w-4 h-4" />
                                                        <span className="text-[10px] font-black uppercase">No</span>
                                                    </div>
                                                ) : (
                                                    <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase inline-flex items-center gap-1 ${row.meas === 'Before' ? 'bg-[#E0E7FF] text-[#4338CA]' : 'bg-[#DBEAFE] text-[#1D4ED8]'}`}>
                                                        <div className={`w-1 h-1 rounded-full ${row.meas === 'Before' ? 'bg-[#4338CA]' : 'bg-[#1D4ED8]'}`} />
                                                        {row.meas}
                                                    </div>
                                                )}
                                            </td>
                                            {/* MEAS 2 Column */}
                                            <td className="p-2 text-center border-r border-slate-50">
                                                {row.meas2 !== "No" ? (
                                                    <div className="px-2 py-1 bg-[#EEF2FF] text-[#6366F1] rounded-lg text-[10px] font-black uppercase inline-flex items-center gap-1 border border-indigo-100">
                                                        <div className="w-1 h-1 bg-[#6366F1] rounded-full" />
                                                        {row.meas2}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center gap-1.5 text-slate-300">
                                                        <XCircle className="w-4 h-4" />
                                                        <span className="text-[10px] font-black uppercase">No</span>
                                                    </div>
                                                )}
                                            </td>
                                            {/* YES/NO Badges (HEAD, PICS, etc) */}
                                            {[row.head, row.pics].map((val, idx) => (
                                                <td key={idx} className="p-2 text-center border-r border-slate-50">
                                                    {val ? (
                                                        <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase inline-flex items-center gap-1.5 border border-emerald-100">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Yes
                                                        </div>
                                                    ) : (
                                                        <div className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase inline-flex items-center gap-1.5 border border-slate-100">
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            No
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                            {/* Defect Categories Tags */}
                                            <td className="p-2 border-r border-slate-50 max-w-[150px]">
                                                <div className="flex flex-wrap gap-1">
                                                    {row.defects.map((def, idx) => (
                                                        <span key={idx} className="text-[8px] font-black px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded border border-indigo-100 uppercase">
                                                            {def}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            {/* Photo Sections Tags */}
                                            <td className="p-2 border-r border-slate-50 max-w-[200px]">
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    {row.photos.map((photo, idx) => (
                                                        <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50/50 text-emerald-600 rounded-md border border-emerald-100/50 overflow-hidden">
                                                            <Camera className="w-2.5 h-2.5 shrink-0" />
                                                            <span className="text-[9px] font-bold truncate tracking-tight">{photo}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            {/* Boolean Columns (LINE, TAB, COL, STAGE) */}
                                            {[row.line, row.tab, row.col, row.stage].map((val, idx) => (
                                                <td key={idx} className="p-2 text-center border-r border-slate-50">
                                                    {val ? (
                                                        <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase inline-flex items-center gap-1 border border-emerald-100">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Yes
                                                        </div>
                                                    ) : (
                                                        <div className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase inline-flex items-center gap-1 border border-slate-100">
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            No
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                            <td className="p-2 text-center border-r border-slate-50">
                                                <div className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase inline-flex items-center gap-1.5 border border-indigo-100">
                                                    <Layers className="w-3.5 h-3.5" />
                                                    {row.meth}
                                                </div>
                                            </td>
                                            <td className="p-2 text-center border-r border-slate-50 text-xs font-black text-slate-700">{row.qty}</td>
                                            {/* Boolean Columns Remaining (CTN, SCAN, QPLAN, CONC) */}
                                            {[row.ctn, row.scan, row.qplan, row.conc].map((val, idx) => (
                                                <td key={idx} className="p-2 text-center border-r border-slate-50">
                                                    {val ? (
                                                        <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase inline-flex items-center gap-1 border border-emerald-100">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Yes
                                                        </div>
                                                    ) : (
                                                        <div className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase inline-flex items-center gap-1 border border-slate-100">
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            No
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                            {/* Actions */}
                                            <td className="p-2 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-600 rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : activeTab === "PP Sheet" ? (
                    <PPSheetContent />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                            <Layers size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-700">Section Under Construction</h3>
                        <p className="text-slate-400 font-bold mt-2">The {activeTab} section is currently being developed.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinCheckTemplate;
