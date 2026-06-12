import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ArrowLeft,
  Shield,
  AlertTriangle,
  Calendar,
  DollarSign,
  Filter,
  MoreVertical,
  MessageCircle,
  X,
  CheckCircle2,
  History,
  FileText,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";

const PermitFeeDashboard = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // MOCK DATA: Permit tracking for factory staff
  const [permitRecords] = useState([
    {
      id: "EXP-101",
      name: "Dr. Zhang Wei",
      type: "Expert Work Permit",
      fee: 150.0,
      expiry: "2023-12-15",
      status: "expiring",
      dept: "Production Management",
    },
    {
      id: "EXP-102",
      name: "James Kim",
      type: "Business Visa",
      fee: 85.0,
      expiry: "2024-05-20",
      status: "valid",
      dept: "Technical Div",
    },
    {
      id: "EMP-055",
      name: "Srey Mao",
      type: "Occupational ID",
      fee: 12.0,
      expiry: "2023-11-01",
      status: "expired",
      dept: "Sewing Line A",
    },
    {
      id: "EXP-103",
      name: "Amit Singh",
      type: "Work Permit",
      fee: 140.0,
      expiry: "2023-12-28",
      status: "valid",
      dept: "R&D",
    },
  ]);

  const stats = useMemo(
    () => ({
      expiringSoon: 4,
      totalFees: "1,240.00",
      expiredCount: 1,
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
              Permit Fee Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Legal documentation and compliance tracking
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAddFormOpen(true)}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-bold shadow-lg shadow-purple-100"
        >
          <Plus size={18} />
          Process New Permit
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border-l-[6px] border-l-amber-500 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
              <AlertTriangle size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                Expiring Soon
              </p>
              <h3 className="text-3xl font-black text-slate-800">
                {stats.expiringSoon} Permits
              </h3>
              <p className="text-[10px] text-amber-600 font-bold mt-1">
                Renewal required within 30 days
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border-l-[6px] border-l-red-500 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
              <Shield size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                Expired Documents
              </p>
              <h3 className="text-3xl font-black text-slate-800">
                {stats.expiredCount} Critical
              </h3>
              <p className="text-[10px] text-red-600 font-bold mt-1">
                Requires immediate attention
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border-l-[6px] border-l-purple-500 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <DollarSign size={28} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                YTD Permit Spend
              </p>
              <h3 className="text-3xl font-black text-slate-800">
                ${stats.totalFees}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1">
                Across all departments
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="relative w-72">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search permit # or staff..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-purple-600 transition-colors">
                <History size={18} />
              </button>
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-purple-600 transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Employee & Dept
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Permit Type
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Fee Tracking
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Expiry Date
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Legal Status
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permitRecords.map((rec, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{rec.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {rec.dept}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FileText size={14} className="text-purple-400" />
                      {rec.type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-slate-800">
                      ${rec.fee.toFixed(2)}
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase transition-transform group-hover:translate-x-1 cursor-default">
                      View Receipt
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      {rec.expiry}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                          rec.status === "valid"
                            ? "bg-green-50 border-green-200 text-green-600"
                            : rec.status === "expiring"
                              ? "bg-amber-50 border-amber-200 text-amber-600"
                              : "bg-red-50 border-red-200 text-red-600"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sidebar Form */}
      {isAddFormOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]"
            onClick={() => setIsAddFormOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[201] flex flex-col transform transition-transform duration-300 animate-slide-in">
            <div className="p-6 bg-purple-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Process Permit Fee</h2>
                <p className="text-purple-100 text-[10px] uppercase font-bold tracking-widest">
                  Legal Compliance Entry
                </p>
              </div>
              <button
                onClick={() => setIsAddFormOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Document Category
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button className="p-3 border-2 border-purple-600 bg-purple-50 text-purple-700 rounded-xl font-bold text-xs flex flex-col items-center gap-1">
                      <Shield size={16} /> Work Permit
                    </button>
                    <button className="p-3 border-2 border-slate-100 hover:border-purple-200 rounded-xl font-bold text-xs text-slate-500 flex flex-col items-center gap-1 transition-all">
                      <Calendar size={16} /> Visa Record
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Permit Number
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="WP-XXXX-2023"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Expiray Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Payment Amount ($)
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200">
              <button className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-purple-700 transition-all shadow-xl shadow-purple-100">
                <CheckCircle2 size={18} /> Finish & Log Fee
              </button>
            </div>
          </div>
        </>
      )}

      {/* AI Bot */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-[102] w-14 h-14 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <MessageCircle className="relative z-10" size={24} />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Permit Fee Dashboard"
        />
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
                @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
                .animate-slide-in { animation: slide-in 0.3s ease-out; }
            `,
        }}
      />
    </div>
  );
};

export default PermitFeeDashboard;
