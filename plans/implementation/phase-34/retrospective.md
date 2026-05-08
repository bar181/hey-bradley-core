# Phase 34 Retrospective — Sprint E P1 (UI Closure + Assumptions Engine)

> **Composite (estimated):** 94/100 (+1 vs Sprint D 93)
> **Sealed:** 2026-04-28 (~75m / ~3.2× velocity)

## What worked

- **R1 closure with the same engine in both directions.** Sprint D's brutal-honest review identified 3 UX blockers (orphaned panel, missing browse-picker, no examples discovery). Sprint E P1 closes all three with the SAME chatPipeline result extension feeding both A1 (panel) and A4 (clarification) — one aisp trace, two UI surfaces.
- **/browse as a slash command, not a sidebar button.** Discoverable without a UI redesign. Empty-state hint surfaces it. KISS.
- **Pure-rule assumptions engine.** Same stub-then-LLM pattern from P31 (CONTENT_ATOM): rule-driven 3-button output is testable today, LLM swap is implementation-only.
- **Sean-pattern UX.** "I'm not 100% sure — pick the closest match" is the right voice. No-nonsense, helpful, gets the user back on track in one click.

## What to keep

- **Persistence via kv (no migration).** assumptionStore.ts uses the existing `aisp_accepted_assumptions` kv key. Zero schema risk; trivially extensible.
- **Confidence percentages on the buttons.** `85% / 75% / 65%` is honest and gives the user agency. No false certainty.
- **Free-text "something else" escape hatch.** Always present. User never feels boxed in.

## What to drop

- Nothing in P34. Wave 1 + Wave 2 shipped clean.

## What to reframe

- **Persona scores are estimated.** Real Grandma walk requires owner observation. Documented as such; will firm up at P35 when the EXPERT-tab debug surface lands and a tight test pass can run on real keyboard input.
- **Vite dynamic-import warning** for the aisp barrel: chatPipeline imports it dynamically while ChatInput imports statically. Not a blocker; tracked for cleanup at refactor time.

## Velocity

| Activity | Est | Actual | × |
|---|---:|---:|---:|
| A1 panel wiring | 45m | ~15m | 3× |
| A2 picker | 60m | ~15m | 4× |
| A3 assumptions | 45m | ~15m | 3× |
| A4 clarification UX | 60m | ~15m | 4× |
| A5 ADR + 28 tests | 30m | ~15m | 2× |
| **Total** | 4h | **~75m** | **~3.2×** |

## Sprint E trajectory (P34 only so far)

| Phase | Title | Composite est. | Tests new | Cum |
|---|---|---:|---:|---:|
| **P34** | **UI Closure + Assumptions** | **94** | **45** (17+28) | **136** |

Strong opening. Sprint D ended at 93; P34 +1.

## Next phase

**P35 — Sprint E P2 (Assumptions LLM Lift).** Replace stub with cost-capped LLM call; add EXPERT-tab debug pane for `listAcceptedAssumptions`. ADR-064.
