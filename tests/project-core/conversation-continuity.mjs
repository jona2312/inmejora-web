import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { expect } from '@playwright/test';

export async function conversationContinuity({h,web,context,visitor,page,ids,call,record,evidence,output}) {
  const path=`/projects/${ids.project_id}/conversations/${ids.conversation_id}`;
  const visitorText='Necesito coordinar una visita sintética.';
  const operatorText='Podemos revisar las medidas en esta conversación local.';
  const privateText='NOTA INTERNA: coordinación exclusiva del operador.';
  const operator=await context();
  await operator.addCookies([{name:'app_session_id',value:(await h.cookie('operator')).split('=')[1],url:h.config.origin,httpOnly:true,sameSite:'Strict'}]);
  const crm=await operator.newPage();
  async function signed(c,url,method,body) {
    const current=await call(c,'/intakes/current');assert.equal(current.status(),200);
    return call(c,url,method,body,{'X-CSRF-Token':(await current.json()).csrf_token});
  }
  const body=(content,visibility='client')=>({idempotency_key:randomUUID(),content,visibility});
  const events=async()=> (await h.admin.query('SELECT id,sequence,kind,content,visibility FROM inmejora_core.project_events WHERE conversation_id=$1 ORDER BY sequence',[ids.conversation_id])).rows;
  async function selectProject() {
    await crm.locator('li').filter({has:crm.getByText(ids.project_id,{exact:true})}).getByRole('button').click();
    await expect(crm.getByTestId('crm-conversation')).toHaveText(ids.conversation_id);
  }
  async function refreshWeb(){await page.getByRole('button',{name:'Actualizar conversación',exact:true}).click();}
  await record('conversation: visitor sends through real Web → assigned CRM sees same message and IDs',async()=>{
    await page.getByLabel('Mensaje al operador',{exact:true}).fill(visitorText);
    await page.getByRole('button',{name:'Enviar al operador',exact:true}).click();
    await expect(page.getByRole('status').filter({hasText:'Mensaje guardado.'})).toBeVisible();
    await crm.goto(h.config.origin+'/dev/project-crm');await selectProject();
    await expect(crm.getByRole('list',{name:'Timeline de conversación'})).toContainText(visitorText);
    await expect(crm.getByTestId('crm-project')).toHaveText(ids.project_id);
  });
  await record('conversation: operator reply returns to Web on explicit refetch',async()=>{
    await crm.getByLabel('Mensaje',{exact:true}).fill(operatorText);
    await crm.getByRole('button',{name:'Enviar mensaje',exact:true}).click();
    await expect(crm.getByRole('status')).toHaveText('Mensaje guardado.');
    await refreshWeb();await expect(page.getByRole('list',{name:'Timeline pública'})).toContainText(operatorText);
  });
  await record('conversation: internal notes isolated in GET, POST, current and project projections',async()=>{
    await crm.getByLabel('Mensaje',{exact:true}).fill(privateText);await crm.getByLabel('Nota interna',{exact:true}).check();
    await crm.getByRole('button',{name:'Enviar mensaje',exact:true}).click();
    await expect(crm.getByRole('list',{name:'Timeline de conversación'})).toContainText(privateText);
    await refreshWeb();await expect(page.getByText(privateText,{exact:false})).toHaveCount(0);
    for(const url of [path,'/intakes/current','/projects/'+ids.project_id]) {
      const r=await call(visitor,url);assert.equal(r.status(),200);const data=await r.json();assert.ok(!JSON.stringify(data).includes(privateText));
      if(url===path)assert.ok(data.events.every(e=>e.visibility==='client' && e.actor_user_id===null));
    }
    const post=await signed(visitor,path+'/messages','POST',body('Otro mensaje público.'));assert.equal(post.status(),200);assert.ok(!(await post.text()).includes(privateText));
  });
  await record('conversation: handoff paused → human audited on same thread',async()=>{
    await crm.getByRole('button',{name:'Actualizar conversación',exact:true}).click();
    await expect(crm.getByRole('heading',{name:'Conversación · paused',exact:true})).toBeVisible();
    await crm.getByRole('button',{name:'Continuar como humano',exact:true}).click();
    await expect(crm.getByRole('heading',{name:'Conversación · human',exact:true})).toBeVisible();
    await refreshWeb();await expect(page.getByTestId('thread-mode')).toHaveText('human');
    assert.equal((await events()).filter(e=>e.kind==='handoff.active').length,1);
    await page.screenshot({path:resolve(output,'web-conversation.png'),fullPage:true});
    await crm.screenshot({path:resolve(output,'crm-conversation.png'),fullPage:true});
  });
  await record('conversation: visitor double click creates one message',async()=>{
    const text='Doble click sintético.';await page.getByLabel('Mensaje al operador',{exact:true}).fill(text);
    await page.getByRole('form',{name:'Enviar al operador'}).evaluate(form=>{form.requestSubmit();form.requestSubmit();});
    await expect(page.getByRole('list',{name:'Timeline pública'})).toContainText(text);
    assert.equal((await events()).filter(e=>e.content===text).length,1);
  });
  for(const [label,p,c,field,button,timeline] of [
    ['visitor',page,visitor,'Mensaje al operador','Enviar al operador','Timeline pública'],
    ['operator',crm,operator,'Mensaje','Enviar mensaje','Timeline de conversación'],
  ]) await record(`conversation: ${label} lost response after COMMIT → identical retry without duplicate`,async()=>{
    const text=label+' respuesta perdida';let original;
    await p.getByLabel(field,{exact:true}).fill(text);
    await p.route('**/conversations/*/messages',async route=>{original=route.request().postData();const r=await route.fetch();assert.equal(r.status(),200);await route.fulfill({status:503,json:{error:'SYNTHETIC_LOST_RESPONSE'}});},{times:1});
    await p.getByRole('button',{name:button,exact:true}).click();await expect(p.getByRole('alert').first()).toBeVisible();
    await expect(p.getByRole('status').filter({hasText:'Mensaje guardado.'})).toHaveCount(0);
    const before=await events();const response=p.waitForResponse(r=>r.url().endsWith('/messages'));
    await p.getByRole('button',{name:'Reintentar mensaje',exact:true}).click();const r=await response;
    assert.equal(r.status(),200);assert.equal(r.request().postData(),original);await expect(p.getByRole('list',{name:timeline})).toContainText(text);
    assert.deepEqual(await events(),before);assert.equal(before.filter(e=>e.content===text).length,1);
    assert.equal((await call(c,path)).status(),200);
  });
  await record('conversation: crossed project/thread, unassigned operator and forged authority are denied',async()=>{
    const stranger=await context();const p=await stranger.newPage();await p.goto(web.origin+'/contacto');
    await expect(p.getByLabel('Nombre completo',{exact:true})).toBeVisible();await call(stranger,'/intake-sessions','POST',{});
    const unassigned=await context();await unassigned.addCookies([{name:'app_session_id',value:(await h.cookie('other')).split('=')[1],url:h.config.origin,httpOnly:true,sameSite:'Strict'}]);
    await call(unassigned,'/intake-sessions','POST',{});
    for(const c of [stranger,unassigned]) {
      assert.equal((await call(c,path)).status(),404);
      assert.equal((await signed(c,path+'/messages','POST',body('intrusion'))).status(),404);
      assert.equal((await signed(c,path+'/messages','POST',body('private','internal'))).status(),404);
    }
    const other=(await h.admin.query('SELECT id,project_id FROM inmejora_core.project_conversations WHERE project_id<>$1 LIMIT 1',[ids.project_id])).rows[0];
    const crossed=`/projects/${ids.project_id}/conversations/${other.id}`;
    for(const c of [visitor,operator])assert.equal((await signed(c,crossed+'/messages','POST',body('crossed'))).status(),404);
    assert.equal((await call(visitor,`/projects/${randomUUID()}/conversations/${ids.conversation_id}`)).status(),404);
    assert.equal((await signed(visitor,path+'/messages','POST',body('private','internal'))).status(),403);
    for(const field of ['project_id','client_id','conversation_id','user_id']) assert.equal((await signed(visitor,path+'/messages','POST',{...body('injected'),[field]:randomUUID()})).status(),422);
    await p.close();
  });
  await record('conversation: operator double submit persists exactly one reply',async()=>{
    const text='Respuesta única del operador.';await crm.getByLabel('Mensaje',{exact:true}).fill(text);
    await crm.locator('form').evaluate(form=>{form.requestSubmit();form.requestSubmit();});
    await expect(crm.getByRole('list',{name:'Timeline de conversación'})).toContainText(text);
    assert.equal((await events()).filter(e=>e.content===text).length,1);
  });
  await record('conversation: concurrent writers preserve unique stable sequence and same-key retries',async()=>{
    const requests=Array.from({length:10},(_,i)=>({actor:i%2?visitor:operator,payload:body('Secuencia concurrente '+i)}));
    for(const r of await Promise.all(requests.map(o=>signed(o.actor,path+'/messages','POST',o.payload))))assert.equal(r.status(),200);
    const before=await events();assert.deepEqual(before.map(e=>e.sequence),before.map((_,i)=>i+1));
    for(const r of await Promise.all(requests.map(o=>signed(o.actor,path+'/messages','POST',o.payload))))assert.equal(r.status(),200);
    assert.deepEqual(await events(),before);
  });
  await record('conversation: app restart preserves messages, human mode, IDs and public isolation',async()=>{
    const before=await events();await h.stopApp();await h.startApp();await page.reload();
    await expect(page.getByTestId('project-id')).toHaveText(ids.project_id);await expect(page.getByTestId('conversation-id')).toHaveText(ids.conversation_id);
    await expect(page.getByRole('list',{name:'Timeline pública'})).toContainText(operatorText);
    await expect(page.getByTestId('thread-mode')).toHaveText('human');await expect(page.getByText(privateText,{exact:false})).toHaveCount(0);
    await crm.reload();await selectProject();await expect(crm.getByRole('list',{name:'Timeline de conversación'})).toContainText(privateText);
    assert.deepEqual(await events(),before);
    await page.screenshot({path:resolve(output,'web-conversation-restarted.png'),fullPage:true});await crm.screenshot({path:resolve(output,'crm-conversation-restarted.png'),fullPage:true});
    evidence.conversation={...ids,mode:'human',events:before,public_events:(await (await call(visitor,path)).json()).events};
  });
  await record('conversation: archived/read-only denies both composers and writes',async()=>{
    for(const state of ['completed','archived']) {
      const p=await (await call(operator,'/projects/'+ids.project_id)).json();
      assert.equal((await signed(operator,'/projects/'+ids.project_id,'PATCH',{expected_revision:p.project.revision,state})).status(),200);
    }
    await refreshWeb();await expect(page.getByText('Este hilo es de sólo lectura.',{exact:true})).toBeVisible();
    await expect(page.getByLabel('Mensaje al operador',{exact:true})).toHaveCount(0);
    await crm.getByRole('button',{name:'Actualizar conversación',exact:true}).click();await expect(crm.getByLabel('Mensaje',{exact:true})).toHaveCount(0);
    for(const c of [visitor,operator])assert.equal((await signed(c,path+'/messages','POST',body('archived'))).status(),409);
  });
  await record('conversation: expired capability cannot read thread, recover context or write',async()=>{
    const csrf=(await (await call(visitor,'/intakes/current')).json()).csrf_token;
    await h.admin.query("UPDATE inmejora_core.intake_submissions SET expires_at=now()-interval '1 second' WHERE project_id=$1",[ids.project_id]);
    assert.equal((await call(visitor,path)).status(),404);
    assert.equal((await call(visitor,path+'/messages','POST',body('expired'),{'X-CSRF-Token':csrf})).status(),401);
    assert.equal((await call(visitor,'/intakes/current')).status(),401);
  });
}
