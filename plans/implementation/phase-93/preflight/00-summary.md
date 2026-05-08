# P93 — DDD_ATOM (Preflight)

> **Phase:** P93 · **Sprint:** AW-DDD-ATOM · **Date:** 2026-05-01
> **Predecessor:** P91 sealed at `ade0540`; P92 parallel
> **Companion:** P92 PROCESS_ATOM (parallel)
> **Cross-refs:** ADR-053 (INTENT_ATOM), ADR-099 (DECOMP_ATOM), ADR-116 (Three-Mode Architecture), ADR-117 (Process Map SVG), ADR-118 (PROCESS_ATOM)

## Mandate — 7th Crystal Atom

DDD_ATOM identifies bounded contexts from project description. Renders as a domain-model SVG visualization toggleable from the process map view in Planning mode.

## 3 agents · 2 waves

### Wave 1 (parallel): A4 + A5

#### A4 — DDD_ATOM Crystal Atom
**Owns:**
- `src/contexts/intelligence/aisp/dddAtom.ts` (NEW; ≤300 LOC)

Σ/Ω/Γ/Λ/Ε header per AISP convention:
- Ω := { Identify bounded contexts from project description }
- Σ := { contexts: BoundedContext[], relationships: ContextRelationship[] }
- Γ := max 8 contexts; clear responsibility boundary per context
- Λ := contexts map to phases where possible
- Ε := no shared state; explicit anti-corruption layers between contexts

Required exports:
```ts
export interface BoundedContext {
  id: string
  name: string
  responsibility: string
  relatedPhaseIds: string[]
  x: number  // SVG coords
  y: number
}
export type ContextRelationshipKind = 'partnership' | 'customer-supplier' | 'conformist' | 'anti-corruption-layer'
export interface ContextRelationship {
  from: string  // BoundedContext.id
  to: string
  kind: ContextRelationshipKind
}
export interface DDDAtomOutput {
  contexts: BoundedContext[]
  relationships: ContextRelationship[]
  rationale: string
}
export interface DomainModel {
  contexts: BoundedContext[]
  relationships: ContextRelationship[]
}
export function buildDDDAtom(description: string): { prompt: string; schema: object }
export function classifyContexts(description: string): DDDAtomOutput  // rules-based deterministic
export function parseDDDResponse(raw: string): DDDAtomOutput
export function toDomainModel(output: DDDAtomOutput): DomainModel
```

**Constraints:** Pure module. No store imports. AgentProxy only.

#### A5 — DomainModelSVG component + view toggle
**Owns:**
- `src/components/planning/DomainModelSVG.tsx` (NEW; ≤220 LOC) — pure SVG, mirrors ProcessMapSVG patterns:
  - Bounded context boxes (rect with rounded corners; label + responsibility on click)
  - Relationship arrows between contexts (4 kinds via stroke style: partnership=solid, customer-supplier=arrow, conformist=dashed, anti-corruption=double-line)
  - `data-testid="domain-model-svg"` + ARIA role="img"
  - viewBox-scaled responsive
  - NO animation libs; NO new deps; pure React + SVG primitives
- `src/components/planning/PlanningViewToggle.tsx` (NEW; ≤80 LOC) — toggle component:
  - Two tabs: "Process Map" and "Domain Model"
  - Active tab styled with `var(--hb-accent)` background
  - `data-testid="planning-view-toggle"` + per-tab `data-testid="view-toggle-process-map"` + `data-testid="view-toggle-domain-model"`
  - Props: `value: 'process-map' | 'domain-model'` + `onChange: (value) => void`
  - Token-compliant; focus rings; ADR-091

**Constraints:** Both components stand alone. A6 wires them into Planning.tsx in Wave 2.

DO NOT touch Planning.tsx (A6 wires).

### Wave 2 (sequential after P92/A3 + P93 Wave 1): A6

#### A6 — Planning.tsx wire + ADR-119 + tests + EOP + final CLAUDE.md sync
**Owns (sequential after P92/A3):**
- `src/pages/Planning.tsx` (EDIT — surgical: import `PlanningViewToggle` + `DomainModelSVG`; add local state `view: 'process-map' | 'domain-model'`; render toggle above center pane; swap center between ProcessMapSVG and DomainModelSVG based on view; preserve P92/A3's chat + state)
- `docs/adr/ADR-119-ddd-atom.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-053 + ADR-099 + ADR-118)
  - 4 decisions: (1) DDD_ATOM = bounded context identifier 7th Crystal Atom; (2) max 8 contexts (Γ); (3) 4 relationship kinds; (4) view toggle in Planning mode swaps process map ↔ domain model
- `tests/p93-ddd-atom.spec.ts` (NEW; ≥15 cases; Playwright):
  - P93.1 ADR-119 file shape (4)
  - P93.2 dddAtom.ts exports (4)
  - P93.3 DomainModelSVG component shape (2)
  - P93.4 PlanningViewToggle component shape (2)
  - P93.5 Planning.tsx wires toggle + DomainModelSVG (1)
  - P93.6 KISS — no animation libs / no new deps (1)
  - P93.7 EOP triplet (3)
- `plans/implementation/phase-93/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` final sync — coordinate with P92/A3 NOTE: bump 118 → 119 with both entries; tests cumulative anchor

**Constraints:** ADR ≤120 LOC; tests use `@playwright/test`. Final tsc + regression after this agent.

## Hard rules
1. NO new dependencies
2. NO animation libs
3. NO touching files outside owned list
4. Disjoint scopes — A6 the only one in P93 touching Planning.tsx (after P92/A3 finishes its edit)
5. NO shell commands except tsc + targeted playwright run
6. TypeScript-strict; no `any`

## Acceptance gates (combined P92 + P93)
- PROCESS_ATOM + DDD_ATOM modules compile
- Planning.tsx renders chat (P92) + view toggle (P93) + dual visualization
- ADR-118 + ADR-119 Accepted
- ≥15 P92 tests + ≥15 P93 tests GREEN
- Cumulative ≥840
- tsc strict clean
