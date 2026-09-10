// Historical, read-only evidence for PRs #6/#7. Not a replacement for lint/tests.
import './offline-guard.mjs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { parse } from '@babel/parser';

const base = 'e6960fbc919cde1fdc1316f616cab9184cabdf08';
const importsAndCatch = '66821f560e42e0d92b4f0081066425be33a50479';
const localBindings = 'c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74';
const git = (args) => execFileSync('git', args, {
  encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
});
const astAt = (ref, file) => parse(git(['show', `${ref}:${file}`]), {
  sourceType: 'module', plugins: ['jsx'],
});
const filesBetween = (from, to) => git(['diff', '--name-only', from, to])
  .trim().split('\n').filter((file) => file.startsWith('src/'));

function normalize(node, ignoreBindings = false) {
  if (Array.isArray(node)) return node.map((item) => normalize(item, ignoreBindings));
  if (!node || typeof node !== 'object') return node;
  const result = {};
  for (const [key, value] of Object.entries(node)) {
    if (['start', 'end', 'loc', 'extra', 'comments', 'leadingComments', 'trailingComments', 'innerComments'].includes(key)) continue;
    if (ignoreBindings && node.type === 'ImportDeclaration' && key === 'specifiers') continue;
    if (ignoreBindings && node.type === 'CatchClause' && key === 'param') continue;
    result[key] = normalize(value, ignoreBindings);
  }
  return result;
}

const firstFiles = filesBetween(base, importsAndCatch);
for (const file of firstFiles) {
  assert.deepEqual(normalize(astAt(base, file), true), normalize(astAt(importsAndCatch, file), true), file);
}

function effects(ast) {
  const out = { hooks: [], listeners: [], requests: [] };
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'CallExpression') {
      const name = node.callee.name ?? node.callee.property?.name;
      if (/^use[A-Z]/.test(name ?? '')) {
        out.hooks.push({
          name,
          args: normalize(/^use(Effect|Callback|Memo|LayoutEffect)$/.test(name)
            ? node.arguments.slice(1) : node.arguments),
        });
      }
      if (['addEventListener', 'removeEventListener'].includes(name)) out.listeners.push(normalize(node));
      if (['fetch', 'from', 'select', 'insert', 'update', 'delete', 'eq', 'signInWithPassword'].includes(name)) out.requests.push(normalize(node));
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === 'loc') continue;
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') visit(value);
    }
  }
  visit(ast);
  return out;
}

const secondFiles = filesBetween(importsAndCatch, localBindings);
const totals = { files: secondFiles.length, hooks: 0, listeners: 0, requests: 0 };
for (const file of secondFiles) {
  const before = effects(astAt(importsAndCatch, file));
  const after = effects(astAt(localBindings, file));
  assert.deepEqual(after, before, file);
  for (const key of ['hooks', 'listeners', 'requests']) totals[key] += after[key].length;
}

console.log(JSON.stringify({
  base,
  importsAndCatch: { sha: importsAndCatch, files: firstFiles.length, astParity: true },
  localBindings: { sha: localBindings, preserved: totals },
  limitations: 'Historical static assertions only. The second comparison verifies selected calls and hook dependencies, not every possible runtime behavior. Browser/business regressions remain unverified.',
}, null, 2));
