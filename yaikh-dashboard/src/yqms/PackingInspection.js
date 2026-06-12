import React, { useState } from "react";
import {
  ArrowLeft,
  Package,
  Search,
  CheckCircle2,
  AlertCircle,
  Barcode,
  Printer,
  Truck,
  Eye,
  Clock,
  Layers,
  ShieldCheck,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { useTranslation } from "../translate/TranslationContext";

const PackingInspection = ({ onBack }) => {
  const { t } = useTranslation();

  const cartons = [
    {
      id: "CTN-1001",
      style: "Y-7821",
      size: "M",
      qty: "24pcs",
      line: "L-01",
      status: "READY",
      inspector: "Bora",
    },
    {
      id: "CTN-1002",
      style: "Y-7821",
      size: "L",
      qty: "24pcs",
      line: "L-01",
      status: "READY",
      inspector: "Bora",
    },
    {
      id: "CTN-1003",
      style: "Y-9902",
      size: "S",
      qty: "12pcs",
      line: "L-05",
      status: "HOLD",
      inspector: "Sokha",
    },
    {
      id: "CTN-1004",
      style: "Y-9902",
      size: "XL",
      qty: "12pcs",
      line: "L-05",
      status: "READY",
      inspector: "Sokha",
    },
    {
      id: "CTN-1005",
      style: "J-0012",
      size: "L",
      qty: "20pcs",
      line: "L-03",
      status: "AUDITING",
      inspector: "Chen",
    },
  ];

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-[50] animate-in fade-in zoom-in-95 duration-500 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-white px-8 py-5 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-600 border border-slate-200"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              Packing Inspection
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Packing / Carton Auditing & Labelling
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] tracking-widest uppercase border border-slate-200 hover:bg-slate-200 transition-all">
            <Barcode size={14} /> Scan SKU
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg hover:shadow-xl transition-all active:scale-95">
            <Truck size={14} /> Approve Shipment
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Packing Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <Package size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-indigo-500 uppercase">
                    Cartons Packed
                  </span>
                  <p className="text-3xl font-black text-slate-800">458</p>
                </div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 mt-6 tracking-wide">
                Target: 600 Cartons / Shift
              </p>
              <div className="mt-2 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[76%] transition-all duration-1000"></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-emerald-500 uppercase">
                    AQL Pass Rate
                  </span>
                  <p className="text-3xl font-black text-slate-800">99.5%</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase">
                  Pass: 456
                </span>
                <span className="text-[9px] font-black text-rose-500 uppercase">
                  Hold: 2
                </span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <Barcode size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-blue-500 uppercase">
                    Labels Printed
                  </span>
                  <p className="text-3xl font-black text-slate-800">1,240</p>
                </div>
              </div>
              <button className="mt-6 w-full py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-white hover:shadow-sm transition-all flex items-center justify-center gap-2">
                <Printer size={12} /> Reprint Last Batch
              </button>
            </div>
            <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <Clock size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-orange-500 uppercase">
                    Avg Pack Time
                  </span>
                  <p className="text-3xl font-black text-slate-800">2.4m</p>
                </div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 mt-6 tracking-wide">
                Optimization: -15s avg.
              </p>
              <div className="mt-2 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[90%] transition-all duration-1000"></div>
              </div>
            </div>
          </div>

          {/* Carton List */}
          <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-50/20">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                  Ready for Shipment
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Building 3 / Warehouse Area 02
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Scan Carton QR..."
                    className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-[12px] font-bold w-full md:w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <button className="p-3.5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all border border-slate-200">
                  <ClipboardList size={22} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-10 py-6">Carton ID</th>
                    <th className="px-6 py-6">Style Details</th>
                    <th className="px-6 py-6 text-center">Quality Code</th>
                    <th className="px-6 py-6 text-center">Line Source</th>
                    <th className="px-6 py-6 text-center">Status</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {cartons.map((ctn) => (
                    <tr
                      key={ctn.id}
                      className="hover:bg-slate-50/80 transition-all group"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all shadow-sm">
                            <Barcode size={24} />
                          </div>
                          <span className="text-sm font-black text-slate-800 tracking-tight">
                            {ctn.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                            {ctn.style}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase">
                              Size: {ctn.size}
                            </span>
                            <span className="h-2 w-px bg-slate-200"></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase">
                              Qty: {ctn.qty}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <p className="text-[10px] font-bold text-slate-700">
                          {ctn.inspector}
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <div
                              key={s}
                              className={`w-1 h-1 rounded-full ${s <= 4 ? "bg-emerald-500" : "bg-slate-200"}`}
                            ></div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-tighter shadow-sm">
                          {ctn.line}
                        </span>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <span
                          className={`px-4 py-2 rounded-2xl text-[9px] font-black tracking-widest border transition-all ${ctn.status === "READY" ? "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-200/50" : ctn.status === "AUDITING" ? "bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-200/50 animate-pulse" : "bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-200/50"}`}
                        >
                          {ctn.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all group-hover:shadow-sm">
                          <Eye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-8 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((p) => (
                    <div
                      key={p}
                      className="w-10 h-10 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-800 flex items-center justify-center text-[10px] font-black text-white"
                    >
                      QA
                    </div>
                  ))}
                </div>
                <p className="text-[11px] font-bold text-slate-400 tracking-wide">
                  Shipment audit currently being reviewed by{" "}
                  <span className="text-white">Senior QC Lead</span>
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase mb-1">
                    Total Pieces
                  </span>
                  <p className="text-xl font-black text-white leading-none">
                    12,450 pcs
                  </p>
                </div>
                <button className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl active:scale-95">
                  Verify & Ship
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackingInspection;
