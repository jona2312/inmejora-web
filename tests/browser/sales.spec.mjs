import { test as base, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { isolate, origin } from './isolation.mjs';

const SALES = process.env.VITE_SALES_LAUNCH_MODE !== 'false';
const NUMBER = (process.env.VITE_COMMERCIAL_WHATSAPP || '').replace(/\D/g, '') || '5491158300611';
const SHOTS = process.env.SHOTS === '1';
const shotDir = 'docs/sales-launch/screenshots';

const test = base.extend({
  audit: [async ({ context }, use) => {
    const evidence = await isolate(context);
    evidence.consoleErrors = [];
    evidence.crashes = [];
    // Capture window.open (WhatsApp) instead of leaving the isolated origin.
    await context.addInitScript(() => {
      if (globalThis.location.origin !== 'http://127.0.0.1:4173') return;
      globalThis.localStorage.setItem('inmejora_cookie_consent', 'essential');
      globalThis.__opened = [];
      globalThis.open = (url, target, features) => { globalThis.__opened.push({ url: String(url), target, features }); return {}; };
    });
    context.on('page', page => {
      page.on('pageerror', error => evidence.crashes.push(error.message));
      page.on('console', message => { if (message.type() === 'error') evidence.consoleErrors.push(message.text()); });
    });
    await use(evidence);
    expect(evidence.crashes, 'uncaught browser exceptions').toEqual([]);
    expect(evidence.forbidden, 'forbidden transports').toEqual([]);
    expect(evidence.unexpected, 'unclassified external attempts').toEqual([]);
    expect(evidence.requests.filter(r => r.method !== 'GET'), 'a commercial page must not write to any backend').toEqual([]);
    // The harness blocks service workers (playwright.config), which makes the app's own registration log an error.
    expect(evidence.consoleErrors.filter(m => !/Failed to load resource.*(503|net::)|Service Worker registration failed/.test(m)), 'console errors').toEqual([]);
  }, { auto: true }],
});

const commercialPages = [
  ['home', '/'], ['servicios', '/servicios'], ['contacto', '/contacto'],
  ['zona-berazategui', '/zonas/berazategui'], ['zona-hudson', '/zonas/hudson'], ['zona-quilmes', '/zonas/quilmes'],
  ['privacidad', '/politica-de-privacidad'], ['terminos', '/terminos-y-condiciones'],
];

async function settle(page) {
  await expect(page.locator('h1:visible').first()).toBeVisible();
  await page.waitForTimeout(300);
  expect(await page.locator('body').evaluate(el => el.scrollWidth <= el.ownerDocument.documentElement.clientWidth + 1), 'horizontal overflow').toBe(true);
}
async function shot(page, name, info) {
  const png = await page.screenshot({ fullPage: true });
  await info.attach(name, { body: png, contentType: 'image/png' });
  if (SHOTS) { mkdirSync(shotDir, { recursive: true }); writeFileSync(`${shotDir}/${name}-${info.project.use.viewport.width}.png`, png); }
}

for (const [name, route] of commercialPages) {
  test(`page ${route} renders without overflow, errors or backend writes`, async ({ page }, info) => {
    await page.goto(route);
    await settle(page);
    await expect(page.locator('footer')).toBeVisible();
    await shot(page, name, info);
  });
}

test.describe('sales launch mode', () => {
  test.skip(!SALES, 'sales-mode assertions');

  test('home sells the offer: services, 24-72h promise, single primary CTA', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Reformas y terminaciones');
    for (const service of ['Remodelaciones', 'Pintura y terminaciones', 'Impermeabilización', 'Pisos y revestimientos', 'Construcción y ampliaciones', 'Diseño y visualización', 'Presupuestos y relevamientos']) {
      await expect(page.getByRole('heading', { level: 3, name: service })).toBeVisible();
    }
    await expect(page.getByText('Tu presupuesto, en 24 a 72 horas.', { exact: true })).toBeVisible();
    await expect(page.getByText(/desde que tenemos la información necesaria/).first()).toBeVisible();
    await expect(page.getByText(/visita o un relevamiento/).first()).toBeVisible();
    const primary = page.locator('[data-cta="primary"]');
    expect(await primary.count()).toBeGreaterThan(0);
    for (const text of await primary.allInnerTexts()) expect(text.trim()).toBe('Contanos tu proyecto');
    // No fabricated social proof or prices anywhere on the page.
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\$\s?\d|gratis|gratuit|sin cargo|testimonio|clientes satisfechos|\d{2,}\+ ?(proyectos|clientes)|garant[ií]a/i);
    await expect(page.locator('#obras')).toHaveCount(0); // real works section stays hidden until real photos exist
  });

  test('primary CTA leads to the consultation form', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-cta="primary"]').first().click();
    await expect(page).toHaveURL(/\/contacto$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Contanos tu proyecto' })).toBeVisible();
  });

  test('service card preselects the service in the form', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Contanos tu proyecto: Impermeabilización/ }).click();
    await expect(page).toHaveURL(/\/contacto\?servicio=impermeabilizacion$/);
    await expect(page.getByLabel('¿Qué querés hacer? *')).toHaveValue('impermeabilizacion');
  });

  test('zone page prefills the locality', async ({ page }) => {
    await page.goto('/zonas/hudson');
    await page.locator('[data-cta="primary"]').first().click();
    await expect(page).toHaveURL(/\/contacto\?zona=hudson$/);
    await expect(page.getByLabel('Localidad *')).toHaveValue('Hudson');
  });

  test('form validates, and never claims delivery', async ({ page }, info) => {
    await page.goto('/contacto');
    await settle(page);
    await page.getByRole('button', { name: 'Continuar por WhatsApp' }).click();
    for (const message of ['Elegí qué querés hacer.', 'Indicá tu localidad.', 'Contanos brevemente qué necesitás (mínimo 10 letras).']) await expect(page.getByText(message)).toBeVisible();
    await expect(page.getByLabel('¿Qué querés hacer? *')).toBeFocused();
    expect(await page.evaluate(() => globalThis.__opened.length)).toBe(0);
    await expect(page.getByText(/Todavía no fue enviado/)).toHaveCount(0);

    await page.getByLabel('¿Qué querés hacer? *').selectOption('remodelaciones');
    await page.getByLabel('Localidad *').fill('Hudson');
    await page.getByLabel('Contanos qué necesitás *').fill('Renovar la cocina completa, con mesada nueva.');
    await page.getByLabel(/Medidas/).fill('3 x 4 m');
    await page.getByLabel(/¿Para cuándo\?/).selectOption('1-3-meses');
    await page.getByRole('button', { name: 'Continuar por WhatsApp' }).click();

    const opened = await page.evaluate(() => globalThis.__opened);
    expect(opened).toHaveLength(1);
    const url = new URL(opened[0].url);
    expect(url.origin + url.pathname).toBe(`https://wa.me/${NUMBER}`);
    const text = url.searchParams.get('text');
    for (const piece of ['Servicio: Remodelaciones', 'Localidad: Hudson', 'Medidas: 3 x 4 m', 'Para cuándo: En 1 a 3 meses', 'Renovar la cocina completa']) expect(text).toContain(piece);
    expect(opened[0].features).toContain('noopener');

    await expect(page.getByRole('status')).toContainText('Todavía no fue enviado');
    await expect(page.getByRole('link', { name: 'Abrir WhatsApp' })).toHaveAttribute('href', new RegExp(`^https://wa\\.me/${NUMBER}\\?text=`));
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/consulta enviada|mensaje enviado|recibimos tu|gracias por tu consulta|éxito/i);
    await shot(page, 'contacto-preparada', info);
  });

  test('floating WhatsApp: same channel, hidden on the form page', async ({ page }) => {
    await page.goto('/');
    const floating = page.getByRole('link', { name: 'Escribinos por WhatsApp' });
    await expect(floating).toHaveAttribute('href', new RegExp(`^https://wa\\.me/${NUMBER}\\?text=`));
    await page.goto('/contacto');
    await expect(page.getByRole('link', { name: 'Escribinos por WhatsApp' })).toHaveCount(0);
  });

  test('navigation: desktop links or mobile menu with focus management', async ({ page }, info) => {
    await page.goto('/');
    await settle(page);
    const mobile = info.project.use.viewport.width < 1024;
    if (mobile) {
      const menu = page.getByRole('button', { name: 'Menu', exact: true });
      await menu.click();
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByRole('navigation', { name: 'Principal móvil' }).getByRole('link', { name: 'Servicios' })).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Principal móvil' }).locator('[data-cta="header-mobile"]')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
      await expect(menu).toBeFocused();
      await menu.click();
      await page.getByRole('navigation', { name: 'Principal móvil' }).getByRole('link', { name: 'Servicios' }).click();
    } else {
      await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Servicios' }).click();
    }
    await expect(page).toHaveURL(/\/servicios$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
  });

  test('home anchors from another page scroll to their section', async ({ page }, info) => {
    await page.goto('/servicios');
    if (info.project.use.viewport.width < 1024) await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const nav = info.project.use.viewport.width < 1024 ? page.getByRole('navigation', { name: 'Principal móvil' }) : page.getByRole('navigation', { name: 'Principal' });
    await nav.getByRole('link', { name: 'Zonas' }).click();
    await expect(page).toHaveURL(/\/#zonas$/);
    await expect(page.locator('#zonas')).toBeInViewport();
  });

  for (const [from, to] of [['/precios', '/contacto'], ['/planes', '/contacto'], ['/cotizador', '/contacto'], ['/presupuesto', '/contacto'], ['/asistente-ia', '/contacto'], ['/registro', '/contacto'], ['/proyectos', '/servicios'], ['/nosotros', '/'], ['/catalogo', '/servicios'], ['/checkout/success?status=approved&payment_id=x', '/contacto']]) {
    test(`legacy ${from} redirects to ${to} without mounting the legacy page`, async ({ page, audit }) => {
      await page.goto(from);
      await expect(page).toHaveURL(new RegExp(`${to === '/' ? '/$' : to}$`));
      await settle(page);
      // Analytics and the global health ping are allowed; legacy feature backends (plans, quoter, catalog, payments) must not be called.
      expect(audit.requests.filter(r => { const u = new URL(r.url); return u.origin !== origin && /\/rest\/v1\/|catalogo|presupuesto|render|subscription|checkout|plans?/i.test(u.pathname); })).toEqual([]);
    });
  }

  test('unknown zone slug falls back to services', async ({ page }) => {
    await page.goto('/zonas/inventada');
    await expect(page).toHaveURL(/\/servicios$/);
  });

  test('link and phone inventory: no dead links, no stale numbers', async ({ page }, info) => {
    const inventory = {};
    const known = new Set(['/', '/servicios', '/contacto', '/politica-de-privacidad', '/terminos-y-condiciones', '/zonas/berazategui', '/zonas/hudson', '/zonas/quilmes']);
    for (const [, route] of commercialPages) {
      await page.goto(route);
      await settle(page);
      const links = await page.locator('a[href]').evaluateAll(anchors => anchors.map(a => ({ href: a.getAttribute('href'), text: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 60), target: a.getAttribute('target'), rel: a.getAttribute('rel') })));
      inventory[route] = links;
      for (const link of links) {
        expect(link.href, `${route}: empty/placeholder link`).not.toMatch(/^(#|javascript:|)$/);
        if (link.href === '#main-content') { await expect(page.locator('#main-content')).toHaveCount(1); continue; }
        if (link.href.startsWith('/')) expect(known.has(new URL(link.href, origin).pathname), `${route}: internal link to unknown page ${link.href}`).toBe(true);
        else if (link.href.startsWith('http')) {
          const host = new URL(link.href).host;
          expect(['wa.me', 'www.instagram.com'], `${route}: unexpected external host ${host}`).toContain(host);
          expect(link.rel, `${route}: external link needs rel`).toContain('noopener');
          if (host === 'wa.me') expect(link.href).toMatch(new RegExp(`^https://wa\\.me/${NUMBER}(\\?|$)`));
        } else expect(link.href, `${route}: unexpected scheme`).toMatch(/^(mailto:hola@inmejora\.com|tel:\+\d{10,15})$/);
        if (link.href.startsWith('tel:')) expect(link.href).toBe(`tel:+${NUMBER}`);
      }
      const text = await page.locator('body').innerText();
      const phones = text.match(/\+54 9 11 \d{4}-\d{4}/g) ?? [];
      for (const phone of phones) expect(phone.replace(/\D/g, '')).toBe(NUMBER);
    }
    await info.attach('link-inventory', { body: JSON.stringify(inventory, null, 2), contentType: 'application/json' });
    if (SHOTS && info.project.use.viewport.width === 1440) { mkdirSync('docs/sales-launch', { recursive: true }); writeFileSync('docs/sales-launch/link-inventory.json', JSON.stringify(inventory, null, 2) + '\n'); }
  });

  test('SEO basics per page: single h1, title, description, canonical, structured data on home', async ({ page }) => {
    const expectations = { '/': /Reformas y terminaciones en Hudson, Berazategui y Quilmes/, '/servicios': /Servicios/, '/contacto': /Contanos tu proyecto/, '/zonas/berazategui': /Berazategui/, '/zonas/hudson': /Hudson/, '/zonas/quilmes': /Quilmes/ };
    for (const [route, title] of Object.entries(expectations)) {
      await page.goto(route);
      await settle(page);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(title);
      await expect(page.locator('meta[name="description"]')).toHaveCount(1);
      expect((await page.locator('meta[name="description"]').getAttribute('content')).length).toBeGreaterThan(60);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://inmejora.com${route === '/' ? '' : route}`);
    }
    await page.goto('/');
    await settle(page);
    const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent());
    expect(ld['@type']).toBe('HomeAndConstructionBusiness');
    expect(ld.telephone).toBe(`+${NUMBER}`);
    expect(JSON.stringify(ld)).not.toMatch(/priceRange|\$/);
    expect(ld.areaServed.map(a => a.name)).toEqual(['Berazategui', 'Hudson', 'Quilmes']);
  });
});
