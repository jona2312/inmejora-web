import '../../scripts/ci/offline-guard.mjs';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import { matchRoutes } from 'react-router-dom';

// Execute the actual App guard with the same installed matcher used by <Routes>.
// This catches variants that match a legacy page but bypass its commercial redirect.
const app = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');
const mapping = app.match(/const SALES_REDIRECTS = (\{[\s\S]*?\n\});/);
assert.ok(mapping, 'App redirect map must exist');
const routes = runInNewContext(`(${mapping[1]})`);
const derived = app.match(/const SALES_REDIRECT_ROUTES = [^;]+;/)?.[0] || '';
const guard = app.match(/const salesTarget = ([^;]+);/);
assert.ok(guard, 'test must execute the actual App guard');
function redirect(pathname, SALES = true) {
  return runInNewContext(`const SALES_REDIRECTS = ${mapping[1]}; ${derived} (${guard[1]})`, { pathname, SALES, matchRoutes });
}

for (const [name, variant] of [
  ['uppercase', p => p.toUpperCase()],
  ['mixed case and trailing slash', p => p.replace(/[a-z]/g, (c, i) => i % 2 ? c.toUpperCase() : c) + '/'],
  ['encoded letters', p => p.replace(/[a-z]/g, c => '%' + c.charCodeAt(0).toString(16))],
]) {
  test(`all commercial legacy routes contain ${name} variants`, () => {
    for (const [path, target] of Object.entries(routes)) {
      const candidate = variant(path);
      assert.ok(matchRoutes([{ path }], candidate), `Router must mount ${path} for ${candidate}`);
      assert.equal(redirect(candidate), target, `${candidate} must not mount the legacy page`);
    }
  });
}
test('canonical targets and unrelated routes remain accessible; disabled sales mode is unchanged', () => {
  for (const path of ['/contacto', '/servicios', '/', '/portal', '/presupuesto-extra']) assert.equal(redirect(path), undefined);
  for (const path of Object.keys(routes)) assert.equal(redirect(path, false), undefined);
});
