/**
 * P33+ fix-pass-2 — addresses R2 Functionality + R4 Architecture must-fix items.
 *
 * Pure-unit. Verifies:
 *   - R2 F1: listAllForBrowse de-dups id collisions (registry wins)
 *   - R2 F2: isCleanContent rejects non-http URI schemes (mailto:/tel:/data:/javascript:/file:/ftp:)
 *   - R2 L1: isCleanContent rejects embedded JSON-shape patterns
 *   - R2 L5: library decoration guards against non-array examples
 *   - R4 F1: BASELINE_META deleted; metadata declared inline on registry templates
 *   - R4 F2: resolveTargetPath helper exists in twoStepPipeline.ts
 *
 * Cross-ref: phase-33/deep-dive/02-functionality-review.md, 04-architecture-review.md
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  TEMPLATE_REGISTRY,
} from '../src/contexts/intelligence/templates/registry'
import {
  listAllForBrowse,
  TEMPLATE_LIBRARY,
} from '../src/contexts/intelligence/templates/library'
import { isCleanContent } from '../src/contexts/intelligence/aisp/contentAtom'

test.describe('R2 F1 — listAllForBrowse id-dedup', () => {
  test('user row colliding with registry id is filtered out', () => {
    const userRows = [
      {
        id: 'make-it-brighter', // colliding with registry
        name: 'Hijack',
        category: 'theme' as const,
        kind: 'patcher' as const,
        examples: [],
      },
      {
        id: 'unique-user',
        name: 'Unique',
        category: 'content' as const,
        kind: 'patcher' as const,
        examples: [],
      },
    ]
    const browse = listAllForBrowse(() => userRows)
    const occurrences = browse.filter((b) => b.id === 'make-it-brighter')
    expect(occurrences.length).toBe(1)
    expect(occurrences[0].source).toBe('registry')
    // Non-colliding user row still present
    expect(browse.some((b) => b.id === 'unique-user' && b.source === 'user')).toBe(true)
  })

  test('all browse ids are unique', () => {
    const userRows = [
      { id: 'hide-section', name: 'X', category: 'section' as const, kind: 'patcher' as const, examples: [] },
      { id: 'change-headline', name: 'Y', category: 'content' as const, kind: 'patcher' as const, examples: [] },
      { id: 'fresh-id', name: 'Z', category: 'content' as const, kind: 'patcher' as const, examples: [] },
    ]
    const browse = listAllForBrowse(() => userRows)
    const ids = browse.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

test.describe('R2 F2 — isCleanContent broader URI scan', () => {
  test('rejects mailto:', () => {
    expect(isCleanContent('Email me at mailto:foo@bar.com')).toBe(false)
  })
  test('rejects tel:', () => {
    expect(isCleanContent('Call us tel:+1-555-0100')).toBe(false)
  })
  test('rejects data:', () => {
    expect(isCleanContent('Bg data:image/png;base64,xx')).toBe(false)
  })
  test('rejects javascript:', () => {
    expect(isCleanContent('Click javascript:alert(1)')).toBe(false)
  })
  test('rejects file://', () => {
    expect(isCleanContent('Local file:///etc/passwd')).toBe(false)
  })
  test('rejects ftp://', () => {
    expect(isCleanContent('Get from ftp://server/file')).toBe(false)
  })
  test('still rejects http/https as before', () => {
    expect(isCleanContent('Visit https://x.com')).toBe(false)
    expect(isCleanContent('Visit http://x.com')).toBe(false)
  })
  test('clean text still passes', () => {
    expect(isCleanContent('Welcome home')).toBe(true)
    expect(isCleanContent('Stop guessing, start shipping')).toBe(true)
  })
})

test.describe('R2 L1 — isCleanContent embedded JSON-shape', () => {
  test('rejects embedded "k":… braces patterns', () => {
    expect(isCleanContent('Free pricing! {"hack":1}')).toBe(false)
  })
  test('still rejects leading-brace JSON', () => {
    expect(isCleanContent('{"json": true}')).toBe(false)
  })
  test('clean colons still pass', () => {
    expect(isCleanContent('Hours: 9am-5pm')).toBe(true)
  })
})

test.describe('R2 L5 — library decoration array guard', () => {
  test('TEMPLATE_LIBRARY.examples is always an array', () => {
    for (const t of TEMPLATE_LIBRARY) {
      expect(Array.isArray(t.examples)).toBe(true)
    }
  })
})

test.describe('R4 F1 — BASELINE_META deletion', () => {
  test('library.ts no longer declares BASELINE_META', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/contexts/intelligence/templates/library.ts'),
      'utf8',
    )
    expect(src).not.toContain('const BASELINE_META')
  })

  test('all 4 registry templates declare category + kind + examples inline', () => {
    for (const t of TEMPLATE_REGISTRY) {
      expect(t.category, `template ${t.id} missing category`).toBeDefined()
      expect(t.kind, `template ${t.id} missing kind`).toBeDefined()
      expect(t.examples, `template ${t.id} missing examples`).toBeDefined()
      expect(Array.isArray(t.examples)).toBe(true)
    }
  })

  test('registry has 3 patchers + 1 generator', () => {
    const patchers = TEMPLATE_REGISTRY.filter((t) => t.kind === 'patcher')
    const generators = TEMPLATE_REGISTRY.filter((t) => t.kind === 'generator')
    expect(patchers.length).toBe(3)
    expect(generators.length).toBe(1)
  })
})

test.describe('R4 F2 — resolveTargetPath extension hook', () => {
  test('twoStepPipeline.ts declares resolveTargetPath helper', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/contexts/intelligence/aisp/twoStepPipeline.ts'),
      'utf8',
    )
    expect(src).toContain('function resolveTargetPath')
    expect(src).toMatch(/resolveTargetPath\(\s*sectionType\s*,\s*config\s*\)/)
  })

  test('generator dispatch no longer hardcodes heroHeadingPath in the branch', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/contexts/intelligence/aisp/twoStepPipeline.ts'),
      'utf8',
    )
    // Hero path is now reachable only through the helper.
    const generatorBranch = src.match(/if \(tpl\.kind === 'generator'\)[\s\S]*?(?=\/\/ Patcher path)/)
    expect(generatorBranch).not.toBeNull()
    if (generatorBranch) {
      // The branch body should call resolveTargetPath, not heroHeadingPath directly.
      expect(generatorBranch[0]).toContain('resolveTargetPath')
      // The branch body should NOT call heroHeadingPath directly anymore.
      expect(generatorBranch[0]).not.toMatch(/=\s*heroHeadingPath\(/)
    }
  })
})
