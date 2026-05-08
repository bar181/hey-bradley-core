# P65 / OC-2.5 — Design Token System + Component Quality Standard (Preflight)

> **Phase:** P65 · **Sprint:** OC-2.5 (P1 launch-blocking — INSERTED before OC-4)
> **Date opened:** 2026-04-30
> **Status:** OPEN — owner-authorized dispatch
> **Predecessor:** P64 / OC-3 sealed at `0701b37` (439/439 GREEN, 26 templates)
> **Successor:** OC-4 Templates Round 2 (now builds ON the token system)

---

## Why OC-2.5 was inserted

Owner brutal-honest review at OC-3 close: **visual-polish 6/10 isn't a
copy or template-count problem; it's a coherent-design-system problem.**

> "New templates built on a bad component foundation will all score
> 6/10. New templates built on good components will score 8/10 without
> extra effort."

OC-3 templates landed with self-contained `style:` blocks (per OC-3 hard
rule). They're at design-ceiling level individually but lack a shared
token system. Without OC-2.5, every future template inherits the same
inconsistency. Inserting OC-2.5 BEFORE OC-4 (templates Round 2) means
the next 14 templates inherit the system from day one.

---

## ADR numbering — reassigned

Owner direction (verbatim): "ADR-087 — Design Token System + Component
Quality Standard". Previous ADR-087 reservation (Mobile UX redesign for
OC-5) re-reserved as **ADR-090**.

Updated CLAUDE.md ADR ledger reflects the swap. ADR-085, ADR-086,
ADR-088, ADR-089 remain as-shipped.

---

## Scope (this sprint)

Three deliverables, single-agent dispatch:

1. **ADR-087** — Design Token System + Component Quality Standard
   (≤120 LOC; locked decision; owner-supplied schema as the canonical shape)
2. **`src/styles/design-tokens.ts`** — the token file (spacing /
   typography / radius / shadow / motion); TypeScript-typed; exports
   used by section components in OC-2.5 follow-up + every future sprint
3. **`docs/ddd/ui-shell-bounded-context.md`** — new DDD doc formalizing
   the `ui-shell` bounded context; design-token system listed as a
   component aggregate

Plus: **test spec** `tests/p65-oc25-design-tokens.spec.ts` (PURE-UNIT, ≥6 cases).

---

## Token schema (canonical, per owner brief)

```ts
{
  spacing: {
    'section-y': '96px',
    'section-y-mobile': '64px',
    'container-x': '24px',
    'stack-gap': '24px',
    'stack-gap-lg': '48px',
  },
  typography: {
    display: 'clamp(2.5rem, 5vw, 4rem)',
    h1: 'clamp(2rem, 4vw, 3rem)',
    h2: 'clamp(1.5rem, 3vw, 2.25rem)',
    body: '1.125rem',
    'body-sm': '0.9375rem',
    'line-height': '1.6',
  },
  radius: { sm: '6px', md: '12px', lg: '20px', xl: '32px' },
  shadow: {
    card: '0 2px 12px rgba(0,0,0,0.08)',
    elevated: '0 8px 32px rgba(0,0,0,0.12)',
  },
  motion: {
    // KISS rule: Tailwind transitions only; no Framer Motion or JS animation libraries
    duration: { fast: '150ms', base: '200ms', slow: '300ms' },
    ease: { 'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)' },
  },
}
```

---

## ADR-087 must capture (per owner brief)

- The shared token schema (spacing, typography, radius, shadow, motion)
- Which components are canonical (Hero, Feature, Testimonial — to be
  rewritten in OC-2.5 follow-up; this sprint scopes them as
  contract-only)
- **KISS rule:** no new CSS files; Tailwind only; tokens in one file
- **Quality bar:** every section component must pass the token audit
  before a template can reference it (audit = static-check that
  component imports from `design-tokens` and contains no hard-coded
  spacing / radius / shadow values)
- **Motion policy:** Tailwind transitions only; no Framer Motion;
  no JS animation libraries

---

## Hard rules

1. **NO new CSS files.** Tokens live in `src/styles/design-tokens.ts`
   (TypeScript, not CSS).
2. **NO Framer Motion / GSAP / Lottie / React Spring.** Tailwind transitions only.
3. **NO component rewrites this sprint.** Hero/Feature/Testimonial
   component-quality work is OC-2.5 Wave 2 (separate dispatch). This
   sprint locks the contract; the component work consumes it.
4. **NO migration of existing 26 templates.** Their `style:` blocks
   stay self-contained; the token system is forward-looking. Migration
   is OC-8 (Clean UI Pass) territory.
5. **NO new bounded context.** Design tokens live within the existing
   `ui-shell` context (formalized in the new DDD doc).
6. **NO shell commands inside agent.**

---

## Acceptance gates

- ADR-087 Accepted on disk (≤120 LOC); cross-refs ADR-079, ADR-088, ADR-076
- `src/styles/design-tokens.ts` exports a typed `tokens` object matching the canonical schema
- `docs/ddd/ui-shell-bounded-context.md` formalizes the bounded context, lists design-token system as a component aggregate
- Test spec `tests/p65-oc25-design-tokens.spec.ts` (≥6 cases) — token-shape validation; ADR cross-ref check; DDD doc shape check
- `npx tsc --noEmit` clean
- Cumulative test count: 439 + 6+ = 445+ GREEN

---

## Successor

OC-4 Templates Round 2 — now scoped to use the new design tokens for
any new template's `style:` blocks. Existing 26 templates stay as-is
(migration is OC-8). OC-2.5 Wave 2 (component-quality rewrite of
Hero/Feature/Testimonial) is a separate sprint in the post-OC-4 chain.
