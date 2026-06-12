import React, { useState } from "react";
import {
  ArrowLeft,
  Eye,
  Search,
  ClipboardCheck,
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  TrendingDown,
  TrendingUp,
  Download,
  Filter,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { useTranslation } from "../translate/TranslationContext";

const FinalInspection = ({ onBack }) => {
  const { t } = useTranslation();

  const inspections = [
    {
      id: "FIN-3321",
      style: "Y-7821",
      buyer: "H&M",
      qty: "10,000",
      samples: 200,
      results: "PASS",
      date: "2026-02-14",
      dhu: 0.8,
    },
    {
      id: "FIN-3322",
      style: "Y-9902",
      buyer: "ZARA",
      qty: "5,000",
      samples: 125,
      results: "FAIL",
      date: "2026-02-14",
      dhu: 4.2,
    },
    {
      id: "FIN-3323",
      style: "J-0012",
      buyer: "ADIDAS",
      qty: "12,000",
      samples: 315,
      results: "PASS",
      date: "2026-02-13",
      dhu: 1.1,
    },
    {
      id: "FIN-3324",
      style: "P-5521",
      buyer: "NIKE",
      qty: "8,000",
      samples: 200,
      results: "RE-INSPECT",
      date: "2026-02-12",
      dhu: 2.8,
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
              Final Buyer Inspection
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Shipment Authorization / AQL 2.5 Standards
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-black text-[10px] tracking-widest uppercase border border-rose-100 hover:bg-rose-100 transition-all">
            <ShieldAlert size={14} /> Critical Issues
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg hover:shadow-xl transition-all active:scale-95">
            <UserCheck size={14} /> Start External Audit
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Key Metric Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-600 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12 group-hover:rotate-0 transition-all duration-1000">
                <ClipboardCheck size={120} className="text-white" />
              </div>
              <div className="relative z-10">
                <p className="text-blue-100 text-[11px] font-black uppercase tracking-widest mb-1">
                  AQL Performance
                </p>
                <h2 className="text-5xl font-black text-white italic tracking-tighter">
                  98.2%
                </h2>
                <div className="mt-6 flex items-center gap-3">
                  <div className="px-2 py-1 bg-white/20 rounded-lg text-white text-[10px] font-black">
                    AQL 2.5
                  </div>
                  <p className="text-blue-200 text-[10px] font-bold">
                    Standard compliance maintained
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                  <CheckCircle2 size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    Shipped to Date
                  </span>
                  <p className="text-3xl font-black text-slate-800 uppercase tracking-tight">
                    1.2M pcs
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <div className="flex items-center justify-between text-[10px] font-black uppercase mb-2">
                  <span className="text-slate-400">Monthly Target</span>
                  <span className="text-emerald-500">85% Achieved</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%]"></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase">
                    Critical Fails
                  </span>
                  <p className="text-3xl font-black text-rose-600 uppercase tracking-tight">
                    04 lots
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-rose-500 uppercase">
                      Alert
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400">
                    Reject rate slightly up (+0.2%)
                  </p>
                </div>
                <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-600 transition-colors border border-slate-100">
                  <BarChart3 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Inspection Records */}
          <div className="bg-white rounded-[48px] shadow-2xl shadow-slate-300/20 border border-slate-200 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                  Inspection Catalog
                </h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Showing completed buyer audits for February
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search audit ID, style..."
                    className="pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <button className="flex items-center gap-2 px-6 py-3.5 border border-slate-200 rounded-2xl text-[11px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all font-sans tracking-widest group">
                  <Download
                    size={16}
                    className="text-slate-400 group-hover:translate-y-0.5 transition-transform"
                  />{" "}
                  Reports
                </button>
                <button className="p-3.5 bg-slate-100 text-slate-600 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-10 py-6">Inspection ID</th>
                    <th className="px-6 py-6">Style & Buyer</th>
                    <th className="px-6 py-6 text-center">Batch Size</th>
                    <th className="px-6 py-6 text-center">Defect Rate</th>
                    <th className="px-6 py-6 text-center">Outcome</th>
                    <th className="px-10 py-6 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {inspections.map((insp) => (
                    <tr
                      key={insp.id}
                      className="hover:bg-blue-50/30 transition-all group cursor-pointer"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-all shadow-sm">
                            <FileText
                              size={24}
                              className="text-slate-300 group-hover:text-blue-500"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">
                              {insp.id}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400">
                              {insp.date}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">
                            {insp.style}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400">
                              B
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase">
                              {insp.buyer}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <p className="text-sm font-black text-slate-800">
                          {insp.qty}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          pcs / {insp.samples} samples
                        </p>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl">
                          <span
                            className={`text-xs font-black ${insp.dhu > 2 ? "text-rose-600" : "text-emerald-600"}`}
                          >
                            {insp.dhu}%
                          </span>
                          {insp.dhu > 2 ? (
                            <TrendingUp size={12} className="text-rose-500" />
                          ) : (
                            <TrendingDown
                              size={12}
                              className="text-emerald-500"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <span
                          className={`px-5 py-2 rounded-2xl text-[9px] font-black tracking-widest border transition-all ${insp.results === "PASS" ? "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-200" : insp.results === "FAIL" ? "bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-200" : "bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-200"}`}
                        >
                          {insp.results}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button className="p-3 text-slate-300 hover:text-blue-600 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100">
                          <ChevronRight size={22} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex gap-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Pass Rate
                  </span>
                  <p className="text-xl font-black text-emerald-600">75%</p>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Average DHU
                  </span>
                  <p className="text-xl font-black text-slate-800">2.22</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2.5 border border-slate-200 bg-white text-[10px] font-black text-slate-600 rounded-xl hover:bg-slate-50 transition-all uppercase tracking-widest">
                  Previous
                </button>
                <button className="px-6 py-2.5 border border-slate-200 bg-white text-[10px] font-black text-slate-600 rounded-xl hover:bg-slate-50 transition-all uppercase tracking-widest">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalInspection;
