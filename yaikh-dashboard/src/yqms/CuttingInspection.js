import React, { useState } from "react";
import {
  ArrowLeft,
  Scissors,
  Search,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Settings,
  Eye,
  TrendingUp,
  Clock,
  LayoutGrid,
  ChevronRight,
  Maximize2,
  Minimize2,
  MoreVertical,
  Activity,
} from "lucide-react";
import { useTranslation } from "../translate/TranslationContext";

const CuttingInspection = ({ onBack }) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState("grid");

  const bundles = [
    {
      id: "BND-501",
      style: "Y-7821",
      part: "Front Panel",
      size: "M",
      qty: 50,
      defects: 0,
      status: "CLEAR",
      marker: "M-101",
      table: "04",
    },
    {
      id: "BND-502",
      style: "Y-7821",
      part: "Back Panel",
      size: "M",
      qty: 50,
      defects: 1,
      status: "FLAGGED",
      marker: "M-101",
      table: "04",
    },
    {
      id: "BND-503",
      style: "Y-9902",
      part: "Sleeve",
      size: "L",
      qty: 40,
      defects: 0,
      status: "CLEAR",
      marker: "M-205",
      table: "02",
    },
    {
      id: "BND-504",
      style: "Y-9902",
      part: "Collar",
      size: "L",
      qty: 40,
      defects: 0,
      status: "CLEAR",
      marker: "M-205",
      table: "02",
    },
    {
      id: "BND-505",
      style: "J-0012",
      part: "Body",
      size: "S",
      qty: 60,
      defects: 3,
      status: "REJECT",
      marker: "M-309",
      table: "01",
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
              Cutting Inspection
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Cutting Room / Bundle Inspection Logic
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 px-6 border-x border-slate-100 h-10">
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase">
                Marker Accuracy
              </span>
              <span className="text-xs font-black text-emerald-600">99.8%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase">
                Cut Waste
              </span>
              <span className="text-xs font-black text-blue-600">1.2%</span>
            </div>
          </div>
          <button className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all border border-slate-200">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Stats */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Scissors size={180} className="text-white" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Daily Cutting Progress
                </p>
                <div className="flex items-end gap-6 mb-8">
                  <p className="text-5xl font-black text-white">8,450</p>
                  <div className="flex flex-col mb-1">
                    <span className="text-[10px] font-black text-emerald-400 uppercase">
                      Units Today
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Target: 10k
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-emerald-500 w-[84.5%]"></div>
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">
                  84.5% of daily target reached
                </p>
              </div>
            </div>

            <div className="w-full md:w-80 grid gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 shadow-sm border border-rose-100">
                    <AlertCircle size={20} />
                  </div>
                  <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase">
                    Alert
                  </span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Active Defects
                </p>
                <p className="text-2xl font-black text-slate-800 mt-1">
                  12 Bundles
                </p>
                <p className="text-[9px] font-bold text-slate-400 mt-2">
                  Requires immediate re-cutting
                </p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 shadow-sm border border-emerald-100">
                    <CheckCircle2 size={20} />
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                    On Track
                  </span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  AQL Passed Rate
                </p>
                <p className="text-2xl font-black text-slate-800 mt-1">99.2%</p>
                <p className="text-[9px] font-bold text-slate-400 mt-2">
                  Within acceptable tolerance
                </p>
              </div>
            </div>
          </div>

          {/* Bundle Grid/List Toggle */}
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                  Bundle Inspector
                </h3>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
                  >
                    <MoreVertical size={16} className="rotate-90" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={14}
                  />
                  <input
                    type="text"
                    placeholder="Search Bundle ID..."
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-[11px] font-bold w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:font-bold"
                  />
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-xl transition-all h-10 w-10 flex items-center justify-center border border-slate-200">
                  <Activity size={18} className="text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-8">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {bundles.map((bundle) => (
                    <div
                      key={bundle.id}
                      className={`p-5 rounded-3xl border-2 transition-all relative group cursor-pointer ${bundle.status === "REJECT" ? "bg-rose-50 border-rose-100 hover:border-rose-300" : bundle.status === "FLAGGED" ? "bg-orange-50 border-orange-100 hover:border-orange-300" : "bg-white border-slate-50 hover:border-blue-200 hover:shadow-lg"}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tight ${bundle.status === "REJECT" ? "bg-rose-500 text-white" : bundle.status === "FLAGGED" ? "bg-orange-500 text-white" : "bg-slate-800 text-white"}`}
                        >
                          {bundle.status}
                        </span>
                        <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-400 transition-colors uppercase">
                          Table {bundle.table}
                        </span>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {bundle.style}
                      </p>
                      <h4 className="text-lg font-black text-slate-800 mt-1">
                        {bundle.part}
                      </h4>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">
                            Bundle ID
                          </p>
                          <p className="text-[11px] font-black text-slate-800">
                            {bundle.id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-400 uppercase">
                            Size/Qty
                          </p>
                          <p className="text-[11px] font-black text-slate-800">
                            {bundle.size} / {bundle.qty}pcs
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-2">
                        <button className="flex-1 py-2 bg-white/50 border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:shadow-sm transition-all">
                          Inspect
                        </button>
                        <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white transition-all">
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-4 py-4">Part Details</th>
                        <th className="px-4 py-4">Bundle ID</th>
                        <th className="px-4 py-4">Defects</th>
                        <th className="px-4 py-4">Log</th>
                        <th className="px-4 py-4 text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {bundles.map((bundle) => (
                        <tr
                          key={bundle.id}
                          className="group hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-4 py-5 font-black text-sm text-slate-800">
                            {bundle.part}{" "}
                            <span className="text-[10px] text-slate-400 ml-2 font-black">
                              [{bundle.style}]
                            </span>
                          </td>
                          <td className="px-4 py-5 text-xs font-bold text-slate-500">
                            {bundle.id}
                          </td>
                          <td className="px-4 py-5">
                            <span
                              className={`text-xs font-black ${bundle.defects > 0 ? "text-rose-600" : "text-emerald-600"}`}
                            >
                              {bundle.defects}
                            </span>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-1">
                              <Clock size={12} className="text-slate-300" />
                              <span className="text-[10px] font-bold text-slate-400">
                                Inspected 10m ago
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-5 text-right">
                            <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                              <ChevronRight size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuttingInspection;
