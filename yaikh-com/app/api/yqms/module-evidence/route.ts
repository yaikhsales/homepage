import {NextResponse} from 'next/server';
import {GridFSBucket,ObjectId} from 'mongodb';
import {Readable} from 'stream';
import {getDb} from '@/lib/mongo';
import {MODULES,viewer,padViewer,sameOrigin,noStore,text} from '@/lib/yqms-standard';
export const dynamic='force-dynamic';export const runtime='nodejs';
const bad=(error:string,status=400)=>NextResponse.json({ok:false,error},{status,headers:noStore});
const maximum=8*1024*1024;
function fileType(b:Buffer){if(b[0]===255&&b[1]===216&&b[2]===255)return 'image/jpeg';if(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return 'image/png';if(b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP')return 'image/webp';if(b.toString('ascii',0,5)==='%PDF-')return 'application/pdf';return null;}
export async function POST(request:Request){
 if(!sameOrigin())return bad('Invalid origin.',403);
 const module=new URL(request.url).searchParams.get('module')||'';
 if(!MODULES.includes(module))return bad('Unknown module.');const actor=viewer()||padViewer(module);if(!actor)return bad('Authorise this pad before uploading evidence.',401);
 if(Number(request.headers.get('content-length')||0)>maximum+65536)return bad('Use a photo or PDF no larger than 8 MB.',413);
 try{const form=await request.formData(),file=form.get('file');if(!(file instanceof File)||!file.size||file.size>maximum)return bad('Select a photo or PDF no larger than 8 MB.');const bytes=Buffer.from(await file.arrayBuffer()),type=fileType(bytes);if(!type)return bad('Use a JPEG, PNG, WebP photo or a PDF document.');
  const name=file.name.replace(/[^a-zA-Z0-9._ -]/g,'_').slice(0,160)||'inspection-evidence',db=await getDb(),bucket=new GridFSBucket(db,{bucketName:'yqms_evidence'}),upload=bucket.openUploadStream(name,{metadata:{module,actor,at:new Date(),contentType:type,category:text(form.get('category'),120)}});
  await new Promise<void>((resolve,reject)=>{upload.on('finish',()=>resolve());upload.on('error',reject);upload.end(bytes);});
  return NextResponse.json({ok:true,file:{id:String(upload.id),name,type,size:file.size,url:`/api/yqms/module-evidence?module=${encodeURIComponent(module)}&id=${upload.id}`}},{status:201,headers:noStore});
 }catch{return bad('Evidence could not be uploaded. Keep the file and try again.',503);}
}
export async function GET(request:Request){
 const u=new URL(request.url),module=u.searchParams.get('module')||'',id=u.searchParams.get('id')||'';
 if(!MODULES.includes(module)||!ObjectId.isValid(id))return bad('Evidence not found.',404);if(!viewer()&&!padViewer(module))return bad('Sign in or authorise this module pad to view evidence.',401);
 try{const db=await getDb(),bucket=new GridFSBucket(db,{bucketName:'yqms_evidence'}),file=await bucket.find({_id:new ObjectId(id),'metadata.module':module}).next();if(!file)return bad('Evidence not found in this module.',404);
  const stream=bucket.openDownloadStream(file._id);return new Response(Readable.toWeb(stream) as ReadableStream,{headers:{...noStore,'Content-Type':file.metadata?.contentType||'application/octet-stream','Content-Disposition':`inline; filename="${file.filename.replace(/["\r\n]/g,'_')}"`,'X-Content-Type-Options':'nosniff','Content-Security-Policy':"sandbox; default-src 'none'"}});
 }catch{return bad('Evidence is unavailable. Try again.',503);}
}
