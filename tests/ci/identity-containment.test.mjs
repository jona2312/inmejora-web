import '../../scripts/ci/offline-guard.mjs';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import axios from 'axios';
import { transformSync } from 'esbuild';
import { parse } from '@babel/parser';
import { InmejoraAuthProvider, useAuth } from '../../src/contexts/containedClientAuth.js';
import { SupplierProvider, useSupplier } from '../../src/contexts/containedSupplierAuth.js';
import {
  clientAuthBlocked, supplierAuthBlocked, getClientCredential,
} from '../../src/contexts/identityContainment.js';
import { supplierApiCall, getSupplierToken, setSupplierToken, isSupplierLoggedIn } from '../../src/utils/supplierApi.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const source = path => readFileSync(resolve(root, path), 'utf8');
const flows = [
  { name: 'client', Provider: InmejoraAuthProvider, hook: useAuth, identity: 'user', flag: 'isAuthenticated', result: clientAuthBlocked,
    operations: ['login', 'register', 'checkAuth', 'forgotPassword', 'resetPassword', 'updateProfile'] },
  { name: 'supplier', Provider: SupplierProvider, hook: useSupplier, identity: 'supplier', flag: 'isLoggedIn', result: supplierAuthBlocked,
    operations: ['login', 'register', 'validateSession', 'updateProfile'] },
];
function capture(flow, wrapped = true, forgedValue) {
  let value;
  function Probe() { value = flow.hook(); return React.createElement('span', null, value[flow.flag] ? 'allowed' : 'denied'); }
  const child = React.createElement(Probe);
  assert.equal(renderToStaticMarkup(wrapped ? React.createElement(flow.Provider, { value: forgedValue }, child) : child), '<span>denied</span>');
  assert.equal(value[flow.identity], null);
  assert.equal(value.isLoading, false);
  return value;
}
function installStorage(entries = []) {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const data = new Map(entries);
  let reads = 0;
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem(key) { reads++; return data.get(key) ?? null; },
    setItem(key, value) { data.set(key, value); },
    removeItem(key) { data.delete(key); },
  } });
  return { data, reads: () => reads, restore() {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else delete globalThis.localStorage;
  } };
}
function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; }

for (const flow of flows) {
  test(`${flow.name}: anonymous and mounted providers always deny, even with forged provider props`, () => {
    for (const wrapped of [false, true]) {
      const state = capture(flow, wrapped, { user: { id: 'forged' }, supplier: { id: 'forged' }, isLoggedIn: true, isAuthenticated: true });
      assert.equal(Object.isFrozen(state), true);
      assert.match(state.unavailableReason, /no disponibles/);
      assert.throws(() => { state[flow.identity] = { id: 'forged' }; }, TypeError);
    }
  });

  test(`${flow.name}: missing, malformed, expired, revoked and manipulated cached identities are not credentials`, async () => {
    const storage = installStorage();
    try {
      for (const token of [null, '', '123', 'user-id', 'header.payload.signature']) {
        for (const profile of ['{malformed', 'null', '{}', JSON.stringify({ id: 'A', status: 'revoked', exp: 1 }),
          JSON.stringify({ id: 'B', status: 'approved', user_metadata: { role: 'admin' }, app_metadata: { role: 'admin' } })]) {
          storage.data.set('inmejora_user', profile);
          storage.data.set('supplier_data', profile);
          storage.data.set('inmejora_token', token);
          storage.data.set('supplier_token', token);
          const before = [...storage.data];
          const state = capture(flow);
          for (const operation of flow.operations) assert.equal(await state[operation](token, profile), flow.result);
          assert.deepEqual([...storage.data], before);
          assert.equal(getClientCredential(), null);
          assert.equal(getSupplierToken(), null);
          assert.equal(isSupplierLoggedIn(), false);
        }
      }
      assert.equal(storage.reads(), 0, 'cached identities must not even be parsed');
    } finally { storage.restore(); }
  });

  test(`${flow.name}: operations reject without inspecting credentials, response-like objects or thenables`, async () => {
    const hostile = new Proxy({}, { get() { throw new Error('Credentials/payload must not be inspected'); } });
    const state = capture(flow);
    for (const operation of flow.operations) assert.equal(await state[operation](hostile, hostile), flow.result);
    assert.equal(capture(flow), state);
  });

  test(`${flow.name}: late action completion after logout/account switch cannot restore the old identity`, async () => {
    const storage = installStorage([['inmejora_token', 'A'], ['supplier_token', 'A']]);
    try {
      const first = capture(flow);
      const oldLogin = first.login('a@example.invalid', 'synthetic-A');
      const releaseOldCaller = deferred();
      const delayedCompletion = releaseOldCaller.promise.then(() => oldLogin);
      const oldValidation = first[flow.name === 'client' ? 'checkAuth' : 'validateSession']();
      const logoutResult = first.logout();
      assert.equal(logoutResult.serverRevocationVerified, false);
      storage.data.set('inmejora_user', JSON.stringify({ id: 'B', role: 'admin' }));
      storage.data.set('supplier_data', JSON.stringify({ id: 'B', status: 'approved' }));
      const second = capture(flow);
      const newLogin = second.login('b@example.invalid', 'synthetic-B');
      assert.equal(await newLogin, flow.result);
      releaseOldCaller.resolve();
      assert.equal(await delayedCompletion, flow.result);
      assert.equal(await oldValidation, flow.result);
      assert.equal(capture(flow), first);
      const completions = await Promise.all(Array.from({ length: 20 }, (_, i) =>
        first[flow.operations[i % flow.operations.length]]({ id: i, status: 'approved' })));
      assert.ok(completions.every(result => result === flow.result));
      assert.equal(capture(flow)[flow.flag], false);
    } finally { storage.restore(); }
  });

  test(`${flow.name}: logout only clears its own historical cache; storage failures cannot enable identity`, () => {
    const storage = installStorage([['inmejora_token', 'A'], ['inmejora_user', '{}'], ['supplier_token', 'B'], ['supplier_data', '{}'], ['unrelated', 'keep']]);
    try {
      const result = capture(flow).logout();
      assert.equal(result.scope, 'browser-only');
      assert.equal(result.cacheCleared, true);
      assert.equal(result.serverRevocationVerified, false);
      assert.equal(storage.data.get('unrelated'), 'keep');
      const ownKeys = flow.name === 'client' ? ['inmejora_token', 'inmejora_user'] : ['supplier_token', 'supplier_data'];
      assert.ok(ownKeys.every(key => !storage.data.has(key)));
      const otherKey = flow.name === 'client' ? 'supplier_token' : 'inmejora_token';
      assert.ok(storage.data.has(otherKey));
      Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Storage unavailable'); } });
      assert.equal(capture(flow).logout().cacheCleared, false);
      assert.equal(capture(flow)[flow.flag], false);
    } finally { storage.restore(); }
  });
}

// VM loader: real modules/JSX, actual React SSR and Axios; only listed UI
// dependencies and transport responses are controlled. No browser or live API.
async function load(path, { globals = {}, dependencies = {} } = {}) {
  const context = createContext({ ...globals });
  const cache = new Map();
  const imports = { react: { default: React, ...React }, axios: { default: axios }, ...dependencies };
  function getModule(file) {
    if (cache.has(file)) return cache.get(file);
    const text = source(file);
    const code = extname(file) === '.jsx' ? transformSync(text, { loader: 'jsx', format: 'esm', jsx: 'transform' }).code : text;
    const module = new SourceTextModule(code, { context, identifier: file, initializeImportMeta: meta => { meta.env = {}; } });
    cache.set(file, module);
    return module;
  }
  const module = getModule(path);
  await module.link((specifier, parent) => {
    if (imports[specifier]) {
      const values = imports[specifier];
      return new SyntheticModule(Object.keys(values), function () {
        for (const [key, value] of Object.entries(values)) this.setExport(key, value);
      }, { context });
    }
    assert.ok(specifier.startsWith('.') || specifier.startsWith('@/'), `Unexpected import ${specifier}`);
    const relative = specifier.startsWith('@/') ? `src/${specifier.slice(2)}` : `${dirname(parent.identifier)}/${specifier}`;
    const file = [relative, `${relative}.js`, `${relative}.jsx`].find(name => existsSync(resolve(root, name)));
    assert.ok(file, specifier);
    return getModule(file);
  });
  await module.evaluate();
  return module.namespace;
}

test('supplier 200 malformed/missing provider, revoked, 401/403 and hanging transport are all blocked before dispatch', async () => {
  const original = globalThis.fetch;
  let calls = 0;
  try {
    for (const fixture of [null, {}, [], 'malformed', { provider: null }, { provider: { id: 'A', status: 'revoked' } },
      { provider: { id: 'A', status: 'approved' }, token: 'looks-like-a-token' },
      { status: 401 }, { status: 403 }, new Promise(() => {})]) {
      globalThis.fetch = async () => { calls++; return fixture; };
      await assert.rejects(supplierApiCall('/supplier-login', { method: 'GET' }), { code: 'SUPPLIER_AUTH_BLOCKED' });
      await assert.rejects(supplierApiCall('/supplier-products', { method: 'DELETE', body: '{"id":"other-owner"}' }), { code: 'SUPPLIER_AUTH_BLOCKED' });
      assert.equal(setSupplierToken('fake-token'), supplierAuthBlocked);
      assert.equal(capture(flows[1]).supplier, null);
    }
    assert.equal(calls, 0, 'no request exists to time out or deliver a late identity');
  } finally { globalThis.fetch = original; }
});

test('contained providers have no state setters, timers, listeners or transport imports to accept stale responses', () => {
  for (const file of ['src/contexts/containedClientAuth.js', 'src/contexts/containedSupplierAuth.js']) {
    const ast = parse(source(file), { sourceType: 'module' });
    const imports = ast.program.body.filter(node => node.type === 'ImportDeclaration');
    assert.deepEqual(imports.map(node => node.source.value), ['react', './identityContainment.js']);
    assert.deepEqual(imports[0].specifiers.map(item => item.imported.name), ['createContext', 'createElement', 'useContext']);
    assert.doesNotMatch(source(file), /\b(fetch|setTimeout|setInterval|addEventListener|useState|useEffect|localStorage)\b/);
  }
  assert.match(source('src/contexts/InmejoraAuthContext.jsx'), /export \{ InmejoraAuthProvider, useAuth \} from '.\/containedClientAuth'/);
  assert.match(source('src/contexts/SupplierContext.jsx'), /export \{ SupplierProvider, useSupplier \} from '.\/containedSupplierAuth'/);
});

test('client transports reject forged local bearer and caller Authorization before Axios adapter or fetch', async () => {
  const storage = { getItem() { throw new Error('Must not read browser token'); } };
  for (const path of ['src/lib/apiCall.js', 'src/utils/apiClient.js']) {
    const loaded = await load(path, { globals: { localStorage: storage } });
    let calls = 0;
    loaded.default.defaults.adapter = async () => { calls++; return { data: { user: { id: 'forged' } }, status: 200 }; };
    await assert.rejects(loaded.default.get('/private', { headers: { Authorization: 'Bearer user-id' } }), { code: 'CLIENT_AUTH_BLOCKED' });
    assert.equal(calls, 0);
  }
  let calls = 0;
  const legacy = await load('src/lib/apiClient.js', { globals: { localStorage: storage, fetch() { calls++; throw new Error('Unexpected transport'); } } });
  for (const path of ['/api/horizon/client/cotizar', '/api/horizon/client/pagos', '/api/horizon/catalogo/colores/../private',
    'https://example.invalid/private', '/api/horizon/catalogo/productos#fragment']) {
    await assert.rejects(legacy.apiCall(path), { code: 'CLIENT_AUTH_BLOCKED' });
  }
  await assert.rejects(legacy.apiCall('/api/horizon/catalogo/colores', 'POST', {}), { code: 'CLIENT_AUTH_BLOCKED' });
  await assert.rejects(legacy.apiCallFormData('/private', 'POST', {}), { code: 'CLIENT_AUTH_BLOCKED' });
  assert.equal(calls, 0);
});

test('existing public catalog reads stay anonymous, including when forged local credentials exist', async () => {
  const calls = [];
  const legacy = await load('src/lib/apiClient.js', { globals: {
    localStorage: { getItem() { throw new Error('Must not read cached credential'); } },
    fetch: async (url, config) => {
      calls.push({ url, config });
      return { ok: true, status: 200, headers: { get: name => name === 'content-type' ? 'application/json' : null }, json: async () => ({ items: [] }) };
    },
  } });
  for (const path of ['/api/horizon/catalogo/colores?limit=2', '/api/horizon/catalogo/productos']) await legacy.apiCall(path);
  assert.equal(calls.length, 2);
  for (const call of calls) {
    assert.equal(call.config.method, 'GET');
    assert.equal(call.config.headers.Authorization, undefined);
  }
});

for (const [path, hookName, authImport, flag] of [
  ['src/components/ProtectedRoute.jsx', 'useAuth', '@/contexts/InmejoraAuthContext', 'isAuthenticated'],
  ['src/components/SupplierProtectedRoute.jsx', 'useSupplier', '@/contexts/SupplierContext', 'isLoggedIn'],
]) {
  test(`${path}: loading and anonymous guards never mount privileged child`, async () => {
    for (const isLoading of [true, false]) {
      let childRenders = 0;
      const redirects = [];
      const loaded = await load(path, { dependencies: {
        [authImport]: { [hookName]: () => ({ isLoading, [flag]: false }) },
        'react-router-dom': { useLocation: () => ({ pathname: '/protected' }), Navigate: props => { redirects.push(props); return null; } },
        '@/components/Spinner': { default: () => React.createElement('span', null, 'loading') },
        'lucide-react': { Loader2: () => React.createElement('span', null, 'loading') },
      } });
      const Child = () => { childRenders++; return React.createElement('span', null, 'private'); };
      renderToStaticMarkup(React.createElement(loaded.default, null, React.createElement(Child)));
      assert.equal(childRenders, 0);
      assert.equal(redirects.length, isLoading ? 0 : 1);
      if (!isLoading) assert.equal(redirects[0].replace, true);
    }
  });
}

test('recovery and supplier registration pages render explicit unavailability with no credential form or API import', async () => {
  for (const path of ['src/pages/ForgotPasswordPage.jsx', 'src/pages/ResetPasswordPage.jsx', 'src/pages/ProveedorRegisterPage.jsx', 'src/pages/SupplierRegistrationPage.jsx']) {
    const loaded = await load(path);
    const html = renderToStaticMarkup(React.createElement(loaded.default));
    assert.match(html, /no disponible/);
    assert.match(html, /No se creó una cuenta/);
    assert.doesNotMatch(html, /<form|<input|Email enviado|Registro exitoso|Contraseña actualizada/);
    assert.doesNotMatch(source(path), /supabase|setTimeout|useSearchParams/);
  }
  const client = capture(flows[0]);
  assert.equal((await client.forgotPassword('synthetic@example.invalid')).success, false);
  assert.equal((await client.resetPassword('expired-url-code', 'synthetic-new-password')).success, false);
});

test('actual login/registration handlers consume denial without success toast, redirect or timer', async () => {
  for (const [name, state] of [['LoginPage', capture(flows[0])], ['RegistrationPage', capture(flows[0])], ['SupplierLoginPage', capture(flows[1])]]) {
    const text = source(`src/pages/${name}.jsx`);
    const ast = parse(text, { sourceType: 'module', plugins: ['jsx'] });
    const component = ast.program.body.flatMap(node => node.declarations ?? []).find(node => node.id.name === name);
    const handler = component.init.body.body.flatMap(node => node.declarations ?? []).find(node => node.id.name === 'handleSubmit');
    const notifications = [], loading = [], errors = [];
    const forbidden = () => { throw new Error('Denied account action must not navigate, schedule or purchase'); };
    const context = createContext({
      login: state.login, register: state.register,
      formData: { name: 'Synthetic', email: 'synthetic@example.invalid', password: 'synthetic-password', phone: 'synthetic', terms: true },
      validate: () => true, validateAll: () => true, planToSubscribe: 'synthetic-plan',
      setIsLoading: value => loading.push(value), setApiError: value => errors.push(value),
      toast: value => notifications.push(value), navigate: forbidden, setTimeout: forbidden, handleSubscribe: forbidden,
    });
    const module = new SourceTextModule(`export default ${text.slice(handler.init.start, handler.init.end)};`, { context });
    await module.link(() => { throw new Error('Unexpected handler import'); });
    await module.evaluate();
    await module.namespace.default({ preventDefault() {} });
    assert.equal(loading.at(-1), false);
    if (name === 'SupplierLoginPage') assert.equal(errors.at(-1), state.unavailableReason);
    else {
      assert.equal(notifications.at(-1).variant, 'destructive');
      assert.equal(notifications.at(-1).description, state.unavailableReason);
    }
    assert.match(text, /role="status"/);
    assert.match(text, /disabled=\{isLoading \|\| Boolean\(unavailableReason\)/);
  }
});

test('public plan identity lookup and generic useApi never forward a cached user ID', async () => {
  let calls = 0;
  const forbidden = () => { calls++; throw new Error('Unverified identity used for transport'); };
  let identity = { id: 'A', app_metadata: { role: 'admin' } };
  const loaded = await load('src/hooks/useCurrentPlan.js', { globals: {
    localStorage: { getItem: forbidden },
  }, dependencies: {
    '@/contexts/SupabaseAuthContext': { useAuth: () => ({ user: identity, logout: forbidden }) },
    axios: { default: { get: forbidden } },
  } });
  let state;
  function Probe() { state = loaded.useCurrentPlan(); return null; }
  renderToStaticMarkup(React.createElement(Probe));
  const oldRefetch = state.refetch;
  assert.equal(state.currentPlan, null);
  identity = { id: 'B' };
  renderToStaticMarkup(React.createElement(Probe));
  await state.refetch();
  await oldRefetch();
  assert.equal(calls, 0);
  const generic = await load('src/hooks/useApi.js', { globals: { localStorage: { getItem: forbidden } } });
  const result = await generic.useApi().request('POST', '/private', { userId: 'A' }, { Authorization: 'Bearer A' });
  assert.equal(result.data, null);
  assert.match(result.error, /no disponibles/);
  assert.equal(generic.useApi().loading, false);
});

test('ownership matrix enumerates every current Route, and contained portal routes keep their guard', () => {
  const matrix = JSON.parse(source('docs/p0/identity-ownership.json'));
  const ast = parse(source('src/App.jsx'), { sourceType: 'module', plugins: ['jsx'] });
  const routes = new Map();
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'JSXOpeningElement' && node.name.name === 'Route') {
      const path = node.attributes.find(item => item.name?.name === 'path')?.value?.value;
      if (path) {
        const element = node.attributes.find(item => item.name?.name === 'element')?.value?.expression;
        routes.set(path, element?.openingElement?.name?.name);
      }
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') visit(value);
    }
  }
  visit(ast);
  const documented = matrix.routeGroups.flatMap(group => group.routes);
  assert.equal(new Set(documented).size, documented.length);
  assert.deepEqual(documented.sort(), [...routes.keys()].sort());
  for (const group of matrix.routeGroups) {
    assert.ok(group.classification.length);
    for (const classification of group.classification) assert.ok(matrix.classificationLegend[classification]);
    for (const path of group.routes) {
      if (path === '/portal' || path.startsWith('/portal/')) assert.equal(routes.get(path), 'ProtectedRoute');
      if (path === '/proveedores/portal') assert.equal(routes.get(path), 'SupplierProtectedRoute');
    }
  }
});
