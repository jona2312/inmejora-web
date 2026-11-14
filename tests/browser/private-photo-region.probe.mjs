// Focused Chromium test of the existing private gallery with synthetic Core replies.
// From repo root: node tests/browser/private-photo-region.probe.mjs
// Override BROWSER_EXECUTABLE to use the system Chromium.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const sha = bytes=>createHash('sha256').update(bytes).digest('hex');
const project='11111111-1111-4111-8111-111111111111', conversation='22222222-2222-4222-8222-222222222222';
const photo='33333333-3333-4333-8333-333333333333', maskId='44444444-4444-4444-8444-444444444444';
const photoPath='/api/v1/projects/'+project+'/gallery/'+photo;
const vite = await createServer({configFile:false,root:resolve('.'),mode:'project-core-local',logLevel:'error',
  resolve:{alias:{'@':resolve('src')}},server:{host:'127.0.0.1',port:0,strictPort:true},
  plugins:[{name:'test-region-page',configureServer(s){s.middlewares.use((req,res,next)=>{
    if(req.url!=='/test-region')return next();
    const html = `<!doctype html><meta charset="utf-8"><style>canvas{width:240px;height:auto}</style>
      <div id="root"></div><script type="module">
      import React from 'react';
      import {createRoot} from 'react-dom/client';
      import Gallery from '/src/components/renders/RenderGallerySection.jsx';
      createRoot(document.getElementById('root')).render(React.createElement(Gallery,{
        context:{project_id:'${project}',conversation_id:'${conversation}'}}));</script>`;
    s.transformIndexHtml('/test-region',html)
      .then(result=>{res.setHeader('Content-Type','text/html');res.end(result);}).catch(next);
    });}}],optimizeDeps:{include:['react','react-dom/client','zod']}});
await vite.listen();
const origin='http://127.0.0.1:'+vite.httpServer.address().port;
let browser;
try {
  browser=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{}),
    args:['--no-sandbox','--disable-dev-shm-usage']});
  const page=await browser.newPage({viewport:{width:420,height:760},acceptDownloads:true});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  const blockOutside=async route=>{
    if(new URL(route.request().url()).origin!==origin) return route.abort();
    return route.continue();
  };
  await page.route('**/*',blockOutside);
  await page.goto('about:blank');
  const pictures=await page.evaluate(()=>{
    const c=document.createElement('canvas');c.width=480;c.height=320;
    const g=c.getContext('2d');g.fillStyle='#fbb';g.fillRect(0,0,480,320);
    g.fillStyle='#427';g.fillRect(0,0,240,160);
    return [c.toDataURL('image/png'),c.toDataURL('image/jpeg')].map(s=>s.split(',')[1]);
  });
  let source=Buffer.from(pictures[0],'base64'),mime='image/png';
  const posts=[],unhandled=[];
  await page.route(origin+'/api/v1/**',async route=>{
    const req=route.request(),path=new URL(req.url()).pathname;
    if(path===photoPath && req.method()==='GET') return route.fulfill({body:source,contentType:mime});
    if(path==='/api/v1/intakes/current') return route.fulfill({json:{csrf_token:'0'.repeat(64),receipt:null}});
    if(path==='/api/v1/projects/'+project+'/gallery') return route.fulfill({json:{
      schema_version:'private-gallery.v1',project_id:project,conversation_id:conversation,photos:[
        {id:photo,conversation_id:conversation,media_type:mime,created_at:'2026-11-14T00:00:00Z',source:'web_upload'}],
      render_generation:{enabled:false,status:'BLOCKED_SOURCE_EXPORT'}}});
    if(path==='/api/v1/projects/'+project+'/web-photos' && req.method()==='POST') {
      const body=req.postDataJSON();posts.push(body);
      assert.equal(req.headers()['x-csrf-token'],'0'.repeat(64));
      assert.equal(body.source_sha256,sha(source));assert.equal(body.role,'mask');assert.equal(body.source_photo_id,photo);
      return route.fulfill({json:{status:'stored',id:maskId,role:'mask',source_photo_id:photo,source_sha256:body.source_sha256,
        sha256:posts.length===1?'0'.repeat(64):sha(Buffer.from(body.base64,'base64'))},status:201});
    }
    unhandled.push([req.method(),path]);return route.abort();
  });
  async function open(){
    await page.goto(origin+'/test-region');await page.getByRole('button',{name:'Marcar zona en foto 1'}).click();
    const canvas=page.getByLabel('Foto original con la selección');await canvas.waitFor();return canvas;
  }
  async function corners(canvas,geometry) {
    await canvas.scrollIntoViewIfNeeded();
    // Stable subpixel viewport layout; mouse events expose integer CSS pixels.
    await canvas.evaluate(c=>{const b=c.getBoundingClientRect();c.style.transform='translate('+ (Math.ceil(b.left)-b.left)+'px,'+(Math.ceil(b.top)-b.top)+'px)';});
    const box=await canvas.boundingBox();
    for(const [sx,sy] of geometry) await page.mouse.click(box.x+sx*box.width,box.y+sy*box.height);
  }
  async function exported(button){
    const pending=page.waitForEvent('download');await page.getByRole('button',{name:button}).click();
    return readFile(await (await pending).path());
  }
  const canvas=await open();
  assert.deepEqual(await canvas.evaluate(c=>[c.width,c.height]),[480,320]);
  assert.ok(await page.getByRole('button',{name:'Confirmar zona'}).isDisabled());
  const rectangle=[[.25,.25],[.75,.25],[.75,.75],[.25,.75]];
  await corners(canvas,rectangle);
  await page.getByRole('button',{name:'Confirmar zona'}).click();
  const bytes=await exported('Descargar máscara PNG');
  const manifest=JSON.parse(await exported('Descargar ficha de la selección'));
  assert.equal(manifest.source_id,photo);assert.equal(manifest.source_sha256,sha(source));
  assert.equal(manifest.mask_sha256,sha(bytes));assert.equal(manifest.editable_pixels,240*160);
  assert.deepEqual(manifest.polygon,[[120,80],[360,80],[360,240],[120,240]]);
  const alpha=await page.evaluate(async b64=>{
    const image=await createImageBitmap(await (await fetch('data:image/png;base64,'+b64)).blob());
    const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
    const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
    const rgba=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    return [image.width,image.height,rgba[3],rgba[(100*480+150)*4+3],Array.from(new Set(rgba.filter((_,i)=>i%4===3))).sort()];
  },bytes.toString('base64'));
  assert.deepEqual(alpha,[480,320,255,0,[0,255]]);assert.equal(posts.length,0);
  const save=page.getByRole('button',{name:'Guardar zona en el proyecto'});
  await save.click();await page.getByRole('alert').filter({hasText:'No se confirmó'}).waitFor();
  assert.ok(await save.isEnabled());await save.click();
  await page.getByRole('status').filter({hasText:'Zona guardada en privado'}).waitFor();
  assert.equal(posts.length,2);assert.deepEqual(posts[0],posts[1]);assert.ok(await save.isDisabled());
  assert.equal((await exported('Descargar máscara PNG')).compare(bytes),0);
  assert.equal((JSON.parse(await exported('Descargar ficha de la selección'))).mask_id,maskId);
  await page.getByRole('button',{name:'Borrar selección'}).click();
  await corners(canvas,[[.25,.25],[.5,.25],[.75,.25]]);await page.getByRole('button',{name:'Confirmar zona'}).click();
  await page.getByRole('alert').filter({hasText:'Marcá sólo'}).waitFor();
  assert.equal(await save.count(),0);
  await page.getByRole('button',{name:'Borrar selección'}).click();
  // Keyboard reaches exact source boundaries even on a scaled mobile viewport.
  await canvas.focus();
  for (let i=0;i<24;i++) await page.keyboard.press('Shift+ArrowLeft');
  for (let i=0;i<16;i++) await page.keyboard.press('Shift+ArrowUp');
  await page.keyboard.press('Enter');
  for (const [key,reps] of [['Shift+ArrowRight',48],['Shift+ArrowDown',32],['Shift+ArrowLeft',48]]) {
    for (let i=0;i<reps;i++) await page.keyboard.press(key);
    await page.keyboard.press('Enter');
  }
  await page.getByRole('button',{name:'Confirmar zona'}).click();
  await page.getByRole('alert').filter({hasText:'Marcá sólo'}).waitFor();
  assert.equal(await save.count(),0);
  // EXIF tag 0x0112=6, 90 degrees clockwise, on the 480x320 encoded JPEG.
  const jpeg=Buffer.from(pictures[1],'base64');
  const exif=Buffer.from('ffe1002245786966000049492a0008000000010012010300010000000600000000000000','hex');
  source=Buffer.concat([jpeg.subarray(0,2),exif,jpeg.subarray(2)]);mime='image/jpeg';
  const rotated=await open();
  assert.deepEqual(await rotated.evaluate(c=>[c.width,c.height]),[320,480]);
  await corners(rotated,rectangle);await page.getByRole('button',{name:'Confirmar zona'}).click();
  const ori=JSON.parse(await exported('Descargar ficha de la selección'));
  assert.deepEqual(ori.polygon,[[80,120],[240,120],[240,360],[80,360]]);assert.equal(ori.source_sha256,sha(source));
  assert.equal(await save.count(),0);assert.equal(posts.length,2);assert.deepEqual(unhandled,[]);assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,private_gallery:true,polygons:2,alpha:[0,255],source_hash:true,mask_hash:true,
    oriented_JPEG:[320,480],saved_PNG:true,server_fixture:true,invalid_receipt_rejected:true,retry_same_key:true,
    empty_region_rejected:true,full_region_rejected:true,keyboard:true,paid_calls:0,other_business_requests:0}));
} finally {await browser?.close();await vite.close();}
