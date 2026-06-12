import React, { useState } from "react";
import {
  Box,
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
  Tag,
  Truck,
} from "lucide-react";
import ReportModal from "../components/ReportModal";

const AccessoriesReceiving = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  const reportColumns = [
    {
      header: "ID",
      accessor: "id",
      render: (val) => <span className="font-bold text-amber-400">{val}</span>,
    },
    { header: "Lot", accessor: "lot" },
    {
      header: "Supplier",
      accessor: "supplier",
      render: (val) => <span className="font-bold text-white">{val}</span>,
    },
    { header: "ItemType", accessor: "itemType" },
    { header: "Cartons", accessor: "cartons", align: "center" },
    { header: "Units", accessor: "units", align: "right" },
    {
      header: "Status",
      accessor: "status",
      align: "center",
      render: (val) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${val === "Completed" ? "bg-emerald-500/10 text-emerald-500" : val === "In-Progress" ? "bg-amber-500/10 text-amber-500" : "bg-slate-500/10 text-slate-500"}`}
        >
          {val}
        </span>
      ),
    },
  ];

  // Mock data for Accessories Receiving
  const receivingData = [
    {
      id: "ACC-2024-001",
      date: "2026-02-14",
      supplier: "TrimMaster Ind.",
      itemType: "Metal Buttons 15mm",
      units: "50,000 Pcs",
      cartons: 10,
      status: "Completed",
      lot: "L-998",
    },
    {
      id: "ACC-2024-002",
      date: "2026-02-14",
      supplier: "ZipTech Global",
      itemType: "YKK Zippers 20cm",
      units: "5,000 Pcs",
      cartons: 5,
      status: "In-Progress",
      lot: "Z-112",
    },
    {
      id: "ACC-2024-003",
      date: "2026-02-13",
      supplier: "LabelPro",
      itemType: "Main Brand Labels",
      units: "120,000 Pcs",
      cartons: 8,
      status: "Pending",
      lot: "M-445",
    },
    {
      id: "ACC-2024-004",
      date: "2026-02-13",
      supplier: "ThreadWorks",
      itemType: "Polyester Thread #40",
      units: "1,000 Cones",
      cartons: 20,
      status: "Completed",
      lot: "T-001",
    },
    {
      id: "ACC-2024-005",
      date: "2026-02-12",
      supplier: "Elastic Plus",
      itemType: "Woven Elastic 25mm",
      units: "5,000m",
      cartons: 15,
      status: "Completed",
      lot: "E-556",
    },
  ];

  const stats = [
    {
      label: "Cartons Pending",
      value: "45 Cartons",
      icon: Box,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Items to Verify",
      value: "185,000 Pcs",
      icon: Tag,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Verified (Today)",
      value: "55,000 Pcs",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Delivery Alerts",
      value: "1 Delayed",
      icon: AlertCircle,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Accessories Receiving Report"
        data={receivingData}
        columns={reportColumns}
        colorClass="amber"
      />
      {/* Header Section */}
      <div className="w-full mb-8">
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
                Accessories <span className="text-amber-500">Receiving</span>
              </h1>
              <p className="text-slate-500 font-medium">
                Trims, Buttons & Labels Inventory Input
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-bold border border-slate-700 shadow-lg"
            >
              <Download size={18} />
              Export
            </button>
            <button
              onClick={() => alert("Receive New Trims Triggered")}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-all font-bold shadow-[0_0_20px_rgba(217,119,6,0.4)]"
            >
              <Plus size={18} />
              Receive New Trims
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
                  Live
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
              placeholder="Search items, lot numbers or suppliers..."
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all text-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => alert("Filter Lots Active")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-700 transition-all border border-slate-700"
            >
              <Filter size={16} />
              Filter Lot
            </button>
            <div className="text-slate-600 hidden md:block mx-2 font-black">
              |
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase">
              Current Session: 12 Batches
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
                    Lot / ID
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Supplier
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Accessory Item
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Cartons
                  </th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Units Received
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
                      <div className="text-sm font-bold text-amber-400">
                        {row.id}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {row.lot}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-white">
                        {row.supplier}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                        {row.itemType}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2 py-1 bg-slate-800 rounded font-mono text-xs text-white">
                        {row.cartons}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm font-black text-white">
                        {row.units}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            row.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : row.status === "In-Progress"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-slate-500/10 text-slate-500"
                          }`}
                        >
                          {row.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-all text-slate-400 hover:text-white">
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
  );
};

export default AccessoriesReceiving;
