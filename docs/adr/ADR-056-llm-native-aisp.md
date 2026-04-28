# ADR-056: LLM-Native AISP Understanding — Capstone Thesis Claim

**Status:** Accepted
**Date:** 2026-04-27 (P27 Sprint C P2)
**Deciders:** Bradley Ross
**Phase:** P27

> **Note on numbering:** ADR-054 = DDD Bounded Contexts (P21); ADR-055 = AISP Conversion + Verification (P27 sibling). This is **ADR-056**.

## Context

Sprint C P1 (ADR-053, P26) shipped the AISP Crystal Atom + a rule-based classifier. The thesis claim — *"AISP is what LLMs understand natively"* — needed a stronger demonstration: send the **same Crystal Atom** to an LLM as system prompt and observe whether it produces conforming structured output without prose translation.

This ADR codifies the Sprint C P2 implementation: `llmClassifyIntent(text)` sends `INTENT_ATOM` verbatim as system prompt, parses the LLM's JSON response through the Σ-mirroring Zod schema, and returns a `ClassifiedIntent` when `confidence ≥ 0.85`.

## Decision

### Pipeline (post-P27)

```
user input
  ↓
classifyIntent (rule-based, P26)            ← $0; runs first
  ├── confidence ≥ 0.85 + target → emit Intent
  └── < 0.85 OR no target →
       ↓
      llmClassifyIntent (NEW P27)            ← LLM call w/ INTENT_ATOM verbatim
        ├── Zod-valid + confidence ≥ 0.85 → emit Intent
        └── invalid OR < threshold → fall through to:
             ↓
           translateIntent (P25 rule-based)
             ↓
           tryMatchTemplate (P23+P24)
             ↓
           LLM patch generator (P18)
```

### LLM call shape

- **System prompt:** `INTENT_ATOM` (verbatim) + a 5-line wrapper specifying JSON-only response shape per Σ
- **User prompt:** the raw user input
- **Model:** whichever the user chose (Haiku / Flash / OpenRouter free tier — cost-cap-aware)
- **Response:** JSON object validated against `llmIntentResponseSchema` (Zod mirror of Σ)
- **Cost-cap pre-check:** skip LLM AISP call if `sessionUsd ≥ capUsd × 0.9` (preserves capacity for the actual chat completion)

### Why the Crystal Atom is sent verbatim

The thesis claim: AISP's symbolic vocabulary is dense enough that a competent LLM can:
1. Parse `Σ:Glossary` to know the verb enum + target type set
2. Parse `Γ:Topologics` to know the rules (1-based ordinals; type ∈ allowed enum)
3. Parse `Λ:Logistics` to know the confidence threshold
4. Parse `Ε:Evaluation` to know what to verify before responding

If the LLM reliably produces conforming output with NO prose preamble or English explanation in the prompt, the thesis is demonstrated. P27 ships this loop; analytics from `llm_logs` will measure conformance rate over time.

### What "user-visible AISP" looks like (A2 deliverable)

`src/components/shell/AISPTranslationPanel.tsx` — collapsible "How I understood this" surface in the chat. Shows:
- input text
- verb / target / confidence / rationale
- **source pill**: Rules (emerald) | LLM (indigo) | Fallthrough (amber)

Capstone reviewers see the AISP intermediate step is real — not just a backend abstraction.

### Trade-offs accepted

- **Per-classification LLM cost.** Each AISP-LLM call costs ~$0.001 (Haiku). Cost-cap pre-check at 90% of session budget prevents AISP-LLM from starving the actual chat completion.
- **LLM may hallucinate verbs outside the enum.** Zod schema rejects → falls through to rule-based + LLM patch generator. Defensive design.
- **Markdown fences in LLM output.** `safeParseJson` strips ```json fences before parsing. Tested.
- **Confidence threshold 0.85 unchanged from P26.** Both rule-based AND LLM classifications must clear the same bar.

## Consequences

- (+) **Capstone thesis demonstration is concrete:** repo contains `INTENT_ATOM` constant + `llmClassifyIntent()` function + `AISPTranslationPanel` UI — three artifacts proving "LLMs understand AISP natively"
- (+) Higher template-router hit rate (LLM extracts intent from messy English the rule-based classifier missed)
- (+) Foundation for Sprint C P28 (2-step template selection — first LLM picks theme via AISP; second LLM modifies)
- (+) `AISPTranslationPanel` makes the symbolic layer transparent to users (and reviewers)
- (-) Adds 1 LLM call per low-confidence chat input (~$0.001; bounded by cost-cap)
- (-) Conformance-rate analytics deferred to Sprint D (no live dashboard yet)

## Cross-references

- ADR-045 (System Prompt AISP, P18) — sibling Crystal Atom for JSON-patch generation
- ADR-053 (AISP Intent Classifier — rules, P26) — fallback layer when LLM is over-cap or invalid
- ADR-055 (AISP Conversion + Verification, P27) — authoring rubric for AISP documents
- `bar181/aisp-open-core ai_guide` v5.1 Platinum — canonical AISP spec
- `src/contexts/intelligence/aisp/llmClassifier.ts` — the implementation
- `src/components/shell/AISPTranslationPanel.tsx` — the user-visible surface

## Status as of P27 seal

- `llmClassifyIntent(text)` shipped ✅
- Zod schema (`src/lib/schemas/intent.ts`) mirrors Σ exactly ✅
- chatPipeline runs LLM AISP only when rule-based < threshold ✅
- Cost-cap pre-check (`sessionUsd ≥ capUsd × 0.9` skip) ✅
- `AISPTranslationPanel` component (UI) shipped — collapsible "How I understood this" ✅
- 7+ unit tests with mocked Zod responses ✅
- ADR-053/055/056 form the AISP triad in the repo ✅
- Build green; tsc clean ✅
