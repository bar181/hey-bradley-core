# ADR-116 — Three-Mode Product Architecture

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P90 / AW-MODE-ARCH
- **Cross-refs:** ADR-085 (Multi-Page MVP), ADR-086 (Process Pages content/runtime split), ADR-088 (Mode Architecture P63 origin), ADR-090 (Mobile UX Redesign), ADR-110 (AISP Visibility Standard)

## Context

P63 / OC-2 (ADR-088) planted the three-mode architecture as design intent: a
`ModeSelectorCard` already exists with three options (Whiteboard / Planning /
Agentics), but only Whiteboard was wired through v1.0.0-RC1. P85 / ADR-110 then
encoded the AISP-visibility principle: **UX trumps AISP visibility; dual-view
when forced; never sacrifice UX**. P90 wires routing + layout for the missing
two modes so the planted architecture finally surfaces in the running product.

The three modes target three different user audiences with three different
AISP-prominence levels:

- **Whiteboard** (default; entry point) — fastest path from idea to preview.
  AISP hidden behind a collapsible trace; UX-first.
- **Planning** — phase + sprint decomposition for owners working a multi-step
  build. AISP shown as dual-view (spec panel default-open) per ADR-110.
- **Agentics** — multi-agent coordination for AISP-native developers. AISP
  shown prominently (right-panel always-on). `AISPDeveloperCard` (P85) mounts
  here on first visit.

P90 ships the routing primitive + layout shell + stub pages. Full Planning +
Agentics bodies (Process Map, PROCESS_ATOM, DDD_ATOM, AGENT_ATOM,
SpecWorkbench, Export, TDD Scaffold, KISS+Review, Seal Panel) ship across
P91-P100.

## Decisions

### Decision 1 — Three modes routed via `/`, `/planning`, `/agentics`

- Whiteboard is the **default route** (`/`) — preserves the v1.0.0-RC1 entry
  point and onboarding flow byte-equivalent for that mode.
- `/planning` and `/agentics` are new routes; both lazy-loaded via `React.lazy`
  + `<Suspense>` per ADR-102 perf standard.
- Routes register in `src/main.tsx`; both stubs render real React components,
  not JSX comments or placeholder strings.

### Decision 2 — Mode persisted in `uiStore.activeMode`

- Field: `activeMode: 'whiteboard' | 'planning' | 'agentics'` (default
  `'whiteboard'`).
- Action: `setActiveMode(mode)`.
- Mirrors to existing `appMode` kv-persisted slot for autosave continuity.
- Existing `rightPanelTab` slot is unaffected (orthogonal concern).

### Decision 3 — AppShell layout is route-derived, NOT store-derived

- AppShell reads `useLocation().pathname` to determine active mode.
- The URL is the single source of truth for layout selection — minimizes
  coupling and eliminates a class of bugs (store/URL drift on navigation).
- `uiStore.activeMode` is for behavior (chat pipeline routing, AISP visibility
  defaults); the URL drives layout.

### Decision 4 — Planning + Agentics ship as stubs in P90

- Stub = real React component with header + 1-paragraph description +
  placeholder regions + "Coming soon" badge naming the target completion phase.
- Full bodies: Process Map (P91), PROCESS_ATOM (P92), DDD_ATOM (P93),
  AGENT_ATOM (P94), SpecWorkbench (P95), Export (P96), TDD Scaffold (P97),
  KISS+Review (P98), Seal Panel (P99-P100).
- Stubs ARE token-compliant (`var(--hb-*)`) per ADR-091. KISS — no functional
  body this sprint.

### Decision 5 — AISP visibility per mode (per ADR-110)

- **Whiteboard:** AISP hidden by default; collapsible trace chip when forced.
  UX-first per ADR-110.
- **Planning:** Dual-view; spec panel default-open. Owner is reasoning over
  architecture and benefits from the spec being visible alongside the build.
- **Agentics:** AISP prominent; right-panel always-on; `AISPDeveloperCard`
  (P85) mounts on first visit (dismissable; localStorage flag
  `hb-aisp-card-dismissed-v1`).

## Out of scope

- **Full Planning + Agentics body functionality** — P91-P100 deliverables
  (Process Map, PROCESS_ATOM, DDD_ATOM, AGENT_ATOM, SpecWorkbench, Export,
  TDD Scaffold, KISS+Review, Seal Panel).
- **Commercial Tier-2 features** — separate track per P89b correction; this
  ADR governs the open-core mode architecture only.
- **Cross-mode state sharing** — deferred to post-RC v2.0; each mode owns its
  own working state in P90.
- **Per-mode personality customization** — Tier-2; personality remains global
  to the user across modes for now.
- **Mobile-specific Planning + Agentics layouts** — Whiteboard mobile shell
  preserved per ADR-090; Planning + Agentics render desktop-like on mobile
  this sprint (carry-forward to mode-specific mobile in a later phase).

## Acceptance gates

- ADR ≤120 LOC
- Status: **Accepted**
- 5 decisions enumerated
- Cross-refs ADR-085 + ADR-088 + ADR-090 + ADR-110
- `src/pages/Planning.tsx` + `src/pages/Agentics.tsx` exist and render
- `src/main.tsx` routes both via `React.lazy`
- `src/store/uiStore.ts` exports `activeMode` + `setActiveMode`
- `src/components/shell/AppShell.tsx` reads `useLocation()` and branches on
  pathname for layout selection

## Consequences

- **Positive:** planted architecture (ADR-088) finally surfaces; Planning +
  Agentics get real URLs (deep-linkable); URL is single source of truth for
  layout (no drift); stubs unblock P91-P100 sprint dispatch; AISP-visibility
  ladder per mode lets UX-first (Whiteboard) and AISP-first (Agentics) users
  coexist without compromise.
- **Negative:** two new routes to maintain; AppShell now has three branches
  instead of one (modest complexity bump); mobile parity for Planning +
  Agentics deferred (carry-forward).
- **Mitigations:** route-derived layout keeps AppShell additions surgical
  (≤60 LOC); stubs are intentionally minimal so the next 10 phases have a
  clean canvas; mobile carry-forward documented out-of-scope above.
