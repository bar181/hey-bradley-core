# ADR-128 — TDD Scaffold + AGENT_ATOM Production Wire

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P97 / TDD-SCAFFOLD
- **Cross-refs:** ADR-120 (AGENT_ATOM), ADR-121 (SpecWorkbench), ADR-122 (Export Claude Code), ADR-127 (Format Verification)

## Context

P100 W2 / FMT-VERIFY (ADR-127) flagged AGENT_ATOM as **0 production
call sites** despite shipping at P94 — `classifyAgents()` was exported
but never imported anywhere downstream of the atom suite. AGENT_ATOM
was the headline carry-forward (P101 #1) on the FMT-VERIFY retro.

P97 closes that carry-forward by wiring AGENT_ATOM into
`PlanningChatBar.tsx` alongside the existing PROCESS + DDD fan-out, so
every Planning-mode submit produces an `AgentSpec[]` per wave. The
combined sprint adds a second deliverable: a deterministic TDD
scaffold generator that consumes the now-live `AgentSpec[]` plus
`BoundedContext[]` (DDD) plus AISP Σ Γ-rules to emit Given/When/Then
markdown. The scaffold ships into the Claude Code bundle (ADR-122) as
a 7th logical file (`phase-plans/{id}-test-spec.md`) so downstream
consumers (Claude Code, Cursor, any LLM agent) get test cases in the
same drop as the spec.

This is the consumer-experience phase of the AW arc: P95
(SpecWorkbench review) → P96 (Export materialization) → **P97 (TDD
scaffold = first-use experience)**. With AGENT_ATOM production-wired,
every Crystal Atom in the AISP suite has ≥1 import site — closing the
dead-code state ADR-127 §C1 §4.1 named.

## Decisions

### Decision 1 — TDD scaffold is a pure module

`buildTDDScaffold(phase, contexts?, agents?)` returns
`TDDScaffoldOutput` from a `PhaseCard` plus optional `BoundedContext[]`
plus optional `AgentSpec[]`. No React, no fs/network, no store imports.
Pure transform mirrors ADR-121 D3 (SpecWorkbench prop-contract) +
ADR-122 store-agnostic emitter pattern. Testable in isolation;
mountable from any surface (SpecWorkbench export-button OR Claude Code
bundle emitter — both consume the same module).

### Decision 2 — Test cases derived from 4 sources

Every test case carries a `derivedFrom` classifier:

1. **AISP-Σ** — parsed from `sprint.aispSpec` Γ-rules (R1, R2, ...)
2. **DDD-context** — per `BoundedContext.responsibility`
3. **AGENT-DoD** — per `AgentSpec.dod[]` checklist bullet
4. **phase-gate** — per `phase.adrRefs[]` ADR cross-reference

The 4-source classification means a downstream consumer can filter by
source kind (e.g. show only AGENT-DoD-derived cases for a single
agent's scope) without re-parsing. Cap is 30 test cases per phase to
keep bundles bounded; truncation marker emitted past cap.

### Decision 3 — AGENT_ATOM wired into PlanningChatBar

Closes P101 carry-forward #1 (ADR-127 §70). `classifyAgents()` is now
called per wave on every Planning-mode submit, producing an
`AgentSpec[]` that flows into the same `onRawText` fan-out path used by
PROCESS + DDD atoms (ADR-119 D4). AgentProxy hand-off remains inert at
open-core scope (rules-based deterministic baseline; live-LLM call
deferred to first owner BYOK smoke run per ADR-127 §70). Every Crystal
Atom in the AISP suite now has ≥1 production import site.

### Decision 4 — Test spec joins Claude Code bundle

`exportClaudeCode.ts` imports `buildTDDScaffold` and emits a 7th
logical file (`phase-plans/{id}-test-spec.md`) into the markdown bundle
per ADR-122 D2 file-marker pattern. Bundle file count is now ≥7 (was
≥6 at P96). Downstream consumer reads spec + tests in the same drop —
TDD-first workflow on the consumer's side without extra round-trips.

## Out of Scope (Tier-2)

- BDD framework code generation (Cucumber/Gherkin parser + step
  definitions in target language) — Tier-2 commercial; open-core ships
  Given/When/Then markdown as the contract.
- AI-generated test bodies (LLM fills `expect(...).toBe(...)` lines) —
  Tier-2 commercial; requires live AgentProxy + per-language test
  framework awareness. Open-core ships scaffold-only.
- Cross-phase test reuse / shared step library — Tier-2; each phase
  emits a standalone scaffold today, no de-duplication across phases.

## Acceptance Gates

1. `tddScaffoldGenerator` exports `buildTDDScaffold` function +
   `TDDScaffoldOutput` interface from
   `src/contexts/specification/exporters/tddScaffoldGenerator.ts`.
2. `PlanningChatBar.tsx` contains a `classifyAgents` import — A1 wire
   verification (closes P101 #1).
3. `SpecWorkbench.tsx` carries a `generate-test-spec` testid — A2 UI
   surface verification.
4. `exportClaudeCode.ts` imports `buildTDDScaffold` — A2 bundle wire
   verification.
5. No new deps in `package.json`; no animation libs in P97 source.

## Consequences

**Positive:** AGENT_ATOM is no longer dead code — every atom in the
AISP suite has ≥1 production import site. ADR-127 §C1 §4.1
"dead-code masquerading as production wiring" state is now closed for
AGENT. TDD scaffold ships as the consumer-experience surface; Claude
Code bundle now contains tests + spec in a single drop. The
`derivedFrom` classifier makes scaffold filtering trivial downstream.

**Negative:** Bundle size grows by ~3-8KB per phase from the appended
test-spec.md file. PlanningChatBar fan-out now invokes 3 atoms per
submit (PROCESS + DDD + AGENT) — latency rises proportionally; at
rules-based scope this remains <50ms total.

**Mitigations:** Cap of 30 test cases per phase keeps bundle growth
bounded. Tier-2 commercial deferrals (BDD + AI test bodies +
cross-phase reuse) explicitly named in §"Out of Scope" so the
open-core scope stays scaffold-only.
