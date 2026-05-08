# P37 — R3 Architecture Review (Lean)
> **Score:** 92/100
> **Verdict:** PASS

## Summary
P37 holds architectural discipline: ListenTab split is real (84 LOC orchestrator + 4 sub-files all <500 cap), `commands/` sibling under `intelligence/` is DDD-defensible, `parseCommand` + `classifyRoute` are pure pre-classifiers that strengthen rather than mutate the 5-atom thesis. ADR-066 cross-references are complete; wiki + GROUNDING are current to P37; all 5 P36 carryforward items show closure citations in source.

## MUST FIX
*(none — no blockers found)*

## SHOULD FIX
- **L1 — `useListenPipeline` has a buried command-dispatch switch (lines 196-232) that duplicates ChatInput's command dispatch.** Both surfaces switch on `cmd.kind` and call `setPendingChatPrefill`/`setLeftPanelTab`. Extract `dispatchCommand(cmd)` into `commands/dispatchCommand.ts` so future kinds (P38+) are added in one place. Today's duplication is small (7 cases × 2 surfaces) but will rot.
- **L2 — `chatPipeline.ts` content-route gate is placed AFTER template-router but BEFORE LLM patch — correct in spirit, but `aispRoute` is only computed when `aisp.confidence >= AISP_CONFIDENCE_THRESHOLD && aisp.target` (line 215).** Low-confidence content asks (e.g. "rewrite") get classified as `content` by the regex but never reach the gate because `aispRoute` stays null. Either always compute route, or document that low-confidence content falls through to LLM patch by design.
- **L3 — `ListenControls`/`ListenTranscript` use `Pick<>` to subset state/handlers (good), but the parent still passes the full `state`/`handlers` objects.** TS narrows correctly, but at runtime children receive every field. If a sibling component is later added, prop-drilling will tempt over-sharing. Consider exporting per-component prop slices from the hook (e.g. `pipeline.controlsProps`) for explicit boundaries.

## Acknowledgments
- **A1 — R2 S3 hard-block close is real and stable.** 875 → 84 LOC orchestrator with the heavy lifting moved into `useListenPipeline` (403) + `useListenDemo` (205) + 2 presentational components (137 + 168). All sub-files under the 500 cap; no file flirts with it. The split honours separation of concerns: pipeline state vs. demo plumbing vs. presentation.
- **A2 — All 5 P36 carryforward items have visible closure citations.** R2 S2 redaction symmetry at line 32+164 of `useListenPipeline.ts` (`redactKeyShapes` import + `appendListenTranscript({ text: redactKeyShapes(text) })`); R2 S5 doc-fix at lines 67-68 of ADR-065 (explicit "EXPERT pipeline trace pane remains chat-only at P36 seal" qualification); R1 L3 / R2 S1 / R2 S4 implicit in the hook's clarification handling + single-shot prefill semantics retained from P36.
- **A3 — Wiki currency is excellent.** `llm-call-process-flow.md` lines 219-235 has a dedicated P37 section with the slash/voice command table; lines 185-186 explicitly call out `parseCommand` as the upstream gate before INTENT_ATOM and `classifyRoute` as the downstream splitter. `GROUNDING.md` line 25 says "Sprint F P2 (Phase 37) — mid-flight, pre-seal" — correctly P37-current.
- **A4 — ADR-066 Σ-restriction discipline holds.** "Neither module mutates the existing Crystal Atoms; both are pure pre-classifiers" (line 44). Cross-references at lines 66-70 cite ADR-053/057/060/064/065 — all 5 atoms accounted for. Trade-offs section honestly flags command-skip-atoms gap in EXPERT trace pane (line 51).
- **A5 — Bounded-context placement is defensible.** `commands/` as a sibling of `aisp/` under `intelligence/` is DDD-correct: commands are an upstream gate that produces typed dispatch triggers, not Crystal Atoms; placing them inside `aisp/` would conflate the gate with the atom chain. The barrel re-exports from `aisp/index.ts` (lines 48-56) preserve the single-import convention without forcing the directory hierarchy. Future `commands/dispatchCommand.ts` (see L1) lands cleanly here.
- **A6 — Hook contract `{ state, handlers }` is sane and consistent.** `useListenPipeline` and `useListenDemo` mirror each other — both expose `state` + `handlers` discriminated namespaces — which keeps `ListenTab.tsx` flat (24-26: two destructures, no further plumbing). The 13-field `ListenPipelineState` interface is large but each field is load-bearing; no obvious culling.
- **A7 — 5-atom thesis is strengthened, not diluted.** P37 adds an UPSTREAM gate (`parseCommand`) that bypasses the chain when the user explicitly knows what they want, and a DOWNSTREAM splitter (`classifyRoute`) that picks the right atom chain (CONTENT vs PATCH). Both are pure-rule, $0, idempotent — same KISS posture as P26's `intentClassifier` and P34's `assumptions` stub. The thesis claim "the cheapest LLM call is the one you don't make" is now structurally enforced at two more boundaries.
- **A8 — Content-route gate placement (chatPipeline.ts:273-286) is correct.** It runs AFTER template-router (so template hits still win — preserves the P23 cost optimisation) and BEFORE the LLM patch path (so wrong-shape JSON-Patch envelopes for copy edits are prevented). The "wired in next phase" canned reply is honest UX, not a fake.

## Score
92/100

**Rationale:** PASS with no must-fix. Three should-fix items are forward-looking refactors (L1 dispatch dedup, L2 route-classification scope, L3 prop-slice ergonomics), not blockers. Architecture trajectory is up: P36 surface parity → P37 upstream gate + downstream splitter, both pure-rule, both barrel-exposed. Composite-impact: Framer +1 (architectural separation) and Capstone +1 (research-bottleneck framing) per ADR-066's stated trade analysis. Recommend seal.
