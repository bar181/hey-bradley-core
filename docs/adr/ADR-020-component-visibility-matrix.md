# ADR-020: Component Visibility Per Theme

**Date:** 2026-03-29 | **Status:** ACCEPTED

## Context

Previous theme implementations changed colors but left all components visible and identical across themes. The result: 10 themes that looked like the same website with different paint. ADR-016 established component-level configuration with `enabled: true/false` flags, but no theme leveraged this for visual diversity.

A minimalist website shows ONLY a headline and a CTA button. A full-featured SaaS landing page shows a badge, headline, subtitle, two CTAs, a product screenshot, and trust badges. This difference in component visibility is what makes themes look like DIFFERENT websites — not color swaps.

## Decision

### 1. Each theme specifies `enabled: true/false` for every hero component:

The canonical visibility matrix:

| Component | SaaS | Agency | Portfolio | Blog | Startup | Personal | Professional | Wellness | Creative | Minimalist |
|-----------|------|--------|-----------|------|---------|----------|-------------|----------|----------|-----------|
| eyebrowBadge | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| headline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| subtitle | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| primaryCTA | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| secondaryCTA | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| heroImage | ✅ | ✅ | ❌* | ✅ | ❌ | ✅ | ❌ | ❌* | ❌ | ❌ |
| backgroundImage | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| backgroundVideo | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| trustBadges | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |

*❌\* = uses backgroundImage instead of inline heroImage*

### 2. This creates 5 distinct layout variants:

| Variant | Themes | Description |
|---------|--------|-------------|
| centered | SaaS, Startup, Professional, Creative | Text centered, optional image below or video behind |
| split-right | Agency, Blog | Text left, image/content right |
| split-left | Personal | Image/photo left, text right |
| overlay | Portfolio, Wellness | Full-bleed background image/video with text overlay |
| minimal | Minimalist | Text only, maximum whitespace |

### 3. Component count varies dramatically:

- **Most components (7):** SaaS — badge + headline + subtitle + 2 CTAs + image + trust
- **Fewest components (2):** Minimalist — headline + primaryCTA only
- **Average:** 4-5 components per theme

### 4. Image/video distribution:

- **2 themes with backgroundVideo:** Startup (abstract particles), Creative (artistic motion)
- **2 themes with backgroundImage (overlay):** Portfolio (architecture/landscape), Wellness (nature)
- **4 themes with inline heroImage:** SaaS (product mockup), Agency (portfolio work), Blog (article image), Personal (headshot)
- **2 themes with NO image:** Professional (clean/trust), Minimalist (typography only)

### 5. The source of truth is the theme JSON itself:

No separate runtime matrix file. Each theme's `sections[0].components[]` array encodes the visibility via `enabled: true/false`. The matrix table in this ADR is the REFERENCE SPECIFICATION — theme JSONs must match it exactly.

## Consequences

**Positive:**
- Real visual diversity: no two themes look alike
- Component toggling is already supported by ADR-016 infrastructure
- Users can override visibility in Expert mode (per-component enabled toggles)
- LLM patches can target specific component visibility

**Negative:**
- More complex theme JSONs (each must specify all 9 component enabled states)
- Theme card previews must accurately reflect component visibility (more rendering logic)

**Verification:** A theme passes only if its enabled flags match this matrix. Any deviation is a bug.
