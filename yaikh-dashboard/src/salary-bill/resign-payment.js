import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ArrowLeft,
  LogOut,
  FileText,
  Trash2,
  DollarSign,
  Filter,
  MoreVertical,
  MessageCircle,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Tool,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";

const ResignPaymentDashboard = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // MOCK DATA: Resignation and Clearance tracking
  const [resignRecords] = useState([
    {
      id: "EMP-442",
      name: "Chan Raksmey",
      dept: "Sewing Line B",
      resignDate: "2023-10-15",
      lastDay: "2023-11-15",
      amount: 480.0,
      clearance: "completed",
      status: "paid",
    },
    {
      id: "EMP-210",
      name: "Sokha Meng",
      dept: "Quality Control",
      resignDate: "2023-10-28",
      lastDay: "2023-11-28",
      amount: 520.5,
      clearance: "pending_items",
      status: "approved",
    },
    {
      id: "EMP-089",
      name: "Vannak Kem",
      dept: "Sewing Line A",
      resignDate: "2023-11-01",
      lastDay: "2023-12-01",
      amount: 390.0,
      clearance: "verified",
      status: "pending",
    },
    {
      id: "EMP-512",
      name: "Borith Seng",
      dept: "Finishing",
      resignDate: "2023-10-10",
      lastDay: "2023-11-10",
      amount: 450.0,
      clearance: "completed",
      status: "processed",
    },
  ]);

  const stats = useMemo(
    () => ({
      pendingSettlements: 14,
      totalResignPayout: "6,840.00",
      avgClearanceTime: "4.2 Days",
    }),
    [],
  );

  const handleBack = () => (onBack ? onBack() : navigate(-1));

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col overflow-hidden z-[100]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-[101]">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Resign & Clearance Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Manage employee exits and final settlements
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAddFormOpen(true)}
          className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-bold shadow-lg shadow-orange-100"
        >
          <Plus size={18} />
          Initiate Resignation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <LogOut size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Active Exits
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-800">
              {stats.pendingSettlements}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Personnel currently in notice period
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <DollarSign size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Total Payouts
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-800">
              ${stats.totalResignPayout}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Final settlements processed this month
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <CheckCircle2 size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Efficiency
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-800">
              {stats.avgClearanceTime}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Avg time to complete asset recovery
            </p>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search resigning staff..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-inner"
              />
            </div>
            <div className="flex items-center gap-3">
              <select className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-orange-500 transition-all">
                <option>All Clearance Status</option>
                <option>Completed</option>
                <option>Awaiting Assets</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    Employee
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    Exit Timeline
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    Settlement
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">
                    Clearance Progress
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">
                    Payment Status
                  </th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resignRecords.map((rec, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/80 transition-all group"
                  >
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-800 tracking-tight">
                        {rec.name}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        {rec.id} • {rec.dept}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="bg-orange-400 h-full rounded-full"
                            style={{ width: "60%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-medium">
                        Last Day: {rec.lastDay}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-800">
                        ${rec.amount.toFixed(2)}
                      </div>
                      <div className="text-[9px] text-orange-600 font-black uppercase flex items-center gap-1 cursor-pointer hover:underline">
                        <FileText size={10} /> View Breakdown
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase ${
                            rec.clearance === "completed"
                              ? "bg-green-50 border-green-200 text-green-600"
                              : rec.clearance === "verified"
                                ? "bg-blue-50 border-blue-200 text-blue-600"
                                : "bg-red-50 border-red-200 text-red-600"
                          }`}
                        >
                          {rec.clearance === "pending_items" ? (
                            <AlertCircle size={12} />
                          ) : (
                            <CheckCircle2 size={12} />
                          )}
                          {rec.clearance.replace("_", " ")}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                            rec.status === "paid"
                              ? "bg-slate-800 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-200 hover:text-slate-800 transition-all opacity-0 group-hover:opacity-100">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Side Panel Entry Form */}
      {isAddFormOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]"
            onClick={() => setIsAddFormOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-[201] flex flex-col transform transition-transform duration-300 animate-slide-in">
            <div className="p-8 bg-orange-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  Initiate Resignation
                </h2>
                <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mt-1">
                  Personnel Exit Clearance
                </p>
              </div>
              <button
                onClick={() => setIsAddFormOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 p-8 overflow-y-auto space-y-10">
              {/* Employee Selection */}
              <section>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
                  Select Employee
                </label>
                <div className="p-5 bg-orange-50 rounded-3xl border border-orange-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-orange-600 shadow-sm border border-orange-100">
                      VK
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">
                        Vannak Kem
                      </p>
                      <p className="text-[10px] font-black text-orange-600 uppercase">
                        Sewing Line A • EMP-089
                      </p>
                    </div>
                  </div>
                  <button className="text-[10px] font-black text-slate-400 hover:text-slate-800 underline uppercase tracking-widest">
                    Change
                  </button>
                </div>
              </section>

              {/* Dates */}
              <section className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    Notice Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-orange-100 transition-all font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    Last Working Day
                  </label>
                  <input
                    type="date"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-orange-100 transition-all font-bold text-slate-700"
                  />
                </div>
              </section>

              {/* Clearance Checklist Preview */}
              <section className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">
                  Asset Recovery Checklist
                </label>
                <div className="space-y-3">
                  {[
                    "Security Access Card",
                    "Sewing Machine Tools",
                    "Uniforms (3 Sets)",
                    "Company ID Badge",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center bg-white cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all">
                        <div className="w-2 h-2 bg-orange-500 rounded-sm opacity-0 hover:opacity-100 transition-opacity"></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Provisional Settlement
                  </p>
                  <p className="text-3xl font-black text-slate-800">$0.00</p>
                </div>
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span className="text-[10px] font-black uppercase leading-tight">
                    Clearance Incomplete
                    <br />
                    Payout Locked
                  </span>
                </div>
              </div>
              <button className="w-full py-5 bg-slate-800 text-white rounded-3xl font-black hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-2xl">
                <LogOut size={20} /> Start Resignation Workflow
              </button>
            </div>
          </div>
        </>
      )}

      {/* AI Assistant */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-[102] w-14 h-14 bg-gradient-to-tr from-orange-600 to-red-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <MessageCircle size={24} className="relative z-10" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Resign Payment Dashboard"
        />
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
                @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
                .animate-slide-in { animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
            `,
        }}
      />
    </div>
  );
};

export default ResignPaymentDashboard;
