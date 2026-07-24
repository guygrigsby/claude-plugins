'use strict';

// .claude-plugin/marketplace.json is GENERATED from the plugin manifests.
// Authority for a plugin's name, version, and description is
// plugins/<dir>/.claude-plugin/plugin.json. Edit that, then run `npm run gen`.

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const PLUGINS_DIR = path.join(ROOT, 'plugins');
const MARKETPLACE = path.join(ROOT, '.claude-plugin', 'marketplace.json');

// Hand-authored: describes the marketplace itself, derived from no plugin.
const HEADER = {
  name: 'guygrigsby-plugins',
  description: 'Claude Code plugins by Guy Grigsby',
  owner: { name: 'Guy Grigsby' },
};

function manifestPath(dir) {
  return path.join(PLUGINS_DIR, dir, '.claude-plugin', 'plugin.json');
}

// Every directory under plugins/, discovered. A new plugin joins the manifest,
// the docs guards, and CI without anyone editing a list.
function pluginDirs() {
  return fs
    .readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function readManifest(dir) {
  const file = manifestPath(dir);
  if (!fs.existsSync(file)) {
    throw new Error(
      `plugins/${dir}/ has no .claude-plugin/plugin.json.\n` +
        `Fix: add the manifest (name, version, description, author, license), ` +
        `or remove plugins/${dir}/ if it is not a plugin.`
    );
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function build() {
  const plugins = pluginDirs().map((dir) => {
    const m = readManifest(dir);
    return {
      name: m.name,
      description: m.description,
      version: m.version,
      source: `./plugins/${dir}`,
    };
  });
  return { ...HEADER, plugins };
}

function render() {
  return `${JSON.stringify(build(), null, 2)}\n`;
}

function current() {
  return fs.existsSync(MARKETPLACE) ? fs.readFileSync(MARKETPLACE, 'utf8') : '';
}

const STALE_FIX =
  '.claude-plugin/marketplace.json does not match the plugin manifests.\n' +
  'Fix: run `npm run gen` and commit the result.\n' +
  'It is generated from plugins/*/.claude-plugin/plugin.json — bump the version ' +
  'or edit the description there, never in marketplace.json.';

module.exports = {
  ROOT,
  PLUGINS_DIR,
  MARKETPLACE,
  STALE_FIX,
  manifestPath,
  pluginDirs,
  readManifest,
  build,
  render,
  current,
};

if (require.main === module) {
  const want = render();
  if (process.argv.includes('--check')) {
    if (want !== current()) {
      console.error(STALE_FIX);
      process.exit(1);
    }
    process.exit(0);
  }
  fs.writeFileSync(MARKETPLACE, want);
}
