import assert from 'node:assert/strict';
import { test } from 'node:test';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import tls from 'node:tls';
import dns from 'node:dns';
import dnsPromises from 'node:dns/promises';
import dgram from 'node:dgram';
import { offlineBuildOptions } from '../../scripts/ci/build-options.mjs';

for (const [name, attempt] of Object.entries({
  fetch: () => fetch('https://example.invalid'),
  http: () => http.get('http://example.invalid'),
  https: () => https.request('https://example.invalid'),
  tcp: () => net.connect(443, 'example.invalid'),
  socket: () => new net.Socket().connect(443, 'example.invalid'),
  tls: () => tls.connect(443, 'example.invalid'),
  dns: () => dns.lookup('example.invalid', () => {}),
  dnsPromises: () => dnsPromises.resolve4('example.invalid'),
  udp: () => dgram.createSocket('udp4'),
})) {
  test(`offline guard blocks ${name} before connection`, () => {
    assert.throws(attempt, /CI_OFFLINE/);
  });
}

test('build refuses env loading and overrides API constants while preserving app compilation', () => {
  const base = {
    envFile: true,
    mode: 'production',
    configFile: '/example/config.js',
    plugins: ['synthetic-plugin'],
    resolve: { alias: { '@': '/example/src' } },
    define: { 'import.meta.env.VITE_API_URL': '"unsafe-synthetic-value"' },
  };
  const options = offlineBuildOptions(base);
  assert.equal(options.envFile, false);
  assert.equal(options.configFile, false);
  assert.equal(options.mode, 'ci');
  assert.equal(options.plugins, base.plugins);
  assert.equal(options.resolve, base.resolve);
  assert.equal(JSON.parse(options.define['import.meta.env.VITE_API_URL']), 'https://api.example.invalid');
  assert.equal(JSON.parse(options.define['import.meta.env.VITE_SUPABASE_URL']), 'https://supabase.example.invalid');
  assert.equal(JSON.parse(options.define['import.meta.env.VITE_SUPABASE_ANON_KEY']), 'synthetic-not-a-credential');
  assert.equal(base.envFile, true);
});
