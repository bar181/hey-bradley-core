/**
 * P46 Sprint H Wave 3 — Reference Management summary panel (Agent A8 cumulative).
 *
 * Pure-unit (FS-level + module imports). Verifies A7 (ReferenceManagement.tsx
 * + SettingsDrawer mount above the two upload widgets) and A8 (ADR-069 +
 * wiki update). NO real LLM; NO browser; NO chunk joins.
 *
 * Mirrors the P44 / P45 source-level test pattern. The component itself is a
 * pure consumer of P44/P45 manifests — A7 contract is validated through
 * source-level introspection (testid surface + import shape + JSX order +
 * window.confirm gate).
 *
 * ADR-069.
 */
import { test, expect } from '@playwright/test'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const REF_MGMT = join(process.cwd(), 'src/components/settings/ReferenceManagement.tsx')
const DRAWER = join(process.cwd(), 'src/components/settings/SettingsDrawer.tsx')
const ADR = join(process.cwd(), 'docs/adr/ADR-069-context-management.md')
const WIKI = join(process.cwd(), 'docs/wiki/llm-call-process-flow.md')

test.describe('P46.1 ReferenceManagement file + export', () => {
  test('ReferenceManagement.tsx exists', () => {
    expect(existsSync(REF_MGMT)).toBe(true)
  })

  test('exports ReferenceManagement React FC', () => {
    const src = readFileSync(REF_MGMT, 'utf8')
    // Function-component export form. The component returns a <section>; the
    // tsx form is `export function ReferenceManagement()`.
    expect(src).toMatch(/export function ReferenceManagement\s*\(/)
    // Returns JSX (must contain a JSX root). The component returns a
    // <section> with the testid 'reference-management'.
    expect(src).toMatch(/<section[\s\S]*?data-testid="reference-management"/)
  })
})

test.describe('P46.2 SettingsDrawer mounts ReferenceManagement above upload widgets', () => {
  test('drawer imports ReferenceManagement', () => {
    const src = readFileSync(DRAWER, 'utf8')
    expect(src).toMatch(/import\s*\{\s*ReferenceManagement\s*\}\s*from\s*['"]\.\/ReferenceManagement['"]/)
  })

  test('JSX order: ReferenceManagement BEFORE BrandContextUpload BEFORE CodebaseContextUpload', () => {
    const src = readFileSync(DRAWER, 'utf8')
    const refIdx = src.indexOf('<ReferenceManagement')
    const brandIdx = src.indexOf('<BrandContextUpload')
    const codeIdx = src.indexOf('<CodebaseContextUpload')
    expect(refIdx).toBeGreaterThan(-1)
    expect(brandIdx).toBeGreaterThan(-1)
    expect(codeIdx).toBeGreaterThan(-1)
    // Strict source order — summary above both upload widgets.
    expect(refIdx).toBeLessThan(brandIdx)
    expect(brandIdx).toBeLessThan(codeIdx)
  })
})

test.describe('P46.3 Source-level testids (end-to-end coverage hooks)', () => {
  test('all 5 documented testids are present in ReferenceManagement', () => {
    const src = readFileSync(REF_MGMT, 'utf8')
    expect(src).toContain('data-testid="reference-management"')
    expect(src).toContain('data-testid="reference-row-brand"')
    expect(src).toContain('data-testid="reference-row-codebase"')
    expect(src).toContain('data-testid="reference-clear-brand"')
    expect(src).toContain('data-testid="reference-clear-codebase"')
  })
})

test.describe('P46.4 Manifest-only reads (NOT full reads — no chunk-joins)', () => {
  test('imports readBrandContextManifest + readCodebaseContextManifest', () => {
    const src = readFileSync(REF_MGMT, 'utf8')
    expect(src).toMatch(/readBrandContextManifest/)
    expect(src).toMatch(/readCodebaseContextManifest/)
  })

  test('does NOT import readBrandContext or readCodebaseContext (forces chunk-joins)', () => {
    const src = readFileSync(REF_MGMT, 'utf8')
    // The summary panel is pure-manifest. Importing the full readers would
    // force N kv lookups per drawer open and is explicitly out-of-scope per
    // ADR-069 §Manifest-only reads.
    // Match only the bare "readBrandContext" / "readCodebaseContext" identifiers
    // (NOT the *Manifest variants which ARE allowed).
    expect(src).not.toMatch(/\breadBrandContext\b(?!Manifest)/)
    expect(src).not.toMatch(/\breadCodebaseContext\b(?!Manifest)/)
  })

  test('imports the two clear functions (clearing IS allowed)', () => {
    const src = readFileSync(REF_MGMT, 'utf8')
    expect(src).toMatch(/clearBrandContext/)
    expect(src).toMatch(/clearCodebaseContext/)
  })
})

test.describe('P46.5 Clear buttons gated by window.confirm', () => {
  test('window.confirm() guards both Clear handlers', () => {
    const src = readFileSync(REF_MGMT, 'utf8')
    // At minimum 2 confirm() calls — one per channel. Mirrors the P34
    // ClarificationPanel destructive-action pattern + the SettingsDrawer
    // Clear-local-data button.
    const matches = src.match(/window\.confirm\(/g) ?? []
    expect(matches.length).toBeGreaterThanOrEqual(2)
  })

  test('confirm() runs BEFORE clearBrandContext()', () => {
    const src = readFileSync(REF_MGMT, 'utf8')
    // Source-level proof: the brand handler must short-circuit (return) on
    // a falsy confirm before invoking clearBrandContext().
    const brandHandler = /handleClearBrand[\s\S]*?clearBrandContext\(\)/.exec(src)
    expect(brandHandler).not.toBeNull()
    const body = brandHandler![0]
    const confirmIdx = body.indexOf('window.confirm(')
    const clearIdx = body.indexOf('clearBrandContext()')
    expect(confirmIdx).toBeGreaterThan(-1)
    expect(clearIdx).toBeGreaterThan(confirmIdx)
  })

  test('confirm() runs BEFORE clearCodebaseContext()', () => {
    const src = readFileSync(REF_MGMT, 'utf8')
    const codeHandler = /handleClearCodebase[\s\S]*?clearCodebaseContext\(\)/.exec(src)
    expect(codeHandler).not.toBeNull()
    const body = codeHandler![0]
    const confirmIdx = body.indexOf('window.confirm(')
    const clearIdx = body.indexOf('clearCodebaseContext()')
    expect(confirmIdx).toBeGreaterThan(-1)
    expect(clearIdx).toBeGreaterThan(confirmIdx)
  })
})

test.describe('P46.6 Empty-state copy + privacy footer', () => {
  test('empty-state copy is present', () => {
    const src = readFileSync(REF_MGMT, 'utf8')
    // Strict regex over either common phrasing — both are acceptable.
    expect(src).toMatch(/No references uploaded yet/i)
  })

  test('privacy footer mentions export-strip', () => {
    const src = readFileSync(REF_MGMT, 'utf8')
    // The footer must reference the .heybradley export-strip behavior so
    // the user understands references never leave the device.
    expect(src).toMatch(/stripped from .*\.heybradley/i)
  })
})

test.describe('P46.7 ADR-069 file shape', () => {
  test('ADR-069 exists with full Accepted status + ADR-069 number + Phase P46', () => {
    expect(existsSync(ADR)).toBe(true)
    const src = readFileSync(ADR, 'utf8')
    expect(src).toMatch(/^# ADR-069:/m)
    expect(src).toMatch(/\*\*Status:\*\*\s*Accepted/)
    expect(src).toMatch(/\*\*Phase:\*\*\s*P46/)
  })

  test('ADR-069 cross-references ADR-040 + ADR-046 + ADR-067 + ADR-068', () => {
    const src = readFileSync(ADR, 'utf8')
    expect(src).toContain('ADR-040')
    expect(src).toContain('ADR-046')
    expect(src).toContain('ADR-067')
    expect(src).toContain('ADR-068')
  })

  test('ADR-069 ≤ 120 lines (concise scope-locked ADR)', () => {
    const src = readFileSync(ADR, 'utf8')
    const lineCount = src.split('\n').length
    expect(lineCount).toBeLessThanOrEqual(120)
  })
})

test.describe('P46.8 Wiki updated to P46 (or later)', () => {
  test('Last verified against code: P46 or a later sealed phase', () => {
    const src = readFileSync(WIKI, 'utf8')
    // Forward-compatible: P46 was the original Sprint H tag; later sprints
    // (Sprint I sealed at P49) advance the line. Accept any P\d{2,} ≥ P46
    // so subsequent phase-bump fix-passes don't trigger a false regression.
    const m = /Last verified against code:\*\*\s*P(\d{2,})/.exec(src)
    expect(m, 'wiki must declare a "Last verified against code" pin').not.toBeNull()
    if (m) expect(parseInt(m[1], 10)).toBeGreaterThanOrEqual(46)
  })

  test('wiki cross-references ADR-067 + ADR-068 + ADR-069', () => {
    const src = readFileSync(WIKI, 'utf8')
    // Header cross-reference line.
    expect(src).toContain('ADR-067')
    expect(src).toContain('ADR-068')
    expect(src).toContain('ADR-069')
  })

  test('wiki includes the Reference Context Pipeline section (Sprint H)', () => {
    const src = readFileSync(WIKI, 'utf8')
    expect(src).toMatch(/##\s+Reference Context Pipeline/)
    // Sprint H labelled in the header for clarity.
    expect(src).toMatch(/Reference Context Pipeline\s*\(Sprint H\)/i)
  })

  test('wiki flow chart includes the REFERENCE CONTEXT pre-pipeline block', () => {
    const src = readFileSync(WIKI, 'utf8')
    // The pre-pipeline block is upstream of the GATE box per ADR-069.
    expect(src).toMatch(/REFERENCE CONTEXT \(P44\+P45\)/)
    expect(src).toMatch(/brand_context \(voice\)/)
    expect(src).toMatch(/codebase_context \(project\)/)
  })

  test('wiki documents both injection caps (4KB brand / 32KB codebase)', () => {
    const src = readFileSync(WIKI, 'utf8')
    // Cap math table — both numbers must appear so the doc is self-contained.
    expect(src).toMatch(/4 KB/)
    expect(src).toMatch(/32 KB/)
  })
})
