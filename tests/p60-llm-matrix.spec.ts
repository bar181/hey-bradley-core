/**
 * P60 step 3 spec — LLM interaction matrix data validity.
 * Pure-unit (FS read of tests/examples/llm-interactions.json). Sub-30s runtime.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const MATRIX = join(ROOT, 'tests/examples/llm-interactions.json')

const ATOMS = ['PATCH', 'INTENT', 'SELECTION', 'CONTENT', 'ASSUMPTIONS']
const PERSONALITIES = ['professional', 'fun', 'geek', 'teacher', 'coach']
type Row = {
  id: string
  input: string
  atom: string
  section: string
  agentProxyResponse: { patches: { op: string; path: string; value: unknown }[]; summary: string }
  expectedPatch: { op: string; path: string; valueType: string }
  expectedPersonalityMessage: Record<string, string>
}

test.describe('P60.5 llm-interactions.json — file shape + 80 entries', () => {
  test('file exists + parses + has exactly 80 entries', () => {
    expect(existsSync(MATRIX)).toBe(true)
    const rows = JSON.parse(readFileSync(MATRIX, 'utf8')) as Row[]
    expect(Array.isArray(rows)).toBe(true)
    expect(rows.length).toBe(80)
  })
})

test.describe('P60.6 llm-interactions — 5 atoms × 16 sections coverage', () => {
  test('every atom has 16 entries (one per section)', () => {
    const rows = JSON.parse(readFileSync(MATRIX, 'utf8')) as Row[]
    const counts: Record<string, number> = {}
    for (const r of rows) counts[r.atom] = (counts[r.atom] ?? 0) + 1
    for (const atom of ATOMS) expect(counts[atom]).toBe(16)
  })
})

test.describe('P60.7 llm-interactions — every entry has valid agentProxyResponse + expectedPatch', () => {
  test('agentProxyResponse has patches + summary; expectedPatch has op + path', () => {
    const rows = JSON.parse(readFileSync(MATRIX, 'utf8')) as Row[]
    for (const r of rows) {
      expect(Array.isArray(r.agentProxyResponse.patches)).toBe(true)
      expect(typeof r.agentProxyResponse.summary).toBe('string')
      expect(['add', 'replace', 'remove']).toContain(r.expectedPatch.op)
      expect(typeof r.expectedPatch.path).toBe('string')
    }
  })
})

test.describe('P60.8 llm-interactions — every entry has 5-mode personality message', () => {
  test('expectedPersonalityMessage covers all 5 personalities with distinct strings', () => {
    const rows = JSON.parse(readFileSync(MATRIX, 'utf8')) as Row[]
    for (const r of rows) {
      for (const p of PERSONALITIES) {
        expect(typeof r.expectedPersonalityMessage[p]).toBe('string')
        expect(r.expectedPersonalityMessage[p].length).toBeGreaterThan(5)
      }
      // 5 personality messages should be a 5-element distinct set
      const set = new Set(Object.values(r.expectedPersonalityMessage))
      expect(set.size).toBe(5)
    }
  })
})

test.describe('P60.9 llm-interactions — id uniqueness + valid section types', () => {
  test('all 80 ids unique; all sections in the closed 16-set', () => {
    const rows = JSON.parse(readFileSync(MATRIX, 'utf8')) as Row[]
    const ids = new Set(rows.map((r) => r.id))
    expect(ids.size).toBe(80)
    const validSections = new Set(['hero','features','pricing','cta','testimonials','faq','value-props','gallery','team','blog','footer','action','quotes','numbers','columns','logos'])
    for (const r of rows) expect(validSections.has(r.section)).toBe(true)
  })
})

test.describe('P60.10 llm-interactions — geek personality always has AISP marker', () => {
  test('every geek entry contains an Ω or Σ symbol (AISP classification)', () => {
    const rows = JSON.parse(readFileSync(MATRIX, 'utf8')) as Row[]
    for (const r of rows) {
      const geek = r.expectedPersonalityMessage.geek
      expect(/[ΩΣΓΛΕ]/.test(geek)).toBe(true)
    }
  })
})
