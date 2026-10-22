import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectCoreClient, invitationFromSearch, INVITATION_PATTERN } from '../../src/lib/projectCoreClient.js';

const TOKEN = 'a'.repeat(64);
function recorder() {
  const calls = [];
  const csrf = 'c'.repeat(64);
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, method: init.method, headers: init.headers });
    if (url === '/api/v1/intakes/current') return new Response('{}', { status: 401 });
    if (url === '/api/v1/intake-sessions') return new Response(JSON.stringify({ csrf_token: csrf }), { status: 201 });
    return new Response('{}', { status: 404 });
  };
  return { calls, fetchImpl };
}

test('invitation is sent only on POST /intake-sessions, as X-Intake-Invitation', async () => {
  const { calls, fetchImpl } = recorder();
  const client = createProjectCoreClient({ fetchImpl, enabled: () => true, invitation: TOKEN });
  await client.initialize();
  const session = calls.find(c => c.url === '/api/v1/intake-sessions');
  assert.equal(session.method, 'POST');
  assert.equal(session.headers['X-Intake-Invitation'], TOKEN);
  const others = calls.filter(c => c.url !== '/api/v1/intake-sessions');
  assert.ok(others.length > 0 && others.every(c => !('X-Intake-Invitation' in c.headers)));
});

test('without a valid invitation no header is sent and nothing is invented', async () => {
  for (const bad of [null, undefined, '', 'short', 'A'.repeat(64), 'g'.repeat(64), TOKEN + 'a']) {
    const { calls, fetchImpl } = recorder();
    await createProjectCoreClient({ fetchImpl, enabled: () => true, invitation: bad }).initialize();
    const session = calls.find(c => c.url === '/api/v1/intake-sessions');
    assert.ok(!('X-Intake-Invitation' in session.headers), String(bad));
  }
});

test('invitation is parsed strictly from ?inv= and nothing else', () => {
  assert.equal(invitationFromSearch('?inv=' + TOKEN), TOKEN);
  assert.equal(invitationFromSearch('?servicio=pintura&inv=' + TOKEN), TOKEN);
  assert.equal(invitationFromSearch('?inv=' + TOKEN.toUpperCase()), null);
  assert.equal(invitationFromSearch('?token=' + TOKEN), null);
  assert.equal(invitationFromSearch(''), null);
  assert.ok(INVITATION_PATTERN.test(TOKEN));
});

test('a failed POST never rotates or leaks the invitation to other requests', async () => {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, headers: init.headers });
    return new Response('{}', { status: url.endsWith('/intakes/current') ? 401 : 403 });
  };
  const client = createProjectCoreClient({ fetchImpl, enabled: () => true, invitation: TOKEN });
  await assert.rejects(client.initialize());
  assert.equal(calls.filter(c => c.headers['X-Intake-Invitation']).length, 1);
});
