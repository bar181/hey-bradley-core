# ADR-024: Layout Variants — 8 Per Section with Column Selector

- **Status:** Accepted
- **Date:** 2026-04-02

## Context

Currently, variants and column count are conflated into a single value (e.g., `FeaturesGrid3` encodes both "grid style" and "3 columns"). This limits discoverability and creates a combinatorial naming problem. Most sections only have 1-2 working variants, leaving the builder feeling thin. Users need a visual, browsable way to pick layout styles independent of how many columns they want.

## Decision

Separate layout variant selection from column count into two independent controls:

### Layout Variants

- Every section type supports **up to 8 visually distinct layout variants**.
- Variants are displayed as **visual icon cards** in a 2-column grid within the editor panel.
- Each variant represents a different card/layout style, not a column count.

### Column Count

- Column count (2 / 3 / 4) is a **separate selector** from the variant picker.
- Column count applies to multi-column section types: **Columns, Pricing, Quotes, Numbers, Gallery**.
- Column count does **not** apply to full-width sections: **Hero, Action, Menu, Footer** (these are always full-width).
- The `Questions` section uses an accordion/list layout and does not need a column selector.

### Variant Examples — Columns Section

| # | Variant Name | Description |
|---|-------------|-------------|
| 1 | Cards | Standard card with border and padding |
| 2 | Image Cards | Card with hero image above content |
| 3 | Icon+Text | Icon/emoji left, text right |
| 4 | Minimal | Clean text-only, subtle dividers |
| 5 | Numbered | Large step number with description |
| 6 | Horizontal | Side-by-side image and text |
| 7 | Gradient Cards | Cards with gradient backgrounds |
| 8 | Glass | Frosted glass / glassmorphism cards |

### Combinatorial Power

For a section like Columns: **8 styles x 3 column options = 24 visual combinations** from just two simple controls.

## Consequences

- Each section type needs up to 8 renderer components (one per variant).
- Thumbnail preview images or SVG icons must be created for each variant card in the picker.
- A new `columns` prop (2 | 3 | 4) is added to section data, separate from `variant`.
- Existing `variant` values that encode column count (e.g., `FeaturesGrid3`) must be migrated to the new split format.
- The editor panel gains a visual variant picker grid and, for applicable sections, a column count toggle.
- Theme JSON schema updates to include the new `columns` field alongside `variant`.
