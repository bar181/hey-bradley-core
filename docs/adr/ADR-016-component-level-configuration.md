# ADR-016: Component-Level Configuration

**Date:** 2026-03-28 | **Status:** ACCEPTED

## Context

The current `default-config.json` represents section content as a flat object (`content.heading`, `content.cta`, `content.badge`). This works for simple sections but creates problems: you cannot toggle visibility of individual elements (e.g., hide the badge but keep the heading), you cannot reorder elements within a section, and the flat structure doesn't map cleanly to a "Components" accordion in the right panel.

Builder.io solves this with its `BuilderBlock` interface, where each block has a `component` property with `name` and `options`, plus `hide`/`show` booleans for visibility. Framer uses a layer tree where each layer is independently configurable with its own props and visibility state. Both platforms treat individual UI elements as first-class addressable units.

## Decision

Within each section, individual UI elements are represented in a `components[]` array. Each component has:

```json
{
  "id": "hero-badge",
  "type": "eyebrow-badge",
  "enabled": true,
  "order": 0,
  "props": {
    "text": "Hey Bradley 2.0 is Live",
    "variant": "pill",
    "icon": "sparkle"
  }
}
```

### Component Object Keys

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `id` | string | Yes | Unique identifier within the section. Stable across patches. |
| `type` | string | Yes | Component type (eyebrow-badge, headline, subheadline, paragraph, primary-button, secondary-button, image, trust-badges, feature-card, etc.) |
| `enabled` | boolean | Yes | Visibility toggle. `false` = hidden but preserved (soft delete). |
| `order` | number | Yes | Render sequence within the section. |
| `props` | object | Yes | Component-specific key-value pairs. Schema varies by `type`. |

### Example: Hero Section Components

```json
{
  "type": "hero",
  "id": "hero-01",
  "components": [
    { "id": "hero-badge", "type": "eyebrow-badge", "enabled": true, "order": 0, "props": { "text": "Hey Bradley 2.0 is Live" } },
    { "id": "hero-heading", "type": "headline", "enabled": true, "order": 1, "props": { "text": "Ship Code at the Speed of Thought", "level": 1 } },
    { "id": "hero-sub", "type": "subheadline", "enabled": true, "order": 2, "props": { "text": "Build AI-native experiences that transform how we create." } },
    { "id": "hero-cta", "type": "primary-button", "enabled": true, "order": 3, "props": { "text": "Get Started", "url": "#pricing" } },
    { "id": "hero-cta2", "type": "secondary-button", "enabled": true, "order": 4, "props": { "text": "View my work", "url": "#about" } },
    { "id": "hero-trust", "type": "trust-badges", "enabled": true, "order": 5, "props": { "text": "Trusted by 214 institutions" } }
  ]
}
```

### Relationship to Section `content`

The `components[]` array replaces the flat `content` object for element-level data. The section-level `content` key is retained for section-wide copy that doesn't belong to a specific component (e.g., a section `title` used in navigation anchors). The migration path:

- **Phase 1**: Both `content` (legacy) and `components[]` (new) coexist. Renderer checks `components[]` first, falls back to `content`.
- **Phase 2+**: `content` is deprecated. All element data lives in `components[]`.

## Consequences

- **Positive**: The right-panel "Components" accordion maps 1:1 to this array. Each component entry becomes an expandable row with an enable toggle and props editor.
- **Positive**: Adding a new element to a section = appending to the `components[]` array. No schema changes needed for the section.
- **Positive**: Removing an element = setting `enabled: false`. Content is preserved; the user can re-enable it later. This matches Builder.io's soft-delete pattern.
- **Positive**: Reordering elements within a section = changing `order` values and/or array positions.
- **Positive**: LLM patching targets a specific component by `id`: `sections[?id='hero-01'].components[?id='hero-badge'].props.text`.
- **Trade-off**: The `components[]` array adds depth to the JSON. A simple hero section goes from ~20 lines to ~30 lines. Accepted because the structure is regular and predictable.
- **Trade-off**: Component `type` determines the `props` schema, meaning validation must be type-aware. The Zod schema uses discriminated unions keyed on `type`.
