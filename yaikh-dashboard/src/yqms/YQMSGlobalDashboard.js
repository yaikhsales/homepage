import React from "react";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Briefcase,
  Users,
  Search,
  Bell,
  Settings,
  MoreHorizontal,
  ChevronRight,
  Monitor,
} from "lucide-react";

const YQMSGlobalDashboard = ({ onBack }) => {
  const stats = [
    {
      label: "Active Lines",
      value: "24",
      change: "+2",
      icon: Activity,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Passed Today",
      value: "8,245",
      change: "+12%",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Defect Rate",
      value: "1.24%",
      change: "-0.4%",
      icon: AlertTriangle,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      label: "Avg Cycle Time",
      value: "14.2m",
      change: "-2m",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col apple-fade-in font-sans">
      {/* Sidebar Style Navigation Header */}
      <header className="bg-white px-8 py-5 border-b border-slate-200 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:-translate-x-1" />
          </button>
          <div className="h-6 w-px bg-slate-200 mx-2"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                Global YQMS Dashboard
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                Real-time Quality Oversight
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 font-bold text-sm">
          <div className="hidden lg:flex items-center gap-8 text-slate-500">
            <a href="#" className="text-slate-900 font-black">
              Overview
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Factory View
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              QC Nodes
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Analytics
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-white shadow-md"></div>
          </div>
        </div>
      </header>

      <main className="p-8 lg:p-12 max-w-screen-2xl mx-auto w-full">
        {/* Main Greeting & Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest leading-none bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-4 inline-block">
              Welcome Back, Admin
            </span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
              Factory Operations Status
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200">
              Live View
            </button>
            <button className="px-5 py-2.5 text-slate-400 hover:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
              Historical
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <stat.icon className="w-20 h-20" />
              </div>
              <div className="flex flex-col gap-6 relative z-10">
                <div
                  className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                    {stat.value}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-md ${stat.change.startsWith("+") ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    Since last shift
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Views */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Productivity Chart Module */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">
                  Line Productivity
                </h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Across all sewing sections
                </p>
              </div>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

            {/* Simulated Chart Area */}
            <div className="h-80 flex items-end justify-between gap-4 px-4 relative">
              {/* Horizontal Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-5 border-y border-slate-900 pointer-events-none">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full h-px bg-slate-900"></div>
                ))}
              </div>

              {[65, 84, 42, 92, 58, 77, 89, 45, 68, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-4 group"
                >
                  <div
                    className="w-full relative flex items-end justify-center rounded-t-xl overflow-hidden cursor-pointer"
                    style={{ height: `${h}%` }}
                  >
                    <div
                      className={`w-full bg-indigo-500 rounded-t-xl group-hover:bg-indigo-400 transition-all duration-700 shadow-lg shadow-indigo-100 ${i === 3 || i === 9 ? "bg-slate-900 group-hover:bg-slate-800 animate-pulse" : ""}`}
                    ></div>
                    {/* Hover Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl z-20">
                      Batch #{400 + i}: {h}%
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                    L-{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Alerts / Logs */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white border border-white/5 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Activity className="w-40 h-40" />
            </div>

            <div className="mb-10 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tighter">
                  Live Alerts
                </h3>
                <span className="text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] bg-rose-500/10 px-2 py-0.5 rounded-md mt-2 inline-block">
                  5 Unresolved
                </span>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                <Settings className="w-5 h-5 text-white/50" />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-6 relative z-10">
              {[
                {
                  type: "Critical",
                  msg: "Machine Malfunction Line 04",
                  time: "2m ago",
                  color: "bg-rose-500",
                },
                {
                  type: "Warning",
                  msg: "Defect spike detected Line 12",
                  time: "14m ago",
                  color: "bg-amber-500",
                },
                {
                  type: "System",
                  msg: "New style profile published",
                  time: "41m ago",
                  color: "bg-blue-500",
                },
                {
                  type: "Info",
                  msg: "Shift B handover complete",
                  time: "1h ago",
                  color: "bg-emerald-500",
                },
              ].map((log, idx) => (
                <div
                  key={idx}
                  className="group p-5 bg-white/5 border border-white/5 rounded-[1.8rem] hover:bg-white/10 transition-all cursor-pointer flex items-center gap-5 justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-3 h-3 rounded-full ${log.color} shadow-[0_0_15px_rgba(0,0,0,0.5)] border-2 border-white/20`}
                    ></div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black tracking-tight group-hover:text-white transition-colors">
                        {log.msg}
                      </span>
                      <span className="text-[10px] font-bold text-white/30 uppercase mt-0.5">
                        {log.time}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-5 bg-white text-slate-900 font-black rounded-3xl text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl">
              Access Admin Logs
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Quick Look */}
      <div className="mt-auto px-8 py-6 bg-white border-t border-slate-200 flex items-center justify-between font-bold text-slate-400 text-xs">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>Server Hong Kong Main</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>Data Sync: 100%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-900 font-black">
          <Clock className="w-4 h-4" /> 14:24:02 GMT+8
        </div>
      </div>
    </div>
  );
};

export default YQMSGlobalDashboard;
