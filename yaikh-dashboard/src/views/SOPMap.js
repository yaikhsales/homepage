import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

/* SOP — Standard Operating Procedures (Management Dashboard → SOP).
 * LEFT: the main processes, in Gamini's order.
 * RIGHT:
 *  - Order → Ship: a day timeline (DAY 0 = the brand's order package
 *    arrives). Each activity box sits on its days in its department row and
 *    says who does it — [Yai] when the system / a PA does it, a person icon +
 *    role when a human does — and arrows are the hand-offs between
 *    departments. The thin strip under a box is its real duration.
 *  - HR / Admin / CSR / Accounting / YTM Shop: no real timeline — a cycle.
 * Click any box → every role and its responsibility, inputs → outputs, the
 * Yai screen, what it comes from and what it hands to.
 * Texts follow Gamini's dictation in the PA knowledge (sim/view kb process,
 * 2026-10-05/06). Department entries open the order timeline with their own
 * row in focus. */

const DEPTS = {
  dp:     { label: "4DP · Planning",      color: "#f472b6" },
  sales:  { label: "Sales · Merch",       color: "#38bdf8" },
  ypi:    { label: "YPI · Tech & samples", color: "#60a5fa" },
  mrp:    { label: "MRP",                 color: "#fbbf24" },
  fc:     { label: "FC · Warehouse",      color: "#a78bfa" },
  ce:     { label: "CE · IE",             color: "#22d3ee" },
  prod:   { label: "Production",          color: "#fb923c" },
  qa:     { label: "QA · QMS",            color: "#fb7185" },
  ytm:    { label: "YTM · Maintenance",   color: "#facc15" },
  ship:   { label: "Shipping",            color: "#2dd4bf" },
  acct:   { label: "Accounting",          color: "#a3e635" },
  hr:     { label: "HR",                  color: "#34d399" },
  head:   { label: "Dept Head",           color: "#94a3b8" },
  sys:    { label: "Yai (auto)",          color: "#10b981" },
  worker: { label: "Worker · Phone",      color: "#e879f9" },
  admin:  { label: "Admin",               color: "#cbd5e1" },
  csr:    { label: "CSR",                 color: "#4ade80" },
  buyer:  { label: "Brand · Supplier",    color: "#f9a8d4" },
};

const R = (role, dept, does) => ({ role, dept, does });
const Y = (actor, does) => ({ auto: true, actor, does });   // done by Yai / a PA
const H = (actor, does) => ({ auto: false, actor, does });  // done by a person

/* ---------- ORDER → SHIP timeline (days from the order package) ---------- */
const ORDER = {
  kind: "timeline",
  title: "Order → Ship",
  summary: "DAY 0 = the brand's order package reaches the factory. Every activity on its days, who does it, and every hand-off between departments.",
  lanes: ["dp", "sales", "ypi", "mrp", "fc", "ce", "prod", "qa", "ytm", "ship", "acct"],
  days: 132,
  phases: [
    { d0: 0, d1: 25, label: "Quotation & first sample" },
    { d0: 25, d1: 60, label: "Order confirmed · materials · IE" },
    { d0: 60, d1: 70, label: "Receive, inspect, pilot run" },
    { d0: 70, d1: 98, label: "Bulk production" },
    { d0: 98, d1: 132, label: "Ship & get paid" },
  ],
  acts: [
    { id: "pkg", lane: "sales", title: "Order package arrives", d0: 0, d1: 2, by: H("Sales manager", "receives the brand's package of 10–20 orders"),
      screen: ["YPI · Tech pack", "/dashboard/ypi/techpack"],
      roles: [R("Sales manager", "sales", "Receives the order package: quantities, delivery dates, sketches or show photos"), R("Merchandiser", "sales", "Checks the nature and quantity of each order"), R("Marketing", "sales", "Confirms buyer, season and programme"), R("Yai", "sys", "Gives each order its internal reference (YAI + customer code + number) — the brand name is never used")],
      inputs: "Brand sketches, photos, designer drafts", outputs: "Orders registered (YAIAA1 …)", deps: [] },
    { id: "cm", lane: "ce", title: "CM cost = SAM × CPM", d0: 3, d1: 7, by: Y("CE PA", "prices cut & make from SAM × cost per minute"),
      screen: ["CE · Style costing", "/dashboard/ce/style-costing"],
      roles: [R("IE engineer", "ce", "Estimates the SAM from the Operation Library"), R("Accounting", "acct", "Gives the month's cost per minute"), R("CE PA", "sys", "Calculates CM per garment = SAM × CPM")],
      inputs: "Sketch, similar styles", outputs: "CM price per garment", deps: ["pkg"] },
    { id: "logi", lane: "ship", title: "Logistics cost", d0: 3, d1: 6, by: Y("Shipping PA", "adds the contracted container rate for the route"),
      screen: ["Shipping · Request", "/dashboard/shipping/request"],
      roles: [R("Shipping PA", "sys", "Picks the contracted rate, e.g. Shanghai → Sihanoukville"), R("MRP", "mrp", "Confirms where the materials come from"), R("Shipping officer", "ship", "Checks port handling and trucking are included")],
      inputs: "Material origins", outputs: "Logistics cost", deps: ["pkg"] },
    { id: "quote", lane: "ypi", title: "Quotation · Garment Costing", d0: 2, d1: 9, by: H("Merchandiser", "prices material + CM + extras + logistics"),
      screen: ["YPI · Costing", "/dashboard/ypi/costing"],
      roles: [R("Merchandiser", "sales", "Builds the quotation in the Material Portal from the rough BOM"), R("CE", "ce", "Gives the CM cost"), R("Shipping / MRP", "ship", "Give the logistics cost"), R("Subcontractors", "buyer", "Quote printing, embroidery and washing"), R("Sales manager", "sales", "Approves and sends the quotation")],
      inputs: "Rough BOM, CM, extras, logistics", outputs: "Quotation to the brand", deps: ["pkg", "cm", "logi"] },
    { id: "techpack", lane: "ypi", title: "Tech pack · Prod Sheet", d0: 6, d1: 36, by: Y("YPI PA", "issues the tech pack in Khmer, English, Chinese"),
      screen: ["YPI · Tech pack", "/dashboard/ypi/techpack"],
      roles: [R("Technical team", "ypi", "Fills the 11 pages: spec sheet, sketch, measurement spec, process sheet, thread consumption …"), R("Merchandiser", "sales", "Order details and packing instructions"), R("QC", "qa", "Approves the Quality Control box in the Prod Sheet (name + date)"), R("YPI PA", "sys", "Publishes it to floor iPads and TVs in 3 languages")],
      inputs: "Colours, sizes, basic measurement chart", outputs: "Tech pack (Prod Sheet)", deps: ["pkg"] },
    { id: "sample1", lane: "ypi", title: "First test sample", d0: 9, d1: 18, by: H("Sample room", "cuts, sews and packs the first sample"),
      screen: ["YPI · Sample plan", "/dashboard/ypi/sample-plan"],
      roles: [R("Sample room supervisor", "ypi", "Plans the sample dates in the sample plan"), R("Pattern maker", "ypi", "Pattern and grading"), R("Sample operators", "ypi", "Cut, sew and pack the sample"), R("Merchandiser", "sales", "Logs findings into YPI")],
      inputs: "Confirmed quotation", outputs: "First sample", deps: ["quote"] },
    { id: "send", lane: "sales", title: "Sample to the brand", d0: 18, d1: 25, by: H("Merchandiser", "sends it to the brand's USA / Canada / HK office"),
      screen: ["YPI · Sample plan", "/dashboard/ypi/sample-plan"],
      roles: [R("Merchandiser", "sales", "Sends and follows the sample"), R("Brand", "buyer", "Accepts the quality and making"), R("Sales manager", "sales", "Confirms price and order")],
      inputs: "First sample, quotation", outputs: "Order confirmed", deps: ["sample1"] },
    { id: "master", lane: "dp", title: "Order on the Master Plan", d0: 25, d1: 27, by: Y("4DP PA", "puts the confirmed order on the Master Plan"),
      screen: ["4DP · Master plan", "/dashboard/4dp/master-plan"],
      roles: [R("Planner", "dp", "Hands the order to one factory as a bar"), R("Merchandiser", "sales", "Keeps at least one week of buffer (dotted)"), R("4DP PA", "sys", "Shows the MRP, YPI and CE lights on the bar")],
      inputs: "Accepted sample + price", outputs: "Order bar with dates", deps: ["send"] },
    { id: "cons", lane: "ypi", title: "Consumption chart", d0: 27, d1: 31, by: H("Marker maker", "sets fabric per size; merchandiser the pieces"),
      screen: ["YPI · Markers", "/dashboard/ypi/markers"],
      roles: [R("Marker maker", "ypi", "Fabric consumption from the marker, per size"), R("Merchandiser", "sales", "Labels and trims per garment"), R("YPI PA", "sys", "Colours the chart: green done, orange open, red late")],
      inputs: "Tech pack, marker", outputs: "Consumption per garment", deps: ["master", "techpack"] },
    { id: "bom", lane: "ypi", title: "BOM & buyer approvals", d0: 29, d1: 35, by: H("Merchandiser", "builds the BOM, gets lab dips & trims approved"),
      screen: ["YPI · Material portal", "/dashboard/ypi/material-portal"],
      roles: [R("Merchandiser", "sales", "Builds the Bill of Materials in the Material Portal"), R("Brand", "buyer", "Approves lab dips, strike-offs and trim samples"), R("Local suppliers", "buyer", "Their items need the brand's approval; nominated suppliers' don't")],
      inputs: "Consumption", outputs: "Approved BOM, purchase requests", deps: ["cons"] },
    { id: "matpo", lane: "mrp", title: "Material POs & bookings", d0: 33, d1: 39, by: H("MRP buyer", "places POs, books real mill and vessel dates"),
      screen: ["MRP · Supplier orders", "/dashboard/mrp/supplier-orders"],
      roles: [R("MRP buyer", "mrp", "Places material POs with approved suppliers"), R("Merchandiser", "sales", "Confirms every booking once the order is on the Master Plan"), R("Mill / supplier", "buyer", "Confirms its ex-factory date"), R("MRP PA", "sys", "Checks quantity = garments × consumption + wastage")],
      inputs: "Approved BOM", outputs: "Booked POs with ETAs", deps: ["bom"] },
    { id: "eta", lane: "mrp", title: "ETAs to the Master Plan", d0: 39, d1: 41, by: Y("MRP PA", "reports 6 material ETAs, turns the light red if late"),
      screen: ["4DP · MRP TV", "/dashboard/4dp/mrp-tv"],
      roles: [R("MRP PA", "sys", "Reports fabric, thread, labels, artwork, trims and packing ETAs"), R("Planner", "dp", "Sees the order bar move with the material"), R("Merchandiser", "sales", "Acts on a red light")],
      inputs: "Bookings", outputs: "MRP light on the order bar", deps: ["matpo"] },
    { id: "docs", lane: "mrp", title: "Supplier docs · portal", d0: 40, d1: 46, by: H("Supplier", "uploads packing list and DO to the portal"),
      screen: ["MRP · Supplier portal", "/dashboard/mrp/supplier-portal"],
      roles: [R("Supplier", "buyer", "Uploads the final packing list and delivery order"), R("MRP officer", "mrp", "Checks them against the order"), R("Shipping agent", "buyer", "Files the export declaration; the line issues the B/L")],
      inputs: "Goods released by the mill", outputs: "Documents in MRP", deps: ["matpo"] },
    { id: "track", lane: "mrp", title: "Vessel tracking & customs", d0: 46, d1: 58, by: H("Logistics officer", "tracks the vessel, clears Cambodian customs"),
      screen: ["MRP · Tracking", "/dashboard/mrp/tracking"],
      roles: [R("Logistics officer", "mrp", "Tracks ex-factory → port → sailing → Sihanoukville → truck"), R("Customs broker", "mrp", "Import declaration, 2–4 days"), R("Shipping line", "buyer", "Arrival notice and delivery order"), R("MRP PA", "sys", "Adds customs + trucking for the factory ETA; shows it on the Arrival TV")],
      inputs: "Shipping documents", outputs: "Confirmed arrival date", deps: ["docs"] },
    { id: "fit", lane: "ypi", title: "Fit & marketing samples", d0: 31, d1: 48, by: H("Sample room", "fit sample in all sizes, then salesman / e-com"),
      screen: ["YPI · Sample plan", "/dashboard/ypi/sample-plan"],
      roles: [R("Sample room", "ypi", "Makes the fit sample (one colour, all sizes) and marketing samples"), R("Merchandiser", "sales", "Sends them and logs comments"), R("Brand", "buyer", "Approves fit; photographs e-com samples"), R("YPI PA", "sys", "Keeps quality, machine and mechanic findings")],
      inputs: "Approved first sample", outputs: "Approved fit", deps: ["master"] },
    { id: "pp", lane: "ypi", title: "PP sample", d0: 48, d1: 55, by: H("Merchandiser", "sends the PP sample — the bulk reference"),
      screen: ["YPI · Sample plan", "/dashboard/ypi/sample-plan"],
      roles: [R("Sample room", "ypi", "Makes the pre-production sample"), R("Merchandiser", "sales", "Sends it to the brand"), R("Brand", "buyer", "Approves — a rejection costs about one week"), R("QA", "qa", "Keeps it for the final inspection")],
      inputs: "Approved fit", outputs: "Approved PP sample", deps: ["fit"] },
    { id: "contract", lane: "sales", title: "Brand issues PO contract", d0: 54, d1: 56, by: H("Brand", "issues the purchase-order contract"),
      screen: ["YPI · Tech pack", "/dashboard/ypi/techpack"],
      roles: [R("Brand", "buyer", "Issues the PO contract — material is almost here"), R("Sales manager", "sales", "Confirms it in Yai before production starts"), R("Merchandiser", "sales", "Updates the order")],
      inputs: "Approved PP sample", outputs: "Confirmed contract", deps: ["pp"] },
    { id: "sam", lane: "ce", title: "Operations & 1st SAM", d0: 28, d1: 42, by: H("IE engineer", "builds the style from the Operation Library"),
      screen: ["CE · Product development", "/dashboard/ce/product-development"],
      roles: [R("IE engineer", "ce", "Drags operations into Garment Analysis"), R("AI Vision (AVMA)", "sys", "Times operations from video → SMV"), R("IE manager", "ce", "Approves the 1st SAM"), R("CE PA", "sys", "Saves the Operation Breakdown")],
      inputs: "Tech pack, sample", outputs: "Operation breakdown, 1st SAM", deps: ["master", "techpack"] },
    { id: "layout", lane: "ce", title: "Line planning & grades", d0: 42, d1: 52, by: H("IE engineer", "sets machines, attachments, worker grades"),
      screen: ["CE · Line planning", "/dashboard/ce/line-planning"],
      roles: [R("IE engineer", "ce", "Machine, presser foot and attachment per operation; grade A / B / C"), R("Line Planning tool", "sys", "Divides work by pitch time (SAM ÷ workers)"), R("Production manager", "prod", "Confirms the workers")],
      inputs: "Operation breakdown", outputs: "Line layout (U / zig-zag)", deps: ["sam"] },
    { id: "mech", lane: "ytm", title: "Mechanic line plan", d0: 52, d1: 60, by: H("YTM mechanic", "prepares machines; rent or buy what's missing"),
      screen: ["CE · Mechanic line plan", "/dashboard/ce/line-plan"],
      roles: [R("YTM supervisor", "ytm", "Checks which machines come in and go out"), R("Mechanic", "ytm", "Sets machines, folders and needles"), R("Purchaser", "mrp", "Rents or buys missing machines"), R("Planner", "dp", "Moves another order if its line holds the machines")],
      inputs: "Confirmed line layout", outputs: "Machines ready", deps: ["layout"] },
    { id: "gate", lane: "dp", title: "Gate: YPI · MRP · CE", d0: 56, d1: 60, by: Y("4DP PA", "checks the 3 lights; any red moves the start"),
      screen: ["4DP · Master plan", "/dashboard/4dp/master-plan"],
      roles: [R("4DP PA", "sys", "Shows the YPI, MRP and CE lights"), R("Planner", "dp", "Moves the start date — and every plan below"), R("Merchandiser", "sales", "Uses the buffer")],
      inputs: "Samples, material ETAs, SAM + machines", outputs: "Go / new start date", deps: ["eta", "pp", "layout"] },
    { id: "unit", lane: "dp", title: "Unit, section & line plan", d0: 58, d1: 63, by: Y("4DP PA", "plans cutting → sewing +2 d → finishing +3 d"),
      screen: ["4DP · Unit plan", "/dashboard/4dp/unit-plan"],
      roles: [R("Planner", "dp", "Lot-by-lot section plan"), R("Production manager", "prod", "Assigns lines"), R("FC", "fc", "Material-ready dates")],
      inputs: "Master plan, gate", outputs: "Line plan with dates", deps: ["gate"] },
    { id: "loc", lane: "fc", title: "Location plan", d0: 55, d1: 58, by: Y("FC PA", "checks free cages for the coming containers"),
      screen: ["FC · Location plan", "/dashboard/fc/location-plan"],
      roles: [R("FC PA", "sys", "Cages needed = rolls ÷ 20, lot by lot"), R("Warehouse supervisor", "fc", "Adds racks or moves stock in time")],
      inputs: "MRP arrivals", outputs: "Cages reserved", deps: ["track"] },
    { id: "arrive", lane: "ship", title: "Container arrival", d0: 58, d1: 60, by: H("Shipping officer", "confirms the container day & time with FC"),
      screen: ["MRP · Arrivals", "/dashboard/mrp/arrivals"],
      roles: [R("Shipping officer", "ship", "Confirms when the container arrives"), R("Trucker", "buyer", "Brings the container from the port"), R("Warehouse supervisor", "fc", "Plans the unloading")],
      inputs: "Cleared container", outputs: "Arrival slot", deps: ["track"] },
    { id: "forklift", lane: "ytm", title: "Forklift check", d0: 58, d1: 60, by: H("Forklift driver", "checks and maintains the forklift"),
      screen: ["YTM", "/dashboard/ytm"],
      roles: [R("Forklift driver", "ytm", "Checks and maintains the forklift before the fabric arrives"), R("YTM mechanic", "ytm", "Fixes any defect"), R("YTM supervisor", "ytm", "Confirms readiness in Yai")],
      inputs: "Arrival slot", outputs: "Forklift ready", deps: ["arrive"] },
    { id: "receive", lane: "fc", title: "Fabric receiving", d0: 60, d1: 62, by: H("Warehouse supervisor", "manpower to unload; clerk updates Yai"),
      screen: ["FC · Fabric receiving", "/dashboard/fc/fabric-receiving"],
      roles: [R("MRP", "mrp", "Informs all the details — packing list, rolls, lots"), R("Warehouse supervisor", "fc", "Arranges manpower to check the unloading; coordinates with Shipping"), R("Supervisor + security", "admin", "CTPAT 9-point container check before opening — fail = stays closed"), R("Forklift driver", "ytm", "Unloads the container"), R("Workers", "fc", "Unload lot by lot into cages"), R("AI vision cameras", "sys", "Count rolls per cage and read the cage number"), R("FC clerk", "fc", "Makes sure the system is updated")],
      inputs: "Container, packing list", outputs: "Every roll in its cage and in Yai", deps: ["loc", "arrive", "forklift"] },
    { id: "acc", lane: "fc", title: "Accessories & brand protection", d0: 60, d1: 63, by: H("Accessory clerk", "checks trims, locks branded items away"),
      screen: ["FC · Accessories receiving", "/dashboard/fc/accessories-receiving"],
      roles: [R("Accessory clerk", "fc", "Receives into the accessory store"), R("QC inspector", "qa", "Checks on the inspection table"), R("FC", "fc", "Locks branded labels and tags; issues exact quantities only")],
      inputs: "Trims delivery", outputs: "Trims in store", deps: ["track"] },
    { id: "inspect", lane: "qa", title: "Fabric inspection", d0: 62, d1: 65, by: H("QC inspector", "4-point checks the customer's % of rolls"),
      screen: ["FC · Fabric inspection", "/dashboard/fc/fabric-inspection"],
      roles: [R("Inspection supervisor", "fc", "Plans the % per lot (5–15 %, 100 % if costly)"), R("Workers", "fc", "Pull the sample rolls, run the machine"), R("QC department", "qa", "Judges holes, slubs, shade, width, selvage"), R("FC clerk", "fc", "Records pass / fail with pictures")],
      inputs: "Rolls in cages", outputs: "Pass / fail list", deps: ["receive"] },
    { id: "test", lane: "qa", title: "Fabric testing", d0: 62, d1: 66, by: H("Lab technician", "shrinkage, weight, shade, test garment"),
      screen: ["FC · Fabric test", "/dashboard/fc/fabric-test"],
      roles: [R("Lab technician", "qa", "Shrinkage (AATCC), weight vs promised gsm, grey-scale shade"), R("Sample sewer", "ypi", "Sews 1–2 test garments"), R("QC manager", "qa", "Pass / fail"), R("Merchandiser", "sales", "Failed lots: negotiates a discount with brand and mill — not returned")],
      inputs: "1 yard per roll", outputs: "Test report", deps: ["receive"] },
    { id: "cutplan", lane: "ypi", title: "Cut plan finalised", d0: 66, d1: 67, by: H("Cut planner", "fixes lots, shade groups, shrinkage allowance"),
      screen: ["YPI · Cut plan", "/dashboard/ypi/cut-plan"],
      roles: [R("Cut planner", "ypi", "Uses inspection and test results"), R("Merchandiser", "sales", "Confirms the lots"), R("Warehouse", "fc", "Follows it: rolls, dye lot, date, morning / afternoon")],
      inputs: "Inspection + test results", outputs: "Cut plan", deps: ["inspect", "test", "unit"] },
    { id: "pilot", lane: "qa", title: "Pilot run", d0: 67, d1: 69, by: H("QA inspector", "checks 5 pcs per size made from bulk fabric"),
      screen: ["YQMS · Pre-production", "/dashboard/yqms/pre-production-meeting"],
      roles: [R("Cutting", "prod", "Cuts 5 pieces per size with bulk fabric and labels"), R("Sewing line", "prod", "Sews them"), R("QMS", "qa", "Verifies before bulk cutting"), R("IE", "ce", "Times it for the 2nd SAM")],
      inputs: "Cut plan, machines ready", outputs: "Go for bulk", deps: ["cutplan", "mech"] },
    { id: "sam2", lane: "ce", title: "2nd SAM", d0: 69, d1: 70, by: H("IE engineer", "sets the 2nd SAM after the pilot run"),
      screen: ["CE · IE Master", "/dashboard/ce/ie-master"],
      roles: [R("IE engineer", "ce", "Updates SAM and critical operations"), R("4DP", "dp", "Takes the new SAM into the line plan")],
      inputs: "Pilot run", outputs: "2nd SAM", deps: ["pilot"] },
    { id: "issue", lane: "fc", title: "Issue by tuk-tuk", d0: 70, d1: 71, by: H("FC store", "issues rolls per cut plan, tuk-tuk to cutting"),
      screen: ["FC · Fabric issuing", "/dashboard/fc/fabric-issuing"],
      roles: [R("FC store", "fc", "Issues first in, first out, lot by lot"), R("Tuk-tuk / mini-truck driver", "fc", "Moves rolls to cutting — no forklifts"), R("Cutting clerk", "prod", "Receives"), R("FC clerk", "fc", "Logs the issue")],
      inputs: "Cut plan", outputs: "Fabric at cutting", deps: ["cutplan", "pilot"] },
    { id: "relax", lane: "prod", title: "Relaxing 24 / 48 h", d0: 71, d1: 73, by: H("Relaxing operator", "relaxes fabric per the process sheet"),
      screen: ["YWIP", "/dashboard/ywip"],
      roles: [R("Relaxing operator", "prod", "Relaxing machine, then trays; records the time"), R("Cutting supervisor", "prod", "Keeps dye lots and widths apart")],
      inputs: "Issued fabric", outputs: "Relaxed fabric", deps: ["issue"] },
    { id: "cut", lane: "prod", title: "Spreading & CAM cutting", d0: 73, d1: 82, by: H("Cutting supervisor", "spreads by dye lot, CAM-cuts, bundles"),
      screen: ["YWIP", "/dashboard/ywip"],
      roles: [R("Cutting supervisor", "prod", "Runs the cut plan"), R("Spreaders & cutters", "prod", "Spread by lot, cut one piece per direction"), R("Bundling clerk", "prod", "Bundle tickets in Yai")],
      inputs: "Relaxed fabric", outputs: "Cut bundles", deps: ["relax"] },
    { id: "panel", lane: "qa", title: "Cut-panel QC", d0: 73, d1: 82, by: H("QC inspector", "checks panels before they go on"),
      screen: ["YQMS · Cut-panel inspection", "/dashboard/yqms/cut-panel-inspection"],
      roles: [R("QC inspector", "qa", "Checks panels against the pattern"), R("Cutting supervisor", "prod", "Re-cuts rejects")],
      inputs: "Cut bundles", outputs: "Passed panels", deps: ["cut"] },
    { id: "ret", lane: "fc", title: "Leftover fabric back", d0: 76, d1: 90, by: H("FC clerk", "weighs roll ends back in, by lot (kg)"),
      screen: ["FC · Warehouse tracking", "/dashboard/fc/warehouse-tracking"],
      roles: [R("Cutting clerk", "prod", "Returns roll ends"), R("FC clerk", "fc", "Bags ~20 kg per lot on separate racks")],
      inputs: "Roll ends", outputs: "Balance fabric per lot", deps: ["cut"] },
    { id: "deco", lane: "prod", title: "Print · embroidery · heat seal", d0: 74, d1: 84, by: H("Decoration supervisor", "decorates panels, then decoration QC"),
      screen: ["YWIP", "/dashboard/ywip"],
      roles: [R("Printing / embroidery", "prod", "Decorates the panels"), R("Heat-seal operator", "prod", "Applies heat seals"), R("QC", "qa", "Decoration and heat-seal checks")],
      inputs: "Passed panels", outputs: "Panels to the trolleys", deps: ["panel"] },
    { id: "sew", lane: "prod", title: "Hanger loading & sewing", d0: 75, d1: 93, by: H("Line leader", "runs the line to the hourly target"),
      screen: ["4DP · Line plan", "/dashboard/4dp/line-plan"],
      roles: [R("Hanger loader", "prod", "Loads panels onto the hanger line"), R("Line leader", "prod", "One per line, 32–35 operators"), R("Supervisor", "prod", "One for every two lines"), R("Mechanic", "ytm", "Fixes machines that go red")],
      inputs: "Panels, ready line", outputs: "Sewn garments", deps: ["panel", "mech"] },
    { id: "learn", lane: "ce", title: "Learning curve watch", d0: 75, d1: 79, by: Y("CE PA", "alerts if a line misses 60 → 100 → 120 pcs"),
      screen: ["CE", "/dashboard/ce"],
      roles: [R("CE PA", "sys", "Compares planned vs actual per worker and line"), R("Supervisor / line leader", "prod", "Act on the alert"), R("Production & factory manager", "prod", "Notified when the target is missed")],
      inputs: "Hourly output", outputs: "Alerts", deps: ["sew"] },
    { id: "roving", lane: "qa", title: "Roving & end-of-line QC", d0: 75, d1: 93, by: H("Roving QC", "checks along the line; 2 end-of-line checkers"),
      screen: ["YQMS · Rolling QC", "/dashboard/yqms/rolling-qc"],
      roles: [R("Roving QC", "qa", "Checks every operator from a moving table"), R("End-of-line checkers", "qa", "Two per line"), R("Line leader", "prod", "Corrects the operator")],
      inputs: "Line output", outputs: "Defect data", deps: ["sew"] },
    { id: "finish", lane: "prod", title: "Wash · press · check", d0: 78, d1: 96, by: H("Finishing supervisor", "washing, pressing, checking, humidity"),
      screen: ["YQMS · Finishing check", "/dashboard/yqms/fin-check"],
      roles: [R("Finishing supervisor", "prod", "Runs washing and ironing"), R("Ironing workers", "prod", "Press"), R("Checkers", "qa", "Final checking and humidity check")],
      inputs: "Sewn garments", outputs: "Finished garments", deps: ["sew"] },
    { id: "pack", lane: "prod", title: "Fold · pack · carton", d0: 81, d1: 97, by: H("Packing supervisor", "packs to the tech pack's packing rules"),
      screen: ["YWIP", "/dashboard/ywip"],
      roles: [R("Packing supervisor", "prod", "Follows the Production Instruction packing rules"), R("Packers", "prod", "Fold, polybag, carton"), R("Packing clerk", "prod", "Carton numbers in Yai")],
      inputs: "Finished garments", outputs: "Finished goods in the warehouse", deps: ["finish"] },
    { id: "actual", lane: "acct", title: "Actual style cost", d0: 93, d1: 98, by: Y("CE PA", "compares planned vs actual cost per style"),
      screen: ["CE · Style costing", "/dashboard/ce/style-costing"],
      roles: [R("CE PA", "sys", "Actual cost from the learning curve (e.g. $2.00 → $2.50)"), R("Accounting", "acct", "Cost per minute for the month")],
      inputs: "Output, CPM", outputs: "Actual vs planned cost", deps: ["learn"] },
    { id: "final", lane: "qa", title: "Final inspection vs PP", d0: 97, d1: 98, by: H("QA manager", "AQL with the PP sample as the reference"),
      screen: ["YQMS · Final inspection", "/dashboard/yqms/final-inspection"],
      roles: [R("QA manager", "qa", "Inspects to AQL"), R("Brand QC", "buyer", "Inspects or witnesses"), R("Packing supervisor", "prod", "Opens the chosen cartons"), R("Merchandiser", "sales", "Releases the shipment")],
      inputs: "Cartons, PP sample", outputs: "Shipment released", deps: ["pack", "pp"] },
    { id: "export", lane: "ship", title: "Export & ex-factory", d0: 98, d1: 100, by: H("Shipping officer", "export docs, customs, container gate-out"),
      screen: ["Shipping · Request", "/dashboard/shipping/request"],
      roles: [R("Shipping officer", "ship", "Invoice, packing list, CO, export customs"), R("Forwarder", "buyer", "Booking and container"), R("Security", "admin", "Gate out")],
      inputs: "Released shipment", outputs: "Ex-factory", deps: ["final"] },
    { id: "sail", lane: "ship", title: "Sailed → in the brand's DC", d0: 100, d1: 128, by: Y("Shipping PA", "tracks sailed → in transit → in DC"),
      screen: ["YWIP", "/dashboard/ywip"],
      roles: [R("Shipping PA", "sys", "Tracks the vessel to Canada / USA"), R("Forwarder", "buyer", "Updates the ETA"), R("Brand", "buyer", "Receives in its distribution centre")],
      inputs: "Container on the vessel", outputs: "Goods in the DC", deps: ["export"] },
    { id: "bill", lane: "acct", title: "Invoice & payment", d0: 100, d1: 130, by: H("Accountant", "invoices the brand, follows the payment"),
      screen: ["Shipping bill", "/dashboard/shipping-bill"],
      roles: [R("Accountant", "acct", "Invoices from the export documents"), R("Finance manager", "acct", "Follows the payment terms"), R("Merchandiser", "sales", "Settles any claim")],
      inputs: "Export documents", outputs: "Order closed", deps: ["export"] },
  ],
};

/* ---------- Cycles (no real timeline) ---------- */
const HR = {
  kind: "cycle",
  title: "HR · Hire to pay",
  summary: "YHR is fully digital — recruitment, contracts, attendance, leave, resignation, payslips and approvals all happen in Yai and on the phone. No paper files, folders or photocopies.",
  loopTo: "attend", loopLabel: "every day / every month",
  acts: [
    { id: "ad", lane: "hr", title: "Recruitment advert", by: Y("HR clerk", "posts the recruitment advert in Yai"), screen: ["Recruitment", "/dashboard/recruitment"],
      roles: [R("Dept head", "head", "Requests the headcount in Yai"), R("HR manager", "hr", "Approves the headcount in Yai"), R("HR clerk", "hr", "Posts the advert online from Yai")],
      inputs: "Headcount request", outputs: "Advert live" },
    { id: "apply", lane: "worker", title: "Applications online", by: Y("Candidate", "applies on the phone; Yai collects the applications"), screen: ["Recruitment", "/dashboard/recruitment"],
      roles: [R("Candidate", "worker", "Applies on the phone"), R("Yai", "sys", "Collects applications and screens duplicates"), R("HR clerk", "hr", "Watches the list in Yai")],
      inputs: "Advert", outputs: "Applications in Yai" },
    { id: "review", lane: "hr", title: "Review & interview", by: Y("HR clerk", "shortlists in Yai and books interviews"), screen: ["Interview", "/dashboard/interview"],
      roles: [R("HR clerk", "hr", "Shortlists and schedules in Yai"), R("Supervisor", "head", "Skill test; result entered in Yai"), R("HR manager", "hr", "Interview; notes in Yai")],
      inputs: "Applications", outputs: "Shortlist" },
    { id: "approve", lane: "head", title: "Approve", by: Y("HR manager", "approves the hire in Yai"), screen: ["Recruitment", "/dashboard/recruitment"],
      roles: [R("HR manager", "hr", "Approves the hire in Yai"), R("Dept head", "head", "Confirms position and start date in Yai"), R("Yai", "sys", "Sends the offer to the candidate's phone")],
      inputs: "Shortlist", outputs: "Offer on the phone" },
    { id: "contract", lane: "sys", title: "Contract issued", by: Y("Yai", "issues the contract automatically; worker accepts on the phone"), screen: ["YHR", "/dashboard/yhr"],
      roles: [R("Yai", "sys", "Generates the contract from the employee record"), R("Worker", "worker", "Reads and accepts it on the phone"), R("HR clerk", "hr", "Sees it accepted in Yai")],
      inputs: "Accepted offer", outputs: "Accepted contract in Yai" },
    { id: "join", lane: "worker", title: "Orientation day", by: H("New worker", "collects ID card + uniform at orientation"), screen: ["Onboarding", "/dashboard/onboarding"],
      roles: [R("New worker", "worker", "Collects the ID card and uniform"), R("HR clerk", "hr", "Hands over ID card + uniform; face registered in Yai"), R("Supervisor", "head", "Takes the worker to the line"), R("Safety officer", "admin", "Safety induction")],
      inputs: "Accepted contract", outputs: "Worker on the org chart (YAI####)" },
    { id: "attend", lane: "worker", title: "Attendance on the phone", by: Y("Worker", "checks in and out on the phone every day"), screen: ["My attendance", "/dashboard/my-attendance"],
      roles: [R("Worker", "worker", "Checks in and out on the phone"), R("Supervisor", "head", "Sees the line headcount in Yai"), R("HR clerk", "hr", "Fixes exceptions in Yai")],
      inputs: "Daily shift", outputs: "Attendance record" },
    { id: "payroll", lane: "acct", title: "Payroll", by: Y("Yai", "calculates payroll; finance approves in Yai"), screen: ["Payroll", "/dashboard/payroll"],
      roles: [R("Yai", "sys", "Calculates pay from attendance, OT and leave"), R("Payroll officer", "acct", "Checks the run in Yai"), R("Finance manager", "acct", "Approves in Yai")],
      inputs: "Attendance, OT, leave", outputs: "Approved salaries" },
    { id: "pay", lane: "worker", title: "Paid via Wing or ABA", by: Y("Yai", "pays via Wing or ABA; payslip on the phone"), screen: ["Salary bill", "/dashboard/salary-bill"],
      roles: [R("Accountant", "acct", "Releases the bank / Wing file from Yai"), R("Wing / ABA", "acct", "Pays out"), R("Worker", "worker", "Gets money and the payslip on the phone")],
      inputs: "Approved salaries", outputs: "Payday done" },
  ],
  side: [
    { title: "Leave", body: "Apply on the phone — approved in Yai by the supervisor.", screen: ["YHR", "/dashboard/yhr"] },
    { title: "Resign", body: "Resign on the phone — final pay calculated automatically.", screen: ["Resign payment", "/dashboard/resign-payment"] },
    { title: "Anything else", body: "Chat with the HR PA and get it done.", screen: ["Speak up", "/dashboard/speak-up"] },
  ],
  // The only things HR handles by hand are physical items.
  physical: [
    { title: "Orientation", body: "New hires collect their ID card and uniform." },
    { title: "Leaving", body: "Return the ID card, uniform and locker key before the last day." },
    { title: "Lost ID card", body: "Replaced at the HR desk." },
    { title: "Clinic", body: "Clinic visits at the factory clinic." },
    { title: "Fire drill", body: "Headcount at the assembly point." },
    { title: "Passport", body: "HR never keeps anyone's passport — for a work permit or visa the person takes their own to immigration." },
  ],
};

const ACCT = {
  kind: "cycle",
  title: "Accounting · Payroll",
  summary: "The monthly money cycle — cost per minute, salaries out, brand money in.",
  loopTo: "cpm", loopLabel: "every month",
  acts: [
    { id: "cpm", lane: "acct", title: "Cost per minute", by: H("Accountant", "gives the month's cost; CE divides by earned minutes"), screen: ["CE · CPM", "/dashboard/ce/cpm"],
      roles: [R("Accountant", "acct", "The factory's cost for the month"), R("CE PA", "sys", "CPM = cost ÷ planned earned minutes from 4DP")], inputs: "Monthly cost, 4DP SAM", outputs: "CPM for costing" },
    { id: "attend", lane: "hr", title: "Attendance closed", by: Y("HR clerk", "closes the month's attendance in Yai"), screen: ["Checklist attendance", "/dashboard/checklist-attendance"],
      roles: [R("HR clerk", "hr", "Closes the month"), R("Supervisors", "head", "Confirm overtime")], inputs: "Daily attendance", outputs: "Month attendance" },
    { id: "payroll", lane: "acct", title: "Payroll run", by: Y("Yai", "calculates salary, tax and NSSF"), screen: ["Payroll", "/dashboard/payroll"],
      roles: [R("Payroll officer", "acct", "Checks the run"), R("Finance manager", "acct", "Approves")], inputs: "Month attendance", outputs: "Payroll" },
    { id: "monthly", lane: "acct", title: "Monthly salary sheet", by: Y("Payroll officer", "finalises the sheet; GM approves in Yai"), screen: ["Monthly salary", "/dashboard/monthly-salary"],
      roles: [R("Payroll officer", "acct", "Final sheet per department"), R("General manager", "head", "Approves in Yai")], inputs: "Payroll", outputs: "Approved salary sheet" },
    { id: "pay", lane: "acct", title: "Pay via Wing / ABA", by: Y("Yai", "sends the Wing / ABA bank file"), screen: ["Salary bill", "/dashboard/salary-bill"],
      roles: [R("Accountant", "acct", "Releases the bank file"), R("Worker", "worker", "Receives on the phone")], inputs: "Salary sheet", outputs: "Salaries paid" },
    { id: "bill", lane: "acct", title: "Brand invoices", by: Y("Accountant", "invoices every shipment in Yai, tracks receipts"), screen: ["Shipping bill", "/dashboard/shipping-bill"],
      roles: [R("Accountant", "acct", "Invoices from the export documents"), R("Shipping officer", "ship", "Sends the documents")], inputs: "Shipments", outputs: "Receivables" },
  ],
};

const ADMIN = {
  kind: "cycle",
  title: "Admin",
  summary: "Every request — gate pass, car, meeting room, repair — runs the same loop.",
  loopTo: "req", loopLabel: "for the next request",
  acts: [
    { id: "req", lane: "worker", title: "Request on the phone", by: H("Any staff", "raises a ticket on the phone"), screen: ["Tickets", "/dashboard/ticket"],
      roles: [R("Any staff", "worker", "Raises the ticket"), R("Yai", "sys", "Routes it to the right team")], inputs: "Need", outputs: "Ticket" },
    { id: "ok", lane: "head", title: "Approve", by: Y("Dept head", "approves in Yai; Admin assigns the team"), screen: ["Tickets", "/dashboard/ticket"],
      roles: [R("Dept head", "head", "Approves in Yai"), R("Admin manager", "admin", "Assigns the team in Yai")], inputs: "Ticket", outputs: "Approved ticket" },
    { id: "do", lane: "admin", title: "Do the work", by: H("Admin team", "gate pass, car, room or repair"), screen: ["Tickets", "/dashboard/ticket"],
      roles: [R("Admin team", "admin", "Does the work"), R("Security / driver", "admin", "Executes")], inputs: "Approved ticket", outputs: "Done" },
    { id: "close", lane: "sys", title: "Close & rate", by: Y("Yai", "closes the ticket and asks for a rating"), screen: ["Tickets", "/dashboard/ticket"],
      roles: [R("Requester", "worker", "Confirms and rates"), R("Admin manager", "admin", "Reviews slow tickets")], inputs: "Done", outputs: "Closed ticket" },
  ],
};

const CSR = {
  kind: "cycle",
  title: "CSR",
  summary: "Energy, water, waste, chemicals — measured, audited, reported to brands.",
  loopTo: "plan", loopLabel: "every audit cycle",
  acts: [
    { id: "plan", lane: "csr", title: "Audit plan", by: H("CSR manager", "plans brand and internal audits"), screen: ["Audit plan", "/dashboard/audit-plan"],
      roles: [R("CSR manager", "csr", "Plans audits"), R("General manager", "head", "Approves")], inputs: "Brand requirements", outputs: "Audit calendar" },
    { id: "data", lane: "csr", title: "Collect data", by: H("CSR officer", "collects energy, water, waste, chemicals"), screen: ["Audit plan", "/dashboard/audit-plan"],
      roles: [R("CSR officer", "csr", "Readings"), R("YTM", "ytm", "Meter readings"), R("Admin", "admin", "Waste records")], inputs: "Meters, records", outputs: "Monthly data" },
    { id: "audit", lane: "sys", title: "Digital audit", by: Y("Yai", "runs the digital audit checklist"), screen: ["Audit plan", "/dashboard/audit-plan"],
      roles: [R("CSR officer", "csr", "Walks the checklist"), R("Dept heads", "head", "Answer findings")], inputs: "Monthly data", outputs: "Findings" },
    { id: "cap", lane: "head", title: "Corrective actions", by: H("Dept heads", "fix findings; CSR verifies"), screen: ["Audit plan", "/dashboard/audit-plan"],
      roles: [R("Dept heads", "head", "Fix findings"), R("CSR manager", "csr", "Verifies closure")], inputs: "Findings", outputs: "Closed actions" },
    { id: "report", lane: "csr", title: "Report to brands", by: H("CSR manager", "sends the report to the brands"), screen: ["Audit plan", "/dashboard/audit-plan"],
      roles: [R("CSR manager", "csr", "Sends the report"), R("Brand", "buyer", "Reviews")], inputs: "Closed actions", outputs: "Brand report" },
  ],
};

const YTM_SHOP = {
  kind: "cycle",
  title: "YTM Shop · Spare parts",
  summary: "Needles, parts and attachments — requested on the line, issued from the shop, re-ordered before they run out.",
  loopTo: "req", loopLabel: "for every part request",
  acts: [
    { id: "req", lane: "prod", title: "Part request", by: H("Mechanic", "requests the part with the machine number"), screen: ["YTM Shop", "/dashboard/ytm-shop"],
      roles: [R("Mechanic", "ytm", "Raises the request"), R("Line leader", "prod", "Confirms the breakdown")], inputs: "Broken / worn part", outputs: "Part request" },
    { id: "ok", lane: "ytm", title: "Approve", by: H("YTM supervisor", "approves from the machine history"), screen: ["YTM Shop", "/dashboard/ytm-shop"],
      roles: [R("YTM supervisor", "ytm", "Approves")], inputs: "Part request", outputs: "Approved request" },
    { id: "issue", lane: "ytm", title: "Issue from the shop", by: H("Shop keeper", "issues the part, takes the old one back"), screen: ["YTM Shop", "/dashboard/ytm-shop"],
      roles: [R("Shop keeper", "ytm", "Issues the part"), R("Mechanic", "ytm", "Fits it")], inputs: "Approved request", outputs: "Machine running" },
    { id: "reorder", lane: "sys", title: "Re-order at minimum", by: Y("Yai", "flags minimum stock; purchaser orders"), screen: ["YTM Shop", "/dashboard/ytm-shop"],
      roles: [R("Yai", "sys", "Flags minimum stock"), R("Purchaser", "mrp", "Orders from the supplier")], inputs: "Stock level", outputs: "Stock refilled" },
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

/* ---------- who-does-it line ---------- */
function ByLine({ by, size = 10.5, lines = 2 }) {
  return (
    <div className="text-slate-300" style={{ fontSize: size, lineHeight: `${size + 3}px`, display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
      <span className="font-semibold text-slate-100">{by.actor}</span> {by.does}
    </div>
  );
}
function ByIcon({ auto, size = 14 }) {
  return auto
    ? <img src="/assets/modules-image/yai2.png" alt="Yai" title="Done by Yai / a PA" className="rounded-full flex-shrink-0 object-cover" style={{ width: size, height: size }} />
    : <span title="Done by a person" className="rounded-full flex-shrink-0 flex items-center justify-center bg-slate-200 text-slate-800" style={{ width: size, height: size }}><User size={size - 4} /></span>;
}

/* ---------- timeline layout ---------- */
const PX = 14, LABEL_W = 132, HEAD_H = 46, BOX_W = 168, BOX_H = 56, TRACK_H = 64, PAD = 6;

function layoutTimeline(flow) {
  const pos = {};
  const lanes = [];
  let y = 0;
  flow.lanes.forEach((lane) => {
    const tracks = [];
    flow.acts.filter((a) => a.lane === lane).sort((a, b) => a.d0 - b.d0).forEach((a) => {
      const x = a.d0 * PX, dur = Math.max((a.d1 - a.d0) * PX, 6), w = Math.max(dur, BOX_W);
      let t = tracks.findIndex((e) => e + 8 <= x);
      if (t < 0) { t = tracks.length; tracks.push(0); }
      tracks[t] = x + w;
      pos[a.id] = { x, w, dur, y: y + PAD + t * TRACK_H };
    });
    const h = Math.max(1, tracks.length) * TRACK_H + PAD * 2 - (TRACK_H - BOX_H);
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
    let d;
    if (pb.x >= pa.x + pa.w - 4) {
      // B starts after A's box: right edge → left edge
      const x1 = pa.x + pa.w, y1 = pa.y + BOX_H / 2, x2 = pb.x, y2 = pb.y + BOX_H / 2, dx = Math.max(16, (x2 - x1) / 2);
      d = `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
    } else {
      // overlapping in time: drop from A's edge onto B's top / bottom
      const down = pb.y > pa.y;
      const x2 = pb.x + 14, x1 = Math.min(Math.max(x2, pa.x + 14), pa.x + pa.w - 14);
      const y1 = down ? pa.y + BOX_H : pa.y, y2 = down ? pb.y : pb.y + BOX_H, dy = (y2 - y1) / 2;
      d = `M${x1},${y1} C${x1},${y1 + dy} ${x2},${y2 - dy} ${x2},${y2}`;
    }
    const cross = a.lane !== b.lane;
    const hot = !!sel && (sel === aid || sel === b.id);
    const faded = (focus && dim(a.lane) && dim(b.lane)) || (sel && !hot);
    arrows.push({ key: `${aid}>${b.id}`, d, color: cross ? DEPTS[a.lane].color : "#64748b", marker: cross ? a.lane : "same", hot, faded, cross });
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
        <div className="relative" style={{ width: L.width + BOX_W, height: HEAD_H + L.height }}>
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

          <svg className="absolute left-0 pointer-events-none" style={{ top: HEAD_H, zIndex: 1 }} width={L.width + BOX_W} height={L.height}>
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
                className={`absolute text-left rounded-lg overflow-hidden transition-opacity ${dim(a.lane) ? "opacity-30" : ""}`}
                style={{ left: p.x, top: HEAD_H + p.y, width: p.w, height: BOX_H, zIndex: 2, background: on ? "#334155" : "#1e293b", boxShadow: on ? `0 0 0 2px ${c}` : `inset 0 0 0 1px ${c}66` }}>
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: c }} />
                <div className="pl-2.5 pr-1.5 pt-1">
                  <div className="flex items-center gap-1">
                    <ByIcon auto={a.by.auto} size={13} />
                    <span className="text-[11px] font-bold truncate" style={{ color: c }}>{a.title}</span>
                  </div>
                  <ByLine by={a.by} size={10} />
                </div>
                <div className="absolute bottom-0 left-0 h-[3px]" style={{ width: p.dur, background: c }} />
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
              <button onClick={() => onSel(a.id)} className="w-48 text-left rounded-xl p-3 border transition hover:brightness-125"
                style={{ background: on ? `${c}30` : "#1e293b", borderColor: on ? c : "rgba(255,255,255,0.1)", borderLeft: `4px solid ${c}` }}>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{ background: c, color: "#0f172a" }}>{i + 1}</span>
                  <span className="text-[10px] uppercase tracking-wide" style={{ color: c }}>{DEPTS[a.lane].label}</span>
                </div>
                <div className="text-[13px] font-semibold text-slate-100 mt-1.5 leading-snug">{a.title}</div>
                <div className="flex items-start gap-1.5 mt-1.5">
                  <ByIcon auto={a.by.auto} size={14} />
                  <ByLine by={a.by} size={11} lines={3} />
                </div>
                <div className="text-[10.5px] mt-1.5" style={{ color: c }}>↗ {a.screen[0]}</div>
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
      {flow.physical && (
        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Physical items only — everything else is in Yai</div>
          <div className="flex flex-wrap gap-2">
            {flow.physical.map((s) => (
              <div key={s.title} className="rounded-xl bg-slate-800/60 border border-dashed border-white/15 p-3 w-60">
                <div className="flex items-center gap-1.5 text-sm font-semibold"><ByIcon auto={false} size={14} /> {s.title}</div>
                <div className="text-xs text-slate-400 mt-1">{s.body}</div>
              </div>
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
      <div className="mt-2 flex items-center gap-2 text-sm">
        <ByIcon auto={act.by.auto} size={18} />
        <span className="text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5" style={{ background: act.by.auto ? "#10b98133" : "#ffffff14", color: act.by.auto ? "#6ee7b7" : "#cbd5e1" }}>{act.by.auto ? "Yai · automatic" : "Human"}</span>
        <ByLine by={act.by} size={13} lines={2} />
      </div>
      <div className="mt-3 grid gap-2">
        {act.roles.map((r) => (
          <div key={r.role} className="flex gap-3 items-start text-sm">
            <div className="w-44 flex-shrink-0 flex items-start gap-1.5">
              <span className="mt-0.5"><ByIcon auto={r.dept === "sys"} size={14} /></span>
              <div>
                <div className="font-semibold text-slate-100">{r.role}</div>
                <div className="text-[10px]" style={{ color: DEPTS[r.dept].color }}>{DEPTS[r.dept].label}</div>
              </div>
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
        <div className="flex-1">
          <div className="font-bold text-lg leading-tight">SOP · Standard Operating Procedures</div>
          <div className="text-xs text-slate-400">Who does what, on which Yai screen, and who it hands to next.</div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><ByIcon auto size={14} /> Yai / PA does it</span>
          <span className="flex items-center gap-1"><ByIcon auto={false} size={14} /> a person does it</span>
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
              : <div className="mt-4 text-sm text-slate-500">Click any box to see every role involved, what each one does, and where it goes next.</div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SOPMap;
