import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  Plus,
  MessageCircle,
  ArrowLeft,
  FileSpreadsheet,
  Video,
  FileText
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";

// Info Modal for row/action details
const InfoModal = ({ open, onClose, data }) => {
  if (!open || !data) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-violet-600 text-xl font-black"
        >
          ×
        </button>
        <h3 className="text-xl font-black mb-4 text-violet-600">Style Costing Detail</h3>
        <div className="space-y-2">
          <div><b>Style ID:</b> {data.styleId}</div>
          <div><b>Name:</b> {data.name}</div>
          <div><b>SAM:</b> {data.sam} Min</div>
          <div><b>CPM:</b> ${data.cpm}</div>
          <div><b>Labor Cost:</b> {data.laborCost}</div>
          <div><b>Total Cost:</b> {data.totalCost}</div>
          <div><b>Customer:</b> {data.customer}</div>
          <div><b>Date:</b> {data.date}</div>
        </div>
      </div>
    </div>
  );
};

const StyleCosting = ({ onBack }) => {
  const navigate = useNavigate();
  const [isBotOpen, setIsBotOpen] = React.useState(false);
  const [isReportOpen, setIsReportOpen] = React.useState(false);
  const [infoModal, setInfoModal] = React.useState({ open: false, data: null });
  const [selectedVideo, setSelectedVideo] = React.useState(null);
  const [selectedDocument, setSelectedDocument] = React.useState(null);

  const CE_VIDEO_PATH = "/assets/short-video-training/ce.mp4";
  const CE_REPORT_PATH = "/assets/report-training/ce-style-costing-audit.html";

  const costings = [
    {
      id: 1,
      styleId: "Y-7821",
      name: "Men's Polo Shirt",
      sam: "12.45",
      cpm: "0.0175",
      laborCost: "$0.22",
      totalCost: "$3.45",
      customer: "Adidas",
      date: "Feb 10, 2026",
    },
    {
      id: 2,
      styleId: "Y-9902",
      name: "Denim Jackets",
      sam: "34.20",
      cpm: "0.0175",
      laborCost: "$0.60",
      totalCost: "$12.80",
      customer: "Nike",
      date: "Feb 12, 2026",
    },
    {
      id: 3,
      styleId: "Y-1120",
      name: "Basic Crew T-Shirt",
      sam: "6.15",
      cpm: "0.0175",
      laborCost: "$0.11",
      totalCost: "$1.95",
      customer: "Uniqlo",
      date: "Feb 05, 2026",
    },
  ];

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-[50] font-sans text-slate-900 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 bg-white">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-600 border border-slate-100 shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">
              Style Costing analysis
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
            onClick={() => setSelectedVideo(CE_VIDEO_PATH)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
        >
            <Video size={20} className="text-blue-600" />
        </button>
            <button
                onClick={() => setSelectedDocument(CE_REPORT_PATH)}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-blue-600 border border-slate-200 bg-white"
                title="Executive Audit Report"
            >
                <FileText size={18} />
            </button>
            <button
              onClick={() => setIsReportOpen(true)}
              className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-violet-700 shadow-lg shadow-violet-100 transition-all flex items-center gap-2"
            >
              <Plus size={14} strokeWidth={3} />
              Report
            </button>
            <button className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-violet-700 shadow-lg shadow-violet-100 transition-all flex items-center gap-2">
              <Plus size={14} strokeWidth={3} />
              Calculate New Style
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-8 py-4 bg-white border-b border-slate-50 flex items-center justify-end shrink-0">
          <div className="relative group w-72">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors"
            />
            <input
              type="text"
              placeholder="Search by Style or Client..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-violet-100 focus:ring-4 focus:ring-violet-500/5 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-100 text-[11px] font-bold text-black uppercase tracking-widest sticky top-0 z-10">
                <th className="px-8 py-4 border-r border-b border-slate-200">Style Details</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">SAM</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">CPM Factor</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Labor Cost</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center text-violet-600">Total Unit Cost</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Customer</th>
                <th className="px-8 py-4 border-b border-slate-200 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {costings.map((rec, idx) => (
                <tr
                  key={rec.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-all duration-200 cursor-pointer`}
                  onClick={() => setInfoModal({ open: true, data: rec })}
                >
                  <td className="px-8 py-4 border-r border-b border-slate-200">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-slate-800 text-sm tracking-tight text-nowrap">
                        {rec.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-violet-600 uppercase tracking-widest">
                        <span>
                          {rec.styleId} �?{rec.date}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-400 font-bold text-xs uppercase">
                    {rec.sam} Min
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-400 font-bold text-xs">
                    ${rec.cpm}
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-700 font-black text-xs">
                    {rec.laborCost}
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <span className="font-black text-violet-600 text-lg tabular-nums">
                      {rec.totalCost}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase">
                      {rec.customer}
                    </span>
                  </td>
                  <td className="px-8 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-end gap-2 text-nowrap">
                      <button
                        onClick={e => { e.stopPropagation(); setInfoModal({ open: true, data: rec }); }}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-violet-600 text-white rounded-lg text-[9px] font-black uppercase hover:bg-violet-700 transition-colors shadow-sm"
                      >
                        <FileSpreadsheet size={12} />
                        Full Sheet
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setInfoModal({ open: true, data: rec }); }}
                        className="p-1.5 text-slate-300 hover:text-slate-600 rounded transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setInfoModal({ open: true, data: rec }); }}
                        className="p-1.5 text-slate-300 hover:text-red-500 rounded transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Modal */}
      <InfoModal open={infoModal.open} data={infoModal.data} onClose={() => setInfoModal({ open: false, data: null })} />

      {/* Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center print:bg-white print:relative print:inset-auto print:z-auto">
          <div
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl relative print:shadow-none print:rounded-none print:p-8 print:max-w-full print:w-full print:overflow-visible print:text-black"
            style={{ maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box', fontSize: '16px' }}
            data-print-modal
          >
            <button
              onClick={() => setIsReportOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-violet-600 text-xl font-black print:hidden"
            >
              ×
            </button>
            <div className="flex flex-col gap-2 mb-6 print:mb-4">
              <h3 className="text-3xl font-black mb-1 text-violet-600 print:text-black print:text-2xl">Style Costing Report</h3>
              <div className="text-xs text-slate-500 print:text-black">Generated: {new Date().toLocaleString()}</div>
            </div>
            <div className="mb-8 grid grid-cols-3 gap-4 text-base print:gap-8">
              <div className="bg-violet-50 rounded-xl p-4 flex flex-col items-center border border-violet-100 print:bg-white print:border print:border-violet-300">
                <span className="text-3xl font-black text-violet-700 print:text-black">{costings.length}</span>
                <span className="text-xs font-bold text-violet-900 mt-1 print:text-black">Total Styles</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 flex flex-col items-center border border-emerald-100 print:bg-white print:border print:border-emerald-300">
                <span className="text-3xl font-black text-emerald-700 print:text-black">{costings.filter(c => parseFloat(c.totalCost.replace('$','')) < 5).length}</span>
                <span className="text-xs font-bold text-emerald-900 mt-1 print:text-black">Low Cost (&lt; $5)</span>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 flex flex-col items-center border border-amber-100 print:bg-white print:border print:border-amber-300">
                <span className="text-3xl font-black text-amber-700 print:text-black">{costings.filter(c => parseFloat(c.totalCost.replace('$','')) >= 5).length}</span>
                <span className="text-xs font-bold text-amber-900 mt-1 print:text-black">High Cost (&ge; $5)</span>
              </div>
            </div>
            <h4 className="font-bold text-slate-700 mt-6 mb-2 text-lg print:text-black print:mt-0">Style Costings (Detailed)</h4>
            <table className="w-full text-sm mb-6 border border-slate-300 print:border-black print:text-base">
              <thead>
                <tr className="bg-slate-100 print:bg-white">
                  <th className="p-2 border border-slate-200 print:border-black">Style ID</th>
                  <th className="p-2 border border-slate-200 print:border-black">Name</th>
                  <th className="p-2 border border-slate-200 print:border-black">SAM</th>
                  <th className="p-2 border border-slate-200 print:border-black">CPM</th>
                  <th className="p-2 border border-slate-200 print:border-black">Labor Cost</th>
                  <th className="p-2 border border-slate-200 print:border-black">Total Cost</th>
                  <th className="p-2 border border-slate-200 print:border-black">Customer</th>
                  <th className="p-2 border border-slate-200 print:border-black">Date</th>
                </tr>
              </thead>
              <tbody>
                {costings.map((c, i) => (
                  <tr key={i} className="print:bg-white">
                    <td className="p-2 border border-slate-100 print:border-black">{c.styleId}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{c.name}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{c.sam} Min</td>
                    <td className="p-2 border border-slate-100 print:border-black">${c.cpm}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{c.laborCost}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{c.totalCost}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{c.customer}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-slate-400 mt-4 print:hidden">Tip: Use the Print button to save this report as a PDF.</div>
            <div className="space-x-2 print:hidden mt-4 flex justify-end">
              <button
                className="px-4 py-1.5 bg-violet-600 text-white rounded font-bold text-xs hover:bg-violet-700 transition-all"
                onClick={() => {
                  const modal = document.querySelector('[data-print-modal]');
                  if (modal) {
                    modal.style.maxHeight = 'none';
                    modal.style.overflow = 'visible';
                  }
                  setTimeout(() => window.print(), 100);
                }}
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Bot */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-violet-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Style Costing & Estimation"
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
    </div>
  );
};

export default StyleCosting;
