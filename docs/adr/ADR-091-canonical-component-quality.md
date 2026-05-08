# ADR-091 — Canonical Component Quality Standard

- **Status:** Accepted
- **Date:** 2026-04-30
- **Phase:** P65b / OC-2.5 Wave 2
- **Cross-refs:** ADR-087 (Design Token System), ADR-079 (Premium Templates), ADR-088 (Mode Architecture)

## Context

OC-2.5 (P65) shipped the design-token contract (`src/styles/design-tokens.ts`)
but no component yet consumed it. ADR-087 explicitly deferred the Hero /
Feature / Testimonial component rewrites to OC-2.5 Wave 2. Owner reframe at
P65 close: **the contract is real, but the UI hasn't changed yet** —
infrastructure ≠ visible. P65b / OC-2.5 Wave 2 ships VISIBLE: the first 7
canonical section components consuming the token contract. These 7 components
(4 Hero variants + 2 Feature variants + 1 Testimonial) define the **quality
bar** that every future canonical component (added in any subsequent sprint)
must meet. The other 60 section templates (text/team/blog/quotes/navbar/
action/pricing/numbers/faq/divider/image/logos/footer/gallery/cta/columns/
questions etc.) stay non-canonical until OC-8 Clean UI Pass migrates them.

## Decision

A **canonical** section component is one that satisfies all of:

1. Imports `tokens` from `@/styles/design-tokens` (asserted by static test)
2. Contains no hardcoded `'24px'` / `'48px'` / `'96px'` spacing literals
   outside imports + comments (asserted by static test)
3. Applies Tailwind `transition-all` + `hover:-translate-y` + `hover:shadow`
   on interactive cards (Feature + Testimonial)
4. Implements scroll-reveal via `IntersectionObserver` (Hero variants only —
   pure browser API, no library)
5. Respects JSON config (`section.style.background`, `section.style.color`,
   `section.layout.padding` etc.) — chrome only is token-driven; content
   and per-template overrides remain JSON-config-honoring

The seed canonical set is **7 files**:

- `src/templates/hero/HeroCentered.tsx`
- `src/templates/hero/HeroMinimal.tsx`
- `src/templates/hero/HeroOverlay.tsx`
- `src/templates/hero/HeroSplit.tsx`
- `src/templates/features/FeaturesCards.tsx`
- `src/templates/features/FeaturesGrid.tsx`
- `src/templates/testimonials/TestimonialsCards.tsx`

## Quality bar (enforced by `tests/p65b-canonical-components.spec.ts`)

Every canonical file MUST satisfy:

- imports `from '@/styles/design-tokens'`
- NO `'24px'` / `'48px'` / `'96px'` (or `"24px"` / `"48px"` / `"96px"`)
  string literal outside imports + comments
- NO `framer-motion` / `gsap` / `lottie` / `@react-spring` / `animejs` import
- Hero variants: contain `IntersectionObserver` reference
- Feature + Testimonial: contain `transition-all` + `hover:-translate-y` +
  `hover:shadow` Tailwind classes

## Bounded-context impact

Lives within `ui-shell` bounded context (formalized in
`docs/ddd/ui-shell-bounded-context.md` per ADR-087). The Section Component
Library aggregate gains 7 canonical members; the remaining 60 templates
stay non-canonical members of the same aggregate until OC-8.

## Out of scope

- Migration of the OTHER 60 section templates (still acceptable as
  non-canonical; OC-8 Clean UI Pass migrates them in a single sweep)
- Per-mode component variants (Whiteboard / Planning / Agentics — AW work)
- Component-level animation timelines (Tailwind transitions only;
  no orchestrated motion per ADR-087 KISS rules)
- Color tokens (separate ADR; ADR-087 + ADR-091 are non-color)
- Copy or section-structure changes (chrome only)

## Acceptance gates

- 7 canonical component files satisfy quality bar
- ADR-091 cross-refs ADR-087 + ADR-079 + ADR-088
- `tests/p65b-canonical-components.spec.ts` passes (≥10 cases)
- Cumulative regression: prior OC-1 / OC-2 / OC-2.5 / OC-3 specs still GREEN
- `npx tsc --noEmit` clean
- Future canonical components (added in any sprint) MUST satisfy this bar

## Consequences

**Positive.** Visual polish 6 → 7.5 estimated; the 26 existing templates
inherit improvements automatically (the Hero/Feature/Testimonial renderers
are shared); new templates landing in OC-4 start at 8/10 with zero extra
design effort; the quality bar is encoded in tests, not just docs, so drift
is detected automatically.

**Negative.** Ongoing-maintenance discipline required for the 7 canonical
components; future sprints adding canonical components inherit the quality
bar (they cannot ship a "quick" Hero variant without satisfying it).

**Mitigations.** The static-check rule is mechanical (FS read + regex);
adding new canonical components is additive — extending the test spec's
canonical-file list keeps enforcement uniform. The 60 non-canonical
templates carry a known migration debt that OC-8 absorbs in one pass.
