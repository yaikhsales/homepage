import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MessageCircle,
  ArrowLeft,
  PieChart,
  ArrowUpRight,
  Video,
  FileText
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";

const InfoModal = ({ open, onClose, data }) => {
  if (!open || !data) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-cyan-600 text-xl font-black"
        >
          ×
        </button>
        <h3 className="text-xl font-black mb-4 text-cyan-600">Cost Center Detail</h3>
        <div className="space-y-2">
          <div><b>Name:</b> {data.name}</div>
          <div><b>Direct Cost:</b> {data.directCost}</div>
          <div><b>Indirect Cost:</b> {data.indirectCost}</div>
          <div><b>Utility:</b> {data.utility}</div>
          <div><b>Total:</b> {data.total}</div>
          <div><b>Variance:</b> {data.variance}</div>
          <div><b>Status:</b> {data.status}</div>
        </div>
      </div>
    </div>
  );
};

const CostCenters = ({ onBack }) => {
  const navigate = useNavigate();
  const [isBotOpen, setIsBotOpen] = React.useState(false);
  const [isReportOpen, setIsReportOpen] = React.useState(false);
  const [infoModal, setInfoModal] = React.useState({ open: false, data: null });
  const [selectedVideo, setSelectedVideo] = React.useState(null);
  const [selectedDocument, setSelectedDocument] = React.useState(null);

  const CE_VIDEO_PATH = "/assets/short-video-training/ce.mp4";
  const CE_REPORT_PATH = "/assets/report-training/ce-cost-centers-audit.html";

  const centers = [
    {
      id: 1,
      name: "Sewing Floor A",
      directCost: "$45,000",
      indirectCost: "$12,000",
      utility: "$4,500",
      total: "$61,500",
      variance: "+2.5%",
      status: "STABLE",
    },
    {
      id: 2,
      name: "Cutting Dept",
      directCost: "$18,000",
      indirectCost: "$5,000",
      utility: "$2,800",
      total: "$25,800",
      variance: "-1.2%",
      status: "OPTIMAL",
    },
    {
      id: 3,
      name: "Quality Control",
      directCost: "$8,500",
      indirectCost: "$2,100",
      utility: "$500",
      total: "$11,100",
      variance: "+0.5%",
      status: "STABLE",
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
              Cost centers & Direct/Indirect
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
              className="flex items-center gap-2 px-4 py-2 bg-cyan-50 rounded-xl border border-cyan-100 hover:bg-cyan-100 transition-all text-cyan-600 font-black text-[10px] uppercase shadow"
            >
              <PieChart size={14} className="text-cyan-600" />
              Financial Audit Report
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-8 py-4 bg-white border-b border-slate-50 flex items-center justify-end shrink-0">
          <div className="relative group w-72">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-600 transition-colors"
            />
            <input
              type="text"
              placeholder="Filter by Center..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-cyan-100 focus:ring-4 focus:ring-cyan-500/5 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-100 text-[11px] font-bold text-black uppercase tracking-widest sticky top-0 z-10">
                <th className="px-8 py-4 border-r border-b border-slate-200">Cost Center</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Direct Cost</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Indirect Cost</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Utilities</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center text-cyan-600">Total Monthly</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Variance</th>
                <th className="px-8 py-4 border-b border-slate-200 text-right whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {centers.map((rec, idx) => (
                <tr
                  key={rec.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-all duration-200 cursor-pointer`}
                  onClick={() => setInfoModal({ open: true, data: rec })}
                >
                  <td className="px-8 py-4 border-r border-b border-slate-200">
                    <span className="font-black text-slate-800 text-sm tracking-tight text-nowrap">
                      {rec.name}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-700 font-bold text-xs">
                    {rec.directCost}
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-500 font-bold text-xs">
                    {rec.indirectCost}
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-500 font-bold text-xs">
                    {rec.utility}
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <span className="font-black text-blue-600 text-sm">
                      {rec.total}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <div
                      className={`flex items-center justify-center gap-1 font-black text-xs ${rec.variance.startsWith("+") ? "text-rose-500" : "text-emerald-500"}`}
                    >
                      {rec.variance}
                      <ArrowUpRight
                        size={12}
                        className={rec.variance.startsWith("-") ? "rotate-90" : ""}
                      />
                    </div>
                  </td>
                  <td className="px-8 py-4 border-b border-slate-200 text-right">
                    <button
                      className={`px-3 py-1 rounded-md text-[9px] font-black tracking-widest border focus:outline-none ${rec.status === "OPTIMAL" ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" : "bg-blue-50 text-blue-600 border-blue-100/50"}`}
                      onClick={e => { e.stopPropagation(); setInfoModal({ open: true, data: rec }); }}
                    >
                      {rec.status}
                    </button>
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
              className="absolute top-3 right-3 text-slate-400 hover:text-cyan-600 text-xl font-black print:hidden"
            >
              ×
            </button>
            <div className="flex flex-col gap-2 mb-6 print:mb-4">
              <h3 className="text-3xl font-black mb-1 text-cyan-600 print:text-black print:text-2xl">Cost Centers Report</h3>
              <div className="text-xs text-slate-500 print:text-black">Generated: {new Date().toLocaleString()}</div>
            </div>
            <div className="mb-8 grid grid-cols-3 gap-4 text-base print:gap-8">
              <div className="bg-cyan-50 rounded-xl p-4 flex flex-col items-center border border-cyan-100 print:bg-white print:border print:border-cyan-300">
                <span className="text-3xl font-black text-cyan-700 print:text-black">{centers.length}</span>
                <span className="text-xs font-bold text-cyan-900 mt-1 print:text-black">Total Centers</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 flex flex-col items-center border border-emerald-100 print:bg-white print:border print:border-emerald-300">
                <span className="text-3xl font-black text-emerald-700 print:text-black">{centers.filter(c => c.status === 'OPTIMAL').length}</span>
                <span className="text-xs font-bold text-emerald-900 mt-1 print:text-black">Optimal</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center border border-blue-100 print:bg-white print:border print:border-blue-300">
                <span className="text-3xl font-black text-blue-700 print:text-black">{centers.filter(c => c.status === 'STABLE').length}</span>
                <span className="text-xs font-bold text-blue-900 mt-1 print:text-black">Stable</span>
              </div>
            </div>
            <h4 className="font-bold text-slate-700 mt-6 mb-2 text-lg print:text-black print:mt-0">Cost Centers (Detailed)</h4>
            <table className="w-full text-sm mb-6 border border-slate-300 print:border-black print:text-base">
              <thead>
                <tr className="bg-slate-100 print:bg-white">
                  <th className="p-2 border border-slate-200 print:border-black">Name</th>
                  <th className="p-2 border border-slate-200 print:border-black">Direct Cost</th>
                  <th className="p-2 border border-slate-200 print:border-black">Indirect Cost</th>
                  <th className="p-2 border border-slate-200 print:border-black">Utility</th>
                  <th className="p-2 border border-slate-200 print:border-black">Total</th>
                  <th className="p-2 border border-slate-200 print:border-black">Variance</th>
                  <th className="p-2 border border-slate-200 print:border-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {centers.map((c, i) => (
                  <tr key={i} className="print:bg-white">
                    <td className="p-2 border border-slate-100 print:border-black">{c.name}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{c.directCost}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{c.indirectCost}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{c.utility}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{c.total}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{c.variance}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-slate-400 mt-4 print:hidden">Tip: Use the Print button to save this report as a PDF.</div>
            <div className="space-x-2 print:hidden mt-4 flex justify-end">
              <button
                className="px-4 py-1.5 bg-cyan-600 text-white rounded font-bold text-xs hover:bg-cyan-700 transition-all"
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
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-cyan-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Financial Cost Centers"
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

export default CostCenters;
