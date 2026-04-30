/**
 * P65 / OC-2.5 — Design Token System + Component Quality Standard.
 * PURE-UNIT: FS reads + dynamic import + regex asserts. NO browser bootstrap.
 * Pattern follows tests/p64-oc3-templates-round1.spec.ts.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const ADR_PATH = join(ROOT, 'docs/adr/ADR-087-design-token-system.md')
const TOKENS_PATH = join(ROOT, 'src/styles/design-tokens.ts')
const STYLES_DIR = join(ROOT, 'src/styles')
const DDD_PATH = join(ROOT, 'docs/ddd/ui-shell-bounded-context.md')

test.describe('P65.1 ADR-087 — exists, ≤120 LOC, Status Accepted, cross-refs', () => {
  test('ADR-087 file exists on disk', () => {
    expect(existsSync(ADR_PATH)).toBe(true)
  })
  test('ADR-087 is ≤120 LOC', () => {
    const src = readFileSync(ADR_PATH, 'utf8')
    const lines = src.split('\n').length
    expect(lines).toBeLessThanOrEqual(120)
  })
  test('ADR-087 declares Status: Accepted and cross-refs ADR-079 + ADR-088 + ADR-076', () => {
    const src = readFileSync(ADR_PATH, 'utf8')
    expect(src).toMatch(/Status:\*\*\s*Accepted/)
    expect(src).toContain('ADR-079')
    expect(src).toContain('ADR-088')
    expect(src).toContain('ADR-076')
  })
})

test.describe('P65.2 design-tokens.ts — exists, exports tokens + DesignTokens, TS-typed', () => {
  test('src/styles/design-tokens.ts exists', () => {
    expect(existsSync(TOKENS_PATH)).toBe(true)
  })
  test('exports the tokens object and DesignTokens interface (text + dynamic import)', async () => {
    const src = readFileSync(TOKENS_PATH, 'utf8')
    expect(src).toMatch(/export\s+interface\s+DesignTokens\b/)
    expect(src).toMatch(/export\s+const\s+tokens\s*:\s*DesignTokens\s*=/)
    const mod = (await import(TOKENS_PATH)) as {
      tokens: Record<string, unknown>
      default: Record<string, unknown>
    }
    expect(mod.tokens).toBeDefined()
    expect(mod.default).toBeDefined()
    expect(mod.tokens).toBe(mod.default)
  })
})

test.describe('P65.3 spacing — canonical schema values', () => {
  test('spacing matches canonical: 96 / 64 / 24 / 24 / 48', async () => {
    const mod = (await import(TOKENS_PATH)) as {
      tokens: { spacing: Record<string, string> }
    }
    expect(mod.tokens.spacing['section-y']).toBe('96px')
    expect(mod.tokens.spacing['section-y-mobile']).toBe('64px')
    expect(mod.tokens.spacing['container-x']).toBe('24px')
    expect(mod.tokens.spacing['stack-gap']).toBe('24px')
    expect(mod.tokens.spacing['stack-gap-lg']).toBe('48px')
  })
})

test.describe('P65.4 typography — clamp() for display/h1/h2 + body + line-height', () => {
  test('display, h1, h2 are responsive clamp() values; body 1.125rem; line-height 1.6', async () => {
    const mod = (await import(TOKENS_PATH)) as {
      tokens: { typography: Record<string, string> }
    }
    const t = mod.tokens.typography
    expect(t.display).toMatch(/^clamp\(/)
    expect(t.h1).toMatch(/^clamp\(/)
    expect(t.h2).toMatch(/^clamp\(/)
    expect(t.body).toBe('1.125rem')
    expect(t['body-sm']).toBe('0.9375rem')
    expect(t['line-height']).toBe('1.6')
  })
})

test.describe('P65.5 DDD doc — ui-shell aggregates list', () => {
  test('docs/ddd/ui-shell-bounded-context.md exists and lists required aggregates', () => {
    expect(existsSync(DDD_PATH)).toBe(true)
    const src = readFileSync(DDD_PATH, 'utf8')
    expect(src).toMatch(/Design Token System.*ADR-087/)
    expect(src).toMatch(/Mode Selector.*ADR-088/)
    expect(src).toMatch(/AISP Trace Pane/)
    expect(src).toMatch(/uiStore/)
  })
})

test.describe('P65.6 KISS — no new CSS files, no JS animation libs', () => {
  test('src/styles/ contains only design-tokens.ts (no new CSS files)', () => {
    expect(existsSync(STYLES_DIR)).toBe(true)
    const entries = readdirSync(STYLES_DIR)
    expect(entries).toContain('design-tokens.ts')
    for (const entry of entries) {
      expect(entry).not.toMatch(/\.css$/)
      expect(entry).not.toMatch(/\.scss$/)
    }
  })
  test('design-tokens.ts contains no Framer Motion / GSAP / Lottie / React Spring strings', () => {
    const src = readFileSync(TOKENS_PATH, 'utf8')
    expect(src).not.toMatch(/framer-motion/i)
    expect(src).not.toMatch(/\bgsap\b/i)
    expect(src).not.toMatch(/\blottie\b/i)
    expect(src).not.toMatch(/@react-spring/i)
    expect(src).not.toMatch(/animejs/i)
  })
  test('ADR-087 explicitly disclaims Framer Motion / GSAP / Lottie / React Spring / animejs', () => {
    const src = readFileSync(ADR_PATH, 'utf8')
    expect(src).toMatch(/Framer Motion/)
    expect(src).toMatch(/GSAP/)
    expect(src).toMatch(/Lottie/)
    expect(src).toMatch(/React Spring/)
    expect(src).toMatch(/animejs/)
  })
})
