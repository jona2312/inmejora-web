import { test as base, expect } from '@playwright/test';
import { isolate } from './isolation.mjs';
const test = base.extend({
  audit: [async ({ context }, use, info) => {
    const evidence = await isolate(context);
    const crashes = [];
    evidence.consoleErrors = [];
    context.on('page', page => {
      page.on('pageerror', error => crashes.push(error.message));
      page.on('console', message => { if (message.type() === 'error') evidence.consoleErrors.push(message.text()); });
    });
    await use(evidence);
    await info.attach('network-audit', { body: JSON.stringify(evidence, null, 2), contentType: 'application/json' });
    expect(crashes, 'uncaught browser exceptions').toEqual([]);
    expect(evidence.forbidden, 'forbidden transports').toEqual([]);
    expect(evidence.unexpected, 'unclassified external attempts').toEqual([]);
  }, { auto: true }],
});
async function ready(page) {
  await expect(page.locator('h1:visible,h2:visible').first()).toBeVisible();
  await page.waitForTimeout(500);
  expect(await page.locator('body').evaluate(el => el.scrollWidth <= el.ownerDocument.documentElement.clientWidth + 1), 'horizontal overflow').toBe(true);
}
const routes = ['/', '/precios', '/planes', '/servicios', '/proyectos', '/catalogo', '/catalogo/colores', '/catalogo/productos', '/cotizador', '/login', '/registro', '/forgot-password', '/reset-password', '/presupuesto', '/contacto', '/nosotros', '/asistente-ia', '/proveedores', '/proveedores/registro', '/proveedores/login', '/checkout/success?status=approved&payment_id=synthetic', '/checkout/error?status=approved', '/checkout/pending?status=approved', '/politica-de-privacidad', '/terminos-y-condiciones', '/does-not-exist'];
for (const route of routes) test(`route ${route}`, async ({ page }, info) => {
  await page.goto(route); await ready(page);
  await info.attach('route-viewport', { body: await page.screenshot(), contentType: 'image/png' });
});
test('cached identities cannot mount private routes', async ({ page, context }) => {
  await context.addInitScript(() => {
    if (globalThis.location.origin !== 'http://127.0.0.1:4173') return;
    for (const key of ['inmejora_token', 'supplier_token', 'proveedor_token', 'token']) globalThis.localStorage.setItem(key, 'local-forged-token');
    for (const key of ['inmejora_user', 'supplier_data', 'supplier_user', 'proveedor', 'user']) globalThis.localStorage.setItem(key, JSON.stringify({ id: 'local-forged-id', role: 'admin' }));
  });
  for (const route of ['/portal', '/portal/perfil', '/portal/pagos', '/portal/renders', '/portal/renders/synthetic/edit', '/portal/cotizaciones', '/portal/dashboard', '/portal/analizar', '/portal/budgets', '/portal/upload', '/portal/planes', '/proveedores/portal', '/admin/proveedores', '/admin-inmejora']) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/(login|proveedores\/login)$/);
    await ready(page);
  }
});
test('navigation, history and contact keyboard', async ({ page }, info) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Solo esenciales', exact: true }).click();
  const mobile = info.project.use.viewport.width < 1024;
  if (mobile) await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'Precios', exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/precios$/);
  await page.goBack(); await expect(page).toHaveURL(/\/$/);
  await page.goForward(); await expect(page).toHaveURL(/\/precios$/);
  if (mobile) await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'Contacto', exact: true }).filter({ visible: true }).click();
  await expect(page.getByRole('dialog', { name: 'Contacto' })).toBeVisible();
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    expect(await page.getByRole('dialog').evaluate(el => el.contains(el.ownerDocument.activeElement))).toBe(true);
  }
  await info.attach('contact-dialog', { body: await page.screenshot(), contentType: 'image/png' });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  if (mobile) await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeFocused();
});

test('contained forms and payment actions stay truthful', async ({ page, context }) => {
  await context.addInitScript(() => { if (globalThis.location.origin === 'http://127.0.0.1:4173') globalThis.localStorage.setItem('inmejora_cookie_consent', 'essential'); });
  for (const route of ['/login', '/registro', '/proveedores/login']) {
    await page.goto(route);
    await expect(page.getByRole('status').filter({ hasText: /no disponibles|no disponible/ }).first()).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  }
  for (const route of ['/forgot-password', '/reset-password?token=local-forged-token', '/proveedores/registro']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { name: 'Gestión de cuentas no disponible' })).toBeVisible();
    await expect(page.locator('form')).toHaveCount(0);
  }
  for (const route of ['/planes', '/precios']) {
    await page.goto(route);
    await expect(page.getByRole('button', { name: 'Consultar disponibilidad', exact: true }).first()).toBeVisible();
    const count = await page.getByRole('button', { name: 'Consultar disponibilidad', exact: true }).count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await page.getByRole('button', { name: 'Consultar disponibilidad', exact: true }).nth(i).click();
      await expect(page).toHaveURL(/\/contacto$/);
      await page.goBack();
    }
  }
  for (const state of ['success', 'error', 'pending']) {
    await page.goto(`/checkout/${state}?status=approved&collection_status=approved&payment_id=local-fake`);
    await expect(page.getByRole('heading', { name: 'Estado del pago no verificado' })).toBeVisible();
    await page.getByRole('button', { name: 'Ir al Dashboard' }).click();
    await expect(page).toHaveURL(/\/login$/);
  }
});

test('contact form never reports a simulated delivery', async ({ page, context }) => {
  await context.addInitScript(() => { if (globalThis.location.origin === 'http://127.0.0.1:4173') globalThis.localStorage.setItem('inmejora_cookie_consent', 'essential'); });
  await page.goto('/contacto');
  await page.getByLabel('Nombre completo').fill('Persona Sintética');
  await page.getByLabel('Email', { exact: true }).fill('fixture@example.invalid');
  await page.getByLabel('Mensaje', { exact: true }).fill('Consulta sintética sin envío real.');
  await page.locator('button[type="submit"]').click();
  await expect(page.getByText('Envío no disponible', { exact: true })).toBeVisible();
  await expect(page.getByText('Mensaje enviado', { exact: true })).toHaveCount(0);
  await expect(page.getByLabel('Mensaje', { exact: true })).toHaveValue('Consulta sintética sin envío real.');
});

test('public lead errors preserve form data', async ({ page, context, audit }) => {
  await context.addInitScript(() => { if (globalThis.location.origin === 'http://127.0.0.1:4173') globalThis.localStorage.setItem('inmejora_cookie_consent', 'essential'); });
  audit.responses['/api/webhook/guardar-mensaje'] = { status: 503, json: { success: false, message: 'Fixture: servicio no disponible' } };
  await page.goto('/');
  await page.getByPlaceholder('Nombre completo *', { exact: true }).fill('Persona Sintética');
  await page.getByPlaceholder('Tu Email *', { exact: true }).fill('fixture@example.invalid');
  await page.getByPlaceholder('WhatsApp *', { exact: true }).fill('1100000000');
  await page.getByPlaceholder('Ciudad *', { exact: true }).fill('Ciudad de prueba');
  await page.getByRole('button', { name: 'Registrarme gratis', exact: true }).click();
  await expect(page.getByText('Error al registrarse', { exact: true })).toBeVisible();
  await expect(page.getByPlaceholder('Tu Email *', { exact: true })).toHaveValue('fixture@example.invalid');
  expect(audit.requests.filter(r => r.method === 'POST' && r.url.includes('/api/webhook/guardar-mensaje'))).toHaveLength(1);
});

test('presupuesto validates, reports backend failure and allows retry', async ({ page, context, audit }) => {
  await context.addInitScript(() => { if (globalThis.location.origin === 'http://127.0.0.1:4173') globalThis.localStorage.setItem('inmejora_cookie_consent', 'essential'); });
  audit.responses['/rest/v1/presupuestos_publicos'] = { status: 503, json: { message: 'Fixture: solicitud no guardada' } };
  await page.goto('/presupuesto');
  await page.getByRole('button', { name: 'Solicitar Presupuesto', exact: true }).click();
  expect(audit.requests.filter(r => r.url.includes('presupuestos_publicos'))).toHaveLength(0);
  await page.getByLabel('Nombre completo *', { exact: true }).fill('Persona Sintética');
  await page.getByLabel('Teléfono (WhatsApp) *', { exact: true }).fill('1100000000');
  await page.getByRole('button', { name: 'Vivienda', exact: true }).click();
  await page.getByLabel('Metraje estimado (m²) *', { exact: true }).fill('30');
  await page.getByLabel('Detalles del proyecto *', { exact: true }).fill('Proyecto sintético para verificar errores visibles.');
  await page.getByRole('button', { name: 'Solicitar Presupuesto', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Hubo un problema' })).toBeVisible();
  await page.getByRole('button', { name: 'Entendido', exact: true }).click();
  await expect(page.getByLabel('Nombre completo *', { exact: true })).toHaveValue('Persona Sintética');
  await expect(page.getByRole('button', { name: 'Solicitar Presupuesto', exact: true })).toBeEnabled();
});

test('catalog rejects malformed payload without crashing', async ({ page, audit }) => {
  audit.responses['/api/horizon/catalogo/colores'] = { json: { unexpected: true } };
  await page.goto('/catalogo');
  await expect(page.getByText('No se pudo cargar el catálogo.', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Catálogo Virtual/ })).toBeVisible();
});

test('quoter empty data retry and populated manual path', async ({ page, context, audit }) => {
  await context.addInitScript(() => { if (globalThis.location.origin === 'http://127.0.0.1:4173') globalThis.localStorage.setItem('inmejora_cookie_consent', 'essential'); });
  await page.goto('/cotizador');
  await expect(page.getByRole('heading', { name: 'Error al cargar datos' })).toBeVisible();
  audit.responses['/rest/v1/servicios_precios'] = { json: [{ id: 'fixture-pintura', categoria: 'Pintura', servicio: 'Pintura sintética', unidad: 'm2', precio: 1, activo: true }] };
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await page.getByRole('button', { name: 'Cotizar manualmente', exact: true }).click();
  await expect(page.getByText('Pintura sintética', { exact: true }).first()).toBeVisible();
  await page.getByText('Pintura sintética', { exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Solicitar cotización personalizada' })).toBeVisible();
  await expect(page.getByText(/cotización personalizada/).first()).toBeVisible();
  await page.getByRole('button', { name: 'Asistente IA', exact: true }).click();
  await page.getByRole('button', { name: 'Cotizar manualmente', exact: true }).click();
  await expect(page.getByText('Seleccioná los trabajos que querés cotizar', { exact: true })).toBeVisible();
});

for (const admin of [false, true]) test(`admin UI metadata gate: app_metadata admin=${admin}`, async ({ page, context }) => {
  await context.addInitScript(({ admin }) => {
    if (globalThis.location.origin !== 'http://127.0.0.1:4173') return;
    globalThis.localStorage.setItem('inmejora_cookie_consent', 'essential');
    globalThis.localStorage.setItem('sb-supabase-auth-token', JSON.stringify({
      access_token: 'synthetic-browser-session', refresh_token: 'synthetic-refresh', token_type: 'bearer', expires_at: Math.floor(Date.now() / 1000) + 86400,
      user: { id: 'synthetic-native-user', email: 'fixture@example.invalid', app_metadata: { role: admin ? 'admin' : 'client' }, user_metadata: { role: 'admin', is_admin: true } },
    }));
  }, { admin });
  for (const route of ['/admin/proveedores', '/admin-inmejora']) {
    await page.goto(route);
    await expect(page).toHaveURL(admin ? new RegExp(route + '$') : /\/$/);
    await ready(page);
  }
});

test('mobile menu Escape restores focus and scrolling', async ({ page }, info) => {
  test.skip(info.project.use.viewport.width >= 1024, 'Desktop uses visible navigation');
  await page.goto('/');
  await page.getByRole('button', { name: 'Solo esenciales', exact: true }).click();
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  await menu.focus(); await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Servicios', exact: true }).filter({ visible: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});


test('main navigation resolves lazy home anchors', async ({ page, context }, info) => {
  await context.addInitScript(() => { if (globalThis.location.origin === 'http://127.0.0.1:4173') globalThis.localStorage.setItem('inmejora_cookie_consent', 'essential'); });
  await context.route('**/assets/LandingPage-*.js', async route => { await new Promise(resolve => setTimeout(resolve, 600)); await route.fallback(); });
  await page.goto('/precios');
  for (const [name, selector] of [['Servicios', '#soluciones'], ['Proyectos', '#proyectos'], ['Atención personalizada', '#asistente-ia']]) {
    if (info.project.use.viewport.width < 1024) await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('button', { name, exact: true }).filter({ visible: true }).click();
    await expect(page.locator(selector).first()).toBeVisible();
    await expect.poll(async () => Math.abs((await page.locator(selector).first().boundingBox()).y - 80)).toBeLessThan(10);
    await page.goto('/precios');
  }
});
