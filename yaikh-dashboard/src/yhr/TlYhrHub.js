import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, Gauge, ShieldCheck, ChevronLeft, ChevronRight, CalendarCheck, Clock3, TrendingUp, Wallet, Users, X, Eye, EyeOff } from 'lucide-react';
import BotModules from '../chatbot/bot-modules';
import { ADMIN_GROUPS, ADMIN_CARDS, SERVICES, TEAM_CARDS } from './tlHubData';
import './tl-yhr.css';

const TL = 'https://tl.yaikh.com';
const currentMonth = () => new Intl.DateTimeFormat('en-CA', {year:'numeric',month:'2-digit',timeZone:'Asia/Phnom_Penh'}).format(new Date()).slice(0,7);
const validMonth = value => /^\d{4}-(0[1-9]|1[0-2])$/.test(value || '');
const monthLabel = value => new Date(value+'-01T12:00:00').toLocaleDateString('en-US',{month:'long',year:'numeric'});
const asset = name => (process.env.PUBLIC_URL || '')+'/assets/yhr-tl/'+encodeURIComponent(name);

function AccessPrompt({topic,onClose}) {
  const dialog = useRef(null), firstInput = useRef(null), trigger = useRef(document.activeElement);
  const [show,setShow] = useState(false), [message,setMessage] = useState('');
  const payslip = topic === 'Smart PaySlip';
  useEffect(() => {
    dialog.current.showModal(); firstInput.current.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow='hidden';
    const previousTrigger=trigger.current;
    return () => { document.body.style.overflow=previousOverflow; previousTrigger?.focus?.(); };
  },[]);
  return <dialog className={'tl-access'+(payslip?' tl-access-payslip':'')} ref={dialog} onCancel={e=>{e.preventDefault();onClose();}} aria-labelledby="tl-access-title">
    <form onSubmit={e=>{e.preventDefault(); e.currentTarget.reset(); setMessage('This preview stops at the password prompt. Open TL to continue securely.');}}>
      <div className="tl-access-heading"><span><ShieldCheck size={22}/></span><div><h2 id="tl-access-title">{payslip?'Create Security Password':'Protected Admin Hub Tab'}</h2>{!payslip&&<p>{topic}</p>}</div></div>
      <div className="tl-access-body"><p>{payslip?'Create a security password to protect your payslip and earnings history on this device.':'Enter the access password for this protected area.'}</p>
        <label htmlFor="tl-access-password">{payslip?'New Password':'Global Password'}</label>
        <div className="tl-password"><input ref={firstInput} id="tl-access-password" placeholder={payslip?'••••••••':undefined} type={show?'text':'password'} autoComplete="off" required/><button type="button" onClick={()=>setShow(!show)} aria-label={show?'Hide password':'Show password'}>{show?<EyeOff size={16}/>:<Eye size={16}/>}</button></div>
        {payslip&&<><label htmlFor="tl-access-confirm">Confirm Password</label><input id="tl-access-confirm" placeholder="••••••••" type="password" autoComplete="off" required/></>}
        {message&&<p role="status" className="tl-access-message">{message} <a href={TL+(payslip?'/dashboard/yhr/smart_payslip':'/dashboard/yhr')} target="_blank" rel="noopener noreferrer">Open TL</a></p>}
        <div className="tl-access-actions"><button type="button" onClick={onClose}>Cancel</button><button type="submit">{payslip?'Set Password':'Unlock'}</button></div>
      </div>
    </form>
  </dialog>;
}

function Card({item,onClick,month,tone}) {
  const body=<><span className="tl-card-shadow"/><span className="tl-card-face"><img src={asset(item.image)} alt=""/><strong>{item.title}</strong><span className="tl-card-description">{item.description}</span></span></>;
  const cls='tl-card'+(tone?' tl-card-'+tone:'');
  if(onClick) return <button className={cls} onClick={onClick}>{body}</button>;
  const url=new URL(item.path,TL);
  if(item.title==='Daily Presence')url.searchParams.set('month',month);
  return <a className={cls} href={url.href} target="_blank" rel="noopener noreferrer" title={item.description+' Opens TL.'}>{body}</a>;
}

function AttendanceDashboard({month,onMonth,initialMonth}) {
  // Public Experience uses an explicitly labelled synthetic example, never the signed-in TL employee's records.
  const hasExample=month===initialMonth;
  const metrics=[
    ['Attendance Rate',hasExample?'90.9%':'—',hasExample?'20 Days Present':'No preview records',CalendarCheck,'blue'],
    ['On-Time Arrival',hasExample?'90.0%':'—',hasExample?'2 late arrivals this month (18/20 On-Time)':'No preview records',TrendingUp,'green'],
    ['Total Work Hours',hasExample?'160h 00m':'—',hasExample?'Regular: 160h 00m | OT: 0h':'No preview records',Clock3,'indigo'],
    ['Available Balance',hasExample?'12.0 Days':'—',hasExample?'Accrued: 15.0 | Used: 3.0':'No preview records',Wallet,'purple'],
  ];
  const step=delta=>{const d=new Date(month+'-01T12:00:00');d.setMonth(d.getMonth()+delta);onMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);};
  return <section className="tl-dashboard-panel"><div className="tl-dashboard-heading"><h1>Attendance Analysis Dashboard</h1><p>Visual metrics &amp; trend breakdown from time &amp; attendance logs</p></div>
    <div className="tl-month"><button onClick={()=>step(-1)} aria-label="Previous month"><ChevronLeft size={18}/></button><input type="month" aria-label="Attendance month" value={month} onChange={e=>{if(validMonth(e.target.value))onMonth(e.target.value);}}/><button onClick={()=>step(1)} aria-label="Next month"><ChevronRight size={18}/></button></div>
    <div className="tl-metrics">{metrics.map(([label,value,detail,Icon,color])=><article className={'tl-metric '+color} key={label}><div><h2>{label}</h2><strong>{value}</strong><p>{detail}</p></div><span><Icon size={25}/></span></article>)}</div>
    <section className="tl-weekly"><h2>Weekly Hours Breakdown</h2><div className="tl-chart-legend"><span/>Regular <span/>Overtime</div><div className="tl-bars" aria-label={'Weekly hours for '+monthLabel(month)}><span className="tl-target">48h target</span>{[40,40,40,40,0].map((h,i)=><div className="tl-bar-column" key={i}><span>{hasExample&&h?h+'h':'—'}</span><div style={{height:hasExample?(h/60*140)+'px':'0px'}}/><b>W{i+1}</b></div>)}</div></section>
    <section className="tl-highlights"><h2>Month Highlights</h2><p>Holidays, approved leaves, and off-duty events</p><div className="tl-empty">No events in this preview.</div></section>
  </section>;
}

export default function TlYhrHub({onBack}) {
  const navigate=useNavigate(), [params,setParams]=useSearchParams();
  const [initialMonth]=useState(currentMonth);
  const month=validMonth(params.get('month'))?params.get('month'):initialMonth;
  const mode=['services','admin'].includes(params.get('mode'))?params.get('mode'):'dashboard';
  const group=ADMIN_GROUPS.some(g=>g.id===params.get('group'))?params.get('group'):'attendance';
  const team=params.get('team')==='operations'?'operations':'review';
  const inTeam=mode==='services'&&params.has('team');
  const [locked,setLocked]=useState(null), [bot,setBot]=useState(false);
  const restricted=ADMIN_GROUPS.find(g=>g.id===group)?.protected;
  useEffect(()=>{if(mode==='admin'&&restricted)setLocked(ADMIN_GROUPS.find(g=>g.id===group).title);},[mode,group,restricted]);
  const select=(nextMode,extra={})=>{setLocked(null);setParams({mode:nextMode,month,...extra});};
  const chooseGroup=g=>{if(g.protected){setLocked(g.title);return;}select('admin',{group:g.id});};
  const closePrompt=()=>{setLocked(null);if(mode==='admin'&&restricted)select('admin',{group:'attendance'});};
  return <div className="tl-yhr">
    <div className="tl-hub-header"><button onClick={()=>onBack?onBack():navigate('/dashboard')} aria-label="Back"><ArrowLeft size={18}/></button><strong>YHR</strong><span>Experience preview · Sample dashboard values</span><a href={TL+'/dashboard/yhr'} target="_blank" rel="noopener noreferrer">Open TL ↗</a></div>
    <main className="tl-hub-main">
      <nav className="tl-primary-tabs" aria-label="YHR topics">{[['dashboard','My Dashboard',Gauge],['services','My Services',LayoutGrid],['admin','Admin Hub',ShieldCheck]].map(([id,title,Icon])=><button key={id} aria-pressed={mode===id} className={mode===id?'active '+id:''} onClick={()=>select(id,id==='admin'?{group:'attendance'}:{})}><Icon size={17}/><span>{title}</span></button>)}</nav>
      {mode==='dashboard'&&<AttendanceDashboard month={month} initialMonth={initialMonth} onMonth={m=>setParams({mode,month:m})}/>}
      {mode==='services'&&<section className="tl-services">
        {inTeam&&<button className="tl-team-back" onClick={()=>select('services')}><ChevronLeft size={16}/>Back to My Services</button>}
        <div className="tl-section-heading"><p>{inTeam?'Supervisor Portal':'Employee Actions'}</p><h1>{inTeam?'My Team':'Quick Actions & Services'}</h1><span>{inTeam?'Manage and approve for your direct reports':'Access your daily operations, leaves, requests, and documents'}</span></div>
        {inTeam&&<nav className="tl-team-tabs" aria-label="My Team topics">{[['review','Review & Approve'],['operations','Team Operations']].map(([id,title])=><button key={id} aria-pressed={team===id} onClick={()=>select('services',{team:id})}><Users size={16}/>{title}</button>)}</nav>}
        <div className="tl-card-grid">{(inTeam?TEAM_CARDS[team]:SERVICES).map(item=><Card key={item.title} item={item} month={month} tone={item.title==='My Team'?'amber':undefined} onClick={item.title==='My Team'?()=>select('services',{team:'review'}):item.title==='Smart PaySlip'?()=>setLocked('Smart PaySlip'):undefined}/>)}</div>
      </section>}
      {mode==='admin'&&<section className="tl-admin"><nav className="tl-admin-tabs" aria-label="Admin Hub topics">{ADMIN_GROUPS.map(g=><button key={g.id} aria-pressed={group===g.id} onClick={()=>chooseGroup(g)}>{g.title}</button>)}</nav><div className="tl-card-grid">{(ADMIN_CARDS[restricted?'attendance':group]||[]).map(item=><Card key={item.title} item={item} month={month} tone="rose"/>)}</div></section>}
    </main>
    <button className="tl-copilot" onClick={()=>setBot(true)}><span>HR</span>YHR Copilot</button>
    {bot&&<div className="tl-bot"><button className="tl-bot-close" onClick={()=>setBot(false)} aria-label="Close YHR Copilot"><X size={20}/></button><BotModules moduleContext="YHR" currentVersion="yai1" botsFilter={["hr-bot"]} initialTopic="Attendance today" onClose={()=>setBot(false)}/></div>}
    {locked&&<AccessPrompt key={locked} topic={locked} onClose={closePrompt}/>}
  </div>;
}
