import React, { useState } from "react";
import {
  Truck,
  Search,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  Activity,
  Shield,
  Download,
} from "lucide-react";
import ReportModal from "../components/ReportModal";

const DeliveryTracking = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  const reportColumns = [
    {
      header: "Tracking ID",
      accessor: "id",
      render: (val) => (
        <span className="font-mono uppercase text-indigo-500">{val}</span>
      ),
    },
    {
      header: "Driver & Vehicle",
      accessor: "driver",
      render: (val, row) => (
        <div>
          <div className="text-sm font-black text-white">{row.vehicle}</div>
          <div className="text-[10px] font-bold text-slate-500">
            {row.driver}
          </div>
        </div>
      ),
    },
    {
      header: "Route",
      accessor: "from",
      render: (val, row) => (
        <div className="text-xs text-slate-300">
          {row.from} &rarr; {row.to}
        </div>
      ),
    },
    { header: "Payload", accessor: "items" },
    {
      header: "ETA",
      accessor: "eta",
      align: "center",
      render: (val) => (
        <span className="text-indigo-400 font-bold italic">{val}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      align: "right",
      render: (val) => (
        <span
          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${val === "In Transit" ? "bg-blue-500/10 text-blue-500" : val === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}
        >
          {val}
        </span>
      ),
    },
  ];

  // Mock data for Delivery Tracking
  const deliveryData = [
    {
      id: "TRK-XP-1",
      driver: "Sokha Ly",
      vehicle: "YM-T77",
      from: "Central WH",
      to: "Plant B (Cutting)",
      items: "Denim Rolls x45",
      eta: "5 Mins",
      status: "In Transit",
    },
    {
      id: "TRK-XP-2",
      driver: "Bora Min",
      vehicle: "YM-W12",
      from: "Central WH",
      to: "Plant A (Sub)",
      items: "Buttons x10 Ctns",
      eta: "Reached",
      status: "Unloading",
    },
    {
      id: "TRK-XP-3",
      driver: "Vichea P.",
      vehicle: "YM-T02",
      from: "Central WH",
      to: "Plant C (Packing)",
      items: "Labels x5 Ctns",
      eta: "15 Mins",
      status: "Dispatched",
    },
    {
      id: "TRK-XP-4",
      driver: "Phally R.",
      vehicle: "YM-V05",
      from: "Supplier",
      to: "Central WH",
      items: "Thread x2,000 Pcs",
      eta: "Arrived",
      status: "Completed",
    },
  ];

  const stats = [
    {
      label: "Active Movements",
      value: "3 Trucks",
      icon: Activity,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Deliveries Today",
      value: "42 Batches",
      icon: Truck,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Avg Transit Time",
      value: "12 Mins",
      icon: Clock,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Incident Reports",
      value: "0",
      icon: Shield,
      color: "text-slate-500",
      bg: "bg-slate-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Delivery Tracking Log"
        data={deliveryData}
        columns={reportColumns}
        colorClass="indigo"
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
                Delivery <span className="text-indigo-500">Tracking</span>
              </h1>
              <p className="text-slate-500 font-medium tracking-wide italic">
                Internal Logistics & Fleet Monitoring
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-2xl"
            >
              <Download size={18} />
              Export Log
            </button>
            <button
              onClick={() => alert("GPS Live Map Activated")}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all font-black uppercase tracking-widest text-xs shadow-2xl"
            >
              <Navigation size={18} />
              GPS Live Map
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 relative group hover:border-indigo-500/30 transition-all"
            >
              <div className="flex justify-between items-center mb-4 relative z-10">
                <div
                  className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform`}
                >
                  <stat.icon size={24} />
                </div>
                <div className="text-2xl font-black text-white italic">
                  {stat.value}
                </div>
              </div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest relative z-10">
                {stat.label}
              </div>
              <div
                className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.02] blur-3xl -mr-8 -mt-8`}
              ></div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-3xl">
          <div className="p-8 border-b border-white/5 flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                <Navigation size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight italic">
                  Fleet Control Center
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Real-time internal logistics feed
                </p>
              </div>
            </div>
            <div className="relative w-full lg:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Driver, Vehicle or Route..."
                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-8">
            {deliveryData.map((row, idx) => (
              <div
                key={idx}
                className="bg-slate-950/50 border border-white/5 rounded-3xl p-6 hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                      {row.id}
                    </span>
                    <span className="text-lg font-black text-white italic tracking-tighter">
                      {row.vehicle}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      row.status === "In Transit"
                        ? "bg-blue-500/10 text-blue-500"
                        : row.status === "Unloading"
                          ? "bg-amber-500/10 text-amber-500"
                          : row.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {row.status}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      {row.from}
                    </div>
                  </div>
                  <div className="w-[1px] h-3 bg-slate-800 ml-[0.25rem]"></div>
                  <div className="flex items-center gap-3">
                    <MapPin size={12} className="text-indigo-500" />
                    <div className="text-xs font-black text-white uppercase tracking-tighter">
                      {row.to}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.03] flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-600 uppercase">
                      Driver
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      {row.driver}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-slate-600 uppercase">
                      ETA
                    </span>
                    <div className="text-xs font-black text-indigo-400 italic">
                      {row.eta}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-slate-950/30 border-t border-white/5 flex items-center justify-between">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              Total Fleet Load: 65% Capacity
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black text-indigo-500 hover:text-white transition-colors uppercase tracking-widest group">
              Open Fleet Analytics
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking;
