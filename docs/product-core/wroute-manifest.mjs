import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { argv } from 'node:process';
import { log } from 'node:console';
const paths = ['src/App.jsx', 'src/utils/presupuestoApi.js', 'tests/ci/sales-route-containment.test.mjs', 'tests/ci/no-public-customer-upload.test.mjs', 'tests/browser/sales.spec.mjs', '.github/workflows/p0-web-offline.yml', 'package.json', 'docs/product-core/private-gallery-manifest.json', 'docs/product-core/issue100-manifest.json', 'docs/product-core/W-ROUTE-1.md', 'docs/product-core/wroute-manifest.mjs'];
const value = { schema: 'wroute1.web.v1', base: '964120660b57860f2577f00c798f68c1416378dc', encoding: 'UTF8 CRLF normalized LF', sha256: Object.fromEntries(paths.map(p => [p, createHash('sha256').update(readFileSync(p, 'utf8').replace(/\r\n/g, '\n')).digest('hex')])) };
const target = 'docs/product-core/wroute-manifest.json';
if (argv.includes('--write')) writeFileSync(target, JSON.stringify(value, null, 2) + '\n');
else { assert.deepEqual(JSON.parse(readFileSync(target, 'utf8')), value); log('WROUTE1_WEB_MANIFEST PASS'); }
