# Phase 36 Retrospective — Sprint F P1 (Listen + AISP Unification)

> **Composite (estimated):** 96/100 (held vs P35; UX-quality-only delta)
> **Sealed:** 2026-04-28 (~65m / ~2.5× velocity)

## What worked

- **One pipeline, two surfaces.** Voice was already piping into `chatPipeline.submit` from P19. The win in P36 wasn't a new pipeline — it was extending Sprint D-E's UX patterns (clarification card, AISP chip, accepted-assumption persistence) onto the second surface for free. Reuse > rewrite.
- **Review-first as the differentiating UX move.** Voice has different error semantics (ASR mistranscription is silent + irreversible). The review gate is cheap (1ms rule-classifier preview) and earns the user's trust in a single click. The right place to spend a click.
- **`pendingChatPrefill` single-shot consumer.** Clean cross-component hand-off without a global "current edit" field. Read once, clear once. Symmetric to standard React patterns (e.g., URL search-param consumption).
- **PURE-UNIT pattern locked in.** 26 new tests, all first-pass green. Tests run in 3.5s. Pattern from P24 keeps paying compound interest — 255 cumulative tests, zero browser flake.

## What to keep

- **Action preview = rule classifier.** Free, fast, deterministic. Matches `INTENT_ATOM` exactly so what the preview promises is what the pipeline delivers. No drift surface.
- **Component decomposition for the listen surface.** ListenReviewCard + ListenClarificationCard each <100 LOC, single-purpose, dark-theme-styled. Follows the pattern of `ClarificationPanel` + `TemplateBrowsePicker` from P34.
- **Voice clarification card mirrors text version.** Same 3-button + escape, same confidence-chip copy ("X% match"), same `recordAcceptedAssumption` persistence. Cross-surface consistency = thesis-defense exhibit.

## What to drop

- Nothing. P36 shipped clean.

## What to reframe

- **Auto-fire was a P19 design assumption that aged poorly.** The fix is review-first now; the P19 design was OK for an MVP. Acknowledged in ADR-065 §"Why review-first on voice but not text".
- **Listen + chat will diverge at the content route (P37).** Voice users are unlikely to dictate paragraphs of body copy; that's a chat-tab affordance. P37 may keep voice on the design route only.

## Velocity

| Activity | Est | Actual | × |
|---|---:|---:|---:|
| ListenReviewCard + ListenClarificationCard | 30m | ~12m | 2.5× |
| listenActionPreview helper | 10m | ~4m | 2.5× |
| ListenTab refactor | 45m | ~15m | 3× |
| uiStore prefill + ChatInput consumer | 15m | ~5m | 3× |
| ADR-065 + 26 tests | 50m | ~18m | 2.8× |
| Seal | 15m | ~10m | 1.5× |
| **Total** | 2.75h | **~65m** | **~2.5×** |

## Sprint F trajectory (P36 only so far)

| Phase | Title | Composite | Tests new | Cum |
|---|---|---:|---:|---:|
| P34 | UI Closure + Assumptions | 95 | 66 | 165 |
| P35 | ASSUMPTIONS_ATOM + LLM | 96 | 54 | 211 |
| **P36** | **Listen + AISP unify** | **96** | **26** | **255** |

Held at 96 (intentional — UX delta lands on Grandma score; brutal review will firm up).

## Next phase

**P37 — Sprint F P2 (Command Triggers + LLM-Call Audit + Content-Route Research).** Per owner mandate at P36 seal: research-first phase producing the canonical LLM-call audit doc + ADR-066 (command triggers) + ADR-067 (content route).
