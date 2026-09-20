import '../../scripts/ci/offline-guard.mjs';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createContext, SourceTextModule, SyntheticModule, runInContext } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transformSync } from 'esbuild';
import { parse } from '@babel/parser';
import * as lead from '../../src/utils/FormValidation.js';
import * as auth from '../../src/utils/authValidation.js';

const root = fileURLToPath(new URL('../../', import.meta.url));

// The actual component module is only JSX-transpiled. UI/context dependencies
// are synthetic fixtures; no app providers, router, environment or service load.
async function renderComponent(path, subscription = {}) {
  const effects = [];
  const navigation = [];
  const clicks = [];
  const animations = [];
  const denied = name => () => { effects.push(name); throw new Error(`Unexpected component effect: ${name}`); };
  const sandbox = { fetch: denied('fetch'), setTimeout: denied('timer'), setInterval: denied('interval') };
  for (const name of ['window', 'document', 'localStorage', 'sessionStorage', 'location']) Object.defineProperty(sandbox, name, { get: denied(name) });
  sandbox.console = { log: denied('log'), error: denied('error'), warn: denied('warn') };
  const context = createContext(sandbox, { codeGeneration: { strings: false, wasm: false } });
  const source = transformSync(readFileSync(resolve(root, path), 'utf8'), {
    loader: 'jsx', format: 'esm', jsx: 'transform', jsxFactory: 'React.createElement', target: 'es2022',
  }).code;
  const module = new SourceTextModule(source, {
    context,
    initializeImportMeta(meta) { Object.defineProperty(meta, 'env', { get: denied('env') }); },
    importModuleDynamically: denied('dynamic import'),
  });
  const synthetic = exports => new SyntheticModule(Object.keys(exports), function () {
    for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
  }, { context });
  const motionElement = tag => ({ initial, animate, whileInView, viewport, transition, children, ...props }) => {
    void initial; void whileInView; void viewport; void transition;
    if (animate) animations.push(animate);
    return React.createElement(tag, props, children);
  };
  await module.link(specifier => {
    if (specifier === 'react') return synthetic({ default: React });
    if (specifier === 'framer-motion') return synthetic({ motion: { div: motionElement('div'), circle: motionElement('circle') } });
    if (specifier === 'lucide-react') return synthetic(Object.fromEntries(['Hammer', 'Shield', 'Calculator', 'Palette', 'Infinity'].map(name => [name, props => React.createElement('span', { ...props, 'data-icon': name })])));
    if (specifier === '@/contexts/SubscriptionContext') return synthetic({ useSubscription: () => subscription });
    if (specifier === 'react-router-dom') return synthetic({ useNavigate: () => path => navigation.push(path) });
    if (specifier === '@/components/ui/card') return synthetic(Object.fromEntries(['Card', 'CardContent', 'CardHeader', 'CardTitle'].map(name => [name, props => React.createElement('div', props)])));
    if (specifier === '@/components/ui/button') return synthetic({ Button: ({ children, onClick, variant, ...props }) => {
      void variant;
      clicks.push(onClick);
      return React.createElement('button', props, children);
    } });
    throw new Error(`Unexpected fixture dependency: ${specifier}`);
  });
  await module.evaluate();
  const html = renderToStaticMarkup(React.createElement(module.namespace.default));
  assert.equal(runInContext('Infinity', context), Number.POSITIVE_INFINITY);
  assert.deepEqual(effects, []);
  assert.deepEqual(navigation, []);
  return { html, navigation, clicks, animations };
}

test('WhyInmejora original component keeps four visible cards and never renders the discarded comparison table', async () => {
  const view = await renderComponent('src/components/WhyInmejora.jsx');
  assert.deepEqual([...view.html.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)].map(match => match[1]), [
    'Hecha para construcción y diseño', 'Tu espacio, sin distorsiones', 'Presupuestos personalizados', 'Productos que podés comprar',
  ]);
  assert.match(view.html, /¿Por qué INMEJORA es diferente\?/);
  assert.match(view.html, /Cotizamos tu reforma según superficie, materiales, estado del inmueble y alcance del trabajo/);
  assert.doesNotMatch(view.html, /<table|Herramientas genéricas de IA|Margen de error|Textos e imágenes aleatorias/);
  assert.deepEqual([...view.html.matchAll(/data-icon="(.*?)"/g)].map(match => match[1]), ['Hammer', 'Shield', 'Calculator', 'Palette']);
});

test('CreditsWidget aliases the same Lucide Infinity export without shadowing the numeric global', async () => {
  const ast = parse(readFileSync(resolve(root, 'src/components/dashboard/CreditsWidget.jsx'), 'utf8'), { sourceType: 'module', plugins: ['jsx'] });
  const iconImport = ast.program.body.find(node => node.type === 'ImportDeclaration' && node.source.value === 'lucide-react');
  assert.equal(iconImport.specifiers[0].imported.name, 'Infinity');
  assert.equal(iconImport.specifiers[0].local.name, 'InfinityIcon');
  const view = await renderComponent('src/components/dashboard/CreditsWidget.jsx', { currentSubscription: { plan: 'mi_proyecto', status: 'active' } });
  assert.match(view.html, /data-icon="Infinity"/);
  assert.match(view.html, /Mi Proyecto/);
  assert.match(view.html, /Ilimitados/);
  assert.match(view.html, /Renders ilimitados activados/);
  assert.equal(view.animations.length, 0);
  view.clicks[0]();
  assert.deepEqual(view.navigation, ['/precios']);
});

test('CreditsWidget preserves finite credit values and percentage calculation with fixture-only subscription data', async () => {
  const view = await renderComponent('src/components/dashboard/CreditsWidget.jsx', {
    currentSubscription: { plan: 'pro_mensual', status: 'active' }, creditsRemaining: 75, creditsTotal: 100, creditsUsed: 25,
  });
  assert.match(view.html, /Pro Mensual/);
  assert.match(view.html, />75<\/span>/);
  assert.match(view.html, /25 renders usados \/ 100 renders totales/);
  assert.match(view.html, /25% usado/);
  assert.doesNotMatch(view.html, /data-icon="Infinity"/);
  assert.equal(view.animations.length, 1);
  assert.equal(view.animations[0].strokeDashoffset, 2 * Math.PI * 45 * 0.75);
  view.clicks[0]();
  assert.deepEqual(view.navigation, ['/precios']);
});

test('CreditsWidget preserves loading, free fallback and expired branches', async () => {
  const loading = await renderComponent('src/components/dashboard/CreditsWidget.jsx', { loading: true });
  assert.match(loading.html, /animate-spin/);
  assert.equal(loading.clicks.length, 0);
  const free = await renderComponent('src/components/dashboard/CreditsWidget.jsx');
  assert.match(free.html, /Explorar/);
  assert.match(free.html, /0 renders usados \/ 0 renders totales/);
  assert.match(free.html, /No se renueva \(Plan Gratis\)/);
  const expired = await renderComponent('src/components/dashboard/CreditsWidget.jsx', { currentSubscription: { plan: 'basico', status: 'expired' } });
  assert.match(expired.html, /Suscripción Expirada/);
  assert.doesNotMatch(expired.html, /data-icon="Infinity"|renders usados/);
  expired.clicks[0]();
  assert.deepEqual(expired.navigation, ['/precios']);
});

test('lead phone validation preserves optional, length and formatting behavior', () => {
  for (const value of [undefined, null, '', '   ', '123456', '1'.repeat(20), '+54 (11) 1234-5678', ' 123456 ', '12\t3456', '12\u00a03456']) {
    assert.deepEqual(lead.validatePhone(value), { isValid: true, error: null });
  }
  for (const value of ['12345', '1'.repeat(21), '123.456', 'abc123', '123/456', '１２３４５６', '123_456', '123@456']) {
    assert.deepEqual(lead.validatePhone(value), { isValid: false, error: 'Ingresá un teléfono válido.' });
  }
});

test('lead phone character class preserves ASCII and representative Unicode alphabet exactly', () => {
  const characters = [...Array.from({ length: 128 }, (_, code) => String.fromCharCode(code)), '\u00a0', '\u2003', '\u2028', '\u2029', 'á', '１'];
  for (const character of characters) {
    const expected = /^[0-9]$/.test(character) || /^\s$/.test(character) || ['-', '+', '(', ')'].includes(character);
    assert.equal(lead.validatePhone(`123${character}456`).isValid, expected, `code point ${character.codePointAt(0)}`);
  }
  assert.deepEqual(lead.validateName('Jo'), { isValid: true, error: null });
  assert.deepEqual(lead.validateName('J'), { isValid: false, error: 'El nombre debe tener al menos 2 caracteres.' });
  assert.equal(lead.validateEmail(' synthetic@example.invalid ').isValid, true);
  assert.equal(lead.validateEmail('invalid').isValid, false);
});

test('auth validateForm preserves ordinary own-field validation and messages', () => {
  const valid = { name: 'Synthetic User', email: 'synthetic@example.invalid', password: 'synthetic1', phone: '1123456789' };
  assert.deepEqual(auth.validateForm(valid), { isValid: true, errors: {} });
  const invalid = Object.freeze({ name: '', email: 'invalid', password: 'short', phone: 'invalid' });
  assert.deepEqual(auth.validateForm(invalid), { isValid: false, errors: {
    name: auth.validateName(invalid.name).error, email: auth.validateEmail(invalid.email).error,
    password: auth.validatePassword(invalid.password).error, phone: auth.validatePhone(invalid.phone).error,
  } });
  assert.deepEqual(auth.validateForm({}), { isValid: true, errors: {} });
  assert.deepEqual(auth.validateForm({ phone: '' }), { isValid: true, errors: {} });
});

test('auth validateForm validates null-prototype and shadowed-method objects without trusting their method', () => {
  const expected = { isValid: false, errors: { name: 'El nombre es requerido' } };
  assert.deepEqual(auth.validateForm(Object.assign(Object.create(null), { name: '' })), expected);
  for (const hasOwnProperty of [null, false, 'synthetic', () => false, () => { throw new Error('Untrusted method invoked'); }]) {
    assert.deepEqual(auth.validateForm({ name: '', hasOwnProperty }), expected);
  }
});

test('auth validateForm ignores inherited fields and still validates non-enumerable own fields', () => {
  const prototype = {};
  for (const name of ['name', 'email', 'password', 'phone']) {
    Object.defineProperty(prototype, name, { get() { throw new Error('Inherited field read'); } });
  }
  assert.deepEqual(auth.validateForm(Object.create(prototype)), { isValid: true, errors: {} });
  const form = Object.create(prototype);
  Object.defineProperty(form, 'email', { value: 'invalid' });
  assert.deepEqual(auth.validateForm(form), { isValid: false, errors: { email: 'Formato de email inválido' } });
  for (const value of [null, undefined]) assert.throws(() => auth.validateForm(value), TypeError);
});

test('auth field validators keep original name/password bounds, matching and optional phone policy', () => {
  assert.equal(auth.validateName('Jo').isValid, false);
  assert.equal(auth.validateName('Jon').isValid, true);
  assert.equal(auth.validateName('x'.repeat(101)).isValid, false);
  assert.equal(auth.validateEmail(' synthetic@example.invalid ').isValid, false);
  assert.equal(auth.validatePassword('short').isValid, false);
  assert.equal(auth.validatePassword('abcdef').strength, 'weak');
  assert.equal(auth.validatePassword('Abcdef').strength, 'medium');
  assert.equal(auth.validatePassword('Abcdef1!').strength, 'strong');
  assert.equal(auth.validatePassword('x'.repeat(129)).isValid, false);
  assert.equal(auth.validatePasswordMatch('abcdef', 'abcdef').isValid, true);
  assert.equal(auth.validatePasswordMatch('abcdef', 'abcdeg').isValid, false);
  assert.equal(auth.validatePhone('').isValid, true);
  assert.equal(auth.validatePhone('invalid').isValid, false);
});
