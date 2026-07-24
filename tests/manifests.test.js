'use strict';

// Drift guards for this repo. Every fact that lives in more than one place
// (plugin name, version, doc rows, hook script paths) is checked here against
// the plugin manifests, which are the authority. Failures name the fix.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const mk = require('../tools/marketplace');
const { ROOT, PLUGINS_DIR } = mk;

const DIRS = mk.pluginDirs();
const ROOT_DOCS = ['README.md', 'CLAUDE.md'];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

// Plugin names a markdown file links to: [label](plugins/<name>/...)
function linkedPlugins(markdown) {
  const names = new Set();
  for (const m of markdown.matchAll(/\]\(plugins\/([^/)]+)[/)]/g)) names.add(m[1]);
  return names;
}

// Every relative link target in a markdown file, http/anchor links excluded.
function relativeLinks(markdown) {
  return [...markdown.matchAll(/\]\(([^)]+)\)/g)]
    .map((m) => m[1])
    .filter((t) => !/^(https?:|#|mailto:)/.test(t))
    .map((t) => t.split('#')[0])
    .filter(Boolean);
}

function walkCommands(node, out = []) {
  if (Array.isArray(node)) for (const v of node) walkCommands(v, out);
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'command' && typeof v === 'string') out.push(v);
      else walkCommands(v, out);
    }
  }
  return out;
}

test('every plugin directory has a manifest', () => {
  for (const dir of DIRS) assert.doesNotThrow(() => mk.readManifest(dir));
});

test('manifest name matches its directory', () => {
  for (const dir of DIRS) {
    const { name } = mk.readManifest(dir);
    assert.strictEqual(
      name,
      dir,
      `plugins/${dir}/.claude-plugin/plugin.json declares name "${name}".\n` +
        `Fix: set "name" to "${dir}", or rename the directory to "${name}". ` +
        `Installs resolve by directory, so a mismatch ships the wrong plugin.`
    );
  }
});

test('every manifest carries a version', () => {
  for (const dir of DIRS) {
    const { version } = mk.readManifest(dir);
    assert.match(
      String(version),
      /^\d+\.\d+\.\d+$/,
      `plugins/${dir}/.claude-plugin/plugin.json has version "${version}".\n` +
        `Fix: use a semver string like "0.1.0". It is the only place the version lives; ` +
        `marketplace.json is generated from it.`
    );
  }
});

test('marketplace.json matches the plugin manifests', () => {
  assert.strictEqual(mk.current(), mk.render(), mk.STALE_FIX);
});

for (const doc of ROOT_DOCS) {
  test(`${doc} lists every plugin, and only real plugins`, () => {
    const linked = linkedPlugins(read(doc));
    const missing = DIRS.filter((d) => !linked.has(d));
    const extra = [...linked].filter((n) => !DIRS.includes(n));
    assert.deepStrictEqual(
      { missing, extra },
      { missing: [], extra: [] },
      `${doc} is out of sync with plugins/.\n` +
        (missing.length
          ? `Fix (missing): add a row linking to plugins/<name>/ for: ${missing.join(', ')}.\n`
          : '') +
        (extra.length
          ? `Fix (extra): ${extra.join(', ')} is documented but has no plugins/<name>/ directory. ` +
            `Remove the row, or restore the directory.\n`
          : '')
    );
  });
}

test('relative links in root docs resolve', () => {
  for (const doc of ROOT_DOCS) {
    for (const target of relativeLinks(read(doc))) {
      assert.ok(
        fs.existsSync(path.join(ROOT, target)),
        `${doc} links to ${target}, which does not exist.\n` +
          `Fix: correct the path, or create the file it promises.`
      );
    }
  }
});

test('hook commands reference files that exist', () => {
  for (const dir of DIRS) {
    const cfg = path.join(PLUGINS_DIR, dir, 'hooks', 'hooks.json');
    if (!fs.existsSync(cfg)) continue;
    for (const cmd of walkCommands(JSON.parse(fs.readFileSync(cfg, 'utf8')))) {
      for (const m of cmd.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([^"'\s]+)/g)) {
        const rel = path.join('plugins', dir, m[1]);
        assert.ok(
          fs.existsSync(path.join(ROOT, rel)),
          `plugins/${dir}/hooks/hooks.json runs ${m[1]}, which does not exist.\n` +
            `Fix: create ${rel}, or update the command. A hook pointing at a moved ` +
            `script fails silently in every session that loads the plugin.`
        );
      }
    }
  }
});
