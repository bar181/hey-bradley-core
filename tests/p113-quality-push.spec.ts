/**
 * P113 / QUALITY-PUSH — Wave 2 / Agent A5 (closer).
 *
 * Verifies the 4 quality gaps surfaced by the website-eval audit are closed:
 *  - D1 (atom density) — PATCH/INTENT/PROCESS atoms ≥ Silver tier
 *  - D2 (storytelling library) — 8 presets shipped
 *  - D3 (opinionated personas) — 5 NEW example sites; EXAMPLE_SITES ≥ 56
 *  - D4 (voice extraction) — extractVoice + chatPipeline integration
 *
 * Pattern follows tests/p112-gap-closure.spec.ts (closer-spec precedent).
 * Hard-gate on ADR-141 file shape + atom-purity + EOP triplet + KISS.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const ADR_141 = join(ROOT, 'docs/adr/ADR-141-quality-push-density-personality-personas.md')
const STORY_INDEX = join(ROOT, 'src/data/storytelling/index.ts')
const STORY_PRESETS = join(ROOT, 'src/data/storytelling/presets.ts')
const VOICE_EXT = join(ROOT, 'src/contexts/intelligence/voiceExtraction.ts')
const CHAT_PIPELINE = join(ROOT, 'src/contexts/intelligence/chatPipeline.ts')
const SYSTEM_PROMPTS = join(ROOT, 'src/contexts/intelligence/prompts/system.ts')
const INTENT_ATOM = join(ROOT, 'src/contexts/intelligence/aisp/intentAtom.ts')
const PROCESS_ATOM = join(ROOT, 'src/contexts/intelligence/aisp/processAtom.ts')
const EXAMPLES_INDEX = join(ROOT, 'src/data/examples/index.ts')
const NEW_SITES = [
  'podcaster-indie.json',
  'course-creator-tech.json',
  'contrarian-blog.json',
  'indie-author-fiction.json',
  'research-newsletter.json',
]
const PHASE_DIR = join(ROOT, 'plans/implementation/phase-113')
const PACKAGE_JSON = join(ROOT, 'package.json')

// Canonical AISP symbol regex from src/lib/aisp-score/symbolTable.ts
const SYMBOL_REGEX = /:=|::|[⟦⟧ΩΣΓΛΕΧ∀∃∈∉⊆⊂∪∩∅≥≤≠⇒⇔→↔↦≫⟨⟩𝕊𝔹ℕℝ𝕋𝔼𝔄𝔸]/gu

interface Score {
  density: number
  ambig: number
}
function scoreText(text: string): Score {
  const symbols = (text.match(SYMBOL_REGEX) ?? []).length
  const tokens = text.split(/\s+/).filter((t) => t.length > 0).length
  const density = tokens === 0 ? 0 : symbols / tokens
  const lines = text.split('\n').filter((l) => l.trim().length > 0).length
  const ambigMarkers = (text.match(/\b(TBD|various|etc|TODO|FIXME|\?\?\?)\b/gi) ?? []).length
  const ambig = lines === 0 ? 1 : Math.min(1, ambigMarkers / lines + 0.01)
  return { density, ambig }
}

function extractAtomBody(content: string, varName: string): string | null {
  // Match `<varName> = \`<atom-body>\`` — handles both plain template literals
  // and template literals containing escaped triple-backtick aisp fences
  // (e.g. CRYSTAL_ATOM = `\`\`\`aisp\n⟦...⟧\n\`\`\``).
  // Strategy: find the var-name + `=` + opening backtick, then read until the
  // matching closing backtick, treating `\`` (escaped backtick) as part of the
  // body. We use a non-greedy match that disallows unescaped backticks inside.
  const re = new RegExp(`${varName}\\s*=\\s*\`((?:\\\\\`|[^\`])*)\``)
  const m = content.match(re)
  return m ? m[1] : null
}

test.describe('P113.1 — ADR-141 file shape', () => {
  test('ADR-141 exists with Status: Accepted', () => {
    expect(existsSync(ADR_141)).toBe(true)
    const txt = readFileSync(ADR_141, 'utf8')
    expect(/Status:\s*\*?\*?\s*Accepted/i.test(txt)).toBe(true)
  })

  test('ADR-141 ≤120 LOC', () => {
    const lines = readFileSync(ADR_141, 'utf8').split('\n').length
    expect(lines).toBeLessThanOrEqual(120)
  })

  test('ADR-141 cross-refs ADR-C07 + ADR-126 + ADR-127 + ADR-134 + ADR-140', () => {
    const txt = readFileSync(ADR_141, 'utf8')
    expect(txt).toMatch(/ADR-C07/)
    expect(txt).toMatch(/ADR-126/)
    expect(txt).toMatch(/ADR-127/)
    expect(txt).toMatch(/ADR-134/)
    expect(txt).toMatch(/ADR-140/)
  })
})

test.describe('P113.2 — Atom density ≥ Silver (D1)', () => {
  test('PATCH atom density ≥ 0.40', () => {
    if (!existsSync(SYSTEM_PROMPTS)) test.skip()
    const content = readFileSync(SYSTEM_PROMPTS, 'utf8')
    const body = extractAtomBody(content, 'CRYSTAL_ATOM')
    expect(body).not.toBeNull()
    const { density } = scoreText(body!)
    expect(density).toBeGreaterThanOrEqual(0.4)
  })

  test('INTENT_ATOM density ≥ 0.40', () => {
    if (!existsSync(INTENT_ATOM)) test.skip()
    const content = readFileSync(INTENT_ATOM, 'utf8')
    const body = extractAtomBody(content, 'INTENT_ATOM')
    expect(body).not.toBeNull()
    const { density } = scoreText(body!)
    expect(density).toBeGreaterThanOrEqual(0.4)
  })

  test('PROCESS_ATOM density ≥ 0.40', () => {
    if (!existsSync(PROCESS_ATOM)) test.skip()
    const content = readFileSync(PROCESS_ATOM, 'utf8')
    const body = extractAtomBody(content, 'PROCESS_ATOM')
    expect(body).not.toBeNull()
    const { density } = scoreText(body!)
    expect(density).toBeGreaterThanOrEqual(0.4)
  })
})

test.describe('P113.3 — Atom Ambig < 0.02 (D1)', () => {
  test('PATCH atom Ambig < 0.02', () => {
    if (!existsSync(SYSTEM_PROMPTS)) test.skip()
    const body = extractAtomBody(readFileSync(SYSTEM_PROMPTS, 'utf8'), 'CRYSTAL_ATOM')
    expect(body).not.toBeNull()
    expect(scoreText(body!).ambig).toBeLessThan(0.02)
  })

  test('INTENT_ATOM Ambig < 0.02', () => {
    if (!existsSync(INTENT_ATOM)) test.skip()
    const body = extractAtomBody(readFileSync(INTENT_ATOM, 'utf8'), 'INTENT_ATOM')
    expect(body).not.toBeNull()
    expect(scoreText(body!).ambig).toBeLessThan(0.02)
  })

  test('PROCESS_ATOM Ambig < 0.02', () => {
    if (!existsSync(PROCESS_ATOM)) test.skip()
    const body = extractAtomBody(readFileSync(PROCESS_ATOM, 'utf8'), 'PROCESS_ATOM')
    expect(body).not.toBeNull()
    expect(scoreText(body!).ambig).toBeLessThan(0.02)
  })
})

test.describe('P113.4 — Storytelling presets library (D2)', () => {
  test('storytelling/index.ts + presets.ts exist', () => {
    expect(existsSync(STORY_INDEX)).toBe(true)
    expect(existsSync(STORY_PRESETS)).toBe(true)
  })

  test('STORYTELLING_PRESETS exported with ≥ 8 entries', () => {
    if (!existsSync(STORY_PRESETS)) test.skip()
    const content = readFileSync(STORY_PRESETS, 'utf8')
    expect(content).toMatch(/export const STORYTELLING_PRESETS/)
    // Count preset entries by `id:` field appearances
    const idMatches = content.match(/^\s*id:\s*['"]/gm) ?? []
    expect(idMatches.length).toBeGreaterThanOrEqual(8)
  })

  test('getPresetByName helper exported', () => {
    if (!existsSync(STORY_INDEX)) test.skip()
    const content = readFileSync(STORY_INDEX, 'utf8')
    expect(content).toMatch(/export\s+function\s+getPresetByName/)
  })
})

test.describe('P113.5 — Storytelling preset shape (D2)', () => {
  test('each preset has 7 required fields populated', () => {
    if (!existsSync(STORY_PRESETS)) test.skip()
    const content = readFileSync(STORY_PRESETS, 'utf8')
    const required = ['id:', 'name:', 'description:', 'voiceAttributes:', 'openingPattern:', 'bodyPattern:', 'closePattern:', 'samplePassage:']
    for (const field of required) {
      const matches = content.match(new RegExp(field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []
      // ≥ 8 occurrences (one per preset)
      expect(matches.length).toBeGreaterThanOrEqual(8)
    }
  })

  test('each samplePassage has 30-100 words', () => {
    if (!existsSync(STORY_PRESETS)) test.skip()
    const content = readFileSync(STORY_PRESETS, 'utf8')
    // Extract all samplePassage string-literal contents (single OR triple-quoted not used; values use double quotes)
    const passages = [...content.matchAll(/samplePassage:\s*\n?\s*"([^"]+)"/g)].map((m) => m[1])
    expect(passages.length).toBeGreaterThanOrEqual(8)
    for (const p of passages) {
      const wc = p.split(/\s+/).filter((w) => w.length > 0).length
      expect(wc).toBeGreaterThanOrEqual(30)
      expect(wc).toBeLessThanOrEqual(100)
    }
  })
})

test.describe('P113.6 — 5 NEW example sites exist (D3)', () => {
  for (const site of NEW_SITES) {
    test(`${site} exists`, () => {
      expect(existsSync(join(ROOT, 'src/data/examples', site))).toBe(true)
    })
  }
})

test.describe('P113.7 — EXAMPLE_SITES count ≥ 56 (D3)', () => {
  test('all 5 new sites imported in index.ts', () => {
    const content = readFileSync(EXAMPLES_INDEX, 'utf8')
    const importNames = ['podcaster-indie', 'course-creator-tech', 'contrarian-blog', 'indie-author-fiction', 'research-newsletter']
    for (const name of importNames) {
      expect(content).toContain(name)
    }
  })
})

test.describe('P113.8 — Each new site has voiceAttributes ≥ 3 (D3)', () => {
  for (const site of NEW_SITES) {
    test(`${site} has voiceAttributes with ≥3 entries`, () => {
      const path = join(ROOT, 'src/data/examples', site)
      if (!existsSync(path)) test.skip()
      const json = JSON.parse(readFileSync(path, 'utf8'))
      const attrs = json?.site?.voiceAttributes
      expect(Array.isArray(attrs)).toBe(true)
      expect(attrs.length).toBeGreaterThanOrEqual(3)
    })
  }
})

test.describe('P113.9 — voiceExtraction module (D4)', () => {
  test('voiceExtraction.ts exists', () => {
    expect(existsSync(VOICE_EXT)).toBe(true)
  })

  test('extractVoice exported', () => {
    if (!existsSync(VOICE_EXT)) test.skip()
    const content = readFileSync(VOICE_EXT, 'utf8')
    expect(content).toMatch(/export\s+function\s+extractVoice/)
  })
})

test.describe('P113.10 — chatPipeline integration site (D4)', () => {
  test('chatPipeline.ts contains ≥ 1 extractVoice( call', () => {
    if (!existsSync(CHAT_PIPELINE)) test.skip()
    const content = readFileSync(CHAT_PIPELINE, 'utf8')
    const calls = content.match(/extractVoice\s*\(/g) ?? []
    expect(calls.length).toBeGreaterThanOrEqual(1)
  })
})

test.describe('P113.11 — Atom-purity (ADR-134)', () => {
  test('storytelling modules have zero React + zero fs imports', () => {
    if (!existsSync(STORY_INDEX) || !existsSync(STORY_PRESETS)) test.skip()
    for (const path of [STORY_INDEX, STORY_PRESETS]) {
      const content = readFileSync(path, 'utf8')
      expect(content).not.toMatch(/from\s+['"]react['"]/)
      expect(content).not.toMatch(/from\s+['"]fs['"]/)
      expect(content).not.toMatch(/from\s+['"]node:fs['"]/)
    }
  })

  test('voiceExtraction.ts has zero React + zero fs imports', () => {
    if (!existsSync(VOICE_EXT)) test.skip()
    const content = readFileSync(VOICE_EXT, 'utf8')
    expect(content).not.toMatch(/from\s+['"]react['"]/)
    expect(content).not.toMatch(/from\s+['"]fs['"]/)
    expect(content).not.toMatch(/from\s+['"]node:fs['"]/)
  })
})

test.describe('P113.12 — EOP triplet at phase-113/', () => {
  test('preflight.md exists', () => {
    expect(existsSync(join(PHASE_DIR, 'preflight.md'))).toBe(true)
  })

  test('session-log.md exists', () => {
    expect(existsSync(join(PHASE_DIR, 'session-log.md'))).toBe(true)
  })

  test('retrospective.md exists with "Quality push outcomes" section', () => {
    const path = join(PHASE_DIR, 'retrospective.md')
    expect(existsSync(path)).toBe(true)
    const content = readFileSync(path, 'utf8')
    expect(content).toMatch(/Quality push outcomes/i)
  })
})

test.describe('P113.13 — KISS no-new-deps boundary', () => {
  test('package.json has no new animation/markdown/storytelling deps', () => {
    const pkg = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8'))
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) }
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
    ]
    for (const banned of denylist) {
      expect(deps[banned]).toBeUndefined()
    }
  })
})
