import { createHash, timingSafeEqual } from 'crypto';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { makeSessionValue } from '@/lib/auth';
import { MODULES, PAD_COOKIE, noStore, padViewer, sameOrigin } from '@/lib/yqms-standard';
export const dynamic='force-dynamic';export const runtime='nodejs';
const attempts=new Map<string,{count:number;until:number}>();
export async function GET(request:Request){const module=new URL(request.url).searchParams.get('module')||'';return NextResponse.json({ok:MODULES.includes(module)&&Boolean(padViewer(module))},{headers:noStore});}
export async function POST(request:Request){
 if(!sameOrigin())return NextResponse.json({error:'Invalid origin.'},{status:403,headers:noStore});
 let b;try{b=await request.json();}catch{return NextResponse.json({error:'Invalid login.'},{status:400});}
 if(!MODULES.includes(b.module)||typeof b.code!=='string'||!/^\d{6}$/.test(b.code))return NextResponse.json({error:'Enter a six-digit code.'},{status:400,headers:noStore});
 const ip=headers().get('x-forwarded-for')?.split(',')[0]||'unknown',key=createHash('sha256').update(ip).digest('hex'),old=attempts.get(key),now=Date.now();
 if(old&&old.until>now&&old.count>=5)return NextResponse.json({error:'Too many attempts. Try again in 15 minutes.'},{status:429,headers:noStore});
 const a=createHash('sha256').update(b.code).digest(),z=createHash('sha256').update(process.env.YQMS_FLOOR_PIN||'111111').digest();
 if(!timingSafeEqual(a,z)){if(attempts.size>10000)for(const [k,v]of attempts)if(v.until<now)attempts.delete(k);attempts.set(key,{count:old&&old.until>now?old.count+1:1,until:now+900000});return NextResponse.json({error:'Incorrect code.'},{status:401,headers:noStore});}
 attempts.delete(key);const response=NextResponse.json({ok:true},{headers:noStore});response.cookies.set(PAD_COOKIE,makeSessionValue(`quality-pad:${b.module}:${now+28800000}`),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:28800});return response;
}
export async function DELETE(){if(!sameOrigin())return NextResponse.json({error:'Invalid origin.'},{status:403});const r=NextResponse.json({ok:true},{headers:noStore});r.cookies.set(PAD_COOKIE,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:0});return r;}
