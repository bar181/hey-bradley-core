/**
 * P57 Wave 2 — Sprint N: Shareable Output (static HTML export + hosted spec
 * link stub + attribution toggle).
 *
 * Pure-unit (FS-level reads). Mirrors P54/P55/P56/P57' spec docstring style.
 * NO browser bootstrap. NO aisp barrel imports. Each assertion body ≤6 lines.
 *
 * Some cases may fail until N1 (staticHtmlExport + ExportStaticHtmlButton +
 * ChatInput wiring), N2 (hostedSpecLink + SharedSpec + /spec/:hash route +
 * ShareSpecButton wiring), and N3 (attribution + AttributionToggle) land —
 * those are expected-failures by design and GREEN-flip on Wave 2 seal.
 *
 * ADR-081.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const STATIC_EXPORT = join(ROOT, 'src/contexts/specification/staticHtmlExport.ts')
const EXPORT_BUTTON = join(ROOT, 'src/components/shell/ExportStaticHtmlButton.tsx')
const CHAT_INPUT = join(ROOT, 'src/components/shell/ChatInput.tsx')
const HOSTED_LINK = join(ROOT, 'src/contexts/specification/hostedSpecLink.ts')
const SHARED_SPEC = join(ROOT, 'src/pages/SharedSpec.tsx')
const MAIN = join(ROOT, 'src/main.tsx')
const SHARE_SPEC_BUTTON = join(ROOT, 'src/components/shell/ShareSpecButton.tsx')
const ATTRIBUTION = join(ROOT, 'src/contexts/specification/attribution.ts')
const ATTRIBUTION_TOGGLE = join(ROOT, 'src/components/settings/AttributionToggle.tsx')
const ADR = join(ROOT, 'docs/adr/ADR-081-shareable-output.md')

test.describe('P57N.1 staticHtmlExport — file shape, named export, ≤220 LOC', () => {
  test('exists, exports exportStaticHtml, ≤220 LOC', () => {
    expect(existsSync(STATIC_EXPORT)).toBe(true)
    const src = readFileSync(STATIC_EXPORT, 'utf8')
    expect(/export\s+(async\s+)?function\s+exportStaticHtml\b|export\s*\{[^}]*\bexportStaticHtml\b/.test(src)).toBe(true)
    expect(src.split('\n').length).toBeLessThanOrEqual(220)
  })
})

test.describe('P57N.2 staticHtmlExport — uses redactKeyShapes at boundary', () => {
  test('source references redactKeyShapes', () => {
    const src = readFileSync(STATIC_EXPORT, 'utf8')
    expect(/redactKeyShapes/.test(src)).toBe(true)
  })
})

test.describe('P57N.3 staticHtmlExport — produces well-formed HTML', () => {
  test('source contains <html and </html literal markers', () => {
    const src = readFileSync(STATIC_EXPORT, 'utf8')
    expect(/<html/.test(src)).toBe(true)
    expect(/<\/html>/.test(src)).toBe(true)
  })
})

test.describe('P57N.4 ExportStaticHtmlButton — file shape, export, ≤100 LOC, testid', () => {
  test('exists, exports button, ≤100 LOC, contains export-static-html-button testid', () => {
    expect(existsSync(EXPORT_BUTTON)).toBe(true)
    const src = readFileSync(EXPORT_BUTTON, 'utf8')
    expect(/export\s+(default\s+)?(function|const)\s+ExportStaticHtmlButton\b|export\s*\{[^}]*\bExportStaticHtmlButton\b/.test(src)).toBe(true)
    expect(src.split('\n').length).toBeLessThanOrEqual(100)
    expect(src).toContain('export-static-html-button')
  })
})

test.describe('P57N.5 ChatInput mounts ExportStaticHtmlButton', () => {
  test('ChatInput.tsx imports ExportStaticHtmlButton', () => {
    const src = readFileSync(CHAT_INPUT, 'utf8')
    expect(/import\s+\{?[^}]*ExportStaticHtmlButton[^}]*\}?\s+from\s+['"][^'"]+['"]/.test(src)).toBe(true)
  })
})

test.describe('P57N.6 hostedSpecLink — file shape, three named exports, ≤140 LOC', () => {
  test('exists, exports publishSpecLocally + loadSharedSpec + listSharedSpecs, ≤140 LOC', () => {
    expect(existsSync(HOSTED_LINK)).toBe(true)
    const src = readFileSync(HOSTED_LINK, 'utf8')
    expect(src.includes('publishSpecLocally') && src.includes('loadSharedSpec') && src.includes('listSharedSpecs')).toBe(true)
    expect(src.split('\n').length).toBeLessThanOrEqual(140)
  })
})

test.describe('P57N.7 hostedSpecLink — uses Web Crypto SHA-256', () => {
  test('source calls crypto.subtle.digest (or aliased subtle.digest)', () => {
    const src = readFileSync(HOSTED_LINK, 'utf8')
    // Implementation pulls subtle off globalThis.crypto, then calls subtle.digest('SHA-256', …).
    // Either form satisfies the SHA-256 contract. Wave-5 fix-pass.
    expect(/(crypto\.)?subtle\.digest\s*\(\s*['"]SHA-256['"]/.test(src)).toBe(true)
  })
})

test.describe('P57N.8 hostedSpecLink — uses redactKeyShapes', () => {
  test('source references redactKeyShapes at the export boundary', () => {
    const src = readFileSync(HOSTED_LINK, 'utf8')
    expect(/redactKeyShapes/.test(src)).toBe(true)
  })
})

test.describe('P57N.9 SharedSpec page — file shape, named export, ≤180 LOC', () => {
  test('exists, exports SharedSpec, ≤180 LOC', () => {
    expect(existsSync(SHARED_SPEC)).toBe(true)
    const src = readFileSync(SHARED_SPEC, 'utf8')
    expect(/export\s+(default\s+)?(function|const)\s+SharedSpec\b|export\s*\{[^}]*\bSharedSpec\b/.test(src)).toBe(true)
    expect(src.split('\n').length).toBeLessThanOrEqual(180)
  })
})

test.describe('P57N.10 main.tsx wires /spec/:hash route', () => {
  test('main.tsx contains path="/spec/:hash"', () => {
    const src = readFileSync(MAIN, 'utf8')
    expect(src).toContain('path="/spec/:hash"')
  })
})

test.describe('P57N.11 ShareSpecButton calls publishSpecLocally (post-N2 wiring)', () => {
  test('ShareSpecButton.tsx references publishSpecLocally', () => {
    const src = readFileSync(SHARE_SPEC_BUTTON, 'utf8')
    expect(/publishSpecLocally/.test(src)).toBe(true)
  })
})

test.describe('P57N.12 attribution.ts — file shape, four exports, ≤80 LOC', () => {
  test('exists, exports getAttributionEnabled + setAttributionEnabled + ATTRIBUTION_TEXT + renderAttribution, ≤80 LOC', () => {
    expect(existsSync(ATTRIBUTION)).toBe(true)
    const src = readFileSync(ATTRIBUTION, 'utf8')
    expect(src.includes('getAttributionEnabled') && src.includes('setAttributionEnabled')).toBe(true)
    expect(src.includes('ATTRIBUTION_TEXT') && src.includes('renderAttribution')).toBe(true)
    expect(src.split('\n').length).toBeLessThanOrEqual(80)
  })
})

test.describe('P57N.13 attribution defaults to true on miss', () => {
  test('source contains a default-true literal pattern', () => {
    const src = readFileSync(ATTRIBUTION, 'utf8')
    expect(/(\?\?\s*true|\|\|\s*true|=\s*true\b|return\s+true)/.test(src)).toBe(true)
  })
})

test.describe('P57N.14 AttributionToggle — file shape + testid', () => {
  test('exists, exports AttributionToggle, contains attribution-toggle testid', () => {
    expect(existsSync(ATTRIBUTION_TOGGLE)).toBe(true)
    const src = readFileSync(ATTRIBUTION_TOGGLE, 'utf8')
    expect(/export\s+(default\s+)?(function|const)\s+AttributionToggle\b|export\s*\{[^}]*\bAttributionToggle\b/.test(src)).toBe(true)
    expect(src).toContain('attribution-toggle')
  })
})

test.describe('P57N.15 ADR-081 — file shape + cross-refs', () => {
  test('exists, Status: Accepted, ≤120 LOC, refs ADR-040 + ADR-067 + ADR-075 + ADR-080', () => {
    expect(existsSync(ADR)).toBe(true)
    const src = readFileSync(ADR, 'utf8')
    expect(src).toContain('Status:** Accepted')
    expect(src.split('\n').length).toBeLessThanOrEqual(120)
    expect(src.includes('ADR-040') && src.includes('ADR-067') && src.includes('ADR-075') && src.includes('ADR-080')).toBe(true)
  })
})
