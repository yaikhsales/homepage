import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  ChevronDown,
  MessageCircle,
  X,
  CheckCircle,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { Video, FileText } from "lucide-react";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";
import { useTranslation } from "../translate/TranslationContext";

const MyAttendance = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("2025-12-01");
  const [toDate, setToDate] = useState("2025-12-23");
  const [attendanceData, setAttendanceData] = useState({});
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Generate dates from 1 to 23 December 2025
  const generateDates = () => {
    const dates = [];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let day = 1; day <= 23; day++) {
      const date = new Date(2025, 11, day); // Month is 0-indexed, so 11 = December
      dates.push({
        day: String(day).padStart(2, "0"),
        dayOfWeek: daysOfWeek[date.getDay()],
        fullDate: date,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }
    return dates;
  };

  const dates = generateDates();

  // Attendance codes legend
  const attendanceCodes = [
    { code: "W", label: "មកធ្វើការ", description: "Come to work" },
    { code: "P", label: "ឈប់មានច្បាប់", description: "Leave with permission" },
    {
      code: "A",
      label: "ឈប់អត់ច្បាប់",
      description: "Absent without permission",
    },
    {
      code: "SL",
      label: "ច្បាប់ឈើ ឬពិនិត្យផ្ទៃពោះ",
      description: "Sick leave or maternity check-up",
    },
    { code: "SP", label: "ច្បាប់ពិសេស", description: "Special leave" },
    { code: "AL", label: "ច្បាប់បំណាច់ឆ្នាំ", description: "Annual leave" },
    { code: "AB", label: "លាឈប់", description: "Resigned" },
    { code: "SS", label: "ច្បាប់ព្យួរ", description: "Suspended leave" },
    { code: "ML", label: "ច្បាប់សម្រាល", description: "Maternity leave" },
    { code: "OT", label: "ថែមម៉ោង", description: "Overtime" },
    {
      code: "PH",
      label: "ធ្វើការថ្ងៃឈប់សម្រាក",
      description: "Work on holiday",
    },
  ];

  const sampleEmployees = [
    {
      id: "TS00004155",
      name: "Dot Sreynoch",
      sex: "Female",
      position: "HR Specialist",
      startDate: "14/07/2025",
      photo: "/assets/Yaikh-Uploads/H01_00004155_20251224132344.jpeg",
    },
    {
      id: "TS00004163",
      name: "Koem Phanny",
      sex: "Female",
      position: "Logistics Lead",
      startDate: "19/11/2025",
      photo: "/assets/Yaikh-Uploads/H01_00004163_20260110104202.jpeg",
    },
    {
      id: "TS00004171",
      name: "Sin Khun",
      sex: "Male",
      position: "Backend Dev",
      startDate: "19/11/2025",
      photo: "/assets/Yaikh-Uploads/H01_00004171_20260108143914.jpeg",
    },
  ];

  // Generate more sample employees
  const generateMoreEmployees = () => {
    const moreEmployees = [];
    const photoDetails = [
      {
        photo: "/assets/Yaikh-Uploads/H01_00004177_20260112101013.jpeg",
        name: "Voun Samnang",
        gender: "Male",
      },
      {
        photo: "/assets/Yaikh-Uploads/H01_00004193_20260110100532.jpeg",
        name: "Set Sophy",
        gender: "Female",
      },
      {
        photo: "/assets/Yaikh-Uploads/H01_00004198_20251215163335.jpeg",
        name: "Ton Sreyneang",
        gender: "Female",
      },
      {
        photo: "/assets/Yaikh-Uploads/H01_00004199_20260110100611.jpeg",
        name: "Proeurng Sokhim",
        gender: "Male",
      },
      {
        photo: "/assets/Yaikh-Uploads/H01_00004202_20260110100639.jpeg",
        name: "Sobon Sreypich",
        gender: "Female",
      },
      {
        photo: "/assets/Yaikh-Uploads/H01_00004203_20250903122655.jpeg",
        name: "Van Phanith",
        gender: "Male",
      },
      {
        photo: "/assets/Yaikh-Uploads/H01_00004216_20260114093811.jpeg",
        name: "Yeom Sreysros",
        gender: "Female",
      },
      {
        photo: "/assets/Yaikh-Uploads/H01_00004219_20260114093834.jpeg",
        name: "Young Sengheang",
        gender: "Male",
      },
      {
        photo: "/assets/Yaikh-Uploads/H01_00004220_20260108154036.jpeg",
        name: "Sokhim",
        gender: "Female",
      },
    ];
    for (let i = 4; i <= 100; i++) {
      const detail = photoDetails[i % photoDetails.length];
      moreEmployees.push({
        id: `TS${String(i).padStart(8, "0")}`,
        name: detail.name,
        sex: detail.gender,
        position: "Staff",
        startDate: "19/11/2025",
        photo: detail.photo,
      });
    }
    return [...sampleEmployees, ...moreEmployees];
  };

  const [employees] = useState(generateMoreEmployees());

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleViewProfile = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleSearch = () => {
    // Handle search action
    console.log("Search:", searchTerm);
  };

  const handleFilter = () => {
    // Handle filter action
    console.log("Filter:", { fromDate, toDate });
  };

  const handleAttendanceChange = (employeeId, date, timeSlot, value) => {
    const key = `${employeeId}_${date}_${timeSlot}`;
    setAttendanceData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getAttendanceValue = (employeeId, date, timeSlot) => {
    const key = `${employeeId}_${date}_${timeSlot}`;
    return attendanceData[key] || "";
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      searchTerm === "" ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDateForDisplay = (dateString) => {
    // Convert YYYY-MM-DD to DD/MM/YYYY
    const parts = dateString.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col animate-in fade-in duration-500 z-[200]">
      {/* Header */}
      <div className="bg-white p-6 border-b border-slate-200 flex items-center justify-between flex-shrink-0 relative z-[201] shadow-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={handleBack}
            className="p-2.5 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-600 border border-slate-100 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              {t("dailyAttendanceList")}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              {t("texlinkTechnologies")} • Management Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              setSelectedVideo("/assets/short-video-training/new-updated-vd/YHR.mp4")
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
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 hover:border-slate-300 transition-all hover:scale-105"
          >
            <img
              src="/logo.jpg"
              alt="logo"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Attendance Legend */}
      <div className="bg-slate-50 px-8 py-3 border-b border-slate-100 flex flex-wrap gap-x-6 gap-y-2 flex-shrink-0">
        {attendanceCodes.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 group cursor-help">
            <span className="text-[10px] font-black text-blue-600 bg-white border border-blue-100 px-2 py-0.5 rounded shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
              {item.code}
            </span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white px-8 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap flex-shrink-0">
        <div className="flex items-center gap-4 flex-1 max-w-[400px]">
          <div className="relative group flex-1">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            />
            <input
              type="text"
              placeholder={t("searchByIDOrName")}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-100 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t("from")}
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-100 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t("to")}
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-100 transition-all"
              />
            </div>
          </div>
          <button
            onClick={handleFilter}
            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
          >
            <Filter size={14} />
            {t("filter")}
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="flex-1 overflow-auto px-8 pb-8 pt-4">
        <div className="bg-white border-t border-l border-slate-200 shadow-sm overflow-hidden h-full">
          <div className="overflow-x-auto h-full scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-slate-100 sticky top-0 z-30">
                <tr className="text-[10px] font-extrabold text-black uppercase tracking-[0.2em]">
                  <th className="px-3 py-5 border-r border-b border-slate-200 text-center sticky left-0 bg-slate-100 z-40 w-12">
                    #
                  </th>
                  <th className="px-4 py-5 border-r border-b border-slate-200 text-left sticky left-12 bg-slate-100 z-40 min-w-[120px]">
                    {t("employeeId")}
                  </th>
                  <th className="px-4 py-5 border-r border-b border-slate-200 text-left sticky left-[168px] bg-slate-100 z-40 min-w-[200px]">
                    {t("name")}
                  </th>
                  <th className="px-3 py-5 border-r border-b border-slate-200 text-center sticky left-[368px] bg-slate-100 z-40 min-w-[60px]">
                    {t("time")}
                  </th>

                  {/* Date Columns */}
                  {dates.map((date, idx) => (
                    <th
                      key={idx}
                      className={`px-1 py-5 border-r border-b border-slate-200 text-center min-w-[70px] ${date.isWeekend ? "bg-red-50/50" : ""}`}
                    >
                      <div className="flex flex-col">
                        <span
                          className={`text-[11px] ${date.isWeekend ? "text-red-600" : ""}`}
                        >
                          {date.day}
                        </span>
                        <span
                          className={`text-[8px] opacity-40 ${date.isWeekend ? "text-red-500 font-black" : ""}`}
                        >
                          {date.dayOfWeek}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee, empIdx) => {
                  const timeSlots = ["M", "E", "OT"];

                  return timeSlots.map((timeSlot, timeIdx) => (
                    <tr
                      key={`${employee.id}_${timeSlot}`}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      {/* Employee Info - Only show for first row (M) */}
                      {timeIdx === 0 && (
                        <>
                          <td
                            rowSpan={3}
                            className="px-3 py-4 border-r border-b border-slate-200 text-slate-400 font-bold text-center sticky left-0 bg-white z-20 group-hover:bg-slate-50"
                          >
                            {empIdx + 1}
                          </td>
                          <td
                            rowSpan={3}
                            onClick={() => handleViewProfile(employee)}
                            className="px-4 py-4 border-r border-b border-slate-200 text-blue-600 font-black text-[11px] sticky left-12 bg-white z-20 hover:text-blue-700 cursor-pointer group-hover:bg-slate-50"
                          >
                            {employee.id}
                          </td>
                          <td
                            rowSpan={3}
                            onClick={() => handleViewProfile(employee)}
                            className="px-4 py-4 border-r border-b border-slate-200 sticky left-[168px] bg-white z-20 cursor-pointer group-hover:bg-slate-50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm overflow-hidden shrink-0">
                                {employee.name.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-tight">
                                {employee.name}
                              </span>
                            </div>
                          </td>
                        </>
                      )}

                      {/* Time Slot */}
                      <td className="px-3 py-4 border-r border-b border-slate-200 text-slate-400 text-[10px] font-black text-center sticky left-[368px] bg-white z-20 group-hover:bg-slate-50 bg-slate-50/10">
                        {timeSlot}
                      </td>

                      {/* Attendance Dropdowns */}
                      {dates.map((date, dateIdx) => (
                        <td
                          key={dateIdx}
                          className={`px-1 py-4 border-r border-b border-slate-200 text-center ${date.isWeekend ? "bg-red-50/20" : ""}`}
                        >
                          <select
                            value={getAttendanceValue(
                              employee.id,
                              date.day,
                              timeSlot,
                            )}
                            onChange={(e) =>
                              handleAttendanceChange(
                                employee.id,
                                date.day,
                                timeSlot,
                                e.target.value,
                              )
                            }
                            className="w-14 px-1 py-1 bg-transparent border-none text-[10px] font-black text-slate-700 outline-none cursor-pointer hover:bg-white rounded transition-colors text-center appearance-none"
                          >
                            <option value="">-</option>
                            {attendanceCodes.map((code, codeIdx) => (
                              <option key={codeIdx} value={code.code}>
                                {code.code}
                              </option>
                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Profile Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white relative">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                  <Filter size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                    Attendance Profile
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    System Record No. {selectedEmployee?.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-0">
              <div className="p-10 bg-gradient-to-br from-indigo-50/50 to-slate-50/30 border-b border-slate-100 flex items-center gap-10">
                <div className="relative">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl">
                    <div className="w-full h-full rounded-[2.2rem] bg-slate-100 flex items-center justify-center text-4xl font-black text-slate-300 overflow-hidden">
                      {selectedEmployee?.name.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                    <CheckCircle size={18} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">
                      Primary Record
                    </span>
                  </div>
                  <h2 className="text-4xl font-black text-slate-800 tracking-tight uppercase leading-none">
                    {selectedEmployee?.name}
                  </h2>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Department
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        Operations
                      </span>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Joined Since
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {selectedEmployee?.startDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 divide-x divide-slate-100">
                <div className="p-8 text-center bg-white">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Total Worked
                  </div>
                  <div className="text-3xl font-black text-indigo-600">
                    182h
                  </div>
                </div>
                <div className="p-8 text-center bg-white">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    OT Hours
                  </div>
                  <div className="text-3xl font-black text-emerald-600">
                    24.5h
                  </div>
                </div>
                <div className="p-8 text-center bg-white">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Status
                  </div>
                  <div className="text-3xl font-black text-slate-900">Good</div>
                </div>
                <div className="p-8 text-center bg-white">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Score
                  </div>
                  <div className="text-3xl font-black text-blue-600">9.2</div>
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50 flex justify-end gap-4">
              <button className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                <MessageCircle size={18} />
                Send Notification
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-12 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bot Button - Bottom Right */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Ask My Attendance bot"
        title="Ask My Attendance bot"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Bot Modal */}
      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="My Attendance"
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

export default MyAttendance;
