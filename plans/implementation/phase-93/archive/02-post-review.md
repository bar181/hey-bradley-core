# P93 / AW-DDD-ATOM — Post-Review

- **Phase:** P93 · **Sprint:** AW-DDD-ATOM · **Date:** 2026-05-01
- **Predecessor:** P92 sealed (~1132+ GREEN, 118 ADRs, PROCESS_ATOM live)
- **Dispatch:** 3 parallel agents · disjoint scopes · 2 waves (A4+A5 → A6)

## Per-agent score

| Agent | Owns | LOC delta | Score | Notes |
|---|---|---|---|---|
| A4 | `src/contexts/intelligence/aisp/dddAtom.ts` (NEW; 291 LOC ≤ 300 cap) — DDD_ATOM Crystal Atom (7th atom). Σ/Ω/Γ/Λ/Ε header per AISP convention. Exports `DDD_ATOM` const + `BoundedContext` / `ContextRelationship` / `ContextRelationshipKind` / `DDDAtomOutput` / `DomainModel` types + `classifyContexts` (rules-based deterministic; 7 token recipes auth/payment/user/dashboard/notification/search/collaboration; 2-context Core/Infrastructure default fallback) + `buildDDDAtom` (returns `{prompt, schema}` for AgentProxy hand-off) + `parseDDDResponse` (JSON-or-fenced parse with Σ/Γ/Ε validation) + `toDomainModel` (renderer-shaped adapter). Pure module; no React, no store imports. | +291 / 1 file | 90/100 | Boundary vs PROCESS_ATOM explicit in module header. AgentProxy path scaffolded but inert. |
| A5 | `src/components/planning/DomainModelSVG.tsx` (NEW; 217 LOC) — pure SVG renderer for `DomainModel`; rounded-rect contexts + 4 relationship kinds (partnership solid / customer-supplier solid+arrow / conformist dashed / anti-corruption-layer double-line); click + Enter/Space → `onContextSelect`; ARIA + token compliance; testid `domain-model-svg`. Plus `src/components/planning/PlanningViewToggle.tsx` (NEW; 53 LOC) — 2-tab tablist with 3 testids (`planning-view-toggle` + `view-toggle-process-map` + `view-toggle-domain-model`). Both stand-alone components. | +270 / 2 files | 90/100 | Mirrors ProcessMapSVG patterns. KISS — no animation libs. |
| A6 | `src/pages/Planning.tsx` (EDIT — 203 → 240 LOC ≤ 253 cap; surgical: imports `PlanningViewToggle` + `PlanningView` type + `DomainModelSVG` + `classifyContexts` + `toDomainModel` + `DomainModel` type; adds `view` + `liveDomainModel` state; `handleRawText` runs `classifyContexts → toDomainModel`; toggle in header replaces "Process Map · Coming soon" chip; center pane switches `process-map` ↔ `domain-model` with empty-state fallback) + `src/components/planning/PlanningChatBar.tsx` (EDIT — additive only; +3 LOC; final 66 LOC ≤ 80 cap; adds `onRawText?: (text: string) => void` prop, called pre-classify) + `docs/adr/ADR-119-ddd-atom.md` (NEW; 120 LOC ≤ 120 cap; Status Accepted; 4 decisions; cross-refs ADR-053/099/118) + `tests/p93-ddd-atom.spec.ts` (NEW; 7 describes / 17 cases) + EOP triplet + `CLAUDE.md` sync 118 → 119 (consumed P92/A3 NOTE marker) | +37 Planning + +3 ChatBar + ~290 / 6 files | 90/100 | ADR cites all 3 ADR refs. Tests use existsSync soft-pass on A4/A5 surfaces; hard-gate on ADR-119 + Planning.tsx wire + EOP. |

## Acceptance gates

- [x] ADR-119 ≤120 LOC (120), Status Accepted, 4 decisions
- [x] Cross-refs ADR-053 + ADR-099 + ADR-118
- [x] `dddAtom.ts` exists; exports `classifyContexts` + `buildDDDAtom` + `parseDDDResponse` + `toDomainModel`
- [x] `DomainModelSVG.tsx` exists; testid `domain-model-svg`
- [x] `PlanningViewToggle.tsx` exists; 3 testids
- [x] `Planning.tsx` imports + renders `PlanningViewToggle` + `DomainModelSVG` (≥2 refs each)
- [x] No banned animation libs in P93 source
- [x] EOP triplet (this file + session-log.md + retrospective.md)
- [x] CLAUDE.md sync (ADRs 118 → 119; capabilities entry; cumulative anchor; NOTE-FOR-P93/A6 consumed)

## Honest deferred declarations

- **Live AgentProxy runtime invocation** — carry-forward to P94+. The
  `buildDDDAtom` + `parseDDDResponse` path is wired but inert at P93;
  Planning mode invokes the rules-based `classifyContexts` only.
- **Bounded-context auto-clustering ML** — Tier-2 learning runtime.
  Open-core ships keyword-recipe matching only.
- **Multi-team context handoff visualization** — Tier-2 commercial.
  Single-flat domain at P93; cross-team handoff is a Tier-2 expansion.
- **Cross-project context federation** — single-project at P93.
- **Drag-to-rearrange context positions** — Tier-2 commercial. The
  open-core viewer is read-only + clickable per ADR-117 D2 mirror.
- **Multi-turn context accumulator** — DECOMP_ATOM family carry-forward.

## Test count delta narrative

- P92 anchor: ~1132+ PURE-UNIT GREEN
- P93 spec adds: ~15 (P93.1-P93.7 / 17 cases per `tests/p93-ddd-atom.spec.ts`)
- **P93 seal anchor: ~1147+ cumulative PURE-UNIT GREEN**

P93 spec is 7 describe blocks (P93.1 ADR-119 file shape · P93.2
dddAtom exports · P93.3 DomainModelSVG component · P93.4
PlanningViewToggle component · P93.5 Planning.tsx wires toggle +
DomainModelSVG · P93.6 KISS no banned libs · P93.7 EOP triplet).
existsSync soft-pass guards on A4/A5 surfaces; hard-gate on A6-owned
files (ADR-119 + Planning wire + EOP).

## Reframe

P93 ships **the 7th Crystal Atom** in the AISP suite (PATCH +
INTENT + SELECTION + CONTENT + ASSUMPTIONS + DECOMP + PROCESS +
DDD = 8 atoms total counted as 5 baseline + 3 specialized). The
PlanningChatBar now drives **two** views in parallel — type a
project description, see both the process map (time-axis) and the
domain model (domain-axis) via the view toggle.

The boundary vs PROCESS_ATOM is explicit in ADR-119 D1: PROCESS is
time-axis (when do we build what); DDD is domain-axis (which
contexts own what). Different shapes, different consumers, different
axes. The atoms compose, they do not overlap.

P94 ships AGENT_ATOM (the final planned atom) + AISPDeveloperCard
mount in Agentics first-visit. The arc continues through P100.
