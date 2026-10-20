import React, { useMemo, useState } from "react";
import { useTranslation } from "../translate/TranslationContext";
import { useNarrativeTranslation } from './useNarrativeTranslation';

const csvCell = value => { let text = String(value ?? ""); if (typeof value !== 'number' && /^[=+\-@\t\r]/.test(text)) text = "'" + text; return `"${text.replaceAll('"', '""')}"`; };
const day = value => value ? new Date(value).toISOString().slice(0, 10) : "—";
const count = row => Number(row.sample || row.quantity || 1);
const issues = row => Number(row.failed || (row.result && row.result !== "pass" ? 1 : 0));
const open = row => ["hold", "pending-qa", "action-needed", "open"].includes(row.status || row.decision || row.repairStatus);
const text = value => String(value ?? "—");

function buildReports(records, mode) {
  const byDay = new Map(), byLine = new Map(), byDefect = new Map(), byDestination = new Map();
  for (const row of records) {
    const date = day(row.createdAt);
    for (const [map, key] of [[byDay, date], [byLine, row.line || "—"]]) {
      const item = map.get(key) || { checks: 0, pieces: 0, issues: 0, open: 0 };
      item.checks += 1; item.pieces += count(row); item.issues += issues(row); item.open += Number(open(row)); map.set(key, item);
    }
    for (const defect of row.defects || []) {
      const item = byDefect.get(defect) || { occurrences: 0, lines: new Set() };
      item.occurrences += 1; item.lines.add(row.line); byDefect.set(defect, item);
    }
    if (row.destination) {
      const item = byDestination.get(row.destination) || { handoffs: 0, pieces: 0, receivers: new Set() };
      item.handoffs += 1; item.pieces += count(row); item.receivers.add(row.receiver); byDestination.set(row.destination, item);
    }
  }
  const summary = map => [...map.entries()].map(([key, v]) => [key, v.checks, v.pieces, v.issues, v.open, v.pieces ? `${((v.pieces - v.issues) / v.pieces * 100).toFixed(1)}%` : "—"]);
  const breakdown = mode === "checkout" ? {
    name: "Destinations and receivers", columns: ["Destination", "Handoffs", "Pieces", "Receivers"],
    rows: [...byDestination.entries()].map(([key, v]) => [key, v.handoffs, v.pieces, [...v.receivers].filter(Boolean).join(", ")]).sort((a, b) => b[2] - a[2]),
  } : {
    name: "Defect Pareto", columns: ["Defect", "Occurrences", "Lines"],
    rows: [...byDefect.entries()].map(([key, v]) => [key, v.occurrences, [...v.lines].filter(Boolean).join(", ")]).sort((a, b) => b[1] - a[1]),
  };
  return [
    { name: "Daily activity", columns: ["Date", "Checks", "Pieces", "Issue pieces", "Open actions", "Clean rate"], rows: summary(byDay).sort((a, b) => b[0].localeCompare(a[0])) },
    { name: "Line performance", columns: ["Line", "Checks", "Pieces", "Issue pieces", "Open actions", "Clean rate"], rows: summary(byLine).sort((a, b) => b[2] - a[2]) },
    breakdown,
    { name: "Open actions and holds", columns: ["Recorded", "MO", "Line", "Style", "Inspector", "Item / sample", "Status", "Issues"], rows: records.filter(open).map(row => [day(row.createdAt), row.mo, row.line, row.style, row.inspector, row.pieceId || row.pieceIds?.join(", ") || count(row), row.status || row.decision || row.repairStatus, issues(row)]) },
    { name: "Full traceability log", columns: ["Recorded", "MO", "Line", "Style", "Inspector", "YHR ID", "Item / sample", "Status", "Defects", "QA Supervisor", "Supervisor YHR ID", "Notes"], rows: records.map(row => [day(row.createdAt), row.mo, row.line, row.style, row.inspector, row.employeeId, row.pieceId || row.pieceIds?.join(", ") || count(row), row.status || row.decision || row.result, (row.defects || []).join("; "), row.qaSupervisorName || row.reviewedBy || row.approvalBy, row.qaSupervisorEmployeeId || row.reviewedEmployeeId || row.approvalEmployeeId, row.notes]) },
  ];
}

export default function SewingReports({ records, mode, loading, exampleMode = false }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(0);
  const reports = useMemo(() => buildReports(records, mode), [records, mode]);
  const report = reports[selected];
  const notes = useMemo(() => records.map(row => row.notes).filter(Boolean), [records]);
  const narrative = useNarrativeTranslation(selected === 4 ? notes : [], !exampleMode);
  function download() {
    const csv = [report.columns, ...report.rows].map((row, rowIndex) => row.map((value, cell) =>
      csvCell(rowIndex > 0 && selected === 4 && cell === 11 ? narrative.csv(value) : t(value))).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `yqms-${mode}-${exampleMode ? "DEMO-" : ""}${report.name.toLowerCase().replaceAll(" ", "-")}.csv`; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section className="sq-reports"><div className="sq-toolbar"><div><h2>Quality reports</h2><p className="sq-muted">{exampleMode ? "Five reports calculated from eight fictional training records across eight dates. DEMO figures only." : "Five views calculated from saved inspections."}</p></div><button className="sq-secondary" onClick={download} disabled={!report.rows.length}>Download this CSV</button></div>
    <div className="sq-report-tabs">{reports.map((item, index) => <button key={item.name} className={selected === index ? "active" : ""} onClick={() => setSelected(index)}>{index + 1}. {item.name}</button>)}</div>
    <div className="sq-panel"><h3>{report.name}</h3>{narrative.state === 'loading' && <p>Translating report notes…</p>}{narrative.state === 'unavailable' && <p>Note translation unavailable; original notes are shown.</p>}{loading ? <p>Loading records…</p> : !report.rows.length ? <div className="sq-empty">No saved records for this report yet.</div> : <div className="sq-report-scroll"><table><thead><tr>{report.columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody>{report.rows.map((row, index) => <tr key={index}>{row.map((value, cell) => <td key={cell}>{selected === 4 && cell === 11 ? narrative.render(value) : text(value)}</td>)}</tr>)}</tbody></table></div>}</div>
  </section>;
}
