import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  Search,
  ChevronRight,
  Sparkles,
  MessageCircle,
} from "lucide-react";

import Header from "./components/Header";
import SectionContainer from "./components/SectionContainer";
import { DASHBOARD_DATA } from "./data/module";
import YaiDataBot from "./chatbot/YaiDataBot";
import BotModules from "./chatbot/bot-modules";
import BigBrainPanel from "./chatbot/BigBrainPanel";
import { paForRoute, PA_GRADIENT, PA_NAME, BIG_BRAIN_TITLES, BIG_BRAIN_ROUTES, BIG_BRAIN_BUBBLE, paOpenPush, paOpenPop } from "./chatbot/pa-owner";
import DragonAnimation from "./components/DragonAnimation";
import { useTranslation } from "./translate/TranslationContext";
import { ThemeBackground } from "./thems";

import GMChat from "./chatbot/GMChat";
import GeneralAIAgent from "./general-ag";
import KhmerNewYearSplash from "./components/KhmerNewYearSplash";
import { YQMS_CARDS } from "./data/yqmsCards";
import { FC_CARDS } from "./data/fcCards";
import { MRP_CARDS } from "./data/mrpCards";
import { YPI_CARDS } from "./data/ypiCards";
import { DIGITAL_AUDIT_CARDS, ENERGY_CARDS, WASTE_CARDS, AIR_CARDS } from "./data/csrCards";

// Claude attribution badge — Anthropic brand orange sparkle + "Claude" label.
// Shown next to every Yai mode name in the nav to make the runtime visible.
const ClaudeBadge = ({ size = "sm" }) => (
  <span
    className={`flex items-center gap-1 ${size === "sm" ? "ml-1" : "ml-2"} px-2 py-0.5 rounded-full bg-white/5 border border-white/10`}
    title="Powered by Claude · Anthropic"
  >
    <svg viewBox="0 0 24 24" className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="#D97757"
        d="M12 1.5c.3 2.7.9 4.7 2 6s2.9 2.2 5.5 2.5c-2.6.3-4.4 1.2-5.5 2.5s-1.7 3.3-2 6c-.3-2.7-.9-4.7-2-6s-2.9-2.2-5.5-2.5c2.6-.3 4.4-1.2 5.5-2.5s1.7-3.3 2-6z"
      />
    </svg>
    <span className={`text-white/70 font-medium ${size === "sm" ? "text-[10px]" : "text-xs"} whitespace-nowrap`}>
      Claude
    </span>
  </span>
);

// A new layout component to hold the shared UI (Header, Background)
// Admin & Support sub-menus → the matching simulated-factory screen on the M1
// (DeptView). Each of these sub-menus gets one extra "Live data" card; nothing
// existing is renamed or re-pointed, because the dedicated screens behind the
// current tiles are the ones Gamini approved.
export const LIVE_DATA_VIEW = {
  // HR
  yhr: "hr/attendance",
  "org-chart": "hr/org-chart",
  training: "hr/training",
  "temp-worker": "hr/temp-workers",
  "speak-up": "hr/speak-up",
  // Admin
  "support-ticket": "admin/tickets",
  ticket: "admin/tickets",
  "y-shop": "admin/y-shop",
  "gate-pass": "admin/gate-pass",
  gatepass: "admin/gate-pass",
  "meeting-room": "admin/meeting-rooms",
  meeting: "admin/meeting-rooms",
  "car-booking": "admin/car-booking",
  car: "admin/car-booking",
  "fire-alarm": "admin/fire-alarm",
  cctv: "admin/cctv",
  // Accounting
  "purchase-request": "accounting/purchase-requests",
  "pr-admin": "accounting/purchase-requests",
  "bill-claim": "accounting/bill-claims",
  "salary-bill": "accounting/salary-bills",
  "shipping-bill": "accounting/shipping-bills",
  // CSR
  energy: "csr/energy",
  water: "csr/water",
  air: "csr/air",
  waste: "csr/waste",
  chemical: "csr/chemical",
  "digital-audit": "csr/digital-audit",
};

const AppLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // The BrowserRouter basename (= PUBLIC_URL, "/experience" at build time)
  // strips the prefix, so the router-internal home path is always "/" —
  // both standalone (V2 dev :3002) and embedded under yaikh-com. The
  // constellation renders when pathname is exactly "/".
  const isHome = location.pathname === "/";

  // ── Draggable Yai Data panel ──────────────────────────────────────
  // The whole chatbot icon + dropdown can be dragged anywhere. The
  // "Yai Data" header is the drag handle (cursor-move).
  const [yaiPanelPos, setYaiPanelPos] = useState({ x: 24, y: 80 });
  const yaiDragRef = useRef({ dragging: false });

  const handleYaiPanelMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    yaiDragRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: yaiPanelPos.x,
      origY: yaiPanelPos.y,
    };
    const move = (ev) => {
      if (!yaiDragRef.current.dragging) return;
      setYaiPanelPos({
        x: yaiDragRef.current.origX + (ev.clientX - yaiDragRef.current.startX),
        y: yaiDragRef.current.origY + (ev.clientY - yaiDragRef.current.startY),
      });
    };
    const up = () => {
      yaiDragRef.current.dragging = false;
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const [isGMChatOpen, setGMChatOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isYaiDataBotOpen, setYaiDataBotOpen] = useState(false);

  // Auto-reveal the Agent Collective / Big Brain menu ~700ms after the
  // page mounts so the user sees the two options unfold themselves on
  // every fresh load. This is the dropdown on the AppLayout landing
  // view — NOT the one inside BotModules. Refresh = re-fire (component
  // remounts), internal React Router nav that doesn't unmount AppLayout
  // stays quiet.
  useEffect(() => {
    const t = setTimeout(() => setDropdownOpen(true), 700);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [isGeneralAIAgentOpen, setGeneralAIAgentOpen] = useState(false);
  const [yaiVersion, setYaiVersion] = useState("yai1"); // 'yai1' or 'yai2'
  const [botModuleContext, setBotModuleContext] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDragon, setShowDragon] = useState(false);
  const [dragonMode, setDragonMode] = useState("initial"); // eslint-disable-line no-unused-vars
  const yaiDataButtonRef = useRef(null);
  const [hasPlayedInitialAnimation, setHasPlayedInitialAnimation] =
    useState(false); // eslint-disable-line no-unused-vars

  const openBotForModule = (module) => {
    setBotModuleContext(module);
    setYaiDataBotOpen(true);
  };

  // ── Route-owned department PA ─────────────────────────────────────
  // Pages that never pass through SubMenuView (4DP, MRP, the direct-nav
  // admin views) get their PA mounted here, keyed on the route, so the
  // SAME PA follows the user deeper into the department. Auto-opens on
  // entry; closable down to a PA-coloured bubble.
  const routePaBot = paForRoute(location.pathname);
  const isBigBrainRoute = BIG_BRAIN_ROUTES.some((r) => location.pathname.startsWith(r));
  // Sticky green bubble after clicking a Big Brain-driven module whose
  // route we can't enumerate (e.g. Management Dashboard image view).
  const [bbBubble, setBbBubble] = useState(false);
  const [bigBrainOpen, setBigBrainOpen] = useState(false);
  const [bigBrainPage, setBigBrainPage] = useState("Management Dashboard");
  useEffect(() => {
    if (location.pathname === "/") { setBbBubble(false); setBigBrainOpen(false); }
    else if (location.pathname.startsWith("/dashboard/sop-map")) setBigBrainPage("SOP");
    else if (location.pathname.startsWith("/dashboard/management-dashboard")) setBigBrainPage("Management Dashboard");
    else if (location.pathname.startsWith("/dashboard/system-analysis")) setBigBrainPage("System Analysis");
  }, [location.pathname]);
  const [routePaOpen, setRoutePaOpen] = useState(false);
  // Remember open/closed per PA (survives reloads; storage may be blocked).
  const persistPaOpen = (bot, open) => { try { localStorage.setItem("yai-pa-open:" + bot, open ? "open" : "closed"); } catch (e) {} };
  // Pinned = the PA stays on screen wherever Gamini navigates, until
  // manually unpinned. Minimize collapses to the PA-coloured bubble.
  const [routePaPinned, setRoutePaPinned] = useState(false);
  const [pinnedBot, setPinnedBot] = useState(null);
  const activeRoutePa = routePaPinned && pinnedBot ? pinnedBot : routePaBot;
  const routePaPrefix = routePaBot ? location.pathname.split("/").slice(0, 3).join("/") : null;
  // Flag for wide pages (4DP Gantt etc.): while the compact PA panel is
  // open, body carries .yai-pa-open so those pages can reserve ~424px of
  // right padding (panel = right-6 + w-[400px]).
  useEffect(() => {
    // BotModules adds its own count while mounted; this one covers the
    // Big Brain compact panel. Ref-counted so writers never clobber.
    if (!bigBrainOpen) return;
    paOpenPush();
    return () => paOpenPop();
  }, [bigBrainOpen]);
  useEffect(() => {
    // (re)open when ENTERING a PA-owned department; keep state while
    // moving between that department's own pages. A pinned PA never
    // auto-closes on route change.
    if (routePaBot) {
      let remembered = null;
      try { remembered = localStorage.getItem("yai-pa-open:" + routePaBot); } catch (e) {}
      if (remembered === "closed") { setRoutePaOpen(false); return; }
      const t = setTimeout(() => setRoutePaOpen(true), 700);
      return () => clearTimeout(t);
    }
    if (!routePaPinned) setRoutePaOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routePaPrefix]);

  // A module's old assistant bubble (general-ag wrapper) asks for the real
  // PA by event. Same bot as the route's → just open; another bot → pin it
  // so it shows here too.
  useEffect(() => {
    const onOpenPa = (e) => {
      const bot = e.detail && e.detail.bot;
      if (!bot) return;
      if (bot !== routePaBot) { setPinnedBot(bot); setRoutePaPinned(true); }
      setRoutePaOpen(true);
      persistPaOpen(bot, true);
    };
    window.addEventListener("yai:open-pa", onOpenPa);
    return () => window.removeEventListener("yai:open-pa", onOpenPa);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routePaBot]);

  // Handle initial dragon animation on page load - DISABLED
  // useEffect(() => {
  //     if (location.pathname === '/' && !hasPlayedInitialAnimation) {
  //         // Wait a bit for page to load, then start dragon animation
  //         const timer = setTimeout(() => {
  //             setShowDragon(true);
  //             setDragonMode('initial');
  //             setHasPlayedInitialAnimation(true);
  //         }, 500);
  //         return () => clearTimeout(timer);
  //     }
  // }, [location.pathname, hasPlayedInitialAnimation]);

  // Handle left arrow key for back navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft" && !showDragon) {
        // If Yai Data Bot is open, close it directly (skip missile animation)
        if (isYaiDataBotOpen) {
          setYaiDataBotOpen(false);
        }
        // If on a module page (not home page), navigate back
        else if (location.pathname !== "/") {
          navigate(-1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isYaiDataBotOpen, showDragon, location.pathname, navigate]);

  const handleDragonComplete = () => {
    setShowDragon(false);
  };

  const handleDragonFireComplete = () => {
    // No longer needed - missile just stops and exits
  };

  const handleModuleClick = (module) => {
    // Management Dashboard / SOP / System Analysis belong to the green
    // Big Brain (yai2), not a department PA — open it alongside navigation.
    if (module && BIG_BRAIN_TITLES.has(module.title)) {
      // Big Brain DRIVES these modules but must not replace them: land on
      // the module page with the green Big Brain bubble ready, instead of
      // opening the full-screen takeover (Gamini 2026-10-05).
      setYaiVersion("yai2");
      setBbBubble(true);
      setBigBrainPage(module.title);
      // These pages are full-width (SOP timeline, GM dashboard, System
      // Analysis charts) — nothing may sit under a panel, so land with the
      // bubble only; tap it to open the panel.
      setBigBrainOpen(false);
    }
    if (module.demoType) {
      const { demoType, id, title } = module;
      if ((id === "meeting" || id === "meeting-room") && title === "Meeting Room") {
        navigate("/dashboard/meeting-room");
      } else if ((id === "car" || id === "car-booking") && (title === "My Car Booking" || title === "Car Booking")) {
        navigate("/dashboard/car-booking");
      } else if (id === "gate-pass") {
        navigate("/dashboard/gatepass");
      } else if (id === "fire-alarm") {
        navigate("/dashboard/fire-alarm");
      } else if (id === "ywip") {
        navigate("/dashboard/ywip");
      } else if (id === "cctv") {
        navigate("/dashboard/cctv");
      } else if (id === "system-analysis" && title === "System Analysis") {
        navigate("/dashboard/system-analysis");
      } else if (demoType === "IMAGE_VIEW")
        navigate(`/dashboard/image/${module.image}`);
      else if (demoType === "IFRAME_VIEW")
        navigate("/dashboard/iframe", { state: { url: module.url, title: module.title } });
      else if (demoType === "EXTERNAL_URL")
        window.open(module.url, "_blank", "noopener,noreferrer");
      else if (demoType === "VIEW_SYSTEM_ANALYSIS")
        navigate(`/dashboard/${id}`);
      else if (demoType === "VIEW_SOP_MAP")
        navigate(`/dashboard/sop-map`);
      else if (demoType === "VIEW_MANAGEMENT_DASHBOARD")
        navigate(`/dashboard/management-dashboard`);
      else if (demoType === "VIEW_FACTORY_WORKFLOW")
        navigate(`/dashboard/factory-workflow`);
      else if (demoType === "SUBMENU_YHR") {
        // Navigate directly to YHR component
        navigate("/dashboard/yhr");
      } else if (demoType === "SUBMENU_SALARY_BILL") {
        // Navigate directly to Salary Bill component
        navigate("/dashboard/salary-bill");
      } else if (demoType === "SUBMENU_BILL_CLAIM") {
        // Navigate directly to Bill Claim component
        navigate("/dashboard/bill-claim");
      } else if (demoType === "SUBMENU_SHIPPING_BILL") {
        // Navigate directly to Shipping Bill component
        navigate("/dashboard/shipping-bill");
      } else if (demoType === "SUBMENU_SPEAK_UP") {
        // Navigate directly to Speak Up component (HR PA — anonymous grievance channel)
        navigate("/dashboard/speak-up");
      } else if (demoType === "SUBMENU_WATER") {
        // Navigate directly to Water component
        navigate("/dashboard/water");
      } else if (demoType === "SUBMENU_CHEMICAL") {
        // Chemical has no sub-menu of its own: straight to the simulated-factory chemical screen
        navigate("/dashboard/csr/chemical");
      } else if (demoType === "SUBMENU_CE") {
        // Navigate directly to CE component
        navigate("/dashboard/ce");
      } else if (demoType?.startsWith("SUBMENU")) {
        const cards =
          id === "digital-audit"
            ? DIGITAL_AUDIT_CARDS
            : id === "iews"
              ? [
                  {
                    title: "Income",
                    icon: "TrendingUp",
                    color: "bg-emerald-500 text-white",
                    isIews: true,
                  },
                  {
                    title: "Expenses",
                    icon: "TrendingDown",
                    color: "bg-rose-500 text-white",
                    isIews: true,
                  },
                  {
                    title: "Withholding",
                    icon: "FileBadge",
                    color: "bg-amber-500 text-black",
                    isIews: true,
                  },
                  {
                    title: "Salaries",
                    icon: "BadgeDollarSign",
                    color: "bg-indigo-500 text-white",
                    isIews: true,
                  },
                ]
            : id === "pr-admin" || id === "purchase-request"
              ? [
                  {
                    title: "Purchase Request",
                    icon: "FileText",
                    color: "bg-yellow-500 text-black",
                    action: "/dashboard/purchase-requisition-form",
                    isPurchaseRequest: true,
                  },
                  {
                    title: "Show Lists Request",
                    icon: "Layout",
                    color: "bg-sky-400 text-black",
                    image: "assets/icons/sub-icons/show-list-request.png",
                    isPurchaseRequest: true,
                  },
                  {
                    title: "Master List",
                    icon: "FileCheck",
                    color: "bg-blue-500 text-white",
                    image: "assets/icons/sub-icons/master-list.jpg",
                    isPurchaseRequest: true,
                  },
                  {
                    title: "Purchaser Workspace",
                    icon: "Briefcase",
                    color: "bg-green-500 text-white",
                    image: "assets/icons/sub-icons/purchaser-workspace.png",
                    isPurchaseRequest: true,
                  },
                  {
                    title: "My Confirm Received",
                    icon: "CheckCircle",
                    color: "bg-orange-500 text-white",
                    image: "assets/icons/sub-icons/my-confirm-recieved.png",
                    isPurchaseRequest: true,
                  },
                  {
                    title: "Documents Joiner",
                    icon: "Plus",
                    color: "bg-red-500 text-white",
                    image: "assets/icons/sub-icons/document-joiner.png",
                    isPurchaseRequest: true,
                  },
                ]
              : demoType === "SUBMENU_PR"
                ? [
                    {
                      title: "Verify PR",
                      icon: "CheckCircle",
                      color: "bg-yellow-400 text-black",
                      image: "assets/icons/sub-icons/verify-image.png",
                      isAccountant: true,
                    },
                    {
                      title: "Approval PR",
                      icon: "FileCheck",
                      color: "bg-blue-500 text-white",
                      image: "assets/icons/sub-icons/approval_images.png",
                      isAccountant: true,
                    },
                    {
                      title: "Pay PR",
                      icon: "Banknote",
                      color: "bg-orange-500 text-white",
                      image: "assets/icons/sub-icons/pay-pr.png",
                      isAccountant: true,
                    },
                    {
                      title: "TB Monthly Yearly",
                      icon: "BarChart3",
                      color: "bg-blue-500 text-white",
                      image: "https://ym.yaikh.com/IMG/dashboard.png",
                      isAccountant: true,
                    },
                    {
                      title: "TOI",
                      icon: "Globe",
                      color: "bg-green-600 text-white",
                      image: "https://ym.yaikh.com/IMG/global-connection.png",
                      isAccountant: true,
                    },
                    {
                      title: "Factory Accounting",
                      icon: "Calculator",
                      color: "bg-purple-500 text-white",
                      image: "modules-image/factory-account.png",
                      isAccountant: true,
                    },
                    {
                      title: "TAX Reporting",
                      icon: "FileText",
                      color: "bg-purple-400 text-white",
                      image: "modules-image/tax-reporting.png",
                      isAccountant: true,
                    },
                  ]
                : id === "gatepass"
                  ? [
                      {
                        title: "Gate Pass",
                        icon: "Ticket",
                        color: "bg-blue-500 text-white",
                        action: "/dashboard/gatepass",
                      },
                      {
                        title: "Gate In/Out Records",
                        icon: "BookOpen",
                        color: "bg-sky-500 text-white",
                      },
                      {
                        title: "Motorcycle Records",
                        icon: "Bike",
                        color: "bg-orange-500 text-white",
                      },
                      {
                        title: "Car Plate Records",
                        icon: "Car",
                        color: "bg-red-500 text-white",
                      },
                      {
                        title: "Truck Records",
                        icon: "Truck",
                        color: "bg-white text-blue-600",
                      },
                      {
                        title: "Walk In/Out",
                        icon: "Users",
                        color: "bg-teal-500 text-white",
                      },
                      {
                        title: "Visitor Record",
                        icon: "FileCheck",
                        color: "bg-indigo-500 text-white",
                        action: "/dashboard/gatepass/visitor",
                      },
                      {
                        title: "12K YM Tuk Tuk",
                        icon: "tuktuk",
                        color: "bg-lime-500 text-white",
                      },
                    ]
                  : demoType === "SUBMENU_ORG"
                    ? [
                        // Org Chart
                        {
                          title: "Master Organization Chart",
                          icon: "LayoutDashboard",
                          color: "bg-purple-500 text-white",
                          action: "/dashboard/org-chart-master",
                        },
                        {
                          title: "Custom Organization Chart",
                          icon: "Settings2",
                          color: "bg-indigo-500 text-white",
                          action: "/dashboard/org-chart-master",
                        },
                        {
                          title: "Leader/Worker Sections",
                          icon: "Users",
                          color: "bg-sky-500 text-white",
                          action: "/dashboard/org-chart-master",
                        },
                      ]
                    : id === "cctv"
                      ? [
                          {
                            title: "Face Scan Logs",
                            icon: "BookOpen",
                            color: "bg-sky-500 text-white",
                            action: "/dashboard/cctv/face-scan",
                          },
                          {
                            title: "My Face Scan",
                            icon: "Scan",
                            color: "bg-teal-500 text-white",
                            action: "/dashboard/cctv/my-face-scan",
                          },
                        ]
                      : demoType === "SUBMENU_ENERGY"
                        ? ENERGY_CARDS
                        : demoType === "SUBMENU_WASTE"
                          ? WASTE_CARDS
                          : demoType === "SUBMENU_AIR"
                            ? AIR_CARDS
                            : demoType === "SUBMENU_WATER"
                              ? [
                                  {
                                    title: "In",
                                    image: "assets/icons/sub-icons/water.jpg",
                                    color: "bg-sky-500 text-white",
                                    action: "/dashboard/water/in",
                                  },
                                  {
                                    title: "Out",
                                    image: "assets/icons/sub-icons/water.jpg",
                                    color: "bg-orange-500 text-white",
                                    action: "/dashboard/water/out",
                                  },
                                ]
                              : demoType === "SUBMENU_TEMP_WORKER"
                                ? [
                                    {
                                      title: "Request Worker Form",
                                      icon: "FileText",
                                      color: "bg-blue-500 text-white",
                                      action:
                                        "/dashboard/temp-worker-request/form",
                                    },
                                    {
                                      title: "Request Worker List",
                                      icon: "Layout",
                                      color: "bg-green-500 text-white",
                                      action:
                                        "/dashboard/temp-worker-request/list",
                                    },
                                  ]
                                : demoType === "SUBMENU_E_INVOICING"
                                  ? [
                                      {
                                        title: "Cambodia E Invoice",
                                        icon: "Banknote",
                                        color: "bg-emerald-500 text-white",
                                      },
                                      {
                                        title: "Supplier Management",
                                        icon: "Briefcase",
                                        color: "bg-sky-500 text-white",
                                      },
                                      {
                                        title: "IEWS",
                                        icon: "Layers",
                                        color: "bg-indigo-500 text-white",
                                      },
                                    ]
                                  : demoType === "SUBMENU_YQMS"
                                    ? YQMS_CARDS
                                    : demoType === "SUBMENU_EGOV"
                                      ? [
                                          {
                                            title: "CCF",
                                            image:
                                              "https://www.ccfdg.gov.kh/wp-content/uploads/2020/12/logo-moc.png",
                                            url: "https://www.ccfdg.gov.kh/en/about-ccf/",
                                            color: "bg-yellow-400 text-black",
                                          },
                                          {
                                            title: "MISTI",
                                            image:
                                              "https://www.misti.gov.kh/assets/img/misti-logo.png",
                                            url: "https://www.misti.gov.kh/",
                                            color: "bg-green-500 text-white",
                                          },
                                          {
                                            title: "OWSO",
                                            image:
                                              "https://www.owso.gov.kh/wp-content/uploads/2019/07/logo.png",
                                            url: "https://www.owso.gov.kh/en/",
                                            color: "bg-orange-500 text-white",
                                          },
                                          {
                                            title: "E-Filing",
                                            image:
                                              "https://efiling.acar.gov.kh/media/logos/logo.png",
                                            url: "https://www.tax.gov.kh/km/e-service",
                                            color: "bg-blue-500 text-white",
                                          },
                                          {
                                            title: "NSSF",
                                            image:
                                              "https://account.nssf.gov.kh/images/nssf-logo.png",
                                            url: "https://account.nssf.gov.kh/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fresponse_type%3Dcode%26client_id%3DD151d7d4-3144-4548-3b2e-ae15e11ee463%26state%3DQ3c3SmJQYn4yWmNXdWVRSjJGN1ZJUkY1VXFfU0tfUUY1aGNZUkN4aUNlTFZB%26redirect_uri%3Dhttps%253A%252F%252Fenterprise.nssf.gov.kh%252Fauth%252Fcallback%26scope%3Dopenid%2520profile%2520offline_access%2520beneficiary_registration_api%2520registration_api%2520webadmin_api%2520enterprise%2520roles%2520IDCard%2520email%2520phone%26code_challenge%3Df_8vyoLahcIyyu24Rsd7TX2QCtPZHAMjTGNhFDHR9gw%26code_challenge_method%3DS256%26nonce%3DQ3c3SmJQYn4yWmNXdWVRSjJGN1ZJUkY1VXFfU0tfUUY1aGNZUkN4aUNlTFZB",
                                            color: "bg-purple-500 text-white",
                                          },
                                        ]
                                      : demoType === "SUBMENU_FC"
                                        ? FC_CARDS
                                        : demoType === "SUBMENU_4DP"
                                          ? [
                                              {
                                                title: "Master Plan",
                                                icon: "LayoutDashboard",
                                                color: "bg-blue-500/30 text-white",
                                                action: "/dashboard/4dp/master-plan",
                                              },
                                              {
                                                title: "Unit Plan",
                                                icon: "Building",
                                                color: "bg-indigo-500/30 text-white",
                                                action: "/dashboard/4dp/unit-plan",
                                              },
                                              {
                                                title: "Line Plan T&A",
                                                icon: "ClipboardCheck",
                                                color: "bg-amber-500/30 text-white",
                                                action: "/dashboard/4dp/line-plan-ta",
                                              },
                                              {
                                                title: "Line Plan",
                                                icon: "Layers",
                                                color: "bg-emerald-500/30 text-white",
                                                action: "/dashboard/4dp/line-plan",
                                              },
                                              {
                                                title: "MRP TV",
                                                icon: "MonitorPlay",
                                                color: "bg-sky-500/30 text-white",
                                                action: "/dashboard/4dp/mrp-tv",
                                              },
                                              {
                                                title: "TEC TV",
                                                icon: "MonitorPlay",
                                                color: "bg-violet-500/30 text-white",
                                                action: "/dashboard/4dp/tec-tv",
                                              },
                                            ]
                                        : demoType === "SUBMENU_MRP"
                                          ? MRP_CARDS
                                        : demoType === "SUBMENU_YPI"
                                          ? YPI_CARDS
                                        : demoType === "SUBMENU_DEPARTMENTS"
                                          ? [
                                              {
                                                title: "Online Training",
                                                icon: "MonitorPlay",
                                                color: "bg-blue-500 text-white",
                                              }, // Correct
                                              {
                                                title: "YAI",
                                                icon: "Building",
                                                color: "bg-white text-blue-600",
                                              }, // Correct
                                              {
                                                title: "CSR",
                                                icon: "Globe",
                                                color:
                                                  "bg-green-500 text-white",
                                              }, // Correct
                                              {
                                                title: "IT",
                                                icon: "Cpu",
                                                color: "bg-sky-500 text-white",
                                              }, // Correct
                                              {
                                                title: "Shipping",
                                                icon: "Truck",
                                                color:
                                                  "bg-orange-500 text-white",
                                              }, // Changed to Truck for shipping
                                              {
                                                title: "PPC",
                                                icon: "ClipboardCheck",
                                                color:
                                                  "bg-indigo-500 text-white",
                                              }, // Correct
                                              {
                                                title: "Merchandising",
                                                icon: "Tag",
                                                color: "bg-pink-500 text-white",
                                              }, // Correct
                                              {
                                                title: "Purchasing",
                                                icon: "ShoppingCart",
                                                color:
                                                  "bg-yellow-500 text-white",
                                              }, // Correct
                                              {
                                                title: "General Affairs",
                                                icon: "Briefcase",
                                                color: "bg-gray-500 text-white",
                                              }, // Correct
                                              {
                                                title: "Admin",
                                                icon: "UserCog",
                                                color:
                                                  "bg-slate-600 text-white",
                                              }, // Correct
                                              {
                                                title: "HR",
                                                icon: "Users",
                                                color: "bg-blue-600 text-white",
                                              }, // Correct
                                              {
                                                title: "QA",
                                                icon: "CheckSquare",
                                                color: "bg-teal-500 text-white",
                                              }, // Correct
                                              {
                                                title: "Financial",
                                                icon: "Banknote",
                                                color:
                                                  "bg-emerald-500 text-white",
                                              }, // Correct
                                              {
                                                title: "CBSA",
                                                icon: "Shield",
                                                color: "bg-red-500 text-white",
                                              }, // Correct
                                              {
                                                title: "Sample",
                                                icon: "Shirt",
                                                color:
                                                  "bg-purple-500 text-white",
                                              }, // Correct
                                              {
                                                title: "Technical",
                                                icon: "HardHat",
                                                color:
                                                  "bg-orange-600 text-white",
                                              }, // Correct
                                              {
                                                title: "Raw Material Warehouse",
                                                icon: "Warehouse",
                                                color:
                                                  "bg-stone-500 text-white",
                                              }, // Correct
                                              {
                                                title: "Cutting",
                                                icon: "Scissors",
                                                color: "bg-rose-500 text-white",
                                              }, // Correct
                                              {
                                                title: "SCC",
                                                icon: "Layers",
                                                color: "bg-cyan-500 text-white",
                                              }, // Correct
                                              {
                                                title: "Sewing",
                                                icon: "PenTool",
                                                color: "bg-lime-500 text-white",
                                              }, // Changed to PenTool to represent a needle
                                              {
                                                title: "QC",
                                                icon: "Search",
                                                color:
                                                  "bg-amber-500 text-white",
                                              }, // Correct
                                              {
                                                title: "Ironing",
                                                icon: "Feather",
                                                color: "bg-zinc-500 text-white",
                                              }, // Correct (No 'Iron' icon exists)
                                              {
                                                title: "Packing",
                                                icon: "PackageCheck",
                                                color: "bg-sky-600 text-white",
                                              }, // Correct
                                              {
                                                title: "Washing",
                                                icon: "WashingMachine",
                                                color: "bg-blue-400 text-white",
                                              }, // Correct
                                              {
                                                title: "TPM",
                                                icon: "Wrench",
                                                color: "bg-red-600 text-white",
                                              }, // Correct
                                              {
                                                title: "Warehouse",
                                                icon: "Package",
                                                color:
                                                  "bg-neutral-500 text-white",
                                              }, // Changed to Package to differentiate from Raw Material Warehouse
                                              {
                                                title: "IE",
                                                icon: "BrainCircuit",
                                                color:
                                                  "bg-fuchsia-500 text-white",
                                              }, // Correct
                                              {
                                                title: "QA (Fabric)",
                                                icon: "TestTube",
                                                color:
                                                  "bg-violet-500 text-white",
                                              }, // Correct
                                              {
                                                title: "Production",
                                                icon: "Factory",
                                                color: "bg-gray-700 text-white",
                                              }, // Correct
                                            ]
                                          : null; // Return null for empty modules

        // If cards is null or empty, do nothing (don't navigate)
        if (!cards || cards.length === 0) {
          return;
        }

        // Admin & Support (HR · Admin · Accounting · CSR): one extra card per
        // sub-menu that opens the simulated-factory screen for that sub-module
        // (DeptView, /dashboard/<dept>/<view>, data from the M1). The existing
        // cards and their titles are left exactly as they are — the PA owner
        // map keys off those titles.
        const live = LIVE_DATA_VIEW[id];
        const cardsWithLive = live
          ? [...cards, { title: "Live data", icon: "Table2", color: "bg-sky-600 text-white", action: `/dashboard/${live}` }]
          : cards;

        navigate(`/dashboard/submenu/${id}`, { state: { title, cards: cardsWithLive } });
      } else if (demoType === "VIEW_4DP") navigate("/dashboard/4dp/master-plan"); // topics left, Gantt right
      else if (demoType === "GRID_TRAINING") navigate("/dashboard/training");
      else if (demoType === "VIEW_TICKET_CUSTOM") navigate("/dashboard/ticket");
      else if (demoType === "TIMELINE_MEETING") navigate("/dashboard/meeting");
      else if (demoType?.startsWith("TABLE")) {
        if (id === "ticket") navigate("/dashboard/ticket");
        else navigate(`/dashboard/${id}`);
      } else if (demoType === "GRID_SHOP") navigate("/dashboard/y-shop");
      else if (demoType === "SHIPPING_REQUEST") navigate("/dashboard/shipping/request");
    } else {
      // Handle modules without demoType - only navigate if explicitly handled
      if (module.title === "Bill Record") {
        navigate("/dashboard/bill-record");
      } else if (module.title === "YTM Shop") {
        navigate("/dashboard/ytm-shop");
      } else if (module.title === "YTM" || module.title === "YTPM") {
        navigate("/dashboard/ytm");
      } else if (module.title === "KANBAN" || module.id === "kanban") {
        navigate("/dashboard/traffic-light");
      } else if (module.galleryImages && module.galleryImages.length > 0) {
        // Navigate to image view with gallery support
        const encodedPath = encodeURIComponent(module.galleryImages[0]);
        navigate(`/dashboard/image/${encodedPath}`, {
          state: {
            gallery: module.galleryImages,
            title: module.title,
          },
        });
      } else if (module.title === "PWIP" || module.id === "pwip") {
        navigate("/dashboard/pwip");
      } else if (module.title === "Call Out" || module.id === "call-out") {
        navigate("/dashboard/call-out");
      } else if (module.id === "meeting" && module.title === "Meeting Room") {
        navigate("/dashboard/meeting-room");
      } else if (module.title === "Money Claim" || module.id === "money-claim") {
        navigate("/dashboard/money-claim");
      } else if (module.action) {
        navigate(module.action);
      }
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen font-sans overflow-x-hidden theme-normal bg-transparent"
      style={{ position: "relative", zIndex: 1, scrollBehavior: "smooth" }}
    >
      {/* Theme Background - Show on home page and dashboard, but not on full-screen forms */}
      {(isHome ||
        location.pathname.startsWith("/dashboard")) &&
        !location.pathname.includes("purchase-requisition-form") &&
        !location.pathname.includes("verify-pr") &&
        !location.pathname.includes("approval-pr") &&
        !location.pathname.includes("pay-pr") &&
        !location.pathname.includes("ticket") &&
        !location.pathname.includes("y-shop") &&
        !location.pathname.includes("ytm-shop") &&
        !location.pathname.includes("ytm") &&
        !location.pathname.includes("traffic-light") &&
        !location.pathname.includes("call-out") &&
        !location.pathname.includes("yhr") &&
        !location.pathname.includes("salary-bill") &&
        !location.pathname.includes("water") &&
        !location.pathname.includes("shipping/request") &&
        !location.pathname.includes("money-claim") &&
        !location.pathname.includes("ce") && <ThemeBackground />}

      <KhmerNewYearSplash />

      <style>{`
                * {
                    scroll-behavior: smooth;
                }
                html {
                    scroll-behavior: smooth;
                }
                .theme-christmas {
                    background: transparent;
                }
                .theme-normal {
                    background: transparent;
                }
            `}</style>
      {!location.pathname.includes("purchase-requisition-form") &&
        !location.pathname.includes("verify-pr") &&
        !location.pathname.includes("approval-pr") &&
        !location.pathname.includes("pay-pr") &&
        !location.pathname.includes("ticket") &&
        !location.pathname.includes("y-shop") &&
        !location.pathname.includes("ytm-shop") &&
        !location.pathname.includes("ytm") &&
        !location.pathname.includes("traffic-light") &&
        !location.pathname.includes("pwip") &&
        !location.pathname.includes("call-out") &&
        !location.pathname.includes("yhr") &&
        !location.pathname.includes("salary-bill") &&
        !location.pathname.includes("water") &&
        !location.pathname.includes("shipping/request") &&
        !location.pathname.includes("money-claim") &&
        !location.pathname.includes("ce") && <Header />}

      {/* Yai Data panel — horizontal row: Yai Agents · Agent Collective · Big Brain
          (shown on every page, not just home). Hidden while a chat modal
          is open so the modal's own header can own the top of the screen. */}
      {!isYaiDataBotOpen && (
        <div
          className="fixed z-[60] text-white animate-in fade-in slide-in-from-left duration-1000"
          style={{ left: yaiPanelPos.x, top: yaiPanelPos.y, userSelect: 'none' }}
        >
          {/* 3-mode nav: My Task Agent (current, orange) · Agent Collective (blue) · Big Brain (green) */}
          <div
            className="flex items-center gap-6"
            onMouseDown={handleYaiPanelMouseDown}
            title="Drag to move"
            style={{ cursor: "move" }}
          >
            {/* Orange My Task Agent — the task-agent view lives at "/", so from
                any other page this has to navigate there. It used to be an
                inert div, which is why clicking it did nothing off the home
                page. Any open bot overlay is closed on the way. */}
            <button
              onClick={() => {
                setYaiDataBotOpen(false);
                setBotModuleContext(null);
                if (!isHome) navigate("/");
              }}
              title={isHome ? "My Task Agent — where you are now" : "Go to My Task Agent"}
              className={`flex items-center gap-3 ${isHome ? "cursor-default" : "cursor-pointer hover:scale-105 transition-transform"}`}
            >
              <div
                className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ring-4 ring-orange-400/60 ring-offset-2 ring-offset-slate-900"
                style={{
                  background: "radial-gradient(circle at 30% 25%, #fed7aa 0%, #f97316 55%, #c2410c 100%)",
                  boxShadow: "inset -4px -4px 8px rgba(0,0,0,0.30), inset 3px 3px 6px rgba(255,255,255,0.35), 0 4px 16px rgba(249,115,22,0.55)",
                }}
              >
                <img src={process.env.PUBLIC_URL + "/assets/modules-image/top-bot.png"} alt="Yai" className="w-full h-full rounded-full object-cover" />
              </div>
              <span className="text-orange-400 font-bold text-xl whitespace-nowrap">
                {t('My Task Agent')}
              </span>
              <ClaudeBadge />
            </button>

            {/* Blue Agent Collective — switch */}
            <button
              ref={yaiDataButtonRef}
              onClick={() => {
                setYaiVersion("yai1");
                setBotModuleContext(null);
                setYaiDataBotOpen(true);
              }}
              className="flex items-center gap-3 cursor-pointer group hover:scale-105 transition-transform"
            >
              <div
                className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{
                  background: "radial-gradient(circle at 30% 25%, #93c5fd 0%, #3b82f6 55%, #1d4ed8 100%)",
                  boxShadow: "inset -4px -4px 8px rgba(0,0,0,0.30), inset 3px 3px 6px rgba(255,255,255,0.35), 0 4px 12px rgba(59,130,246,0.4)",
                }}
              >
                <img src={process.env.PUBLIC_URL + "/assets/modules-image/yai1.png"} alt="Yai" className="w-full h-full rounded-full object-cover" />
              </div>
              <span className="text-blue-400 font-bold text-xl whitespace-nowrap">
                {t('Agent Collective')}
              </span>
              <ClaudeBadge />
            </button>

            {/* Green Big Brain — switch */}
            <button
              onClick={() => {
                setYaiVersion("yai2");
                setYaiDataBotOpen(true);
              }}
              className="flex items-center gap-3 cursor-pointer group hover:scale-105 transition-transform"
            >
              <div
                className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{
                  background: "radial-gradient(circle at 30% 25%, #a7f3d0 0%, #10b981 55%, #047857 100%)",
                  boxShadow: "inset -4px -4px 8px rgba(0,0,0,0.30), inset 3px 3px 6px rgba(255,255,255,0.35), 0 4px 12px rgba(16,185,129,0.4)",
                }}
              >
                <img src={process.env.PUBLIC_URL + "/assets/modules-image/yai2.png"} alt="Yai" className="w-full h-full rounded-full object-cover" />
              </div>
              <span className="text-emerald-400 font-bold text-xl whitespace-nowrap">
                {t('Big Brain')}
              </span>
              <ClaudeBadge />
            </button>
          </div>
        </div>
      )}

      {/* Dragon Animation */}
      {showDragon && (
        <DragonAnimation
          mode={dragonMode}
          targetElement={
            dragonMode === "back" ? null : yaiDataButtonRef.current
          }
          onComplete={handleDragonComplete}
          onFireComplete={handleDragonFireComplete}
          onClose={
            dragonMode === "back" ? () => setYaiDataBotOpen(false) : undefined
          }
        />
      )}

      {/* Route-owned department PA (4DP, MRP, direct-nav admin views) */}
      {activeRoutePa && routePaOpen && (
        <>
          <BotModules
            onClose={() => { setRoutePaOpen(false); persistPaOpen(activeRoutePa, false); }}
            moduleContext={location.pathname}
            currentVersion="yai1"
            botsFilter={[activeRoutePa]}
          />
          {/* Pin + minimize — float just left of the compact panel */}
          <div className="fixed right-[432px] bottom-[40vh] z-[210] flex flex-col gap-2">
            <button
              onClick={() => {
                if (routePaPinned) { setRoutePaPinned(false); setPinnedBot(null); }
                else { setRoutePaPinned(true); setPinnedBot(activeRoutePa); }
              }}
              className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-colors ${routePaPinned ? "bg-orange-500 text-white" : "bg-white/90 text-gray-600 hover:bg-orange-100"}`}
              aria-pressed={routePaPinned}
              title={routePaPinned ? "Unpin — PA closes when you leave this area" : "Pin — keep this PA on screen everywhere"}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 17v5" />
                <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
              </svg>
            </button>
            <button
              onClick={() => { setRoutePaOpen(false); persistPaOpen(activeRoutePa, false); }}
              className="w-10 h-10 rounded-full bg-white/90 text-gray-600 hover:bg-gray-200 shadow-lg flex items-center justify-center"
              title="Minimise to bubble"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14" /></svg>
            </button>
          </div>
        </>
      )}
      {activeRoutePa && !routePaOpen && (
        <button
          onClick={() => { setRoutePaOpen(true); persistPaOpen(activeRoutePa, true); }}
          className={`fixed bottom-6 right-6 z-50 h-14 pl-4 pr-5 bg-gradient-to-r ${PA_GRADIENT[activeRoutePa] || "from-orange-500 to-amber-500"} text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2`}
          aria-label="Open department PA"
          title="Open department PA"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="font-bold text-base whitespace-nowrap">{PA_NAME[activeRoutePa] || "PA"}</span>
        </button>
      )}
      {/* Green Big Brain bubble on its own routes (SOP map, System Analysis) */}
      {(isBigBrainRoute || bbBubble) && !isYaiDataBotOpen && !bigBrainOpen && (
        <button
          onClick={() => { setYaiVersion("yai2"); setBigBrainOpen(true); }}
          className="fixed bottom-6 right-6 z-50 h-14 pl-4 pr-5 text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
          style={{ background: BIG_BRAIN_BUBBLE }}
          aria-label="Open Big Brain"
          title="Open Big Brain"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="font-bold text-base whitespace-nowrap">Big Brain</span>
        </button>
      )}

      {/* Compact green Big Brain panel — drives Management Dashboard /
          System Analysis / SOP without replacing the page. */}
      {bigBrainOpen && (
        <BigBrainPanel page={bigBrainPage} pa="all" onClose={() => setBigBrainOpen(false)} onNavigate={(p) => navigate(p)} />
      )}

      {isYaiDataBotOpen && (
        <YaiDataBot
          moduleContext={botModuleContext}
          version={yaiVersion}
          onVersionChange={setYaiVersion}
          onClose={() => setYaiDataBotOpen(false)}
        />
      )}
      {isGMChatOpen && <GMChat onClose={() => setGMChatOpen(false)} />}
      <main
        className={`yai-main flex-1 relative ${isHome ? "p-4 md:p-6" : "p-0"} overflow-x-auto`}
      >
        {/* === BACKGROUND LAYERS === */}
        {/* Background is now handled by ThemeBackground component in thems.js */}

        {/* Conditionally render dashboard content or other views */}
        {isHome ? (
          <>
            <style>{`
                            @keyframes fadeInUp {
                                from {
                                    opacity: 0;
                                    transform: translateY(30px);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                            }
                            @keyframes fadeInScale {
                                from {
                                    opacity: 0;
                                    transform: scale(0.95);
                                }
                                to {
                                    opacity: 1;
                                    transform: scale(1);
                                }
                            }
                            @keyframes shimmer {
                                0% { background-position: -1000px 0; }
                                100% { background-position: 1000px 0; }
                            }
                            .apple-fade-in {
                                animation: fadeInUp 0.8s ease-out forwards;
                            }
                            .apple-fade-in-delay {
                                animation: fadeInUp 0.8s ease-out forwards;
                                animation-delay: 0.2s;
                                opacity: 0;
                            }
                            .apple-fade-in-delay-2 {
                                animation: fadeInUp 0.8s ease-out forwards;
                                animation-delay: 0.4s;
                                opacity: 0;
                            }
                            /* Tiles shrink with the window so the whole grid (8 rows) fits
                               under the nav band without scrolling. */
                            :root {
                                --yai-tile-h: clamp(70px, calc((100vh - 240px) / 8), 144px);
                                --yai-icon: clamp(40px, calc(var(--yai-tile-h) - 26px), 104px);
                            }
                            .apple-card {
                                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                            }
                            .apple-card:hover {
                                transform: translateY(-4px) scale(1.02);
                            }
                            .glass-effect {
                                background: rgba(255, 255, 255, 0.1);
                                backdrop-filter: blur(20px) saturate(180%);
                                -webkit-backdrop-filter: blur(20px) saturate(180%);
                                border: 1px solid rgba(255, 255, 255, 0.2);
                            }
                            .glass-effect-strong {
                                background: rgba(255, 255, 255, 0.15);
                                backdrop-filter: blur(30px) saturate(180%);
                                -webkit-backdrop-filter: blur(30px) saturate(180%);
                                border: 1px solid rgba(255, 255, 255, 0.3);
                            }
                            .theme-normal .glass-effect {
                                background: rgba(255, 255, 255, 0.25);
                                backdrop-filter: blur(20px) saturate(180%);
                                -webkit-backdrop-filter: blur(20px) saturate(180%);
                                border: 1px solid rgba(255, 255, 255, 0.4);
                            }
                            .theme-normal .glass-effect-strong {
                                background: rgba(255, 255, 255, 0.3);
                                backdrop-filter: blur(30px) saturate(180%);
                                -webkit-backdrop-filter: blur(30px) saturate(180%);
                                border: 1px solid rgba(255, 255, 255, 0.5);
                            }
                        `}</style>
            {/* Hero row — sibling of the wide strip, pinned to the viewport
                (sticky left-0 + 100vw cap) so it is centred on every screen
                width and never scrolls off with the module strip. */}
            {/* Hero row — plain normal-flow block sized to the viewport (not the
                min-w strip), with explicit top clearance for the FIXED draggable
                nav panel (default y=80, band ends ~y140). Fixed elements can't
                be pushed by layout, so clearance is the only correct relation. */}
            {/* Compact header row (2026-10-05, Gamini): the big centred hero and the
                separate search row used to push the module grid ~240px down, so the
                whole My Task Agent grid did not fit on screen during presentations.
                The Yai orb + label and the search box now sit on ONE row, right-
                aligned at the same height as the FIXED 3-mode nav (which occupies
                the left side), and the grid starts directly under that band. */}
            <div className="z-10 flex items-center justify-end gap-3 pr-6" style={{ width: "min(100%, 100vw)", height: 56, marginBottom: 8 }}>
              <button
                onClick={() => setGMChatOpen(true)}
                aria-label="Open My Task Agent"
                className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <span className="hidden xl:inline text-white font-bold text-base drop-shadow-lg">My</span>
                <span
                  className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "radial-gradient(circle at 30% 25%, #fed7aa 0%, #f97316 55%, #c2410c 100%)",
                    boxShadow: "inset -4px -4px 8px rgba(0,0,0,0.30), inset 3px 3px 6px rgba(255,255,255,0.35), 0 4px 12px rgba(249,115,22,0.4)",
                  }}
                >
                  <img
                    src={process.env.PUBLIC_URL + "/assets/modules-image/top-bot.png"}
                    alt="Yai"
                    className="w-full h-full rounded-full object-cover"
                  />
                </span>
                <span className="hidden xl:inline text-white font-bold text-base drop-shadow-lg">task agent</span>
              </button>
              <div
                className={`flex items-center px-3 py-2 w-48 text-white transition-all duration-300 group light-effect ${isDropdownOpen ? "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg" : "glass-effect-strong rounded-2xl shadow-xl hover:shadow-2xl"}`}
              >
                <Search
                  className={`w-4 h-4 mr-2 transition-colors ${isDropdownOpen ? "text-cyan-300" : "text-cyan-300 group-hover:text-cyan-200"}`}
                />
                <input
                  type="text"
                  placeholder="Search modules..."
                  className={`bg-transparent border-none outline-none w-full text-xs transition-colors ${isDropdownOpen ? "placeholder-cyan-100/50" : "placeholder-cyan-100/50 focus:placeholder-cyan-200/70"}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="relative z-10 min-w-[1200px] max-w-[1800px] mx-auto flex flex-col gap-6">
              <div className="flex justify-center items-start gap-6">
                <SectionContainer
                  section={DASHBOARD_DATA[0]}
                  onModuleClick={handleModuleClick}
                  onBotModuleClick={openBotForModule}
                  isDropdownOpen={isDropdownOpen}
                  isLightOn={false}
                />
                <SectionContainer
                  section={DASHBOARD_DATA[1]}
                  onModuleClick={handleModuleClick}
                  onGMChatClick={() => setGMChatOpen(true)}
                  onBotModuleClick={openBotForModule}
                  isDropdownOpen={isDropdownOpen}
                  isLightOn={false}
                />
                <SectionContainer
                  section={DASHBOARD_DATA[2]}
                  onModuleClick={handleModuleClick}
                  onBotModuleClick={openBotForModule}
                  isDropdownOpen={isDropdownOpen}
                  isLightOn={false}
                />
              </div>
            </div>

            {/* General AI Agent Button - Right Side Bottom.
                Branded Yai logo whose color matches the active version —
                Agent Collective uses the orange-textured Yai mark,
                Big Brain uses the blue-textured one. Image IS the
                button (no separate bg), with a brand-tinted ring to
                read clearly against any backdrop. Hidden when the
                Big Brain PA panel is open. */}
            {isHome && !isYaiDataBotOpen && (
              <button
                onClick={() => setGeneralAIAgentOpen(true)}
                className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 ring-2 ring-offset-2 ring-offset-slate-900 ${yaiVersion === 'yai2' ? 'ring-yai-blue' : 'ring-yai-orange'}`}
                aria-label="General AI Agent"
              >
                <img
                  src={yaiVersion === 'yai2' ? '/assets/modules-image/yai1.png' : '/assets/modules-image/top-bot.png'}
                  alt="Yai Agent"
                  className="w-full h-full object-cover"
                />
              </button>
            )}
          </>
        ) : (
          <Outlet />
        )}
      </main>

      {/* General AI Agent Modal */}
      {isGeneralAIAgentOpen && (
        <GeneralAIAgent onClose={() => setGeneralAIAgentOpen(false)} />
      )}
    </div>
  );
};

export default AppLayout;
