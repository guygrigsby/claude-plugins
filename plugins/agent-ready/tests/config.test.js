const { test } = require('node:test');
const assert = require('node:assert');
const { parseFrontmatter, resolveConfig, DEFAULTS } = require('../hooks/lib/config');

test('parseFrontmatter returns empty object when no frontmatter', () => {
  assert.deepStrictEqual(parseFrontmatter('# just a heading\nno fm here'), {});
});

test('parseFrontmatter reads scalar keys', () => {
  const fm = parseFrontmatter('---\nline_budget: 250\nfile_size_rule: block\n---\nbody');
  assert.strictEqual(fm.line_budget, 250);
  assert.strictEqual(fm.file_size_rule, 'block');
});

test('parseFrontmatter reads a list', () => {
  const fm = parseFrontmatter('---\nignore:\n  - "**/vendor/**"\n  - "**/*.gen.go"\n---');
  assert.deepStrictEqual(fm.ignore, ['**/vendor/**', '**/*.gen.go']);
});

test('resolveConfig falls back to defaults when frontmatter empty', () => {
  const cfg = resolveConfig({});
  assert.strictEqual(cfg.lineBudget, DEFAULTS.lineBudget);
  assert.strictEqual(cfg.fileSizeRule, DEFAULTS.fileSizeRule);
  assert.deepStrictEqual(cfg.ignore, DEFAULTS.ignore);
});

test('resolveConfig maps snake_case frontmatter onto camelCase config', () => {
  const cfg = resolveConfig({ line_budget: 250, file_size_rule: 'block', context_drift_commits: 5 });
  assert.strictEqual(cfg.lineBudget, 250);
  assert.strictEqual(cfg.fileSizeRule, 'block');
  assert.strictEqual(cfg.contextDriftCommits, 5);
});

test('resolveConfig keeps default ignore list when not overridden', () => {
  const cfg = resolveConfig({ line_budget: 100 });
  assert.deepStrictEqual(cfg.ignore, DEFAULTS.ignore);
});
