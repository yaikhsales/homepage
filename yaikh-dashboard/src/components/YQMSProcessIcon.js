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
  "First Output Printing Embroidery": ["FileText", "Printer", "CheckCircle"],
  "Printing Inspection": ["Printer", "Search", "FileCheck"],
  "Embroidery Inspection": ["PenTool", "Search", "FileCheck"],
  "QA Printing Embroidery": ["Printer", "PenTool", "ClipboardCheck"],
  "First Output Sewing": ["Shirt", "Settings2", "CheckCircle"],
  "QC End Line Checking": ["Shirt", "Search", "CheckCircle"],
  "Inline Audit Rolling": ["Shirt", "GaugeCircle", "FileCheck"],
  "Internal Rolling QC": ["Shirt", "Search", "FileCheck"],
  "Garment Check Output": ["Shirt", "CheckCircle", "Package"],
  "QA 20pcs Audit": ["Shirt", "Search", "ClipboardCheck"],
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
  "First Output Finishing And Packing": ["ClipboardCheck", "Shirt", "Package"],
  Dashboard: ["FileCheck", "BarChart3", "LayoutDashboard"],
  Report: ["ClipboardCheck", "BarChart3", "FileText"],
  "Customer Complaint CAP": ["AlertTriangle", "Search", "Wrench"],
  "Supplier Evaluation": ["Truck", "Search", "CheckSquare"],
};

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
      <IconRenderer iconName={activity} size={41} strokeWidth={1.7} style={{ ...iconStyle, left: 56, top: 17 }} />
      <IconRenderer iconName={result} size={32} strokeWidth={1.6} style={{ ...iconStyle, left: 57, top: 70 }} />
    </span>
  );
}
