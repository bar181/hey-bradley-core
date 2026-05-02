# P93 / AW-DDD-ATOM — Retrospective

- **Phase:** P93 · **Sprint:** AW-DDD-ATOM · **Date:** 2026-05-01
- **Predecessor:** P92 SEALED (PROCESS_ATOM 6th Crystal Atom)

## Keep

- **3-agent disjoint-scope dispatch in 2 waves** — A4 (atom module)
  + A5 (two consumer components) parallel in Wave 1; A6 (page wire +
  closer) sequential in Wave 2. Zero merge conflicts. Disjoint
  owned-files list in `phase-93/preflight/00-summary.md` is the
  load-bearing artifact.
- **existsSync soft-pass guards on sibling surfaces** — A6 tests
  guard A4 + A5 paths; if a sibling timing-slips, tests skip rather
  than red. Hard-gate remains on A6-owned files (ADR-119 + Planning
  wire + EOP).
- **Additive-only edit on A2's PlanningChatBar** — `onRawText?: (text:
  string) => void` added behind a `?` so existing single-callback
  consumers stay byte-equivalent. +3 LOC; touches one sibling file
  the smallest possible amount to enable the parallel-fan-out
  pattern. No scope creep into A2's component body.
- **Two atoms run on one chat submit** — `handleRawText` runs
  `classifyContexts → toDomainModel` in parallel with
  `handleProcessMapChange`. One user input, two views, two atoms;
  the toggle just decides which renderer the user sees.
- **Empty-state for un-typed domain-model view** — when the toggle
  is set to `domain-model` before any chat, "Type a project
  description to see its domain model" surfaces. No broken render,
  no fallback hardcoded sample (would have been confusing — there
  is no sample domain model the way there is a sample process map).

## Drop

- **Bounded-context ML auto-clustering** — out of scope for P93's
  rules-based viewer. Token recipes get the user 80% of the way;
  the last 20% is Tier-2 commercial learning runtime.
- **Live AgentProxy invocation** — wired but inert at P93. Activation
  carries forward to P94+ when AgentProxy ships.
- **Animated transitions on view toggle** — KISS / ADR-116 holds; no
  animation libs (`framer-motion`/`gsap`/`lottie`/`@react-spring`/
  `animejs`) in any P93 source.
- **Multi-team handoff visualization** — out of scope. Single-flat
  domain at P93; cross-team handoff is a Tier-2 expansion.

## Reframe

- **Crystal Atom 7 of 8 in production** — PATCH + INTENT + SELECTION
  + CONTENT + ASSUMPTIONS + DECOMP + PROCESS + DDD = 8 atoms total
  (5 baseline + 3 specialized). AGENT_ATOM lands P94+ as the 8th.
  The AISP atom suite is one sprint from complete.
- **Two-atom fan-out pattern established** — same chat input, two
  atoms, two views, one toggle. This pattern carries forward to P94+
  if AGENT_ATOM also reads from the project description (same chat
  bar, third view tab). The PlanningChatBar `onRawText` prop is the
  scaffolding.
- **Open-core / Tier-2 boundary held** — live AgentProxy + ML
  enrichment + multi-team handoff + drag-rearrange all carry forward
  as Tier-2 commercial vectors. Open-core ships the deterministic
  baseline; commercial layers add the runtime + ML.

## Carry-forward

| Item | Target | Rationale |
|---|---|---|
| P94 AGENT_ATOM + AISPDeveloperCard mount (Agentics) | P94 | 8th Crystal Atom; Agentics first body; AgentProxy may activate here |
| P95 SpecWorkbench (shared) | P95 | Cross-mode spec editing |
| P96 Export (mode-aware) | P96 | Each mode's export shape |
| P97 TDD Scaffold (Planning) | P97 | Test scaffolding atom |
| P98 KISS+Review gate (Agentics) | P98 | Review-gate workflow |
| P99-P100 Seal Panel | P99-P100 | Final close-out atom + sprint-seal UI |
| Live AgentProxy runtime invocation | P94+ | Open-core ships rules-based only at P93 |
| Bounded-context auto-clustering ML | Tier-2 learning runtime | Token-recipe baseline at open-core |
| Multi-team context handoff visualization | Tier-2 commercial | Single-flat domain at P93 |
| Cross-project context federation | Tier-2 commercial | Single-project atom at P93 |
| Drag-to-rearrange context positions | Tier-2 commercial | Mirrors ADR-117 D2 read-only viewer |
| Multi-turn context accumulator | DECOMP_ATOM family | DDD is single-turn at P93 |

## Velocity check

- Original P93 budget: 1 working day
- Actual P93 effective time: ~hours (multi-hour shift)
- @vel multiplier: ~3-5× original estimate
- Quality gates held: existsSync soft-pass, ADR ≤120 LOC (120 exact),
  Planning ≤253 LOC (240), PlanningChatBar ≤80 LOC (66 additive +3),
  token compliance, EOP triplet, CLAUDE.md sync, tsc strict, no
  banned-token imports, no new deps in `package.json`.

## Sprint anchor

**~1147+ cumulative PURE-UNIT GREEN at P93 seal** (was ~1132+ at
P92 seal; +~15 P93 AW-DDD-ATOM).

ADR ledger: 118 → **119 Accepted** (ADR-119 = DDD_ATOM, 7th Crystal Atom).

Crystal Atom 7 of 8 in the AISP suite. Next: P94 AGENT_ATOM (8th and
final planned atom in the Agentic Workbench arc) + AISPDeveloperCard
mount in Agentics first-visit + Agentics body work begins.
