// CSR · Chemical — two tabs behind the Chemical tile:
//   • Inventory: every chemical that touches the product or the plant — eco-passport and SDS on file,
//     stock against par, issued this month, the vendor's qualification (csr view chemical)
//   • Audit history: deliveries (add, PO-…) and issues to the departments (issue, IS-…) with the running
//     balance, filter by chemical and period; the balance by chemical ties to the in-stock figure
//     (csr view chemical-history)
import React, { useState } from "react";
import { useView, num, Chip, Status, Panel, Bar, Select, Tabs, Table, Clip, Summary, Screen } from "./csr";

const Inventory = () => {
  const { d, error, loading, reload } = useView({ view: "chemical" });
  return (
    <>
      <div className="mb-2"><Summary items={d.summary} info={d.subtitle} /></div>
      <Table columns={d.columns} rows={d.rows} max={620} loading={loading} error={error} onRetry={reload} expand labels={{ eco_passport: "Eco-passport", sds: "SDS", in_stock: "In stock", issued_month: "Issued (month)", vendor_status: "Vendor status" }} widths={{ item: "16rem", used_for: "12rem", vendor: "14rem" }} render={{
        item: (v) => <Clip v={v} cls="font-bold text-white" />,
        eco_passport: (v) => <Chip tone={/yes/i.test(v) ? "green" : /n\/a/i.test(v) ? "grey" : "red"}>{v}</Chip>,
        sds: (v) => <Chip tone={/on file/i.test(v) ? "green" : "red"}>{v}</Chip>,
        in_stock: (v, r) => <div className="min-w-[6rem]"><span className="tabular-nums font-bold text-white">{num(v, 1)}</span><span className="text-slate-500 text-xs"> / par {num(r.par)}</span><Bar v={r.par ? (v / r.par) * 100 : 0} h={3} tone={r.par && v < r.par * 0.3 ? "bg-rose-400" : "bg-sky-400"} /></div>,
        vendor_status: (v) => <Chip tone={/qualified/i.test(v) && !/not|under/i.test(v) ? "green" : "amber"}>{v}</Chip>,
        status: (v) => <Status s={v} />,
      }} />
    </>
  );
};

const History = () => {
  const [f, setF] = useState({ item: "", from: "", to: "", kind: "" });
  const { d, error, loading, reload } = useView({ view: "chemical-history", item: f.item || undefined, from: f.from || undefined, to: f.to || undefined });
  const rows = (d.rows || []).filter((r) => !f.kind || r.kind === f.kind);
  const items = (d.tables || []).find((t) => t.key === "items");
  return (
    <>
      <div className="mb-2"><Summary items={d.summary} info={d.subtitle} /></div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Select label="Chemical" value={f.item} onChange={(v) => setF({ ...f, item: v })} options={(d.filters || {}).item} />
        <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden text-xs">{[["", "All"], ["add", "Add stock"], ["issue", "Issues"]].map(([k, l]) => <button key={k} onClick={() => setF({ ...f, kind: k })} className={`px-2.5 py-1 font-bold ${f.kind === k ? "bg-white text-slate-900" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{l}</button>)}</div>
        <label className="inline-flex items-center gap-1 text-xs text-slate-400">From <input type="date" value={f.from || d.from || ""} onChange={(e) => setF({ ...f, from: e.target.value })} className="bg-slate-800 border border-slate-700 rounded-md px-1.5 py-1 text-xs text-white" /></label>
        <label className="inline-flex items-center gap-1 text-xs text-slate-400">To <input type="date" value={f.to || d.to || ""} onChange={(e) => setF({ ...f, to: e.target.value })} className="bg-slate-800 border border-slate-700 rounded-md px-1.5 py-1 text-xs text-white" /></label>
        <span className="ml-auto text-xs text-slate-500">{loading ? "loading…" : `${rows.length} movements`}</span>
      </div>
      {items && <Panel title={items.title} className="mb-3"><Table columns={items.columns} rows={items.rows} max={300} dense loading={loading} error={error} onRetry={reload} onRow={(r) => setF({ ...f, item: f.item === r.item ? "" : r.item })} widths={{ item: "18rem" }} render={{ item: (v) => <span className={`font-bold ${v === f.item ? "text-sky-300" : "text-white"}`}>{v}</span>, closing: (v, r) => <span className={`tabular-nums font-bold ${r.ties === false ? "text-rose-300" : "text-white"}`}>{num(v, 1)}{r.ties === false ? " ≠" : ""}</span>, in_stock_now: (v) => <span className="tabular-nums">{num(v, 1)}</span> }} /></Panel>}
      <Table columns={d.columns} rows={rows} max={520} loading={loading} error={error} onRetry={reload} empty="No movements match." labels={{ by_role: "By", ref: "Reference" }} widths={{ item: "16rem", by_role: "13rem" }} render={{
        item: (v) => <Clip v={v} cls="text-white" />,
        kind: (v) => <Chip tone={v === "add" ? "green" : "sky"}>{v === "add" ? "add stock" : "issue"}</Chip>,
        qty: (v, r) => <span className={`tabular-nums font-bold ${r.kind === "add" ? "text-emerald-300" : "text-white"}`}>{r.kind === "add" ? "+" : "−"}{num(v, 2)}</span>,
        balance: (v) => <span className="tabular-nums">{num(v, 1)}</span>,
        by_role: (v, r) => <Clip v={`${v} ${r.by_emp || ""}`} />,
      }} />
    </>
  );
};

const Chemical = ({ onBack }) => {
  const [tab, setTab] = useState("inventory");
  const head = useView({ view: "chemical" });
  return (
    <Screen onBack={onBack} heading="Chemicals" summary={tab === "inventory" ? head.d.summary : undefined} loading={head.loading} error={head.error} onReload={head.reload}>
      <div className="flex flex-wrap items-center gap-2 mb-3"><Tabs tabs={[["inventory", "Inventory"], ["history", "Audit history — add stock / issues"]]} value={tab} onChange={setTab} /></div>
      {tab === "inventory" && <Inventory />}
      {tab === "history" && <History />}
    </Screen>
  );
};

export default Chemical;
