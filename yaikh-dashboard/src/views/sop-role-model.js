export const FABRIC_INSPECTION_ROLES = [
  {
    "role": "Warehouse supervisor",
    "does": "Locate the correct fabric lot. Confirm roll count and identity. Arrange the required percentage of rolls and their movement to the inspector.",
    "evidence": "Lot location, selected roll list and roll delivery to inspection.",
    "dept": "fc"
  },
  {
    "role": "Fabric inspection supervisor",
    "does": "Review merchandising quality requirements and buyer comments from sample development. Confirm inspection scope, grading method, tolerances and escalation instructions before work starts.",
    "evidence": "Current inspection brief; buyer requirements and sample comments communicated to inspector.",
    "dept": "qa"
  },
  {
    "role": "Warehouse quality controller",
    "does": "Review product-development and sample comments. Identify concerns to watch for, such as shade, appearance or previously reported defects. Check that the correct approved references are available.",
    "evidence": "Quality concerns/checklist handed to inspector; discrepancies escalated.",
    "dept": "qa"
  },
  {
    "role": "Fabric inspector",
    "does": "Obtain approved fabric reference, approved colour cards and controlled documents. Verify roll IDs. Clean the inspection machine, check its condition, lighting, speed and measurement setup against the work instruction. Inspect and record defects, locations, points, width, length and shade findings.",
    "evidence": "Roll-by-roll inspection record, measured results, defect evidence and exceptions.",
    "dept": "qa"
  },
  {
    "role": "Warehouse workers / handling support",
    "does": "Bring the selected rolls, support loading/unloading and return identified rolls to the correct area. Use a forklift driver when the approved handling arrangement requires one.",
    "evidence": "Roll identity maintained; inspected, waiting and held material kept separate.",
    "dept": "fc"
  },
  {
    "role": "Authorized QA reviewer",
    "does": "Review the completed report against the agreed buyer criteria. Record release, hold or rejection with reasons. Arrange additional inspection or supplier follow-up when required.",
    "evidence": "Named decision, date, evidence and clear warehouse disposition instruction.",
    "dept": "qa"
  },
  {
    "role": "📷 AI Vision Material Inspection",
    "does": "Planned integration: detect and locate fabric defects from inspection-camera images. Match findings to the same supplier, contract / PO, fabric lot and roll in MRP supplier inspection submissions. Analyse contract quality requirements against supplier declarations and inspection evidence; flag mismatches or missing references for QA review.",
    "evidence": "Defect image and location, linked supplier submission and contract requirement, NC (non-conformance) reason, and alert to the responsible merchandiser for supplier follow-up / corrective action. Authorized QA retains hold and release decisions.",
    "dept": "sys"
  }
];

// Stable role keys join responsibilities across activities; no employee authority is inferred.
export function roleKey(label = "") {
 const value = label.toLowerCase().trim();
 if (["fabric inspector", "qa officer (fabric inspector)"].includes(value)) return "fabric-inspector";
 return value.replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}
export function activityMatchesRole(activity, selected) { return !!selected && activity.roles.some(role => roleKey(role.role) === selected.key); }
