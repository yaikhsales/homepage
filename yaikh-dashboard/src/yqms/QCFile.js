import React, { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Search,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Printer,
  Share2,
} from "lucide-react";
import { useTranslation } from "../translate/TranslationContext";

const QCFile = ({ onBack }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const qcFiles = [
    {
      id: "QC-7821-01",
      style: "Y-7821",
      buyer: "H&M",
      season: "AW2026",
      version: "v2.4",
      date: "2026-02-10",
      status: "APPROVED",
    },
    {
      id: "QC-9902-05",
      style: "Y-9902",
      buyer: "ZARA",
      season: "SS2026",
      version: "v1.1",
      date: "2026-02-12",
      status: "PENDING",
    },
    {
      id: "QC-0012-03",
      style: "J-0012",
      buyer: "ADIDAS",
      season: "CORE",
      version: "v3.0",
      date: "2026-02-13",
      status: "APPROVED",
    },
    {
      id: "QC-5521-04",
      style: "P-5521",
      buyer: "NIKE",
      season: "SP2026",
      version: "v1.2",
      date: "2026-02-14",
      status: "APPROVED",
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-[50] animate-in fade-in duration-500 overflow-hidden">
      {/* Header */}
      <div className="bg-white px-8 py-5 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-600 border border-slate-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              QC Technical Files
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Pre-Production / Digital Library
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg hover:shadow-xl transition-all active:scale-95">
            <Download size={14} /> Export Archive
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Total Active Files
                </p>
                <p className="text-2xl font-black text-slate-800">124</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Approved Specs
                </p>
                <p className="text-2xl font-black text-slate-800">92</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Pending Review
                </p>
                <p className="text-2xl font-black text-slate-800">32</p>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by Style or Buyer..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 hover:bg-slate-200 rounded-xl text-slate-600 border border-slate-200 bg-white transition-all">
                  <Printer size={18} />
                </button>
                <button className="p-2.5 hover:bg-slate-200 rounded-xl text-slate-600 border border-slate-200 bg-white transition-all">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-4">Document Details</th>
                    <th className="px-4 py-4">Buyer / Season</th>
                    <th className="px-4 py-4 text-center">Version</th>
                    <th className="px-4 py-4 text-center">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {qcFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">
                              {file.style}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400">
                              {file.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <p className="text-[11px] font-black text-slate-700 uppercase">
                          {file.buyer}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">
                          {file.season}
                        </p>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <span className="px-2 py-1 bg-slate-100 text-[10px] font-black text-slate-600 rounded uppercase">
                          {file.version}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${file.status === "APPROVED" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-orange-50 text-orange-600 border border-orange-100"}`}
                        >
                          {file.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 hover:bg-blue-600 hover:text-white rounded-lg text-slate-400 transition-all shadow-sm hover:shadow-md">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                All quality technical packs are synchronized with the central
                PLM system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QCFile;
