import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProjectCoreClient, toLeadRequest } from '../../src/lib/projectCoreClient.js';
import { assertLocalOrigin } from '../../scripts/project-core/local-web.mjs';

test('adapter rejects disabled mode without a request', async () => {
 const client = createProjectCoreClient({enabled:()=>false,fetchImpl:()=>{throw new Error('must not fetch');}});
 await assert.rejects(client.initialize(), /LOCAL_CORE_DISABLED/);
});
test('request mapping is lead.v1 and never forwards arbitrary authority', () => {
 const body = toLeadRequest({name:' Synthetic ',email:'a@example.invalid',locality:'Local',message:'Work',consent:true,user_id:'fake',client_id:'fake'},'key');
 assert.deepEqual(Object.keys(body),['schema_version','idempotency_key','source','project','preferences','attachment_refs','intent','contact','consent']);
 assert.equal(body.project.category,'consulta'); assert.equal(body.contact.name,'Synthetic'); assert.equal(body.attachment_refs.length,0);
 assert.ok(!JSON.stringify(body).includes('fake'));
});
test('proxy rejects remote, production, URL credentials, paths and ambiguous loopback names', () => {
 for(const origin of ['https://127.0.0.1:1','http://localhost:5000','http://example.invalid:5000','http://127.0.0.1:5000/path','http://user:pass@127.0.0.1:5000']) assert.throws(()=>assertLocalOrigin(origin));
 assert.equal(assertLocalOrigin('http://127.0.0.1:5000').hostname,'127.0.0.1');
});
test('an expired submit does not create a fresh intake or lose its key/body', async () => {
 let posts=0;const bodies=[];
 const client=createProjectCoreClient({enabled:()=>true,fetchImpl:async(path,options)=>{
  if(path.endsWith('/current')) return new Response('{}',{status:401});
  if(path.endsWith('/intake-sessions')) {posts++;return Response.json({csrf_token:'a'.repeat(64)});}
  bodies.push(options.body);return new Response('{}',{status:401});
 }});
 const values={name:'Synthetic',email:'a@example.invalid',locality:'Local',message:'Work',consent:true};
 await assert.rejects(client.submit(values));await assert.rejects(client.submit({...values,message:'changed'}));
 assert.equal(posts,1);assert.equal(bodies[0],bodies[1]);
});

const ids={project_id:'00000000-0000-4000-8000-000000000001',conversation_id:'00000000-0000-4000-8000-000000000002'};
const publicView=()=>({conversation:{id:ids.conversation_id,project_id:ids.project_id,mode:'paused',revision:1},events:[],can_message:true,can_handoff:false});

test('canonical auto mode is displayable; unknown modes still fail closed',async()=>{
 for(const mode of ['auto','invented']) {
  const view=publicView();view.conversation.mode=mode;
  const client=createProjectCoreClient({enabled:()=>true,fetchImpl:async path=>Response.json(path.endsWith('/current')?{csrf_token:'a'.repeat(64),receipt:null}:view)});
  if(mode==='auto') assert.equal((await client.thread(ids)).mode,'auto');
  else await assert.rejects(client.thread(ids),/INVALID_PUBLIC_THREAD/);
 }
});
test('visitor adapter fails closed on internal timeline content or actor identifiers',async()=>{
 for(const event of [
  {visibility:'internal',actor_user_id:null},
  {visibility:'client',actor_user_id:ids.project_id},
 ]) {
  const client=createProjectCoreClient({enabled:()=>true,fetchImpl:async path=>Response.json(path.endsWith('/current')?{csrf_token:'a'.repeat(64),receipt:null}:{...publicView(),events:[{id:ids.project_id,sequence:1,kind:'message',content:'private',created_at:'date',...event}]})});
  await assert.rejects(client.thread(ids),/INVALID_PUBLIC_THREAD/);
 }
});
test('message retry preserves original body and key, and cannot switch thread',async()=>{
 const bodies=[];let failure=true;
 const client=createProjectCoreClient({enabled:()=>true,fetchImpl:async(path,options)=>{
  if(path.endsWith('/current'))return Response.json({csrf_token:'a'.repeat(64),receipt:null});
  bodies.push(options.body);return failure?new Response('{}',{status:503}):Response.json(publicView());
 }});
 await assert.rejects(client.message(ids,'original'));
 await assert.rejects(client.message({...ids,conversation_id:ids.project_id},'other'),/PENDING_THREAD_MISMATCH/);
 failure=false;await client.message(ids,'edited');assert.equal(bodies[0],bodies[1]);
 await client.message(ids,'next');assert.notEqual(bodies[1],bodies[2]);
});
