import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModuleBotButton from "../components/ModuleBotButton";
import {
  ArrowLeft,
  TrendingUp,
  ChevronDown,
  Search,
  Video,
  FileText,
} from "lucide-react";
import VideoViewer from "../components/VideoViewer";
import DocumentViewer from "../components/DocumentViewer";

// InfoModal component for showing details
const InfoModal = ({ open, onClose, type, data }) => {
  if (!open || !data) return null;
  let title = "";
  let content = null;
  if (type === "line") {
    title = `Line Detail: ${data.line}`;
    content = (
      <div className="space-y-2">
        <div><b>Style:</b> {data.style}</div>
        <div><b>Section:</b> {data.section}</div>
        <div><b>Department:</b> {data.department}</div>
        <div><b>Target:</b> {data.target}</div>
        <div><b>Actual:</b> {data.actual}</div>
        <div><b>Efficiency:</b> {data.efficiency}</div>
        <div><b>Status:</b> {data.status}</div>
      </div>
    );
  } else if (type === "section") {
    title = `Section Analytics: ${data.label}`;
    content = (
      <div className="space-y-2">
        <div><b>Total Lines:</b> {data.linesCount}</div>
        <div><b>Target:</b> {data.target}</div>
        <div><b>Actual:</b> {data.actual}</div>
        <div><b>Efficiency:</b> {data.efficiency}</div>
        <div><b>Status:</b> {data.status}</div>
      </div>
    );
  } else if (type === "department") {
    title = `Department Health: ${data.label}`;
    content = (
      <div className="space-y-2">
        <div><b>Total Sections:</b> {data.sectionsCount}</div>
        <div><b>Target:</b> {data.target}</div>
        <div><b>Actual:</b> {data.actual}</div>
        <div><b>Efficiency:</b> {data.efficiency}</div>
        <div><b>Status:</b> {data.status}</div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-orange-600 text-xl font-black"
        >
          ×
        </button>
        <h3 className="text-xl font-black mb-4 text-orange-600">{title}</h3>
        {content}
      </div>
    </div>
  );
};

const CE_VIDEO_PATH = "/assets/short-video-training/ce.mp4";
const CE_REPORT_PATH = "/assets/report-training/ce-productivity-audit.html";

const Productivity = ({ onBack }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState([]);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [infoModal, setInfoModal] = useState({ open: false, type: null, data: null });
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const toggleSection = (sectionLabel) => {
    setExpandedSections((prev) =>
      prev.includes(sectionLabel)
        ? prev.filter((s) => s !== sectionLabel)
        : [...prev, sectionLabel],
    );
  };

  const lines = [
    {
      id: 1,
      line: "LINE 01",
      style: "Y-7821",
      target: 450,
      actual: 412,
      efficiency: "91.5%",
      status: "ON TRACK",
      section: "SEWING",
      department: "BUILDING 1",
    },
    {
      id: 2,
      line: "LINE 05",
      style: "Y-9902",
      target: 200,
      actual: 145,
      efficiency: "72.5%",
      status: "BEHIND",
      section: "SEWING",
      department: "BUILDING 2",
    },
    {
      id: 3,
      line: "TEAM 1",
      style: "J-0012",
      target: 800,
      actual: 850,
      efficiency: "106.2%",
      status: "EXCELLENT",
      section: "CUTTING",
      department: "BUILDING 1",
    },
    {
      id: 7,
      line: "TEAM 2",
      style: "Mixed",
      target: 1000,
      actual: 950,
      efficiency: "95%",
      status: "ON TRACK",
      section: "CUTTING",
      department: "BUILDING 2",
    },
    {
      id: 21,
      line: "TEAM 3",
      style: "Batch-A",
      target: 1200,
      actual: 1150,
      efficiency: "95.8%",
      status: "ON TRACK",
      section: "CUTTING",
      department: "BUILDING 1",
    },
    {
      id: 4,
      line: "STYLE 1",
      style: "P-5521",
      target: 400,
      actual: 390,
      efficiency: "97.5%",
      status: "ON TRACK",
      section: "PACKING",
      department: "BUILDING 3",
    },
    {
      id: 8,
      line: "STYLE 2",
      style: "Mixed",
      target: 500,
      actual: 525,
      efficiency: "105%",
      status: "EXCELLENT",
      section: "PACKING",
      department: "BUILDING 3",
    },
    {
      id: 20,
      line: "STYLE 3",
      style: "P-5521",
      target: 400,
      actual: 410,
      efficiency: "102.5%",
      status: "EXCELLENT",
      section: "PACKING",
      department: "BUILDING 3",
    },
    {
      id: 5,
      line: "LINE 02",
      style: "Y-7821",
      target: 450,
      actual: 440,
      efficiency: "97.8%",
      status: "ON TRACK",
      section: "SEWING",
      department: "BUILDING 1",
    },
    {
      id: 6,
      line: "LINE 03",
      style: "B-2210",
      target: 400,
      actual: 380,
      efficiency: "95%",
      status: "ON TRACK",
      section: "SEWING",
      department: "BUILDING 1",
    },
    {
      id: 9,
      line: "LINE 04",
      style: "K-990",
      target: 350,
      actual: 310,
      efficiency: "88.5%",
      status: "ON TRACK",
      section: "SEWING",
      department: "BUILDING 2",
    },
    {
      id: 10,
      line: "SAMPLE-L",
      style: "S-001",
      target: 50,
      actual: 48,
      efficiency: "96%",
      status: "ON TRACK",
      section: "SAMPLE ROOM",
      department: "BUILDING 1",
    },
    {
      id: 11,
      line: "FINISHING-1",
      style: "Mixed",
      target: 1200,
      actual: 1150,
      efficiency: "95.8%",
      status: "ON TRACK",
      section: "PACKING",
      department: "BUILDING 3",
    },
    {
      id: 12,
      line: "AUTO-CUT",
      style: "Batch-Z",
      target: 5000,
      actual: 5200,
      efficiency: "104%",
      status: "EXCELLENT",
      section: "CUTTING",
      department: "BUILDING 2",
    },
    {
      id: 13,
      line: "LINE 06",
      style: "Y-7821",
      target: 450,
      actual: 410,
      efficiency: "91.1%",
      status: "ON TRACK",
      section: "SEWING",
      department: "BUILDING 1",
    },
    {
      id: 14,
      line: "LINE 07",
      style: "B-2210",
      target: 400,
      actual: 320,
      efficiency: "80%",
      status: "BEHIND",
      section: "SEWING",
      department: "BUILDING 1",
    },
    {
      id: 15,
      line: "FINISH-02",
      style: "Mixed",
      target: 1500,
      actual: 1550,
      efficiency: "103.3%",
      status: "EXCELLENT",
      section: "FINISHING",
      department: "BUILDING 3",
    },
    {
      id: 16,
      line: "WASH-01",
      style: "Denim-X",
      target: 2000,
      actual: 1850,
      efficiency: "92.5%",
      status: "ON TRACK",
      section: "WASHING",
      department: "BUILDING 4",
    },
    {
      id: 17,
      line: "WASH-02",
      style: "Denim-Y",
      target: 2000,
      actual: 2100,
      efficiency: "105%",
      status: "EXCELLENT",
      section: "WASHING",
      department: "BUILDING 4",
    },
    {
      id: 18,
      line: "LINE 08",
      style: "J-0012",
      target: 300,
      actual: 295,
      efficiency: "98.3%",
      status: "ON TRACK",
      section: "SEWING",
      department: "BUILDING 2",
    },
    {
      id: 19,
      line: "LINE 09",
      style: "K-990",
      target: 350,
      actual: 345,
      efficiency: "98.6%",
      status: "ON TRACK",
      section: "SEWING",
      department: "BUILDING 2",
    },
    {
      id: 22,
      line: "LINE 10",
      style: "Y-7821",
      target: 450,
      actual: 430,
      efficiency: "95.6%",
      status: "EXCELLENT",
      section: "SEWING",
      department: "BUILDING 3",
    },
  ];

  // Logic for Section Aggregation
  const sectionsMap = lines.reduce((acc, curr) => {
    if (!acc[curr.section]) {
      acc[curr.section] = {
        label: curr.section,
        target: 0,
        actual: 0,
        linesCount: 0,
      };
    }
    acc[curr.section].target += curr.target;
    acc[curr.section].actual += curr.actual;
    acc[curr.section].linesCount += 1;
    return acc;
  }, {});

  const sectionsData = Object.values(sectionsMap).map((s) => ({
    ...s,
    efficiency: ((s.actual / s.target) * 100).toFixed(1) + "%",
    status: s.actual / s.target >= 0.95 ? "EXCELLENT" : "ON TRACK",
  }));

  // Logic for Department Aggregation
  const departmentsMap = lines.reduce((acc, curr) => {
    if (!acc[curr.department]) {
      acc[curr.department] = {
        label: curr.department,
        target: 0,
        actual: 0,
        sectionsCount: new Set(),
      };
    }
    acc[curr.department].target += curr.target;
    acc[curr.department].actual += curr.actual;
    acc[curr.department].sectionsCount.add(curr.section);
    return acc;
  }, {});

  const departmentsData = Object.values(departmentsMap).map((d) => ({
    ...d,
    efficiency: ((d.actual / d.target) * 100).toFixed(1) + "%",
    status: d.actual / d.target >= 0.95 ? "EXCELLENT" : "ON TRACK",
    sectionsCount: d.sectionsCount.size,
  }));

  const tabs = [
    { id: "all", label: "Real-time Output", count: lines.length },
    { id: "section", label: "Section", count: sectionsData.length },
    { id: "department", label: "Department", count: departmentsData.length },
  ];

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const handleAction = (type, name) => {
    if (activeTab === "all") {
      // Find line by name
      const line = lines.find((l) => l.line === name);
      setInfoModal({ open: true, type: "line", data: line });
    } else if (activeTab === "section") {
      // Find section by label
      const section = sectionsData.find((s) => s.label === name);
      setInfoModal({ open: true, type: "section", data: section });
    } else if (activeTab === "department") {
      // Find department by label
      const dept = departmentsData.find((d) => d.label === name);
      setInfoModal({ open: true, type: "department", data: dept });
    }
  };

  // Report calculation logic
  const totalLines = lines.length;
  const totalTarget = lines.reduce((sum, l) => sum + l.target, 0);
  const totalActual = lines.reduce((sum, l) => sum + l.actual, 0);
  const avgEfficiency = (lines.reduce((sum, l) => sum + parseFloat(l.efficiency), 0) / totalLines).toFixed(2) + "%";
  const bestLine = lines.reduce((best, l) => parseFloat(l.efficiency) > parseFloat(best.efficiency) ? l : best, lines[0]);
  const worstLine = lines.reduce((worst, l) => parseFloat(l.efficiency) < parseFloat(worst.efficiency) ? l : worst, lines[0]);

  const renderContent = () => {
    if (activeTab === "all") {
      return lines.map((rec, idx) => (
        <tr
          key={rec.id}
          className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-all duration-200`}
        >
          <td className="px-8 py-4 border-r border-b border-slate-200">
            <div className="flex flex-col gap-1">
              <span className="font-black text-slate-800 text-sm tracking-tight text-nowrap">
                {rec.line}
              </span>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-orange-600 uppercase tracking-widest">
                <span>{rec.section}</span>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 border-r border-b border-slate-200 font-black text-slate-500 text-xs">
            {rec.style}
          </td>
          <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-700 font-black text-xs">
            {rec.target}
          </td>
          <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-700 font-black text-xs">
            {rec.actual}
          </td>
          <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
            <div className="flex flex-col items-center">
              <span
                className={`font-black text-sm ${parseFloat(rec.efficiency) >= 95 ? "text-emerald-600" : parseFloat(rec.efficiency) >= 90 ? "text-blue-600" : "text-rose-600"}`}
              >
                {rec.efficiency}
              </span>
              <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${parseFloat(rec.efficiency) >= 95 ? "bg-emerald-500" : parseFloat(rec.efficiency) >= 90 ? "bg-blue-500" : "bg-rose-500"}`}
                  style={{ width: rec.efficiency }}
                ></div>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
            <span
              className={`px-3 py-1 rounded-md text-[9px] font-black tracking-widest border ${
                rec.status === "EXCELLENT" || rec.status === "ON TRACK"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                  : "bg-rose-50 text-rose-600 border-rose-100/50"
              }`}
            >
              {rec.status}
            </span>
          </td>
          <td className="px-8 py-4 border-b border-slate-200">
            <div className="flex items-center justify-end gap-2 text-nowrap">
              <button
                onClick={() => handleAction("View", rec.line)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-600 text-white rounded-lg text-[9px] font-black uppercase hover:bg-orange-700 transition-colors shadow-sm"
              >
                <TrendingUp size={12} strokeWidth={3} />
                Analytics
              </button>
            </div>
          </td>
        </tr>
      ));
    } else if (activeTab === "section") {
      return sectionsData.map((rec, idx) => {
        const isExpanded = expandedSections.includes(rec.label);
        const sectionLines = lines.filter((l) => l.section === rec.label);

        return (
          <React.Fragment key={idx}>
            <tr
              onClick={() => toggleSection(rec.label)}
              className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} cursor-pointer transition-all duration-200 hover:bg-slate-100`}
            >
              <td className="px-8 py-4 border-r border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-1 rounded bg-slate-100 text-slate-400 group-hover:text-orange-600 transition-colors ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <ChevronDown size={16} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-black text-slate-800 text-sm tracking-tight text-nowrap uppercase">
                      {rec.label}
                    </span>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-orange-600 uppercase tracking-widest">
                      <span>Total Units: {rec.linesCount}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 border-r border-b border-slate-200 font-black text-slate-400 text-xs italic">
                Aggregated
              </td>
              <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-700 font-black text-xs">
                {rec.target}
              </td>
              <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-700 font-black text-xs">
                {rec.actual}
              </td>
              <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                <div className="flex flex-col items-center">
                  <span
                    className={`font-black text-sm ${parseFloat(rec.efficiency) >= 95 ? "text-emerald-600" : "text-blue-600"}`}
                  >
                    {rec.efficiency}
                  </span>
                  <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${parseFloat(rec.efficiency) >= 95 ? "bg-emerald-500" : "bg-blue-500"}`}
                      style={{ width: rec.efficiency }}
                    ></div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                <span
                  className={`px-3 py-1 rounded-md text-[9px] font-black tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100/50`}
                >
                  {rec.status}
                </span>
              </td>
              <td className="px-8 py-4 border-b border-slate-200">
                <div className="flex items-center justify-end gap-2 text-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction("View", rec.label);
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-600 text-white rounded-lg text-[9px] font-black uppercase hover:bg-orange-700 transition-colors shadow-sm"
                  >
                    <TrendingUp size={12} strokeWidth={3} />
                    Sec Analytics
                  </button>
                </div>
              </td>
            </tr>
            {isExpanded &&
              sectionLines.map((line) => (
                <tr
                  key={`line-${line.id}`}
                  className="bg-slate-50/30 animate-in slide-in-from-top-1 duration-200"
                >
                  <td className="px-8 py-4 pl-16 border-r border-b border-slate-200">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-700 text-xs tracking-tight">
                        {line.line}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        {line.department}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 font-bold text-slate-500 text-[10px]">
                    {line.style}
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-600 font-bold text-xs">
                    {line.target}
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-600 font-bold text-xs">
                    {line.actual}
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <div className="flex flex-col items-center">
                      <span
                        className={`font-bold text-xs ${parseFloat(line.efficiency) >= 95 ? "text-emerald-600" : parseFloat(line.efficiency) >= 90 ? "text-blue-600" : "text-rose-600"}`}
                      >
                        {line.efficiency}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-widest border ${
                        line.status === "EXCELLENT" ||
                        line.status === "ON TRACK"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                          : "bg-rose-50 text-rose-600 border-rose-100/50"
                      }`}
                    >
                      {line.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 border-b border-slate-200 text-right">
                    <button
                      onClick={() => handleAction("Detail", line.line)}
                      className="text-[9px] font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest"
                    >
                      Line Detail
                    </button>
                  </td>
                </tr>
              ))}
          </React.Fragment>
        );
      });
    } else {
      return departmentsData.map((rec, idx) => (
        <tr
          key={idx}
          className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-all duration-200`}
        >
          <td className="px-8 py-4 border-r border-b border-slate-200">
            <div className="flex flex-col gap-1">
              <span className="font-black text-slate-800 text-sm tracking-tight text-nowrap uppercase">
                {rec.label}
              </span>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-orange-600 uppercase tracking-widest">
                <span>Sections: {rec.sectionsCount}</span>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 border-r border-b border-slate-200 font-black text-slate-400 text-xs italic">
            Dept Output
          </td>
          <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-700 font-black text-xs">
            {rec.target}
          </td>
          <td className="px-4 py-4 border-r border-b border-slate-200 text-center text-slate-700 font-black text-xs">
            {rec.actual}
          </td>
          <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
            <div className="flex flex-col items-center">
              <span
                className={`font-black text-sm ${parseFloat(rec.efficiency) >= 95 ? "text-emerald-600" : "text-blue-600"}`}
              >
                {rec.efficiency}
              </span>
              <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${parseFloat(rec.efficiency) >= 95 ? "bg-emerald-500" : "bg-blue-500"}`}
                  style={{ width: rec.efficiency }}
                ></div>
              </div>
            </div>
          </td>
          <td className="px-4 py-4 border-r border-b border-slate-200 text-center">
            <span
              className={`px-3 py-1 rounded-md text-[9px] font-black tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100/50`}
            >
              {rec.status}
            </span>
          </td>
          <td className="px-8 py-4 border-b border-slate-200">
            <div className="flex items-center justify-end gap-2 text-nowrap">
              <button
                onClick={() => handleAction("View", rec.label)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-600 text-white rounded-lg text-[9px] font-black uppercase hover:bg-orange-700 transition-colors shadow-sm"
              >
                <TrendingUp size={12} strokeWidth={3} />
                Dept Health
              </button>
            </div>
          </td>
        </tr>
      ));
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-[50] font-sans text-slate-900 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 bg-white">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-black text-black tracking-tight uppercase">
              Cut, Sew, Pack Productivity
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
            onClick={() => setSelectedVideo(CE_VIDEO_PATH)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-300"
            title="Video Training"
        >
            <Video size={20} className="text-blue-600" />
        </button>
            <button
              onClick={() => setSelectedDocument(CE_REPORT_PATH)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center shrink-0 border border-slate-200"
              title="Executive Audit Report"
            >
              <FileText size={20} className="text-blue-600" />
            </button>
            <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-600 uppercase">
                Live Tracking
              </span>
            </div>
            <button
              onClick={() => setIsReportOpen(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-xl font-black text-xs shadow hover:bg-orange-700 transition-all"
            >
              Report
            </button>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 -mb-4 transition-all relative ${activeTab === tab.id ? "text-orange-600 font-black" : "text-slate-500 font-bold hover:text-slate-900"}`}
              >
                <span className="text-xs uppercase tracking-widest">
                  {tab.label}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === tab.id ? "bg-orange-50 text-orange-600" : "bg-slate-100 text-slate-600"}`}
                >
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          <div className="relative group w-72">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors"
            />
            <input
              type="text"
              placeholder="Filter view..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-500/5 transition-all"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-100 text-[11px] font-bold text-black uppercase tracking-widest sticky top-0 z-10">
                <th className="px-8 py-4 border-r border-b border-slate-200">
                  {activeTab === "all"
                    ? "Line / Section"
                    : activeTab === "section"
                      ? "Section Name"
                      : "Department Name"}
                </th>
                <th className="px-4 py-4 border-r border-b border-slate-200 font-center">
                  {activeTab === "all" ? "Running Style" : "Level"}
                </th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Daily Target</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Actual Output</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Efficiency</th>
                <th className="px-4 py-4 border-r border-b border-slate-200 text-center">Status</th>
                <th className="px-8 py-4 border-b border-slate-200 text-right whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {renderContent()}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Bot */}
      <InfoModal open={infoModal.open} type={infoModal.type} data={infoModal.data} onClose={() => setInfoModal({ open: false, type: null, data: null })} />
      {/* Use the same ModuleBotButton as other modules for chatbot */}
      <ModuleBotButton
        isOpen={isBotOpen}
        setIsOpen={setIsBotOpen}
        className="fixed bottom-8 right-8 z-[150]"
        module="productivity"
      />
      {isReportOpen && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center print:bg-white print:relative print:inset-auto print:z-auto">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl relative print:shadow-none print:rounded-none print:p-4 print:max-w-full print:w-full print:overflow-visible" style={{ maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box' }} data-print-modal>
            <button
              onClick={() => setIsReportOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-orange-600 text-xl font-black print:hidden"
            >
              ×
            </button>
            <div className="flex justify-between items-center mb-2 print:mb-4">
              <h3 className="text-2xl font-black mb-4 text-orange-600 print:text-black print:text-xl">Productivity Dashboard Report</h3>
              <div className="space-x-2 print:hidden">
                <button
                  className="px-4 py-1.5 bg-orange-600 text-white rounded font-bold text-xs hover:bg-orange-700 transition-all"
                  onClick={() => {
                    // Remove scroll and modal restrictions for print
                    const modal = document.querySelector('[data-print-modal]');
                    if (modal) {
                      modal.style.maxHeight = 'none';
                      modal.style.overflow = 'visible';
                    }
                    setTimeout(() => window.print(), 100);
                  }}
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
            <div className="mb-6 grid grid-cols-3 gap-4 text-base">
              <div className="bg-orange-50 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl font-black text-orange-700">{totalLines}</span>
                <span className="text-xs font-bold text-orange-900 mt-1">Total Lines</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl font-black text-emerald-700">{totalTarget}</span>
                <span className="text-xs font-bold text-emerald-900 mt-1">Total Target</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl font-black text-blue-700">{totalActual}</span>
                <span className="text-xs font-bold text-blue-900 mt-1">Total Actual</span>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 flex flex-col items-center col-span-3">
                <span className="text-lg font-black text-yellow-700">Average Efficiency</span>
                <span className="text-xl font-black text-yellow-900">{avgEfficiency}</span>
              </div>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-emerald-100 rounded-xl p-4 flex flex-col items-center">
                <span className="font-bold text-emerald-700">Best Line</span>
                <span className="font-black text-lg">{bestLine.line}</span>
                <span className="text-xs">{bestLine.section} / {bestLine.department}</span>
                <span className="text-emerald-700 font-black">{bestLine.efficiency}</span>
                <span className="text-xs">Target: {bestLine.target} | Actual: {bestLine.actual}</span>
              </div>
              <div className="bg-rose-100 rounded-xl p-4 flex flex-col items-center">
                <span className="font-bold text-rose-700">Worst Line</span>
                <span className="font-black text-lg">{worstLine.line}</span>
                <span className="text-xs">{worstLine.section} / {worstLine.department}</span>
                <span className="text-rose-700 font-black">{worstLine.efficiency}</span>
                <span className="text-xs">Target: {worstLine.target} | Actual: {worstLine.actual}</span>
              </div>
            </div>
            <h4 className="font-bold text-slate-700 mt-6 mb-2 text-lg">Section Summary</h4>
            <table className="w-full text-xs mb-6 border">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 text-left">Section</th>
                  <th className="p-2 text-right">Lines</th>
                  <th className="p-2 text-right">Target</th>
                  <th className="p-2 text-right">Actual</th>
                  <th className="p-2 text-right">Efficiency</th>
                  <th className="p-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {sectionsData.map((s, i) => (
                  <tr key={i}>
                    <td className="p-2">{s.label}</td>
                    <td className="p-2 text-right">{s.linesCount}</td>
                    <td className="p-2 text-right">{s.target}</td>
                    <td className="p-2 text-right">{s.actual}</td>
                    <td className="p-2 text-right">{s.efficiency}</td>
                    <td className="p-2 text-right">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4 className="font-bold text-slate-700 mt-6 mb-2 text-lg">Department Summary</h4>
            <table className="w-full text-xs mb-6 border">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-right">Sections</th>
                  <th className="p-2 text-right">Target</th>
                  <th className="p-2 text-right">Actual</th>
                  <th className="p-2 text-right">Efficiency</th>
                  <th className="p-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {departmentsData.map((d, i) => (
                  <tr key={i}>
                    <td className="p-2">{d.label}</td>
                    <td className="p-2 text-right">{d.sectionsCount}</td>
                    <td className="p-2 text-right">{d.target}</td>
                    <td className="p-2 text-right">{d.actual}</td>
                    <td className="p-2 text-right">{d.efficiency}</td>
                    <td className="p-2 text-right">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4 className="font-bold text-slate-700 mt-6 mb-2 text-lg">All Lines Detail</h4>
            <div className="overflow-x-auto max-h-64 print:max-h-none">
              <table className="w-full text-xs border">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 text-left">Line</th>
                    <th className="p-2 text-left">Section</th>
                    <th className="p-2 text-left">Department</th>
                    <th className="p-2 text-right">Target</th>
                    <th className="p-2 text-right">Actual</th>
                    <th className="p-2 text-right">Efficiency</th>
                    <th className="p-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l, i) => (
                    <tr key={i}>
                      <td className="p-2">{l.line}</td>
                      <td className="p-2">{l.section}</td>
                      <td className="p-2">{l.department}</td>
                      <td className="p-2 text-right">{l.target}</td>
                      <td className="p-2 text-right">{l.actual}</td>
                      <td className="p-2 text-right">{l.efficiency}</td>
                      <td className="p-2 text-right">{l.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-xs text-slate-400 mt-4 print:hidden">Tip: Use the Print button to save this dashboard as a PDF.</div>
          </div>
        </div>
      )}

      {selectedVideo && (
        <VideoViewer
          videoPath={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {selectedDocument && (
        <DocumentViewer
          documentPath={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default Productivity;
