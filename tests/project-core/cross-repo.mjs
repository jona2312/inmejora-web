import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { chromium, expect } from '@playwright/test';
import { startLocalWeb } from '../../scripts/project-core/local-web.mjs';

const [core, root] = process.argv.slice(2);
if (!core || !root) throw new Error('Run through scripts/project-core/run.mjs');
await import(pathToFileURL(resolve(core,'tests/project-core/loopback-only.ts')).href);
const {harness} = await import(pathToFileURL(resolve(core,'tests/project-core/harness.ts')).href);
const h = await harness();
let closing = false;
h.admin.on('error',()=>{if(!closing)throw new Error('SYNTHETIC_CORE_DATABASE_DISCONNECTED');});
const portProbe=createServer();await new Promise(r=>portProbe.listen(0,'127.0.0.1',r));const port=portProbe.address().port;await new Promise(r=>portProbe.close(r));
let web, browser;
const evidence={core_sha:'cde1af7caccedb1ed33900a09900fe5b394ef44b',web_base:'14f1894ec2091497668b6a5c8609ef7fc36406f3',passed:[],requests:[],external:[],pageErrors:[],correlated:null};
const output=resolve(root,'.project-core-evidence');
async function record(name,fn){await fn();evidence.passed.push(name);console.log('PASS '+name);}
const contexts=[];
async function context() {
 const c=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block'});contexts.push(c);
 await c.addInitScript(()=>{if(globalThis.location.hostname === '127.0.0.1')globalThis.localStorage.setItem('inmejora_cookie_consent','essential');});
 await c.routeWebSocket('**/*',socket=>socket.close());
 await c.route('**/*',route=>{
  const r=route.request(),u=new URL(r.url());
  if (![web.origin,h.config.origin].includes(u.origin)){evidence.external.push(u.origin+u.pathname);return route.abort();}
  evidence.requests.push({method:r.method(),path:u.pathname,status:'requested'});return route.continue();
 });
 c.on('page',p=>p.on('pageerror',e=>evidence.pageErrors.push(e.message)));
 return c;
}
async function openForm(c,email='cross@example.invalid') {
 const p=await c.newPage();await p.goto(web.origin+'/contacto');
 await expect(p.getByRole('heading',{name:'Contactanos',exact:true})).toBeVisible({timeout:20000});
 await p.getByLabel('Nombre completo',{exact:true}).fill('Persona sintética Web');
 await p.getByLabel('Email',{exact:true}).fill(email);
 await p.getByLabel('Mensaje',{exact:true}).fill('Pintar las paredes del living: consulta desde Web real.');
 await p.getByLabel('Localidad',{exact:true}).fill('Ciudad sintética');
 await p.getByRole('checkbox').check();return p;
}
async function confirmed(p){await expect(p.getByRole('heading',{name:'Proyecto recibido',exact:true})).toBeVisible();return {
 project_id:await p.getByTestId('project-id').textContent(),conversation_id:await p.getByTestId('conversation-id').textContent()};}
async function noSuccess(p){await expect(p.getByRole('alert').first()).toBeVisible();await expect(p.getByRole('heading',{name:'Proyecto recibido',exact:true})).toHaveCount(0);}
async function call(c,path,method='GET',data,headers={}){return c.request.fetch(web.origin+'/api/v1'+path,{method,data,headers:{Origin:web.origin,...headers}});}
async function counts(){return (await h.admin.query(`SELECT (SELECT count(*)::int FROM public.clientes) clients,
 (SELECT count(*)::int FROM public.leads_inmejora) leads,(SELECT count(*)::int FROM public.preproyectos_inai) projects,
 (SELECT count(*)::int FROM inmejora_core.project_conversations) conversations`)).rows[0];}
try {
 await mkdir(output,{recursive:true});
 process.chdir(root); // Tailwind resolves its existing configuration from Web, not Dashboard.
 web=await startLocalWeb({coreOrigin:h.config.origin,root,port});
 browser=await chromium.launch({headless:true,args:['--disable-background-networking','--disable-component-update','--disable-sync','--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'],proxy:{server:'http://127.0.0.1:9',bypass:'127.0.0.1'}});
 const visitor=await context(),page=await openForm(visitor);
 let receipt,ids;
 await record('real /contacto → Core #39 COMMIT → receipt → correlated PostgreSQL chain',async()=>{
  const response=page.waitForResponse(r=>r.url().endsWith('/api/v1/leads')&&r.request().method()==='POST');
  await page.getByRole('button',{name:'Enviar Mensaje',exact:true}).click();const r=await response;assert.equal(r.status(),201);receipt=await r.json();ids=await confirmed(page);
  assert.equal(ids.project_id,receipt.project_id);assert.equal(ids.conversation_id,receipt.conversation_id);
  const row=(await h.admin.query(`SELECT p.id project_id,p.client_id,p.lead_id,c.id conversation_id,c.client_id conversation_client,l.project_id lead_project
   FROM public.preproyectos_inai p JOIN public.leads_inmejora l ON l.id=p.lead_id JOIN inmejora_core.project_conversations c ON c.project_id=p.id WHERE p.id=$1`,[receipt.project_id])).rows[0];
  assert.deepEqual(row,{...ids,client_id:receipt.client_id,lead_id:receipt.lead_id,conversation_client:receipt.client_id,lead_project:receipt.project_id});evidence.correlated={receipt,db:row};
  await page.screenshot({path:resolve(output,'web-confirmation.png'),fullPage:true});
 });
 await record('separate signed operator context → Dashboard CRM same project/client/conversation',async()=>{
  const operator=await context();await operator.addCookies([{name:'app_session_id',value:(await h.cookie('operator')).split('=')[1],url:h.config.origin,httpOnly:true,sameSite:'Strict'}]);
  const crm=await operator.newPage();await crm.goto(h.config.origin+'/dev/project-crm');
  await crm.getByRole('button',{name:'consulta · submitted',exact:true}).click();
  await expect(crm.getByTestId('crm-project')).toHaveText(ids.project_id);await expect(crm.getByText(ids.conversation_id,{exact:true})).toBeVisible();
  await expect(crm.getByText(receipt.client_id,{exact:true})).toBeVisible();await expect(crm.getByText('cross@example.invalid',{exact:true})).toBeVisible();
  await crm.getByRole('button',{name:'Tomar proyecto',exact:true}).click();await expect(crm.getByText('active · revisión 2',{exact:true})).toBeVisible();
  await crm.screenshot({path:resolve(output,'dashboard-crm.png'),fullPage:true});
 });
 await record('reload restores allowed Web context and current backend state without localStorage identity',async()=>{
  await page.reload();await confirmed(page);await expect(page.getByTestId('project-state')).toHaveText('active');
  assert.equal(await page.evaluate(()=>Object.entries(globalThis.localStorage).some(([k,v])=>/project_id|conversation_id|client_id|csrf|intake/.test(k)||v.includes('intake-result.v1'))),false);
 });
 await record('double submit creates exactly one aggregate',async()=>{
  const c=await context(),p=await openForm(c,'double@example.invalid'),before=await counts();
  await p.locator('form').evaluate(form=>{form.requestSubmit();form.requestSubmit();});await confirmed(p);
  const after=await counts();for(const key of Object.keys(before))assert.equal(after[key],before[key]+1);
 });
 await record('lost response after real commit → original request/key retry → same IDs with no duplicate',async()=>{
  const c=await context(),p=await openForm(c,'retry@example.invalid');let committed,originalBody;
  await p.route('**/api/v1/leads',async route=>{originalBody=route.request().postData();const r=await route.fetch();assert.equal(r.status(),201);committed=await r.json();await route.fulfill({status:503,json:{error:'SYNTHETIC_LOST_RESPONSE'}});},{times:1});
  await p.getByRole('button',{name:'Enviar Mensaje',exact:true}).click();await noSuccess(p);const before=await counts();
  const retry=p.waitForResponse(r=>r.url().endsWith('/api/v1/leads'));await p.getByRole('button',{name:'Reintentar el mismo envío',exact:true}).click();
  const r=await retry;assert.equal(r.status(),200);assert.equal(r.request().postData(),originalBody);const got=await confirmed(p);assert.equal(got.project_id,committed.project_id);assert.equal(got.conversation_id,committed.conversation_id);assert.deepEqual(await counts(),before);
 });
 await record('invalid CSRF fails in real Core and Web shows no success',async()=>{
  const c=await context(),p=await openForm(c,'csrf@example.invalid'),before=await counts();
  await p.route('**/api/v1/leads',r=>r.continue({headers:{...r.request().headers(),'x-csrf-token':'invalid'}}));
  const response=p.waitForResponse(r=>r.url().endsWith('/api/v1/leads'));await p.getByRole('button',{name:'Enviar Mensaje',exact:true}).click();assert.equal((await response).status(),403);await noSuccess(p);assert.deepEqual(await counts(),before);
 });
 await record('actual browser timeout after commit preserves request/key and retry returns same IDs',async()=>{
  const c=await context(),p=await openForm(c,'timeout@example.invalid');let committed,originalBody,release;
  const held=new Promise(resolve=>{release=resolve;});
  await p.route('**/api/v1/leads',async route=>{
   originalBody=route.request().postData();const r=await route.fetch();assert.equal(r.status(),201);committed=await r.json();
   await held;await route.abort();
  },{times:1});
  await p.getByRole('button',{name:'Enviar Mensaje',exact:true}).click();
  await expect(p.getByRole('alert').first()).toBeVisible({timeout:12000});await noSuccess(p);release();const before=await counts();
  const retry=p.waitForResponse(r=>r.url().endsWith('/api/v1/leads'));await p.getByRole('button',{name:'Reintentar el mismo envío',exact:true}).click();
  const r=await retry;assert.equal(r.status(),200);assert.equal(r.request().postData(),originalBody);
  assert.deepEqual(await confirmed(p),{project_id:committed.project_id,conversation_id:committed.conversation_id});assert.deepEqual(await counts(),before);
 });
 await record('expired capability denies submit without silent new intake or success',async()=>{
  const c=await context(),p=await openForm(c,'expired@example.invalid');
  await call(c,'/intakes/current'); // Initialization has completed before expiry.
  await h.admin.query("UPDATE inmejora_core.intake_submissions SET expires_at=now()-interval '1 second' WHERE receipt IS NULL");const before=await counts();
  const response=p.waitForResponse(r=>r.url().endsWith('/api/v1/leads'));await p.getByRole('button',{name:'Enviar Mensaje',exact:true}).click();assert.equal((await response).status(),401);await noSuccess(p);assert.deepEqual(await counts(),before);
 });
 await record('fabricated project and foreign context give no authority even with forged localStorage',async()=>{
  const c=await context();await c.addInitScript(()=>{if(globalThis.location.hostname === '127.0.0.1'){globalThis.localStorage.setItem('client_id','forged');globalThis.localStorage.setItem('user_id','admin');}});const p=await openForm(c,'other@example.invalid');
  assert.equal((await call(c,'/projects/00000000-0000-4000-8000-000000000001')).status(),404);
  assert.equal((await call(c,'/projects/'+ids.project_id)).status(),404);
  await expect(p.getByRole('heading',{name:'Proyecto recibido',exact:true})).toHaveCount(0);
 });
 for(const field of ['client_id','user_id']) await record('tampered '+field+' rejected by Core; no Web success',async()=>{
  const c=await context(),p=await openForm(c,field+'@example.invalid'),before=await counts();
  await p.route('**/api/v1/leads',r=>r.continue({postData:JSON.stringify({...r.request().postDataJSON(),[field]:receipt.client_id})}));
  const response=p.waitForResponse(r=>r.url().endsWith('/api/v1/leads'));await p.getByRole('button',{name:'Enviar Mensaje',exact:true}).click();assert.equal((await response).status(),422);await noSuccess(p);assert.deepEqual(await counts(),before);
 });
 await record('same contact in independent browser sessions is not identity or ownership',async()=>{
  const c=await context(),p=await openForm(c);const response=p.waitForResponse(r=>r.url().endsWith('/api/v1/leads'));await p.getByRole('button',{name:'Enviar Mensaje',exact:true}).click();const second=await (await response).json();await confirmed(p);
  assert.notEqual(second.client_id,receipt.client_id);assert.notEqual(second.project_id,ids.project_id);assert.notEqual(second.conversation_id,ids.conversation_id);
  assert.equal((await call(c,'/projects/'+ids.project_id)).status(),404);
  assert.equal((await call(visitor,'/projects/'+second.project_id)).status(),404);
 });
 await record('transport Origin cannot be laundered through the local proxy',async()=>{
  assert.equal((await call(visitor,'/intake-sessions','POST',{}, {Origin:'https://example.invalid'})).status(),403);
 });
 await record('real backend outage produces 503 and no confirmation; retry survives restart',async()=>{
  const c=await context(),p=await openForm(c,'outage@example.invalid');await call(c,'/intakes/current');await h.stopApp();
  const response=p.waitForResponse(r=>r.url().endsWith('/api/v1/leads'));await p.getByRole('button',{name:'Enviar Mensaje',exact:true}).click();assert.equal((await response).status(),503);await noSuccess(p);
  await expect(p.getByLabel('Mensaje',{exact:true})).toHaveValue('Pintar las paredes del living: consulta desde Web real.');
  await h.startApp();await p.getByRole('button',{name:'Reintentar el mismo envío',exact:true}).click();await confirmed(p);
 });
 assert.deepEqual(evidence.external,[]);assert.deepEqual(evidence.pageErrors,[]);
 evidence.status='PASS';await writeFile(resolve(output,'cross-repo.json'),JSON.stringify(evidence,null,2));
 console.log(`CROSS-REPO E2E ${evidence.passed.length}/${evidence.passed.length} PASS; project ${ids.project_id}; conversation ${ids.conversation_id}`);
} finally {
 closing=true;await browser?.close();await web?.close();await h.close();
}
