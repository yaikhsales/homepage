import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/* SOP — Standard Operating Procedures (Management Dashboard → SOP).
 * LEFT: the main processes.
 * RIGHT:
 *  - Order → Ship: a day timeline (DAY 0 = first news of the order). Each
 *    activity sits on its days in its department row; arrows are the
 *    interdependencies between departments.
 *  - HR / Accounting / Admin / CSR: no real timeline — a repeating cycle.
 * Click any activity → who is involved and what each one is responsible for,
 * inputs → outputs, the Yai screen where it happens, and what it hands to.
 * Department processes (MRP, FC, QA, IE …) open the order timeline with
 * their own row in focus. */

const DEPTS = {
  sales:  { label: "Sales · Merch",       color: "#38bdf8" },
  ypi:    { label: "YPI",                 color: "#60a5fa" },
  ce:     { label: "CE · IE",             color: "#22d3ee" },
  mrp:    { label: "MRP",                 color: "#fbbf24" },
  ship:   { label: "Shipping",            color: "#2dd4bf" },
  fc:     { label: "FC · Warehouse",      color: "#a78bfa" },
  ytm:    { label: "YTM · Maintenance",   color: "#facc15" },
  qa:     { label: "QA · YQMS",           color: "#fb7185" },
  dp:     { label: "4DP · Planning",      color: "#f472b6" },
  prod:   { label: "Production",          color: "#fb923c" },
  acct:   { label: "Accounting",          color: "#a3e635" },
  hr:     { label: "HR",                  color: "#34d399" },
  head:   { label: "Dept Head",           color: "#94a3b8" },
  sys:    { label: "Yai (auto)",          color: "#10b981" },
  worker: { label: "Worker · Phone",      color: "#e879f9" },
  admin:  { label: "Admin",               color: "#cbd5e1" },
  csr:    { label: "CSR",                 color: "#4ade80" },
  buyer:  { label: "Buyer · Supplier",    color: "#f9a8d4" },
};

const R = (role, dept, does) => ({ role, dept, does });

/* ---------- ORDER → SHIP timeline (days from first news) ---------- */
const ORDER = {
  kind: "timeline",
  title: "Order → Ship",
  summary: "DAY 0 = the factory hears this order is going to start. Every activity on its days, every hand-off drawn.",
  lanes: ["sales", "ypi", "ce", "mrp", "ship", "fc", "ytm", "qa", "dp", "prod", "acct"],
  days: 125,
  phases: [
    { d0: 0, d1: 15, label: "Development & costing" },
    { d0: 15, d1: 54, label: "Materials & planning" },
    { d0: 54, d1: 64, label: "Pre-production" },
    { d0: 64, d1: 91, label: "Bulk production" },
    { d0: 91, d1: 125, label: "Ship & get paid" },
  ],
  acts: [
    { id: "news", lane: "sales", title: "Order news (Day 0)", d0: 0, d1: 1, screen: ["YPI · Tech pack", "/dashboard/ypi/techpack"],
      roles: [R("Sales manager", "sales", "Receives the buyer's first notice and opens the order"), R("Merchandiser", "sales", "Collects style, quantity, colours and delivery date"), R("Marketing", "sales", "Confirms buyer, season and programme"), R("Yai", "sys", "Creates the order record and alerts every department")],
      inputs: "Buyer enquiry / forecast", outputs: "Order record with style, qty, target ex-factory", deps: [] },
    { id: "techpack", lane: "ypi", title: "Tech pack", d0: 1, d1: 6, screen: ["YPI · Tech pack", "/dashboard/ypi/techpack"],
      roles: [R("Merchandiser", "sales", "Owns the tech pack, chases buyer comments"), R("Technician", "ypi", "Measurements, construction and specs"), R("Sample room head", "ypi", "Checks the style can be made"), R("Yai", "sys", "Keeps it in Khmer, English and Chinese")],
      inputs: "Buyer sketches & specs", outputs: "Tech pack v1", deps: ["news"] },
    { id: "samples", lane: "ypi", title: "Proto & fit samples", d0: 5, d1: 20, screen: ["YPI · Sample plan", "/dashboard/ypi/sample-plan"],
      roles: [R("Sample room supervisor", "ypi", "Schedules sample machines and operators"), R("Pattern maker", "ypi", "Patterns and grading"), R("Sample operators", "ypi", "Sew the samples"), R("Merchandiser", "sales", "Sends to buyer, logs approvals")],
      inputs: "Tech pack, sample fabric", outputs: "Approved fit / PP sample", deps: ["techpack"] },
    { id: "costing", lane: "ce", title: "Style costing (SAM)", d0: 5, d1: 9, screen: ["CE · Style costing", "/dashboard/ce/style-costing"],
      roles: [R("IE engineer", "ce", "Operations and SAM from the Operation Library"), R("Costing officer", "ce", "Fabric and trim consumption"), R("Merchandiser", "sales", "Gives the buyer's target price"), R("Finance", "acct", "Overhead and cost per minute")],
      inputs: "Tech pack", outputs: "Cost per piece", deps: ["techpack"] },
    { id: "quote", lane: "ypi", title: "Quotation → buyer PO", d0: 9, d1: 14, screen: ["YPI · Costing", "/dashboard/ypi/costing"],
      roles: [R("Merchandiser", "sales", "Prepares and sends the quotation"), R("Sales manager", "sales", "Negotiates price and terms"), R("General manager", "head", "Approves the margin"), R("Buyer", "buyer", "Issues the purchase order")],
      inputs: "Cost per piece", outputs: "Confirmed buyer PO", deps: ["costing"] },
    { id: "matpo", lane: "mrp", title: "BOM & material POs", d0: 14, d1: 19, screen: ["MRP · Supplier orders", "/dashboard/mrp/supplier-orders"],
      roles: [R("Purchaser", "mrp", "Places supplier POs"), R("Merchandiser", "sales", "Confirms the BOM from the tech pack"), R("MRP manager", "mrp", "Approves supplier and price"), R("Supplier", "buyer", "Confirms ETD")],
      inputs: "Buyer PO, BOM", outputs: "Supplier POs", deps: ["quote"] },
    { id: "master", lane: "dp", title: "Master plan", d0: 15, d1: 20, screen: ["4DP · Master plan", "/dashboard/4dp/master-plan"],
      roles: [R("Planner", "dp", "Slots the order into factory capacity"), R("Merchandiser", "sales", "Gives the ex-factory date"), R("Production manager", "prod", "Confirms capacity"), R("MRP", "mrp", "Gives material ETA")],
      inputs: "Buyer PO, capacity", outputs: "Order in the master plan", deps: ["quote"] },
    { id: "confirm", lane: "mrp", title: "Confirm & book freight", d0: 19, d1: 30, screen: ["MRP · Confirmation", "/dashboard/mrp/confirmation"],
      roles: [R("Purchaser", "mrp", "Chases supplier confirmation"), R("Supplier", "buyer", "Sends PI and ETD"), R("Logistics officer", "mrp", "Books freight")],
      inputs: "Supplier POs", outputs: "Confirmed ETD, booking", deps: ["matpo"] },
    { id: "ops", lane: "ce", title: "Operations & IE Master", d0: 20, d1: 45, screen: ["CE · IE Master", "/dashboard/ce/ie-master"],
      roles: [R("IE engineer", "ce", "Operation breakdown in Operation Library and AIVM"), R("Product development", "ce", "Improves methods"), R("Sample room", "ypi", "Confirms methods on the sample"), R("IE manager", "ce", "Approves SAM")],
      inputs: "Tech pack, sample", outputs: "Operation bulletin, SAM", deps: ["quote"] },
    { id: "customs", lane: "mrp", title: "Docs, customs, tracking", d0: 30, d1: 52, screen: ["MRP · Customs", "/dashboard/mrp/customs"],
      roles: [R("Logistics officer", "mrp", "Tracks the vessel"), R("Customs broker", "mrp", "Import clearance"), R("Purchaser", "mrp", "Updates ETA in Yai"), R("Accounting", "acct", "Pays duties and freight")],
      inputs: "Booking, shipping docs", outputs: "Cleared container, ETA", deps: ["confirm"] },
    { id: "arrive", lane: "ship", title: "Container arrival notice", d0: 50, d1: 53, screen: ["MRP · Arrivals", "/dashboard/mrp/arrivals"],
      roles: [R("Shipping officer", "ship", "Tells FC the day and time the container arrives"), R("Trucker / forwarder", "ship", "Delivers the container"), R("Security", "admin", "Gate entry")],
      inputs: "Cleared container", outputs: "Arrival time to FC", deps: ["customs"] },
    { id: "forklift", lane: "ytm", title: "Forklift check", d0: 52, d1: 54, screen: ["YTM", "/dashboard/ytm"],
      roles: [R("Forklift driver", "ytm", "Maintains and checks the forklift before the fabric arrives"), R("YTM mechanic", "ytm", "Fixes any defect"), R("YTM supervisor", "ytm", "Signs readiness")],
      inputs: "Arrival time", outputs: "Forklift ready", deps: ["arrive"] },
    { id: "line", lane: "dp", title: "Unit & line plan", d0: 52, d1: 60, screen: ["4DP · Unit plan", "/dashboard/4dp/unit-plan"],
      roles: [R("Planner", "dp", "Line loading and buffers"), R("Production manager", "prod", "Assigns the line"), R("IE", "ce", "Line efficiency"), R("FC", "fc", "Material-ready date")],
      inputs: "Master plan, material ETA", outputs: "Line plan with dates", deps: ["master", "customs"] },
    { id: "receive", lane: "fc", title: "Fabric receiving", d0: 54, d1: 56, screen: ["FC · Fabric receiving", "/dashboard/fc/fabric-receiving"],
      roles: [R("MRP", "mrp", "Informs all the details — packing list, rolls, colours, ETA"), R("Warehouse supervisor", "fc", "Arranges manpower to check the unloading; coordinates with Shipping on when the container arrives"), R("Forklift driver", "ytm", "Unloads the container with the forklift"), R("Workers", "fc", "Unload and count the rolls"), R("FC clerk", "fc", "Makes sure the system is updated")],
      inputs: "Container, packing list", outputs: "Rolls received in Yai", deps: ["customs", "arrive", "forklift"] },
    { id: "inspect", lane: "qa", title: "Fabric inspection", d0: 56, d1: 59, screen: ["FC · Fabric inspection", "/dashboard/fc/fabric-inspection"],
      roles: [R("Inspection supervisor", "fc", "Plans the 4-point inspection"), R("Inspection workers", "fc", "Check rolls on the machine"), R("QC department", "qa", "Accepts shade, width and defects"), R("FC clerk", "fc", "Records results")],
      inputs: "Received rolls", outputs: "Pass / fail per roll", deps: ["receive"] },
    { id: "test", lane: "qa", title: "Fabric test", d0: 56, d1: 59, screen: ["FC · Fabric test", "/dashboard/fc/fabric-test"],
      roles: [R("Lab technician", "qa", "Shrinkage and colour fastness"), R("QC manager", "qa", "Pass / fail"), R("Merchandiser", "sales", "Sends failures to buyer and supplier")],
      inputs: "Fabric swatches", outputs: "Test report", deps: ["receive"] },
    { id: "relax", lane: "fc", title: "Relaxing 24/48 h", d0: 59, d1: 61, screen: ["FC · Warehouse tracking", "/dashboard/fc/warehouse-tracking"],
      roles: [R("Warehouse supervisor", "fc", "Sets 24 or 48 h per fabric"), R("Workers", "fc", "Unroll onto racks"), R("FC clerk", "fc", "Logs start and end time")],
      inputs: "Passed rolls", outputs: "Relaxed fabric", deps: ["inspect", "test"] },
    { id: "balance", lane: "ce", title: "Line plan & balancing", d0: 55, d1: 62, screen: ["CE · Mechanic line plan", "/dashboard/ce/line-plan"],
      roles: [R("IE engineer", "ce", "Line layout and balancing"), R("Mechanic", "ytm", "Follows the mechanic line plan"), R("Line supervisor", "prod", "Allocates operators"), R("IE manager", "ce", "Sets the CPM target")],
      inputs: "Operation bulletin, line plan", outputs: "Balanced line layout", deps: ["ops", "line"] },
    { id: "setup", lane: "ytm", title: "Machine set-up", d0: 60, d1: 63, screen: ["YTM", "/dashboard/ytm"],
      roles: [R("YTM mechanic", "ytm", "Installs machines, attachments, folders"), R("YTM supervisor", "ytm", "Readiness checklist"), R("Line supervisor", "prod", "Accepts the line")],
      inputs: "Balanced layout", outputs: "Line ready to sew", deps: ["balance"] },
    { id: "ppm", lane: "qa", title: "Pre-production meeting", d0: 62, d1: 63, screen: ["YQMS · Pre-production meeting", "/dashboard/yqms/pre-production-meeting"],
      roles: [R("QA manager", "qa", "Leads; top risks from history"), R("Merchandiser", "sales", "Buyer comments, approved sample"), R("IE", "ce", "Critical operations"), R("Production manager", "prod", "Line readiness"), R("Cutting supervisor", "prod", "Cutting plan")],
      inputs: "PP sample, line plan, fabric", outputs: "Go for bulk", deps: ["samples", "relax", "balance"] },
    { id: "tocut", lane: "fc", title: "Tuk-tuk to cutting", d0: 62, d1: 64, screen: ["FC · Fabric issuing", "/dashboard/fc/fabric-issuing"],
      roles: [R("FC store", "fc", "Issues fabric per cut plan"), R("Tuk-tuk / mini-truck driver", "fc", "Moves rolls to cutting"), R("Cutting clerk", "prod", "Receives and confirms"), R("FC clerk", "fc", "Issue in Yai")],
      inputs: "Relaxed fabric, cut plan", outputs: "Fabric at cutting", deps: ["relax", "line"] },
    { id: "cut", lane: "prod", title: "Cutting", d0: 64, d1: 72, screen: ["YWIP", "/dashboard/ywip"],
      roles: [R("Cutting supervisor", "prod", "Runs the cut plan"), R("Marker planner", "ypi", "Markers and cut plan"), R("Spreaders & cutters", "prod", "Spread and cut"), R("Bundling clerk", "prod", "Bundle tickets in Yai")],
      inputs: "Fabric, markers", outputs: "Cut bundles", deps: ["ppm", "tocut"] },
    { id: "panel", lane: "qa", title: "Cut-panel inspection", d0: 65, d1: 72, screen: ["YQMS · Cut-panel inspection", "/dashboard/yqms/cut-panel-inspection"],
      roles: [R("QA inspector", "qa", "Checks panels"), R("Cutting supervisor", "prod", "Re-cuts rejects"), R("Bundling clerk", "prod", "Releases good bundles")],
      inputs: "Cut bundles", outputs: "Passed bundles", deps: ["cut"] },
    { id: "sew", lane: "prod", title: "Sewing", d0: 67, d1: 86, screen: ["4DP · Line plan", "/dashboard/4dp/line-plan"],
      roles: [R("Line supervisor", "prod", "Runs the line to plan"), R("Operators", "prod", "Sew"), R("Line IE", "ce", "Hourly output vs target"), R("Mechanic", "ytm", "Fixes breakdowns")],
      inputs: "Passed bundles, ready line", outputs: "Sewn garments", deps: ["panel", "setup"] },
    { id: "roving", lane: "qa", title: "Inline / roving QC", d0: 68, d1: 86, screen: ["YQMS · QC roving", "/dashboard/yqms/qc-roving"],
      roles: [R("Roving QC", "qa", "Checks every operator"), R("QA supervisor", "qa", "Raises defect alerts"), R("Line supervisor", "prod", "Corrects the operator")],
      inputs: "Line output", outputs: "Defect data, corrections", deps: ["sew"] },
    { id: "finish", lane: "prod", title: "Finishing", d0: 72, d1: 89, screen: ["YQMS · Finishing check", "/dashboard/yqms/fin-check"],
      roles: [R("Finishing supervisor", "prod", "Runs trimming and pressing"), R("Trimmers & pressers", "prod", "Trim and press"), R("Finishing QC", "qa", "Checks every piece")],
      inputs: "Sewn garments", outputs: "Finished garments", deps: ["sew"] },
    { id: "pack", lane: "prod", title: "Packing", d0: 76, d1: 90, screen: ["YWIP", "/dashboard/ywip"],
      roles: [R("Packing supervisor", "prod", "Packs per packing list"), R("Packers", "prod", "Fold, tag, carton"), R("Packing clerk", "prod", "Carton numbers in Yai"), R("Merchandiser", "sales", "Assortment instructions")],
      inputs: "Finished garments", outputs: "Packed cartons", deps: ["finish"] },
    { id: "final", lane: "qa", title: "Final inspection", d0: 89, d1: 91, screen: ["YQMS · Final inspection", "/dashboard/yqms/final-inspection"],
      roles: [R("QA manager", "qa", "AQL 2.5 inspection"), R("Buyer QC", "buyer", "Inspects or witnesses"), R("Packing supervisor", "prod", "Opens the selected cartons"), R("Merchandiser", "sales", "Releases the shipment")],
      inputs: "Packed cartons", outputs: "Shipment released", deps: ["pack"] },
    { id: "export", lane: "ship", title: "Export docs & ex-factory", d0: 91, d1: 94, screen: ["Shipping · Request", "/dashboard/shipping/request"],
      roles: [R("Shipping officer", "ship", "Invoice, packing list, CO, export customs"), R("Forwarder", "ship", "Booking and container"), R("Security", "admin", "Gate out"), R("Merchandiser", "sales", "Informs the buyer")],
      inputs: "Released shipment", outputs: "Ex-factory", deps: ["final"] },
    { id: "bill", lane: "acct", title: "Shipping bill & invoice", d0: 93, d1: 97, screen: ["Shipping bill", "/dashboard/shipping-bill"],
      roles: [R("Accountant", "acct", "Invoices the buyer"), R("Shipping officer", "ship", "Hands over the documents"), R("Finance manager", "acct", "Approves")],
      inputs: "Export docs", outputs: "Buyer invoice", deps: ["export"] },
    { id: "sail", lane: "ship", title: "Sailed → buyer DC", d0: 94, d1: 120, screen: ["Shipping · Request", "/dashboard/shipping/request"],
      roles: [R("Forwarder", "ship", "Vessel tracking"), R("Shipping officer", "ship", "Updates ETA in Yai"), R("Buyer", "buyer", "Receives at the DC")],
      inputs: "Container on vessel", outputs: "Goods in the buyer's DC", deps: ["export"] },
    { id: "paid", lane: "acct", title: "Buyer payment", d0: 112, d1: 122, screen: ["Shipping bill", "/dashboard/shipping-bill"],
      roles: [R("Finance manager", "acct", "Follows the payment terms"), R("Accountant", "acct", "Records the receipt"), R("Merchandiser", "sales", "Settles any claim")],
      inputs: "Invoice, DC receipt", outputs: "Order closed", deps: ["bill", "sail"] },
  ],
};

/* ---------- Cycles (no real timeline) ---------- */
const HR = {
  kind: "cycle",
  title: "HR · Hire to pay",
  summary: "Runs all the time — from the job advert to the worker's phone on payday.",
  loopTo: "attend", loopLabel: "every day / every month",
  acts: [
    { id: "ad", lane: "hr", title: "Recruitment advert", screen: ["Recruitment", "/dashboard/recruitment"],
      roles: [R("HR clerk", "hr", "Posts the advert"), R("Dept head", "head", "Raises the headcount request"), R("HR manager", "hr", "Approves the headcount")],
      inputs: "Headcount request", outputs: "Advert live" },
    { id: "apply", lane: "worker", title: "Applications online", screen: ["Recruitment", "/dashboard/recruitment"],
      roles: [R("Candidate", "worker", "Applies on the phone"), R("Yai", "sys", "Collects and screens duplicates"), R("HR clerk", "hr", "Monitors the inbox")],
      inputs: "Advert", outputs: "Applications" },
    { id: "review", lane: "hr", title: "Review & interview", screen: ["Interview", "/dashboard/interview"],
      roles: [R("HR clerk", "hr", "Shortlists and schedules"), R("Supervisor", "head", "Skill test"), R("HR manager", "hr", "Interview")],
      inputs: "Applications", outputs: "Shortlist" },
    { id: "approve", lane: "head", title: "Approve", screen: ["Recruitment", "/dashboard/recruitment"],
      roles: [R("HR manager", "hr", "Approves the hire"), R("Dept head", "head", "Confirms the position and start date")],
      inputs: "Shortlist", outputs: "Offer" },
    { id: "join", lane: "worker", title: "Comes to work", screen: ["Onboarding", "/dashboard/onboarding"],
      roles: [R("New worker", "worker", "Reports on day one"), R("HR clerk", "hr", "ID, photo, face registration"), R("Supervisor", "head", "Assigns the line"), R("Safety officer", "admin", "Induction")],
      inputs: "Offer", outputs: "Worker on site" },
    { id: "contract", lane: "sys", title: "Contract issued automatically", screen: ["YHR", "/dashboard/yhr"],
      roles: [R("Yai", "sys", "Generates the contract per labour law"), R("HR clerk", "hr", "Prints for signing"), R("Worker", "worker", "Signs / thumbprints")],
      inputs: "Worker record", outputs: "Signed contract" },
    { id: "attend", lane: "worker", title: "Attendance on the phone", screen: ["My attendance", "/dashboard/my-attendance"],
      roles: [R("Worker", "worker", "Face scan in and out"), R("Supervisor", "head", "Checks headcount"), R("HR clerk", "hr", "Fixes exceptions")],
      inputs: "Daily shift", outputs: "Attendance record" },
    { id: "payroll", lane: "acct", title: "Payroll", screen: ["Payroll", "/dashboard/payroll"],
      roles: [R("Payroll officer", "acct", "Runs payroll"), R("HR clerk", "hr", "Confirms OT and leave"), R("Finance manager", "acct", "Approves")],
      inputs: "Attendance, OT, leave", outputs: "Approved salaries" },
    { id: "pay", lane: "worker", title: "Paid via Wing or ABA", screen: ["Salary bill", "/dashboard/salary-bill"],
      roles: [R("Accountant", "acct", "Sends the bank / Wing file"), R("Wing / ABA", "acct", "Pays out"), R("Worker", "worker", "Gets money and payslip on the phone")],
      inputs: "Approved salaries", outputs: "Payday done" },
  ],
  side: [
    { title: "Leave", body: "Apply on the phone — routed to the supervisor for approval.", screen: ["YHR", "/dashboard/yhr"] },
    { title: "Resign", body: "Resign on the phone — final pay calculated automatically.", screen: ["Resign payment", "/dashboard/resign-payment"] },
    { title: "Anything else", body: "Chat with the HR PA.", screen: ["Speak up", "/dashboard/speak-up"] },
  ],
};

const ACCT = {
  kind: "cycle",
  title: "Accounting · Payroll",
  summary: "The monthly money cycle — salaries out, buyer money in.",
  loopTo: "attend", loopLabel: "every month",
  acts: [
    { id: "attend", lane: "hr", title: "Attendance closed", screen: ["Checklist attendance", "/dashboard/checklist-attendance"],
      roles: [R("HR clerk", "hr", "Closes the month's attendance"), R("Supervisors", "head", "Confirm OT")], inputs: "Daily attendance", outputs: "Month attendance" },
    { id: "payroll", lane: "acct", title: "Payroll run", screen: ["Payroll", "/dashboard/payroll"],
      roles: [R("Payroll officer", "acct", "Calculates salaries, tax, NSSF"), R("Finance manager", "acct", "Approves")], inputs: "Month attendance", outputs: "Payroll" },
    { id: "monthly", lane: "acct", title: "Monthly salary sheet", screen: ["Monthly salary", "/dashboard/monthly-salary"],
      roles: [R("Payroll officer", "acct", "Final sheet per department"), R("General manager", "head", "Signs off")], inputs: "Payroll", outputs: "Signed salary sheet" },
    { id: "pay", lane: "acct", title: "Pay via Wing / ABA", screen: ["Salary bill", "/dashboard/salary-bill"],
      roles: [R("Accountant", "acct", "Uploads the bank file"), R("Worker", "worker", "Receives on the phone")], inputs: "Salary sheet", outputs: "Salaries paid" },
    { id: "bill", lane: "acct", title: "Buyer invoices & receipts", screen: ["Shipping bill", "/dashboard/shipping-bill"],
      roles: [R("Accountant", "acct", "Invoices every shipment"), R("Shipping officer", "ship", "Sends the export docs")], inputs: "Shipments", outputs: "Receivables" },
  ],
};

const ADMIN = {
  kind: "cycle",
  title: "Admin",
  summary: "Every request — gate pass, car, meeting room, repair — runs the same loop.",
  loopTo: "req", loopLabel: "for the next request",
  acts: [
    { id: "req", lane: "worker", title: "Request on the phone", screen: ["Tickets", "/dashboard/ticket"],
      roles: [R("Any staff", "worker", "Raises the ticket"), R("Yai", "sys", "Routes it to the right team")], inputs: "Need", outputs: "Ticket" },
    { id: "ok", lane: "head", title: "Approve", screen: ["Tickets", "/dashboard/ticket"],
      roles: [R("Dept head", "head", "Approves"), R("Admin manager", "admin", "Assigns the team")], inputs: "Ticket", outputs: "Approved ticket" },
    { id: "do", lane: "admin", title: "Do the work", screen: ["Tickets", "/dashboard/ticket"],
      roles: [R("Admin team", "admin", "Gate pass, car, room, repair"), R("Security / driver", "admin", "Executes")], inputs: "Approved ticket", outputs: "Done" },
    { id: "close", lane: "worker", title: "Close & rate", screen: ["Tickets", "/dashboard/ticket"],
      roles: [R("Requester", "worker", "Confirms and rates"), R("Admin manager", "admin", "Reviews slow tickets")], inputs: "Done", outputs: "Closed ticket" },
  ],
};

const CSR = {
  kind: "cycle",
  title: "CSR",
  summary: "Energy, water, waste, chemicals — measured, audited, reported to buyers.",
  loopTo: "plan", loopLabel: "every audit cycle",
  acts: [
    { id: "plan", lane: "csr", title: "Audit plan", screen: ["Audit plan", "/dashboard/audit-plan"],
      roles: [R("CSR manager", "csr", "Plans buyer and internal audits"), R("General manager", "head", "Approves")], inputs: "Buyer requirements", outputs: "Audit calendar" },
    { id: "data", lane: "csr", title: "Collect data", screen: ["Audit plan", "/dashboard/audit-plan"],
      roles: [R("CSR officer", "csr", "Energy, water, waste, chemical readings"), R("YTM", "ytm", "Meter readings"), R("Admin", "admin", "Waste records")], inputs: "Meters, records", outputs: "Monthly data" },
    { id: "audit", lane: "csr", title: "Digital audit", screen: ["Audit plan", "/dashboard/audit-plan"],
      roles: [R("CSR officer", "csr", "Runs the checklist"), R("Dept heads", "head", "Answer findings")], inputs: "Monthly data", outputs: "Findings" },
    { id: "cap", lane: "head", title: "Corrective actions", screen: ["Audit plan", "/dashboard/audit-plan"],
      roles: [R("Dept heads", "head", "Fix findings"), R("CSR manager", "csr", "Verifies closure")], inputs: "Findings", outputs: "Closed CAPs" },
    { id: "report", lane: "buyer", title: "Report to buyers", screen: ["Audit plan", "/dashboard/audit-plan"],
      roles: [R("CSR manager", "csr", "Sends the report"), R("Buyer", "buyer", "Reviews")], inputs: "Closed CAPs", outputs: "Buyer report" },
  ],
};

const YTM_SHOP = {
  kind: "cycle",
  title: "YTM Shop · Spare parts",
  summary: "Needles, parts and attachments — requested on the line, issued from the shop, re-ordered before they run out.",
  loopTo: "req", loopLabel: "for every part request",
  acts: [
    { id: "req", lane: "prod", title: "Part request from the line", screen: ["YTM Shop", "/dashboard/ytm-shop"],
      roles: [R("Mechanic", "ytm", "Raises the request with the machine number"), R("Line supervisor", "prod", "Confirms the breakdown")], inputs: "Broken / worn part", outputs: "Part request" },
    { id: "ok", lane: "ytm", title: "Approve", screen: ["YTM Shop", "/dashboard/ytm-shop"],
      roles: [R("YTM supervisor", "ytm", "Approves against the machine history")], inputs: "Part request", outputs: "Approved request" },
    { id: "issue", lane: "ytm", title: "Issue from the shop", screen: ["YTM Shop", "/dashboard/ytm-shop"],
      roles: [R("Shop keeper", "ytm", "Issues the part, takes the old one back"), R("Mechanic", "ytm", "Fits the part")], inputs: "Approved request", outputs: "Machine running" },
    { id: "reorder", lane: "mrp", title: "Re-order at minimum stock", screen: ["YTM Shop", "/dashboard/ytm-shop"],
      roles: [R("Shop keeper", "ytm", "Flags minimum stock"), R("Purchaser", "mrp", "Orders from the supplier")], inputs: "Stock level", outputs: "Stock refilled" },
  ],
};

// Order (Gamini 2026-10-06): overview first, production modules in flow
// sequence, then the support departments, Accounting last.
const PROCESSES = [
  { id: "order", name: "Order → Ship", sub: "Merchandising to shipping", flow: ORDER },
  { id: "dp", name: "4DP · Planning", flow: ORDER, focus: ["dp"] },
  { id: "ypi", name: "YPI · Merchandising", flow: ORDER, focus: ["sales", "ypi"] },
  { id: "mrp", name: "MRP · Materials", flow: ORDER, focus: ["mrp"] },
  { id: "fc", name: "FC · Fabric Center", flow: ORDER, focus: ["fc"] },
  { id: "ie", name: "CE · IE", flow: ORDER, focus: ["ce"] },
  { id: "prod", name: "Production", sub: "Cut · sew · finish · pack", flow: ORDER, focus: ["prod"] },
  { id: "qa", name: "Quality Management", flow: ORDER, focus: ["qa"] },
  { id: "ytm", name: "YTM · Maintenance", flow: ORDER, focus: ["ytm"] },
  { id: "ytmshop", name: "YTM Shop", flow: YTM_SHOP },
  { id: "hr", name: "HR", flow: HR },
  { id: "admin", name: "Admin", flow: ADMIN },
  { id: "csr", name: "CSR", flow: CSR },
  { id: "ship", name: "Shipping", flow: ORDER, focus: ["ship"] },
  { id: "acct", name: "Accounting · Payroll", flow: ACCT },
];

/* ---------- timeline layout ---------- */
const PX = 10, LABEL_W = 132, HEAD_H = 46, TRACK_H = 32, BAR_H = 22, PAD = 6;

function layoutTimeline(flow) {
  const pos = {};
  const lanes = [];
  let y = 0;
  flow.lanes.forEach((lane) => {
    const tracks = [];
    flow.acts.filter((a) => a.lane === lane).sort((a, b) => a.d0 - b.d0).forEach((a) => {
      const x = a.d0 * PX, w = Math.max((a.d1 - a.d0) * PX, 8);
      const textW = a.title.length * 6.4 + 14;
      const end = x + (w >= textW ? w : w + textW);
      let t = tracks.findIndex((e) => e + 6 <= x);
      if (t < 0) { t = tracks.length; tracks.push(0); }
      tracks[t] = end;
      pos[a.id] = { x, w, inside: w >= textW, y: y + PAD + t * TRACK_H };
    });
    const h = Math.max(1, tracks.length) * TRACK_H + PAD * 2 - (TRACK_H - BAR_H);
    lanes.push({ lane, y, h });
    y += h;
  });
  return { pos, lanes, height: y, width: flow.days * PX };
}

function Timeline({ flow, focus, sel, onSel }) {
  const L = useMemo(() => layoutTimeline(flow), [flow]);
  const dim = (lane) => focus && !focus.includes(lane);
  const byId = useMemo(() => Object.fromEntries(flow.acts.map((a) => [a.id, a])), [flow]);

  const arrows = [];
  flow.acts.forEach((b) => (b.deps || []).forEach((aid) => {
    const a = byId[aid], pa = L.pos[aid], pb = L.pos[b.id];
    if (!a || !pa || !pb) return;
    const x1 = Math.min(pa.x + pa.w, Math.max(pb.x, pa.x + 4));
    const x2 = pb.x;
    const y1 = pa.y + BAR_H / 2, y2 = pb.y + BAR_H / 2;
    const dx = Math.max(14, (x2 - x1) / 2);
    const cross = a.lane !== b.lane;
    const hot = !!sel && (sel === aid || sel === b.id);
    const faded = (focus && dim(a.lane) && dim(b.lane)) || (sel && !hot);
    arrows.push({ key: `${aid}>${b.id}`, d: `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`,
      color: cross ? DEPTS[a.lane].color : "#64748b", marker: cross ? a.lane : "same", hot, faded, cross });
  }));

  return (
    <div className="flex rounded-xl border border-white/10 bg-slate-950/40 overflow-hidden">
      <div className="flex-shrink-0 border-r border-white/10" style={{ width: LABEL_W }}>
        <div style={{ height: HEAD_H }} className="border-b border-white/10 px-2 flex items-end pb-1 text-[10px] uppercase tracking-wider text-slate-500">Department</div>
        {L.lanes.map((ln) => (
          <div key={ln.lane} style={{ height: ln.h }} className={`px-2 flex items-center border-b border-white/5 ${dim(ln.lane) ? "opacity-40" : ""}`}>
            <span className="text-[11px] font-bold leading-tight" style={{ color: DEPTS[ln.lane].color }}>{DEPTS[ln.lane].label}</span>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto flex-1">
        <div className="relative" style={{ width: L.width + 40, height: HEAD_H + L.height }}>
          {flow.phases.map((p) => (
            <div key={p.label} className="absolute top-0 text-[10px] text-slate-400 border-l border-white/10 px-1 truncate" style={{ left: p.d0 * PX, width: (p.d1 - p.d0) * PX, height: 18 }}>{p.label}</div>
          ))}
          {Array.from({ length: Math.floor(flow.days / 5) + 1 }, (_, i) => i * 5).map((d) => (
            <div key={d} className="absolute" style={{ left: d * PX, top: 18, height: HEAD_H + L.height - 18 }}>
              <div className={`h-full ${d === 0 ? "border-l-2 border-emerald-400" : d % 10 === 0 ? "border-l border-white/10" : "border-l border-white/[0.04]"}`} />
              {d % 10 === 0 && <div className={`absolute top-1 left-1 text-[10px] whitespace-nowrap ${d === 0 ? "text-emerald-300 font-bold" : "text-slate-500"}`}>{d === 0 ? "DAY 0" : `D${d}`}</div>}
            </div>
          ))}
          <div className="absolute left-0 right-0 border-b border-white/10" style={{ top: HEAD_H }} />
          {L.lanes.map((ln) => (
            <div key={ln.lane} className="absolute left-0 right-0 border-b border-white/5" style={{ top: HEAD_H + ln.y + ln.h }} />
          ))}

          <svg className="absolute left-0 pointer-events-none" style={{ top: HEAD_H }} width={L.width + 40} height={L.height}>
            <defs>
              {Object.entries(DEPTS).map(([k, v]) => (
                <marker key={k} id={`sop-ah-${k}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" fill={v.color} />
                </marker>
              ))}
              <marker id="sop-ah-same" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#64748b" /></marker>
            </defs>
            {arrows.map((ar) => (
              <path key={ar.key} d={ar.d} fill="none" stroke={ar.color} strokeWidth={ar.hot ? 2.2 : 1.3}
                strokeDasharray={ar.cross ? undefined : "3 3"} opacity={ar.faded ? 0.12 : ar.hot ? 1 : 0.55}
                markerEnd={`url(#sop-ah-${ar.marker})`} />
            ))}
          </svg>

          {flow.acts.map((a) => {
            const p = L.pos[a.id], c = DEPTS[a.lane].color, on = sel === a.id;
            return (
              <button key={a.id} onClick={() => onSel(a.id)} title={`${a.title} · Day ${a.d0}–${a.d1}`}
                className={`absolute flex items-center text-left transition-opacity ${dim(a.lane) ? "opacity-30" : ""}`}
                style={{ left: p.x, top: HEAD_H + p.y, height: BAR_H }}>
                <span className="rounded-md h-full flex items-center px-1.5 text-[11px] font-semibold whitespace-nowrap"
                  style={{ width: p.w, background: on ? c : `${c}40`, color: on ? "#0f172a" : "#f1f5f9", boxShadow: on ? "0 0 0 2px #fff" : `inset 0 0 0 1px ${c}` }}>
                  {p.inside ? a.title : ""}
                </span>
                {!p.inside && <span className="ml-1 text-[11px] whitespace-nowrap" style={{ color: on ? "#fff" : c }}>{a.title}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Cycle({ flow, sel, onSel, go }) {
  const loopIdx = flow.acts.findIndex((a) => a.id === flow.loopTo);
  return (
    <div>
      <div className="flex flex-wrap items-stretch gap-y-3">
        {flow.acts.map((a, i) => {
          const c = DEPTS[a.lane].color, on = sel === a.id;
          return (
            <React.Fragment key={a.id}>
              <button onClick={() => onSel(a.id)} className="w-44 text-left rounded-xl p-3 border transition hover:brightness-125"
                style={{ background: on ? `${c}30` : "#1e293b", borderColor: on ? c : "rgba(255,255,255,0.1)", borderLeft: `4px solid ${c}` }}>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{ background: c, color: "#0f172a" }}>{i + 1}</span>
                  <span className="text-[10px] uppercase tracking-wide" style={{ color: c }}>{DEPTS[a.lane].label}</span>
                </div>
                <div className="text-[13px] font-semibold text-slate-100 mt-1.5 leading-snug">{a.title}</div>
                <div className="text-[11px] text-slate-400 mt-1">{a.roles.length} roles · ↗ {a.screen[0]}</div>
              </button>
              {i < flow.acts.length - 1 && <div className="flex items-center px-1.5 text-slate-500 text-lg">→</div>}
            </React.Fragment>
          );
        })}
      </div>
      {loopIdx >= 0 && (
        <div className="mt-3 inline-flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1">
          ↻ repeats {flow.loopLabel} — back to step {loopIdx + 1}: {flow.acts[loopIdx].title}
        </div>
      )}
      {flow.side && (
        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Any time, on the phone</div>
          <div className="flex flex-wrap gap-2">
            {flow.side.map((s) => (
              <button key={s.title} onClick={() => go(s.screen[1])} className="text-left rounded-xl bg-slate-800 border border-white/10 p-3 w-60 hover:bg-slate-700">
                <div className="text-sm font-semibold">{s.title}</div>
                <div className="text-xs text-slate-400 mt-1">{s.body}</div>
                <div className="text-[11px] text-emerald-300 mt-1">↗ {s.screen[0]}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityCard({ flow, act, onSel, go }) {
  const c = DEPTS[act.lane].color;
  const i = flow.acts.indexOf(act);
  const next = flow.kind === "timeline"
    ? flow.acts.filter((b) => (b.deps || []).includes(act.id))
    : [flow.acts[i + 1] || flow.acts.find((a) => a.id === flow.loopTo)].filter(Boolean);
  const prev = flow.kind === "timeline"
    ? (act.deps || []).map((id) => flow.acts.find((a) => a.id === id)).filter(Boolean)
    : (i > 0 ? [flow.acts[i - 1]] : []);
  const chip = (a) => (
    <button key={a.id} onClick={() => onSel(a.id)} className="text-[11px] rounded-full px-2 py-0.5 border hover:bg-white/10" style={{ borderColor: DEPTS[a.lane].color, color: DEPTS[a.lane].color }}>
      {a.title} · {DEPTS[a.lane].label}
    </button>
  );
  return (
    <div className="mt-4 rounded-2xl bg-slate-800 border border-white/10 p-4" style={{ borderTop: `4px solid ${c}` }}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <div className="text-lg font-bold">{act.title}</div>
        <div className="text-xs font-semibold" style={{ color: c }}>{DEPTS[act.lane].label}</div>
        {flow.kind === "timeline" && <div className="text-xs text-slate-400">Day {act.d0} → Day {act.d1}</div>}
        <button onClick={() => go(act.screen[1])} className="ml-auto text-xs rounded-lg px-2.5 py-1 bg-white/5 hover:bg-white/15" style={{ color: c }}>↗ {act.screen[0]}</button>
      </div>
      <div className="mt-3 grid gap-2">
        {act.roles.map((r) => (
          <div key={r.role} className="flex gap-3 items-start text-sm">
            <div className="w-40 flex-shrink-0">
              <div className="font-semibold text-slate-100">{r.role}</div>
              <div className="text-[10px]" style={{ color: DEPTS[r.dept].color }}>{DEPTS[r.dept].label}</div>
            </div>
            <div className="text-slate-300">{r.does}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-lg bg-white/5 px-2 py-1"><span className="text-slate-500">In:</span> {act.inputs}</span>
        <span className="text-slate-500 self-center">→</span>
        <span className="rounded-lg bg-white/5 px-2 py-1"><span className="text-slate-500">Out:</span> {act.outputs}</span>
      </div>
      {prev.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5 items-center"><span className="text-[10px] uppercase tracking-wider text-slate-500 mr-1">Comes from</span>{prev.map(chip)}</div>}
      {next.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5 items-center"><span className="text-[10px] uppercase tracking-wider text-slate-500 mr-1">Hands to</span>{next.map(chip)}</div>}
    </div>
  );
}

const SOPMap = ({ onBack }) => {
  const navigate = useNavigate();
  const [pid, setPid] = useState("order");
  const [sel, setSel] = useState(null);
  const cardRef = useRef(null);
  const proc = PROCESSES.find((p) => p.id === pid) || PROCESSES[0];
  const flow = proc.flow;
  const act = flow.acts.find((a) => a.id === sel);
  const go = (path) => { if (path) navigate(path); };

  useEffect(() => { setSel(null); }, [pid]);
  const pick = (id) => {
    setSel(id);
    setTimeout(() => cardRef.current && cardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" }), 30);
  };

  return (
    // pt-20 clears the fixed agent bar (My Task Agent / Agent Collective / Big Brain) that floats under the header
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col pt-20">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-white/10" aria-label="Back"><ArrowLeft size={18} /></button>
        <div>
          <div className="font-bold text-lg leading-tight">SOP · Standard Operating Procedures</div>
          <div className="text-xs text-slate-400">Who does what, on which Yai screen, and who it hands to next.</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <aside className="md:w-56 flex-shrink-0 border-b md:border-b-0 md:border-r border-white/10 p-2 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto">
          <div className="hidden md:block text-[10px] uppercase tracking-wider text-slate-500 px-2 pt-1 pb-1">Main processes</div>
          {PROCESSES.map((p) => (
            <button key={p.id} onClick={() => setPid(p.id)}
              className={`flex-shrink-0 text-left text-sm px-3 py-2 rounded-lg transition ${pid === p.id ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-white/5"}`}>
              <div className="whitespace-nowrap">{p.name}</div>
              {p.sub && <div className={`text-[10px] whitespace-nowrap ${pid === p.id ? "text-emerald-100" : "text-slate-500"}`}>{p.sub}</div>}
            </button>
          ))}
        </aside>

        <main className="flex-1 min-w-0 p-4 overflow-y-auto">
          <div className="mb-3">
            <div className="text-xl font-bold">{proc.focus ? proc.name : flow.title}</div>
            <div className="text-sm text-slate-400">{flow.summary}</div>
            {proc.focus && <div className="text-xs mt-1 text-slate-300">Showing this department's part of the order — hand-offs in and out stay visible.</div>}
          </div>

          {flow.kind === "timeline"
            ? <Timeline flow={flow} focus={proc.focus} sel={sel} onSel={pick} />
            : <Cycle flow={flow} sel={sel} onSel={pick} go={go} />}

          <div ref={cardRef}>
            {act
              ? <ActivityCard flow={flow} act={act} onSel={pick} go={go} />
              : <div className="mt-4 text-sm text-slate-500">Click any activity to see who is involved, what each one does, and where it goes next.</div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SOPMap;
