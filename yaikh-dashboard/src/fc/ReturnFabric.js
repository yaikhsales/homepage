import React, { useState } from "react";
import {
  ArrowDownLeft,
  Search,
  ArrowLeft,
  ChevronRight,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  ClipboardList,
  Download,
} from "lucide-react";
import ReportModal from "../components/ReportModal";

const ReturnFabric = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  const reportColumns = [
    {
      header: "Transaction ID",
      accessor: "id",
      render: (val) => (
        <span className="font-black text-rose-400 uppercase tracking-widest">
          {val}
        </span>
      ),
    },
    {
      header: "Line Origin",
      accessor: "line",
      render: (val, row) => (
        <div>
          <div className="text-sm font-black text-white">{val}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase">
            {row.style}
          </div>
        </div>
      ),
    },
    {
      header: "Item / Roll",
      accessor: "rollId",
      render: (val) => (
        <span className="text-sm font-bold text-slate-200 uppercase">
          {val}
        </span>
      ),
    },
    {
      header: "Return Qty",
      accessor: "qty",
      align: "center",
      render: (val) => (
        <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-black text-white border border-slate-800">
          {val}
        </span>
      ),
    },
    {
      header: "Reason Case",
      accessor: "reason",
      render: (val) => (
        <span className="text-xs font-bold text-slate-400 uppercase">
          {val}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      align: "right",
      render: (val) => (
        <span
          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${val === "In Stock" ? "bg-emerald-500/10 text-emerald-500" : val === "Holding" ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"}`}
        >
          {val}
        </span>
      ),
    },
  ];

  // Mock data for Fabric Returns
  const returnData = [
    {
      id: "RTN-F-001",
      rollId: "R-7722",
      style: "Denim Jk",
      line: "LINE-04",
      qty: "8.5m",
      reason: "End of Roll",
      status: "In Stock",
    },
    {
      id: "RTN-F-002",
      rollId: "R-8891",
      style: "Polo V2",
      line: "LINE-12",
      qty: "12.0m",
      reason: "Shade Variance",
      status: "Rejected",
    },
    {
      id: "RTN-F-003",
      rollId: "R-4431",
      style: "Tee Blue",
      line: "LINE-01",
      qty: "3.2m",
      reason: "End of Roll",
      status: "In Stock",
    },
    {
      id: "RTN-F-004",
      rollId: "R-1120",
      style: "Cargo P.",
      line: "LINE-05",
      qty: "15.5m",
      reason: "Fabric Slub",
      status: "Holding",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Fabric Return Report"
        data={returnData}
        columns={reportColumns}
        colorClass="rose"
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
                Return <span className="text-rose-500">Fabric</span>
              </h1>
              <p className="text-slate-500 font-medium tracking-wide">
                Production Floor Re-Entry & Rejection
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-2xl"
            >
              <Download size={18} />
              Export
            </button>
            <button
              onClick={() => alert("Process New Return Triggered")}
              className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-2xl"
            >
              <RefreshCcw size={18} />
              Process New Return
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 shadow-xl">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono">
              End-of-Roll Recovered
            </div>
            <div className="text-4xl font-black text-white italic tracking-tighter">
              142.5{" "}
              <span className="text-sm text-slate-500 font-bold not-italic">
                Mtrs
              </span>
            </div>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 shadow-xl">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono">
              Defective Returns
            </div>
            <div className="text-4xl font-black text-rose-500 italic tracking-tighter">
              58{" "}
              <span className="text-sm text-slate-500 font-bold not-italic">
                Rolls
              </span>
            </div>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 shadow-xl">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono">
              Recovery Rate
            </div>
            <div className="text-4xl font-black text-emerald-500 italic tracking-tighter">
              12.4{" "}
              <span className="text-sm text-slate-500 font-bold not-italic">
                %
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-800/20">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Return ID, Roll or Line..."
                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-rose-500 transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="p-6">Transaction ID</th>
                  <th className="p-6">Line Origin</th>
                  <th className="p-6">Item / Roll</th>
                  <th className="p-6 text-center">Return Qty</th>
                  <th className="p-6">Reason Case</th>
                  <th className="p-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {returnData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-all group"
                  >
                    <td className="p-6">
                      <div className="text-sm font-black text-rose-400 uppercase tracking-widest">
                        {row.id}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-black text-white">
                        {row.line}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                        {row.style}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-bold text-slate-200 uppercase tracking-tight italic">
                        {row.rollId}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-black text-white border border-slate-800 shadow-inner">
                        {row.qty}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${row.reason === "End of Roll" ? "bg-blue-500" : "bg-rose-500 animate-pulse"}`}
                        ></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                          {row.reason}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          row.status === "In Stock"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : row.status === "Holding"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {row.status}
                      </span>
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

export default ReturnFabric;
