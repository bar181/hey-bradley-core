# ADR-119 — DDD_ATOM (7th Crystal Atom)

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P93 / AW-DDD-ATOM
- **Cross-refs:** ADR-053 (INTENT_ATOM), ADR-099 (DECOMP_ATOM), ADR-118 (PROCESS_ATOM)

## Context

P92 sealed PROCESS_ATOM — decomposes a project description into
phases/sprints/waves/agents → ProcessMapSVG. P93 ships the
complementary atom DDD_ATOM — classifies the same description into
bounded contexts + relationships → DomainModelSVG.

PROCESS is the **time-axis** decomposition (when), DDD is the
**domain-axis** decomposition (which contexts own what). Both atoms
read the same chat input; PlanningChatBar relays raw text via
`onRawText` so the page fans out to both atoms in parallel.

DDD_ATOM brings the AISP suite to **8 atoms**: 5 baseline (PATCH /
INTENT / SELECTION / CONTENT / ASSUMPTIONS) + DECOMP + PROCESS + DDD.
AGENT_ATOM (P94+) caps the suite for the Agentics arc.

## Decisions

### Decision 1 — DDD_ATOM is the 7th Crystal Atom (boundary vs PROCESS_ATOM)

DDD_ATOM is a NEW Crystal Atom, distinct from PROCESS_ATOM:

- **PROCESS_ATOM** (ADR-118): description → `phases/sprints/waves/agents`
  → ProcessMapSVG. Time-axis. Consumer: process viewer.
- **DDD_ATOM** (this ADR): description → `contexts + relationships`
  → DomainModelSVG. Domain-axis. Consumer: domain viewer.

Different shapes, different consumers, different axes. They co-exist
in Planning mode behind a `PlanningView = 'process-map' | 'domain-model'`
toggle. The atoms compose — both run on the same chat submit — they
do not overlap.

### Decision 2 — AISP Σ contract: contexts + relationships

```
Ω := { Identify bounded contexts from project description }
Σ := { contexts: BoundedContext[], relationships: ContextRelationship[] }
Γ := { |contexts| ≤ 8, ∀ c : c.responsibility.length ≥ 1, pairs unique, kind ∈ {partnership, customer-supplier, conformist, anti-corruption-layer} }
Λ := { contexts.relatedPhaseIds bridges to PROCESS_ATOM phases; relationships render in DomainModelSVG }
Ε := { V1: no shared mutable state, V2: ACL relationships note cross-domain boundaries, V3: context.id unique }
```

`|contexts| ≤ 8` (Γ R1) keeps the rendered graph readable on the
375px mobile viewport and prevents runaway LLM generation; 4 fixed
relationship kinds (Γ R4) — partnership / customer-supplier /
conformist / anti-corruption-layer — match canonical DDD vocabulary.

### Decision 3 — Rules-only baseline; AgentProxy hand-off scaffolded inert

Mirrors ADR-118 D3 exactly. The atom exposes two paths:

1. `classifyContexts(description)` — rules-based deterministic baseline
   (token recipes for auth/payment/user/dashboard/notification/search/
   collaboration; 2-context Core/Infrastructure default fallback).
   Always available; zero network. This is what Planning mode invokes
   today via `handleRawText`.
2. `buildDDDAtom(description)` → `{prompt, schema}` + AgentProxy call
   + `parseDDDResponse(raw)` — LLM-enriched path. Wired but inert at
   P93 (AgentProxy runtime lands P94+). Tier-2 commercial activates
   the live BYOK call.

Open-core ships **no** `@anthropic-ai/sdk` install at P93.

### Decision 4 — View toggle in Planning mode swaps process map ↔ domain model

`PlanningViewToggle` (2-tab; `process-map` | `domain-model`) lives in
the Planning header. Center pane renders `ProcessMapSVG` (default) or
`DomainModelSVG` (toggle). Both views share the same chat bar — one
submit, two atoms run, both states populated. When the user toggles
to `domain-model` before any chat input, an empty-state prompt
("Type a project description to see its domain model") surfaces;
no broken render.

## Out of scope (Tier-2 commercial / post-RC)

- Live AgentProxy runtime invocation (carry-forward to P94+)
- Bounded-context auto-clustering ML (Tier-2 learning runtime)
- Multi-team context handoff visualization (Tier-2 commercial)
- Cross-project context federation (single-project at P93)
- Drag-to-rearrange context positions (Tier-2; mirrors ADR-117 D2)
- Multi-turn context accumulator (DECOMP_ATOM family)

## Acceptance gates

- ADR ≤120 LOC; Status: Accepted; 4 decisions enumerated
- Cross-refs ADR-053 + ADR-099 + ADR-118
- `src/contexts/intelligence/aisp/dddAtom.ts` exists; exports
  `classifyContexts` + `buildDDDAtom` + `parseDDDResponse` +
  `toDomainModel` + `DDD_ATOM` const + `BoundedContext` /
  `ContextRelationship` / `DDDAtomOutput` / `DomainModel` types
- `src/components/planning/DomainModelSVG.tsx` exists with testid
  `domain-model-svg`
- `src/components/planning/PlanningViewToggle.tsx` exists with three
  testids (`planning-view-toggle` / `view-toggle-process-map` /
  `view-toggle-domain-model`)
- `src/pages/Planning.tsx` imports + renders `PlanningViewToggle`
  + `DomainModelSVG`; wires `onRawText` → `classifyContexts` →
  `liveDomainModel`
- KISS — no animation libs / no new deps in P93 source
- EOP triplet (02-post-review.md / session-log.md / retrospective.md)

## Consequences

- **Positive:** 7th Crystal Atom in production with deterministic
  baseline (no live LLM dep at open-core); DomainModelSVG driven by
  same chat input as ProcessMapSVG; view toggle composes both views
  cleanly; AgentProxy hand-off path scaffolded for P94+.
- **Negative:** rules-based classifier is keyword-heuristic only;
  context auto-positioning is naive (single horizontal row at y=120);
  multi-team handoff visualization deferred to Tier-2.
- **Mitigations:** classifier pure / deterministic / unit-testable;
  LLM-enrichment wired but inert; richer layout Tier-2 deferral.
