const { test } = require('node:test');
const assert = require('node:assert');
const { countLines, isIgnored, evaluateFileSize, decide } = require('../hooks/lib/file-size');

test('countLines counts content lines, ignoring a single trailing newline', () => {
  assert.strictEqual(countLines(''), 0);
  assert.strictEqual(countLines('a'), 1);
  assert.strictEqual(countLines('a\nb'), 2);
  assert.strictEqual(countLines('a\nb\n'), 2);
  assert.strictEqual(countLines('a\r\nb\r\n'), 2);
});

test('isIgnored matches ** and * globs', () => {
  const globs = ['**/vendor/**', '**/*.gen.go'];
  assert.ok(isIgnored('internal/vendor/x.go', globs));
  assert.ok(isIgnored('api/types.gen.go', globs));
  assert.ok(!isIgnored('internal/billing/charge.go', globs));
});

test('evaluateFileSize flags files over budget', () => {
  const config = { lineBudget: 400, ignore: [] };
  const r = evaluateFileSize({ path: 'big.go', lineCount: 950, config });
  assert.strictEqual(r.over, true);
  assert.strictEqual(r.ignored, false);
  assert.strictEqual(r.budget, 400);
});

test('evaluateFileSize passes files within budget', () => {
  const config = { lineBudget: 400, ignore: [] };
  const r = evaluateFileSize({ path: 'small.go', lineCount: 120, config });
  assert.strictEqual(r.over, false);
});

test('evaluateFileSize marks ignored paths', () => {
  const config = { lineBudget: 400, ignore: ['**/*.gen.go'] };
  const r = evaluateFileSize({ path: 'api/types.gen.go', lineCount: 5000, config });
  assert.strictEqual(r.ignored, true);
});

test('decide returns ok for ignored or in-budget files', () => {
  assert.strictEqual(decide({ ignored: true, over: true }, 'warn').action, 'ok');
  assert.strictEqual(decide({ ignored: false, over: false }, 'block').action, 'ok');
});

test('decide warns by default when over budget', () => {
  const d = decide({ ignored: false, over: true, lineCount: 900, budget: 400, path: 'big.go' }, 'warn');
  assert.strictEqual(d.action, 'warn');
  assert.match(d.message, /big\.go/);
  assert.match(d.message, /900/);
});

test('decide denies when rule is block and file is over budget', () => {
  const d = decide({ ignored: false, over: true, lineCount: 900, budget: 400, path: 'big.go' }, 'block');
  assert.strictEqual(d.action, 'deny');
});

test('decide stays silent when rule is off', () => {
  assert.strictEqual(decide({ ignored: false, over: true, lineCount: 900, budget: 400, path: 'big.go' }, 'off').action, 'ok');
});
