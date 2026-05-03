# P94 / AW-AGENT-ATOM — Post-Review

- **Phase:** P94 · **Sprint:** AW-AGENT-ATOM · **Date:** 2026-05-01
- **Predecessor:** P92 + P93 sealed (~1147+ GREEN, 119 ADRs, 7 Crystal Atoms live)
- **Dispatch:** 2 parallel agents · disjoint scopes · single-wave (A1 atom + A2 closer)

## Per-agent score

| Agent | Owns | LOC delta | Score | Notes |
|---|---|---|---|---|
| A1 | `src/contexts/intelligence/aisp/agentAtom.ts` (NEW; ≤300 LOC cap) — AGENT_ATOM 8th + FINAL Crystal Atom. Σ/Ω/Γ/Λ/Ε header per AISP convention. Exports `AGENT_ATOM` const + `WaveContext` / `AgentSpec` / `AgentAtomOutput` interfaces + `classifyAgents` (rules-based deterministic; inflates each `AgentScope` from upstream Wave into full `AgentSpec` using role-keyword recipes + disjoint file-suffix allocation) + `buildAgentAtom` (returns `{prompt, schema}` for AgentProxy hand-off) + `parseAgentResponse` (JSON-or-fenced parse with Σ/Γ/Ε validation). Pure module; no React, no store imports; no live LLM dependency. | +~290 / 1 file | 90/100 | Mirrors processAtom + dddAtom patterns. AgentProxy path scaffolded but inert. Disjoint-ownedFiles invariant codified (Ε V1). |
| A2 | `docs/adr/ADR-120-agent-atom.md` (NEW; ≤120 LOC cap; Status Accepted; 4 decisions; cross-refs ADR-045/053/099/118/119) + `tests/p94-agent-atom.spec.ts` (NEW; 7 describes / 15 cases; existsSync soft-pass guards on A1 surface; hard-gate on ADR-120 + EOP triplet) + EOP triplet (this file + session-log.md + retrospective.md) + `CLAUDE.md` sync (ADRs 119 → 120; tests +~15 → ~1162+; capabilities entry; atoms count 7 → 8 AISP suite COMPLETE; Current Phase line). | ~115 ADR + ~190 spec + ~285 EOP / 6 files | 90/100 | ADR cites all 5 ADR refs. Tests use existsSync soft-pass on A1 surface; hard-gate on ADR-120 + EOP. KISS denylist on banned tokens + package.json boundary check. |

## Acceptance gates

- [x] ADR-120 ≤120 LOC, Status Accepted, 4 decisions
- [x] Cross-refs ADR-045 + ADR-053 + ADR-099 + ADR-118 + ADR-119
- [x] `agentAtom.ts` exists; exports `classifyAgents` + `buildAgentAtom` + `parseAgentResponse`
- [x] `AGENT_ATOM` const + `WaveContext` / `AgentSpec` / `AgentAtomOutput` interfaces exported
- [x] Disjoint ownedFiles invariant (Ε V1) documented in source
- [x] Γ R1 cap of 7 agents/wave referenced in source
- [x] No banned animation libs in P94 source; no new opaque deps in `package.json`
- [x] EOP triplet (this file + session-log.md + retrospective.md)
- [x] CLAUDE.md sync (ADRs 119 → 120; capabilities entry; cumulative anchor; atoms 7 → 8)

## Honest deferred declarations

- **Live AgentProxy runtime invocation** — carry-forward to P95+. The
  `buildAgentAtom` + `parseAgentResponse` path is wired but inert at
  P94; rules-based `classifyAgents` is what runtime invokes today.
- **Cross-wave agent reuse / agent-pool optimization** — Tier-2
  commercial. Single-wave atom at P94; cross-wave pooling is a
  Tier-2 expansion.
- **UI for agent editing** — P95 SpecWorkbench. P94 ships the atom
  only; the review/edit surface lands next sprint.
- **ML-enriched ownedFile inference** — Tier-2 learning runtime.
  Open-core ships keyword-recipe + disjoint file-suffix allocation;
  ML enrichment uses ruvector / HNSW history of past waves at Tier-2.
- **Export Claude Code dispatch bundle** — P96. The materialization
  of `AgentAtomOutput` into per-agent prompts lands two sprints out.
- **Agent-skill-matching across projects** — Tier-2 commercial.
  Single-project atom at P94.

## Test count delta narrative

- P93 anchor: ~1147+ PURE-UNIT GREEN
- P94 spec adds: ~15 (P94.1-P94.7 / 15 cases per `tests/p94-agent-atom.spec.ts`)
- **P94 seal anchor: ~1162+ cumulative PURE-UNIT GREEN**

P94 spec is 7 describe blocks (P94.1 ADR-120 file shape · P94.2
agentAtom exports · P94.3 AGENT_ATOM Σ header present · P94.4 type
exports · P94.5 disjoint ownedFiles invariant documented · P94.6
KISS no banned libs + package.json boundary · P94.7 EOP triplet).
existsSync soft-pass guards on A1 surface; hard-gate on A2-owned
files (ADR-120 + EOP triplet).

## Reframe — milestone closer

P94 ships **the 8th and FINAL Crystal Atom** in the AISP suite:

- Baseline 5: PATCH + INTENT + SELECTION + CONTENT + ASSUMPTIONS
- Specialized 3: DECOMP (P74) + PROCESS (P92) + DDD (P93)
- Final: AGENT (P94)

**AISP suite is COMPLETE.** No further atoms are planned for the
open-core arc. Future Crystal Atoms (e.g. EVAL_ATOM for Tier-2
LLM-judge scoring) live behind the commercial boundary.

The atom-design phase of the Agentic Workbench arc is now CLOSED.
P95+ pivots to UI surfaces (SpecWorkbench), export pipeline (P96),
TDD scaffold (P97), KISS+Review gate (P98), and the seal panel
(P99-P100). The atoms feed those surfaces — they're the stable
contract layer.

## Boundary held

The disjoint-ownedFiles invariant (Ε V1 / Γ R3) codifies the
merge-conflict-free pattern that's been load-bearing since P74.
Every multi-agent wave from P74 → P94 has held this invariant
implicitly via preflight planning; P94 now makes it a Σ-contract
guarantee that downstream consumers (SpecWorkbench, Export) can rely
on without re-validating.
