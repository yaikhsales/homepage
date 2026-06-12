import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Layers,
  ClipboardList,
  FileText,
  Scissors,
  Settings,
  MoreVertical,
  ChevronDown,
  Layout,
  BarChart3,
  CheckCircle2,
  Package,
  History,
  AlertTriangle,
  Send,
  Video,
} from "lucide-react";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";
import ModuleBotButton from "../components/ModuleBotButton";

const CUTTING_PANEL_VIDEO_PATH =
  "/assets/short-video-training/Cutting-panel.mp4";
const CUTTING_PANEL_REPORT_PATH =
  "/assets/report-training/yhr-report.xlsx";

const CuttingPanel = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("form");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const mockData = [
        { id: 1, buyer: "A & F", style: "6261340003", date: "03/11/2026", qty: 50, status: "Passed", color: "Blue" },
        { id: 2, buyer: "Nike", style: "NK-9920", date: "03/10/2026", qty: 120, status: "Passed", color: "Black" },
        { id: 3, buyer: "Adidas", style: "AD-5512", date: "03/10/2026", qty: 85, status: "Failed", color: "White" },
        { id: 4, buyer: "GAP", style: "GP-1102", date: "03/09/2026", qty: 200, status: "Passed", color: "Green" },
    ];

  const tabs = [
        { id: "form", label: "Cutting Form", icon: ClipboardList },
        { id: "data", label: "Data", icon: BarChart3 },
        { id: "report", label: "Report", icon: FileText },
        { id: "modify", label: "Modify", icon: Settings },
        { id: "adding", label: "Adding", icon: Layout },
        { id: "dr", label: "DR", icon: History },
    ];

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-[50] animate-in fade-in duration-500 overflow-hidden font-sans">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 px-6 py-4 flex items-center justify-between shrink-0 shadow-lg border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3.5 bg-white/20 rounded-xl backdrop-blur-md hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="text-white" size={16} strokeWidth={3} />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Scissors className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-tight">
                Cutting Inspection
              </h1>
              <p className="text-xs font-bold text-white/70">
                Quality Control Data Management
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white/10 p-1.5 rounded-2xl backdrop-blur-sm border border-white/40">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white text-purple-700 shadow-xl scale-105"
                  : "text-white hover:text-white hover:bg-white/10"
              }`}
            >
              <tab.icon
                size={18}
                strokeWidth={activeTab === tab.id ? 2.5 : 2}
              />
              <span className="text-[11px] font-black tracking-tighter">
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 px-4 py-2 bg-black/20 rounded-2xl border border-white/40">
          <button
            onClick={() => setSelectedVideo(CUTTING_PANEL_VIDEO_PATH)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
        >
            <Video size={20} className="text-blue-600" />
        </button>
          <button
            onClick={() => setSelectedDocument(CUTTING_PANEL_REPORT_PATH)}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center"
            title="Report Training"
          >
            <FileText size={18} className="text-white" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center border-2 border-white/20 shadow-inner">
            <span className="text-white font-black text-xs">PS</span>
          </div>
          <div className="text-left">
            <p className="text-xs font-black text-white leading-none">
              Proeurng Sokhim
            </p>
            <p className="text-[10px] font-bold tracking-tighter text-start text-white/80 uppercase mt-1">
              TL18
            </p>
          </div>
        </div>
      </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
                        <div className="p-10 space-y-10">
                            {activeTab === "form" ? (
                                <>
                                    {/* Header Inputs Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 px-1">Date</label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    defaultValue="03/11/2026"
                                                    className="w-full bg-white/80 border border-slate-300 rounded-lg px-5 py-3 font-bold text-slate-700 focus:outline-none focus:border-purple-200 focus:bg-white transition-all group-hover:bg-white"
                                                />
                                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-purple-400" size={18} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 px-1">MO No</label>
                                            <input
                                                type="text"
                                                defaultValue="GPAF6003"
                                                className="w-full bg-white/80 border border-slate-300 rounded-lg px-5 py-3 font-bold text-slate-700 focus:outline-none focus:border-purple-200 focus:bg-white transition-all shadow-sm hover:bg-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 px-1">Table No</label>
                                            <div className="flex items-center bg-white/80 border border-slate-300 rounded-lg px-5 py-3 hover:bg-white transition-all">
                                                <span className="mr-3 text-slate-300"><Layers size={18} /></span>
                                                <input
                                                    type="text"
                                                    defaultValue="T 4"
                                                    className="w-full bg-transparent font-bold text-slate-700 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Details Table */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-3">
                                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                            Order Details
                                        </h3>
                                        <div className="overflow-hidden rounded-lg border border-slate-300 ">
                                            <table className="w-full text-center">
                                                <thead className="bg-slate-50">
                                                    <tr>
                                                        {["Buyer", "Style No", "Color / Style Names", "PO No", "Quantity"].map((h, i, arr) => (
                                                            <th key={h} className={`py-4 px-4 text-sm font-bold text-slate-700 border-b border-slate-300 ${i !== arr.length - 1 ? 'border-r' : ''}`}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-300">
                                                    <tr className="bg-white hover:bg-slate-50/50 transition-colors">
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">A & F</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">6261340003</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">220 WINDWARD BLUE ACID WASH</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">LAT14653A</td>
                                                        <td className="py-5 px-4 border-b border-slate-300 text-xs">
                                                            <p className="font-bold text-slate-700">50</p>
                                                            <p className="text-[10px] font-black text-emerald-500 uppercase mt-0.5">Total: 150</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Fabric Details Table */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-3">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            Fabric Details
                                        </h3>
                                        <div className="overflow-hidden rounded-lg border border-slate-300">
                                            <table className="w-full text-center">
                                                <thead className="bg-slate-50">
                                                    <tr>
                                                        {["Fabric Type", "Material", "Roll Quantity", "Spread Yards", "Unit", "Gross Kgs", "Net Kgs", "Total TTL Roll"].map((h, i, arr) => (
                                                            <th key={h} className={`py-4 px-4 text-sm font-bold text-slate-700 tracking-wider border-b border-slate-300 ${i !== arr.length - 1 ? 'border-r' : ''}`}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-300">
                                                    <tr className="bg-white">
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">A</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">AF=MK1500 RP(FS-Solid)</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">4</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">74.59</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs uppercase border-r border-slate-300 border-b">YDS</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">38.43</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">37.75</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-b border-slate-300">-</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Cutting Table Details */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-3">
                                            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                            Cutting Table Details
                                        </h3>
                                        <div className="overflow-hidden rounded-lg border border-slate-300">
                                            <table className="w-full text-center">
                                                <thead className="bg-slate-50">
                                                    <tr>
                                                        {["Spread Table", "Spread Table No", "Plan Layers", "Actual Layers", "Total Pcs:", "Marker No", "Marker Length"].map((h, i, arr) => (
                                                            <th key={h} className={`py-4 px-4 text-sm font-bold text-slate-700 border-b border-slate-300 ${i !== arr.length - 1 ? 'border-r' : ''}`}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-300">
                                                    <tr className="bg-white">
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">F</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">4</td>
                                                        <td className="py-5 px-4 font-bold text-blue-600 text-xs border-r border-slate-300 border-b">11</td>
                                                        <td className="py-5 px-4 font-bold text-blue-600 text-xs border-r border-slate-300 border-b">11</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">55</td>
                                                        <td className="py-5 px-4 font-bold text-indigo-600 text-xs border-r border-slate-300 border-b">K3</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-b border-slate-300">5.48</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Marker Ratio Table */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-3">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                            Marker Ratio
                                        </h3>
                                        <div className="overflow-hidden rounded-lg border border-slate-300">
                                            <table className="w-full text-center">
                                                <thead className="bg-slate-50">
                                                    <tr>
                                                        {["S", "M", "L", "XL"].map((h, i, arr) => (
                                                            <th key={h} className={`py-4 px-4 text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-300 ${i !== arr.length - 1 ? 'border-r' : ''}`}>{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-300">
                                                    <tr className="bg-white">
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">1</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">2</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-r border-slate-300 border-b">1</td>
                                                        <td className="py-5 px-4 font-bold text-slate-700 text-xs border-b border-slate-300">1</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Bundle Check & Total Inspection */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border border-slate-300 rounded-lg p-6">
                                        <div className="space-y-2 col-span-1">
                                            <label className="text-sm font-bold text-slate-700 px-1">Total Bundle Qty</label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    placeholder="Enter Total Bundle Qty"
                                                    className="w-full bg-white/80 text-xs border border-slate-300 rounded-lg px-5 py-3.5 font-bold text-slate-700 focus:outline-none focus:border-purple-200 focus:bg-white transition-all"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg group-hover:bg-purple-100 transition-colors">
                                                    <Layout size={14} className="text-slate-500 group-hover:text-purple-500"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 col-span-1">
                                            <label className="text-sm font-bold text-slate-700 px-1">Bundle Qty Check</label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    placeholder="Enter Bundle Qty Check"
                                                    className="w-full bg-white/80 text-xs border border-slate-300 rounded-lg px-5 py-3.5 font-bold text-slate-700 focus:outline-none focus:border-purple-200 focus:bg-white transition-all"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg group-hover:bg-purple-100 transition-colors">
                                                    <CheckCircle2 size={14} className="text-slate-500 group-hover:text-purple-500" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 col-span-1">
                                            <label className="text-sm font-bold text-slate-700 px-1">Total Inspection Qty</label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    defaultValue="0"
                                                    className="w-full bg-white/80 text-xs border border-slate-300 rounded-lg px-5 py-3.5 font-bold text-slate-700 focus:outline-none focus:border-purple-200 focus:bg-white transition-all"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-lg group-hover:bg-purple-100 transition-colors">
                                                    <ClipboardList size={14} className="text-slate-500 group-hover:text-purple-500" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 col-span-1">
                                            <label className="text-sm font-bold text-slate-700 px-1">Cutting by</label>
                                            <div className="flex items-center gap-6 py-4">
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center justify-center">
                                                        <input type="checkbox" className="peer sr-only" defaultChecked />
                                                        <div className="w-5 h-5 bg-slate-50 border-2 border-slate-200 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all"></div>
                                                        <CheckCircle2 className="absolute text-white transition-transform scale-0 peer-checked:scale-100" size={14} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600">Auto</span>
                                                </label>
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center justify-center">
                                                        <input type="checkbox" className="peer sr-only" />
                                                        <div className="w-5 h-5 bg-slate-50 border-2 border-slate-200 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all"></div>
                                                        <CheckCircle2 className="absolute text-white transition-transform scale-0 peer-checked:scale-100" size={14} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600">Manual</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-sm font-bold text-slate-700 px-1">
                                        Sampling standard: AQL 1.0
                                    </div>

                                    {/* Form Selects Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border border-slate-300 rounded-lg p-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 px-1">Garment Type</label>
                                            <div className="relative">
                                                <select className="w-full bg-white/80 text-xs border border-slate-300 rounded-lg px-5 py-3.5 font-bold text-slate-700 focus:outline-none focus:border-purple-200 focus:bg-white appearance-none cursor-pointer transition-all">
                                                    <option>Select Panel</option>
                                                    <option>Front Panel</option>
                                                    <option>Back Panel</option>
                                                </select>
                                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 px-1">Size</label>
                                            <div className="relative">
                                                <select className="w-full bg-white/80 text-xs border border-slate-300 rounded-lg px-5 py-3.5 font-bold text-slate-700 focus:outline-none focus:border-purple-200 focus:bg-white appearance-none cursor-pointer transition-all">
                                                    <option>Select Size</option>
                                                    <option>S</option>
                                                    <option>M</option>
                                                    <option>L</option>
                                                    <option>XL</option>
                                                </select>
                                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 px-1">Bundle Qty</label>
                                            <div className="relative">
                                                <select className="w-full bg-white/80 text-xs border border-slate-300 rounded-lg px-5 py-3.5 font-bold text-slate-700 focus:outline-none focus:border-purple-200 focus:bg-white appearance-none cursor-pointer transition-all">
                                                    <option>Select Bundle Qty</option>
                                                    <option>10</option>
                                                    <option>20</option>
                                                    <option>50</option>
                                                </select>
                                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 px-1">Tolerance</label>
                                            <div className="relative">
                                                <select className="w-full bg-white/80 text-xs border border-slate-300 rounded-lg px-5 py-3.5 font-bold text-slate-700 focus:outline-none focus:border-purple-200 focus:bg-white appearance-none cursor-pointer transition-all">
                                                    <option>-1/8, 1/8</option>
                                                    <option>-1/4, 1/4</option>
                                                </select>
                                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-center pt-4">
                                        <button
                                            onClick={handleSubmit}
                                            className={`${isSubmitted ? 'bg-green-500' : 'bg-green-600 hover:bg-green-500'} text-white font-black text-sm uppercase px-6 py-4 rounded-xl transition-all hover:-translate-y-1 flex items-center gap-4 group active:translate-y-0 active:shadow-lg`}
                                        >
                                            {isSubmitted ? "Data Submitted!" : "Submit Data"}
                                            {isSubmitted ? <CheckCircle2 size={18} /> : <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                        </button>
                                    </div>
                                </>
                            ) : activeTab === "data" ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Inspection Records</h3>
                                        <div className="flex bg-slate-100 p-1 rounded-xl">
                                            <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg shadow-sm text-[11px] font-black uppercase transition-all">Today</button>
                                            <button className="px-4 py-2 text-slate-400 text-[11px] font-black uppercase hover:text-slate-600 transition-all">Weekly</button>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl bg-white">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50">
                                                <tr className="border-b border-slate-200">
                                                    {["Buyer / Style", "Color / Size", "Date", "Quantity", "Status", "Action"].map(h => (
                                                        <th key={h} className="px-8 py-5 text-[11px] font-black text-slate-500 uppercase tracking-wider">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {mockData.map(item => (
                                                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-8 py-6">
                                                            <p className="font-black text-slate-800 text-sm">{item.buyer}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{item.style}</p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <p className="font-bold text-slate-600 text-xs">{item.color}</p>
                                                            <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase mt-1 inline-block">M</span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-2 text-slate-500">
                                                                <Calendar size={14} />
                                                                <span className="text-xs font-bold">{item.date}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6 font-black text-slate-800">{item.qty} <span className="text-[10px] text-slate-400">Pcs</span></td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${item.status === 'Passed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                                                                }`}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100">
                                                                <MoreVertical size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : activeTab === "report" ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    {/* Stats Overview */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        {[
                                            { label: "Total Inspected", value: "455", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
                                            { label: "Passed Units", value: "442", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                                            { label: "Failed Units", value: "13", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
                                            { label: "Pass Rate", value: "97.1%", icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50" },
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                                    <stat.icon size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* AQL Status Chart (Visual Representation) */}
                                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl overflow-hidden relative group">
                                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                                <BarChart3 size={120} />
                                            </div>
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                                AQL 1.0 Performance
                                            </h4>

                                            <div className="space-y-6">
                                                {[
                                                    { label: "Fabric Defects", value: 15, color: "bg-blue-500" },
                                                    { label: "Cutting Precision", value: 8, color: "bg-violet-500" },
                                                    { label: "Sizing Consistency", value: 4, color: "bg-emerald-500" },
                                                    { label: "Bundle Accuracy", value: 2, color: "bg-amber-500" },
                                                ].map((item, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <div className="flex justify-between text-[11px] font-black uppercase text-slate-500">
                                                            <span>{item.label}</span>
                                                            <span className="text-slate-900">{item.value}%</span>
                                                        </div>
                                                        <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                                            <div
                                                                className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                                                                style={{ width: `${item.value * 5}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Recent Alerts & Observations */}
                                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                                                Quality Alerts
                                            </h4>
                                            <div className="space-y-4">
                                                {[
                                                    { title: "Shading Issue", desc: "Slight shading variation in Lot LAT14653A", time: "2h ago", type: "warning" },
                                                    { title: "Notch Depth", desc: "Notch depth exceeding tolerance in back panel", time: "5h ago", type: "error" },
                                                    { title: "Marker Shift", desc: "Minor marker shift observed on Table 4", time: "Yesterday", type: "warning" },
                                                ].map((alert, i) => (
                                                    <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                                        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${alert.type === 'error' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'
                                                            }`}>
                                                            <AlertTriangle size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <p className="text-xs font-black text-slate-900 uppercase">{alert.title}</p>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{alert.time}</span>
                                                            </div>
                                                            <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-2">{alert.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="w-full mt-6 py-4 rounded-2xl bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-colors">
                                                View All Observations
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : activeTab === "modify" ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                            <div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Modify Existing Records</h3>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Search and update inspection data</p>
                                            </div>
                                            <div className="relative w-full md:w-72">
                                                <input
                                                    type="text"
                                                    placeholder="Search by MO No / Style..."
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-indigo-300 transition-all"
                                                />
                                                <BarChart3 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {mockData.slice(0, 3).map(item => (
                                                <div key={item.id} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50 transition-all group">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                            <FileText size={20} className="text-indigo-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900">{item.buyer} - {item.style}</p>
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase">{item.date} • {item.color}</p>
                                                        </div>
                                                    </div>
                                                    <button className="px-6 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                                        Edit Record
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : activeTab === "adding" ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl">
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Package size={16} /></span>
                                                Manage Metadata
                                            </h3>
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider px-1">Add New Buyer</label>
                                                    <div className="flex gap-2">
                                                        <input type="text" placeholder="Buyer Name" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold" />
                                                        <button className="px-4 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase">Add</button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider px-1">Add New Style</label>
                                                    <div className="flex gap-2">
                                                        <input type="text" placeholder="Style Number" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold" />
                                                        <button className="px-4 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase">Add</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl">
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Settings size={16} /></span>
                                                Configuration
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    { label: "New Table", icon: Layers },
                                                    { label: "New Size", icon: Layout },
                                                    { label: "Defect Type", icon: AlertTriangle },
                                                    { label: "AQL Level", icon: CheckCircle2 },
                                                ].map((item, i) => (
                                                    <button key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all group">
                                                        <item.icon size={20} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                                                        <span className="text-[10px] font-black text-slate-500 group-hover:text-amber-700 uppercase">{item.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : activeTab === "dr" ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                                            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><History size={16} /></span>
                                            Submission History
                                        </h3>
                                        <div className="relative">
                                            {/* Vertical Line */}
                                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100"></div>

                                            <div className="space-y-10">
                                                {[
                                                    { type: "Submission", user: "Proeurng Sokhim", mo: "GPAF6003", time: "10:30 AM Today", badge: "New" },
                                                    { type: "Modification", user: "Proeurng Sokhim", mo: "NK-9920", time: "09:15 AM Today", badge: "Update" },
                                                    { type: "Submission", user: "TL Supervisor", mo: "AD-5512", time: "Yesterday", badge: "Reviewed" },
                                                    { type: "Submission", user: "Proeurng Sokhim", mo: "GP-1102", time: "Yesterday", badge: "Archive" },
                                                ].map((log, i) => (
                                                    <div key={i} className="relative pl-14 group">
                                                        {/* Dot */}
                                                        <div className="absolute left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-4 border-white shadow-sm z-10 group-hover:scale-125 transition-transform"></div>

                                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                            <div>
                                                                <div className="flex items-center gap-3">
                                                                    <p className="text-xs font-black text-slate-900 uppercase">{log.type}: {log.mo}</p>
                                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-black uppercase rounded-md tracking-tighter">{log.badge}</span>
                                                                </div>
                                                                <p className="text-[11px] font-bold text-slate-500 mt-1">Processed by <span className="text-slate-700">{log.user}</span></p>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{log.time}</p>
                                                                <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all">
                                                                    <FileText size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button className="w-full mt-12 py-4 rounded-2xl border-2 border-dashed border-slate-100 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-400 transition-all">
                                            Load Older Records
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-4">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center animate-pulse">
                                        {React.createElement(tabs.find(t => t.id === activeTab).icon, { size: 32 })}
                                    </div>
                                    <p className="font-black uppercase tracking-[0.3em] text-xs decoration-2 decoration-purple-500/20 underline underline-offset-8">
                                        {tabs.find(t => t.id === activeTab).label} - Module Coming Soon
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {selectedVideo && (
                <VideoViewer
                    videoPath={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}

            {selectedDocument && (
                <DocumentViewer
                    documentPath={selectedDocument}
                    onClose={() => setSelectedDocument(null)}
                />
            )}

            <ModuleBotButton moduleName="YQMS - Cutting Panel" />
        </div>
    );
};

export default CuttingPanel;
