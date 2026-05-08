# ADR-118 — PROCESS_ATOM (6th Crystal Atom)

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P92 / AW-PROCESS-ATOM
- **Cross-refs:** ADR-045 (PATCH_ATOM), ADR-053 (INTENT_ATOM), ADR-099 (DECOMP_ATOM), ADR-116 (Three-Mode Product Architecture), ADR-117 (Process Map SVG Architecture)

## Context

P91 sealed Process Map SVG visualization — the read-only viewer that
narrates a build path as phases / sprints / waves / agents. The viewer
shipped fed by hand-authored sample data (`HEY_BRADLEY_SAMPLE_MAP`).

P92 ships the atom that produces those maps from a project description.
The owner types "build a SaaS with auth and payments" in Planning mode;
PROCESS_ATOM decomposes the description into a `ProcessAtomOutput`
(`phases` / `sprints` / `waves` / `agents`); a `toProcessMap` adapter
emits `{ nodes, edges }` that ProcessMapSVG renders directly.

PROCESS_ATOM is **the 6th Crystal Atom** in the AISP suite, joining
PATCH_ATOM (ADR-045), INTENT_ATOM (ADR-053), SELECTION_ATOM (ADR-057),
CONTENT_ATOM (ADR-060), ASSUMPTIONS_ATOM (ADR-064), and DECOMP_ATOM
(ADR-099) — counted as 6+1 (5 baseline + DECOMP + PROCESS).

## Decisions

### Decision 1 — PROCESS_ATOM is the 6th Crystal Atom (boundary vs DECOMP_ATOM)

PROCESS_ATOM is a NEW Crystal Atom — distinct from DECOMP_ATOM:

- **DECOMP_ATOM** (ADR-099): single-session multi-clause utterance →
  ordered `Todo[]` for matcher patches. Scope: one user prompt.
- **PROCESS_ATOM** (this ADR): multi-phase project description →
  `ProcessAtomOutput` for ProcessMap viz. Scope: one project plan.

Different time-horizons (turn vs project), different output shapes
(Todo[] vs phases/sprints/waves/agents), different consumers (matcher
vs SVG renderer). The atoms compose, they do not overlap.

### Decision 2 — AISP Σ contract: phases / sprints / waves / agents

```
Ω := { Decompose project description into phases/sprints/waves/agents }
Σ := { Phase[], Sprint[], Wave[], AgentScope[] }
Γ := { |phases| ≤ 5, |sprints/phase| ≤ 4, |agents/wave| ≤ 7, position ∈ [0,4] }
Λ := { sequential phases; parallel waves ⟺ wave.parallel; sprint gate requires DoD }
Ε := { V1: ownedFiles disjoint same-wave, V2: gate.dod ≥ 1, V3: phase.id unique }
```

Bounded fan-out (≤5 phases × ≤4 sprints × ≤7 agents) keeps the rendered
graph readable on a 375px mobile viewport and prevents runaway LLM
generation from blowing past viewport budget.

### Decision 3 — AgentProxy adapter only; no live LLM dependency this sprint

Open-core ships **no** `@anthropic-ai/sdk` install at P92. The atom
exposes two paths:

1. `classifyProcess(description)` — rules-based deterministic baseline
   (keyword detection: saas/blog/ecommerce/portfolio/dashboard
   verticals + auth/payments/cms/api enrichments). Always available;
   zero network. This is what the open-core PlanningChatBar invokes
   today.
2. `buildProcessAtom(description)` → `{ prompt, schema }` + AgentProxy
   call + `parseProcessResponse(raw)` — LLM-enriched path. Wired but
   inert at P92 (AgentProxy runtime lands P94+). Tier-2 commercial
   activates the live BYOK call.

The Crystal Atom verbatim (`PROCESS_ATOM` const) is exported for
prompt-injection — the same pattern P74's DECOMP_ATOM uses.

### Decision 4 — `toProcessMap` adapter feeds ProcessMapSVG directly

`toProcessMap(output)` walks `output.phases` and emits one
`ProcessNode` per phase (rect shape) plus one `ProcessEdge` per
adjacent pair (`type: 'sequential'`). Sprint + wave + agent records
live in the atom output but are NOT rendered as additional nodes at
P92 — the open-core map is phase-level only (KISS).

Tier-2 commercial expands to the full multi-level view (phase nodes →
sprint diamonds → wave parallel-edges → agent leaves).

## Out of scope (Tier-2 commercial / post-RC)

- Live AgentProxy runtime invocation (carry-forward to P94+)
- Drag-to-rearrange phase reordering (Tier-2; ADR-117 D2)
- Cross-project decomposition (single-project atom only at P92)
- Rules-classifier ML enrichment via vector-DB lookup (Tier-2 learning)
- Sprint + wave + agent rendering as additional graph levels (Tier-2)
- Multi-turn requirements accumulator (DECOMP_ATOM family)

## Acceptance gates

- ADR ≤120 LOC; Status: Accepted
- 4 decisions enumerated
- Cross-refs ADR-045 + ADR-053 + ADR-099 + ADR-116 + ADR-117
- `src/contexts/intelligence/aisp/processAtom.ts` exists; exports
  `classifyProcess` + `buildProcessAtom` + `parseProcessResponse` +
  `toProcessMap` + `PROCESS_ATOM` const + Phase/Sprint/Wave/AgentScope
  type interfaces
- `src/components/planning/PlanningChatBar.tsx` exists with three
  testids (`planning-chat-bar` / `planning-chat-input` /
  `planning-chat-submit`); imports from `processAtom`
- `src/pages/Planning.tsx` imports + mounts `PlanningChatBar`
- KISS — no animation libs / no new deps in P92 source
- EOP triplet (02-post-review.md / session-log.md / retrospective.md)

## Consequences

- **Positive:** 6th Crystal Atom in production with deterministic
  baseline (no live LLM dep at open-core); ProcessMapSVG now driven by
  user input (was hardcoded sample at P91); boundary vs DECOMP_ATOM
  documented; AgentProxy hand-off path scaffolded for P94+ activation.
- **Negative:** rules-based classifier is keyword-heuristic only — no
  semantic understanding until AgentProxy lands; sprint/wave/agent
  records produced but not rendered at P92.
- **Mitigations:** classifier is pure / deterministic / unit-testable;
  LLM path wired but inert; full multi-level rendering deferred
  cleanly to Tier-2 with the data shape already present.
