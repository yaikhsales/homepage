import React from "react";
import {
  ArrowLeft,
  FileText,
  Download,
  Filter,
  Search,
  Calendar,
  // eslint-disable-next-line no-unused-vars
  Layers,
  BarChart3,
  TrendingUp,
  PieChart,
  Grid,
  List,
  CheckCircle2,
  Clock,
  MoreVertical,
} from "lucide-react";

const YQMSReport = ({ onBack }) => {
  const reportCategories = [
    {
      title: "Daily QC Summary",
      count: 124,
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Defect Analysis",
      count: 45,
      icon: PieChart,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "Line Performance",
      count: 18,
      icon: BarChart3,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Sample Audits",
      count: 322,
      icon: CheckCircle2,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  const recentReports = [
    {
      name: "Final Inspection Report - Batch A45",
      type: "PDF",
      size: "2.4 MB",
      date: "2024-05-15 14:20",
      status: "Ready",
    },
    {
      name: "Global Quality Statistics Q2",
      type: "XLSX",
      size: "1.1 MB",
      date: "2024-05-14 09:15",
      status: "Generated",
    },
    {
      name: "Suppler Performance Review 2024",
      type: "PDF",
      size: "5.7 MB",
      date: "2024-05-13 16:45",
      status: "Ready",
    },
    {
      name: "Defect Matrix Technical File",
      type: "DOCX",
      size: "850 KB",
      date: "2024-05-12 11:30",
      status: "Archived",
    },
    {
      name: "End-line Productivity Metrics",
      type: "XLSX",
      size: "3.2 MB",
      date: "2024-05-11 10:00",
      status: "Ready",
    },
    {
      name: "Internal Audit Compliance Checklist",
      type: "PDF",
      size: "1.4 MB",
      date: "2024-05-10 08:30",
      status: "Ready",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col apple-fade-in">
      {/* Sidebar / Topbar combined into modern layout */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">
                QMS Intelligence Reports
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Advanced Data Analytics
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" />
            <input
              type="text"
              placeholder="Search analytic reports..."
              className="pl-11 pr-5 py-2.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 w-80"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            <Calendar className="w-4 h-4" /> Schedule Report
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Quick Filter Section */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-[0.8rem] text-sm font-black transition-all">
              All Reports
            </button>
            <button className="px-6 py-2 text-slate-500 text-sm font-bold hover:bg-slate-50 transition-all">
              Quality
            </button>
            <button className="px-6 py-2 text-slate-500 text-sm font-bold hover:bg-slate-50 transition-all">
              Compliance
            </button>
            <button className="px-6 py-2 text-slate-500 text-sm font-bold hover:bg-slate-50 transition-all">
              Audit
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-white text-slate-400 rounded-xl border border-slate-200 hover:text-indigo-600 shadow-sm">
              <Grid className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white text-indigo-600 rounded-xl border border-indigo-200 shadow-sm">
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {reportCategories.map((cat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group cursor-pointer relative overflow-hidden"
            >
              <div
                className={`absolute -bottom-6 -right-6 w-24 h-24 ${cat.bg} rounded-full opacity-30 group-hover:scale-150 transition-transform duration-700`}
              ></div>
              <div className="flex flex-col gap-6">
                <div
                  className={`w-14 h-14 ${cat.bg} rounded-2xl flex items-center justify-center ${cat.color}`}
                >
                  <cat.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    {cat.count}
                  </h3>
                  <p className="text-sm font-bold text-slate-500">
                    {cat.title}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
                    New Updates
                  </span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Divider */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-xl font-black text-slate-900 tracking-tight whitespace-nowrap">
            Generated Documents
          </h2>
          <div className="h-px w-full bg-slate-200"></div>
          <button className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest whitespace-nowrap hover:gap-3 transition-all">
            View Archive Filter <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Reports Table / List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Document Name
                  </th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Type
                  </th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Size
                  </th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Generation Date
                  </th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentReports.map((report, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-indigo-50/30 transition-all cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-800 group-hover:text-indigo-950">
                          {report.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border 
                                  ${
                                    report.type === "PDF"
                                      ? "border-red-200 bg-red-50 text-red-600"
                                      : report.type === "XLSX"
                                        ? "border-green-200 bg-green-50 text-green-600"
                                        : "border-slate-200 bg-slate-50 text-slate-500"
                                  }`}
                      >
                        {report.type}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-500">
                      {report.size}
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-400">
                      {report.date}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${report.status === "Ready" ? "bg-green-500" : report.status === "Archived" ? "bg-slate-300" : "bg-amber-500"}`}
                        ></div>
                        <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">
                          {report.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-indigo-100 rounded-xl transition-all text-indigo-600 mr-2 shadow-sm border border-transparent hover:border-indigo-200">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center">
            <button className="text-sm font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">
              Load More Documents
            </button>
          </div>
        </div>
      </main>

      {/* Floating Summary Bar */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-3xl text-white px-10 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-10 border border-white/10 z-50 apple-fade-in-delay-2">
        <div className="flex flex-col gap-1 border-r border-white/10 pr-10">
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] leading-none">
            Total Data Collected
          </span>
          <span className="text-2xl font-black tracking-tighter">12.4 GB</span>
        </div>
        <div className="flex flex-col gap-1 border-r border-white/10 pr-10">
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] leading-none">
            Reports Generated Today
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter">42</span>
            <span className="px-2 py-0.5 bg-green-500 text-black text-[10px] font-black rounded-md">
              +5
            </span>
          </div>
        </div>
        <button className="bg-indigo-500 text-slate-950 font-black px-8 py-3 rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-400 transition-all active:scale-95 shadow-xl shadow-indigo-500/20">
          System Refresh
        </button>
      </div>
    </div>
  );
};

export default YQMSReport;
