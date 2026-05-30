#!/usr/bin/env node
'use strict';

// SessionStart hook: surfaces an advisory note when agent context files are
// missing or stale. Gathers git/fs inputs, then defers to hooks/lib/drift.js.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { loadConfig } = require('./lib/config');
const { evaluateDrift } = require('./lib/drift');

function git(args, cwd) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function commitsSinceContextUpdate(projectDir) {
  // Last commit that touched either context file.
  const lastHash = git(['log', '-1', '--format=%H', '--', 'AGENTS.md', 'CLAUDE.md'], projectDir);
  if (!lastHash) return null;
  const count = git(['rev-list', '--count', `${lastHash}..HEAD`], projectDir);
  if (count === null) return null;
  const n = parseInt(count, 10);
  return Number.isNaN(n) ? null : n;
}

function main() {
  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const config = loadConfig(projectDir);

  const hasAgents = fs.existsSync(path.join(projectDir, 'AGENTS.md'));
  const hasClaude = fs.existsSync(path.join(projectDir, 'CLAUDE.md'));

  // Only meaningful inside a git repo; null short-circuits the staleness check.
  const inGit = git(['rev-parse', '--is-inside-work-tree'], projectDir) === 'true';
  const since = inGit ? commitsSinceContextUpdate(projectDir) : null;

  const { message } = evaluateDrift({
    hasAgents,
    hasClaude,
    commitsSinceContextUpdate: since,
    threshold: config.contextDriftCommits,
  });

  if (message) {
    console.log(
      JSON.stringify({
        hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: message },
      })
    );
  }
  process.exit(0);
}

main();
