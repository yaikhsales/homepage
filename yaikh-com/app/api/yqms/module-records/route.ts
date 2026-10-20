import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongo';
import { MODULES, noStore, viewer, padViewer, sameOrigin, manager, qaDirectory, text } from '@/lib/yqms-standard';
import {addModuleExamples} from '@/lib/yqms-examples';
export const dynamic='force-dynamic';export const runtime='nodejs';
const collection='yqms_standard_records',eventsCollection='yqms_standard_events';
const bad=(error:string,status=400)=>NextResponse.json({ok:false,error},{status,headers:noStore});
const serialize=(r:any)=>({...r,_id:String(r._id)});
export async function GET(request:Request){
 const module=new URL(request.url).searchParams.get('module')||'';if(!MODULES.includes(module))return bad('Unknown module.');const actor=viewer()||padViewer(module);if(!actor)return bad('Sign in to Yai or authorise this pad.',401);
 if(!viewer())return NextResponse.json({ok:true,records:[],events:[],viewer:null},{headers:noStore});
 try{const db=await getDb(),records=await db.collection(collection).find({module}).sort({at:-1}).limit(1000).toArray(),events=viewer()?await db.collection(eventsCollection).find({module}).sort({at:-1}).limit(1000).toArray():[];const agentEvents=viewer()?await db.collection('yqms_decision_events').find({mode:module,source:'connected-agent'}).sort({at:-1}).limit(500).toArray():[];return NextResponse.json({ok:true,records:records.map(serialize),events:[...events,...agentEvents].map(serialize),viewer:viewer()},{headers:noStore});}catch{return bad('Saved quality records are unavailable. Nothing has been replaced with sample data.',503);}
}
export async function POST(request:Request){
 if(!sameOrigin())return bad('Invalid origin.',403);let b:any;try{const raw=await request.text();if(raw.length>250000)return bad('Record is too large.');b=JSON.parse(raw);}catch{return bad('Invalid record.');}
 const module=text(b.module,80);if(!MODULES.includes(module))return bad('Unknown module.');const desktop=viewer(),actor=desktop||padViewer(module);if(!actor)return bad('Authorise this pad before saving.',401);
 try{const db=await getDb(),coll=db.collection(collection),events=db.collection(eventsCollection),at=new Date();
 if(b.action==='examples'){
  if(!desktop)return bad('A signed-in desktop session is required to load training examples.',403);
  const count=await addModuleExamples(module);return NextResponse.json({ok:true,count},{headers:noStore});
 }
 if(b.action==='feed'){
  const r=b.record;if(!r||typeof r!=='object'||!text(r.order)||!r.payload||typeof r.payload!=='object')return bad('Order and original pad record are required.');
  const checked=Number(r.checked),rejected=Number(r.rejected);if(!Number.isInteger(checked)||checked<0||checked>1000000||!Number.isInteger(rejected)||rejected<0||rejected>checked)return bad('Invalid checked / rejected quantities.');
  const requestId=text(b.requestId,100);if(!/^[\w-]{16,100}$/.test(requestId))return bad('Submission reference is required.');
  await coll.createIndex({module:1,requestId:1},{unique:true});const old=await coll.findOne({module,requestId});if(old)return NextResponse.json({ok:true,record:serialize(old)},{headers:noStore});
  const record={module,requestId,id:`QMS-${randomUUID().slice(0,8).toUpperCase()}`,order:text(r.order,120),style:text(r.style,120),buyer:text(r.buyer,120),line:text(r.line,120),inspector:text(r.inspector,160),checked,rejected,status:text(r.status,60)||'PENDING REVIEW',payload:r.payload,source:'floor-record',at,actor,amendments:[]};
  const saved=await coll.insertOne(record);return NextResponse.json({ok:true,record:serialize({...record,_id:saved.insertedId})},{status:201,headers:noStore});
 }
 if(!desktop)return bad('A signed-in management session is required for report changes and CAP decisions.',403);
 const employeeId=text(b.employeeId,40),name=text(b.name,120),reason=text(b.reason),person=await manager(employeeId);if(!person||!name||!reason)return bad('Use a current YHR QA manager / supervisor ID, their name and a reason.');
 if(b.action==='amend'){
  if(!ObjectId.isValid(text(b.id,40)))return bad('Select an original report record.');const record=await coll.findOne({_id:new ObjectId(b.id),module});if(!record)return bad('Original record not found.',404);
  const checked=Number(b.checked),rejected=Number(b.rejected);if(!Number.isInteger(checked)||checked<0||checked>1000000||!Number.isInteger(rejected)||rejected<0||rejected>checked)return bad('Use valid whole report quantities.');
  const amendment={id:randomUUID(),at,employeeId,name,role:person.title||person.position||person.level,reason,checked,rejected,note:text(b.note),actor,report:text(b.report,120)};
  // One atomic append: the original feeder evidence is never overwritten.
  await coll.updateOne({_id:record._id,module},{$push:{amendments:amendment} as any});return NextResponse.json({ok:true},{headers:noStore});
 }
 if(b.action==='cap'){
  const issue=text(b.issue),rootCause=text(b.rootCause),correction=text(b.correction),preventive=text(b.preventive),ownerId=text(b.ownerId,60),due=text(b.due,40),verification=text(b.verification),state=text(b.state,40);
  if(!issue||!rootCause||!correction||!preventive||!ownerId||!due||!['OPEN','FINALISED'].includes(state)||Number.isNaN(Date.parse(due)))return bad('Complete issue, root cause, corrective/preventive actions, owner and due date.');
  if(!(await qaDirectory()).some(p=>p.emp_no===ownerId))return bad('The CAP owner must be an existing YHR QA employee ID.');
  if(state==='FINALISED'&&!verification)return bad('Finalisation requires verification evidence.');
  const caseId=text(b.caseId,100)||randomUUID();if(text(b.caseId,100)&&!await events.findOne({module,$or:[{id:caseId},{caseId}]}))return bad('The original CAP case is not in this module.');
  const item={module,caseId,id:randomUUID(),kind:'CAP decision',at,employeeId,name,role:person.title||person.position||person.level,reason,issue,rootCause,correction,preventive,ownerId,due,verification,state,recordId:text(b.recordId,100),actor,source:'human'};await events.insertOne(item);return NextResponse.json({ok:true},{status:201,headers:noStore});
 }
 return bad('Unknown action.');
 }catch(e:any){if(e?.code===11000)return bad('Submission already recorded. Refresh the dashboard.',409);return bad('The operation could not be saved. Check the YHR / database connection and try again.',503);}
}
