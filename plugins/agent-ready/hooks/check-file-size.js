#!/usr/bin/env node
'use strict';

// PreToolUse hook (Write|Edit|MultiEdit): warns (or blocks, per config) when a
// file exceeds the agent-ready line budget. Thin glue over hooks/lib/file-size.js.
const fs = require('fs');
const path = require('path');
const { loadConfig } = require('./lib/config');
const { countLines, evaluateFileSize, decide } = require('./lib/file-size');

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function main() {
  let input;
  try {
    input = JSON.parse(readStdin());
  } catch {
    process.exit(0);
  }

  const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const tool = input.tool_name;
  const ti = input.tool_input || {};
  const filePath = ti.file_path;
  if (!filePath) process.exit(0);

  let lineCount;
  if (tool === 'Write' && typeof ti.content === 'string') {
    lineCount = countLines(ti.content);
  } else {
    // Edit/MultiEdit: judge the file as it currently stands on disk.
    try {
      lineCount = countLines(fs.readFileSync(filePath, 'utf8'));
    } catch {
      process.exit(0);
    }
  }

  const config = loadConfig(projectDir);
  const relativePath = path.relative(projectDir, filePath) || filePath;
  const result = evaluateFileSize({ path: relativePath, lineCount, config });
  const d = decide(result, config.fileSizeRule);

  if (d.action === 'deny') {
    console.log(
      JSON.stringify({
        hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny' },
        systemMessage: d.message,
      })
    );
  } else if (d.action === 'warn') {
    console.log(JSON.stringify({ systemMessage: d.message }));
  }
  process.exit(0);
}

main();
