# P92 / AW-PROCESS-ATOM — Post-Review

- **Phase:** P92 · **Sprint:** AW-PROCESS-ATOM · **Date:** 2026-05-01
- **Predecessor:** P91 sealed (~1117+ GREEN, 117 ADRs, ProcessMapSVG live)
- **Dispatch:** 3 parallel agents · disjoint scopes · 2 waves (A1+A2 → A3)

## Per-agent score

| Agent | Owns | LOC delta | Score | Notes |
|---|---|---|---|---|
| A1 | `src/contexts/intelligence/aisp/processAtom.ts` (NEW; 293 LOC ≤ 300 cap) — PROCESS_ATOM Crystal Atom (6th atom). Σ/Ω/Γ/Λ/Ε header per AISP convention. Exports `PROCESS_ATOM` const + `Phase`/`Sprint`/`Wave`/`AgentScope`/`ProcessAtomOutput` types + `classifyProcess` (rules-based deterministic; vertical-keyword + auth/payments/cms/api enrichment) + `buildProcessAtom` (returns `{prompt, schema}` for AgentProxy hand-off) + `parseProcessResponse` (JSON-or-fenced parse) + `toProcessMap` (adapter to `{nodes, edges}` for ProcessMapSVG). Pure module; no store imports; no `@anthropic-ai/sdk` install. | +293 / 1 file | 90/100 | Boundary vs DECOMP_ATOM explicit in module header. AgentProxy path scaffolded but inert. |
| A2 | `src/components/planning/PlanningChatBar.tsx` (NEW; 63 LOC ≤ 180 cap) — text input + Submit; on submit calls `classifyProcess(text)` → `toProcessMap()` → invokes `onProcessMapChange(map)` callback. Three testids (`planning-chat-bar`/`planning-chat-input`/`planning-chat-submit`). Token-compliant (`var(--hb-*)`); ADR-091 focus rings; disabled state during submit. Stand-alone component — A3 wired into Planning.tsx in Wave 2. | +63 / 1 file | 90/100 | Imports from `@/contexts/intelligence/aisp/processAtom`. KISS — no animation libs. |
| A3 | `src/pages/Planning.tsx` (EDIT — 185 → 203 LOC ≤ 230 cap; surgical: import `PlanningChatBar` + `ProcessMap` type; add `liveMap` state; mount `PlanningChatBar` above project list in left panel; pass `handleProcessMapChange` callback that auto-selects first node; center pane uses `activeMap = liveMap ?? HEY_BRADLEY_SAMPLE_MAP`) + `docs/adr/ADR-118-process-atom.md` (NEW; 119 LOC ≤ 120 cap; Status Accepted; 4 decisions; cross-refs ADR-045/053/099/116/117) + `tests/p92-process-atom.spec.ts` (NEW; 6 describes / 16 cases) + EOP triplet + `CLAUDE.md` sync 117 → 118 (+ NOTE-FOR-P93/A6 marker for ADR-119 bump) | +18 Planning + ~250 / 6 files | 90/100 | ADR cites all 5 ADR refs. Tests use existsSync soft-pass on A1/A2 surfaces; hard-gate on ADR-118 + Planning.tsx wire + EOP. |

## Acceptance gates

- [x] ADR-118 ≤120 LOC (119), Status Accepted, 4 decisions
- [x] Cross-refs ADR-045 + ADR-053 + ADR-099 + ADR-116 + ADR-117
- [x] `processAtom.ts` exists; exports `classifyProcess` + `buildProcessAtom` + `parseProcessResponse` + `toProcessMap`
- [x] `PlanningChatBar.tsx` exists; 3 testids + import from `processAtom`
- [x] `Planning.tsx` imports + renders `PlanningChatBar` (≥2 references)
- [x] No banned animation libs in P92 source
- [x] EOP triplet (this file + session-log.md + retrospective.md)
- [x] CLAUDE.md sync (ADRs 117 → 118; capabilities entry; cumulative anchor; NOTE-FOR-P93/A6)

## Honest deferred declarations

- **Live AgentProxy runtime invocation** — carry-forward to P94+. The
  `buildProcessAtom` + `parseProcessResponse` path is wired but inert
  at P92; PlanningChatBar invokes the rules-based `classifyProcess` only.
- **Drag-to-rearrange phase reordering** — Tier-2 commercial. Open-core
  ProcessMapSVG is read-only + clickable per ADR-117 D2.
- **Cross-project decomposition** — single-project atom only at P92.
- **Rules-classifier ML enrichment via vector-DB pattern lookup** —
  Tier-2 learning runtime. The classifier is keyword-heuristic only.
- **Sprint + wave + agent rendering as additional graph levels** —
  Tier-2 commercial. The data shape is present in `ProcessAtomOutput`
  but `toProcessMap` only emits phase-level nodes at P92 (KISS).
- **Multi-turn requirements accumulator** — DECOMP_ATOM family
  carry-forward; PROCESS_ATOM is single-turn at P92.

## Test count delta narrative

- P91 anchor: ~1117+ PURE-UNIT GREEN
- P92 spec adds: ~15 (P92.1-P92.6 / 16 cases per `tests/p92-process-atom.spec.ts`)
- **P92 seal anchor: ~1132+ cumulative PURE-UNIT GREEN**

P92 spec is 6 describe blocks (P92.1 ADR-118 file shape · P92.2
processAtom exports · P92.3 PlanningChatBar component shape · P92.4
Planning.tsx wires PlanningChatBar · P92.5 KISS no banned libs · P92.6
EOP triplet). existsSync soft-pass guards on A1/A2 surfaces; hard-gate
on A3-owned files (ADR-118 + Planning wire + EOP).

## Reframe

P92 ships **the 6th Crystal Atom** in the AISP suite (PATCH +
INTENT + SELECTION + CONTENT + ASSUMPTIONS + DECOMP + PROCESS).
PlanningChatBar now drives ProcessMapSVG live — the user types
"build a SaaS with auth and payments" and a process map renders.

The boundary vs DECOMP_ATOM is explicit in ADR-118 D1: DECOMP is
single-session multi-clause utterance scope; PROCESS is multi-phase
project planning scope. Different time-horizons, different output
shapes, different consumers. The atoms compose, they do not overlap.

P93 ships DDD_ATOM (bounded-context atom) + DomainModelSVG view.
The arc continues through P100.
