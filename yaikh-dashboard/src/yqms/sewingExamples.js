// Presentation data only. These records are never sent to the quality APIs.
const scenarios = [
  { mo: "DEMO-MO-101", line: "S01", style: "DEMO-TEE-01", defect: "skipped stitch", operation: "side seam", machine: "SN-01" },
  { mo: "DEMO-MO-102", line: "S03", style: "DEMO-POLO-02", defect: "open seam", operation: "shoulder join", machine: "SN-07" },
  { mo: "DEMO-MO-103", line: "S06", style: "DEMO-HOOD-03", defect: "uneven hem", operation: "bottom hem", machine: "CV-02" },
  { mo: "DEMO-MO-104", line: "S09", style: "DEMO-TEE-04", defect: "oil mark", operation: "sleeve attach", machine: "OL-04" },
  { mo: "DEMO-MO-105", line: "S12", style: "DEMO-SHIRT-05", defect: "puckering", operation: "collar attach", machine: "SN-12" },
  { mo: "DEMO-MO-106", line: "S15", style: "DEMO-POLO-06", defect: "needle damage", operation: "placket", machine: "SN-18" },
  { mo: "DEMO-MO-107", line: "S18", style: "DEMO-JACKET-07", defect: "loose thread", operation: "zipper attach", machine: "SN-21" },
  { mo: "DEMO-MO-108", line: "S21", style: "DEMO-SHIRT-08", defect: "misaligned collar", operation: "collar attach", machine: "SN-24" },
];

export function sewingExamples(mode) {
  return scenarios.map((item, index) => {
    const issue = [1, 3, 5, 7].includes(index);
    const base = {
      _id: `DEMO-${mode}-${index + 1}`,
      isExample: true,
      createdAt: new Date(Date.UTC(2026, 9, 13 + index, 8, 15)).toISOString(),
      ...item,
      inspector: `Demo QC ${index + 1}`,
      employeeId: `DEMO-QC-${String(index + 1).padStart(3, "0")}`,
      shift: index >= 5 ? "Night" : "Day",
      defects: issue ? [item.defect] : [],
      failed: issue ? 1 : 0,
      severity: issue ? "major" : "minor",
      notes: issue ? `DEMO: Hold affected pieces; correct ${item.operation} and reinspect.` : "DEMO: Checked against approved sample; no defect found.",
      reviewedBy: issue ? "Demo QA Supervisor" : "",
      reviewedEmployeeId: issue ? "DEMO-QA-001" : "",
      correctiveAction: issue ? `DEMO: Adjust ${item.machine}, retrain operator and reinspect.` : "",
      history: issue ? [{ at: new Date(Date.UTC(2026, 9, 13 + index, 9, 0)).toISOString(), action: "review", actor: "Demo QA Supervisor", employeeId: "DEMO-QA-001", note: "DEMO: Correct operation and repeat quality check." }] : [],
    };
    if (mode === "first-output") return {
      ...base, sample: 20, color: "Navy", size: "M", sampleRef: `DEMO-REF-${index + 1}`,
      machineIds: item.machine, operatorIds: `DEMO-OP-${index + 1}`,
      machineCheck: issue && index === 3 ? "fail" : "pass", skillCheck: issue && index === 1 ? "fail" : "pass",
      measurementCheck: issue && index === 5 ? "fail" : "pass", measurementNotes: "Chest and body length checked against demo spec.",
      decision: issue ? "hold" : index === 4 ? "pending-qa" : "approved",
      approvalBy: issue ? "Demo QA Supervisor" : "Demo QA Leader",
      approvalEmployeeId: "DEMO-QA-001", approvalNote: issue ? "DEMO: Repeat first output after correction." : "DEMO: Sample acceptable.",
    };
    if (mode === "endline") return {
      ...base, color: "Navy", size: "M", pieceId: `DEMO-GMT-${String(index + 1).padStart(4, "0")}`,
      result: issue ? "repair" : "pass", repairStatus: issue ? "open" : "not-required",
      defectLocation: issue ? item.operation : "", alertAcknowledgedBy: issue ? "Demo Line Leader" : "",
    };
    if (mode === "checkout") return {
      ...base, quantity: 5 + index, sample: 5 + index, failed: 0, defects: [], status: "released",
      pieceIds: Array.from({ length: 5 + index }, (_, piece) => `DEMO-GMT-${index + 1}${String(piece + 1).padStart(2, "0")}`),
      bundleId: `DEMO-B-${index + 1}`, destination: "Finishing", receiver: `Demo Finishing Receiver ${index + 1}`,
      notes: "DEMO: Passed end-line QC and handed to finishing.",
    };
    return {
      ...base, sample: mode === "qa20" ? 20 : 10 + index * 2,
      status: issue ? "action-needed" : index === 4 ? "reviewed" : "pass",
      operatorId: `DEMO-OP-${index + 1}`,
    };
  });
}

export function sewingExampleForm(mode) {
  const row = sewingExamples(mode)[1];
  return {
    mo: row.mo, line: row.line, style: row.style, color: row.color || "Navy", size: row.size || "M",
    shift: row.shift, inspector: row.inspector, employeeId: row.employeeId,
    sample: String(row.sample || 20), failed: String(row.failed),
    sampleRef: row.sampleRef || "DEMO-REF-01", machineIds: row.machineIds || row.machine,
    operatorIds: row.operatorIds || "DEMO-OP-1", machineCheck: row.machineCheck || "pass",
    skillCheck: row.skillCheck || "pass", measurementCheck: row.measurementCheck || "pass",
    measurementNotes: row.measurementNotes || "Chest and body length checked against demo spec.",
    pieceId: row.pieceId || "DEMO-GMT-0001", result: row.result || "pass", severity: row.severity,
    defectLocation: row.defectLocation || "", operation: row.operation, machine: row.machine,
    operatorId: row.operatorId || "DEMO-OP-1", defects: row.defects.join(", "), notes: row.notes,
    pieceIds: (row.pieceIds || []).join("\n"), bundleId: row.bundleId || "DEMO-B-1",
    receiver: row.receiver || "Demo Finishing Receiver", destination: row.destination || "Finishing",
  };
}

export function sewingExampleEvents(mode) {
  const base = new Date(Date.UTC(2026, 9, 20, 9, 0)).toISOString();
  return [
    { id: `DEMO-${mode}-decision`, at: base, kind: "decision", source: "example", role: "Quality Manager", actor: "Demo Quality Manager", employeeId: "DEMO-QM-001", summary: "DEMO: Hold the affected bundle and review the defect trend.", nextAction: "DEMO: QA Supervisor checks the correction before release.", mo: "DEMO-MO-102", line: "S03" },
    { id: `DEMO-${mode}-pa`, at: base, kind: "pa-notice", source: "example", role: "PA notice example", actor: "Demo PA", summary: "DEMO: Repeated sewing defect notice for line S03.", nextAction: "DEMO: Assign owner and due time before the next line review." },
    { id: `DEMO-${mode}-brain`, at: base, kind: "big-brain-reply", source: "example", role: "Big Brain example", actor: "Demo Big Brain", summary: "DEMO question: What caused the open seam? Reply: Check machine tension and operator method.", nextAction: "DEMO: Mechanic verifies tension; QA repeats the sample check." },
  ];
}
