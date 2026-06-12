import React, { useState } from "react";
import {
  Calculator as CalcIcon,
  ArrowLeft,
  ChevronRight,
  TrendingDown,
  FileText,
  Save,
  RefreshCcw,
  Scissors,
  Grid,
  Zap,
  Box,
  Download,
} from "lucide-react";
import ReportModal from "../components/ReportModal";

const Calculator = ({ onBack }) => {
  const [reportOpen, setReportOpen] = useState(false);

  const reportColumns = [
    {
      header: "Calculation ID",
      accessor: "id",
      render: (val) => (
        <span className="font-black text-cyan-400 uppercase tracking-widest">
          {val}
        </span>
      ),
    },
    {
      header: "Style Detail",
      accessor: "style",
      render: (val, row) => (
        <div>
          <div className="text-sm font-black text-white">{val}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase">
            {row.buyer} - {row.qty} Units
          </div>
        </div>
      ),
    },
    {
      header: "Fabric",
      accessor: "fabric",
      align: "right",
      render: (val) => (
        <span className="text-xs font-bold text-slate-300">{val} m</span>
      ),
    },
    {
      header: "Trim Pack",
      accessor: "trim",
      align: "right",
      render: (val) => (
        <span className="text-xs font-bold text-slate-300">{val} sets</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      align: "right",
      render: (val) => (
        <span
          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${val === "Approved" ? "bg-emerald-500/10 text-emerald-500" : "bg-cyan-500/10 text-cyan-500"}`}
        >
          {val}
        </span>
      ),
    },
  ];

  const historyData = [
    {
      id: "CALC-001",
      style: "Style_XP_22",
      buyer: "Nike",
      qty: 1200,
      fabric: "1.240",
      trim: 2,
      status: "Approved",
    },
    {
      id: "CALC-002",
      style: "Denim_Jk_01",
      buyer: "Adidas",
      qty: 850,
      fabric: "2.145",
      trim: 4,
      status: "Pending",
    },
  ];

  const [inputs, setInputs] = useState({
    style: "",
    buyer: "",
    markerWidth: 150,
    garmentCount: 50,
    markerLength: 45.5,
    wasteFactor: 3.5,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const results = {
    consumptionPerGarment: (inputs.markerLength / inputs.garmentCount).toFixed(
      3,
    ),
    netConsumption: (
      (inputs.markerLength / inputs.garmentCount) *
      (1 + inputs.wasteFactor / 100)
    ).toFixed(3),
    totalFabricNeeded: (inputs.markerLength * 1.035).toFixed(2),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Consumption Estimations Report"
        data={historyData}
        columns={reportColumns}
        colorClass="cyan"
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
                Cons. <span className="text-cyan-500">Calculator</span>
              </h1>
              <p className="text-slate-500 font-medium tracking-wide">
                Professional Marker Utilization Tool
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all font-bold border border-slate-700">
              <RefreshCcw size={18} />
              Reset
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Save size={18} />
              Save Estimate
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Inputs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg">
                  <Grid size={24} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Style Parameters
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                    Style Name/ID
                  </label>
                  <input
                    name="style"
                    placeholder="Enter Style ID..."
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                    value={inputs.style}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                    Buyer
                  </label>
                  <input
                    name="buyer"
                    placeholder="Select Buyer..."
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                    value={inputs.buyer}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                    Marker Width (cm)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="markerWidth"
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl p-4 text-sm font-black text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                      value={inputs.markerWidth}
                      onChange={handleInputChange}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-[10px] uppercase">
                      CM
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                    Garments per Marker
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="garmentCount"
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl p-4 text-sm font-black text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                      value={inputs.garmentCount}
                      onChange={handleInputChange}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-[10px] uppercase">
                      PCS
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                    Marker Length (m)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="markerLength"
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl p-4 text-sm font-black text-white outline-none focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                      value={inputs.markerLength}
                      onChange={handleInputChange}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-[10px] uppercase">
                      M
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                    Wastage / Endloss (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="wasteFactor"
                      className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm font-black text-cyan-400 outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                      value={inputs.wasteFactor}
                      onChange={handleInputChange}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-600 font-bold text-xs">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-4 text-slate-400">
                <Zap size={20} className="text-yellow-500" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Automatic Marker efficiency integrated
                </span>
              </div>
              <button className="p-2 hover:bg-slate-800 rounded-full transition-all text-slate-600 hover:text-white border border-transparent hover:border-slate-700">
                <FileText size={20} />
              </button>
            </div>
          </div>

          {/* Right Panel: Results */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-cyan-600/20 to-slate-950 border border-cyan-500/20 p-8 rounded-3xl shadow-3xl flex flex-col items-center text-center">
              <div className="p-4 bg-cyan-500 rounded-3xl text-white shadow-[0_0_30px_rgba(6,182,212,0.5)] mb-8">
                <CalcIcon size={48} strokeWidth={2.5} />
              </div>

              <div className="w-full space-y-8">
                <div className="group">
                  <div className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-2 group-hover:tracking-[0.4em] transition-all">
                    Cons. Per Garment
                  </div>
                  <div className="text-5xl font-black text-white tracking-tighter leading-none">
                    {results.consumptionPerGarment}{" "}
                    <span className="text-lg text-slate-500">M</span>
                  </div>
                </div>

                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                    Net Consumption (Incl. Waste)
                  </div>
                  <div className="text-2xl font-black text-white">
                    {results.netConsumption}{" "}
                    <span className="text-xs text-slate-500">M/PCS</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                    <div className="text-2xl font-black text-white italic">
                      {results.totalFabricNeeded}
                    </div>
                    <div className="text-[9px] font-black text-slate-500 uppercase mt-1">
                      Total Mtrs
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                    <div className="text-2xl font-black text-cyan-400">
                      92.4%
                    </div>
                    <div className="text-[9px] font-black text-slate-500 uppercase mt-1">
                      Efficiency
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert("Push to Production Triggered")}
                  className="w-full mt-8 bg-white text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cyan-500 hover:text-white transition-all shadow-xl active:scale-95"
                >
                  Push to Production
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-900/40 rounded-3xl border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <Scissors size={18} className="text-slate-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  History Log
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">Style_XP_22</span>
                  <span className="font-mono text-slate-500">1.240m</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">Denim_Jk_01</span>
                  <span className="font-mono text-slate-500">2.145m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
