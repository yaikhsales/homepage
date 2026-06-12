import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  Check,
  X,
  Send,
  Calendar,
  Phone,
  FileText,
  User,
  ChevronDown,
  Plus,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { Video } from "lucide-react";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";
import { useTranslation } from "../translate/TranslationContext";

const teamPhotos = [
  "/assets/Yaikh-Uploads/H01_00004155_20251224132344.jpeg",
  "/assets/Yaikh-Uploads/H01_00004163_20260110104202.jpeg",
  "/assets/Yaikh-Uploads/H01_00004171_20260108143914.jpeg",
  "/assets/Yaikh-Uploads/H01_00004177_20260112101013.jpeg",
  "/assets/Yaikh-Uploads/H01_00004193_20260110100532.jpeg",
  "/assets/Yaikh-Uploads/H01_00004198_20251215163335.jpeg",
  "/assets/Yaikh-Uploads/H01_00004199_20260110100611.jpeg",
  "/assets/Yaikh-Uploads/H01_00004202_20260110100639.jpeg",
  "/assets/Yaikh-Uploads/H01_00004203_20250903122655.jpeg",
  "/assets/Yaikh-Uploads/H01_00004216_20260114093811.jpeg",
];

const Onboarding = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("onboarding");
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const tabs = [{ id: "onboarding", label: "Onboarding", count: 2 }];

  const applicants = [
    {
      id: 1,
      name: "Dot Sreynoch",
      gender: "FEMALE",
      age: 26,
      phone: "+855 012 889 001",
      department: "Production",
      position: "Full Stack",
      status: "PHASE 3: ONBOARDING",
      subStatus: "DRAFT CONTRACT",
      type: "Staff",
      date: "Feb 13, 2026",
      time: "02:30 PM",
      photo: "/assets/Yaikh-Uploads/H01_00004155_20251224132344.jpeg",
    },
    {
      id: 2,
      name: "Koem Phanny",
      gender: "FEMALE",
      age: 28,
      phone: "+855 093 112 334",
      department: "HR",
      position: "Specialist",
      status: "PHASE 3: ONBOARDING",
      subStatus: "IT SETUP PENDING",
      type: "Staff",
      date: "Feb 13, 2026",
      time: "03:15 PM",
      photo: "/assets/Yaikh-Uploads/H01_00004163_20260110104202.jpeg",
    },
    {
      id: 3,
      name: "Sin Khun",
      gender: "MALE",
      age: 30,
      phone: "+855 017 667 223",
      department: "Finance",
      position: "Accountant",
      status: "PHASE 3: ONBOARDING",
      subStatus: "ORIENTATION",
      type: "Staff",
      date: "Feb 13, 2026",
      time: "04:30 PM",
      photo: "/assets/Yaikh-Uploads/H01_00004171_20260108143914.jpeg",
    },
    {
      id: 4,
      name: "Voun Samnang",
      gender: "MALE",
      age: 25,
      phone: "+855 085 443 112",
      department: "IT",
      position: "SysAdmin",
      status: "PHASE 3: ONBOARDING",
      subStatus: "SECURITY TRAINING",
      type: "Worker",
      date: "Feb 14, 2026",
      time: "09:00 AM",
      photo: "/assets/Yaikh-Uploads/H01_00004177_20260112101013.jpeg",
    },
    {
      id: 5,
      name: "Set Sophy",
      gender: "FEMALE",
      age: 27,
      phone: "+855 010 223 445",
      department: "Production",
      position: "QA Engineer",
      status: "PHASE 3: ONBOARDING",
      subStatus: "BENEFITS ENROLLMENT",
      type: "Staff",
      date: "Feb 14, 2026",
      time: "10:30 AM",
      photo: "/assets/Yaikh-Uploads/H01_00004193_20260110100532.jpeg",
    },
    {
      id: 6,
      name: "Ton Sreyneang",
      gender: "FEMALE",
      age: 32,
      phone: "+855 012 334 556",
      department: "Logistics",
      position: "Coordinator",
      status: "PHASE 3: ONBOARDING",
      subStatus: "WORKSPACE SETUP",
      type: "Worker",
      date: "Feb 14, 2026",
      time: "02:45 PM",
      photo: "/assets/Yaikh-Uploads/H01_00004198_20251215163335.jpeg",
    },
    {
      id: 7,
      name: "Proeurng Sokhim",
      gender: "MALE",
      age: 24,
      phone: "+855 015 445 667",
      department: "Engineering",
      position: "Developer",
      status: "PHASE 3: ONBOARDING",
      subStatus: "TEAM INTRODUCTION",
      type: "Staff",
      date: "Feb 15, 2026",
      time: "09:15 AM",
      photo: "/assets/Yaikh-Uploads/H01_00004199_20260110100611.jpeg",
    },
    // {
    //   id: 8,
    //   name: "Voun Thida",
    //   gender: "FEMALE",
    //   age: 25,
    //   phone: "+855 099 556 778",
    //   department: "Admin",
    //   position: "Assistant",
    //   status: "PHASE 3: ONBOARDING",
    //   subStatus: "DOCUMENTS PENDING",
    //   type: "EXPAT",
    //   date: "Feb 15, 2026",
    //   time: "11:00 AM",
    //   photo: "/assets/about-us/teams/Voun-Thida.jpeg",
    // },
    // {
    //   id: 9,
    //   name: "Set Sophy",
    //   gender: "FEMALE",
    //   age: 27,
    //   phone: "+855 088 667 889",
    //   department: "Operations",
    //   position: "Manager",
    //   status: "PHASE 3: ONBOARDING",
    //   subStatus: "FINAL CHECKLIST",
    //   type: "EXPAT",
    //   date: "Feb 15, 2026",
    //   time: "01:30 PM",
    //   photo: "/assets/about-us/teams/Set-Sophy.jpg",
    // },
    // {
    //   id: 10,
    //   name: "Ton Noeun",
    //   gender: "MALE",
    //   age: 32,
    //   phone: "+855 077 778 990",
    //   department: "Maintenance",
    //   position: "Technician",
    //   status: "PHASE 3: ONBOARDING",
    //   subStatus: "SAFETY BRIEFING",
    //   type: "EXPAT",
    //   date: "Feb 16, 2026",
    //   time: "10:00 AM",
    //   photo: "/assets/about-us/teams/Ton-Noeun.jpeg",
    // },
  ];

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const handleView = (applicant) => {
    setSelectedApplicant(applicant);
    setShowDetailModal(true);
  };

  const handleEdit = (applicant) => {
    setSelectedApplicant(applicant);
    setShowEditModal(true);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-[50] font-sans text-slate-900 overflow-hidden">
      {/* Main Table Container (Edge-to-Edge) */}
      <div className="flex-1 flex flex-col min-h-0 bg-white">
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Header Action Bar */}
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-6">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-600 border border-slate-100 shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">
                Onboarding
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
              {/* Button Removed */}
            </div>
          </div>

          <div className="flex-1 overflow-auto px-8 pb-8">
            <div className="bg-white border-t border-l border-black shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-[16px] font-bold text-white uppercase tracking-widest sticky top-0 z-10">
                    <th className="px-6 py-4 border-r border-b border-black text-center w-20">
                      Photo
                    </th>
                    <th className="px-6 py-4 border-r border-b border-black">
                      Applicant / Contact
                    </th>
                    <th className="px-6 py-4 border-r border-b border-black">
                      Department
                    </th>
                    <th className="px-6 py-4 border-r border-b border-black text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 border-r border-b border-black text-center">
                      Type
                    </th>
                    <th className="px-6 py-4 border-r border-b border-black">
                      Start Date
                    </th>
                    <th className="px-6 py-4 border-r border-b border-black text-center whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((applicant) => (
                    <tr
                      key={applicant.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 border-r border-b border-black text-center">
                        <div className="inline-block relative w-28 h-28 rounded-lg border-2 border-black overflow-hidden shadow-sm">
                          <img
                            src={applicant.photo}
                            alt={applicant.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-b border-black">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-black text-[18px] tracking-tight">
                            {applicant.name}
                          </span>
                          <div className="flex items-center gap-2 text-[18px] font-bold text-black uppercase">
                            <span>{applicant.age} YRS</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[18px] font-bold text-black">
                            <Phone size={10} className="text-blue-400" />
                            <span>{applicant.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-b border-black">
                        <div className="flex flex-col text-[18px] font-bold text-black">
                          <span>{applicant.department}</span>
                          <span className="text-[18px] font-medium text-black">
                            {applicant.position}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-b border-black">
                        <div className="flex flex-col items-center gap-2 text-center">
                          <span className="text-[18px] font-bold text-black uppercase tracking-widest italic leading-none">
                            {applicant.status}
                          </span>
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[18px] font-black tracking-widest border border-indigo-100">
                            {applicant.subStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-b border-black text-center">
                        <span className="px-2 py-0.5 bg-slate-100 border border-black rounded text-[18px] font-bold text-black uppercase">
                          {applicant.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 border-r border-b border-black">
                        <div className="flex flex-col text-[18px] font-bold text-black">
                          <span>{applicant.date}</span>
                          <span className="text-[18px] text-black uppercase tracking-tighter">
                            {applicant.time}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 border-r border-b border-black">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(applicant)}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-[18px] font-black uppercase hover:bg-blue-700 transition-colors shadow-sm"
                          >
                            <Eye size={12} strokeWidth={3} />
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(applicant)}
                            className="px-4 py-1.5 bg-white border border-black text-black rounded-lg text-[18px] font-black uppercase hover:bg-slate-50 transition-colors"
                          >
                            Edit
                          </button>
                          <div className="flex items-center gap-1 ml-2 border-l border-black pl-3">
                            <button className="p-1.5 text-black hover:text-black hover:bg-white hover:shadow-sm rounded transition-all">
                              <FileText size={14} />
                            </button>
                            <button className="p-1.5 text-black hover:text-blue-600 hover:bg-white hover:shadow-sm rounded transition-all">
                              <Eye size={14} />
                            </button>
                            <button className="p-1.5 text-black hover:text-black hover:bg-white hover:shadow-sm rounded transition-all">
                              <Edit2 size={14} />
                            </button>
                            <button className="p-1.5 text-black hover:text-red-500 hover:bg-white hover:shadow-sm rounded transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* New Hire Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                  <User size={24} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    Register New Hire
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Initialize onboarding process for a candidate
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
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
                        Select Employee
                      </label>
                    </div>
                    <div className="col-span-2 p-4">
                      <select className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer">
                        <option value="">Choose a candidate...</option>
                        {applicants.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} - {a.position}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="p-4 bg-slate-50/50 flex items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Start Date
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
                        Orientation Set
                      </label>
                    </div>
                    <div className="col-span-2 p-4">
                      <select className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer">
                        <option>Batch A (Morning)</option>
                        <option>Batch B (Afternoon)</option>
                        <option>Individual</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3">
                    <div className="p-4 bg-slate-50/50 flex items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Equipment Setup
                      </label>
                    </div>
                    <div className="col-span-2 p-4">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-blue-600"
                          />
                          <span className="text-xs font-bold text-slate-600 uppercase">
                            IT Kit
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-blue-600"
                          />
                          <span className="text-xs font-bold text-slate-600 uppercase">
                            Uniform
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-blue-600"
                          />
                          <span className="text-xs font-bold text-slate-600 uppercase">
                            ID Card
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
                onClick={() => setShowAddModal(false)}
                className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Onboarding initialized!");
                  setShowAddModal(false);
                }}
                className="px-10 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center gap-2"
              >
                <Check size={16} strokeWidth={3} />
                Confirm Onboarding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contract Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">
                    Setup Contract
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Digital Service Agreement
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <img
                  src={selectedApplicant?.photo}
                  alt=""
                  className="w-12 h-12 rounded-xl border-2 border-white shadow-sm"
                />
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tight">
                    {selectedApplicant?.name}
                  </p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Candidate for Probation
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                    Contract Type{" "}
                    <span className="text-slate-200">| លក្ខណៈកិច្ចសន្យា</span>
                  </label>
                  <div className="relative group">
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer group-hover:bg-white">
                      <option>Probation</option>
                      <option>Fixed Term</option>
                      <option>Permanent</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                    Template Language{" "}
                    <span className="text-slate-200">| ភាសាកិច្ចសន្យា</span>
                  </label>
                  <div className="relative group">
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer group-hover:bg-white">
                      <option>Khmer (Official)</option>
                      <option>English</option>
                      <option>Bilingual (KH/EN)</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                    Official Position{" "}
                    <span className="text-slate-200">| មុខតំណែងផ្លូវការ</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="Software Engineer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowSetupModal(false)}
                  className="px-6 py-3 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors tracking-widest"
                >
                  Cancel
                </button>
                <button className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95">
                  Confirm Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    Onboarding File
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    New hire integration status
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
              <div className="p-8 bg-gradient-to-br from-indigo-50/50 to-slate-50/30 border-b border-slate-100 flex items-center gap-8">
                <div className="relative">
                  <img
                    src={selectedApplicant?.photo}
                    className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl"
                    alt=""
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-md flex items-center justify-center border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">
                    {selectedApplicant?.name}
                  </h2>
                  <div className="flex gap-3">
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.15em] bg-white border border-indigo-100 px-3 py-1 rounded-lg">
                      {selectedApplicant?.subStatus}
                    </span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] bg-white border border-slate-100 px-3 py-1 rounded-lg">
                      {selectedApplicant?.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 divide-y divide-slate-100">
                <div className="grid grid-cols-3">
                  <div className="p-4 bg-slate-50/30 font-black text-slate-400 text-[9px] uppercase tracking-widest flex items-center">
                    Employment
                  </div>
                  <div className="col-span-2 p-4">
                    <div className="text-sm font-bold text-slate-700 uppercase">
                      {selectedApplicant?.position}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {selectedApplicant?.department} Department
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="p-4 bg-slate-50/30 font-black text-slate-400 text-[9px] uppercase tracking-widest flex items-center">
                    Checklist
                  </div>
                  <div className="col-span-2 p-4 flex gap-3">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      <Check size={10} /> IT Setup
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                      Pending: NSSF
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                  <Edit2 size={24} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    Update Progress
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Manage onboarding milestones
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
                      Current Phase
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <select
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer"
                      defaultValue={selectedApplicant?.subStatus}
                    >
                      <option>Document Verification</option>
                      <option>IT Setup Pending</option>
                      <option>Orientation</option>
                      <option>Security Training</option>
                      <option>Benefits Enrollment</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="p-5 bg-slate-50/50 flex items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Next Step
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <input
                      type="text"
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                      placeholder="e.g. Health Check-up"
                    />
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
                  alert("Progress updated successfully!");
                  setShowEditModal(false);
                }}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center gap-2"
              >
                <Check size={16} strokeWidth={3} />
                Save Progress
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Onboarding"
        />
      )}

      <style jsx>{`
        .scroller-hide::-webkit-scrollbar {
          display: none;
        }
        .scroller-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
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

export default Onboarding;
