# JSON Hierarchy Patterns in Website Builders

**Date:** 2026-03-28 | **Author:** Research Agent (Phase 1.2)

## Purpose

Study how Framer, Webflow, and Builder.io structure their JSON configuration to inform Hey Bradley's three-level JSON hierarchy (site, theme, sections/components).

---

## 1. Framer

### Site-Level vs Theme-Level Configuration

Framer uses a **design token** abstraction layer for global values. Design tokens are platform-agnostic variables storing colors, typography, spacing, shadows, and motion properties. These tokens act as the site-wide configuration that cascades to all components.

At the site level, Framer manages project metadata (name, domain, SEO) separately from visual configuration.

### Component Hierarchy

Framer organizes components in a **layer tree** model (similar to Figma):

- **Pages** contain **Frames** (sections)
- **Frames** contain **Layers** (components)
- Each layer has props, variants, and overrides

Components use a **primary variant inheritance** model:
- The primary variant acts as the base
- All other variants inherit its properties
- Only overridden properties diverge from the primary
- Overrides are tracked explicitly and can be reset individually

### Theme Preset Cascade

Design tokens cascade through the tree:
1. Global tokens define the palette (colors, fonts, spacing)
2. Components reference tokens by name, not by value
3. Changing a token updates all components that reference it
4. Individual components can override token values per-instance

### Component Visibility and Ordering

- Components are ordered by their position in the layer tree (array index)
- Visibility is controlled per-breakpoint via display properties
- Components can be hidden at specific breakpoints while remaining visible at others

### Key Takeaway for Hey Bradley

Framer's **variant + override** model is powerful but complex. Hey Bradley's simpler `enabled: boolean` per component is the right trade-off for a JSON-first builder where LLMs need to patch individual fields.

---

## 2. Webflow

### Site-Level Configuration

Webflow separates concerns into:
- **Site settings**: domain, SEO, integrations, publishing config
- **Style system**: global classes that can be applied to any element
- **CMS collections**: structured content types with field definitions

### Internal Data Model (XscpData Format)

Webflow's internal clipboard format reveals its JSON structure:

```json
{
  "type": "@webflow/XscpData",
  "payload": {
    "nodes": [
      {
        "_id": "unique-id",
        "tag": "section",
        "classes": ["class-id-1"],
        "children": ["child-id-1", "child-id-2"],
        "type": "Section",
        "data": {
          "tag": "section",
          "attr": { "id": "hero" }
        }
      }
    ],
    "styles": [
      {
        "_id": "class-id-1",
        "name": "Hero Section",
        "styleLess": "background-color: #0a0a0f; padding: 64px;"
      }
    ]
  }
}
```

### Theme Cascade

Webflow uses a **class-based inheritance** model:
1. Base classes define shared styles
2. Combo classes extend base classes with specificity
3. State classes (hover, pressed) layer on top
4. Breakpoint overrides cascade from desktop down

Styles are stored separately from structure. A node references class IDs; the styles array resolves those IDs to CSS properties.

### Component Visibility and Ordering

- Ordering is determined by `children` array position within parent nodes
- Visibility is class-based: elements can have display states per breakpoint
- CMS-driven visibility uses conditional logic on collection fields

### Key Takeaway for Hey Bradley

Webflow's **separation of styles from structure** (nodes vs. styles arrays) is clean but adds indirection. Hey Bradley's co-located `style` object within each section is simpler for LLM patching because you don't need to cross-reference IDs.

---

## 3. Builder.io

### Content Model Types

Builder.io defines five model types:
- **page**: Full page content
- **section**: Reusable page sections
- **component**: Custom component definitions
- **data**: Structured data models
- **symbol**: Reusable content blocks (like Figma components)

### Block Structure (BuilderBlock Interface)

Builder.io uses a recursive block-based JSON structure:

```typescript
interface BuilderBlock {
  '@type': '@builder.io/sdk:Element';
  id?: string;
  tagName?: string;
  layerName?: string;
  children?: BuilderBlock[];         // Recursive nesting
  component?: {
    name: string;                     // Component type
    options?: any;                    // Component-specific props
  };
  responsiveStyles?: {
    large?: CSSProperties;
    medium?: CSSProperties;
    small?: CSSProperties;
  };
  bindings?: Record<string, string>;  // Dynamic data bindings
  actions?: Record<string, string>;   // Event handlers
  properties?: Record<string, string>;// HTML attributes
  animations?: BuilderAnimation[];
  hide?: boolean;                     // Visibility toggle
  show?: boolean;                     // Conditional visibility
  repeat?: { collection: string };    // Data-driven repetition
}
```

### Theme Cascade

Builder.io uses a **global theme + block override** model:
- Global styles are set at the space/organization level
- Individual blocks carry their own `responsiveStyles`
- The SDK merges global defaults with block-level overrides at render time
- Patches from the editor are sent as diffs against the current state

### Component Visibility and Ordering

- **Ordering**: Children array index determines render order
- **Visibility**: `hide: boolean` for unconditional hide; `show: boolean` for conditional display
- **Responsive visibility**: `responsiveStyles` can set `display: none` per breakpoint
- **Soft delete**: Hidden blocks remain in the JSON, preserving content

### Key Takeaway for Hey Bradley

Builder.io's `hide`/`show` booleans on each block directly map to Hey Bradley's `enabled: boolean` on sections and components. The recursive `children[]` pattern is how Builder.io achieves arbitrary nesting, but Hey Bradley's two-level approach (sections contain components) is deliberately flatter for LLM-friendliness.

---

## 4. Cross-Platform Pattern Summary

| Concern | Framer | Webflow | Builder.io | Hey Bradley (Proposed) |
|---------|--------|---------|------------|----------------------|
| **Global config** | Design tokens | Site settings + global classes | Space-level theme | `site` object |
| **Theme cascade** | Token references | Class inheritance | Global + block merge | `theme` object with deepMerge |
| **Section structure** | Frames in layer tree | Nodes with children IDs | Blocks with children[] | `sections[]` array |
| **Component config** | Props + variants | Classes + attributes | `component.options` | `components[]` with `props` |
| **Ordering** | Layer tree position | Children array index | Children array index | Array index in `sections[]` / `components[]` |
| **Visibility** | Per-breakpoint display | Class-based display | `hide`/`show` booleans | `enabled` boolean |
| **Style location** | Co-located on layer | Separate styles array | Co-located `responsiveStyles` | Co-located `style` object |

---

## 5. Recommendations for Hey Bradley

### Validated Decisions

1. **Three-level hierarchy (site/theme/sections) is correct.** All three platforms separate global settings from visual theming from content structure. Hey Bradley's explicit three-level split is cleaner than any of the studied platforms.

2. **Co-located styles are the right call.** Builder.io and Framer both co-locate styles with structure. Webflow's separation adds indirection that complicates patching. For LLM-driven editing, co-location wins.

3. **`enabled` boolean for visibility is industry-standard.** Builder.io's `hide`/`show` pattern confirms this. The soft-delete approach (hide but preserve content) matches Builder.io's behavior.

4. **Array index for ordering is universal.** All three platforms use array position. No platform uses explicit `order` integers (like CSS z-index). Array position IS the order.

### Gaps to Address

1. **Responsive styles**: All three platforms handle per-breakpoint overrides. Hey Bradley should plan for this in a future phase (responsive `style` overrides per section).

2. **Data bindings**: Builder.io's `bindings` property allows dynamic content. Hey Bradley's template-superset approach (ADR-014) should reserve keys for future dynamic binding.

3. **Animations**: All platforms support animation configuration in JSON. Low priority but worth reserving a key in the template.

---

## Sources

- [Framer Developer Configuration](https://www.framer.com/developers/configuration)
- [Framer Components Guide](https://www.framer.com/academy/lessons/framer-fundamentals-components)
- [Framer Design Tokens](https://core.framer.media/writing/design-tokens-101)
- [Framer Code Overrides Masterclass](https://segmentui.com/learn/framer-code-components-and-code-override-masterclass)
- [Webflow Developer Documentation](https://developers.webflow.com)
- [Webflow CMS API](https://developers.webflow.com/data/reference/cms)
- [Webflow Component Architecture](https://developers.webflow.com/devlink/docs/component-export/design-guidelines/component-architecture)
- [Builder.io Content Component](https://www.builder.io/c/docs/content-component)
- [Builder.io How It Works (Technical)](https://www.builder.io/c/docs/how-builder-works-technical)
- [Builder.io BuilderBlock Type Definition](https://github.com/BuilderIO/builder/blob/main/packages/sdks/src/types/builder-block.ts)
- [Builder.io Component Registration Options](https://www.builder.io/c/docs/register-components-options)
- [WordPress theme.json Introduction](https://developer.wordpress.org/themes/global-settings-and-styles/introduction-to-theme-json/)
- [WordPress theme.json Design Systems](https://wpvip.com/blog/using-a-design-system-with-the-wordpress-block-editor-pt-1-theme-json/)
