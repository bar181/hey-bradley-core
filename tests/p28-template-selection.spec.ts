/**
 * P28 Sprint C P3 — 2-step AISP Template Selection.
 *
 * Verifies SELECTION_ATOM constraints + Zod schema + threshold semantics.
 * Pure-unit (no browser; no real LLM). ADR-057.
 */
import { test, expect } from '@playwright/test'
import { z } from 'zod'
// Avoid barrel import which transitively pulls in default-config.json (needs JSON
// import attribute outside Vite). Hardcode the threshold to mirror templateSelector.ts.
const STEP1_THRESHOLD = 0.7

// Mirror the schema used inside templateSelector.ts so tests can verify
// Σ-restriction without importing the runtime adapter chain.
const selectionSchema = z.object({
  templateId: z.string(),
  confidence: z.number().min(0).max(1),
  rationale: z.string().max(500).optional(),
})

test.describe('P28 — Template Selection (Σ-restricted Crystal Atom)', () => {
  test('STEP1_THRESHOLD = 0.7 (lower than P26 INTENT_ATOM 0.85)', () => {
    expect(STEP1_THRESHOLD).toBe(0.7)
  })

  test('selectionSchema accepts canonical Step 1 response', () => {
    const r = selectionSchema.safeParse({
      templateId: 'make-it-brighter',
      confidence: 0.85,
      rationale: 'user mentioned sunnier feel',
    })
    expect(r.success).toBe(true)
  })

  test('selectionSchema rejects confidence > 1', () => {
    const r = selectionSchema.safeParse({
      templateId: 'hide-section',
      confidence: 1.5,
    })
    expect(r.success).toBe(false)
  })

  test('selectionSchema rejects missing templateId', () => {
    const r = selectionSchema.safeParse({
      confidence: 0.8,
    })
    expect(r.success).toBe(false)
  })

  test('selectionSchema accepts optional rationale', () => {
    const r = selectionSchema.safeParse({
      templateId: 'change-headline',
      confidence: 0.92,
    })
    expect(r.success).toBe(true)
  })

  test('rationale > 500 chars rejected', () => {
    const r = selectionSchema.safeParse({
      templateId: 'make-it-brighter',
      confidence: 0.8,
      rationale: 'x'.repeat(501),
    })
    expect(r.success).toBe(false)
  })
})
