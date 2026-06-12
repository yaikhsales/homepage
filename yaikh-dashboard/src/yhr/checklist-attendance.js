import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  MessageCircle,
  X,
  FileText,
} from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { Video } from "lucide-react";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";
import { useTranslation } from "../translate/TranslationContext";

const ChecklistAttendance = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [sectionName, setSectionName] = useState("All Sc");
  const [fromDate, setFromDate] = useState("2025-12-01");
  const [toDate, setToDate] = useState("2025-12-23");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
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
      });
    }
    return dates;
  };

  const dates = generateDates();

  // Sample employee data
  const sampleEmployees = [
    {
      id: "YM7654",
      name: "Dot Sreynoch",
      sex: "Female",
      position: "CSR Manager",
      startDate: "28/05/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004155_20251224132344.jpeg",
    },
    {
      id: "YM3854",
      name: "Koem Phanny",
      sex: "Female",
      position: "Compliance Worker",
      startDate: "10/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004163_20260110104202.jpeg",
    },
    {
      id: "YM6472",
      name: "Sin Khun",
      sex: "Male",
      position: "IT",
      startDate: "15/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004171_20260108143914.jpeg",
    },
    {
      id: "YM0109",
      name: "Voun Thida",
      sex: "Female",
      position: "Supervisor Digital Development",
      startDate: "17/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004177_20260112101013.jpeg",
    },
    {
      id: "YM1234",
      name: "Set Sophy",
      sex: "Female",
      position: "HR Supervisor",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004193_20260110100532.jpeg",
    },
    {
      id: "YM5678",
      name: "Ton Sreyneang",
      sex: "Female",
      position: "Admin Supervisor",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004198_20251215163335.jpeg",
    },
    {
      id: "YM9012",
      name: "Proeurng Sokhim",
      sex: "Male",
      position: "Administration Clerk",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004199_20260110100611.jpeg",
    },
    {
      id: "YM3456",
      name: "Sobon Sreypich",
      sex: "Female",
      position: "General Affairs Manager",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004202_20260110100639.jpeg",
    },
    {
      id: "YM7890",
      name: "Van Phanith",
      sex: "Male",
      position: "Purchasing Supervisor",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004203_20250903122655.jpeg",
    },
    {
      id: "YM2345",
      name: "Yeom Sreysros",
      sex: "Female",
      position: "Compliance Worker",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004216_20260114093811.jpeg",
    },
    {
      id: "YM6789",
      name: "Young Sengheang",
      sex: "Male",
      position: "IT",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004219_20260114093834.jpeg",
    },
    {
      id: "YM0123",
      name: "Sokhim",
      sex: "Female",
      position: "CSR Manager",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004220_20260108154036.jpeg",
    },
    {
      id: "YM4567",
      name: "Samnang",
      sex: "Male",
      position: "HR Supervisor",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004222_20260110130201.jpeg",
    },
    {
      id: "YM8901",
      name: "Sophy",
      sex: "Female",
      position: "Admin Supervisor",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004225_20260112095718.jpeg",
    },
    {
      id: "YM2346",
      name: "Phanith",
      sex: "Male",
      position: "Administration Clerk",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004227_20260110104235.jpeg",
    },
    {
      id: "YM5679",
      name: "Thida",
      sex: "Female",
      position: "General Affairs Manager",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004230_20260112095743.jpeg",
    },
    {
      id: "YM9013",
      name: "Menghorng",
      sex: "Male",
      position: "Purchasing Supervisor",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004237_20260110130233.jpeg",
    },
    {
      id: "YM3457",
      name: "Yasomi",
      sex: "Female",
      position: "Compliance Worker",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004238_20260114093925.jpeg",
    },
    {
      id: "YM7891",
      name: "Noeun",
      sex: "Male",
      position: "IT",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004239_20251215163445.jpeg",
    },
    {
      id: "YM2347",
      name: "Phanny",
      sex: "Female",
      position: "CSR Manager",
      startDate: "26/07/2024",
      photo: "/assets/Yaikh-Uploads/H01_00004240_20260110104302.jpeg",
    },
  ];

  // Generate attendance data for each employee
  const generateAttendanceData = (employeeId) => {
    const attendance = {};
    dates.forEach((date, idx) => {
      // YM7654 has orange question marks on specific days
      if (employeeId === "YM7654" && [4, 7, 10, 13, 16, 19, 22].includes(idx)) {
        attendance[date.day] = "absent";
      }
      // YM6472 has green checkmark on day 09
      else if (employeeId === "YM6472" && idx === 8) {
        attendance[date.day] = "special";
      }
      // YM0109 has green checkmarks on days 09 and 10
      else if (employeeId === "YM0109" && [8, 9].includes(idx)) {
        attendance[date.day] = "special";
      } else if (
        sampleEmployees.indexOf(
          sampleEmployees.find((e) => e.id === employeeId),
        ) >= 14
      ) {
        attendance[date.day] = null;
      } else {
        attendance[date.day] = "present";
      }
    });
    return attendance;
  };

  const generateMoreEmployees = () => {
    const moreEmployees = [];
    const photoDetails = [
      {
        photo: "/assets/Yaikh-Uploads/H01_00004155_20251224132344.jpeg",
        name: "Dot Sreynoch",
        gender: "Female",
      },
      {
        photo: "/assets/Yaikh-Uploads/H01_00004163_20260110104202.jpeg",
        name: "Koem Phanny",
        gender: "Female",
      },
      {
        photo: "/assets/Yaikh-Uploads/H01_00004171_20260108143914.jpeg",
        name: "Sin Khun",
        gender: "Male",
      },
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
    ];

    const positions = [
      "CSR Manager",
      "Compliance Worker",
      "IT",
      "Supervisor Digital Development",
      "HR Supervisor",
      "Admin Supervisor",
      "Administration Clerk",
      "General Affairs Manager",
      "Purchasing Supervisor",
    ];

    for (let i = 21; i <= 9604; i++) {
      const detail = photoDetails[i % photoDetails.length];
      moreEmployees.push({
        id: `YM${String(i).padStart(4, "0")}`,
        name: detail.name,
        sex: detail.gender,
        position: positions[i % positions.length],
        startDate: "26/07/2024",
        photo: detail.photo,
      });
    }
    return [...sampleEmployees, ...moreEmployees];
  };

  const [employees] = useState(generateMoreEmployees());
  const totalEmployees = employees.length;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleFilter = () => {
    // Handle filter action
    console.log("Filter:", { sectionName, fromDate, toDate });
  };

  const handleShowAttendance = () => {
    // Handle show attendance action
    console.log("Show Attendance:", { sectionName, fromDate, toDate });
  };

  // Pagination logic
  const totalPages = Math.ceil(totalEmployees / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = employees.slice(startIndex, endIndex);
  const startItem = totalEmployees > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, totalEmployees);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 10;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = 1; i <= 2; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(479);
      pages.push(480);
    }

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-slate-300 rounded text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lt;&lt; {t("previous")}
        </button>
        {pages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={page === "..."}
            className={`px-3 py-1 border border-slate-300 rounded text-sm font-semibold ${
              currentPage === page
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-slate-50"
            } ${page === "..." ? "cursor-default" : "cursor-pointer"}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-slate-300 rounded text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("next")} &gt;&gt;
        </button>
      </div>
    );
  };

  const getAttendanceIcon = (status) => {
    if (status === "present") {
      return (
        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
          <CheckCircle size={12} className="text-white" />
        </div>
      );
    } else if (status === "absent") {
      return (
        <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
          <HelpCircle size={12} className="text-white" />
        </div>
      );
    } else if (status === "special") {
      return (
        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
          <CheckCircle size={12} className="text-white" />
        </div>
      );
    }
    return null;
  };

  const formatDateForInput = (dateString) => {
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const parts = dateString.split("/");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

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
              {t("texlinkTechnologies")} • Matrix Overview
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
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">
              +99
            </div>
          </div>
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

      {/* Filter and Search Controls */}
      <div className="bg-white px-8 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {t("sectionName")}
            </label>
            <select
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-100 transition-all cursor-pointer"
            >
              <option value="All Sc">All Sc</option>
              <option value="Section 1">Section 1</option>
              <option value="Section 2">Section 2</option>
              <option value="Section 3">Section 3</option>
            </select>
          </div>
          <div className="h-8 w-px bg-slate-100"></div>
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
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFilter}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            {t("filter")}
          </button>
          <button
            onClick={handleShowAttendance}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
          >
            {t("showAttendance")}
          </button>
        </div>
      </div>

      {/* Main Content - Split Table */}
      <div className="flex-1 overflow-auto px-8 pb-8 pt-4">
        <div className="bg-white border-t border-l border-slate-200 shadow-sm overflow-hidden h-full">
          <div className="overflow-x-auto h-full scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-slate-100 sticky top-0 z-30">
                <tr className="text-[10px] font-extrabold text-black uppercase tracking-[0.2em]">
                  {/* Employee Info Columns */}
                  <th className="px-3 py-5 border-r border-b border-slate-200 text-center sticky left-0 bg-slate-100 z-40 w-12">
                    #
                  </th>
                  <th className="px-4 py-5 border-r border-b border-slate-200 text-left sticky left-12 bg-slate-100 z-40 min-w-[120px]">
                    {t("employeeId")}
                  </th>
                  <th className="px-4 py-5 border-r border-b border-slate-200 text-left sticky left-[168px] bg-slate-100 z-40 min-w-[200px]">
                    {t("name")}
                  </th>
                  <th className="px-4 py-5 border-r border-b border-slate-200 text-left min-w-[200px]">
                    {t("position")}
                  </th>
                  <th className="px-4 py-5 border-r border-b border-slate-200 text-left min-w-[120px]">
                    {t("startDate")}
                  </th>

                  {/* Date Columns */}
                  {dates.map((date, idx) => (
                    <th
                      key={idx}
                      className="px-1 py-5 border-r border-b border-slate-200 text-center min-w-[45px]"
                    >
                      <div className="flex flex-col">
                        <span className="text-[11px]">{date.day}</span>
                        <span className="text-[8px] opacity-40">
                          {date.dayOfWeek}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((employee, empIdx) => {
                  const attendance = generateAttendanceData(employee.id);
                  const rowNumber = startIndex + empIdx + 1;

                  return (
                    <tr
                      key={employee.id}
                      onClick={() => handleViewDetails(employee)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-3 py-4 border-r border-b border-slate-200 text-slate-400 font-bold text-center sticky left-0 bg-white z-20 group-hover:bg-slate-50">
                        {rowNumber}
                      </td>
                      <td className="px-4 py-4 border-r border-b border-slate-200 text-blue-600 font-black text-[11px] sticky left-12 bg-white z-20 group-hover:bg-slate-50">
                        {employee.id}
                      </td>
                      <td className="px-4 py-4 border-r border-b border-slate-200 sticky left-[168px] bg-white z-20 group-hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm overflow-hidden shrink-0">
                            {employee.photo ? (
                              <img
                                src={employee.photo}
                                className="w-full h-full object-cover"
                                alt=""
                              />
                            ) : (
                              employee.name.charAt(0)
                            )}
                          </div>
                          <span className="font-bold text-slate-700 text-[11px] uppercase tracking-tight">
                            {employee.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 border-r border-b border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {employee.position}
                        </span>
                      </td>
                      <td className="px-4 py-4 border-r border-b border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400">
                          {employee.startDate}
                        </span>
                      </td>

                      {/* Attendance Grid */}
                      {dates.map((date, dateIdx) => (
                        <td
                          key={dateIdx}
                          className="px-1 py-4 border-r border-b border-slate-200 text-center"
                        >
                          <div className="flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            {getAttendanceIcon(attendance[date.day])}
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="bg-white border-t border-slate-100 p-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              {t("showing")}{" "}
              <span className="text-slate-900">
                {startItem} - {endItem}
              </span>{" "}
              {t("of")} <span className="text-blue-600">{totalEmployees}</span>
            </span>
          </div>
        </div>
        {renderPagination()}
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white relative">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                    Attendance Summary
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Monthly Performance Review
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
              <div className="p-10 bg-gradient-to-br from-blue-50/50 to-slate-50/30 border-b border-slate-100 flex items-center gap-10">
                <div className="relative">
                  <div className="w-28 h-28 rounded-[2.5rem] bg-white p-1.5 shadow-2xl">
                    <div className="w-full h-full rounded-[2.2rem] bg-slate-100 flex items-center justify-center text-3xl font-black text-slate-300 overflow-hidden">
                      {selectedEmployee?.photo ? (
                        <img
                          src={selectedEmployee.photo}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        selectedEmployee?.name.charAt(0)
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                    <CheckCircle size={18} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">
                      {selectedEmployee?.id}
                    </span>
                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      Active Member
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase leading-none">
                    {selectedEmployee?.name}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">
                    {selectedEmployee?.position} • {selectedEmployee?.startDate}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-slate-100">
                <div className="p-8 text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Present Days
                  </div>
                  <div className="text-3xl font-black text-blue-600">21</div>
                </div>
                <div className="p-8 text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Late Entries
                  </div>
                  <div className="text-3xl font-black text-orange-500">02</div>
                </div>
                <div className="p-8 text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Efficiency
                  </div>
                  <div className="text-3xl font-black text-emerald-500">
                    98%
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50 flex justify-end gap-4">
              <button className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                <FileText size={18} />
                Export Report
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-xl active:scale-95"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bot Button - Bottom Right */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Ask Checklist Attendance bot"
        title="Ask Checklist Attendance bot"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Bot Modal */}
      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Checklist Attendance"
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

export default ChecklistAttendance;
