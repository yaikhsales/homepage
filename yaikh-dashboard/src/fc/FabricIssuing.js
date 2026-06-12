import React, { useState } from "react";
import {
  ArrowUpRight,
  Search,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Hash,
  Download,
} from "lucide-react";
import ReportModal from "../components/ReportModal";

const FabricIssuing = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  const reportColumns = [
    {
      header: "Line Destination",
      accessor: "line",
      render: (val, row) => (
        <div>
          <div className="text-sm font-black text-white">{val}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight italic">
            {row.style}
          </div>
        </div>
      ),
    },
    {
      header: "Fabric Type",
      accessor: "fabric",
      render: (val) => (
        <span className="text-sm font-bold text-blue-400 uppercase tracking-tight">
          {val}
        </span>
      ),
    },
    {
      header: "Roll Numbers",
      accessor: "rolls",
      align: "center",
      render: (val) => (
        <span className="text-sm font-bold text-slate-200">{val}</span>
      ),
    },
    {
      header: "Meters",
      accessor: "qty",
      align: "center",
      render: (val) => (
        <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-black text-white italic border border-slate-800 shadow-inner">
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
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${val === "Delivered" ? "text-emerald-500" : "text-amber-500"}`}
        >
          {val}
        </span>
      ),
    },
  ];

  // Mock data for Fabric Issuing
  const issuingData = [
    {
      id: "ISS-10021",
      style: "Men Polo V2",
      line: "LINE-04",
      rolls: 12,
      qty: "600m",
      time: "08:30 AM",
      status: "Delivered",
    },
    {
      id: "ISS-10022",
      style: "Ladies Summer Top",
      line: "LINE-12",
      rolls: 8,
      qty: "400m",
      time: "09:15 AM",
      status: "In Transit",
    },
    {
      id: "ISS-10023",
      style: "Cargo Pant Black",
      line: "LINE-01",
      rolls: 25,
      qty: "1,250m",
      time: "10:00 AM",
      status: "Loading",
    },
    {
      id: "ISS-10024",
      style: "Kids Tee 3PK",
      line: "LINE-08",
      rolls: 5,
      qty: "250m",
      time: "10:45 AM",
      status: "Pending",
    },
    {
      id: "ISS-10025",
      style: "Slim Fit Chino",
      line: "LINE-05",
      rolls: 18,
      qty: "900m",
      time: "11:15 AM",
      status: "Delivered",
    },
  ];

  const stats = [
    {
      label: "Issued Today",
      value: "2,450m",
      icon: ArrowUpRight,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Active Transfers",
      value: "8 Lines",
      icon: Truck,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pending Request",
      value: "3 Jobs",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Completed",
      value: "18 Batches",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Fabric Issuing Report"
        data={issuingData}
        columns={reportColumns}
        colorClass="orange"
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
                Fabric <span className="text-orange-500">Issuing</span>
              </h1>
              <p className="text-slate-500 font-medium tracking-wide">
                Production Floor Material Distribution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-bold border border-slate-700"
            >
              <Download size={18} />
              Export Record
            </button>
            <button
              onClick={() => alert("Scan Requisition Triggered")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-bold border border-slate-700"
            >
              <Hash size={18} />
              Scan Requisition
            </button>
            <button
              onClick={() => alert("Create Issuing Batch Triggered")}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition-all font-bold shadow-[0_0_20px_rgba(234,88,12,0.3)]"
            >
              <ArrowUpRight size={18} />
              Create Issuing Batch
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-5 rounded-3xl shadow-xl relative overflow-hidden group hover:border-orange-500/20 transition-all"
            >
              <div className="flex items-center justify-between relative z-10">
                <div
                  className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
                >
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-black text-white">
                  {stat.value}
                </div>
              </div>
              <div className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] relative z-10">
                {stat.label}
              </div>
              <div
                className={`absolute -right-8 -bottom-8 w-24 h-24 ${stat.color} opacity-[0.02] blur-3xl rounded-full`}
              ></div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-3xl">
          <div className="p-8 border-b border-white/5 flex flex-col lg:flex-row gap-6 items-center justify-between bg-slate-800/20">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]"></div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Issuing Log
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Real-time Production Feed
                </p>
              </div>
            </div>

            <div className="flex gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search Style, Line or ID..."
                  className="w-full bg-slate-950/80 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:ring-1 focus:ring-orange-500 text-white shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => alert("Filter By Package Area")}
                className="px-5 py-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white border border-slate-700/50 hover:bg-slate-750 transition-all"
              >
                <Package size={20} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto px-4 pb-4">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  <th className="px-6 py-4">Transfer ID</th>
                  <th className="px-6 py-4">Floor / Line</th>
                  <th className="px-6 py-4">Target Style</th>
                  <th className="px-6 py-4 text-center">Batch Size</th>
                  <th className="px-6 py-4 text-center">Transfer Status</th>
                  <th className="px-6 py-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {issuingData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="bg-slate-950/30 hover:bg-white/[0.02] transition-all group overflow-hidden first:mt-2"
                  >
                    <td className="px-6 py-5 first:rounded-l-2xl border-l border-y border-white/[0.03]">
                      <div className="text-sm font-black text-orange-400 group-hover:text-orange-300 transition-colors uppercase tracking-widest">
                        {row.id}
                      </div>
                    </td>
                    <td className="px-6 py-5 border-y border-white/[0.03]">
                      <div className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
                        {row.line}
                      </div>
                    </td>
                    <td className="px-6 py-5 border-y border-white/[0.03]">
                      <div className="text-sm font-bold text-slate-300 italic">
                        {row.style}
                      </div>
                    </td>
                    <td className="px-6 py-5 border-y border-white/[0.03] text-center">
                      <span className="text-sm font-black text-white">
                        {row.rolls} Rolls{" "}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({row.qty})
                      </span>
                    </td>
                    <td className="px-6 py-5 border-y border-white/[0.03]">
                      <div className="flex justify-center">
                        <span
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                            row.status === "Delivered"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : row.status === "In Transit"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : row.status === "Loading"
                                  ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                  : "bg-slate-500/10 text-slate-500 border-white/5"
                          }`}
                        >
                          {row.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 last:rounded-r-2xl border-r border-y border-white/[0.03] text-right">
                      <div className="text-xs font-black text-slate-500 font-mono tracking-tighter">
                        {row.time}
                      </div>
                      <div className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mt-0.5">
                        Today
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 flex justify-center border-t border-white/5">
            <button
              onClick={() => alert("Load Older Transfers")}
              className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-orange-500 uppercase tracking-[0.3em] transition-all"
            >
              View Older Transfers
              <ChevronRight size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricIssuing;
