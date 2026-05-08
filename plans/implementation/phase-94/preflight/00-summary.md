# P94 — AGENT_ATOM (Preflight)

> **Phase:** P94 · **Sprint:** AW-AGENT-ATOM · **Date:** 2026-05-01
> **Predecessor:** P92 + P93 sealed at `4ec0160` (~1147+ GREEN, 119 ADRs, 7 Crystal Atoms live)
> **Cross-refs:** ADR-045 (PATCH_ATOM), ADR-053 (INTENT_ATOM), ADR-099 (DECOMP_ATOM), ADR-118 (PROCESS_ATOM), ADR-119 (DDD_ATOM)

## Mandate — 8th Crystal Atom (caps the AISP suite)

AGENT_ATOM decomposes a wave into individual agent scopes — role, owned files, AISP spec slice, definition-of-done checklist. Output feeds future SpecWorkbench (P95) + Export Claude Code (P96) which generate ready-to-dispatch swarm instructions.

This is the FINAL atom of the 8-atom AISP suite (5 base + DECOMP + PROCESS + DDD + AGENT).

## 3 agents · 2 waves

### Wave 1 (parallel): A1 + A2

#### A1 — AGENT_ATOM Crystal Atom
**Owns:** `src/contexts/intelligence/aisp/agentAtom.ts` (NEW; ≤300 LOC)

Σ/Ω/Γ/Λ/Ε header per AISP convention. Required exports:

```ts
export interface AgentSpec {
  id: string
  role: string                    // e.g., "schema-design", "test-coverage"
  ownedFiles: string[]            // disjoint per wave
  scope: string                   // 1-2 sentence narrative
  dod: string[]                   // definition-of-done checklist (≥1 item)
  inputs: string[]                // upstream files / specs needed
  outputs: string[]               // deliverable paths
}
export interface AgentAtomOutput {
  waveId: string
  agents: AgentSpec[]
  rationale: string
}
export function buildAgentAtom(waveContext: WaveContext): { prompt: string; schema: object }
export function classifyAgents(waveContext: WaveContext): AgentAtomOutput  // rules-based deterministic
export function parseAgentResponse(raw: string): AgentAtomOutput
```

Where `WaveContext` includes the Wave from PROCESS_ATOM + the BoundedContext list from DDD_ATOM that the wave intersects.

Γ rules: ≤7 agents/wave, owned files disjoint per wave, every agent has ≥1 DoD item.

**Constraints:** Pure module. AgentProxy adapter only (no live LLM). Rules-based deterministic baseline mirrors processAtom + dddAtom patterns.

#### A2 — Wave-2 closer ADR-120 + tests + EOP

**Owns:**
- `docs/adr/ADR-120-agent-atom.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-045/053/099/118/119)
  - Decisions: (1) AGENT_ATOM = 8th Crystal Atom; (2) AISP suite COMPLETE at 8 atoms; (3) Σ contract for AgentSpec + AgentAtomOutput; (4) prepares for SpecWorkbench (P95) + Export Claude Code (P96) consumption
- `tests/p94-agent-atom.spec.ts` (NEW; ≥15 cases; Playwright):
  - P94.1 ADR-120 file shape (4)
  - P94.2 agentAtom.ts exports (4)
  - P94.3 classifyAgents respects Γ caps (1 — file source check for ≤7 agents/wave note)
  - P94.4 disjoint ownedFiles invariant (1 — Ε V1 verifier present in source)
  - P94.5 every agent has DoD item (1)
  - P94.6 KISS — no animation libs / no new deps (1)
  - P94.7 EOP triplet (3)
- `plans/implementation/phase-94/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` sync — bump ADRs 119 → 120; tests +15; capabilities entry; atoms count → 8 (AISP suite COMPLETE)

**Constraints:** ADR ≤120 LOC; tests use `@playwright/test`; ROOT = `process.cwd()`; both `tsc --noEmit` and `tsc -p tsconfig.app.json` strict clean.

## Hard rules
1. NO new dependencies
2. NO animation libs
3. NO touching files outside owned list (Planning.tsx untouched this sprint — P95 SpecWorkbench wires AGENT_ATOM into UI)
4. TypeScript-strict; both default + strict app configs clean
5. KISS — atom module + ADR + tests + EOP only

## Acceptance gates
- AGENT_ATOM module compiles + 3 functions exported
- ADR-120 Accepted citing ADR-118/119
- ≥15 P94 tests GREEN
- Cumulative ≥860 session OC chain
- Both tsc strict clean
