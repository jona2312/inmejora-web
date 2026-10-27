import '../../scripts/ci/offline-guard.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseCatalog} from '../../src/lib/planCatalog.js';
const value={ok:true,payments_enabled:false,plans:[{id:'synthetic',version:2,approved_at:'2026-10-27T00:00:00Z',terms:{name:'Synthetic',description:'Synthetic only',period:'monthly',credits:3,benefits:['Private gallery'],visible:true,available:true,tax_notice:'Test only',renewal_notice:'No renewal',options:[{id:'mp',provider:'mp',currency:'ARS',amount_minor:12500,countries:['AR'],enabled:true}]}}]};
test('canonical version/currency/minor units survive parsing without recalculation',()=>{const p=parseCatalog(value)[0];assert.equal(p.version,2);assert.equal(p.terms.options[0].amount_minor,12500);});
test('draft, malformed currency, hidden plan and enabled purchases fail closed',()=>{
 for(const change of [v=>v.plans[0].version=0,v=>v.plans[0].terms.options[0].currency='UNKNOWN',v=>v.plans[0].terms.visible=false,v=>v.payments_enabled=true,v=>delete v.plans]){const v=structuredClone(value);change(v);assert.throws(()=>parseCatalog(v));}
});
test('all visible plan surfaces use the same read component, no price authority in checkout',()=>{
 for(const path of ['src/pages/PlansPage.jsx','src/pages/CheckoutPage.jsx','src/components/pricing/PricingPlans.jsx','src/pages/ClientDashboard.jsx'])assert.match(readFileSync(path,'utf8'),/CanonicalCatalog/);
 const checkout=readFileSync('src/pages/CheckoutPage.jsx','utf8');assert.doesNotMatch(checkout,/pricingPlans|handleSubscribe|createCheckout|processPayment/);
 assert.match(readFileSync('src/components/plans/CanonicalCatalog.jsx','utf8'),/Catálogo no disponible/);
});
