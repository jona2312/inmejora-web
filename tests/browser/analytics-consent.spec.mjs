import { test as base, expect } from '@playwright/test';
import { isolate } from './isolation.mjs';

// No consent preset here: this spec starts as a first-time visitor.
const test = base.extend({
  audit: [async ({ context }, use) => {
    const evidence = await isolate(context);
    await use(evidence);
    expect(evidence.forbidden).toEqual([]);
    expect(evidence.unexpected).toEqual([]);
  }, { auto: true }],
});
const analytics = audit => audit.requests.filter(r => /googletagmanager\.com|clarity\.ms/.test(r.url));

test('first visit: no analytics before any choice; banner is shown', async ({ page, audit }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Solo esenciales' })).toBeVisible();
  await page.waitForTimeout(1500);
  expect(analytics(audit)).toEqual([]);
  expect(await page.evaluate(() => typeof globalThis.gtag)).toBe('undefined');
  expect(await page.evaluate(() => globalThis.localStorage.getItem('inmejora_cookie_consent'))).toBeNull();
});

test('"Solo esenciales": analytics never load, also after reload and navigation', async ({ page, audit }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Solo esenciales' }).click();
  await page.waitForTimeout(500);
  await page.reload();
  await page.goto('/servicios');
  await page.waitForTimeout(1200);
  expect(analytics(audit)).toEqual([]);
  expect(await page.evaluate(() => typeof globalThis.gtag)).toBe('undefined');
  expect(await page.evaluate(() => globalThis.localStorage.getItem('inmejora_cookie_consent'))).toBe('essential');
  await expect(page.getByRole('button', { name: 'Solo esenciales' })).toHaveCount(0);
});

test('"Aceptar todo": analytics load now and after reload, without asking again', async ({ page, audit }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Aceptar todo' }).click();
  await expect.poll(() => analytics(audit).map(r => new URL(r.url).hostname).sort()).toEqual(['www.clarity.ms', 'www.googletagmanager.com']);
  expect(await page.evaluate(() => typeof globalThis.gtag)).toBe('function');
  const before = analytics(audit).length;
  await page.reload();
  await expect.poll(() => analytics(audit).length).toBeGreaterThan(before);
  await expect(page.getByRole('button', { name: 'Aceptar todo' })).toHaveCount(0);
});

test('blocked storage is treated as no consent', async ({ page, context, audit }) => {
  await context.addInitScript(() => { Object.defineProperty(globalThis, 'localStorage', { get() { throw new Error('blocked'); } }); });
  await page.goto('/contacto');
  await page.waitForTimeout(1200);
  expect(analytics(audit)).toEqual([]);
});
