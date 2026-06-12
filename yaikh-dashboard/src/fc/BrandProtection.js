import React, { useState } from "react";
import {
  Shield,
  Search,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Lock,
  Eye,
  Trash2,
  FileCheck,
  AlertTriangle,
  Download,
} from "lucide-react";
import ReportModal from "../components/ReportModal";

const BrandProtection = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  const reportColumns = [
    {
      header: "Security ID",
      accessor: "id",
      render: (val) => (
        <span className="font-mono uppercase text-blue-400">{val}</span>
      ),
    },
    {
      header: "Target Brand",
      accessor: "brand",
      render: (val) => (
        <span className="text-sm font-black text-white uppercase italic">
          {val}
        </span>
      ),
    },
    { header: "Material Description", accessor: "item" },
    {
      header: "Action Taken",
      accessor: "action",
      render: (val) => (
        <div className="flex items-center gap-2 text-xs font-black text-rose-500 uppercase">
          <Trash2 size={12} /> {val}
        </div>
      ),
    },
    {
      header: "Verified Witness",
      accessor: "witness",
      render: (val) => (
        <span className="text-xs font-bold text-slate-500 italic">{val}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      align: "right",
      render: (val) => (
        <span
          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${val === "Verified" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}
        >
          {val}
        </span>
      ),
    },
  ];

  // Mock data for Brand Protection
  const protectionData = [
    {
      id: "SEC-001",
      brand: "Nike",
      item: "Logo Heat Transfer",
      action: "Shredded",
      witness: "Vichea P.",
      date: "2026-02-14",
      status: "Verified",
    },
    {
      id: "SEC-002",
      brand: "Adidas",
      item: "Primeknit Fabric (Waste)",
      action: "Incinerated",
      witness: "Sovan M.",
      date: "2026-02-14",
      status: "Verified",
    },
    {
      id: "SEC-003",
      brand: "H&M",
      item: "Main Labels",
      action: "Held for Destruction",
      witness: "-",
      date: "2026-02-13",
      status: "Pending",
    },
    {
      id: "SEC-004",
      brand: "Nike",
      item: "Branded Hangtags",
      action: "Shredded",
      witness: "Dara K.",
      date: "2026-02-13",
      status: "Verified",
    },
  ];

  const stats = [
    {
      label: "Items Destroyed",
      value: "12,500 Pcs",
      icon: Trash2,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      label: "Security Audits",
      value: "4 Pass",
      icon: FileCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Leakage Incidents",
      value: "0",
      icon: AlertTriangle,
      color: "text-slate-500",
      bg: "bg-slate-500/10",
    },
    {
      label: "Active Surveillance",
      value: "24/7",
      icon: Eye,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Brand Protection Report"
        data={protectionData}
        columns={reportColumns}
        colorClass="blue"
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
                Brand <span className="text-blue-500">Protection</span>
              </h1>
              <p className="text-slate-500 font-medium tracking-wide italic">
                Secure Handling of Intellectual Property
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
              onClick={() => alert("New Security Audit Triggered")}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-2xl"
            >
              <Shield size={18} />
              New Security Audit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group"
            >
              <div className="flex justify-between items-center relative z-10">
                <div
                  className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
                >
                  <stat.icon size={24} />
                </div>
                <div className="text-2xl font-black text-white italic tracking-tighter">
                  {stat.value}
                </div>
              </div>
              <div className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest relative z-10 font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row gap-6 items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Destruction Registry
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">
                  Verified disposal of branded materials
                </p>
              </div>
            </div>
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Brand, ID or Action..."
                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="p-6">Security ID</th>
                  <th className="p-6">Target Brand</th>
                  <th className="p-6">Material Description</th>
                  <th className="p-6">Action Taken</th>
                  <th className="p-6">Verified Witness</th>
                  <th className="p-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {protectionData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-6">
                      <div className="text-sm font-black text-blue-400 font-mono uppercase tracking-widest">
                        {row.id}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-black text-white uppercase tracking-tighter italic">
                        {row.brand}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                        {row.item}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-xs font-black text-rose-500 uppercase tracking-tighter">
                        <Trash2 size={12} />
                        {row.action}
                      </div>
                    </td>
                    <td className="p-6 text-xs font-bold text-slate-500 italic">
                      {row.witness}
                    </td>
                    <td className="p-6 text-right">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          row.status === "Verified"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-amber-500/10 text-amber-500"
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

export default BrandProtection;
