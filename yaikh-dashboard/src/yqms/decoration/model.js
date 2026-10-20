import { METHODS } from './knowledge';
export const STORAGE_KEY='yai-decoration-quality-demo-v1';
export const JOBS=[
  ['DEC-101','YAIDD11','STY-1015','Customer BB','Navy','screen',200],
  ['DEC-102','YAIBB24','STY-5227','Customer BB','Black','dtg',120],
  ['DEC-103','YAICC18','STY-7731','Customer CC','Green','dtf',200],
  ['DEC-104','YAIDD57','STY-1196','Customer DD','White','htv',150],
  ['DEC-105','YAIAA32','STY-7168','Customer AA','White','embroidery',85],
  ['DEC-106','YAICC48','STY-2058','Customer BB','Blue','embroidery',180],
].map(([id,mo,style,buyer,colour,method,qty],i)=>{
  const params=METHODS[method].params.map(p=>[...p]);if(method==='embroidery'&&i===5)params[1]=['Program stitches','stitches',8200,8200,8200];
  return {id,mo,style,buyer,colour,method,qty,params,po:`PO-${mo}-01`,artwork:`ART-${style}-R03`,reference:`REF-${id}-03`,recipe:`DEMO-${id}-P02`,machine:`${method==='embroidery'?'EMB':'PR'}-${i+1}`,materialLot:`LOT-${mo}-01`,materials:method==='embroidery'?`Demo polyester thread TH-${i+1}; backing BK-${i+1}`:`Demo ${method} system MAT-${i+1}`,width:[100,120,90,80,70,85][i],height:[60,70,50,40,45,55][i],placement:80,tolerance:2,owner:method==='embroidery'?'Embroidery supervisor':'Printing supervisor'};
});
export const jobFor=id=>JOBS.find(j=>j.id===id);
export function requiredTests(job,stage){return stage==='printing'||stage==='embroidery'?METHODS[job.method].inline:METHODS[job.method].tests;}
export function latest(records,jobId,stage){return records.filter(r=>r.jobId===jobId&&r.stage===stage).sort((a,b)=>b.createdAt-a.createdAt)[0];}
export function assess(record,records){
  const job=jobFor(record.jobId),profile=METHODS[job.method],hold=[],pending=[],refs=[];
  if(record.stage!=='first'){
    const first=latest(records,job.id,'first');if(first)refs.push(first.id);if(!first||first.status!=='RELEASED')hold.push('First-output approval is missing or held.');
  }
  if(record.stage==='qa'){
    const production=latest(records,job.id,job.method==='embroidery'?'embroidery':'printing');if(production)refs.push(production.id);if(!production||production.status!=='RELEASED')hold.push('Production inspection / correction is not released.');
  }
  const sample=record.stage==='first'?5:20;
  if(!record.evidence?.trim())pending.push('Test / retained-reference evidence is missing.');
  if(record.checked<sample)pending.push(`Demo plan requires ${sample} checked pieces.`);
  if(record.rejected>0){hold.push(`${record.rejected} defective pieces require containment and reinspection.`);if(!record.action?.trim()||!record.holdLocation?.trim()||Number(record.containedQty)<record.rejected)hold.push('Containment quantity/location or corrective action is incomplete.');}
  if(record.findings.some(f=>Number(f.count)>0&&f.severity==='Critical'))hold.push('Critical finding requires QA disposition.');
  for(const [key,target] of [['width',job.width],['height',job.height],['placement',job.placement]]){
    if(record.measurements[key]===''||record.measurements[key]===undefined)pending.push(`${key} measurement is missing.`);
    else if(Math.abs(Number(record.measurements[key])-target)>job.tolerance)hold.push(`${key} is outside the demo ±${job.tolerance} mm limit.`);
  }
  job.params.forEach(([name,unit,target,min,max],i)=>{const value=record.params[i];if(value===''||value===undefined)pending.push(`${name} is missing.`);else if(Number(value)<min||Number(value)>max)hold.push(`${name} is outside the approved demo window.`);});
  ['Artwork / colour match','Appearance / placement',...requiredTests(job,record.stage)].forEach(name=>{if(record.tests[name]==='FAIL')hold.push(`${name} failed.`);else if(record.tests[name]!=='PASS')pending.push(`${name} is pending.`);else if(!record.testDetails?.[name]?.observed?.trim()||!record.testDetails?.[name]?.report?.trim())pending.push(`${name} needs an observation and evidence reference.`);});
  return {status:hold.length?'HOLD':pending.length?'PENDING':'RELEASED',reasons:[...hold,...pending],upstreamRefs:refs,plan:`DEMO-ZERO-${sample}`};
}
export function draftFor(job,stage){return {jobId:job.id,stage,checked:stage==='first'?5:20,rejected:0,measurements:{width:job.width,height:job.height,placement:job.placement},params:job.params.map(x=>x[2]),tests:Object.fromEntries(['Artwork / colour match','Appearance / placement',...requiredTests(job,stage)].map(x=>[x,'PENDING'])),testDetails:{},findings:[],note:'',action:'',materials:job.materials,instrument:job.method==='embroidery'?'TG-DEMO-02':'TP-DEMO-04',containedQty:0,holdLocation:'',due:'Before next handoff',inspector:'QA demo inspector',machine:job.machine,bundle:`${job.mo}-B01`,scope:`${job.materialLot} / size M / colour ${job.colour}`,evidence:'',createdAt:Date.now()};}
export function seedRecords(){
  const records=[];let n=0;
  ['first','production','qa'].forEach(stage=>JOBS.forEach((job,i)=>{
    const actualStage=stage==='production'?(job.method==='embroidery'?'embroidery':'printing'):stage;
    const record=draftFor(job,actualStage);record.id=`DQA-${String(++n).padStart(3,'0')}`;record.createdAt=Date.UTC(2026,9,19,22,n);record.tests=Object.fromEntries(Object.keys(record.tests).map(k=>[k,'PASS']));record.evidence=`DEMO-EV-${record.id} / retained reference ${job.reference}`;record.testDetails=Object.fromEntries(Object.keys(record.tests).map(name=>[name,{observed:'Matches the approved demo criterion',report:`DEMO-TEST-${record.id}`} ]));record.note='Simulated record for demonstration.';
    if(i===1&&stage==='first'){record.tests['Wash durability']='PENDING';record.note='DTG wash evidence is not yet available.';}
    if(i===4&&stage==='production'){record.rejected=2;record.findings=[{code:'Puckering / distortion',severity:'Major',count:2}];record.action='Hold the identified bundle, adjust stabilisation and reinspect after unhooping.';record.containedQty=job.qty;record.holdLocation='QA hold rack E-02';}
    if(i===2&&stage==='qa'){record.tests['Wash durability']='PENDING';record.note='Transfer wash result still awaited.';}
    Object.assign(record,assess(record,records));records.push(record);
  }));return records;
}
export function loadRecords(){try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY));if(Array.isArray(value)&&value.length&&value.every(r=>jobFor(r.jobId)&&['first','printing','embroidery','qa'].includes(r.stage)&&r.id&&r.tests&&r.measurements&&Array.isArray(r.params)&&Array.isArray(r.findings)))return value;}catch{}return seedRecords();}
