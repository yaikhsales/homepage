import React, { useState } from "react";
import {
  ArrowDownLeft,
  Search,
  ArrowLeft,
  ChevronRight,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  PackageOpen,
  Download,
} from "lucide-react";
import ReportModal from "../components/ReportModal";

const ReturnAccessories = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  const reportColumns = [
    {
      header: "TR ID",
      accessor: "id",
      render: (val) => (
        <span className="font-black text-white uppercase">{val}</span>
      ),
    },
    {
      header: "Origin",
      accessor: "line",
      render: (val) => (
        <span className="text-sm font-black text-slate-300 italic">{val}</span>
      ),
    },
    {
      header: "Accessory Name",
      accessor: "item",
      render: (val) => (
        <span className="text-sm font-bold text-amber-500 uppercase">
          {val}
        </span>
      ),
    },
    {
      header: "Qty Returned",
      accessor: "qty",
      align: "center",
      render: (val) => (
        <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-black text-white italic border border-slate-800">
          {val}
        </span>
      ),
    },
    {
      header: "Reason for Return",
      accessor: "reason",
      render: (val) => (
        <span className="text-xs font-bold text-slate-500 uppercase">
          {val}
        </span>
      ),
    },
    {
      header: "Inventory Status",
      accessor: "status",
      align: "right",
      render: (val) => (
        <span
          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${val === "In Stock" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}
        >
          {val}
        </span>
      ),
    },
  ];

  // Mock data for Accessories Returns
  const returnData = [
    {
      id: "RTN-A-010",
      item: "YKK Zips 20cm",
      line: "LINE-04",
      qty: "12 Pcs",
      reason: "Surplus",
      status: "In Stock",
    },
    {
      id: "RTN-A-011",
      item: "Logo Buttons",
      line: "LINE-12",
      qty: "45 Pcs",
      reason: "Damaged Lot",
      status: "Rejected",
    },
    {
      id: "RTN-A-012",
      item: "Cotton Thread",
      line: "LINE-01",
      qty: "2 Cones",
      reason: "End of Batch",
      status: "In Stock",
    },
    {
      id: "RTN-A-013",
      item: "Size Labels",
      line: "LINE-05",
      qty: "120 Pcs",
      reason: "Wrong Size Issued",
      status: "Holding",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Accessories Return Report"
        data={returnData}
        columns={reportColumns}
        colorClass="amber"
      />
      <div className="w-full mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white uppercase">
                Return <span className="text-amber-500">Accessories</span>
              </h1>
              <p className="text-slate-500 font-medium tracking-wide">
                Trims & Hardware Recovery Log
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-2xl"
            >
              <Download size={18} />
              Export
            </button>
            <button
              onClick={() => alert("Process Return Triggered")}
              className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-2xl"
            >
              <PackageOpen size={18} />
              Process Return
            </button>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-800/20">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Item, Line or Return ID..."
                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="p-6">TR ID</th>
                  <th className="p-6">Origin</th>
                  <th className="p-6">Accessory Name</th>
                  <th className="p-6 text-center">Qty Returned</th>
                  <th className="p-6">Reason for Return</th>
                  <th className="p-6 text-right">Inventory Status</th>
                </tr>
              </thead>
              <tbody>
                {returnData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-all group"
                  >
                    <td className="p-6">
                      <div className="text-sm font-black text-white uppercase tracking-widest">
                        {row.id}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-black text-slate-300 italic tracking-tighter">
                        {row.line}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-bold text-amber-500 group-hover:text-amber-400 transition-colors uppercase tracking-tight">
                        {row.item}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-black text-white italic border border-slate-800">
                        {row.qty}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                        {row.reason}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          row.status === "In Stock"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {row.status}
                      </span>
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

export default ReturnAccessories;
