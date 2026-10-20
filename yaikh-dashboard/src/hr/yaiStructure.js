import { DASHBOARD_DATA } from "../data/module";
const workflowGroups = DASHBOARD_DATA.flatMap(s => s.groups || []);
export const modulesFor = ids => workflowGroups.filter(g => ids.includes(g.id)).flatMap(g => g.modules.map(m => m.title));
export const YAI_DEPARTMENTS = [
  { id: "qms", title: "YQMS · Quality", groups: ["qa-col"], head: "Quality Manager", duty: "Owns quality across sample room, warehouse, inspection, cutting, printing/embroidery, sewing, finishing, packaging and loading.", staff: [{title: "Senior Quality Supervisors · 1–2", detail: "One internal; area quality leaders, QA auditors, brand QOs and quality checkers."}], agent: "YQMS AI Agent" },
  { id: "finance", title: "Accounting & Billing", groups: ["accountant-col", "billing-col"], head: "Finance Manager / Senior Accountant", duty: "Owns accounting, billing and department oversight.", staff: [{title: "Accountant", children: [{title: "Accounting / Billing Clerk"}]}], agent: "Accounting & Billing AI Agent" },
  { id: "hr", title: "Human Resources", groups: ["hr-col"], head: "HR Manager / HR Senior Supervisor", duty: "Owns the employee lifecycle, organization, training, temporary workers and Speak Up.", staff: [{title: "HR Officer", children: [{title: "HR Clerk"}]}], agent: "HR AI Agent" },
  { id: "admin", title: "Admin", groups: ["admin-col"], head: "Admin Manager", duty: "Owns site administration and coordinates the supervisor teams.", staff: [
    {title: "Property & Maintenance Supervisor", children: [{title: "Construction & Maintenance Workers", detail: "Welder · Carpenter · Masonry worker · Mechanical maintenance worker"}, {title: "Hostel & Rooms Staff", detail: "Cleaner / room support"}]},
    {title: "Electrical Supervisor", children: [{title: "Electrical Staff"}]},
    {title: "Security & Safety / Chief Security Supervisor", children: [{title: "Security Guards"}, {title: "Disaster Management Team"}]},
    {title: "Vehicle & Maintenance Supervisor", children: [{title: "Vehicle & Maintenance Staff"}]}
  ], agent: "Admin AI Agent" },
  { id: "csr", title: "CSR", groups: ["csr-col"], head: "CSR Manager", duty: "Owns the whole CSR department and its compliance work.", staff: [{title: "CSR Supervisor / CSR Officer", detail: "Coordinates daily work and follows up on the team’s tasks.", children: [{title: "CSR Workers", detail: "1–3 workers, as described; actual assigned headcount to confirm."}]}], agent: "CSR AI Agent" },
  { id: "shipping", title: "Shipping & E-government", groups: ["shipping-col", "egov-col"], head: "Shipping Manager / Shipping Senior Supervisor", duty: "Owns shipping and the team’s work with government platforms through E-government.", staff: [{title: "Shipping Supervisor", children: [{title: "Shipping Clerk"}]}], agent: "Shipping AI Agent" }
];
