import React, { useState } from 'react';
import './AppsDeviceShowcase.css';

const LOGO = `${process.env.PUBLIC_URL}/assets/modules-image/top-bot.png`;
function Brand({ subtitle }) {
  return <div className="device-brand"><img src={LOGO} alt="Yai" /><div><strong>Yai</strong><span>{subtitle}</span></div></div>;
}
const departments = ['Planning', 'Warehouse', 'Cutting', 'Sewing', 'Quality', 'Packing'];
const tasks = ['Review fabric inspection', 'Check your work schedule', 'View training & SOPs'];

export default function AppsDeviceShowcase() {
  const [tvView, setTvView] = useState('Overview');
  const [phoneTab, setPhoneTab] = useState('My work');
  const [selectedTask, setSelectedTask] = useState(null);
  const [tabletTab, setTabletTab] = useState('Responsibilities');
  const [checks, setChecks] = useState({});
  return <section className="apps-devices" aria-label="Apps cluster">
    <header className="apps-device-heading"><span>Apps</span><h2>Yai on every screen</h2></header>
    <div className="apps-device-row">
      <article className="device-example device-example-tv">
        <h3 className="device-caption">TV UI</h3><p className="device-caption-sub">Factory overview · shared visibility</p>
        <div className="tv-frame"><div className="tv-display">
          <div className="tv-top"><Brand subtitle="Factory command centre" /><span className="device-demo-badge">Interface preview</span></div>
          <div className="device-tabbar">{['Overview', 'Production', 'Quality'].map(tab => <button key={tab} className={tvView === tab ? 'selected' : ''} onClick={() => setTvView(tab)}>{tab}</button>)}</div>
          <div className="tv-content"><div className="device-eyebrow">FACTORY OPERATIONS</div><h3>{tvView === 'Overview' ? 'One view. Every department.' : `${tvView} overview`}</h3>
            <div className="tv-summary">{(tvView === 'Quality' ? ['Inspections', 'Corrective actions', 'Buyer requirements'] : ['Production plan', 'Work in progress', 'Quality control']).map((title, i) => <div key={title}><span className="summary-symbol">{['▤', '▥', '✓'][i]}</span><b>{title}</b><small>{['Plan & coordinate', 'Track & follow up', 'Review & approve'][i]}</small></div>)}</div>
            <div className="tv-section-label">{tvView === 'Quality' ? 'Inspection workflow' : 'Order → shipment'}</div><div className="tv-process">{(tvView === 'Quality' ? ['Fabric', 'Cutting', 'Inline QC', 'End-line', 'Final QC', 'Release'] : departments).map((name, i) => <div key={name}><span>{String(i + 1).padStart(2, '0')}</span><b>{name}</b></div>)}</div>
            <div className="tv-footer"><span className="device-dot" /> Yai · planning, people & processes <span>Designed for the factory floor</span></div>
          </div>
        </div><span className="tv-hardware-mark">YAI</span></div><div className="tv-stand" /><div className="tv-base" />
        
      </article>
      <article className="device-example device-example-phone">
        <h3 className="device-caption">Mobile App UI</h3><p className="device-caption-sub">Personal tasks · worker access</p>
        <div className="phone-frame"><div className="phone-display"><div className="phone-status"><span>9:41</span><div className="phone-island" /><span>▮▮ ▰</span></div><div className="phone-main"><Brand subtitle="Your working day" /><div className="phone-greeting">Good morning</div><h3>{phoneTab === 'My work' ? 'Let’s get to work.' : phoneTab}</h3>
          {phoneTab === 'My work' ? <><div className="phone-focus"><small>YOUR WORKSPACE</small><b>Everything you need,<br />right here.</b><span>Tasks · people · support</span></div><h4>My tasks</h4><div className="phone-tasklist">{tasks.map((task, i) => <button key={task} onClick={() => setSelectedTask(selectedTask === i ? null : i)} aria-expanded={selectedTask === i}><span className="phone-task-icon">{['✓', '▦', '▤'][i]}</span><span>{task}</span><b>›</b>{selectedTask === i && <small>{['Review the approved references and inspection checklist.', 'Your assigned shift and department schedule.', 'Find your role’s current work instructions.'][i]}</small>}</button>)}</div></> : <div className="phone-info"><span>{phoneTab === 'Updates' ? '◉' : '◌'}</span><h4>{phoneTab === 'Updates' ? 'Stay in the loop' : 'Your Yai profile'}</h4><p>{phoneTab === 'Updates' ? 'Department notices, task hand-offs and important announcements.' : 'Your role, language preferences and workplace support.'}</p></div>}
          <span className="phone-preview-label">Interface preview</span></div><nav className="phone-bottom" aria-label="Phone preview navigation">{['My work', 'Updates', 'Profile'].map((tab, i) => <button key={tab} className={phoneTab === tab ? 'selected' : ''} onClick={() => setPhoneTab(tab)}><span>{['⌂', '◉', '◌'][i]}</span>{tab}</button>)}</nav><div className="phone-home-indicator" /></div></div>
        
      </article>
      <article className="device-example device-example-tablet">
        <h3 className="device-caption">iPad UI</h3><p className="device-caption-sub">Inspection · reports · team workflows</p>
        <div className="tablet-frame"><span className="tablet-camera" /><div className="tablet-display"><header className="tablet-top"><Brand subtitle="Quality workspace" /><span className="device-demo-badge">Interface preview</span></header><div className="tablet-layout"><aside><span className="tablet-nav-selected">▤ Inspection</span><span>▦ Reports</span><span>✓ SOPs</span><span>◌ My team</span></aside><div className="tablet-main"><div className="device-eyebrow">YQMS / FABRIC</div><h3>Fabric inspection</h3><p>Prepare. Inspect. Record. Review.</p><div className="device-tabbar">{['Responsibilities', 'Checklist'].map(tab => <button key={tab} className={tabletTab === tab ? 'selected' : ''} onClick={() => setTabletTab(tab)}>{tab}</button>)}</div>
          {tabletTab === 'Responsibilities' ? <div className="tablet-responsibilities"><div><b>Warehouse supervisor</b><span>Locate the lot & arrange selected rolls.</span></div><div><b>Fabric inspector</b><span>Verify references, prepare the machine & inspect.</span></div><div><b>QA reviewer</b><span>Review evidence & record disposition.</span></div></div> : <div className="tablet-checklist">{['Approved fabric & colour card', 'Roll identity confirmed', 'Machine cleaned & set', 'Inspection evidence recorded'].map(task => <label key={task}><input type="checkbox" checked={Boolean(checks[task])} onChange={e => setChecks({ ...checks, [task]: e.target.checked })} />{task}</label>)}</div>}
          <div className="tablet-handoff"><span>↗</span><div><b>Clear responsibility. Clear hand-off.</b><small>One activity, every person involved.</small></div></div>
        </div></div></div></div>
      </article>
    </div>
  </section>;
}
