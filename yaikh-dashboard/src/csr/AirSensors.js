// CSR · Air — the device grid behind the Air tile: 48 devices (an air-quality detector AQ-… and a
// temperature / humidity sensor TH-… per zone), online / offline, last seen, the live readings (CO₂,
// PM2.5, PM10, CH₂O, TVOC, temperature, humidity) with every reading over its limit highlighted. Click a
// device for its day series. Data: csr view air-sensors.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wind, Thermometer, WifiOff, Wifi } from "lucide-react";
import { useView, num, Chip, Tile, Select, Panel, Screen } from "./csr";

export const METRICS = ["co2", "pm25", "pm10", "ch2o", "tvoc", "temp", "rh"];
export const fmt = (k, v) => (v === null || v === undefined ? "—" : k === "ch2o" || k === "tvoc" ? Number(v).toFixed(k === "ch2o" ? 3 : 2) : k === "temp" ? Number(v).toFixed(1) : num(v));
export const overSet = (over) => new Set(String(over || "").split(/[,;]\s*/).filter(Boolean).map((s) => s.toLowerCase()));
const isOver = (lim, k, v, over) => (lim && lim[k] && typeof v === "number" && v > lim[k].limit) || overSet(over).has(String((lim && lim[k] && lim[k].name) || k).toLowerCase());

const AirSensors = ({ onBack }) => {
  const navigate = useNavigate();
  const [f, setF] = useState({ factory: "", kind: "", status: "" });
  const { d, error, loading, reload } = useView({ view: "air-sensors", factory: f.factory || undefined, kind: f.kind || undefined, status: f.status || undefined });
  const lim = d.limits || {};
  const rows = d.rows || [];
  return (
    <Screen onBack={onBack} heading="Air sensors" sub={d.subtitle} summary={d.summary} loading={loading} error={error} onReload={reload}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Select label="Factory" value={f.factory} onChange={(v) => setF({ ...f, factory: v })} options={(d.filters || {}).factory} />
        <Select label="Kind" value={f.kind} onChange={(v) => setF({ ...f, kind: v })} options={(d.filters || {}).kind} />
        <Select label="Status" value={f.status} onChange={(v) => setF({ ...f, status: v })} options={(d.filters || {}).status} />
        <span className="flex flex-wrap gap-1.5 ml-auto">{METRICS.filter((k) => lim[k]).map((k) => <Chip key={k} tone="grey">{lim[k].name} ≤ {lim[k].limit} {lim[k].unit}</Chip>)}</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map((r) => {
          const aq = r.kind === "aqd";
          const overs = METRICS.filter((k) => isOver(lim, k, r[k], r.over));
          return (
            <button key={r.device} onClick={() => navigate("/dashboard/air/series/" + encodeURIComponent(r.device))} className={`text-left rounded-xl border p-2.5 bg-slate-800/50 hover:border-slate-400 ${r.status === "offline" ? "border-slate-700 opacity-70" : overs.length ? "border-rose-500/50" : "border-slate-700"}`}>
              <div className="flex items-center gap-2">
                <span className={`inline-flex w-7 h-7 items-center justify-center rounded-lg ${aq ? "bg-sky-500/20 text-sky-300" : "bg-amber-500/20 text-amber-300"}`}>{aq ? <Wind size={15} /> : <Thermometer size={15} />}</span>
                <div className="min-w-0 flex-1"><div className="text-xs font-black text-white">{r.device}</div><div className="text-[10px] text-slate-400 truncate" title={r.zone}>{r.zone}</div></div>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${r.status === "online" ? "text-emerald-300" : "text-rose-300"}`}>{r.status === "online" ? <Wifi size={11} /> : <WifiOff size={11} />}{r.status}</span>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1">
                {(aq ? METRICS : ["temp", "rh"]).map((k) => { const o = isOver(lim, k, r[k], r.over); return <div key={k} className={`rounded-md px-1.5 py-1 ${o ? "bg-rose-500/20" : "bg-slate-900/60"}`}><div className="text-[9px] uppercase tracking-wider text-slate-500">{(lim[k] && lim[k].name) || k}</div><div className={`text-xs font-black tabular-nums ${o ? "text-rose-300" : "text-white"}`}>{fmt(k, r[k])}</div></div>; })}
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500"><span>{r.kind_name}</span><span>{r.status === "offline" && r.offline_since ? `offline since ${r.offline_since}` : `seen ${r.last_seen}`}</span></div>
              {overs.length > 0 && <div className="mt-1 text-[10px] text-rose-300">over: {r.over || overs.map((k) => (lim[k] && lim[k].name) || k).join(", ")}</div>}
            </button>
          );
        })}
        {rows.length === 0 && <div className="text-xs text-slate-500 p-3">{loading ? "Loading…" : "No devices match."}</div>}
      </div>
      <Panel title="Reading the grid" className="mt-3"><div className="text-[11px] text-slate-400">A red cell is a reading over its limit (the limits are the chips above; PM2.5 / PM10 follow the ambient standard {d.standard ? `${d.standard.pm25} / ${d.standard.pm10} µg/m³` : ""}). Click a device to see its 24-hour series with the daily average and the points over the limit.</div></Panel>
      <div className="mt-2 flex flex-wrap gap-2">{(d.summary || []).map((x) => <Tile key={x.label} label={x.label} value={num(x.value)} tone={/offline|over/i.test(x.label) && x.value ? "text-rose-300" : undefined} />)}</div>
    </Screen>
  );
};

export default AirSensors;
