import React from "react";
import { IconRenderer } from "./IconRenderer";

// Each tile reads left-to-right, then down: input, quality activity, recorded result.
// Keeping one drawing system makes the process visible without the old mixed artwork.
const FLOWS = {
  "QC File": ["FileText", "Search", "FileCheck"],
  "Pre Production Meeting": ["FileText", "Users", "CheckCircle"],
  "Cutting Panel Inspection": ["Layers", "Scissors", "ClipboardCheck"],
  "First Output Cutting": ["Scissors", "Shirt", "CheckCircle"],
  "QA Cutting": ["Scissors", "Search", "FileCheck"],
  "Cutting Inspection": ["Layers", "Scissors", "FileCheck"],
  "First Output Printing Embroidery": ["Shirt", "GarmentDecoration", "CheckCircle"],
  "Printing Inspection": ["Shirt", "GarmentPrint", "FileCheck"],
  "Embroidery Inspection": ["Shirt", "IndustrialEmbroidery", "FileCheck"],
  "QA Printing Embroidery": ["Shirt", "GarmentDecoration", "ClipboardCheck"],
  "First Output Sewing": ["Shirt", "Settings2", "CheckCircle"],
  "QC End Line Checking": ["Shirt", "Search", "CheckCircle"],
  "Inline Auditor": ["Shirt", "GaugeCircle", "FileCheck"],
  "Internal Roaming QC (IRQC)": ["Shirt", "Search", "FileCheck"],
  "Garment Check Out": ["Shirt", "CheckCircle", "Package"],
  "20pcs QA Audit": ["Shirt", "Search", "ClipboardCheck"],
  "Finishing Inspection": ["Shirt", "Search", "ClipboardCheck"],
  "Ironing Inspection": ["Shirt", "Thermometer", "CheckCircle"],
  "Humidity Aquaboy Checking": ["Droplets", "GaugeCircle", "CheckCircle"],
  "Offline Audit": ["Package", "Search", "ClipboardCheck"],
  "Packing Inspection": ["Shirt", "Package", "CheckCircle"],
  "QA Audit Finishing Packing": ["Package", "Search", "FileCheck"],
  "Fin Check": ["Package", "ClipboardCheck", "CheckCircle"],
  "Pre Final Inspection": ["Package", "Eye", "FileCheck"],
  "Final Inspection": ["Package", "Search", "FileCheck"],
  "Buyer Final Inspection": ["Package", "Users", "CheckCircle"],
  "First Output Tracker": ["ClipboardCheck", "Shirt", "Package"],
  "First Output Finishing And Packing": ["ClipboardCheck", "Shirt", "Package"],
  "Master Dashboard": ["FileCheck", "BarChart3", "LayoutDashboard"],
  Dashboard: ["FileCheck", "BarChart3", "LayoutDashboard"],
  "Report Filing Agent": ["ClipboardCheck", "BarChart3", "FileText"],
  Report: ["ClipboardCheck", "BarChart3", "FileText"],
  "Customer CAP": ["AlertTriangle", "Search", "Wrench"],
  "Customer Complaint CAP": ["AlertTriangle", "Search", "Wrench"],
  "Supplier Evaluation": ["Truck", "Search", "CheckSquare"],
};

function DecorationActivity({ type, style }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "GarmentPrint") {
    return (
      <svg viewBox="0 0 44 44" width="41" height="41" style={style} {...common}>
        <path d="m14 7-8 5-3 9 6 3 3-4v17h20V20l3 4 6-3-3-9-8-5-3 4H17z" />
        <rect x="16" y="19" width="12" height="11" rx="1" />
        <path d="M18 22h8m-8 3h8m-8 3h5" />
      </svg>
    );
  }
  if (type === "IndustrialEmbroidery") {
    return (
      <svg viewBox="0 0 44 44" width="41" height="41" style={style} {...common}>
        <path d="M5 7h34v8H5zm7 8v8m10-8v11m10-11v8M8 23h28" />
        <path d="M22 26v4m-3-2 3 2 3-2" />
        <circle cx="22" cy="34" r="7" />
        <path d="m18 35 3 2 5-5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 44 44" width="41" height="41" style={style} {...common}>
      <path d="m14 8-8 5-2 8 6 3 2-4v18h20V20l2 4 6-3-2-8-8-5-3 4H17z" />
      <rect x="15" y="21" width="9" height="9" rx="1" />
      <path d="M17 24h5m-5 3h5M29 21v9m-3-6h6m-6 3h6m-6 3h6" />
    </svg>
  );
}

export default function YQMSProcessIcon({ title }) {
  const [input, activity, result] = FLOWS[title] || ["FileText", "Search", "FileCheck"];
  const iconStyle = { color: "#2868ed", position: "absolute" };

  return (
    <span className="relative block h-[115px] w-[115px] rounded-2xl border-2 border-blue-500 bg-white shadow-sm" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 115 115" fill="none" aria-hidden="true">
        <path d="M42 30h12m-4-4 4 4-4 4M70 61v10m-4-4 4 4 4-4" stroke="#3475f5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 87h21M15 92h13" stroke="#d7e6ff" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <IconRenderer iconName={input} size={30} strokeWidth={1.6} style={{ ...iconStyle, left: 11, top: 15 }} />
      {activity === "GarmentPrint" || activity === "IndustrialEmbroidery" || activity === "GarmentDecoration"
        ? <DecorationActivity type={activity} style={{ ...iconStyle, left: 56, top: 17 }} />
        : <IconRenderer iconName={activity} size={41} strokeWidth={1.7} style={{ ...iconStyle, left: 56, top: 17 }} />}
      <IconRenderer iconName={result} size={32} strokeWidth={1.6} style={{ ...iconStyle, left: 57, top: 70 }} />
    </span>
  );
}
