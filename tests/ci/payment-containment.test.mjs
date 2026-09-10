import '../../scripts/ci/offline-guard.mjs';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';
import { parse } from '@babel/parser';

const root = fileURLToPath(new URL('../../', import.meta.url));
const notice = {
  title: 'Pagos temporalmente no disponibles',
  description: 'Las compras están deshabilitadas por el momento. No se inició ningún pago.',
};
const hooks = [
  { name: 'useMercadoPagoCheckout', action: 'handleSubscribe', keys: ['handleSubscribe', 'hookProductId', 'loadingProductId'] },
  { name: 'useMercadoPago', action: 'handleCheckout', keys: ['handleCheckout', 'loadingProductId'] },
  { name: 'useStripeCheckout', action: 'initiateCheckout', keys: ['error', 'initiateCheckout', 'loading'] },
];
const inputs = [undefined, null, '', 'synthetic-plan', 1, { productId: 'synthetic-plan' }, { id: 'synthetic-plan' }];

// Evaluate the actual, unmodified ESM module. Only the UI notification dependency
// is substituted; any added auth, router or transport dependency fails linking.
async function loadModule(path, configuration = {}) {
  const effects = [];
  const notifications = [];
  const forbidden = name => () => {
    effects.push(name);
    throw new Error(`Forbidden payment side effect: ${name}`);
  };
  const sandbox = { ...configuration };
  for (const name of ['fetch', 'setTimeout', 'setInterval', 'queueMicrotask']) {
    sandbox[name] = forbidden(name);
  }
  for (const name of ['window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'location', 'XMLHttpRequest', 'WebSocket']) {
    Object.defineProperty(sandbox, name, { get: forbidden(name) });
  }
  sandbox.console = Object.fromEntries(['log', 'error', 'warn', 'info', 'debug'].map(name => [name, forbidden(`console.${name}`)]));
  const context = createContext(sandbox, { codeGeneration: { strings: false, wasm: false } });
  const module = new SourceTextModule(readFileSync(resolve(root, path), 'utf8'), {
    context,
    identifier: path,
    initializeImportMeta(meta) {
      Object.defineProperty(meta, 'env', { get: forbidden('import.meta.env') });
    },
    importModuleDynamically: forbidden('dynamic import'),
  });
  await module.link(specifier => {
    assert.equal(specifier, '@/components/ui/use-toast', 'No payment, identity or navigation dependency is permitted');
    return new SyntheticModule(['useToast'], function () {
      this.setExport('useToast', () => ({ toast: value => notifications.push(JSON.parse(JSON.stringify(value))) }));
    }, { context });
  });
  await module.evaluate();
  return { exports: module.namespace, effects, notifications };
}

const hostile = new Proxy({}, { get() { throw new Error('Payment input must not be inspected'); } });

for (const hook of hooks) {
  test(`${hook.name}: preserves settled public shape and explicitly notifies on every input`, async () => {
    const loaded = await loadModule(`src/hooks/${hook.name}.js`);
    const instance = loaded.exports[hook.name](hostile);
    assert.deepEqual(Object.keys(instance).sort(), hook.keys);
    if (hook.name === 'useMercadoPagoCheckout') assert.equal(instance.hookProductId, hostile);
    for (const input of [...inputs, hostile]) {
      assert.equal(await instance[hook.action](input, hostile), undefined);
      assert.deepEqual(loaded.notifications.at(-1), notice);
    }
    if ('loadingProductId' in instance) assert.equal(instance.loadingProductId, null);
    if ('loading' in instance) assert.equal(instance.loading, false);
    if ('error' in instance) assert.equal(instance.error, null);
    assert.equal(loaded.notifications.length, inputs.length + 1);
    assert.deepEqual(loaded.effects, []);
  });

  test(`${hook.name}: repeated clicks and forged user/config cannot enable purchases`, async () => {
    const loaded = await loadModule(`src/hooks/${hook.name}.js`, {
      PLANES_ACTIVOS: true,
      PAYMENTS_ENABLED: true,
      user: { id: 'synthetic-user', role: 'admin' },
      token: 'synthetic-not-a-credential',
    });
    const instance = loaded.exports[hook.name]('synthetic-plan');
    await Promise.all(Array.from({ length: 20 }, () => instance[hook.action](hostile, hostile)));
    assert.equal(loaded.notifications.length, 20);
    for (const notification of loaded.notifications) assert.deepEqual(notification, notice);
    const rerender = loaded.exports[hook.name]('synthetic-plan');
    if ('loadingProductId' in rerender) assert.equal(rerender.loadingProductId, null);
    if ('loading' in rerender) assert.equal(rerender.loading, false);
    assert.deepEqual(loaded.effects, []);
  });
}

for (const action of ['createCheckout', 'createPreference']) {
  test(`mercadoPagoAPI.${action}: direct calls always reject explicitly without transport or browser access`, async () => {
    const loaded = await loadModule('src/utils/mercadoPagoAPI.js', { PAYMENTS_ENABLED: true });
    const reject = input => assert.rejects(loaded.exports.mercadoPagoAPI[action](input), error => {
      assert.equal(error.code, 'PAYMENTS_TEMPORARILY_UNAVAILABLE');
      assert.equal(error.message, 'Pagos temporalmente no disponibles. No se inició ningún pago.');
      return true;
    });
    for (const input of [...inputs, hostile]) await reject(input);
    await Promise.all(Array.from({ length: 20 }, () => reject(hostile)));
    assert.deepEqual(loaded.effects, []);
    assert.deepEqual(loaded.notifications, []);
  });
}

test('contained modules contain no transport, credential, identity, navigation or enable-flag paths', () => {
  for (const path of [...hooks.map(hook => `src/hooks/${hook.name}.js`), 'src/utils/mercadoPagoAPI.js']) {
    const source = readFileSync(resolve(root, path), 'utf8');
    assert.doesNotMatch(source, /\b(?:fetch|axios|apiCall|localStorage|sessionStorage|useAuth|useNavigate|window|location|XMLHttpRequest|WebSocket|PLANES_ACTIVOS|PAYMENTS_ENABLED)\b|import\.meta|functions\/v1\/|VITE_MERCADO_PAGO_ACCESS_TOKEN|Authorization/, path);
  }
});

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(?:js|jsx|ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

test('source import inventory covers current payment hook/wrapper callers (not a runtime reachability assertion)', () => {
  const expected = {
    useMercadoPagoCheckout: ['src/components/pricing/PricingCard.jsx', 'src/pages/CheckoutPage.jsx', 'src/pages/PlansPage.jsx', 'src/pages/RegistrationPage.jsx'],
    useMercadoPago: [],
    useStripeCheckout: ['src/components/plans/PlanSelectionModal.jsx'],
    mercadoPagoAPI: [],
  };
  const files = sourceFiles(resolve(root, 'src'));
  for (const [name, callers] of Object.entries(expected)) {
    const importPattern = new RegExp(`(?:from\\s*|import\\s*\\()(['"])[^'"\\r\\n]*/${name}(?:\\.js)?\\1`);
    const actual = files.filter(path => importPattern.test(readFileSync(path, 'utf8')))
      .map(path => relative(root, path).split(sep).join('/')).sort();
    assert.deepEqual(actual, callers, `${name}: review any added or removed callers`);
  }
  assert.match(readFileSync(resolve(root, 'src/pages/RegistrationPage.jsx'), 'utf8'), /await handleSubscribe\(planToSubscribe\)/);
  const pricing = readFileSync(resolve(root, 'src/components/pricing/PricingCard.jsx'), 'utf8');
  assert.match(pricing, /const PLANES_ACTIVOS\s*=\s*false/);
  assert.match(pricing, /handleSubscribe\(resolvedProductId\)/);
});

// Extract the actual handler by AST source offsets, without rewriting its body.
// This verifies the callback contract, not full React/browser form interaction.
async function registrationHandler({ plan = 'synthetic-plan', result = { success: true }, valid = true, checkout } = {}) {
  const source = readFileSync(resolve(root, 'src/pages/RegistrationPage.jsx'), 'utf8');
  const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  const component = ast.program.body.flatMap(node => node.declarations ?? []).find(node => node.id.name === 'RegistrationPage');
  const handler = component.init.body.body.flatMap(node => node.declarations ?? []).find(node => node.id.name === 'handleSubmit');
  assert.equal(handler.init.type, 'ArrowFunctionExpression');
  assert.equal(handler.init.async, true);
  const loadedHook = await loadModule('src/hooks/useMercadoPagoCheckout.js');
  const trace = { loading: [], registration: [], navigation: [], timers: [], prevented: 0 };
  const context = createContext({
    planToSubscribe: plan,
    formData: { name: 'Synthetic User', email: 'synthetic@example.invalid', password: 'synthetic-input', phone: 'synthetic-phone', terms: true },
    validateAll: () => valid,
    register: async (...args) => { trace.registration.push(args); return result; },
    toast: notification => loadedHook.notifications.push(JSON.parse(JSON.stringify(notification))),
    handleSubscribe: checkout ?? loadedHook.exports.useMercadoPagoCheckout().handleSubscribe,
    setIsLoading: value => trace.loading.push(value),
    navigate: path => trace.navigation.push(path),
    setTimeout: (callback, delay) => trace.timers.push({ callback, delay }),
    fetch: () => { throw new Error('Unexpected handler transport'); },
  });
  const module = new SourceTextModule(`export default ${source.slice(handler.init.start, handler.init.end)};`, { context });
  await module.link(() => { throw new Error('Unexpected handler import'); });
  await module.evaluate();
  return {
    trace, notifications: loadedHook.notifications, effects: loadedHook.effects,
    submit: () => module.namespace.default({ preventDefault: () => { trace.prevented++; } }),
  };
}

test('actual registration handler with ?plan calls contained hook, releases loading and promises no redirection', async () => {
  const handler = await registrationHandler();
  await handler.submit();
  assert.equal(handler.trace.prevented, 1);
  assert.deepEqual(handler.trace.registration, [['Synthetic User', 'synthetic@example.invalid', 'synthetic-input', 'synthetic-phone', true]]);
  assert.deepEqual(handler.trace.loading, [true, false]);
  assert.deepEqual(handler.trace.navigation, []);
  assert.deepEqual(handler.trace.timers, []);
  assert.deepEqual(handler.notifications, [notice]);
  assert.deepEqual(handler.effects, []);
});

test('actual registration handler releases plan loading even when the notification callback fails', async () => {
  const handler = await registrationHandler({ checkout: async () => { throw new Error('synthetic UI notification failure'); } });
  await assert.rejects(handler.submit(), /synthetic UI notification failure/);
  assert.deepEqual(handler.trace.loading, [true, false]);
  assert.deepEqual(handler.trace.navigation, []);
  assert.deepEqual(handler.trace.timers, []);
});

test('actual registration handler preserves free registration portal timer without invoking checkout', async () => {
  const handler = await registrationHandler({ plan: null, checkout: () => { throw new Error('Unexpected free checkout'); } });
  await handler.submit();
  assert.deepEqual(handler.trace.loading, [true]);
  assert.equal(handler.trace.timers.length, 1);
  assert.equal(handler.trace.timers[0].delay, 1000);
  assert.deepEqual(handler.trace.navigation, []);
  handler.trace.timers[0].callback();
  assert.deepEqual(handler.trace.navigation, ['/portal']);
  assert.deepEqual(handler.notifications, [{ title: '¡Bienvenido!', description: 'Redirigiendo al portal...' }]);
});

test('actual registration handler preserves registration-denied and invalid-form branches', async () => {
  const denied = await registrationHandler({ result: { success: false, error: 'synthetic registration denial' }, checkout: () => { throw new Error('Unexpected denied checkout'); } });
  await denied.submit();
  assert.deepEqual(denied.trace.loading, [true, false]);
  assert.equal(denied.notifications[0].title, 'Error al registrarse');
  assert.deepEqual(denied.trace.navigation, []);
  const invalid = await registrationHandler({ valid: false });
  await invalid.submit();
  assert.deepEqual(invalid.trace.loading, []);
  assert.deepEqual(invalid.trace.registration, []);
  assert.equal(invalid.notifications[0].title, 'Error de validación');
});
