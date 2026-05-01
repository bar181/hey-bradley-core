# P91 / AW-PROCESS-MAP — Retrospective

- **Phase:** P91 · **Sprint:** AW-PROCESS-MAP · **Date:** 2026-05-01
- **Predecessor:** P89b + P90 SEALED (combined-seal sprint)

## Keep

- **3-agent disjoint-scope dispatch** — A1 (component) · A2 (page integration +
  sample data) · A3 (closer) sealed cleanly with zero merge conflicts.
  Disjoint owned-files list in preflight `00-summary.md` is the load-bearing
  artifact.
- **existsSync soft-pass guards on sibling surfaces** — A3 tests guard A1 + A2
  paths; if a sibling timing-slips, tests skip rather than red. Hard-gate
  remains on A3-owned files (ADR-117 + EOP triplet).
- **Option A (pure SVG, no new deps)** — protected ADR-102 bundle gzip cap.
  React Flow ~50KB before tree-shake; D3 heavier. Pure SVG keeps the surface
  ours to audit.
- **Sample data factored to `src/data/sample-process-map.ts`** — separating
  authored coordinates from rendering keeps the Planning.tsx page lean and
  lets future phases drop in alternate sample arcs without re-touching the
  page.
- **Read-only-at-open-core contract** — small, auditable surface area;
  pan/zoom + drag-rearrange + auto-routing all carry forward as a clean
  Tier-2 expansion vector.
- **Token-compliance discipline with honest hex declaration** — `var(--hb-*)`
  for the two color states with palette tokens; literal hex `#22c55e` +
  `#f59e0b` for `sealed` + `deferred` (no green/amber tokens in the
  open-core palette). Both literal call-sites are flagged in code comments
  + ADR-117 D4.

## Drop

- **Auto-layout / force-directed graph** — out of scope for the open-core
  read-only contract. Caller-supplied `x`/`y` coordinates are sufficient
  for the hand-authored sample arc and for the read-only viewer pattern.
  Auto-layout becomes a Tier-2 commercial concern when the editor lands.
- **Animated transitions on status change** — KISS / ADR-116 holds; no
  animation libs (`framer-motion`/`gsap`/`lottie`/`@react-spring`/`animejs`)
  in any P91 source.

## Reframe

- **Agentic Workbench arc continues** — P91 is the first body sprint of the
  P90 → P100 arc. P92 ships PROCESS_ATOM (Crystal Atom for phase + sprint
  decomposition). The pattern from P91 (small atom + small page integration
  + closer ADR + tests + EOP) carries forward through the rest of the arc.
- **Open-core / Tier-2 boundary held** — pan/zoom + drag-rearrange + minimap
  + multi-project tabs all carry forward as Tier-2 commercial vectors.
  Open-core ships the read-only viewer; commercial layers add the
  authoring surface.
- **Velocity note** — P85 + P86 + P87 + P88 + P89 + P89b + P90 + P91 = 8
  phases sealed across roughly two working session blocks. Quality
  discipline (existsSync soft-pass tests, token compliance, ADR ≤120 LOC,
  EOP triplet, `tsc --noEmit` strict) is the brake. Multi-hour shifts
  continue, NOT multi-day.

## Carry-forward

| Item | Target | Rationale |
|---|---|---|
| P92 PROCESS_ATOM Crystal Atom (Planning) | P92 | Phase + sprint decomposition; next AW arc body |
| P93 DDD_ATOM Crystal Atom (Planning) | P93 | Bounded-context atom |
| P94 AGENT_ATOM + AISPDeveloperCard mount | P94 | Agentics first body work |
| P95 SpecWorkbench (shared) | P95 | Cross-mode spec editing |
| P96 Export (mode-aware) | P96 | Each mode's export shape |
| P97 TDD Scaffold (Planning) | P97 | Test scaffolding atom |
| P98 KISS+Review gate (Agentics) | P98 | Review-gate workflow |
| P99-P100 Seal Panel | P99-P100 | Final close-out atom + sprint-seal UI |
| Pan/zoom (mousewheel + pinch + drag-pan) | Tier-2 commercial | Read-only contract held at open-core |
| Drag-to-rearrange node positions | Tier-2 commercial | Editor surface, not viewer |
| Live data binding to a real project store | post-RC | Sample data hardcoded this sprint |
| Multi-project tabs / project switcher | Tier-2 commercial | 3-stub list this sprint |
| Edge auto-routing for complex graphs | Tier-2 commercial | Simple cubic bezier this sprint |
| Minimap overlay | Tier-2 commercial | Single-pane SVG at open-core |
| `--hb-status-sealed` + `--hb-status-deferred` tokens | future palette pass | Literal hex flagged in ADR-117 D4 |
| Auto-layout / force-directed graph | Tier-2 commercial | Caller-supplied coords this sprint |
| Animated transitions on status change | not planned | KISS / ADR-116 — no animation libs |

## Velocity check

- Original P91 budget: 1 working day
- Actual P91 effective time: ~hours (multi-hour shift)
- @vel multiplier: ~3-5× original estimate
- Quality gates held: existsSync soft-pass, ADR ≤120 LOC, token compliance,
  EOP triplet, CLAUDE.md sync, tsc strict, no banned-token imports, no new
  deps in `package.json`.

## Sprint anchor

**~1117+ cumulative PURE-UNIT GREEN at P91 seal** (was ~1102+ at combined
P89b + P90 seal; +~15 P91 AW-PROCESS-MAP).

ADR ledger: 116 → **117 Accepted** (ADR-117 = Process Map SVG Architecture).

First body sprint of the Agentic Workbench arc (P90 → P100). Next: P92
PROCESS_ATOM.
