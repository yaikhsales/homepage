import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Video,
  FileText,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";

const MasterList = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [activeTab, setActiveTab] = useState("new");
  const [currentPage, setCurrentPage] = useState(6);
  const itemsPerPage = 26;

  // Sample purchase request data
  const sampleRequests = [
    {
      code: 1939,
      name: "Hoth Tongiang",
      department: "Admin",
      topic: "For repair",
      progress: {
        requester: "approved",
        head: "approved",
        gm: "pending",
        purchaser: "pending",
        accountant: "pending",
      },
    },
    {
      code: 1938,
      name: "ZHAOWEI",
      department: "Cutting",
      topic: "剪样费",
      progress: {
        requester: "approved",
        head: "approved",
        gm: "pending",
        purchaser: "pending",
        accountant: "pending",
      },
    },
    {
      code: 1937,
      name: "solum sida",
      department: "Admin",
      topic: "New Purchase",
      progress: {
        requester: "approved",
        head: "pending",
        gm: "pending",
        purchaser: "pending",
        accountant: "pending",
      },
    },
    {
      code: 1936,
      name: "von kanda",
      department: "Admin",
      topic: "Pick up luggage at airport",
      progress: {
        requester: "approved",
        head: "approved",
        gm: "pending",
        purchaser: "pending",
        accountant: "pending",
      },
    },
    {
      code: 1935,
      name: "von kanda",
      department: "Admin",
      topic: "Deal on 20/12/2005",
      progress: {
        requester: "approved",
        head: "approved",
        gm: "pending",
        purchaser: "pending",
        accountant: "pending",
      },
    },
    {
      code: 1934,
      name: "LIU MIMINYU",
      department: "HPM",
      topic: "维修材料/生产物料/设备采购/动力采购/开关机油",
      progress: {
        requester: "approved",
        head: "pending",
        gm: "pending",
        purchaser: "pending",
        accountant: "pending",
      },
    },
    {
      code: 1933,
      name: "LIU MIMINYU",
      department: "HPM",
      topic: "维修材料/生产物料/设备采购/动力采购/开关机油",
      progress: {
        requester: "approved",
        head: "pending",
        gm: "pending",
        purchaser: "pending",
        accountant: "pending",
      },
    },
    {
      code: 1932,
      name: "vonn socheata",
      department: "CSK",
      topic: "M&R Wastewater testing",
      progress: {
        requester: "approved",
        head: "pending",
        gm: "pending",
        purchaser: "pending",
        accountant: "pending",
      },
    },
    {
      code: 1931,
      name: "solum sida",
      department: "Admin",
      topic: "New Purchase",
      progress: {
        requester: "approved",
        head: "pending",
        gm: "pending",
        purchaser: "pending",
        accountant: "pending",
      },
    },
    {
      code: 1930,
      name: "LIU MIMINYU",
      department: "HPM",
      topic: "维修材料/生产物料/设备采购/动力采购/开关机油",
      progress: {
        requester: "approved",
        head: "pending",
        gm: "pending",
        purchaser: "pending",
        accountant: "pending",
      },
    },
    {
      code: 1929,
      name: "ZHAOWEI",
      department: "Cutting",
      topic: "Regular Purchase",
      progress: {
        requester: "approved",
        head: "approved",
        gm: "pending",
        purchaser: "pending",
        accountant: "pending",
      },
    },
  ];

  // Generate more requests for pagination
  const generateMoreRequests = () => {
    const moreRequests = [];
    const names = [
      "Hoth Tongiang",
      "ZHAOWEI",
      "solum sida",
      "von kanda",
      "LIU MIMINYU",
      "vonn socheata",
    ];
    const departments = ["Admin", "Cutting", "HPM", "CSK"];
    const topics = [
      "For repair",
      "New Purchase",
      "Regular Purchase",
      "Pick up luggage at airport",
    ];

    for (let i = 1928; i >= 1565; i--) {
      moreRequests.push({
        code: i,
        name: names[i % names.length],
        department: departments[i % departments.length],
        topic: topics[i % topics.length],
        progress: {
          requester: "approved",
          head: i % 2 === 0 ? "approved" : "pending",
          gm: "pending",
          purchaser: "pending",
          accountant: "pending",
        },
      });
    }
    return [...sampleRequests, ...moreRequests];
  };

  const [requests] = useState(generateMoreRequests());
  const totalRequests = requests.length;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const filteredRequests = requests; // Can add filtering logic here based on activeTab

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);
  const startItem = filteredRequests.length > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, filteredRequests.length);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    const pages = [];

    // Show first 10 pages, then ellipsis, then last 2 pages
    for (let i = 1; i <= 10; i++) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(15);
    pages.push(16);

    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-slate-300 rounded text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
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
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  const renderProgress = (progress) => {
    const stages = [
      { key: "requester", label: t("requester") },
      { key: "head", label: t("head") },
      { key: "gm", label: t("gm") },
      { key: "purchaser", label: t("purchaser") },
      { key: "accountant", label: t("accountant") },
    ];

    return (
      <div className="flex items-center gap-2">
        {stages.map((stage, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                progress[stage.key] === "approved"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
            <span className="text-xs text-slate-600">{stage.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col animate-in fade-in duration-500 z-[200]">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center justify-between flex-shrink-0 shadow-sm relative z-[201]">
        <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2">
          <button
            onClick={() =>
              setSelectedVideo("/assets/short-video-training/new-updated-vd/Purchase.mp4")
            }
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
          >
            <Video size={20} className="text-blue-600" />
          </button>
          <button
            onClick={() => setSelectedDocument("/assets/purchase/view-pdf.pdf")}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Report Training"
          >
            <FileText size={20} className="text-blue-600" />
          </button>
        </div>
        <div className="w-32"></div> {/* Left spacer */}
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 rounded transition-colors flex-shrink-0 bg-slate-600 text-white font-semibold text-sm"
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
            {t("purchaseRequest")} - {t("masterList")}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("old")}
            className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
              activeTab === "old"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t("oldData")}
          </button>
          <button
            onClick={() => {
              setActiveTab("new");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
              activeTab === "new"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t("newData")}
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
              activeTab === "my"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t("myRequest")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                  {t("code")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">
                  {t("name")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">
                  {t("department")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">
                  {t("topic")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">
                  {t("progress")}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-500">
                    {t("noRequestsFound")}
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req, idx) => (
                  <tr
                    key={req.code}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-4 border border-slate-200 text-slate-700 text-center font-medium">
                      {req.code}
                    </td>
                    <td className="px-4 py-4 border border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700">
                          {req.name.charAt(0)}
                        </div>
                        <span className="text-slate-700">{req.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 border border-slate-200 text-slate-700">
                      {req.department}
                    </td>
                    <td className="px-4 py-4 border border-slate-200 text-slate-700">
                      {req.topic}
                    </td>
                    <td className="px-4 py-4 border border-slate-200">
                      {renderProgress(req.progress)}
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
          {t("showing")} {startItem} {t("to")} {endItem} {t("of")}{" "}
          {filteredRequests.length} {t("results")}
        </div>
        {renderPagination()}
      </div>

      {/* Bot Button - Bottom Right */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Ask Master List bot"
        title="Ask Master List bot"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Bot Modal */}
      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Master List"
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

export default MasterList;
