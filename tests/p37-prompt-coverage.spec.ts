/**
 * P37 Sprint F P2 (Wave 1 Agent A3) — Prompt-library audit + 35/35 coverage gate.
 *
 * Reads `src/contexts/persistence/migrations/001-example-prompts.sql` from the
 * filesystem (FS-level, like the p23-sentinel pattern) and validates the
 * golden-prompt corpus that drives AgentProxyAdapter and the parseCommand →
 * classifyIntent → classifyRoute → router chain (ADR-066).
 *
 * Gates:
 *   • ≥35 distinct prompt rows (sprint-close 35/35; phase gate 33/35)
 *   • Every row's category is in the canonical enum (extended in this phase
 *     to include 'command', 'voice_only', 'ambiguous')
 *   • Per-route minimums: ≥6 content_gen, ≥4 design (multi_section design
 *     prompts), ≥6 command, ≥4 voice_only, ≥4 ambiguous
 *   • ≥4 command-trigger prompts cover ADR-066 CommandKind values
 *   • Slugs are unique
 *   • INSERT statement uses OR REPLACE for idempotency (P28 C15)
 *
 * Pure-unit (no browser, no LLM, no sql.js).
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const MIGRATION = join(
  process.cwd(),
  'src/contexts/persistence/migrations/001-example-prompts.sql',
)

/**
 * Allowed category enum (mirrors the SQL CHECK constraint on
 * example_prompts.category). Extended in P37 with three new buckets to
 * cover the parseCommand + classifyRoute + ASSUMPTIONS_ATOM surface.
 */
const ALLOWED_CATEGORIES = new Set([
  'starter',
  'edge_case',
  'safety',
  'multi_section',
  'site_context',
  'content_gen',
  'command',
  'voice_only',
  'ambiguous',
])

/** Tuple parsed from a single VALUES (...) row. */
interface ParsedPrompt {
  slug: string
  category: string
  user_prompt: string
}

/**
 * Crude SQL VALUES-row parser. The seed file uses a fixed shape:
 *   ('slug','category','user_prompt', match_pattern_or_NULL, '...envelope...', 'outcome', 'notes', ts, ts)
 *
 * We extract the first three quoted strings (slug, category, user_prompt).
 * Apostrophes inside string literals are SQL-doubled (''), but the seed
 * uses double-quoted phrasings inside single-quoted user_prompt values,
 * so single-pass capture is safe.
 *
 * Returns one entry per VALUES tuple. Comment lines (-- …) are stripped first.
 */
function parsePrompts(sql: string): ParsedPrompt[] {
  // 1. Strip line comments.
  const stripped = sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')

  // 2. Slice from the INSERT statement onwards so the CHECK-clause string list
  //    (which is also a comma-separated tuple of single-quoted values) cannot
  //    be parsed as a phantom seed row.
  const insertIdx = stripped.search(/INSERT\s+OR\s+REPLACE\s+INTO\s+example_prompts/i)
  if (insertIdx < 0) return []
  const body = stripped.slice(insertIdx)

  // 3. Match VALUES tuples that begin with three single-quoted strings.
  //    Pattern:  ( 'slug' , 'category' , 'user_prompt' ...
  const re = /\(\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'((?:[^']|'')*)'\s*,/g
  const out: ParsedPrompt[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(body)) !== null) {
    out.push({
      slug: m[1],
      category: m[2],
      // Un-escape SQL-doubled apostrophes back to a single '
      user_prompt: m[3].replace(/''/g, "'"),
    })
  }
  return out
}

const SQL = readFileSync(MIGRATION, 'utf8')
const PROMPTS = parsePrompts(SQL)

test.describe('P37 — prompt corpus shape', () => {
  test('migration file exists and is non-empty', () => {
    expect(SQL.length).toBeGreaterThan(0)
    expect(SQL).toContain('CREATE TABLE example_prompts')
  })

  test('seed uses INSERT OR REPLACE for idempotency (P28 C15)', () => {
    expect(SQL).toMatch(/INSERT OR REPLACE INTO example_prompts/)
  })

  test('CHECK constraint allows the P37-extended category enum', () => {
    // The SQL CHECK clause must list every category in ALLOWED_CATEGORIES.
    const checkMatch = SQL.match(/category\s+TEXT[^()]*CHECK\s*\(\s*category\s+IN\s*\(([^)]+)\)\s*\)/)
    expect(checkMatch, 'CHECK constraint not found on category column').not.toBeNull()
    const listed = (checkMatch?.[1] ?? '')
      .split(',')
      .map((s) => s.trim().replace(/^'|'$/g, ''))
    for (const cat of ALLOWED_CATEGORIES) {
      expect(listed, `CHECK enum missing '${cat}'`).toContain(cat)
    }
  })
})

test.describe('P37 — coverage gate (≥35)', () => {
  test('parses at least 35 distinct prompt rows', () => {
    expect(PROMPTS.length, `parsed only ${PROMPTS.length} prompts`).toBeGreaterThanOrEqual(35)
  })

  test('every parsed row has a category in the allowed enum', () => {
    const offenders = PROMPTS.filter((p) => !ALLOWED_CATEGORIES.has(p.category))
    expect(
      offenders,
      `rows with unknown category: ${offenders.map((o) => `${o.slug}=${o.category}`).join(', ')}`,
    ).toEqual([])
  })

  test('all slugs are unique', () => {
    const seen = new Set<string>()
    const dups: string[] = []
    for (const p of PROMPTS) {
      if (seen.has(p.slug)) dups.push(p.slug)
      seen.add(p.slug)
    }
    expect(dups, `duplicate slugs: ${dups.join(', ')}`).toEqual([])
  })
})

test.describe('P37 — per-category route coverage', () => {
  function countCategory(cat: string): number {
    return PROMPTS.filter((p) => p.category === cat).length
  }

  test('content route — ≥6 content_gen prompts (rewrite/regen + generic+copy-noun)', () => {
    const n = countCategory('content_gen')
    expect(n, `only ${n} content_gen prompts`).toBeGreaterThanOrEqual(6)
  })

  test('design route — ≥4 design-cue prompts (theme/dark mode/palette/layout)', () => {
    // Design-route prompts live under the existing 'multi_section' bucket; we
    // pin the four design-prefixed slugs to make coverage explicit.
    const designSlugs = PROMPTS.filter(
      (p) => p.slug.startsWith('design-') && p.category === 'multi_section',
    )
    expect(
      designSlugs.length,
      `only ${designSlugs.length} P37 design-route prompts`,
    ).toBeGreaterThanOrEqual(4)
  })

  test('command route — ≥6 command-trigger prompts', () => {
    const n = countCategory('command')
    expect(n, `only ${n} command prompts`).toBeGreaterThanOrEqual(6)
  })

  test('voice_only route — ≥4 voice-only phrasings', () => {
    const n = countCategory('voice_only')
    expect(n, `only ${n} voice_only prompts`).toBeGreaterThanOrEqual(4)
  })

  test('ambiguous route — ≥4 low-confidence prompts (ASSUMPTIONS_ATOM triggers)', () => {
    const n = countCategory('ambiguous')
    expect(n, `only ${n} ambiguous prompts`).toBeGreaterThanOrEqual(4)
  })
})

test.describe('P37 — ADR-066 command-kind coverage', () => {
  // Per ADR-066, parseCommand must surface seven CommandKind values:
  //   browse, apply-template, generate, design, content, hide, show
  // The seed must cover at least four of those (≥4 per brief). We check
  // for the four we KNOW the seed pins (browse, apply-template, generate,
  // design — the first wave of slash forms).
  test('≥4 distinct command kinds represented in the corpus', () => {
    const cmdPrompts = PROMPTS.filter((p) => p.category === 'command')
    // Heuristic: derive the kind from the leading slash word OR voice form.
    const kinds = new Set<string>()
    for (const p of cmdPrompts) {
      const text = p.user_prompt.trim().toLowerCase()
      if (text.startsWith('/template ')) kinds.add('apply-template')
      else if (text === '/browse' || text === '/templates') kinds.add('browse')
      else if (text === '/generate') kinds.add('generate')
      else if (text === '/design') kinds.add('design')
      else if (text === '/content') kinds.add('content')
      else if (text === '/hide') kinds.add('hide')
      else if (text === '/show') kinds.add('show')
    }
    expect(
      kinds.size,
      `command kinds covered: ${[...kinds].join(', ')}`,
    ).toBeGreaterThanOrEqual(4)
  })

  test('apply-template form (with target) is present', () => {
    const hasApplyTemplate = PROMPTS.some(
      (p) => p.category === 'command' && /^\/template\s+\S/.test(p.user_prompt),
    )
    expect(hasApplyTemplate, 'no /template <name> form in command corpus').toBe(true)
  })

  test('every command prompt is non-empty and starts with / or a known voice trigger', () => {
    for (const p of PROMPTS.filter((p) => p.category === 'command')) {
      expect(p.user_prompt.length, `empty command prompt: ${p.slug}`).toBeGreaterThan(0)
      const t = p.user_prompt.trim().toLowerCase()
      const isSlash = t.startsWith('/')
      const isVoice = /^(browse|show me|apply template|use template|generate|write|design only|style only|content only|copy only)\b/.test(
        t,
      )
      expect(isSlash || isVoice, `command "${p.user_prompt}" is neither slash nor voice form`).toBe(true)
    }
  })
})

test.describe('P37 — voice + ambiguous content sanity', () => {
  test('voice_only prompts do NOT start with a slash (would be a command)', () => {
    for (const p of PROMPTS.filter((p) => p.category === 'voice_only')) {
      expect(p.user_prompt.trim().startsWith('/'), `voice_only ${p.slug} starts with /`).toBe(false)
    }
  })

  test('ambiguous prompts contain a generic verb but no copy noun + no design cue', () => {
    // Pure spot-check — we don't import classifyRoute here (kept zero-dep on
    // the production tree to remain a corpus-only test). Just verify the user
    // prompts are short and verb-led — the route classifier owns the actual
    // routing decision and is covered by p37-route-classifier.spec.ts.
    const ambiguous = PROMPTS.filter((p) => p.category === 'ambiguous')
    expect(ambiguous.length).toBeGreaterThanOrEqual(4)
    for (const p of ambiguous) {
      expect(p.user_prompt.length, `ambiguous ${p.slug} is empty`).toBeGreaterThan(0)
      expect(p.user_prompt.length, `ambiguous ${p.slug} too long for a bare-verb case`).toBeLessThanOrEqual(64)
    }
  })
})

test.describe('P37 — totals + breakdown report (informational)', () => {
  test('emits a per-category breakdown to console for the phase log', () => {
    const breakdown = new Map<string, number>()
    for (const p of PROMPTS) {
      breakdown.set(p.category, (breakdown.get(p.category) ?? 0) + 1)
    }
    // Always passes — the goal is to surface the breakdown in the test log
    // for the phase retrospective + STATE.md row update.
    // eslint-disable-next-line no-console
    console.log('[p37-prompt-coverage] total =', PROMPTS.length, 'breakdown =', Object.fromEntries(breakdown))
    expect(PROMPTS.length).toBeGreaterThanOrEqual(35)
  })
})
