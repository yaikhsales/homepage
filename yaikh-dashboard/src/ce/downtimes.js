import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MessageCircle,
  ArrowLeft,
  AlertTriangle,
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
          className="absolute top-3 right-3 text-slate-400 hover:text-red-600 text-xl font-black"
        >
          ×
        </button>
        <h3 className="text-xl font-black mb-4 text-red-600">Downtime Detail</h3>
        <div className="space-y-2">
          <div><b>Line:</b> {data.line}</div>
          <div><b>Reason:</b> {data.reason}</div>
          <div><b>Duration:</b> {data.duration}</div>
          <div><b>Category:</b> {data.category}</div>
          <div><b>Start Time:</b> {data.time}</div>
          <div><b>Status:</b> {data.status}</div>
          <div><b>Impact:</b> {data.impact}</div>
        </div>
      </div>
    </div>
  );
};

const Downtimes = ({ onBack }) => {
  const navigate = useNavigate();
  const [isBotOpen, setIsBotOpen] = React.useState(false);
  const [isReportOpen, setIsReportOpen] = React.useState(false);
  const [infoModal, setInfoModal] = React.useState({ open: false, data: null });
  const [selectedVideo, setSelectedVideo] = React.useState(null);
  const [selectedDocument, setSelectedDocument] = React.useState(null);

  const CE_VIDEO_PATH = "/assets/short-video-training/ce.mp4";
  const CE_REPORT_PATH = "/assets/report-training/ce-downtimes-audit.html";

  const logs = [
    {
      id: 1,
      line: "LINE 01",
      reason: "Machine Breakdown",
      duration: "45 Min",
      category: "TECHNICAL",
      time: "09:15 AM",
      status: "RESOLVED",
      impact: "MEDIUM",
    },
    {
      id: 2,
      line: "LINE 05",
      reason: "Waiting for Thread",
      duration: "120 Min",
      category: "MATERIAL",
      time: "10:30 AM",
      status: "ONGOING",
      impact: "HIGH",
    },
    {
      id: 3,
      line: "LINE 02",
      reason: "No Power (Area B)",
      duration: "30 Min",
      category: "UTILITY",
      time: "11:45 AM",
      status: "RESOLVED",
      impact: "CRITICAL",
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
              Downtime Monitoring
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
              className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-red-700 shadow-lg shadow-red-100 transition-all flex items-center gap-2"
            >
              <AlertTriangle size={14} />
              Report Downtime
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-8 py-4 bg-white border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="relative group w-72">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors"
            />
            <input
              type="text"
              placeholder="Search by Reason..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/5 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-100 text-[11px] font-bold text-black uppercase tracking-widest sticky top-0 z-10">
                <th className="px-8 py-4 border-r border-b border-slate-200">Reason / Line</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Start Time</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Duration</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Category</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Impact</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Status</th>
                <th className="px-8 py-4 border-b border-slate-200 text-right whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((rec, idx) => (
                <tr
                  key={rec.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-all duration-200 cursor-pointer`}
                  onClick={() => setInfoModal({ open: true, data: rec })}
                >
                  <td className="px-8 py-4 border-r border-b border-slate-200">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-slate-800 text-sm tracking-tight text-nowrap">
                        {rec.reason}
                      </span>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-red-600 uppercase tracking-widest">
                        <span>{rec.line}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-500 font-bold text-xs">
                    {rec.time}
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <span className="font-black text-red-600 text-sm">
                      {rec.duration}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase">
                      {rec.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <span
                      className={`text-[10px] font-black ${rec.impact === "CRITICAL" ? "text-red-700 underline" : rec.impact === "HIGH" ? "text-red-500" : "text-amber-500"}`}
                    >
                      {rec.impact}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <span
                      className={`px-3 py-1 rounded-md text-[9px] font-black tracking-widest border ${
                        rec.status === "RESOLVED"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                          : "bg-red-50 text-red-600 border-red-100/50 animate-pulse"
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 border-b border-slate-200 text-right">
                    <button
                      className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase hover:bg-slate-50 transition-colors"
                      onClick={e => { e.stopPropagation(); setInfoModal({ open: true, data: rec }); }}
                    >
                      Investigate
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
              className="absolute top-3 right-3 text-slate-400 hover:text-red-600 text-xl font-black print:hidden"
            >
              ×
            </button>
            <div className="flex flex-col gap-2 mb-6 print:mb-4">
              <h3 className="text-3xl font-black mb-1 text-red-600 print:text-black print:text-2xl">Downtime Report</h3>
              <div className="text-xs text-slate-500 print:text-black">Generated: {new Date().toLocaleString()}</div>
            </div>
            <div className="mb-8 grid grid-cols-3 gap-4 text-base print:gap-8">
              <div className="bg-red-50 rounded-xl p-4 flex flex-col items-center border border-red-100 print:bg-white print:border print:border-red-300">
                <span className="text-3xl font-black text-red-700 print:text-black">{logs.length}</span>
                <span className="text-xs font-bold text-red-900 mt-1 print:text-black">Total Downtimes</span>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 flex flex-col items-center border border-amber-100 print:bg-white print:border print:border-amber-300">
                <span className="text-3xl font-black text-amber-700 print:text-black">{logs.filter(l => l.status === 'ONGOING').length}</span>
                <span className="text-xs font-bold text-amber-900 mt-1 print:text-black">Ongoing</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 flex flex-col items-center border border-emerald-100 print:bg-white print:border print:border-emerald-300">
                <span className="text-3xl font-black text-emerald-700 print:text-black">{logs.filter(l => l.status === 'RESOLVED').length}</span>
                <span className="text-xs font-bold text-emerald-900 mt-1 print:text-black">Resolved</span>
              </div>
            </div>
            <h4 className="font-bold text-slate-700 mt-6 mb-2 text-lg print:text-black print:mt-0">Downtime Logs (Detailed)</h4>
            <table className="w-full text-sm mb-6 border border-slate-300 print:border-black print:text-base">
              <thead>
                <tr className="bg-slate-100 print:bg-white">
                  <th className="p-2 border border-slate-200 print:border-black">Line</th>
                  <th className="p-2 border border-slate-200 print:border-black">Reason</th>
                  <th className="p-2 border border-slate-200 print:border-black">Duration</th>
                  <th className="p-2 border border-slate-200 print:border-black">Category</th>
                  <th className="p-2 border border-slate-200 print:border-black">Start Time</th>
                  <th className="p-2 border border-slate-200 print:border-black">Status</th>
                  <th className="p-2 border border-slate-200 print:border-black">Impact</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l, i) => (
                  <tr key={i} className="print:bg-white">
                    <td className="p-2 border border-slate-100 print:border-black">{l.line}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{l.reason}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{l.duration}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{l.category}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{l.time}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{l.status}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{l.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-slate-400 mt-4 print:hidden">Tip: Use the Print button to save this report as a PDF.</div>
            <div className="space-x-2 print:hidden mt-4 flex justify-end">
              <button
                className="px-4 py-1.5 bg-red-600 text-white rounded font-bold text-xs hover:bg-red-700 transition-all"
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
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-red-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Real-time Downtimes Tracking"
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

export default Downtimes;
