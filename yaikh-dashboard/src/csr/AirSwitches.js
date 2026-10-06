// CSR · Air › Switch (Fan & Pump) — the fans and cooling-pad pumps by zone: state, last change, mode,
// the linked air sensor. DISPLAY ONLY: switching is done at the panel — there is no toggle or button of
// any kind on this screen. Data: csr view air-switches (display_only: true).
import React, { useState } from "react";
import { Fan, Droplets, Power } from "lucide-react";
import { useView, num, Chip, Select, Table, Screen } from "./csr";

const AirSwitches = ({ onBack }) => {
  const [f, setF] = useState({ factory: "", kind: "", state: "" });
  const { d, error, loading, reload } = useView({ view: "air-switches", factory: f.factory || undefined, kind: f.kind || undefined, state: f.state || undefined });
  const rows = d.rows || [];
  return (
    <Screen onBack={onBack} heading="Air switches — fans & pumps" sub={d.subtitle} summary={d.summary} loading={loading} error={error} onReload={reload}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Select label="Factory" value={f.factory} onChange={(v) => setF({ ...f, factory: v })} options={(d.filters || {}).factory} />
        <Select label="Kind" value={f.kind} onChange={(v) => setF({ ...f, kind: v })} options={(d.filters || {}).kind} />
        <Select label="State" value={f.state} onChange={(v) => setF({ ...f, state: v })} options={(d.filters || {}).state} />
        <Chip tone="grey"><Power size={10} className="inline -mt-px mr-1" />display only — switching is done at the panel</Chip>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-3">
        {rows.map((r) => (
          <div key={r.device} className={`rounded-xl border p-2.5 bg-slate-800/50 ${r.state === "on" ? "border-emerald-500/40" : "border-slate-700"}`} aria-label={`${r.device} ${r.state}`}>
            <div className="flex items-center gap-2">
              <span className={`inline-flex w-7 h-7 items-center justify-center rounded-lg ${r.kind === "pump" ? "bg-sky-500/20 text-sky-300" : "bg-amber-500/20 text-amber-300"}`}>{r.kind === "pump" ? <Droplets size={15} /> : <Fan size={15} className={r.state === "on" ? "animate-spin" : ""} style={r.state === "on" ? { animationDuration: "3s" } : undefined} />}</span>
              <div className="min-w-0 flex-1"><div className="text-xs font-black text-white">{r.device} <span className="text-slate-500 font-normal">{r.kind}</span></div><div className="text-[11px] text-slate-400 truncate" title={r.area}>{r.area}</div></div>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-black ${r.state === "on" ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-600/40 text-slate-300"}`}><span className={`inline-block w-2 h-2 rounded-full ${r.state === "on" ? "bg-emerald-400" : "bg-slate-400"}`} />{String(r.state).toUpperCase()}</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-500"><span>since {r.last_change}</span><span>mode {r.mode}</span>{r.linked_sensor && <span>sensor {r.linked_sensor}</span>}{r.note && <span className={/maint/i.test(r.note) ? "text-amber-300" : ""}>{r.note}</span>}</div>
          </div>
        ))}
        {rows.length === 0 && <div className="text-sm p-3">{error ? <span className="text-amber-200">{error}</span> : loading ? <span className="text-slate-400">Loading…</span> : <span className="text-slate-500">No devices match.</span>}</div>}
      </div>
      <Table columns={d.columns} rows={rows} max={420} dense loading={loading} error={error} onRetry={reload} labels={{ last_change: "Last change", linked_sensor: "Linked sensor" }} widths={{ area: "16rem", note: "16rem" }} render={{
        device: (v) => <span className="font-bold text-white">{v}</span>,
        state: (v) => <Chip tone={v === "on" ? "green" : "grey"}>{String(v).toUpperCase()}</Chip>,
      }} />
      <div className="mt-2 text-xs text-slate-500">{num(rows.length)} devices shown · status only, nothing here switches anything</div>
    </Screen>
  );
};

export default AirSwitches;
