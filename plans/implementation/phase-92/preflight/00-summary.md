# P92 — PROCESS_ATOM (Preflight)

> **Phase:** P92 · **Sprint:** AW-PROCESS-ATOM · **Date:** 2026-05-01
> **Predecessor:** P91 sealed at `ade0540` (~1117+ GREEN, 117 ADRs)
> **Companion:** P93 DDD_ATOM (parallel)
> **Cross-refs:** ADR-045 (PATCH_ATOM), ADR-053 (INTENT_ATOM), ADR-099 (DECOMP_ATOM), ADR-116 (Three-Mode Architecture), ADR-117 (Process Map SVG)

## Mandate — 6th Crystal Atom

PROCESS_ATOM decomposes a project description into phases / sprints / waves / agents. Output feeds ProcessMapSVG directly. AgentProxy only (no live LLM this sprint; rules-based baseline + stub for AgentProxy).

**Boundary clarification (added to ADR-118):**
- **DECOMP_ATOM** (P74 / ADR-099): single-session multi-clause user utterance → ordered Todo[] for matcher patches
- **PROCESS_ATOM** (P92 / ADR-118): multi-phase project planning → ProcessMap structure for visualization

## 3 agents · 2 waves

### Wave 1 (parallel): A1 + A2

#### A1 — PROCESS_ATOM Crystal Atom
**Owns:**
- `src/contexts/intelligence/aisp/processAtom.ts` (NEW; ≤300 LOC)

Σ/Ω/Γ/Λ/Ε header per AISP convention (mirror decompAtom.ts):
- Ω := { Decompose project description into phases/sprints/waves/agents }
- Σ := { phases: Phase[], sprints: Sprint[], waves: Wave[], agents: AgentScope[] }
- Γ := max 5 phases, max 4 sprints/phase, max 7 agents/wave
- Λ := sequential phases, parallel waves, gate between sprints
- Ε := disjoint agent file scopes; every gate has DoD checklist

Required exports:
```ts
export interface Phase {
  id: string
  name: string
  position: number  // 0-based ordinal
  status: 'planned' | 'in-flight' | 'sealed' | 'deferred'
}
export interface Sprint {
  id: string
  phaseId: string
  name: string
  position: number
  status: 'planned' | 'in-flight' | 'sealed' | 'deferred'
}
export interface Wave {
  id: string
  sprintId: string
  parallel: boolean
  position: number
}
export interface AgentScope {
  id: string
  waveId: string
  role: string
  ownedFiles: string[]
}
export interface ProcessAtomOutput {
  phases: Phase[]
  sprints: Sprint[]
  waves: Wave[]
  agents: AgentScope[]
  rationale: string
}
export function buildProcessAtom(description: string): { prompt: string; schema: object }
export function classifyProcess(description: string): ProcessAtomOutput  // rules-based; deterministic
export function parseProcessResponse(raw: string): ProcessAtomOutput  // JSON-or-fenced parse
export function toProcessMap(output: ProcessAtomOutput): ProcessMap  // adapter for ProcessMapSVG (returns { nodes, edges })
```

**Constraints:** Pure module. No store imports. AgentProxy only (no `@anthropic-ai/sdk`). Rules-based `classifyProcess` for deterministic baseline; LLM enrichment path via `buildProcessAtom`+`parseProcessResponse` for AgentProxy hand-off.

#### A2 — PlanningChatBar component (consumes PROCESS_ATOM)
**Owns:**
- `src/components/planning/PlanningChatBar.tsx` (NEW; ≤180 LOC)

Behavior:
- Text input + Submit button
- On submit: call `classifyProcess(text)` (rules-only this sprint; LLM later) OR if AgentProxy is configured, fire `buildProcessAtom` → AgentProxy → `parseProcessResponse`
- Result: `ProcessAtomOutput` → call `toProcessMap()` → invoke prop callback `onProcessMapChange(map)`
- `data-testid="planning-chat-bar"` + `data-testid="planning-chat-input"` + `data-testid="planning-chat-submit"`
- Token-compliant; ADR-091; focus rings; disabled state during processing
- Stand-alone component — A3 wires it into Planning.tsx in Wave 2

**Constraints:** Imports `from '@/contexts/intelligence/aisp/processAtom'`. If A1's exports aren't available at compile time, your tsc fails — wait then retry; final tsc gate runs after Wave 2.

DO NOT touch Planning.tsx — A3 wires this in.

### Wave 2 (sequential after Wave 1): A3

#### A3 — Planning.tsx wire + ADR-118 + tests + EOP
**Owns (sequential after A1+A2):**
- `src/pages/Planning.tsx` (EDIT — surgical: import `PlanningChatBar`; mount above the project list in left panel; add local state for live process map; pass `onProcessMapChange` callback)
- `docs/adr/ADR-118-process-atom.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-045/053/099/116/117)
  - 4 decisions: (1) PROCESS_ATOM = multi-phase project planning Crystal Atom; (2) boundary vs DECOMP_ATOM (session vs project); (3) AgentProxy adapter only (no live LLM); (4) output shape adapts to ProcessMapSVG
- `tests/p92-process-atom.spec.ts` (NEW; ≥15 cases; Playwright):
  - P92.1 ADR-118 file shape (4)
  - P92.2 processAtom.ts exports (4)
  - P92.3 PlanningChatBar component shape (3)
  - P92.4 Planning.tsx wires PlanningChatBar (1)
  - P92.5 KISS — no animation libs / no new deps (1)
  - P92.6 EOP triplet (3)
- `plans/implementation/phase-92/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` sync — bump ADRs 117 → 118; tests +15; capabilities entry. **NOTE-FOR-P93/A6** to bump 118 → 119.

**Constraints:** ADR ≤120 LOC; tests use `@playwright/test`.

## Hard rules
1. NO new dependencies (no `@anthropic-ai/sdk`; AgentProxy stubs only)
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO touching files outside owned list
4. Disjoint file scopes — A3 the only one touching Planning.tsx
5. NO shell commands inside agents (except tsc + targeted playwright run)
6. TypeScript-strict; no `any`
7. Boundary doc explicit (DECOMP vs PROCESS atoms)

## Acceptance gates
- PROCESS_ATOM Crystal Atom module compiles with 5 exports
- PlanningChatBar component standalone-renders + invokes processAtom
- Planning.tsx wires chat → process → map update
- ADR-118 Accepted citing the 5 ADR refs
- ≥15 P92 tests GREEN
- Cumulative ≥820
- tsc strict clean
