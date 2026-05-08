/**
 * P66 / Polish Sprint Wave 1 — ADR-092 quality bar enforcement.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p65b-canonical-components.spec.ts.
 *
 * Asserts the 5 polish standards from ADR-092 are shipped:
 *   1. No-API-key demo discovery (A1 + A2)
 *   2. First-run mobile path (A3)
 *   3. Mode framing precedence (A4)
 *   4. Library scale via filter UI (A5)
 *   5. Personality affordance ≤ 1 click (A6)
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const ADR_PATH = join(ROOT, 'docs/adr/ADR-092-polish-sprint-architecture.md')

const LISTEN_DEMO = join(ROOT, 'src/demos/ListenModeDemo.tsx')
const CHAT_DEMO = join(ROOT, 'src/demos/ChatModeDemo.tsx')

const MOBILE_FIRST_RUN = join(ROOT, 'src/components/shell/MobileFirstRunCard.tsx')
const MOBILE_LAYOUT = join(ROOT, 'src/components/shell/MobileLayout.tsx')
const MOBILE_MENU = join(ROOT, 'src/components/shell/MobileMenu.tsx')

const ONBOARDING = join(ROOT, 'src/pages/Onboarding.tsx')

const TEMPLATE_PICKER = join(ROOT, 'src/components/shell/TemplateBrowsePicker.tsx')
const QUICK_ADD = join(ROOT, 'src/components/left-panel/QuickAddPicker.tsx')
const SECTION_SIMPLE = join(ROOT, 'src/components/right-panel/simple/SectionSimple.tsx')

const CHAT_INPUT = join(ROOT, 'src/components/shell/ChatInput.tsx')
const LISTEN_TAB = join(ROOT, 'src/components/left-panel/ListenTab.tsx')

const ANIM_LIBS = [/framer-motion/i, /\bgsap\b/i, /\blottie\b/i, /@react-spring/i, /animejs/i]

test.describe('P66.1 — ADR-092 file shape', () => {
  test('ADR-092 exists on disk', () => {
    expect(existsSync(ADR_PATH)).toBe(true)
  })
  test('ADR-092 is ≤120 LOC', () => {
    const src = readFileSync(ADR_PATH, 'utf8')
    const lines = src.split('\n').length
    expect(lines).toBeLessThanOrEqual(120)
  })
  test('ADR-092 declares Status: Accepted and cross-refs ADR-087 + ADR-091 + ADR-088', () => {
    const src = readFileSync(ADR_PATH, 'utf8')
    expect(src).toMatch(/Status:\*\*\s*Accepted/)
    expect(src).toContain('ADR-087')
    expect(src).toContain('ADR-091')
    expect(src).toContain('ADR-088')
  })
})

test.describe('P66.2 — A1 ListenModeDemo shipped (no-API-key demo discovery)', () => {
  test('ListenModeDemo.tsx exists', () => {
    expect(existsSync(LISTEN_DEMO)).toBe(true)
  })
  test('ListenModeDemo exports a ListenModeDemo component', () => {
    const src = readFileSync(LISTEN_DEMO, 'utf8')
    expect(src).toMatch(/export\s+(default\s+)?(function|const)\s+ListenModeDemo|export\s+\{[^}]*ListenModeDemo/)
  })
  test('ListenModeDemo contains an INTERACTIONS array (scripted path)', () => {
    const src = readFileSync(LISTEN_DEMO, 'utf8')
    expect(src).toContain('INTERACTIONS')
  })
  test('ListenModeDemo imports tokens from @/styles/design-tokens', () => {
    const src = readFileSync(LISTEN_DEMO, 'utf8')
    expect(src).toContain("from '@/styles/design-tokens'")
  })
  test('ListenModeDemo uses canonical Wave-2 reveal pattern (IntersectionObserver or useEffect)', () => {
    const src = readFileSync(LISTEN_DEMO, 'utf8')
    expect(src).toMatch(/IntersectionObserver|useEffect/)
  })
  test('ListenModeDemo does NOT import the live useListenPipeline (fixture-only)', () => {
    const src = readFileSync(LISTEN_DEMO, 'utf8')
    expect(src).not.toContain('useListenPipeline')
  })
})

test.describe('P66.3 — A2 ChatModeDemo shipped (no-API-key demo discovery)', () => {
  test('ChatModeDemo.tsx exists', () => {
    expect(existsSync(CHAT_DEMO)).toBe(true)
  })
  test('ChatModeDemo exports a ChatModeDemo component', () => {
    const src = readFileSync(CHAT_DEMO, 'utf8')
    expect(src).toMatch(/export\s+(default\s+)?(function|const)\s+ChatModeDemo|export\s+\{[^}]*ChatModeDemo/)
  })
  test('ChatModeDemo contains an INTERACTIONS array (scripted path)', () => {
    const src = readFileSync(CHAT_DEMO, 'utf8')
    expect(src).toContain('INTERACTIONS')
  })
  test('ChatModeDemo references aispAtoms (5-atom trace surfacing)', () => {
    const src = readFileSync(CHAT_DEMO, 'utf8')
    expect(src.toLowerCase()).toContain('aispatoms')
  })
  test('ChatModeDemo imports tokens from @/styles/design-tokens', () => {
    const src = readFileSync(CHAT_DEMO, 'utf8')
    expect(src).toContain("from '@/styles/design-tokens'")
  })
})

test.describe('P66.4 — A3 Mobile first-run card shipped (first-run mobile path)', () => {
  test('MobileFirstRunCard.tsx exists', () => {
    expect(existsSync(MOBILE_FIRST_RUN)).toBe(true)
  })
  test('MobileFirstRunCard.tsx is ≤80 LOC', () => {
    const src = readFileSync(MOBILE_FIRST_RUN, 'utf8')
    // Strip trailing newline before counting (match `wc -l` semantics);
    // P67/A4 added a slide-up entrance bringing the file to 80 LOC content
    // + 1 trailing newline => split('\n').length = 81 without the strip.
    const lines = src.replace(/\n$/, '').split('\n').length
    expect(lines).toBeLessThanOrEqual(80)
  })
  test('MobileFirstRunCard exports MobileFirstRunCard + shouldShowMobileFirstRun + markMobileFirstRunSeen', () => {
    const src = readFileSync(MOBILE_FIRST_RUN, 'utf8')
    expect(src).toContain('MobileFirstRunCard')
    expect(src).toContain('shouldShowMobileFirstRun')
    expect(src).toContain('markMobileFirstRunSeen')
  })
  test('MobileFirstRunCard references the mobile_first_run_seen kv key', () => {
    const src = readFileSync(MOBILE_FIRST_RUN, 'utf8')
    expect(src).toContain('mobile_first_run_seen')
  })
  test('MobileLayout imports MobileFirstRunCard and consumes shouldShowMobileFirstRun', () => {
    expect(existsSync(MOBILE_LAYOUT)).toBe(true)
    const src = readFileSync(MOBILE_LAYOUT, 'utf8')
    expect(src).toContain('MobileFirstRunCard')
    expect(src).toContain('shouldShowMobileFirstRun')
  })
  test('MobileMenu touch-target compliance (min-h-[44px])', () => {
    expect(existsSync(MOBILE_MENU)).toBe(true)
    const src = readFileSync(MOBILE_MENU, 'utf8')
    expect(src).toContain('min-h-[44px]')
  })
})

test.describe('P66.5 — A4 Onboarding mode selector integration (mode framing precedence)', () => {
  test('Onboarding.tsx exists', () => {
    expect(existsSync(ONBOARDING)).toBe(true)
  })
  test('Onboarding imports ModeSelectorCard from @/components/onboarding/ModeSelectorCard', () => {
    const src = readFileSync(ONBOARDING, 'utf8')
    expect(src).toContain('ModeSelectorCard')
    expect(src).toMatch(/from\s+['"]@\/components\/onboarding\/ModeSelectorCard['"]/)
  })
  test('Onboarding references appMode from uiStore', () => {
    const src = readFileSync(ONBOARDING, 'utf8')
    expect(src).toContain('appMode')
  })
  test('Onboarding contains MODE_HINT_COPY table or per-mode hint logic', () => {
    const src = readFileSync(ONBOARDING, 'utf8')
    expect(src).toMatch(/MODE_HINT_COPY|modeHint|HINT_COPY/)
  })
})

test.describe('P66.6 — A5 TemplateBrowsePicker filter UI (library scale via filter UI)', () => {
  test('TemplateBrowsePicker.tsx exists', () => {
    expect(existsSync(TEMPLATE_PICKER)).toBe(true)
  })
  test('TemplateBrowsePicker contains PERSONA_KEYWORDS and INDUSTRY_KEYWORDS tables', () => {
    const src = readFileSync(TEMPLATE_PICKER, 'utf8')
    expect(src).toMatch(/PERSONA_KEYWORDS|personaKeywords/)
    expect(src).toMatch(/INDUSTRY_KEYWORDS|industryKeywords/)
  })
  test('TemplateBrowsePicker exposes filter pill data-testid', () => {
    const src = readFileSync(TEMPLATE_PICKER, 'utf8')
    // Accept either `template-filter-` prefix or `filter-{persona|industry|complexity}-` prefix.
    // JSX template-literal form `data-testid={\`filter-persona-${opt}\`}` is the actual shipped pattern.
    expect(src).toMatch(/filter-(?:persona|industry|complexity)-/)
  })
  test('TemplateBrowsePicker has a Clear-filters affordance', () => {
    const src = readFileSync(TEMPLATE_PICKER, 'utf8')
    expect(src.toLowerCase()).toMatch(/clear filters|clear-filters|aria-label="clear/i)
  })
})

test.describe('P66.7 — A5 QuickAdd preview thumbnails (library scale via filter UI)', () => {
  test('QuickAddPicker.tsx exists', () => {
    expect(existsSync(QUICK_ADD)).toBe(true)
  })
  test('QuickAddPicker contains a SectionThumbnail helper', () => {
    const src = readFileSync(QUICK_ADD, 'utf8')
    expect(src).toContain('SectionThumbnail')
  })
  test('QuickAddPicker cards expose a quick-add data-testid prefix', () => {
    const src = readFileSync(QUICK_ADD, 'utf8')
    // Match either string-quoted or template-literal-quoted form
    expect(src).toMatch(/data-testid=(?:"quick-add-|\{`quick-add-)/)
  })
  test('QuickAddPicker references tokens.radius for card radius', () => {
    const src = readFileSync(QUICK_ADD, 'utf8')
    expect(src).toMatch(/tokens\.radius/)
  })
})

test.describe('P66.8 — A5 Builder collapse-by-default pattern', () => {
  test('SectionSimple.tsx exists', () => {
    expect(existsSync(SECTION_SIMPLE)).toBe(true)
  })
  test('SectionSimple uses local useState for collapse/expand', () => {
    const src = readFileSync(SECTION_SIMPLE, 'utf8')
    expect(src).toContain('useState')
  })
  test('SectionSimple exposes aria-expanded or a collapse-toggle data-testid', () => {
    const src = readFileSync(SECTION_SIMPLE, 'utf8')
    expect(src).toMatch(/aria-expanded|data-testid="section-editor-collapse-toggle"/)
  })
  test('SectionSimple imports ChevronDown + ChevronRight from lucide', () => {
    const src = readFileSync(SECTION_SIMPLE, 'utf8')
    expect(src).toContain('ChevronDown')
    expect(src).toContain('ChevronRight')
  })
})

test.describe('P66.9 — A6 Personality popover in ChatInput (≤1-click affordance)', () => {
  test('ChatInput.tsx exists', () => {
    expect(existsSync(CHAT_INPUT)).toBe(true)
  })
  test('ChatInput references PERSONALITY_IDS', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(src).toContain('PERSONALITY_IDS')
  })
  test('ChatInput contains personality popover toggle state', () => {
    // P67b/A1 moved popover state into ChatInputPersonalityPopover.tsx
    // (correct: state lives with the component). Check both locations.
    const chatInputSrc = readFileSync(CHAT_INPUT, 'utf8')
    const popoverPath = join(ROOT, 'src/components/shell/ChatInputPersonalityPopover.tsx')
    const popoverSrc = existsSync(popoverPath) ? readFileSync(popoverPath, 'utf8') : ''
    const combined = chatInputSrc + popoverSrc
    expect(combined).toMatch(/setShowPersonalityPicker|showPersonalityPicker|personalityPopover|setPersonalityOpen|setPersonality/)
  })
  test('ChatInput Geek-mode footer surfaces raw INTENT_ATOM literal', () => {
    // P67c/A3 moved the message-thread render block into ChatThread.tsx
    // (along with the Geek INTENT_ATOM footer). Check both files.
    const chatInputSrc = readFileSync(CHAT_INPUT, 'utf8')
    const chatThreadPath = join(ROOT, 'src/components/shell/ChatThread.tsx')
    const chatThreadSrc = existsSync(chatThreadPath) ? readFileSync(chatThreadPath, 'utf8') : ''
    expect(chatInputSrc + chatThreadSrc).toContain('INTENT_ATOM')
  })
  test('ChatInput Teacher-mode shows "Try:" suggestion chips', () => {
    // P67c/A3 moved the Teacher-mode chips to ChatThread.tsx with the loop.
    const chatInputSrc = readFileSync(CHAT_INPUT, 'utf8')
    const chatThreadPath = join(ROOT, 'src/components/shell/ChatThread.tsx')
    const chatThreadSrc = existsSync(chatThreadPath) ? readFileSync(chatThreadPath, 'utf8') : ''
    expect(chatInputSrc + chatThreadSrc).toContain('Try:')
  })
})

test.describe('P66.10 — A6 Personality popover in ListenTab (≤1-click affordance)', () => {
  test('ListenTab.tsx exists', () => {
    expect(existsSync(LISTEN_TAB)).toBe(true)
  })
  test('ListenTab references setPersonality', () => {
    const src = readFileSync(LISTEN_TAB, 'utf8')
    expect(src).toContain('setPersonality')
  })
  test('ListenTab references PERSONALITY_IDS or PERSONALITY_PROFILES', () => {
    const src = readFileSync(LISTEN_TAB, 'utf8')
    expect(src).toMatch(/PERSONALITY_IDS|PERSONALITY_PROFILES/)
  })
})

test.describe('P66.11 — KISS verification across A1 + A2 demos', () => {
  test('ListenModeDemo imports no animation libraries', () => {
    const src = readFileSync(LISTEN_DEMO, 'utf8')
    for (const re of ANIM_LIBS) expect(src).not.toMatch(re)
  })
  test('ChatModeDemo imports no animation libraries', () => {
    const src = readFileSync(CHAT_DEMO, 'utf8')
    for (const re of ANIM_LIBS) expect(src).not.toMatch(re)
  })
  test('Both demos import from @/styles/design-tokens', () => {
    const a1 = readFileSync(LISTEN_DEMO, 'utf8')
    const a2 = readFileSync(CHAT_DEMO, 'utf8')
    expect(a1).toContain("from '@/styles/design-tokens'")
    expect(a2).toContain("from '@/styles/design-tokens'")
  })
})
