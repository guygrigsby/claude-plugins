/**
 * Unit tests for StateManager — init, read/write, corruption recovery, phase management.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { StateManager } from '../lib/state.js';
import type { CycleConfig } from '../lib/state.js';

let tmpDir: string;
let wuDir: string;
let manager: StateManager;

const defaultConfig: CycleConfig = {
  skip_phases: [],
  model_overrides: {},
  budget: { warning_threshold_tokens: 500000, total_tokens_used: 0 },
  concurrency: { max_parallel_agents: 4 },
  slop_threshold: 0.3,
  cipher_rounds: { learn: 3, plan: 3, build: 2, check: 2, cipher: 1, ship: 1 },
};

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wu-test-'));
  wuDir = path.join(tmpDir, '.wu');
  manager = new StateManager(wuDir);
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('StateManager.init', () => {
  it('creates .wu/ directory structure', async () => {
    await manager.init('test-cycle', 'Test cycle', defaultConfig);

    expect(fs.existsSync(wuDir)).toBe(true);
    expect(fs.existsSync(path.join(wuDir, 'state.json'))).toBe(true);
    expect(fs.existsSync(path.join(wuDir, 'config.json'))).toBe(true);
    expect(fs.existsSync(path.join(wuDir, 'memory'))).toBe(true);
    expect(fs.existsSync(path.join(wuDir, 'audit'))).toBe(true);
    expect(fs.existsSync(path.join(wuDir, 'phases'))).toBe(true);
  });

  it('creates phase subdirectories for all 10 phases', async () => {
    await manager.init('test-cycle', 'Test cycle', defaultConfig);

    const phases = [
      'learn', 'plan', 'risk-analysis', 'license-check', 'copyright-check',
      'performance-tradeoff', 'build', 'check', 'cipher', 'ship',
    ];
    for (const phase of phases) {
      expect(fs.existsSync(path.join(wuDir, 'phases', phase))).toBe(true);
    }
  });

  it('writes initial state with learn phase and active status', async () => {
    await manager.init('test-cycle', 'Test cycle', defaultConfig);

    const state = await manager.readState();
    expect(state.cycle_slug).toBe('test-cycle');
    expect(state.description).toBe('Test cycle');
    expect(state.current_phase).toBe('learn');
    expect(state.status).toBe('active');
  });

  it('initializes phase records as pending', async () => {
    await manager.init('test-cycle', 'Test cycle', defaultConfig);

    const learnPhase = await manager.readPhase('learn');
    expect(learnPhase).not.toBeNull();
    expect(learnPhase!.status).toBe('pending');
    expect(learnPhase!.ordinal).toBe(0);
  });
});

describe('StateManager.readState / writeState', () => {
  it('round-trips state correctly', async () => {
    await manager.init('test-cycle', 'Test', defaultConfig);

    const state = await manager.readState();
    state.current_phase = 'plan';
    state.status = 'paused';
    await manager.writeState(state);

    const reread = await manager.readState();
    expect(reread.current_phase).toBe('plan');
    expect(reread.status).toBe('paused');
  });

  it('updates updated_at on write', async () => {
    await manager.init('test-cycle', 'Test', defaultConfig);

    const state1 = await manager.readState();
    const ts1 = state1.updated_at;

    // Small delay to ensure different timestamp
    await new Promise((r) => setTimeout(r, 10));

    await manager.writeState(state1);
    const state2 = await manager.readState();
    expect(state2.updated_at).not.toBe(ts1);
  });
});

describe('StateManager.readState corruption recovery', () => {
  it('recovers from trailing garbage after valid JSON', async () => {
    await manager.init('test-cycle', 'Test', defaultConfig);

    // Append garbage to state.json
    const statePath = path.join(wuDir, 'state.json');
    const content = fs.readFileSync(statePath, 'utf-8');
    fs.writeFileSync(statePath, content.trimEnd() + '\x00\x00garbage', 'utf-8');

    const state = await manager.readState();
    expect(state.cycle_slug).toBe('test-cycle');
  });

  it('throws descriptive error on completely corrupted file', async () => {
    await manager.init('test-cycle', 'Test', defaultConfig);

    const statePath = path.join(wuDir, 'state.json');
    fs.writeFileSync(statePath, 'not json at all {{{', 'utf-8');

    await expect(manager.readState()).rejects.toThrow('Corrupted state file');
  });
});

describe('StateManager.advancePhase', () => {
  it('updates current_phase in state', async () => {
    await manager.init('test-cycle', 'Test', defaultConfig);

    await manager.advancePhase('plan');
    const state = await manager.readState();
    expect(state.current_phase).toBe('plan');
  });
});

describe('StateManager.readPhase', () => {
  it('returns null for non-existent phase file', async () => {
    await manager.init('test-cycle', 'Test', defaultConfig);

    // Delete a phase file to simulate missing
    const phasePath = path.join(wuDir, 'phases', 'cipher', 'phase.json');
    fs.unlinkSync(phasePath);

    const phase = await manager.readPhase('cipher');
    expect(phase).toBeNull();
  });
});

describe('StateManager.isCorrupted', () => {
  it('returns false for valid state', async () => {
    await manager.init('test-cycle', 'Test', defaultConfig);
    expect(await manager.isCorrupted()).toBe(false);
  });

  it('returns true for corrupted state.json', async () => {
    await manager.init('test-cycle', 'Test', defaultConfig);
    fs.writeFileSync(path.join(wuDir, 'state.json'), '{broken', 'utf-8');
    expect(await manager.isCorrupted()).toBe(true);
  });

  it('returns true for corrupted config.json', async () => {
    await manager.init('test-cycle', 'Test', defaultConfig);
    fs.writeFileSync(path.join(wuDir, 'config.json'), 'nope', 'utf-8');
    expect(await manager.isCorrupted()).toBe(true);
  });
});

describe('StateManager.readConfig', () => {
  it('reads config with all fields', async () => {
    await manager.init('test-cycle', 'Test', defaultConfig);

    const config = await manager.readConfig();
    expect(config.slop_threshold).toBe(0.3);
    expect(config.concurrency?.max_parallel_agents).toBe(4);
  });
});
