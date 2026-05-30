'use strict';

function countLines(text) {
  if (!text) return 0;
  const parts = text.split('\n');
  // A single trailing newline shouldn't count as an extra line.
  if (parts[parts.length - 1] === '') parts.pop();
  return parts.length;
}

function globToRegExp(glob) {
  // Translate a minimal glob (** and *) into an anchored regexp.
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        re += '.*';
        i++;
        if (glob[i + 1] === '/') i++; // collapse `**/` so it can match zero dirs
      } else {
        re += '[^/]*';
      }
    } else if ('\\^$+?.()|{}[]'.includes(c)) {
      re += '\\' + c;
    } else {
      re += c;
    }
  }
  return new RegExp('^' + re + '$');
}

function isIgnored(filePath, globs) {
  const normalized = filePath.replace(/\\/g, '/');
  return (globs || []).some((g) => globToRegExp(g).test(normalized));
}

function evaluateFileSize({ path: filePath, lineCount, config }) {
  const ignored = isIgnored(filePath, config.ignore);
  return {
    path: filePath,
    lineCount,
    budget: config.lineBudget,
    ignored,
    over: !ignored && lineCount > config.lineBudget,
  };
}

function decide(result, mode) {
  if (result.ignored || !result.over || mode === 'off') return { action: 'ok' };
  const message =
    `agent-ready: ${result.path} is ${result.lineCount} lines (budget ${result.budget}). ` +
    `Large files cost agent context and usually signal a file doing too much. Consider splitting it.`;
  return { action: mode === 'block' ? 'deny' : 'warn', message };
}

module.exports = { countLines, globToRegExp, isIgnored, evaluateFileSize, decide };
