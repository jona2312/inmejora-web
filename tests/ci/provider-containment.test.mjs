import '../../scripts/ci/offline-guard.mjs';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProveedorAuthProvider, useProveedorAuth } from '../../src/contexts/disabledProveedorAuth.js';

function captureSession(wrapped = true) {
  let session;
  function Consumer() {
    session = useProveedorAuth();
    return createElement('span', null, session.provider ? 'allowed' : 'denied');
  }
  const child = createElement(Consumer);
  assert.equal(renderToStaticMarkup(wrapped ? createElement(ProveedorAuthProvider, null, child) : child), '<span>denied</span>');
  return session;
}

test('compatibility entry point uses exactly the tested implementation', () => {
  const facade = readFileSync(new URL('../../src/contexts/ProveedorAuthContext.jsx', import.meta.url), 'utf8');
  const executable = facade.split('\n').filter(line => !line.trim().startsWith('//')).join('\n').trim();
  assert.equal(executable, "export { ProveedorAuthProvider, useProveedorAuth } from './disabledProveedorAuth.js';");
});

test('inside and outside provider expose only a settled, immutable denied session', () => {
  for (const wrapped of [true, false]) {
    const session = captureSession(wrapped);
    assert.equal(session.provider, null);
    assert.equal(session.loading, false);
    assert.equal(Object.isFrozen(session), true);
    assert.throws(() => { session.provider = { id: 'forged' }; }, TypeError);
  }
});

test('all legacy operations deny arbitrary input without storage reads/writes or network', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() { throw new Error('Unexpected storage access'); },
  });
  try {
    const session = captureSession();
    const hostileInput = new Proxy({}, { get() { throw new Error('Unexpected credential inspection'); } });
    for (const action of ['login', 'register', 'checkSession', 'logout']) {
      const result = await session[action](hostileInput, hostileInput);
      assert.deepEqual(result, {
        success: false,
        error: 'El acceso de proveedores legado está deshabilitado por seguridad.',
        code: 'LEGACY_PROVIDER_AUTH_DISABLED',
      });
      assert.equal(Object.isFrozen(result), true);
      assert.equal(captureSession().provider, null);
    }
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  }
});

test('forged approved browser data cannot establish identity and is not destroyed', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const entries = new Map([
    ['provider_token', 'synthetic-not-a-credential'],
    ['provider_data', JSON.stringify({ id: 'forged', status: 'approved' })],
  ]);
  const before = [...entries];
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => entries.get(key),
    setItem: (key, value) => entries.set(key, value),
    removeItem: key => entries.delete(key),
  } });
  try {
    for (const action of ['login', 'register', 'checkSession', 'logout']) {
      assert.equal((await captureSession()[action]('synthetic@example.invalid', 'synthetic-input')).success, false);
    }
    assert.deepEqual([...entries], before);
    assert.equal(captureSession().provider, null);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else delete globalThis.localStorage;
  }
});
