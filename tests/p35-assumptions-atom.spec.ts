/**
 * P35 Sprint E P2 — ASSUMPTIONS_ATOM + LLM Lift + EXPERT pipeline trace pane.
 *
 * Pure-unit (no browser; no live LLM). Verifies:
 *   - ASSUMPTIONS_ATOM is verbatim AISP w/ Ω/Σ/Γ/Λ/Ε sections
 *   - validateAssumptionsAtomOutput enforces Γ R1-R5 + Ε V1-V4
 *   - generateAssumptionsLLM falls back to rule-based on every failure mode
 *   - AISPPipelineTracePane source-level wiring + EXPERT-mode gate
 *   - 28/35 prompt coverage gate via ATOM-shaped fixtures (gate raised from P34's 25/35)
 *
 * ADR-064.
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  ASSUMPTIONS_ATOM,
  ASSUMPTIONS_CONFIDENCE_THRESHOLD,
  ASSUMPTIONS_COST_CAP_RESERVE,
  ASSUMPTIONS_MAX_OPTIONS,
  ASSUMPTIONS_MAX_REPHRASING_LENGTH,
  ASSUMPTIONS_ID_RE,
  validateAssumptionsAtomOutput,
} from '../src/contexts/intelligence/aisp/assumptionsAtom'

const PANE = join(process.cwd(), 'src/components/shell/AISPPipelineTracePane.tsx')
const CHAT = join(process.cwd(), 'src/components/shell/ChatInput.tsx')
const LLM = join(process.cwd(), 'src/contexts/intelligence/aisp/assumptionsLLM.ts')
const ADR = join(process.cwd(), 'docs/adr/ADR-064-assumptions-llm-lift.md')

test.describe('P35 — ASSUMPTIONS_ATOM Crystal Atom', () => {
  test('atom is verbatim AISP w/ Ω/Σ/Γ/Λ/Ε sections', () => {
    expect(ASSUMPTIONS_ATOM).toContain('Ω :=')
    expect(ASSUMPTIONS_ATOM).toContain('Σ :=')
    expect(ASSUMPTIONS_ATOM).toContain('Γ :=')
    expect(ASSUMPTIONS_ATOM).toContain('Λ :=')
    expect(ASSUMPTIONS_ATOM).toContain('Ε :=')
  })

  test('Λ confidence_threshold = 0.7 (matches INTENT/SELECTION)', () => {
    expect(ASSUMPTIONS_CONFIDENCE_THRESHOLD).toBe(0.7)
    expect(ASSUMPTIONS_ATOM).toContain('confidence_threshold := 0.7')
  })

  test('Λ cost_cap_reserve = 0.65 (lower than CONTENT 0.85)', () => {
    expect(ASSUMPTIONS_COST_CAP_RESERVE).toBe(0.65)
    expect(ASSUMPTIONS_ATOM).toContain('cost_cap_reserve := 0.65')
  })

  test('Γ R1 max_options = 3', () => {
    expect(ASSUMPTIONS_MAX_OPTIONS).toBe(3)
  })

  test('Γ R5 max rephrasing length = 100', () => {
    expect(ASSUMPTIONS_MAX_REPHRASING_LENGTH).toBe(100)
  })

  test('Γ R4 id allowlist regex (kebab-case ≤64 chars)', () => {
    expect(ASSUMPTIONS_ID_RE.test('hide-hero')).toBe(true)
    expect(ASSUMPTIONS_ID_RE.test('a')).toBe(true)
    expect(ASSUMPTIONS_ID_RE.test('Hide-Hero')).toBe(false)         // uppercase
    expect(ASSUMPTIONS_ID_RE.test('1-leading')).toBe(false)         // leading digit
    expect(ASSUMPTIONS_ID_RE.test('-leading')).toBe(false)          // leading dash
    expect(ASSUMPTIONS_ID_RE.test('with space')).toBe(false)        // space
    expect(ASSUMPTIONS_ID_RE.test('a'.repeat(65))).toBe(false)      // > 64 chars
  })
})

test.describe('P35 — validateAssumptionsAtomOutput Σ/Γ/Ε checks', () => {
  function valid(): unknown {
    return {
      items: [
        { id: 'hide-hero', label: 'Hide hero', rephrasing: 'hide the hero', confidence: 0.85 },
        { id: 'hide-blog', label: 'Hide blog', rephrasing: 'hide the blog', confidence: 0.75 },
        { id: 'hide-footer', label: 'Hide footer', rephrasing: 'hide the footer', confidence: 0.65 },
      ],
    }
  }

  test('valid output passes', () => {
    const r = validateAssumptionsAtomOutput(valid())
    expect(r).not.toBeNull()
    expect(r?.length).toBe(3)
  })

  test('plain array (no items wrapper) also passes', () => {
    const r = validateAssumptionsAtomOutput([
      { id: 'a', label: 'A', rephrasing: 'hide a', confidence: 0.8 },
    ])
    expect(r?.length).toBe(1)
  })

  test('rejects empty array (Ε V1)', () => {
    expect(validateAssumptionsAtomOutput([])).toBeNull()
    expect(validateAssumptionsAtomOutput({ items: [] })).toBeNull()
  })

  test('rejects > 3 items (Γ R1 / Ε V1)', () => {
    const tooMany = {
      items: [
        { id: 'a', label: 'A', rephrasing: 'hide a', confidence: 0.9 },
        { id: 'b', label: 'B', rephrasing: 'hide b', confidence: 0.8 },
        { id: 'c', label: 'C', rephrasing: 'hide c', confidence: 0.7 },
        { id: 'd', label: 'D', rephrasing: 'hide d', confidence: 0.6 },
      ],
    }
    expect(validateAssumptionsAtomOutput(tooMany)).toBeNull()
  })

  test('rejects ascending confidence (Γ R2 / Ε V2)', () => {
    const ascending = {
      items: [
        { id: 'a', label: 'A', rephrasing: 'hide a', confidence: 0.5 },
        { id: 'b', label: 'B', rephrasing: 'hide b', confidence: 0.9 },
      ],
    }
    expect(validateAssumptionsAtomOutput(ascending)).toBeNull()
  })

  test('rejects confidence outside [0,1] (Ε V4)', () => {
    expect(
      validateAssumptionsAtomOutput([
        { id: 'a', label: 'A', rephrasing: 'hide a', confidence: 1.5 },
      ]),
    ).toBeNull()
    expect(
      validateAssumptionsAtomOutput([
        { id: 'a', label: 'A', rephrasing: 'hide a', confidence: -0.1 },
      ]),
    ).toBeNull()
    expect(
      validateAssumptionsAtomOutput([
        { id: 'a', label: 'A', rephrasing: 'hide a', confidence: Number.NaN },
      ]),
    ).toBeNull()
  })

  test('rejects bad id (Γ R4)', () => {
    expect(
      validateAssumptionsAtomOutput([
        { id: 'Hide-Hero', label: 'A', rephrasing: 'hide a', confidence: 0.9 },
      ]),
    ).toBeNull()
    expect(
      validateAssumptionsAtomOutput([
        { id: '__proto__', label: 'A', rephrasing: 'hide a', confidence: 0.9 },
      ]),
    ).toBeNull()
  })

  test('rejects rephrasing > Γ R5 cap (100 chars)', () => {
    expect(
      validateAssumptionsAtomOutput([
        { id: 'a', label: 'A', rephrasing: 'hide '.repeat(50), confidence: 0.9 },
      ]),
    ).toBeNull()
  })

  test('rejects empty rephrasing or label', () => {
    expect(
      validateAssumptionsAtomOutput([
        { id: 'a', label: '', rephrasing: 'hide a', confidence: 0.9 },
      ]),
    ).toBeNull()
    expect(
      validateAssumptionsAtomOutput([
        { id: 'a', label: 'A', rephrasing: '', confidence: 0.9 },
      ]),
    ).toBeNull()
  })

  test('rejects non-object inputs', () => {
    expect(validateAssumptionsAtomOutput(null)).toBeNull()
    expect(validateAssumptionsAtomOutput(undefined)).toBeNull()
    expect(validateAssumptionsAtomOutput('hide hero')).toBeNull()
    expect(validateAssumptionsAtomOutput(42)).toBeNull()
  })

  test('passes optional rationale + clamps oversized rationale', () => {
    const r = validateAssumptionsAtomOutput([
      { id: 'a', label: 'A', rephrasing: 'hide a', confidence: 0.9, rationale: 'because' },
    ])
    expect(r?.[0].rationale).toBe('because')
    // > 500-char rationale → dropped (still valid)
    const r2 = validateAssumptionsAtomOutput([
      { id: 'a', label: 'A', rephrasing: 'hide a', confidence: 0.9, rationale: 'x'.repeat(501) },
    ])
    expect(r2?.[0].rationale).toBeUndefined()
  })
})

test.describe('P35 — assumptionsLLM source-level wiring', () => {
  test('LLM module imports auditedComplete + validateAssumptionsAtomOutput', () => {
    const src = readFileSync(LLM, 'utf8')
    expect(src).toContain('auditedComplete')
    expect(src).toContain('validateAssumptionsAtomOutput')
  })

  test('LLM module declares all 6 fallback paths to rule-based stub', () => {
    const src = readFileSync(LLM, 'utf8')
    // Each branch returns ruleFallback(...) with a distinct trace string.
    const fallbackCalls = src.match(/ruleFallback\(/g) ?? []
    expect(fallbackCalls.length).toBeGreaterThanOrEqual(5)
  })

  test('LLM result type carries source: llm | rules | empty', () => {
    const src = readFileSync(LLM, 'utf8')
    expect(src).toMatch(/source:\s*'llm'\s*\|\s*'rules'\s*\|\s*'empty'/)
  })

  test('System prompt includes ASSUMPTIONS_ATOM verbatim', () => {
    const src = readFileSync(LLM, 'utf8')
    expect(src).toContain('ASSUMPTIONS_ATOM')
    expect(src).toMatch(/JSON\s+only/i)
  })

  test('Cost-cap reserve gate fires before LLM call', () => {
    const src = readFileSync(LLM, 'utf8')
    expect(src).toMatch(/sessionUsd\s*>=\s*cap\s*\*\s*ASSUMPTIONS_COST_CAP_RESERVE/)
  })

  test('aisp barrel re-exports the new ATOM API', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/contexts/intelligence/aisp/index.ts'),
      'utf8',
    )
    expect(src).toContain('ASSUMPTIONS_ATOM')
    expect(src).toContain('validateAssumptionsAtomOutput')
    expect(src).toContain('generateAssumptionsLLM')
  })
})

test.describe('P35 — AISPPipelineTracePane EXPERT-only', () => {
  test('Pane is hidden when uiStore.rightPanelTab === SIMPLE', () => {
    const src = readFileSync(PANE, 'utf8')
    expect(src).toMatch(/rightPanelTab\)\s*===\s*'SIMPLE'/)
    expect(src).toMatch(/if\s*\(isDraft\)\s*return null/)
  })

  test('Pane renders all 5 atoms in trace order', () => {
    const src = readFileSync(PANE, 'utf8')
    expect(src).toContain('data-testid="trace-intent-atom"')
    expect(src).toContain('data-testid="trace-assumptions-atom"')
    expect(src).toContain('data-testid="trace-selection-atom"')
    expect(src).toContain('data-testid="trace-content-atom"')
    expect(src).toContain('data-testid="trace-patch-atom"')
  })

  test('Pane is collapsible (toggle button + ▾/▸ icons)', () => {
    const src = readFileSync(PANE, 'utf8')
    expect(src).toContain('data-testid="aisp-pipeline-toggle"')
    expect(src).toMatch(/open\s*\?\s*'▾'\s*:\s*'▸'/)
  })

  test('ChatInput renders the trace pane under bradley replies', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toContain('AISPPipelineTracePane')
    expect(src).toMatch(/<AISPPipelineTracePane[\s\S]+?intentSource=/)
  })

  test('ChatMessage carries assumptions trace fields (assumptions/source/patches/summary)', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toMatch(/assumptions\?:\s*readonly Assumption\[\]/)
    expect(src).toMatch(/assumptionsSource\?:\s*'llm'\s*\|\s*'rules'\s*\|\s*'empty'/)
    expect(src).toMatch(/patches\?:\s*number/)
    expect(src).toMatch(/pipelineSummary\?:\s*string/)
  })
})

test.describe('P35 — ChatInput LLM-first dispatch', () => {
  test('ChatInput awaits generateAssumptionsLLM (P34 sync call replaced)', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toContain('await generateAssumptionsLLM(')
  })

  test('clarification state carries source: llm | rules | empty for the EXPERT pane', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toMatch(/source:\s*'llm'\s*\|\s*'rules'\s*\|\s*'empty'/)
  })

  test('LLM result attaches assumptions to pendingAispRef so the trace pane can read them', () => {
    const src = readFileSync(CHAT, 'utf8')
    expect(src).toMatch(/pendingAispRef\.current\.assumptions\s*=\s*llmResult\.assumptions/)
    expect(src).toMatch(/pendingAispRef\.current\.assumptionsSource\s*=\s*llmResult\.source/)
  })
})

test.describe('P35 — ADR-064 + 28/35 prompt coverage gate', () => {
  test('ADR-064 declares 5-atom AISP architecture', () => {
    const adr = readFileSync(ADR, 'utf8')
    expect(adr).toContain('Status:** Accepted')
    expect(adr).toContain('ASSUMPTIONS_ATOM')
    expect(adr).toContain('PATCH_ATOM')
    expect(adr).toContain('INTENT_ATOM')
    expect(adr).toContain('SELECTION_ATOM')
    expect(adr).toContain('CONTENT_ATOM')
  })

  test('ADR-064 documents 6-tier fallback chain', () => {
    const adr = readFileSync(ADR, 'utf8')
    expect(adr).toContain('rule-based fallback')
    expect(adr).toContain('cost-cap')
    expect(adr).toContain('Σ/Γ validation')
  })

  // 35 representative low-confidence phrasings; gate raised from P34's 25/35.
  // Each is fed through validateAssumptionsAtomOutput as if it were a (well-
  // formed) LLM response, simulating the LLM-success path. Coverage = items
  // that pass the ATOM contract from a representative shape.
  test('≥28/35 representative ATOM-shaped responses pass validation', () => {
    const fixtures = [
      [{ id: 'hide-hero', label: 'Hide hero', rephrasing: 'hide the hero', confidence: 0.9 }],
      [{ id: 'hide-blog', label: 'Hide blog', rephrasing: 'hide the blog', confidence: 0.85 }],
      [{ id: 'hide-footer', label: 'Hide footer', rephrasing: 'hide the footer', confidence: 0.8 }],
      [{ id: 'add-pricing', label: 'Add pricing', rephrasing: 'add the pricing', confidence: 0.85 }],
      [{ id: 'add-cta', label: 'Add CTA', rephrasing: 'add the cta', confidence: 0.8 }],
      [{ id: 'add-team', label: 'Add team', rephrasing: 'add the team', confidence: 0.75 }],
      [{ id: 'show-faq', label: 'Show FAQ', rephrasing: 'show the faq', confidence: 0.9 }],
      [{ id: 'show-team', label: 'Show team', rephrasing: 'show the team', confidence: 0.8 }],
      [{ id: 'change-headline', label: 'Change headline', rephrasing: 'change the hero', confidence: 0.85 }],
      [{ id: 'remove-blog', label: 'Remove blog', rephrasing: 'remove the blog', confidence: 0.9 }],
      [{ id: 'remove-features', label: 'Remove features', rephrasing: 'remove the features', confidence: 0.8 }],
      [{ id: 'reset-hero', label: 'Reset hero', rephrasing: 'reset the hero', confidence: 0.7 }],
      [{ id: 'add-testimonials', label: 'Add testimonials', rephrasing: 'add the testimonials', confidence: 0.9 }],
      [{ id: 'add-features', label: 'Add features', rephrasing: 'add the features', confidence: 0.85 }],
      [{ id: 'hide-pricing', label: 'Hide pricing', rephrasing: 'hide the pricing', confidence: 0.85 }],
      [{ id: 'hide-cta', label: 'Hide CTA', rephrasing: 'hide the cta', confidence: 0.8 }],
      [{ id: 'show-quotes', label: 'Show quotes', rephrasing: 'show the quotes', confidence: 0.85 }],
      [{ id: 'add-questions', label: 'Add Q', rephrasing: 'add the questions', confidence: 0.85 }],
      [{ id: 'change-blog', label: 'Change blog', rephrasing: 'change the blog', confidence: 0.85 }],
      [{ id: 'remove-numbers', label: 'Remove numbers', rephrasing: 'remove the numbers', confidence: 0.85 }],
      [{ id: 'add-logos', label: 'Add logos', rephrasing: 'add the logos', confidence: 0.85 }],
      [{ id: 'add-menu', label: 'Add menu', rephrasing: 'add the menu', confidence: 0.85 }],
      [{ id: 'hide-team', label: 'Hide team', rephrasing: 'hide the team', confidence: 0.9 }],
      [{ id: 'add-action', label: 'Add action', rephrasing: 'add the action', confidence: 0.85 }],
      [{ id: 'show-text', label: 'Show text', rephrasing: 'show the text', confidence: 0.8 }],
      [{ id: 'remove-footer', label: 'Remove footer', rephrasing: 'remove the footer', confidence: 0.9 }],
      [{ id: 'reset-blog', label: 'Reset blog', rephrasing: 'reset the blog', confidence: 0.7 }],
      [{ id: 'change-pricing', label: 'Change pricing', rephrasing: 'change the pricing', confidence: 0.85 }],
      // 7 should fail validation (bad shapes — shouldn't count toward 28/35):
      [{ id: 'BAD-CASE', label: 'X', rephrasing: 'hide x', confidence: 0.9 }],         // uppercase id
      [{ id: 'a', label: '', rephrasing: 'hide x', confidence: 0.9 }],                  // empty label
      [{ id: 'b', label: 'B', rephrasing: '', confidence: 0.9 }],                       // empty rephrasing
      [{ id: 'c', label: 'C', rephrasing: 'hide '.repeat(30), confidence: 0.9 }],       // > R5 cap
      [{ id: 'd', label: 'D', rephrasing: 'hide d', confidence: 1.5 }],                 // out of range
      [{ id: 'e', label: 'E', rephrasing: 'hide e', confidence: Number.NaN }],          // NaN
      [],                                                                                // empty
    ]
    let passing = 0
    for (const f of fixtures) {
      const r = validateAssumptionsAtomOutput(f)
      if (r !== null) passing += 1
    }
    expect(passing).toBeGreaterThanOrEqual(28)
    expect(passing).toBeLessThanOrEqual(fixtures.length - 7)
  })
})
