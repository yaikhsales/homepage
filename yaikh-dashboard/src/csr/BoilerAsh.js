// CSR · Waste › Boiler — ash and boiler waste from the biomass boiler over the last 30 days: kg of ash
// per day with the records logged, the boiler feed water (the Water screen's boiler column) and the
// fuel burnt. Data: csr view boiler.
import React, { useState } from "react";
import { useView, num, Panel, Table, Screen } from "./csr";
import { BarChart } from "./charts";

const BoilerAsh = ({ onBack }) => {
  const [to, setTo] = useState("");
  const { d, error, loading, reload } = useView({ view: "boiler", to: to || undefined });
  const ch = d.chart || {};
  return (
    <Screen onBack={onBack} heading="Boiler ash" sub={d.subtitle} summary={d.summary} loading={loading} error={error} onReload={reload}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="inline-flex items-center gap-1 text-xs text-slate-400">30 days to <input type="date" value={to || (d.rows && d.rows[0] && d.rows[0].date) || ""} onChange={(e) => setTo(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-md px-1.5 py-1 text-xs text-white" /></label>
      </div>
      <Panel title="Ash kg per day" className="mb-3">
        {Array.isArray(ch.x) && ch.x.length ? <BarChart x={ch.x} y={ch.y} unit={ch.unit || "kg"} every={5} label={(lab) => String(lab).slice(5)} color="#a78bfa" /> : <div className="text-sm text-slate-500 p-2">{loading ? "Loading…" : "no days"}</div>}
      </Panel>
      <Table columns={d.columns} rows={d.rows} max={520} loading={loading} error={error} onRetry={reload} labels={{ kg: "Ash kg", boiler_water_m3: "Feed water m³", fuel_kg: "Fuel kg", logged_by_role: "Logged by" }} render={{
        date: (v) => <span className="font-bold text-white">{v}</span>,
        kg: (v) => <span className="tabular-nums font-bold text-violet-300">{num(v, 1)}</span>,
        logged_by_role: (v, r) => <span>{v} <span className="text-sky-300">{r.logged_by_emp}</span></span>,
      }} />
    </Screen>
  );
};

export default BoilerAsh;
