import '../../scripts/ci/offline-guard.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {randomUUID} from 'node:crypto';
import {transformSync} from 'esbuild';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createProjectCoreClient} from '../../src/lib/projectCoreClient.js';

const context={project_id:randomUUID(),conversation_id:randomUUID()};
const quota={schema_version:'render-delivery-quota.v1',policy_version:'delivery-three.v1',initial_allowance:3,
  available:1,held:1,delivered:1,recharge_required:false,consumes_on:'private_delivery',payment_enabled:false};
const view=allowance=>({schema_version:'project-render-requests.v1',project_id:context.project_id,allowance,requests:[]});
function client(payload,status=200){
 const calls=[];
 return {calls,api:createProjectCoreClient({enabled:()=>true,fetchImpl:async(path,options)=>{
  calls.push({path,options});
  return path==='/api/v1/intakes/current'?{ok:true,json:async()=>({csrf_token:'x'.repeat(64),receipt:null})}:
   {ok:status===200,status,json:async()=>payload};
 }})};
}
test('quota comes only from authenticated existing project read and repeating it performs no mutation',async()=>{
 const {api,calls}=client(view(quota));
 assert.deepEqual(await api.renderAllowance(context),quota);assert.deepEqual(await api.renderAllowance(context),quota);
 const reads=calls.filter(c=>c.path.endsWith('/render-requests'));assert.equal(reads.length,2);
 assert.ok(reads.every(c=>c.options.method==='GET'&&c.options.credentials==='same-origin'&&c.options.redirect==='error'));
 assert.equal(calls.some(c=>c.options.method==='POST'),false);
});
test('explicit null preserves legacy; missing, foreign or malformed quota is not inferred',async()=>{
 assert.equal(await client(view(null)).api.renderAllowance(context),null);
 for(const invalid of [view(undefined),{...view(quota),project_id:randomUUID()},view({...quota,available:-1}),
  view({...quota,payment_enabled:true}),view({...quota,initial_allowance:4}),view({...quota,consumes_on:'selection'}),
  view({...quota,checkout_url:'https://example.invalid'})])
  await assert.rejects(client(invalid).api.renderAllowance(context),/INVALID_RENDER_ALLOWANCE/);
});
test('expired identity, denied intake and backend failure never become successful zero quota',async()=>{
 for(const status of [401,403,409,503])await assert.rejects(client(view(quota),status).api.renderAllowance(context),new RegExp('CORE_HTTP_'+status));
});
function gallery(allowance){
 const noEffect=()=>{throw Error('UNEXPECTED_EFFECT');};
 const data={project_id:context.project_id,photos:[],render_results_enabled:true};
 const values=[data,context,'',false,0,{project_id:context.project_id,results:[],jobs:[]},{can_select:true,can_adjust:true,feedback:null},allowance,'',false];
 let state=0;
 const fakeReact={...React,useEffect(){},useRef:initial=>({current:initial}),useState:()=>[values[state++],noEffect]};
 const module={exports:{}};
 runInNewContext(transformSync(readFileSync(new URL('../../src/components/renders/RenderGallerySection.jsx',import.meta.url),'utf8'),{loader:'jsx',format:'cjs'}).code,
  {module,exports:module.exports,require(name){if(name==='react')return fakeReact;if(name==='@/lib/projectCoreClient')return {createProjectCoreClient:()=>({}),localCoreEnabled:()=>true};throw Error('UNEXPECTED_IMPORT:'+name);}});
 return renderToStaticMarkup(React.createElement(module.exports.default,{client:{},context}));
}
test('actual Web gallery separates private delivery quota from exact client confirmation',()=>{
 const html=gallery(quota);assert.match(html,/Entregadas: 1/);assert.match(html,/Disponibles: 1/);assert.match(html,/aunque después lo descartes/);
 assert.doesNotMatch(html,/habilita la conciliación/);assert.match(html,/no aplica otro débito ni devuelve cupo/);
 assert.match(gallery(null),/habilita la conciliación/);
});
test('exhausted quota requests recarga without checkout; unavailable is not zero',()=>{
 const html=gallery({...quota,available:0,held:0,delivered:3,recharge_required:true});
 assert.match(html,/Recarga requerida/);assert.match(html,/pagos no están habilitados/);assert.doesNotMatch(html,/href=|checkout|mercadopago|stripe/i);
 const missing=gallery(undefined);assert.match(missing,/Cupo de renders: No disponible/);assert.doesNotMatch(missing,/Disponibles: 0|habilita la conciliación/);
});
