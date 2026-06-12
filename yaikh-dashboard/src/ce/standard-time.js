import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, MessageCircle, ArrowLeft, Video, FileText } from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";

const CE_VIDEO_PATH = "/assets/short-video-training/ce.mp4";
const CE_REPORT_PATH = "/assets/report-training/ce-standard-time-audit.html";

const StandardTime = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const tabs = [{ id: "all", label: "SAM DATABASE", count: 12 }];

  const records = [
    {
      id: 1,
      orderNumber: "PO-24-8501",
      styleNumber: "JKT-W-2401",
      customer: "Zara",
      item: "Winter Jacket",
      ppSamHistory: [
        { date: "02-Feb-26", sam: "24.50" },
        { date: "15-Feb-26", sam: "23.80" },
        { date: "01-Mar-26", sam: "23.50" },
      ],
      types: ["PROTO SAMPLE", "FIT SAMPLE", "PP SAMPLE"],
      thumbnail: "https://cdn-icons-png.flaticon.com/128/13442/13442760.png",
      prodSam: "23.50",
      varianceReason: "Complex quilting required",
      comparison: ["22.10", "23.00", "24.20"],
      rowColor: "bg-[#FFFCE8] text-[#9A6B1A] border-l-[#FFD700]",
    },
    {
      id: 2,
      orderNumber: "PO-24-8502",
      styleNumber: "DNM-M-105",
      customer: "Levi's",
      item: "Denim Jeans",
      ppSamHistory: [
        { date: "05-Feb-26", sam: "16.20" },
        { date: "18-Feb-26", sam: "15.80" },
        { date: "05-Mar-26", sam: "15.50" },
      ],
      types: ["INITIAL REF", "SIZE SET", "PP SAMPLE"],
      thumbnail: "https://cdn-icons-png.flaticon.com/128/1867/1867632.png",
      prodSam: "15.75",
      varianceReason: "Stone wash effect added",
      comparison: ["15.00", "15.50", "16.00"],
      rowColor: "bg-[#F0F7FF] text-[#1E4D8C] border-l-[#3B82F6]",
    },
    {
      id: 3,
      orderNumber: "PO-24-8503",
      styleNumber: "TSH-U-009",
      customer: "Uniqlo",
      item: "Basic T-Shirt",
      ppSamHistory: [
        { date: "10-Feb-26", sam: "6.50" },
        { date: "20-Feb-26", sam: "6.20" },
        { date: "08-Mar-26", sam: "6.00" },
      ],
      types: ["DEV SAMPLE", "FIT SAMPLE", "PP SAMPLE"],
      thumbnail: "https://cdn-icons-png.flaticon.com/128/18923/18923323.png",
      prodSam: "6.10",
      varianceReason: "High speed hemming",
      comparison: ["5.90", "6.10", "6.30"],
      rowColor: "bg-[#F0FFF4] text-[#1D6B41] border-l-[#10B981]",
    },
    {
      id: 4,
      orderNumber: "PO-24-8504",
      styleNumber: "SPT-L-77",
      customer: "Lululemon",
      item: "Yoga Leggings",
      ppSamHistory: [
        { date: "12-Feb-26", sam: "14.50" },
        { date: "25-Feb-26", sam: "13.80" },
        { date: "10-Mar-26", sam: "13.50" },
      ],
      types: ["PROTO SAMPLE", "WEAR TEST", "PP SAMPLE"],
      thumbnail: "https://cdn-icons-png.flaticon.com/128/1867/1867632.png",
      prodSam: "13.80",
      varianceReason: "Flatlock stitching",
      comparison: ["13.20", "13.50", "14.00"],
      rowColor: "bg-[#FFF5EB] text-[#A3520A] border-l-[#F97316]",
    },
    {
      id: 5,
      orderNumber: "PO-24-8505",
      styleNumber: "HOOD-M-55",
      customer: "Nike",
      item: "Fleece Hoodie",
      ppSamHistory: [
        { date: "14-Feb-26", sam: "19.50" },
        { date: "28-Feb-26", sam: "18.90" },
        { date: "12-Mar-26", sam: "18.50" },
      ],
      types: ["REF SAMPLE", "FIT SAMPLE", "PP SAMPLE"],
      thumbnail: "https://cdn-icons-png.flaticon.com/128/13442/13442760.png",
      prodSam: "18.75",
      varianceReason: "Kangaroo pocket align",
      comparison: ["18.00", "18.50", "19.20"],
      rowColor: "bg-[#F5F3FF] text-[#5B21B6] border-l-[#8B5CF6]",
    },
    {
      id: 6,
      orderNumber: "PO-24-8506",
      styleNumber: "POLO-W-34",
      customer: "Ralph Lauren",
      item: "Polo Shirt",
      ppSamHistory: [
        { date: "15-Feb-26", sam: "11.20" },
        { date: "28-Feb-26", sam: "10.85" },
        { date: "15-Mar-26", sam: "10.50" },
      ],
      types: ["PROTO SAMPLE", "FIT SAMPLE", "PP SAMPLE"],
      thumbnail: "https://cdn-icons-png.flaticon.com/128/18923/18923323.png",
      prodSam: "10.65",
      varianceReason: "Collar rib adjustment",
      comparison: ["10.10", "10.50", "11.00"],
      rowColor: "bg-[#FFFCE8] text-[#9A6B1A] border-l-[#FFD700]",
    },
    {
      id: 7,
      orderNumber: "PO-24-8507",
      styleNumber: "SWT-K-89",
      customer: "H&M",
      item: "Knit Sweater",
      ppSamHistory: [
        { date: "16-Feb-26", sam: "21.00" },
        { date: "02-Mar-26", sam: "20.20" },
        { date: "18-Mar-26", sam: "19.80" },
      ],
      types: ["INITIAL REF", "SIZE SET", "PP SAMPLE"],
      thumbnail: "https://cdn-icons-png.flaticon.com/128/13442/13442760.png",
      prodSam: "19.95",
      varianceReason: "Linking machine setup",
      comparison: ["19.00", "19.80", "20.50"],
      rowColor: "bg-[#F0F7FF] text-[#1E4D8C] border-l-[#3B82F6]",
    },
    {
      id: 8,
      orderNumber: "PO-24-8508",
      styleNumber: "CRG-B-44",
      customer: "Adidas",
      item: "Cargo Shorts",
      ppSamHistory: [
        { date: "18-Feb-26", sam: "15.40" },
        { date: "05-Mar-26", sam: "15.00" },
        { date: "20-Mar-26", sam: "14.80" },
      ],
      types: ["DEV SAMPLE", "WEAR TEST", "PP SAMPLE"],
      thumbnail: "https://cdn-icons-png.flaticon.com/128/1867/1867632.png",
      prodSam: "14.90",
      varianceReason: "Pocket gusset detail",
      comparison: ["14.20", "14.80", "15.50"],
      rowColor: "bg-[#F0FFF4] text-[#1D6B41] border-l-[#10B981]",
    },
    {
      id: 9,
      orderNumber: "PO-24-8509",
      styleNumber: "BLZ-F-12",
      customer: "Mango",
      item: "Casual Blazer",
      ppSamHistory: [
        { date: "20-Feb-26", sam: "32.00" },
        { date: "08-Mar-26", sam: "31.20" },
        { date: "22-Mar-26", sam: "30.50" },
      ],
      types: ["PROTO SAMPLE", "FIT SAMPLE", "PP SAMPLE"],
      thumbnail: "https://cdn-icons-png.flaticon.com/128/18923/18923323.png",
      prodSam: "30.80",
      varianceReason: "Shoulder pad alignment",
      comparison: ["29.50", "30.50", "31.50"],
      rowColor: "bg-[#FFF5EB] text-[#A3520A] border-l-[#F97316]",
    },
    {
      id: 10,
      orderNumber: "PO-24-8510",
      styleNumber: "SKT-V-66",
      customer: "Zara",
      item: "Silk Skirt",
      ppSamHistory: [
        { date: "22-Feb-26", sam: "12.80" },
        { date: "10-Mar-26", sam: "12.20" },
        { date: "25-Mar-26", sam: "11.90" },
      ],
      types: ["DEV SAMPLE", "FIT SAMPLE", "PP SAMPLE"],
      thumbnail: "https://cdn-icons-png.flaticon.com/128/1867/1867632.png",
      prodSam: "12.10",
      varianceReason: "Delicate hem finish",
      comparison: ["11.50", "11.90", "12.50"],
      rowColor: "bg-[#F5F3FF] text-[#5B21B6] border-l-[#8B5CF6]",
    },
    {
      id: 11,
      orderNumber: "PO-24-8511",
      styleNumber: "SRA-A-90",
      customer: "Nike",
      item: "Sports Bra",
      ppSamHistory: [
        { date: "24-Feb-26", sam: "9.50" },
        { date: "12-Mar-26", sam: "9.20" },
        { date: "28-Mar-26", sam: "8.90" },
      ],
      types: ["PROTO SAMPLE", "WEAR TEST", "PP SAMPLE"],
      thumbnail: "https://cdn-icons-png.flaticon.com/128/13442/13442760.png",
      prodSam: "9.15",
      varianceReason: "Elastic tension sync",
      comparison: ["8.50", "8.90", "9.50"],
      rowColor: "bg-[#F0F7FF] text-[#1E4D8C] border-l-[#3B82F6]",
    },
    {
      id: 12,
      orderNumber: "PO-24-8512",
      styleNumber: "TRS-H-33",
      customer: "Lululemon",
      item: "Jogger Pants",
      ppSamHistory: [
        { date: "26-Feb-26", sam: "17.40" },
        { date: "15-Mar-26", sam: "16.80" },
        { date: "30-Mar-26", sam: "16.20" },
      ],
      types: ["REF SAMPLE", "SIZE SET", "PP SAMPLE"],
      thumbnail: "https://cdn-icons-png.flaticon.com/128/18923/18923323.png",
      prodSam: "16.50",
      varianceReason: "Drawcord eyelet fix",
      comparison: ["15.80", "16.20", "17.00"],
      rowColor: "bg-[#F0FFF4] text-[#1D6B41] border-l-[#10B981]",
    },
  ];

  const totalRecords = records.length;
  const prodSams = records.map(r => parseFloat(r.prodSam));
  const avgProdSam = (prodSams.reduce((a, b) => a + b, 0) / prodSams.length).toFixed(2);
  const maxProdSam = Math.max(...prodSams);
  const minProdSam = Math.min(...prodSams);
  const maxRecord = records.find(r => parseFloat(r.prodSam) === maxProdSam);
  const minRecord = records.find(r => parseFloat(r.prodSam) === minProdSam);
  const customerCount = [...new Set(records.map(r => r.customer))].length;

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] flex flex-col z-[50] font-sans text-slate-900 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between bg-white shadow-sm shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={handleBack}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-500 hover:text-blue-600 border border-slate-100 shadow-sm bg-white"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">
                Production SAM monitoring
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Real-time variance analysis & capacity tracking
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
            onClick={() => setSelectedVideo(CE_VIDEO_PATH)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
        >
            <Video size={20} className="text-blue-600" />
        </button>
            <button
              onClick={() => setSelectedDocument(CE_REPORT_PATH)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-200"
              title="Executive Audit Report"
            >
              <FileText size={20} className="text-blue-600" />
            </button>
            <div className="relative group w-72">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              />
              <input
                type="text"
                placeholder="Search style, order or customer..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
            </div>
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center gap-2 active:scale-95">
              <Plus size={16} strokeWidth={3} />
              Add Tracking Record
            </button>
            <button
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all flex items-center gap-2 active:scale-95"
              onClick={() => setShowReport(true)}
            >
              View Report
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/40 overflow-hidden border border-slate-200/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1500px]">
                <thead>
                  <tr className="bg-slate-100 text-[11px] font-bold text-black uppercase tracking-widest sticky top-0 z-10">
                    <th className="px-6 py-4 border-r border-b border-slate-200">Order Number</th>
                    <th className="px-6 py-4 border-r border-b border-slate-200">Style Number</th>
                    <th className="px-6 py-4 border-r border-b border-slate-200">Customer</th>
                    <th className="px-6 py-4 border-r border-b border-slate-200">Item Type</th>
                    <th className="px-6 py-4 border-r border-b border-slate-200">PP SAM History</th>
                    <th className="px-6 py-4 border-r border-b border-slate-200">Stage / Type</th>
                    <th className="px-6 py-4 border-r border-b border-slate-200 text-center">Visual Reference</th>
                    <th className="px-6 py-4 border-r border-b border-slate-200 text-center">Prod. SAM</th>
                    <th className="px-6 py-4 border-r border-b border-slate-200">Variance Notes</th>
                    <th className="px-6 py-4 border-b border-slate-200 text-center">
                      Similar Style Comparison
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, idx) => (
                    <tr
                      key={rec.id}
                      className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} transition-all duration-300 hover:bg-slate-100 cursor-default`}
                    >
                      <td className="px-6 py-4 border-r border-b border-slate-200 font-black text-[12px] whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>{rec.orderNumber}</span>
                          <span className="text-[9px] opacity-40 uppercase">
                            Internal Tracking
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-b border-slate-200 font-bold text-[12px]">
                        {rec.styleNumber}
                      </td>
                      <td className="px-6 py-4 border-r border-b border-slate-200 font-black text-[11px] uppercase tracking-wider">
                        {rec.customer}
                      </td>
                      <td className="px-6 py-4 border-r border-b border-slate-200 font-bold text-[12px]">
                        {rec.item}
                      </td>
                      <td className="px-6 py-4 border-r border-b border-slate-200">
                        <div className="flex flex-col gap-3">
                          {rec.ppSamHistory.map((history, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between gap-6 border-b border-black/5 pb-1 last:border-0"
                            >
                              <span className="text-[10px] font-bold opacity-50 tabular-nums">
                                {history.date}
                              </span>
                              <span className="text-[12px] font-black tabular-nums">
                                {history.sam}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-b border-slate-200">
                        <div className="flex flex-col gap-2">
                          {rec.types.map((type, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-black tracking-widest leading-none bg-black/5 px-2 py-1 rounded-full w-fit"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-b border-slate-200">
                        <div className="flex justify-center">
                          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-slate-200/50 p-1.5 overflow-hidden">
                            <img
                              src={rec.thumbnail}
                              className="w-full h-full object-cover rounded-xl"
                              alt={rec.item}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-b border-slate-200 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[26px] font-black tracking-tighter leading-none">
                            {rec.prodSam}
                          </span>
                          <span className="text-[9px] font-black opacity-40 uppercase mt-1">
                            minutes
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-b border-slate-200">
                        <div className="bg-white/40 p-3 rounded-xl border border-black/5">
                          <p className="text-[11px] font-bold italic opacity-80 leading-snug">
                            "{rec.varianceReason}"
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-slate-200">
                        <div className="flex items-center justify-center gap-10">
                          {rec.comparison.map((val, i) => (
                            <div key={i} className="flex flex-col items-center">
                              <span
                                className={`text-[12px] font-bold ${i === 1 ? "text-[16px] font-black scale-110 drop-shadow-sm" : "opacity-40"}`}
                              >
                                {val}
                              </span>
                              {i === 1 && (
                                <span className="text-[7px] font-black uppercase opacity-40">
                                  Median
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* AI Bot */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-8 right-8 z-[150] w-16 h-16 bg-blue-600 text-white rounded-[24px] shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Standard Time monitoring and variance analysis database"
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

      {showReport && (
        <div className="fixed inset-0 bg-black/30 z-[200] flex items-center justify-center print:bg-white print:relative print:inset-auto print:z-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[350px] max-w-[90vw] w-full max-w-2xl relative print:shadow-none print:rounded-none print:p-4">
            <button
              className="absolute top-3 right-3 text-slate-400 hover:text-red-500 text-xl font-black print:hidden"
              onClick={() => setShowReport(false)}
            >
              ×
            </button>
            <div className="flex justify-between items-center mb-2 print:mb-4">
              <h3 className="text-2xl font-black text-blue-700 print:text-black print:text-xl">Standard Time (SAM) Dashboard</h3>
              <div className="space-x-2 print:hidden">
                <button
                  className="px-4 py-1.5 bg-blue-600 text-white rounded font-bold text-xs hover:bg-blue-700 transition-all"
                  onClick={() => window.print()}
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center">
                <span className="text-3xl font-black text-blue-700">{totalRecords}</span>
                <span className="text-xs font-bold text-blue-900 mt-1">Total Styles</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 flex flex-col items-center">
                <span className="text-3xl font-black text-emerald-700">{customerCount}</span>
                <span className="text-xs font-bold text-emerald-900 mt-1">Unique Customers</span>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center">
                <span className="text-3xl font-black text-orange-600">{avgProdSam}</span>
                <span className="text-xs font-bold text-orange-900 mt-1">Avg. Prod. SAM</span>
              </div>
              <div className="bg-rose-50 rounded-xl p-4 flex flex-col items-center">
                <span className="text-3xl font-black text-rose-600">{minProdSam}</span>
                <span className="text-xs font-bold text-rose-900 mt-1">Lowest Prod. SAM</span>
              </div>
              <div className="bg-emerald-100 rounded-xl p-4 flex flex-col items-center col-span-2">
                <span className="text-lg font-black text-emerald-700">Highest Prod. SAM</span>
                <span className="text-2xl font-black text-emerald-900">{maxProdSam} <span className="text-base font-bold">({maxRecord?.item}, {maxRecord?.customer})</span></span>
              </div>
            </div>
            <div className="mb-4">
              <h4 className="text-lg font-black text-slate-700 mb-2">Customer Breakdown</h4>
              <div className="grid grid-cols-2 gap-2">
                {Array.from(new Set(records.map(r => r.customer))).map((customer, i) => {
                  const custRecords = records.filter(r => r.customer === customer);
                  const avgSam = (custRecords.reduce((a, b) => a + parseFloat(b.prodSam), 0) / custRecords.length).toFixed(2);
                  return (
                    <div key={i} className="bg-slate-50 rounded-lg p-3 flex flex-col">
                      <span className="font-black text-blue-700">{customer}</span>
                      <span className="text-xs font-bold text-slate-600">Styles: {custRecords.length}</span>
                      <span className="text-xs font-bold text-slate-600">Avg. SAM: {avgSam}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mb-2">
              <h4 className="text-lg font-black text-slate-700 mb-2">Recent Styles & Variance</h4>
              <div className="max-h-40 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="text-left font-bold">Style</th>
                      <th className="text-left font-bold">Customer</th>
                      <th className="text-center font-bold">Prod. SAM</th>
                      <th className="text-left font-bold">Variance Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.slice(-5).reverse().map((rec, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-1 font-black">{rec.styleNumber}</td>
                        <td className="py-1">{rec.customer}</td>
                        <td className="py-1 text-center font-black text-blue-700">{rec.prodSam}</td>
                        <td className="py-1 italic text-slate-500">{rec.varianceReason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-xs text-slate-400 mt-4 print:hidden">Tip: Use the Print button to save this dashboard as a PDF.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandardTime;
