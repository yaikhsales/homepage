import React, { useState } from "react";
import {
  ArrowLeft,
  Database,
  Search,
  Filter,
  BarChart3,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Activity,
  ChevronRight,
  TrendingUp,
  History,
  Video,
  FileText,
} from "lucide-react";
import { useTranslation } from "../translate/TranslationContext";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";
import ModuleBotButton from "../components/ModuleBotButton";

const INTERNAL_QC_VIDEO_PATH =
  "/assets/short-video-training/Internal-rolling-qc.mp4";
const INTERNAL_QC_REPORT_PATH =
  "/assets/report-training/Internal-rolling-qc-report.pdf";

const InternalRollingQC = ({ onBack }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const rollRecords = [
    {
      id: "RL-7001",
      fabric: "Denim Blue 12oz",
      rollNo: "R-102",
      length: "120m",
      width: '58"',
      points: 4,
      grade: "A",
      status: "PASSED",
      date: "2026-02-14",
    },
    {
      id: "RL-7002",
      fabric: "Single Jersey Black",
      rollNo: "R-504",
      length: "150m",
      width: '60"',
      points: 12,
      grade: "B",
      status: "REJECTED",
      date: "2026-02-14",
    },
    {
      id: "RL-7003",
      fabric: "Cotton Twill Khaki",
      rollNo: "R-309",
      length: "100m",
      width: '58"',
      points: 2,
      grade: "A",
      status: "PASSED",
      date: "2026-02-13",
    },
    {
      id: "RL-7004",
      fabric: "Polyester Mesh White",
      rollNo: "R-901",
      length: "180m",
      width: '62"',
      points: 6,
      grade: "A",
      status: "PASSED",
      date: "2026-02-13",
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-[50] animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-white px-8 py-5 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-600 border border-slate-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              Internal Rolling QC
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              IQC / Fabric Inspection Log
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedVideo(INTERNAL_QC_VIDEO_PATH)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
        >
            <Video size={20} className="text-blue-600" />
        </button>
          <button
            onClick={() => setSelectedDocument(INTERNAL_QC_REPORT_PATH)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-200"
            title="Report Training"
          >
            <FileText size={20} className="text-blue-600" />
          </button>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] tracking-widest uppercase border border-blue-100 hover:bg-blue-100 transition-all">
            <History size={14} /> Audit Trail
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg hover:shadow-xl transition-all active:scale-95">
            <FileSpreadsheet size={14} /> New Inspection
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Database size={80} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Rolls Inspected
              </p>
              <div className="flex items-end gap-3 mt-2">
                <p className="text-3xl font-black text-slate-800">1,240</p>
                <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black mb-1">
                  <TrendingUp size={12} /> +12%
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Avg 4-Point Score
              </p>
              <div className="flex items-end gap-3 mt-2">
                <p className="text-3xl font-black text-slate-800">3.2</p>
                <span className="text-[10px] font-bold text-slate-400 mb-1">
                  / 100sq yd
                </span>
              </div>
              <div className="mt-4 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[85%]"></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Rejection Rate
              </p>
              <div className="flex items-end gap-3 mt-2">
                <p className="text-3xl font-black text-rose-600">1.8%</p>
                <div className="flex items-center gap-1 text-rose-500 text-[10px] font-black mb-1">
                  <AlertTriangle size={12} /> -0.4%
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Fabric Yield
              </p>
              <div className="flex items-end gap-3 mt-2">
                <p className="text-3xl font-black text-emerald-600">98.4%</p>
                <p className="text-[10px] font-bold text-slate-400 mb-1">
                  efficiency
                </p>
              </div>
            </div>
          </div>

          {/* Main List Area */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col min-h-[500px]">
            {/* List Toolbar */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {["all", "passed", "rejected"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="h-4 w-px bg-slate-200"></div>
                <button className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-600 transition-colors">
                  <Filter size={14} /> Advanced Filter
                </button>
              </div>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Scan Roll ID / Fabric..."
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border-dashed"
                />
              </div>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-5">Roll Details</th>
                    <th className="px-4 py-5">Specification</th>
                    <th className="px-4 py-5 text-center">4-Points</th>
                    <th className="px-4 py-5 text-center">Grade</th>
                    <th className="px-4 py-5 text-center">Outcome</th>
                    <th className="px-8 py-5 text-right">More</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rollRecords.map((roll) => (
                    <tr
                      key={roll.id}
                      className="hover:bg-blue-50/30 transition-all group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                            <Layers size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">
                              {roll.fabric}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                {roll.rollNo}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400">
                                ID: {roll.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-slate-500 uppercase">
                              Width:
                            </span>
                            <span className="text-[10px] font-black text-slate-800">
                              {roll.width}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-slate-500 uppercase">
                              Len:
                            </span>
                            <span className="text-[10px] font-black text-slate-800">
                              {roll.length}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`text-xs font-black ${roll.points > 10 ? "text-rose-600" : "text-emerald-600"}`}
                          >
                            {roll.points} pts
                          </span>
                          <div className="w-12 h-0.5 bg-slate-100 rounded-full mt-1">
                            <div
                              className={`h-full ${roll.points > 10 ? "bg-rose-500" : "bg-emerald-500"}`}
                              style={{
                                width: `${Math.min(roll.points * 5, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <div
                          className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center font-black text-xs border ${roll.grade === "A" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}
                        >
                          {roll.grade}
                        </div>
                      </td>
                      <td className="px-4 py-6 text-center">
                        <span
                          className={`px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest border transition-colors ${roll.status === "PASSED" ? "bg-emerald-500 text-white border-emerald-400 shadow-sm shadow-emerald-200/50" : "bg-rose-500 text-white border-rose-400 shadow-sm shadow-rose-200/50"}`}
                        >
                          {roll.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                Showing 4 of 48 active inspection rolls
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-slate-200 bg-white text-[10px] font-black text-slate-600 rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-widest">
                  Previous
                </button>
                <button className="px-4 py-2 border border-slate-200 bg-white text-[10px] font-black text-slate-600 rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-widest">
                  Next Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      <ModuleBotButton moduleName="YQMS - Internal Rolling QC" />
    </div>
  );
};

export default InternalRollingQC;
