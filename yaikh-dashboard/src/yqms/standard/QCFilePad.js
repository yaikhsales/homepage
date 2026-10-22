import React, { useState } from 'react';
import CuttingFormTablet from '../CuttingFormTablet';

const documents = [
  'Tech pack / current revision',
  'Approved sample / comments',
  'Pattern and measurement specification',
  'Bill of materials / trims',
  'Fabric and lab test reports',
  'Labels and packing instructions',
];

const blank = () => ({
  mo: '', style: '', buyer: '', po: '', revision: '', reviewer: '',
  checks: Object.fromEntries(documents.map(name => [name, 'PENDING'])),
  missing: '', notes: '',
});

export default function QCFilePad({ onRecord, legacy }) {
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [files, setFiles] = useState([]);
  const [fileKey, setFileKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const set = (name, value) => setForm(current => ({ ...current, [name]: value }));
  const pending = Object.values(form.checks).filter(value => value === 'PENDING' || value === 'MISSING').length;

  async function submit(event) {
    event.preventDefault();
    if (!form.mo.trim() || !form.style.trim() || !form.buyer.trim() || !form.reviewer.trim()) {
      setError('Enter the order, style, buyer and reviewer before submitting.');
      return;
    }
    if (files.some(file => file.size > 8 * 1024 * 1024)) {
      setError('Each attached document must be 8 MB or smaller.');
      return;
    }
    setBusy(true);
    try {
      const evidenceFiles = [];
      for (const file of files) {
        const body = new FormData();
        body.append('file', file);
        body.append('category', 'QC file');
        const response = await fetch('/api/yqms/module-evidence?module=qc-file', { method: 'POST', credentials: 'same-origin', body });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || `Could not upload ${file.name}.`);
        evidenceFiles.push(result.file);
      }
      const record = await onRecord({
        ...form,
        checked: documents.length,
        rejected: pending,
        inspector: form.reviewer,
        evidenceFiles,
        status: pending ? 'HOLD' : 'PENDING REVIEW',
        source: 'QC file floor review',
      });
      setSaved(`${record.id} saved for management review.`);
      setError('');
      setForm(blank());
      setFiles([]);
      setFileKey(value => value + 1);
    } catch (cause) {
      setError(cause.message || 'The QC file review could not be saved.');
    } finally {
      setBusy(false);
    }
  }

  return <>
    <CuttingFormTablet label="QC File">
      <form className="qs-qc-file-pad" onSubmit={submit}>
        <div className="qs-qc-file-heading"><div><h2>QC file review</h2><p>Record the available approved documents for this order and identify anything missing before production.</p></div><span>{documents.length - pending} of {documents.length} available</span></div>
        <div className="qs-form-grid">
          <label>MO / order<input value={form.mo} onChange={event => set('mo', event.target.value)} required /></label>
          <label>Style<input value={form.style} onChange={event => set('style', event.target.value)} required /></label>
          <label>Buyer<input value={form.buyer} onChange={event => set('buyer', event.target.value)} required /></label>
          <label>PO number<input value={form.po} onChange={event => set('po', event.target.value)} /></label>
          <label>Document revision<input value={form.revision} onChange={event => set('revision', event.target.value)} /></label>
          <label>Reviewer / YHR ID<input value={form.reviewer} onChange={event => set('reviewer', event.target.value)} required /></label>
        </div>
        <h3>Document check</h3>
        <div className="qs-qc-file-checks">{documents.map(name => <label key={name}><span>{name}</span><select value={form.checks[name]} onChange={event => set('checks', { ...form.checks, [name]: event.target.value })}><option value="PENDING">Pending</option><option value="AVAILABLE">Available</option><option value="MISSING">Missing</option><option value="NOT APPLICABLE">Not applicable</option></select></label>)}</div>
        <div className="qs-form-grid">
          <label>Missing document / follow-up<textarea rows={3} value={form.missing} onChange={event => set('missing', event.target.value)} /></label>
          <label>Ground review notes<textarea rows={3} value={form.notes} onChange={event => set('notes', event.target.value)} /></label>
        </div>
        <label>Attach QC documents / evidence PDF or image · up to 8 MB each<input key={fileKey} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" multiple onChange={event => setFiles(Array.from(event.target.files || []))} /></label>
        {files.length > 0 && <p>{files.length} document{files.length === 1 ? '' : 's'} selected for upload when submitted.</p>}
        {error && <p className="qs-error" role="alert">{error}</p>}
        {saved && <p className="qs-success" role="status">{saved}</p>}
        <div className="qs-qc-file-submit"><span>{pending ? `${pending} items require review` : 'All listed documents available · management review pending'}</span><button className="qs-primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Submit QC file review'}</button></div>
      </form>
    </CuttingFormTablet>
    <details className="qs-legacy-reference"><summary>Existing QC file register</summary><div className="qs-legacy">{legacy}</div></details>
  </>;
}
