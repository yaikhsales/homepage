/**
 * ONE source of truth for "which PA owns which part of the app".
 *
 * Gamini's rule (2026-10-05): "I want the PA to pop up when I click the
 * department … follow all the PA topics to show up the same PA once
 * clicked." Sub-menu pages resolve their owner by TITLE (SubMenuView);
 * pages that bypass SubMenuView (4DP, MRP, the direct-nav admin views)
 * resolve by ROUTE in AppLayout. Management Dashboard / SOP / System
 * Analysis belong to the green Big Brain, not a PA.
 */

/* Sub-menu title → owning PA botId (ids from chatbot/bot-modules.js). */
export const PA_BY_SUBMENU_TITLE = {
  // Accounting PA — Accountant + Billing columns (one PA)
  "Purchase Request": "accounting-bot",
  "Bill Claim": "accounting-bot",
  "Salary Bill": "accounting-bot",
  "Shipping Bill": "accounting-bot",
  "IEWS": "accounting-bot",
  "Accountant": "accounting-bot",
  // HR PA
  "YHR": "hr-bot",
  "Org Chart": "hr-bot",
  "Training": "hr-bot",
  "Temporary Worker": "hr-bot",
  "Speak Up": "hr-bot",
  // Admin PA
  "Support Ticket": "admin-bot",
  "Y Shop": "admin-bot",
  "Gate Pass": "admin-bot",
  "Meeting Room": "admin-bot",
  "Car Booking": "admin-bot",
  "Fire Alarm": "admin-bot",
  "CCTV": "admin-bot",
  "Visitor": "admin-bot",
  // CSR PA
  "Digital Audit": "csr-bot",
  "Energy": "csr-bot",
  "Air": "csr-bot",
  "Water": "csr-bot",
  "Waste": "csr-bot",
  "Chemical": "csr-bot",
  // Shipping PA — Shipping + E-GOV share one PA (Gamini: "Shipping, E-Gov 1 PA")
  "Shipping": "shipping-bot",
  "E-Government": "shipping-bot",
  // QA PA
  "YQMS": "qa-bot",
  "Call Out": "qa-bot",
  // Production column (not dictated — mapped to existing bots, flagged to Gamini)
  "FC": "production-bot",
  "YWIP": "production-bot",
  "CE": "ce-bot",
  "YTM": "ytm-bot",
  "YTM Shop": "ytm-bot",
  // Pre-production
  "4DP": "4dp-bot",
  "YPI": "ypi-bot",
  "MRP": "mrp-bot",
};

/* Sub-menu title → pill to pre-select when the PA auto-opens.
 * Accounting titles map 1:1 to their pills; HR has named pills; everything
 * else opens unfocused (null) until Gamini names per-topic pills. */
export const PA_TITLE_TO_TOPIC = {
  "Purchase Request": "Purchase Request",
  "Bill Claim": "Bill Claim",
  "Salary Bill": "Salary Bill",
  "Shipping Bill": "Shipping Bill",
  "IEWS": "IEWS",
  "Accountant": "Accountant",
  "YHR": "Attendance today",
  "Org Chart": "Org chart updates",
  "Training": "Training schedule",
  "Temporary Worker": "Temp worker requests",
};

/* botId → display name for bubbles and docks. */
export const PA_NAME = {
  "accounting-bot": "Accounting PA",
  "hr-bot": "HR PA",
  "admin-bot": "Admin PA",
  "csr-bot": "CSR PA",
  "shipping-bot": "Shipping PA",
  "mrp-bot": "MRP PA",
  "qa-bot": "QA PA",
  "production-bot": "Production PA",
  "ce-bot": "CE PA",
  "ytm-bot": "YTM PA",
  "4dp-bot": "4DP PA",
  "ypi-bot": "YPI PA",
  "social-bot": "Social PA",
};

/* botId → bubble gradient (mirrors bgGradient in bot-modules.js). */
export const PA_GRADIENT = {
  "accounting-bot": "from-green-500 to-emerald-500",
  "hr-bot": "from-indigo-500 to-blue-500",
  "admin-bot": "from-blue-500 to-cyan-500",
  "csr-bot": "from-purple-500 to-pink-500",
  "shipping-bot": "from-cyan-500 to-sky-500",
  "mrp-bot": "from-red-500 to-orange-500",
  "qa-bot": "from-violet-500 to-purple-500",
  "production-bot": "from-orange-500 to-amber-500",
  "ce-bot": "from-pink-500 to-rose-500",
  "ytm-bot": "from-teal-500 to-cyan-500",
  "4dp-bot": "from-amber-500 to-yellow-500",
  "ypi-bot": "from-lime-500 to-green-500",
  "social-bot": "from-sky-500 to-blue-500",
};

/* Route prefix → owning PA, for pages that never pass through SubMenuView.
 * First match wins (check longer prefixes first). */
export const PA_BY_ROUTE = [
  ["/dashboard/4dp", "4dp-bot"],
  ["/dashboard/mrp", "mrp-bot"],
  ["/dashboard/meeting-room", "admin-bot"],
  ["/dashboard/car-booking", "admin-bot"],
  ["/dashboard/gatepass", "admin-bot"],
  ["/dashboard/fire-alarm", "admin-bot"],
  ["/dashboard/cctv", "admin-bot"],
];

export function paForRoute(pathname) {
  const hit = PA_BY_ROUTE.find(([prefix]) => pathname.startsWith(prefix));
  return hit ? hit[1] : null;
}

/* Green Big Brain territory (owned by the yai2 trigger, not a PA). */
export const BIG_BRAIN_TITLES = new Set([
  "Management Dashboard",
  "SOP",
  "System Analysis",
]);
export const BIG_BRAIN_ROUTES = ["/dashboard/sop-map", "/dashboard/system-analysis"];
export const BIG_BRAIN_BUBBLE =
  "radial-gradient(circle at 30% 25%, #a7f3d0 0%, #10b981 55%, #047857 100%)";

/* Ref-counted body.yai-pa-open — several mounts (route PA, sub-menu PA,
 * Big Brain) may be open at once; the class leaves only when the LAST one
 * closes. Wide screens reflow off this class. */
let _paOpenCount = 0;
export const paOpenPush = () => { _paOpenCount += 1; document.body.classList.add("yai-pa-open"); };
export const paOpenPop = () => { _paOpenCount = Math.max(0, _paOpenCount - 1); if (_paOpenCount === 0) document.body.classList.remove("yai-pa-open"); };
