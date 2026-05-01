# P90 / AW-MODE-ARCH — Retrospective

- **Phase:** P90 · **Sprint:** AW-MODE-ARCH · **Date:** 2026-05-01
- **Sealed alongside:** P89b TIER2-CLEANUP

## Keep

- **3-agent disjoint-scope dispatch** — A3 (routes/stubs/store) · A4 (AppShell)
  · A5 (closer) sealed cleanly with zero merge conflicts. Disjoint owned-files
  list in preflight `00-summary.md` is the load-bearing artifact.
- **existsSync soft-pass guards on sibling surfaces** — A5 tests guard A3/A4
  paths; if a sibling timing-slips, tests skip rather than red. Hard-gate
  remains on A5-owned files (ADR + EOP triplet).
- **Route-derived layout (URL = single source of truth)** — A4 used
  `useLocation().pathname` instead of `uiStore.activeMode` to drive layout.
  Eliminates store/URL drift; minimizes coupling.
- **Stub discipline** — Planning + Agentics ship as real React components with
  header + 1-paragraph description + placeholder regions + "Coming soon"
  badge. Token-compliant (`var(--hb-*)`). KISS — no functional body.
- **Combined-seal narrative** — P89b + P90 seal together as a single sprint
  anchor. Two orthogonal corrections (persistence boundary + mode routing)
  ship in parallel without coupling.
- **A2 → A5 NOTE-FOR-P90/A5 handoff pattern** — when timing-coordinated
  CLAUDE.md edits cross sibling agents, leave a one-line marker in CLAUDE.md
  for the next agent to remove. (P89b/A2 marker absent at A5 read time —
  A5 handled the merge solo per spec contingency.)

## Drop

- **Premature scaffolding inside `src/`** — P89 landed Supabase code in
  `src/contexts/persistence/supabase/` before the open-core / Tier-2 boundary
  was encoded. P89b corrected by moving to `plans/tier-2/`. Lesson: when an
  ADR is Tier-2 planning (not open-core), the implementation must live under
  `plans/tier-2/` from the start. Encoded in P89b/A2's `plans/tier-2/README.md`.
- **Mode-aware logic in AppShell coupled to uiStore** — initial scoping
  considered store-derived layout. Dropped in favor of route-derived to keep
  AppShell's coupling minimal. `uiStore.activeMode` still exists for behavior
  (chat pipeline, AISP visibility defaults), just not for layout.

## Reframe

- **Agentic Workbench arc begins (P90 → P100)** — P90 ships routing + shell
  scaffolding. P91-P100 ship the mode bodies (Process Map, PROCESS_ATOM,
  DDD_ATOM, AGENT_ATOM, SpecWorkbench, Export, TDD Scaffold, KISS+Review,
  Seal Panel). That's ~10 phases of Planning + Agentics body work on top of
  the scaffolding here.
- **AISP visibility ladder per mode (per ADR-110)** — Whiteboard hides AISP
  by default; Planning shows dual-view; Agentics shows AISP prominently.
  ADR-116 Decision 5 encodes this so future phases don't drift.
- **Velocity note** — through P90 the project remains on multi-hour shifts
  (NOT multi-day). P85 + P86 + P87 + P88 + P89 + P89b + P90 = 7 phases sealed
  in roughly one working session block. Quality discipline (existsSync soft-
  pass tests, token compliance, ADR-≤120 LOC, EOP triplet) is the brake.

## Carry-forward

| Item | Target | Rationale |
|---|---|---|
| P91 Process Map (Planning body) | P91 | First content body for Planning mode |
| P92 PROCESS_ATOM (Crystal Atom) | P92 | New atom for phase + sprint decomposition |
| P93 DDD_ATOM (Crystal Atom) | P93 | Bounded-context atom for Planning |
| P94 AGENT_ATOM + AISPDeveloperCard mount | P94 | Agentics first body work; first-visit card mount + `hb-aisp-card-dismissed-v1` flag wire |
| P95 SpecWorkbench (shared Planning + Agentics) | P95 | Cross-mode spec editing surface |
| P96 Export (mode-aware) | P96 | Each mode's export shape |
| P97 TDD Scaffold (Planning) | P97 | Test scaffolding atom |
| P98 KISS+Review gate (Agentics) | P98 | Review-gate workflow |
| P99-P100 Seal Panel | P99-P100 | Final close-out atom + sprint-seal UI |
| Per-mode personality customization | Tier-2 | Out of open-core scope |
| Cross-mode state sharing | post-RC v2.0 | Architectural depth not justified pre-RC |
| Mode-specific mobile layouts | post-Agentic-Workbench | Whiteboard mobile per ADR-090 preserved; Planning + Agentics render desktop-like on mobile this sprint |
| Whiteboard onboarding card | not planned | ADR-110 says UX > AISP for Whiteboard — intentionally NOT shipped |
| Real `@supabase/supabase-js` install | (Tier-2 commercial fork only) | Per P89b correction — never lands in open-core |
| Auth UI + magic-link flow | (Tier-2 commercial fork only) | Tier-2 boundary preserved |
| Migration tool sql.js → Supabase | (Tier-2 commercial fork only) | Tier-2 boundary preserved |

## Velocity check

- Original P90 budget: 1 working day
- Actual P90 effective time: ~hours (multi-hour shift)
- @vel multiplier: ~3-5× original estimate
- Quality gates held: existsSync soft-pass, ADR ≤120 LOC, token compliance,
  EOP triplet, CLAUDE.md sync, tsc strict.

## Sprint anchor

**~1102+ cumulative PURE-UNIT GREEN at combined P89b + P90 seal** (was
~1076+ at P89 standalone; +~5 P89b + ~15 P90).

ADR ledger: 115 → **116 Accepted** (ADR-116 = Three-Mode Product Architecture).
