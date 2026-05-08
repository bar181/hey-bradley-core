# Phase 19 — Retrospective

> **Backfilled post-seal 2026-04-29 housekeeping audit.** Original P19 sealed at `772c154` (later superseded in audit by `03e7aa7` per ADR README). The deep-dive at `phase-19/deep-dive/` carries the canonical 4-reviewer brutal-honest record (R1 UX 58 → R2 Func → R3 Sec → R4 Arch) and the 18-item fix-pass-2 close-out; it is the authoritative scope source. This file exists only to satisfy the standard phase-process artifact set (`session-log.md` + `retrospective.md` + deep-dive optional).

## Keep

- 3-step staged build (capture → wire → DoD) — the same pattern carried Sprint B/C/D forward.
- Brutal-honest 4-reviewer pattern at sealed code, not at draft. Caught the listen-tab persona regression that fixture-only review would have missed.
- F1-F18 fix-pass-plan (`phase-19/deep-dive/05-fix-pass-plan.md`) — every must-fix tied to a numbered fix item with file:line citation.

## Drop

- "Ship listen tab as a single 754-LOC file" — F-series carried the regression debt forward; ListenTab split queued for P20 ultimately closed in P37 (947→84 LOC).
- Persona scoring on draft instead of sealed code. Composite 66 → 88 swing was avoidable.

## Reframe

- **20-item P20 carryforward** documented in `phase-19/deep-dive/05-fix-pass-plan.md` §5 — this is the canonical handoff list (NOT this retro). Future phases must read the carryforward §5, not re-derive.
- P19 was the last MVP phase before the moat-first reframe (2026-04-29). Composite trajectory P15→P19: 82→88. P20 closed at 88 and ratified MVP.
