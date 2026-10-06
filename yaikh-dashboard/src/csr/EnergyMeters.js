// CSR · Energy › Meters — the 30 sub-meters by area on a day: kWh per phase, total, phase imbalance; the
// phase gauge and the hourly chart for the whole site (no meter picked) or for one meter (click a row);
// the meters add up to the Energy screen's day. Data: csr view energy-meters.
import React, { useState } from "react";
import { useView, num, pct, Chip, Panel, Select, Table, Screen } from "./csr";
import { LineChart, Legend, Gauge } from "./charts";

const EnergyMeters = ({ onBack }) => {
  const [f, setF] = useState({ date: "", factory: "", meter: "", interval: "1h" });
  const { d, error, loading, reload } = useView({ view: "energy-meters", date: f.date || undefined, factory: f.factory || undefined, meter: f.meter || undefined, interval: f.interval });
  const rows = d.rows || [];
  const s = d.series || {};
  const sel = f.meter ? rows.find((r) => r.meter === f.meter) : null;
  const a = sel ? sel.phase_a_kwh : (d.summary || []).find((x) => x.label === "Phase A kWh")?.value, b = sel ? sel.phase_b_kwh : (d.summary || []).find((x) => x.label === "Phase B kWh")?.value, c = sel ? sel.phase_c_kwh : (d.summary || []).find((x) => x.label === "Phase C kWh")?.value;
  const tot = (Number(a) || 0) + (Number(b) || 0) + (Number(c) || 0);
  const imb = sel ? sel.imbalance_pct : tot ? ((Math.max(a, b, c) - Math.min(a, b, c)) / (tot / 3)) * 100 : 0;
  const series = [["a", "Phase A", "#38bdf8"], ["b", "Phase B", "#fbbf24"], ["c", "Phase C", "#34d399"], ["total", "Total", "#f8fafc"]].filter(([k]) => Array.isArray(s[k])).map(([k, label, color]) => ({ k, label, color, v: s[k] }));
  return (
    <Screen onBack={onBack} heading="Energy meters" sub={d.subtitle} summary={d.summary} loading={loading} error={error} onReload={reload}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="inline-flex items-center gap-1 text-xs text-slate-400">Date <input type="date" value={f.date || d.date || ""} onChange={(e) => setF({ ...f, date: e.target.value })} className="bg-slate-800 border border-slate-700 rounded-md px-1.5 py-1 text-xs text-white" /></label>
        <Select label="Factory" value={f.factory} onChange={(v) => setF({ ...f, factory: v, meter: "" })} options={(d.filters || {}).factory} />
        <Select label="Meter" value={f.meter} onChange={(v) => setF({ ...f, meter: v })} options={(d.filters || {}).meter} all="all meters (site total)" />
        <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden text-xs">{((d.filters || {}).interval || ["15m", "30m", "1h", "day"]).map((k) => <button key={k} onClick={() => setF({ ...f, interval: k })} className={`px-2.5 py-1 font-bold ${f.interval === k ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{k}</button>)}</div>
        {d.tie && <Chip tone={d.tie.match ? "green" : "red"}>{d.tie.match ? "ties" : "does not tie"} to the Energy screen · {num(d.tie.energy_view_kwh)} kWh</Chip>}
        {d.basis && <Chip tone={d.basis === "metered" ? "green" : "grey"}>{d.basis}</Chip>}
      </div>
      <div className="csr-cols grid gap-3 lg:grid-cols-[14rem,1fr] items-start mb-3">
        <Panel title={sel ? `Phases — ${sel.meter}` : "Phases — all meters"} info="The gauge shows the day's kWh split across the three phases; the figure is the phase imbalance (max − min over the mean).">
          <div className="flex flex-col items-center">
            <Gauge value={tot ? Math.min(imb, 30) : 0} max={30} label={`${num(imb, 1)}%`} sub="phase imbalance" tone={imb > 15 ? "#f43f5e" : imb > 8 ? "#fbbf24" : "#34d399"} />
            <div className="mt-1 grid grid-cols-3 gap-2 text-center text-xs">{[["A", a, "#38bdf8"], ["B", b, "#fbbf24"], ["C", c, "#34d399"]].map(([k, v, col]) => <div key={k}><div className="text-[10px] text-slate-500">Phase {k}</div><div className="font-black tabular-nums" style={{ color: col }}>{num(v)}</div><div className="text-[10px] text-slate-500">{tot ? pct((Number(v) / tot) * 100) : "—"}</div></div>)}</div>
            <div className="mt-1 text-xs text-slate-400">{num(tot)} kWh on the day</div>
          </div>
        </Panel>
        <Panel className="csr-first" title={`${sel ? sel.meter + " · " + sel.area : "All meters (site total)"} — kWh every ${d.interval || f.interval}`} right={<Legend series={series} />}>
          {series.length ? <LineChart t={s.t} series={series} unit="kWh" /> : <div className="text-sm text-slate-500 p-2">{loading ? "Loading…" : "no series for this selection"}</div>}
        </Panel>
      </div>
      <div className="text-xs text-slate-500 mb-1">{rows.length} meters · click a meter for its own phases and series</div>
      <Table columns={d.columns} rows={rows} max={520} loading={loading} error={error} onRetry={reload} onRow={(r) => setF({ ...f, meter: f.meter === r.meter ? "" : r.meter })} labels={{ phase_a_kwh: "Phase A kWh", phase_b_kwh: "Phase B kWh", phase_c_kwh: "Phase C kWh", kwh_total: "Total kWh", imbalance_pct: "Imbalance %" }} widths={{ area: "16rem" }} render={{
        meter: (v) => <span className={`font-bold ${v === f.meter ? "text-sky-300" : "text-white"}`}>{v}</span>,
        imbalance_pct: (v) => <span className={`tabular-nums font-bold ${v > 15 ? "text-rose-300" : v > 8 ? "text-amber-300" : "text-emerald-300"}`}>{pct(v)}</span>,
        kwh_total: (v) => <span className="tabular-nums font-bold text-white">{num(v)}</span>,
      }} />
    </Screen>
  );
};

export default EnergyMeters;
