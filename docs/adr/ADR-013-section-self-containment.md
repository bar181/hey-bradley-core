# ADR-013: Section Self-Containment

**Date:** 2026-03-28 | **Status:** ACCEPTED

## Context

The primary consumers of section JSON are: (1) the React renderer, which needs to know what to display; (2) LLM agents, which need to patch a single section without loading the entire config; (3) the drag-and-drop UI, which needs to reorder sections by moving array elements.

Research shows Builder.io's `BuilderBlock` type is fully self-contained -- each block carries its own `responsiveStyles`, `component.options`, `children[]`, and `hide` flag. You can serialize one block and it has everything needed to render. Framer's layer tree follows the same pattern: each layer carries its own props, style overrides, and variant state.

The current `default-config.json` already partially follows this pattern (each section has `layout`, `content`, `style`, `enabled`), but it lacks explicit `order`, `variant`, and `components[]` keys.

## Decision

Each section object in the `sections[]` array is self-contained. Extracting a single section from the array produces a valid, renderable unit. The required keys for every section are:

```json
{
  "type": "hero",
  "id": "hero-01",
  "enabled": true,
  "order": 0,
  "variant": "centered",
  "layout": { },
  "content": { },
  "style": { },
  "components": [ ]
}
```

- **`type`**: Section type identifier (hero, features, cta, about, pricing, footer, etc.)
- **`id`**: Unique, stable identifier for patch targeting
- **`enabled`**: Boolean toggle. `false` hides the section but preserves all content (soft delete)
- **`order`**: Explicit integer for the render sequence. Matches array index but survives JSON patches that might not preserve array order
- **`variant`**: Named layout variant (e.g., "centered", "split-left", "card-grid")
- **`layout`**: Flexbox/grid properties for the section container
- **`content`**: Text, headings, descriptions -- the copywriting layer
- **`style`**: Visual overrides that layer on top of theme defaults
- **`components`**: Array of component objects within this section (see ADR-016)

## Consequences

- **Positive**: LLM patching becomes surgical. An agent can receive one section object, modify it, and return it. No cross-references to resolve.
- **Positive**: Drag-and-drop reordering is an array splice plus updating `order` integers. No data dependencies between sections.
- **Positive**: Enable/disable is a single boolean flip. Content is preserved for re-enabling later.
- **Positive**: Each section type can define its own content schema without affecting others.
- **Trade-off**: Data duplication is possible. Two sections could define `style.background: "#0a0a0f"` independently, even though the theme already specifies that color. This is accepted because the alternative (referencing theme tokens by name) adds indirection that complicates LLM patching.
- **Trade-off**: The `order` field and array index must stay in sync. The `configStore.reorder()` method is responsible for maintaining this invariant.
