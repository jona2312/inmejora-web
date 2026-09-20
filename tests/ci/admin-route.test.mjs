import '../../scripts/ci/offline-guard.mjs';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transformSync } from 'esbuild';

const source = readFileSync(new URL('../../src/components/admin/ProtectedAdminRoute.jsx', import.meta.url), 'utf8');
const code = transformSync(source, { loader: 'jsx', format: 'esm', jsx: 'transform' }).code;

async function renderGuard(auth) {
  const context = createContext({});
  const redirects = [];
  let childRenders = 0;
  function Child() { childRenders++; return React.createElement('span', null, 'admin'); }
  const dependencies = {
    react: { default: React },
    'react-router-dom': { Navigate: props => { redirects.push(props); return null; } },
    '@/contexts/SupabaseAuthContext': { useAuth: () => auth },
    '@/components/Spinner': { default: () => React.createElement('span', null, 'loading') },
  };
  const module = new SourceTextModule(code, { context });
  await module.link(specifier => {
    const exports = dependencies[specifier];
    assert.ok(exports, `Unexpected import: ${specifier}`);
    return new SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context });
  });
  await module.evaluate();
  const html = renderToStaticMarkup(React.createElement(module.namespace.default, null, React.createElement(Child)));
  return { html, redirects, childRenders };
}

test('loading and missing session never mount privileged children', async () => {
  const pending = await renderGuard({ loading: true, user: { app_metadata: { role: 'admin' } } });
  assert.equal(pending.childRenders, 0);
  assert.match(pending.html, /loading/);
  assert.deepEqual(pending.redirects, []);
  const missing = await renderGuard({ loading: false, user: null });
  assert.equal(missing.childRenders, 0);
  assert.equal(missing.redirects[0].to, '/login');
  assert.equal(missing.redirects[0].replace, true);
});

test('forged metadata, historical admin email and malformed roles deny access', async () => {
  for (const user of [
    {}, { user_metadata: { role: 'admin' } }, { email: 'jonabrewing@gmail.com' },
    { email: 'jonabrewing@gmail.com', user_metadata: { role: 'admin' }, app_metadata: { role: 'customer' } },
    ...[undefined, null, '', true, ['admin'], 'Admin', ' admin '].map(role => ({ app_metadata: { role } })),
  ]) {
    const result = await renderGuard({ user, loading: false });
    assert.equal(result.childRenders, 0);
    assert.equal(result.redirects[0].to, '/');
    assert.equal(result.redirects[0].replace, true);
  }
});

test('explicit app role preserves admin UI access without user metadata', async () => {
  const result = await renderGuard({ loading: false, user: { app_metadata: { role: 'admin' } } });
  assert.equal(result.childRenders, 1);
  assert.equal(result.html, '<span>admin</span>');
  assert.deepEqual(result.redirects, []);
});
