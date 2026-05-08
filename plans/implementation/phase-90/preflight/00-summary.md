# P90 — Agentic Workbench: Mode Architecture (Preflight)

> **Phase:** P90 · **Sprint:** AW-MODE-ARCH · **Date:** 2026-05-01
> **Predecessor:** P89 sealed at `f3c1e0d` (~1082+ GREEN, 115 ADRs); P89b cleanup parallel
> **Cross-refs:** ADR-085 (Multi-Page MVP / Mode Architecture context), ADR-088 (Mode Architecture decisions, P63 / OC-2), ADR-089 (Agentics Data Model, P63 / OC-2), ADR-090 (Mobile UX Redesign), ADR-110 (AISP Visibility Standard)
> **Companion:** P89b Tier-2 cleanup (parallel)

## Reframe — three-mode product begins

The 3-card onboarding `ModeSelectorCard` already exists (P63 / OC-2; ADR-088). Cards exist visually for whiteboard / planning / agentics; only Whiteboard is wired today. P90 ships the routing + layout-shell scaffolding so Planning and Agentics modes load real (stub) pages. The full mode bodies ship across P91-P100.

## 3 parallel agents · disjoint scopes

### A3 — Mode routes + 3-card onboarding wire
**Owns:**
- `src/main.tsx` (EDIT — add 2 routes: `/planning` → `<Planning />` and `/agentics` → `<Agentics />`; both wrapped in `<Suspense>` with `React.lazy()` per ADR-102 perf standard)
- `src/pages/Planning.tsx` (NEW; ≤120 LOC) — stub page:
  - Header "Planning Mode"
  - Brief description (1 paragraph): "Phase + sprint decomposition with PROCESS_ATOM. Building now."
  - Placeholder for: project list, process map, spec panel
  - Link back to home + "Coming soon" badge with target completion phase (P91-P95)
  - ADR-091 token compliance
  - `data-testid="planning-mode-stub"`
- `src/pages/Agentics.tsx` (NEW; ≤120 LOC) — stub page:
  - Header "Agentics Mode"
  - Brief description: "Multi-agent coordination with AGENT_ATOM. Building now."
  - Placeholder for: phase/sprint/wave tree, agent coordination, AISP spec
  - Link back to home + "Coming soon" badge (P92-P100)
  - Mounts `AISPDeveloperCard` (from P85) — first time it surfaces
  - ADR-091 token compliance
  - `data-testid="agentics-mode-stub"`
- `src/components/onboarding/ModeSelectorCard.tsx` (EDIT — wire `onSelectMode` handlers in the consumer page; the card itself already accepts `onSelectMode` callback; we wire it up in whatever consumer renders it)
- `src/store/uiStore.ts` (EDIT — add `activeMode: 'whiteboard' | 'planning' | 'agentics'` field + `setActiveMode(mode)` action; default 'whiteboard'; persisted via existing autosave mechanism)

**Constraints:** Stubs are real React components — not placeholders inside JSX comments. Each stub gets a real page render that doesn't error. Mode persists in uiStore. Token-compliant.

DO NOT touch:
- `src/components/shell/AppShell.tsx` (A4 owns)
- ADR-116 / tests / plans / CLAUDE.md (A5 owns)
- P89b sibling files (A1's persistence cleanup, A2's tier-2 docs)

### A4 — Mode-aware layout shell (route-derived)
**Owns:**
- `src/components/shell/AppShell.tsx` (EDIT — currently 66 LOC; cap +60 LOC; final ≤130 LOC)
  - Read `useLocation().pathname` to determine active mode (route-derived; NO uiStore dependency to keep coupling minimal)
  - When pathname starts with `/planning` → render Planning layout (left = project list placeholder; center = process map placeholder; right = spec panel placeholder)
  - When pathname starts with `/agentics` → render Agentics layout (left = phase/sprint tree placeholder; center = agent coordination placeholder; right = AISP spec)
  - Otherwise → existing Whiteboard layout (BYTE-EQUIVALENT to today)
  - Each mode-specific layout uses ADR-091 token-compliant placeholders with `data-testid="appshell-mode-{mode}"`
  - Mobile: per ADR-090, mobile layouts may differ; preserve existing mobile shell for whiteboard mode; planning + agentics modes can render desktop-like layout on mobile this sprint (carry-forward to mobile-specific in a later phase)

**Constraints:** Whiteboard mode layout BYTE-EQUIVALENT to today. KISS: route-derived, no store coupling. Surgical additions (no AppShell rewrite). NO new dependencies.

DO NOT touch:
- routes/stubs/ModeSelectorCard/uiStore (A3 owns)
- ADR-116 / tests / plans / CLAUDE.md (A5 owns)
- P89b sibling files

### A5 — ADR-116 + tests + EOP closer + final CLAUDE.md sync (combined P89b + P90)
**Owns:**
- `docs/adr/ADR-116-three-mode-product-architecture.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-085 + ADR-086 + ADR-088 + ADR-090 + ADR-110)
  - Decisions: (1) three modes (Whiteboard/Planning/Agentics) routed via `/`, `/planning`, `/agentics`; (2) mode persisted in `uiStore.activeMode`; (3) mode-aware AppShell layout per route; (4) Planning + Agentics ship as stubs P90; full bodies P91-P100; (5) AISP visibility per ADR-110: Whiteboard hides AISP by default, Planning shows dual-view, Agentics shows AISP prominently
- `tests/p90-mode-architecture.spec.ts` (NEW; ≥15 cases; Playwright):
  - P90.1 ADR-116 file shape (4)
  - P90.2 Routes + stubs (4): Planning.tsx + Agentics.tsx exist; main.tsx imports both; both use React.lazy
  - P90.3 ModeSelectorCard wire (1): consumer (likely Welcome.tsx or Onboarding.tsx) passes onSelectMode that navigates to /planning or /agentics
  - P90.4 uiStore activeMode (2): activeMode + setActiveMode present
  - P90.5 AppShell mode-aware (2): AppShell source contains pathname checks for /planning + /agentics
  - P90.6 KISS — no animation libs in P90 source (1)
  - P90.7 EOP triplet for P90 (3): phase-90/02-post-review.md, session-log.md, retrospective.md
- `plans/implementation/phase-90/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` final sync coordinated with P89b/A2's NOTE — bump ADRs 115 → 116; mark P89b + P90 SEALED; tests cumulative anchor; capabilities entry. Honor ADR-114 + ADR-115 Tier-2 markers from P89b.

**Constraints:** ADR ≤120 LOC; tests use `@playwright/test`; ROOT = `process.cwd()`. existsSync guards on A3/A4 surfaces.

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO touching files outside owned list
4. Whiteboard mode byte-equivalent to today (no regression)
5. NO shell commands inside agents (except tsc + targeted playwright run)
6. TypeScript-strict; no `any`
7. KISS — Planning + Agentics ship as STUBS only this sprint; placeholders + "Coming soon" badges; full bodies are subsequent sprints

## Acceptance gates (combined P89b + P90)
- Open-core build has 0 Supabase references (P89b/A1)
- Tier-2 README clearly documents boundary (P89b/A2)
- Mode routes (/planning, /agentics) load stub pages (P90/A3)
- AppShell renders mode-aware layout per route (P90/A4)
- ADR-116 Accepted citing ADR-085 + ADR-088 + ADR-110
- ≥15 P90 tests + ≥5 P89b tests GREEN
- Cumulative session OC chain regression ≥770 GREEN
- tsc strict clean
