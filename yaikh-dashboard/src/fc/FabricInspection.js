import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Scissors,
  ClipboardList,
  Maximize,
} from "lucide-react";
import ReportModal from "../components/ReportModal";

const FabricInspection = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  const reportColumns = [
    {
      header: "Roll ID",
      accessor: "rollId",
      render: (val) => (
        <span className="font-bold text-white uppercase">{val}</span>
      ),
    },
    {
      header: "Fabric",
      accessor: "fabric",
      render: (val, row) => (
        <div>
          <div className="text-slate-200 font-bold">{val}</div>
          <div className="text-[10px] italic">{row.supplier}</div>
        </div>
      ),
    },
    {
      header: "Defects Points",
      accessor: "points",
      align: "center",
      render: (val) => (
        <span
          className={`font-mono font-bold ${val > 20 ? "text-rose-500" : "text-emerald-500"}`}
        >
          {val} pts
        </span>
      ),
    },
    {
      header: "Grade",
      accessor: "grade",
      align: "center",
      render: (val) => (
        <span className="px-2 py-0.5 bg-slate-800 rounded text-xs font-bold text-white border border-slate-700">
          {val}
        </span>
      ),
    },
    {
      header: "Decision",
      accessor: "status",
      align: "center",
      render: (val) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${val === "Passed" ? "bg-emerald-500/10 text-emerald-500" : val === "Hold" ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"}`}
        >
          {val}
        </span>
      ),
    },
    { header: "Date", accessor: "date", align: "right" },
  ];

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Mock data for Fabric Inspection (4-Point System)
  const inspectionData = [
    // ... existing data
    {
      id: "INS-2024-101",
      rollId: "R-7721",
      supplier: "TexModern",
      fabric: "Denim 12oz",
      points: 12,
      grade: "Grade A",
      status: "Passed",
      date: "2026-02-14",
    },
    {
      id: "INS-2024-102",
      rollId: "R-7722",
      supplier: "TexModern",
      fabric: "Denim 12oz",
      points: 28,
      grade: "Grade B",
      status: "Hold",
      date: "2026-02-14",
    },
    {
      id: "INS-2024-103",
      rollId: "R-8890",
      supplier: "EcoFab",
      fabric: "Organic Cotton",
      points: 5,
      grade: "Grade A",
      status: "Passed",
      date: "2026-02-13",
    },
    {
      id: "INS-2024-104",
      rollId: "R-8891",
      supplier: "EcoFab",
      fabric: "Organic Cotton",
      points: 42,
      grade: "Grade C",
      status: "Rejected",
      date: "2026-02-13",
    },
    {
      id: "INS-2024-105",
      rollId: "R-5543",
      supplier: "Global Silk",
      fabric: "Silk Satin",
      points: 8,
      grade: "Grade A",
      status: "Passed",
      date: "2026-02-12",
    },
  ];

  const stats = [
    {
      label: "Avg Points/100yd",
      value: "14.5 pts",
      icon: ClipboardList,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pass Rate",
      value: "88%",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Major Defects",
      value: "22 Rolls",
      icon: AlertCircle,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      label: "Inspected Today",
      value: "145 Rolls",
      icon: Scissors,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Fabric Inspection Report"
        data={inspectionData}
        columns={reportColumns}
        colorClass="emerald"
      />
      <div className="w-full p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white uppercase">
                Fabric <span className="text-emerald-500">Inspection</span>
              </h1>
              <p className="text-slate-500 font-medium tracking-wide">
                4-Point Quality Grading System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullScreen}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-bold border border-slate-700"
            >
              <Maximize size={18} />
              Full Screen
            </button>
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-bold border border-slate-700"
            >
              <Download size={18} />
              Full Report
            </button>
            <button
              onClick={() => alert("New Inspection Triggered")}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              <Plus size={18} />
              New Inspection
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-4 rounded-2xl shadow-xl"
            >
              <div className="flex items-center justify-between mb-3 text-slate-500">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Quality Metrics
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {stat.value || stat.size}
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Seach Roll ID, Supplier..."
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:ring-1 focus:ring-emerald-500 text-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                4-Point Standards Active
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/30 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="p-4">Roll ID</th>
                  <th className="p-4">Fabric Details</th>
                  <th className="p-4 text-center">Defects Points</th>
                  <th className="p-4 text-center">Grade</th>
                  <th className="p-4 text-center">Decision</th>
                  <th className="p-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {inspectionData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4 font-bold text-white uppercase tracking-wider">
                      {row.rollId}
                    </td>
                    <td className="p-4 text-slate-400">
                      <div className="text-slate-200 font-bold">
                        {row.fabric}
                      </div>
                      <div className="text-[10px] italic">{row.supplier}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`font-mono font-bold ${row.points > 20 ? "text-rose-500" : "text-emerald-500"}`}
                      >
                        {row.points} pts
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-xs font-bold text-white border border-slate-700">
                        {row.grade}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            row.status === "Passed"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : row.status === "Hold"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-rose-500/10 text-rose-500"
                          }`}
                        >
                          {row.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-slate-500 text-xs">
                      {row.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricInspection;
