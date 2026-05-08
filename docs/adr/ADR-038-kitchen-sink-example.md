# ADR-038: Kitchen Sink Reference Example — Single JSON Exercising Every Section Type

**Status:** Accepted
**Date:** 2026-04-27
**Deciders:** Bradley Ross
**Phase:** 15

---

## Context

Hey Bradley ships 21 section template directories in `src/templates/` (action, blog, columns, cta, divider, faq, features, footer, gallery, hero, image, logos, navbar, numbers, pricing, questions, quotes, team, testimonials, text, value-props) backed by a 16-entry canonical type enum in `src/lib/schemas/section.ts` (the remaining template directories are visual variants or naming aliases per ADR-023 and ADR-024). Across Phases 11-14 the example library grew to 15 site-shaped configs (bakery, blank, consulting, dev-portfolio, education, enterprise-saas, fitforge, florist, fun-blog, kitchen-sink, launchpad, law-firm, photography, real-estate, restaurant), each tuned to a specific persona.

Persona examples are useful for novices and demos, but they fail two needs that surface heavily in the Phase 15 charter:

1. **Regression coverage** — when a section variant changes shape during Phases 15-20, no single config exercises every variant in one render. We currently rely on persona examples to incidentally cover the surface, which leaks bugs into Phase-19 LLM prep.
2. **Onboarding discovery** — curious novices who want to "see everything the renderer can do" before picking a starting point have no canonical entry. Persona examples deliberately omit sections that don't fit the persona narrative.

A reference example that intentionally exercises every shipped section type and the canonical variant for each closes both gaps with one artifact.

---

## Decision

### 1. Single Kitchen Sink JSON

Maintain `src/data/examples/kitchen-sink.json` as the canonical reference example. It must contain at least one enabled section instance for every section type registered in `src/templates/` and the canonical layout variant for each, threaded through a coherent narrative (currently a SaaS persona, "Nexus Labs") so the rendered output reads like a real site rather than a catalogue dump.

### 2. Onboarding Surface

Surface Kitchen Sink as a starter card on the Onboarding page alongside the existing persona starters. The card count rises from 3 default starters to 4. The card label communicates that this example is for exploration, not production use.

### 3. Maintenance Contract

Whenever a section type, variant, or template directory is added to `src/templates/`, the same PR must add a corresponding instance to `kitchen-sink.json`. Whenever a section variant is removed or renamed, the same PR must update `kitchen-sink.json`. CI gains a coverage check (Phase 16) that fails if `kitchen-sink.json` is missing any registered section type.

### 4. Rendering Surface, Not AISP Surface

Kitchen Sink exercises the renderer and the JSON schema. It does not need to exercise every AISP Crystal Atom edge case (ADR-032, ADR-033) — those are covered by spec-generator unit tests. This keeps the example legible.

---

## Alternatives considered

- **A docs-only "all sections" catalogue page.** Rejected — a markdown catalogue does not exercise the live renderer or the JSON schema, so regressions still slip through.
- **One Kitchen Sink per theme (12 copies).** Rejected — redundant. The renderer is theme-agnostic for section structure; one example covers the rendering surface and theme-specific behavior is covered by the persona examples.
- **Auto-generate Kitchen Sink at build time from the registry.** Rejected for MVP — tempting, but produces unrealistic content (placeholder strings everywhere) and complicates the visual quality gate (ADR-011). Re-evaluate in Phase 18.
- **Skip the example and rely on persona configs.** Rejected — persona configs intentionally omit off-brand sections and have allowed at least three regressions during Phase 14 marketing review.

---

## Consequences

### Positive

- **Single regression target** — one render covers every shipped section type, catching shape drift immediately.
- **Onboarding clarity** — novices have a canonical "see everything" entry without needing to read docs first.
- **Low maintenance cost** — one JSON file updated whenever a section variant lands; no parallel theme matrix.
- **AISP feedback loop** — running the spec generators against Kitchen Sink produces the largest single Crystal Atom payload, which is the best stress test for ADR-032's section-level atoms.

### Negative

- **Tight coupling to the section registry** — every registry change requires a Kitchen Sink edit. Mitigated by the Phase-16 CI coverage check.
- **Narrative compromises** — fitting every section into one coherent site forces some sections to feel ornamental (e.g., a SaaS site rarely needs both a logos marquee and a team grid). Acceptable for a reference example; called out in the onboarding card copy.
- **Card count growth** — Onboarding rises from 3 to 4 default starters. Trivial UX impact, but a precedent: future "reference" starters need an explicit decision to add.

### Resolved gaps

Verification of `src/data/examples/kitchen-sink.json` against `src/templates/` (21 directories) finds 15 of 21 template directories represented as direct `section.type` values. The remaining 6 are alias or variant directories whose canonical type is already covered (per ADR-022 Section Type Registry and ADR-023 Section Naming):

- `navbar` — covered by canonical type `menu`
- `cta` — covered by canonical type `action`
- `faq` — covered by canonical type `questions`
- `testimonials` — covered by canonical type `quotes`
- `features` — covered by canonical type `columns` (variant `image-cards`)
- `value-props` — covered by canonical type `numbers` (variant `counters`)

All 16 canonical section types in `src/lib/schemas/section.ts` are now present in `kitchen-sink.json`. The previously missing `blog` canonical type was closed by adding one `blog` section instance (variant `card-grid`, three inline `blog-article` components) between the `text` and `image` sections, threaded into the Nexus Labs SaaS narrative as an engineering blog roll.

---

## Related ADRs

- ADR-022: Section Type Registry — defines the canonical type list and alias rules
- ADR-023: Section Naming — variant directories map to canonical types
- ADR-024: Layout Variants — canonical variant per section type
- ADR-031: JSON Data Architecture — example files are validated against `hb-example-v1`
- ADR-039: Standard Blog Page — adds the `blog` section instance that closes the only canonical-type gap

---

## References

- Example file: `src/data/examples/kitchen-sink.json`
- Template directories: `src/templates/` (21 directories at time of writing)
- Section type enum: `src/lib/schemas/section.ts` (16 canonical types)
- Plan stub: `plans/implementation/mvp-plan/09-adrs-to-create.md`
