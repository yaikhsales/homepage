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
  DollarSign,
  Briefcase,
  Phone,
  FileText,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { Video } from "lucide-react";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";
import { useTranslation } from "../translate/TranslationContext";

const Payroll = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const tabs = [{ id: "all", label: "Payroll Records", count: 8 }];

  const records = [
    {
      id: 1,
      name: "Dot Sreynoch",
      gender: "FEMALE",
      age: 26,
      phone: "+855 010 223 445",
      department: "Production",
      position: "QA Engineer",
      status: "PAID",
      salary: "$850.00",
      type: "Staff",
      date: "Jan 31, 2026",
      photo: "/assets/Yaikh-Uploads/H01_00004155_20251224132344.jpeg",
    },
    {
      id: 2,
      name: "Koem Phanny",
      gender: "FEMALE",
      age: 28,
      phone: "+855 012 334 556",
      department: "Logistics",
      position: "Coordinator",
      status: "PAID",
      salary: "$920.00",
      type: "Staff",
      date: "Jan 31, 2026",
      photo: "/assets/Yaikh-Uploads/H01_00004163_20260110104202.jpeg",
    },
    {
      id: 3,
      name: "Sin Khun",
      gender: "MALE",
      age: 30,
      phone: "+855 015 445 667",
      department: "Engineering",
      position: "Developer",
      status: "PENDING",
      salary: "$1,200.00",
      type: "Staff",
      date: "Feb 05, 2026",
      photo: "/assets/Yaikh-Uploads/H01_00004171_20260108143914.jpeg",
    },
    {
      id: 4,
      name: "Voun Samnang",
      gender: "MALE",
      age: 25,
      phone: "+855 099 556 778",
      department: "Admin",
      position: "Assistant",
      status: "PAID",
      salary: "$780.00",
      type: "Worker",
      date: "Jan 31, 2026",
      photo: "/assets/Yaikh-Uploads/H01_00004177_20260112101013.jpeg",
    },
    {
      id: 5,
      name: "Set Sophy",
      gender: "FEMALE",
      age: 27,
      phone: "+855 088 667 889",
      department: "Operations",
      position: "Manager",
      status: "PAID",
      salary: "$1,150.00",
      type: "Staff",
      date: "Jan 31, 2026",
      photo: "/assets/Yaikh-Uploads/H01_00004193_20260110100532.jpeg",
    },
    {
      id: 6,
      name: "Ton Sreyneang",
      gender: "FEMALE",
      age: 32,
      phone: "+855 081 223 998",
      department: "Production",
      position: "Supervisor",
      salary: "$1,100.00",
      status: "PAID",
      type: "Worker",
      date: "Feb 05, 2026",
      photo: "/assets/Yaikh-Uploads/H01_00004198_20251215163335.jpeg",
    },
    {
      id: 7,
      name: "Proeurng Sokhim",
      gender: "MALE",
      age: 24,
      phone: "+855 092 556 887",
      department: "Marketing",
      position: "Strategist",
      salary: "$1,300.00",
      status: "PAID",
      type: "Staff",
      date: "Feb 05, 2026",
      photo: "/assets/Yaikh-Uploads/H01_00004199_20260110100611.jpeg",
    },
    {
      id: 8,
      name: "Sobon Sreypich",
      gender: "FEMALE",
      age: 29,
      phone: "+855 010 778 334",
      department: "Engineering",
      position: "Frontend Lead",
      salary: "$2,200.00",
      status: "PAID",
      type: "Worker",
      date: "Feb 05, 2026",
      photo: "/assets/Yaikh-Uploads/H01_00004202_20260110100639.jpeg",
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
              Payroll Management
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
            <button className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-amber-600 shadow-lg shadow-amber-100 transition-all flex items-center gap-2">
              Generate Payroll
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
                className={`flex items-center gap-2 pb-4 -mb-4 transition-all relative ${activeTab === tab.id ? "text-amber-600 font-black" : "text-slate-400 font-bold hover:text-slate-600"}`}
              >
                <span className="text-xs uppercase tracking-widest">
                  {tab.label}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === tab.id ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-400"}`}
                >
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600 rounded-full animate-in slide-in-from-bottom-2"></div>
                )}
              </button>
            ))}
          </div>
          <div className="relative group w-72">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors"
            />
            <input
              type="text"
              placeholder="Search payroll..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-amber-100 focus:ring-4 focus:ring-amber-500/5 transition-all"
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
                    Salary (Net)
                  </th>
                  <th className="px-6 py-4 border-r border-b border-black text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 border-r border-b border-black text-center">
                    Type
                  </th>
                  <th className="px-6 py-4 border-r border-b border-black">
                    Pay Date
                  </th>
                  <th className="px-6 py-4 border-r border-b border-black text-center whitespace-nowrap">
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
                        <span className="font-bold text-black text-[18px] tracking-tight">
                          {rec.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[18px] font-bold text-black">
                          <span>{rec.position}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[18px] font-bold text-black">
                          <Phone size={10} className="text-amber-400" />
                          <span>{rec.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-b border-black">
                      <div className="font-bold text-black text-[18px]">
                        {rec.salary}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-r border-b border-black text-center">
                      <span
                        className={`px-3 py-1 rounded-md text-[18px] font-black tracking-widest border ${rec.status === "PAID" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r border-b border-black text-center">
                      <span className="px-2 py-0.5 bg-white border border-black rounded text-[18px] font-bold text-amber-600 uppercase">
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
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded text-[18px] font-bold uppercase hover:bg-amber-600 transition-colors shadow-sm"
                        >
                          <Eye size={10} strokeWidth={3} />
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

      {/* View Detail Modal (Payslip) */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-8 py-6 border-b border-amber-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    Payslip Preview
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Salary disbursement breakdown
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
              <div className="p-8 bg-gradient-to-br from-amber-50/50 to-slate-50/30 border-b border-slate-100 flex items-center gap-8">
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
                    <span className="text-[12px] font-black text-amber-600 uppercase tracking-widest bg-white border border-amber-100 px-3 py-1 rounded-lg">
                      Net: {selectedRecord?.salary}
                    </span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                      {selectedRecord?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 divide-y divide-slate-100">
                <div className="grid grid-cols-3">
                  <div className="p-4 bg-slate-50/30 font-black text-slate-400 text-[9px] uppercase tracking-widest flex items-center">
                    Payment Details
                  </div>
                  <div className="col-span-2 p-4">
                    <div className="text-sm font-bold text-slate-700 uppercase">
                      Pay Cycle: February 2026
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Disbursement Date: {selectedRecord?.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex justify-end gap-3">
              <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all active:scale-95">
                <FileText size={16} />
                Download PDF
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                Close Payslip
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
                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-100">
                  <Edit2 size={24} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    Adjust Payroll
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Update salary or payment status
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
                      Net Salary
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <input
                      type="text"
                      defaultValue={selectedRecord?.salary}
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="p-5 bg-slate-50/50 flex items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Payment Status
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <select
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer"
                      defaultValue={selectedRecord?.status}
                    >
                      <option>PAID</option>
                      <option>PENDING</option>
                      <option>PROCESSING</option>
                      <option>FAILED</option>
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
                  alert("Payroll updated successfully!");
                  setShowEditModal(false);
                }}
                className="px-12 py-4 bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-amber-600 shadow-xl shadow-amber-100 transition-all active:scale-95 flex items-center gap-2"
              >
                <Check size={16} strokeWidth={3} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-amber-500 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Payroll"
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

export default Payroll;
