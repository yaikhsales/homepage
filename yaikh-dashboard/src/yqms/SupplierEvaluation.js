import React from "react";
import {
  ArrowLeft,
  Search,
  Download,
  Star,
  TrendingUp,
  TrendingDown,
  Globe,
  Truck,
  ShieldCheck,
  MoreVertical,
  Filter,
  BarChart3,
  Award,
  AlertCircle,
} from "lucide-react";

const SupplierEvaluation = ({ onBack }) => {
  const suppliers = [
    {
      name: "Summit Textile Co.",
      category: "Fabric",
      location: "China",
      score: 94,
      trend: "up",
      deliveries: 45,
      quality: 98,
      status: "Preferred",
      lastAudit: "2024-04-10",
    },
    {
      name: "Global Trim Solutions",
      category: "Accessories",
      location: "Vietnam",
      score: 88,
      trend: "up",
      deliveries: 120,
      quality: 92,
      status: "Active",
      lastAudit: "2024-03-25",
    },
    {
      name: "Pacific Buttons Ltd.",
      category: "Accessories",
      location: "Japan",
      score: 72,
      trend: "down",
      deliveries: 28,
      quality: 85,
      status: "On Probation",
      lastAudit: "2024-05-02",
    },
    {
      name: "Royal Wool Mill",
      category: "Yarn",
      location: "Italy",
      score: 96,
      trend: "stable",
      deliveries: 12,
      quality: 99,
      status: "Preferred",
      lastAudit: "2024-02-15",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 apple-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all group"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Supplier Evaluation
            </h1>
            <p className="text-slate-500 font-medium">
              Performance Monitoring & Vendor Audit Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            <input
              type="text"
              placeholder="Search suppliers..."
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-w-[300px] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-teal-100 font-bold">
            <TrendingUp className="w-5 h-5" /> Analytics
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 apple-fade-in-delay">
        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Award className="w-24 h-24" />
          </div>
          <div className="flex flex-col gap-4 relative z-10">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center">
              <Star className="w-7 h-7 text-teal-600 fill-teal-600/20" />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                Avg Score
              </p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-slate-800 tracking-tighter">
                  89.4
                </span>
                <span className="text-teal-500 text-xs font-bold mb-1.5">
                  +2.4%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Truck className="w-24 h-24" />
          </div>
          <div className="flex flex-col gap-4 relative z-10">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Truck className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                Active Vendors
              </p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-slate-800 tracking-tighter">
                  142
                </span>
                <span className="text-blue-500 text-xs font-bold mb-1.5">
                  +3 this month
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck className="w-24 h-24" />
          </div>
          <div className="flex flex-col gap-4 relative z-10">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                Quality Avg
              </p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-slate-800 tracking-tighter">
                  95.1%
                </span>
                <span className="text-emerald-500 text-xs font-bold mb-1.5">
                  Stable
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertCircle className="w-24 h-24" />
          </div>
          <div className="flex flex-col gap-4 relative z-10">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                Risk Level
              </p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-slate-800 tracking-tighter">
                  Low
                </span>
                <span className="text-red-500 text-xs font-bold mb-1.5">
                  2 Critical
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8 apple-fade-in-delay-2">
        {/* Table Section */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden shadow-slate-200/50">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Supplier Performance
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase mt-1">
                Real-time engagement tracking
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
                <Filter className="w-5 h-5" />
              </button>
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left py-4 border-b border-slate-50 px-4 block md:table-row">
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
                    Supplier
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
                    Location
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none text-center">
                    Score
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
                    Status
                  </th>
                  <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest leading-none text-right">
                    Activity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {suppliers.map((s, idx) => (
                  <tr
                    key={idx}
                    className="group hover:bg-slate-50/50 transition-all duration-500 cursor-pointer"
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-white group-hover:text-teal-600 transition-all shadow-inner group-hover:shadow-md">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">
                            {s.name}
                          </div>
                          <div className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full inline-block mt-1 font-black leading-none uppercase tracking-tighter">
                            {s.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-2 uppercase tracking-wide text-xs font-bold opacity-70">
                        <Globe className="w-3.5 h-3.5" />
                        {s.location}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-14 h-14 -rotate-90">
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-slate-100"
                          />
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={150.7}
                            strokeDashoffset={150.7 - (150.7 * s.score) / 100}
                            className={
                              s.score > 90
                                ? "text-teal-500"
                                : s.score > 80
                                  ? "text-blue-500"
                                  : "text-amber-500"
                            }
                          />
                        </svg>
                        <span className="absolute text-xs font-black tracking-tighter">
                          {s.score}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm
                                ${
                                  s.status === "Preferred"
                                    ? "bg-emerald-500 text-white"
                                    : s.status === "Active"
                                      ? "bg-blue-500 text-white"
                                      : "bg-amber-500 text-white"
                                }`}
                      >
                        {s.status}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-tight ml-1 px-1">
                        Last Audit: {s.lastAudit}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5">
                          {s.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                          ) : s.trend === "down" ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : (
                            <div className="w-4 h-0.5 bg-slate-300 rounded-full" />
                          )}
                          <span
                            className={`text-xs font-black ${s.trend === "up" ? "text-emerald-600" : s.trend === "down" ? "text-red-600" : "text-slate-400"}`}
                          >
                            {s.deliveries} deliveries
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${s.quality > 95 ? "bg-teal-500" : "bg-teal-300"}`}
                            style={{ width: `${s.quality}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
              <Award className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col gap-6">
              <div>
                <h3 className="text-2xl font-black tracking-tighter leading-none mb-2">
                  Vendor of the Month
                </h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  Performance Excellence
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center font-black text-slate-900 text-2xl shadow-xl">
                  R
                </div>
                <div>
                  <div className="font-black text-lg">Royal Wool Mill</div>
                  <div className="text-teal-400 font-bold text-xs uppercase tracking-tight">
                    Score: 98.2 / 100
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 font-black rounded-2xl transition-all shadow-xl shadow-teal-500/20 active:scale-95">
                View Full Leaderboard
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">
              Upcoming Audits
            </h3>
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 group cursor-pointer p-1"
                >
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center group-hover:bg-teal-50 transition-colors shadow-sm">
                    <BarChart3 className="w-5 h-5 text-slate-400 group-hover:text-teal-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm group-hover:text-teal-600 transition-colors">
                      Supplier Audit {item}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight">
                      Scheduled June {10 + item}, 2024
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierEvaluation;
