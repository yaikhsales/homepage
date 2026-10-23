import React, { useState } from 'react';
import './AppsDeviceShowcase.css';
import YaiMobileWorkspace from './YaiMobileWorkspace';

const LOGO = `${process.env.PUBLIC_URL}/assets/modules-image/top-bot.png`;
function Brand({ subtitle }) {
  return <div className="device-brand"><img src={LOGO} alt="Yai" /><div><strong>Yai</strong><span>{subtitle}</span></div></div>;
}
const departments = ['Planning', 'Warehouse', 'Cutting', 'Sewing', 'Quality', 'Packing'];

export default function AppsDeviceShowcase({ onModuleClick }) {
  const [tvView, setTvView] = useState('Overview');
  return <section className="apps-devices" aria-label="Apps cluster">
    <div className="apps-device-row">
      <article className="device-example device-example-tv">
        <h3 className="device-caption">Data TV</h3><p className="device-caption-sub">Factory overview · shared visibility</p>
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
        <h3 className="device-caption">Mobile phone</h3><p className="device-caption-sub">Personal tasks · worker access</p>
        <div className="phone-frame"><div className="phone-display"><div className="phone-status"><span>9:41</span><div className="phone-island" /><span>▮▮ ▰</span></div><YaiMobileWorkspace onModuleClick={onModuleClick} /><div className="phone-home-indicator" /></div></div>
        
      </article>
      <article className="device-example device-example-tablet">
        <h3 className="device-caption">Pads</h3><p className="device-caption-sub">Your Yai workspace · made for iPad</p>
        <div className="tablet-frame"><span className="tablet-camera" /><div className="tablet-display"><YaiMobileWorkspace variant="tablet" onModuleClick={onModuleClick} /></div></div>
      </article>
    </div>
  </section>;
}
