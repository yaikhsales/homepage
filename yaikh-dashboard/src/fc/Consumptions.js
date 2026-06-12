import React, { useState } from "react";
import {
  Calculator as CalcIcon,
  Search,
  ArrowLeft,
  ChevronRight,
  TrendingDown,
  FileSpreadsheet,
  PieChart as PieIcon,
  Zap,
  Scissors,
} from "lucide-react";
import ReportModal from "../components/ReportModal";

const Consumptions = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  const reportColumns = [
    {
      header: "Job ID",
      accessor: "id",
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
      header: "Buyer",
      accessor: "buyer",
      render: (val) => (
        <span className="text-sm font-bold text-slate-300">{val}</span>
      ),
    },
    {
      header: "Material",
      accessor: "item",
      render: (val) => (
        <span className="text-xs font-medium text-slate-400 italic font-mono">
          {val}
        </span>
      ),
    },
    {
      header: "Planned",
      accessor: "target",
      align: "center",
      render: (val) => (
        <span className="text-sm font-bold text-slate-400">{val}</span>
      ),
    },
    {
      header: "Actual",
      accessor: "actual",
      align: "center",
      render: (val) => (
        <span className="text-sm font-black text-white">{val}</span>
      ),
    },
    {
      header: "Variance",
      accessor: "variance",
      align: "center",
      render: (val, row) => (
        <div
          className={`text-xs font-black font-mono ${row.status === "Alert" ? "text-rose-500" : row.status === "Warning" ? "text-amber-500" : "text-emerald-500"}`}
        >
          {val}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      align: "right",
      render: (val) => (
        <span
          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${val === "Alert" || val === "Warning" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"}`}
        >
          {val}
        </span>
      ),
    },
  ];

  // Mock data for Fabric/Accessory Consumption
  const consumptionData = [
    {
      id: "JOB-2024-V1",
      style: "Slim Fit Chino",
      buyer: "UrbanEdge",
      item: "Twill Cotton",
      target: "1.25m",
      actual: "1.27m",
      variance: "+1.6%",
      status: "Alert",
    },
    {
      id: "JOB-2024-V2",
      style: "Summer Polo",
      buyer: "NordicWear",
      item: "Pique Knit",
      target: "0.85m",
      actual: "0.82m",
      variance: "-3.5%",
      status: "Good",
    },
    {
      id: "JOB-2024-V3",
      style: "Cargo Shorts",
      buyer: "MountainPro",
      item: "Ripstop Canvas",
      target: "1.40m",
      actual: "1.41m",
      variance: "+0.7%",
      status: "Good",
    },
    {
      id: "JOB-2024-V4",
      style: "Denim Jacket",
      buyer: "LegacyJeans",
      item: "Heavy Denim",
      target: "2.10m",
      actual: "2.15m",
      variance: "+2.3%",
      status: "Warning",
    },
    {
      id: "JOB-2024-V5",
      style: "Basic Tee 3PK",
      buyer: "ValueMart",
      item: "Jersey Cotton",
      target: "0.45m",
      actual: "0.45m",
      variance: "0.0%",
      status: "Ideal",
    },
  ];

  const stats = [
    {
      label: "Overall Efficiency",
      value: "96.4%",
      icon: Zap,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Variance Alert",
      value: "4 Jobs",
      icon: FileSpreadsheet,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      label: "Est. Savings",
      value: "$4,520",
      icon: TrendingDown,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Marker Planning",
      value: "12 Active",
      icon: Scissors,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Consumptions Analytics Report"
        data={consumptionData}
        columns={reportColumns}
        colorClass="yellow"
      />
      <div className="w-full mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white uppercase">
                Consumptions <span className="text-yellow-500">Analytics</span>
              </h1>
              <p className="text-slate-500 font-medium tracking-wide">
                Target vs. Actual Material Utilization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-bold border border-slate-700"
            >
              <FileSpreadsheet size={18} />
              Export Report
            </button>
            <button
              onClick={() => alert("Consumption Calculator Triggered")}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl transition-all font-bold shadow-[0_0_20px_rgba(234,179,8,0.3)]"
            >
              <CalcIcon size={18} />
              Consumption Calculator
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div className="h-1 w-12 bg-slate-800 rounded-full">
                  <div
                    className={`h-full ${stat.color} w-3/4 rounded-full`}
                  ></div>
                </div>
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-slate-800/20">
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by Job ID, Buyer or Style..."
                className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-yellow-500 outline-none text-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/30 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/5">
                  <th className="p-6">Job ID / Style</th>
                  <th className="p-6">Buyer</th>
                  <th className="p-6">Material</th>
                  <th className="p-6 text-center">Planned</th>
                  <th className="p-6 text-center">Actual</th>
                  <th className="p-6 text-center">Variance</th>
                  <th className="p-6 text-right font-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {consumptionData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/5 hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="p-6">
                      <div className="text-sm font-black text-white">
                        {row.id}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                        {row.style}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-bold text-slate-300">
                        {row.buyer}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-xs font-medium text-slate-400 italic font-mono">
                        {row.item}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="text-sm font-bold text-slate-400">
                        {row.target}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="text-sm font-black text-white">
                        {row.actual}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div
                        className={`text-xs font-black font-mono ${
                          row.status === "Alert"
                            ? "text-rose-500 underline decoration-2 underline-offset-4"
                            : row.status === "Warning"
                              ? "text-amber-500"
                              : "text-emerald-500"
                        }`}
                      >
                        {row.variance}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          row.status === "Alert" || row.status === "Warning"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-emerald-500/10 text-emerald-500"
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

export default Consumptions;
