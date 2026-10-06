// YQMS hub — the grouped sub-module cards (one source for AppLayout.handleModuleClick and the
// /dashboard/submenu/yqms direct-URL / back-arrow fallback in SubMenuView).
export const YQMS_CARDS = {
  grouped: true,
  groups: [
    {
      label: "Pre Production",
      cards: [
        {
          title: "QC File",
          icon: "FileText",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/qc-file.jpg",
          action: "/dashboard/yqms/qc-file",
        },
        {
          title: "Pre Production Meeting",
          icon: "Users",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/pre-production-meeting.jpg",
          action: "/dashboard/yqms/pre-production-meeting",
        },
      ],
    },
    {
      label: "Cut",
      cards: [
        {
          title: "Cutting Panel Inspection",
          icon: "Search",
          color:
            "bg-white text-blue-600",
          image:
            "assets/fc/cut-panel-inspection.jpg",
          action: "/dashboard/yqms/cut-panel-inspection",
        },
        {
          title: "First Output Cutting",
          icon: "Scissors",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/first-output-cutting.jpg",
          action: "/dashboard/yqms/first-output-cutting",
        },
        {
          title: "QA Cutting",
          icon: "Search",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/qa-cutting.jpg",
          action: "/dashboard/yqms/qa-cutting",
        },
        {
          title: "Cutting Inspection",
          icon: "Search",
          color:
            "bg-white text-blue-600",
          image:
            "assets/fc/cutting-inspection.jpg",
          action: "/dashboard/yqms/cutting-inspection",
        },
      ],
    },
    {
      label: "Decoration",
      cards: [
        {
          title: "First Output Printing Embroidery",
          icon: "PenTool",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/first-output-printing-embroidery.jpg",
        },
        {
          title: "Printing Inspection",
          icon: "Search",
          color:
            "bg-white text-blue-600",
          image:
            "assets/fc/printing-inspection.jpg",
        },
        {
          title: "Embroidery Inspection",
          icon: "Search",
          color:
            "bg-white text-blue-600",
          image:
            "assets/fc/embroidery-inspection.jpg",
        },
        {
          title: "QA Printing Embroidery",
          icon: "Search",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/qa-printing-embroidery.jpg",
        },
      ],
    },
    {
      label: "Sewing",
      cards: [
        {
          title: "First Output Sewing",
          icon: "PenTool",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/first-output-sewing.jpg",
        },
        {
          title: "QC End Line Checking",
          icon: "CheckCircle",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/qc-end-line-checking.jpg",
        },
        {
          title: "Inline Audit Rolling",
          icon: "FileCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/inline-audit-rolling.jpg",
        },
        {
          title: "Internal Rolling QC",
          icon: "FileCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/fc/internal-rolling-qc.jpg",
          galleryImages: [
            "assets/yqms/internal-rolling-qc/internal-qc-rolling.png",
          ],
        },
        {
          title: "Garment Check Output",
          icon: "CheckCircle",
          color:
            "bg-white text-blue-600",
          image:
            "assets/fc/garment-check-output.jpg",
        },
        {
          title: "QA 20pcs Audit",
          icon: "ClipboardCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/qa-20pcs-audit.jpg",
        },
      ],
    },
    {
      label: "Finishing & Packing",
      cards: [
        {
          title: "Finishing Inspection",
          icon: "ClipboardCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/fc/finishing-inspection.jpg",
        },
        {
          title: "Ironing Inspection",
          icon: "Thermometer",
          color:
            "bg-white text-blue-600",
          image:
            "assets/fc/ironing-inspection.jpg",
          galleryImages: [
            "assets/yqms/irroning-inspection/irroning.png",
          ],
        },
        {
          title:
            "Humidity Aquaboy Checking",
          icon: "Droplets",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/aquaboy-icon.svg",
          galleryImages: [
            "assets/yqms/aquaboy/quaboy1.png",
            "assets/yqms/aquaboy/aquaboy2.png",
            "assets/yqms/aquaboy/aquaboy3.png",
          ],
        },
        {
          title: "Offline Audit",
          icon: "FileCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/offline-audit.jpg",
        },
        {
          title: "Packing Inspection",
          icon: "PackageCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/fc/packing-inspection.jpg",
        },
        {
          title:
            "QA Audit Finishing Packing",
          icon: "ClipboardCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/qa-audit-finishing-packing-icon.svg",
        },
      ],
    },
    {
      label: "Final Inspection",
      cards: [
        {
          title: "Fin Check",
          icon: "ClipboardCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/fincheck-icon.svg",
          action: "/dashboard/yqms/fin-check",
        },
        {
          title: "Pre Final Inspection",
          icon: "Eye",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/pre-final-inspection-icon.svg",
        },
        {
          title: "Final Inspection",
          icon: "Eye",
          color: "bg-white text-blue-600",
          image: "assets/yqms/final-inspection-icon.svg",
        },
        {
          title: "Buyer Final Inspection",
          icon: "Eye",
          color: "bg-white text-blue-600",
          image: "assets/yqms/buyer-final-inspection-icon.svg",
        },
      ],
    },
    {
      label: "Reporting & Compliance",
      cards: [
        {
          title:
            "First Output Finishing And Packing",
          icon: "PackageCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/first-output-finishing-packing-icon.svg",
        },
        {
          title: "Dashboard",
          image:
            "assets/yqms/dashboard-icon.svg",
          color:
            "bg-white text-blue-600",
          action: "/dashboard/yqms/dashboard",
        },
        {
          title: "Report",
          image:
            "assets/yqms/report-icon.svg",
          color:
            "bg-white text-blue-600",
          action: "/dashboard/yqms/report",
        },
        {
          title: "Customer Complaint CAP",
          icon: "AlertTriangle",
          color: "bg-white text-blue-600",
          image: "assets/yqms/customer_complaint_cap_new.png",
        },
        {
          title: "Supplier Evaluation",
          icon: "CheckSquare",
          color: "bg-white text-blue-600",
          image: "assets/yqms/supplier-evaluation-icon.svg",
        },
      ],
    },
  ],
};
