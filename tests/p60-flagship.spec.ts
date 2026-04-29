/**
 * P60 step 3 spec — Hey Bradley flagship template + 2 new hand-curated templates.
 * Pure-unit (FS-level reads). Sub-30s runtime. NO browser bootstrap.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const FLAGSHIP = join(ROOT, 'src/data/examples/hey-bradley-flagship/index.ts')
const AI_ENG = join(ROOT, 'src/data/examples/ai-engineer-personal/index.ts')
const LOCAL = join(ROOT, 'src/data/examples/local-business/index.ts')
const REGISTRY = join(ROOT, 'src/data/examples/index.ts')

test.describe('P60.1 hey-bradley-flagship — file shape + ≥8 sections + real copy', () => {
  test('file exists, exports default MasterConfig, ≥8 sections', () => {
    expect(existsSync(FLAGSHIP)).toBe(true)
    const src = readFileSync(FLAGSHIP, 'utf8')
    expect(src).toMatch(/export default heyBradleyFlagship/)
    const sectionCount = (src.match(/type:\s*'(menu|hero|columns|numbers|text|pricing|quotes|action|footer|blog|gallery|team)'/g) ?? []).length
    expect(sectionCount).toBeGreaterThanOrEqual(8)
  })
  test('flagship cites all four moat priorities in feature cards', () => {
    const src = readFileSync(FLAGSHIP, 'utf8')
    expect(src).toContain('Speed visible')
    expect(src).toContain('Spec unmissable')
    expect(src).toContain('Premium templates')
    expect(src).toContain('Shareable output')
  })
  test('flagship has real copy (no Lorem / no placeholder)', () => {
    const src = readFileSync(FLAGSHIP, 'utf8')
    expect(src).not.toMatch(/Lorem ipsum/i)
    expect(src).not.toContain('Welcome to Your Website')
    expect(src).not.toContain('Your Tagline Here')
  })
})

test.describe('P60.2 ai-engineer-personal template — geek persona + spec-first voice', () => {
  test('file exists, exports default MasterConfig, ≥5 sections', () => {
    expect(existsSync(AI_ENG)).toBe(true)
    const src = readFileSync(AI_ENG, 'utf8')
    expect(src).toMatch(/export default aiEngineerPersonal/)
    const sectionCount = (src.match(/type:\s*'(menu|hero|columns|blog|quotes|footer)'/g) ?? []).length
    expect(sectionCount).toBeGreaterThanOrEqual(5)
  })
  test('uses monospace heading family (JetBrains Mono per template-audit recommendation)', () => {
    const src = readFileSync(AI_ENG, 'utf8')
    expect(src).toContain('JetBrains Mono')
  })
  test('cross-references real Hey Bradley blog posts in blog preview cards', () => {
    const src = readFileSync(AI_ENG, 'utf8')
    expect(src).toContain('jira-vs-agentics')
    expect(src).toContain('six-sprints-two-days')
  })
})

test.describe('P60.3 local-business template — grandma persona + warm aesthetic', () => {
  test('file exists, exports default MasterConfig, ≥5 sections', () => {
    expect(existsSync(LOCAL)).toBe(true)
    const src = readFileSync(LOCAL, 'utf8')
    expect(src).toMatch(/export default localBusiness/)
    const sectionCount = (src.match(/type:\s*'(menu|hero|gallery|action|team|footer)'/g) ?? []).length
    expect(sectionCount).toBeGreaterThanOrEqual(5)
  })
  test('uses warm serif (Fraunces) + terracotta accent', () => {
    const src = readFileSync(LOCAL, 'utf8')
    expect(src).toContain('Fraunces')
    expect(src).toMatch(/#c2410c|terracotta/i)
  })
})

test.describe('P60.4 examples registry registers all 3 new templates', () => {
  test('index.ts imports + registers heyBradleyFlagship + aiEngineerPersonal + localBusiness', () => {
    const src = readFileSync(REGISTRY, 'utf8')
    expect(src).toContain("import heyBradleyFlagship from './hey-bradley-flagship'")
    expect(src).toContain("import aiEngineerPersonal from './ai-engineer-personal'")
    expect(src).toContain("import localBusiness from './local-business'")
    expect(src).toContain('Hey Bradley — Flagship')
    expect(src).toContain('Lars Halvorsen — AI Engineer Personal')
    expect(src).toContain('Marigold & Co. — Local Business')
  })
})
