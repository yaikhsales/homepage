import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  X,
  Eye,
  CheckCircle,
  FileText,
  MapPin,
  Calendar,
  MessageCircle,
  Upload,
  Clock,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";
import AuditPlanTimeline from "./audit-timeline";
import AuditCalendar from "./audit-calendar";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";
import { Video } from "lucide-react";

const AuditPlan = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedStageFilter, setSelectedStageFilter] = useState(null);
  const fileInputRef = useRef(null);

  // Create Audit Plan form state
  const [createForm, setCreateForm] = useState({
    auditLocation: "",
    auditStage: "",
    requestedParticipants: "",
    auditFrom: "",
    auditor: "",
    typeOfAudit: "",
    auditName: "",
    specialRequest: "",
    auditDate: new Date().toISOString().split("T")[0],
    auditTime: "09:00",
    preAuditDate: new Date().toISOString().split("T")[0],
    preAuditTime: "09:00",
    files: [],
  });

  const handleCreateFormChange = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setCreateForm((prev) => ({
      ...prev,
      files: [...prev.files, ...selectedFiles],
    }));
  };

  const handleRemoveFile = (index) => {
    setCreateForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();

    // Format dates for display (DD MMM YYYY)
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const newAuditPlan = {
      id: editingPlanId || auditPlans.length + 1,
      location: createForm.auditLocation,
      company: createForm.auditName || "New Company",
      form: createForm.auditFrom,
      // Store all details for editing/viewing later
      details: { ...createForm },
      stages: [
        {
          name: "Pre-Audit",
          date: formatDate(createForm.preAuditDate),
          status: createForm.auditStage === "Pre-Audit" ? "active" : "pending",
        },
        {
          name: "On-site Audit",
          date: formatDate(createForm.auditDate),
          status:
            createForm.auditStage === "On-site Audit" ? "active" : "pending",
        },
        {
          name: "Reporting",
          date: formatDate(createForm.auditDate),
          status: createForm.auditStage === "Reporting" ? "active" : "pending",
        },
        {
          name: "Post-Audit",
          date: formatDate(createForm.auditDate),
          status: createForm.auditStage === "Post-Audit" ? "active" : "pending",
        },
        {
          name: "Completed",
          date: "",
          status: "pending",
        },
      ],
    };

    if (editingPlanId) {
      setAuditPlans((prev) =>
        prev.map((plan) => (plan.id === editingPlanId ? newAuditPlan : plan)),
      );
      alert("Audit Plan updated successfully!");
    } else {
      setAuditPlans((prev) => [newAuditPlan, ...prev]);
      alert(t("auditPlanCreatedSuccess") || "Audit Plan created successfully!");
    }

    resetForm();
  };

  const resetForm = () => {
    setIsCreateModalOpen(false);
    setEditingPlanId(null);
    setIsViewMode(false);
    setCreateForm({
      auditLocation: "",
      auditStage: "",
      requestedParticipants: "",
      auditFrom: "",
      auditor: "",
      typeOfAudit: "",
      auditName: "",
      specialRequest: "",
      auditDate: new Date().toISOString().split("T")[0],
      auditTime: "09:00",
      preAuditDate: new Date().toISOString().split("T")[0],
      preAuditTime: "09:00",
      files: [],
    });
  };

  const parseDateToISO = (dateStr) => {
    // Helper to convert "08 Dec 202x" or "18 Feb 2026" to "YYYY-MM-DD"
    // Note: "202x" year will result in Invalid Date usually, handle carefully
    if (!dateStr) return new Date().toISOString().split("T")[0];
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
    return new Date().toISOString().split("T")[0];
  };

  const handleEdit = (plan) => {
    setEditingPlanId(plan.id);
    setIsViewMode(false);

    // Populate form with existing data or defaults
    // Since we only just added 'details' to new items, legacy items might miss fields.
    const details = plan.details || {};

    // Attempt to extract dates from stages if not in details
    const preAuditStage = plan.stages.find((s) => s.name === "Pre-Audit");
    const onSiteStage = plan.stages.find((s) => s.name === "On-site Audit");
    const activeStage = plan.stages.find(
      (s) => s.status === "active" || s.status === "in-progress",
    );

    setCreateForm({
      auditLocation: details.auditLocation || plan.location,
      auditStage: details.auditStage || (activeStage ? activeStage.name : ""),
      requestedParticipants: details.requestedParticipants || "",
      auditFrom: details.auditFrom || plan.form,
      auditor: details.auditor || "",
      typeOfAudit: details.typeOfAudit || "",
      auditName: details.auditName || plan.company,
      specialRequest: details.specialRequest || "",
      auditDate: details.auditDate || parseDateToISO(onSiteStage?.date),
      auditTime: details.auditTime || "09:00",
      preAuditDate: details.preAuditDate || parseDateToISO(preAuditStage?.date),
      preAuditTime: details.preAuditTime || "09:00",
      files: details.files || [],
    });

    setIsCreateModalOpen(true);
  };

  const handleView = (plan) => {
    handleEdit(plan); // Re-use population logic
    setIsViewMode(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      setAuditPlans((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const openImageModal = (imagePath) => {
    setSelectedImage(imagePath);
    setIsImageModalOpen(true);
  };

  // Sample audit plan data
  const [auditPlans, setAuditPlans] = useState(() => {
    const savedPlans = localStorage.getItem("auditPlans");
    if (savedPlans && JSON.parse(savedPlans).length > 0) {
      return JSON.parse(savedPlans);
    }
    return [
      {
        id: 1,
        location: "Yorkmars (Cambodia) Garment MFG Co., LTD",
        company: "Yorkmars (Cambodia) Garment MFG Co., LTD",
        form: "CTPAT",
        details: {
          auditLocation: "Yorkmars (Cambodia) Garment MFG Co., LTD",
          auditName: "Yorkmars (Cambodia) Garment MFG Co., LTD",
          auditFrom: "CTPAT",
          auditor: "BV",
          auditDate: "2026-01-16",
          auditStage: "Reporting",
          preAuditDate: "2026-01-10",
        },
        stages: [
          { name: "Pre-Audit", date: "10 Jan 2026", status: "completed" },
          { name: "On-site Audit", date: "16 Jan 2026", status: "completed" },
          { name: "Reporting", date: "16 Jan 2026", status: "active" },
          { name: "Post-Audit", date: "", status: "pending" },
          { name: "Completed", date: "", status: "pending" },
        ],
      },
      {
        id: 2,
        location: "Yorkmars (Cambodia) Garment MFG Co., LTD",
        company: "Yorkmars (Cambodia) Garment MFG Co., LTD",
        form: "WRAP",
        details: {
          auditLocation: "Yorkmars (Cambodia) Garment MFG Co., LTD",
          auditName: "Yorkmars (Cambodia) Garment MFG Co., LTD",
          auditFrom: "WRAP",
          auditor: "BV",
          auditDate: "2026-01-21",
          auditStage: "Pre-Audit",
          preAuditDate: "2026-01-15",
        },
        stages: [
          { name: "Pre-Audit", date: "15 Jan 2026", status: "active" },
          { name: "On-site Audit", date: "21 Jan 2026", status: "pending" },
          { name: "Reporting", date: "", status: "pending" },
          { name: "Post-Audit", date: "", status: "pending" },
          { name: "Completed", date: "", status: "pending" },
        ],
      },
      {
        id: 3,
        location: "Yorkmars (Cambodia) Garment MFG Co., LTD",
        company: "Yorkmars (Cambodia) Garment MFG Co., LTD",
        form: "HIGG",
        details: {
          auditLocation: "Yorkmars (Cambodia) Garment MFG Co., LTD",
          auditName: "Yorkmars (Cambodia) Garment MFG Co., LTD",
          auditFrom: "HIGG",
          auditor: "IDFL",
          auditDate: "2026-04-22",
          auditStage: "Pre-Audit",
          preAuditDate: "2026-04-15",
        },
        stages: [
          { name: "Pre-Audit", date: "15 Apr 2026", status: "active" },
          { name: "On-site Audit", date: "22 Apr 2026", status: "pending" },
          { name: "Reporting", date: "", status: "pending" },
          { name: "Post-Audit", date: "", status: "pending" },
          { name: "Completed", date: "", status: "pending" },
        ],
      },
      {
        id: 4,
        location: "Yorkmars (Cambodia) Garment MFG Co., LTD",
        company: "Yorkmars (Cambodia) Garment MFG Co., LTD",
        form: "ILO",
        details: {
          auditLocation: "Yorkmars (Cambodia) Garment MFG Co., LTD",
          auditName: "Yorkmars (Cambodia) Garment MFG Co., LTD",
          auditFrom: "ILO",
          auditor: "ILO",
          auditDate: "2026-06-03",
          auditStage: "Pre-Audit",
          preAuditDate: "2026-05-28",
        },
        stages: [
          { name: "Pre-Audit", date: "28 May 2026", status: "active" },
          { name: "On-site Audit", date: "03 Jun 2026", status: "pending" },
          { name: "Reporting", date: "", status: "pending" },
          { name: "Post-Audit", date: "", status: "pending" },
          { name: "Completed", date: "", status: "pending" },
        ],
      },
      {
        id: 5,
        location: "Yorkmars (Cambodia) Garment MFG Co., LTD",
        company: "Yorkmars (Cambodia) Garment MFG Co., LTD",
        form: "BSCI",
        details: {
          auditLocation: "Yorkmars (Cambodia) Garment MFG Co., LTD",
          auditName: "Yorkmars (Cambodia) Garment MFG Co., LTD",
          auditFrom: "BSCI",
          auditor: "BV",
          auditDate: "2026-05-26",
          auditStage: "Pre-Audit",
          preAuditDate: "2026-05-20",
        },
        stages: [
          { name: "Pre-Audit", date: "20 May 2026", status: "active" },
          { name: "On-site Audit", date: "26 May 2026", status: "pending" },
          { name: "Reporting", date: "", status: "pending" },
          { name: "Post-Audit", date: "", status: "pending" },
          { name: "Completed", date: "", status: "pending" },
        ],
      },
    ];
  });

  // Save to localStorage whenever auditPlans changes
  useEffect(() => {
    localStorage.setItem("auditPlans", JSON.stringify(auditPlans));
  }, [auditPlans]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleSearch = () => {
    console.log("Search:", searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
  };

  // Calculate counts for each stage based on active audit plans
  const stageCounts = auditPlans.reduce((acc, plan) => {
    // Find the current active stage for this plan
    const activeStage = plan.stages.find(
      (s) => s.status === "active" || s.status === "in-progress",
    );
    if (activeStage) {
      acc[activeStage.name] = (acc[activeStage.name] || 0) + 1;
    } else {
      // Check if completed
      const completedStage = plan.stages.find(
        (s) => s.name === "Completed" && s.status === "completed",
      );
      if (completedStage) {
        acc["Completed"] = (acc["Completed"] || 0) + 1;
      }
    }
    return acc;
  }, {});

  const filteredPlans = auditPlans.filter((plan) => {
    const matchesSearch =
      searchTerm === "" ||
      plan.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.form.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = selectedStageFilter
      ? plan.stages.some(
          (s) =>
            s.name === selectedStageFilter &&
            (s.status === "active" ||
              s.status === "in-progress" ||
              s.status === "completed"),
        )
      : // Or strictly matching current active stage?
        // Usually "filter by stage" means "show plans currently in this stage"
        // Let's refine: show plans where this stage is ACTIVE or IN-PROGRESS.
        // If filtering by "Completed", show plans where "Completed" stage is active/completed.
        // To be simple: check if the plan's current active stage matches selectedStageFilter.
        // We can find the active stage of the plan.
        true;

    if (selectedStageFilter) {
      const activeStage = plan.stages.find(
        (s) => s.status === "active" || s.status === "in-progress",
      );
      if (activeStage) {
        return matchesSearch && activeStage.name === selectedStageFilter;
      }
      // If no active stage found (maybe all pending or something), it won't match.
      // Special case: Completed plans might have 'Completed' status on the last stage.
      if (selectedStageFilter === "Completed") {
        const completedStage = plan.stages.find(
          (s) => s.name === "Completed" && s.status === "completed",
        );
        return matchesSearch && !!completedStage;
      }
      return false;
    }

    return matchesSearch;
  });

  const renderProcessFlow = (
    stages,
    isMainFlow = false,
    onStageClick = null,
    badges = {},
  ) => {
    const stageNameMap = {
      "Pre-Audit": t("preAudit"),
      "On-site Audit": t("onSiteAudit"),
      Reporting: t("reporting"),
      "Reporting & Assessment": t("reportingAssessment"),
      "Post-Audit": t("postAudit"),
      Completed: t("completed"),
    };

    const stageColors = {
      "Pre-Audit": isMainFlow ? "bg-yellow-500" : "bg-blue-500",
      "On-site Audit": "bg-blue-500",
      Reporting: "bg-purple-500",
      "Reporting & Assessment": "bg-purple-500",
      "Post-Audit": "bg-orange-500",
      Completed: "bg-green-500",
    };

    const stageIconMap = {
      "Pre-Audit": FileText,
      "On-site Audit": MapPin,
      Reporting: FileText,
      "Reporting & Assessment": FileText,
      "Post-Audit": MapPin,
      Completed: CheckCircle,
    };

    const flowColors = [
      "bg-yellow-400", // Pre-Audit
      "bg-blue-400", // On-site Audit
      "bg-purple-400", // Reporting
      "bg-orange-400", // Post-Audit
      "bg-green-400", // Completed
    ];

    const flowRingColors = [
      "ring-yellow-300",
      "ring-blue-300",
      "ring-purple-300",
      "ring-orange-300",
      "ring-green-300",
    ];

    return (
      <div className="flex items-center gap-2 relative">
        {stages.map((stage, idx) => {
          const Icon = stageIconMap[stage.name] || FileText;
          const isActive =
            stage.status === "active" ||
            stage.status === "completed" ||
            stage.status === "in-progress";
          const isCompleted = stage.status === "completed";
          const isInProgress = stage.status === "in-progress";
          const isPending = stage.status === "pending";
          const lineColor = isMainFlow
            ? "bg-blue-500"
            : isCompleted || isInProgress
              ? "bg-green-500"
              : "bg-slate-300";

          const activeColor =
            isMainFlow && idx < flowColors.length
              ? flowColors[idx]
              : stageColors[stage.name] || "bg-blue-500";

          const activeRingColor =
            isMainFlow && idx < flowRingColors.length
              ? flowRingColors[idx]
              : "ring-blue-300";

          return (
            <React.Fragment key={idx}>
              <div
                className={`flex flex-col items-center relative z-10 ${onStageClick ? "cursor-pointer group" : ""}`}
                onClick={() => onStageClick && onStageClick(stage.name)}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 relative shadow-lg ring-4
                    ${
                      isMainFlow || (isActive && !isPending)
                        ? activeColor
                        : "bg-slate-300"
                    }
                    ${
                      onStageClick && selectedStageFilter === stage.name
                        ? `${activeRingColor} ring-offset-2 scale-110`
                        : "ring-white"
                    }
                    ${onStageClick ? "group-hover:scale-105" : ""}
                  `}
                >
                  {isMainFlow ? (
                    idx === 4 ? (
                      <>
                        <CheckCircle size={24} className="text-white" />
                      </>
                    ) : (
                      <span className="text-white font-bold text-xl">
                        {idx + 1}
                      </span>
                    )
                  ) : (
                    <Icon
                      size={20}
                      className={
                        isActive && !isPending ? "text-white" : "text-slate-500"
                      }
                    />
                  )}

                  {/* Badge Notification */}
                  {badges && badges[stage.name] > 0 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {badges[stage.name]}
                    </div>
                  )}
                </div>

                <div className="mt-3 text-center min-w-[140px]">
                  <div
                    className={`text-sm font-bold mb-0.5 ${isActive && !isPending ? "text-slate-800" : "text-slate-400"}`}
                  >
                    {stageNameMap[stage.name] || stage.name}
                  </div>
                  {stage.date && (
                    <div
                      className={`text-xs ${isActive && !isPending ? "text-slate-500" : "text-slate-400"}`}
                    >
                      ({stage.date})
                    </div>
                  )}
                </div>
              </div>
              {idx < stages.length - 1 && (
                <div
                  className={`h-1 flex-1 ${lineColor} -mx-4 mt-7 rounded-full`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col animate-in fade-in duration-500 z-[200]">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center justify-between flex-shrink-0 shadow-sm relative z-[201]">
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
            {t("auditPlan")}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedVideo("/assets/short-video-training/audit-plan.mp4")}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
        >
            <Video size={20} className="text-blue-600" />
        </button>
          <button
            onClick={() =>
              setSelectedDocument(
                "/assets/report-training/Audit-plan-report.pdf",
              )
            }
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center shrink-0"
            title="Report Training"
          >
            <FileText size={20} className="text-blue-600" />
          </button>
          <button
            onClick={() => setIsCalendarOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 flex-shrink-0 ml-2"
          >
            <Calendar size={16} />
            {t("calendar")}
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-slate-50 p-4 border-b flex items-center gap-4 flex-shrink-0">
        <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
          {t("search")}:
        </label>
        <div className="flex items-center gap-2 max-w-3xl">
          <input
            type="text"
            placeholder={t("search") + "..."}
            className="w-64 px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
          >
            <Search size={16} />
            {t("search")}
          </button>
          <button
            onClick={handleReset}
            className="bg-white text-slate-700 border border-slate-300 px-6 py-2 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
          >
            <X size={16} />
            {t("reset")}
          </button>
          <button
            onClick={() => setIsCalendarOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
          >
            <Calendar size={16} />
            {t("calendar")}
          </button>
        </div>
      </div>

      {/* Activity Audit Plan Section */}
      <div className="bg-white p-6 border-b flex-shrink-0">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            {t("activityAuditPlan")}
          </h2>
          <p className="text-sm text-slate-600">{t("trackTheProgress")}</p>
        </div>

        {/* Main Process Flow */}
        <div className="mb-6">
          {renderProcessFlow(
            [
              {
                name: "Pre-Audit",
                date: t("planningPreparation"),
                status: "active",
                icon: FileText,
              },
              {
                name: "On-site Audit",
                date: "",
                status: "pending",
                icon: MapPin,
              },
              {
                name: "Reporting & Assessment",
                date: "",
                status: "pending",
                icon: FileText,
              },
              {
                name: "Post-Audit",
                date: t("verificationFinal"),
                status: "pending",
                icon: MapPin,
              },
              {
                name: "Completed",
                date: "",
                status: "pending",
                icon: CheckCircle,
              },
            ],
            true,
            (stageName) => {
              setSelectedStageFilter((prev) =>
                prev === stageName ? null : stageName,
              );
            },
            // Dynamics badge counts from actual data
            stageCounts,
          )}

          {/* Color Legend */}
          {/* <div className="mt-8 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Legend</h3>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-yellow-400 border border-yellow-200"></div>
                <span className="text-sm text-slate-600 font-medium">Pre-Audit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-blue-400 border border-blue-200"></div>
                <span className="text-sm text-slate-600 font-medium">On-Site Audit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-purple-400 border border-purple-200"></div>
                <span className="text-sm text-slate-600 font-medium">Reporting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-orange-400 border border-orange-200"></div>
                <span className="text-sm text-slate-600 font-medium">Post-Audit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-green-400 border border-green-200"></div>
                <span className="text-sm text-slate-600 font-medium">Completed</span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            {t("addAuditPlan")}
          </button>

          <button
            onClick={() => setIsTimelineOpen(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
          >
            {t("viewAuditPlan")}
          </button>
        </div>
      </div>

      {/* Audit Plan List Section */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            {t("auditPlanList")}
          </h2>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-semibold">
              {t("totalReports")}: {filteredPlans.length} {t("reports")}
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-semibold">
              {t("showing")}: {filteredPlans.length} {t("onThisPage")}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th
                  className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left"
                  colSpan={2}
                >
                  {t("auditDetails")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-left">
                  {t("activityProcessFlow")}
                </th>
                <th className="px-4 py-3 border border-slate-200 text-slate-600 font-bold text-xs text-center">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-slate-500">
                    {t("noAuditPlansFound")}
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td
                      className="px-4 py-4 border border-slate-200"
                      colSpan={2}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded text-xs font-bold border border-blue-200">
                          {plan.company}
                        </div>
                        <div className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold shadow-sm">
                          {plan.form}
                        </div>
                        <div className="bg-blue-50 text-blue-600 px-3 py-1.5 border border-blue-100 rounded text-xs font-bold">
                          {plan.details?.auditDate
                            ? new Date(
                                plan.details.auditDate,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                            : ""}
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded text-xs font-bold border border-blue-200">
                          {plan.details?.auditor || "BV"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 border border-slate-200">
                      <div className="py-2">
                        {renderProcessFlow(plan.stages)}
                      </div>
                    </td>
                    <td className="px-4 py-4 border border-slate-200 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(plan)}
                          className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors"
                          title="View"
                        >
                          <Eye size={16} className="text-white" />
                        </button>
                        <button
                          onClick={() => handleEdit(plan)}
                          className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center hover:bg-amber-600 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} className="text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="w-8 h-8 bg-red-500 rounded flex items-center justify-center hover:bg-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bot Button - Bottom Right */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Ask Audit Plan bot"
        title="Ask Audit Plan bot"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Bot Modal for All Modules */}
      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Audit Plan"
        />
      )}

      {/* Audit Plan Calendar View */}
      {isCalendarOpen && (
        <AuditCalendar
          plans={auditPlans}
          onBack={() => setIsCalendarOpen(false)}
          onCreateEvent={() => {
            setIsCalendarOpen(false);
            setIsCreateModalOpen(true);
            setEditingPlanId(null);
            setCreateForm({
              auditLocation: "",
              auditStage: "",
              requestedParticipants: "",
              auditFrom: "",
              auditor: "",
              typeOfAudit: "",
              auditName: "",
              specialRequest: "",
              auditDate: new Date().toISOString().split("T")[0],
              auditTime: "09:00",
              preAuditDate: new Date().toISOString().split("T")[0],
              preAuditTime: "09:00",
              files: [],
            });
          }}
        />
      )}

      {/* Audit Plan Timeline View */}
      {isTimelineOpen && (
        <AuditPlanTimeline
          plans={auditPlans}
          onBack={() => setIsTimelineOpen(false)}
        />
      )}

      {/* Image Preview Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-[300] bg-white flex flex-col animate-in fade-in duration-300">
          {/* Modal Header */}
          <div className="bg-white p-4 border-b flex items-center justify-between flex-shrink-0 shadow-sm relative z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded transition-colors flex-shrink-0 bg-black text-white font-semibold text-sm"
              >
                <ArrowLeft size={16} /> {t("back")}
              </button>
              <h2 className="text-xl font-bold text-slate-800">
                {selectedImage?.includes("calendar")
                  ? t("calendar")
                  : t("auditPlan")}
              </h2>
            </div>
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Content - Full Screen Image */}
          <div className="flex-1 overflow-auto bg-slate-100 p-0 flex items-start justify-center">
            <img
              src={selectedImage}
              alt="Audit Plan Content"
              className="w-full h-auto object-contain min-h-full shadow-2xl"
            />
          </div>
        </div>
      )}
      {/* Create Audit Plan Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl m-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
              <h2 className="text-xl font-bold text-slate-800">
                {isViewMode
                  ? "View Audit Plan"
                  : editingPlanId
                    ? "Edit Audit Plan"
                    : "Create Audit Plan"}
              </h2>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <form onSubmit={handleCreateSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Audit Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Audit Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      disabled={isViewMode}
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500"
                      placeholder="Enter audit location"
                      value={createForm.auditLocation}
                      onChange={(e) =>
                        handleCreateFormChange("auditLocation", e.target.value)
                      }
                    />
                  </div>

                  {/* Audit Stage */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Audit Stage
                    </label>
                    <div className="relative">
                      <select
                        disabled={isViewMode}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white appearance-none disabled:bg-slate-100 disabled:text-slate-500"
                        value={createForm.auditStage}
                        onChange={(e) =>
                          handleCreateFormChange("auditStage", e.target.value)
                        }
                      >
                        <option value="">Select Audit Stage</option>
                        <option value="Pre-Audit">Pre-Audit</option>
                        <option value="On-site Audit">On-site Audit</option>
                        <option value="Reporting">Reporting</option>
                        <option value="Post-Audit">Post-Audit</option>
                      </select>
                      <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Requested Factory Participants */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Requested Factory Participants{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      disabled={isViewMode}
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500"
                      placeholder="Type participants separated by comma"
                      value={createForm.requestedParticipants}
                      onChange={(e) =>
                        handleCreateFormChange(
                          "requestedParticipants",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  {/* Audit From */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Audit From <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      disabled={isViewMode}
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500"
                      placeholder="Enter Audit Form"
                      value={createForm.auditFrom}
                      onChange={(e) =>
                        handleCreateFormChange("auditFrom", e.target.value)
                      }
                    />
                  </div>

                  {/* Auditor */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Auditor <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      disabled={isViewMode}
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500"
                      placeholder="Enter auditor name"
                      value={createForm.auditor}
                      onChange={(e) =>
                        handleCreateFormChange("auditor", e.target.value)
                      }
                    />
                  </div>

                  {/* Type of Audit */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Type of Audit <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      disabled={isViewMode}
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500"
                      placeholder="Type or select visit type"
                      value={createForm.typeOfAudit}
                      onChange={(e) =>
                        handleCreateFormChange("typeOfAudit", e.target.value)
                      }
                    />
                  </div>

                  {/* Audit Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Audit Name
                    </label>
                    <input
                      type="text"
                      disabled={isViewMode}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500"
                      placeholder="Type or select a audit name"
                      value={createForm.auditName}
                      onChange={(e) =>
                        handleCreateFormChange("auditName", e.target.value)
                      }
                    />
                  </div>

                  {/* Special Request */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Special Request
                    </label>
                    <textarea
                      disabled={isViewMode}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white h-[90px] resize-none disabled:bg-slate-100 disabled:text-slate-500"
                      placeholder="Enter any special requests"
                      value={createForm.specialRequest}
                      onChange={(e) =>
                        handleCreateFormChange("specialRequest", e.target.value)
                      }
                    />
                  </div>

                  {/* Audit Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Audit Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        required
                        disabled={isViewMode}
                        type="date"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white pl-10 disabled:bg-slate-100 disabled:text-slate-500"
                        value={createForm.auditDate}
                        onChange={(e) =>
                          handleCreateFormChange("auditDate", e.target.value)
                        }
                      />
                      <Calendar
                        className="absolute left-3 top-3.5 text-slate-500"
                        size={18}
                      />
                    </div>
                  </div>

                  {/* Audit Time */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Audit Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        required
                        disabled={isViewMode}
                        type="time"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500"
                        value={createForm.auditTime}
                        onChange={(e) =>
                          handleCreateFormChange("auditTime", e.target.value)
                        }
                      />
                      <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500">
                        <Clock size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Pre Audit Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Pre Audit Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        required
                        disabled={isViewMode}
                        type="date"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white pl-10 disabled:bg-slate-100 disabled:text-slate-500"
                        value={createForm.preAuditDate}
                        onChange={(e) =>
                          handleCreateFormChange("preAuditDate", e.target.value)
                        }
                      />
                      <Calendar
                        className="absolute left-3 top-3.5 text-slate-500"
                        size={18}
                      />
                    </div>
                  </div>

                  {/* Pre Audit Time */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      Pre Audit Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        required
                        disabled={isViewMode}
                        type="time"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500"
                        value={createForm.preAuditTime}
                        onChange={(e) =>
                          handleCreateFormChange("preAuditTime", e.target.value)
                        }
                      />
                      <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500">
                        <Clock size={18} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Upload size={18} />
                    Upload Files & Images (Multiple)
                  </div>
                  <div className="border border-slate-300 rounded-lg p-1.5 bg-white flex items-center shadow-sm">
                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-800 text-white px-4 py-2 rounded m-0.5 text-sm font-bold hover:bg-slate-700 transition-colors"
                      >
                        Choose files
                      </button>
                    )}
                    <span className="ml-3 text-slate-500 text-sm">
                      {createForm.files.length > 0
                        ? `${createForm.files.length} file(s) chosen`
                        : "No file chosen"}
                    </span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      disabled={isViewMode}
                    />
                  </div>
                  {!isViewMode && (
                    <p className="text-xs text-slate-500">
                      You can select multiple images (JPG, PNG, WEBP) and files
                      (PDF, DOC, XLS, PPT, etc.)
                    </p>
                  )}

                  {/* File List */}
                  {createForm.files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {createForm.files.map((file, idx) => (
                        <div
                          key={idx}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center gap-2 border border-blue-100 font-medium"
                        >
                          <span className="truncate max-w-[150px]">
                            {file.name}
                          </span>
                          {!isViewMode && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="hover:text-blue-900 bg-blue-200 rounded-full p-0.5"
                            >
                              <X size={10} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 pb-2">
                  {!isViewMode && (
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-200"
                    >
                      {editingPlanId ? "Update" : "Submit"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
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

export default AuditPlan;
