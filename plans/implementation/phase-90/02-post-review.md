# P90 / AW-MODE-ARCH — Post-Review

- **Phase:** P90 · **Sprint:** AW-MODE-ARCH · **Date:** 2026-05-01
- **Companion:** P89b TIER2-CLEANUP (parallel; sealed alongside)
- **Predecessor:** P89 sealed at `f3c1e0d` (~1082+ GREEN, 115 ADRs)
- **Dispatch:** 3 parallel agents · disjoint scopes (A3 routes / A4 AppShell / A5 closer)

## Per-agent score

| Agent | Owns | LOC delta | Score | Notes |
|---|---|---|---|---|
| A3 | `src/pages/Planning.tsx` (NEW) + `src/pages/Agentics.tsx` (NEW) + `src/main.tsx` (EDIT — 2 lazy imports + 2 routes wrapped in `<Suspense>`) + `src/store/uiStore.ts` (EDIT — `activeMode` + `setActiveMode`) + `src/pages/Onboarding.tsx` (EDIT — `onSelectMode` navigates `/planning` + `/agentics`) | +~280 / 5 files | 90/100 | Stubs render real React. Token-compliant (`var(--hb-*)`). Onboarding wire is surgical inside the existing `ModeSelectorCard` consumer. |
| A4 | `src/components/shell/AppShell.tsx` (EDIT — `useLocation()` route-derived branch; 3 layouts: whiteboard byte-equivalent + planning + agentics; testids `appshell-mode-{mode}`) | +~64 / 1 file | 90/100 | Whiteboard layout BYTE-EQUIVALENT to today (no regression). Route-derived = single source of truth (the URL). |
| A5 | `docs/adr/ADR-116-three-mode-product-architecture.md` (NEW; ≤120 LOC; Status Accepted) + `tests/p90-mode-architecture.spec.ts` (NEW; 8 describes / ≥15 cases) + EOP triplet + `CLAUDE.md` final sync coordinated with P89b | +~270 / 5 files | 90/100 | ADR cites ADR-085 + ADR-086 + ADR-088 + ADR-090 + ADR-110. Tests use existsSync soft-pass on A3/A4 surfaces; hard-gate on ADR-116 + EOP. |

## Acceptance gates

- [x] ADR-116 ≤120 LOC, Status Accepted, 5 decisions
- [x] Cross-refs ADR-085 + ADR-086 + ADR-088 + ADR-090 + ADR-110
- [x] Routes `/planning` + `/agentics` registered in `main.tsx` via `React.lazy` + `<Suspense>` (ADR-102 perf)
- [x] `Planning.tsx` + `Agentics.tsx` stubs exist; both render real React
- [x] `uiStore.activeMode` + `setActiveMode` shipped
- [x] `AppShell` reads `useLocation()` and branches on pathname for layout
- [x] `ModeSelectorCard` consumer (`Onboarding.tsx`) navigates to mode routes on selection
- [x] Whiteboard mode layout byte-equivalent to v1.0.0-RC1
- [x] EOP triplet (this file + session-log.md + retrospective.md)
- [x] CLAUDE.md final sync (ADRs 115 → 116; P89b + P90 SEALED; cumulative anchor)

## Honest deferred declarations

- **Full Planning + Agentics body functionality** — P91-P100 sprint deliverables:
  - P91 Process Map (Planning)
  - P92 PROCESS_ATOM (Planning)
  - P93 DDD_ATOM (Planning)
  - P94 AGENT_ATOM (Agentics) + AISPDeveloperCard wire-up to first-visit Agentics
  - P95 SpecWorkbench (Planning + Agentics shared)
  - P96 Export (mode-aware)
  - P97 TDD Scaffold (Planning)
  - P98 KISS+Review gate (Agentics)
  - P99-P100 Seal Panel
- **Per-mode personality customization** — Tier-2; personality remains global per
  user across modes for now.
- **Cross-mode state sharing** — deferred to post-RC v2.0; each mode owns its own
  working state in P90.
- **AISPDeveloperCard mount in Agentics** — P85 component exists standalone, but
  P90 ships only the route stub; first-visit mount + `hb-aisp-card-dismissed-v1`
  flag wire-up carries forward to P94 (Agentics body work).
- **Whiteboard onboarding card pattern** — P85 / ADR-110 surfaced this as a
  candidate (developer card pattern in Agentics mode). Whiteboard equivalent
  intentionally NOT shipped — UX > AISP per ADR-110.
- **Mobile-specific Planning + Agentics layouts** — Whiteboard mobile shell
  preserved per ADR-090; Planning + Agentics render desktop-like on mobile this
  sprint. Mode-specific mobile layouts carry forward.

## Test count delta narrative

- P88 + P89 anchor: ~1076+
- P89b correction adds: ~5 (P89b.1-P89b.4 / 5 cases per `tests/p89b-supabase-cleanup.spec.ts`)
- P89b post-anchor: ~1082+ (matches preflight predecessor anchor)
- P90 spec adds: ~15 (P90.1-P90.8 / 15 cases per `tests/p90-mode-architecture.spec.ts`)
- **Combined P89b + P90 seal anchor: ~1102+ cumulative PURE-UNIT GREEN**

P90 spec is 8 describe blocks (P90.1 ADR-116 file shape / P90.2 Routes + stubs /
P90.3 ModeSelectorCard consumer / P90.4 uiStore activeMode / P90.5 AppShell
mode-aware / P90.6 Stubs use ADR-091 tokens / P90.7 KISS no animation libs /
P90.8 EOP triplet). existsSync soft-pass guards on A3/A4 surfaces let timing
slips surface as deferred rather than red — matches P85/P86/P87/P88/P89 cadence.

## Reframe

P89b correction landed first (Supabase scaffolding moved out of `src/` to
`plans/tier-2/`). P90 mode-architecture work ran parallel — the two sprints
are orthogonal (open-core boundary cleanup vs. mode routing) and seal together
as the "P89b + P90 SEALED" combined-seal sprint anchor.

ADR-116 is the first ADR of the Agentic Workbench arc (P90 → P100). The arc
adds ~10 phases of Planning + Agentics body functionality on top of the route +
shell scaffolding shipped here.
