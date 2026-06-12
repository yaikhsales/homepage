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

const Recruitment = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "MALE",
    age: "",
    phone: "",
    department: "",
    position: "",
    type: "EXPAT",
  });

  const tabs = [{ id: "all", label: "Applicants", count: 4 }];

  const [applicantsList, setApplicantsList] = useState([
    {
      id: 1,
      name: "Dot Sreynoch",
      gender: "FEMALE",
      age: 26,
      phone: "+855 010 223 445",
      department: "Production",
      position: "QA Engineer",
      status: "PHASE 1: REVIEW",
      subStatus: "NEW APPLICANT",
      type: "Staff",
      date: "Feb 13, 2026",
      time: "09:30 AM",
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
      status: "PHASE 1: REVIEW",
      subStatus: "UNDER REVIEW",
      type: "Staff",
      date: "Feb 13, 2026",
      time: "10:15 AM",
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
      status: "PHASE 1: REVIEW",
      subStatus: "NEW APPLICANT",
      type: "Staff",
      date: "Feb 13, 2026",
      time: "11:00 AM",
      photo: "/assets/Yaikh-Uploads/H01_00004171_20260108143914.jpeg",
    },
    {
      id: 4,
      name: "Voun Samnang",
      gender: "MALE",
      age: 25,
      phone: "+855 099 556 778",
      department: "HR",
      position: "Assistant",
      status: "PHASE 1: REVIEW",
      subStatus: "NEW APPLICANT",
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
      phone: "+855 088 667 889",
      department: "Operations",
      position: "Manager",
      status: "PHASE 1: REVIEW",
      subStatus: "UNDER REVIEW",
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
      phone: "+855 081 223 998",
      department: "Production",
      position: "Supervisor",
      status: "PHASE 1: REVIEW",
      subStatus: "NEW APPLICANT",
      type: "Worker",
      date: "Feb 15, 2026",
      time: "01:45 PM",
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
      status: "PHASE 1: REVIEW",
      subStatus: "NEW APPLICANT",
      type: "Staff",
      date: "Feb 15, 2026",
      time: "03:15 PM",
      photo: "/assets/Yaikh-Uploads/H01_00004199_20260110100611.jpeg",
    },
    {
      id: 8,
      name: "Sobon Sreypich",
      gender: "FEMALE",
      age: 29,
      phone: "+855 010 778 334",
      department: "Engineering",
      position: "Frontend",
      status: "PHASE 1: REVIEW",
      subStatus: "NEW APPLICANT",
      type: "Worker",
      date: "Feb 16, 2026",
      time: "09:30 AM",
      photo: "/assets/Yaikh-Uploads/H01_00004202_20260110100639.jpeg",
    },
    {
      id: 9,
      name: "Van Phanith",
      gender: "MALE",
      age: 27,
      phone: "+855 011 222 333",
      department: "Design",
      position: "Junior UI",
      status: "PHASE 1: REVIEW",
      subStatus: "NEW APPLICANT",
      type: "Staff",
      date: "Feb 16, 2026",
      time: "11:45 AM",
      photo: "/assets/Yaikh-Uploads/H01_00004203_20250903122655.jpeg",
    },
    {
      id: 10,
      name: "Yeom Sreysros",
      gender: "FEMALE",
      age: 31,
      phone: "+855 077 778 990",
      department: "Maintenance",
      position: "Technician",
      status: "PHASE 1: REVIEW",
      subStatus: "NEW APPLICANT",
      type: "Worker",
      date: "Feb 16, 2026",
      time: "02:30 PM",
      photo: "/assets/Yaikh-Uploads/H01_00004216_20260114093811.jpeg",
    },
    {
      id: 11,
      name: "Young Sengheang",
      gender: "MALE",
      age: 29,
      phone: "+855 093 112 334",
      department: "Production",
      position: "Supervisor",
      status: "PHASE 2: INTERVIEW",
      subStatus: "DEPT INTERVIEW",
      type: "Staff",
      date: "Feb 10, 2026",
      time: "02:30 PM",
      photo: "/assets/Yaikh-Uploads/H01_00004219_20260114093834.jpeg",
    },
    // {
    //   id: 12,
    //   name: "Virot",
    //   gender: "MALE",
    //   age: 33,
    //   phone: "+855 012 777 888",
    //   department: "Engineering",
    //   position: "Senior Dev",
    //   status: "PHASE 1: REVIEW",
    //   subStatus: "REJECTED",
    //   type: "EXPAT",
    //   date: "Feb 09, 2026",
    //   time: "04:15 PM",
    //   photo: "/assets/about-us/teams/virot.jpg",
    // },
    // {
    //   id: 13,
    //   name: "Samnang",
    //   gender: "MALE",
    //   age: 25,
    //   phone: "+855 081 888 999",
    //   department: "IT Support",
    //   position: "Helpdesk",
    //   status: "PHASE 2: INTERVIEW",
    //   subStatus: "SKILLS TEST",
    //   type: "EXPAT",
    //   date: "Feb 09, 2026",
    //   time: "11:00 AM",
    //   photo: "/assets/about-us/teams/samnang.png",
    // },
    // {
    //   id: 14,
    //   name: "Daly",
    //   gender: "FEMALE",
    //   age: 26,
    //   phone: "+855 099 999 000",
    //   department: "Marketing",
    //   position: "Social Media",
    //   status: "PHASE 1: REVIEW",
    //   subStatus: "IN REVIEW",
    //   type: "EXPAT",
    //   date: "Feb 08, 2026",
    //   time: "02:45 PM",
    //   photo: "/assets/about-us/teams/daly.jpg",
    // },
    // {
    //   id: 15,
    //   name: "Yasomi",
    //   gender: "FEMALE",
    //   age: 24,
    //   phone: "+855 061 000 111",
    //   department: "Design",
    //   position: "Intern",
    //   status: "PHASE 3: ONBOARDING",
    //   subStatus: "ID ISSUED",
    //   type: "EXPAT",
    //   date: "Feb 08, 2026",
    //   time: "09:30 AM",
    //   photo: "/assets/about-us/teams/yasomi.jpg",
    // },
    // {
    //   id: 16,
    //   name: "Chhorng",
    //   gender: "MALE",
    //   age: 30,
    //   phone: "+855 070 111 222",
    //   department: "Logistics",
    //   position: "Warehouse",
    //   status: "PHASE 1: REVIEW",
    //   subStatus: "NEW APPLICANT",
    //   type: "EXPAT",
    //   date: "Feb 07, 2026",
    //   time: "03:20 PM",
    //   photo: "/assets/about-us/teams/chhorng.jpg",
    // },
  ]);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const handleSetup = (applicant) => {
    setSelectedApplicant(applicant);
    setShowSetupModal(true);
  };

  const handleViewDetail = (applicant) => {
    setSelectedApplicant(applicant);
    setShowDetailModal(true);
  };

  const handleEdit = (applicant) => {
    setSelectedApplicant(applicant);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this applicant?")) {
      setApplicantsList((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleInterview = (applicant) => {
    setSelectedApplicant(applicant);
    setShowInterviewModal(true);
  };

  const handleReject = (applicant) => {
    setSelectedApplicant(applicant);
    setShowRejectModal(true);
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
                Recruitment
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
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2 active:scale-95"
              >
                <Plus size={14} strokeWidth={3} />
                Add Applicant
              </button>
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-auto px-8 pb-8">
            <div className="bg-white border-t border-l border-black shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-[16px] font-bold text-white uppercase tracking-widest sticky top-0 z-10">
                    <th className="px-6 py-4 border-r border-b border-black text-center w-20">
                      {t("photo") || "Photo"}
                    </th>
                    <th className="px-6 py-4 border-r border-b border-black">
                      {t("applicant") || "Applicant"} /{" "}
                      {t("contact") || "Contact"}
                    </th>
                    <th className="px-6 py-4 border-r border-b border-black">
                      {t("department") || "Department"}
                    </th>
                    <th className="px-6 py-4 border-r border-b border-black text-center">
                      {t("status") || "Status"}
                    </th>
                    <th className="px-6 py-4 border-r border-b border-black text-center">
                      {t("type") || "Type"}
                    </th>
                    <th className="px-6 py-4 border-r border-b border-black">
                      {t("submitted") || "Submitted"}
                    </th>
                    <th className="px-6 py-4 border-r border-b border-black text-center whitespace-nowrap">
                      {t("action") || "Action"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applicantsList.map((applicant) => (
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
                        <div className="flex flex-col">
                          <span className="font-bold text-black text-[18px] uppercase tracking-tight">
                            {applicant.department}
                          </span>
                          <span className="text-[18px] font-medium text-black">
                            {applicant.position}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-b border-black">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-[18px] font-bold text-black uppercase tracking-widest italic">
                            {applicant.status}
                          </span>
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[18px] font-black tracking-widest border border-emerald-100">
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
                          <span className="text-[18px] text-black">
                            {applicant.time}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 border-r border-b border-black">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleInterview(applicant)}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg text-[18px] font-black uppercase hover:bg-emerald-100 transition-colors"
                          >
                            <Calendar size={12} strokeWidth={3} />
                            Interview
                          </button>
                          <button
                            onClick={() => handleReject(applicant)}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-[18px] font-black uppercase hover:bg-rose-100 transition-colors"
                          >
                            <X size={12} strokeWidth={3} />
                            Reject
                          </button>
                          <div className="flex items-center gap-1 ml-2 border-l border-black pl-3">
                            <button className="p-1.5 text-black hover:text-black hover:bg-white hover:shadow-sm rounded transition-all">
                              <FileText size={14} />
                            </button>
                            <button
                              onClick={() => handleViewDetail(applicant)}
                              className="p-1.5 text-black hover:text-blue-600 hover:bg-white hover:shadow-sm rounded transition-all"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleEdit(applicant)}
                              className="p-1.5 text-black hover:text-black hover:bg-white hover:shadow-sm rounded transition-all"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(applicant.id)}
                              className="p-1.5 text-black hover:text-red-500 hover:bg-white hover:shadow-sm rounded transition-all"
                            >
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

      {/* Add Applicant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                  <Plus size={24} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    New Applicant
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Register a new candidate in the system
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
                {/* Table Form Content */}
                <div className="grid grid-cols-1 divide-y divide-slate-100">
                  {/* Row 1 */}
                  <div className="grid grid-cols-3">
                    <div className="p-4 bg-slate-50/50 flex items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Full Name
                      </label>
                    </div>
                    <div className="col-span-2 p-4">
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="grid grid-cols-3">
                    <div className="p-4 bg-slate-50/50 flex items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Gender & Age
                      </label>
                    </div>
                    <div className="col-span-2 p-4 flex items-center gap-4">
                      <select className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer">
                        <option>MALE</option>
                        <option>FEMALE</option>
                        <option>OTHER</option>
                      </select>
                      <div className="w-px h-4 bg-slate-200"></div>
                      <input
                        type="number"
                        placeholder="Age"
                        className="w-20 bg-transparent border-none text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                  {/* Row 3 */}
                  <div className="grid grid-cols-3">
                    <div className="p-4 bg-slate-50/50 flex items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Phone Number
                      </label>
                    </div>
                    <div className="col-span-2 p-4">
                      <input
                        type="text"
                        placeholder="+855 000 000 000"
                        className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                  {/* Row 4 */}
                  <div className="grid grid-cols-3">
                    <div className="p-4 bg-slate-50/50 flex items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Department
                      </label>
                    </div>
                    <div className="col-span-2 p-4">
                      <select className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer">
                        <option value="">Select Department</option>
                        <option>Production</option>
                        <option>Engineering</option>
                        <option>Admin</option>
                        <option>HR</option>
                        <option>Design</option>
                      </select>
                    </div>
                  </div>
                  {/* Row 5 */}
                  <div className="grid grid-cols-3">
                    <div className="p-4 bg-slate-50/50 flex items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Position
                      </label>
                    </div>
                    <div className="col-span-2 p-4">
                      <input
                        type="text"
                        placeholder="e.g. Software Engineer"
                        className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                  {/* Row 6 */}
                  <div className="grid grid-cols-3">
                    <div className="p-4 bg-slate-50/50 flex items-center">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Applicant Type
                      </label>
                    </div>
                    <div className="col-span-2 p-4">
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="type"
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                            defaultChecked
                          />
                          <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                            Foreigner
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name="type"
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                          />
                          <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                            Expat
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
                  alert("Applicant added successfully!");
                  setShowAddModal(false);
                }}
                className="px-10 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center gap-2"
              >
                <Check size={16} strokeWidth={3} />
                Create Applicant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
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
                    Applicant Profile
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Detailed record information
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
              <div className="p-8 bg-gradient-to-br from-blue-50/50 to-slate-50/30 border-b border-slate-100 flex items-center gap-8">
                <div className="relative">
                  <img
                    src={selectedApplicant?.photo}
                    className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl"
                    alt=""
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-md flex items-center justify-center border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">
                    {selectedApplicant?.name}
                  </h2>
                  <div className="flex gap-3">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.15em] bg-white border border-blue-100 px-3 py-1 rounded-lg shadow-sm">
                      {selectedApplicant?.type}
                    </span>
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.15em] bg-white border border-emerald-100 px-3 py-1 rounded-lg shadow-sm">
                      {selectedApplicant?.subStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-1 divide-y divide-slate-100">
                <div className="grid grid-cols-3">
                  <div className="p-4 bg-slate-50/30 font-black text-slate-400 text-[9px] uppercase tracking-widest flex items-center">
                    Phone Contact
                  </div>
                  <div className="col-span-2 p-4 text-sm font-bold text-slate-700">
                    {selectedApplicant?.phone}
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="p-4 bg-slate-50/30 font-black text-slate-400 text-[9px] uppercase tracking-widest flex items-center">
                    Bio Info
                  </div>
                  <div className="col-span-2 p-4 text-sm font-bold text-slate-700 uppercase">
                    {selectedApplicant?.age} Years Old
                  </div>
                </div>
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
                    Submission
                  </div>
                  <div className="col-span-2 p-4 text-sm font-bold text-slate-500">
                    {selectedApplicant?.date} at {selectedApplicant?.time}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                Close Profile
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
                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                  <Edit2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    Edit Applicant
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Modify existing candidate data
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
                      Full Name
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <input
                      type="text"
                      defaultValue={selectedApplicant?.name}
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="p-5 bg-slate-50/50 flex items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Phone Number
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <input
                      type="text"
                      defaultValue={selectedApplicant?.phone}
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="p-5 bg-slate-50/50 flex items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Department
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <select
                      className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer"
                      defaultValue={selectedApplicant?.department}
                    >
                      <option>Production</option>
                      <option>Engineering</option>
                      <option>Admin</option>
                      <option>HR</option>
                      <option>Design</option>
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
                className="px-10 py-4 bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-orange-600 shadow-xl shadow-orange-100 transition-all active:scale-95 flex items-center gap-2"
              >
                <Check size={16} strokeWidth={3} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interview Schedule Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                  <Calendar size={24} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    Schedule Interview
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Set up a new technical screening
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInterviewModal(false)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-0">
              <div className="p-6 bg-emerald-50/50 border-b border-emerald-100 flex items-center gap-4 mx-4 my-4 rounded-2xl">
                <img
                  src={selectedApplicant?.photo}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                  alt=""
                />
                <div>
                  <h4 className="font-black text-slate-800 uppercase text-xs">
                    {selectedApplicant?.name}
                  </h4>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">
                    Candidate for {selectedApplicant?.position}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 divide-y divide-slate-100 border-b border-slate-100">
                <div className="grid grid-cols-3">
                  <div className="p-5 bg-slate-50/50 flex items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Date & Time
                    </label>
                  </div>
                  <div className="col-span-2 p-5 flex gap-4">
                    <input
                      type="date"
                      className="flex-1 bg-transparent border-none text-sm font-bold text-slate-700 outline-none"
                    />
                    <div className="w-px h-6 bg-slate-200"></div>
                    <input
                      type="time"
                      className="flex-1 bg-transparent border-none text-sm font-bold text-slate-700 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="p-5 bg-slate-50/50 flex items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Interviewer
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <select className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer">
                      <option>Tech Lead (Arnold)</option>
                      <option>HR Manager (Sreynoch)</option>
                      <option>CEO (Mony)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="p-5 bg-slate-50/50 flex items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Method
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="method"
                          defaultChecked
                          className="w-4 h-4 text-emerald-600"
                        />
                        <span className="text-xs font-bold text-slate-600 uppercase">
                          Offline
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="method"
                          className="w-4 h-4 text-emerald-600"
                        />
                        <span className="text-xs font-bold text-slate-600 uppercase">
                          Online
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setShowInterviewModal(false)}
                className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Interview scheduled successfully!");
                  setShowInterviewModal(false);
                }}
                className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95 flex items-center gap-2"
              >
                <Calendar size={16} strokeWidth={3} />
                Schedule Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-100">
                  <X size={24} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                    Reject Candidate
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Terminate the recruitment process
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-0">
              <div className="p-6 bg-rose-50/50 border-b border-rose-100 flex items-center gap-4 mx-4 my-4 rounded-2xl">
                <img
                  src={selectedApplicant?.photo}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm opacity-50 grayscale"
                  alt=""
                />
                <div>
                  <h4 className="font-black text-slate-800 uppercase text-xs">
                    {selectedApplicant?.name}
                  </h4>
                  <p className="text-[10px] font-bold text-rose-600 uppercase">
                    Reason for rejection required
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 divide-y divide-slate-100 border-b border-slate-100">
                <div className="grid grid-cols-3">
                  <div className="p-5 bg-slate-50/50 flex items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Reason
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <select className="w-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer">
                      <option>Technical skills mismatch</option>
                      <option>Cultural fit concerns</option>
                      <option>Salary expectation mismatch</option>
                      <option>Position closed</option>
                      <option>Candidate withdrew</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 min-h-[120px]">
                  <div className="p-5 bg-slate-50/50 flex items-start pt-6">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Internal Notes
                    </label>
                  </div>
                  <div className="col-span-2 p-5">
                    <textarea
                      placeholder="Add specific details for the records..."
                      className="w-full h-full bg-transparent border-none text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`${selectedApplicant?.name} has been rejected.`);
                  setShowRejectModal(false);
                }}
                className="px-12 py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-rose-700 shadow-xl shadow-rose-100 transition-all active:scale-95 flex items-center gap-2"
              >
                <Send size={16} />
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Bot Button */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </button>

      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Recruitment Applicants"
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
      {/* {selectedVideo && (
        <VideoViewer
          videoUrl={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )} */}

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

export default Recruitment;
