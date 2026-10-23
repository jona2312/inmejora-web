import '../../scripts/ci/offline-guard.mjs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Legacy anonymous credit tables and fabricated render job IDs must never
// reappear in runtime source. Future credit balance comes from Project Core.
const forbidden = ['client_credits', 'client_subscriptions', 'wallet_transactions', 'dummy-job'];
async function walk(root) {
  const result = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) result.push(...await walk(path));
    else if (entry.isFile() && /\.(?:js|jsx|ts|tsx)$/.test(entry.name)) result.push(path);
  }
  return result;
}
test('no anonymous financial tables or fake render jobs in runtime src', async () => {
  const affected = [];
  for (const path of await walk('src')) {
    const text = await readFile(path, 'utf8');
    for (const token of forbidden) if (text.includes(token)) affected.push(path + ':' + token);
  }
  assert.deepEqual(affected, []);
});
