const { test } = require('node:test');
const assert = require('node:assert');
const { evaluateDrift } = require('../hooks/lib/drift');

test('flags missing context files', () => {
  const r = evaluateDrift({ hasAgents: false, hasClaude: false, commitsSinceContextUpdate: null, threshold: 15 });
  assert.match(r.message, /No AGENTS\.md or CLAUDE\.md/);
});

test('no message when a context file exists and is fresh', () => {
  const r = evaluateDrift({ hasAgents: true, hasClaude: true, commitsSinceContextUpdate: 3, threshold: 15 });
  assert.strictEqual(r.message, null);
});

test('flags stale context files when commits since update exceed threshold', () => {
  const r = evaluateDrift({ hasAgents: true, hasClaude: false, commitsSinceContextUpdate: 40, threshold: 15 });
  assert.match(r.message, /stale/);
  assert.match(r.message, /40/);
});

test('one context file present counts as present (no bootstrap nag)', () => {
  const r = evaluateDrift({ hasAgents: true, hasClaude: false, commitsSinceContextUpdate: 2, threshold: 15 });
  assert.strictEqual(r.message, null);
});

test('null commitsSinceContextUpdate with files present is treated as fresh', () => {
  const r = evaluateDrift({ hasAgents: true, hasClaude: false, commitsSinceContextUpdate: null, threshold: 15 });
  assert.strictEqual(r.message, null);
});
