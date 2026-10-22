import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import SubMenuView from '../views/SubMenuView';
import './YQMSHub.css';

export default function YQMSHub() {
  const navigate = useNavigate();
  return <main className="yqms-hub"><h1>YQMS</h1><div className="yqms-hub-modules">
    <button onClick={() => navigate('/dashboard/submenu/yqms-workspace')}><img className="yqms-hub-illustration" src={`${process.env.PUBLIC_URL}/assets/yqms/qc-inspector.png`} alt="Female QC inspector holding an iPad"/><strong>QC Work space</strong><small>Inspection tools, reports and compliance</small></button>
    <button onClick={() => navigate('/dashboard/yqms/quality-monitoring')}><img className="yqms-hub-illustration" src={`${process.env.PUBLIC_URL}/assets/yqms/quality-managers.png`} alt="One female and two male managers watching a wall-mounted quality dashboard"/><strong>Quality Monitoring</strong><small>Quality monitoring workspace</small></button>
  </div></main>;
}
export function QCWorkspace() {
  const navigate = useNavigate();
  return <><nav className="yqms-workspace-back"><button onClick={() => navigate('/dashboard/submenu/yqms')}><ArrowLeft size={17}/>YQMS</button></nav><SubMenuView moduleIdOverride="yqms-workspace"/></>;
}
export function QualityMonitoring() {
  const navigate = useNavigate();
  return <main className="yqms-hub"><nav className="yqms-workspace-back"><button onClick={() => navigate('/dashboard/submenu/yqms')}><ArrowLeft size={17}/>YQMS</button></nav><h1>Quality Monitoring</h1><section className="yqms-monitoring-empty"><Activity size={44}/><h2>Quality Monitoring</h2><p>No monitoring panels configured yet.</p></section></main>;
}
