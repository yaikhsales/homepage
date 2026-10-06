// CSR · Compliance Certificates — licences, permits and test reports on file. Status is computed from the
// expiry date: Valid · Expiring (≤ 90 days) · Expired · No expiry date. Filters by status / issuer /
// audit type; the responsible is a role code + YAI id. Data: csr view certificates.
import React, { useState } from "react";
import { useView, num, Chip, Status, Select, Table, Clip, Screen } from "./csr";

const Certificates = ({ onBack }) => {
  const [f, setF] = useState({ status: "", issuer: "", audit_type: "" });
  const { d, error, loading, reload } = useView({ view: "certificates", status: f.status || undefined, issuer: f.issuer || undefined, audit_type: f.audit_type || undefined });
  const sc = d.status_counts || {};
  const tiles = [["valid", "Valid", "green"], ["expiring", "Expiring ≤ 90 days", "amber"], ["expired", "Expired", "red"], ["no expiry", "No expiry date", "grey"]];
  const rows = d.rows || [];
  return (
    <Screen onBack={onBack} heading="Compliance Certificates" sub={d.subtitle} summary={d.summary} loading={loading} error={error} onReload={reload}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="flex flex-wrap gap-1.5">{tiles.map(([k, l, tone]) => <Chip key={k} tone={tone} onClick={() => setF({ ...f, status: f.status === k ? "" : k })} on={f.status === k} title={l}>{l} · {num(sc[k === "no expiry" ? "no_expiry" : k])}</Chip>)}</span>
        <Select label="Issuer" value={f.issuer} onChange={(v) => setF({ ...f, issuer: v })} options={(d.filters || {}).issuer || d.issuers} />
        <Select label="Audit type" value={f.audit_type} onChange={(v) => setF({ ...f, audit_type: v })} options={(d.filters || {}).audit_type} />
        {(f.status || f.issuer || f.audit_type) && <button onClick={() => setF({ status: "", issuer: "", audit_type: "" })} className="text-[11px] text-sky-300 hover:underline">clear filters</button>}
        <span className="ml-auto text-xs text-slate-500">{loading ? "loading…" : `${rows.length} certificate${rows.length === 1 ? "" : "s"} · click a row for the full record`}</span>
      </div>
      <Table columns={d.columns} rows={rows} max={640} empty="No certificates match." loading={loading} error={error} onRetry={reload} expand keys={["id", "type", "issuer", "issued", "expires", "days_to_expiry", "status", "responsible"]} widths={{ type: "20rem", issuer: "13rem", responsible: "13rem" }} render={{
        id: (v) => <span className="font-bold text-white">{v}</span>,
        type: (v) => <Clip v={v} cls="font-bold text-white" />,
        issuer: (v, r) => <Clip v={v} cls={r.issuer_type === "lab" ? "text-sky-200" : ""} />,
        days_to_expiry: (v, r) => r.status === "no expiry" ? <span className="text-slate-600">—</span> : <span className={`tabular-nums font-bold ${v < 0 ? "text-rose-300" : v <= 90 ? "text-amber-300" : "text-emerald-300"}`}>{v < 0 ? `${num(-v)} d ago` : `in ${num(v)} d`}</span>,
        status: (v) => <Status s={v} />,
        responsible: (v, r) => <Clip v={`${v} ${r.responsible_emp || ""}`} />,
        validity_years: (v) => <span className="tabular-nums">{v === null || v === undefined ? "—" : v >= 1 ? `${num(v, 1)} y` : `${Math.round(v * 12)} mo`}</span>,
      }} />
      <div className="mt-2 text-xs text-slate-500">status from the expiry date: valid = more than 90 days away · expiring = within 90 days, renewal to file · expired = date passed · no expiry = permanent registration</div>
    </Screen>
  );
};

export default Certificates;
