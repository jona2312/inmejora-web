import React,{useEffect,useState} from 'react';
import {readCatalog} from '@/lib/planCatalog';
export default function CanonicalCatalog(){
 const [plans,setPlans]=useState([]),[state,setState]=useState('loading');
 useEffect(()=>{const controller=new AbortController();readCatalog(controller.signal).then(p=>{setPlans(p);setState('ready');}).catch(()=>{if(!controller.signal.aborted)setState('error');});return()=>controller.abort();},[]);
 return <section aria-label="Catálogo aprobado" className="max-w-7xl mx-auto p-6 text-white"><h2 className="text-3xl font-bold text-[#d4af37]">Planes de INMEJORA</h2>
 <p className="my-4">Precios y condiciones aprobados en el CRM. Compras desactivadas durante la revisión.</p>
 {state==='loading'&&<p>Cargando catálogo…</p>}{state==='error'&&<p role="alert">Catálogo no disponible. No se muestran precios de respaldo.</p>}
 {state==='ready'&&!plans.length&&<p>No hay planes publicados.</p>}
 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">{plans.map(p=><article key={p.id} className="rounded-2xl bg-[#141414] border border-[#d4af37]/40 p-5">
 <h3 className="text-xl font-bold">{p.terms.name}</h3><p>{p.terms.description}</p><p>Versión {p.version} · {p.terms.period} · {p.terms.credits} créditos</p>
 {p.terms.options.filter(o=>o.enabled).map(o=><p className="text-emerald-400 mt-3" key={o.id}>{o.provider} · {o.currency} {(o.amount_minor/100).toFixed(2)} · {o.countries.join(', ')}</p>)}
 <ul className="my-4">{p.terms.benefits.map(b=><li key={b}>{b}</li>)}</ul><p>{p.terms.tax_notice}</p><p>{p.terms.renewal_notice}</p>
 <button disabled className="mt-4 opacity-60 border p-2">Compras desactivadas</button></article>)}</div></section>;
}
