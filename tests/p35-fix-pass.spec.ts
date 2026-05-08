/**
 * P35+ fix-pass — addresses must-fix items from the brutal-honest review.
 *
 * Pure-unit (source-level + module-import). Verifies:
 *   - R1 F1: looksLikeOpenAIKey rejects sk-or- (OpenRouter)
 *   - R1 F2: AISPSurface dispatcher (one panel per reply, mode-driven)
 *   - R1 F3: 12s client-side timeout in assumptionsLLM
 *   - R1 F4 / R2 S3: Γ R3 enum-construction enforced at validation time
 *   - R2 M1: redactKeyShapes covers bare sk- + sk-or- (OpenAI legacy + OpenRouter)
 *   - R2 M2: cost-cap reserve fails CLOSED to rules when cap is unset/0
 *   - R2 S1: OpenAI adapter handles message.refusal (safety system)
 *
 * Cross-ref: phase-35/deep-dive/01-ux-func-review.md, 02-sec-arch-review.md
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  validateAssumptionsAtomOutput,
  ASSUMPTIONS_VERB_PREFIX_RE,
} from '../src/contexts/intelligence/aisp/assumptionsAtom'

const KEYS = join(process.cwd(), 'src/contexts/intelligence/llm/keys.ts')
const LLM = join(process.cwd(), 'src/contexts/intelligence/aisp/assumptionsLLM.ts')
const OPENAI = join(process.cwd(), 'src/contexts/intelligence/llm/openaiAdapter.ts')
const SURFACE = join(process.cwd(), 'src/components/shell/AISPSurface.tsx')
const CHAT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')

test.describe('R1 F1 — looksLikeOpenAIKey rejects OpenRouter prefix', () => {
  test('source-level: sk-or- rejected by OpenAI validator', () => {
    const src = readFileSync(KEYS, 'utf8')
    expect(src).toMatch(/if \(\/\^sk-or-\/i\.test\(t\)\) return false/)
  })

  test('source-level: looksLikeOpenRouterKey exists', () => {
    const src = readFileSync(KEYS, 'utf8')
    expect(src).toMatch(/export function looksLikeOpenRouterKey/)
  })
})

test.describe('R1 F2 — AISPSurface single-panel dispatcher', () => {
  test('AISPSurface module exists', () => {
    const src = readFileSync(SURFACE, 'utf8')
    expect(src).toMatch(/export function AISPSurface/)
    expect(src).toMatch(/rightPanelTab\)\s*===\s*'SIMPLE'/)
  })

  test('AISPSurface picks AISPTranslationPanel in SIMPLE mode', () => {
    const src = readFileSync(SURFACE, 'utf8')
    expect(src).toMatch(/if \(isDraft\)/)
    expect(src).toMatch(/<AISPTranslationPanel/)
  })

  test('AISPSurface picks AISPPipelineTracePane in EXPERT mode', () => {
    const src = readFileSync(SURFACE, 'utf8')
    expect(src).toMatch(/<AISPPipelineTracePane/)
  })

  test('ChatInput renders <AISPSurface> instead of stacking 2 panels', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toContain("import { AISPSurface }")
    expect(src).toContain('<AISPSurface')
    // Old direct imports should be gone from ChatInput.
    expect(src).not.toMatch(/import \{ AISPTranslationPanel \} from/)
    expect(src).not.toMatch(/import \{ AISPPipelineTracePane \} from/)
  })
})

test.describe('R1 F3 — 12s client-side timeout in assumptionsLLM', () => {
  test('AbortController + 12_000 timeout declared', () => {
    const src = readFileSync(LLM, 'utf8')
    expect(src).toMatch(/ASSUMPTIONS_LLM_TIMEOUT_MS\s*=\s*12_000/)
    expect(src).toMatch(/new AbortController\(\)/)
    expect(src).toMatch(/setTimeout\(\(\)\s*=>\s*ac\.abort\(\),/)
  })

  test('Signal forwarded to auditedComplete', () => {
    const src = readFileSync(LLM, 'utf8')
    expect(src).toMatch(/signal:\s*ac\.signal/)
  })

  test('Timer cleaned up in finally block', () => {
    const src = readFileSync(LLM, 'utf8')
    expect(src).toMatch(/finally\s*\{[\s\S]*?clearTimeout\(timer\)/)
  })
})

test.describe('R1 F4 / R2 S3 — Γ R3 enum-construction enforced at validation', () => {
  test('ASSUMPTIONS_VERB_PREFIX_RE matches all 6 INTENT_ATOM verbs', () => {
    expect(ASSUMPTIONS_VERB_PREFIX_RE.test('hide the hero')).toBe(true)
    expect(ASSUMPTIONS_VERB_PREFIX_RE.test('show the team')).toBe(true)
    expect(ASSUMPTIONS_VERB_PREFIX_RE.test('change the headline')).toBe(true)
    expect(ASSUMPTIONS_VERB_PREFIX_RE.test('add a pricing')).toBe(true)
    expect(ASSUMPTIONS_VERB_PREFIX_RE.test('reset everything')).toBe(true)
    expect(ASSUMPTIONS_VERB_PREFIX_RE.test('remove the footer')).toBe(true)
  })

  test('ASSUMPTIONS_VERB_PREFIX_RE rejects non-verb prefixes', () => {
    expect(ASSUMPTIONS_VERB_PREFIX_RE.test('please hide this')).toBe(false)
    expect(ASSUMPTIONS_VERB_PREFIX_RE.test('the hero')).toBe(false)
    expect(ASSUMPTIONS_VERB_PREFIX_RE.test('I want to hide')).toBe(false)
  })

  test('validateAssumptionsAtomOutput rejects rephrasing without verb prefix', () => {
    const r = validateAssumptionsAtomOutput([
      { id: 'a', label: 'A', rephrasing: 'please make it nicer', confidence: 0.9 },
    ])
    expect(r).toBeNull()
  })

  test('validateAssumptionsAtomOutput accepts verb-prefixed rephrasing', () => {
    const r = validateAssumptionsAtomOutput([
      { id: 'a', label: 'A', rephrasing: 'hide the hero', confidence: 0.9 },
    ])
    expect(r).not.toBeNull()
    expect(r?.[0].rephrasing).toBe('hide the hero')
  })

  test('Token-boundary anchor — "reset" prefix matches but "resetcustom" does not', () => {
    expect(ASSUMPTIONS_VERB_PREFIX_RE.test('reset hero')).toBe(true)
    expect(ASSUMPTIONS_VERB_PREFIX_RE.test('resetCustomThing')).toBe(false)
  })
})

test.describe('R2 M1 — redactKeyShapes covers bare sk- + sk-or-', () => {
  test('source-level: redactKeyShapes has 4 sk-* patterns + AIza + Bearer', () => {
    const src = readFileSync(KEYS, 'utf8')
    expect(src).toMatch(/sk-ant-\[A-Za-z0-9_-\]\{20,\}/)
    expect(src).toMatch(/sk-proj-\[A-Za-z0-9_-\]\{20,\}/)
    expect(src).toMatch(/sk-or-\[A-Za-z0-9_-\]\{20,\}/)
    expect(src).toMatch(/sk-\[A-Za-z0-9_-\]\{20,\}/)
    expect(src).toMatch(/AIza\[0-9A-Za-z_-\]\{35\}/)
    expect(src).toMatch(/Bearer/)
  })
})

test.describe('R2 M2 — cost-cap reserve fails CLOSED to rules when cap unset', () => {
  test('Soft-gate guards against NaN/undefined capUsd via Number.isFinite', () => {
    const src = readFileSync(LLM, 'utf8')
    expect(src).toMatch(/Number\.isFinite\(store\.capUsd\)/)
    expect(src).toMatch(/Number\.isFinite\(store\.sessionUsd\)/)
  })

  test('Old `cap > 0 &&` guard removed (gate fires when cap is 0)', () => {
    const src = readFileSync(LLM, 'utf8')
    // The pre-fix-pass guard should be GONE; the new gate evaluates plainly.
    expect(src).not.toMatch(/cap\s*>\s*0\s*&&/)
    expect(src).toMatch(/sessionUsd\s*>=\s*cap\s*\*\s*ASSUMPTIONS_COST_CAP_RESERVE/)
  })
})

test.describe('R2 S1 — OpenAI adapter handles message.refusal', () => {
  test('openaiAdapter intercepts refusal as invalid_response', () => {
    const src = readFileSync(OPENAI, 'utf8')
    expect(src).toMatch(/refusal/)
    expect(src).toMatch(/safety refusal/)
    expect(src).toMatch(/kind:\s*'invalid_response'/)
  })
})
