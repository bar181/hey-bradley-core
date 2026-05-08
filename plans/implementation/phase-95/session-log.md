# P95 / SPEC-WORKBENCH — Session Log

- **Phase:** P95 · **Sprint:** SPEC-WORKBENCH · **Date:** 2026-05-01
- **Predecessor:** P94 sealed (~1162+ GREEN, 120 ADRs, AISP suite COMPLETE at 8 atoms)

## Dispatch

3 parallel agents · disjoint scopes · single-wave (planning-sprint-first; 5 sequential design docs at `phase-95/00..04` consumed BEFORE any agent dispatch).

## Per-agent results

| Agent | Files owned | Result | LOC delta |
|---|---|---|---|
| A1 | `src/components/agentics/SpecWorkbench.tsx` (NEW) | GREEN — pure component; 3-tab strip; sprint cards expandable; clipboard CTA; empty state | +~420 / 1 file |
| A2 | `src/data/sample-spec-workbench.ts` (NEW) + `src/pages/Agentics.tsx` (EDIT) + `src/pages/Planning.tsx` (EDIT) | GREEN — sample data with ≥3 PhaseCard entries; both pages mount `<SpecWorkbench>` | +~150 sample + ~30 page edits / 3 files |
| A3 | `docs/adr/ADR-121-spec-workbench-architecture.md` (NEW) + `tests/p95-spec-workbench.spec.ts` (NEW) + EOP triplet at `seal/` subfolder + `CLAUDE.md` (EDIT) | GREEN — ADR 106 LOC ≤ 120 cap; 16 test cases / 7 describes; EOP triplet at `seal/` to avoid filename collision with planning docs | ~106 ADR + ~245 spec + ~285 EOP + ~6 CLAUDE.md edits / 6 files |

## ADR ledger

- 120 → 121 Accepted (ADR-121 — SpecWorkbench Architecture)
- Cross-refs ADR-095 (Library-Wide Polish) + ADR-110 (AISP Visibility) + ADR-116 (Three-Mode Architecture) + ADR-117 (Process Map SVG)

## Cumulative tests anchor

- P94 anchor: ~1162+ PURE-UNIT GREEN
- P95 adds: ~15 (16 cases / 7 describes per `tests/p95-spec-workbench.spec.ts`)
- **P95 seal anchor: ~1177+ cumulative PURE-UNIT GREEN**

## Methodology note

The planning-sprint-first dispatch pattern worked. A1 and A2 received clear specs from `04-sprint-plan.md` (Σ blocks per agent, file conflict map, TDD requirements list, KISS strikes denylist) BEFORE any code was written. The result was zero mid-sprint scope confusion: A1 knew exactly what the 3-tab + sprint-card layout looked like (Q1 resolved); A2 knew the sample-data shape was driven by the ADR-121 D3 prop contract; A3 knew the EOP went to `seal/` subfolder to avoid filename collision with the 5 planning docs at `phase-95/`.

The 5-doc planning sprint added ~30 minutes upfront vs. cold-dispatch but eliminated the scope-collision and re-design loops that historically cost 1-2 hours mid-sprint. Net velocity gain even at the first attempted use of the pattern.

## Carry-forward

- P96 / ADR-122 (Export Claude Code): consume `AgentAtomOutput` from SpecWorkbench → produce ZIP bundle (CLAUDE.md + swarm.json + ADR stubs + per-agent prompts).
- Live `classifyAgents()` invocation per atom expansion (waits on AgentProxy runtime activation).
- Inline-edit (rename roles, add DoD items, reassign ownedFiles) — P96+ when round-trip lands.
- Status palette tokens (`--hb-status-sealed` + `--hb-status-deferred`) — future palette pass.
- Workbench search / filter box — Tier-2 if owner reverses Q3 strike.
