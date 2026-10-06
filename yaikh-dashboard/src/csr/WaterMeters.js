// CSR · Water › In / Out — the water meters on a day: the intake meters (deep well + municipal = the Water
// screen's intake) and the use sub-meters (cooling, domestic, canteen, boiler, cleaning, lab, the
// waste-water outlet), the reconciliation (in − out = losses, discharge against the permit, the last
// outlet sample) and a meter's 24-hour series on click. The hub's category tile that opened the screen
// is shown as a chip. Data: csr view water-meters.
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useView, num, pct, Chip, Panel, Bar, Select, Table, Screen } from "./csr";
import { LineChart } from "./charts";

const WaterMeters = ({ onBack, direction: dirProp }) => {
  const { state } = useLocation();
  const category = state && state.category;
  const [f, setF] = useState({ date: "", meter: "" });
  const [dir, setDir] = useState(dirProp || "in");
  const { d, error, loading, reload } = useView({ view: "water-meters", date: f.date || undefined, meter: f.meter || undefined });
  const rows = (d.rows || []).filter((r) => !dir || r.direction === dir);
  const rec = d.reconciliation || {};
  const lab = rec.lab_last_result || {};
  const s = d.series || {};
  const sel = (d.rows || []).find((r) => r.meter === f.meter);
  return (
    <Screen onBack={onBack} heading={`Water meters — ${dir === "out" ? "out (use & discharge)" : "in (intake)"}`} sub={d.subtitle} summary={d.summary} loading={loading} error={error} onReload={reload}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden text-xs">{[["in", "In"], ["out", "Out"], ["", "All"]].map(([k, l]) => <button key={k} onClick={() => setDir(k)} className={`px-2.5 py-1 font-bold ${dir === k ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{l}</button>)}</div>
        <label className="inline-flex items-center gap-1 text-xs text-slate-400">Date <input type="date" value={f.date || d.date || ""} onChange={(e) => setF({ ...f, date: e.target.value })} className="bg-slate-800 border border-slate-700 rounded-md px-1.5 py-1 text-xs text-white" /></label>
        <Select label="Meter" value={f.meter} onChange={(v) => setF({ ...f, meter: v })} options={(d.filters || {}).meter} all="pick a meter for its 24 h" />
        {category && <Chip tone="sky">opened from the {category} tile</Chip>}
        {d.tie && <Chip tone={d.tie.match ? "green" : "red"}>in-meters {num(d.tie.in_meters_m3, 1)} = Water screen intake {num(d.tie.water_view_intake, 1)} m³</Chip>}
      </div>
      <div className="csr-cols grid gap-3 md:grid-cols-3 mb-3">
        <Panel title="In − out = losses">
          <div className="text-sm text-slate-300 space-y-1"><div className="flex justify-between"><span>Intake (in)</span><b className="text-white tabular-nums">{num(rec.in_m3, 1)} m³</b></div><div className="flex justify-between"><span>Metered use (out)</span><b className="text-white tabular-nums">{num(rec.out_m3, 1)} m³</b></div><div className="flex justify-between"><span>Losses</span><b className={`tabular-nums ${rec.loss_pct > 10 ? "text-rose-300" : "text-amber-300"}`}>{num(rec.loss_m3, 1)} m³ · {pct(rec.loss_pct)}</b></div></div>
          <div className="mt-2"><Bar v={100 - (Number(rec.loss_pct) || 0)} tone="bg-sky-400" /></div>
        </Panel>
        <Panel title="Discharge against the permit">
          <div className="text-sm text-slate-300 space-y-1"><div className="flex justify-between"><span>Discharged</span><b className="text-white tabular-nums">{num(rec.discharge_m3, 1)} m³</b></div><div className="flex justify-between"><span>Permit</span><b className="text-white tabular-nums">{num(rec.permit_limit_m3)} m³ / day</b></div><div className="flex justify-between"><span>Used</span><b className={`tabular-nums ${rec.permit_used_pct > 90 ? "text-rose-300" : rec.permit_used_pct > 75 ? "text-amber-300" : "text-emerald-300"}`}>{pct(rec.permit_used_pct)}</b></div></div>
          <div className="mt-2"><Bar v={rec.permit_used_pct} /></div>
        </Panel>
        <Panel title="Last outlet sample">
          <div className="text-sm text-slate-300 space-y-1"><div className="flex justify-between"><span>Sample</span><b className="text-white">{lab.sample || "—"}</b></div><div className="flex justify-between"><span>Date · lab</span><b className="text-white">{lab.date || "—"} · {lab.lab || "—"}</b></div><div className="flex justify-between"><span>Result</span><Chip tone={/within/i.test(lab.result || "") ? "green" : "red"}>{lab.result || "—"}</Chip></div></div>
        </Panel>
      </div>
      {Array.isArray(s.m3) && <Panel title={`${sel ? sel.meter + " · " + sel.name : f.meter} — m³ per hour`} className="mb-3"><LineChart t={s.t} series={[{ k: "m3", label: "m³", v: s.m3, color: "#38bdf8" }]} unit="m³" /></Panel>}
      <Table columns={d.columns} rows={rows} max={420} loading={loading} error={error} onRetry={reload} onRow={(r) => setF({ ...f, meter: f.meter === r.meter ? "" : r.meter })} labels={{ m3_day: "m³ (day)" }} widths={{ name: "18rem" }} render={{
        meter: (v) => <span className={`font-bold ${v === f.meter ? "text-sky-300" : "text-white"}`}>{v}</span>,
        direction: (v) => <Chip tone={v === "in" ? "sky" : "amber"}>{v}</Chip>,
        m3_day: (v) => <span className="tabular-nums font-bold text-white">{num(v, 1)}</span>,
      }} />
    </Screen>
  );
};

export default WaterMeters;
