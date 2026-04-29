/**
 * P57' Ruvector Helpers — pure-unit source-level guards.
 *
 * Pure-unit (FS-level reads). No DB connection, no Python execution.
 * Each assertion body ≤6 lines.
 *
 * Guards the 3 helper scripts + the operational-verify plan doc that ship
 * around the Sprint M ruvector flywheel work. Mirrors P55/P56/P57 spec
 * docstring style.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const READ = join(ROOT, 'scripts/ruvector-read.py')
const STATS = join(ROOT, 'scripts/ruvector-stats.py')
const WRITE = join(ROOT, 'scripts/ruvector-write-pattern.py')
const PLAN = join(ROOT, 'plans/strategic-reviews/ruvector-operational-verify-2026-04-29.md')

function loc(path: string): number {
  return readFileSync(path, 'utf8').split('\n').length
}

test.describe('P57R.1 Helper scripts exist', () => {
  test('read, stats, write helpers all present on disk', () => {
    expect(existsSync(READ)).toBe(true)
    expect(existsSync(STATS)).toBe(true)
    expect(existsSync(WRITE)).toBe(true)
  })
})

test.describe('P57R.2 LOC budgets honored', () => {
  test('read ≤120, stats ≤80, write ≤80', () => {
    expect(loc(READ)).toBeLessThanOrEqual(120)
    expect(loc(STATS)).toBeLessThanOrEqual(80)
    expect(loc(WRITE)).toBeLessThanOrEqual(80)
  })
})

test.describe('P57R.3 stdlib-only — no third-party imports', () => {
  test('all 3 scripts import only Python stdlib modules', () => {
    const stdlib = /^(import|from)\s+(argparse|json|secrets|sqlite3|sys|time|statistics|pathlib|__future__)\b/
    for (const p of [READ, STATS, WRITE]) {
      const lines = readFileSync(p, 'utf8').split('\n').filter(l => /^(import|from)\s/.test(l.trim()))
      for (const line of lines) expect(stdlib.test(line.trim())).toBe(true)
    }
  })
})

test.describe('P57R.4 Write helper is idempotent (ON CONFLICT clause)', () => {
  test('write script contains ON CONFLICT(namespace, key) DO UPDATE', () => {
    const src = readFileSync(WRITE, 'utf8')
    expect(src).toContain('ON CONFLICT(namespace, key)')
    expect(src).toContain('DO UPDATE')
  })
})

test.describe('P57R.5 Read helper exposes the 5 required filters', () => {
  test('read script supports --key, --namespace, --tag, --type, --text-search', () => {
    const src = readFileSync(READ, 'utf8')
    expect(src.includes('--key') && src.includes('--namespace')).toBe(true)
    expect(src.includes('--tag') && src.includes('--type')).toBe(true)
    expect(src.includes('--text-search')).toBe(true)
  })
})

test.describe('P57R.6 Operational-verify plan exists with verdict line', () => {
  test('plan doc exists and contains a §7 READY/BLOCKED/CAVEATS verdict', () => {
    expect(existsSync(PLAN)).toBe(true)
    const src = readFileSync(PLAN, 'utf8')
    expect(/§7\.?\s*Operational Readiness Verdict/i.test(src)).toBe(true)
    expect(/\b(READY|BLOCKED|CAVEATS)\b/.test(src)).toBe(true)
  })
})
