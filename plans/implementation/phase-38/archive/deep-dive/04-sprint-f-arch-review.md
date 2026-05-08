# Sprint F End-of-Sprint — R4 Architecture Review (Lean)
> **Score:** 91/100
> **Verdict:** PASS

## Summary

Cumulative P36+P37 architecture is sound: every source file is comfortably under the 500 LOC cap (longest in scope = useListenPipeline.ts at 403), Crystal Atom thesis holds (5 atoms + 2 upstream gates is two stacked patterns by design, not by accident, and ADR-066 frames it honestly), and `commands/` as a sibling of `aisp/` reads correctly post-Sprint-F because commands are pre-AISP gates rather than atoms. Three concerns warrant fixes before P38 sprint-close: (1) ChatInput and useListenPipeline carry parallel `switch(cmd.kind)` blocks that have already drifted (`template-help` exists in chat only); (2) the AISP barrel re-exporting `parseCommand` from `../commands/` blurs the bounded-context line; (3) ADR-066 cross-references omit ADR-050 / ADR-051 / ADR-045 even though commands gate exactly those paths.

## MUST FIX

- **F1: useListenPipeline.ts:196-232 + ChatInput.tsx:448-499** — duplicated `switch(cmd.kind)` dispatch. R3 L1 already flagged this in P37; verified still present at seal-edge. `template-help` case exists in ChatInput but NOT in the listen dispatch (drift confirmed). **Fix:** extract a `dispatchCommand(cmd, hostHandlers)` helper in `commands/` (or co-locate next to `parseCommand`) so both surfaces share one switch and template-help reaches voice users.

## SHOULD FIX

- **L1: aisp/index.ts:51-60** — barrel re-exports `parseCommand` + `classifyRoute` from `../commands/`, mixing two bounded contexts behind one import path. Header comment still says "AISP barrel". **Fix:** rename header to "intelligence barrel" OR add a sibling `commands/index.ts` and update consumers; not circular today (commands has zero aisp imports — verified) but the cross-context re-export hides the real dependency direction.
- **L2: ADR-066 cross-references** — currently lists ADR-053/057/060/064/065. Missing: **ADR-050** (template-first router; `/browse` + `/template` short-circuit exactly that path), **ADR-051** (scoping; `/design` + `/content` are scope gates), **ADR-045** (PATCH_ATOM; commands skip the system prompt entirely). **Fix:** add the three missing cross-refs in ADR-066 §Cross-references.
- **L3: ADR-066 §"Status as of P37 seal"** claims "≥10 PURE-UNIT integration tests covering bridge composition + 33/35 prompt coverage gate". GROUNDING.md §2 says 344/344 GREEN and llm-call-process-flow.md doesn't quote a coverage number. The 31/35 gate referenced in CLAUDE.md (P36 line) and the 33/35 in ADR-066 don't reconcile. **Fix:** pin one coverage number in the seal artifacts (STATE row + ADR + CLAUDE roadmap line) so the ratchet is unambiguous.

## Acknowledgments

- **A1:** All 12 `listen/` files are under 210 LOC. Longest = useListenPipeline 403, useListenDemo 205, ListenTranscript 168 — every one well under the 500 cap. The R2 S3 carryforward was correctly closed.
- **A2:** ListenTab.tsx at 84 LOC is a textbook thin orchestrator — pipeline state in `useListenPipeline`, demo state in `useListenDemo`, visuals in 5 sibling components, zero business logic. Strict-move discipline preserved.
- **A3:** No circular imports verified. `commands/commandTriggers.ts` has zero imports from `aisp/`; `aisp/routeClassifier.ts` imports only `intentAtom` types. Directional crossing is one-way (aisp barrel → commands), which is structurally safe even if naming is muddy (L1).
- **A4:** ADR-066 is honest about Σ-restriction discipline ("neither module mutates the existing Crystal Atoms; both are pure pre-classifiers that emit typed discriminators"). The "two stacked patterns" question is answered correctly: commands skip atoms entirely (deliberate $0/0ms shortcut); classifyRoute splits which atom chain runs. Coherent, not accidental.
- **A5:** Test architecture spread is sensible given the wave structure: 7 P37 specs (commands / route-classifier / listen-split / listen-chat-bridge / carryforward / fix-pass / prompt-coverage) match the Wave 1 + fix-pass cadence. P36 has 2 specs (listen-enhanced + fix-pass). Phase-prefixed isolation makes regression replay tractable.
- **A6:** chatPipeline.ts §P37 A2 gate (lines 266-291) correctly short-circuits content route to a Grandma-friendly hint without burning tokens; comment explicitly TODOs the P38 CONTENT_ATOM wire-up. Backward-compat path (default → design) preserves all P15-P36 behavior.
- **A7:** wiki/llm-call-process-flow.md §"Command Triggers (P37)" is current; cross-refs ADR-066 explicitly; Σ-table includes all 5 atoms with the upstream `parseCommand` gate documented in §"What's New". GROUNDING.md §2 captures P36 96 → P37 pending honestly.
- **A8:** Sprint F North Star ("review-first voice + command triggers + content/design route") — P36 delivers review-first voice (ListenReviewCard + clarification card + AISP chip + pendingChatPrefill); P37 delivers command triggers + route classifier. The 4→3 compression has shipped its core thesis; P38 is correctly scoped to brutal review + presentation gate per GROUNDING.md §3.

## Score

91/100

- −5: F1 dispatch duplication (real architectural smell with confirmed drift)
- −2: L1 barrel/bounded-context naming muddiness
- −1: L2 ADR-066 missing cross-refs
- −1: L3 coverage-number reconciliation across seal artifacts
- +0: every other dimension clean (LOC caps, no circular imports, atoms intact, North Star met, tests well-spread)
