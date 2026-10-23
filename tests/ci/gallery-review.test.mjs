import '../../scripts/ci/offline-guard.mjs';
import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync, readdirSync} from 'node:fs';
import {createContext, SourceTextModule, SyntheticModule} from 'node:vm';
import {transformSync} from 'esbuild';
import {parse} from '@babel/parser';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {unavailableSubscription} from '../../src/contexts/unavailableSubscription.js';
import {rendersAPI} from '../../src/utils/rendersAPI.js';

const root=new URL('../../',import.meta.url);
async function load(path, overrides={}) {
  const source=readFileSync(new URL(path,root),'utf8');
  const imports=parse(source,{sourceType:'module',plugins:['jsx']}).program.body.filter(n=>n.type==='ImportDeclaration');
  const denied=()=>{throw Error('Unexpected external effect');};
  const context=createContext({fetch:denied,setTimeout:denied,console:{error:denied,log:denied}});
  for(const name of ['localStorage','sessionStorage','process']) Object.defineProperty(context,name,{get:denied});
  const mod=new SourceTextModule(transformSync(source,{loader:'jsx',format:'esm'}).code,{context});
  const element=({children})=>React.createElement('div',null,children);
  await mod.link(specifier=>{
    const values=overrides[specifier] ?? (specifier==='react'?{default:React,...React}:
      specifier==='@/contexts/SubscriptionContext'?{useSubscription:()=>unavailableSubscription}:
      specifier==='@/contexts/InmejoraAuthContext'?{useAuth:()=>({user:{name:'Synthetic'},logout:denied})}:
      specifier==='react-router-dom'?{Link:element,useNavigate:()=>denied}:
      specifier==='framer-motion'?{motion:{div:element},AnimatePresence:element}:
      specifier==='@/lib/customSupabaseClient'?{supabase:new Proxy({},{get:denied})}:
      Object.fromEntries(imports.find(n=>n.source.value===specifier).specifiers.map(s=>[s.type==='ImportDefaultSpecifier'?'default':s.imported.name,element])));
    return new SyntheticModule(Object.keys(values),function(){for(const [k,v]of Object.entries(values))this.setExport(k,v);},{context});
  });
  await mod.evaluate(); return mod.namespace;
}

test('W-1 all shipped source forbids legacy credit tables and dummy render jobs',()=>{
  for(const name of readdirSync(new URL('src/',root),{recursive:true}).filter(n=>/\.(jsx?|tsx?)$/.test(n))) {
    const source=readFileSync(new URL('src/'+name.replaceAll('\\','/'),root),'utf8');
    assert.doesNotMatch(source,/client_credits|client_subscriptions|wallet_transactions|dummy-job/,name);
    assert.doesNotMatch(source,/\b(?:credits|creditsCap|creditsRemaining|creditsTotal)\s*:\s*\d/,name);
  }
});
test('W-1 actual portal and dashboard render unknown balances without querying legacy data',async()=>{
  for(const path of ['src/pages/PortalPage.jsx','src/pages/ClientDashboard.jsx','src/pages/PlanManagementPage.jsx']) {
    const component=await load(path);
    const html=renderToStaticMarkup(React.createElement(component.default));
    assert.match(html,/No disponible/); assert.match(html,/ledger canónico/);
    assert.doesNotMatch(html.replace(/<[^>]*>/g,' '),/\b5\b|\bExplorar\b|\bActiva\b/);
  }
});
test('W-1 legacy dashboard stats reject unknown instead of returning a fabricated account',async()=>{
  const {dashboardAPI}=await load('src/utils/dashboardAPI.js');
  await assert.rejects(dashboardAPI.getStats(),e=>e.code==='CANONICAL_ACCOUNT_UNAVAILABLE');
});
test('W-2 actual upload hook refuses fake success and does not inspect files or browser identity',async()=>{
  const states=[];
  const {useImageUpload}=await load('src/hooks/useImageUpload.js',{
    react:{useState:initial=>[initial,value=>states.push(value)]},
    '@/utils/rendersAPI':{rendersAPI},
  });
  const upload=useImageUpload();
  const hostile=new Proxy({},{get(){throw Error('Must not inspect file');}});
  assert.equal(await upload.uploadImage(hostile,hostile),false);
  assert.equal(upload.success,false);assert.equal(upload.data,null);assert.equal(upload.loading,false);
  assert.match(states[0],/No se envió ni se cobró/);
  upload.resetState();assert.equal(states[1],null);
  assert.doesNotMatch(readFileSync(new URL('src/pages/ImageUploadPage.jsx',root),'utf8'),/deductCredit|creditsRemaining|¡Render generado/);
});
test('W-1 render detail never interprets a credit entry as an image',async()=>{
  const modal=await load('src/components/renders/RenderDetailModal.jsx');
  const html=renderToStaticMarkup(React.createElement(modal.default,{isOpen:true,renderId:'synthetic',onClose:()=>{}}));
  assert.match(html,/Render no disponible/);assert.doesNotMatch(html,/<img|Cargando/);
});
