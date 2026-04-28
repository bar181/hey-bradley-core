# ADR-057: 2-Step AISP Template Selection

**Status:** Accepted
**Date:** 2026-04-27 (P28 Sprint C P3)
**Deciders:** Bradley Ross
**Phase:** P28

## Context

Sprint C P26 (ADR-053) shipped an AISP-rule-based intent classifier. P27 (ADR-056) added LLM-driven AISP classification using `INTENT_ATOM` verbatim as system prompt. **What was missing:** a structured way for the LLM to *choose* which template to apply when multiple templates could match — and to do so under AISP discipline (the LLM's output is structurally validated against a Σ-restricted schema, not free-form patches).

P28 closes this with a **2-step pipeline**:

1. **Step 1 — Template selection** (NEW): LLM picks the best-fit template ID from the registry given the user input + intent context. AISP-scoped: a `SELECTION_ATOM` Crystal Atom restricts output to `{templateId, confidence, rationale}` only.
2. **Step 2 — Template execution**: Invoke the matched template's regex + envelope as before (same as P23 `tryMatchTemplate`).

For Sprint D content generators (P29+), Step 2 will be replaced with a second LLM call that generates content within the template's structural constraints.

## Decision

### Files

- `src/contexts/intelligence/aisp/templateSelector.ts` — Step 1 (`selectTemplate(text, intent)`)
- `src/contexts/intelligence/aisp/twoStepPipeline.ts` — orchestrator (`runTwoStepPipeline(text, intent)`)
- Both exported via `aisp/index.ts` barrel

### Crystal Atom for Step 1 (Σ-restricted)

```
⟦
  Ω := { Pick best-fit template ID for user intent }
  Σ := { Selection:{templateId:𝕊, confidence:ℝ[0,1], rationale:𝕊} }
  Γ := {
    R1: templateId ∈ enumerated_template_ids,
    R2: confidence ∈ [0,1],
    R3: rationale ≤ 200 chars
  }
  Λ := { confidence_threshold := 0.7 }
  Ε := { V1: VERIFY templateId ∈ Γ.R1.list, V2: VERIFY confidence ∈ [0,1] }
⟧
```

Σ is **deliberately narrower** than P26's `INTENT_ATOM`. Step 1 doesn't need verb/target/params — it just needs a template ID + confidence. Smaller Σ → less ambiguity → cleaner LLM output.

### Confidence threshold = 0.7

Lower than P26 INTENT_ATOM threshold (0.85) because:
- Step 1 output is enum-only (templateId from a closed set); over-confidence risk is structurally bounded
- Step 2 acts as the second gate — if the chosen template's regex doesn't match the user text, the pipeline falls through anyway
- 0.7 lets the LLM commit to a "best guess" when the user input is novel-but-template-able; pipeline absorbs the risk

### Cost-cap budget reserve

`selectTemplate` skips when `sessionUsd ≥ capUsd × 0.75`. Lower than P27 LLM-AISP (0.9) because the 2-step pipeline can spend twice (Step 1 + Step 2 LLM call in Sprint D). Reserve room for both stages.

### Fallthrough behavior

If Step 1 returns null (cap, parse fail, threshold miss, invalid templateId):
- chatPipeline falls through to existing chain: P26 rule-based AISP → P27 LLM AISP → P25 translateIntent → P23 tryMatchTemplate → LLM patch generator

If Step 1 succeeds but Step 2 regex doesn't match:
- Same fallthrough — caller treats it as "LLM was confident but the template's matchPattern is too tight"
- Future improvement (P29+): Step 2 generates patches via LLM when regex doesn't match

### How this differs from P27 LLM-AISP

| Aspect | P27 `llmClassifyIntent` | P28 `selectTemplate` |
|---|---|---|
| Σ scope | full intent shape (verb + target + params) | template ID enum only |
| Output use | constructs canonical text for router | direct template invocation |
| Threshold | 0.85 | 0.70 |
| Cost-cap reserve | 0.9 (single call) | 0.75 (reserves Step 2) |
| Crystal Atom | INTENT_ATOM | SELECTION_ATOM |

Both run; P28's `runTwoStepPipeline` is BEFORE P27's `llmClassifyIntent` in the chatPipeline chain.

## Consequences

- (+) AISP-driven template selection — the user gets the LLM's reasoning ("I picked make-it-brighter because you said 'sunnier feel'") visible in `AISPTranslationPanel` (P29 wires Step 1 selection to the panel)
- (+) Foundation for Sprint D content generators: replace Step 2 regex-match with LLM content generation
- (+) Σ-restricted Crystal Atom = smaller surface = lower LLM hallucination rate
- (+) Closes Sprint C with three Crystal Atoms in repo: `INTENT_ATOM` (intent classification, P26) + `SELECTION_ATOM` (template selection, P28) + system prompt atom (JSON-patch generation, P18 ADR-045). The AISP triad becomes a quartet.
- (-) Adds 1 LLM call per chat input when template selection runs (~$0.001 Haiku)
- (-) Pipeline now has 5 fallthrough layers (was 4); failure modes are larger surface to test

## Cross-references

- ADR-045 (System Prompt AISP, P18) — atom #1
- ADR-053 (AISP Intent Classifier, P26) — atom #2 (INTENT_ATOM)
- ADR-055 (AISP Conversion + Verification, P27) — authoring rubric
- ADR-056 (LLM-Native AISP Understanding, P27) — sibling thesis claim
- ADR-057 — atom #3 (SELECTION_ATOM, this doc)
- `bar181/aisp-open-core ai_guide` v5.1 Platinum — canonical spec

## Status as of P28 seal

- `templateSelector.ts` shipped with SELECTION_ATOM ✅
- `twoStepPipeline.ts` orchestrator shipped ✅
- AISP barrel exports both ✅
- `selectTemplate` cost-cap-aware (0.75 budget reserve) ✅
- 6 pure-unit tests (Zod schema + threshold + atom shape) ✅
- Build green; tsc clean ✅
- Sprint C closes with 3 Crystal Atoms in production code ✅
