import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

// Real production builds (vite mode "production", same as the Dockerfile). Offline: no network is needed to build.
const vite = path.resolve('node_modules/vite/bin/vite.js');
function build(extraEnv) {
  const env = { ...process.env };
  for (const key of Object.keys(env)) if (key.startsWith('VITE_')) delete env[key];
  const out = mkdtempSync(path.join(tmpdir(), 'inmejora-wa-'));
  const result = spawnSync(process.execPath, [vite, 'build', '--mode', 'production', '--outDir', out, '--emptyOutDir'], { env: { ...env, ...extraEnv }, encoding: 'utf8', timeout: 180000 });
  return { ...result, out, text: `${result.stdout}\n${result.stderr}` };
}
const bundle = dir => readdirSync(path.join(dir, 'assets')).filter(f => f.endsWith('.js')).map(f => readFileSync(path.join(dir, 'assets', f), 'utf8')).join('\n');

test('production build FAILS without VITE_COMMERCIAL_WHATSAPP (no silent fallback)', () => {
  const r = build({});
  assert.notEqual(r.status, 0, 'build must fail');
  assert.match(r.text, /COMMERCIAL_WHATSAPP_REQUIRED/);
  assert.equal(existsSync(path.join(r.out, 'index.html')), false, 'no deployable artifact may be produced');
  rmSync(r.out, { recursive: true, force: true });
});

test('production build FAILS with an invalid or empty number', () => {
  for (const value of ['', '   ', '12345', 'no-es-un-numero', '1'.repeat(16)]) {
    const r = build({ VITE_COMMERCIAL_WHATSAPP: value });
    assert.notEqual(r.status, 0, `value ${JSON.stringify(value)} must fail`);
    assert.match(r.text, /COMMERCIAL_WHATSAPP_REQUIRED/);
    rmSync(r.out, { recursive: true, force: true });
  }
});

test('production build with a valid number succeeds and never contains the provisional number', () => {
  const r = build({ VITE_COMMERCIAL_WHATSAPP: '5491139066429' });
  assert.equal(r.status, 0, r.text.slice(-600));
  const code = bundle(r.out);
  assert.ok(code.includes('5491139066429'), 'configured number is in the bundle');
  assert.ok(!code.includes('5491158300611'), 'provisional number must not be in any bundle');
  rmSync(r.out, { recursive: true, force: true });
});
