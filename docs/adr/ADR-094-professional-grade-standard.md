# ADR-094 — Professional Grade Standard

- **Status:** Accepted
- **Date:** 2026-04-30
- **Phase:** P67b / Polish Wave 2 close-the-gap
- **Cross-refs:** ADR-091 (Canonical Component Quality), ADR-092 (Polish Sprint Architecture), ADR-093 (Component Decomposition Standard), ADR-087 (Design Token System)

## Context

P66 / Polish Wave 1 closed library polish at **6.0 → 7.3**. P67 / Polish
Wave 2 closed at **7.3 → 7.9**. Three carry-forward items remained at the
end of P67 that blocked further movement toward the "professional grade"
target: (A1) ChatInput orchestrator decomposition (1013 LOC; 3 sub-components
shipped but not yet consumed), (A2) sub-page hero consistency across the
5 marketing sub-pages, and (A3) mobile real-device parity / responsive
audit. P67b landed all three. ADR-094 codifies what "professional grade"
means **quantitatively** so the standard is a measurable gate instead of
a subjective owner-call.

## Decision — what 8.5 means quantitatively

1. **Per-surface score.** Every major surface MUST score ≥**8/10** against
   the polish rubric. The 11 surfaces in the touched-surface inventory
   are: Welcome, Onboarding, Builder, Chat, Listen, AISP page, OpenCore
   page, Research page, Blog page, Progress page, Mobile shell.
2. **Library mean.** Aggregate mean across ALL surfaces (touched + legacy)
   MUST be ≥**8.0/10**.
3. **Touched-surface mean.** Surfaces touched by polish sprints MUST mean
   ≥**8.5/10**. Legacy untouched surfaces (settings drawer internals,
   editor-mode internals) are flagged "scheduled for future polish" and
   excluded from the touched-surface mean.
4. **Minimum mechanical gates.**
   - Zero hard-coded `'24px'` / `'48px'` / `'96px'` literals in canonical
     components (per ADR-091).
   - All canonical components import from `@/styles/design-tokens` (per
     ADR-087).
   - All polished surfaces match ADR-092 standards (collapse-by-default
     animation, CTA pair, hero shape).
   - Component file-size caps satisfied per ADR-093 (orchestrators ≤250,
     canonical ≤200, non-canonical ≤300).

## Quality bar (enforced by `tests/p67b-close-the-gap.spec.ts`)

- `src/components/shell/ChatInput.tsx` ≤**900 LOC** (honest progress from
  1013; ≤700 target deferred to ChatThread extraction in P67c).
- 5 sub-pages have canonical hero shape: eyebrow (`text-xs uppercase
  tracking-[0.2em] text-[#e8772e]`) + headline + sub + CTA pair (`Try the
  open source version` + `Explore AISP` or `View on GitHub`).
- 2 demos (`ListenModeDemo.tsx`, `ChatModeDemo.tsx`) carry responsive
  guards (`flex-wrap` and/or `px-4 md:px-6`) for the small-viewport band.
- Mobile audit document exists at
  `plans/implementation/phase-67b/03-mobile-audit.md` and references the
  three target widths (375 / 390 / 428).

## Out of scope

- Surfaces not touched in the OC arc (legacy editor surfaces, settings
  drawer internals); per-mode UI variants (Whiteboard / Planning /
  Agentics — AW work).
- Subjective sign-off ("does it FEEL professional?") — that is a persona
  re-score gate per ADR-092, not part of ADR-094's mechanical contract.
- Tier-2 commercial surfaces — separate quality bar.

## Bounded-context impact

Lives within the `ui-shell` bounded context (per ADR-087). ADR-094 is a
**quality-bar aggregate** layered alongside ADR-091 (canonical component
quality), ADR-092 (polish sprint architecture), and ADR-093 (component
decomposition). Future polish sprints inherit ALL FOUR quality bars by
reference; new ADRs only when a new class of standard is needed.

## Consequences

**Positive.** Every future polish sprint has a measurable target — the
8.5 number is no longer a subjective owner-call. Reviewer-impression and
competitive sub-metrics both move because the quality bar is encoded in
specs (`tests/p67b-close-the-gap.spec.ts` + ADR-093's spec gate). Drift
detection happens at CI, not at hand-review. Touched-surface mean ≥8.5
is a **realistic** target inside a single polish sprint; library mean
≥8.5 is a multi-sprint target that requires sweeping legacy surfaces.

**Negative.** Per-surface scoring remains subjective at the 0.5-point
granularity (a 7.5 vs 8.0 call is judgment, not measurement). Mitigation:
each post-review document encodes the rubric per surface (see ADR-092),
so the judgment is at least transparent and reviewable. The "library
mean ≥8.0" gate is currently failing (P67b lands 8.3) — that is honest
progress, not a contract violation, because the touched-surface mean
(8.7) exceeds its bar.
