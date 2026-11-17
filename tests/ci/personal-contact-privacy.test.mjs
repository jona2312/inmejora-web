import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Verify the rule, not a person's actual contact. Only deliberately synthetic
// numbers with zero-filled subscriber digits may exercise the forbidden suffix.
const synthetic = new Set(['5491100000611', '541100000611', '1100000611']);
const literals = /(?<![\w])\+?\d[\d ()-]{5,20}0611(?!\d)/g;
export function nonSyntheticContacts(text) {
  return [...text.matchAll(literals)].map(m => m[0].replace(/\D/g, ''))
    .filter(number => !synthetic.has(number));
}

test('privacy scanner rejects nonsynthetic suffix fixtures without exposing values', () => {
  assert.equal(nonSyntheticContacts('fixture ' + '54911' + '9876' + '0611').length, 1);
  assert.equal(nonSyntheticContacts('fixture ' + '+54 9 11 ' + '9876-' + '0611').length, 1);
  assert.equal(nonSyntheticContacts('fixture 5491100000611').length, 0);
  assert.equal(nonSyntheticContacts('fixture +54 (9) 11 0000-0611').length, 0);
});

test('tracked tests and documents use synthetic personal-channel fixtures only', () => {
  const files = execFileSync('git', ['ls-files', '-z', 'tests', 'docs'], { encoding: 'utf8' })
    .split('\0').filter(path => /\.(?:md|json|mjs|js|jsx|ts|txt)$/.test(path));
  for (const path of files) {
    assert.equal(nonSyntheticContacts(readFileSync(path, 'utf8')).length, 0, `Non-synthetic contact in ${path}`);
  }
});

test('reviewed parent reproduces the privacy violation; only the count leaves the process', () => {
  const base = '85b875ce95e300b5bb412d0f68f4938d297bb939';
  const source = execFileSync('git', ['show', base + ':tests/ci/final-commercial-boundaries.test.mjs'], { encoding: 'utf8' });
  assert(nonSyntheticContacts(source).length > 0, 'Parent must reproduce a non-synthetic fixture');
});

test('PR40 base has no automatic workflow execution; manual verification is separate', () => {
  const workflow = readFileSync('.github/workflows/p0-web-offline.yml', 'utf8');
  assert.match(workflow, /pull_request:\r?\n\s+branches-ignore:\r?\n\s+- codex\/qa119-controlled-web-20261106/);
  assert.match(workflow, /workflow_dispatch:/);
});
