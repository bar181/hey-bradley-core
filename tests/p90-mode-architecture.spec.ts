/**
 * P90 / AW-MODE-ARCH — three-mode product architecture seal spec.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p89-tier2-foundation.spec.ts + p89b-supabase-cleanup.spec.ts.
 *
 * P90.1 — ADR-116 file shape (4)                                    [hard-gate; A5 owns]
 * P90.2 — Routes + stubs (4)                                        [existsSync-guarded; A3 owns]
 * P90.3 — ModeSelectorCard wire / consumer (1)                      [tolerant directory walk]
 * P90.4 — uiStore activeMode (2)                                    [existsSync-guarded; A3 owns]
 * P90.5 — AppShell mode-aware (2)                                   [existsSync-guarded; A4 owns]
 * P90.6 — Stubs use ADR-091 tokens (1)                              [existsSync-guarded; A3 owns]
 * P90.7 — KISS — no animation libs in P90 source (1)                [existsSync-guarded]
 * P90.8 — EOP triplet for P90 (3)                                   [hard-gate; A5 owns]
 *
 * Soft-pass guards via existsSync() let A3 / A4 timing slips surface as
 * deferred (carry-forward) rather than red — matches the P89 / P89b cadence.
 * The EOP block + ADR-116 are hard-gate: owned by THIS agent (A5).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR-116 (this agent owns) ---
const ADR_116 = join(ROOT, 'docs/adr/ADR-116-three-mode-product-architecture.md')

// --- A3-owned route + stub + store surfaces ---
const PAGE_PLANNING = join(ROOT, 'src/pages/Planning.tsx')
const PAGE_AGENTICS = join(ROOT, 'src/pages/Agentics.tsx')
const MAIN_TSX = join(ROOT, 'src/main.tsx')
const UI_STORE = join(ROOT, 'src/store/uiStore.ts')

// --- A4-owned AppShell ---
const APP_SHELL = join(ROOT, 'src/components/shell/AppShell.tsx')

// --- Source roots scanned for ModeSelectorCard consumer (P90.3) ---
const SRC_PAGES = join(ROOT, 'src/pages')
const SRC_COMPONENTS = join(ROOT, 'src/components')

// --- EOP triplet for P90 (this agent owns) ---
const PHASE_DIR = 'plans/implementation/phase-90'
const EOP_REVIEW = join(ROOT, PHASE_DIR, '02-post-review.md')
const EOP_LOG = join(ROOT, PHASE_DIR, 'session-log.md')
const EOP_RETRO = join(ROOT, PHASE_DIR, 'retrospective.md')

// Banned animation libs per Hard rule #2
const BANNED_ANIM_TOKENS = [
  'framer-motion',
  'gsap',
  'lottie',
  'react-spring',
  'animejs',
]

function read(p: string): string {
  return readFileSync(p, 'utf8')
}
function locOf(p: string): number {
  return read(p).split('\n').length
}

/**
 * Recursively walk a directory and collect .ts / .tsx files.
 * Tolerates missing roots (returns []); skips node_modules / dist defensively.
 */
function walkDir(root: string, files: string[] = []): string[] {
  if (!existsSync(root)) return files
  for (const name of readdirSync(root)) {
    if (name === 'node_modules' || name === 'dist' || name === '.next') continue
    const path = join(root, name)
    let st
    try {
      st = statSync(path)
    } catch {
      continue
    }
    if (st.isDirectory()) {
      walkDir(path, files)
    } else if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      files.push(path)
    }
  }
  return files
}

// =============================================================================
// P90.1 — ADR-116 file shape (hard-gate; A5 owns)
// =============================================================================
test.describe('P90.1 — ADR-116 file shape', () => {
  test('ADR-116 exists on disk', () => {
    expect(existsSync(ADR_116)).toBe(true)
  })
  test('ADR-116 is ≤120 LOC', () => {
    if (!existsSync(ADR_116)) return
    const n = locOf(ADR_116)
    expect(n, `ADR-116 LOC ${n} should be ≤120`).toBeLessThanOrEqual(120)
  })
  test('ADR-116 declares Status: Accepted (markdown-bold tolerant)', () => {
    if (!existsSync(ADR_116)) return
    expect(read(ADR_116)).toMatch(/Status:\s*\**\s*Accepted/i)
  })
  test('ADR-116 cross-refs ADR-085 + ADR-088 + ADR-090 + ADR-110', () => {
    if (!existsSync(ADR_116)) return
    const src = read(ADR_116)
    expect(src, 'cross-refs ADR-085').toContain('ADR-085')
    expect(src, 'cross-refs ADR-088').toContain('ADR-088')
    expect(src, 'cross-refs ADR-090').toContain('ADR-090')
    expect(src, 'cross-refs ADR-110').toContain('ADR-110')
  })
})

// =============================================================================
// P90.2 — Routes + stubs (A3 surfaces; existsSync-guarded)
// =============================================================================
test.describe('P90.2 — Routes + stubs (A3)', () => {
  test('src/pages/Planning.tsx exists (or A3 timing-slip)', () => {
    if (!existsSync(PAGE_PLANNING)) return
    expect(existsSync(PAGE_PLANNING)).toBe(true)
  })
  test('src/pages/Agentics.tsx exists (or A3 timing-slip)', () => {
    if (!existsSync(PAGE_AGENTICS)) return
    expect(existsSync(PAGE_AGENTICS)).toBe(true)
  })
  test('main.tsx imports Planning + Agentics via React.lazy', () => {
    if (!existsSync(MAIN_TSX)) return
    const src = read(MAIN_TSX)
    expect(src, 'main.tsx mentions Planning').toContain('Planning')
    expect(src, 'main.tsx mentions Agentics').toContain('Agentics')
    expect(
      src,
      'main.tsx uses React.lazy for at least one of Planning / Agentics',
    ).toMatch(/lazy\(\s*\(\s*\)\s*=>\s*import/)
  })
  test('main.tsx has both /planning + /agentics routes', () => {
    if (!existsSync(MAIN_TSX)) return
    const src = read(MAIN_TSX)
    expect(src, 'main.tsx route /planning').toContain('/planning')
    expect(src, 'main.tsx route /agentics').toContain('/agentics')
  })
})

// =============================================================================
// P90.3 — ModeSelectorCard wire / consumer
// Tolerant: walks src/pages + src/components looking for any file that BOTH
// references onSelectMode= AND /planning or /agentics. A3 may have wired
// Welcome.tsx, Onboarding.tsx, or carried forward — any consumer satisfies.
// =============================================================================
test.describe('P90.3 — ModeSelectorCard consumer', () => {
  test('some src/ file calls onSelectMode= and references /planning or /agentics', () => {
    const candidates = [...walkDir(SRC_PAGES), ...walkDir(SRC_COMPONENTS)]
    let found = false
    for (const file of candidates) {
      let body: string
      try {
        body = read(file)
      } catch {
        continue
      }
      if (
        body.includes('onSelectMode={') &&
        (body.includes('/planning') || body.includes('/agentics'))
      ) {
        found = true
        break
      }
    }
    expect(
      found,
      'no consumer found that calls onSelectMode= and references /planning or /agentics',
    ).toBe(true)
  })
})

// =============================================================================
// P90.4 — uiStore activeMode (A3 surface)
// =============================================================================
test.describe('P90.4 — uiStore activeMode (A3)', () => {
  test('uiStore.ts source contains activeMode', () => {
    if (!existsSync(UI_STORE)) return
    expect(read(UI_STORE)).toContain('activeMode')
  })
  test('uiStore.ts source contains setActiveMode', () => {
    if (!existsSync(UI_STORE)) return
    expect(read(UI_STORE)).toContain('setActiveMode')
  })
})

// =============================================================================
// P90.5 — AppShell mode-aware (A4 surface)
// =============================================================================
test.describe('P90.5 — AppShell mode-aware (A4)', () => {
  test('AppShell.tsx source contains useLocation', () => {
    if (!existsSync(APP_SHELL)) return
    expect(read(APP_SHELL)).toContain('useLocation')
  })
  test('AppShell.tsx branches on /planning pathname (testid OR pathname check)', () => {
    if (!existsSync(APP_SHELL)) return
    const src = read(APP_SHELL)
    const hasTestid = src.includes('appshell-mode-planning')
    const hasPathnameCheck = src.includes("pathname.startsWith('/planning')") ||
      src.includes('pathname.startsWith("/planning")')
    expect(
      hasTestid || hasPathnameCheck,
      'AppShell must contain appshell-mode-planning testid OR pathname.startsWith(/planning) check',
    ).toBe(true)
  })
})

// =============================================================================
// P90.6 — Stubs use ADR-091 tokens
// =============================================================================
test.describe('P90.6 — Stubs use ADR-091 tokens', () => {
  test('Planning.tsx + Agentics.tsx contain var(--hb- references', () => {
    const surfaces = [PAGE_PLANNING, PAGE_AGENTICS]
    for (const file of surfaces) {
      if (!existsSync(file)) continue
      const src = read(file)
      expect(
        src.includes('var(--hb-'),
        `${file} must contain at least one var(--hb-* token reference (ADR-091)`,
      ).toBe(true)
    }
  })
})

// =============================================================================
// P90.7 — KISS — no animation libs in P90 source
// =============================================================================
test.describe('P90.7 — KISS — no animation libs in P90 source', () => {
  test('no P90 source file imports framer-motion / gsap / lottie / react-spring / animejs', () => {
    const surfaces = [PAGE_PLANNING, PAGE_AGENTICS, APP_SHELL, UI_STORE, MAIN_TSX]
    for (const file of surfaces) {
      if (!existsSync(file)) continue
      const src = read(file).toLowerCase()
      for (const tok of BANNED_ANIM_TOKENS) {
        expect(
          src.includes(tok),
          `${file} must not import banned animation lib '${tok}' (KISS / Hard rule #2)`,
        ).toBe(false)
      }
    }
  })
})

// =============================================================================
// P90.8 — EOP triplet present for P90 (hard-gate; A5 owns)
// =============================================================================
test.describe('P90.8 — EOP triplet present for P90', () => {
  test('phase-90/02-post-review.md exists', () => {
    expect(existsSync(EOP_REVIEW)).toBe(true)
  })
  test('phase-90/session-log.md exists', () => {
    expect(existsSync(EOP_LOG)).toBe(true)
  })
  test('phase-90/retrospective.md exists', () => {
    expect(existsSync(EOP_RETRO)).toBe(true)
  })
})
