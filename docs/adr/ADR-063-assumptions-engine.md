# ADR-063: Assumptions Engine + 3-Button Clarification UX

**Status:** Accepted
**Date:** 2026-04-28 (P34 Sprint E P1)
**Deciders:** Bradley Ross
**Phase:** P34

## Context

Sprint D ended with a working 4-atom AISP pipeline (INTENT → SELECTION → CONTENT → PATCH) but a brutal-honest review (R1 UX FAIL 68/100) revealed that low-confidence requests silently fell through to the canned-fallback hint. The user got generic "try X" suggestions even when the system had a 60% guess.

Sprint E P1 introduces an **assumptions engine** that triggers on `INTENT_ATOM.confidence < 0.7` (or null target) and produces up to 3 ranked re-phrasings. A new **3-button clarification panel** surfaces these to the user. Selecting one re-runs the chat pipeline with the confirmed rephrasing.

This is the "Sean from Good Will Hunting" pattern (per owner spec): no-nonsense + helpful — Bradley says "I think you mean X, Y, or Z. Which?" instead of guessing silently.

## Decision

### Module: `src/contexts/intelligence/aisp/assumptions.ts`

Pure function `generateAssumptions({ text, intent })` returns `Assumption[]` (max 3):

```ts
interface Assumption {
  id: string
  label: string                    // human-readable button copy
  confidence: number               // 0..1; drives ordering + UI %
  rephrasing: string               // canonical text to re-run pipeline with
  rationale?: string               // short explanation
}
```

Algorithm (KISS — no LLM call):
1. Lowercase the user text
2. Score every entry in `ALLOWED_TARGET_TYPES` against a small per-type cue-word table (`hero` ↔ `hero/banner/top/headline/header`)
3. Take top 3 with hits > 0
4. Assign confidences `[0.85, 0.75, 0.65]` by rank
5. Pair with inferred verb (`hide`/`change`/`add`/`reset` etc.) to build canonical rephrasing

Returns empty array when no cue words match — caller falls back to existing FALLBACK_HINT.

Trigger predicate `shouldRequestAssumptions(intent)` returns true when intent is null OR confidence < 0.7 OR target is null.

### Persistence: `assumptionStore.ts`

Accepted assumptions persist via `kv` table at key `aisp_accepted_assumptions` as a JSON array (last 50 entries). Each `AcceptedAssumptionRecord` carries `{ originalText, acceptedRephrasing, confidence, acceptedAt }`. KISS: no migration; kv exists since P16. Per-project scoping deferred to post-MVP.

### UI: `ClarificationPanel.tsx`

Renders 3 buttons + a 4th "something else — let me rephrase" escape hatch. Each button shows label + confidence pill (e.g. "85%"). Click → caller's `onAccept(assumption)` → re-feeds the pipeline with `assumption.rephrasing`. "Something else" → `onReject()` → close panel + return focus to input.

### Wiring in ChatInput

When `chatPipeline.submit()` returns a result whose `aisp.intent` fails `shouldRequestAssumptions`, ChatInput:
1. Generates assumptions
2. If non-empty, sets local clarification state + types "I'm not 100% sure — pick the closest match below ↓"
3. ClarificationPanel renders below the chat
4. On Accept: persists via `recordAcceptedAssumption` + addUserMessage(rephrasing) + re-runs `runLLMPipeline(rephrasing)`
5. On Reject: clear state + focus input

The original user message is preserved in chat history; the chosen rephrasing appears as a new user turn so the audit trail is honest.

## Trade-offs accepted

- **Rule-based, no LLM.** P34 ships the deterministic stub (consistent with P31 CONTENT_ATOM stub-then-LLM pattern). LLM-driven assumption generation is a Sprint E P2 candidate when token spend is justified.
- **3-button cap.** Could be 5 or N; 3 is the cognitive sweet spot per typical UX research and matches the user mandate. Free-text escape covers the rest.
- **Single trigger threshold (0.7).** Same number INTENT_ATOM uses internally. Could be tunable per provider; defer.
- **Per-session persistence is global, not per-project.** Acceptable while projects are MVP-scope. Post-MVP migration adds `project_id` to records.

## Consequences

- (+) R1 F4 (no example discovery for low-confidence requests) closed at the chat surface — users see options, not "try X" hints
- (+) Capstone-thesis exhibit: AISP confidence is now user-actionable, not just a number in a panel
- (+) Persistence trail enables future "you confirmed X last time — same now?" replay patterns
- (-) Adds 2 modules (~180 LOC) + 1 component (~60 LOC); minimal complexity
- (-) Cue-word tables in `assumptions.ts` are a hand-curated source of drift; should be unified with `INTENT_ATOM` rule-classifier table at refactor time

## Cross-references

- ADR-053 (P26; INTENT_ATOM) — confidence source
- ADR-054 (DDD bounded contexts) — assumptions module lives in Intelligence context
- ADR-056 (P27; LLM-Native AISP) — future LLM-driven assumption generation
- ADR-058..062 (Sprint D template/content arc) — direct upstream

## Status as of P34 seal

- assumptions.ts shipped (`generateAssumptions` + `shouldRequestAssumptions` + `ASSUMPTIONS_TRIGGER_THRESHOLD`) ✅
- assumptionStore.ts shipped (`recordAcceptedAssumption` + `listAcceptedAssumptions`) ✅
- ClarificationPanel.tsx shipped ✅
- ChatInput wired (low-confidence → panel → re-run pipeline) ✅
- ADR-063 full Accepted ✅
- 12+ PURE-UNIT tests covering assumptions output + threshold + clarification UX wiring ✅
- Build green; tsc clean; backward-compat with all P15-P33 ✅
