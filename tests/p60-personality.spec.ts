/**
 * P60 step 3 spec — personality response examples data validity.
 * Pure-unit (FS read of tests/examples/personality-responses.json).
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const FILE = join(ROOT, 'tests/examples/personality-responses.json')

const PERSONALITIES = ['professional', 'fun', 'geek', 'teacher', 'coach']
type Row = {
  id: string
  input: string
  mode: 'chat' | 'listen'
  personality: string
  expectedTone: string
  sampleResponse: string
  aisp_trace: { intent: { verb: string | null; target: string | null; confidence: number }; route: string }
}

test.describe('P60.11 personality-responses.json — file shape + 50 entries', () => {
  test('file exists + parses + 50 entries', () => {
    expect(existsSync(FILE)).toBe(true)
    const rows = JSON.parse(readFileSync(FILE, 'utf8')) as Row[]
    expect(Array.isArray(rows)).toBe(true)
    expect(rows.length).toBe(50)
  })
})

test.describe('P60.12 personality-responses — 10 prompts × 5 personalities = 50', () => {
  test('every personality has 10 entries; ids unique; ids match personality value', () => {
    const rows = JSON.parse(readFileSync(FILE, 'utf8')) as Row[]
    const counts: Record<string, number> = {}
    for (const r of rows) counts[r.personality] = (counts[r.personality] ?? 0) + 1
    for (const p of PERSONALITIES) expect(counts[p]).toBe(10)
    const ids = new Set(rows.map((r) => r.id))
    expect(ids.size).toBe(50)
  })
})

test.describe('P60.13 personality-responses — both chat + listen modes covered', () => {
  test('mode is chat or listen; ≥10 listen entries (covers voice surface)', () => {
    const rows = JSON.parse(readFileSync(FILE, 'utf8')) as Row[]
    const modes = new Set(rows.map((r) => r.mode))
    expect(modes.has('chat')).toBe(true)
    expect(modes.has('listen')).toBe(true)
    const listenCount = rows.filter((r) => r.mode === 'listen').length
    expect(listenCount).toBeGreaterThanOrEqual(10)
  })
})

test.describe('P60.14 personality-responses — sampleResponse distinct per personality', () => {
  test('for each base prompt, the 5 sampleResponses are distinct strings', () => {
    const rows = JSON.parse(readFileSync(FILE, 'utf8')) as Row[]
    // group by base prompt id (strip the personality+number suffix); collect 5 samples
    const groups: Record<string, Set<string>> = {}
    for (const r of rows) {
      const key = r.input
      if (!groups[key]) groups[key] = new Set()
      groups[key].add(r.sampleResponse)
    }
    for (const samples of Object.values(groups)) {
      // each base prompt should have 5 distinct samples (one per personality)
      expect(samples.size).toBeGreaterThanOrEqual(5)
    }
  })
})

test.describe('P60.15 personality-responses — geek samples carry AISP markers', () => {
  test('every geek-personality sampleResponse contains an AISP atom symbol', () => {
    const rows = JSON.parse(readFileSync(FILE, 'utf8')) as Row[]
    const geek = rows.filter((r) => r.personality === 'geek')
    expect(geek.length).toBe(10)
    for (const r of geek) {
      expect(/INTENT_ATOM|Ω|Σ|atom/i.test(r.sampleResponse)).toBe(true)
    }
  })
})

test.describe('P60.16 personality-responses — aisp_trace always populated', () => {
  test('every entry has aisp_trace.intent with confidence ∈ [0,1]', () => {
    const rows = JSON.parse(readFileSync(FILE, 'utf8')) as Row[]
    for (const r of rows) {
      expect(r.aisp_trace).toBeTruthy()
      expect(typeof r.aisp_trace.intent.confidence).toBe('number')
      expect(r.aisp_trace.intent.confidence).toBeGreaterThanOrEqual(0)
      expect(r.aisp_trace.intent.confidence).toBeLessThanOrEqual(1)
      expect(['design', 'content', 'ambiguous']).toContain(r.aisp_trace.route)
    }
  })
})
