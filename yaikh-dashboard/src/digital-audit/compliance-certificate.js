import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Calendar,
  X,
  Eye,
  Download,
  MoreVertical,
  FileText,
  MessageCircle,
  Video,
} from "lucide-react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import GeneralAIAgent from "../general-ag";
import BotModules from "../chatbot/bot-modules";
import { useTranslation } from "../translate/TranslationContext";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";

const ComplianceCertificate = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [ministryType, setMinistryType] = useState(t("all"));
  const [auditType, setAuditType] = useState(t("all"));
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isBotOpen, setIsBotOpen] = useState(false);
  // CSR PA greets on land — pre-scoped to Compliance audits
  useEffect(() => {
    const t = setTimeout(() => setIsBotOpen(true), 700);
    return () => clearTimeout(t);
  }, []);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const itemsPerPage = 10;

  // Simulated certificate register — generic permits, role codes instead of people, no real issuer
  const sampleCertificates = [
    { id: 1, name: "Fire safety certificate", ministry: "Fire authority", issueDate: "2025-09-01", expiredDate: "2026-09-01", validityPeriod: "1 year", renewalDate: null, responsiblePerson: "CSR-01", status: "Expired", hasImage: true },
    { id: 2, name: "Building permit", ministry: "Ministry of Land Management", issueDate: "2024-02-15", expiredDate: null, validityPeriod: "permanent", renewalDate: null, responsiblePerson: "ADM-02", status: "Valid", hasImage: false },
    { id: 3, name: "Environmental impact approval", ministry: "Ministry of Environment", issueDate: "2025-04-20", expiredDate: "2027-04-20", validityPeriod: "2 years", renewalDate: null, responsiblePerson: "CSR-01", status: "Valid", hasImage: false },
    { id: 4, name: "Wastewater discharge permit", ministry: "Ministry of Environment", issueDate: "2025-11-05", expiredDate: "2026-11-05", validityPeriod: "1 year", renewalDate: null, responsiblePerson: "CSR-01", status: "Valid", hasImage: false },
    { id: 5, name: "Wastewater test report", ministry: "Testing lab A", issueDate: "2026-07-10", expiredDate: "2026-10-10", validityPeriod: "3 months", renewalDate: null, responsiblePerson: "CSR-02", status: "Valid", hasImage: true },
    { id: 6, name: "Air emission test report", ministry: "Testing lab A", issueDate: "2026-06-20", expiredDate: "2026-12-20", validityPeriod: "6 months", renewalDate: null, responsiblePerson: "CSR-02", status: "Valid", hasImage: false },
    { id: 7, name: "Noise test report", ministry: "Testing lab A", issueDate: "2026-01-12", expiredDate: "2026-07-12", validityPeriod: "6 months", renewalDate: null, responsiblePerson: "CSR-02", status: "Expired", hasImage: false },
    { id: 8, name: "Drinking water test report", ministry: "Testing lab B", issueDate: "2026-08-01", expiredDate: "2026-11-01", validityPeriod: "3 months", renewalDate: null, responsiblePerson: "CSR-02", status: "Valid", hasImage: false },
    { id: 9, name: "Boiler inspection certificate", ministry: "Ministry of Industry", issueDate: "2025-12-01", expiredDate: "2026-12-01", validityPeriod: "1 year", renewalDate: null, responsiblePerson: "YTM-01", status: "Valid", hasImage: false },
    { id: 10, name: "Electrical installation certificate", ministry: "Ministry of Industry", issueDate: "2025-03-15", expiredDate: "2027-03-15", validityPeriod: "2 years", renewalDate: null, responsiblePerson: "YTM-01", status: "Valid", hasImage: false },
    { id: 11, name: "Chemical storage licence", ministry: "Ministry of Industry", issueDate: "2025-10-30", expiredDate: "2026-10-30", validityPeriod: "1 year", renewalDate: null, responsiblePerson: "CSR-01", status: "Valid", hasImage: false },
    { id: 12, name: "Factory operating licence", ministry: "Ministry of Industry", issueDate: "2024-04-08", expiredDate: "2028-04-08", validityPeriod: "4 years", renewalDate: null, responsiblePerson: "ADM-02", status: "Valid", hasImage: false },
    { id: 13, name: "Labour compliance registration", ministry: "Ministry of Labour", issueDate: "2024-06-28", expiredDate: null, validityPeriod: "permanent", renewalDate: null, responsiblePerson: "HR-01", status: "Valid", hasImage: false },
    { id: 14, name: "Social compliance certificate (standard A)", ministry: "Certification body A", issueDate: "2025-08-18", expiredDate: "2026-08-18", validityPeriod: "1 year", renewalDate: null, responsiblePerson: "CSR-01", status: "Expired", hasImage: true },
    { id: 15, name: "Security compliance certificate (standard B)", ministry: "Certification body B", issueDate: "2026-02-12", expiredDate: "2027-02-12", validityPeriod: "1 year", renewalDate: null, responsiblePerson: "CSR-01", status: "Valid", hasImage: false },
    { id: 16, name: "Industry association membership", ministry: "Industry association", issueDate: "2026-01-01", expiredDate: "2026-12-31", validityPeriod: "1 year", renewalDate: null, responsiblePerson: "ADM-02", status: "Valid", hasImage: false },
  ];

  // Generate more certificates for pagination
  const generateMoreCertificates = () => {
    const moreCertificates = [];
    for (let i = 17; i <= 23; i++) {
      moreCertificates.push({
        id: i,
        name: `Section permit ${i} (simulated)`,
        ministry: "Ministry of Environment",
        issueDate: "2025-01-01",
        expiredDate: i % 2 === 0 ? "2027-01-01" : "2026-01-01",
        validityPeriod: "1 year",
        renewalDate: null,
        responsiblePerson: "CSR-02",
        status: i % 2 === 0 ? "Valid" : "Expired",
        hasImage: false,
      });
    }
    return [...sampleCertificates, ...moreCertificates];
  };

  const [certificates] = useState(generateMoreCertificates());
  const totalCertificates = certificates.length;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleSearch = () => {
    console.log("Search:", {
      ministryType,
      auditType,
      searchTerm,
      fromDate,
      toDate,
    });
  };

  const handleReset = () => {
    setMinistryType(t("all"));
    setAuditType(t("all"));
    setSearchTerm("");
    setFromDate("");
    setToDate("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("pending") + "...";
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const filteredCertificates = certificates.filter((cert) => {
    if (ministryType !== t("all") && cert.ministry !== ministryType)
      return false;
    if (
      searchTerm &&
      !cert.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !cert.id.toString().includes(searchTerm)
    )
      return false;
    if (fromDate && cert.issueDate < fromDate) return false;
    if (toDate && cert.issueDate > toDate) return false;
    return true;
  });

  // Calculate summary statistics
  const validCount = filteredCertificates.filter(
    (c) => c.status === t("valid"),
  ).length;
  const expiredCount = filteredCertificates.filter(
    (c) => c.status === t("expired"),
  ).length;
  const expiringSoonCount = 0; // Calculate based on dates if needed

  // Pagination logic
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCertificates = filteredCertificates.slice(
    startIndex,
    endIndex,
  );
  const startItem = filteredCertificates.length > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, filteredCertificates.length);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 4;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 2) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-slate-300 rounded text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("previous")}
        </button>
        {pages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={page === "..."}
            className={`px-4 py-2 border border-slate-300 rounded text-sm font-semibold ${
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
          className="px-4 py-2 border border-slate-300 rounded text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("next")}
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col animate-in fade-in duration-500 z-[200]">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center gap-4 flex-shrink-0 shadow-sm relative z-[201]">
        <div className="w-32"></div> {/* Left spacer */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded transition-colors flex-shrink-0 bg-black text-white font-semibold text-sm"
              aria-label="Go back"
            >
              <ArrowLeft size={16} /> {t("back")}
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-slate-300 hover:border-slate-400 transition-all hover:scale-110 cursor-pointer flex-shrink-0"
              title={t("home")}
            >
              <img
                src="/logo.jpg"
                alt={t("home")}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            {t("certificateAndReport")}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedVideo("/assets/short-video-training/compliance-certificate.mp4",)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
        >
            <Video size={20} className="text-blue-600" />
        </button>
          <button
            onClick={() =>
              setSelectedDocument(
                "/assets/report-training/Compliance-certificate-report.pdf",
              )
            }
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center shrink-0"
            title="Report Training"
          >
            <FileText size={20} className="text-blue-600" />
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 flex-shrink-0 ml-2">
            <Calendar size={16} />
            {t("calendar")}
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-slate-50 p-4 border-b flex items-center gap-4 flex-wrap flex-shrink-0">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
            {t("typeOfMinistries")}:
          </label>
          <select
            value={ministryType}
            onChange={(e) => setMinistryType(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={t("all")}>{t("all")}</option>
            <option value="Ministry of Environment">
              Ministry of Environment
            </option>
            <option value="Ministry of Labor">Ministry of Labor</option>
            <option value="Ministry of Industrial">
              Ministry of Industrial
            </option>
            <option value="Industry association">Industry association</option>
            <option value="Testing lab A">Testing lab A</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
            {t("auditType")}:
          </label>
          <select
            value={auditType}
            onChange={(e) => setAuditType(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={t("all")}>{t("all")}</option>
            <option value="Type 1">Type 1</option>
            <option value="Type 2">Type 2</option>
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[250px]">
          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
            {t("search")}:
          </label>
          <input
            type="text"
            placeholder={t("searchByCertificateIdOrName")}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
            {t("fromDate")}:
          </label>
          <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 bg-white">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent outline-none text-slate-700 text-sm"
              placeholder="yyyy-mm-dd"
            />
            <Calendar size={16} className="text-slate-400" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
            {t("toDate")}:
          </label>
          <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 bg-white">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent outline-none text-slate-700 text-sm"
              placeholder="yyyy-mm-dd"
            />
            <Calendar size={16} className="text-slate-400" />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
        >
          {t("search")}
        </button>
        <button
          onClick={handleReset}
          className="bg-white text-slate-700 border border-slate-300 px-6 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-sm"
        >
          {t("reset")}
        </button>
      </div>

      {/* Action Buttons Section */}
      <div className="bg-white p-4 border-b flex items-center gap-3 flex-wrap flex-shrink-0">
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm">
          {t("ministryPermits")}
        </button>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
          {t("addCertificate")}
        </button>
        <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm">
          {t("importPermits")}
        </button>
        <button className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm">
          {t("history")}
        </button>
        <button className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm flex items-center gap-2">
          {t("exportPermits")}
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Certificates List Title and Summary Cards */}
      <div className="bg-white p-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            {t("certificatesList")}
          </h2>
          <div className="text-sm text-slate-600">
            {t("totalCertificates")}: {filteredCertificates.length}{" "}
            {t("certificate")}(s) | {t("showingOnThisPage")}:{" "}
            {endItem - startItem + 1} {t("onThisPage")}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-green-100 border border-green-300 rounded-lg p-4">
            <div className="text-sm text-green-700 font-semibold mb-1">
              {t("valid")}
            </div>
            <div className="text-2xl font-bold text-green-800">
              {validCount}
            </div>
          </div>
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
            <div className="text-sm text-yellow-700 font-semibold mb-1">
              {t("expiringSoon")} (30 {t("days")} / {t("month")} / 60{" "}
              {t("days")})
            </div>
            <div className="text-2xl font-bold text-yellow-800">
              {expiringSoonCount}
            </div>
          </div>
          <div className="bg-red-100 border border-red-300 rounded-lg p-4">
            <div className="text-sm text-red-700 font-semibold mb-1">
              {t("expired")}
            </div>
            <div className="text-2xl font-bold text-red-800">
              {expiredCount}
            </div>
          </div>
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
            <div className="text-sm text-blue-700 font-semibold mb-1">
              {t("total")}
            </div>
            <div className="text-2xl font-bold text-blue-800">
              {filteredCertificates.length}
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                  #
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">
                  {t("certificateName")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">
                  {t("ministrySupplier")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                  {t("certificateImage")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">
                  {t("issueDate")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">
                  {t("expiredDate")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">
                  {t("validityPeriod")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">
                  {t("renewalDate")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">
                  {t("responsiblePerson")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                  {t("status")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCertificates.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-16 text-slate-500">
                    {t("noCertificatesFound")}
                  </td>
                </tr>
              ) : (
                paginatedCertificates.map((cert, idx) => (
                  <tr
                    key={cert.id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center">
                      {startIndex + idx + 1}
                    </td>
                    <td className="px-4 py-4 border border-slate-200 text-slate-700">
                      {cert.name}
                    </td>
                    <td className="px-4 py-4 border border-slate-200 text-slate-700">
                      {cert.ministry}
                    </td>
                    <td className="px-4 py-4 border border-slate-200 text-center">
                      {cert.hasImage ? (
                        <div className="flex items-center justify-center gap-2">
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1">
                            <Eye size={12} />
                            {t("viewPdf")}
                          </button>
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1">
                            <Download size={12} />
                            {t("download")}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400">
                          {t("notAvailable")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 border border-slate-200 text-slate-700">
                      {formatDate(cert.issueDate)}
                    </td>
                    <td className="px-4 py-4 border border-slate-200 text-slate-700">
                      {cert.expiredDate ? (
                        formatDate(cert.expiredDate)
                      ) : (
                        <span className="text-red-600">{t("pending")}...</span>
                      )}
                    </td>
                    <td className="px-4 py-4 border border-slate-200 text-slate-700">
                      {cert.validityPeriod}
                    </td>
                    <td className="px-4 py-4 border border-slate-200 text-slate-700">
                      {cert.renewalDate ? (
                        formatDate(cert.renewalDate)
                      ) : (
                        <span className="text-red-600">{t("pending")}...</span>
                      )}
                    </td>
                    <td className="px-4 py-4 border border-slate-200 text-slate-700">
                      {cert.responsiblePerson}
                    </td>
                    <td className="px-4 py-4 border border-slate-200 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cert.status === "Valid" || cert.status === t("valid")
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {cert.status === "Valid" || cert.status === t("valid")
                          ? t("valid")
                          : t("expired")}
                      </span>
                    </td>
                    <td className="px-4 py-4 border border-slate-200 text-center">
                      <button className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <MoreVertical size={14} className="text-white" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="bg-white border-t p-4 flex items-center justify-between flex-shrink-0">
        <div className="text-sm text-slate-600">
          {t("showingResults")} {startItem} {t("to")} {endItem} {t("of")}{" "}
          {filteredCertificates.length} {t("results")}
        </div>
        {renderPagination()}
      </div>

      {/* CSR PA — purple/pink bubble */}
      {!isBotOpen && (
        <button
          onClick={() => setIsBotOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          aria-label="Ask CSR PA"
          title="Ask CSR PA"
        >
          <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        </button>
      )}
      {isBotOpen && (
        <BotModules
          onClose={() => setIsBotOpen(false)}
          moduleContext="Compliance Certificate"
          currentVersion="yai1"
          botsFilter={["csr-bot"]}
          initialTopic="Compliance audits"
        />
      )}

      {/* Video Viewer Modal */}
      {selectedVideo && (
        <VideoViewer
          videoPath={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          documentPath={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default ComplianceCertificate;
