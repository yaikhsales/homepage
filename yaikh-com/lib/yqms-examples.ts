import examples from './yqms-example-data.json';
import {getDb} from './mongo';

// Explicitly fictional records. Never impersonate a YHR employee or product release.
export async function addModuleExamples(module:string){
 const bundle=(examples as Record<string,any>)[module];
 if(!bundle)throw new Error('Unknown example module.');
 const db=await getDb(),records=db.collection('yqms_standard_records'),events=db.collection('yqms_standard_events');
 await records.createIndex({module:1,requestId:1},{unique:true});
 await records.bulkWrite(bundle.records.map((r:any)=>({updateOne:{filter:{module,requestId:r.requestId},update:{$setOnInsert:r},upsert:true}})));
 await events.bulkWrite(bundle.events.map((e:any)=>({updateOne:{filter:{module,id:e.id},update:{$setOnInsert:e},upsert:true}})));
 return bundle.records.length;
}
