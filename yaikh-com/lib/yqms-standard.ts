import { cookies, headers } from 'next/headers';
import { COOKIE_NAME, verifySession } from './auth';
export const MODULES=['pre-final','final-inspection','buyer-final','qc-file','pre-production-meeting','cut-panel-inspection','first-output-cutting','qa-cutting','cutting-inspection','first-output-print','printing-inspection','embroidery-inspection','qa-print','fin-check'];
export const PAD_COOKIE='yqms_standard_pad';
export const noStore={'Cache-Control':'private, no-store'};
export function viewer(){return verifySession(cookies().get(COOKIE_NAME)?.value);}
export function padViewer(module:string){const value=verifySession(cookies().get(PAD_COOKIE)?.value);if(!value)return null;const [scope,key,expiry]=value.split(':');return scope==='quality-pad'&&key===module&&Number(expiry)>Date.now()?`Floor pad · ${module}`:null;}
export function sameOrigin(){const origin=headers().get('origin'),host=headers().get('x-forwarded-host')||headers().get('host');try{return Boolean(origin&&host&&new URL(origin).host===host);}catch{return false;}}
let directory:{at:number;people:any[]}|null=null;
export async function qaDirectory(){
 if(directory&&Date.now()-directory.at<300000)return directory.people;
 const base=(process.env.M1_LLM_URL||'').replace(/\/$/,''),token=process.env.M1_LLM_TOKEN;
 if(!base||!token)throw new Error('YHR directory is unavailable.');
 async function page(n:number){const r=await fetch(`${base}/sim/view`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({module:'hr',view:'employees',department:'qa',page:n}),signal:AbortSignal.timeout(15000),cache:'no-store'});if(!r.ok)throw new Error('YHR directory is unavailable.');const d=await r.json();if(!d.ok)throw new Error('YHR directory is unavailable.');return d;}
 const first=await page(1),rest=await Promise.all(Array.from({length:Math.min(20,Math.max(0,(first.pages||1)-1))},(_,i)=>page(i+2)));
 const people=[...(first.rows||[]),...rest.flatMap(p=>p.rows||[])];directory={at:Date.now(),people};return people;
}
export async function manager(id:string){const people=await qaDirectory();return people.find(p=>p.emp_no===id&&['manager','supervisor'].includes(p.level));}
export const text=(v:unknown,max=2000)=>typeof v==='string'?v.trim().slice(0,max):'';
