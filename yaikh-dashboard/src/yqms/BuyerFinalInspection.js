import React from "react";
import {
  ArrowLeft,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Search,
  Check,
  X,
  FileText,
  BarChart2,
  PieChart,
  ShieldCheck,
} from "lucide-react";

const BuyerFinalInspection = ({ onBack }) => {
  const inspectionData = [
    {
      id: "INS-2024-001",
      buyer: "Levi's",
      style: "LV-デニム-501",
      po: "PO-4500921",
      date: "2024-05-15",
      inspector: "John Smith",
      result: "Passed",
      aql: "2.5/4.0",
      unitsChecked: 125,
      defectsFound: 2,
      status: "Finalized",
    },
    {
      id: "INS-2024-002",
      buyer: "Nike",
      style: "NK-AIR-MAX",
      po: "PO-4500922",
      date: "2024-05-14",
      inspector: "Sarah Wong",
      result: "Failed",
      aql: "1.5/2.5",
      unitsChecked: 80,
      defectsFound: 7,
      status: "Re-inspection Required",
    },
    {
      id: "INS-2024-003",
      buyer: "Adidas",
      style: "AD-ULTRA-BOOST",
      po: "PO-4500923",
      date: "2024-05-14",
      inspector: "Mike Ross",
      result: "Passed",
      aql: "2.5/4.0",
      unitsChecked: 200,
      defectsFound: 4,
      status: "Finalized",
    },
    {
      id: "INS-2024-004",
      buyer: "Uniqlo",
      style: "UQ-AIRISM-TEE",
      po: "PO-4500924",
      date: "2024-05-13",
      inspector: "Jane Doe",
      result: "Pending",
      aql: "1.5/1.5",
      unitsChecked: 150,
      defectsFound: 0,
      status: "In Progress",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 apple-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Buyer Final Inspection
            </h1>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Comprehensive External Quality
              Audits
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Buyer/PO..."
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-red-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-red-200">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 apple-fade-in-delay">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Audits</p>
            <p className="text-2xl font-bold text-slate-800">1,280</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Pass Rate</p>
            <p className="text-2xl font-bold text-slate-800">94.2%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <PieChart className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">
              Critical Issues
            </p>
            <p className="text-2xl font-bold text-slate-800">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Under Review</p>
            <p className="text-2xl font-bold text-slate-800">45</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden apple-fade-in-delay-2">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            Recent Inspection Results
          </h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200">
              Monthly
            </button>
            <button className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md border border-red-100 font-medium">
              Weekly
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Inspection ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Buyer & Style
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Date & Inspector
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  AQL Standard
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Result
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inspectionData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-bold text-slate-700">
                      {item.id}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      PO: {item.po}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-800">
                      {item.buyer}
                    </div>
                    <div className="text-xs text-slate-500">{item.style}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-3.5 h-3.5" /> {item.date}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <User className="w-3.5 h-3.5" /> {item.inspector}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {item.aql}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                      ${
                        item.result === "Passed"
                          ? "bg-green-100 text-green-700"
                          : item.result === "Failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.result === "Passed" ? (
                        <Check className="w-3 h-3" />
                      ) : item.result === "Failed" ? (
                        <X className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {item.result}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">{item.status}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-bold text-blue-500 hover:text-blue-700 underline">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
          <button className="text-sm font-bold text-slate-500 hover:text-slate-700">
            View All Inspection History
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerFinalInspection;
