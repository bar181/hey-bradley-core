# P34 R4 — Architecture Review

**Reviewer:** R4 (Architecture)
**Phase:** 34 — Sprint E P1 (Assumptions Engine + Clarification UX)
**Scope read:** ADR-063, `aisp/assumptions.ts`, `aisp/assumptionStore.ts`, `aisp/index.ts`, `chatPipeline.ts`, `ChatInput.tsx` (1-160 + 480-560)
**Cap:** 250 lines / findings ≤4 lines each

---

## Verdict

**Score: 84/100 — PASS with one MUST-FIX before P35 and three SHOULD-FIX queued for Sprint E P2.**

The 4-atom AISP context absorbs assumptions cleanly (right module, right boundary, right barrel). The `chatPipeline.ChatPipelineResult` extension and the new ChatInput panel orchestration both work but show structural fatigue: the result shape has crossed the "add-one-more-field" threshold and ChatInput has crossed the "owns three panels and a ref" threshold. Neither is a P34 blocker; both will bite in Sprint E P2.

---

## Findings

### MUST-FIX (P34 close or first P35 fix-pass)

**A1. SECTION_CUES duplicates ALLOWED_TARGET_TYPES with drift hazard.** `assumptions.ts:58-68` hardcodes `hero/blog/footer/features/pricing/cta/testimonials/faq/team` cue lists. `INTENT_ATOM.ALLOWED_TARGET_TYPES` is the canonical enum (imported on line 16) yet the cue table is a parallel hand-curated dict keyed off the same strings. Adding a new section type (e.g. `gallery`) updates the enum but silently leaves assumptions blind to it — exactly the drift ADR-063 §Consequences flags but defers. Fix: invert the table to `Record<TargetType, cueWords[]>` typed by the enum so TypeScript fails the build when a type is added without cues. ~15 LOC, zero behavioural change.

### SHOULD-FIX (Sprint E P2)

**A2. `ChatPipelineResult` is becoming a kitchen-sink record.** `chatPipeline.ts:33-66` carries `ok | appliedPatchCount | fellBackToCanned | summary | durationMs | errorKind | aisp | generated | templateId` — 9 fields, several mutually exclusive (success-with-template excludes `errorKind`; canned-fallback excludes `aisp.source==='llm'`). The optional-everything shape forces every consumer to null-check. This is a textbook discriminated-union opportunity: `{ kind: 'template', templateId, aisp, ... } | { kind: 'llm', ... } | { kind: 'canned', ... } | { kind: 'error', errorKind } | { kind: 'empty' }`. Refactor cost ~80 LOC (chatPipeline + ChatInput + ListenTab call sites). Defer past P34 seal; do before P36 layers `assumptions` into the result.

**A3. ChatInput is approaching god-component territory.** Lines 80-156 already declare 13 useState/useRef hooks; the file body shows three independent panel concerns interleaved: AISP trace via `pendingAispRef`, browse picker via `showBrowsePicker`, clarification via `clarification` + `recordAcceptedAssumption` + a re-entrant `runLLMPipeline` at lines 510-540. Each panel is ~30 LOC of orchestration in JSX. The component is still readable but every new Sprint E feature (assumption replay, clarification history, multi-turn refinement) will add another state cluster. Recommend extracting a `useChatOrchestrator()` hook that owns the panel state machine + pipeline re-entry; ChatInput becomes a render shell. Defer to Sprint E P2 alongside A2 — they ship together cleanly.

**A4. `assumptions.ts` mixes algorithm + UI-shape concerns; `assumptionStore.ts` is correctly split.** `Assumption` type carries `id` (UI key), `label` (button copy), and `confidence` (UI %) — these are presentational concerns leaking into the algorithmic module. The pure scoring/ranking is ~30 LOC; the rest is rendering metadata. Cleaner split: a domain `RankedTarget { type, verb, score }` produced by the pure scorer + a `toAssumption(ranked, i): Assumption` adapter living next to `ClarificationPanel`. Keeps the rule engine swappable for the eventual LLM path (ADR-063 §Trade-offs anticipates Sprint E P2). Persistence (`assumptionStore.ts`) is correctly separated and idiomatic — keep as is.

### NICE-TO-HAVE / OBSERVATION (no fix required this phase)

**A5. Stub-then-LLM pattern is now repeated infrastructure (P31 CONTENT_ATOM, P34 assumptions).** Both phases ship a deterministic rule-based scorer behind a function signature designed to be LLM-replaceable. There is currently no shared abstraction — each atom rolls its own request/result types and trigger predicate. If Sprint E P2 + a future generator atom both need LLM swap-in, extract a generic `<TInput, TOutput>` `AtomResolver` interface (`{ runDeterministic, runLLM?, threshold, shouldEscalate }`) into `aisp/atomResolver.ts`. **Do NOT do this now** — two examples is the minimum threshold and the second isn't fully stabilised. Revisit at Sprint E close when the LLM-assumptions path lands and we have three concrete instances to factor against. Premature abstraction here would cost more than it saves.

**A6. ADR-063 cross-references are coherent and complete.** Cites ADR-053 (intent classifier — confidence source), ADR-054 (DDD bounded context placement), ADR-056 (LLM-native AISP — future LLM assumption path), and ADR-058..062 (Sprint D upstream). All four citations are load-bearing and accurate. The `INTENT_ATOM` confidence threshold reuse (`0.7` matches `AISP_CONFIDENCE_THRESHOLD`) is called out in §Trade-offs which is the right place. One small omission: ADR-063 §Trade-offs §"Cue-word tables in assumptions.ts are a hand-curated source of drift" identifies A1 above but does not commit to a fix-by phase. Add "fix-by: P35 fix-pass" to the trade-off bullet to make the debt traceable.

**A7. Bounded-context placement is correct.** `assumptions.ts` and `assumptionStore.ts` both live under `src/contexts/intelligence/aisp/` which is the right home per ADR-054. The store correctly imports `kvGet/kvSet` from `@/contexts/persistence/repositories/kv` rather than touching SQL directly — context boundary respected. The barrel (`aisp/index.ts`) re-exports both modules cleanly with phase-tagged comments. ChatInput imports both via the barrel (no deep paths). No layering violations detected.

---

## Architecture-debt ledger update

| Debt | Origin | Status | Owe-by |
|------|--------|--------|--------|
| SECTION_CUES drift vs ALLOWED_TARGET_TYPES (A1) | P34 | OPEN | P35 fix-pass |
| ChatPipelineResult kitchen-sink (A2) | P32-P34 accretion | OPEN | Pre-P36 |
| ChatInput god-component drift (A3) | P34 | OPEN | Sprint E P2 |
| Assumption type mixes domain+UI (A4) | P34 | OPEN | Sprint E P2 (with A3) |
| Stub-then-LLM generic helper (A5) | P31 + P34 | DEFER | Re-evaluate at Sprint E close |
| ADR-063 fix-by tag (A6) | P34 | TRIVIAL | P34 close |

---

## Recommendation

**SEAL P34 at 84/100 from the architecture lens.** A1 is a real but contained drift hazard — fix in the P35 fix-pass (it's a 15-LOC change with type-system enforcement, not a redesign). A2-A4 are accretion debts the brutal-honest review should surface to the owner with a Sprint E P2 commit; do not block the seal on them. A5 is an observation, not a finding. A6 is a 1-line ADR edit.

The 4-atom AISP architecture continues to absorb new capability cleanly at the context boundary — that is the load-bearing architectural claim of Sprint D and it still holds at P34. The pressure is now on the surface ChatInput and on the result-shape contract; both are the next refactor seam, neither is broken yet.

— R4
