# ADR-039: Standard Blog Page — Canonical Novice Starter

**Status:** Accepted
**Date:** 2026-04-27
**Deciders:** Bradley Ross
**Phase:** 15

---

## Context

Hey Bradley targets novices first. Onboarding research during Phase 14 surfaced a recurring request: a "standard blog page" starter — the kind of thing a home cook, hobbyist, or first-time author recognizes the moment they see it. The existing example library covers business archetypes (bakery, law firm, consulting, real estate) and a single playful food blog (`fun-blog.json`), but `fun-blog` is a kitchen-sink-style blog index with navbar, hero, intro, gallery, blog cards, CTA, and multi-column footer. It is not the simplest possible blog — it is a blog showcase.

The MVP charter (ADR-029) narrows pre-LLM scope to the rendering surface novices will actually exercise. Multi-page authoring is deferred (see `plans/deferred-features.md`). What remains within scope today is a single-page blog landing built from three section types: a hero, a `blog` section carrying a single `blog-article` component, and a minimal footer. This shape is reachable with the existing section type registry (ADR-022) and the JSON data architecture (ADR-031); no schema changes are required.

The need is twofold:
1. **Onboarding parity** — give novices a starter card that says "blog" without asking them to absorb a full blog-index layout.
2. **Narrowed-scope demo** — exercise exactly three section types end-to-end, so the pre-LLM rendering pipeline has a tight, predictable canonical example for Phases 15–19 review work.

---

## Decision

Add `src/data/examples/blog-standard.json` as the canonical novice blog starter. The file contains exactly three sections in this order:

1. **`hero` (id `hero-01`)** — heading, subheading, single CTA pointing to the blog anchor.
2. **`blog` (id `blog-01`, variant `minimal`)** — a single `blog-article` component containing title, excerpt body, author, date, tags, and featured image.
3. **`footer` (id `footer-01`)** — minimal copyright line plus three nav links.

The example uses a warm-precision palette (`#faf8f5` background, `#e8772e` accent) with DM Sans for both heading and body typography. Site context is set to a personal baking blog: purpose `Personal blog about baking`, audience `Home bakers`, tone `Warm, conversational`.

The example is registered in `src/data/examples/index.ts` as `Stories from the kitchen` with the `Personal` theme grouping, surfaced as a starter card on the Onboarding page alongside Kitchen Sink (ADR-038), Blank, and the existing archetype examples.

---

## Alternatives considered

- **Reuse `fun-blog.json`** → rejected. Fun Blog is a seven-section showcase with gallery, CTA, and multi-column footer. It is a maximalist blog landing, not a recognizable single-article page. The novice-onboarding signal is diluted by the surrounding chrome.
- **Multi-page blog (index + post pages)** → rejected. Multi-page authoring is post-MVP per ADR-029 and is documented as deferred. Committing to it now would expand scope mid-phase.
- **Add a fourth section type (`menu`/`nav`)** → rejected. The narrowed-scope MVP exercises three section types intentionally; adding a nav doubles the surface to test and review without onboarding payoff at this size.
- **Generate the example dynamically from a template** → rejected. Examples are static JSON by ADR-031; dynamic generation introduces a parallel code path the LLM stage will eventually own.

---

## Consequences

### Positive
- One additional starter card; no schema changes, no new section types, no new components.
- Tight canonical example for Phases 15–19 review (small enough to read in full, broad enough to exercise hero + body + footer rendering).
- Sets up future multi-page work without committing to it: when multi-page lands, this example becomes the "post page" template by addition rather than rewrite.
- Reinforces the warm-precision palette established in ADR-009b for novice-facing surfaces.

### Negative
- The novice may expect a comments widget, related posts, or a subscribe form. None of these are in scope; the example deliberately omits them and the onboarding copy must set that expectation.

### Risks
- If the `blog` section type evolves a richer schema (cover variants, author cards, table of contents) the example must be re-validated. Mitigated by the `_meta.schema` discipline in ADR-031.

---

## Related ADRs

- ADR-022: Section Type Registry — establishes `hero`, `blog`, `footer` as registered types
- ADR-029: Pre-LLM MVP Architecture — narrows scope; defers multi-page
- ADR-031: JSON Data Architecture — schema and metadata discipline for example files
- ADR-038: Kitchen Sink Reference Example — companion starter card for the maximalist end of the spectrum
