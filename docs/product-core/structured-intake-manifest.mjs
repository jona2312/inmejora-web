import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { argv } from 'node:process';
import { log } from 'node:console';
const paths=['src/lib/projectCoreClient.js','src/components/sales/ConsultaForm.jsx','src/config/commercial.js',
  'tailwind.config.js','scripts/ci/build-controlled-intake.mjs','scripts/ci/verify-controlled-build.mjs',
  'tests/ci/structured-intake.test.mjs','package.json','.github/workflows/p0-web-offline.yml',
  'docs/product-core/STRUCTURED-INTAKE.md','docs/product-core/structured-intake-manifest.mjs',
  'docs/product-core/private-gallery-manifest.json','docs/product-core/issue100-manifest.json','docs/product-core/wroute-manifest.json'];
const value={schema:'structured-intake.web.v1',base:'5ba93a50563b831a3e7417c0f05c4ee66e5c37ac',
  profile:'project-core-controlled',activation:'BLOCKED',encoding:'UTF8 CRLF normalized LF',
  sha256:Object.fromEntries(paths.map(p=>[p,createHash('sha256').update(readFileSync(p,'utf8').replace(/\r\n/g,'\n')).digest('hex')]))};
const target='docs/product-core/structured-intake-manifest.json';
if(argv.includes('--write'))writeFileSync(target,JSON.stringify(value,null,2)+'\n');
else{assert.deepEqual(JSON.parse(readFileSync(target,'utf8')),value);log('STRUCTURED_INTAKE_WEB_MANIFEST PASS');}
