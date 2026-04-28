/**
 * P35 Sprint E P2 — AISP Crystal Atom for Assumption Generation.
 *
 * Per `bar181/aisp-open-core ai_guide`. The Crystal Atom is the canonical
 * AISP shape: Ω (Objective) Σ (Structure) Γ (Grounding) Λ (Logistics)
 * Ε (Evaluation).
 *
 * ASSUMPTIONS_ATOM is the 5th Crystal Atom in the production pipeline:
 *   1. PATCH_ATOM       (P18 / ADR-045) — JSON-Patch envelope
 *   2. INTENT_ATOM      (P26 / ADR-053) — verb + target classification
 *   3. SELECTION_ATOM   (P28 / ADR-057) — which template handles it
 *   4. CONTENT_ATOM     (P31 / ADR-060) — generate text fields
 *   5. ASSUMPTIONS_ATOM (P35 / ADR-064) — rank low-confidence interpretations
 *
 * ASSUMPTIONS_ATOM fires ONLY when INTENT_ATOM confidence < 0.7. Σ output is
 * up to 3 ranked Assumption objects with confidence + rephrasing. Output
 * shape mirrors the rule-based stub from P34 so the LLM and stub are
 * implementation-swappable behind the same contract.
 *
 * ADR-064.
 */

/** The Crystal Atom for assumption generation (verbatim AISP). */
export const ASSUMPTIONS_ATOM = `⟦
  Ω := { Generate up to 3 ranked candidate assumptions for a low-confidence user request }
  Σ := {
    Assumption:{id:𝕊, label:𝕊, rephrasing:𝕊, confidence:ℝ∈[0,1], rationale:𝕊?},
    AssumptionList:{items:[Assumption], count:ℕ∈[0,3]},
    𝕊 := UTF-8 string ≤ 200 chars
  }
  Γ := {
    R1: AssumptionList.count ≤ 3,
    R2: ∀ Assumption.confidence ∈ [0,1] and DESCENDING by index,
    R3: ∀ Assumption.rephrasing constructed from {verb-enum} ∪ {target-enum-from-INTENT_ATOM},
        NOT free-text echo of user input,
    R4: id matches /^[a-z][a-z0-9-]{0,63}$/,
    R5: rephrasing length(text) ≤ 100 chars (single-line clarification button copy)
  }
  Λ := {
    confidence_threshold := 0.7,
    cost_cap_reserve := 0.65,
    max_options := 3,
    fallback := rule-based generateAssumptions (P34 / ADR-063)
  }
  Ε := {
    V1: VERIFY items.length ≤ 3,
    V2: VERIFY ∀i: items[i].confidence ≥ items[i+1].confidence,
    V3: VERIFY ∀ rephrasing matches Γ R3 enum-construction predicate,
    V4: VERIFY ∀ id matches Γ R4
  }
⟧`

/** Λ confidence threshold above which the atom's output is trusted. */
export const ASSUMPTIONS_CONFIDENCE_THRESHOLD = 0.7

/** Λ cost-cap reserve — fraction of remaining budget the atom may consume. */
export const ASSUMPTIONS_COST_CAP_RESERVE = 0.65

/** Λ max output count enforced by Γ R1. */
export const ASSUMPTIONS_MAX_OPTIONS = 3

/** Γ R5 max button-copy length per option. */
export const ASSUMPTIONS_MAX_REPHRASING_LENGTH = 100

/** Γ R4 id allowlist regex — same shape as user_templates RESERVED_IDS. */
export const ASSUMPTIONS_ID_RE = /^[a-z][a-z0-9-]{0,63}$/

/** Γ Σ — the runtime reflection of the atom's Assumption shape. */
export interface AssumptionAtomItem {
  id: string
  label: string
  rephrasing: string
  confidence: number
  rationale?: string
}

/**
 * Validate an LLM response against ASSUMPTIONS_ATOM Σ + Γ rules.
 * Returns the validated array on success, or null when any Ε V check fails.
 *
 * Caller (assumptionsLLM) falls back to the P34 rule-based generator on null.
 */
export function validateAssumptionsAtomOutput(raw: unknown): AssumptionAtomItem[] | null {
  // Γ R1: must be a structured array (or wrapped object with items).
  let items: unknown
  if (Array.isArray(raw)) {
    items = raw
  } else if (raw && typeof raw === 'object' && Array.isArray((raw as { items?: unknown }).items)) {
    items = (raw as { items: unknown[] }).items
  } else {
    return null
  }
  const arr = items as unknown[]
  // Ε V1
  if (arr.length === 0 || arr.length > ASSUMPTIONS_MAX_OPTIONS) return null

  const validated: AssumptionAtomItem[] = []
  for (const x of arr) {
    if (typeof x !== 'object' || x === null) return null
    const r = x as Record<string, unknown>
    // Γ R4: id allowlist
    if (typeof r.id !== 'string' || !ASSUMPTIONS_ID_RE.test(r.id)) return null
    // Γ Σ string fields
    if (typeof r.label !== 'string' || r.label.length === 0) return null
    if (typeof r.rephrasing !== 'string' || r.rephrasing.length === 0) return null
    // Γ R5: rephrasing length cap
    if (r.rephrasing.length > ASSUMPTIONS_MAX_REPHRASING_LENGTH) return null
    // Ε V4: confidence in [0,1]
    if (typeof r.confidence !== 'number') return null
    if (!Number.isFinite(r.confidence)) return null
    if (r.confidence < 0 || r.confidence > 1) return null
    // Optional rationale
    const rationale =
      typeof r.rationale === 'string' && r.rationale.length <= 500
        ? r.rationale
        : undefined
    validated.push({
      id: r.id,
      label: r.label.slice(0, 200),
      rephrasing: r.rephrasing,
      confidence: r.confidence,
      rationale,
    })
  }
  // Ε V2: confidences must be strictly non-increasing
  for (let i = 1; i < validated.length; i++) {
    if (validated[i].confidence > validated[i - 1].confidence) return null
  }
  return validated
}
