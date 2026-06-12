import React, { useState } from "react";
import {
  Package,
  Search,
  Filter,
  Download,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Box,
  Truck,
  Maximize,
} from "lucide-react";
import ReportModal from "../components/ReportModal";

const FabricReceiving = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  const reportColumns = [
    {
      header: "ID",
      accessor: "id",
      render: (val) => <span className="font-bold text-blue-400">{val}</span>,
    },
    { header: "Date", accessor: "date" },
    {
      header: "Supplier",
      accessor: "supplier",
      render: (val) => <span className="font-bold text-white">{val}</span>,
    },
    { header: "Fabric Type", accessor: "fabricType" },
    { header: "Rolls", accessor: "rolls", align: "center" },
    { header: "Quantity", accessor: "quantity", align: "right" },
    {
      header: "Status",
      accessor: "status",
      align: "center",
      render: (val) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${val === "Completed" ? "bg-emerald-500/10 text-emerald-500" : val === "In-Progress" ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"}`}
        >
          {val}
        </span>
      ),
    },
  ];

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Mock data for Fabric Receiving
  const receivingData = [
    {
      id: "RCV-2024-001",
      date: "2026-02-14",
      supplier: "TexModern Ltd",
      fabricType: "100% Cotton Denim",
      rolls: 45,
      quantity: "2,250m",
      status: "Completed",
      inspector: "Sovan M.",
    },
    {
      id: "RCV-2024-002",
      date: "2026-02-14",
      supplier: "Global Silk Co.",
      fabricType: "Silk Satin",
      rolls: 12,
      quantity: "600m",
      status: "In-Progress",
      inspector: "Dara K.",
    },
    {
      id: "RCV-2024-003",
      date: "2026-02-13",
      supplier: "IndoWeave",
      fabricType: "Polyester Blend",
      rolls: 80,
      quantity: "4,000m",
      status: "Pending",
      inspector: "-",
    },
    {
      id: "RCV-2024-004",
      date: "2026-02-13",
      supplier: "Premium Linens",
      fabricType: "Linen Blue",
      rolls: 25,
      quantity: "1,250m",
      status: "Completed",
      inspector: "Sovan M.",
    },
    {
      id: "RCV-2024-005",
      date: "2026-02-12",
      supplier: "EcoFab",
      fabricType: "Organic Cotton",
      rolls: 30,
      quantity: "1,500m",
      status: "Completed",
      inspector: "Phally R.",
    },
  ];

  const stats = [
    {
      label: "Total Received Today",
      value: "57 Rolls",
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pending Inspection",
      value: "80 Rolls",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Total Meters (MTD)",
      value: "124,500m",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Active Shipments",
      value: "3 Trucks",
      icon: Truck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Fabric Receiving Report"
        data={receivingData}
        columns={reportColumns}
        colorClass="blue"
      />
      {/* Header Section */}
      <div className="w-full p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white uppercase">
                Fabric <span className="text-blue-500">Receiving</span>
              </h1>
              <p className="text-slate-500 font-medium">
                Material Inflow & Documentation Tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullScreen}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-bold border border-slate-700"
            >
              <Maximize size={18} />
              Full Screen
            </button>
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-bold border border-slate-700 shadow-lg"
            >
              <Download size={18} />
              Export Report
            </button>
            <button
              onClick={() => alert("New Entry Triggered")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              <Plus size={18} />
              New Entry
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-4 rounded-2xl shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Live Updates
                </div>
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by ID, Supplier or Fabric..."
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => alert("Filters Active")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-700 transition-all border border-slate-700"
            >
              <Filter size={16} />
              Filters
            </button>
            <div className="text-slate-600 hidden md:block mx-2 font-black">
              |
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase">
              Showing {receivingData.length} records
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-white/5">
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Received ID
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Supplier
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Fabric Type
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Rolls
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Quantity
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Status
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {receivingData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-4">
                      <div className="text-sm font-bold text-blue-400">
                        {row.id}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {row.date}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-white">
                        {row.supplier}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium text-slate-300">
                          {row.fabricType}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2 py-1 bg-slate-800 rounded font-mono text-xs text-white">
                        {row.rolls}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm font-black text-white">
                        {row.quantity}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            row.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : row.status === "In-Progress"
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {row.status === "Completed" ? (
                            <CheckCircle2 size={12} />
                          ) : row.status === "In-Progress" ? (
                            <Clock size={12} />
                          ) : (
                            <AlertCircle size={12} />
                          )}
                          {row.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-all text-slate-400 hover:text-white border border-transparent hover:border-slate-600">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 bg-slate-800/30 border-t border-white/5 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-500">Page 1 of 12</div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors border border-slate-700 opacity-50 cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold text-white hover:bg-slate-700 transition-colors border border-slate-700 shadow-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricReceiving;
