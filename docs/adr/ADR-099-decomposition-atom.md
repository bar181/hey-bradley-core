# ADR-099: DECOMP_ATOM — Multi-Clause Decomposition Crystal Atom

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P74 / OC-DECOMP
- **Cross-refs:** ADR-053 (INTENT_ATOM), ADR-057 (SELECTION_ATOM), ADR-060 (CONTENT_ATOM), ADR-064 (ASSUMPTIONS_ATOM), ADR-098 (Template Intelligence Architecture)

## Context

The single-turn `intent → patches` pipeline established through Sprint C (ADR-053/057) and extended by Sprint D content generators (ADR-060) and Sprint E assumptions (ADR-064) handles single-clause input cleanly: "make it brighter" classifies, routes, selects a template (or falls to LLM), and applies one envelope of patches.

It breaks on multi-clause input. "Make it brighter and add pricing" carries two distinct intents — a design tweak and a structural addition — but the existing pipeline classifies the surface utterance as one INTENT_ATOM, picks ONE template, and silently drops the second clause. This was owner-flagged at the P72 / OC-TI seal as the front-of-pipeline gap blocking real conversational use: the Template Intelligence layer (ADR-098) is downstream of intent classification and inherits the same single-clause assumption.

The fix sits BEFORE matching: split the utterance into structured todos so each downstream stage (template matching, content generation, patch application) sees one clean intent at a time.

## Decision

Introduce `DECOMP_ATOM`, a new Crystal Atom that splits a user utterance into an ordered `Todo[]` and exposes an aggregate confidence. Each `Todo` carries:

- `verb` — normalized action token (add / hide / change / rewrite / style)
- `target` — `{ type, index }` matching the existing AISP target shape
- `details` — verbatim params payload (color, copy, length, etc.)
- `sourceSpan` — `[start, end]` indices into the original utterance for traceability
- `confidence` — per-todo deterministic-rules score

The atom envelope is `DecompAtomResult = { todos: Todo[], confidence: number, source: 'rules' | 'llm' }`.

### Pipeline order

```
classifyIntent → classifyRoute
  → decompose(text, aisp) → DecompAtomResult
  → if todos.length > 1 AND confidence ≥ 0.7:
      → executeTodos(decomp, config) → TodoExecutionResult
      → if allPatches.length > 0: applyPatches + return early
  → else: fall through to matchTemplates → SELECTION_ATOM (existing)
```

### Threshold

`0.7` aggregate confidence to short-circuit. Tuned to the same horizon as `AISP_CONFIDENCE_THRESHOLD` so behavior is consistent across atoms; below this, the existing single-clause path is the safer floor.

### Open-core scope

Deterministic rules only. LLM-enriched decomposition is a Tier-2 commercial path (mirrors ADR-098's HNSW deferral).

## Bounded-context impact

Lives within the existing `intelligence/aisp` bounded context. No new context introduced. Two new modules:

- `src/contexts/intelligence/aisp/decompAtom.ts` — pure decomposition (A1)
- `src/contexts/intelligence/aisp/todoExecutor.ts` — per-todo dispatch + patch aggregation (A2)
- `src/contexts/intelligence/chatPipeline.ts` — wire (A3, ≤40 LOC delta)

The atom does NOT touch `templateMatcher`, `templateApplier`, `selectionAtom`, or `contentGenerator` — it sits AHEAD of them and feeds them clean single-clause todos.

## Out of scope

- **Multi-turn requirements accumulator** — todos persist only within a single submit() call. Cross-turn accumulation is a separate sprint.
- **LLM-driven decomposition** — deterministic rules only for open-core. Confidence floor is the gate; LLM enrichment is Tier-2.
- **Todo persistence across sessions** — no IndexedDB / repo writes. Decomp envelope optionally surfaces on the ChatPipelineResult for ConversationLogTab consumption only.
- **Reordering / dependency graphs** — todos execute in source order, no topological sort.

## Acceptance gates

1. **Single-clause regression** — `todos.length === 1` or `confidence < 0.7` MUST fall through to the existing matchTemplates → SELECTION_ATOM path with byte-identical behavior.
2. **Multi-clause coverage** — "X and Y" / "X, then Y" / "X. Also Y." utterances produce `≥2` todos with aggregate confidence `≥0.7` on the canonical prompt corpus.
3. **Short-circuit correctness** — when `executeTodos` returns `allPatches.length > 0`, chatPipeline applies them and returns early with the success envelope; downstream stages do NOT run.
4. **No new dependencies** — decomposition uses existing tokenization / rules infrastructure.
5. **TypeScript-strict** — all new modules compile under the existing strict config.

## Consequences

### Positive

- Closes the P72 / OC-TI carry-forward gap explicitly named at seal.
- Messy multi-clause input now produces structured per-todo patches instead of silent drops.
- ConversationLogTab can show a per-todo trace once the result envelope carries `decomp` / `todoTraces` (downstream consumer ADR; not added in this phase).
- Each downstream atom stays single-clause-shaped — no widening of INTENT_ATOM / SELECTION_ATOM / CONTENT_ATOM contracts.
- AISP layer stays on the documented Sprint-C → Sprint-D → Sprint-E spine; DECOMP is additive, not replacement.

### Negative

- Deterministic rules will miss novel phrasings. Mitigation: LLM-enriched path is a future sprint and shares the same envelope shape, so the wire-point is stable.
- Aggregate-confidence threshold introduces a new tuning surface. Mitigation: anchored to the existing `AISP_CONFIDENCE_THRESHOLD = 0.7`, kept consistent rather than independent.
- Adds one stage to the pipeline hot path. Mitigation: pure-function rules; bounded by todo count; falls through cheaply when single-clause.
- ChatPipelineResult envelope does not yet carry `decomp` / `todoTraces` fields — the type extension is a downstream consumer concern (ConversationLogTab), tracked separately, NOT shipped here.
