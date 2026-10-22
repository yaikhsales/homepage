import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile('ops/cloudflare/experience-router/worker.js','utf8');
const worker=(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).default;
let seen;
globalThis.fetch=async request=>{seen=request;return new Response('ok');};
for (const path of ['/experience','/experience/','/experience/dashboard/yhr?mode=services','/experience/index.html']) {
 const result=await worker.fetch(new Request('https://yaikh.com'+path,{headers:{cookie:'test=1',authorization:'test'}}));
 assert.equal(new URL(seen.url).pathname,'/experience/');
 assert.equal(seen.headers.get('cookie'),null);
 assert.equal(seen.headers.get('authorization'),null);
 assert.equal(result.headers.get('cache-control'),'no-store');
}
for (const path of ['/experience/static/js/main.js','/experience/assets/icon.png','/experience/IMG/icon.svg','/experience/manifest.json']) {
 await worker.fetch(new Request('https://yaikh.com'+path));assert.equal(new URL(seen.url).pathname,path);
}
await worker.fetch(new Request('https://yaikh.com/api/db-ping'));assert.equal(seen.url,'https://yaikh.com/api/db-ping');
console.log('Passed: SPA paths, assets, credential stripping, cache policy, API passthrough');
