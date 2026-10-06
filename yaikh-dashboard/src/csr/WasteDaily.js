// CSR · Waste › Waste — waste generated each day by main category (Direct Production Waste / General
// Waste) and type, the day trend (last 7 vs previous 7 days), the totals by type and the day rows.
// Data: csr view waste-daily.
import React, { useState } from "react";
import { useView, num, Chip, Panel, Select, Table, Screen } from "./csr";
import { BarChart } from "./charts";

const WasteDaily = ({ onBack }) => {
  const [f, setF] = useState({ from: "", to: "", main: "", sub: "" });
  const { d, error, loading, reload } = useView({ view: "waste-daily", from: f.from || undefined, to: f.to || undefined });
  const rows = (d.rows || []).filter((r) => (!f.main || r.main_category === f.main) && (!f.sub || r.sub_category === f.sub));
  const tr = d.trend || {};
  const byType = (d.tables || []).find((t) => t.key === "by_type");
  return (
    <Screen onBack={onBack} heading="Waste by day" sub={d.subtitle} summary={d.summary} loading={loading} error={error} onReload={reload}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="inline-flex items-center gap-1 text-xs text-slate-400">From <input type="date" value={f.from || d.from || ""} onChange={(e) => setF({ ...f, from: e.target.value })} className="bg-slate-800 border border-slate-700 rounded-md px-1.5 py-1 text-xs text-white" /></label>
        <label className="inline-flex items-center gap-1 text-xs text-slate-400">To <input type="date" value={f.to || d.to || ""} onChange={(e) => setF({ ...f, to: e.target.value })} className="bg-slate-800 border border-slate-700 rounded-md px-1.5 py-1 text-xs text-white" /></label>
        <Select label="Main category" value={f.main} onChange={(v) => setF({ ...f, main: v })} options={(d.filters || {}).main_category} />
        <Select label="Type" value={f.sub} onChange={(v) => setF({ ...f, sub: v })} options={(d.filters || {}).sub_category} />
        {tr.direction && <Chip tone={tr.direction === "up" ? "red" : tr.direction === "down" ? "green" : "grey"}>trend {tr.direction} · last 7 days {num(tr.last7_avg_kg)} kg/day vs {num(tr.prev7_avg_kg)} before</Chip>}
      </div>
      <div className="csr-cols grid gap-3 lg:grid-cols-[1fr,24rem] items-start mb-3">
        <Panel title="kg per day — direct production (blue) on general (amber)" right={`${num(d.days_tracked)} days tracked`}>
          {Array.isArray(tr.t) && tr.t.length ? <BarChart x={tr.t} y={tr.direct} y2={tr.general} unit="kg" every={1} label={(lab) => String(lab).slice(5)} /> : <div className="text-sm text-slate-500 p-2">{loading ? "Loading…" : "no days"}</div>}
        </Panel>
        {byType && <Panel title={byType.title}><Table columns={byType.columns} rows={byType.rows} max={320} dense loading={loading} error={error} onRetry={reload} widths={{ main_category: "9rem", sub_category: "11rem" }} render={{ kg: (v) => <span className="tabular-nums font-bold text-white">{num(v)}</span>, main_category: (v) => <Chip tone={/direct/i.test(v) ? "sky" : "amber"}>{/direct/i.test(v) ? "Direct" : "General"}</Chip> }} /></Panel>}
      </div>
      <div className="text-xs text-slate-500 mb-1">{rows.length} day rows</div>
      <Table columns={d.columns} rows={rows} max={480} loading={loading} error={error} onRetry={reload} empty="No rows match." widths={{ treatment: "20rem" }} render={{
        main_category: (v) => <Chip tone={/direct/i.test(v) ? "sky" : "amber"}>{v}</Chip>,
        kg: (v) => <span className="tabular-nums font-bold text-white">{num(v)}</span>,
      }} />
    </Screen>
  );
};

export default WasteDaily;
