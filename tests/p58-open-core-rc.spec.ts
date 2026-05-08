/**
 * P58 — Sprint O: Open Core RC v1.0.0-RC1 (README + CLAUDE final accuracy +
 * demo video script + Agentics Foundation beta artifact + ADR-082).
 *
 * Pure-unit (FS-level reads). Mirrors P54/P55/P56/P57/P57' spec docstring
 * style. NO browser bootstrap. NO aisp barrel imports. Each assertion body
 * ≤6 lines.
 *
 * Some cases may fail until O1 (README rewrite), O2 (CLAUDE final pass),
 * and O3 (demo script + Agentics beta) all land — those are
 * expected-failures by design and GREEN-flip on Sprint O seal.
 *
 * ADR-082.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const README = join(ROOT, 'README.md')
const CLAUDE = join(ROOT, 'CLAUDE.md')
const DEMO_SCRIPT = join(ROOT, 'docs/launch/demo-video-script.md')
const AGENTICS_BETA = join(ROOT, 'docs/launch/agentics-foundation-beta.md')
const ADR = join(ROOT, 'docs/adr/ADR-082-open-core-rc.md')

test.describe('P58.1 README — exists + ≤300 LOC', () => {
  test('exists, ≤300 LOC', () => {
    expect(existsSync(README)).toBe(true)
    const src = readFileSync(README, 'utf8')
    expect(src.split('\n').length).toBeLessThanOrEqual(300)
  })
})

test.describe('P58.2 README — mentions all 4 moat priorities with ADR refs', () => {
  test('Speed/Spec/Templates/Share each cited with their ADR', () => {
    const src = readFileSync(README, 'utf8')
    expect(/Speed visible[\s\S]*ADR-077/i.test(src)).toBe(true)
    expect(/Spec unmissable[\s\S]*ADR-078/i.test(src)).toBe(true)
    expect(/Premium templates[\s\S]*ADR-079/i.test(src)).toBe(true)
    expect(/Shareable output[\s\S]*ADR-081/i.test(src)).toBe(true)
  })
})

test.describe('P58.3 README — cites all 5 Crystal Atoms', () => {
  test('PATCH + INTENT + SELECTION + CONTENT + ASSUMPTIONS named', () => {
    const src = readFileSync(README, 'utf8')
    expect(src.includes('PATCH') && src.includes('INTENT')).toBe(true)
    expect(src.includes('SELECTION') && src.includes('CONTENT')).toBe(true)
    expect(src.includes('ASSUMPTIONS')).toBe(true)
  })
})

test.describe('P58.4 README — mentions v1.0.0-RC1', () => {
  test('version stamp present', () => {
    const src = readFileSync(README, 'utf8')
    expect(src).toContain('v1.0.0-RC1')
  })
})

test.describe('P58.5 README — Quick Start section', () => {
  test('npm run dev + localhost:5173 referenced', () => {
    const src = readFileSync(README, 'utf8')
    expect(src.includes('npm run dev')).toBe(true)
    expect(src.includes('localhost:5173')).toBe(true)
  })
})

test.describe('P58.6 README — BYOK matrix lists all four providers', () => {
  test('Anthropic + Google + OpenAI + OpenRouter named', () => {
    const src = readFileSync(README, 'utf8')
    expect(src.includes('Anthropic') && src.includes('Google')).toBe(true)
    expect(src.includes('OpenAI') && src.includes('OpenRouter')).toBe(true)
  })
})

test.describe('P58.7 CLAUDE.md — ADR count refreshed', () => {
  test('mentions 81 (or 82) Accepted ADRs in the ADR ledger line', () => {
    const src = readFileSync(CLAUDE, 'utf8')
    expect(/\b8[12]\s+(ADRs?\s+)?Accepted/i.test(src)).toBe(true)
  })
})

test.describe('P58.8 CLAUDE.md — Sprint O / P58 / RC ledger', () => {
  test('Sprint O + P58 + RC keywords present', () => {
    const src = readFileSync(CLAUDE, 'utf8')
    expect(/Sprint O/.test(src)).toBe(true)
    expect(/P58/.test(src)).toBe(true)
    expect(/RC/.test(src)).toBe(true)
  })
})

test.describe('P58.9 demo video script — exists + timed shot list', () => {
  test('exists, contains 0:00 and 1:30 timecodes', () => {
    expect(existsSync(DEMO_SCRIPT)).toBe(true)
    const src = readFileSync(DEMO_SCRIPT, 'utf8')
    expect(src.includes('0:00')).toBe(true)
    expect(src.includes('1:30')).toBe(true)
  })
})

test.describe('P58.10 demo video script — Hey Bradley vs Lovable side-by-side', () => {
  test('script names both Lovable and Hey Bradley', () => {
    const src = readFileSync(DEMO_SCRIPT, 'utf8')
    expect(/Lovable/i.test(src)).toBe(true)
    expect(/Hey Bradley/.test(src)).toBe(true)
  })
})

test.describe('P58.11 Agentics Foundation beta artifact — exists + cites 4 moat priorities', () => {
  test('exists, names all four moat dimensions', () => {
    expect(existsSync(AGENTICS_BETA)).toBe(true)
    const src = readFileSync(AGENTICS_BETA, 'utf8')
    expect(/speed/i.test(src) && /spec/i.test(src)).toBe(true)
    expect(/template/i.test(src) && /shar/i.test(src)).toBe(true)
  })
})

test.describe('P58.12 ADR-082 — file shape + cross-refs', () => {
  test('exists, Status: Accepted, ≤120 LOC, refs ADR-077 + ADR-078 + ADR-079 + ADR-080 + ADR-081', () => {
    expect(existsSync(ADR)).toBe(true)
    const src = readFileSync(ADR, 'utf8')
    expect(src).toContain('Status:** Accepted')
    expect(src.split('\n').length).toBeLessThanOrEqual(120)
    expect(src.includes('ADR-077') && src.includes('ADR-078') && src.includes('ADR-079')).toBe(true)
    expect(src.includes('ADR-080') && src.includes('ADR-081')).toBe(true)
  })
})
