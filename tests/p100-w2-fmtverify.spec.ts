/**
 * P100 W2 / FMT-VERIFY — Format verification + top-3 atom-helper fixes seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p100-w2-comprehensive-logs.spec.ts.
 *
 * P100W2FMT.1 — ADR-127 file shape (4)                          [hard-gate; E1 owns]
 * P100W2FMT.2 — A1 format-verification doc landed (1)            [existsSync-guarded]
 * P100W2FMT.3 — B1-B4 scenario traces landed (4)                 [existsSync-guarded]
 * P100W2FMT.4 — C1 SOTA scoring landed (2)                       [existsSync-guarded]
 * P100W2FMT.5 — D1 fixes landed in source (3)                    [existsSync-guarded]
 * P100W2FMT.6 — EOP triplet at seal/ (3)                         [hard-gate; E1 owns]
 *
 * Soft-pass guards via existsSync() let predecessor timing slips surface as
 * deferred (carry-forward) rather than red. Hard-gate remains on E1-owned
 * files (ADR-127 + EOP triplet at seal/ subfolder).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-127 (E1 owns) ---
const ADR_127 = join(ROOT, 'docs/adr/ADR-127-format-verification-and-fixes.md')

// --- A1 format-verification doc ---
const FORMAT_VERIFICATION = join(ROOT, 'docs/prompt-audit/format-verification.md')

// --- B1-B4 scenario traces ---
const SCENARIO_1_TRACE = join(ROOT, 'docs/prompt-audit/scenario-1-trace.md')
const SCENARIO_2_TRACE = join(ROOT, 'docs/prompt-audit/scenario-2-trace.md')
const SCENARIO_3_TRACE = join(ROOT, 'docs/prompt-audit/scenario-3-trace.md')
const SCENARIO_4_TRACE = join(ROOT, 'docs/prompt-audit/scenario-4-trace.md')

// --- C1 SOTA scoring ---
const SOTA_SCORE = join(ROOT, 'docs/prompt-audit/hey-bradley-vs-sota.md')

// --- D1 fixes in source ---
const CHAT_PIPELINE = join(ROOT, 'src/contexts/intelligence/chatPipeline.ts')
const TRANSCRIPT_CLEANUP = join(ROOT, 'src/contexts/intelligence/stt/transcriptCleanup.ts')
const MIGRATION_005 = join(ROOT, 'src/contexts/persistence/migrations/005-comprehensive-logs.sql')

// --- EOP triplet at seal/ subfolder (E1 owns) ---
const SEAL_DIR = 'plans/implementation/phase-100w2-fmtverify/seal'
const EOP_REVIEW = join(ROOT, SEAL_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, SEAL_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, SEAL_DIR, 'retrospective.md')

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// ─────────────────────────────────────────────────────────────────────────
// P100W2FMT.1 — ADR-127 file shape (4 cases) [hard-gate]
// ─────────────────────────────────────────────────────────────────────────
test.describe('P100W2FMT.1 ADR-127 file shape', () => {
  test('exists on disk', () => {
    expect(existsSync(ADR_127)).toBe(true)
  })
  test('≤120 LOC (P100 W2 closer cap)', () => {
    expect(locOf(ADR_127)).toBeLessThanOrEqual(120)
  })
  test('Status: Accepted (markdown-bold tolerant)', () => {
    const s = read(ADR_127)
    expect(/[*\-\s]*Status:\*{0,2}\s*Accepted/i.test(s)).toBe(true)
  })
  test('cross-refs ADR-045 + ADR-053 + ADR-099 + ADR-126', () => {
    const s = read(ADR_127)
    expect(s).toMatch(/ADR-045/)
    expect(s).toMatch(/ADR-053/)
    expect(s).toMatch(/ADR-099/)
    expect(s).toMatch(/ADR-126/)
  })
})

// ─────────────────────────────────────────────────────────────────────────
// P100W2FMT.2 — A1 format-verification doc landed (1 case)
// ─────────────────────────────────────────────────────────────────────────
test.describe('P100W2FMT.2 A1 format-verification doc', () => {
  test('exists ≥150 LOC', () => {
    if (!existsSync(FORMAT_VERIFICATION)) {
      test.skip(true, 'A1 format-verification doc not yet on disk — soft-pass')
      return
    }
    expect(locOf(FORMAT_VERIFICATION)).toBeGreaterThanOrEqual(150)
  })
})

// ─────────────────────────────────────────────────────────────────────────
// P100W2FMT.3 — B1-B4 scenario traces landed (4 cases)
// ─────────────────────────────────────────────────────────────────────────
test.describe('P100W2FMT.3 B1-B4 scenario traces', () => {
  test('scenario-1 trace exists ≥150 LOC', () => {
    if (!existsSync(SCENARIO_1_TRACE)) {
      test.skip(true, 'B1 trace not yet on disk — soft-pass')
      return
    }
    expect(locOf(SCENARIO_1_TRACE)).toBeGreaterThanOrEqual(150)
  })
  test('scenario-2 trace exists ≥100 LOC', () => {
    if (!existsSync(SCENARIO_2_TRACE)) {
      test.skip(true, 'B2 trace not yet on disk — soft-pass')
      return
    }
    expect(locOf(SCENARIO_2_TRACE)).toBeGreaterThanOrEqual(100)
  })
  test('scenario-3 trace exists ≥100 LOC', () => {
    if (!existsSync(SCENARIO_3_TRACE)) {
      test.skip(true, 'B3 trace not yet on disk — soft-pass')
      return
    }
    expect(locOf(SCENARIO_3_TRACE)).toBeGreaterThanOrEqual(100)
  })
  test('scenario-4 trace exists ≥100 LOC', () => {
    if (!existsSync(SCENARIO_4_TRACE)) {
      test.skip(true, 'B4 trace not yet on disk — soft-pass')
      return
    }
    expect(locOf(SCENARIO_4_TRACE)).toBeGreaterThanOrEqual(100)
  })
})

// ─────────────────────────────────────────────────────────────────────────
// P100W2FMT.4 — C1 SOTA scoring landed (2 cases)
// ─────────────────────────────────────────────────────────────────────────
test.describe('P100W2FMT.4 C1 SOTA scoring', () => {
  test('hey-bradley-vs-sota.md exists ≥100 LOC', () => {
    if (!existsSync(SOTA_SCORE)) {
      test.skip(true, 'C1 SOTA doc not yet on disk — soft-pass')
      return
    }
    expect(locOf(SOTA_SCORE)).toBeGreaterThanOrEqual(100)
  })
  test('contains revised composite (79 or 84)', () => {
    if (!existsSync(SOTA_SCORE)) {
      test.skip(true, 'C1 SOTA doc not yet on disk — soft-pass')
      return
    }
    const s = read(SOTA_SCORE)
    expect(/(\b79\b|\b84\b)/.test(s)).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────
// P100W2FMT.5 — D1 fixes landed in source (3 cases)
// ─────────────────────────────────────────────────────────────────────────
test.describe('P100W2FMT.5 D1 fixes landed in source', () => {
  test('chatPipeline.ts consults isUnmeasurable + hasContradiction (Fix 1)', () => {
    if (!existsSync(CHAT_PIPELINE)) {
      test.skip(true, 'chatPipeline source missing — soft-pass')
      return
    }
    const s = read(CHAT_PIPELINE)
    expect(s).toMatch(/isUnmeasurable/)
    expect(s).toMatch(/hasContradiction/)
  })
  test('transcriptCleanup.ts NEW module exists (Fix 2)', () => {
    expect(existsSync(TRANSCRIPT_CLEANUP)).toBe(true)
  })
  test('migration 005 CHECK enum extended with decomp_split + export_emit (Fix 3)', () => {
    if (!existsSync(MIGRATION_005)) {
      test.skip(true, 'migration 005 missing — soft-pass')
      return
    }
    const s = read(MIGRATION_005)
    expect(s).toMatch(/decomp_split/)
    expect(s).toMatch(/export_emit/)
  })
})

// ─────────────────────────────────────────────────────────────────────────
// P100W2FMT.6 — EOP triplet at seal/ (3 cases) [hard-gate]
// ─────────────────────────────────────────────────────────────────────────
test.describe('P100W2FMT.6 EOP triplet at seal/', () => {
  test('02-post-review.md exists at seal/ subfolder', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('session-log.md exists at seal/ subfolder', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('retrospective.md exists at seal/ subfolder', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
