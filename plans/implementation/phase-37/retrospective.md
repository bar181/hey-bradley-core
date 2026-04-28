# Phase 37 Retrospective — Sprint F P2 (Command Triggers + Content/Design Route Split)

> **Composite (estimated):** 91/100 post-fix-pass (Grandma 82 / Framer 90 / Capstone 99)
> **Sealed:** 2026-04-28

## What worked

- **Disjoint-scope agent parallelism.** A1 (left-panel/), A2 (ChatInput + uiStore + ADR-065), A3 (example_prompts seed) had zero file overlap. All three landed in parallel without merge conflicts. The lesson from earlier sessions — "agents must own non-overlapping files" — paid off with measurable velocity.
- **ListenTab split delivered headroom.** 947 → 84 LOC orchestrator + 4 sub-files. Far under the 150-LOC orchestrator target; far under the 500-LOC hard cap. The `useListenPipeline` extraction was a clean DDD seam.
- **classifyRoute as a pure-rule pre-filter.** Running unconditionally (R3 L2 fix) costs ~$0 per call but prevents a real correctness gap (low-confidence "rewrite" slipping into the design LLM patch path). Cheap insurance.
- **Stub-then-LLM pattern continues to pay.** Content route currently short-circuits with friendly canned copy; when the CONTENT_ATOM LLM swap ships, the gate is already in place and tested.
- **Lean 3-reviewer parallel review fits the velocity model.** Each reviewer ≤200 lines, disjoint scopes, all PASS in ~90s wall-clock. Compared to the 4-reviewer Sprint-D review process that cost a full day, this scaled the pattern down without losing teeth.

## What to keep

- **R1 / R2 / R3 lean review template.** Same prompt structure (must-fix / should-fix / acks / score), same 200-line cap, three orthogonal lenses. Reuse for every phase seal.
- **"Reviewer misread" verification step.** R2 L5 looked like a real gap (`resetTranscript()` skipped) but inspection showed it fires before the switch for all 5 paths. Documenting the misread in the seal log preserves the audit trail without performing a no-op fix.
- **`template-help` as a first-class CommandKind.** Pattern: bare slash forms always emit a kind, even if it's just a hint. No silent rejects ever.

## What to drop

- The "wired up in the next phase" copy from chatPipeline. Caught by R1 F2 before any user saw it.

## What to reframe

- **Wave 1 commit hygiene.** Three agents committing locally → main agent committing the merged result was efficient but required a manual audit step ("did A2 actually finish?" — no, they timed out partway). Mitigation: agents emit a "summary" file in `plans/.../wave-handoff.md` so the merge is data-driven instead of vibe-driven.
- **Voice command confidence.** R2 L2 (voice commands have no confidence floor) is a deferred concern. P38 should add a 1-second hold-to-confirm gate before voice commands fire bypass dispatch.

## Velocity

| Activity | Est | Actual | × |
|---|---:|---:|---:|
| Wave 1 (3 agents parallel) | 3-4h | ~2h wall (partial timeouts) | ~1.5× |
| Wave 2 reviews (3 agents parallel) | 1h | ~5min wall (89s for last) | ~12× |
| Wave 2 fix-pass | 30m | ~15m | 2× |
| Seal artifacts | 15m | ~10m | 1.5× |
| **Total P37** | 5h | **~2.5h** | **~2×** |

## Sprint F trajectory

| Phase | Title | Composite | Tests cumulative |
|---|---|---:|---:|
| P36 | Sprint F P1 — Listen + AISP unify | 96 | 269 |
| **P37** | **Sprint F P2 — commands + route split** | **91** | **408** |
| P38 | Sprint F P3 — close + presentation | TBD | TBD |

P37 composite 91 is below P36's 96 — but this reflects that P36 was an unambiguous UX win (review-first voice) while P37 was foundational plumbing (commands + route split + ListenTab refactor). Capstone score held at 99; Framer climbed +1 to 90.

## Carryforward to P38

- R1 L4: `/design`/`/content` half-finished prefill scaffolds
- R1 L5: 35/35 coverage gate honesty (acknowledged; not actionable code)
- R2 L1: command turns bypass audit envelope (decision: defer; ADR-066 follow-up)
- R2 L2: voice command no confidence floor (UX research needed)
- R2 L4: content-route LLM swap cost-cap parity (ships with content LLM)
- R3 L1: extract `dispatchCommand(cmd)` to consolidate ChatInput + useListenPipeline switches

## Next phase

**P38 — Sprint F P3 (Sprint close + presentation prep).** 4-reviewer Sprint F end-of-sprint brutal review (cumulative P36+P37); persona re-walk; Presentation Readiness Report refresh; Vercel deploy + live BYOK 4-provider validation (owner-triggered).
