import React, { useState } from "react";
import {
  ArrowLeft,
  Activity,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  Zap,
  ShieldCheck,
  Package,
  ChevronRight,
  TrendingDown,
} from "lucide-react";
import { useTranslation } from "../translate/TranslationContext";

const GarmentCheckOutput = ({ onBack }) => {
  const { t } = useTranslation();

  const lineOutputs = [
    {
      line: "Line 01",
      style: "Y-7821",
      checked: 450,
      pass: 442,
      fail: 8,
      dhu: 1.7,
      status: "STABLE",
    },
    {
      line: "Line 02",
      style: "Y-7821",
      checked: 420,
      pass: 418,
      fail: 2,
      dhu: 0.4,
      status: "EXCELLENT",
    },
    {
      line: "Line 03",
      style: "J-0012",
      checked: 380,
      pass: 350,
      fail: 30,
      dhu: 7.8,
      status: "CRITICAL",
    },
    {
      line: "Line 05",
      style: "Y-9902",
      checked: 200,
      pass: 195,
      fail: 5,
      dhu: 2.5,
      status: "WARNING",
    },
    {
      line: "Line 06",
      style: "Y-7821",
      checked: 440,
      pass: 435,
      fail: 5,
      dhu: 1.1,
      status: "STABLE",
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
              Sewing Output Check
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Garment QC / Live End-Line Monitoring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">
            <RefreshCw size={14} className="text-slate-400 animate-spin-slow" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              Real-time Syncing
            </span>
          </div>
          <button className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95">
            <TrendingUp size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Real-time Ticker */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shadow-sm">
                      <Zap size={20} />
                    </div>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                      Today
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Total Checked
                  </p>
                  <p className="text-3xl font-black text-slate-800 mt-1">
                    1,890
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <TrendingUp size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500">
                      +230 from yesterday
                    </span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 shadow-sm">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                      Quality
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Global Pass Rate
                  </p>
                  <p className="text-3xl font-black text-slate-800 mt-1">
                    97.8%
                  </p>
                  <div className="mt-4 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[97.8%]"></div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 shadow-sm">
                      <AlertCircle size={20} />
                    </div>
                    <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase">
                      Alerts
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Total DHU
                  </p>
                  <p className="text-3xl font-black text-rose-600 mt-1">2.1</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                    <span className="text-[10px] font-bold text-rose-500">
                      3 lines exceeding target
                    </span>
                  </div>
                </div>
              </div>

              {/* Line Output Stats Table */}
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                    Production Line Quality Matrix
                  </h3>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-400">
                      <Filter size={16} />
                    </button>
                    <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-400">
                      <Search size={16} />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-5">Line ID / Style</th>
                        <th className="px-4 py-5 text-center">Output</th>
                        <th className="px-4 py-5 text-center">Pass/Fail</th>
                        <th className="px-4 py-5 text-center">DHU</th>
                        <th className="px-8 py-5 text-right">Health Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {lineOutputs.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/50 transition-all group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-2 h-10 rounded-full ${item.status === "EXCELLENT" ? "bg-emerald-500" : item.status === "CRITICAL" ? "bg-rose-500" : item.status === "WARNING" ? "bg-orange-500" : "bg-blue-500"}`}
                              ></div>
                              <div>
                                <p className="text-sm font-black text-slate-800">
                                  {item.line}
                                </p>
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                                  {item.style}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-black text-slate-800">
                                {item.checked}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase underline">
                                pcs checked
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <span className="text-[10px] font-black text-emerald-600">
                                {item.pass}P
                              </span>
                              <span className="h-3 w-px bg-slate-200"></span>
                              <span
                                className={`text-[10px] font-black ${item.fail > 10 ? "text-rose-600" : "text-slate-400"}`}
                              >
                                {item.fail}F
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <div
                              className={`inline-flex flex-col items-center px-3 py-1.5 rounded-2xl border ${item.dhu > 3 ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-slate-50 border-slate-100 text-slate-600"}`}
                            >
                              <span className="text-xs font-black">
                                {item.dhu}
                              </span>
                              <div className="h-0.5 w-8 bg-current/20 rounded-full mt-0.5"></div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <span
                              className={`text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full border ${item.status === "EXCELLENT" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : item.status === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-200" : item.status === "WARNING" ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Side Analytics */}
            <div className="space-y-8">
              <div className="bg-slate-900 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <BarChart3 size={120} className="text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-white text-sm font-black uppercase tracking-widest mb-6">
                    Line 03 Issues
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
                          Broken Stitch
                        </span>
                        <span className="text-[10px] font-black text-white">
                          45%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 w-[45%]"></div>
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">
                          Open Seam
                        </span>
                        <span className="text-[10px] font-black text-white">
                          30%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-[30%]"></div>
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                          Shading Difference
                        </span>
                        <span className="text-[10px] font-black text-white">
                          25%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[25%]"></div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all">
                    Generate CAP Report
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                  Quality Trend (Last 8h)
                </h3>
                <div className="h-32 flex items-end gap-2 px-1">
                  {[20, 60, 45, 90, 30, 70, 40, 50].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-slate-50 rounded-t-lg relative group"
                    >
                      <div
                        className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-700 ${h > 75 ? "bg-rose-400 group-hover:bg-rose-500" : "bg-blue-400 group-hover:bg-blue-500"}`}
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-[9px] font-black text-slate-400 uppercase">
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>14:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarmentCheckOutput;
