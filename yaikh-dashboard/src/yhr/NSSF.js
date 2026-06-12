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
  Shield,
  Activity,
  Phone,
  FileText,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { Video } from "lucide-react";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";
import { useTranslation } from "../translate/TranslationContext";

const NSSF = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [showRegModal, setShowRegModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const tabs = [{ id: "all", label: "NSSF Records", count: 7 }];

  const records = [
    {
      id: 1,
      name: "Dot Sreynoch",
      gender: "FEMALE",
      age: 26,
      phone: "+855 010 223 445",
      department: "Production",
      nssfId: "NS-10223-445",
      status: "ACTIVE",
      type: "EXPAT",
      lastContribution: "Jan 2026",
      photo: "/assets/Yaikh-Uploads/H01_00004155_20251224132344.jpeg",
    },
    {
      id: 2,
      name: "Koem Phanny",
      gender: "FEMALE",
      age: 28,
      phone: "+855 012 334 556",
      department: "Logistics",
      nssfId: "NS-10223-556",
      status: "ACTIVE",
      type: "EXPAT",
      lastContribution: "Jan 2026",
      photo: "/assets/Yaikh-Uploads/H01_00004163_20260110104202.jpeg",
    },
    {
      id: 3,
      name: "Sin Khun",
      gender: "MALE",
      age: 30,
      phone: "+855 015 445 667",
      department: "Engineering",
      nssfId: "NS-10223-667",
      status: "PENDING",
      type: "EXPAT",
      lastContribution: "N/A",
      photo: "/assets/Yaikh-Uploads/H01_00004171_20260108143914.jpeg",
    },
    {
      id: 4,
      name: "Voun Samnang",
      gender: "MALE",
      age: 25,
      phone: "+855 099 556 778",
      department: "HR",
      nssfId: "NS-10223-778",
      status: "ACTIVE",
      type: "EXPAT",
      lastContribution: "Jan 2026",
      photo: "/assets/Yaikh-Uploads/H01_00004177_20260112101013.jpeg",
    },
    {
      id: 5,
      name: "Set Sophy",
      gender: "FEMALE",
      age: 27,
      phone: "+855 088 667 889",
      department: "Operations",
      nssfId: "NS-10223-889",
      status: "ACTIVE",
      type: "EXPAT",
      lastContribution: "Jan 2026",
      photo: "/assets/Yaikh-Uploads/H01_00004193_20260110100532.jpeg",
    },
    {
      id: 6,
      name: "Ton Sreyneang",
      gender: "FEMALE",
      age: 32,
      phone: "+855 081 223 998",
      department: "Production",
      nssfId: "NS-10223-998",
      status: "ACTIVE",
      type: "EXPAT",
      lastContribution: "Jan 2026",
      photo: "/assets/Yaikh-Uploads/H01_00004198_20251215163335.jpeg",
    },
    {
      id: 7,
      name: "Proeurng Sokhim",
      gender: "MALE",
      age: 24,
      phone: "+855 092 556 887",
      department: "Marketing",
      nssfId: "NS-10223-887",
      status: "ACTIVE",
      type: "EXPAT",
      lastContribution: "Jan 2026",
      photo: "/assets/Yaikh-Uploads/H01_00004199_20260110100611.jpeg",
    },
  ];

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const handleAction = (type, record) => {
    setSelectedRecord(record);
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
              NSSF Management
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
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="px-8 py-4 bg-white border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 -mb-4 transition-all relative ${activeTab === tab.id ? "text-teal-600 font-black" : "text-slate-400 font-bold hover:text-slate-600"}`}
              >
                <span className="text-xs uppercase tracking-widest">
                  {tab.label}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === tab.id ? "bg-teal-50 text-teal-600" : "bg-slate-50 text-slate-400"}`}
                >
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 rounded-full animate-in slide-in-from-bottom-2"></div>
                )}
              </button>
            ))}
          </div>
          <div className="relative group w-72">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors"
            />
            <input
              type="text"
              placeholder="Search NSSF..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-teal-100 focus:ring-4 focus:ring-teal-500/5 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto px-8 pb-8">
          <div className="bg-white border-t border-l border-black shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-[11px] font-bold text-white uppercase tracking-widest sticky top-0 z-10">
                  <th className="px-6 py-4 border-r border-b border-black text-center w-20">
                    Photo
                  </th>
                  <th className="px-6 py-4 border-r border-b border-black">
                    Employee / Contact
                  </th>
                  <th className="px-6 py-4 border-r border-b border-black">
                    NSSF ID
                  </th>
                  <th className="px-6 py-4 border-r border-b border-black text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 border-r border-b border-black text-center">
                    Type
                  </th>
                  <th className="px-6 py-4 border-r border-b border-black">
                    Last Contribution
                  </th>
                  <th className="px-6 py-4 border-b border-black text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
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
                        <span className="font-bold text-black text-sm tracking-tight">
                          {rec.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-black uppercase">
                          <span>{rec.department}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-black">
                          <Phone size={10} className="text-teal-400" />
                          <span>{rec.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-b border-black">
                      <div className="bg-slate-50 px-3 py-1.5 rounded border border-black inline-flex">
                        <span className="font-bold text-black text-[10px] tracking-widest uppercase">
                          {rec.nssfId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-b border-black text-center">
                      <span
                        className={`px-3 py-1 rounded-md text-[9px] font-black tracking-widest border ${rec.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r border-b border-black text-center">
                      <span className="px-2 py-0.5 bg-white border border-black rounded text-[9px] font-bold text-teal-600 uppercase">
                        {rec.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r border-b border-black">
                      <div className="font-bold text-black text-xs">
                        {rec.lastContribution}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-black">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAction("View", rec)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded text-[9px] font-bold uppercase hover:bg-teal-700 transition-colors shadow-sm"
                        >
                          <Eye size={10} strokeWidth={3} />
                          View
                        </button>
                        <button
                          onClick={() => handleAction("Edit", rec)}
                          className="px-3 py-1.5 bg-white border border-black text-black rounded text-[9px] font-bold uppercase hover:bg-slate-50 transition-colors"
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

      {/* View Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-8 py-6 border-b border-teal-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-inner">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    NSSF Profile
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Social Security Record Details
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
              <div className="p-8 bg-gradient-to-br from-teal-50/50 to-slate-50/30 border-b border-slate-100 flex items-center gap-8">
                <div className="relative">
                  <img
                    src={selectedRecord?.photo}
                    className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl"
                    alt=""
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">
                    {selectedRecord?.name}
                  </h2>
                  <div className="flex gap-3">
                    <span className="text-[9px] font-black text-teal-600 uppercase tracking-[0.15em] bg-white border border-teal-100 px-3 py-1 rounded-lg">
                      {selectedRecord?.status}
                    </span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] bg-white border border-slate-100 px-3 py-1 rounded-lg">
                      {selectedRecord?.nssfId}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 divide-y divide-slate-100">
                <div className="grid grid-cols-3">
                  <div className="p-4 bg-slate-50/30 font-black text-slate-400 text-[9px] uppercase tracking-widest flex items-center">
                    Employment
                  </div>
                  <div className="col-span-2 p-4 text-sm font-bold text-slate-700 uppercase">
                    {selectedRecord?.department} Department
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="p-4 bg-slate-50/30 font-black text-slate-400 text-[9px] uppercase tracking-widest flex items-center">
                    Contact
                  </div>
                  <div className="col-span-2 p-4 text-sm font-bold text-slate-500">
                    {selectedRecord?.phone}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                Close Record
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
                <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-100">
                  <Edit2 size={24} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    Update NSSF Record
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Modify social security information
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
                      NSSF ID Number
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <input
                      type="text"
                      defaultValue={selectedRecord?.nssfId}
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="p-5 bg-slate-50/50 flex items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Membership Status
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <select
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer"
                      defaultValue={selectedRecord?.status}
                    >
                      <option>ACTIVE</option>
                      <option>PENDING</option>
                      <option>INACTIVE</option>
                      <option>SUSPENDED</option>
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
                  alert("Changes saved successfully!");
                  setShowEditModal(false);
                }}
                className="px-10 py-4 bg-teal-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-teal-700 shadow-xl shadow-teal-100 transition-all active:scale-95 flex items-center gap-2"
              >
                <Check size={16} strokeWidth={3} />
                Update Record
              </button>
            </div>
          </div>
        </div>
      )}
      {showRegModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-100">
                  <Shield size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    NSSF Registration
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Enroll employee into social security fund
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRegModal(false)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-0">
              <div className="border-b border-slate-100">
                <div className="grid grid-cols-1 divide-y divide-slate-100">
                  <div className="grid grid-cols-3">
                    <div className="p-4 bg-slate-50/50 flex items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Employee Name
                      </label>
                    </div>
                    <div className="col-span-2 p-4">
                      <select className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer">
                        <option value="">Search employee...</option>
                        {records.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="p-4 bg-slate-50/50 flex items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        NSSF ID Number
                      </label>
                    </div>
                    <div className="col-span-2 p-4">
                      <input
                        type="text"
                        placeholder="NS-00000-000"
                        className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="p-4 bg-slate-50/50 flex items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Registration Date
                      </label>
                    </div>
                    <div className="col-span-2 p-4">
                      <input
                        type="date"
                        className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="p-4 bg-slate-50/50 flex items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Card Type
                      </label>
                    </div>
                    <div className="col-span-2 p-4">
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="cardType"
                            className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                            defaultChecked
                          />
                          <span className="text-xs font-bold text-slate-600 group-hover:text-teal-600 transition-colors uppercase">
                            Health & Injury
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="cardType"
                            className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300"
                          />
                          <span className="text-xs font-bold text-slate-600 group-hover:text-teal-600 transition-colors uppercase">
                            Pension Only
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex items-center justify-end gap-4">
              <button
                onClick={() => setShowRegModal(false)}
                className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Member registered successfully!");
                  setShowRegModal(false);
                }}
                className="px-10 py-3 bg-teal-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-teal-700 shadow-xl shadow-teal-100 transition-all active:scale-95 flex items-center gap-2"
              >
                <Check size={16} strokeWidth={3} />
                Submit Registration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Bot */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-teal-600 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="NSSF"
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

export default NSSF;
