# ADR-087 — Design Token System + Component Quality Standard

- **Status:** Accepted
- **Date:** 2026-04-30
- **Phase:** P65 / OC-2.5
- **Cross-refs:** ADR-079 (Premium Templates), ADR-088 (Mode Architecture), ADR-076 (Mobile UX Overhaul)

## Context

OC-3 sealed at `0701b37` with 26 hand-curated templates, each landing
with a self-contained `style:` block (per OC-3 hard rule). Owner
brutal-honest review at OC-3 close: **visual polish 6/10 isn't a copy
or template-count problem; it's a coherent-design-system problem.**
OC-1 typography pass moved fonts but did not unify spacing, radius,
shadow, or motion. New templates built on a bad component foundation
will all score 6/10. New templates built on good components will score
8/10 without extra effort. OC-2.5 inserts the system BEFORE OC-4
(templates Round 2) so the next 14 templates inherit it from day one.

## Decision

A single shared TypeScript file at `src/styles/design-tokens.ts` is
the canonical source of truth for non-color design tokens (spacing,
typography, radius, shadow, motion). The file exports a typed `tokens`
object matching the canonical schema below.

Canonical shape (verbatim, see `src/styles/design-tokens.ts`):

- **spacing** — `section-y` 96px, `section-y-mobile` 64px, `container-x` 24px, `stack-gap` 24px, `stack-gap-lg` 48px
- **typography** — `display` / `h1` / `h2` use `clamp(...)` for responsive scale; `body` 1.125rem; `body-sm` 0.9375rem; `line-height` 1.6
- **radius** — sm 6px, md 12px, lg 20px, xl 32px
- **shadow** — `card` `0 2px 12px rgba(0,0,0,0.08)`; `elevated` `0 8px 32px rgba(0,0,0,0.12)`
- **motion** — `duration` { fast 150ms, base 200ms, slow 300ms }; `ease` { in-out cubic-bezier(0.4, 0, 0.2, 1) }

Section components (Hero / Feature / Testimonial — to be rewritten in
OC-2.5 Wave 2) MUST import from this file. Templates MAY reference
token-derived classes via Tailwind's arbitrary-value syntax
(`p-[var(--token-section-y)]`) OR — preferred — via component prop API.

## KISS rules

1. **No new CSS files.** Tailwind only; tokens live in this single TS file.
2. **Tokens in one file.** Do not split spacing/typography/etc. across modules.
3. **Motion policy.** Tailwind transitions only. NO Framer Motion, GSAP,
   Lottie, React Spring, or animejs anywhere in canonical components.

## Quality bar

Every canonical section component MUST import from `design-tokens` and
contain no hard-coded `'24px'`, `'48px'`, or `'96px'` literals — token
references only. The static check is enforced by
`tests/p65-oc25-design-tokens.spec.ts` and any future component-level
spec under OC-2.5 Wave 2. Existing 26 templates are EXEMPT this sprint;
their migration is OC-8 (Clean UI Pass).

## Bounded-context impact

Lives within `ui-shell` (formalized in
`docs/ddd/ui-shell-bounded-context.md`). No new bounded context.

## Out of scope

- Hero / Feature / Testimonial component rewrites (OC-2.5 Wave 2)
- Migration of existing 26 templates (OC-8)
- Theme color tokens (separate decision; this ADR is non-color tokens only)
- Per-mode design variants (Whiteboard / Planning / Agentics — AW work)

## Acceptance gates

- `src/styles/design-tokens.ts` exists; `npx tsc --noEmit` clean
- `tests/p65-oc25-design-tokens.spec.ts` passes (≥6 cases)
- `docs/ddd/ui-shell-bounded-context.md` lists the design-token system
  as a component aggregate

## Consequences

**Positive.** Every future template inherits the system; OC-4 Round 2
templates will score visual polish higher than OC-3 templates without
extra design effort; canonical section components gain a single
auditable design contract.

**Negative.** Existing 26 templates carry a migration debt — their
self-contained `style:` blocks do not yet reference tokens.

**Mitigations.** Migration is mechanical (find-replace of literals to
token references) and fits cleanly into OC-8 Clean UI Pass; no runtime
behavior change required. The token file is additive — no existing
template breaks by it landing.
