// Line diagram of one sewing line for one style. Every style has its own layout:
//   "zigzag" — machines above and below a centre table, work crossing from side to side
//   "u"      — a U-shape hanger line: out along the top arm, round the turn, back along the bottom arm
// A few machines are off-line (preparation work beside the line, feeding it); they sit in a band underneath.
// Each round is one machine. The number is the operation step; two machines on one operation share it.
// Colour: green on target, orange defects, red breakdown, grey not running.
// Two sizes: "big" for the full live screen, "mini" for the pop-up on the Line Plan.
import React from "react";

const ROUND = { green: ["#10b981", "#0f172a"], orange: ["#fbbf24", "#0f172a"], red: ["#f43f5e", "#ffffff"], idle: ["#475569", "#e2e8f0"] };
const INK = { green: "#ffffff", orange: "#fcd34d", red: "#fda4af", idle: "#cbd5e1" };
const SIZES = {
  big: { VW: 1600, R: 26, arm: 80, half: 258, x0: 130, xr: 230, num: 21, op: 15, sub: 11.5, clipN: 24, lab: 18, ang: 38, io: 15, ioW: 7, flow: 1.5, rail: 6, offH: 92, offR: 20 },
  mini: { VW: 736, R: 10, arm: 34, half: 132, x0: 56, xr: 96, num: 10, op: 9.5, sub: 0, clipN: 22, lab: 5, ang: 45, io: 9, ioW: 3, flow: 1, rail: 3, offH: 46, offR: 9 },
};
const clip = (t, n) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);
const num = (v) => (typeof v === "number" ? v.toLocaleString("en-US") : v);

// Adds the operation step to every machine, and for an off-line machine the step it feeds.
export function withSteps(stations) {
  let step = 0;
  const out = (stations || []).map((x, i, all) => {
    if (i === 0 || all[i - 1].op !== x.op) step += 1;
    return { ...x, step };
  });
  out.forEach((x, i) => {
    if (!x.offline) return;
    const next = out.slice(i + 1).find((y) => !y.offline && y.step !== x.step);
    x.feeds = next ? next.step : null;
  });
  return out;
}

const statusLine = (x) => (x.status === "red" ? "BREAKDOWN — mechanic called" : x.status === "orange" ? `${x.defects} defects · ${num(x.pieces)}/${num(x.target)}` : x.status === "idle" ? `${x.machine} · not running` : `${x.machine} · ${num(x.pieces)}/${num(x.target)}`);
const tip = (x) => `Machine ${x.no} (${x.machine_id}) · operator ${x.operator} · step ${x.step} ${x.op} · ${x.note}${x.offline ? " · off-line" : ""}`;

export default function LineDiagram({ stations, layout, size = "big" }) {
  const S = SIZES[size] || SIZES.big;
  const all = withSteps(stations);
  const inl = all.filter((x) => !x.offline);
  const off = all.filter((x) => x.offline);
  const CY = S.half;
  const VH = 2 * S.half + (off.length ? S.offH : 0);
  const isU = layout === "u";
  const id = `yai-ld-${size}`;

  // Where every in-line machine sits, and where its name is written.
  let pts = [];
  let xa = S.x0, xb = S.VW - S.xr;
  if (isU) {
    xa = S.x0 + S.R;
    xb = S.VW - S.xr - S.arm - (size === "big" ? 20 : 50);
    const nTop = Math.ceil((inl.length - 1) / 2);
    const nBot = inl.length - 1 - nTop;
    pts = inl.map((x, i) => {
      if (i < nTop) return { ...x, at: "top", cx: xa + (i * (xb - xa)) / Math.max(nTop - 1, 1), cy: CY - S.arm };
      if (i === nTop) return { ...x, at: "turn", cx: xb + S.arm, cy: CY };
      return { ...x, at: "bottom", cx: xb - ((i - nTop - 1) * (xb - xa)) / Math.max(nBot - 1, 1), cy: CY + S.arm };
    });
  } else {
    const pitch = (xb - xa) / Math.max(inl.length - 1, 1);
    pts = inl.map((x, i) => ({ ...x, at: i % 2 === 0 ? "top" : "bottom", cx: xa + i * pitch, cy: i % 2 === 0 ? CY - S.arm : CY + S.arm }));
  }

  const label = (x) => {
    if (x.at === "turn") {
      const lx = x.cx + S.R + (size === "big" ? 10 : 5), ly = x.cy + (S.sub ? -2 : S.op / 3);
      return { lx, ly, rot: 0 };
    }
    const lx = x.cx + S.lab;
    const ly = x.at === "top" ? x.cy - S.R - (size === "big" ? 14 : 3) : x.cy + S.R + (size === "big" ? 22 : 9);
    return { lx, ly, rot: x.at === "top" ? -S.ang : S.ang };
  };

  const offW = off.length ? (S.VW - (size === "big" ? 170 : 78) - 8) / off.length : 0;

  return (
    <svg viewBox={`0 0 ${S.VW} ${VH}`} className="block w-full">
      <defs>
        <marker id={`${id}-flow`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth={size === "big" ? 6 : 5} markerHeight={size === "big" ? 6 : 5} orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#94a3b8" /></marker>
        <marker id={`${id}-io`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#fb923c" /></marker>
      </defs>

      {!isU && (
        <>
          {/* centre table; work crosses it from one machine to the next */}
          <rect x={S.x0 - S.R * 2 - 4} y={CY - S.R + 2} width={S.VW - (S.x0 - S.R * 2 - 4) * 2} height={S.R * 2 - 4} rx={size === "big" ? 8 : 4} fill="#0f172a" stroke="#64748b" strokeWidth={size === "big" ? 1.5 : 1} />
          <text x={2} y={CY - S.R - S.io * 1.9} fontSize={S.io} fontWeight="800" fill="#fb923c">LINE</text>
          <text x={2} y={CY - S.R - S.io * 0.8} fontSize={S.io} fontWeight="800" fill="#fb923c">INPUT</text>
          <line x1={4} y1={CY} x2={S.x0 - S.R * 2 - 2} y2={CY} stroke="#fb923c" strokeWidth={S.ioW} markerEnd={`url(#${id}-io)`} />
          <text x={S.VW - 2} y={CY + S.R + S.io * 1.5} fontSize={S.io} fontWeight="800" fill="#fb923c" textAnchor="end">LINE</text>
          <text x={S.VW - 2} y={CY + S.R + S.io * 2.6} fontSize={S.io} fontWeight="800" fill="#fb923c" textAnchor="end">OUTPUT</text>
          <line x1={S.VW - (S.x0 - S.R * 2 - 4)} y1={CY} x2={S.VW - 4} y2={CY} stroke="#fb923c" strokeWidth={S.ioW} markerEnd={`url(#${id}-io)`} />
          {pts.slice(0, -1).map((a, i) => {
            const n = pts[i + 1];
            const d1 = a.at === "top" ? S.R : -S.R, d2 = n.at === "top" ? S.R + 2 : -S.R - 2;
            return <line key={`f${a.no}`} x1={a.cx} y1={a.cy + d1} x2={n.cx} y2={n.cy + d2} stroke="#94a3b8" strokeWidth={S.flow} markerEnd={`url(#${id}-flow)`} />;
          })}
        </>
      )}

      {isU && (
        <>
          {/* the hanger rail: out along the top, round the turn, back along the bottom */}
          <path d={`M ${S.R * 2} ${CY - S.arm} H ${xb} A ${S.arm} ${S.arm} 0 0 1 ${xb} ${CY + S.arm} H ${S.R * 2}`} fill="none" stroke="#64748b" strokeWidth={S.rail} strokeLinecap="round" />
          <text x={(xa + xb) / 2} y={CY + S.io / 3} fontSize={S.io} fontWeight="800" fill="#475569" textAnchor="middle" letterSpacing={size === "big" ? 6 : 3}>U-SHAPE HANGER LINE</text>
          <text x={2} y={CY - S.arm - S.R - (size === "big" ? 8 : 4)} fontSize={S.io} fontWeight="800" fill="#fb923c">LINE INPUT</text>
          <line x1={2} y1={CY - S.arm} x2={S.R * 2 + 2} y2={CY - S.arm} stroke="#fb923c" strokeWidth={S.ioW} markerEnd={`url(#${id}-io)`} />
          <text x={2} y={CY + S.arm + S.R + S.io + (size === "big" ? 6 : 3)} fontSize={S.io} fontWeight="800" fill="#fb923c">LINE OUTPUT</text>
          <line x1={S.R * 2 + 2} y1={CY + S.arm} x2={4} y2={CY + S.arm} stroke="#fb923c" strokeWidth={S.ioW} markerEnd={`url(#${id}-io)`} />
          {/* direction of travel, between machines on the arms */}
          {pts.slice(0, -1).map((a, i) => {
            const n = pts[i + 1];
            if (a.at !== n.at || a.at === "turn") return null;
            const mx = (a.cx + n.cx) / 2, k = size === "big" ? 7 : 4, dir = a.at === "top" ? 1 : -1;
            return <path key={`d${a.no}`} d={`M ${mx - k * dir} ${a.cy - k} L ${mx + k * dir} ${a.cy} L ${mx - k * dir} ${a.cy + k} z`} fill="#94a3b8" />;
          })}
        </>
      )}

      {pts.map((x) => {
        const [fill, ink] = ROUND[x.status] || ROUND.idle;
        const { lx, ly, rot } = label(x);
        return (
          <g key={x.no}>
            <title>{tip(x)}</title>
            <circle cx={x.cx} cy={x.cy} r={S.R} fill={fill} stroke="#0f172a" strokeWidth={size === "big" ? 2 : 1.5} className={x.status === "red" ? "animate-pulse" : ""} style={size === "big" && x.status !== "idle" ? { filter: `drop-shadow(0 0 7px ${fill})` } : undefined} />
            <text x={x.cx} y={x.cy + S.num / 3} fontSize={S.num} fontWeight="900" fill={ink} textAnchor="middle">{x.step}</text>
            <text transform={rot ? `rotate(${rot} ${lx} ${ly})` : undefined}>
              <tspan x={lx} y={ly} fontSize={S.op} fontWeight={size === "big" || x.status === "red" || x.status === "orange" ? 800 : 500} fill={size === "big" ? INK[x.status] || INK.idle : x.status === "red" || x.status === "orange" ? INK[x.status] : "#cbd5e1"}>{clip(x.op, S.clipN)}</tspan>
              {S.sub > 0 && <tspan x={lx} y={ly + S.sub + 3.5} fontSize={S.sub} fill={x.status === "red" || x.status === "orange" ? INK[x.status] : "#94a3b8"}>{statusLine(x)}</tspan>}
            </text>
          </g>
        );
      })}

      {off.length > 0 && (
        <g>
          {/* off-line machines: preparation beside the line */}
          <line x1={0} y1={2 * S.half + 1} x2={S.VW} y2={2 * S.half + 1} stroke="#475569" strokeDasharray="5 4" />
          <text x={2} y={2 * S.half + S.offH / 2 - 1} fontSize={S.io} fontWeight="800" fill="#e2e8f0">OFF-LINE</text>
          <text x={2} y={2 * S.half + S.offH / 2 + S.io} fontSize={size === "big" ? 11.5 : 8} fill="#94a3b8">{off.length} machines beside the line</text>
          {off.map((x, i) => {
            const [fill, ink] = ROUND[x.status] || ROUND.idle;
            const cx = (size === "big" ? 170 : 78) + i * offW + S.offR, cy = 2 * S.half + S.offH / 2 + 2;
            return (
              <g key={x.no}>
                <title>{tip(x)}</title>
                <circle cx={cx} cy={cy} r={S.offR} fill={fill} stroke="#e2e8f0" strokeWidth={size === "big" ? 2 : 1.2} strokeDasharray={size === "big" ? "5 3" : "3 2"} className={x.status === "red" ? "animate-pulse" : ""} />
                <text x={cx} y={cy + (size === "big" ? 6 : 3.2)} fontSize={size === "big" ? 17 : 9} fontWeight="900" fill={ink} textAnchor="middle">{x.step}</text>
                <text x={cx + S.offR + (size === "big" ? 8 : 4)} y={cy - (size === "big" ? 3 : 1)} fontSize={size === "big" ? 14 : 8.5} fontWeight="800" fill={INK[x.status] || INK.idle}>{clip(x.op, size === "big" ? 22 : 19)}</text>
                <text x={cx + S.offR + (size === "big" ? 8 : 4)} y={cy + (size === "big" ? 13 : 9)} fontSize={size === "big" ? 11.5 : 8} fill={x.status === "red" || x.status === "orange" ? INK[x.status] : "#94a3b8"}>
                  {x.feeds ? `feeds step ${x.feeds}` : "feeds the line"}{size === "big" ? ` · ${x.status === "red" ? "BREAKDOWN" : x.status === "orange" ? `${x.defects} defects` : x.status === "idle" ? "not running" : `${num(x.pieces)}/${num(x.target)}`}` : ""}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
