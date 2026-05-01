# ADR-095 — Library-Wide Polish Standard

- **Status:** Accepted
- **Date:** 2026-04-30
- **Phase:** P67c / Close the Gap (legacy sweep)
- **Cross-refs:** ADR-091 (Canonical Component Quality), ADR-092 (Polish Sprint Architecture), ADR-093 (Component Decomposition Standard), ADR-094 (Professional Grade Standard), ADR-087 (Design Token System)

## Context

P67b achieved per-touched-surface polish at **8.7/10** (exceeding the
ADR-094 ≥8.5 bar) but library mean stalled at **8.3/10** — the 0.2-point
gap was attributable to legacy untouched surfaces never swept by the OC
arc: settings drawer internals, EXPERT-side section editors, and the
ChatInput orchestrator's bulk. P67c dispatched 3 sub-modules at the legacy
backlog: (A1) settings drawer audit, (A2) expert section editors collapse-
parity, (A3) ChatInput → ChatThread extraction. ADR-095 codifies the
"no surface left untouched" requirement so future drift on legacy surfaces
is detectable. Where ADR-094 set the quantitative bar, ADR-095 sets the
**coverage** contract.

## Decision — the 3 library-wide standards

1. **Legacy coverage.** Every component file under `src/components/`
   (excluding `*.test.tsx`, generated leaf files, and sub-component
   primitives) MUST satisfy ADR-091 (canonical) OR be enumerated in the
   carry-forward backlog. Periodic audit each polish wave: any unflagged
   file that fails ADR-091 is a contract violation.
2. **Decomposition coverage.** Every orchestrator file >700 LOC MUST be
   on the next polish-sprint backlog (per ADR-093's >700 trigger).
   ChatInput.tsx at 720 LOC remains in the carry-forward (target ≤500
   via useChatPipeline hook in P67d).
3. **Settings + drawer parity.** Settings-drawer surfaces follow the
   same per-surface ≥8 gate as user-facing surfaces (no second-class
   treatment). EXPERT-side editors follow the same canonical-shape
   contract as user-facing components.

## Quality bar (enforced by `tests/p67c-library-polish.spec.ts`)

- 3 settings files (`BrandContextUpload.tsx`, `CodebaseContextUpload.tsx`,
  `LLMSettings.tsx`) contain `transition-colors` on interactive icon /
  CTA buttons. All 7 settings files free of `'24px'` / `'48px'` / `'96px'`
  hard-coded literals (per ADR-091).
- 3 expert editors (`SectionExpert.tsx`, `NavbarSectionExpert.tsx`,
  `ThemeExpert.tsx`) carry the canonical collapse pattern:
  `useState` + `aria-expanded` + `transition-all duration-200` +
  `data-testid="section-editor-collapse-toggle"` + import from
  `@/styles/design-tokens`.
- `src/components/shell/ChatInput.tsx` ≤**750 LOC** (gates 720 LOC with
  margin; honest carry-forward to ≤500 in P67d).
- `src/components/shell/ChatThread.tsx` exists; exports `ChatThread`;
  contains `INTENT_ATOM` + `Try:` literals; imports `PatchLatencyBadge`
  + `AISPSurface`.
- No file under `src/components/shell/` or
  `src/components/right-panel/expert/` exceeds 600 LOC (canonical /
  non-canonical cap per ADR-093 with margin).

## Out of scope

- `useChatPipeline` hook extraction — P67d (would push ChatInput
  orchestrator to ~500 LOC).
- Per-mode UI variants for AW work (Whiteboard / Planning / Agentics).
- Third-party widget polish (markdown render, code-highlight themes).
- Live-LLM smoke tests (OC-12, separate quality bar).

## Bounded-context impact

Lives within the `ui-shell` bounded context (per ADR-087 DDD doc).
Introduces 3 new aggregates the polish program now treats as first-class:
- **ChatThread** — extracted render-loop aggregate (157 LOC) with its
  own message-shape contract, AISP surface seam, and latency badge.
- **Audited Settings drawer** — settings surfaces now scored under the
  same per-surface rubric as user-facing surfaces.
- **EXPERT section editors with collapse parity** — `SectionExpert` /
  `NavbarSectionExpert` / `ThemeExpert` now match the canonical-component
  collapse-by-default contract from ADR-091 / ADR-092.

ADR-091 + ADR-092 + ADR-093 + ADR-094 + ADR-095 form the polish quality-
bar quintet. Future polish sprints inherit ALL FIVE quality bars by
reference.

## Consequences

**Positive.** Library mean reaches ≥8.5 with the 3 P67c sweeps (legacy
gap closed). Drift on legacy surfaces is detectable at CI: any new
settings or expert-editor file that ships without the canonical
collapse + token-import pattern fails the spec gate. The "no surface
left untouched" coverage contract makes future polish-sprint planning
mechanical: each preflight enumerates the legacy backlog before
dispatch.

**Negative.** Ongoing audit cadence required — each polish-sprint
preflight runs a coverage audit before dispatch; this adds ~10 min wall
to the preflight stage. Mitigation: the audit itself is spec-gated
(this file's tests), so the work is "verify the spec stays GREEN" not
"manually re-walk the inventory". Some legacy surfaces (per-mode UI
variants, AW work) remain explicitly out of scope; ADR-095 does not
pretend to cover them.
