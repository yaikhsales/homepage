// CSR · Checklist — three tabs inside the Checklist 6s card:
//   • Daily checklist: the area supervisors' daily walk — pass / fail per checkpoint with photo and remark,
//     the areas' month-to-date pass rate with penalty badge and rank, the weekly W1–W4 table and the
//     factory KPI with its podium
//   • 8S inspection: the monthly 8S round — every line / location scored on the 5 criteria (/40) in four
//     weekly windows, monthly average, Passed / Acceptable / Fixing / Pending, root cause, responsible,
//     before / after photos, weekly completion and the month history
//   • 6S checklist: the existing 6S screen, unchanged
// Data: csr views daily-checklist, 8s.
import React, { useState } from "react";
import { Camera, Trophy } from "lucide-react";
import { useView, num, pct, Chip, Status, Panel, Tile, Bar, Select, Tabs, Table, Screen } from "./csr";
import Checklist6S from "../digital-audit/checklist-6s";
import ModuleFrame from "../components/ModuleFrame";

const TABS = [["daily", "Daily checklist"], ["8s", "8S inspection"], ["6s", "6S checklist"]];

const Daily = () => {
  const [f, setF] = useState({ area: "", category: "", result: "" });
  const { d, error, loading } = useView({ view: "daily-checklist", area: f.area || undefined, category: f.category || undefined, result: f.result || undefined });
  const areas = (d.tables || []).find((t) => t.key === "areas");
  const weekly = (d.tables || []).find((t) => t.key === "weekly");
  const kpi = d.kpi || {};
  return (
    <>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}
      <p className="text-[11px] text-slate-500 mb-2">{d.subtitle}</p>
      <div className="flex flex-wrap gap-2 mb-3">{(d.summary || []).map((x) => <Tile key={x.label} label={x.label} value={typeof x.value === "number" ? num(x.value) : x.value} tone={/failed|penalty/i.test(x.label) && x.value ? "text-rose-300" : undefined} />)}</div>
      <div className="grid gap-3 xl:grid-cols-[1fr,22rem] items-start mb-3">
        {areas && <Panel title={areas.title} right="month to date · click an area to see its checks">
          <Table columns={areas.columns} rows={areas.rows} max={420} onRow={(r) => setF({ ...f, area: f.area === r.area ? "" : r.area })} render={{
            rank: (v) => <span className={`font-black tabular-nums ${v <= 3 ? "text-amber-300" : "text-slate-400"}`}>{v}</span>,
            area: (v, r) => <div><div className={`font-bold ${f.area === v ? "text-sky-300" : "text-white"}`}>{v}</div><div className="text-[10px] text-slate-500">{r.location}</div></div>,
            owner_role: (v, r) => <span>{v} <span className="text-sky-300">{r.owner_emp}</span></span>,
            pass_rate: (v) => <div className="min-w-[7rem]"><div className="flex justify-between text-[10px]"><span className="tabular-nums text-white">{pct(v)}</span></div><Bar v={v} /></div>,
            penalty: (v) => v ? <Chip tone="red">{typeof v === "string" ? v : "penalty"}</Chip> : <Chip tone="green">none</Chip>,
          }} />
        </Panel>}
        <div className="space-y-3">
          <Panel title={`Global factory KPI — ${kpi.month || ""}`}>
            <div className="flex items-end gap-3"><div className="text-3xl font-black text-white tabular-nums">{pct(kpi.global_pct)}</div><div className="text-[11px] text-slate-400 pb-1">last month {pct(kpi.last_month_pct)} · <span className={kpi.change >= 0 ? "text-emerald-300" : "text-rose-300"}>{kpi.change >= 0 ? "+" : ""}{num(kpi.change, 1)}</span></div></div>
            <div className="mt-2"><Bar v={kpi.global_pct} h={8} /></div>
            {(kpi.podium || []).length > 0 && <div className="mt-3 space-y-1">{kpi.podium.slice(0, 3).map((p, i) => <div key={p.area} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-1"><Trophy size={14} className={["text-amber-300", "text-slate-300", "text-amber-600"][i]} /><div className="flex-1 min-w-0"><div className="text-xs font-bold text-white truncate">{p.area} <span className="text-slate-500 font-normal">{p.location}</span></div><div className="text-[10px] text-slate-500 truncate">{p.owner_role} {p.owner_emp}</div></div><div className="text-right"><div className="text-xs font-black tabular-nums text-white">{pct(p.kpi_pct)}</div><div className={`text-[10px] tabular-nums ${p.change >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{p.change >= 0 ? "+" : ""}{num(p.change, 1)}</div></div></div>)}</div>}
          </Panel>
          {weekly && <Panel title={weekly.title}><Table columns={weekly.columns} rows={weekly.rows} max={220} render={{ pass_rate: (v) => <span className="tabular-nums">{pct(v)}</span> }} /></Panel>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select label="Area" value={f.area} onChange={(v) => setF({ ...f, area: v })} options={(d.filters || {}).area} />
        <Select label="Category" value={f.category} onChange={(v) => setF({ ...f, category: v })} options={(d.filters || {}).category} />
        <Select label="Result" value={f.result} onChange={(v) => setF({ ...f, result: v })} options={(d.filters || {}).result || ["pass", "fail"]} />
        {(f.area || f.category || f.result) && <button onClick={() => setF({ area: "", category: "", result: "" })} className="text-[11px] text-sky-300 hover:underline">clear filters</button>}
        <span className="ml-auto text-[11px] text-slate-500">{loading ? "loading…" : `today's checks · ${(d.rows || []).length}`}</span>
      </div>
      <Table columns={d.columns} rows={d.rows} max={480} render={{
        result: (v) => <Status s={v} />,
        photo: (v) => v ? <Camera size={13} className="text-sky-300" /> : <span className="text-slate-600">—</span>,
        area: (v, r) => <span className="font-bold text-white">{v} <span className="text-slate-500 font-normal">{r.location}</span></span>,
        remark: (v) => <span className="text-slate-400">{v || ""}</span>,
      }} />
    </>
  );
};

const EightS = () => {
  const [f, setF] = useState({ factory: "", status: "" });
  const { d, error, loading } = useView({ view: "8s", factory: f.factory || undefined, status: f.status || undefined });
  const crit = d.criteria || [];
  const wk = (w) => (w === null || w === undefined ? <span className="text-slate-600">—</span> : <span className={`tabular-nums font-bold ${w >= 32 ? "text-emerald-300" : w >= 28 ? "text-amber-300" : "text-rose-300"}`}>{w}</span>);
  const history = (d.tables || []).find((t) => t.key === "history");
  return (
    <>
      {error && <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 px-3 py-2 text-sm">{error}</div>}
      <p className="text-[11px] text-slate-500 mb-2">{d.subtitle}</p>
      <div className="flex flex-wrap gap-2 mb-3">{(d.summary || []).map((x) => <Tile key={x.label} label={x.label} value={typeof x.value === "number" ? num(x.value, 1) : x.value} tone={/fixing/i.test(x.label) && x.value ? "text-rose-300" : /passed/i.test(x.label) ? "text-emerald-300" : undefined} onClick={/^(Passed|Acceptable|Fixing|Pending)$/.test(x.label) ? () => setF({ ...f, status: f.status === x.label ? "" : x.label }) : undefined} on={f.status === x.label} />)}</div>
      <div className="grid gap-3 md:grid-cols-[1fr,1fr,1.2fr] mb-3">
        <Panel title="Scoring — 5 criteria, 8 points each (/40)"><div className="flex flex-wrap gap-1.5">{crit.map((c) => <Chip key={c.key} tone="grey">{c.label} /{c.max}</Chip>)}</div><div className="mt-2 text-[11px] text-slate-400"><Chip tone="green">Passed</Chip> ≥ 32 · <Chip tone="amber">Acceptable</Chip> 28–31 · <Chip tone="red">Fixing</Chip> &lt; 28 · <Chip tone="grey">Pending</Chip> not yet scored</div></Panel>
        <Panel title={`Weekly completion — ${d.month || ""}`}>{(d.weekly_completion || []).map((w) => <div key={w.week} className="flex items-center gap-2 text-[11px] mb-1"><span className="w-7 font-bold text-white">{w.week}</span><div className="flex-1"><Bar v={w.completion_pct} /></div><span className="w-24 text-right tabular-nums text-slate-400">{num(w.evaluated)}/{num(w.locations)} · {w.avg_40 === null ? "—" : num(w.avg_40, 1)}</span></div>)}</Panel>
        {history && <Panel title={history.title || "Month history"}><Table columns={history.columns} rows={history.rows} max={200} render={{ pass_rate: (v) => <span className="tabular-nums">{pct(v)}</span>, avg_40: (v) => <span className="tabular-nums">{num(v, 1)}</span> }} /></Panel>}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select label="Factory" value={f.factory} onChange={(v) => setF({ ...f, factory: v })} options={(d.filters || {}).factory} />
        <Select label="Status" value={f.status} onChange={(v) => setF({ ...f, status: v })} options={(d.filters || {}).status} />
        <span className="ml-auto text-[11px] text-slate-500">{loading ? "loading…" : `${(d.rows || []).length} locations`}</span>
      </div>
      <Table columns={d.columns} rows={d.rows} max={560} render={{
        group: (v, r) => <span className="font-bold text-white">{r.location}<div className="text-[10px] text-slate-500 font-normal">{v} · {r.factory}</div></span>,
        location: () => null, factory: () => null,
        w1: wk, w2: wk, w3: wk, w4: wk,
        monthly_avg_40: (v) => <span className="tabular-nums font-black text-white">{num(v, 1)}</span>,
        status: (v) => <Status s={v} />,
        responsible: (v, r) => <span>{v} <span className="text-sky-300">{r.responsible_emp}</span><div className="text-[10px] text-slate-500">{r.supervisor}</div></span>,
        before_photo: (v) => v ? <Camera size={13} className="text-sky-300" /> : <span className="text-slate-600">—</span>,
        after_photo: (v) => v ? <Camera size={13} className="text-emerald-300" /> : <span className="text-slate-600">—</span>,
        root_cause: (v) => <span className="text-slate-400">{v || ""}</span>,
      }} />
    </>
  );
};

const Checklist = ({ onBack }) => {
  const [tab, setTab] = useState("daily");
  const head = useView({ view: "daily-checklist" });
  // the legacy 6S screen keeps its own full-screen layout: ModuleFrame puts it below the nav, the tab bar sits above it
  if (tab === "6s") return (
    <ModuleFrame>
      <div className="bg-slate-900 px-3 pt-2 pb-2 flex items-center gap-2"><Tabs tabs={TABS} value={tab} onChange={setTab} /><span className="text-[11px] text-slate-500">the 6S audit screen, unchanged</span></div>
      <Checklist6S onBack={onBack} />
    </ModuleFrame>
  );
  return (
    <Screen onBack={onBack} heading="Checklist" summary={tab === "daily" ? head.d.summary : undefined} loading={head.loading} onReload={head.reload}>
      <div className="flex flex-wrap items-center gap-2 mb-3"><Tabs tabs={TABS} value={tab} onChange={setTab} /></div>
      {tab === "daily" && <Daily />}
      {tab === "8s" && <EightS />}
    </Screen>
  );
};

export default Checklist;
