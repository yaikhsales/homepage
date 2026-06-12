import React, { useState } from "react";
import {
  ArrowUpRight,
  Search,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  Tag,
  Download,
} from "lucide-react";
import ReportModal from "../components/ReportModal";

const AccessoriesIssuing = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  const reportColumns = [
    {
      header: "Line Target",
      accessor: "line",
      render: (val, row) => (
        <div>
          <div className="text-sm font-black text-white">{val}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight italic">
            {row.style}
          </div>
        </div>
      ),
    },
    {
      header: "Accessory Item",
      accessor: "item",
      render: (val) => (
        <span className="text-sm font-bold text-emerald-400 uppercase tracking-tight">
          {val}
        </span>
      ),
    },
    {
      header: "Batch Quantity",
      accessor: "qty",
      align: "center",
      render: (val) => (
        <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-black text-white italic border border-slate-800 shadow-inner">
          {val}
        </span>
      ),
    },
    {
      header: "Process Status",
      accessor: "status",
      render: (val) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${val === "Delivered" ? "text-emerald-500" : "text-amber-500"}`}
        >
          {val}
        </span>
      ),
    },
  ];

  // Mock data for Accessories Issuing
  const issuingData = [
    {
      id: "TIS-900",
      style: "Men Polo V2",
      line: "LINE-04",
      item: "Logo Buttons",
      qty: "1,200 Pcs",
      status: "Delivered",
    },
    {
      id: "TIS-901",
      style: "Ladies Summer Top",
      line: "LINE-12",
      item: "YKK Zips",
      qty: "200 Pcs",
      status: "In Transit",
    },
    {
      id: "TIS-902",
      style: "Cargo Pant Black",
      line: "LINE-01",
      item: "Industrial Thread",
      qty: "50 Cones",
      status: "Loading",
    },
    {
      id: "TIS-903",
      style: "Kids Tee 3PK",
      line: "LINE-08",
      item: "Size Labels (M)",
      qty: "5,000 Pcs",
      status: "Pending",
    },
    {
      id: "TIS-904",
      style: "Slim Fit Chino",
      line: "LINE-05",
      item: "Woven Elastic",
      qty: "300m",
      status: "Delivered",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Accessories Issuing Report"
        data={issuingData}
        columns={reportColumns}
        colorClass="emerald"
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
                Trims <span className="text-emerald-500">Issuing</span>
              </h1>
              <p className="text-slate-500 font-medium tracking-wide italic">
                Daily Accessory Distribution Floor Feed
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
              onClick={() => alert("Issue New Trims Triggered")}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-2xl"
            >
              <Package size={18} />
              Issue New Trims
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 shadow-xl">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Items Distributed Today
            </div>
            <div className="text-4xl font-black text-white italic tracking-tighter">
              12,450{" "}
              <span className="text-sm text-slate-500 font-bold not-italic">
                Pcs
              </span>
            </div>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 shadow-xl">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Pending Requests
            </div>
            <div className="text-4xl font-black text-amber-500 italic tracking-tighter">
              158{" "}
              <span className="text-sm text-slate-500 font-bold not-italic">
                Lines
              </span>
            </div>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 shadow-xl">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Stock Accuracy
            </div>
            <div className="text-4xl font-black text-emerald-500 italic tracking-tighter">
              99.2{" "}
              <span className="text-sm text-slate-500 font-bold not-italic">
                %
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Style, Item or Line..."
                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => alert("Tag Modal Active")}
                className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all border border-slate-700/50 shadow-lg"
              >
                <Tag size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="p-6">Line Target</th>
                  <th className="p-6">Accessory Item</th>
                  <th className="p-6 text-center">Batch Quantity</th>
                  <th className="p-6">Process Status</th>
                  <th className="p-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {issuingData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-all group"
                  >
                    <td className="p-6">
                      <div className="text-sm font-black text-white">
                        {row.line}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight italic">
                        {row.style}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors uppercase tracking-tight">
                        {row.item}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-black text-white italic border border-slate-800 shadow-inner">
                        {row.qty}
                      </span>
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          row.status === "Delivered"
                            ? "text-emerald-500"
                            : "text-amber-500"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => alert("Chevron Action")}
                        className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-600 hover:text-white"
                      >
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

export default AccessoriesIssuing;
