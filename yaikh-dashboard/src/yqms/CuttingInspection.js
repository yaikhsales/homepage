import BundlePadInspector from "./BundlePadInspector";
import CuttingFormTablet from "./CuttingFormTablet";
import React, { useState } from "react";
import {
  ArrowLeft,
  Scissors,
  Search,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Settings,
  Eye,
  TrendingUp,
  Clock,
  LayoutGrid,
  ChevronRight,
  Maximize2,
  Minimize2,
  MoreVertical,
  Activity,
} from "lucide-react";
import { useTranslation } from "../translate/TranslationContext";

const CuttingInspection = ({ onBack, embeddedPad=false, onRecord }) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState("grid");

  const bundles = [
    {
      id: "BND-501",
      style: "STY-1015",
      part: "Front Panel",
      size: "M",
      qty: 50,
      defects: 0,
      status: "CLEAR",
      marker: "M-101",
      table: "04",
    },
    {
      id: "BND-502",
      style: "STY-1015",
      part: "Back Panel",
      size: "M",
      qty: 50,
      defects: 1,
      status: "FLAGGED",
      marker: "M-101",
      table: "04",
    },
    {
      id: "BND-503",
      style: "STY-7497",
      part: "Sleeve",
      size: "L",
      qty: 40,
      defects: 0,
      status: "CLEAR",
      marker: "M-205",
      table: "02",
    },
    {
      id: "BND-504",
      style: "STY-7497",
      part: "Collar",
      size: "L",
      qty: 40,
      defects: 0,
      status: "CLEAR",
      marker: "M-205",
      table: "02",
    },
    {
      id: "BND-505",
      style: "STY-7495",
      part: "Body",
      size: "S",
      qty: 60,
      defects: 3,
      status: "REJECT",
      marker: "M-309",
      table: "01",
    },
  ];

  if(embeddedPad)return <CuttingFormTablet label="Bundle Inspection"><BundlePadInspector initialBundles={bundles} onRecord={onRecord}/></CuttingFormTablet>;
  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-[50] animate-in fade-in duration-500 overflow-hidden font-sans">
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
              Cutting Inspection
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Cutting Room / Bundle Inspection Logic
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 px-6 border-x border-slate-100 h-10">
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase">
                Marker Accuracy
              </span>
              <span className="text-xs font-black text-emerald-600">99.8%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase">
                Cut Waste
              </span>
              <span className="text-xs font-black text-blue-600">1.2%</span>
            </div>
          </div>
          <button className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all border border-slate-200">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
        <CuttingFormTablet label="Bundle Inspection">
        <BundlePadInspector initialBundles={bundles} />
        </CuttingFormTablet>
      </div>
    </div>
  );
};

export default CuttingInspection;
