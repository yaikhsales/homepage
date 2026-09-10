/* Per-PA pill list — mirror of yaikh-dashboard SHORT_LABEL in bot-modules.js.
 * Used by /api/notifications/[slug]/route.ts to compute live badge counts
 * from a shared `pa_tasks` Mongo collection.
 *
 * The 4 PAs with bespoke static routes (accounting, hr, admin, csr) do NOT
 * appear here — they keep their own queries. The remaining 9 do.
 */

export const PILLS_BY_PA: Record<string, string[]> = {
  shipping:   ["Container plan", "Customs clearance", "Delivery schedule", "Inventory levels", "Material plan"],
  mrp:        ["Material plan", "BOM review", "Stock alerts", "Supplier orders", "Reorder points"],
  qa:         ["Material quality reports", "Fabric relaxation status", "Marker consumption preview", "On-site tests (4-pt / AQL)", "Customer complaints", "Third-party audits", "Call Out — silence"],
  production: ["Today's production plan", "WIP by line", "Cutting throughput", "Finishing throughput", "Production status"],
  ce:         ["Standard time updates", "Productivity by line", "Machine allocation", "Skill inventory", "Cost center summary"],
  ytm:        ["Machine downtime", "Repair queue", "Maintenance schedule", "Late maintenance alerts", "Spare parts stock"],
  "4dp":      ["Capacity plan", "Factory plan", "Line plan", "Sales situation", "Planning situation"],
  ypi:        ["Sample & buyer approval status", "Material sourcing coordination", "Purchase orders & invoices", "Latest tech-packs (3-lang)", "Cutting-team briefing", "Handoff to 4DP planning"],
  social:     ["TikTok comments", "Facebook comments", "YouTube comments", "Instagram comments", "LinkedIn comments"],
};
