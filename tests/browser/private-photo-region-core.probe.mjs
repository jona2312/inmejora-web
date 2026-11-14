// Run from the sibling Core checkout with installed Web/Core test dependencies.
// node --import tsx ../inmejora-web/tests/browser/private-photo-region-core.probe.mjs
// BROWSER_EXECUTABLE may point to a compatible headless Chromium executable.
import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID as id } from 'node:crypto';
import { mkdtemp,readFile,rm } from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';
import {build} from 'esbuild';

const core=process.cwd(), web=fileURLToPath(new URL('../../',import.meta.url));
const coreModule=path=>import(pathToFileURL(join(core,path)).href);
const {commercialHarness,CommercialActor}=await coreModule('tests/project-core/commercial-test-support.ts');
const {actors}=await coreModule('tests/project-core/harness.ts');
const {installRenderQaGate,syntheticPng}=await coreModule('tests/project-core/render-qa-support.ts');
const {outputFiles}=await build({absWorkingDir:web,stdin:{contents:`
  import React from 'react';
  import {createRoot} from 'react-dom/client';
  import Gallery from './src/components/renders/RenderGallerySection';
  createRoot(document.getElementById('root')).render(React.createElement(Gallery,{context:window.TEST_IDS}));`,
  resolveDir:web},bundle:true,alias:{'@':resolve(web,'src')},format:'iife',write:false,
  define:{'import.meta.env':'{"DEV":true,"MODE":"project-core-local"}','process.env.NODE_ENV':'"production"'}});
const bundle=outputFiles[0].text;
const root=await mkdtemp(join(tmpdir(),'inmejora-web-private-mask-'));
const t=await commercialHarness(true),db=t.h.admin;
const secret=()=>randomBytes(32).toString('hex'),sha=s=>createHash('sha256').update(s).digest('hex');
const cfg={machineApiKey:secret(),machineKey:secret(),eventKey:secret(),privateRoot:root,maximumMicrousd:11};
const original=syntheticPng(1536,1024,(x,y)=>[(x>>5)%255,(y>>6)%255,156]);
const body=bytes=>({idempotency_key:id(),media_type:'image/png',base64:bytes.toString('base64')});
let browser;
try {
  for (const f of [
    "release/render-credit-ledger/candidate.sql",
    "release/orchestration-contract/candidate.sql",
    "release/n8n-v11-closure/candidate.sql",
    "release/n8n-v11-closure/cost-guard.sql",
    "supabase/migrations/20261021180100_web_intake_guards.sql",
  ])
    await db.query(await readFile(f, "utf8"));
  await installRenderQaGate(db, actors.operator);
  await db.query(
    "UPDATE inmejora_core.web_guard_policy SET enabled=true,max_admissions=10,max_storage_bytes=20971520"
  );
  await db.query(
    await readFile(
      "supabase/migrations/20261021120000_web_intake_provision.sql",
      "utf8"
    )
  );
  await db.query(
    "INSERT INTO inmejora_core.web_intake_route(operator_id,enabled) VALUES($1,true)",
    [actors.operator]
  );
  Object.assign(t.h.config, { webAdmission: true });
  await t.h.stopApp();
  await t.h.startApp();
  const p = await t.project();
  const { project_id, client_id, conversation_id } = p.ids;
  await db.query(
    "INSERT INTO inmejora_core.client_memberships(client_id,user_id,role) VALUES($1,$2,'owner')",
    [client_id, actors.owner]
  );
  Object.assign(t.h.config, {
    webPhotoRoot: root,
    webAdmission: true,
    controlledWebAdmission: true,
    renderGallery: true,
    orchestrationV11: cfg,
  });
  await t.h.stopApp();
  await t.h.startApp();
  const owner = await new CommercialActor(t.h).start("owner"),
    outsider = await new CommercialActor(t.h).start("other");
  const url = "/projects/" + project_id + "/web-photos";
  const upload = async b => owner.request(url, b);
  const a = await upload(body(original));
  assert.equal(a.status, 201, JSON.stringify(a.data));
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});
  const ctx=await browser.newContext({viewport:{width:420,height:760}});
  const origin=t.h.config.origin;
  await ctx.addCookies(owner.cookie.split(/;\s*/).map(pair=>{
    const q=pair.indexOf('=');return {name:pair.slice(0,q),value:pair.slice(q+1),url:origin,httpOnly:true,sameSite:'Lax'};
  }));
  const page=await ctx.newPage(), writes=[];
  await page.route('**/*',async route=>{
    const u=new URL(route.request().url());
    assert.equal(u.origin,origin);
    if (u.pathname==='/region-ui') return route.fulfill({contentType:'text/html',body:
      '<meta charset="utf-8"><style>canvas{width:240px;height:auto}</style><div id="root"></div><script>window.TEST_IDS='+JSON.stringify({project_id,conversation_id})+'</script><script src="/region-ui.js"></script>'});
    if(u.pathname==='/region-ui.js') return route.fulfill({contentType:'application/javascript',body:bundle});
    if(route.request().method()==='POST') writes.push(route.request().postDataJSON());
    return route.continue();
  });
  await page.goto(origin+'/region-ui');
  await page.getByRole('button',{name:'Marcar zona en foto 1'}).click({timeout:7000});
  const canvas=page.getByLabel('Foto original con la selección');
  await canvas.waitFor({timeout:5000});assert.deepEqual(await canvas.evaluate(c=>[c.width,c.height]),[1536,1024]);
  await canvas.scrollIntoViewIfNeeded();const box=await canvas.boundingBox();assert.ok(box);
  for(const [x,y] of [[.25,.25],[.75,.25],[.75,.75],[.25,.75]]) await page.mouse.click(box.x+x*box.width,box.y+y*box.height);
  await page.getByRole('button',{name:'Confirmar zona'}).click();
  const save=page.getByRole('button',{name:'Guardar zona en el proyecto'});
  await save.waitFor({timeout:3000});assert.equal(writes.length,0);
  const reply=page.waitForResponse(r=>r.request().method()==='POST'&&r.url()===origin+'/api/v1'+url);
  await save.click();
  const res=await reply, saved=await res.json();
  assert.equal(res.status(),201,JSON.stringify(saved));assert.equal(writes.length,1);const [post]=writes;
  const serialized=Buffer.from(post.base64,'base64');
  assert.equal(saved.sha256,sha(serialized));assert.equal(saved.source_sha256,sha(original));assert.equal(saved.source_photo_id,a.data.id);
  assert.equal(post.source_photo_id,a.data.id);assert.equal(post.source_sha256,sha(original));
  await page.getByRole('status').filter({hasText:'Zona guardada en privado'}).waitFor();
  const gallery=await owner.request('/projects/'+project_id+'/gallery');
  assert.deepEqual(gallery.data.photos.map(x=>x.id),[a.data.id]);
  assert.equal((await owner.request('/projects/'+project_id+'/gallery/'+saved.id)).status,404);
  assert.equal((await outsider.request('/projects/'+project_id+'/gallery')).status,404);
  const anon=await fetch(origin+'/api/v1/projects/'+project_id+'/gallery/'+saved.id);assert.equal(anon.status,404);
  const row=(await db.query('SELECT object_key,sha256,provider_event_id FROM inmejora_core.private_attachments WHERE id=$1 AND project_id=$2',[saved.id,project_id])).rows[0];
  const {privatePhotoReader} = await coreModule('server/project-core/assistant-media.ts');
  assert.ok(serialized.equals(await privatePhotoReader(root)(row.object_key,row.sha256)));
  const replay=await upload(post);assert.equal(replay.status,201);assert.equal(replay.data.id,saved.id);
  assert.deepEqual((await db.query("SELECT count(*)::int n FROM inmejora_core.private_attachments WHERE project_id=$1 AND starts_with(provider_event_id,'web-mask:')",[project_id])).rows,[{n:1}]);
  assert.equal((await db.query('select count(*)::int n from inmejora_core.render_provider_attempts')).rows[0].n,0);
  console.log(JSON.stringify({passed:true,browser:browser.version(),postgres:(await db.query('show server_version')).rows[0].server_version,
    physical_provider_calls:0,source_sha256:saved.source_sha256,mask_sha256:saved.sha256,mask_bytes:serialized.length,
    before_save_POSTs:0,after_click_POSTs:writes.length,save_http:res.status(),identical_retry_id:true,physical_private_mask_rows:1,
    gallery_sources_only:true,owner_raw_mask_download:404,other_project_gallery:404,anonymous_mask_http:anon.status,
    private_file_equals_browser_png:true,render_attempts:0}));
} finally {await browser?.close();await t.h.close();await rm(root,{recursive:true,force:true});}
