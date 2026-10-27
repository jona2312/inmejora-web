import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const paths=[
  ".github/workflows/p0-web-offline.yml",
  "docs/p0/identity-ownership.json",
  "docs/product-core/ISSUE100-CATALOG.md",
  "docs/product-core/issue100-manifest.mjs",
  "docs/product-core/private-gallery-manifest.json",
  "package.json",
  "src/App.jsx",
  "src/components/dashboard/PlanSection.jsx",
  "src/components/plans/CanonicalCatalog.jsx",
  "src/components/pricing/PricingPlans.jsx",
  "src/lib/planCatalog.js",
  "src/pages/CheckoutPage.jsx",
  "src/pages/ClientDashboard.jsx",
  "src/pages/PlansPage.jsx",
  "src/pages/PricingPage.jsx",
  "tests/browser/catalog.spec.mjs",
  "tests/browser/isolation.mjs",
  "tests/browser/sales.spec.mjs",
  "tests/ci/catalog.test.mjs",
  "tests/ci/payment-containment.test.mjs"
];
const value={schema:'issue100.web.v1',base:'c9541d781f40a1a0719b1e52a10bdb6ad9988c22',core_pr:101,purchases_enabled:false,sha256:Object.fromEntries(paths.map(p=>[p,createHash('sha256').update(readFileSync(p,'utf8').replace(/\r\n/g,'\n')).digest('hex')]))};
if(process.argv.includes('--write'))writeFileSync('docs/product-core/issue100-manifest.json',JSON.stringify(value,null,2)+'\n');else{assert.deepEqual(JSON.parse(readFileSync('docs/product-core/issue100-manifest.json','utf8')),value);console.log('ISSUE100_WEB_MANIFEST PASS');}
