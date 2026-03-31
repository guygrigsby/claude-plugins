/**
 * Unit tests for AgentDispatcher — cost gate, batching, progress, result hashing.
 * Note: These test the dispatcher logic, not the SDK integration (which requires live API).
 */

import { describe, it, expect } from 'vitest';
import { computeResultHash } from '../lib/dispatch.js';
import type { AgentDefinition, DispatchResult } from '../lib/types.js';

// We can't test dispatch() itself without mocking the SDK,
// but we CAN test the exported helpers and the constructor validation.

describe('computeResultHash', () => {
  it('returns a 64-character hex string', () => {
    const result: DispatchResult = {
      agent: 'gza',
      verdict: { verdict: 'pass', confidence: 0.9, findings: [] },
      status: 'completed',
      durationMs: 1500,
      tokensIn: 10000,
      tokensOut: 3000,
      fallbackUsed: false,
    };
    const hash = computeResultHash(result);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('produces different hashes for different results', () => {
    const result1: DispatchResult = {
      agent: 'gza',
      verdict: { verdict: 'pass', confidence: 0.9, findings: [] },
      status: 'completed',
      durationMs: 1500,
      tokensIn: 10000,
      tokensOut: 3000,
      fallbackUsed: false,
    };
    const result2: DispatchResult = {
      ...result1,
      agent: 'rza',
    };
    expect(computeResultHash(result1)).not.toBe(computeResultHash(result2));
  });

  it('produces same hash for same result', () => {
    const result: DispatchResult = {
      agent: 'gza',
      verdict: { verdict: 'pass', confidence: 0.9, findings: [] },
      status: 'completed',
      durationMs: 1500,
      tokensIn: 10000,
      tokensOut: 3000,
      fallbackUsed: false,
    };
    expect(computeResultHash(result)).toBe(computeResultHash(result));
  });

  it('handles null verdict', () => {
    const result: DispatchResult = {
      agent: 'gza',
      verdict: null,
      status: 'failed',
      durationMs: 0,
      tokensIn: 0,
      tokensOut: 0,
      error: 'timeout',
      fallbackUsed: false,
    };
    const hash = computeResultHash(result);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe('AgentDispatcher constructor', () => {
  it('throws when no API key is available', async () => {
    // Save and clear env
    const saved = process.env['ANTHROPIC_API_KEY'];
    delete process.env['ANTHROPIC_API_KEY'];

    try {
      const { AgentDispatcher } = await import('../lib/dispatch.js');
      expect(() => new AgentDispatcher()).toThrow('API key');
    } finally {
      if (saved) process.env['ANTHROPIC_API_KEY'] = saved;
    }
  });

  it('accepts explicit API key', async () => {
    const { AgentDispatcher } = await import('../lib/dispatch.js');
    expect(() => new AgentDispatcher('test-key-123')).not.toThrow();
  });
});

describe('AgentDefinition type', () => {
  it('accepts valid agent definition', () => {
    const def: AgentDefinition = {
      alias: 'gza',
      displayName: 'The GZA',
      role: 'Technical Architect',
      persona: 'The genius.',
      model: 'opus',
      tools: ['Read', 'Grep', 'Glob'],
    };
    expect(def.alias).toBe('gza');
    expect(def.model).toBe('opus');
  });
});
