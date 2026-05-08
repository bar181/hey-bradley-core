# ADR-121 — SpecWorkbench Architecture

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P95 / SPEC-WORKBENCH
- **Cross-refs:** ADR-095 (Library-Wide Polish Standard), ADR-110 (AISP Visibility Standard), ADR-116 (Three-Mode Product Architecture), ADR-117 (Process Map SVG Architecture)

## Context

P94 sealed AGENT_ATOM, closing the AISP suite at 8 atoms. P95 ships
the SpecWorkbench — the first consumer of `AgentAtomOutput` and
the dual-view surface that exposes the 8 AISP atoms + human-readable
spec + ADR cross-refs to the user.

The P95 planning sprint (5 sequential design docs at
`plans/implementation/phase-95/00..04`) sealed with the owner
resolving Q1 (process flow with hierarchical sprint cards) and
Q2 (clipboard primary; ZIP export deferred to P96). Q3 (workbench
search) was struck KISS. Q4-Q7 confirmed without changes.

ADR-110 governs AISP visibility: dual-view default for value-add
surfaces. SpecWorkbench is the canonical implementation of that
pattern in Agentics + Planning modes.

## Decisions

### Decision 1 — Tabbed dual-view layout (Human / AISP / ADR)

Per Q1 owner resolution: 3-tab strip (Human / AISP / ADR) per active
phase card. Sprint cards render in a horizontally-scrollable strip
below the phase header; click-to-expand reveals AgentSpec scopes +
DoD checklist + verbatim AISP Σ block. Mobile (<768px) keeps the
horizontal sprint strip; desktop (≥768px) wraps. Tablist uses
`role="tablist"` + `role="tab"` with `aria-selected` per ADR-091.

### Decision 2 — Clipboard PRIMARY for AISP; ZIP export deferred

Per Q2 owner resolution: copy-to-clipboard is the primary AISP
export at P95. The AISP tab carries a `spec-aisp-copy` button that
calls `navigator.clipboard.writeText(phase.aispSpec)`. ZIP bundle
export (CLAUDE.md + swarm.json + ADR stubs + AISP per-agent prompts)
is owned by P96 / ADR-122 (Export Claude Code). This keeps the P95
surface KISS and avoids cross-cutting export pipeline work.

### Decision 3 — Stand-alone component; no store coupling

`SpecWorkbench` accepts a `phases: PhaseCard[]` prop. It does not
import `useUIStore`, `useConfigStore`, or any persistence repo.
Consumers (Agentics page + Planning right panel) own data wiring
and pass `phases` + optional `activePhaseId` / `activeSprintId` /
`onSprintExpand` callbacks. This keeps the component testable in
isolation, mountable from any surface, and ensures the data shape is
the contract — not the data source. Sample seed data lives at
`src/data/sample-spec-workbench.ts`.

### Decision 4 — Status colors via ProcessMapSVG palette

`planned` + `in-flight` use design tokens (`var(--hb-surface-hover)`
+ `var(--hb-accent)`); `sealed` + `deferred` use literal hex
(`#22c55e` + `#f59e0b`) per ADR-117 D4 until status palette tokens
are defined. This keeps SpecWorkbench visually consistent with
ProcessMapSVG node-status pills already shipped P91. Future palette
pass introduces `--hb-status-sealed` + `--hb-status-deferred`.

## Out of scope (deferred)

- Live AISP atom invocation — P95 renders pre-computed
  `AgentAtomOutput`; live `classifyAgents()` invocation per atom
  expansion lands P96+ when AgentProxy runtime activates
- Workbench-level filter / search box — Q3 struck KISS; not regressed
- Export-from-workbench (ZIP / fs-write / in-page render) — P96 / ADR-122 owns
- Agent role inline-edit — P96+ when round-trip
  AgentAtomOutput → SpecWorkbench → AgentProxy lands
- Multi-phase comparison view — Tier-2 commercial

## Acceptance gates

- ADR ≤120 LOC; Status: Accepted; 4 decisions enumerated
- Cross-refs ADR-095 + ADR-110 + ADR-116 + ADR-117
- `src/components/agentics/SpecWorkbench.tsx` exports `SpecWorkbench`
  function with `phases: PhaseCard[]` prop; 3 tab testids
  (`spec-tab-human` + `spec-tab-aisp` + `spec-tab-adr`); clipboard
  CTA testid `spec-aisp-copy`; empty-state testid `spec-workbench-empty`
- `src/data/sample-spec-workbench.ts` exports `HEY_BRADLEY_SAMPLE_PHASES`
  with ≥3 PhaseCard entries
- Agentics + Planning render `<SpecWorkbench>` (≥2 references each)
- KISS — no animation libs; no new deps in P95 source
- EOP triplet at `plans/implementation/phase-95/seal/`

## Consequences

- **Positive:** First consumer of AGENT_ATOM ships; AISP visibility
  per ADR-110 implemented in canonical form; clipboard-primary keeps
  export pipeline work clean for P96; component is store-agnostic
  and testable in isolation; sprint-card hierarchy directly mirrors
  the planning-sprint dispatch pattern that's been load-bearing
  since P74.
- **Negative:** No live atom invocation at P95 (pre-computed only);
  ZIP export gap until P96; status color tokens incomplete until
  future palette pass; no inline-edit until round-trip lands.
- **Mitigations:** Pre-computed sample data at
  `sample-spec-workbench.ts` makes the surface immediately
  demonstrable; clipboard is universally supported and zero-dep;
  ADR-117 D4 already documents the status-palette gap;
  AgentAtomOutput shape is stable per ADR-120 so round-trip
  is additive in P96+.
