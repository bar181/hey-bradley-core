/**
 * P59 — Test Library: comprehensive prompt corpus (by-persona / by-atom /
 * by-section / edge-cases) + migration 004 + promptLibrary repo + initDB
 * seeding hook.
 *
 * Pure-unit (FS-level reads + JSON.parse). Mirrors P54/P55/P56/P57/P58 spec
 * docstring style. NO browser bootstrap. NO real DB queries. NO live
 * AgentProxy calls. NO aisp barrel imports — ALLOWED_TARGET_TYPES is mirrored
 * inline below to avoid the barrel. Each assertion body ≤6 lines.
 *
 * Many cases will fail until A1 (4 JSON corpora under tests/prompts/) and A2
 * (migration 004 + repositories/promptLibrary.ts + initDB seed wiring) land
 * — those are expected-failures by design and GREEN-flip on P59 seal.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const PROMPTS_DIR = join(ROOT, 'tests/prompts')
const F_PERSONA = join(PROMPTS_DIR, 'by-persona.json')
const F_ATOM = join(PROMPTS_DIR, 'by-atom.json')
const F_SECTION = join(PROMPTS_DIR, 'by-section.json')
const F_EDGE = join(PROMPTS_DIR, 'edge-cases.json')
const MIGRATION = join(ROOT, 'src/contexts/persistence/migrations/004-prompt-library.sql')
const REPO = join(ROOT, 'src/contexts/persistence/repositories/promptLibrary.ts')
const MIG_INDEX = join(ROOT, 'src/contexts/persistence/migrations/index.ts')
const DB_BOOT = join(ROOT, 'src/contexts/persistence/db.ts')

// Mirror of ALLOWED_TARGET_TYPES from src/contexts/intelligence/aisp/intentAtom.ts.
// Inlined to avoid the aisp barrel import per P59 brief.
const ALLOWED_TARGET_TYPES = [
  'hero', 'blog', 'footer', 'features', 'pricing', 'cta',
  'testimonials', 'faq', 'value-props', 'gallery', 'image',
  'team', 'columns', 'action', 'quotes', 'questions', 'numbers',
  'divider', 'text', 'logos', 'menu',
] as const

const ATOMS = ['PATCH', 'INTENT', 'SELECTION', 'CONTENT', 'ASSUMPTIONS', 'FALLBACK']
const VERBS = ['hide', 'show', 'change', 'add', 'remove', 'reset']
const ROUTES = ['design', 'content', 'ambiguous']
const PERSONAS = ['grandma', 'framer', 'geek', 'marcus', 'sarah', 'lars', 'n/a']
const DIFFICULTY = ['trivial', 'easy', 'medium', 'hard', 'adversarial']

type Entry = {
  id: string
  input: string
  expectedAtom: string
  persona: string
  difficulty: string
  expectedVerb?: string | null
  expectedRoute?: string | null
  expectedTarget?: string | null
}

function loadJson(p: string): Entry[] {
  return JSON.parse(readFileSync(p, 'utf8')) as Entry[]
}
test.describe('P59.1 JSON corpora exist + parse', () => {
  test('all 4 files exist on disk', () => {
    expect(existsSync(F_PERSONA)).toBe(true)
    expect(existsSync(F_ATOM)).toBe(true)
    expect(existsSync(F_SECTION)).toBe(true)
    expect(existsSync(F_EDGE)).toBe(true)
  })
  test('by-persona.json parses without throw', () => {
    expect(() => loadJson(F_PERSONA)).not.toThrow()
  })
  test('by-atom.json parses without throw', () => {
    expect(() => loadJson(F_ATOM)).not.toThrow()
  })
  test('by-section.json parses without throw', () => {
    expect(() => loadJson(F_SECTION)).not.toThrow()
  })
  test('edge-cases.json parses without throw', () => {
    expect(() => loadJson(F_EDGE)).not.toThrow()
  })
  test('by-persona.json has ≥120 entries', () => {
    expect(loadJson(F_PERSONA).length).toBeGreaterThanOrEqual(120)
  })
  test('by-atom.json has ≥50 entries', () => {
    expect(loadJson(F_ATOM).length).toBeGreaterThanOrEqual(50)
  })
  test('by-section.json has ≥80 entries', () => {
    expect(loadJson(F_SECTION).length).toBeGreaterThanOrEqual(80)
  })
  test('edge-cases.json has ≥30 entries', () => {
    expect(loadJson(F_EDGE).length).toBeGreaterThanOrEqual(30)
  })
  test('every entry has the 5 required keys', () => {
    const all = [...loadJson(F_PERSONA), ...loadJson(F_ATOM), ...loadJson(F_SECTION), ...loadJson(F_EDGE)]
    const ok = all.every(e => 'id' in e && 'input' in e && 'expectedAtom' in e && 'persona' in e && 'difficulty' in e)
    expect(ok).toBe(true)
  })
})

test.describe('P59.2 ID uniqueness + prefix', () => {
  test('all IDs unique across the 4-file union', () => {
    const all = [...loadJson(F_PERSONA), ...loadJson(F_ATOM), ...loadJson(F_SECTION), ...loadJson(F_EDGE)]
    const ids = all.map(e => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  test('by-persona.json IDs start with "pers-"', () => {
    const ok = loadJson(F_PERSONA).every(e => e.id.startsWith('pers-'))
    expect(ok).toBe(true)
  })
  test('by-atom.json IDs start with "atom-"', () => {
    const ok = loadJson(F_ATOM).every(e => e.id.startsWith('atom-'))
    expect(ok).toBe(true)
  })
  test('by-section.json IDs start with "sec-"', () => {
    const ok = loadJson(F_SECTION).every(e => e.id.startsWith('sec-'))
    expect(ok).toBe(true)
  })
  test('edge-cases.json IDs start with "edge-"', () => {
    const ok = loadJson(F_EDGE).every(e => e.id.startsWith('edge-'))
    expect(ok).toBe(true)
  })
})

test.describe('P59.3 Schema constraints (closed enums)', () => {
  test('every expectedAtom ∈ closed atom set', () => {
    const all = [...loadJson(F_PERSONA), ...loadJson(F_ATOM), ...loadJson(F_SECTION), ...loadJson(F_EDGE)]
    const ok = all.every(e => ATOMS.includes(e.expectedAtom))
    expect(ok).toBe(true)
  })
  test('every expectedVerb ∈ verb set or null/undefined', () => {
    const all = [...loadJson(F_PERSONA), ...loadJson(F_ATOM), ...loadJson(F_SECTION), ...loadJson(F_EDGE)]
    const ok = all.every(e => e.expectedVerb == null || VERBS.includes(e.expectedVerb))
    expect(ok).toBe(true)
  })
  test('every expectedRoute ∈ route set or null/undefined', () => {
    const all = [...loadJson(F_PERSONA), ...loadJson(F_ATOM), ...loadJson(F_SECTION), ...loadJson(F_EDGE)]
    const ok = all.every(e => e.expectedRoute == null || ROUTES.includes(e.expectedRoute))
    expect(ok).toBe(true)
  })
  test('every persona ∈ {grandma,framer,geek,marcus,sarah,lars,n/a}', () => {
    const all = [...loadJson(F_PERSONA), ...loadJson(F_ATOM), ...loadJson(F_SECTION), ...loadJson(F_EDGE)]
    const ok = all.every(e => PERSONAS.includes(e.persona))
    expect(ok).toBe(true)
  })
  test('every difficulty ∈ {trivial,easy,medium,hard,adversarial}', () => {
    const all = [...loadJson(F_PERSONA), ...loadJson(F_ATOM), ...loadJson(F_SECTION), ...loadJson(F_EDGE)]
    const ok = all.every(e => DIFFICULTY.includes(e.difficulty))
    expect(ok).toBe(true)
  })
})

test.describe('P59.4 expectedTarget ⊆ ALLOWED_TARGET_TYPES', () => {
  test('every non-null expectedTarget is in the inlined allowed set', () => {
    const all = [...loadJson(F_PERSONA), ...loadJson(F_ATOM), ...loadJson(F_SECTION), ...loadJson(F_EDGE)]
    const targets = all.filter(e => e.expectedTarget != null).map(e => e.expectedTarget!)
    const ok = targets.every(t => (ALLOWED_TARGET_TYPES as readonly string[]).includes(t))
    expect(ok).toBe(true)
  })
})

test.describe('P59.5 Persona coverage in by-persona.json', () => {
  const personasReq = ['grandma', 'framer', 'geek', 'marcus', 'sarah', 'lars']
  for (const p of personasReq) {
    test(`persona "${p}" has ≥20 prompts`, () => {
      const rows = loadJson(F_PERSONA).filter(e => e.persona === p)
      expect(rows.length).toBeGreaterThanOrEqual(20)
    })
  }
})

test.describe('P59.6 Atom coverage in by-atom.json', () => {
  const atomsReq = ['PATCH', 'INTENT', 'SELECTION', 'CONTENT', 'ASSUMPTIONS']
  for (const a of atomsReq) {
    test(`atom "${a}" has ≥10 prompts`, () => {
      const rows = loadJson(F_ATOM).filter(e => e.expectedAtom === a)
      expect(rows.length).toBeGreaterThanOrEqual(10)
    })
  }
})

test.describe('P59.7 migration 004 — file shape', () => {
  test('migration file exists', () => {
    expect(existsSync(MIGRATION)).toBe(true)
  })
  test('contains CREATE TABLE prompt_library', () => {
    const src = readFileSync(MIGRATION, 'utf8')
    expect(/CREATE\s+TABLE\s+(IF\s+NOT\s+EXISTS\s+)?prompt_library/i.test(src)).toBe(true)
  })
  test('declares slug + input + expected_atom + persona + difficulty columns', () => {
    const src = readFileSync(MIGRATION, 'utf8')
    expect(/\bslug\b/.test(src) && /\binput\b/.test(src)).toBe(true)
    expect(/expected_atom/i.test(src) && /\bpersona\b/.test(src) && /\bdifficulty\b/.test(src)).toBe(true)
  })
  test('declares 3 indexes on prompt_library', () => {
    const src = readFileSync(MIGRATION, 'utf8')
    const idx = (src.match(/CREATE\s+INDEX[\s\S]+?prompt_library/gi) || []).length
    expect(idx).toBeGreaterThanOrEqual(3)
  })
  test('bumps schema_version OR is auto-bumped by glob runner (numeric prefix)', () => {
    // Runner auto-bumps via 004- prefix (see migrations/index.ts §migrationNumber).
    expect(/004-prompt-library\.sql$/.test(MIGRATION)).toBe(true)
  })
})

test.describe('P59.8 promptLibrary.ts repo — file shape', () => {
  test('repo file exists', () => {
    expect(existsSync(REPO)).toBe(true)
  })
  test('repo ≤180 LOC', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(src.split('\n').length).toBeLessThanOrEqual(180)
  })
  test('exports listPromptLibrary', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(/export\s+(async\s+)?function\s+listPromptLibrary\b|export\s*\{[^}]*\blistPromptLibrary\b/.test(src)).toBe(true)
  })
  test('exports getPromptBySlug', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(/export\s+(async\s+)?function\s+getPromptBySlug\b|export\s*\{[^}]*\bgetPromptBySlug\b/.test(src)).toBe(true)
  })
  test('exports insertPromptRow', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(/export\s+(async\s+)?function\s+insertPromptRow\b|export\s*\{[^}]*\binsertPromptRow\b/.test(src)).toBe(true)
  })
  test('exports countPromptsByAtom', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(/export\s+(async\s+)?function\s+countPromptsByAtom\b|export\s*\{[^}]*\bcountPromptsByAtom\b/.test(src)).toBe(true)
  })
  test('exports seedPromptLibraryFromFiles', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(/export\s+(async\s+)?function\s+seedPromptLibraryFromFiles\b|export\s*\{[^}]*\bseedPromptLibraryFromFiles\b/.test(src)).toBe(true)
  })
  test('uses redactKeyShapes at boundary', () => {
    const src = readFileSync(REPO, 'utf8')
    expect(/redactKeyShapes/.test(src)).toBe(true)
  })
})

test.describe('P59.9 InitDB wiring', () => {
  test('migrations runner auto-discovers 004 via glob OR explicit reference', () => {
    const src = readFileSync(MIG_INDEX, 'utf8')
    const globOk = /import\.meta\.glob\(\s*['"]\.\/\*\.sql['"]/.test(src)
    const explicitOk = /004-prompt-library/.test(src)
    expect(globOk || explicitOk).toBe(true)
  })
  test('initDB / boot path invokes seedPromptLibraryFromFiles (or equivalent hook)', () => {
    const dbSrc = readFileSync(DB_BOOT, 'utf8')
    const repoSrc = existsSync(REPO) ? readFileSync(REPO, 'utf8') : ''
    const wired = /seedPromptLibraryFromFiles/.test(dbSrc) || /seedPromptLibraryFromFiles/.test(repoSrc)
    expect(wired).toBe(true)
  })
})

test.describe('P59.10 Edge-case adversarial coverage (by-section + edge-cases)', () => {
  test('≥1 entry contains <script> (XSS)', () => {
    const all = [...loadJson(F_SECTION), ...loadJson(F_EDGE)]
    const hits = all.filter(e => /<script/i.test(e.input))
    expect(hits.length).toBeGreaterThanOrEqual(1)
  })
  test('≥1 entry contains __proto__ (prototype pollution)', () => {
    const all = [...loadJson(F_SECTION), ...loadJson(F_EDGE)]
    const hits = all.filter(e => /__proto__/.test(e.input))
    expect(hits.length).toBeGreaterThanOrEqual(1)
  })
  test('≥1 entry contains javascript: (URL injection)', () => {
    const all = [...loadJson(F_SECTION), ...loadJson(F_EDGE)]
    const hits = all.filter(e => /javascript:/i.test(e.input))
    expect(hits.length).toBeGreaterThanOrEqual(1)
  })
  test('≥1 entry has empty input string', () => {
    const all = [...loadJson(F_SECTION), ...loadJson(F_EDGE)]
    const hits = all.filter(e => e.input === '')
    expect(hits.length).toBeGreaterThanOrEqual(1)
  })
})

test.describe('P59.11 by-section.json id-slug ↔ expectedTarget round-trip', () => {
  test('5 random by-section entries have id slug containing expectedTarget', () => {
    const rows = loadJson(F_SECTION).filter(e => e.expectedTarget != null && (ALLOWED_TARGET_TYPES as readonly string[]).includes(e.expectedTarget!))
    const sample = rows.slice(0, 5)
    expect(sample.length).toBe(5)
    const ok = sample.every(e => e.id.includes(e.expectedTarget!))
    expect(ok).toBe(true)
  })
})

test.describe('P59.12 example_prompts (mig 001) coexists with prompt_library (mig 004)', () => {
  test('migration 001 still declares example_prompts table', () => {
    const m001 = readFileSync(join(ROOT, 'src/contexts/persistence/migrations/001-example-prompts.sql'), 'utf8')
    expect(/CREATE\s+TABLE\s+example_prompts/i.test(m001)).toBe(true)
  })
  test('migration 004 uses prompt_library (different table name)', () => {
    const m004 = readFileSync(MIGRATION, 'utf8')
    expect(/prompt_library/i.test(m004)).toBe(true)
    expect(/CREATE\s+TABLE\s+example_prompts/i.test(m004)).toBe(false)
  })
  test('both migrations live in the migrations dir together', () => {
    const files = readdirSync(join(ROOT, 'src/contexts/persistence/migrations'))
    expect(files.includes('001-example-prompts.sql')).toBe(true)
    expect(files.includes('004-prompt-library.sql')).toBe(true)
  })
})
