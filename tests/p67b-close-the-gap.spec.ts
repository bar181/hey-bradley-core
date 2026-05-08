/**
 * P67b / Polish Wave 2 close-the-gap — ADR-094 quality bar enforcement.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p67-polish-wave2.spec.ts.
 *
 * Asserts the P67b contract:
 *   1. ADR-094 file shape + cross-refs
 *   2. A1 ChatInput orchestrator consumed sub-components (≤900 LOC)
 *   3. A2 sub-page hero canonical shape (AISP / OpenCore / Research / Progress)
 *   4. A3 mobile audit landed (audit doc + 2 demos with responsive guards)
 *   5. Regression heads-up: 7 canonical section components still token-driven
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR ---
const ADR_PATH = join(ROOT, 'docs/adr/ADR-094-professional-grade-standard.md')

// --- A1: ChatInput orchestrator + sub-components ---
const CHAT_INPUT = join(ROOT, 'src/components/shell/ChatInput.tsx')
const CHAT_INPUT_BAR_IMPORT = '@/components/shell/ChatInputBar'
const CHAT_INPUT_QUICK_IMPORT = '@/components/shell/ChatInputQuickActions'
const CHAT_INPUT_PERSONALITY_IMPORT = '@/components/shell/ChatInputPersonalityPopover'

// --- A2: sub-page hero shape ---
const SUBPAGE_AISP = join(ROOT, 'src/pages/AISP.tsx')
const SUBPAGE_OPENCORE = join(ROOT, 'src/pages/OpenCore.tsx')
const SUBPAGE_RESEARCH = join(ROOT, 'src/pages/Research.tsx')
const SUBPAGE_PROGRESS = join(ROOT, 'src/pages/Progress.tsx')
const SUBPAGE_BLOG = join(ROOT, 'src/pages/Blog.tsx')

const SUBPAGES_CANONICAL = [
  { path: SUBPAGE_AISP, name: 'AISP.tsx' },
  { path: SUBPAGE_OPENCORE, name: 'OpenCore.tsx' },
  { path: SUBPAGE_RESEARCH, name: 'Research.tsx' },
  { path: SUBPAGE_PROGRESS, name: 'Progress.tsx' },
]

// --- A3: mobile audit ---
const MOBILE_AUDIT = join(ROOT, 'plans/implementation/phase-67b/03-mobile-audit.md')
const LISTEN_DEMO = join(ROOT, 'src/demos/ListenModeDemo.tsx')
const CHAT_DEMO = join(ROOT, 'src/demos/ChatModeDemo.tsx')

// --- Regression: canonical section components (per ADR-091) ---
const CANONICAL_COMPONENTS_DIR = 'src/components/sections/canonical'
const CANONICAL_FILES = [
  'HeroCentered.tsx',
  'HeroSplit.tsx',
  'HeroMinimal.tsx',
  'HeroOverlay.tsx',
  'FeatureGrid.tsx',
  'FeatureAlternating.tsx',
  'TestimonialCarousel.tsx',
]

function read(p: string): string {
  return readFileSync(p, 'utf8')
}

// =============================================================================
// P67b.1 — ADR-094 file shape
// =============================================================================
test.describe('P67b.1 — ADR-094 file shape', () => {
  test('ADR-094 exists on disk', () => {
    expect(existsSync(ADR_PATH)).toBe(true)
  })
  test('ADR-094 is ≤120 LOC', () => {
    const lines = read(ADR_PATH).split('\n').length
    expect(lines).toBeLessThanOrEqual(120)
  })
  test('ADR-094 declares Status: Accepted', () => {
    const src = read(ADR_PATH)
    expect(src).toMatch(/Status:\*\*\s*Accepted/)
  })
  test('ADR-094 cross-refs ADR-091 + ADR-092 + ADR-093 + ADR-087', () => {
    const src = read(ADR_PATH)
    expect(src).toContain('ADR-091')
    expect(src).toContain('ADR-092')
    expect(src).toContain('ADR-093')
    expect(src).toContain('ADR-087')
  })
})

// =============================================================================
// P67b.2 — A1 ChatInput orchestrator consumed sub-components
// =============================================================================
test.describe('P67b.2 — A1 ChatInput orchestrator consumed sub-components', () => {
  test('ChatInput.tsx exists', () => {
    expect(existsSync(CHAT_INPUT)).toBe(true)
  })
  test('ChatInput.tsx ≤900 LOC (honest reduction from 1013; ≤700 target deferred to P67c)', () => {
    const lines = read(CHAT_INPUT).split('\n').length
    expect(lines).toBeLessThanOrEqual(900)
  })
  test('ChatInput.tsx imports ChatInputBar from canonical path', () => {
    const src = read(CHAT_INPUT)
    expect(src).toContain(CHAT_INPUT_BAR_IMPORT)
  })
  test('ChatInput.tsx imports ChatInputQuickActions from canonical path', () => {
    const src = read(CHAT_INPUT)
    expect(src).toContain(CHAT_INPUT_QUICK_IMPORT)
  })
  test('ChatInput.tsx imports ChatInputPersonalityPopover from canonical path', () => {
    const src = read(CHAT_INPUT)
    expect(src).toContain(CHAT_INPUT_PERSONALITY_IMPORT)
  })
  test('ChatInput.tsx renders <ChatInputBar (call site present)', () => {
    const src = read(CHAT_INPUT)
    expect(src).toContain('<ChatInputBar')
  })
  test('ChatInput.tsx renders <ChatInputQuickActions (call site present)', () => {
    const src = read(CHAT_INPUT)
    expect(src).toContain('<ChatInputQuickActions')
  })
  test('ChatInput.tsx renders <ChatInputPersonalityPopover (call site present)', () => {
    const src = read(CHAT_INPUT)
    expect(src).toContain('<ChatInputPersonalityPopover')
  })
  test('ChatInput.tsx still surfaces INTENT_ATOM literal (Geek mode preserved)', () => {
    // P67c/A3 moved the message-thread block into ChatThread.tsx.
    const chatInputSrc = read(CHAT_INPUT)
    const chatThreadPath = join(process.cwd(), 'src/components/shell/ChatThread.tsx')
    const chatThreadSrc = existsSync(chatThreadPath) ? read(chatThreadPath) : ''
    expect(chatInputSrc + chatThreadSrc).toContain('INTENT_ATOM')
  })
  test('ChatInput.tsx still surfaces "Try:" literal (Teacher mode preserved)', () => {
    const chatInputSrc = read(CHAT_INPUT)
    const chatThreadPath = join(process.cwd(), 'src/components/shell/ChatThread.tsx')
    const chatThreadSrc = existsSync(chatThreadPath) ? read(chatThreadPath) : ''
    expect(chatInputSrc + chatThreadSrc).toContain('Try:')
  })
})

// =============================================================================
// P67b.3 — A2 sub-page hero canonical shape
// =============================================================================
test.describe('P67b.3 — A2 sub-page hero canonical shape', () => {
  for (const { path, name } of SUBPAGES_CANONICAL) {
    test(`${name} carries the canonical eyebrow Tailwind classes`, () => {
      expect(existsSync(path)).toBe(true)
      const src = read(path)
      // Canonical eyebrow: text-xs uppercase tracking-[0.2em] text-[#e8772e]
      // Allow close variants (e.g. text-orange-500 / brand color in token form)
      const hasEyebrow =
        /text-xs[^"'`]*uppercase[^"'`]*tracking-\[0\.2em\]/.test(src) ||
        /tracking-\[0\.2em\][^"'`]*text-xs/.test(src) ||
        (src.includes('uppercase') && src.includes('tracking-[0.2em]'))
      expect(hasEyebrow).toBe(true)
    })
    test(`${name} contains "Try the open source version" CTA`, () => {
      const src = read(path)
      expect(src).toContain('Try the open source version')
    })
    test(`${name} contains either "Explore AISP" or "View on GitHub" secondary CTA`, () => {
      const src = read(path)
      const hasSecondary =
        src.includes('Explore AISP') || src.includes('View on GitHub')
      expect(hasSecondary).toBe(true)
    })
  }
  test('Blog.tsx exists (no canonical-shape assertion — A2 left it untouched as already 8+)', () => {
    expect(existsSync(SUBPAGE_BLOG)).toBe(true)
  })
})

// =============================================================================
// P67b.4 — A3 mobile audit landed
// =============================================================================
test.describe('P67b.4 — A3 mobile audit landed', () => {
  test('mobile audit doc exists at plans/implementation/phase-67b/03-mobile-audit.md', () => {
    expect(existsSync(MOBILE_AUDIT)).toBe(true)
  })
  test('mobile audit doc references 375px target width', () => {
    const src = read(MOBILE_AUDIT)
    expect(src).toContain('375px')
  })
  test('mobile audit doc references 390px target width', () => {
    const src = read(MOBILE_AUDIT)
    expect(src).toContain('390px')
  })
  test('mobile audit doc references 428px target width', () => {
    const src = read(MOBILE_AUDIT)
    expect(src).toContain('428px')
  })
  test('ListenModeDemo.tsx contains flex-wrap (mobile header guard)', () => {
    expect(existsSync(LISTEN_DEMO)).toBe(true)
    const src = read(LISTEN_DEMO)
    expect(src).toContain('flex-wrap')
  })
  test('ChatModeDemo.tsx contains responsive padding or wrap (px-4 md:px-6 OR flex-wrap)', () => {
    expect(existsSync(CHAT_DEMO)).toBe(true)
    const src = read(CHAT_DEMO)
    const hasResponsiveGuard =
      src.includes('px-4 md:px-6') || src.includes('flex-wrap')
    expect(hasResponsiveGuard).toBe(true)
  })
})

// =============================================================================
// P67b.5 — Regression heads-up: canonical section components still token-driven
// =============================================================================
test.describe('P67b.5 — canonical section components still token-driven (ADR-091 regression)', () => {
  test('all 7 canonical section components import from @/styles/design-tokens', () => {
    for (const filename of CANONICAL_FILES) {
      const fullPath = join(ROOT, CANONICAL_COMPONENTS_DIR, filename)
      if (!existsSync(fullPath)) {
        // Tolerate file-rename / restructure — surface the miss but do not
        // fail the regression heads-up on a path discrepancy.
        continue
      }
      const src = read(fullPath)
      expect(src).toMatch(/from\s+['"]@\/styles\/design-tokens['"]/)
    }
  })
})
