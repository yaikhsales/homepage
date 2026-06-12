import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ClipboardCheck,
  Tag,
  Eye,
} from "lucide-react";
import { Modal, Button } from "../components/ModuleModal";
import ModuleBotButton from "../components/ModuleBotButton";

const AccessoriesInspection = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({ open: false, row: null });

  const inspectionData = [
    {
      id: "AIN-900",
      item: "Buttons 15mm",
      supplier: "TrimMaster",
      qty: "50,000 Pcs",
      sampled: "500 Pcs",
      defects: 2,
      status: "Passed",
      date: "2026-02-14",
    },
    {
      id: "AIN-901",
      item: "YKK Zips 20cm",
      supplier: "ZipTech",
      qty: "5,000 Pcs",
      sampled: "80 Pcs",
      defects: 12,
      status: "Rejected",
      date: "2026-02-14",
    },
    {
      id: "AIN-902",
      item: "Size Labels",
      supplier: "LabelPro",
      qty: "120,000 Pcs",
      sampled: "1,000 Pcs",
      defects: 0,
      status: "Passed",
      date: "2026-02-13",
    },
    {
      id: "AIN-903",
      item: "Cotton Thread",
      supplier: "ThreadWorks",
      qty: "1,000 Cones",
      sampled: "20 Cones",
      defects: 1,
      status: "Passed",
      date: "2026-02-12",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      {reportOpen && (
        <Modal onClose={() => setReportOpen(false)} title="Accessories Inspection Report">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 shadow-xl flex items-center gap-4">
              <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Pass Audit Rate</div>
                <div className="text-3xl font-black text-white italic">97.8%</div>
              </div>
            </div>
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 shadow-xl flex items-center gap-4">
              <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl">
                <AlertCircle size={32} />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Critical Failures</div>
                <div className="text-3xl font-black text-rose-500 italic">2 Batches</div>
              </div>
            </div>
            <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 shadow-xl flex items-center gap-4">
              <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl">
                <Eye size={32} />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Units Sampled Today</div>
                <div className="text-3xl font-black text-white italic">14,200 <span className="text-sm font-bold opacity-30">Pcs</span></div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="p-4">Audit ID</th>
                  <th className="p-4">Trims Item / Supplier</th>
                  <th className="p-4 text-center">Batch Size</th>
                  <th className="p-4 text-center">Sampled</th>
                  <th className="p-4 text-center">Defects</th>
                  <th className="p-4 text-right">Decision</th>
                </tr>
              </thead>
              <tbody>
                {inspectionData.map((row, idx) => (
                  <tr key={idx} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-all group">
                    <td className="p-4 text-xs font-black text-white uppercase tracking-widest font-mono">{row.id}</td>
                    <td className="p-4">
                      <div className="text-xs font-bold text-slate-200 uppercase tracking-tight">{row.item}</div>
                      <div className="text-[10px] font-bold text-slate-500 italic tracking-tighter">{row.supplier}</div>
                    </td>
                    <td className="p-4 text-center"><span className="text-xs font-black text-slate-400 font-mono tracking-tighter">{row.qty}</span></td>
                    <td className="p-4 text-center"><span className="px-2 py-1 bg-slate-800 rounded-lg text-xs font-bold text-white border border-slate-700">{row.sampled}</span></td>
                    <td className="p-4 text-center"><span className={`text-xs font-black italic ${row.defects > 5 ? "text-rose-500" : "text-emerald-500"}`}>{row.defects} <span className="text-[10px] opacity-40">pcs</span></span></td>
                    <td className="p-4 text-right">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${row.status === "Passed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]"}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center gap-4">
            <Button onClick={() => window.print()} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 rounded-xl">Print / PDF</Button>
            <Button onClick={() => setReportOpen(false)} className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-2 rounded-xl">Close</Button>
          </div>
        </Modal>
      )}
      {infoModal.open && (
        <Modal onClose={() => setInfoModal({ open: false, row: null })} title="Inspection Details">
          {infoModal.row && (
            <div className="space-y-2">
              <div className="font-bold text-lg text-emerald-400">{infoModal.row.item}</div>
              <div className="text-xs text-slate-400">Supplier: {infoModal.row.supplier}</div>
              <div className="text-xs text-slate-400">Batch Size: {infoModal.row.qty}</div>
              <div className="text-xs text-slate-400">Sampled: {infoModal.row.sampled}</div>
              <div className="text-xs text-slate-400">Defects: {infoModal.row.defects}</div>
              <div className="text-xs text-slate-400">Status: <span className={infoModal.row.status === "Passed" ? "text-emerald-500" : "text-rose-500"}>{infoModal.row.status}</span></div>
              <div className="text-xs text-slate-400">Date: {infoModal.row.date}</div>
            </div>
          )}
        </Modal>
      )}
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
                Accessories <span className="text-emerald-500">Inspection</span>
              </h1>
              <p className="text-slate-500 font-medium tracking-wide">
                Trims & Packaging Quality Control
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-2xl"
              onClick={() => setReportOpen(true)}
            >
              <ClipboardCheck size={18} />
              Report
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-2xl"
              onClick={() => setInfoModal({ open: true, row: null })}
            >
              <Tag size={18} />
              Info
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-2xl"
              onClick={() => alert("Start Inspection action")}
            >
              <Plus size={18} />
              Start Inspection
            </button>
            <ModuleBotButton module="AccessoriesInspection" />
          </div>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center bg-emerald-500/5">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Seach Item, ID or Supplier..."
                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="p-6">Audit ID</th>
                  <th className="p-6">Trims Item / Supplier</th>
                  <th className="p-6 text-center">Batch Size</th>
                  <th className="p-6 text-center">Sampled</th>
                  <th className="p-6 text-center">Defects</th>
                  <th className="p-6 text-right">Decision</th>
                </tr>
              </thead>
              <tbody>
                {inspectionData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-all group cursor-pointer"
                    onClick={() => setInfoModal({ open: true, row })}
                  >
                    <td className="p-6 text-sm font-black text-white uppercase tracking-widest font-mono">
                      {row.id}
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-bold text-slate-200 uppercase tracking-tight">
                        {row.item}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 italic tracking-tighter">
                        {row.supplier}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="text-xs font-black text-slate-400 font-mono tracking-tighter">
                        {row.qty}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <span className="px-2 py-1 bg-slate-800 rounded-lg text-xs font-bold text-white border border-slate-700">
                        {row.sampled}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <span
                        className={`text-sm font-black italic ${row.defects > 5 ? "text-rose-500" : "text-emerald-500"}`}
                      >
                        {row.defects}{" "}
                        <span className="text-[10px] opacity-40">pcs</span>
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                          row.status === "Passed"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
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

export default AccessoriesInspection;
