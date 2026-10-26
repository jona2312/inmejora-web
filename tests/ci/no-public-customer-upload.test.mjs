import '../../scripts/ci/offline-guard.mjs';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { build } from 'esbuild';

// P0 Supabase hardening (Issue #74): customer photos must never be written from the browser with
// the anonymous key to a public bucket. The migration that closes those buckets is only safe to
// apply if nothing in this repository still depends on anonymous Storage access.
const root = fileURLToPath(new URL('../../', import.meta.url));
const CUSTOMER_BUCKETS = ['presupuestos-fotos', 'client-photos', 'space-photos'];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (/\.(js|jsx|ts|tsx|mjs)$/.test(name)) out.push(path);
  }
  return out;
}

test('no source file uses Supabase Storage or names a customer-photo bucket', () => {
  const offenders = [];
  for (const file of walk(join(root, 'src'))) {
    const text = readFileSync(file, 'utf8');
    if (/\.storage\b|storage\.from\(/.test(text)) offenders.push(file + ' (storage)');
    for (const bucket of CUSTOMER_BUCKETS) if (text.includes(bucket)) offenders.push(file + ' (' + bucket + ')');
  }
  assert.deepEqual(offenders.map(o => o.replace(root, '')), []);
});

async function loadPresupuestoApi(calls) {
  const out = await build({
    entryPoints: [join(root, 'src/utils/presupuestoApi.js')],
    bundle: true,
    write: false,
    tsconfigRaw: '{}',
    format: 'esm',
    platform: 'node',
    plugins: [{
      name: 'stubs',
      setup(b) {
        b.onResolve({ filter: /^@\/config\/commercial$/ }, () => ({ path: 'commercial', namespace: 'stub' }));
        b.onResolve({ filter: /^@\/lib\/customSupabaseClient$/ }, () => ({ path: 'supabase', namespace: 'stub' }));
        b.onLoad({ filter: /^commercial$/, namespace: 'stub' }, () => ({ contents: 'export const COMMERCIAL={whatsapp:"0"};', loader: 'js' }));
        b.onLoad({ filter: /^supabase$/, namespace: 'stub' }, () => ({
          contents: 'export const supabase={from:(...a)=>globalThis.__supabaseStub.from(...a),get storage(){return globalThis.__supabaseStub.storage;}};', loader: 'js',
        }));
      },
    }],
  });
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  globalThis.__supabaseStub = {
    from(table) {
      calls.push(['from', table]);
      const q = {
        select: () => q, eq: () => q, gte: () => q, limit: async () => ({ data: [], error: null }),
        insert: rows => { calls.push(['insert', table, rows]); return q; },
        single: async () => ({ data: { id: 'synthetic' }, error: null }),
      };
      return q;
    },
    get storage() { calls.push(['storage']); throw new Error('STORAGE_MUST_NOT_BE_USED'); },
  };
  const source = out.outputFiles[0].text;
  return import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
}

test('a quoter request with a photo is refused before any database or storage access', async () => {
  const calls = [];
  const api = await loadPresupuestoApi(calls);
  assert.equal(api.PRESUPUESTO_PHOTO_UPLOAD_ENABLED, false);
  await assert.rejects(api.submitPresupuesto({ nombre: 'A', telefono: '1', descripcion: 'd', website: '' }, { name: 'a.png' }), /fotos/);
  await assert.rejects(api.uploadPresupuestoPhoto({ name: 'a.png' }), /PHOTO_UPLOAD_DISABLED/);
  assert.deepEqual(calls, []);
});

test('a request without a photo still reaches the database table and never touches Storage', async () => {
  const calls = [];
  const api = await loadPresupuestoApi(calls);
  const result = await api.submitPresupuesto({ nombre: 'A', telefono: '1', tipo_proyecto: 't', metraje: 10, descripcion: 'd', website: '' }, null);
  assert.ok(result);
  assert.ok(calls.some(c => c[0] === 'insert' && c[1] === 'presupuestos_publicos' && c[2][0].foto_url === null));
  assert.ok(!calls.some(c => c[0] === 'storage'));
});
