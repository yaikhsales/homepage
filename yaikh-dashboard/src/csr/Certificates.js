// CSR · Compliance Certificates — licences, permits and test reports on file. Status is computed from the
// expiry date: Valid · Expiring (≤ 90 days) · Expired · No expiry date. Filters by status / issuer /
// audit type; the responsible is a role code + YAI id. Data: csr view certificates.
import React, { useState } from "react";
import { useView, num, Chip, Status, Panel, Tile, Select, Table, Screen } from "./csr";

const Certificates = ({ onBack }) => {
  const [f, setF] = useState({ status: "", issuer: "", audit_type: "" });
  const { d, error, loading, reload } = useView({ view: "certificates", status: f.status || undefined, issuer: f.issuer || undefined, audit_type: f.audit_type || undefined });
  const sc = d.status_counts || {};
  const tiles = [["valid", "Valid", "text-emerald-300"], ["expiring", "Expiring ≤ 90 days", "text-amber-300"], ["expired", "Expired", "text-rose-300"], ["no expiry", "Without expiry date", "text-slate-300"]];
  const rows = d.rows || [];
  return (
    <Screen onBack={onBack} heading="Compliance Certificates" sub={d.subtitle} summary={d.summary} loading={loading} error={error} onReload={reload}>
      <div className="flex flex-wrap gap-2 mb-3">
        {tiles.map(([k, l, tone]) => <Tile key={k} label={l} value={num(sc[k === "no expiry" ? "no_expiry" : k])} tone={tone} onClick={() => setF({ ...f, status: f.status === k ? "" : k })} on={f.status === k} />)}
        <Tile label="Total on file" value={num(sc.total)} />
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Select label="Issuer" value={f.issuer} onChange={(v) => setF({ ...f, issuer: v })} options={(d.filters || {}).issuer || d.issuers} />
        <Select label="Audit type" value={f.audit_type} onChange={(v) => setF({ ...f, audit_type: v })} options={(d.filters || {}).audit_type} />
        {(f.status || f.issuer || f.audit_type) && <button onClick={() => setF({ status: "", issuer: "", audit_type: "" })} className="text-[11px] text-sky-300 hover:underline">clear filters</button>}
        <span className="ml-auto text-[11px] text-slate-500">{loading ? "loading…" : `${rows.length} certificate${rows.length === 1 ? "" : "s"}`}</span>
      </div>
      <Table columns={d.columns} rows={rows} max={640} empty={loading ? "Loading…" : "No certificates match."} render={{
        id: (v) => <span className="font-bold text-white whitespace-nowrap">{v}</span>,
        type: (v, r) => <div><div className="font-bold text-white">{v}</div><div className="text-[10px] text-slate-500">{r.audit_type}</div></div>,
        issuer: (v, r) => <div>{v}<div className="text-[10px] text-slate-500">{r.issuer_type}</div></div>,
        days_to_expiry: (v, r) => r.status === "no expiry" ? <span className="text-slate-600">—</span> : <span className={`tabular-nums font-bold ${v < 0 ? "text-rose-300" : v <= 90 ? "text-amber-300" : "text-emerald-300"}`}>{v < 0 ? `${num(-v)} days ago` : `in ${num(v)} days`}</span>,
        status: (v) => <Status s={v} />,
        responsible: (v, r) => <span>{v} <span className="text-sky-300">{r.responsible_emp}</span></span>,
        comment: (v) => <span className="text-slate-400">{v || ""}</span>,
        validity_years: (v) => <span className="tabular-nums">{v === null || v === undefined ? "—" : v >= 1 ? `${num(v, 1)} y` : `${Math.round(v * 12)} mo`}</span>,
      }} />
      <Panel title="How the status is computed" className="mt-3">
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-400"><Chip tone="green">valid</Chip> expiry more than 90 days away <Chip tone="amber">expiring</Chip> expiry within 90 days — renewal to file <Chip tone="red">expired</Chip> expiry date passed <Chip tone="grey">no expiry</Chip> permanent registration</div>
      </Panel>
    </Screen>
  );
};

export default Certificates;
