# ADR-064: ASSUMPTIONS_ATOM Crystal Atom + LLM Lift + EXPERT Pipeline Trace

**Status:** Accepted
**Date:** 2026-04-28 (P35 Sprint E P2)
**Deciders:** Bradley Ross
**Phase:** P35

## Context

P34 (ADR-063) shipped the rule-based assumptions engine + 3-button clarification UX (Sean-from-GWH pattern). Functional but stubbed — assumptions are produced from a hand-curated section/verb cue table. P35 promotes the engine to LLM-driven via a 5th Crystal Atom (ASSUMPTIONS_ATOM), with the rule-based path as a safety floor.

P35 also adds an EXPERT-mode AISP Pipeline Trace pane that surfaces all 5 atoms in sequence for the most recent bradley reply — a thesis-defense exhibit at the chat surface.

## Decision

### ASSUMPTIONS_ATOM (5th Crystal Atom)

`src/contexts/intelligence/aisp/assumptionsAtom.ts` — verbatim AISP Ω/Σ/Γ/Λ/Ε per `bar181/aisp-open-core ai_guide`.

Σ shape: `Assumption { id, label, rephrasing, confidence∈[0,1], rationale? }` collected as `AssumptionList { items[], count∈[0,3] }`.

Γ rules:
- R1: count ≤ 3
- R2: confidences DESCENDING by index
- R3: rephrasing constructed from verb-enum ∪ target-enum-from-INTENT_ATOM (no free-text echo)
- R4: id matches `/^[a-z][a-z0-9-]{0,63}$/`
- R5: rephrasing length ≤ 100 chars

Λ:
- confidence_threshold = 0.7
- cost_cap_reserve = 0.65
- max_options = 3
- fallback = rule-based generateAssumptions (P34 / ADR-063)

Ε V1-V4 enforce all Γ rules at runtime via `validateAssumptionsAtomOutput()`.

### 5-atom AISP architecture

Now in production:

| # | Atom | ADR | Phase | Σ width | Threshold |
|---|------|-----|-------|---------|----------:|
| 1 | PATCH_ATOM | 045 | P18 | full JSON-Patch | n/a |
| 2 | INTENT_ATOM | 053 | P26 | verb + target | 0.85 |
| 3 | SELECTION_ATOM | 057 | P28 | templateId + conf | 0.7 |
| 4 | CONTENT_ATOM | 060 | P31 | text + tone + length | 0.7 |
| 5 | **ASSUMPTIONS_ATOM** | **064** | **P35** | **3-list assumptions** | **0.7** |

### `generateAssumptionsLLM` (async; safe fallback)

`assumptionsLLM.ts` runs the LLM call via `auditedComplete` (cost-cap, audit logging, mutex inherited):

1. Empty input → `{ source: 'empty', assumptions: [] }`
2. No adapter → rule-based fallback
3. `sessionUsd >= cap × ASSUMPTIONS_COST_CAP_RESERVE` → rule-based fallback
4. Adapter throws → rule-based fallback
5. Adapter returns error → rule-based fallback
6. Output fails ATOM Σ/Γ validation → rule-based fallback
7. Success → LLM assumptions (≤3, descending confidence, validated)

Returns `LLMAssumptionsResult { assumptions, source: 'llm' | 'rules' | 'empty', trace? }`. Never throws.

### ChatInput integration

P34 wired the rule-based generator. P35 swap: ChatInput now `await generateAssumptionsLLM(...)`. Same ClarificationPanel UI; `clarification.source` field tracks LLM vs rules vs empty for the EXPERT pane.

### EXPERT pipeline trace pane

`src/components/shell/AISPPipelineTracePane.tsx` (~150 LOC) — collapsible pane rendered under each bradley reply. Hidden in SIMPLE mode (`uiStore.rightPanelTab === 'SIMPLE'`). Shows all 5 atoms in order with their data:
1. INTENT_ATOM — verb/target/confidence/source
2. ASSUMPTIONS_ATOM — ranked options + source (only when fired)
3. SELECTION_ATOM — template id (only when matched)
4. CONTENT_ATOM — text/tone/length/conf (only on generator path)
5. PATCH_ATOM — patch count + summary

ChatInput attaches the assumptions trace to the bradley message via `pendingAispRef` so the pane reads from message state, not a separate store. Zero new pipeline plumbing.

## Trade-offs accepted

- **LLM Σ/Γ validation is strict.** If the LLM returns 4 items, or non-descending confidence, or a free-text rephrasing, we discard the entire response and fall back to rules. Safer than partial repair; matches the SELECTION_ATOM (P28) precedent.
- **Rephrasing must be enum-constructed.** R3 is enforced in the system prompt but not regex-checked at validation time (would over-constrain reasonable LLM output). Cost-paid in trust; mitigated by `runLLMPipeline(rephrasing)` re-feed → INTENT_ATOM re-classifies → if rephrasing is bogus, we just don't match a template.
- **Cost-cap reserve (0.65) is lower than CONTENT (0.85).** Assumptions fire only when the user is already low-confidence; we shouldn't burn the rest of the budget on a clarification side-call.
- **EXPERT pane hidden in SIMPLE mode.** Grandma never sees this. By design.

## Consequences

- (+) 5-atom AISP architecture in production — capstone-thesis full exhibit
- (+) LLM-first assumptions improve clarification quality when keys are configured; rule-based fallback keeps the UX intact for free-tier users
- (+) EXPERT trace pane materializes the thesis at the chat surface — every reply is a debuggable artifact
- (+) `validateAssumptionsAtomOutput` is a reusable Σ/Γ-checker pattern; future Crystal Atoms (P36+) can copy the shape
- (-) Adds 3 modules (~300 LOC total: atom + LLM generator + trace pane); minimal complexity
- (-) ChatInput now awaits the assumption call (~200-500ms additional latency on low-confidence turns when LLM path runs); acceptable since rule-based path runs in <1ms

## Cross-references

- ADR-045 (PATCH_ATOM)
- ADR-053 (INTENT_ATOM) — confidence input
- ADR-057 (SELECTION_ATOM) — Σ-restriction precedent
- ADR-060 (CONTENT_ATOM) — stub-then-LLM pattern precedent
- ADR-063 (Assumptions Engine + Clarification UX; P34) — direct upstream

## Status as of P35 seal

- assumptionsAtom.ts shipped (ASSUMPTIONS_ATOM verbatim + validateAssumptionsAtomOutput) ✅
- assumptionsLLM.ts shipped (LLM-first w/ 6-tier fallback chain) ✅
- AISPPipelineTracePane.tsx shipped (EXPERT-only; 5-atom trace) ✅
- ChatInput wired to LLM path; clarification.source tracks LLM/rules/empty ✅
- ADR-064 full Accepted ✅
- 18+ PURE-UNIT tests covering ATOM Σ/Γ/Ε + LLM-first dispatch + EXPERT pane wiring + 28/35 prompt coverage ✅
- Build green; tsc clean; backward-compat with all P15-P34 ✅
