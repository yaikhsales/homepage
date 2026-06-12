import React, { useState } from "react";
import {
  Search,
  Map,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
  Grid,
  Layers,
  Box,
  Hash,
} from "lucide-react";
import ReportModal from "../components/ReportModal";

const WarehouseTracking = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  const reportColumns = [
    {
      header: "Location",
      accessor: "zone",
      render: (val, row) => (
        <div>
          <div className="text-sm font-black text-white">
            {row.zone} / {row.aisle}
          </div>
          <div className="text-[10px] font-bold text-slate-600 font-mono uppercase">
            Rack: {row.rack} | Lvl: {row.level}
          </div>
        </div>
      ),
    },
    {
      header: "Stashed Item",
      accessor: "item",
      render: (val) => (
        <span className="text-sm font-bold text-slate-200 uppercase">
          {val}
        </span>
      ),
    },
    {
      header: "Quantity Info",
      accessor: "rolls",
      align: "center",
      render: (val, row) => (
        <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-black text-white border border-slate-700">
          {row.rolls || row.cartons} {row.rolls ? "Rolls" : "Ctns"}
        </span>
      ),
    },
    {
      header: "Storage Load",
      accessor: "capacity",
      render: (val) => (
        <div
          className={`text-[10px] font-black font-mono ${parseInt(val) > 80 ? "text-amber-500" : "text-slate-400"}`}
        >
          {val}
        </div>
      ),
    },
  ];

  // Mock data for Warehouse Tracking
  const warehouseData = [
    {
      zone: "Zone A",
      aisle: "A-01",
      rack: "R-04",
      level: "L-01",
      item: "Cotton Denim Blue",
      rolls: 15,
      capacity: "85%",
    },
    {
      zone: "Zone A",
      aisle: "A-02",
      rack: "R-02",
      level: "L-03",
      item: "Silk Satin Black",
      rolls: 8,
      capacity: "40%",
    },
    {
      zone: "Zone B",
      aisle: "B-05",
      rack: "R-10",
      level: "L-02",
      item: "Polyester Thread",
      cartons: 45,
      capacity: "95%",
    },
    {
      zone: "Zone C",
      aisle: "C-01",
      rack: "R-01",
      level: "L-04",
      item: "Elastic Trim 20mm",
      cartons: 12,
      capacity: "25%",
    },
    {
      zone: "Zone D",
      aisle: "D-03",
      rack: "R-08",
      level: "L-01",
      item: "Main Brand Labels",
      cartons: 5,
      capacity: "15%",
    },
  ];

  const zones = [
    {
      name: "ZONE A",
      type: "Fabric Bulk",
      items: "450 Rolls",
      color: "bg-blue-500",
    },
    {
      name: "ZONE B",
      type: "Accessories",
      items: "1,200 Ctns",
      color: "bg-emerald-500",
    },
    {
      name: "ZONE C",
      type: "Trims/Labels",
      items: "85 Boxes",
      color: "bg-purple-500",
    },
    {
      name: "ZONE D",
      type: "Returns/Holding",
      items: "12 Rolls",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Warehouse Inventory Report"
        data={warehouseData}
        columns={reportColumns}
        colorClass="blue"
      />
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
                Warehouse <span className="text-blue-500">Tracking</span>
              </h1>
              <p className="text-slate-500 font-medium tracking-wide italic">
                Real-time Bin Location Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center bg-slate-900/50 p-1 rounded-xl border border-white/5 shadow-xl">
            <button
              onClick={() => setReportOpen(true)}
              className="px-4 py-2 bg-slate-800 text-white mr-2 hover:bg-slate-700 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg transition-all"
            >
              Summary Report
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg">
              List View
            </button>
            <button
              onClick={() => alert("Map View Coming Soon")}
              className="px-4 py-2 text-slate-500 hover:text-slate-300 transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-2"
            >
              <Map size={14} />
              Map View
            </button>
          </div>
        </div>

        {/* Zone Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {zones.map((zone, idx) => (
            <div
              key={idx}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all cursor-pointer shadow-lg hover:shadow-blue-500/5"
            >
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    {zone.type}
                  </div>
                  <div className="text-xl font-black text-white">
                    {zone.name}
                  </div>
                  <div className="text-sm font-bold text-slate-400 mt-2">
                    {zone.items}
                  </div>
                </div>
                <div
                  className={`p-2 rounded-lg ${zone.color} text-white shadow-lg`}
                >
                  <Grid size={18} />
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative z-10">
                <div
                  className={`h-full ${zone.color} w-3/4 shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                ></div>
              </div>
              <div
                className={`absolute top-0 right-0 w-24 h-24 ${zone.color} opacity-[0.03] blur-3xl -mr-10 -mt-10 group-hover:opacity-[0.08] transition-opacity`}
              ></div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden shadow-3xl">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Inventory Map List
                </h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  Filter by Zone or Aisle
                </p>
              </div>
            </div>
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search Location, SKU or Item..."
                className="w-full bg-slate-950/80 border border-slate-700/50 rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-blue-500 text-white shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/30 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                  <th className="p-6">Location</th>
                  <th className="p-6">Stashed Item</th>
                  <th className="p-6 text-center">Quantity Info</th>
                  <th className="p-6">Storage Load</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {warehouseData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-all group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all border border-transparent group-hover:border-blue-500/20">
                          <Layers size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-black text-white">
                            {row.zone} / {row.aisle}
                          </div>
                          <div className="text-[10px] font-bold text-slate-600 font-mono mt-0.5 uppercase tracking-tighter">
                            Rack: {row.rack} | Lvl: {row.level}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm font-bold text-slate-200 group-hover:text-blue-300 transition-colors uppercase tracking-tight">
                        {row.item}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="px-3 py-1 bg-slate-900 rounded-lg text-xs font-black text-white border border-slate-700/50 shadow-inner">
                        {row.rolls || row.cartons}{" "}
                        {row.rolls ? "Rolls" : "Ctns"}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className={`h-full rounded-full ${parseInt(row.capacity) > 80 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" : "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]"}`}
                            style={{ width: row.capacity }}
                          ></div>
                        </div>
                        <span
                          className={`text-[10px] font-black font-mono ${parseInt(row.capacity) > 80 ? "text-amber-500" : "text-slate-400"}`}
                        >
                          {row.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <button className="p-2.5 hover:bg-slate-800 rounded-xl transition-all text-slate-500 hover:text-white border border-transparent hover:border-slate-700 shadow-sm">
                        <ChevronRight size={20} />
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

export default WarehouseTracking;
