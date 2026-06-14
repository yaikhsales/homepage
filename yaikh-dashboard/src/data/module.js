import {
  Users,
  Calculator,
  Layout,
  Briefcase,
  Ticket,
  FileText,
  ShoppingBag,
  User,
  CheckSquare,
  Zap,
  Wind,
  Droplet,
  Globe,
  Mic,
  Trash2,
  Truck,
  AlertTriangle,
  Video,
  Factory,
  Box,
  Settings,
  Layers,
  Clock,
  Tag,
  ShoppingCart,
  UserCog,
  Receipt,
  FlaskConical,
  MonitorPlay,
  ClipboardCheck,
} from "lucide-react";

export const DASHBOARD_DATA = [
  {
    id: "admin-section",
    title: "Administration",
    color: "bg-slate-800/80",
    groups: [
      {
        id: "accountant-col",
        title: "Accountant",
        modules: [
          {
            id: "accountant",
            title: "Accountant",
            image: "IMG/avatars/agent-1.png",
            status: "active",
            demoType: "SUBMENU_PR",
            popupTitle: "ADMINISTRATION · ACCOUNTANT",
            description: "I run the whole accounting function — income, expenses, invoicing, taxes and the company's books — and keep every ledger reconciled in real time."
          },
          {
            id: "iews",
            title: "IEWS",
            image: "IMG/avatars/agent-2.png",
            status: "active",
            popupTitle: "ADMINISTRATION · ACCOUNTANT",
            description: "I handle e-invoicing — issuing and validating invoices through CamInv / the GDT e-invoice system so every invoice is compliant and traceable."
          }
        ]
      },
      {
        id: "billing-col",
        title: "Billing",
        modules: [
          {
            id: "purchase-request",
            title: "Purchase Request",
            image: "IMG/avatars/agent-3.png",
            status: "active",
            demoType: "SUBMENU_PR_ADMIN",
            popupTitle: "ADMINISTRATION · BILLING",
            description: "I handle purchase requests — from raising to approval routing and PO creation."
          },
          {
            id: "bill-claim",
            title: "Bill Claim",
            image: "IMG/avatars/agent-4.png",
            status: "active",
            popupTitle: "ADMINISTRATION · BILLING",
            description: "I process expense and bill claims — submission, approval and reimbursement straight back to the claimant."
          },
          {
            id: "salary-bill",
            title: "Salary Bill",
            image: "IMG/avatars/agent-5.png",
            status: "active",
            demoType: "SUBMENU_SALARY_BILL",
            popupTitle: "ADMINISTRATION · BILLING",
            description: "I run payroll end to end — wages, overtime and deductions — then pay everyone out straight to their ABA or WING account. Each person sees every payment and payslip detail right inside the Yai app."
          },
          {
            id: "shipping-bill",
            title: "Shipping Bill",
            image: "IMG/avatars/agent-38.png",
            status: "active",
            popupTitle: "ADMINISTRATION · BILLING",
            description: "I manage the payment of shipping and freight bills, ensuring all customs duties and transport invoices are accurate, recorded, and paid on time."
          }
        ]
      },
      {
        id: "hr-col",
        title: "HR",
        modules: [
          {
            id: "yhr",
            title: "YHR",
            image: "IMG/avatars/agent-6.png",
            status: "active",
            demoType: "SUBMENU_YHR",
            popupTitle: "ADMINISTRATION · HR",
            description: "I'm the HR core — employee records, contracts, leave and the full worker lifecycle in one place."
          },
          {
            id: "org-chart",
            title: "Org Chart",
            image: "IMG/avatars/agent-7.png",
            status: "active",
            demoType: "SUBMENU_ORG",
            popupTitle: "ADMINISTRATION · HR",
            description: "I keep the company's structure live — every role, reporting line and headcount — and hold all the structural records you need for compliance. The moment someone joins or resigns, the chart updates itself in real time."
          },
          {
            id: "training",
            title: "Training",
            image: "IMG/avatars/agent-8.png",
            status: "active",
            demoType: "SUBMENU_DEPARTMENTS",
            popupTitle: "ADMINISTRATION · HR",
            description: "I plan and track training — schedules, attendance and the skills record for every worker."
          },
          {
            id: "temp-worker",
            title: "Temporary Worker",
            image: "IMG/avatars/agent-9.png",
            status: "active",
            demoType: "SUBMENU_TEMP_WORKER",
            popupTitle: "ADMINISTRATION · HR",
            description: "I manage temporary-worker requests — raising, approving and tracking short-term labour on the floor."
          },
          {
            id: "speak-up",
            title: "Speak Up",
            image: "IMG/avatars/agent-10.png",
            status: "active",
            popupTitle: "ADMINISTRATION · HR",
            description: "I'm the anonymous grievance channel — workers raise concerns safely and I route them to the right people."
          }
        ]
      },
      {
        id: "admin-col",
        title: "Admin",
        modules: [
          {
            id: "support-ticket",
            title: "Support Ticket",
            image: "IMG/avatars/agent-11.png",
            status: "active",
            demoType: "VIEW_TICKET_CUSTOM",
            popupTitle: "ADMINISTRATION · ADMIN",
            description: "I take internal support requests — log, assign and track every ticket to resolution."
          },
          {
            id: "y-shop",
            title: "Y Shop",
            image: "IMG/avatars/agent-12.png",
            status: "active",
            demoType: "GRID_SHOP",
            popupTitle: "ADMINISTRATION · ADMIN",
            description: "I run the internal shop — staff purchases, stock and orders."
          },
          {
            id: "gate-pass",
            title: "Gate Pass",
            image: "IMG/avatars/agent-13.png",
            status: "active",
            demoType: "SUBMENU_VISITOR",
            popupTitle: "ADMINISTRATION · ADMIN",
            description: "I issue and verify gate passes — people and goods in and out, logged and authorised."
          },
          {
            id: "meeting-room",
            title: "Meeting Room",
            image: "IMG/avatars/agent-14.png",
            status: "active",
            demoType: "IMAGE_VIEW",
            popupTitle: "ADMINISTRATION · ADMIN",
            description: "I manage meeting-room bookings — availability, scheduling and conflicts."
          },
          {
            id: "car-booking",
            title: "Car Booking",
            image: "IMG/avatars/agent-15.png",
            status: "active",
            demoType: "IMAGE_VIEW",
            popupTitle: "ADMINISTRATION · ADMIN",
            description: "I handle company-car bookings — requests, allocation and the schedule."
          },
          {
            id: "fire-alarm",
            title: "Fire Alarm",
            image: "IMG/avatars/agent-16.png",
            status: "active",
            popupTitle: "ADMINISTRATION · ADMIN",
            description: "I monitor the fire-alarm and life-safety systems across the whole site."
          },
          {
            id: "cctv",
            title: "CCTV",
            image: "IMG/avatars/agent-17.png",
            status: "active",
            demoType: "SUBMENU_CCTV",
            popupTitle: "ADMINISTRATION · ADMIN",
            description: "I connect to the CCTV system — live and recorded camera access for security."
          }
        ]
      },
      {
        id: "csr-col",
        title: "CSR",
        modules: [
          {
            id: "digital-audit",
            title: "Digital Audit",
            image: "IMG/avatars/agent-18.png",
            status: "active",
            demoType: "SUBMENU_DIGITAL_AUDIT",
            popupTitle: "ADMINISTRATION · CSR",
            description: "I run digital compliance audits — WRAP, BSCI, HIGG and ILO evidence collected and scored automatically."
          },
          {
            id: "energy",
            title: "Energy",
            image: "IMG/avatars/agent-19.png",
            status: "active",
            demoType: "SUBMENU_ENERGY",
            popupTitle: "ADMINISTRATION · CSR",
            description: "I track energy use — kWh, efficiency and renewable share across the factory."
          },
          {
            id: "air",
            title: "Air",
            image: "IMG/avatars/agent-20.png",
            status: "active",
            demoType: "SUBMENU_AIR",
            popupTitle: "ADMINISTRATION · CSR",
            description: "I monitor air emissions — AQI, CO2 and air-quality data for compliance."
          },
          {
            id: "water",
            title: "Water",
            image: "IMG/avatars/agent-21.png",
            status: "active",
            demoType: "SUBMENU_WATER",
            popupTitle: "ADMINISTRATION · CSR",
            description: "I monitor water — usage and effluent/wastewater levels for environmental reporting."
          },
          {
            id: "waste",
            title: "Waste",
            image: "IMG/avatars/agent-22.png",
            status: "active",
            demoType: "SUBMENU_WASTE",
            popupTitle: "ADMINISTRATION · CSR",
            description: "I track waste — solid waste, recycling rates and disposal records."
          },
          {
            id: "chemical",
            title: "Chemical",
            image: "IMG/avatars/agent-23.png",
            status: "active",
            popupTitle: "ADMINISTRATION · CSR",
            description: "I manage chemical inventory and MRSL / ZDHC compliance."
          }
        ]
      },
      {
        id: "shipping-col",
        title: "Shipping",
        modules: [
          {
            id: "shipping",
            title: "Shipping",
            image: "IMG/avatars/agent-24.png",
            status: "active",
            demoType: "SHIPPING_REQUEST",
            popupTitle: "ADMINISTRATION · SHIPPING",
            description: "I handle freight both ways — importing raw materials and machines, and exporting finished goods by FCL and LCL — tracking every container, customs step and delivery end to end."
          }
        ]
      },
      {
        id: "egov-col",
        title: "E-GOV",
        modules: [
          {
            id: "e-government",
            title: "E-Government",
            image: "IMG/avatars/agent-25.png",
            status: "active",
            demoType: "SUBMENU_EGOV",
            popupTitle: "ADMINISTRATION · E-GOV",
            description: "I connect directly to every government portal — the Tax portal, the Customs portal, and each ministry's compliance portal. I also run the communication channel with each government body, handling official PR and correspondence and keeping the systems updated with every new announcement."
          }
        ]
      }
    ]
  },
  {
    id: "management-section",
    title: "Management Dashboard",
    isCentral: true,
    color: "bg-slate-800/80",
    groups: [
      {
        id: "dashboard-col",
        title: "Dashboard",
        modules: [
          {
            id: "management-dashboard",
            title: "Management Dashboard",
            image: "IMG/avatars/agent-28.png",
            status: "active",
            popupTitle: "MANAGEMENT · DASHBOARD",
            description: "I'm the GM's data keeper. Every number in the company runs through me — production, sales, finance, HR, compliance — so the General Manager's single screen knows literally everything, live."
          },
          {
            id: "sop",
            title: "SOP",
            image: "IMG/avatars/agent-27.png",
            status: "active",
            demoType: "VIEW_SOP_MAP",
            popupTitle: "MANAGEMENT · DASHBOARD",
            description: "I'm the process police. Every standard operating procedure lives with me — searchable, versioned and always current — and nobody here does anything without going through my process first."
          }
        ]
      },
      {
        id: "noticeable-col",
        title: "Data Scientist",
        modules: [
          {
            id: "system-analysis",
            title: "System Analysis",
            image: "IMG/avatars/agent-29.png",
            status: "active",
            demoType: "IMAGE_VIEW",
            popupTitle: "MANAGEMENT · NOTICEABLE",
            description: "I run the algorithms for top management. When the chat agent can't give you the answer, I take over — I trace exactly where it went wrong, work out what happened, and fix it."
          }
        ]
      }
    ]
  },
  {
    id: "ops-section",
    title: "Operations",
    color: "bg-slate-800/80",
    groups: [
      {
        id: "qa-col",
        title: "QA",
        modules: [
          {
            id: "yqms",
            title: "YQMS",
            image: "IMG/avatars/agent-30.png",
            status: "active",
            demoType: "SUBMENU_YQMS",
            popupTitle: "OPERATIONS · QA",
            description: "I'm quality management — inline and final QC, defects, AQL and corrective actions."
          },
          {
            id: "call-out",
            title: "Call Out",
            image: "IMG/avatars/agent-31.png",
            status: "active",
            popupTitle: "OPERATIONS · QA",
            description: "I escalate quality issues — flagging defects and calling out the right people the moment something needs attention.",
            highlight: true
          }
        ]
      },
      {
        id: "prod-col",
        title: "Production",
        modules: [
          {
            id: "fc",
            title: "FC",
            image: "IMG/avatars/agent-32.png",
            status: "active",
            demoType: "SUBMENU_FC",
            popupTitle: "OPERATIONS · PRODUCTION",
            description: "I run floor control — line balancing, output and live production status."
          },
          {
            id: "ywip",
            title: "YWIP",
            image: "IMG/avatars/agent-33.png",
            status: "active",
            popupTitle: "OPERATIONS · PRODUCTION",
            description: "I'm all about quantities — from your fabric rolls, to the cut panels, to the finished goods, to the cartons ready to export. Ask me how many, anywhere in the flow."
          },
          {
            id: "ce",
            title: "CE",
            image: "IMG/avatars/agent-34.png",
            status: "active",
            demoType: "SUBMENU_CE",
            popupTitle: "OPERATIONS · PRODUCTION",
            description: "I handle costing & efficiency — SAM, line efficiency and cost per garment."
          },
          {
            id: "ytm",
            title: "YTM",
            image: "IMG/avatars/agent-35.png",
            status: "active",
            popupTitle: "OPERATIONS · PRODUCTION",
            description: "I manage time & motion — SAM studies, method and capacity planning."
          },
          {
            id: "ytm-shop",
            title: "YTM Shop",
            image: "IMG/avatars/agent-36.png",
            status: "active",
            popupTitle: "OPERATIONS · PRODUCTION",
            description: "I'm the shop-floor time view — operation breakdowns right at the station."
          }
        ]
      },
      {
        id: "4dp-col",
        title: "4DP",
        modules: [
          {
            id: "4dp",
            title: "4DP",
            image: "IMG/avatars/agent-37.png",
            status: "active",
            demoType: "IFRAME_VIEW",
            popupTitle: "OPERATIONS · 4DP",
            description: "I'm the production plan — scheduling orders across lines day by day."
          }
        ]
      },
      {
        id: "ypi-col",
        title: "YPI",
        modules: [
          {
            id: "ypi",
            title: "YPI",
            image: "IMG/avatars/agent-26.png",
            status: "active",
            demoType: "EXTERNAL_URL",
            popupTitle: "OPERATIONS · YPI",
            description: "I got all the technical details in 3 languages or even more, from 1st sample to shipment every technical details."
          }
        ]
      },
      {
        id: "mrp-col",
        title: "MRP",
        modules: [
          {
            id: "mrp",
            title: "MRP",
            image: "IMG/avatars/mrp_avatar.png",
            status: "active",
            popupTitle: "OPERATIONS · MRP",
            description: "I run material requirements planning — fabric and trims, what's needed and when."
          }
        ]
      }
    ]
  }
];
