import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  Check,
  X,
  Plus,
  MessageCircle,
  ArrowLeft,
  Utensils,
  Coffee,
  Phone,
  FileText,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { Video } from "lucide-react";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";
import { useTranslation } from "../translate/TranslationContext";

const Canteen = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const tabs = [{ id: "all", label: "Canteen Orders", count: 9 }];

  const orders = [
    {
      id: 1,
      name: "Dot Sreynoch",
      gender: "FEMALE",
      phone: "+855 010 223 445",
      department: "Production",
      menu: "Rice with Chicken",
      status: "COMPLETED", // Retained from original
      type: "BREAKFAST", // Retained from original
      date: "2026-02-18",
      photo: "/assets/Yaikh-Uploads/H01_00004155_20251224132344.jpeg",
    },
    {
      id: 2,
      name: "Koem Phanny",
      gender: "FEMALE",
      phone: "+855 012 334 556",
      department: "Logistics",
      menu: "Beef Noodle Soup",
      status: "COMPLETED", // Retained from original
      type: "BREAKFAST", // Retained from original
      date: "2026-02-18",
      photo: "/assets/Yaikh-Uploads/H01_00004163_20260110104202.jpeg",
    },
    {
      id: 3,
      name: "Sin Khun",
      gender: "MALE",
      phone: "+855 015 445 667",
      department: "Engineering",
      menu: "Fried Chicken Rice",
      status: "PENDING", // Retained from original
      type: "LUNCH", // Retained from original
      date: "2026-02-18",
      photo: "/assets/Yaikh-Uploads/H01_00004171_20260108143914.jpeg",
    },
    {
      id: 4,
      name: "Voun Samnang",
      gender: "MALE",
      phone: "+855 099 556 778",
      department: "HR",
      menu: "Fish Soup",
      status: "COMPLETED", // Retained from original
      type: "LUNCH", // Retained from original
      date: "2026-02-18",
      photo: "/assets/Yaikh-Uploads/H01_00004177_20260112101013.jpeg",
    },
    {
      id: 5,
      name: "Set Sophy",
      gender: "FEMALE",
      phone: "+855 088 667 889",
      department: "Operations",
      menu: "Vegetable Stir Fry",
      status: "COMPLETED", // Retained from original
      type: "EXPAT", // Retained from original
      date: "2026-02-18",
      photo: "/assets/Yaikh-Uploads/H01_00004193_20260110100532.jpeg",
    },
    {
      id: 6,
      name: "Ton Sreyneang",
      gender: "FEMALE",
      phone: "+855 081 223 998",
      department: "Production",
      menu: "Pork Stew",
      status: "COMPLETED", // Retained from original
      type: "BREAKFAST", // Retained from original
      date: "2026-02-18",
      photo: "/assets/Yaikh-Uploads/H01_00004198_20251215163335.jpeg",
    },
    {
      id: 7,
      name: "Proeurng Sokhim",
      gender: "MALE",
      phone: "+855 092 556 887",
      department: "Marketing",
      menu: "Chicken Salad",
      status: "PENDING", // Retained from original
      type: "LUNCH", // Retained from original
      date: "2026-02-18",
      photo: "/assets/Yaikh-Uploads/H01_00004199_20260110100611.jpeg",
    },
    {
      id: 8,
      name: "Sobon Sreypich",
      gender: "FEMALE",
      phone: "+855 010 778 334",
      department: "Engineering",
      menu: "Beef Loc Lac",
      status: "COMPLETED", // Retained from original
      type: "LUNCH", // Retained from original
      date: "2026-02-18",
      photo: "/assets/Yaikh-Uploads/H01_00004202_20260110100639.jpeg",
    },
    {
      id: 9,
      name: "Yeom Chetra",
      gender: "MALE",
      phone: "+855 012 889 001",
      department: "Production",
      menu: "Rice with Pork",
      status: "COMPLETED", // Retained from original
      type: "LUNCH", // Retained from original
      date: "2026-02-18",
      photo: "/assets/Yaikh-Uploads/H01_00004203_20250903122655.jpeg",
    },
  ];

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const handleAction = (type, order) => {
    setSelectedOrder(order);
    if (type === "View") setShowDetailModal(true);
    else if (type === "Edit") setShowEditModal(true);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-[50] font-sans text-slate-900 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 bg-white">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-600 border border-slate-100 shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">
              Canteen Management
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setSelectedVideo(
                  "/assets/short-video-training/new-updated-vd/YHR.mp4",
                )
              }
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300 bg-white"
              title="Video Training"
            >
              <Video size={18} className="text-blue-600" />
            </button>
            <button
              onClick={() =>
                setSelectedDocument("/assets/report-training/yhr-report.xlsx")
              }
              className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300 bg-white"
              title="Report Training"
            >
              <FileText size={18} className="text-blue-600" />
            </button>
            <button className="px-6 py-2.5 bg-cyan-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-cyan-700 shadow-lg shadow-cyan-100 transition-all flex items-center gap-2">
              New Meal Order
            </button>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="px-8 py-4 bg-white border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 -mb-4 transition-all relative ${activeTab === tab.id ? "text-cyan-600 font-black" : "text-slate-400 font-bold hover:text-slate-600"}`}
              >
                <span className="text-xs uppercase tracking-widest">
                  {tab.label}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === tab.id ? "bg-cyan-50 text-cyan-600" : "bg-slate-50 text-slate-400"}`}
                >
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-600 rounded-full animate-in slide-in-from-bottom-2"></div>
                )}
              </button>
            ))}
          </div>
          <div className="relative group w-72">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-600 transition-colors"
            />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-cyan-100 focus:ring-4 focus:ring-cyan-500/5 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto px-8 pb-8">
          <div className="bg-white border-t border-l border-black shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-[16px] font-bold text-white uppercase tracking-widest sticky top-0 z-10">
                  <th className="px-6 py-4 border-r border-b border-black text-center w-20">
                    Photo
                  </th>
                  <th className="px-6 py-4 border-r border-b border-black">
                    Employee / Contact
                  </th>
                  <th className="px-6 py-4 border-r border-b border-black">
                    Meal Item
                  </th>
                  <th className="px-6 py-4 border-r border-b border-black text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 border-r border-b border-black text-center">
                    Meal Type
                  </th>
                  <th className="px-6 py-4 border-r border-b border-black">
                    Order Date
                  </th>
                  <th className="px-6 py-4 border-b border-black text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((rec) => (
                  <tr
                    key={rec.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 border-r border-b border-black text-center">
                      <div className="inline-block relative w-28 h-28 rounded-lg border-2 border-black overflow-hidden shadow-sm">
                        <img
                          src={rec.photo}
                          alt={rec.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-b border-black">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-black text-[18px] tracking-tight">
                          {rec.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[18px] font-bold text-black uppercase">
                          <span>{rec.department}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[18px] font-bold text-black">
                          <Phone size={18} className="text-cyan-400" />
                          <span>{rec.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-b border-black">
                      <div className="font-bold text-black text-[18px] text-center">
                        {rec.meal}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-b border-black text-center">
                      <span
                        className={`px-3 py-1 rounded-md text-[18px] font-black tracking-widest border ${rec.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r border-b border-black text-center">
                      <span className="px-2.5 py-1 bg-white border border-black rounded text-[18px] font-bold text-cyan-600 shadow-sm uppercase">
                        {rec.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r border-b border-black">
                      <div className="font-bold text-black text-[18px]">
                        {rec.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-b border-black">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAction("View", rec)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 text-white rounded text-[18px] font-bold uppercase hover:bg-cyan-700 transition-colors shadow-sm"
                        >
                          <Eye size={18} strokeWidth={3} />
                          View
                        </button>
                        <button
                          onClick={() => handleAction("Edit", rec)}
                          className="px-3 py-1.5 bg-white border border-black text-black rounded text-[18px] font-bold uppercase hover:bg-slate-50 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Detail Modal (Meal Receipt) */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-8 py-6 border-b border-cyan-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shadow-inner">
                  <Utensils size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    Order Receipt
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Canteen meal transaction details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-0">
              <div className="p-8 bg-gradient-to-br from-cyan-50/50 to-slate-50/30 border-b border-slate-100 flex items-center gap-8">
                <div className="relative">
                  <img
                    src={selectedOrder?.photo}
                    className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl"
                    alt=""
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">
                    {selectedOrder?.name}
                  </h2>
                  <div className="flex gap-3">
                    <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest bg-white border border-cyan-100 px-3 py-1 rounded-lg">
                      {selectedOrder?.meal}
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                      {selectedOrder?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 divide-y divide-slate-100">
                <div className="grid grid-cols-3">
                  <div className="p-4 bg-slate-50/30 font-black text-slate-400 text-[9px] uppercase tracking-widest flex items-center">
                    Order Info
                  </div>
                  <div className="col-span-2 p-4">
                    <div className="text-sm font-bold text-slate-700 uppercase">
                      Type: {selectedOrder?.type}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Ordered on: {selectedOrder?.date}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="p-4 bg-slate-50/30 font-black text-slate-400 text-[9px] uppercase tracking-widest flex items-center">
                    Employee
                  </div>
                  <div className="col-span-2 p-4 text-sm font-bold text-slate-500 uppercase">
                    {selectedOrder?.department} Department
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center text-white shadow-lg shadow-cyan-100">
                  <Edit2 size={24} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    Modify Order
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Update meal item or status
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-0">
              <div className="grid grid-cols-1 divide-y divide-slate-100 border-b border-slate-100">
                <div className="grid grid-cols-3">
                  <div className="p-5 bg-slate-50/50 flex items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Meal Selection
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <input
                      type="text"
                      defaultValue={selectedOrder?.meal}
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="p-5 bg-slate-50/50 flex items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Order Status
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <select
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer"
                      defaultValue={selectedOrder?.status}
                    >
                      <option>COMPLETED</option>
                      <option>PENDING</option>
                      <option>CANCELLED</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Order updated successfully!");
                  setShowEditModal(false);
                }}
                className="px-12 py-4 bg-cyan-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-cyan-700 shadow-xl shadow-cyan-100 transition-all active:scale-95 flex items-center gap-2"
              >
                <Check size={16} strokeWidth={3} />
                Save Order
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-cyan-600 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Canteen"
        />
      )}
      {selectedVideo && (
        <VideoViewer
          videoPath={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
      {selectedDocument && (
        <DocumentViewer
          documentUrl={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default Canteen;
