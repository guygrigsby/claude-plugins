'use strict';

// Pure drift evaluation. The hook gathers the inputs from git; this decides
// whether to surface a message at session start.
function evaluateDrift({ hasAgents, hasClaude, commitsSinceContextUpdate, threshold }) {
  if (!hasAgents && !hasClaude) {
    return {
      message:
        'agent-ready: No AGENTS.md or CLAUDE.md found. Run /agent-ready to bootstrap agent context files.',
    };
  }
  if (
    typeof commitsSinceContextUpdate === 'number' &&
    commitsSinceContextUpdate > threshold
  ) {
    return {
      message:
        `agent-ready: ${commitsSinceContextUpdate} commits since AGENTS.md/CLAUDE.md were last updated, ` +
        `context may be stale. Run /agent-ready to check.`,
    };
  }
  return { message: null };
}

module.exports = { evaluateDrift };
