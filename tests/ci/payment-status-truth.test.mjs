import '../../scripts/ci/offline-guard.mjs';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transformSync } from 'esbuild';
import { parse } from '@babel/parser';

const root = fileURLToPath(new URL('../../', import.meta.url));
const noticePath = 'src/components/checkout/UnverifiedPaymentNotice.jsx';
const pages = [
  { name: 'CheckoutSuccessPage', route: '/checkout/success', destinations: ['/portal/dashboard', '/contacto', '/'] },
  { name: 'CheckoutErrorPage', route: '/checkout/error', destinations: ['/portal/dashboard', '/contacto', '/planes', '/'] },
  { name: 'CheckoutPendingPage', route: '/checkout/pending', destinations: ['/portal/dashboard', '/contacto', '/'] },
];
const queries = [
  '', '?status=approved', '?payment_id=synthetic-transaction',
  '?status=rejected&payment_id=synthetic-transaction',
  '?status=pending&preference_id=synthetic-preference',
  '?status=approved&status=rejected&payment_id=synthetic-duplicate',
  '?status=null', '?status=timeout',
  '?payment_id=%3Cscript%3Esynthetic%3C%2Fscript%3E&customer_email=synthetic%40example.invalid',
  '?status=%ZZ&payment_id=' + 'synthetic-'.repeat(500),
];
const compiled = new Map();
function compile(path) {
  if (!compiled.has(path)) {
    compiled.set(path, transformSync(readFileSync(resolve(root, path), 'utf8'), {
      loader: 'jsx', format: 'esm', jsx: 'transform', jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment', target: 'es2022', sourcefile: path,
    }).code);
  }
  return compiled.get(path);
}

// Real page + shared component source, syntax-only JSX compilation and real React
// SSR. Router, buttons and decorative icons are controlled dependencies, not a DOM.
async function renderPage(page, query = '') {
  const effects = [];
  const navigation = [];
  const clicks = [];
  const forbidden = name => () => {
    effects.push(name);
    throw new Error(`Forbidden return-page effect: ${name}`);
  };
  const sandbox = {};
  for (const name of ['fetch', 'setTimeout', 'setInterval', 'queueMicrotask']) sandbox[name] = forbidden(name);
  for (const name of ['window', 'document', 'localStorage', 'sessionStorage', 'navigator', 'XMLHttpRequest', 'WebSocket']) {
    Object.defineProperty(sandbox, name, { get: forbidden(name) });
  }
  Object.defineProperty(sandbox, 'location', { get() { effects.push('location'); return { pathname: page.route, search: query }; } });
  sandbox.console = Object.fromEntries(['log', 'warn', 'error', 'info'].map(name => [name, forbidden(`console.${name}`)]));
  const context = createContext(sandbox, { codeGeneration: { strings: false, wasm: false } });
  const synthetic = exports => new SyntheticModule(Object.keys(exports), function () {
    for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
  }, { context });
  const modules = new Map();
  function fileModule(path) {
    if (!modules.has(path)) modules.set(path, new SourceTextModule(compile(path), {
      context, identifier: path,
      initializeImportMeta(meta) { Object.defineProperty(meta, 'env', { get: forbidden('import.meta.env') }); },
      importModuleDynamically: forbidden('dynamic import'),
    }));
    return modules.get(path);
  }
  const pageModule = fileModule(`src/pages/${page.name}.jsx`);
  await pageModule.link(specifier => {
    if (specifier === '@/components/checkout/UnverifiedPaymentNotice') return fileModule(noticePath);
    if (specifier === 'react') return synthetic({ default: React });
    if (specifier === 'react-router-dom') return synthetic({
      useNavigate: () => path => navigation.push(path),
      useLocation: () => { effects.push('router location'); return { pathname: page.route, search: query }; },
      useSearchParams: () => { effects.push('search params'); return [new URLSearchParams(query)]; },
    });
    if (specifier === '@/components/ui/button') return synthetic({ Button: ({ children, onClick, variant, ...props }) => {
      void variant;
      clicks.push(onClick);
      return React.createElement('button', props, children);
    } });
    if (specifier === 'lucide-react') return synthetic(Object.fromEntries(['AlertCircle', 'ArrowRight', 'ExternalLink'].map(name => [name, props => React.createElement('span', props)])));
    throw new Error(`Unexpected return-page dependency: ${specifier}`);
  });
  await pageModule.evaluate();
  const html = renderToStaticMarkup(React.createElement(pageModule.namespace.default));
  return { html, effects, navigation, clicks };
}

for (const page of pages) {
  test(`${page.name}: real rendered content stays unverified for absent, forged, contradictory and malformed query fixtures`, async () => {
    let reference;
    for (const query of queries) {
      const view = await renderPage(page, query);
      reference ??= view.html;
      assert.equal(view.html, reference, 'URL parameters cannot change or be reflected in the notice');
      assert.match(view.html, /Estado del pago no verificado/);
      assert.match(view.html, /Esta página no verifica si hubo un cargo ni si un pago fue aprobado, rechazado o está pendiente\./);
      assert.match(view.html, /El enlace de retorno no confirma la activación de un plan, la acreditación de créditos ni el envío de un comprobante\./);
      assert.match(view.html, /No repitas el pago sólo por este mensaje\./);
      assert.doesNotMatch(view.html, /¡Pago Exitoso!|Pago Rechazado|Pago Pendiente|ha sido activado|ya están disponibles|Te enviamos|no se han realizado cargos|activará automáticamente|synthetic-|ID de Transacción|ID de Referencia|>Recibo</);
      assert.deepEqual(view.effects, []);
      assert.deepEqual(view.navigation, [], 'Rendering must not redirect');
    }
  });

  test(`${page.name}: explicit navigation remains local and never triggers checkout`, async () => {
    const view = await renderPage(page, '?status=approved');
    assert.equal(view.clicks.length, page.destinations.length);
    for (const click of view.clicks) click();
    assert.deepEqual(view.navigation, page.destinations);
    assert.deepEqual(view.effects, []);
    if (page.name === 'CheckoutPendingPage') {
      assert.match(view.html, /href="https:\/\/www\.mercadopago\.com\.ar\/ayuda" target="_blank" rel="noopener noreferrer"/);
    } else assert.doesNotMatch(view.html, /href="https:/);
  });
}

function walk(node, visitor) {
  if (!node || typeof node !== 'object') return;
  if (typeof node.type === 'string') visitor(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) for (const item of value) walk(item, visitor);
    else if (value && typeof value === 'object') walk(value, visitor);
  }
}

test('actual route AST retains all three return pages and navigation destinations', () => {
  const ast = parse(readFileSync(resolve(root, 'src/App.jsx'), 'utf8'), { sourceType: 'module', plugins: ['jsx'] });
  const routes = new Map();
  walk(ast, node => {
    if (node.type !== 'JSXElement' || node.openingElement.name.name !== 'Route') return;
    const path = node.openingElement.attributes.find(attribute => attribute.name?.name === 'path')?.value?.value;
    if (path) routes.set(path, node);
  });
  for (const page of pages) {
    const route = routes.get(page.route);
    assert.ok(route, page.route);
    const element = route.openingElement.attributes.find(attribute => attribute.name?.name === 'element');
    assert.equal(element.value.expression.openingElement.name.name, page.name);
    for (const destination of page.destinations) assert.ok(routes.has(destination), `Existing navigation destination ${destination}`);
  }
});

test('return modules use only reviewed dependencies with no query, identity, transport, timers or synthetic payment data', () => {
  const paths = [...pages.map(page => `src/pages/${page.name}.jsx`), noticePath];
  for (const path of paths) {
    const source = readFileSync(resolve(root, path), 'utf8');
    const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
    const imports = ast.program.body.filter(node => node.type === 'ImportDeclaration');
    const allowed = path === noticePath
      ? ['react', 'react-router-dom', 'lucide-react', '@/components/ui/button']
      : ['react', '@/components/checkout/UnverifiedPaymentNotice'];
    assert.deepEqual(imports.map(node => node.source.value), allowed);
    const router = imports.find(node => node.source.value === 'react-router-dom');
    if (router) assert.deepEqual(router.specifiers.map(node => node.imported.name), ['useNavigate']);
    assert.doesNotMatch(source, /\b(?:useEffect|useState|useLocation|useSearchParams|URLSearchParams|fetch|axios|apiCall|localStorage|sessionStorage|useAuth|setTimeout|setInterval|window|location|Date|payment_id|preference_id|dangerouslySetInnerHTML)\b|import\.meta/);
  }
});

test('legacy checkout modals still have no source consumers; this is a static inventory, not browser reachability', () => {
  function files(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory() ? files(path) : /\.[jt]sx?$/.test(path) ? [path] : [];
    });
  }
  const found = [];
  for (const path of files(resolve(root, 'src'))) {
    if (/['"][^'"]*\/checkout\/(?:Success|Pending|Error)Modal(?:\.jsx)?['"]/.test(readFileSync(path, 'utf8'))) found.push(relative(root, path).split(sep).join('/'));
  }
  assert.deepEqual(found, []);
});
