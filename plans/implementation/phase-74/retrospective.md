# P74 Retrospective — OC-DECOMP + Highlights + Demo + Comprehensive Review

> **Date:** 2026-05-01
> **Phase:** P74

---

## Keep

- **5-track parallel dispatch with disjoint file scopes.** Ten agents across five tracks, each owning a small non-overlapping file set. Zero merge friction even at 10×; the discipline that worked at 5 agents in P73 scaled cleanly to 10.
- **Pre-stage stub for A6 prevented main.tsx collision.** `FullSiteSimulator.tsx` was owned by exactly one agent (A6); a tiny stub committed before dispatch reserved the path and let A6 write the real 932-LOC implementation without negotiating with any other agent's edits.
- **Read-only Explore agents for review (chunked at 600 LOC).** Three perspectives (features / design+UX / gaps) at ≤600 LOC each is reviewable; one 1,800-LOC monolith is not. The chunking is the artifact, not a workaround.
- **DECOMP_ATOM closes the front-of-pipeline gap flagged at P72/OC-TI seal.** The carry-forward line had named "OC-DECOMP (intent → todo decomposition; pre-pipeline accumulator)" as a CRITICAL blocker for two sprints. Dedicated sprint > implicit fix-pass.
- **PURE-UNIT FS-read test pattern with existsSync guards.** Same shape as P67c/P71/P72/P73 — fast, deterministic, CI-friendly. existsSync guards turn timeouts into carry-forward (correct semantics) rather than red (incorrect semantics — the test isn't broken, the agent didn't ship).
- **Threshold anchored to existing AISP_CONFIDENCE_THRESHOLD (0.7).** Decomp confidence reuses the same horizon as INTENT/SELECTION/CONTENT/ASSUMPTIONS atoms. One tuning surface across the AISP stack, not five.
- **Open-core scope = deterministic rules; LLM enrichment = swap-in.** The DecompAtomResult envelope is identical for rules-source and llm-source; the wire-point is stable so a future LLM rerank is a path swap, not a redesign.

## Drop

- **"Single-turn pipeline" mental model.** Replaced by `decompose → executeTodos` loop. The pipeline is now genuinely multi-clause-aware up front; the rest of the stack stays single-clause-shaped (no widening of INTENT/SELECTION/CONTENT contracts).
- **"Chat shows full bradley reply" UX assumption.** Replaced by 5-25 word highlight on chat/listen surfaces. Full detail is one tab away in ConversationLogTab. This was an owner-flagged readability gap and is now closed.
- **"Demo = ListenModeDemo's 4 short scripts" framing.** `FullSiteSimulator` is a 10-step coffee-subscription flow that demonstrates a *site build*, not a single intent. The two coexist; FullSiteSimulator is the new flagship demo.
- **Inflating the cumulative test count without naming new cases.** P74 adds ~25 new PURE-UNIT cases; cumulative is now ~863+. The number is honest, not decorative.

## Reframe

- **The chat surface is now genuinely concise.** Highlights are 5-25 words; sentence-boundary preference within the window means highlights end at natural breaks where possible. The ConversationLogTab is the canonical full-detail surface — that's the right factoring, not a workaround.
- **Future LLM-enriched decomposition is a P74b sprint, not a P74 must-have.** Deterministic rules ship now and cover the canonical multi-clause cases ("X and Y", "X, then Y", "X. Also Y."). LLM rerank is a swap-in via the same envelope when Tier-2 ships.
- **DECOMP_ATOM is additive, not a replacement.** It sits AHEAD of the existing matchTemplates → SELECTION_ATOM path. Single-clause regressions are byte-identical because the fall-through path is untouched. This is exactly the property that lets the ADR-099 "single-clause regression" gate be cheap to verify.
- **Audit-driven and gap-driven sprints are the same shape.** P73 was "audit a thing then fix it"; P74 is "named gap → dedicated sprint to close it". Both work because the scope is pre-decided. The anti-pattern is "polish" sprints with no scoring rubric or named gap.
- **The P72 → P73 → P74 trio is a coherent arc.** P72 shipped Template Intelligence (3 layers, 42 entries). P73 audited the libraries + closed the structural gap (`exampleQueries` REQUIRED, 51 entries). P74 closed the front-of-pipeline gap that blocked P72 from real conversational use. Each sprint extends the previous one toward "real conversation produces real specs."

## Carry-forward

| Item | Why deferred | Owner-route |
|---|---|---|
| LLM-enriched `decompose()` | Open-core scope is deterministic rules; envelope is swap-in | Tier-2 / P74b |
| Multi-turn requirements accumulator | Single-submit scope per ADR-099 §Out of scope | P74b+ |
| ChatPipelineResult `decomp` + `todoTraces` envelope extension | Downstream consumer concern; ConversationLogTab has soft shape, pipeline does not yet emit | P75 / OC-TI Wave 2 |
| ConversationLog filtering / search UX | Non-blocking; consumer surface | P75+ |
| ConversationLog DB persistence | In-memory at present | Tier-2 |
| Reordering / dependency graphs across todos | Out of roadmap; todos execute in source order | n/a |
| HNSW activation (re-index + auto-write) | Tier-2 commercial learning runtime per ADR-098 | Tier-2 |
| OC-TI Wave 2 (matcher UI in chat thread) | UI surface; out of OC-DECOMP scope | P75 candidate |
| `useChatPipeline` hook (P67d) | Pipeline integration | P75+ |
| Web Speech wire-up (MobileListenFullscreen) | Not DECOMP-related | Polish backlog |
| OC-CLEANUP marketing-site mobile (ADR-090 decision 5) | Wave 4 legacy surface | Polish Wave 4 |
| Build-step RSS generator | Blog tooling | Blog backlog |
| +2 stretch blog posts → 12+ total | Blog cadence | Blog backlog |
| A1 P72 ruvector backfill (126 entries; 0 vectors indexed) | Manual; deferred to OC-CLEANUP follow-up | OC-CLEANUP |
| +3 templates → literal 40+ ("OC-4 round 3") | Quality > quantity in P73; carried | OC-4 round 3 |

---

**Bottom line:** P74 closed the named carry-forward gap (OC-DECOMP) with a dedicated sprint, scaled the disjoint-dispatch pattern to 10 agents across 5 tracks, and added genuinely new UX (highlight surface + 10-step site demo) without touching the library content. The pipeline is now multi-clause-aware at the front, single-clause-shaped everywhere downstream — the right factoring.
