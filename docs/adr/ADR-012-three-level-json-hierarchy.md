# ADR-012: Three-Level JSON Hierarchy

**Date:** 2026-03-28 | **Status:** ACCEPTED

## Context

Hey Bradley's JSON configuration needs to support two very different editing modes: a non-technical user clicking "apply dark theme" (changing everything at once) and a power user tweaking one button's border radius (changing one property in one component). The current `default-config.json` has a flat `sections[]` array with no separation between global metadata, theme-wide styling, and per-section content.

Research into Framer, Webflow, and Builder.io (see `docs/research/json-hierarchy-research.md`) confirms that all major website builders separate global settings from visual theming from content structure. WordPress's `theme.json` explicitly separates `settings` (what's available) from `styles` (how it looks). Builder.io separates space-level themes from block-level overrides. Framer uses design tokens as the global cascade layer.

## Decision

The JSON configuration uses three distinct levels:

1. **`site`** -- Global metadata that is not visual. Page title, spec version, page identifier, SEO fields, analytics IDs. Changed rarely, usually once during setup.

2. **`theme`** -- Visual defaults that apply to ALL sections equally. Colors (primary, secondary, background, surface, text), typography (font family, base size, heading scale), spacing (section padding, component gap), border radius. When a user picks a "vibe preset," it overwrites this object.

3. **`sections[]`** -- An ordered array where each entry is a self-contained section with its own layout, content, style, and components. Section-level `style` overrides theme defaults via deepMerge.

The decision tree for where a change goes:

| What changed? | Target level |
|--------------|-------------|
| Page title, version, SEO | `site` |
| All sections should be darker | `theme.colors` |
| One section's background | `sections[i].style.background` |
| One button's text | `sections[i].components[j].props.text` |

## Consequences

- **Positive**: Every JSON patch targets exactly one of the three levels. LLMs can be instructed "patch the theme object" or "patch section index 2" without ambiguity.
- **Positive**: "Apply theme preset" is a single object replacement at the `theme` key. No need to iterate sections.
- **Positive**: The three levels map directly to the planned right-panel accordion: Site Settings, Theme, Sections.
- **Trade-off**: Section-level styles can diverge from theme defaults. The renderer must implement a merge strategy (theme defaults + section overrides). This is the accepted cost of supporting both global theming and per-section customization.
- **Trade-off**: Adding a new global concern (e.g., responsive breakpoints) requires deciding which level it belongs to. The rule: if it affects all sections equally, it goes in `theme`; if it's metadata, it goes in `site`.
