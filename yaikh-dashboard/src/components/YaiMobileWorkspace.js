import React, { useState } from 'react';
import { ScanLine, MonitorPlay, ClipboardList, Building2, Store, Wrench, Package, Home, LayoutGrid, UserRound, ShieldCheck, Phone, BarChart3, Timer, ShoppingBag, Boxes, Plus, Bell, ArrowLeft, FileText } from 'lucide-react';
import { DASHBOARD_DATA } from '../data/module';
import './YaiMobileWorkspace.css';

const asset = path => `${process.env.PUBLIC_URL}/${path}`;
const modules = DASHBOARD_DATA.flatMap(section => section.groups.flatMap(group => group.modules));
const corporate = [ ['YACC', 'accountant', FileText], ['YHR', 'yhr', UserRound], ['YADMIN', 'support-ticket', Building2], ['YCSR', 'digital-audit', ClipboardList] ];
const production = [ ['QMS', 'yqms', ShieldCheck], ['Call out', 'call-out', Phone], ['FC', 'fc', BarChart3], ['CE', 'ce', FileText], ['YTM', 'ytm', Timer], ['4DP', '4dp', LayoutGrid], ['YPI', 'ypi', Timer], ['MRP', 'mrp', Package], ['YM SHOP', 'y-shop', ShoppingBag], ['YTM SHOP', 'ytm-shop', Boxes] ];
const markets = [ ['Phsar Market', Store, 'Products from your community — produce, food, crafts and local goods.'], ['Service Market', Wrench, 'Find maintenance, transport, cleaning and other workplace services.'], ['Factory Supply Market', Package, 'Source consumables, spare parts and maintenance materials.'], ['My Yai', null, 'Your assistant for work, learning and everyday questions.'] ];

export default function YaiMobileWorkspace({ variant = 'phone', onModuleClick }) {
  const [tab, setTab] = useState('Home');
  const [panel, setPanel] = useState(null);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const openModule = id => { const module = modules.find(item => item.id === id); if (module && onModuleClick) onModuleClick(module); };
  const tile = ([title, id, Icon]) => <button key={id} className="ym-module" onClick={() => openModule(id)}><span><Icon size={18} strokeWidth={1.8} /></span><b>{title}</b></button>;
  return <div className={`ym-workspace ym-${variant}`} aria-label={`${variant === 'phone' ? 'Mobile' : 'iPad'} Yai application`}>
    <header className="ym-profile"><img src={asset('assets/about-us/teams/gamini.png')} alt="Gamini" /><div><b>Gamini Ka</b><span>Texlink · TL02</span></div><button aria-label="Notifications" onClick={() => setPanel({ title: 'Notifications', body: 'Your work notices and important updates appear here.' })}><Bell size={12} /></button><button aria-label="Language" onClick={() => setPanel({ title: 'Language', body: 'Use the language selector at the top of the Yai dashboard to change your working language.' })}>🇬🇧</button><button aria-label="Quick actions" onClick={() => setTab('Services')}><Plus size={12} /></button></header>
    <div className="ym-attendance"><span>Today <i /></span><span>00:00 / 08:00</span><span>Weekly schedule</span></div>
    <div className="ym-scroll">
      {panel ? <div className="ym-panel"><button className="ym-back" onClick={() => { setPanel(null); setMessage(''); }}><ArrowLeft size={12} /> Back</button><h4>{panel.title}</h4><p>{panel.body}</p>{panel.title === 'My Yai' && <form onSubmit={e => { e.preventDefault(); if (query.trim()) setMessage('Open the My Task Agent above to send your question to your connected Yai assistant.'); }}><label>Ask Yai<input value={query} onChange={e => setQuery(e.target.value)} placeholder="How can Yai help?" /></label><button type="submit">Continue</button>{message && <p role="status">{message}</p>}</form>}{panel.title === 'My Requests' && <button className="ym-panel-action" onClick={() => openModule('support-ticket')}>Open support requests</button>}{panel.title === 'My Learn' && <button className="ym-panel-action" onClick={() => openModule('training')}>Open training</button>}</div> : tab === 'Profile' ? <div className="ym-panel"><img className="ym-profile-large" src={asset('assets/about-us/teams/gamini.png')} alt="Gamini" /><h4>Gamini Ka</h4><p>Texlink · TL02</p><p>My profile · language · workplace support</p><button className="ym-panel-action" onClick={() => openModule('yhr')}>Open YHR</button></div> : <>
        {tab === 'Home' && <div className="ym-hero"><div className="ym-video"><video controls playsInline preload="none" poster={asset('assets/modules-image/yai-mobile-training-poster.jpg')} aria-label="Yai training video"><source src={asset('assets/short-video-training/normal-video-training/Training-Normall.mp4')} type="video/mp4" /></video><div className="ym-video-caption"><b>Yai · learn at work</b><span>Training, safety & workplace stories</span></div></div><div className="ym-markets">{markets.map(([title, Icon, body]) => <button key={title} onClick={() => setPanel({ title, body })}><span>{Icon ? <Icon size={19} /> : <img src={asset('assets/modules-image/top-bot.png')} alt="Yai" />}</span><b>{title}</b><small>{title === 'My Yai' ? 'Ask me' : 'Explore'}</small></button>)}</div></div>}
        <div className="ym-tools">{[['Scan', ScanLine, 'Read Yai QR codes and open the matching work item.'], ['My Learn', MonitorPlay, 'Training, learning records and workplace guidance.'], ['My Requests', ClipboardList, 'Support tickets and item requests.'], ['Organizations', Building2, 'Your workplace, HR and organization services.']].map(([title, Icon, body]) => <button key={title} onClick={() => setPanel({ title, body })}><span><Icon size={19} /></span><b>{title}</b></button>)}</div>
        <div className="ym-section-title ym-orange"><span />Corporate Services<span /></div><div className="ym-corporate">{corporate.map(tile)}</div>
        <div className="ym-section-title ym-green"><span />Production<span /></div><div className="ym-production">{production.map(tile)}</div>
        <div className="ym-interface-note">Interactive interface preview · modules open the connected workspace</div>
      </>}
    </div>
    <nav className="ym-nav" aria-label={`${variant} app navigation`}>{[['Home', Home], ['Services', LayoutGrid], ['My Yai', null], ['Profile', UserRound]].map(([title, Icon]) => <button key={title} aria-label={title} aria-pressed={tab === title} className={tab === title ? 'active' : ''} onClick={() => { setTab(title); setPanel(title === 'My Yai' ? { title, body: 'Your assistant for work, learning and everyday questions.' } : null); }}><span>{Icon ? <Icon size={17} /> : <img src={asset('assets/modules-image/top-bot.png')} alt="" />}</span>{title}</button>)}</nav>
  </div>;
}
