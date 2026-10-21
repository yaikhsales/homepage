import React, { useState } from 'react';
import CuttingFormTablet from '../CuttingFormTablet';
import { cuttingAudits } from '../CuttingAuditDetails';
import { useQualityOrganization } from '../quality-organization';

const auditChecks = [
  'First-output approval and current pattern revision',
  'Sample covers top, middle and bottom plies',
  'Fabric lot, shade and size traceability',
  'Panel shape, dimensions and grain direction',
  'Notches, drill marks and cut edges',
  'Numbering, bundle identity and panel count',
  'Defective panels contained for correction',
];
const emptyChecks = () => Object.fromEntries(auditChecks.map(name => [name, 'PENDING']));

export default function QACuttingPad({ onRecord }) {
  const examples = cuttingAudits(false);
  const [selected, setSelected] = useState(examples[0].id);
  const [inspector, setInspector] = useState('');
  const [upstream, setUpstream] = useState('');
  const [checked, setChecked] = useState('20');
  const [rejected, setRejected] = useState('0');
  const [checks, setChecks] = useState(emptyChecks);
  const [measurements, setMeasurements] = useState(['', '', '']);
  const [finding, setFinding] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const { org } = useQualityOrganization();
  const audit = examples.find(item => item.id === selected);
  const qaPeople = (org?.people || []).filter(person => /\bQA\b|auditor|quality/i.test(person.position || person.title || ''));

  async function submit(event) {
    event.preventDefault();
    const quantity = Number(checked), bad = Number(rejected);
    if (!inspector || !upstream.trim() || !Number.isInteger(quantity) || quantity < 1 || !Number.isInteger(bad) || bad < 0 || bad > quantity) {
      setError('Choose a QA auditor, enter the first-output reference, and use valid piece quantities.');
      return;
    }
    if (measurements.some(value => value !== '' && !Number.isFinite(Number(value))) || (bad > 0 && !finding.trim())) {
      setError('Enter numeric measurements and describe any defective pieces and their containment.');
      return;
    }
    const outOfTolerance = measurements.some((value, index) => value !== '' && Math.abs(Number(value) - audit.measurements[index].target) > 2);
    const failed = Object.values(checks).includes('FAIL') || outOfTolerance || bad > 0;
    const { id, status: oldStatus, release, verification, cap, cause, action, finding: oldFinding, defects, samples, date, ...reference } = audit;
    try {
      const record = await onRecord({
        ...reference,
        date: new Date().toLocaleDateString('en-CA'),
        inspector,
        upstreamFirstOutput: upstream.trim(),
        checked: quantity,
        rejected: bad,
        checks,
        measurements: audit.measurements.map((item, index) => ({ ...item, actual: measurements[index] === '' ? null : Number(measurements[index]) })),
        finding,
        status: failed ? 'HOLD' : 'PENDING REVIEW',
        source: 'Independent QA cutting audit',
      });
      setSaved(`${record.id} saved for independent supervisor review.`);
      setError('');
    } catch (cause) {
      setError(cause.message || 'The QA audit could not be saved.');
    }
  }

  return <CuttingFormTablet label="QA Cutting">
    <form className="qs-audit-pad" onSubmit={submit}>
      <h2>QA cutting audit</h2>
      <p>Independently sample numbered cut output before transfer to sewing. The 20-piece sample and ±2 mm measurements shown here are demo settings; use the effective buyer plan.</p>
      <div className="qs-form-grid">
        <label>Order / style<select value={selected} onChange={event => { setSelected(event.target.value); setChecks(emptyChecks()); setMeasurements(['', '', '']); }}>
          {examples.map(item => <option key={item.id} value={item.id}>{item.mo} · {item.style}</option>)}
        </select></label>
        <label>QA auditor / YHR ID{qaPeople.length ? <select value={inspector} onChange={event => setInspector(event.target.value)}><option value="">Select QA auditor</option>{qaPeople.map(person => <option key={person.emp_no} value={person.emp_no}>{person.emp_no} · {person.position || person.title}</option>)}</select> : <input value={inspector} onChange={event => setInspector(event.target.value)} placeholder="Enter assigned auditor YHR ID" />}</label>
        <label>First-output inspection reference<input value={upstream} onChange={event => setUpstream(event.target.value)} placeholder="Record ID / approved first output" required /></label>
        <label>Audit sample checked<input type="number" min="1" value={checked} onChange={event => setChecked(event.target.value)} /></label>
        <label>Defective pieces<input type="number" min="0" value={rejected} onChange={event => setRejected(event.target.value)} /></label>
      </div>
      <p><strong>{audit.buyer}</strong> · {audit.color} · size {audit.size} · table {audit.table}<br />{audit.lay} · {audit.marker} · {audit.pattern} · {audit.roll} / {audit.shade}</p>
      <h3>Independent audit checks</h3>
      <div className="qs-form-grid">{auditChecks.map(name => <label key={name}>{name}<select value={checks[name]} onChange={event => setChecks(current => ({ ...current, [name]: event.target.value }))}><option value="PENDING">Pending</option><option value="PASS">Pass</option><option value="FAIL">Fail</option></select></label>)}</div>
      <h3>Representative measurements · mm</h3>
      <div className="qs-form-grid three">{audit.measurements.map((item, index) => <label key={item.point}>{item.point} · {item.target} ±2<input type="number" aria-label={`QA ${item.point}`} value={measurements[index]} onChange={event => setMeasurements(values => values.map((value, current) => current === index ? event.target.value : value))} /></label>)}</div>
      <label>Finding / containment / reinspection evidence<textarea rows={3} value={finding} onChange={event => setFinding(event.target.value)} /></label>
      {error && <p className="qs-error" role="alert">{error}</p>}
      {saved && <p className="qs-success" role="status">{saved}</p>}
      <button className="qs-primary" type="submit">Submit QA audit</button>
    </form>
  </CuttingFormTablet>;
}
