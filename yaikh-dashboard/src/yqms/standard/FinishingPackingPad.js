import React, { useState } from 'react';
import { useQualityOrganization } from '../quality-organization';
import AuditReport from '../AuditReport';
import PackingInspection from '../PackingInspection';
import HumidityReportAdd from '../HumidityReport/add-model';

const isResult = (name) => /result|appearance|trims|thread|scorch|crease|workmanship|labelling|packing check|barcode|carton marks|buyer requirement|measurements$/i.test(name);
const isNumber = (name) => /% RH|gross weight/i.test(name);
const blank = (fields) => Object.fromEntries(fields.map((field) => [field, '']));

export default function FinishingPackingPad({ moduleKey, config, onRecord }) {
  const { org, error: directoryError } = useQualityOrganization();
  const [form, setForm] = useState({ order: '', po: '', style: '', buyer: '', colour: '', size: '', line: '', inspector: '', shift: 'Day', checked: '', rejected: '0', note: '', evidence: '', values: blank(config.fields) });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState([]);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setField = (key, value) => setForm((current) => ({ ...current, values: { ...current.values, [key]: value } }));
  const legacy = moduleKey === 'packing-inspection' ? <PackingInspection embedded />
    : moduleKey === 'aquaboy' ? <HumidityReportAdd embedded />
      : <AuditReport embedded title={config.title} />;

  async function submit(event) {
    event.preventDefault();
    setError('');
    const checked = Number(form.checked), rejected = Number(form.rejected);
    if (!org?.people.some((person) => person.emp_no === form.inspector)) { setError('Select a current YHR QA inspector.'); return; }
    if (!Number.isInteger(checked) || checked < 1 || !Number.isInteger(rejected) || rejected < 0 || rejected > checked) { setError('Enter valid checked and defective quantities.'); return; }
    if (config.fields.some((field) => !String(form.values[field]).trim())) { setError('Complete every topic-specific check before submitting.'); return; }
    const resultFailed = Object.values(form.values).some((value) => value === 'FAIL');
    const humiditySpec = Number(form.values['Humidity specification (% RH)']);
    const humidityFailed = moduleKey === 'aquaboy' && ['Top reading (% RH)', 'Middle reading (% RH)', 'Bottom reading (% RH)'].some((field) => Number(form.values[field]) > humiditySpec);
    const status = rejected > 0 || resultFailed || humidityFailed ? 'HOLD' : 'PASS';
    setBusy(true);
    try {
      const evidenceFiles = [];
      for (const file of photos) {
        const body = new FormData(); body.append('file', file); body.append('category', config.stage);
        const response = await fetch(`/api/yqms/module-evidence?module=${encodeURIComponent(moduleKey)}`, { method: 'POST', credentials: 'same-origin', body });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || `Could not upload ${file.name}.`);
        evidenceFiles.push(result.file);
      }
      await onRecord({ ...form, checked, rejected, status, date: new Date().toISOString(), source: 'floor-record', stage: config.stage,
        evidence: [form.evidence, ...evidenceFiles.map((file) => file.url)].filter(Boolean).join(' · '), evidenceFiles,
        checks: Object.fromEntries(Object.entries(form.values).filter(([key]) => isResult(key))),
        findings: rejected ? [{ code: 'Defective pieces', count: rejected }] : [],
      });
      setForm((current) => ({ ...current, checked: '', rejected: '0', note: '', evidence: '', values: blank(config.fields) }));
      setPhotos([]);
    } catch (cause) { setError(cause.message || 'Could not save this floor check.'); }
    finally { setBusy(false); }
  }

  return <div className="qs-finishing-pad">
    <div className="qs-finishing-tablet">
      <form className="qs-finishing-form" onSubmit={submit}>
        <div className="qs-toolbar"><div><h2>{config.title} · ground check</h2><p>Record the actual order, sample and findings. Saved checks feed this module's dashboard, reports and decision register.</p></div><strong>{config.stage}</strong></div>
        <p>For this public demonstration, start the MO / order with <strong>DEMO-</strong>. It will appear in the public dashboard, reports and DR as sample data. Other orders remain restricted to signed-in factory management.</p>
        <div className="qs-form-grid three">
          <label>MO / order *<input required value={form.order} onChange={(e) => set('order', e.target.value)} /></label>
          <label>PO number<input value={form.po} onChange={(e) => set('po', e.target.value)} /></label>
          <label>Style *<input required value={form.style} onChange={(e) => set('style', e.target.value)} /></label>
          <label>Buyer / brand *<input required value={form.buyer} onChange={(e) => set('buyer', e.target.value)} /></label>
          <label>Colour *<input required value={form.colour} onChange={(e) => set('colour', e.target.value)} /></label>
          <label>Size / ratio *<input required value={form.size} onChange={(e) => set('size', e.target.value)} /></label>
          <label>Production line / area *<input required value={form.line} onChange={(e) => set('line', e.target.value)} /></label>
          <label>Shift<select value={form.shift} onChange={(e) => set('shift', e.target.value)}><option>Day</option><option>Night</option></select></label>
          <label>YHR QC / QA inspector *<select required value={form.inspector} onChange={(e) => set('inspector', e.target.value)}><option value="">Select current QA employee</option>{org?.people.map((person) => <option key={person.emp_no} value={person.emp_no}>{person.emp_no} · {person.title || person.position}</option>)}</select></label>
        </div>
        {directoryError && <p role="alert" className="qs-error">{directoryError}</p>}
        <h3>Inspection reference and findings</h3>
        <div className="qs-form-grid three">{config.fields.map((field) => <label key={field}>{field} *{isResult(field)
          ? <select required value={form.values[field]} onChange={(e) => setField(field, e.target.value)}><option value="">Select result</option><option>PASS</option><option>FAIL</option><option>NOT APPLICABLE</option></select>
          : <input required type={isNumber(field) ? 'number' : 'text'} min={isNumber(field) ? '0' : undefined} max={/% RH/.test(field) ? '100' : undefined} step={isNumber(field) ? '0.1' : undefined} value={form.values[field]} onChange={(e) => setField(field, e.target.value)} />}</label>)}</div>
        <div className="qs-form-grid three"><label>Pieces / cartons checked *<input required type="number" min="1" value={form.checked} onChange={(e) => set('checked', e.target.value)} /></label><label>Defective pieces / cartons *<input required type="number" min="0" value={form.rejected} onChange={(e) => set('rejected', e.target.value)} /></label><label>Evidence reference / photo URL<input value={form.evidence} onChange={(e) => set('evidence', e.target.value)} /></label></div>
        <label>Inspection photos / evidence PDF · up to 8 MB each<input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple onChange={(e) => setPhotos(Array.from(e.target.files || []))} /></label>
        {photos.length > 0 && <p>{photos.length} evidence file{photos.length === 1 ? '' : 's'} selected. Files upload when the inspection is submitted.</p>}
        <label>Findings, containment and next action<textarea rows={3} value={form.note} onChange={(e) => set('note', e.target.value)} /></label>
        <p>A failed result or defective quantity places this check on hold for the quality leader and supervisor. A pass records the sample result; it does not authorize shipment.</p>
        {error && <p role="alert" className="qs-error">{error}</p>}
        <button className="qs-primary" disabled={busy || !org?.people.length}>{busy ? 'Saving…' : 'Submit floor inspection'}</button>
      </form>
    </div>
    <details className="qs-card qs-legacy-reference"><summary>View previous module screen · reference display</summary><p>This earlier screen contains sample figures. Submit actual checks using the connected form above.</p><div className="qs-legacy-display">{legacy}</div></details>
  </div>;
}
