# ADR-130 — Seal Panel + EOP Persistence

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P99 / SEAL-PANEL
- **Cross-refs:** ADR-126 (Comprehensive Log Infrastructure), ADR-128 (TDD Scaffold), ADR-129 (KISS Review)

## Context

P97 + P98 shipped TDD scaffold + KISS reviewer (ADR-128 + ADR-129).
Every Crystal Atom now has ≥1 production import site; the spec
bundle ships with tests + KISS-gate verdict. Two open carry-forwards
remained: the EOP triplet (post-review + session-log + retrospective)
lived only on disk under `plans/implementation/phase-{N}/seal/`, with
no surface inside the workbench; and PROCESS_ATOM + DDD_ATOM outputs
were declared in migration 005's CHECK enum but had no emit site
(named P101 carry-forward #2 by ADR-127 §C1).

P99 closes the methodology arc with the Seal Panel UI that renders
the EOP triplet as markdown cards inside Agentics + persists the
PROCESS + DDD atom outputs to `log_events` on every Planning chat
submit. The arc P95 → P96 → P97 → P98 → P99 (review → export →
tests → KISS-gate → seal) completes the 7-step "Reflect" surface
for the Hey Bradley spec-factory.

## Decisions

### Decision 1 — Pure component contract

`SealPanel` accepts `{phase, eop, onSeal}` props. No store imports,
no fs reads, no async fetches. Mirrors ADR-121 D3 + ADR-122 + ADR-128
D1 + ADR-129 D1 store-agnostic component pattern. `phase: PhaseCard`
+ `eop: EopTriplet | null` + `onSeal: () => void` is the contract.
Mountable from any surface (Agentics workbench OR Claude Code bundle
preview). Pure render; severity badge derived from `phase.kissVerdict`.

### Decision 2 — Three-card markdown layout

EOP triplet renders as three vertically-stacked cards:
post-review / session-log / retrospective. Markdown content rendered
inline via a minimal renderer (heading `#`/`##` + bullet `-` + bold
`**...**` + code fences). KISS — no full-markdown library install
(`react-markdown` / `marked` / `remark` rejected). The 95% of EOP
formatting we use is the 5% of markdown a 60-LOC renderer covers.
Mirrors ADR-122 D2 (markdown bundle without parser dep).

### Decision 3 — Build-time pre-bake = Tier-2

EOP triplet is loaded on disk under
`plans/implementation/phase-{N}/seal/`. At runtime the `eop` prop is
`null` for all phases — the Seal Panel renders an empty-state
"EOP not yet baked into the bundle (Tier-2)" card. Build-time
pre-bake (Vite plugin reads disk + injects EOP markdown into the
phase fixtures) is explicitly Tier-2 carry-forward. Open-core ships
the panel + the contract; commercial ships the bake pipeline.

### Decision 4 — PROCESS + DDD persistence (closes P101 #2)

On every Planning chat submit (`PlanningChatBar.tsx`), after
`classifyProcess(text)` + `classifyContexts(text)` run, two
`log_events` writes are emitted via `writeLogEvent`:
- `event_type: 'process_atom_output'` carrying `event_data: ProcessAtomOutput`
- `event_type: 'ddd_atom_output'` carrying `event_data: DDDAtomOutput`

Both event_type values are already in the migration 005 CHECK enum
declared at P100 W2 LOG-BUILD (no schema migration needed). Closes
P101 carry-forward #2 named by ADR-127 §C1 §4.2 — atoms named in
the schema but never emitted.

## Out of Scope (Tier-2 / post-RC)

- **Build-time EOP pre-bake** — Vite plugin reads disk EOP triplet
  + injects markdown into PhaseCard fixtures at build. Tier-2;
  requires plugin scaffold not in open-core scope.
- **Markdown table parsing** — minimal renderer skips `|---|`
  tables. EOP triplet uses bullet lists for tables. KISS holds.
- **Seal automation across phases** — auto-emit EOP triplet from
  agent results + auto-bump CLAUDE.md. P101+ if owner reverses
  manual-seal-discipline rule.
- **Round-trip EOP edits** — Seal Panel is read-only at open-core.
  Edit-then-resave is post-RC.

## Acceptance Gates

1. `SealPanel` exports the component from
   `src/components/agentics/SealPanel.tsx` (NEW, A7-owned).
2. SealPanel source carries `seal-phase-button` + `seal-card-post-review`
   + `seal-card-session-log` + `seal-card-retrospective` testids.
3. `Agentics.tsx` imports + renders `<SealPanel>` (A8-owned).
4. `PlanningChatBar.tsx` contains both `process_atom_output` AND
   `ddd_atom_output` event_type references (A8-owned;
   closes P101 #2).
5. No new deps; no animation libs; no full-markdown parser in any
   P99 source.

## Consequences

**Positive:** EOP triplet is now a first-class workbench surface —
Hey Bradley user reads the seal verdict + retrospective inline
without leaving Agentics. P101 carry-forward #2 closes — every
event_type declared in migration 005 now has an emit site. The
methodology arc (P97 TDD + P98 KISS + P99 Seal) is the "Reflect"
surface complete.

**Negative:** Runtime EOP prop is `null` until Tier-2 bake plugin
ships — open-core users see the empty-state card on every phase.
Ship-clean honesty over fake content.

**Mitigations:** Tier-2 build-time bake explicitly named in §"Out
of Scope". Open-core ships the contract + the empty-state; the
bake pipeline is the commercial extension.
