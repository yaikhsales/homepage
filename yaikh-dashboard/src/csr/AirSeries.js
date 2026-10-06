// CSR · Air — one device's day: the series of every reading (CO₂, PM2.5, PM10, CH₂O, TVOC, temperature,
// humidity) at 15 / 30 / 60-minute steps as hand-drawn SVG lines with the limit line, the day's stats
// (average, max, points over the limit) and the table. Device, date and interval pickers.
// Data: csr view air-series.
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useView, num, Chip, Tile, Select, Panel, Table, Screen } from "./csr";
import { METRICS, fmt } from "./AirSensors";

// one metric: a line over the day, the limit as a dashed line, the points over it in red
const Line = ({ t, v, lim, name, unit }) => {
  const W = 320, H = 96, P = 6;
  const xs = (v || []).map((x) => (typeof x === "number" ? x : null));
  const vals = xs.filter((x) => x !== null);
  if (!vals.length) return <div className="text-[11px] text-slate-500">no data</div>;
  const lo = Math.min(...vals, lim !== undefined ? lim : Infinity) * 0.95, hi = Math.max(...vals, lim !== undefined ? lim : -Infinity) * 1.05 || 1;
  const X = (i) => P + (i / Math.max(1, xs.length - 1)) * (W - 2 * P), Y = (y) => H - P - ((y - lo) / (hi - lo || 1)) * (H - 2 * P);
  const path = xs.map((y, i) => (y === null ? "" : `${i === 0 || xs[i - 1] === null ? "M" : "L"}${X(i).toFixed(1)},${Y(y).toFixed(1)}`)).join(" ");
  const over = xs.map((y, i) => (y !== null && lim !== undefined && y > lim ? i : -1)).filter((i) => i >= 0);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-24">
      {lim !== undefined && <line x1={P} x2={W - P} y1={Y(lim)} y2={Y(lim)} stroke="#f43f5e" strokeDasharray="4 3" strokeWidth={1} />}
      {lim !== undefined && <text x={W - P} y={Y(lim) - 2} textAnchor="end" fontSize={8} fill="#fda4af">limit {lim} {unit}</text>}
      <path d={path} fill="none" stroke="#38bdf8" strokeWidth={1.6} strokeLinejoin="round" />
      {over.map((i) => <circle key={i} cx={X(i)} cy={Y(xs[i])} r={2.2} fill="#f43f5e" />)}
      {[0, Math.floor(xs.length / 2), xs.length - 1].map((i) => <text key={i} x={X(i)} y={H - 0.5} textAnchor={i === 0 ? "start" : i === xs.length - 1 ? "end" : "middle"} fontSize={7} fill="#64748b">{(t || [])[i]}</text>)}
    </svg>
  );
};

const AirSeries = ({ onBack }) => {
  const { device: param } = useParams();
  const navigate = useNavigate();
  const [interval, setInterval_] = useState("1h");
  const [date, setDate] = useState("");
  const device = decodeURIComponent(param || "");
  const { d, error, loading, reload } = useView({ view: "air-series", device: device || undefined, interval, date: date || undefined });
  const lim = d.limits || {}, st = d.stats || {}, s = d.series || {};
  const dev = d.device || {};
  const metrics = METRICS.filter((k) => Array.isArray(s[k]) && s[k].some((x) => typeof x === "number"));
  return (
    <Screen onBack={onBack || (() => navigate("/dashboard/air/quality"))} heading={d.title || `Air series — ${device}`} sub={d.subtitle} summary={d.summary} loading={loading} error={error} onReload={reload}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Select label="Device" value={device} onChange={(v) => v && navigate("/dashboard/air/series/" + encodeURIComponent(v))} options={d.devices || (d.filters || {}).device} all="pick a device" />
        <label className="inline-flex items-center gap-1 text-[11px] text-slate-400">Date <input type="date" value={date || d.date || ""} onChange={(e) => setDate(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-md px-1.5 py-0.5 text-[11px] text-white" /></label>
        <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden text-xs">{((d.filters || {}).interval || ["15m", "30m", "1h"]).map((k) => <button key={k} onClick={() => setInterval_(k)} className={`px-2.5 py-1 font-bold ${interval === k ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{k}</button>)}</div>
        {dev.device && <span className="text-[11px] text-slate-400 ml-auto">{dev.kind_name} · {dev.zone} · <Chip tone={dev.status === "online" ? "green" : "red"}>{dev.status}</Chip></span>}
      </div>
      <div className="flex flex-wrap gap-2 mb-3">{metrics.map((k) => <Tile key={k} label={(lim[k] && lim[k].name) || k} value={fmt(k, st[k] && st[k].daily_average)} sub={`max ${fmt(k, st[k] && st[k].max)} · ${num(st[k] && st[k].points_over)} over${lim[k] ? ` · limit ${lim[k].limit} ${lim[k].unit}` : ""}`} tone={st[k] && st[k].points_over ? "text-rose-300" : undefined} />)}</div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 mb-3">
        {metrics.map((k) => <Panel key={k} title={`${(lim[k] && lim[k].name) || k} ${lim[k] ? "(" + lim[k].unit + ")" : ""}`} right={`avg ${fmt(k, st[k] && st[k].daily_average)}`}><Line t={s.t} v={s[k]} lim={lim[k] && lim[k].limit} name={lim[k] && lim[k].name} unit={lim[k] && lim[k].unit} /></Panel>)}
        {metrics.length === 0 && <div className="text-xs text-slate-500 p-3">{loading ? "Loading…" : "No series for this device and date."}</div>}
      </div>
      <Table columns={d.columns} rows={d.rows} max={420} render={{ over: (v) => v ? <Chip tone="red">{v}</Chip> : <span className="text-slate-600">—</span>, ...Object.fromEntries(METRICS.map((k) => [k, (v) => <span className={`tabular-nums ${lim[k] && typeof v === "number" && v > lim[k].limit ? "text-rose-300 font-bold" : ""}`}>{fmt(k, v)}</span>])) }} />
    </Screen>
  );
};

export default AirSeries;
