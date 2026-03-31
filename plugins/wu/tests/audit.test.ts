/**
 * Unit tests for AuditLog — append, read, filter, token totals.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { AuditLog } from '../lib/audit.js';
import type { AuditEntry } from '../lib/types.js';

let tmpDir: string;
let auditDir: string;
let log: AuditLog;

function makeEntry(overrides: Partial<AuditEntry> = {}): AuditEntry {
  return {
    timestamp: new Date().toISOString(),
    agent: 'gza',
    phase: 'learn',
    target: 'src/index.ts',
    duration_ms: 1500,
    status: 'completed',
    tokens_in: 10000,
    tokens_out: 3000,
    result_hash: 'a'.repeat(64),
    ...overrides,
  };
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wu-audit-test-'));
  auditDir = path.join(tmpDir, 'audit');
  log = new AuditLog(auditDir);
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('AuditLog.append', () => {
  it('creates audit directory and file on first append', async () => {
    await log.append(makeEntry());
    expect(fs.existsSync(path.join(auditDir, 'audit.jsonl'))).toBe(true);
  });

  it('writes valid JSONL (one JSON per line)', async () => {
    await log.append(makeEntry({ agent: 'gza' }));
    await log.append(makeEntry({ agent: 'rza' }));

    const raw = fs.readFileSync(path.join(auditDir, 'audit.jsonl'), 'utf-8');
    const lines = raw.trimEnd().split('\n');
    expect(lines.length).toBe(2);

    // Each line is valid JSON
    for (const line of lines) {
      expect(() => JSON.parse(line)).not.toThrow();
    }
  });
});

describe('AuditLog.readAll', () => {
  it('returns empty array when no file exists', async () => {
    const entries = await log.readAll();
    expect(entries).toEqual([]);
  });

  it('returns all appended entries', async () => {
    await log.append(makeEntry({ agent: 'gza' }));
    await log.append(makeEntry({ agent: 'rza' }));
    await log.append(makeEntry({ agent: 'odb' }));

    const entries = await log.readAll();
    expect(entries.length).toBe(3);
    expect(entries.map((e) => e.agent)).toEqual(['gza', 'rza', 'odb']);
  });
});

describe('AuditLog.readByPhase', () => {
  it('filters entries by phase', async () => {
    await log.append(makeEntry({ phase: 'learn' }));
    await log.append(makeEntry({ phase: 'build' }));
    await log.append(makeEntry({ phase: 'learn' }));

    const learnEntries = await log.readByPhase('learn');
    expect(learnEntries.length).toBe(2);
  });
});

describe('AuditLog.readByAgent', () => {
  it('filters entries by agent', async () => {
    await log.append(makeEntry({ agent: 'gza' }));
    await log.append(makeEntry({ agent: 'rza' }));
    await log.append(makeEntry({ agent: 'gza' }));

    const gzaEntries = await log.readByAgent('gza');
    expect(gzaEntries.length).toBe(2);
  });
});

describe('AuditLog.totalTokens', () => {
  it('sums tokens across all entries', async () => {
    await log.append(makeEntry({ tokens_in: 10000, tokens_out: 3000 }));
    await log.append(makeEntry({ tokens_in: 5000, tokens_out: 2000 }));

    const totals = await log.totalTokens();
    expect(totals.in).toBe(15000);
    expect(totals.out).toBe(5000);
  });

  it('returns zeros when no entries', async () => {
    const totals = await log.totalTokens();
    expect(totals.in).toBe(0);
    expect(totals.out).toBe(0);
  });
});
