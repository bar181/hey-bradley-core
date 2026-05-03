# P95 / SPEC-WORKBENCH — Retrospective

- **Phase:** P95 · **Sprint:** SPEC-WORKBENCH · **Date:** 2026-05-01

## Keep

- **Planning-sprint-first dispatch.** 5 sequential design docs (`00-understanding` → `01-decomposition` → `02-ddd-adr-plan` → `03-process-map` → `04-sprint-plan`) authored BEFORE any code dispatch. By the time A1/A2/A3 received their work specs, every Σ block, every file-conflict edge, every KISS strike, and every owner-question resolution was already on disk. Zero mid-sprint scope confusion. Zero re-design loops. This pattern should be the default for any phase ≥3 agents going forward.
- **Pure / store-agnostic component contract.** ADR-121 D3 (component accepts `phases: PhaseCard[]` prop; no store imports) made A1's surface testable in isolation and let A2 mount the same component from two different pages (Agentics + Planning) with two different data sources. The data shape is the contract — not the data source.
- **Clipboard-primary at P95 / ZIP-deferred to P96.** Q2 owner answer split the surface from the export pipeline. P95 stayed KISS (one button, one `navigator.clipboard.writeText` call, zero new deps); P96 / ADR-122 owns the ZIP materialization. Crisp boundary.
- **EOP at `seal/` subfolder.** Avoids filename collision with the 5 planning docs at `phase-95/` (which already use `02-ddd-adr-plan.md`). Future phases that run a planning sprint should follow this pattern.
- **existsSync soft-pass guards on A1/A2 surfaces; hard-gate on A3 deliverables.** Mirrors the P92-P94 pattern. Lets timing slips on sibling agents surface as deferred (not red); keeps closer accountability sharp on the closer's own deliverables.

## Drop

- **Nothing.** Planning-sprint-first dispatch eliminated the usual sources of waste (scope-collision, mid-sprint re-design, LOC-over-cap surprises). The 30-min upfront cost paid for itself within the first wave.

## Reframe

- **"Planning sprint" was originally framed as overhead.** Reframe: planning sprints are a velocity multiplier on phases ≥3 agents. The discipline (5 sequential design docs; each agent's input is the prior agent's output) prevents the cascade-of-rework that happens when N agents touch the same codebase from cold-dispatch. The 30-min upfront is much less than the 1-2 hours typically lost mid-sprint to scope drift.
- **"Stub" is not a dirty word.** A1 + A2 + A3 all consumed P94 / ADR-120 (AGENT_ATOM) as a stable contract — the atom shipped P94 with zero consumers in `src/`, and that was fine. P95 is the first consumer. The 1-phase gap between atom-ship and first-consumer-ship gave the design space to harden without rework pressure. This is the same pattern as ADR-090 (mobile UX redesign was reframed as carry-forward from ADR-076 stub) — defer-then-implement is structurally cheaper than implement-then-redesign.

## Carry-forward (Tier-2 commercial / post-RC)

- **P96 / ADR-122 (Export Claude Code).** Consume `AgentAtomOutput` from SpecWorkbench → produce dispatch-ready ZIP bundle (CLAUDE.md + swarm.json + ADR stubs + per-agent prompts). Mirrors P78 pattern (per-page `<nav>` emission via Blob).
- **Live `classifyAgents()` invocation.** Currently SpecWorkbench renders pre-computed sample data; live atom invocation per phase/sprint expansion lands when AgentProxy runtime activates.
- **Inline-edit (rename roles / add DoD / reassign ownedFiles).** P96+. Round-trip lands when Export pipeline reads the (potentially edited) `AgentAtomOutput`.
- **Status palette tokens** (`--hb-status-sealed` + `--hb-status-deferred`). Future palette pass. ADR-121 D4 + ADR-117 D4 both document the literal-hex stopgap.
- **Workbench search / filter box.** STRUCK KISS in planning sprint A2 §6. Tier-2 if owner reverses.
- **Multi-phase comparison view.** Tier-2 commercial. P95 ships single-active-phase view per ADR-121 D1.

## Velocity note

- A2 §6 estimate: 30-45 min wall-clock for P95.
- Actual: comparable. Planning sprint added ~30 min (5 design docs × ~6 min each); seal sprint dispatch under 30 min (3 agents in single wave; no rework).
- **Net:** velocity hit was exactly as estimated. Planning-sprint-first did not slow phase delivery; it eliminated the variance.

## P94 → P95 → P96 arc

P94 sealed AGENT_ATOM with zero consumers (atom shipped as stable contract). P95 ships SpecWorkbench as the first consumer (read-only review surface). P96 will ship Export Claude Code (materialization to dispatch bundle). The arc is design-→-surface-→-pipeline, with each phase confirming the prior phase's contract by consuming it. AISP suite is now COMPLETE + has its first surface consumer + has its export pipeline next sprint. This is the cleanest 3-phase sequence in the OC arc.
