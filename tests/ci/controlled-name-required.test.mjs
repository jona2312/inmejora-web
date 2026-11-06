import '../../scripts/ci/offline-guard.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transformSync } from 'esbuild';
import * as content from '../../src/data/salesContent.js';
import * as consulta from '../../src/utils/consultaMessage.js';

// Render the actual form, replacing only external/context dependencies.
// Server rendering runs no effects, network, storage or user submissions.
async function render(core) {
  const context=createContext({URLSearchParams});
  const module=new SourceTextModule(transformSync(
    readFileSync(new URL('../../src/components/sales/ConsultaForm.jsx',import.meta.url),'utf8'),
    {loader:'jsx',format:'esm',jsx:'transform'}).code,{context});
  const synthetic=exports=>new SyntheticModule(Object.keys(exports),function(){
    for(const [name,value] of Object.entries(exports))this.setExport(name,value);
  },{context});
  const icon=()=>React.createElement('span',{'aria-hidden':true});
  await module.link(specifier=>{
    if(specifier==='react')return synthetic({default:React,useState:React.useState,useEffect:React.useEffect,useRef:React.useRef});
    if(specifier==='react-router-dom')return synthetic({useSearchParams:()=>[new URLSearchParams()]});
    if(specifier==='lucide-react')return synthetic({MessageCircle:icon,Copy:icon,Check:icon});
    if(specifier==='@/config/commercial')return synthetic({COMMERCIAL:{channelEnabled:true},PROMISE:{short:'Ensayo',note:'Sintético'},buildWhatsappUrl:()=>{throw Error('Unexpected transport');}});
    if(specifier==='@/data/salesContent')return synthetic(content);
    if(specifier==='@/utils/consultaMessage')return synthetic(consulta);
    if(specifier==='@/utils/track')return synthetic({track:()=>{throw Error('Unexpected analytics');}});
    if(specifier==='@/lib/projectCoreClient')return synthetic({localCoreEnabled:()=>core,createProjectCoreClient:()=>({})});
    if(specifier==='@/components/ProjectThread'||specifier==='@/components/renders/RenderGallerySection')
      return synthetic({default:()=>{throw Error('Unexpected persisted receipt');}});
    throw Error('Unexpected dependency '+specifier);
  });
  await module.evaluate();
  const html=renderToStaticMarkup(React.createElement(module.namespace.default));
  const label=html.match(/<label[^>]*for="consulta-nombre"[^>]*>([\s\S]*?)<\/label>/)?.[1];
  const input=html.match(/<input[^>]*id="consulta-nombre"[^>]*>/)?.[0];
  assert.ok(label&&input,'actual name control must render');
  return {label,input};
}

test('QA119-3 controlled Core form labels the required name accurately',async()=>{
  const {label}=await render(true);
  assert.doesNotMatch(label,/opcional/i);
  assert.match(label,/Tu nombre.*\*/);
});

test('QA119-3 controlled Core name carries required and accessible semantics',async()=>{
  const {input}=await render(true);
  assert.match(input,/\srequired=""/);
  assert.match(input,/aria-required="true"/);
});

test('QA119-3 ordinary WhatsApp form keeps its optional name contract',async()=>{
  const {label,input}=await render(false);
  assert.match(label,/opcional/i);
  assert.doesNotMatch(input,/\srequired=""|aria-required="true"/);
});
