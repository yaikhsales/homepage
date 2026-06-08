const fs = require('fs');

const descMap = JSON.parse(fs.readFileSync('desc_map.json', 'utf8'));

function createModule(id, title, img, demoType = null) {
  const mod = {
    id,
    title,
    image: `IMG/avatars/${img}`,
    status: 'active'
  };
  
  if (demoType) mod.demoType = demoType;
  
  if (descMap[img]) {
    mod.popupTitle = descMap[img].title;
    mod.description = descMap[img].description.replace(/^“|”$/g, '');
  }
  
  return mod;
}

const DASHBOARD_DATA = [
  {
    id: "admin-section",
    title: "Administration",
    color: "bg-slate-800/80",
    groups: [
      {
        id: "accountant-col",
        title: "Accountant",
        modules: [
          createModule("accountant", "Accountant", "agent-1.png", "SUBMENU_PR"),
          createModule("iews", "IEWS", "agent-2.png")
        ]
      },
      {
        id: "billing-col",
        title: "Billing",
        modules: [
          createModule("purchase-request", "Purchase Request", "agent-3.png", "SUBMENU_PR_ADMIN"),
          createModule("bill-claim", "Bill Claim", "agent-4.png"),
          createModule("salary-bill", "Salary Bill", "agent-5.png", "SUBMENU_SALARY_BILL"),
          // Shipping Bill uses agent-38 for description in earlier list
          createModule("shipping-bill", "Shipping Bill", "agent-38.png")
        ]
      },
      {
        id: "hr-col",
        title: "HR",
        modules: [
          createModule("yhr", "YHR", "agent-6.png", "SUBMENU_YHR"),
          createModule("org-chart", "Org Chart", "agent-7.png", "SUBMENU_ORG"),
          createModule("training", "Training", "agent-8.png", "SUBMENU_DEPARTMENTS"),
          createModule("temp-worker", "Temporary Worker", "agent-9.png", "SUBMENU_TEMP_WORKER"),
          createModule("speak-up", "Speak Up", "agent-10.png")
        ]
      },
      {
        id: "admin-col",
        title: "Admin",
        modules: [
          createModule("support-ticket", "Support Ticket", "agent-11.png", "VIEW_TICKET_CUSTOM"),
          createModule("y-shop", "Y Shop", "agent-12.png", "GRID_SHOP"),
          createModule("gate-pass", "Gate Pass", "agent-13.png", "SUBMENU_VISITOR"),
          createModule("meeting-room", "Meeting Room", "agent-14.png", "IMAGE_VIEW"),
          createModule("car-booking", "Car Booking", "agent-15.png", "IMAGE_VIEW"),
          createModule("fire-alarm", "Fire Alarm", "agent-16.png"),
          createModule("cctv", "CCTV", "agent-17.png", "SUBMENU_CCTV")
        ]
      },
      {
        id: "csr-col",
        title: "CSR",
        modules: [
          createModule("digital-audit", "Digital Audit", "agent-18.png", "SUBMENU_DIGITAL_AUDIT"),
          createModule("energy", "Energy", "agent-19.png", "SUBMENU_ENERGY"),
          createModule("air", "Air", "agent-20.png", "SUBMENU_AIR"),
          createModule("water", "Water", "agent-21.png", "SUBMENU_WATER"),
          createModule("waste", "Waste", "agent-22.png", "SUBMENU_WASTE"),
          createModule("chemical", "Chemical", "agent-23.png")
        ]
      },
      {
        id: "shipping-col",
        title: "Shipping",
        modules: [
          createModule("shipping", "Shipping", "agent-24.png", "SHIPPING_REQUEST")
        ]
      },
      {
        id: "egov-col",
        title: "E-GOV",
        modules: [
          createModule("e-government", "E-Government", "agent-25.png", "SUBMENU_EGOV")
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
          createModule("management-dashboard", "Management Dashboard", "agent-27.png"),
          createModule("sop", "SOP", "agent-28.png", "VIEW_SOP_MAP")
        ]
      },
      {
        id: "noticeable-col",
        title: "Noticeable",
        modules: [
          createModule("system-analysis", "System Analysis", "agent-29.png", "IMAGE_VIEW")
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
          createModule("yqms", "YQMS", "agent-30.png", "SUBMENU_YQMS"),
          createModule("call-out", "Call Out", "agent-31.png")
        ]
      },
      {
        id: "prod-col",
        title: "Production",
        modules: [
          createModule("fc", "FC", "agent-32.png", "SUBMENU_FC"),
          createModule("ywip", "YWIP", "agent-33.png"),
          createModule("ce", "CE", "agent-34.png", "SUBMENU_CE"),
          createModule("ytm", "YTM", "agent-35.png"),
          createModule("ytm-shop", "YTM Shop", "agent-36.png")
        ]
      },
      {
        id: "4dp-col",
        title: "4DP",
        modules: [
          createModule("4dp", "4DP", "agent-37.png", "IFRAME_VIEW")
        ]
      },
      {
        id: "ypi-col",
        title: "YPI",
        modules: [
          // The image for YPI looks like agent-38 but agent-38 is Shipping Bill. Let's try agent-26
          createModule("ypi", "YPI", "agent-26.png", "EXTERNAL_URL")
        ]
      },
      {
        id: "mrp-col",
        title: "MRP",
        modules: [
          createModule("mrp", "MRP", "agent-39.png")
        ]
      }
    ]
  }
];

const fileContent = `import {
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

export const DASHBOARD_DATA = ${JSON.stringify(DASHBOARD_DATA, null, 2).replace(/"([^"]+)":/g, '$1:')};
`;

fs.writeFileSync('src/data/module.js', fileContent);
console.log('module.js rewritten successfully');
