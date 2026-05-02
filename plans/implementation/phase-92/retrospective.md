# P92 / AW-PROCESS-ATOM — Retrospective

- **Phase:** P92 · **Sprint:** AW-PROCESS-ATOM · **Date:** 2026-05-01
- **Predecessor:** P91 SEALED (Process Map SVG visualization)

## Keep

- **3-agent disjoint-scope dispatch in 2 waves** — A1 (atom module)
  + A2 (chat component) parallel in Wave 1; A3 (page wire + closer)
  sequential in Wave 2. Zero merge conflicts. Disjoint owned-files
  list in preflight `00-summary.md` is the load-bearing artifact.
- **existsSync soft-pass guards on sibling surfaces** — A3 tests guard
  A1 + A2 paths; if a sibling timing-slips, tests skip rather than red.
  Hard-gate remains on A3-owned files (ADR-118 + Planning wire + EOP).
- **AgentProxy adapter only (no live LLM dependency)** — `classifyProcess`
  is pure / deterministic / unit-testable today; `buildProcessAtom` +
  `parseProcessResponse` scaffold the LLM hand-off cleanly. Open-core
  stays zero-network at the atom level.
- **Boundary vs DECOMP_ATOM documented in ADR D1** — different
  time-horizons (turn vs project), different shapes (Todo[] vs phases),
  different consumers (matcher vs SVG renderer). The atoms compose,
  they do not overlap. Future readers won't conflate them.
- **`liveMap ?? sample` fallback in Planning.tsx** — keeps the existing
  sample arc visible until the user types something; no broken empty
  state. Auto-select first node on chat-bar submit so the right-pane
  detail surfaces immediately.

## Drop

- **Sprint + wave + agent rendering as additional graph levels** — out
  of scope for P92's read-only phase-level viewer. The data shape is
  present in `ProcessAtomOutput` but `toProcessMap` only emits
  phase-level nodes today (KISS). Multi-level rendering is a clean
  Tier-2 expansion vector.
- **Live AgentProxy invocation** — wired but inert at P92. Activation
  carries forward to P94+ when AgentProxy ships.
- **Animated transitions on state change** — KISS / ADR-116 holds; no
  animation libs (`framer-motion`/`gsap`/`lottie`/`@react-spring`/
  `animejs`) in any P92 source.

## Reframe

- **Crystal Atom 6 of 7 in production** — PATCH + INTENT + SELECTION
  + CONTENT + ASSUMPTIONS + DECOMP + PROCESS = 6+1 (5 baseline +
  DECOMP + PROCESS). DDD_ATOM lands in P93 as the 7th. The AISP atom
  suite is nearly complete.
- **Agentic Workbench arc continues** — P91 sealed Process Map SVG;
  P92 ships the atom that drives it; P93 ships DDD_ATOM + view toggle
  + DomainModelSVG; P94+ continues. The pattern from P91 (small atom
  + small page integration + closer ADR + tests + EOP) carries
  forward through the rest of the arc.
- **Open-core / Tier-2 boundary held** — live AgentProxy + ML
  enrichment + multi-level rendering + drag-rearrange all carry
  forward as Tier-2 commercial vectors. Open-core ships the
  deterministic baseline; commercial layers add the runtime + ML.

## Carry-forward

| Item | Target | Rationale |
|---|---|---|
| P93 DDD_ATOM + DomainModelSVG + view toggle (Planning) | P93 | 7th Crystal Atom; bounded-context viz; A6 closer |
| P94 AGENT_ATOM + AISPDeveloperCard mount (Agentics) | P94 | Agentics first body; AgentProxy may activate here |
| P95 SpecWorkbench (shared) | P95 | Cross-mode spec editing |
| P96 Export (mode-aware) | P96 | Each mode's export shape |
| P97 TDD Scaffold (Planning) | P97 | Test scaffolding atom |
| P98 KISS+Review gate (Agentics) | P98 | Review-gate workflow |
| P99-P100 Seal Panel | P99-P100 | Final close-out atom + sprint-seal UI |
| Live AgentProxy runtime invocation | P94+ | Open-core ships rules-based only at P92 |
| Drag-to-rearrange phase reordering | Tier-2 commercial | Read-only viewer at open-core per ADR-117 D2 |
| Cross-project decomposition | Tier-2 commercial | Single-project atom at P92 |
| Rules-classifier ML enrichment via vector-DB lookup | Tier-2 learning runtime | Keyword-heuristic only at open-core |
| Sprint + wave + agent rendering as graph levels | Tier-2 commercial | Phase-level only at P92 (KISS) |
| Multi-turn requirements accumulator | DECOMP_ATOM family | PROCESS is single-turn at P92 |

## Velocity check

- Original P92 budget: 1 working day
- Actual P92 effective time: ~hours (multi-hour shift)
- @vel multiplier: ~3-5× original estimate
- Quality gates held: existsSync soft-pass, ADR ≤120 LOC (119), Planning
  ≤230 LOC (203), token compliance, EOP triplet, CLAUDE.md sync, tsc
  strict, no banned-token imports, no new deps in `package.json`.

## Sprint anchor

**~1132+ cumulative PURE-UNIT GREEN at P92 seal** (was ~1117+ at P91
seal; +~15 P92 AW-PROCESS-ATOM).

ADR ledger: 117 → **118 Accepted** (ADR-118 = PROCESS_ATOM, 6th Crystal Atom).

Crystal Atom 6 of 7 in the AISP suite. Next: P93 DDD_ATOM (7th and
final atom in the planned set) + DomainModelSVG view + view toggle.
