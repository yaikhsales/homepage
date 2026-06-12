import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ArrowLeft,
  TrendingUp,
  Filter,
  MoreVertical,
  Target,
  Zap,
  Users,
  DollarSign,
  Clock,
  MessageCircle,
  X,
  Award,
  BarChart3,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";

const WeeklyIncentiveDashboard = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // MOCK DATA: Performance incentives for Sewing Lines
  const [incentiveRecords] = useState([
    {
      id: "EMP-001",
      name: "Srey Mao",
      line: "Sewing A",
      efficiency: "112%",
      amount: 45.0,
      status: "paid",
      date: "Oct 20-27",
    },
    {
      id: "EMP-002",
      name: "Vannak Kem",
      line: "Sewing A",
      efficiency: "95%",
      amount: 32.5,
      status: "processed",
      date: "Oct 20-27",
    },
    {
      id: "EMP-003",
      name: "Sophea Rattanak",
      line: "QC Line 1",
      efficiency: "105%",
      amount: 38.0,
      status: "approved",
      date: "Oct 20-27",
    },
    {
      id: "EMP-004",
      name: "Chitra Long",
      line: "Sewing B",
      efficiency: "88%",
      amount: 15.0,
      status: "pending",
      date: "Oct 20-27",
    },
    {
      id: "EMP-009",
      name: "Dara Huy",
      line: "Cutting",
      efficiency: "120%",
      amount: 55.0,
      status: "paid",
      date: "Oct 20-27",
    },
  ]);

  const stats = useMemo(
    () => ({
      avgEff: "104%",
      totalPayout: 2150.0,
      pendingApprovals: 12,
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
               Incentive Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Track production bonuses and line efficiency
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsAddFormOpen(true)}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-bold shadow-lg shadow-green-100"
        >
          <Plus size={18} />
          New Incentive Entry
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Visual Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-green-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
              <Zap size={80} className="text-green-600" />
            </div>
            <p className="text-green-600 text-sm font-black uppercase tracking-wider mb-2">
              Avg. Line Efficiency
            </p>
            <h3 className="text-4xl font-black text-slate-800">
              {stats.avgEff}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 w-fit px-2 py-1 rounded-md">
              <TrendingUp size={14} /> +4% From Last Week
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
              <DollarSign size={80} className="text-blue-600" />
            </div>
            <p className="text-blue-600 text-sm font-black uppercase tracking-wider mb-2">
              Total  Payout
            </p>
            <h3 className="text-4xl font-black text-slate-800">
              ${stats.totalPayout}
            </h3>
            <p className="mt-4 text-slate-400 text-xs font-medium">
              Distributed across 142 workers
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
              <Award size={80} className="text-amber-600" />
            </div>
            <p className="text-amber-600 text-sm font-black uppercase tracking-wider mb-2">
              Top Performance Line
            </p>
            <h3 className="text-4xl font-black text-slate-800">Line A</h3>
            <p className="mt-4 text-slate-400 text-xs font-medium">
              12 workers hit 115% target
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name or line..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-green-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Employee
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Sewing Line
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Efficiency
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Incentive
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incentiveRecords.map((rec, i) => (
                <tr
                  key={i}
                  className="hover:bg-green-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{rec.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">
                      {rec.id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold">
                      {rec.line}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-green-600">
                    {rec.efficiency}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    ${rec.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-black uppercase border ${
                          rec.status === "paid"
                            ? "bg-green-100 border-green-200 text-green-700"
                            : rec.status === "pending"
                              ? "bg-amber-100 border-amber-200 text-amber-700"
                              : "bg-blue-100 border-blue-200 text-blue-700"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-all opacity-0 group-hover:opacity-100">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sidebar Form Integration */}
      {isAddFormOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]"
            onClick={() => setIsAddFormOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[201] flex flex-col transform transition-transform duration-300 animate-slide-in">
            <div className="p-6 bg-green-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">New Incentive Entry</h2>
                <p className="text-green-100 text-xs">
                  Calculate based on target efficiency
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
                    Select Target Employee
                  </label>
                  <select className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 font-bold text-slate-700">
                    <option>Srey Mao (EMP-001)</option>
                    <option>Vannak Kem (EMP-002)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Actual Production
                    </label>
                    <input
                      type="number"
                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="1200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Target Pcs
                    </label>
                    <input
                      type="number"
                      className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="1000"
                    />
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-green-700">
                      Efficiency Achieved
                    </span>
                    <span className="text-xl font-black text-green-700">
                      120%
                    </span>
                  </div>
                  <div className="w-full bg-green-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-green-600 h-full transition-all duration-1000"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-500 font-bold uppercase text-[10px]">
                  Calculated Incentive
                </span>
                <span className="text-2xl font-black text-slate-800">
                  $55.00
                </span>
              </div>
              <button className="w-full py-4 bg-green-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-xl shadow-green-100">
                <Plus size={18} />
                Submit Incentive Record
              </button>
            </div>
          </div>
        </>
      )}

      {/* AI Bot */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-[102] w-14 h-14 bg-gradient-to-tr from-green-600 to-teal-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <MessageCircle className="relative z-10" size={24} />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Weekly Incentive Dashboard"
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

export default WeeklyIncentiveDashboard;
