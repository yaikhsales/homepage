// CSR · Energy › Switch Board Ampere Load Monitoring — the 16 main switch boards on a day: area, rated kW,
// peak-hour average current, last check, the day's kWh; click a board for its equipment table (name, qty,
// rating, last check, kWh, amps, meter). The boards add up to the meters and to the Energy screen.
// Data: csr view switch-boards.
import React, { useState } from "react";
import { useView, num, Chip, Panel, Select, Table, Screen } from "./csr";

const SwitchBoards = ({ onBack }) => {
  const [f, setF] = useState({ date: "", factory: "", board: "" });
  const { d, error, loading, reload } = useView({ view: "switch-boards", date: f.date || undefined, factory: f.factory || undefined });
  const rows = d.rows || [];
  const sel = rows.find((r) => r.board === f.board);
  const eq = (sel && sel.equipment) || [];
  return (
    <Screen onBack={onBack} heading="Switch boards — ampere load" sub={d.subtitle} summary={d.summary} loading={loading} error={error} onReload={reload}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="inline-flex items-center gap-1 text-xs text-slate-400">Date <input type="date" value={f.date || d.date || ""} onChange={(e) => setF({ ...f, date: e.target.value })} className="bg-slate-800 border border-slate-700 rounded-md px-1.5 py-1 text-xs text-white" /></label>
        <Select label="Factory" value={f.factory} onChange={(v) => setF({ ...f, factory: v, board: "" })} options={(d.filters || {}).factory} />
        <Select label="Board" value={f.board} onChange={(v) => setF({ ...f, board: v })} options={(d.filters || {}).board} all="pick a board for its equipment" />
        {d.tie && <Chip tone={d.tie.match ? "green" : "red"}>boards {num(d.tie.boards_kwh)} = meters {num(d.tie.meters_kwh)} = Energy screen {num(d.tie.energy_view_kwh)} kWh</Chip>}
      </div>
      <Table columns={d.columns} rows={rows} max={420} loading={loading} error={error} onRetry={reload} onRow={(r) => setF({ ...f, board: f.board === r.board ? "" : r.board })} labels={{ rated_kw: "Rated kW", peak_amp: "Peak A (avg, peak hour)", last_check: "Last check", kwh_total: "kWh (day)" }} widths={{ area: "18rem" }} render={{
        board: (v, r) => <span className={`font-bold ${v === f.board ? "text-sky-300" : "text-white"}`}>{v}<span className="text-slate-500 font-normal"> · {(r.meters || []).join(", ")}</span></span>,
        peak_amp: (v) => <span className="tabular-nums font-bold text-amber-300">{num(v, 1)} A</span>,
        kwh_total: (v) => <span className="tabular-nums font-bold text-white">{num(v)}</span>,
        rated_kw: (v) => <span className="tabular-nums">{num(v, 1)}</span>,
      }} />
      <div className="mt-3">
        {sel ? (
          <Panel title={`${sel.board} · ${sel.area} — equipment`} right={`${eq.length} lines · rated ${num(sel.rated_kw, 1)} kW · peak ${num(sel.peak_amp, 1)} A · ${num(sel.kwh_total)} kWh · last check ${sel.last_check}`}>
            <Table columns={[["name", "Equipment"], ["qty", "Qty"], ["rated_kw", "Rated kW (each)"], ["rated_a", "Rated A (each)"], ["last_check", "Last check"], ["kwh", "kWh (day)"], ["amp", "Amps (peak hour)"], ["meter", "Meter"]]} rows={eq} max={360} widths={{ name: "22rem" }} render={{
              name: (v) => <span className="font-bold text-white">{v}</span>,
              amp: (v) => <span className="tabular-nums font-bold text-amber-300">{num(v, 1)}</span>,
              kwh: (v) => <span className="tabular-nums font-bold text-white">{num(v)}</span>,
            }} />
          </Panel>
        ) : <div className="text-xs text-slate-500">click a board (or pick one above) for its equipment table</div>}
      </div>
    </Screen>
  );
};

export default SwitchBoards;
