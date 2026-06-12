import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  CheckSquare,
  ClipboardList,
  Download,
  BarChart2,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Camera,
  LayoutDashboard,
  List,
  FilePlus,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Video,
  FileText,
} from "lucide-react";
import GeneralAIAgent from "../general-ag";
import { useTranslation } from "../translate/TranslationContext";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";
import {
  DEPARTMENTS,
  S_CRITERIA,
  SCORE_LABELS,
  C,
  DEPT_CHECKLISTS,
} from "./checklist-6s-data";

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const initScores = () =>
  S_CRITERIA.reduce((acc, s) => {
    acc[s.s] = {
      score: 0,
      checkItems: Array(s.items.length).fill(false),
      remarks: "",
    };
    return acc;
  }, {});

const calcTotal = (scores) =>
  Object.values(scores).reduce((sum, v) => sum + (v.score || 0), 0);

const calcGrade = (pct) => {
  if (pct >= 90)
    return {
      grade: "A+",
      cls: "text-emerald-600 bg-emerald-50 border-emerald-200",
      label: "Excellent",
    };
  if (pct >= 75)
    return {
      grade: "A",
      cls: "text-green-600 bg-green-50 border-green-200",
      label: "Good",
    };
  if (pct >= 60)
    return {
      grade: "B",
      cls: "text-yellow-600 bg-yellow-50 border-yellow-200",
      label: "Acceptable",
    };
  if (pct >= 40)
    return {
      grade: "C",
      cls: "text-orange-600 bg-orange-50 border-orange-200",
      label: "Needs Work",
    };
  return {
    grade: "D",
    cls: "text-red-600 bg-red-50 border-red-200",
    label: "Poor",
  };
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const Checklist6S = ({ onBack }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  /* ── page tabs: "dashboard" | "records" | "new" ── */
  const [activeTab, setActiveTab] = useState("dashboard");

  /* ── records state — persisted to localStorage ── */
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem("6s_records_v2");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("6s_records_v2", JSON.stringify(records));
    } catch {}
  }, [records]);

  /* ── filters ── */
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatus] = useState("All");

  /* ── dashboard area card filters ── */
  const [dashAreaFilter, setDashAreaFilter] = useState("All Areas");
  const [dashChecklistFilter, setDashChecklistFilter] =
    useState("All Checklists");
  const [dashCategoryFilter, setDashCategoryFilter] =
    useState("All Categories");

  /* ── records checklist-by-dept view ── */
  const [recDept, setRecDept] = useState(DEPT_CHECKLISTS[0].department);
  const [itemAnswers, setItemAnswers] = useState(() => {
    const init = {};
    DEPT_CHECKLISTS.forEach((d) => {
      init[d.department] = {};
      d.items.forEach((it) => {
        init[d.department][it.id] = { yes: 0, no: 0, remark: "" };
      });
    });

    try {
      const saved = localStorage.getItem("6s_itemAnswers_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge saved data into the template to handle new departments/items
        Object.keys(parsed).forEach((dept) => {
          if (init[dept]) {
            Object.keys(parsed[dept]).forEach((id) => {
              if (init[dept][id]) {
                init[dept][id] = { ...init[dept][id], ...parsed[dept][id] };
              }
            });
          }
        });
      }
    } catch (err) {
      console.error("Error loading itemAnswers:", err);
    }

    return init;
  });
  useEffect(() => {
    try {
      localStorage.setItem("6s_itemAnswers_v2", JSON.stringify(itemAnswers));
    } catch {}
  }, [itemAnswers]);

  const answerItem = (dept, id, field, delta) =>
    setItemAnswers((prev) => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        [id]: {
          ...prev[dept][id],
          [field]: Math.max(0, (prev[dept][id][field] || 0) + delta),
        },
      },
    }));
  const setRemark = (dept, id, val) =>
    setItemAnswers((prev) => ({
      ...prev,
      [dept]: { ...prev[dept], [id]: { ...prev[dept][id], remark: val } },
    }));

  /* ── per-item uploaded evidence images — persisted to localStorage ── */
  const [itemImages, setItemImages] = useState(() => {
    try {
      const saved = localStorage.getItem("6s_itemImages_v2");
      return saved ? JSON.parse(saved) : {};
    } catch (err) {
      console.error("Error loading itemImages:", err);
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("6s_itemImages_v2", JSON.stringify(itemImages));
    } catch {}
  }, [itemImages]);

  const setItemImage = (dept, id, dataUrl) =>
    setItemImages((prev) => ({ ...prev, [`${dept}_${id}`]: dataUrl }));
  const clearItemImage = (dept, id) =>
    setItemImages((prev) => {
      const n = { ...prev };
      delete n[`${dept}_${id}`];
      return n;
    });

  /* ── scoring form ── */
  const [sTab, setSTab] = useState("S1"); // which S tab is active inside form
  const [form, setForm] = useState({
    zone: "",
    department: DEPARTMENTS[0],
    auditor: "",
    auditDate: new Date().toISOString().split("T")[0],
  });
  const [scores, setScores] = useState(initScores());
  const [editingId, setEditingId] = useState(null);

  /* ── view/delete modals ── */
  const [viewRec, setViewRec] = useState(null);
  const [deleteRec, setDeleteRec] = useState(null);
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  /* ── Filtered records ── */
  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    if (deptFilter !== "All" && r.department !== deptFilter) return false;
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    if (
      q &&
      !r.zone.toLowerCase().includes(q) &&
      !r.auditor.toLowerCase().includes(q)
    )
      return false;
    return true;
  });

  /* ── Start edit ── */
  const startEdit = (rec) => {
    setEditingId(rec.id);
    setForm({
      zone: rec.zone,
      department: rec.department,
      auditor: rec.auditor,
      auditDate: rec.auditDate,
    });
    setScores(JSON.parse(JSON.stringify(rec.scores)));
    setSTab("S1");
    setActiveTab("new");
  };

  /* ── Reset form ── */
  const resetForm = () => {
    setEditingId(null);
    setForm({
      zone: "",
      department: DEPARTMENTS[0],
      auditor: "",
      auditDate: new Date().toISOString().split("T")[0],
    });
    setScores(initScores());
    setSTab("S1");
  };

  /* ── Submit ── */
  const handleSubmit = () => {
    if (!form.zone.trim() || !form.auditor.trim()) return;
    const total = calcTotal(scores);
    const status = total > 0 ? "Completed" : "In Progress";

    if (editingId) {
      setRecords((p) =>
        p.map((r) =>
          r.id === editingId
            ? {
                ...r,
                ...form,
                totalScore: total,
                status,
                scores: JSON.parse(JSON.stringify(scores)),
              }
            : r,
        ),
      );
    } else {
      setRecords((p) => [
        {
          id: Date.now(),
          ...form,
          status,
          totalScore: total,
          maxScore: 30,
          scores: JSON.parse(JSON.stringify(scores)),
          photos: [],
          createdAt: new Date().toISOString().split("T")[0],
        },
        ...p,
      ]);
    }
    resetForm();
    setActiveTab("records");
  };

  const handleDelete = () => {
    setRecords((p) => p.filter((r) => r.id !== deleteRec.id));
    setDeleteRec(null);
  };

  /* ── Score helpers ── */
  const setScore = (sKey, val) =>
    setScores((p) => ({ ...p, [sKey]: { ...p[sKey], score: Number(val) } }));
  const toggleCheck = (sKey, idx) =>
    setScores((p) => {
      const next = [...p[sKey].checkItems];
      next[idx] = !next[idx];
      return { ...p, [sKey]: { ...p[sKey], checkItems: next } };
    });
  const setRemarks = (sKey, val) =>
    setScores((p) => ({ ...p, [sKey]: { ...p[sKey], remarks: val } }));

  /* ── Live area summary rows — derived from itemAnswers (updated by Audit Records tab) ── */
  const liveAreaRows = DEPT_CHECKLISTS.map((d) => {
    const dAnswers = itemAnswers[d.department] || {};
    const passed = d.items.reduce(
      (s, it) => s + (dAnswers[it.id]?.yes || 0),
      0,
    );
    const failed = d.items.reduce((s, it) => s + (dAnswers[it.id]?.no || 0), 0);
    return {
      area: d.area,
      checklist: d.checklist,
      category: d.category,
      passed,
      failed,
      submissions: passed + failed,
    };
  });

  /* ── Tab navigation ── */
  const MAIN_TABS = [
    { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { id: "records", label: "Audit Records", Icon: List },
  ];

  const sTabIdx = S_CRITERIA.findIndex((s) => s.s === sTab);
  const canNext = sTabIdx < S_CRITERIA.length - 1;
  const canPrev = sTabIdx > 0;
  const currentS = S_CRITERIA[sTabIdx];

  /* ═══════════════════════════════════════════════════════
       RENDER
    ═══════════════════════════════════════════════════════ */
  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-[200] animate-in fade-in duration-400">
      {/* ── Top Header ── */}
      <div className="bg-white border-b shadow-sm flex-shrink-0 z-[201]">
        <div className="flex items-center gap-4 px-5 py-3">
          {/* back / logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              <ArrowLeft size={15} /> {t("back")}
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-200 hover:scale-110 transition-all"
            >
              <img
                src="/logo.jpg"
                alt="Home"
                className="w-full h-full object-cover"
              />
            </button>
          </div>

          {/* title */}
          <div className="flex-1 flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">
                Checklist 6S Audit
              </h1>
              <p className="text-xs text-slate-500">
                Sort · Set in Order · Shine · Standardize · Sustain · Safety
              </p>
            </div>
          </div>

          {/* quick action */}
          <div className="flex items-center gap-2">
            <button
            onClick={() => setSelectedVideo("/assets/short-video-training/Checklist-6s.mp4",)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
        >
            <Video size={20} className="text-blue-600" />
        </button>
            <button
              onClick={() =>
                setSelectedDocument(
                  "/assets/report-training/Checklist-6s-report.pdf",
                )
              }
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center shrink-0"
              title="Report Training"
            >
              <FileText size={20} className="text-blue-600" />
            </button>
          </div>
        </div>

        {/* ── Main Tab Bar ── */}
        <div className="flex border-t border-slate-100 px-5">
          {MAIN_TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                activeTab === id
                  ? "border-cyan-600 text-cyan-700 bg-cyan-50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon size={15} />
              {label}
              {id === "records" && (
                <span className="ml-1 bg-slate-200 text-slate-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {records.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════ TAB CONTENT ═══════ */}
      <div className="flex-1 overflow-auto">
        {/* ────── DASHBOARD TAB ────── */}
        {activeTab === "dashboard" && (
          <div className="p-6 max-w-7xl mx-auto space-y-5">
            {/* ── Area Summary Cards (matches screenshot) ── */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              {/* 3 filter dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Filter by Area
                  </label>
                  <select
                    value={dashAreaFilter}
                    onChange={(e) => setDashAreaFilter(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="All Areas">All Areas</option>
                    {liveAreaRows.map((r) => (
                      <option key={r.area} value={r.area}>
                        {r.area}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Filter by Checklist
                  </label>
                  <select
                    value={dashChecklistFilter}
                    onChange={(e) => setDashChecklistFilter(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="All Checklists">All Checklists</option>
                    {[...new Set(liveAreaRows.map((r) => r.checklist))].map(
                      (c) => (
                        <option key={c}>{c}</option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Filter by Category
                  </label>
                  <select
                    value={dashCategoryFilter}
                    onChange={(e) => setDashCategoryFilter(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="All Categories">All Categories</option>
                    {[...new Set(liveAreaRows.map((r) => r.category))].map(
                      (c) => (
                        <option key={c}>{c}</option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {/* Area card grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {liveAreaRows
                  .filter((r) => {
                    if (
                      dashAreaFilter !== "All Areas" &&
                      r.area !== dashAreaFilter
                    )
                      return false;
                    if (
                      dashChecklistFilter !== "All Checklists" &&
                      r.checklist !== dashChecklistFilter
                    )
                      return false;
                    if (
                      dashCategoryFilter !== "All Categories" &&
                      r.category !== dashCategoryFilter
                    )
                      return false;
                    return true;
                  })
                  .map((row) => (
                    <div
                      key={row.area}
                      className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                    >
                      {/* Card header */}
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-bold text-slate-800 leading-snug pr-2">
                          {row.area}
                        </span>
                        <span className="flex-shrink-0 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                          {row.submissions} Submissions
                        </span>
                      </div>
                      {/* PASSED / FAILED boxes */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50 border border-green-200 rounded-lg py-3 flex flex-col items-center">
                          <span className="text-3xl font-bold text-green-600 leading-none">
                            {row.passed}
                          </span>
                          <span className="text-xs font-bold text-green-500 mt-1 tracking-wide">
                            PASSED
                          </span>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg py-3 flex flex-col items-center">
                          <span className="text-3xl font-bold text-red-500 leading-none">
                            {row.failed}
                          </span>
                          <span className="text-xs font-bold text-red-400 mt-1 tracking-wide">
                            FAILED
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ────── RECORDS TAB ────── */}
        {activeTab === "records" &&
          (() => {
            const deptData =
              DEPT_CHECKLISTS.find((d) => d.department === recDept) ||
              DEPT_CHECKLISTS[0];
            const deptAnswers = itemAnswers[deptData.department] || {};
            const totalYes = deptData.items.reduce(
              (s, it) => s + (deptAnswers[it.id]?.yes || 0),
              0,
            );
            const totalNo = deptData.items.reduce(
              (s, it) => s + (deptAnswers[it.id]?.no || 0),
              0,
            );
            const total = totalYes + totalNo;
            return (
              <div className="p-6 max-w-7xl mx-auto space-y-5">
                {/* Department tab selector */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 pt-4 pb-0">
                  <div className="flex gap-0 overflow-x-auto border-b border-slate-100">
                    {DEPT_CHECKLISTS.map((d) => (
                      <button
                        key={d.department}
                        onClick={() => setRecDept(d.department)}
                        className={`px-5 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                          recDept === d.department
                            ? "border-cyan-600 text-cyan-700 bg-cyan-50"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {d.department}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Area info + Yes/No/Total summary header */}
                <div className="bg-white border border-l-4 border-l-cyan-500 border-slate-200 rounded-xl shadow-sm p-5 flex items-center justify-between gap-6 flex-wrap">
                  <div>
                    <div className="text-base font-bold text-slate-800">
                      Area: {deptData.area}
                    </div>
                    <div className="text-sm text-slate-500 mt-0.5">
                      Category: {deptData.category}
                    </div>
                    <div className="text-sm text-slate-500">
                      Checklist: {deptData.checklist}
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-bold text-green-500 leading-none">
                        {totalYes}
                      </span>
                      <span className="text-xs font-bold text-slate-400 mt-1">
                        Yes
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-bold text-red-500 leading-none">
                        {totalNo}
                      </span>
                      <span className="text-xs font-bold text-slate-400 mt-1">
                        No
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-bold text-blue-500 leading-none">
                        {total}
                      </span>
                      <span className="text-xs font-bold text-slate-400 mt-1">
                        Total
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checklist item cards — 2-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {deptData.items.map((item) => {
                    const ans = deptAnswers[item.id] || {
                      yes: 0,
                      no: 0,
                      remark: "",
                    };
                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
                      >
                        {/* Note header */}
                        <div className="px-4 pt-4 pb-2">
                          <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
                            <span className="text-slate-500">Note:</span>{" "}
                            {item.note_en}{" "}
                            {item.note_kh && (
                              <span className="text-slate-400 font-normal">
                                {" "}
                                ( {item.note_kh} )
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Yes / No counters */}
                        <div className="flex items-center justify-around px-8 py-3 bg-slate-50/50 border-y border-slate-100/50">
                          <div className="flex flex-col items-center">
                            <span className="text-5xl font-bold text-green-500 leading-none">
                              {ans.yes}
                            </span>
                            <span className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                              Yes
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-5xl font-bold text-red-500 leading-none">
                              {ans.no}
                            </span>
                            <span className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                              No
                            </span>
                          </div>
                        </div>

                        {/* Images row — Standard Ref + Upload Evidence */}
                        <div className="grid grid-cols-2 gap-4 px-4 py-4">
                          <div>
                            <div className="text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-tight">
                              Standard Reference
                            </div>
                            <div className="relative group">
                              <img
                                src={item.refImg}
                                alt="Standard Reference"
                                className="w-full h-32 object-cover rounded-xl border border-slate-200 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-tight">
                              Upload Evidence{" "}
                              <span className="text-slate-400 font-normal italic">
                                (Optional)
                              </span>
                            </div>
                            {(() => {
                              const imgKey = `${deptData.department}_${item.id}`;
                              const previewUrl = itemImages[imgKey];
                              return previewUrl ? (
                                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                                  <img
                                    src={previewUrl}
                                    alt="Evidence"
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    onClick={() =>
                                      clearItemImage(
                                        deptData.department,
                                        item.id,
                                      )
                                    }
                                    className="absolute top-2 right-2 w-7 h-7 bg-red-500/90 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                                    title="Remove image"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <label className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/50 transition-all text-slate-400 group">
                                  <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      const reader = new FileReader();
                                      reader.onload = (ev) =>
                                        setItemImage(
                                          deptData.department,
                                          item.id,
                                          ev.target.result,
                                        );
                                      reader.readAsDataURL(file);
                                      e.target.value = "";
                                    }}
                                  />
                                  <Camera
                                    size={22}
                                    className="group-hover:text-cyan-500 transition-colors"
                                  />
                                  <p className="text-[10px] text-center leading-tight px-3 mt-1">
                                    <span className="text-cyan-600 font-bold">
                                      Click to upload
                                    </span>{" "}
                                    or drag and drop
                                  </p>
                                  <p className="text-[9px] opacity-70">
                                    PNG, JPG (MAX. 5MB)
                                  </p>
                                </label>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Remark */}
                        <div className="px-4 pb-5">
                          <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-tight">
                            Remark
                          </label>
                          <input
                            type="text"
                            placeholder="Add remark..."
                            value={ans.remark}
                            onChange={(e) =>
                              setRemark(
                                deptData.department,
                                item.id,
                                e.target.value,
                              )
                            }
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50 shadow-inner"
                          />
                        </div>

                        {/* Yes / No action buttons */}
                        <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                          <button
                            onClick={() =>
                              answerItem(deptData.department, item.id, "yes", 1)
                            }
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 text-sm transition-all rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() =>
                              answerItem(deptData.department, item.id, "no", 1)
                            }
                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 text-sm transition-all rounded-xl shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:-translate-y-0.5"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

        {/* ────── NEW / EDIT AUDIT TAB ────── */}
        {activeTab === "new" && (
          <div className="p-6 max-w-4xl mx-auto space-y-5">
            {/* Basic Info Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-slate-800 px-5 py-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">
                  {editingId ? "✏️ Edit Audit" : "📋 New 6S Audit"}
                </h2>
                <button
                  onClick={resetForm}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </div>
              <div className="p-5 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Zone / Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.zone}
                    onChange={(e) => setForm({ ...form, zone: e.target.value })}
                    placeholder="e.g. Sewing Line A"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Auditor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.auditor}
                    onChange={(e) =>
                      setForm({ ...form, auditor: e.target.value })
                    }
                    placeholder="Auditor full name"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Audit Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.auditDate}
                    onChange={(e) =>
                      setForm({ ...form, auditDate: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              {/* Photo stub */}
              <div className="px-5 pb-5">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-center gap-3 text-slate-400 hover:border-cyan-400 hover:text-cyan-500 transition-colors cursor-pointer">
                  <Camera size={18} />
                  <span className="text-sm">
                    Click to attach photos / evidence
                  </span>
                </div>
              </div>
            </div>

            {/* ── 6S Tabbed Scoring ── */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              {/* S Tab bar */}
              <div className="border-b border-slate-200 bg-slate-50 px-4 flex overflow-x-auto gap-0">
                {S_CRITERIA.map((s) => {
                  const col = C[s.color];
                  const sScore = scores[s.s]?.score ?? 0;
                  const active = sTab === s.s;
                  return (
                    <button
                      key={s.s}
                      onClick={() => setSTab(s.s)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                        active
                          ? `border-current ${col.text} bg-white`
                          : "border-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white ${col.badge}`}
                      >
                        {s.s}
                      </span>
                      <span className="hidden md:inline">{s.label}</span>
                      {/* mini score badge */}
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${sScore > 0 ? col.light : "bg-slate-100 text-slate-400"}`}
                      >
                        {sScore}/5
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* S content panel */}
              {(() => {
                const s = currentS;
                const col = C[s.color];
                const sData = scores[s.s];
                return (
                  <div className="p-6">
                    {/* S header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 ${col.badge} rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md`}
                        >
                          {s.s}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-base">
                            {s.fullLabel}
                          </div>
                          <div className="text-xs text-slate-500">
                            {s.description}
                          </div>
                        </div>
                      </div>
                      {/* Score selector */}
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-bold text-slate-600">
                          Score:
                        </label>
                        <select
                          value={sData.score}
                          onChange={(e) => setScore(s.s, e.target.value)}
                          className={`border-2 ${col.ring} rounded-lg px-3 py-2 text-sm font-bold focus:outline-none`}
                        >
                          {SCORE_LABELS.map(({ val, text }) => (
                            <option key={val} value={val}>
                              {text}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span>Score Progress</span>
                        <span className="font-bold">
                          {sData.score} / 5 (
                          {((sData.score / 5) * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${col.badge} rounded-full transition-all duration-500`}
                          style={{ width: `${(sData.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Check items */}
                    <div className="mb-5">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
                        Checklist Items
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {s.items.map((item, idx) => (
                          <label
                            key={idx}
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${sData.checkItems[idx] ? `${col.ring} border` : "bg-slate-50 border-slate-200 hover:bg-slate-100"}`}
                          >
                            <input
                              type="checkbox"
                              checked={sData.checkItems[idx]}
                              onChange={() => toggleCheck(s.s, idx)}
                              className="w-4 h-4 mt-0.5 flex-shrink-0 accent-cyan-600 cursor-pointer"
                            />
                            <span className="text-sm text-slate-700 leading-snug">
                              {item}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Remarks */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Findings / Remarks
                      </label>
                      <textarea
                        rows={3}
                        placeholder={`Describe findings for ${s.fullLabel}...`}
                        value={sData.remarks}
                        onChange={(e) => setRemarks(s.s, e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                      />
                    </div>

                    {/* S nav buttons */}
                    <div className="flex items-center justify-between mt-5">
                      <button
                        onClick={() =>
                          canPrev && setSTab(S_CRITERIA[sTabIdx - 1].s)
                        }
                        disabled={!canPrev}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={15} /> Previous
                      </button>

                      {/* Running total */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">
                          Running total:
                        </span>
                        <span className="text-lg font-bold text-slate-800">
                          {calcTotal(scores)}/30
                        </span>
                        {(() => {
                          const g = calcGrade((calcTotal(scores) / 30) * 100);
                          return (
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full border ${g.cls}`}
                            >
                              {g.grade}
                            </span>
                          );
                        })()}
                      </div>

                      {canNext ? (
                        <button
                          onClick={() => setSTab(S_CRITERIA[sTabIdx + 1].s)}
                          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-colors"
                        >
                          Next <ChevronRight size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          disabled={!form.zone.trim() || !form.auditor.trim()}
                          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <CheckSquare size={15} />{" "}
                          {editingId ? "Save Changes" : "Submit Audit"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* S Progress Overview strip */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                Score Overview
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {S_CRITERIA.map((s) => {
                  const col = C[s.color];
                  const sScore = scores[s.s]?.score ?? 0;
                  return (
                    <button
                      key={s.s}
                      onClick={() => setSTab(s.s)}
                      className={`flex flex-col items-center p-2 rounded-lg border transition-all ${sTab === s.s ? `ring-2 ring-offset-1 ring-current ${col.text} border-current` : "border-slate-200 hover:border-slate-300"}`}
                    >
                      <div
                        className={`w-8 h-8 ${col.badge} rounded-lg flex items-center justify-center text-white text-xs font-bold mb-1`}
                      >
                        {s.s}
                      </div>
                      <div className="text-xs font-bold text-slate-700">
                        {sScore}/5
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${col.badge}`}
                          style={{ width: `${(sScore / 5) * 100}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════ VIEW MODAL ═══════ */}
      {viewRec && (
        <div className="fixed inset-0 z-[310] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Eye size={18} className="text-blue-600" /> {viewRec.zone}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    startEdit(viewRec);
                    setViewRec(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold hover:bg-yellow-200 transition-colors"
                >
                  <Edit size={13} /> Edit
                </button>
                <button
                  onClick={() => setViewRec(null)}
                  className="w-8 h-8 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Meta */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Zone / Area", viewRec.zone],
                  ["Department", viewRec.department],
                  ["Auditor", viewRec.auditor],
                  ["Audit Date", viewRec.auditDate],
                ].map(([l, v]) => (
                  <div key={l} className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xs text-slate-400">{l}</div>
                    <div className="font-semibold text-slate-800 text-sm mt-0.5">
                      {v}
                    </div>
                  </div>
                ))}
              </div>
              {/* Grade banner */}
              {(() => {
                const pct = (viewRec.totalScore / 30) * 100;
                const g = calcGrade(pct);
                return (
                  <div
                    className={`rounded-xl p-4 border flex items-center justify-between ${g.cls}`}
                  >
                    <div>
                      <div className="text-xs font-semibold opacity-70">
                        Overall Score
                      </div>
                      <div className="text-3xl font-bold">
                        {viewRec.totalScore}{" "}
                        <span className="text-base font-normal">/ 30</span>
                      </div>
                      <div className="text-xs mt-0.5">
                        {pct.toFixed(0)}% — {g.label}
                      </div>
                    </div>
                    <div className="text-6xl font-black opacity-20">
                      {g.grade}
                    </div>
                  </div>
                );
              })()}
              {/* Per-S */}
              {S_CRITERIA.map((s) => {
                const col = C[s.color];
                const sData = viewRec.scores[s.s];
                return (
                  <div
                    key={s.s}
                    className="border border-slate-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 ${col.badge} rounded-lg flex items-center justify-center text-white text-xs font-bold`}
                        >
                          {s.s}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">
                            {s.fullLabel}
                          </div>
                          <div className="text-xs text-slate-400">
                            {s.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-slate-800">
                        {sData?.score ?? 0}
                        <span className="text-xs text-slate-400">/5</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full ${col.badge}`}
                        style={{ width: `${((sData?.score ?? 0) / 5) * 100}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {s.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-1.5 text-xs text-slate-600"
                        >
                          {sData?.checkItems?.[idx] ? (
                            <CheckCircle
                              size={11}
                              className="text-green-500 mt-0.5 flex-shrink-0"
                            />
                          ) : (
                            <AlertTriangle
                              size={11}
                              className="text-amber-400 mt-0.5 flex-shrink-0"
                            />
                          )}
                          {item}
                        </div>
                      ))}
                    </div>
                    {sData?.remarks && (
                      <div className="mt-2 text-xs text-slate-500 italic bg-slate-50 rounded px-2 py-1">
                        {sData.remarks}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════ DELETE CONFIRM ═══════ */}
      {deleteRec && (
        <div className="fixed inset-0 z-[310] bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h2 className="text-base font-bold text-slate-800 mb-2">
              Delete Audit
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Delete <strong>{deleteRec.zone}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteRec(null)}
                className="px-5 py-2 border border-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bot ── */}
      <button
        onClick={() => setIsBotOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </button>
      {isBotOpen && (
        <GeneralAIAgent
          onClose={() => setIsBotOpen(false)}
          moduleContext="Checklist 6S Audit"
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

export default Checklist6S;
