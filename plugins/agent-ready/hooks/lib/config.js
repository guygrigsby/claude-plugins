'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULTS = {
  lineBudget: 400,
  fileSizeRule: 'warn', // 'warn' | 'block' | 'off'
  contextDriftCommits: 15,
  ignore: [
    '**/node_modules/**',
    '**/vendor/**',
    '**/dist/**',
    '**/build/**',
    '**/*.min.js',
    '**/*.gen.go',
    '**/*.pb.go',
  ],
};

// Minimal frontmatter reader for the small, known agent-ready schema.
// Supports `key: value` scalars and single-level `- item` lists. Not a full
// YAML parser, intentionally tiny so the hooks stay dependency-free.
function parseFrontmatter(text) {
  if (typeof text !== 'string') return {};
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const lines = match[1].split(/\r?\n/);
  const out = {};
  let listKey = null;
  for (const line of lines) {
    if (line.trim() === '') continue;
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) {
      out[listKey].push(coerce(item[1]));
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    const rawValue = kv[2].trim();
    if (rawValue === '') {
      out[key] = [];
      listKey = key;
    } else {
      out[key] = coerce(rawValue);
      listKey = null;
    }
  }
  return out;
}

function coerce(raw) {
  let v = raw.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?\d+$/.test(v)) return parseInt(v, 10);
  return v;
}

function resolveConfig(fm) {
  const f = fm || {};
  return {
    lineBudget: typeof f.line_budget === 'number' ? f.line_budget : DEFAULTS.lineBudget,
    fileSizeRule: f.file_size_rule || DEFAULTS.fileSizeRule,
    contextDriftCommits:
      typeof f.context_drift_commits === 'number' ? f.context_drift_commits : DEFAULTS.contextDriftCommits,
    ignore: Array.isArray(f.ignore) && f.ignore.length ? f.ignore : DEFAULTS.ignore,
  };
}

function loadConfig(projectDir) {
  try {
    const file = path.join(projectDir, '.claude', 'agent-ready.local.md');
    const text = fs.readFileSync(file, 'utf8');
    return resolveConfig(parseFrontmatter(text));
  } catch {
    return resolveConfig({});
  }
}

module.exports = { DEFAULTS, parseFrontmatter, resolveConfig, loadConfig };
