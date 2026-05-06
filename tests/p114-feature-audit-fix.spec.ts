/**
 * P114 / FEATURE-AUDIT + FIX — Wave 3 / Closer.
 *
 * Verifies the 10 P1 fixes shipped by Wave 2 (4 parallel fix agents) close the
 * top findings from the Wave 1 audits (A1 persistence + A2 image+content +
 * A3 BYOK+LLM + A4 quality UX):
 *  - F1 (persistence wire) — saveProject UI callers ≥3 + slug recall + recent-projects card + markSaved
 *  - F2 (image picker + storytelling preset) — 5 simple editors un-hidden + getPresetForVoice wired
 *  - F3 (cost cap correctness) — gpt-5-nano + UNKNOWN_MODEL_FALLBACK + Claude rate sync
 *  - F4 (UX truth-up) — Welcome stats / AISP atoms / ResourcesTab section types
 *
 * Pattern follows tests/p113-quality-push.spec.ts (closer-spec precedent).
 * Hard-gate on ADR-142 file shape + EOP triplet + KISS no-new-deps.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const ADR_142 = join(ROOT, 'docs/adr/ADR-142-feature-audit-fix.md')
const ONBOARDING = join(ROOT, 'src/pages/Onboarding.tsx')
const BUILDER = join(ROOT, 'src/pages/Builder.tsx')
const WELCOME = join(ROOT, 'src/pages/Welcome.tsx')
const AUTOSAVE = join(ROOT, 'src/contexts/persistence/autosave.ts')
const CHAT_PIPELINE = join(ROOT, 'src/contexts/intelligence/chatPipeline.ts')
const MASTER_CONFIG = join(ROOT, 'src/lib/schemas/masterConfig.ts')
const COST_TS = join(ROOT, 'src/contexts/intelligence/llm/cost.ts')
const RESOURCES_TAB = join(ROOT, 'src/components/center-canvas/ResourcesTab.tsx')
const SIMPLE_EDITORS = [
  'BlogSectionSimple.tsx',
  'GallerySectionSimple.tsx',
  'ImageSectionSimple.tsx',
  'LogosSectionSimple.tsx',
  'TeamSectionSimple.tsx',
].map((f) => join(ROOT, 'src/components/right-panel/simple', f))
const PHASE_DIR = join(ROOT, 'plans/implementation/phase-114')
const PACKAGE_JSON = join(ROOT, 'package.json')

test.describe('P114.1 — ADR-142 file shape', () => {
  test('ADR-142 exists with Status: Accepted', () => {
    expect(existsSync(ADR_142)).toBe(true)
    const txt = readFileSync(ADR_142, 'utf8')
    expect(/Status:\s*\*?\*?\s*Accepted/i.test(txt)).toBe(true)
  })

  test('ADR-142 ≤120 LOC', () => {
    const lines = readFileSync(ADR_142, 'utf8').split('\n').length
    expect(lines).toBeLessThanOrEqual(120)
  })

  test('ADR-142 cross-refs ADR-016 + ADR-040 + ADR-043 + ADR-100 + ADR-126 + ADR-127 + ADR-141', () => {
    const txt = readFileSync(ADR_142, 'utf8')
    expect(txt).toMatch(/ADR-016/)
    expect(txt).toMatch(/ADR-040/)
    expect(txt).toMatch(/ADR-043/)
    expect(txt).toMatch(/ADR-100/)
    expect(txt).toMatch(/ADR-126/)
    expect(txt).toMatch(/ADR-127/)
    expect(txt).toMatch(/ADR-141/)
  })
})

test.describe('P114.2 — saveProject() UI callers (D1 / F1)', () => {
  test('Onboarding.tsx has ≥3 saveProject( calls', () => {
    if (!existsSync(ONBOARDING)) test.skip()
    const content = readFileSync(ONBOARDING, 'utf8')
    const calls = content.match(/saveProject\s*\(/g) ?? []
    expect(calls.length).toBeGreaterThanOrEqual(3)
  })
})

test.describe('P114.3 — markSaved() integration in autosave (D1 / F1)', () => {
  test('autosave.ts has ≥1 markSaved( call', () => {
    if (!existsSync(AUTOSAVE)) test.skip()
    const content = readFileSync(AUTOSAVE, 'utf8')
    const calls = content.match(/markSaved\s*\(/g) ?? []
    expect(calls.length).toBeGreaterThanOrEqual(1)
  })
})

test.describe('P114.4 — Builder slug recall (D1 / F1)', () => {
  test('Builder.tsx reads ?project= and calls loadProject(', () => {
    if (!existsSync(BUILDER)) test.skip()
    const content = readFileSync(BUILDER, 'utf8')
    expect(content).toMatch(/searchParams\.get\(['"]project['"]\)/)
    expect(content).toMatch(/loadProject\s*\(/)
  })
})

test.describe('P114.5 — Welcome recent-projects card (D1 / F1)', () => {
  test('Welcome.tsx has welcome-recent-projects testid', () => {
    if (!existsSync(WELCOME)) test.skip()
    const content = readFileSync(WELCOME, 'utf8')
    expect(content).toMatch(/data-testid=["']welcome-recent-projects["']/)
  })
})

test.describe('P114.6 — Image picker un-hidden on 5 simple editors (D3 / F2)', () => {
  for (const editor of SIMPLE_EDITORS) {
    const name = editor.split('/').pop()!
    test(`${name} no longer gates ImagePicker behind !isDraft`, () => {
      if (!existsSync(editor)) test.skip()
      const content = readFileSync(editor, 'utf8')
      // The pre-fix gate looked like `!isDraft && <ImagePicker .../>` (or `: null`).
      // Post-fix uses `pickerMode={isDraft ? 'library-only' : 'full'}` instead.
      // Assert: no `!isDraft &&` ... `ImagePicker` pattern remains (allowing
      // multi-line whitespace).
      const banned = /!isDraft\s*&&[\s\S]{0,200}ImagePicker/
      expect(banned.test(content)).toBe(false)
      // Affirmative: ImagePicker is rendered (un-hidden); either branched on
      // isDraft (pickerMode={isDraft ? ...}) OR literal library-only mode.
      expect(content).toMatch(/<ImagePicker/)
      expect(content).toMatch(/pickerMode=(\{isDraft\s*\?|["']library-only["'])/)
    })
  }
})

test.describe('P114.7 — Storytelling preset wire in chatPipeline (D3 / F2)', () => {
  test('chatPipeline.ts imports getPresetForVoice + has ≥1 call', () => {
    if (!existsSync(CHAT_PIPELINE)) test.skip()
    const content = readFileSync(CHAT_PIPELINE, 'utf8')
    expect(content).toMatch(/getPresetForVoice/)
    const calls = content.match(/getPresetForVoice\s*\(/g) ?? []
    expect(calls.length).toBeGreaterThanOrEqual(1)
  })
})

test.describe('P114.8 — masterConfig storytellingPreset field (D3 / F2)', () => {
  test('siteSchema has optional storytellingPreset', () => {
    if (!existsSync(MASTER_CONFIG)) test.skip()
    const content = readFileSync(MASTER_CONFIG, 'utf8')
    expect(content).toMatch(/storytellingPreset:\s*z\.string\(\)\.optional\(\)/)
  })
})

test.describe('P114.9 — cost.ts gpt-5-nano + UNKNOWN_MODEL_FALLBACK (D2 / F3)', () => {
  test('MODEL_COSTS includes gpt-5-nano', () => {
    if (!existsSync(COST_TS)) test.skip()
    const content = readFileSync(COST_TS, 'utf8')
    expect(content).toMatch(/['"]gpt-5-nano['"]/)
  })

  test('UNKNOWN_MODEL_FALLBACK exported with conservative rates', () => {
    if (!existsSync(COST_TS)) test.skip()
    const content = readFileSync(COST_TS, 'utf8')
    expect(content).toMatch(/export\s+const\s+UNKNOWN_MODEL_FALLBACK/)
    // Conservative: in≥1.0, out≥5.0 so no future model silently bypasses cap
    expect(content).toMatch(/UNKNOWN_MODEL_FALLBACK\s*=\s*\{\s*in:\s*1(\.0)?,\s*out:\s*5(\.0)?/)
  })
})

test.describe('P114.10 — Claude rate matches adapter (D2 / F3)', () => {
  test('cost.ts Claude in:1.0 / out:5.0 matches claudeAdapter COST_PER_M', () => {
    if (!existsSync(COST_TS)) test.skip()
    const content = readFileSync(COST_TS, 'utf8')
    // Match: 'claude-haiku-4-5-20251001': { in: 1.0, out: 5.0 } (whitespace-tolerant)
    const claudeLine = content.match(/['"]claude-haiku-4-5-20251001['"]\s*:\s*\{\s*in:\s*([0-9.]+)\s*,\s*out:\s*([0-9.]+)/)
    expect(claudeLine).not.toBeNull()
    expect(parseFloat(claudeLine![1])).toBe(1.0)
    expect(parseFloat(claudeLine![2])).toBe(5.0)
  })
})

test.describe('P114.11 — Welcome stats current to P113 (D4 / F4)', () => {
  test('Welcome.tsx stats include 1582 + 132 + 56', () => {
    if (!existsSync(WELCOME)) test.skip()
    const content = readFileSync(WELCOME, 'utf8')
    expect(content).toMatch(/1582/)
    expect(content).toMatch(/\b132\b/)
    expect(content).toMatch(/\b56\b/)
  })
})

test.describe('P114.12 — Welcome AISP teaser shows full 8-atom suite (D4 / F4)', () => {
  test('Welcome.tsx mentions PROCESS / DDD / AGENT', () => {
    if (!existsSync(WELCOME)) test.skip()
    const content = readFileSync(WELCOME, 'utf8')
    expect(content).toMatch(/PROCESS/)
    expect(content).toMatch(/DDD/)
    expect(content).toMatch(/AGENT/)
  })
})

test.describe('P114.13 — ResourcesTab SECTION_TYPES = 18 (D4 / F4)', () => {
  test('ResourcesTab.tsx SECTION_TYPES has canonical 18 entries', () => {
    if (!existsSync(RESOURCES_TAB)) test.skip()
    const content = readFileSync(RESOURCES_TAB, 'utf8')
    // Affirmative checks for the 3 P75 / ADR-100 additions
    expect(content).toMatch(/type:\s*['"]blog['"]/)
    expect(content).toMatch(/type:\s*['"]case-study['"]/)
    expect(content).toMatch(/type:\s*['"]contact-form['"]/)
    // Count `type:` entries inside the SECTION_TYPES array
    const start = content.indexOf('const SECTION_TYPES = [')
    const end = content.indexOf(']', start)
    expect(start).toBeGreaterThan(-1)
    expect(end).toBeGreaterThan(start)
    const block = content.slice(start, end)
    const typeMatches = block.match(/^\s*\{\s*type:\s*['"]/gm) ?? []
    expect(typeMatches.length).toBe(18)
  })
})

test.describe('P114.14 — EOP triplet at phase-114/', () => {
  test('preflight.md exists', () => {
    expect(existsSync(join(PHASE_DIR, 'preflight.md'))).toBe(true)
  })

  test('session-log.md exists', () => {
    expect(existsSync(join(PHASE_DIR, 'session-log.md'))).toBe(true)
  })

  test('retrospective.md exists with "Audit → Fix loop outcomes" section', () => {
    const path = join(PHASE_DIR, 'retrospective.md')
    expect(existsSync(path)).toBe(true)
    const content = readFileSync(path, 'utf8')
    // Tolerate either em-dash variant (→ U+2192 or "->" plain ASCII)
    expect(/Audit\s*(→|->)\s*Fix\s+loop\s+outcomes/i.test(content)).toBe(true)
  })
})

test.describe('P114.15 — KISS no-new-deps boundary', () => {
  test('package.json has no new animation/markdown/storytelling/persistence deps', () => {
    const pkg = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8'))
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
    // Mirrors P113.13 denylist; no new entries this sprint.
    const denylist = [
      'gsap',
      'lottie-web',
      '@react-spring/web',
      'animejs',
      'archiver',
      'fs-extra',
      'commander',
      'yargs',
      'chalk',
      '@supabase/supabase-js',
      'remark',
      'unified',
      'lowdb',
      'dexie',
      'idb',
    ]
    for (const banned of denylist) {
      expect(deps[banned]).toBeUndefined()
    }
  })
})
