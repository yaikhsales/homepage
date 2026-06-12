import React, { useState } from "react";
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  ClipboardList,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Download,
  ShieldCheck,
  Video,
  Search,
} from "lucide-react";
import { useTranslation } from "../translate/TranslationContext";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";

const PPM_VIDEO_PATH = "/assets/short-video-training/PPM.mp4";
const PPM_REPORT_PATH = "/assets/report-training/PPM-report.pdf";

const PreProductionMeeting = ({ onBack }) => {
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const meetings = [
    {
      id: "PPM-7821",
      style: "Y-7821",
      buyer: "H&M",
      stage: "Bulk Production",
      date: "2026-02-14",
      time: "09:00 AM",
      status: "IN SESSION",
      attendees: 8,
    },
    {
      id: "PPM-9902",
      style: "Y-9902",
      buyer: "ZARA",
      stage: "Pilot Run",
      date: "2026-02-14",
      time: "02:00 PM",
      status: "SCHEDULED",
      attendees: 5,
    },
    {
      id: "PPM-0012",
      style: "J-0012",
      buyer: "ADIDAS",
      stage: "Bulk Production",
      date: "2026-02-15",
      time: "10:30 AM",
      status: "SCHEDULED",
      attendees: 12,
    },
    {
      id: "PPM-5521",
      style: "P-5521",
      buyer: "NIKE",
      stage: "Initial Setup",
      date: "2026-02-13",
      status: "COMPLETED",
      attendees: 6,
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-[50] animate-in fade-in duration-500 overflow-hidden font-sans">
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
              Pre-Production Meeting (PPM)
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Production Alignment / Critical Path Review
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedVideo(PPM_VIDEO_PATH)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
        >
            <Video size={20} className="text-blue-600" />
        </button>
          <button
            onClick={() => setSelectedDocument(PPM_REPORT_PATH)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-200"
            title="Report Training"
          >
            <FileText size={20} className="text-blue-600" />
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg hover:shadow-xl transition-all active:scale-95">
            <Calendar size={14} /> Schedule New PPM
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Daily Schedule Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm col-span-1 lg:col-span-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                Meetings Today
              </p>
              <div className="text-4xl font-black text-slate-800 flex items-baseline gap-2">
                02{" "}
                <span className="text-xs font-bold text-slate-400">active</span>
              </div>
              <div className="mt-6 space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                  <p className="text-[10px] font-black text-blue-600">
                    09:00 - Style Y-7821
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 mt-1 italic">
                    Conference Room A
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl opacity-50">
                  <p className="text-[10px] font-black text-slate-600">
                    14:00 - Style Y-9902
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 mt-1 italic">
                    Meeting Hall B
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Users size={18} className="text-blue-600" /> Current Meeting
                  Pulse
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full border border-rose-100">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-rose-600 uppercase">
                    Live: Y-7821 Bulk PPM
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Attendance
                    </span>
                    <span className="text-xs font-black text-slate-800">
                      8 / 10
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[80%]"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Danger Areas
                    </span>
                    <span className="text-xs font-black text-rose-600">
                      03 Flagged
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-full h-2 bg-rose-500 rounded-full"></div>
                    <div className="w-full h-2 bg-rose-500 rounded-full"></div>
                    <div className="w-full h-2 bg-rose-500 rounded-full"></div>
                    <div className="w-full h-2 bg-slate-100 rounded-full"></div>
                    <div className="w-full h-2 bg-slate-100 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl active:scale-95">
                    <Video size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Join Stream
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Archive Table */}
          <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                  Meeting Log
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  PPM Records & Decisions
                </p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Filter Style..."
                    className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-10 py-6">Meeting ID</th>
                    <th className="px-6 py-6">Style / Buyer</th>
                    <th className="px-6 py-6 text-center">Stage</th>
                    <th className="px-6 py-6 text-center">Attendees</th>
                    <th className="px-6 py-6 text-center">Status</th>
                    <th className="px-10 py-6 text-right">Records</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {meetings.map((m) => (
                    <tr
                      key={m.id}
                      className="group hover:bg-blue-50/50 transition-all cursor-pointer"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm transition-all border border-transparent">
                            <ClipboardList size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">
                              {m.id}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400">
                              {m.date}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800 tracking-widest">
                            {m.style}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {m.buyer}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-600 uppercase">
                          {m.stage}
                        </span>
                      </td>
                      <td className="px-6 py-8 text-center text-xs font-black text-slate-700">
                        {m.attendees} people
                      </td>
                      <td className="px-6 py-8 text-center">
                        <span
                          className={`px-4 py-2 rounded-2xl text-[9px] font-black tracking-widest border transition-all ${m.status === "IN SESSION" ? "bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-200 animate-pulse" : m.status === "COMPLETED" ? "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-200" : "bg-slate-100 text-slate-400 border-slate-200"}`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-slate-400">
                            <FileText size={16} />
                          </button>
                          <button className="p-2 hover:bg-emerald-600 hover:text-white rounded-lg transition-all text-slate-400">
                            <Download size={16} />
                          </button>
                          <button className="p-2 hover:bg-slate-200 rounded-lg transition-all text-slate-400">
                            <ChevronRight size={16} />
                          </button>
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

export default PreProductionMeeting;
