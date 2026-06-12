import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Upload,
  Download,
  Share2,
  Edit,
  HelpCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Paperclip,
  CheckCircle,
  FileText,
  MessageSquare,
  Globe,
  RefreshCw,
  Video,
} from "lucide-react";

import { useTranslation } from "../translate/TranslationContext";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";

const AuditQuestions = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("YorkMars");
  const [expandedCategories, setExpandedCategories] = useState(["GMP", "ILO"]);
  const [selectedCategory, setSelectedCategory] = useState("GMP");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const tabs = [
    { id: "YorkMars", label: "Digital Audit YorkMars" },
    { id: "YY", label: "Digital Audit YY" },
    { id: "CA", label: "Digital Audit CA" },
  ];

  const categories = [
    { id: "GMP", label: "GMP", count: 13 },
    { id: "ILO", label: "ILO", count: 197 },
    { id: "WRAP", label: "WRAP", count: 143 },
    { id: "HIGG", label: "HIGG", count: 89 },
    { id: "CTPAT", label: "CTPAT", count: 65 },
    { id: "BSCI", label: "BSCI", count: 120 },
    { id: "BetterWork", label: "Better Work", count: 78 },
  ];

  const questions = [
    {
      id: "1.1",
      ref: "1.1",
      issue: "Management Commitment and Quality Policy",
      content:
        "Does factory establish a quality policy which includes a commitment to meeting requirements and to continuous improvement of the QMS?",
      source: "Document",
      legal: "No legal reference assigned",
      explanation:
        "The formal quality policy was established by executive management and communicated throughout the organization. It clearly outlines the commitment to quality objectives and customer satisfaction, with established review periods for continuous improvement.",
      attachments: "3/7",
      status: "completed",
    },
    {
      id: "1.2",
      ref: "1.2",
      issue: "Organizational Structure and Responsibility",
      content:
        "Is there a clear organizational chart showing the quality management structure and reporting lines?",
      source: "Chart/Document",
      legal: "No legal reference assigned",
      explanation:
        "The facility has a documented organizational chart that identifies personnel responsible for quality control. Reporting lines are clearly defined from production through to the Quality Manager and General Manager.",
      attachments: "2/5",
      status: "partial",
    },
    {
      id: "1.3",
      ref: "1.3",
      issue: "Quality Objectives and Planning",
      content:
        "Are measurable quality objectives established for all relevant functions and levels within the organization?",
      source: "Document",
      legal: "No legal reference assigned",
      explanation:
        "SMART (Specific, Measurable, Achievable, Relevant, Time-bound) quality objectives have been set for each department. Monthly performance reviews are conducted to track progress against these targets.",
      attachments: "1/4",
      status: "completed",
    },
  ];

  const toggleCategory = (id) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans overflow-hidden">
      {/* Top Navigation Header */}
      <div className="bg-[#1e293b] text-white flex items-center justify-between px-4 h-16 flex-shrink-0 shadow-md">
        <div className="flex items-center gap-6">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center h-16">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-full px-6 flex items-center text-sm font-semibold transition-all border-b-4 ${
                  activeTab === tab.id
                    ? "border-blue-500 bg-slate-800 text-white"
                    : "border-transparent hover:bg-slate-700/50 text-slate-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedVideo("/assets/short-video-training/digital-audit.mp4",)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
        >
            <Video size={20} className="text-blue-600" />
        </button>
          <button
            onClick={() =>
              setSelectedDocument(
                "/assets/report-training/Digital-audit-report.pdf",
              )
            }
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300 hover:text-white"
            title="Report Document"
          >
            <FileText size={20} className="text-blue-400" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-500 ml-2">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 font-medium text-sm border whitespace-nowrap">
            <Plus size={16} /> {t("addAudit")}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 font-medium text-sm border whitespace-nowrap">
            <Upload size={16} /> {t("import")}
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 font-medium text-sm whitespace-nowrap group"
            onClick={() => alert("Sync to Google Drive initiated...")}
          >
            <RefreshCw
              size={16}
              className="group-hover:rotate-180 transition-transform duration-500"
            />{" "}
            {t("syncToDrive")}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border rounded-md hover:bg-slate-100 font-medium text-sm whitespace-nowrap">
            <Download size={16} /> {t("export")}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 border border-green-600 rounded-md hover:bg-green-50 font-medium text-sm whitespace-nowrap">
            <Edit size={16} /> {t("editAudit")}
          </button>
          <button className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
            <HelpCircle size={18} />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search questions..."
              className="pl-10 pr-4 py-2 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
          </div>
          <select className="bg-white border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Colors</option>
            <option>Red</option>
            <option>Yellow</option>
            <option>Green</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r flex flex-col flex-shrink-0 overflow-y-auto no-scrollbar">
          <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
              {t("allAudits")}
            </h3>
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">
              782 {t("total")}
            </span>
          </div>

          <div className="flex flex-col">
            {categories.map((cat) => (
              <div key={cat.id} className="border-b last:border-0">
                <button
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    toggleCategory(cat.id);
                  }}
                  className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {expandedCategories.includes(cat.id) ? (
                      <ChevronDown size={14} className="text-slate-400" />
                    ) : (
                      <ChevronRight size={14} className="text-slate-400" />
                    )}
                    <span
                      className={`text-sm font-semibold ${selectedCategory === cat.id ? "text-blue-700" : "text-slate-700"}`}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      selectedCategory === cat.id
                        ? "bg-blue-200 text-blue-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>

                {expandedCategories.includes(cat.id) && (
                  <div className="bg-slate-50/50 py-1">
                    <button className="w-full text-left pl-12 py-2 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                      Section 1: General Info
                    </button>
                    <button className="w-full text-left pl-12 py-2 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                      Section 2: Policy & Management
                    </button>
                    <button className="w-full text-left pl-12 py-2 text-xs text-slate-500 hover:text-blue-600 transition-colors">
                      Section 3: Operations
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Question List */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-6">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden flex border hover:shadow-md transition-shadow"
            >
              {/* Question Number Indicator */}
              <div className="w-20 bg-slate-50 flex flex-col items-center pt-6 border-r flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm border-2 border-white">
                  {q.ref}
                </div>
                {q.status === "completed" && (
                  <CheckCircle className="mt-4 text-green-500" size={24} />
                )}
              </div>

              {/* Question Card Content */}
              <div className="flex-1 p-6 flex flex-col gap-5">
                {/* Header Row */}
                <div className="flex gap-4">
                  <div className="w-40 flex-shrink-0 uppercase text-[10px] font-bold text-slate-400 tracking-wider pt-1">
                    {t("issue")}
                  </div>
                  <div className="flex-1 flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 text-lg leading-tight">
                      {q.issue}
                    </h4>
                    <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                      <Paperclip size={14} />
                      {q.attachments} {t("attachments")}
                    </div>
                  </div>
                </div>

                {/* Contents Row */}
                <div className="flex gap-4">
                  <div className="w-40 flex-shrink-0 uppercase text-[10px] font-bold text-slate-400 tracking-wider pt-1">
                    {t("contents")}
                  </div>
                  <div className="flex-1 text-slate-700 text-sm leading-relaxed font-semibold pr-8">
                    {q.content}
                  </div>
                </div>

                {/* Source Row */}
                <div className="flex gap-4">
                  <div className="w-40 flex-shrink-0 uppercase text-[10px] font-bold text-slate-400 tracking-wider pt-1">
                    {t("sourceConsulted")}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-bold border border-blue-200">
                      {q.source}
                    </span>
                  </div>
                </div>

                {/* Legal Reference Row */}
                <div className="flex gap-4">
                  <div className="w-40 flex-shrink-0 uppercase text-[10px] font-bold text-slate-400 tracking-wider pt-1">
                    {t("legalReference")}
                  </div>
                  <div className="flex-1 text-slate-400 italic text-xs">
                    {q.legal}
                  </div>
                </div>

                {/* Explanation Row */}
                <div className="flex gap-4 relative">
                  <div className="w-40 flex-shrink-0 uppercase text-[10px] font-bold text-slate-400 tracking-wider pt-1">
                    {t("explanation")}
                  </div>
                  <div className="flex-1 pr-12">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {q.explanation}
                    </p>
                    <button className="mt-2 text-blue-600 text-xs font-bold hover:underline">
                      {t("seeMore")}
                    </button>
                    <div className="absolute bottom-0 right-0 p-1 cursor-pointer hover:bg-slate-100 rounded text-slate-400">
                      <MoreVertical size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="h-12"></div> {/* Bottom spacer */}
        </div>
      </div>

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

export default AuditQuestions;
