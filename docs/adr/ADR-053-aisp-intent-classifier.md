# ADR-053: AISP Intent Classifier — Crystal Atom for Intent Recognition

**Status:** Accepted
**Date:** 2026-04-27 (P26 Sprint C Phase 1)
**Deciders:** Bradley Ross
**Phase:** P26

> **Note on numbering:** This ADR-053 (P26) supersedes the earlier P21 stub at the same number. The P21 stub was scoped as "AISP Intent Classifier — proposed Sprint C P26"; this is the full Accepted version.

## Context

Sprint B (P23-P25) shipped:
- **Templates** (P23): regex matchers + pre-validated patches; LLM short-circuit
- **Scope tokens** (P24): `/type-N` for multi-instance configs
- **Rule-based intent translator** (P25): verbs/types/ordinals → canonical form

Sprint C kicks off with the **AISP layer**. The thesis claim — "AISP is a math-first symbolic protocol that LLMs understand natively at <2% ambiguity" — needs a user-facing demonstration. P26 ships the foundation: an **AISP Crystal Atom for intent classification** that conforms to the canonical Ω/Σ/Γ/Λ/Ε structure per `bar181/aisp-open-core ai_guide`.

## Decision

### Crystal Atom for intent

```
⟦
  Ω := { Classify user input into typed Intent for template router }
  Σ := {
    Intent:{verb:Verb, target:Target?, params:𝕊?},
    Verb:{op∈{hide,show,change,remove,add,reset}},
    Target:{type:𝕊, index:ℕ?},
    𝕊 := UTF-8 string ≤ 200 chars
  }
  Γ := {
    R1: ∀ Intent : Verb is one of the enumerated 6 ops,
    R2: target.index ∈ ℕ ⇒ index ≥ 1 (1-based user-facing),
    R3: target.type ∈ {hero, blog, footer, ...},
    R4: params is verb-specific; only when verb ∈ {change, add}
  }
  Λ := {
    confidence_threshold := 0.85,
    fallback := translateIntent (P25) → tryMatchTemplate (P23/P24)
  }
  Ε := {
    V1: VERIFY Verb ∈ Σ.Verb.op,
    V2: VERIFY target.type ∈ Σ.Target allowed enum (R3),
    V3: VERIFY confidence ∈ [0,1]
  }
⟧
```

### Implementation

P26 ships a **rule-based classifier** that conforms to the atom shape:
- `classifyIntent(text)` returns `{ verb, target, params, confidence, rationale }`
- Verb vocabulary: 9 regex rules across {hide, show, change, remove, add, reset} + synonyms
- Target inference: scope-token first (`/blog-2`), then type-word + ordinal heuristic
- Params: extracts `to "X"` payload for verbs ∈ {change, add}
- Confidence: verb-rule-base × target-presence (penalty 0.15 when target absent)

### Pipeline integration

```
chatPipeline.submit()
  ↓
classifyIntent(text)              ← NEW (P26)
  ├── confidence ≥ 0.85 + target → construct canonical text
  │     verb + /type-index + " to value"
  │     ↓
  │   tryMatchTemplate(constructed) → patch OR LLM
  └── confidence < 0.85 → translateIntent (P25 rule-based)
        ↓
       tryMatchTemplate(translated) → patch OR LLM
```

### Why rule-based at P26

- **$0 cost** — every chat input runs through classifier; LLM-driven would 10× the cost-cap math
- **Deterministic** — repeated input → same classification; no nondeterminism for testing
- **Idempotent** — canonical input passes through unchanged
- **AISP shape contract verified at runtime** (Ε V1+V2 checked via TypeScript enum membership)
- **Sprint C P27** is where the LLM-driven probabilistic version lands; P26 ships the foundation + Crystal Atom

### What's NEW vs P25 (rule-based translator)

| Aspect | P25 translator | P26 AISP classifier |
|---|---|---|
| Output shape | `{ canonicalText, unchanged, rationale }` | `{ verb, target, params, confidence, rationale }` |
| Crystal Atom | none (rule tables only) | YES (Ω/Σ/Γ/Λ/Ε) |
| Confidence | binary | scored per verb rule |
| Output use | string for next router | structured object → constructed canonical |
| Capstone-relevant | foundation | YES — first user-visible AISP surface |

## Trade-offs accepted

- **Rule-based not learned** at P26. Sprint C P27 introduces LLM-driven classification when rule confidence < threshold.
- **9 verb rules** is intentionally small. Sprint C P27/P28 grow vocabulary via AISP-driven expansion.
- **Confidence-vs-target coupling** — target absence imposes 0.15 penalty. Acceptable heuristic; tunable.

## Consequences

- (+) Capstone-thesis demonstration: AISP visible to users (AISP-routed intents include rationale string)
- (+) Foundation for Sprint C P27 LLM-driven classifier (same Crystal Atom; replace rule-based body with LLM call)
- (+) Cost discipline preserved — all P26 work is $0
- (+) Backward compat: P23/P24/P25 tests unchanged; rule-based path is fallback
- (-) +1 module (~150 LOC); +1 import in chatPipeline
- (-) AISP confidence threshold (0.85) is a single-number tuning; Sprint C may need per-verb thresholds

## Cross-references

- ADR-045 (System Prompt AISP; P18) — sibling Crystal Atom for JSON-patch generation
- ADR-050 (Template-First Chat; P23) — consumer of AISP-routed canonical text
- ADR-051 (Section Targeting; P24) — scope-token syntax used by AISP target inference
- ADR-052 (Intent Translator; P25) — fallback path when AISP confidence is low
- `bar181/aisp-open-core ai_guide` — Crystal Atom canonical spec

## Status as of P26 seal

- Crystal Atom exported as `INTENT_ATOM` constant ✅
- `classifyIntent(text)` shipped ✅
- 9 verb rules + scope-token / type-word target inference + params extraction ✅
- Confidence threshold 0.85 enforced ✅
- chatPipeline runs AISP classifier BEFORE P25 translator ✅
- 7 pure-unit Playwright cases (`tests/p26-aisp-intent.spec.ts`) ✅
- Build green; tsc clean; P23+P24+P25 regression green ✅
- Sprint C kicks off; Capstone-thesis user-visible AISP layer in place ✅
