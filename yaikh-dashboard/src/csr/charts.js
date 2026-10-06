// CSR — small hand-drawn SVG charts (no library): lines over a day, bars over days, a share gauge.
import React from "react";
import { num } from "./csr";

export const COLORS = ["#38bdf8", "#fbbf24", "#34d399", "#f472b6", "#a78bfa", "#fb7185"];

// several series over the same x labels; `limit` draws a dashed line
export const LineChart = ({ t = [], series = [], limit, unit, height = 150, every }) => {
  const W = 760, H = height, P = 8, AX = 14;
  const vals = series.flatMap((s) => (s.v || []).filter((x) => typeof x === "number"));
  if (!vals.length) return <div className="text-sm text-slate-500 p-2">no data</div>;
  const lo = Math.min(0, ...vals), hi = Math.max(...vals, limit !== undefined ? limit : -Infinity) * 1.06 || 1;
  const n = Math.max(1, t.length - 1);
  const X = (i) => P + (i / n) * (W - 2 * P), Y = (y) => H - P - AX - ((y - lo) / (hi - lo || 1)) * (H - 2 * P - AX);
  const step = every || Math.max(1, Math.round(t.length / 8));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      {limit !== undefined && <><line x1={P} x2={W - P} y1={Y(limit)} y2={Y(limit)} stroke="#f43f5e" strokeDasharray="4 3" /><text x={W - P} y={Y(limit) - 2} textAnchor="end" fontSize={9} fill="#fda4af">limit {limit} {unit || ""}</text></>}
      {series.map((s, si) => <path key={s.k || si} d={(s.v || []).map((y, i) => (typeof y !== "number" ? "" : `${i === 0 || typeof s.v[i - 1] !== "number" ? "M" : "L"}${X(i).toFixed(1)},${Y(y).toFixed(1)}`)).join(" ")} fill="none" stroke={s.color || COLORS[si % COLORS.length]} strokeWidth={s.k === "total" ? 2.2 : 1.6} strokeLinejoin="round" />)}
      {t.map((lab, i) => (i % step === 0 || i === t.length - 1) && <text key={i} x={X(i)} y={H - 2} textAnchor={i === 0 ? "start" : i === t.length - 1 ? "end" : "middle"} fontSize={9} fill="#64748b">{lab}</text>)}
      <text x={P} y={P + 8} fontSize={9} fill="#64748b">{num(hi / 1.06, 1)} {unit || ""}</text>
    </svg>
  );
};
export const Legend = ({ series }) => <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">{series.map((s, i) => <span key={s.k || i} className="inline-flex items-center gap-1"><span className="inline-block w-3 h-1 rounded" style={{ background: s.color || COLORS[i % COLORS.length] }} />{s.label || s.k}</span>)}</div>;

// bars over days (one or two stacked series), labels every n-th day
export const BarChart = ({ x = [], y = [], y2, color = "#38bdf8", color2 = "#fbbf24", height = 150, every = 5, unit, label }) => {
  const W = 760, H = height, P = 8, AX = 14, n = x.length || 1, bw = (W - 2 * P) / n;
  const tops = x.map((_, i) => (Number(y[i]) || 0) + (y2 ? Number(y2[i]) || 0 : 0));
  const top = Math.max(1, ...tops);
  const Y = (v) => H - P - AX - (v / top) * (H - 2 * P - AX - 4);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      {x.map((lab, i) => {
        const xx = P + i * bw + 1, w = Math.max(2, bw - 2), a = Number(y[i]) || 0, b = y2 ? Number(y2[i]) || 0 : 0;
        return (
          <g key={lab + i}>
            <title>{`${lab} · ${num(a, 1)}${y2 ? " + " + num(b, 1) : ""} ${unit || ""}`}</title>
            {y2 && <rect x={xx} y={Y(a + b)} width={w} height={Math.max(0, Y(a) - Y(a + b))} fill={color2} />}
            <rect x={xx} y={Y(a)} width={w} height={Math.max(0, H - P - AX - Y(a))} fill={color} />
            {(i === 0 || i === n - 1 || (i + 1) % every === 0) && <text x={xx + w / 2} y={H - 2} textAnchor="middle" fontSize={9} fill="#94a3b8">{label ? label(lab, i) : String(lab).slice(-2)}</text>}
          </g>
        );
      })}
      <text x={P} y={P + 8} fontSize={9} fill="#64748b">{num(top, 0)} {unit || ""}</text>
    </svg>
  );
};

// a half-ring gauge: value out of max, with a caption
export const Gauge = ({ value, max, label, sub, tone = "#38bdf8", size = 150 }) => {
  const r = 56, cx = 70, cy = 70, pct = Math.max(0, Math.min(1, max ? value / max : 0));
  const arc = (p) => { const a = Math.PI * (1 - p); return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; };
  const [ex, ey] = arc(pct);
  return (
    <svg viewBox="0 0 140 86" style={{ width: size, height: size * 0.62 }}>
      <path d={`M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}`} fill="none" stroke="#334155" strokeWidth={12} strokeLinecap="round" />
      {pct > 0 && <path d={`M${cx - r},${cy} A${r},${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${ex.toFixed(1)},${ey.toFixed(1)}`} fill="none" stroke={tone} strokeWidth={12} strokeLinecap="round" />}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize={16} fontWeight={800} fill="#fff">{label}</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize={8} fill="#94a3b8">{sub}</text>
    </svg>
  );
};
