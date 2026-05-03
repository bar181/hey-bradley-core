# P99 / SEAL-PANEL — Retrospective

- **Phase:** P99 · **Sprint:** SEAL-PANEL · **Date:** 2026-05-01

## Keep

- **Pure / store-agnostic component contract** (mirrors ADR-121 D3 + ADR-122 + ADR-128 D1 + ADR-129 D1). `<SealPanel phase eop onSeal>` is a pure render from props; no store coupling, no async, testable in isolation. Mountable from any surface (Agentics workbench OR Claude Code bundle preview).
- **Three-card markdown layout with minimal renderer.** No `react-markdown`/`marked`/`remark` dep — a 60-LOC renderer covers heading/bullet/bold/code-fence which is 95% of EOP formatting. KISS holds; rejected full-parser deps stay in P99.6 denylist.
- **PROCESS+DDD persistence via existing event_types.** `process_atom_output` + `ddd_atom_output` were already in migration 005 CHECK enum — no schema migration needed at P99. A8 just added the emit sites in PlanningChatBar.
- **EOP at `seal/` subfolder** mirrors P95/P96/P97/P98 pattern — sixth phase to use the convention without filename collision.
- **existsSync soft-pass guards on A7/A8; hard-gate on A9-owned ADR + EOP triplet.** Standard pattern from P92-P98.
- **Build-time bake explicitly Tier-2.** Open-core ships the contract + the empty-state; the bake pipeline is the commercial extension. No half-shipping fake content.

## Drop

- **Nothing.** P99 closes the methodology arc cleanly. The "Reflect" surface is feature-complete for open-core. No carry-forward from this sprint to defer beyond the explicit Tier-2 deferrals.

## Reframe

- **The methodology arc closes at P99.** P97 TDD + P98 KISS + P99 Seal = "Reflect" surface complete. A Hey Bradley user gets the spec (P95) → bundle (P96) → tests (P97) → gate verdict (P98) → seal-with-receipts (P99). Each phase confirms the prior phase's contract by consuming it; the bundle is now the materialized methodology.
- **EOP triplet was already canonical — P99 just gave it a UI.** The triplet (post-review + session-log + retrospective) has been disk-canonical since P74's first `seal/` subfolder. P99 makes it a workbench surface, not a methodology change.
- **P101 carry-forward #2 closes.** Both event_types (`process_atom_output` + `ddd_atom_output`) declared in migration 005 CHECK enum at P100 W2 LOG-BUILD now have emit sites in PlanningChatBar. The dead-event-type state ADR-127 §C1 §4.2 named is closed.
- **Crystal Atom helper grep-trace rule (from P100 W2 FMT retro) holds at P99.** Every helper export must have ≥1 import site in dispatch surface. PROCESS+DDD persistence wire restores this discipline for the two atoms named in the schema-but-not-emitted gap.

## Carry-forward (Tier-2 commercial / post-RC)

- **Build-time EOP pre-bake** — Vite plugin reads disk EOP triplet + injects markdown into PhaseCard fixtures at build. Tier-2; runtime `eop` prop is `null` until commercial bake pipeline lands.
- **Markdown table parsing** — minimal renderer skips `|---|` tables. Tier-2 if a phase needs tabular EOP.
- **Seal automation across phases** — auto-emit EOP triplet from agent results + auto-bump CLAUDE.md. P101+ if owner reverses manual-seal-discipline rule.
- **Round-trip EOP edits** — Seal Panel is read-only at open-core. Edit-then-resave is post-RC; requires AgentProxy round-trip.
- **P100 — Final consumer-experience polish + Open Core v2 release planning.** Owner's call on whether P100 is a polish sprint, a re-score sprint, or an OC v2 RC sprint.
