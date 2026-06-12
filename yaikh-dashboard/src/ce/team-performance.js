import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  MessageCircle,
  ArrowLeft,
  Users,
  Trophy,
  Target,
  BarChart2,
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
          className="absolute top-3 right-3 text-slate-400 hover:text-teal-600 text-xl font-black"
        >
          ×
        </button>
        <h3 className="text-xl font-black mb-4 text-teal-600">Team Performance Detail</h3>
        <div className="space-y-2">
          <div><b>Line:</b> {data.line}</div>
          <div><b>Supervisor:</b> {data.supervisor}</div>
          <div><b>Efficiency:</b> {data.efficiency}</div>
          <div><b>Quality Rate:</b> {data.qualityRate}</div>
          <div><b>Absenteeism:</b> {data.absenteeism}</div>
          <div><b>Score:</b> {data.score}</div>
          <div><b>Rank:</b> {data.rank}</div>
        </div>
      </div>
    </div>
  );
};

const TeamPerformance = ({ onBack }) => {
  const navigate = useNavigate();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({ open: false, data: null });
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const CE_VIDEO_PATH = "/assets/short-video-training/ce.mp4";
  const CE_REPORT_PATH = "/assets/report-training/ce-team-performance-audit.html";

  const teams = [
    {
      id: 1,
      line: "LINE 01",
      supervisor: "Mr. Arnold",
      efficiency: "94.2%",
      qualityRate: "99.1%",
      absenteeism: "1.2%",
      score: 95,
      rank: 1,
    },
    {
      id: 2,
      line: "LINE 04",
      supervisor: "Chhay",
      efficiency: "91.8%",
      qualityRate: "98.5%",
      absenteeism: "2.5%",
      score: 88,
      rank: 2,
    },
    {
      id: 3,
      line: "LINE 02",
      supervisor: "Daly",
      efficiency: "88.5%",
      qualityRate: "97.2%",
      absenteeism: "3.1%",
      score: 82,
      rank: 3,
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
              Team Performance
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
              className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all flex items-center gap-2"
            >
              <Trophy size={14} />
              Report
            </button>
            <span className="px-4 py-2 bg-teal-50 text-teal-600 rounded-xl border border-teal-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Trophy size={14} />
              Weekly Best: Line 01
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="px-8 py-4 bg-white border-b border-slate-50 flex items-center justify-end shrink-0">
          <div className="relative group w-72">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
            />
            <input
              type="text"
              placeholder="Filter by Line..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-teal-100 focus:ring-4 focus:ring-teal-500/5 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-100 text-[11px] font-bold text-black uppercase tracking-widest sticky top-0 z-10">
                <th className="px-8 py-4 border-r border-b border-slate-200">Rank / Line</th>
                <th className="px-4 py-4 border-r border-b border-slate-200">Team Leader</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Avg Efficiency</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Quality Rate (DHU)</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Absenteeism</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Performance Score</th>
                <th className="px-8 py-4 border-b border-slate-200 text-right whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((rec, idx) => (
                <tr
                  key={rec.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-all duration-200 cursor-pointer`}
                  onClick={() => setInfoModal({ open: true, data: rec })}
                >
                  <td className="px-8 py-4 border-r border-b border-slate-200">
                    <div className="flex items-center gap-5">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${rec.rank === 1 ? "bg-yellow-400 text-white shadow-lg shadow-yellow-100" : "bg-slate-50 text-slate-400 border border-slate-100"}`}
                      >
                        {rec.rank}
                      </span>
                      <span className="font-black text-slate-800 text-sm tracking-tight text-nowrap">
                        {rec.line}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 font-black text-slate-600 text-[10px] uppercase">
                    {rec.supervisor}
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <span className="font-black text-teal-600 text-xs">
                      {rec.efficiency}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <span className="font-black text-blue-600 text-xs text-nowrap">
                      {rec.qualityRate}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-rose-500 font-bold text-xs">
                    {rec.absenteeism}
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                      <span className="font-black text-slate-800 text-xs">
                        {rec.score} / 100
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-4 border-b border-slate-200 text-right">
                    <button
                      className="px-2.5 py-1 bg-teal-50 border border-teal-100 rounded text-[9px] font-black text-teal-600 shadow-sm uppercase focus:outline-none"
                      onClick={e => { e.stopPropagation(); setInfoModal({ open: true, data: rec }); }}
                    >
                      Gold
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
              className="absolute top-3 right-3 text-slate-400 hover:text-teal-600 text-xl font-black print:hidden"
            >
              ×
            </button>
            <div className="flex flex-col gap-2 mb-6 print:mb-4">
              <h3 className="text-3xl font-black mb-1 text-teal-600 print:text-black print:text-2xl">Team Performance Report</h3>
              <div className="text-xs text-slate-500 print:text-black">Generated: {new Date().toLocaleString()}</div>
            </div>
            <div className="mb-8 grid grid-cols-3 gap-4 text-base print:gap-8">
              <div className="bg-teal-50 rounded-xl p-4 flex flex-col items-center border border-teal-100 print:bg-white print:border print:border-teal-300">
                <span className="text-3xl font-black text-teal-700 print:text-black">{teams.length}</span>
                <span className="text-xs font-bold text-teal-900 mt-1 print:text-black">Total Teams</span>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 flex flex-col items-center border border-yellow-100 print:bg-white print:border print:border-yellow-300">
                <span className="text-3xl font-black text-yellow-700 print:text-black">{teams.filter(t => t.rank === 1).length}</span>
                <span className="text-xs font-bold text-yellow-900 mt-1 print:text-black">Top Rank</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center border border-blue-100 print:bg-white print:border print:border-blue-300">
                <span className="text-3xl font-black text-blue-700 print:text-black">{teams.filter(t => parseFloat(t.efficiency) > 90).length}</span>
                <span className="text-xs font-bold text-blue-900 mt-1 print:text-black">Efficiency &gt; 90%</span>
              </div>
            </div>
            <h4 className="font-bold text-slate-700 mt-6 mb-2 text-lg print:text-black print:mt-0">Team Performance (Detailed)</h4>
            <table className="w-full text-sm mb-6 border border-slate-300 print:border-black print:text-base">
              <thead>
                <tr className="bg-slate-100 print:bg-white">
                  <th className="p-2 border border-slate-200 print:border-black">Rank</th>
                  <th className="p-2 border border-slate-200 print:border-black">Line</th>
                  <th className="p-2 border border-slate-200 print:border-black">Supervisor</th>
                  <th className="p-2 border border-slate-200 print:border-black">Efficiency</th>
                  <th className="p-2 border border-slate-200 print:border-black">Quality Rate</th>
                  <th className="p-2 border border-slate-200 print:border-black">Absenteeism</th>
                  <th className="p-2 border border-slate-200 print:border-black">Score</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t, i) => (
                  <tr key={i} className="print:bg-white">
                    <td className="p-2 border border-slate-100 print:border-black">{t.rank}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{t.line}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{t.supervisor}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{t.efficiency}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{t.qualityRate}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{t.absenteeism}</td>
                    <td className="p-2 border border-slate-100 print:border-black">{t.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-slate-400 mt-4 print:hidden">Tip: Use the Print button to save this report as a PDF.</div>
            <div className="space-x-2 print:hidden mt-4 flex justify-end">
              <button
                className="px-4 py-1.5 bg-teal-600 text-white rounded font-bold text-xs hover:bg-teal-700 transition-all"
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
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-teal-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Team Performance Comparison"
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

export default TeamPerformance;
