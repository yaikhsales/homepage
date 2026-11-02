import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SubMenuView from '../views/SubMenuView';
import './YQMSHub.css';
import { useTranslation } from '../translate/TranslationContext';

const copy = {
 en: ['QC Work space','Inspection tools, reports and compliance','Quality Monitoring','Quality monitoring workspace','No monitoring panels configured yet.','Back to YQMS','SOP','Quality process flow, roles and hand-offs'],
 km: ['កន្លែងធ្វើការ QC','ឧបករណ៍ត្រួតពិនិត្យ របាយការណ៍ និងការអនុលោមតាម','ការតាមដានគុណភាព','កន្លែងធ្វើការតាមដានគុណភាព','មិនទាន់មានផ្ទាំងតាមដានដែលបានកំណត់រចនាសម្ព័ន្ធទេ។','ត្រឡប់ទៅ YQMS','SOP','ដំណើរការគុណភាព តួនាទី និងការប្រគល់'],
 zh: ['QC 工作区','检验工具、报告与合规','质量监控','质量监控工作区','尚未配置监控面板。','返回 YQMS','SOP','质量流程、岗位与交接'],
 vi: ['Không gian làm việc QC','Công cụ kiểm tra, báo cáo và tuân thủ','Giám sát chất lượng','Không gian giám sát chất lượng','Chưa cấu hình bảng giám sát nào.','Quay lại YQMS','SOP','Luồng quy trình chất lượng, vai trò và bàn giao'],
 tl: ['Lugar ng trabaho ng QC','Mga kagamitan sa inspeksyon, ulat at pagsunod','Pagsubaybay sa kalidad','Lugar ng pagsubaybay sa kalidad','Wala pang nakaayos na panel ng pagsubaybay.','Bumalik sa YQMS','SOP','Daloy ng proseso ng kalidad, tungkulin at pagpapasa'],
 ms: ['Ruang kerja QC','Alat pemeriksaan, laporan dan pematuhan','Pemantauan Kualiti','Ruang kerja pemantauan kualiti','Belum ada panel pemantauan dikonfigurasi.','Kembali ke YQMS','SOP','Aliran proses kualiti, peranan dan serahan']
};
function useHubCopy() { const { language } = useTranslation(); return copy[language] || copy.en; }

export default function YQMSHub() {
  const navigate = useNavigate();
  const labels = useHubCopy();
  return <main className="yqms-hub"><h1>YQMS</h1><div className="yqms-hub-modules">
    <button onClick={() => navigate('/dashboard/submenu/yqms-workspace')}><img className="yqms-hub-illustration" src={`${process.env.PUBLIC_URL}/assets/yqms/qc-inspector.png`} alt={labels[0]}/><strong>{labels[0]}</strong><small>{labels[1]}</small></button>
    <button onClick={() => navigate('/dashboard/yqms/quality-monitoring')}><img className="yqms-hub-illustration" src={`${process.env.PUBLIC_URL}/assets/yqms/quality-managers.png`} alt={labels[2]}/><strong>{labels[2]}</strong><small>{labels[3]}</small></button>
    <button onClick={() => navigate('/dashboard/yqms/sop')}><img className="yqms-hub-illustration" src={`${process.env.PUBLIC_URL}/assets/yqms/sop-process.svg`} alt={labels[6]}/><strong>{labels[6]}</strong><small>{labels[7]}</small></button>
  </div></main>;
}
export function QCWorkspace() {
  const navigate = useNavigate();
  const labels = useHubCopy();
  return <><nav className="yqms-workspace-back"><button onClick={() => navigate('/dashboard/submenu/yqms')}><ArrowLeft size={17}/>{labels[5]}</button></nav><SubMenuView moduleIdOverride="yqms-workspace"/></>;
}
export { default as QualityMonitoring } from './monitoring/QualityMonitoring';
