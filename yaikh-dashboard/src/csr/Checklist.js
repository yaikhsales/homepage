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
import { useView, num, pct, Chip, Status, Panel, Bar, Select, Tabs, Table, Clip, Summary, Screen } from "./csr";
import Checklist6S from "../digital-audit/checklist-6s";
import ModuleFrame from "../components/ModuleFrame";

const TABS = [["daily", "Daily checklist"], ["8s", "8S inspection"], ["6s", "6S checklist"]];

const Daily = () => {
  const [f, setF] = useState({ area: "", category: "", result: "" });
  const { d, error, loading, reload } = useView({ view: "daily-checklist", area: f.area || undefined, category: f.category || undefined, result: f.result || undefined });
  const areas = (d.tables || []).find((t) => t.key === "areas");
  const weekly = (d.tables || []).find((t) => t.key === "weekly");
  const kpi = d.kpi || {};
  return (
    <>
      <div className="grid gap-3 xl:grid-cols-[1fr,22rem] items-start mb-3">
        {areas && <Panel title={areas.title} right="month to date · click an area to see its checks">
          <Table columns={areas.columns} rows={areas.rows} max={420} loading={loading} error={error} onRetry={reload} weights={{ rank: 0.6, area: 2.2, owner_role: 2.2, submissions: 1, passed: 0.9, failed: 0.8, pass_rate: 1.6, penalty: 1.4 }} onRow={(r) => setF({ ...f, area: f.area === r.area ? "" : r.area })} render={{
            rank: (v) => <span className={`font-black tabular-nums ${v <= 3 ? "text-amber-300" : "text-slate-400"}`}>{v}</span>,
            area: (v, r) => <Clip v={`${v} · ${r.location}`} cls={`font-bold ${f.area === v ? "text-sky-300" : "text-white"}`} />,
            owner_role: (v, r) => <Clip v={`${v} ${r.owner_emp || ""}`} />,
            pass_rate: (v) => <div><span className="tabular-nums text-white text-xs">{pct(v)}</span><Bar v={v} h={4} /></div>,
            penalty: (v) => v ? <Chip tone="red">{typeof v === "string" ? v : "penalty"}</Chip> : <Chip tone="green">none</Chip>,
          }} />
        </Panel>}
        <div className="space-y-3">
          <Panel title={`Global factory KPI — ${kpi.month || ""}`}>
            <div className="flex items-end gap-3"><div className="text-3xl font-black text-white tabular-nums">{pct(kpi.global_pct)}</div><div className="text-[11px] text-slate-400 pb-1">last month {pct(kpi.last_month_pct)} · <span className={kpi.change >= 0 ? "text-emerald-300" : "text-rose-300"}>{kpi.change >= 0 ? "+" : ""}{num(kpi.change, 1)}</span></div></div>
            <div className="mt-2"><Bar v={kpi.global_pct} h={8} /></div>
            {(kpi.podium || []).length > 0 && <div className="mt-3 space-y-1">{kpi.podium.slice(0, 3).map((p, i) => <div key={p.area} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-1"><Trophy size={14} className={["text-amber-300", "text-slate-300", "text-amber-600"][i]} /><div className="flex-1 min-w-0"><div className="text-xs font-bold text-white truncate">{p.area} <span className="text-slate-500 font-normal">{p.location}</span></div><div className="text-[10px] text-slate-500 truncate">{p.owner_role} {p.owner_emp}</div></div><div className="text-right"><div className="text-xs font-black tabular-nums text-white">{pct(p.kpi_pct)}</div><div className={`text-[10px] tabular-nums ${p.change >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{p.change >= 0 ? "+" : ""}{num(p.change, 1)}</div></div></div>)}</div>}
          </Panel>
          {weekly && <Panel title={weekly.title}><Table columns={weekly.columns} rows={weekly.rows} max={220} dense loading={loading} error={error} onRetry={reload} render={{ pass_rate: (v) => <span className="tabular-nums">{pct(v)}</span> }} /></Panel>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select label="Area" value={f.area} onChange={(v) => setF({ ...f, area: v })} options={(d.filters || {}).area} />
        <Select label="Category" value={f.category} onChange={(v) => setF({ ...f, category: v })} options={(d.filters || {}).category} />
        <Select label="Result" value={f.result} onChange={(v) => setF({ ...f, result: v })} options={(d.filters || {}).result || ["pass", "fail"]} />
        {(f.area || f.category || f.result) && <button onClick={() => setF({ area: "", category: "", result: "" })} className="text-[11px] text-sky-300 hover:underline">clear filters</button>}
        <span className="ml-auto text-xs text-slate-500">{loading ? "loading…" : `today's checks · ${(d.rows || []).length}`}</span>
      </div>
      <Table columns={d.columns} rows={d.rows} max={480} loading={loading} error={error} onRetry={reload} empty="No checks match." expand keys={["area", "category", "checkpoint", "result", "photo", "remark", "time"]} weights={{ area: 2, category: 1.3, checkpoint: 2, result: 0.9, photo: 0.6, remark: 3, time: 0.7 }} render={{
        result: (v) => <Status s={v} />,
        photo: (v) => v ? <Camera size={13} className="text-sky-300" /> : <span className="text-slate-600">—</span>,
        area: (v, r) => <Clip v={`${v} · ${r.location}`} cls="font-bold text-white" />,
        remark: (v) => <Clip v={v} cls="text-slate-400" />,
      }} />
    </>
  );
};

const EightS = () => {
  const [f, setF] = useState({ factory: "", status: "" });
  const { d, error, loading, reload } = useView({ view: "8s", factory: f.factory || undefined, status: f.status || undefined });
  const crit = d.criteria || [];
  // the thresholds come from the view (a thresholds key, else the ones it states in its subtitle)
  const th = d.thresholds || {};
  const m1 = /Passed\s*[≥>=]+\s*([\d.]+)/i.exec(d.subtitle || ""), m2 = /Fixing\s*<\s*([\d.]+)/i.exec(d.subtitle || "");
  const PASS = Number(th.passed ?? th.pass ?? (m1 && m1[1])) || null, FIX = Number(th.fixing ?? th.fix ?? (m2 && m2[1])) || null;
  const wk = (w) => (w === null || w === undefined ? <span className="text-slate-600">—</span> : <span className={`tabular-nums font-bold ${PASS !== null && w >= PASS ? "text-emerald-300" : FIX !== null && w >= FIX ? "text-amber-300" : PASS === null ? "text-white" : "text-rose-300"}`}>{w}</span>);
  const history = (d.tables || []).find((t) => t.key === "history");
  return (
    <>
      <div className="mb-2"><Summary items={d.summary} info={d.subtitle} /></div>
      <div className="grid gap-3 md:grid-cols-[1fr,1fr,1.2fr] mb-3">
        <Panel title="Scoring — 5 criteria, 8 points each (/40)"><div className="flex flex-wrap gap-1.5">{crit.map((c) => <Chip key={c.key} tone="grey">{c.label} /{c.max}</Chip>)}</div><div className="mt-2 text-xs text-slate-400 flex flex-wrap items-center gap-1.5">{["Passed", "Acceptable", "Fixing", "Pending"].map((k) => <Chip key={k} tone={k === "Passed" ? "green" : k === "Acceptable" ? "amber" : k === "Fixing" ? "red" : "grey"} onClick={() => setF({ ...f, status: f.status === k ? "" : k })} on={f.status === k}>{k}{k === "Passed" && PASS !== null ? ` ≥ ${PASS}` : k === "Acceptable" && PASS !== null && FIX !== null ? ` ${FIX}–${PASS - 0.1 > FIX ? (PASS - 0.1).toFixed(1).replace(/\.0$/, "") : FIX}` : k === "Fixing" && FIX !== null ? ` < ${FIX}` : k === "Pending" ? " · not yet scored" : ""}</Chip>)}</div></Panel>
        <Panel title={`Weekly completion — ${d.month || ""}`}>{(d.weekly_completion || []).map((w) => <div key={w.week} className="flex items-center gap-2 text-[11px] mb-1"><span className="w-7 font-bold text-white">{w.week}</span><div className="flex-1"><Bar v={w.completion_pct} /></div><span className="w-24 text-right tabular-nums text-slate-400">{num(w.evaluated)}/{num(w.locations)} · {w.avg_40 === null ? "—" : num(w.avg_40, 1)}</span></div>)}</Panel>
        {history && <Panel title={history.title || "Month history"}><Table columns={history.columns} rows={history.rows} max={200} dense loading={loading} error={error} onRetry={reload} weights={{ month: 1.1, inspector: 1.4, weekly_progress: 1.8, avg_40: 0.9, passed: 0.9, pass_rate: 1 }} render={{ pass_rate: (v) => <span className="tabular-nums">{pct(v)}</span>, avg_40: (v) => <span className="tabular-nums">{num(v, 1)}</span> }} /></Panel>}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select label="Factory" value={f.factory} onChange={(v) => setF({ ...f, factory: v })} options={(d.filters || {}).factory} />
        <Select label="Status" value={f.status} onChange={(v) => setF({ ...f, status: v })} options={(d.filters || {}).status} />
        <span className="ml-auto text-xs text-slate-500">{loading ? "loading…" : `${(d.rows || []).length} locations · click a row for the root cause and the weekly scores`}</span>
      </div>
      <Table columns={d.columns} rows={d.rows} max={560} loading={loading} error={error} onRetry={reload} empty="No locations match." expand keys={["location", "factory", "group", "w1", "w2", "w3", "w4", "monthly_avg_40", "status", "responsible", "before_photo", "after_photo"]} weights={{ location: 1.3, factory: 0.9, group: 1.4, w1: 0.6, w2: 0.6, w3: 0.6, w4: 0.6, monthly_avg_40: 1, status: 1.3, responsible: 2.6, before_photo: 0.8, after_photo: 0.8 }} render={{
        location: (v) => <span className="font-bold text-white">{v}</span>,
        w1: wk, w2: wk, w3: wk, w4: wk,
        monthly_avg_40: (v) => <span className="tabular-nums font-black text-white">{num(v, 1)}</span>,
        status: (v) => <Status s={v} />,
        responsible: (v, r) => <Clip v={`${v} ${r.responsible_emp || ""} · ${r.supervisor || ""}`} />,
        before_photo: (v) => v ? <Camera size={13} className="text-sky-300" /> : <span className="text-slate-600">—</span>,
        after_photo: (v) => v ? <Camera size={13} className="text-emerald-300" /> : <span className="text-slate-600">—</span>,
        root_cause: (v) => <Clip v={v} cls="text-slate-400" />,
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
    <Screen onBack={onBack} heading="Checklist" sub={tab === "daily" ? head.d.subtitle : undefined} summary={tab === "daily" ? head.d.summary : undefined} loading={head.loading} error={head.error} onReload={head.reload}>
      <div className="flex flex-wrap items-center gap-2 mb-3"><Tabs tabs={TABS} value={tab} onChange={setTab} /></div>
      {tab === "daily" && <Daily />}
      {tab === "8s" && <EightS />}
    </Screen>
  );
};

export default Checklist;
