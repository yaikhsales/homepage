import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  ArrowRight,
  LineChart,
  MessageCircle,
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
          className="absolute top-3 right-3 text-slate-400 hover:text-pink-600 text-xl font-black"
        >
          ×
        </button>
        <h3 className="text-xl font-black mb-4 text-pink-600">Learning Curve Detail</h3>
        <div className="space-y-2">
          <div><b>Style:</b> {data.style}</div>
          <div><b>Run Day:</b> {data.runDay}</div>
          <div><b>Start Efficiency:</b> {data.startEfficiency}</div>
          <div><b>Current Efficiency:</b> {data.currentEfficiency}</div>
          <div><b>Target Efficiency:</b> {data.targetEfficiency}</div>
          <div><b>Days to Maturity:</b> {data.daysToMaturity}</div>
          <div><b>Status:</b> {data.status}</div>
        </div>
      </div>
    </div>
  );
};

const LearningCurve = ({ onBack }) => {
  const navigate = useNavigate();
  const [isBotOpen, setIsBotOpen] = React.useState(false);
  const [isReportOpen, setIsReportOpen] = React.useState(false);
  const [infoModal, setInfoModal] = React.useState({ open: false, data: null });
  const [selectedVideo, setSelectedVideo] = React.useState(null);
  const [selectedDocument, setSelectedDocument] = React.useState(null);

  const CE_VIDEO_PATH = "/assets/short-video-training/ce.mp4";
  const CE_REPORT_PATH = "/assets/report-training/ce-learning-curve-audit.html";

  const styles = [
    {
      id: 1,
      style: "Y-7821 (Polo)",
      runDay: "Day 08",
      startEfficiency: "35%",
      currentEfficiency: "88%",
      targetEfficiency: "92%",
      daysToMaturity: 10,
      status: "MATURING",
    },
    {
      id: 2,
      style: "Y-9902 (Denim)",
      runDay: "Day 02",
      startEfficiency: "22%",
      currentEfficiency: "45%",
      targetEfficiency: "85%",
      daysToMaturity: 15,
      status: "INITIAL",
    },
    {
      id: 3,
      style: "Y-1120 (Tee)",
      runDay: "Day 25",
      startEfficiency: "40%",
      currentEfficiency: "94%",
      targetEfficiency: "95%",
      daysToMaturity: 5,
      status: "COMPLETED",
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
              Learning Curve Tracking
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
              className="flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-xl border border-pink-100 hover:bg-pink-100 transition-all text-pink-600 font-black text-[10px] uppercase shadow"
            >
              <LineChart size={14} className="text-pink-600" />
              Report
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-8 py-4 bg-white border-b border-slate-50 flex items-center justify-end shrink-0">
          <div className="relative group w-72">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-600 transition-colors"
            />
            <input
              type="text"
              placeholder="Search Style..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-pink-100 focus:ring-4 focus:ring-pink-500/5 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-100 text-[11px] font-bold text-black uppercase tracking-widest sticky top-0 z-10">
                <th className="px-8 py-4 border-r border-b border-slate-200">Running Style</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Run Day</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Start Eff.</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Current Progress</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Days to Mature</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Status</th>
                <th className="px-8 py-4 border-b border-slate-200 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {styles.map((rec, idx) => (
                <tr
                  key={rec.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-all duration-200 cursor-pointer`}
                  onClick={() => setInfoModal({ open: true, data: rec })}
                >
                  <td className="px-8 py-4 border-r border-b border-slate-200">
                    <span className="font-black text-slate-800 text-sm tracking-tight text-nowrap">
                      {rec.style}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <span className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-black text-slate-600 shadow-sm uppercase">
                      {rec.runDay}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-400 font-bold text-xs">
                    {rec.startEfficiency}
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span className="font-black text-slate-400 text-[10px]">
                        {rec.startEfficiency}
                      </span>
                      <ArrowRight size={12} className="text-slate-200" />
                      <span className="font-black text-pink-600 text-sm">
                        {rec.currentEfficiency}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-700 font-black text-xs">
                    {rec.daysToMaturity} Days
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-nowrap">
                    <button
                      className={`px-3 py-1 rounded-md text-[9px] font-black tracking-widest border focus:outline-none ${rec.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" : rec.status === "MATURING" ? "bg-blue-50 text-blue-600 border-blue-100/50" : "bg-pink-50 text-pink-600 border-pink-100/50"}`}
                      onClick={e => { e.stopPropagation(); setInfoModal({ open: true, data: rec }); }}
                    >
                      {rec.status}
                    </button>
                  </td>
                  <td className="px-8 py-4 border-b border-slate-200 text-right">
                    <button
                      className="p-2 text-slate-300 hover:text-pink-600 hover:bg-white hover:shadow-sm rounded transition-all"
                      onClick={e => { e.stopPropagation(); setInfoModal({ open: true, data: rec }); }}
                    >
                      <LineChart size={16} />
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
              className="absolute top-3 right-3 text-slate-400 hover:text-pink-600 text-xl font-black print:hidden"
            >
              ×
            </button>
            <div className="flex flex-col gap-2 mb-6 print:mb-4">
              <h3 className="text-3xl font-black mb-1 text-pink-600 print:text-black print:text-2xl">Learning Curve Report</h3>
              <div className="text-xs text-slate-500 print:text-black">Generated: {new Date().toLocaleString()}</div>
            </div>
            <div className="mb-8 grid grid-cols-3 gap-4 text-base print:gap-8">
              <div className="bg-pink-50 rounded-xl p-4 flex flex-col items-center border border-pink-100 print:bg-white print:border print:border-pink-300">
                <span className="text-3xl font-black text-pink-700 print:text-black">{styles.length}</span>
                <span className="text-xs font-bold text-pink-900 mt-1 print:text-black">Total Styles</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center border border-blue-100 print:bg-white print:border print:border-blue-300">
                <span className="text-3xl font-black text-blue-700 print:text-black">{styles.filter(s => s.status === 'MATURING').length}</span>
                <span className="text-xs font-bold text-blue-900 mt-1 print:text-black">Maturing</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 flex flex-col items-center border border-emerald-100 print:bg-white print:border print:border-emerald-300">
                <span className="text-3xl font-black text-emerald-700 print:text-black">{styles.filter(s => s.status === 'COMPLETED').length}</span>
                <span className="text-xs font-bold text-emerald-900 mt-1 print:text-black">Completed</span>
              </div>
            </div>
            <h4 className="font-bold text-slate-700 mt-6 mb-2 text-lg print:text-black print:mt-0">Learning Curves (Detailed)</h4>
            <table className="w-full text-sm mb-6 border border-slate-300 print:border-black print:text-base">
              <thead>
                <tr className="bg-slate-100 print:bg-white">
                  <th className="p-2 border border-slate-200 print:border-black">Style</th>
                  <th className="p-2 border border-slate-200 print:border-black">Run Day</th>
                  <th className="p-2 border border-slate-200 print:border-black">Start Eff.</th>
                  <th className="p-2 border border-slate-200 print:border-black">Current Eff.</th>
                  <th className="p-2 border border-slate-200 print:border-black">Target Eff.</th>
                  <th className="p-2 border border-slate-200 print:border-black">Days to Maturity</th>
                  <th className="p-2 border border-slate-200 print:border-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {styles.map((s, i) => (
                  <tr key={i} className="print:bg-white">
                    <td className="p-2 border border-slate-100 print:border-black">{s.style}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{s.runDay}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{s.startEfficiency}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{s.currentEfficiency}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{s.targetEfficiency}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{s.daysToMaturity}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-slate-400 mt-4 print:hidden">Tip: Use the Print button to save this report as a PDF.</div>
            <div className="space-x-2 print:hidden mt-4 flex justify-end">
              <button
                className="px-4 py-1.5 bg-pink-600 text-white rounded font-bold text-xs hover:bg-pink-700 transition-all"
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
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-pink-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Production Learning Curve Analysis"
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

export default LearningCurve;
