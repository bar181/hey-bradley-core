/**
 * P69 / OC-5 / A8 — Mobile UX Redesign enforcement tests (ADR-090).
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p67c-library-polish.spec.ts.
 *
 * Asserts the 5 owner-locked decisions in ADR-090:
 *   1. Single surface + inline mic
 *   2. Pre-filled prompt + personality pill
 *   3. Bottom sheet for specs
 *   4. Fullscreen listen mode
 *   5. Marketing site mobile out-of-scope
 *
 * Plus KISS guard: zero animation-library references across the 4 mobile files.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR ---
const ADR_PATH = join(ROOT, 'docs/adr/ADR-090-mobile-ux-redesign.md')

// --- Mobile shell files ---
const MOBILE_LAYOUT = join(ROOT, 'src/components/shell/MobileLayout.tsx')
const MOBILE_LISTEN = join(ROOT, 'src/components/shell/MobileListenFullscreen.tsx')
const MOBILE_SHEET = join(ROOT, 'src/components/shell/MobileSpecBottomSheet.tsx')
const MOBILE_PREFILL = join(ROOT, 'src/components/shell/MobilePreFilledPrompt.tsx')

const MOBILE_FILES = [MOBILE_LAYOUT, MOBILE_LISTEN, MOBILE_SHEET, MOBILE_PREFILL]
const ANIM_LIBS = ['framer-motion', 'gsap', 'lottie', '@react-spring', 'animejs']

function read(p: string): string { return readFileSync(p, 'utf8') }
function locOf(p: string): number { return read(p).split('\n').length }

// =============================================================================
// P69.1 — ADR-090 file shape
// =============================================================================
test.describe('P69.1 — ADR-090 file shape', () => {
  test('ADR-090 exists on disk', () => {
    expect(existsSync(ADR_PATH)).toBe(true)
  })
  test('ADR-090 is ≤120 LOC', () => {
    expect(locOf(ADR_PATH)).toBeLessThanOrEqual(120)
  })
  test('ADR-090 declares Status: Accepted', () => {
    expect(read(ADR_PATH)).toMatch(/Status:\*\*\s*Accepted/)
  })
  test('ADR-090 cross-refs ADR-076 + ADR-088 + ADR-091 + ADR-094 + ADR-095', () => {
    const src = read(ADR_PATH)
    for (const ref of ['ADR-076', 'ADR-088', 'ADR-091', 'ADR-094', 'ADR-095']) {
      expect(src, `ADR-090 should cross-ref ${ref}`).toContain(ref)
    }
  })
  test('ADR-090 mentions all 5 owner-locked decisions (keyword sweep)', () => {
    const src = read(ADR_PATH).toLowerCase()
    expect(src, 'decision 1 — single surface').toContain('single surface')
    expect(src, 'decision 2 — pre-filled').toContain('pre-filled')
    expect(src, 'decision 3 — bottom sheet').toContain('bottom sheet')
    expect(src, 'decision 4 — fullscreen listen').toMatch(/fullscreen listen|full-?screen listen|full-viewport listen/)
    expect(src, 'decision 5 — marketing').toContain('marketing')
  })
})

// =============================================================================
// P69.2 — A6 MobileLayout single-surface redesign
// =============================================================================
test.describe('P69.2 — A6 MobileLayout single-surface redesign', () => {
  test('MobileLayout.tsx exists', () => {
    expect(existsSync(MOBILE_LAYOUT)).toBe(true)
  })
  test('MobileLayout.tsx removed mobile-tab-builder + mobile-tab-listen testids (3-tab nav gone)', () => {
    const src = read(MOBILE_LAYOUT)
    expect(src, 'mobile-tab-builder testid should be removed').not.toContain('data-testid="mobile-tab-builder"')
    expect(src, 'mobile-tab-listen testid should be removed').not.toContain('data-testid="mobile-tab-listen"')
  })
  test('MobileLayout.tsx imports the inline Mic lucide icon', () => {
    const src = read(MOBILE_LAYOUT)
    expect(src).toMatch(/from\s+['"]lucide-react['"]/)
    expect(src).toContain('Mic')
  })
  test('MobileLayout.tsx carries min-h-[44px] touch-target class on at least one control', () => {
    expect(read(MOBILE_LAYOUT)).toContain('min-h-[44px]')
  })
  test('MobileLayout.tsx exposes the bottom-sheet trigger ("See Specs" copy or testid)', () => {
    const src = read(MOBILE_LAYOUT)
    const hasCopy = src.includes('See Specs')
    const hasTestid = /data-testid=["'][^"']*spec[^"']*["']/i.test(src)
    expect(hasCopy || hasTestid, 'MobileLayout should expose a See-Specs affordance').toBe(true)
  })
  test('MobileLayout.tsx preserves md:hidden mobile-only wrapper', () => {
    expect(read(MOBILE_LAYOUT)).toContain('md:hidden')
  })
})

// =============================================================================
// P69.3 — A7 MobileListenFullscreen shipped
// =============================================================================
test.describe('P69.3 — A7 MobileListenFullscreen shipped', () => {
  test('MobileListenFullscreen.tsx exists', () => {
    expect(existsSync(MOBILE_LISTEN)).toBe(true)
  })
  test('MobileListenFullscreen.tsx is full-viewport (fixed inset-0 z-30)', () => {
    const src = read(MOBILE_LISTEN)
    expect(src).toContain('fixed inset-0')
    expect(src).toContain('z-30')
  })
  test('MobileListenFullscreen.tsx imports the large Mic lucide icon', () => {
    const src = read(MOBILE_LISTEN)
    expect(src).toMatch(/from\s+['"]lucide-react['"]/)
    expect(src).toContain('Mic')
  })
  test('MobileListenFullscreen.tsx carries dialog ARIA semantics (role + aria-modal)', () => {
    const src = read(MOBILE_LISTEN)
    expect(src).toContain('role="dialog"')
    expect(src).toContain('aria-modal="true"')
  })
  test('MobileListenFullscreen.tsx labels the dialog (aria-label "Listen…" or close)', () => {
    const src = read(MOBILE_LISTEN)
    expect(src).toMatch(/aria-label="Listen[^"]*"/)
  })
})

// =============================================================================
// P69.4 — A7 MobileSpecBottomSheet shipped
// =============================================================================
test.describe('P69.4 — A7 MobileSpecBottomSheet shipped', () => {
  test('MobileSpecBottomSheet.tsx exists', () => {
    expect(existsSync(MOBILE_SHEET)).toBe(true)
  })
  test('MobileSpecBottomSheet.tsx is bottom-anchored (fixed bottom-0)', () => {
    expect(read(MOBILE_SHEET)).toContain('fixed bottom-0')
  })
  test('MobileSpecBottomSheet.tsx renders a drag-handle pill (rounded-full + height class)', () => {
    const src = read(MOBILE_SHEET)
    expect(src).toContain('rounded-full')
    // small height pill — h-1, h-1.5, or h-2 are canonical drag-handle sizes
    expect(src).toMatch(/\bh-1(\.5)?\b|\bh-2\b/)
  })
  test('MobileSpecBottomSheet.tsx carries peek + full state literals', () => {
    const src = read(MOBILE_SHEET)
    expect(src).toContain("'peek'")
    expect(src).toContain("'full'")
  })
  test('MobileSpecBottomSheet.tsx carries dialog role', () => {
    expect(read(MOBILE_SHEET)).toContain('role="dialog"')
  })
})

// =============================================================================
// P69.5 — A8 MobilePreFilledPrompt shipped
// =============================================================================
test.describe('P69.5 — A8 MobilePreFilledPrompt shipped', () => {
  test('MobilePreFilledPrompt.tsx exists', () => {
    expect(existsSync(MOBILE_PREFILL)).toBe(true)
  })
  test('MobilePreFilledPrompt.tsx is ≤80 LOC', () => {
    expect(locOf(MOBILE_PREFILL)).toBeLessThanOrEqual(80)
  })
  test('MobilePreFilledPrompt.tsx exports MobilePreFilledPrompt named function', () => {
    const src = read(MOBILE_PREFILL)
    const exported =
      /export\s+function\s+MobilePreFilledPrompt/.test(src) ||
      /export\s+const\s+MobilePreFilledPrompt\s*[:=]/.test(src) ||
      /export\s*\{\s*[^}]*\bMobilePreFilledPrompt\b[^}]*\}/.test(src)
    expect(exported).toBe(true)
  })
  test('MobilePreFilledPrompt.tsx exports shouldShow + markDismissed helpers', () => {
    const src = read(MOBILE_PREFILL)
    expect(src).toMatch(/export\s+function\s+shouldShowMobilePreFilledPrompt\b/)
    expect(src).toMatch(/export\s+function\s+markMobilePreFilledPromptDismissed\b/)
  })
  test('MobilePreFilledPrompt.tsx references kv key mobile_prefilled_prompt_dismissed', () => {
    expect(read(MOBILE_PREFILL)).toContain('mobile_prefilled_prompt_dismissed')
  })
  test('MobilePreFilledPrompt.tsx renders ≥3 of the 5 personality emoji chips', () => {
    const src = read(MOBILE_PREFILL)
    const chips = ['🎩', '🎉', '🔬', '👩‍🏫', '💪']
    const hits = chips.filter((e) => src.includes(e)).length
    expect(hits, `expected ≥3 of ${chips.join(' / ')} — got ${hits}`).toBeGreaterThanOrEqual(3)
  })
  test('MobilePreFilledPrompt.tsx surfaces the "Try: make me a site about" hint literal', () => {
    expect(read(MOBILE_PREFILL)).toContain('Try: make me a site about')
  })
  test('MobilePreFilledPrompt.tsx wires setPersonality from intelligenceStore', () => {
    const src = read(MOBILE_PREFILL)
    expect(src).toContain('useIntelligenceStore')
    expect(src).toContain('setPersonality')
  })
})

// =============================================================================
// P69.6 — KISS: no animation libraries on the 4 mobile files
// =============================================================================
test.describe('P69.6 — KISS: no animation libs on mobile shell', () => {
  for (const lib of ANIM_LIBS) {
    test(`zero references to ${lib} across the 4 mobile shell files`, () => {
      for (const f of MOBILE_FILES) {
        if (!existsSync(f)) continue
        const src = read(f)
        expect(src, `${f} should not import ${lib}`).not.toContain(lib)
      }
    })
  }
})
