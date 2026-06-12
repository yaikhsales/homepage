import React, { useState } from "react";
import {
  ArrowLeft,
  ClipboardCheck,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  History,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "../translate/TranslationContext";

const AuditReport = ({ title, onBack }) => {
  const { t } = useTranslation();

  const auditData = [
    {
      id: "AUD-101",
      style: "Y-7821",
      auditor: "Sok Samnang",
      samples: 20,
      defects: 1,
      status: "PASS",
      date: "2026-02-14",
    },
    {
      id: "AUD-102",
      style: "Y-9902",
      auditor: "Keo Leakhena",
      samples: 20,
      defects: 4,
      status: "FAIL",
      date: "2026-02-14",
    },
    {
      id: "AUD-103",
      style: "J-0012",
      auditor: "Chan Thavy",
      samples: 20,
      defects: 0,
      status: "PASS",
      date: "2026-02-13",
    },
    {
      id: "AUD-104",
      style: "P-5521",
      auditor: "Touch Borey",
      samples: 20,
      defects: 2,
      status: "PASSED WITH CAP",
      date: "2026-02-12",
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
              {title || "General Audit Report"}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              YQMS / Quality Lifecycle Monitoring
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2 bg-slate-800 text-white rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg">
            <ClipboardCheck size={14} /> New Audit
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Trends Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Total Audits
              </p>
              <p className="text-2xl font-black text-slate-800 mt-1">45</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Pass Rate
              </p>
              <p className="text-2xl font-black text-emerald-600 mt-1">92.4%</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Reject Rate
              </p>
              <p className="text-2xl font-black text-rose-600 mt-1">4.2%</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Pending CAP
              </p>
              <p className="text-2xl font-black text-orange-600 mt-1">08</p>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <BarChart3 size={20} />
                </div>
                <span className="text-sm font-black text-slate-800 uppercase tracking-widest italic">
                  Audit Logs
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all">
                  <Search size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-4">Audit ID</th>
                    <th className="px-4 py-4">Style</th>
                    <th className="px-4 py-4">Auditor</th>
                    <th className="px-4 py-4 text-center">Outcome</th>
                    <th className="px-8 py-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {auditData.map((audit) => (
                    <tr
                      key={audit.id}
                      className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                    >
                      <td className="px-8 py-5">
                        <p className="text-xs font-black text-slate-800">
                          {audit.id}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400">
                          {audit.date}
                        </p>
                      </td>
                      <td className="px-4 py-5 text-xs font-black text-blue-600 uppercase italic">
                        {audit.style}
                      </td>
                      <td className="px-4 py-5 text-xs font-bold text-slate-600">
                        {audit.auditor}
                      </td>
                      <td className="px-4 py-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest border ${audit.status === "PASS" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : audit.status === "FAIL" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}
                        >
                          {audit.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 hover:bg-white rounded-lg text-slate-300 hover:text-blue-600 shadow-sm border border-transparent hover:border-slate-100 transition-all">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditReport;
