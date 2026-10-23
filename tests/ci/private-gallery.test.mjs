import '../../scripts/ci/offline-guard.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
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
test('cross-project, conversation drift, internal fields, malformed dates and duplicate IDs reject',async()=>{
  const variants=[{...data,project_id:randomUUID()},{...data,conversation_id:randomUUID()},
    {...data,photos:[{...data.photos[0],conversation_id:randomUUID()}]},
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
