import { test as base, expect } from '@playwright/test';
import { isolate } from './isolation.mjs';

// Runs only against the fail-closed variant (built with CI_COMMERCIAL_WHATSAPP='' and served from dist-failclosed).
// See docs/sales-launch/TEST-EVIDENCE.md. A normal run skips it.
const ENABLED = process.env.DIST_DIR === 'dist-failclosed';
const test = base.extend({
  audit: [async ({ context }, use) => {
    const evidence = await isolate(context);
    await context.addInitScript(() => {
      if (globalThis.location.origin !== 'http://127.0.0.1:4173') return;
      globalThis.localStorage.setItem('inmejora_cookie_consent', 'essential');
      globalThis.__opened = [];
      globalThis.open = url => { globalThis.__opened.push(String(url)); return {}; };
    });
    await use(evidence);
    expect(evidence.forbidden).toEqual([]);
  }, { auto: true }],
});
test.skip(!ENABLED, 'fail-closed variant only');

test('without a configured number the commercial channel is explicitly disabled everywhere', async ({ page }) => {
  await page.goto('/contacto');
  await expect(page.getByRole('alert')).toContainText('Por el momento no podemos recibir consultas por este medio.');
  await expect(page.locator('form')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Continuar por WhatsApp' })).toHaveCount(0);
  for (const route of ['/', '/servicios', '/contacto', '/zonas/hudson']) {
    await page.goto(route);
    await expect(page.locator('h1:visible').first()).toBeVisible();
    const hrefs = await page.locator('a[href]').evaluateAll(a => a.map(x => x.getAttribute('href')));
    expect(hrefs.filter(h => /wa\.me|^tel:/.test(h)), `${route}: no WhatsApp/phone links`).toEqual([]);
    await expect(page.getByRole('link', { name: 'Escribinos por WhatsApp' })).toHaveCount(0);
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/\+\d{2} 9 11|5491158300611|Todavía no fue enviado/);
  }
  await page.goto('/');
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent());
  expect(ld.telephone).toBeUndefined();
  expect(await page.evaluate(() => globalThis.__opened)).toEqual([]);
});
