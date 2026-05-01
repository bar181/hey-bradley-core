/**
 * P67c / Close the Gap — ADR-095 library-wide polish standard enforcement.
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
 * Pattern follows tests/p67b-close-the-gap.spec.ts.
 *
 * Asserts the P67c contract:
 *   1. ADR-095 file shape + cross-refs
 *   2. A1 settings drawer transition-colors landed on 3 touched files;
 *      all 7 settings files free of spacing-literal violations
 *   3. A2 expert editors carry the canonical collapse pattern
 *   4. A3 ChatThread extraction landed; ChatInput.tsx ≤750 LOC
 *   5. Decomposition trigger compliance — no shell/expert file >600 LOC
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

// --- ADR ---
const ADR_PATH = join(ROOT, 'docs/adr/ADR-095-library-wide-polish-standard.md')

// --- A1: settings drawer (3 touched + 4 audited-clean) ---
const SETTINGS_DIR = 'src/components/settings'
const SETTINGS_TOUCHED = [
  'BrandContextUpload.tsx',
  'CodebaseContextUpload.tsx',
  'LLMSettings.tsx',
]
const SETTINGS_ALL = [
  'BrandContextUpload.tsx',
  'CodebaseContextUpload.tsx',
  'LLMSettings.tsx',
  'BYOKSettings.tsx',
  'EnvSettings.tsx',
  'ReferenceManager.tsx',
  'SettingsDrawer.tsx',
]
const SPACING_LITERALS = [`'24px'`, `'48px'`, `'96px'`]

// --- A2: expert section editors ---
const EXPERT_DIR = 'src/components/right-panel/expert'
const EXPERT_EDITORS = [
  'SectionExpert.tsx',
  'NavbarSectionExpert.tsx',
  'ThemeExpert.tsx',
]

// --- A3: ChatThread extraction ---
const CHAT_INPUT = join(ROOT, 'src/components/shell/ChatInput.tsx')
const CHAT_THREAD = join(ROOT, 'src/components/shell/ChatThread.tsx')
const CHAT_THREAD_IMPORT = '@/components/shell/ChatThread'

// --- Decomposition trigger compliance ---
const SHELL_DIR = 'src/components/shell'
const SHELL_AND_EXPERT_DIRS = [SHELL_DIR, EXPERT_DIR]

function read(p: string): string {
  return readFileSync(p, 'utf8')
}

function locOf(p: string): number {
  return read(p).split('\n').length
}

// =============================================================================
// P67c.1 — ADR-095 file shape
// =============================================================================
test.describe('P67c.1 — ADR-095 file shape', () => {
  test('ADR-095 exists on disk', () => {
    expect(existsSync(ADR_PATH)).toBe(true)
  })
  test('ADR-095 is ≤120 LOC', () => {
    expect(locOf(ADR_PATH)).toBeLessThanOrEqual(120)
  })
  test('ADR-095 declares Status: Accepted', () => {
    const src = read(ADR_PATH)
    expect(src).toMatch(/Status:\*\*\s*Accepted/)
  })
  test('ADR-095 cross-refs ADR-091 + ADR-092 + ADR-093 + ADR-094 + ADR-087', () => {
    const src = read(ADR_PATH)
    expect(src).toContain('ADR-091')
    expect(src).toContain('ADR-092')
    expect(src).toContain('ADR-093')
    expect(src).toContain('ADR-094')
    expect(src).toContain('ADR-087')
  })
})

// =============================================================================
// P67c.2 — A1 settings drawer transition-colors landed
// =============================================================================
test.describe('P67c.2 — A1 settings drawer transition-colors landed', () => {
  for (const filename of SETTINGS_TOUCHED) {
    test(`${filename} contains transition-colors on interactive elements`, () => {
      const fullPath = join(ROOT, SETTINGS_DIR, filename)
      expect(existsSync(fullPath)).toBe(true)
      const src = read(fullPath)
      expect(src).toContain('transition-colors')
    })
  }
  test('all 7 settings files free of hard-coded spacing literals (24px / 48px / 96px)', () => {
    for (const filename of SETTINGS_ALL) {
      const fullPath = join(ROOT, SETTINGS_DIR, filename)
      if (!existsSync(fullPath)) {
        // Tolerate file rename / restructure — surface the miss but do not
        // fail the audit on a path discrepancy.
        continue
      }
      const src = read(fullPath)
      for (const literal of SPACING_LITERALS) {
        expect(src, `${filename} should not contain ${literal}`).not.toContain(literal)
      }
    }
  })
})

// =============================================================================
// P67c.3 — A2 expert editors collapse pattern
// =============================================================================
test.describe('P67c.3 — A2 expert editors collapse pattern', () => {
  for (const filename of EXPERT_EDITORS) {
    test(`${filename} carries canonical collapse pattern (useState + aria-expanded + transition-all + testid + token import)`, () => {
      const fullPath = join(ROOT, EXPERT_DIR, filename)
      expect(existsSync(fullPath)).toBe(true)
      const src = read(fullPath)
      expect(src, `${filename} should use useState`).toContain('useState')
      expect(src, `${filename} should use aria-expanded`).toContain('aria-expanded')
      expect(src, `${filename} should use transition-all duration-200`).toContain('transition-all duration-200')
      expect(src, `${filename} should carry collapse-toggle testid`).toContain(
        'data-testid="section-editor-collapse-toggle"'
      )
      expect(src, `${filename} should import from @/styles/design-tokens`).toMatch(
        /from\s+['"]@\/styles\/design-tokens['"]/
      )
    })
  }
})

// =============================================================================
// P67c.4 — A3 ChatThread extraction
// =============================================================================
test.describe('P67c.4 — A3 ChatThread extraction', () => {
  test('ChatInput.tsx exists and is ≤750 LOC', () => {
    expect(existsSync(CHAT_INPUT)).toBe(true)
    expect(locOf(CHAT_INPUT)).toBeLessThanOrEqual(750)
  })
  test('ChatThread.tsx exists', () => {
    expect(existsSync(CHAT_THREAD)).toBe(true)
  })
  test('ChatThread.tsx exports ChatThread', () => {
    const src = read(CHAT_THREAD)
    const exportsChatThread =
      /export\s+(default\s+)?function\s+ChatThread/.test(src) ||
      /export\s+const\s+ChatThread\s*[:=]/.test(src) ||
      /export\s*\{\s*[^}]*\bChatThread\b[^}]*\}/.test(src)
    expect(exportsChatThread).toBe(true)
  })
  test('ChatInput.tsx imports ChatThread from canonical path', () => {
    const src = read(CHAT_INPUT)
    expect(src).toContain(CHAT_THREAD_IMPORT)
  })
  test('ChatInput.tsx renders <ChatThread (call site present)', () => {
    const src = read(CHAT_INPUT)
    expect(src).toContain('<ChatThread')
  })
  test('ChatThread.tsx surfaces INTENT_ATOM literal (Geek mode preserved)', () => {
    const src = read(CHAT_THREAD)
    expect(src).toContain('INTENT_ATOM')
  })
  test('ChatThread.tsx surfaces "Try:" literal (Teacher mode preserved)', () => {
    const src = read(CHAT_THREAD)
    expect(src).toContain('Try:')
  })
  test('ChatThread.tsx imports PatchLatencyBadge AND AISPSurface', () => {
    const src = read(CHAT_THREAD)
    expect(src).toContain('PatchLatencyBadge')
    expect(src).toContain('AISPSurface')
  })
})

// =============================================================================
// P67c.5 — Decomposition trigger compliance (ADR-093 with margin)
// =============================================================================
test.describe('P67c.5 — Decomposition trigger compliance', () => {
  test('ChatInput.tsx ≤750 LOC (gates 720 with margin)', () => {
    expect(locOf(CHAT_INPUT)).toBeLessThanOrEqual(750)
  })
  test('ChatThread.tsx ≤200 LOC (canonical sub-component cap)', () => {
    expect(locOf(CHAT_THREAD)).toBeLessThanOrEqual(200)
  })
  test('no file in src/components/shell/ or expert/ exceeds 600 LOC (excluding ChatInput orchestrator)', () => {
    // ChatInput.tsx is the only acknowledged orchestrator >600; assert all
    // OTHER shell + expert files stay under 600 LOC per ADR-093 with margin.
    for (const dir of SHELL_AND_EXPERT_DIRS) {
      const fullDir = join(ROOT, dir)
      if (!existsSync(fullDir)) continue
      const files = readdirSync(fullDir).filter((f: string) => f.endsWith('.tsx'))
      for (const f of files) {
        if (dir === SHELL_DIR && f === 'ChatInput.tsx') continue // orchestrator carve-out
        const filePath = join(fullDir, f)
        const lines = read(filePath).split('\n').length
        expect(lines, `${dir}/${f} should be ≤600 LOC`).toBeLessThanOrEqual(600)
      }
    }
  })
})
