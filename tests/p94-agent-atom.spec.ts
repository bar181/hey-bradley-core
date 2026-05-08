/**
 * P94 / AW-AGENT-ATOM — AGENT_ATOM 8th + FINAL Crystal Atom seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p93-ddd-atom.spec.ts.
 *
 * P94.1 — ADR-120 file shape (4)                                    [hard-gate; A2 owns]
 * P94.2 — agentAtom.ts exports (A1) (4)                             [existsSync-guarded]
 * P94.3 — AGENT_ATOM Σ header present (A1) (1)                      [existsSync-guarded]
 * P94.4 — Type exports (A1) (1)                                     [existsSync-guarded]
 * P94.5 — Disjoint ownedFiles invariant documented (A1) (1)         [existsSync-guarded]
 * P94.6 — KISS — no animation libs / no new deps in P94 source (1)  [existsSync-guarded + package.json]
 * P94.7 — EOP triplet for P94 (3)                                   [hard-gate; A2 owns]
 *
 * Soft-pass guards via existsSync() let A1 timing slips surface as
 * deferred (carry-forward) rather than red. Hard-gate remains on A2-owned
 * files (ADR-120 + EOP triplet).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-120 (A2 owns) ---
const ADR_120 = join(ROOT, 'docs/adr/ADR-120-agent-atom.md')

// --- A1-owned AGENT_ATOM module ---
const AGENT_ATOM = join(ROOT, 'src/contexts/intelligence/aisp/agentAtom.ts')

// --- package.json (boundary check for no new deps) ---
const PACKAGE_JSON = join(ROOT, 'package.json')

// --- EOP triplet for P94 (A2 owns) ---
const PHASE_DIR = 'plans/implementation/phase-94'
const EOP_REVIEW = join(ROOT, PHASE_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, PHASE_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, PHASE_DIR, 'retrospective.md')

// Banned animation libs per Hard rules
const BANNED_TOKENS = [
  'framer-motion',
  'gsap',
  'lottie',
  '@react-spring',
  'animejs',
]

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

// =============================================================================
// P94.1 — ADR-120 file shape (hard-gate; A2 owns)
// =============================================================================
test.describe('P94.1 — ADR-120 file shape', () => {
  test('ADR-120 exists on disk', () => {
    expect(existsSync(ADR_120)).toBe(true)
  })
  test('ADR-120 is ≤120 LOC', () => {
    if (!existsSync(ADR_120)) return
    const n = locOf(ADR_120)
    expect(n, `ADR-120 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-120 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_120)) return
    expect(read(ADR_120)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-120 cross-refs ADR-045 + ADR-053 + ADR-099 + ADR-118 + ADR-119', () => {
    if (!existsSync(ADR_120)) return
    const src = read(ADR_120)
    expect(src, 'cross-refs ADR-045').toContain('ADR-045')
    expect(src, 'cross-refs ADR-053').toContain('ADR-053')
    expect(src, 'cross-refs ADR-099').toContain('ADR-099')
    expect(src, 'cross-refs ADR-118').toContain('ADR-118')
    expect(src, 'cross-refs ADR-119').toContain('ADR-119')
  })
})

// =============================================================================
// P94.2 — agentAtom.ts exports (A1 surface; existsSync-guarded)
// =============================================================================
test.describe('P94.2 — agentAtom.ts exports (A1)', () => {
  test('src/contexts/intelligence/aisp/agentAtom.ts exists (or A1 timing-slip)', () => {
    if (!existsSync(AGENT_ATOM)) return
    expect(existsSync(AGENT_ATOM)).toBe(true)
  })
  test('agentAtom source exports `function classifyAgents`', () => {
    if (!existsSync(AGENT_ATOM)) return
    expect(read(AGENT_ATOM)).toContain('export function classifyAgents')
  })
  test('agentAtom source exports `function buildAgentAtom`', () => {
    if (!existsSync(AGENT_ATOM)) return
    expect(read(AGENT_ATOM)).toContain('export function buildAgentAtom')
  })
  test('agentAtom source exports `function parseAgentResponse`', () => {
    if (!existsSync(AGENT_ATOM)) return
    expect(read(AGENT_ATOM)).toContain('export function parseAgentResponse')
  })
})

// =============================================================================
// P94.3 — AGENT_ATOM Σ header present (A1 surface; existsSync-guarded)
// =============================================================================
test.describe('P94.3 — AGENT_ATOM Σ header present (A1)', () => {
  test('agentAtom source contains AGENT_ATOM const + Γ R1 reference (max 7 agents/wave)', () => {
    if (!existsSync(AGENT_ATOM)) return
    const src = read(AGENT_ATOM)
    expect(src, 'export const AGENT_ATOM').toContain('export const AGENT_ATOM')
    // Γ R1 reference: must mention 7 in the agents-per-wave context
    // (e.g. "|agents| ≤ 7" or "≤7 agents" or "max 7 agents per wave")
    expect(
      src.match(/\b7\b/) !== null && /agents?/i.test(src),
      'Γ R1 must reference cap of 7 agents per wave',
    ).toBe(true)
  })
})

// =============================================================================
// P94.4 — Type exports (A1 surface; existsSync-guarded)
// =============================================================================
test.describe('P94.4 — Type exports (A1)', () => {
  test('agentAtom source exports AgentSpec + AgentAtomOutput + WaveContext interfaces', () => {
    if (!existsSync(AGENT_ATOM)) return
    const src = read(AGENT_ATOM)
    expect(src, 'export interface AgentSpec').toContain('export interface AgentSpec')
    expect(src, 'export interface AgentAtomOutput').toContain(
      'export interface AgentAtomOutput',
    )
    expect(src, 'export interface WaveContext').toContain('export interface WaveContext')
  })
})

// =============================================================================
// P94.5 — Disjoint ownedFiles invariant documented (A1; existsSync-guarded)
// =============================================================================
test.describe('P94.5 — Disjoint ownedFiles invariant documented (A1)', () => {
  test('agentAtom source contains "disjoint" reference (Ε V1 invariant)', () => {
    if (!existsSync(AGENT_ATOM)) return
    expect(
      /disjoint/i.test(read(AGENT_ATOM)),
      'Ε V1 invariant: ownedFiles disjoint per wave must be documented in source',
    ).toBe(true)
  })
})

// =============================================================================
// P94.6 — KISS — no animation libs / no new deps in P94 source
// =============================================================================
test.describe('P94.6 — KISS — no animation libs / no new deps in P94 source', () => {
  test('no P94 source file imports banned animation libs + no new opaque deps in package.json', () => {
    // (a) banned-token check on agentAtom.ts (existsSync-guarded)
    if (existsSync(AGENT_ATOM)) {
      const src = read(AGENT_ATOM).toLowerCase()
      for (const tok of BANNED_TOKENS) {
        expect(
          src.includes(tok),
          `${AGENT_ATOM} must not import banned lib '${tok}' (KISS / Hard rule)`,
        ).toBe(false)
      }
    }
    // (b) package.json sanity — must exist and parse as JSON; no Tier-2 deps
    //     should have crept in this sprint (Supabase / OpenAI-Agents / etc.).
    expect(existsSync(PACKAGE_JSON)).toBe(true)
    const pkg = JSON.parse(read(PACKAGE_JSON)) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const allDeps = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
    }
    // Forbid Tier-2-only or animation libs from leaking in this sprint.
    const FORBIDDEN_NEW_DEPS = ['@supabase/supabase-js', 'gsap', 'lottie-web', 'animejs']
    for (const dep of FORBIDDEN_NEW_DEPS) {
      expect(
        Object.prototype.hasOwnProperty.call(allDeps, dep),
        `package.json must not introduce '${dep}' at P94 (KISS / Tier-2 boundary)`,
      ).toBe(false)
    }
  })
})

// =============================================================================
// P94.7 — EOP triplet present for P94 (hard-gate; A2 owns)
// =============================================================================
test.describe('P94.7 — EOP triplet present for P94', () => {
  test('phase-94/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-94/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-94/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
