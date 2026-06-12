import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Plus,
  MessageCircle,
  ArrowLeft,
  Video,
  FileText,
  Trash2
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
          className="absolute top-3 right-3 text-slate-400 hover:text-emerald-600 text-xl font-black"
        >
          ×
        </button>
        <h3 className="text-xl font-black mb-4 text-emerald-600">Product Development Detail</h3>
        <div className="space-y-2">
          <div><b>Style ID:</b> {data.styleId}</div>
          <div><b>Customer:</b> {data.customer}</div>
          <div><b>Style Name:</b> {data.styleName}</div>
          <div><b>Stage:</b> {data.stage}</div>
          <div><b>Status:</b> {data.status}</div>
          <div><b>Due Date:</b> {data.dueDate}</div>
          <div><b>Complexity:</b> {data.complexity}</div>
        </div>
      </div>
    </div>
  );
};

const ProductDevelopment = ({ onBack }) => {
  const navigate = useNavigate();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({ open: false, data: null });
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const CE_VIDEO_PATH = "/assets/short-video-training/ce.mp4";
  const CE_REPORT_PATH = "/assets/report-training/ce-product-development-audit.html";

  const samples = [
    {
      id: 1,
      styleId: "PD-2024-001",
      customer: "Adidas",
      styleName: "Cloud-Fit Jacket",
      stage: "PROTO SAMPLE",
      status: "COMPLETED",
      dueDate: "Feb 15, 2026",
      complexity: "HIGH",
    },
    {
      id: 2,
      styleId: "PD-2024-005",
      customer: "Nike",
      styleName: "Dri-Fit Polo",
      stage: "FIT SAMPLE",
      status: "IN PROGRESS",
      dueDate: "Feb 18, 2026",
      complexity: "MEDIUM",
    },
    {
      id: 3,
      styleId: "PD-2024-008",
      customer: "Puma",
      styleName: "Active Shorts",
      stage: "SALESMAN SAMPLE",
      status: "PENDING",
      dueDate: "Feb 22, 2026",
      complexity: "LOW",
    },
    {
      id: 4,
      styleId: "PD-2024-012",
      customer: "Uniqlo",
      styleName: "Tech-Air Tee",
      stage: "PP SAMPLE",
      status: "IN PROGRESS",
      dueDate: "Feb 25, 2026",
      complexity: "MEDIUM",
    },
  ];

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const handleAction = (type, name) => {
    alert(`${type} - Sample development details for ${name}`);
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
              Product Development
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
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center gap-2"
            >
              <Plus size={14} strokeWidth={3} />
              Report
            </button>
            <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center gap-2">
              <Plus size={14} strokeWidth={3} />
              New Product Entry
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-8 py-4 bg-white border-b border-slate-50 flex items-center justify-end shrink-0">
          <div className="relative group w-72">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors"
            />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-100 text-[11px] font-bold text-black uppercase tracking-widest sticky top-0 z-10">
                <th className="px-8 py-4 border-r border-b border-slate-200">Style / Customer</th>
                <th className="px-4 py-4 border-r border-b border-slate-200">Sample Stage</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Status</th>
                <th className="px-4 py-4 border-r border-b border-slate-200">Due Date</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Complexity</th>
                <th className="px-8 py-4 border-b border-slate-200 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((rec, idx) => (
                <tr
                  key={rec.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-all duration-200 cursor-pointer`}
                  onClick={() => setInfoModal({ open: true, data: rec })}
                >
                  <td className="px-8 py-4 border-r border-b border-slate-200">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-slate-800 text-sm tracking-tight text-nowrap">
                        {rec.styleName}
                      </span>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>
                          {rec.customer} �?{rec.styleId}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center lg:text-left">
                    <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-[9px] font-black text-emerald-700 rounded-lg uppercase tracking-tight">
                      {rec.stage}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <button
                      className={`px-3 py-1 rounded-md text-[9px] font-black tracking-widest border focus:outline-none ${rec.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" : rec.status === "IN PROGRESS" ? "bg-blue-50 text-blue-600 border-blue-100/50" : "bg-amber-50 text-amber-600 border-amber-100/50"}`}
                      onClick={e => { e.stopPropagation(); setInfoModal({ open: true, data: rec }); }}
                    >
                      {rec.status}
                    </button>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-700 text-xs text-nowrap">
                        {rec.dueDate}
                      </span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase">
                        Target
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <span
                      className={`text-[10px] font-black ${rec.complexity === "HIGH" ? "text-red-500" : rec.complexity === "MEDIUM" ? "text-amber-500" : "text-emerald-500"}`}
                    >
                      {rec.complexity}
                    </span>
                  </td>
                  <td className="px-8 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-end gap-2 text-nowrap">
                      <button
                        onClick={e => { e.stopPropagation(); setInfoModal({ open: true, data: rec }); }}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        <Eye size={12} strokeWidth={3} />
                        View
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setInfoModal({ open: true, data: rec }); }}
                        className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase hover:bg-slate-50 transition-colors"
                      >
                        Edit
                      </button>
                      <div className="flex items-center gap-1 ml-2 border-l border-slate-100 pl-3">
                        <button className="p-1.5 text-slate-300 hover:text-red-500 rounded transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
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
              className="absolute top-3 right-3 text-slate-400 hover:text-emerald-600 text-xl font-black print:hidden"
            >
              ×
            </button>
            <div className="flex flex-col gap-2 mb-6 print:mb-4">
              <h3 className="text-3xl font-black mb-1 text-emerald-600 print:text-black print:text-2xl">Product Development Report</h3>
              <div className="text-xs text-slate-500 print:text-black">Generated: {new Date().toLocaleString()}</div>
            </div>
            <div className="mb-8 grid grid-cols-3 gap-4 text-base print:gap-8">
              <div className="bg-emerald-50 rounded-xl p-4 flex flex-col items-center border border-emerald-100 print:bg-white print:border print:border-emerald-300">
                <span className="text-3xl font-black text-emerald-700 print:text-black">{samples.length}</span>
                <span className="text-xs font-bold text-emerald-900 mt-1 print:text-black">Total Samples</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center border border-blue-100 print:bg-white print:border print:border-blue-300">
                <span className="text-3xl font-black text-blue-700 print:text-black">{samples.filter(s => s.status === 'IN PROGRESS').length}</span>
                <span className="text-xs font-bold text-blue-900 mt-1 print:text-black">In Progress</span>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 flex flex-col items-center border border-amber-100 print:bg-white print:border print:border-amber-300">
                <span className="text-3xl font-black text-amber-700 print:text-black">{samples.filter(s => s.status === 'PENDING').length}</span>
                <span className="text-xs font-bold text-amber-900 mt-1 print:text-black">Pending</span>
              </div>
            </div>
            <h4 className="font-bold text-slate-700 mt-6 mb-2 text-lg print:text-black print:mt-0">Samples (Detailed)</h4>
            <table className="w-full text-sm mb-6 border border-slate-300 print:border-black print:text-base">
              <thead>
                <tr className="bg-slate-100 print:bg-white">
                  <th className="p-2 border border-slate-200 print:border-black">Style ID</th>
                  <th className="p-2 border border-slate-200 print:border-black">Customer</th>
                  <th className="p-2 border border-slate-200 print:border-black">Style Name</th>
                  <th className="p-2 border border-slate-200 print:border-black">Stage</th>
                  <th className="p-2 border border-slate-200 print:border-black">Status</th>
                  <th className="p-2 border border-slate-200 print:border-black">Due Date</th>
                  <th className="p-2 border border-slate-200 print:border-black">Complexity</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((s, i) => (
                  <tr key={i} className="print:bg-white">
                    <td className="p-2 border border-slate-100 print:border-black">{s.styleId}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{s.customer}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{s.styleName}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{s.stage}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{s.status}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{s.dueDate}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{s.complexity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-slate-400 mt-4 print:hidden">Tip: Use the Print button to save this report as a PDF.</div>
            <div className="space-x-2 print:hidden mt-4 flex justify-end">
              <button
                className="px-4 py-1.5 bg-emerald-600 text-white rounded font-bold text-xs hover:bg-emerald-700 transition-all"
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
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-emerald-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Product Development Sampling"
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

export default ProductDevelopment;
