import '../../scripts/ci/offline-guard.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';
import { z } from 'zod';
import { createProjectCoreClient } from '../../src/lib/projectCoreClient.js';
import { rendersAPI } from '../../src/utils/rendersAPI.js';
import { unavailableSubscription } from '../../src/contexts/unavailableSubscription.js';

const context={project_id:randomUUID(),conversation_id:randomUUID()};
const data={schema_version:'private-gallery.v1',...context,photos:[{id:randomUUID(),conversation_id:context.conversation_id,
  media_type:'image/png',created_at:'2026-10-23T12:00:00.000Z',source:'web_upload'}],render_generation:{enabled:false,status:'BLOCKED_SOURCE_EXPORT'}};
function client(result=data,status=200){
  const calls=[];
  return {calls,api:createProjectCoreClient({enabled:()=>true,fetchImpl:async(path,options)=>{
    calls.push({path,options});
    return path==='/api/v1/intakes/current' ? {ok:true,json:async()=>({csrf_token:'x'.repeat(64),receipt:null})} : {ok:status===200,status,json:async()=>result};
  }})};
}
test('gallery validates canonical IDs, never accepts a provider URL and uses same-origin session',async()=>{
  const {api,calls}=client(); assert.deepEqual(await api.gallery(context),data);
  assert.equal(calls.length,2); assert.equal(calls[1].options.credentials,'same-origin');
  assert.equal(calls[1].options.redirect,'error');
  assert.equal(api.galleryPhotoPath(context,data.photos[0].id),`/api/v1/projects/${context.project_id}/gallery/${data.photos[0].id}`);
  assert.throws(()=>api.galleryPhotoPath(context,'https://example.invalid/a'),/INVALID_PHOTO_ID/);
  assert.throws(()=>api.galleryPhotoPath({...context,project_id:'../outside'},data.photos[0].id),/INVALID_THREAD_IDS/);
});
test('render results require a succeeded matching job and reject foreign project, paths and invented pending image',async()=>{
  const id=randomUUID(),attempt=randomUUID();
  const payload={schema_version:'render-gallery.v1',project_id:context.project_id,
    results:[{id,attempt_id:attempt,conversation_id:context.conversation_id,media_type:'image/png',created_at:'2026-10-23T12:00:00.000Z',artifact_sha256:'a'.repeat(64),explanation:null}],
    jobs:[{attempt_id:attempt,conversation_id:context.conversation_id,state:'succeeded'}]};
  const {api}=client(payload);assert.deepEqual(await api.renderResults(context),payload);
  assert.equal(api.renderResultPath(context,id),`/api/v1/projects/${context.project_id}/render-results/${id}`);
  assert.throws(()=>api.renderResultPath(context,'../private'),/INVALID_PHOTO_ID/);
  for(const invalid of [{...payload,project_id:randomUUID()},{...payload,results:[{...payload.results[0],url:'https://example.invalid'}]},
    {...payload,jobs:[{...payload.jobs[0],state:'pending'}]},{...payload,jobs:[{...payload.jobs[0],conversation_id:randomUUID()}]},
    {...payload,results:[payload.results[0],payload.results[0]]}])
    await assert.rejects(client(invalid).api.renderResults(context),/INVALID_RENDER_GALLERY/);
  for(const state of ['pending','uncertain','in_review','failed']) assert.equal((await client({...payload,results:[],jobs:[{...payload.jobs[0],state}]}).api.renderResults(context)).results.length,0);
});
test('feedback retries exact key after lost response; conflicting action cannot become another mutation',async()=>{
  const artifact_id=randomUUID(),attempt_id=randomUUID(),artifact_sha256='a'.repeat(64),bodies=[];
  const payload={schema_version:'render-feedback.v1',project_id:context.project_id,revision:1,can_feedback:true,can_select:true,can_adjust:true,
    feedback:{revision:1,artifact_id,attempt_id,artifact_sha256,confirmed_by_customer:true,action:'select',created_at:'2026-10-23T12:00:00.000Z'}};
  const api=createProjectCoreClient({enabled:()=>true,fetchImpl:async(path,options)=>{
    if(path==='/api/v1/intakes/current')return {ok:true,json:async()=>({csrf_token:'x'.repeat(64),receipt:null})};
    bodies.push(JSON.parse(options.body));assert.equal(options.headers['X-CSRF-Token'],'x'.repeat(64));
    if(bodies.length===1)throw Error('Synthetic lost response');return {ok:true,json:async()=>payload};
  }});
  const input={artifact_id,attempt_id,artifact_sha256,action:'select',expected_revision:0};
  await assert.rejects(api.feedback(context,input),/CORE_UNAVAILABLE/);
  await assert.rejects(api.feedback(context,{artifact_id,action:'adjust',expected_revision:0}),/PENDING_FEEDBACK_MISMATCH/);
  for(const different of [{attempt_id:randomUUID()},{artifact_sha256:'b'.repeat(64)},{expected_revision:1}])
    await assert.rejects(api.feedback(context,{...input,...different}),/PENDING_FEEDBACK_MISMATCH/);
  assert.deepEqual(await api.feedback(context,input),payload);assert.deepEqual(bodies[0],bodies[1]);
  await assert.rejects(client({...payload,revision:2}).api.renderFeedback(context),/INVALID_RENDER_FEEDBACK/);
  await assert.rejects(client({...payload,project_id:randomUUID()}).api.renderFeedback(context),/INVALID_RENDER_FEEDBACK/);
});
test('a project gallery is readable from a second authorized conversation',async()=>{
  const second={...context,conversation_id:randomUUID()};
  assert.deepEqual(await client().api.gallery(second),data);
});

test('cross-project, internal fields, malformed dates and duplicate IDs reject',async()=>{
  const variants=[{...data,project_id:randomUUID()},
    {...data,photos:[{...data.photos[0],object_key:'private-storage-key'}]},
    {...data,photos:[{...data.photos[0],created_at:'not a date'}]},
    {...data,photos:[data.photos[0],data.photos[0]]},
    {...data,render_generation:{enabled:true,status:'READY'}},
    {...data,photos:[{...data.photos[0],url:'https://example.invalid'}]}];
  for(const invalid of variants) await assert.rejects(client(invalid).api.gallery(context),/INVALID_PRIVATE_GALLERY/);
});
test('unavailable and expired session never become empty successful gallery',async()=>{
  for(const status of [401,403,404,503]) await assert.rejects(client(null,status).api.gallery(context),new RegExp('CORE_HTTP_'+status));
  let calls=0;
  const disabled=createProjectCoreClient({enabled:()=>false,fetchImpl:async()=>{calls++;throw Error('unexpected');}});
  await assert.rejects(disabled.gallery(context),/LOCAL_CORE_DISABLED/);assert.equal(calls,0);
});
test('legacy render operations deny without reading input, storage, network or credit tables',async()=>{
  const hostile=new Proxy({}, {get(){throw Error('Input must not be trusted');}});
  Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw Error('Browser identity forbidden');}});
  try {for(const operation of Object.values(rendersAPI)) await assert.rejects(operation(hostile),e=>e.code==='BLOCKED_SOURCE_EXPORT');}
  finally {delete globalThis.localStorage;}
});
test('credits are unavailable, never fake promotions or local success',async()=>{
  assert.equal(unavailableSubscription.creditsRemaining,null);
  assert.equal(unavailableSubscription.isEligibleForRender,false);
  for(const method of ['fetchUserSubscription','deductCredit','resetMonthlyCredits','finalizeProject','finalizeMiProyecto'])
    assert.equal(await unavailableSubscription[method](3),false);
  assert.equal(unavailableSubscription.currentSubscription,null);
  assert(Object.isFrozen(unavailableSubscription));
});

 test('project-scoped gallery keeps photo provenance from another conversation in the same authorized project', async () => {
  const payload={...data,photos:[{...data.photos[0],conversation_id:randomUUID()}]};
  assert.deepEqual(await client(payload).api.gallery(context),payload);
  await assert.rejects(client({...payload,project_id:randomUUID()}).api.gallery(context),/INVALID_PRIVATE_GALLERY/);
 });


test('G10 only explicit version tuples may be submitted for selection; no local identity is authority',async()=>{
  const artifact_id=randomUUID(),attempt_id=randomUUID(),artifact_sha256='c'.repeat(64);
  const empty={schema_version:'render-feedback.v1',project_id:context.project_id,revision:0,can_feedback:true,can_select:false,can_adjust:true,feedback:null};
  assert.deepEqual(await client(empty).api.renderFeedback(context),empty);
  const {api,calls}=client(empty);
  for(const invalid of [{artifact_id,action:'select',expected_revision:0},
    {artifact_id,attempt_id,artifact_sha256:'unknown',action:'select',expected_revision:0},
    {artifact_id,attempt_id,artifact_sha256,action:'select',expected_revision:0,actor_id:randomUUID()}])
    assert.throws(()=>api.feedback(context,invalid));
  assert.equal(calls.length,0);
  const denied=client(null,403);
  await assert.rejects(denied.api.feedback(context,{artifact_id,attempt_id,artifact_sha256,action:'select',expected_revision:0}),/CORE_HTTP_403/);
  assert.equal(denied.calls.filter(c=>c.options.method==='POST').length,1);
});

test('G10 historical selection is preserved without turning it into customer consent',async()=>{
  const historical={schema_version:'render-feedback.v1',project_id:context.project_id,revision:1,can_feedback:true,can_select:false,can_adjust:true,
    feedback:{revision:1,artifact_id:randomUUID(),action:'select',created_at:'2026-10-23T12:00:00.000Z',attempt_id:null,artifact_sha256:null,confirmed_by_customer:false}};
  assert.equal((await client(historical).api.renderFeedback(context)).feedback.confirmed_by_customer,false);
  await assert.rejects(client({...historical,feedback:{...historical.feedback,confirmed_by_customer:true}}).api.renderFeedback(context),/INVALID_RENDER_FEEDBACK/);
  await assert.rejects(client({...historical,can_select:'yes'}).api.renderFeedback(context),/INVALID_RENDER_FEEDBACK/);
});

test('G10 adjustment keeps its existing contract without a version confirmation or credit operation',async()=>{
  const artifact_id=randomUUID(),payload={schema_version:'render-feedback.v1',project_id:context.project_id,revision:1,can_feedback:true,can_select:false,can_adjust:true,
    feedback:{revision:1,artifact_id,action:'adjust',created_at:'2026-10-23T12:00:00.000Z',attempt_id:null,artifact_sha256:null,confirmed_by_customer:false}};
  const {api,calls}=client(payload);await api.feedback(context,{artifact_id,action:'adjust',expected_revision:0});
  const posted=JSON.parse(calls.find(c=>c.options.method==='POST').options.body);
  assert.deepEqual(Object.keys(posted).sort(),['action','artifact_id','expected_revision','request_key']);
  assert.equal(calls.some(c=>/settle|credits|provider/.test(c.path)),false);
});


test('G10 reproduced parent rejects current Core gallery/feedback while the child accepts them',async()=>{
  const contextVm=createContext({setTimeout,clearTimeout,AbortController});
  const source=execFileSync('git',['show','cef7f965502ce7d6ee4a51b9102cddb96dab416c:src/lib/projectCoreClient.js'],{encoding:'utf8'});
  const module=new SourceTextModule(source,{context:contextVm});
  await module.link(name=>{assert.equal(name,'zod');return new SyntheticModule(['z'],function(){this.setExport('z',z);},{context:contextVm});});await module.evaluate();
  const attempt_id=randomUUID(),payload={schema_version:'render-gallery.v1',project_id:context.project_id,
    results:[{id:randomUUID(),attempt_id,conversation_id:context.conversation_id,media_type:'image/png',created_at:'2026-11-23T12:00:00.000Z',artifact_sha256:'a'.repeat(64),explanation:{geometry_lock:'conservar',changed:['Pintura sintetica'],kept:['Aberturas'],source:'brief'}}],
    jobs:[{attempt_id,conversation_id:context.conversation_id,state:'succeeded'}]};
  const fetchImpl=async path=>({ok:true,json:async()=>path==='/api/v1/intakes/current'?{csrf_token:'a'.repeat(64),receipt:null}:payload});
  const parent=module.namespace.createProjectCoreClient({enabled:()=>true,fetchImpl});
  await assert.rejects(parent.renderResults(context),/INVALID_RENDER_GALLERY/);
  assert.deepEqual(await client(payload).api.renderResults(context),payload);
  const feedback={schema_version:'render-feedback.v1',project_id:context.project_id,revision:0,can_feedback:true,can_select:false,can_adjust:true,feedback:null};
  const parentFeedback=module.namespace.createProjectCoreClient({enabled:()=>true,fetchImpl:async path=>({ok:true,json:async()=>path==='/api/v1/intakes/current'?{csrf_token:'a'.repeat(64),receipt:null}:feedback})});
  await assert.rejects(parentFeedback.renderFeedback(context),/INVALID_RENDER_FEEDBACK/);
  assert.deepEqual(await client(feedback).api.renderFeedback(context),feedback);
});
