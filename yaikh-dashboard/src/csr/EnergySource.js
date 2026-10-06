// CSR · Energy › Energy Source — where the site's electricity came from on a day and month to date:
// grid transformers 1 and 2, generator, rooftop solar, the main meter; transformers + generator = the
// Energy screen's grid, + solar = its total. Data: csr view energy-source.
import React, { useState } from "react";
import { useView, num, pct, Chip, Panel, Bar, Table, Screen } from "./csr";

const TONE = { "Grid transformer 1": "bg-sky-400", "Grid transformer 2": "bg-sky-300", Generator: "bg-rose-400", Solar: "bg-amber-400", "Main meter": "bg-slate-400" };

const EnergySource = ({ onBack }) => {
  const [date, setDate] = useState("");
  const { d, error, loading, reload } = useView({ view: "energy-source", date: date || undefined });
  const rows = d.rows || [];
  const sources = rows.filter((r) => !/main meter/i.test(r.source));
  const tie = d.tie || {};
  return (
    <Screen onBack={onBack} heading="Energy sources" sub={d.subtitle} summary={d.summary} loading={loading} error={error} onReload={reload}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="inline-flex items-center gap-1 text-xs text-slate-400">Date <input type="date" value={date || d.date || ""} onChange={(e) => setDate(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-md px-1.5 py-1 text-xs text-white" /></label>
        {d.basis && <Chip tone={d.basis === "metered" ? "green" : "grey"}>{d.basis}</Chip>}
        {tie.energy_view && <Chip tone={Number(tie.transformers_plus_generator) === Number(tie.energy_view.grid) ? "green" : "red"}>transformers + generator {num(tie.transformers_plus_generator)} = Energy screen grid {num(tie.energy_view.grid)} kWh · + solar {num(tie.energy_view.solar)} = {num(tie.energy_view.kwh)}</Chip>}
      </div>
      <Panel title="Share of the day" className="mb-3">
        <div className="flex h-6 w-full overflow-hidden rounded-lg border border-slate-700">{sources.map((r) => <div key={r.source} className={`${TONE[r.source] || "bg-slate-500"} h-full`} style={{ width: `${Math.max(0, Number(r.share) || 0)}%` }} title={`${r.source} · ${pct(r.share)} · ${num(r.kwh_day)} kWh`} />)}</div>
        <div className="csr-cols mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{sources.map((r) => <div key={r.source} className="rounded-lg border border-slate-700 bg-slate-900/60 px-2.5 py-1.5"><div className="flex items-center gap-1.5 text-xs text-slate-300"><span className={`inline-block w-2.5 h-2.5 rounded-sm ${TONE[r.source] || "bg-slate-500"}`} />{r.source} <span className="text-slate-500">{r.device}</span></div><div className="text-base font-black text-white tabular-nums">{num(r.kwh_day)} kWh <span className="text-xs font-bold text-slate-400">{pct(r.share)}</span></div><div className="mt-1"><Bar v={r.share} tone={TONE[r.source] || "bg-slate-500"} h={4} /></div><div className="text-[10px] text-slate-500">month to date {num(r.kwh_month)} kWh</div></div>)}</div>
      </Panel>
      <Table columns={d.columns} rows={rows} max={300} loading={loading} error={error} onRetry={reload} labels={{ kwh_day: "kWh (day)", kwh_month: "kWh (month to date)", share: "Share of the day" }} render={{
        source: (v) => <span className="font-bold text-white">{v}</span>,
        share: (v, r) => /main meter/i.test(r.source) ? <span className="text-slate-500">= total</span> : <span className="tabular-nums">{pct(v)}</span>,
      }} />
    </Screen>
  );
};

export default EnergySource;
