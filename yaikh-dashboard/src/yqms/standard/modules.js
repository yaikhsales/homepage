export const MODULES={
 'qc-file':{title:'QC File',icon:'QC File',colour:'#b43b35',group:'PRE PRODUCTION',kind:'qc-file',role:'Quality Manager / delegated QC document reviewer',video:'/experience/assets/short-video-training/QC-File.mp4'},
 'pre-production-meeting':{title:'Pre Production Meeting',icon:'Pre Production Meeting',colour:'#b9363b',group:'PRE PRODUCTION',kind:'ppm',role:'Quality Manager / meeting chair'},
 'cut-panel-inspection':{title:'Cutting Panel Inspection',icon:'Cutting Panel Inspection',colour:'#7e42ce',group:'CUT',kind:'cut-panel',role:'Cutting quality leader / delegated supervisor',video:'/experience/assets/short-video-training/Cutting-panel.mp4'},
 'first-output-cutting':{title:'First Output Cutting',icon:'First Output Cutting',colour:'#a05b2a',group:'CUT',kind:'cut-audit',role:'Cutting quality leader / delegated supervisor'},
 'qa-cutting':{title:'QA Cutting',icon:'QA Cutting',colour:'#316eb3',group:'CUT',kind:'cut-audit',role:'QA auditor with independent supervisor review'},
 'cutting-inspection':{title:'Cutting Inspection',icon:'Cutting Inspection',colour:'#7545c5',group:'CUT',kind:'bundle',role:'Cutting quality checker / quality leader'},
 'first-output-print':{title:'First Output Printing Embroidery',icon:'First Output Printing Embroidery',colour:'#a76525',group:'DECORATION',kind:'decoration',mode:'first',role:'Printing / embroidery quality leader'},
 'printing-inspection':{title:'Printing Inspection',icon:'Printing Inspection',colour:'#296aa9',group:'DECORATION',kind:'decoration',mode:'printing',role:'Printing quality checker / quality leader'},
 'embroidery-inspection':{title:'Embroidery Inspection',icon:'Embroidery Inspection',colour:'#ac458b',group:'DECORATION',kind:'decoration',mode:'embroidery',role:'Embroidery quality checker / quality leader'},
 'qa-print':{title:'QA Printing Embroidery',icon:'QA Printing Embroidery',colour:'#21896b',group:'DECORATION',kind:'decoration',mode:'qa',role:'Independent decoration QA / quality supervisor'},
 'fin-check':{title:'Fincheck',icon:'Fin Check',colour:'#2c70ae',group:'YQMS',kind:'fincheck',role:'Final QA / brand QO with delegated supervisor review',video:'/experience/assets/yqms/Fin-Check/Fincheck.mp4'},
};
export const TABS=[['pad','QC pad'],['dashboard','Dashboard'],['report','Report'],['modify','Modify'],['adding','Adding'],['dr','DR']];
export function normalise(key,r){
 const kind=MODULES[key].kind;
 if(kind==='decoration')return {order:r.job?.mo||r.mo||r.jobId,style:r.job?.style||r.style,buyer:r.job?.buyer||r.buyer,line:r.machine,inspector:r.inspector,checked:Number(r.checked),rejected:Number(r.rejected),status:r.status,payload:r};
 if(kind==='fincheck')return {order:r.orderInfo?.id||r.order,style:r.orderInfo?.style,buyer:r.orderInfo?.buyer,line:r.line,inspector:r.inspector,checked:Number(r.checked),rejected:Number(r.defectiveCount||0),status:r.status,payload:r};
 return {order:r.mo||r.order||r.id||r.style,style:r.style||'',buyer:r.buyer||'',line:r.table||r.line||r.bundle||'',inspector:r.inspector||r.auditor||'',checked:Number(r.checked??r.inspected??r.samples??r.qty??1),rejected:Number(r.rejected??r.defects??0),status:r.status||((r.rejected||r.defects)?'HOLD':'PENDING REVIEW'),payload:r};
}
export function effective(r){const a=r.amendments?.at(-1);return a?{...r,checked:a.checked,rejected:a.rejected,reportNote:a.note,amendedBy:`${a.name} · ${a.employeeId}`}:{...r,reportNote:'',amendedBy:''};}
export function defectNames(r){const p=r.payload,issues=(p.findings||[]).map(f=>[f.code||'Finding',Number(f.count||1)]);for(const [name,result]of Object.entries(p.checks||p.tests||{}))if(['FAIL','Non-conform'].includes(result))issues.push([name,1]);if(Array.isArray(p.measurements))for(const m of p.measurements)if(m.actual!==null&&Math.abs(Number(m.actual)-Number(m.spec??m.target))>Number(m.tol??2)+1e-8)issues.push(['Measurement: '+(m.point||'point'),1]);if(!issues.length&&r.rejected)issues.push(['Defective pieces · classification pending',r.rejected]);return issues;}
