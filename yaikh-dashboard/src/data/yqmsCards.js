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
          icon: "Scissors",
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
          icon: "ClipboardCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/qa-cutting.jpg",
          action: "/dashboard/yqms/qa-cutting",
        },
        {
          title: "Cutting Inspection",
          icon: "Scissors",
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
          action: "/dashboard/yqms/first-output-print",
          icon: "Shirt",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/first-output-printing-embroidery.jpg",
          action: "/dashboard/yqms/first-output-print",
        },
        {
          title: "Printing Inspection",
          action: "/dashboard/yqms/printing-inspection",
          icon: "Shirt",
          color:
            "bg-white text-blue-600",
          image:
            "assets/fc/printing-inspection.jpg",
          action: "/dashboard/yqms/printing-inspection",
        },
        {
          title: "Embroidery Inspection",
          action: "/dashboard/yqms/embroidery-inspection",
          icon: "Shirt",
          color:
            "bg-white text-blue-600",
          image:
            "assets/fc/embroidery-inspection.jpg",
          action: "/dashboard/yqms/embroidery-inspection",
        },
        {
          title: "QA Printing Embroidery",
          action: "/dashboard/yqms/qa-print",
          icon: "ClipboardCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/qa-printing-embroidery.jpg",
          action: "/dashboard/yqms/qa-print",
        },
      ],
    },
    {
      label: "Sewing",
      cards: [
        {
          title: "First Output Sewing",
          action: "/dashboard/yqms/first-output-sewing",
          icon: "Shirt",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/first-output-sewing.jpg",
        },
        {
          title: "QC End Line Checking",
          action: "/dashboard/yqms/endline-check",
          icon: "CheckCircle",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/qc-end-line-checking.jpg",
        },
        {
          title: "Inline Auditor",
          action: "/dashboard/yqms/inline-audit",
          icon: "GaugeCircle",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/inline-audit-rolling.jpg",
        },
        {
          title: "Internal Roaming QC (IRQC)",
          action: "/dashboard/yqms/rolling-qc",
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
          title: "Garment Check Out",
          action: "/dashboard/yqms/sewing-output",
          icon: "Shirt",
          color:
            "bg-white text-blue-600",
          image:
            "assets/fc/garment-check-output.jpg",
        },
        {
          title: "20pcs QA Audit",
          action: "/dashboard/yqms/20pcs-audit",
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
          action: "/dashboard/yqms/finishing-inspection",
          icon: "ClipboardCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/fc/finishing-inspection.jpg",
        },
        {
          title: "Ironing Inspection",
          action: "/dashboard/yqms/ironing-inspection",
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
          action: "/dashboard/yqms/aquaboy",
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
          action: "/dashboard/yqms/offline-audit",
          icon: "FileCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/offline-audit.jpg",
        },
        {
          title: "Packing Inspection",
          action: "/dashboard/yqms/packing-inspection",
          icon: "PackageCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/fc/packing-inspection.jpg",
        },
        {
          title:
            "QA Audit Finishing Packing",
          action: "/dashboard/yqms/qa-audit-finishing",
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
          action: "/dashboard/yqms/pre-final",
          icon: "ClipboardCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/pre-final-inspection-icon.svg",
        },
        {
          title: "Final Inspection",
          action: "/dashboard/yqms/final-inspection",
          icon: "FileCheck",
          color: "bg-white text-blue-600",
          image: "assets/yqms/final-inspection-icon.svg",
        },
        {
          title: "Buyer Final Inspection",
          action: "/dashboard/yqms/buyer-final",
          icon: "Users",
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
            "First Output Tracker",
          action: "/dashboard/yqms/first-output-finishing",
          icon: "PackageCheck",
          color:
            "bg-white text-blue-600",
          image:
            "assets/yqms/first-output-finishing-packing-icon.svg",
        },
        {
          title: "Master Dashboard",
          icon: "LayoutDashboard",
          image:
            "assets/yqms/dashboard-icon.svg",
          color:
            "bg-white text-blue-600",
          action: "/dashboard/yqms/dashboard",
        },
        {
          title: "Report Filing Agent",
          icon: "FileText",
          image:
            "assets/yqms/report-icon.svg",
          color:
            "bg-white text-blue-600",
          action: "/dashboard/yqms/report",
        },
        {
          title: "Customer CAP",
          action: "/dashboard/yqms/cap",
          icon: "AlertTriangle",
          color: "bg-white text-blue-600",
          image: "assets/yqms/customer_complaint_cap_new.png",
        },
        {
          title: "Supplier Evaluation",
          action: "/dashboard/yqms/supplier-evaluation",
          icon: "CheckSquare",
          color: "bg-white text-blue-600",
          image: "assets/yqms/supplier-evaluation-icon.svg",
        },
      ],
    },
  ],
};
