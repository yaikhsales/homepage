// CSR · Energy → Solar dashboard — the rooftop solar of the simulated unit, from the M1's `energy` view
// (one row per day of the month: total / grid / solar kWh, solar share, cost, metered or projected).
// Capacity and tariffs are read from the view's subtitle; CO₂ avoided uses a stated factor. No live
// inverter telemetry exists in the data, so nothing "live" is invented. Data: csr view energy.
import React, { useMemo } from "react";
import { Sun, Zap, Leaf, CalendarDays } from "lucide-react";
import { useView, num, pct, Chip, Panel, Table, Summary, Screen } from "../csr/csr";

const CO2_KG_PER_KWH = 0.55; // stated assumption for the avoided-emissions figure

// stacked day bars: solar (amber) on grid (sky); projected days hatched lighter
const Bars = ({ rows }) => {
  const W = 760, H = 190, P = 8, AX = 16, n = rows.length || 1, bw = (W - 2 * P) / n;
  const top = Math.max(1, ...rows.map((r) => Number(r.kwh) || 0));
  const Y = (v) => H - P - AX - (v / top) * (H - 2 * P - AX - 4);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 190 }}>
      {rows.map((r, i) => {
        const x = P + i * bw + 1, w = Math.max(2, bw - 2), g = Number(r.grid) || 0, s = Number(r.solar) || 0;
        const proj = r.basis !== "metered";
        return (
          <g key={r.date} opacity={proj ? 0.45 : 1}>
            <title>{`${r.date} · ${num(r.kwh)} kWh · solar ${num(s)} (${pct(r.solar_pct)}) · grid ${num(g)} · ${r.basis}`}</title>
            <rect x={x} y={Y(g + s)} width={w} height={Math.max(0, Y(g) - Y(g + s))} fill="#fbbf24" />
            <rect x={x} y={Y(g)} width={w} height={Math.max(0, H - P - AX - Y(g))} fill="#38bdf8" />
            {(i === 0 || i === n - 1 || (i + 1) % 5 === 0) && <text x={x + w / 2} y={H - P + 2} textAnchor="middle" fontSize={10} fill="#94a3b8">{i + 1}</text>}
          </g>
        );
      })}
    </svg>
  );
};

const SolarDashboard = ({ onBack }) => {
  const { d, error, loading, reload } = useView({ view: "energy" });
  const rows = d.rows || [];
  const sub = String(d.subtitle || "");
  const capacity = (sub.match(/\(([\d,.]+)\s*kWp\)/) || [])[1];
  const gridTariff = Number((sub.match(/grid USD ([\d.]+)/) || [])[1]) || null;
  const solarTariff = Number((sub.match(/solar USD ([\d.]+)/) || [])[1]) || null;
  const m = useMemo(() => {
    const metered = rows.filter((r) => r.basis === "metered");
    const sum = (list, k) => list.reduce((t, r) => t + (Number(r[k]) || 0), 0);
    const today = metered[metered.length - 1];
    const solarToDate = sum(metered, "solar"), kwhToDate = sum(metered, "kwh");
    const solarMonth = sum(rows, "solar"), kwhMonth = sum(rows, "kwh");
    const best = metered.reduce((a, r) => (!a || Number(r.solar) > Number(a.solar) ? r : a), null);
    return { metered, today, solarToDate, kwhToDate, solarMonth, kwhMonth, best, shareToDate: kwhToDate ? (solarToDate / kwhToDate) * 100 : 0, shareMonth: kwhMonth ? (solarMonth / kwhMonth) * 100 : 0 };
  }, [rows]);
  const saving = gridTariff && solarTariff ? m.solarToDate * (gridTariff - solarTariff) : null;
  const summary = [
    { label: "Capacity", value: capacity ? `${capacity} kWp` : "—" },
    { label: m.today ? `Last metered day (${String(m.today.date).slice(0, 6).trim()})` : "Last metered day", value: m.today ? `${num(m.today.solar)} kWh · ${pct(m.today.solar_pct)}` : "—" },
    { label: "Solar to date", value: `${num(m.solarToDate)} kWh · ${pct(m.shareToDate)}` },
    { label: "Projected month", value: `${num(m.solarMonth)} kWh · ${pct(m.shareMonth)}` },
    { label: "Days metered", value: m.metered.length },
  ];
  return (
    <Screen onBack={onBack} heading="Solar dashboard" sub={d.subtitle} summary={summary} loading={loading} error={error} onReload={reload}>
      <div className="grid gap-3 lg:grid-cols-[1fr,20rem] items-start mb-3">
        <Panel title={`Solar on grid — every day of the month`} right={<span><Chip tone="amber">solar</Chip> <Chip tone="sky">grid</Chip> <span className="ml-1">faded = projected</span></span>}>
          {rows.length ? <Bars rows={rows} /> : <div className="text-sm text-slate-400 p-3">{error ? <span className="text-amber-200">{error}</span> : loading ? "Loading…" : "No days."}</div>}
        </Panel>
        <div className="grid gap-3">
          <Panel title="What the solar is worth" info="Saving = solar kWh to date × (grid tariff − solar tariff), tariffs from the view. CO₂ avoided = solar kWh × 0.55 kg/kWh, a stated factor, not a measurement.">
            <div className="space-y-1.5 text-sm text-slate-300">
              <div className="flex items-center gap-2"><Zap size={14} className="text-amber-300" /><span>Tariffs</span><b className="ml-auto text-white tabular-nums">{gridTariff ? `grid ${gridTariff} · solar ${solarTariff} USD/kWh` : "—"}</b></div>
              <div className="flex items-center gap-2"><Sun size={14} className="text-amber-300" /><span>Saving to date</span><b className="ml-auto text-white tabular-nums">{saving === null ? "—" : `USD ${num(saving)}`}</b></div>
              <div className="flex items-center gap-2"><Leaf size={14} className="text-emerald-300" /><span>CO₂ avoided to date</span><b className="ml-auto text-white tabular-nums">{num((m.solarToDate * CO2_KG_PER_KWH) / 1000, 1)} t</b></div>
              <div className="flex items-center gap-2"><CalendarDays size={14} className="text-sky-300" /><span>Best day</span><b className="ml-auto text-white tabular-nums">{m.best ? `${m.best.date} · ${num(m.best.solar)} kWh` : "—"}</b></div>
            </div>
          </Panel>
          <Panel title="Month figures"><Summary items={(d.summary || []).filter((x) => /solar|kWh/i.test(x.label))} /></Panel>
        </div>
      </div>
      <Table columns={d.columns} rows={rows} max={520} loading={loading} error={error} onRetry={reload} labels={{ solar_pct: "Solar %", cost: "Cost (USD)" }} render={{
        date: (v, r) => <span className={r.basis === "metered" ? "font-bold text-white" : "text-slate-400"}>{v}</span>,
        solar: (v) => <span className="tabular-nums font-bold text-amber-300">{num(v)}</span>,
        solar_pct: (v) => <span className="tabular-nums">{pct(v)}</span>,
        basis: (v) => <Chip tone={v === "metered" ? "green" : "grey"}>{v}</Chip>,
      }} />
    </Screen>
  );
};

export default SolarDashboard;
