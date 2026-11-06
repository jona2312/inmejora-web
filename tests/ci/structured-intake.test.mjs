import '../../scripts/ci/offline-guard.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
import { localCoreEnabled, toLeadRequest, createProjectCoreClient } from '../../src/lib/projectCoreClient.js';

const values = {name:'Cliente sintético',email:'visitor@example.invalid',locality:'Quilmes',
  message:'Quiero pintar el ambiente de mi casa.',consent:true};

test('G4 preserves a measurement declaration in its structured intake field without deriving area or confirmation',()=>{
  for (const declared of ['3 x 4 m', 'Aproximadamente 12 m2', 'No sé si son 12 o 15 m2']) {
    const request=toLeadRequest({...values,measurements:` ${declared} `},randomUUID());
    assert.deepEqual(request.project.measurements,{declared});
    assert.equal(request.project.description,values.message);
    assert.deepEqual(Object.keys(request.project.measurements),['declared']);
  }
});

test('G4 preserves absence, not an invented measurement',()=>{
  for(const measurements of [undefined,'','   '])
    assert.equal(toLeadRequest({...values,measurements},randomUUID()).project.measurements,null);
});

test('G4 sends literal customer quantities, never inferred, confirmed or corrected authority',()=>{
  const request=toLeadRequest({...values,measurements:'12 m2',status:'confirmed',confirmed:true,project_id:randomUUID()},randomUUID());
  assert.deepEqual(request.project.measurements,{declared:'12 m2'});
  assert.equal(request.project.status,undefined);
  assert.equal(request.project.id,undefined);
});

test('built controlled intake requires the exact opt-in profile and HTTPS; ordinary builds stay disabled',()=>{
  const https={protocol:'https:',hostname:'staging.example.invalid'};
  assert.equal(localCoreEnabled({PROD:true,MODE:'project-core-controlled'},https),true);
  for(const env of [{PROD:true,MODE:'production'},{PROD:true,MODE:'ci'},{DEV:true,MODE:'project-core-controlled'},{}])
    assert.equal(localCoreEnabled(env,https),false);
  for(const protocol of ['http:','file:','data:'])
    assert.equal(localCoreEnabled({PROD:true,MODE:'project-core-controlled'},{...https,protocol}),false);
  assert.equal(localCoreEnabled({DEV:true,MODE:'project-core-local'},{protocol:'http:',hostname:'127.0.0.1'}),true);
  assert.equal(localCoreEnabled({DEV:true,MODE:'project-core-local'},{protocol:'http:',hostname:'staging.example.invalid'}),false);
});

test('a controlled build grants no session or permission and never falls back after admission denial',async()=>{
  const calls=[];
  const client=createProjectCoreClient({enabled:()=>true,fetchImpl:async(path,options)=>{
    calls.push({path,options});return {ok:false,status:path.endsWith('/current')?401:403};
  }});
  await assert.rejects(client.submit(values),{code:'CORE_HTTP_403'});
  assert.deepEqual(calls.map(c=>c.path),['/api/v1/intakes/current','/api/v1/intake-sessions']);
  for(const {options} of calls){
    assert.equal(options.credentials,'same-origin');assert.equal(options.redirect,'error');
    assert.equal(options.headers.Authorization,undefined);
    assert.equal(options.headers['x-intake-invitation'],undefined);
  }
});
