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
