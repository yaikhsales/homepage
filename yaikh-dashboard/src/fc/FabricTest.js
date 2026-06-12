import React, { useState } from "react";
import {
  FlaskConical,
  Search,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  FlaskRound,
  Droplets,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import ReportModal from "../components/ReportModal";

const FabricTest = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  const reportColumns = [
    {
      header: "Test ID",
      accessor: "id",
      render: (val) => (
        <span className="font-mono font-bold text-purple-400 uppercase">
          {val}
        </span>
      ),
    },
    {
      header: "Target Roll",
      accessor: "rollId",
      render: (val) => (
        <span className="text-sm font-black text-white uppercase italic">
          {val}
        </span>
      ),
    },
    { header: "Analysis Category", accessor: "testType" },
    {
      header: "Result Data",
      accessor: "result",
      align: "center",
      render: (val) => (
        <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-black text-white border border-slate-800">
          {val}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      align: "center",
      render: (val) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${val === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}
        >
          {val}
        </span>
      ),
    },
    { header: "Date", accessor: "date", align: "right" },
  ];

  // Mock data for Fabric Testing (Shrinkage, Shade, Weight)
  const testData = [
    {
      id: "TST-2024-501",
      rollId: "R-7721",
      testType: "Shrinkage Test",
      result: "Pass (1.2%)",
      status: "Completed",
      date: "2026-02-14",
    },
    {
      id: "TST-2024-502",
      rollId: "R-7722",
      testType: "Shade Banding",
      result: "Fail (Delta 2.4)",
      status: "Rejected",
      date: "2026-02-14",
    },
    {
      id: "TST-2024-503",
      rollId: "R-8890",
      testType: "GSM Check",
      result: "Pass (245g)",
      status: "Completed",
      date: "2026-02-13",
    },
    {
      id: "TST-2024-504",
      rollId: "R-5541",
      testType: "PH Value",
      result: "Hold (Neutral)",
      status: "Warning",
      date: "2026-02-12",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Fabric Test Lab Report"
        data={testData}
        columns={reportColumns}
        colorClass="purple"
      />
      <div className="w-full mb-8">
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
                Fabric <span className="text-purple-500">Test</span>
              </h1>
              <p className="text-slate-500 font-medium tracking-wide">
                Lab Analysis & Technical Specifications
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-2xl"
            >
              Report
            </button>
            <button
              onClick={() => alert("New Lab Test Triggered")}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-2xl"
            >
              <FlaskConical size={18} />
              New Lab Test
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5">
            <div className="flex items-center gap-3 text-purple-500 mb-3">
              <FlaskRound size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Active Tests
              </span>
            </div>
            <div className="text-3xl font-black text-white">12 Batches</div>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5">
            <div className="flex items-center gap-3 text-blue-500 mb-3">
              <Droplets size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                PH Compliance
              </span>
            </div>
            <div className="text-3xl font-black text-white">100%</div>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5">
            <div className="flex items-center gap-3 text-rose-500 mb-3">
              <AlertCircle size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Rejections
              </span>
            </div>
            <div className="text-3xl font-black text-white">2 Rolls</div>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5">
            <div className="flex items-center gap-3 text-emerald-500 mb-3">
              <CheckCircle2 size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Certified
              </span>
            </div>
            <div className="text-3xl font-black text-white">94%</div>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-purple-500/5">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Test ID, Roll or Type..."
                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="p-6">Test ID</th>
                  <th className="p-6">Target Roll</th>
                  <th className="p-6">Analysis Category</th>
                  <th className="p-6 text-center">Result Data</th>
                  <th className="p-6 text-center">Status</th>
                  <th className="p-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {testData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-all group"
                  >
                    <td className="p-6 font-mono font-bold text-purple-400 uppercase tracking-wider">
                      {row.id}
                    </td>
                    <td className="p-6 text-sm font-black text-white uppercase italic">
                      {row.rollId}
                    </td>
                    <td className="p-6 text-sm font-bold text-slate-400">
                      {row.testType}
                    </td>
                    <td className="p-6 text-center">
                      <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-black text-white border border-slate-800">
                        {row.result}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          row.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="p-6 text-right font-mono text-slate-500 text-xs">
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

export default FabricTest;
