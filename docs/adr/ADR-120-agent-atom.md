# ADR-120 — AGENT_ATOM (8th + final Crystal Atom)

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P94 / AW-AGENT-ATOM
- **Cross-refs:** ADR-045 (PATCH_ATOM), ADR-053 (INTENT_ATOM), ADR-099 (DECOMP_ATOM), ADR-118 (PROCESS_ATOM), ADR-119 (DDD_ATOM)

## Context

P92 sealed PROCESS_ATOM (project → phases/sprints/waves/agent
skeletons → ProcessMapSVG). P93 sealed DDD_ATOM (project →
bounded contexts + relationships → DomainModelSVG).

P94 ships AGENT_ATOM — the 8th and final Crystal Atom in the AISP
suite. It enriches PROCESS_ATOM's lightweight `AgentScope` into a
full `AgentSpec` with `role` + `ownedFiles` (disjoint per wave) +
`scope` + `dod` (definition-of-done checklist) + `inputs` +
`outputs`. `WaveContext` bridges PROCESS time-axis output to
DDD domain-axis output so DoD can reference both.

AISP suite is now COMPLETE at 8 atoms: 5 baseline (PATCH / INTENT /
SELECTION / CONTENT / ASSUMPTIONS) + DECOMP + PROCESS + DDD + AGENT.

## Decisions

### Decision 1 — AGENT_ATOM is the 8th and final Crystal Atom

AGENT_ATOM closes the AISP suite. The suite covers a complete
intent-to-dispatch pipeline: INTENT / DECOMP / SELECTION / CONTENT /
ASSUMPTIONS at chat-turn granularity; PATCH for per-section state
delta; PROCESS for project-level time-axis decomposition; DDD for
project-level domain-axis decomposition; AGENT (this ADR) for
wave-level dispatch decomposition. No further atoms planned for the
open-core arc. Future Crystal Atoms (e.g. EVAL_ATOM for Tier-2
LLM-judge scoring) live behind the commercial boundary.

### Decision 2 — AISP Σ contract: AgentSpec[] with disjoint ownedFiles + DoD

```
Ω := { Decompose wave into ordered AgentSpec[] with disjoint owned-files + DoD checklists }
Σ := { waveId, agents: AgentSpec[], rationale }
Γ := { R1: |agents| ≤ 7, R2: ∀ a : a.dod.length ≥ 1, R3: ∀ wave : ownedFiles disjoint across same-wave agents, R4: a.role kebab-case }
Λ := { agents within the wave run in parallel; ownedFiles MUST be disjoint to prevent merge conflicts }
Ε := { V1: VERIFY ownedFiles disjoint per wave, V2: VERIFY dod ≥ 1 per agent, V3: VERIFY role unique within the wave }
```

`|agents| ≤ 7` (Γ R1) keeps a wave below the swarm-coordination
ceiling that's been observed throughout the OC arc (most successful
multi-agent waves run 3-5 agents). Disjoint `ownedFiles` (Γ R3 / Ε
V1) is the load-bearing invariant — it's what makes parallel
dispatch safe without merge conflicts. Every agent must carry at
least one DoD item (Γ R2) so the receiving runtime has a checkable
seal-gate.

### Decision 3 — AgentProxy adapter only; no live LLM at P94

Mirrors ADR-118 D3 + ADR-119 D3 exactly. The atom exposes two paths:

1. `classifyAgents(waveContext)` — rules-based deterministic
   baseline. Always available; zero network. Inflates each
   `AgentScope` from the upstream Wave into a full `AgentSpec` using
   role-keyword recipes (schema-design, test-coverage, etc.) +
   disjoint file-suffix allocation.
2. `buildAgentAtom(waveContext)` → `{prompt, schema}` + AgentProxy
   call + `parseAgentResponse(raw)` — LLM-enriched path. Wired but
   inert at P94 (AgentProxy runtime activation lands P95+). Tier-2
   commercial activates the live BYOK call.

Open-core ships **no** new `@anthropic-ai/sdk` invocation at P94.

### Decision 4 — Prepares SpecWorkbench (P95) + Export Claude Code (P96)

`AgentAtomOutput` is the input schema for the next two Agentic
Workbench arc sprints: **P95 SpecWorkbench** is the UI surface that
lets the user review/edit the generated `AgentSpec[]` before
dispatch (rename roles, add DoD items, reassign ownedFiles between
agents, reorder). **P96 Export Claude Code** materializes the
reviewed `AgentAtomOutput` into a dispatch-ready prompt bundle —
one prompt per agent, owned-files inline, DoD as the per-agent
acceptance checklist. P94 ships the atom only.

## Out of scope (Tier-2 commercial / post-RC)

- Live AgentProxy runtime invocation (carry-forward to P95+)
- Cross-wave agent reuse / agent-pool optimization (Tier-2)
- ML-enriched ownedFile inference (Tier-2 learning runtime; uses
  ruvector / HNSW indexed history of past waves)
- UI for agent editing — SpecWorkbench (P95)
- Export Claude Code dispatch bundle (P96)
- Agent-skill-matching across projects (Tier-2 commercial)

## Acceptance gates

- ADR ≤120 LOC; Status: Accepted; 4 decisions enumerated
- Cross-refs ADR-045 + ADR-053 + ADR-099 + ADR-118 + ADR-119
- `src/contexts/intelligence/aisp/agentAtom.ts` exists; exports
  `classifyAgents` + `buildAgentAtom` + `parseAgentResponse` +
  `AGENT_ATOM` const + `AgentSpec` / `AgentAtomOutput` /
  `WaveContext` types
- KISS — no animation libs / no new deps in P94 source
- EOP triplet (02-post-review.md / session-log.md / retrospective.md)

## Consequences

- **Positive:** AISP suite COMPLETE at 8 atoms; deterministic
  baseline ships at open-core (no live LLM dep); disjoint-ownedFiles
  invariant codifies the merge-conflict-free pattern that's been
  load-bearing since P74; atom output feeds directly into P95
  SpecWorkbench + P96 Export pipelines.
- **Negative:** rules-based classifier is keyword-heuristic; ML
  ownedFile inference deferred to Tier-2; no UI for editing the
  generated specs at P94 (must wait for P95).
- **Mitigations:** classifier pure / deterministic / unit-testable;
  AgentProxy hand-off scaffolded for P95+; SpecWorkbench is the
  next sprint, not multi-phase deferred.
