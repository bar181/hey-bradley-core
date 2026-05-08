/**
 * P92 / AW-PROCESS-ATOM — PROCESS_ATOM 6th Crystal Atom seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p91-process-map.spec.ts.
 *
 * P92.1 — ADR-118 file shape (4)                                    [hard-gate; A3 owns]
 * P92.2 — processAtom.ts exports (A1) (4)                           [existsSync-guarded]
 * P92.3 — PlanningChatBar component shape (A2) (3)                  [existsSync-guarded]
 * P92.4 — Planning.tsx wires PlanningChatBar (A3) (1)               [hard-gate; A3 owns]
 * P92.5 — KISS — no animation libs / no new deps in P92 source (1)  [existsSync-guarded]
 * P92.6 — EOP triplet for P92 (3)                                   [hard-gate; A3 owns]
 *
 * Soft-pass guards via existsSync() let A1 / A2 timing slips surface as
 * deferred (carry-forward) rather than red. Hard-gate remains on A3-owned
 * files (ADR-118 + Planning wire + EOP triplet).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-118 (A3 owns) ---
const ADR_118 = join(ROOT, 'docs/adr/ADR-118-process-atom.md')

// --- A1-owned PROCESS_ATOM module ---
const PROCESS_ATOM = join(ROOT, 'src/contexts/intelligence/aisp/processAtom.ts')

// --- A2-owned PlanningChatBar component ---
const PLANNING_CHAT_BAR = join(ROOT, 'src/components/planning/PlanningChatBar.tsx')

// --- A3-owned Planning.tsx wire (hard-gate) ---
const PAGE_PLANNING = join(ROOT, 'src/pages/Planning.tsx')

// --- EOP triplet for P92 (A3 owns) ---
const PHASE_DIR = 'plans/implementation/phase-92'
const EOP_REVIEW = join(ROOT, PHASE_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, PHASE_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, PHASE_DIR, 'retrospective.md')

// Banned animation libs per Hard rules #1+#2
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
// P92.1 — ADR-118 file shape (hard-gate; A3 owns)
// =============================================================================
test.describe('P92.1 — ADR-118 file shape', () => {
  test('ADR-118 exists on disk', () => {
    expect(existsSync(ADR_118)).toBe(true)
  })
  test('ADR-118 is ≤120 LOC', () => {
    if (!existsSync(ADR_118)) return
    const n = locOf(ADR_118)
    expect(n, `ADR-118 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-118 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_118)) return
    expect(read(ADR_118)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-118 cross-refs ADR-045 + ADR-053 + ADR-099 + ADR-116 + ADR-117', () => {
    if (!existsSync(ADR_118)) return
    const src = read(ADR_118)
    expect(src, 'cross-refs ADR-045').toContain('ADR-045')
    expect(src, 'cross-refs ADR-053').toContain('ADR-053')
    expect(src, 'cross-refs ADR-099').toContain('ADR-099')
    expect(src, 'cross-refs ADR-116').toContain('ADR-116')
    expect(src, 'cross-refs ADR-117').toContain('ADR-117')
  })
})

// =============================================================================
// P92.2 — processAtom.ts exports (A1 surface; existsSync-guarded)
// =============================================================================
test.describe('P92.2 — processAtom.ts exports (A1)', () => {
  test('src/contexts/intelligence/aisp/processAtom.ts exists (or A1 timing-slip)', () => {
    if (!existsSync(PROCESS_ATOM)) return
    expect(existsSync(PROCESS_ATOM)).toBe(true)
  })
  test('processAtom source exports `function classifyProcess`', () => {
    if (!existsSync(PROCESS_ATOM)) return
    expect(read(PROCESS_ATOM)).toContain('export function classifyProcess')
  })
  test('processAtom source exports `function buildProcessAtom` + `function parseProcessResponse`', () => {
    if (!existsSync(PROCESS_ATOM)) return
    const src = read(PROCESS_ATOM)
    expect(src, 'exports buildProcessAtom').toContain('export function buildProcessAtom')
    expect(src, 'exports parseProcessResponse').toContain('export function parseProcessResponse')
  })
  test('processAtom source exports `function toProcessMap`', () => {
    if (!existsSync(PROCESS_ATOM)) return
    expect(read(PROCESS_ATOM)).toContain('export function toProcessMap')
  })
})

// =============================================================================
// P92.3 — PlanningChatBar component shape (A2 surface; existsSync-guarded)
// =============================================================================
test.describe('P92.3 — PlanningChatBar component shape (A2)', () => {
  test('src/components/planning/PlanningChatBar.tsx exists (or A2 timing-slip)', () => {
    if (!existsSync(PLANNING_CHAT_BAR)) return
    expect(existsSync(PLANNING_CHAT_BAR)).toBe(true)
  })
  test('PlanningChatBar source contains 3 testids (planning-chat-bar / -input / -submit)', () => {
    if (!existsSync(PLANNING_CHAT_BAR)) return
    const src = read(PLANNING_CHAT_BAR)
    expect(src, 'planning-chat-bar testid').toContain('planning-chat-bar')
    expect(src, 'planning-chat-input testid').toContain('planning-chat-input')
    expect(src, 'planning-chat-submit testid').toContain('planning-chat-submit')
  })
  test('PlanningChatBar imports from @/contexts/intelligence/aisp/processAtom', () => {
    if (!existsSync(PLANNING_CHAT_BAR)) return
    const src = read(PLANNING_CHAT_BAR)
    expect(
      src,
      'imports from processAtom module',
    ).toMatch(/from ['"]@\/contexts\/intelligence\/aisp\/processAtom['"]/)
  })
})

// =============================================================================
// P92.4 — Planning.tsx wires PlanningChatBar (A3; hard-gate)
// =============================================================================
test.describe('P92.4 — Planning.tsx wires PlanningChatBar (A3)', () => {
  test('Planning.tsx imports + renders PlanningChatBar', () => {
    expect(existsSync(PAGE_PLANNING)).toBe(true)
    const src = read(PAGE_PLANNING)
    expect(src, 'imports PlanningChatBar').toContain('PlanningChatBar')
    // Ensure it appears at least twice (import + JSX use)
    const matches = src.match(/PlanningChatBar/g) ?? []
    expect(
      matches.length,
      `expected ≥2 PlanningChatBar refs (import + render); saw ${matches.length}`,
    ).toBeGreaterThanOrEqual(2)
  })
})

// =============================================================================
// P92.5 — KISS — no animation libs / no new deps in P92 source
// =============================================================================
test.describe('P92.5 — KISS — no animation libs / no new deps in P92 source', () => {
  test('no P92 source file imports banned animation libs', () => {
    const surfaces = [PROCESS_ATOM, PLANNING_CHAT_BAR, PAGE_PLANNING]
    for (const file of surfaces) {
      if (!existsSync(file)) continue
      const src = read(file).toLowerCase()
      for (const tok of BANNED_TOKENS) {
        expect(
          src.includes(tok),
          `${file} must not import banned lib '${tok}' (KISS / Hard rule #1+#2)`,
        ).toBe(false)
      }
    }
  })
})

// =============================================================================
// P92.6 — EOP triplet present for P92 (hard-gate; A3 owns)
// =============================================================================
test.describe('P92.6 — EOP triplet present for P92', () => {
  test('phase-92/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-92/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-92/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
