import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import SubMenuView from '../views/SubMenuView';
import './YQMSHub.css';
import { useTranslation } from '../translate/TranslationContext';

const copy = {
 en: ['QC Work space','Inspection tools, reports and compliance','Quality Monitoring','Quality monitoring workspace','No monitoring panels configured yet.','Back to YQMS'],
 km: ['កន្លែងធ្វើការ QC','ឧបករណ៍ត្រួតពិនិត្យ របាយការណ៍ និងការអនុលោមតាម','ការតាមដានគុណភាព','កន្លែងធ្វើការតាមដានគុណភាព','មិនទាន់មានផ្ទាំងតាមដានដែលបានកំណត់រចនាសម្ព័ន្ធទេ។','ត្រឡប់ទៅ YQMS'],
 zh: ['QC 工作区','检验工具、报告与合规','质量监控','质量监控工作区','尚未配置监控面板。','返回 YQMS'],
 vi: ['Không gian làm việc QC','Công cụ kiểm tra, báo cáo và tuân thủ','Giám sát chất lượng','Không gian giám sát chất lượng','Chưa cấu hình bảng giám sát nào.','Quay lại YQMS'],
 tl: ['Lugar ng trabaho ng QC','Mga kagamitan sa inspeksyon, ulat at pagsunod','Pagsubaybay sa kalidad','Lugar ng pagsubaybay sa kalidad','Wala pang nakaayos na panel ng pagsubaybay.','Bumalik sa YQMS'],
 ms: ['Ruang kerja QC','Alat pemeriksaan, laporan dan pematuhan','Pemantauan Kualiti','Ruang kerja pemantauan kualiti','Belum ada panel pemantauan dikonfigurasi.','Kembali ke YQMS']
};
function useHubCopy() { const { language } = useTranslation(); return copy[language] || copy.en; }

export default function YQMSHub() {
  const navigate = useNavigate();
  const labels = useHubCopy();
  return <main className="yqms-hub"><h1>YQMS</h1><div className="yqms-hub-modules">
    <button onClick={() => navigate('/dashboard/submenu/yqms-workspace')}><img className="yqms-hub-illustration" src={`${process.env.PUBLIC_URL}/assets/yqms/qc-inspector.png`} alt={labels[0]}/><strong>{labels[0]}</strong><small>{labels[1]}</small></button>
    <button onClick={() => navigate('/dashboard/yqms/quality-monitoring')}><img className="yqms-hub-illustration" src={`${process.env.PUBLIC_URL}/assets/yqms/quality-managers.png`} alt={labels[2]}/><strong>{labels[2]}</strong><small>{labels[3]}</small></button>
  </div></main>;
}
export function QCWorkspace() {
  const navigate = useNavigate();
  const labels = useHubCopy();
  return <><nav className="yqms-workspace-back"><button onClick={() => navigate('/dashboard/submenu/yqms')}><ArrowLeft size={17}/>{labels[5]}</button></nav><SubMenuView moduleIdOverride="yqms-workspace"/></>;
}
export function QualityMonitoring() {
  const navigate = useNavigate();
  const labels = useHubCopy();
  return <main className="yqms-hub"><nav className="yqms-workspace-back"><button onClick={() => navigate('/dashboard/submenu/yqms')}><ArrowLeft size={17}/>{labels[5]}</button></nav><h1>{labels[2]}</h1><section className="yqms-monitoring-empty"><Activity size={44}/><h2>{labels[2]}</h2><p>{labels[4]}</p></section></main>;
}
