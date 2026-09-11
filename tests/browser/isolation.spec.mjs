import { test, expect } from '@playwright/test';
import { isolate, origin } from './isolation.mjs';

test('harness blocks forbidden transports and classifies unknown requests', async ({ context, page }) => {
  const audit = await isolate(context);
  await page.goto(origin);
  await page.evaluate(async () => {
    for (const path of ['/api/auth/login', '/api/supplier/login', '/api/checkout', '/api/payments/create']) {
      await fetch(path, { method: 'POST', headers: { Authorization: 'Bearer local-forged-id' } }).catch(() => {});
    }
    await fetch('https://unknown.example.invalid/unclassified').catch(() => {});
  });
  expect(audit.forbidden).toHaveLength(4);
  expect(audit.unexpected).toHaveLength(1);
});
