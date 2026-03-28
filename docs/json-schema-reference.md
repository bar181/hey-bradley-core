# Hey Bradley -- JSON Schema Reference

This document describes the MasterConfig JSON structure used by the Hey Bradley site builder. All page layouts, sections, and styling are driven by a single JSON configuration file that conforms to the AISP-1.2 specification.

## Table of Contents

- [Top-Level Fields](#top-level-fields)
- [Section Structure](#section-structure)
- [Layout Schema](#layout-schema)
- [Style Schema](#style-schema)
- [Content Schemas by Section Type](#content-schemas-by-section-type)
- [Data Flow](#data-flow)
- [Validation Rules](#validation-rules)
- [Adding a New Section Type](#adding-a-new-section-type)

---

## Top-Level Fields

| Field      | Type     | Required | Default         | Description                                      |
|------------|----------|----------|-----------------|--------------------------------------------------|
| `spec`     | string   | Yes      | `"aisp-1.2"`    | Protocol version. Must be the literal `"aisp-1.2"`. |
| `page`     | string   | No       | `"index"`       | Page identifier (e.g., `"index"`, `"about"`).    |
| `version`  | string   | No       | `"1.0.0-RC1"`   | Config version for change tracking.              |
| `sections` | Section[] | No      | `[]`            | Ordered array of page sections.                  |

Example:

```json
{
  "spec": "aisp-1.2",
  "page": "index",
  "version": "1.0.0-RC1",
  "sections": []
}
```

---

## Section Structure

Every entry in the `sections` array follows this shape:

| Field     | Type    | Required | Default  | Description                                         |
|-----------|---------|----------|----------|-----------------------------------------------------|
| `type`    | enum    | Yes      | --       | One of: `hero`, `features`, `pricing`, `cta`, `footer`, `testimonials`, `faq`, `value_props`. |
| `id`      | string  | Yes      | --       | Unique section identifier (e.g., `"hero-01"`).      |
| `variant` | string  | No       | --       | Layout variant (e.g., `"centered"`, `"split"`).     |
| `layout`  | Layout  | Yes      | See below | Flexbox/grid layout configuration.                 |
| `content` | object  | No       | `{}`     | Section-specific content. Shape depends on `type`.  |
| `style`   | Style   | Yes      | See below | Visual styling properties.                         |
| `enabled` | boolean | No       | `true`   | Whether the section renders in the preview.         |

---

## Layout Schema

Controls how child elements are arranged within a section.

| Field       | Type   | Required | Default  | Values / Description                                |
|-------------|--------|----------|----------|-----------------------------------------------------|
| `display`   | enum   | No       | `"flex"` | `"flex"` or `"grid"`.                               |
| `direction` | enum   | No       | --       | `"row"` or `"column"`. Only applies when `display` is `"flex"`. |
| `align`     | enum   | No       | --       | `"center"`, `"start"`, `"end"`, `"stretch"`.        |
| `justify`   | enum   | No       | --       | `"center"`, `"start"`, `"end"`, `"between"`, `"around"`. |
| `gap`       | string | No       | `"24px"` | CSS gap value (e.g., `"32px"`, `"1rem"`).           |
| `padding`   | string | No       | `"64px"` | CSS padding value.                                  |
| `maxWidth`  | string | No       | --       | Max container width (e.g., `"1200px"`).             |
| `columns`   | number | No       | --       | Grid column count. Only applies when `display` is `"grid"`. |

Example:

```json
{
  "display": "grid",
  "columns": 3,
  "gap": "32px",
  "padding": "48px"
}
```

---

## Style Schema

Controls visual appearance of a section.

| Field          | Type   | Required | Default      | Description                            |
|----------------|--------|----------|--------------|----------------------------------------|
| `background`   | string | No       | `"#0a0a0f"`  | CSS background value (color, gradient). |
| `color`        | string | No       | `"#f8fafc"`  | Text color.                            |
| `fontFamily`   | string | No       | --           | Font family name (e.g., `"Inter"`).    |
| `borderRadius` | string | No       | --           | CSS border-radius value.               |

---

## Content Schemas by Section Type

The `content` field shape varies based on the section `type`.

### Hero

| Field          | Type   | Required | Description                                  |
|----------------|--------|----------|----------------------------------------------|
| `heading`      | object | No       | Main heading with `text`, `level`, `size`, `weight`. |
| `subheading`   | string | No       | Subtitle text beneath the heading.           |
| `cta`          | object | No       | Primary call-to-action with `text` and `url`. |
| `secondaryCta` | object | No       | Secondary CTA with `text` and `url`.         |
| `badge`        | object | No       | Announcement badge with `text` and `show`.   |
| `image`        | object | No       | Hero image with `url`, `alt`, and `show`.    |
| `trustBadges`  | object | No       | Trust indicator with `text` and `show`.      |

**heading** sub-fields:

| Field    | Type   | Default | Description         |
|----------|--------|---------|---------------------|
| `text`   | string | `"Ship Code at the Speed of Thought"` | Heading text. |
| `level`  | number | `1`     | HTML heading level (1-6). |
| `size`   | string | `"48px"` | CSS font size.     |
| `weight` | number | `700`   | CSS font weight.   |

**cta / secondaryCta** sub-fields:

| Field  | Type   | Description           |
|--------|--------|-----------------------|
| `text` | string | Button label text.    |
| `url`  | string | Link destination.     |

**badge / trustBadges** sub-fields:

| Field  | Type    | Description                        |
|--------|---------|------------------------------------|
| `text` | string  | Display text.                      |
| `show` | boolean | Whether to render this element.    |

**image** sub-fields:

| Field  | Type    | Description                        |
|--------|---------|------------------------------------|
| `url`  | string  | Image source URL.                  |
| `alt`  | string  | Alt text for accessibility.        |
| `show` | boolean | Whether to render the image.       |

Full hero content example:

```json
{
  "heading": {
    "text": "Ship Code at the Speed of Thought",
    "level": 1,
    "size": "48px",
    "weight": 700
  },
  "subheading": "Build AI-native experiences that transform how we create.",
  "cta": { "text": "Get Started", "url": "#pricing" },
  "secondaryCta": { "text": "View my work", "url": "#about" },
  "badge": { "text": "Hey Bradley 2.0 is Live", "show": true },
  "image": { "url": "", "alt": "", "show": false },
  "trustBadges": { "text": "Trusted by 214 institutions", "show": true }
}
```

### Features

| Field   | Type     | Required | Description                              |
|---------|----------|----------|------------------------------------------|
| `title` | string   | No       | Section heading (default: `"Features"`). |
| `items` | array    | No       | Array of feature items.                  |

Each **item** in `items`:

| Field         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| `id`          | string | Yes      | Unique item identifier.    |
| `icon`        | string | No       | Icon character or emoji.   |
| `title`       | string | Yes      | Feature title.             |
| `description` | string | No       | Feature description text.  |

Example:

```json
{
  "title": "Features",
  "items": [
    { "id": "f1", "icon": "\u26a1", "title": "Lightning Fast", "description": "Build and deploy in seconds, not days." }
  ]
}
```

### CTA (Call to Action)

| Field        | Type   | Required | Description                                  |
|--------------|--------|----------|----------------------------------------------|
| `heading`    | string | No       | CTA heading text.                            |
| `subheading` | string | No       | Supporting text beneath the heading.         |
| `button`     | object | Yes      | Button with `text` and `url`.                |

Example:

```json
{
  "heading": "Ready to build something amazing?",
  "subheading": "Start building your next project with Hey Bradley.",
  "button": { "text": "Launch Now", "url": "#signup" }
}
```

---

## Data Flow

```
User Input (JSON Editor / Form Panel)
        |
        v
   JSON Config (MasterConfig)
        |
        v
   Zod Validation (masterConfigSchema.parse)
        |
        v
   Zustand Config Store (useConfigStore)
        |
        v
   React Preview Renderer
```

1. **Input** -- The user edits JSON directly in the code editor or through form-based section panels.
2. **JSON** -- Changes produce a MasterConfig-shaped JSON object.
3. **Validation** -- Zod schemas validate structure and apply defaults for missing fields.
4. **Store** -- The validated config is held in a Zustand store with undo/redo history.
5. **Preview** -- React components read from the store and render the live page preview.

---

## Validation Rules

All validation is powered by Zod schemas defined in `src/lib/schemas/`.

| Schema               | File                          | Purpose                        |
|----------------------|-------------------------------|--------------------------------|
| `masterConfigSchema` | `schemas/masterConfig.ts`     | Top-level config validation.   |
| `sectionSchema`      | `schemas/section.ts`          | Individual section validation. |
| `layoutSchema`       | `schemas/layout.ts`           | Layout property validation.    |
| `styleSchema`        | `schemas/style.ts`            | Style property validation.     |
| `heroContentSchema`  | `schemas/section.ts`          | Hero content validation.       |
| `featuresContentSchema` | `schemas/section.ts`       | Features content validation.   |
| `ctaContentSchema`   | `schemas/section.ts`          | CTA content validation.        |

**What happens on invalid JSON:**

- If the JSON fails `masterConfigSchema.parse()`, Zod throws a `ZodError` with detailed path-level error messages.
- The config store does not accept invalid configs -- validation gates all updates.
- Missing optional fields are filled with schema defaults (e.g., `display` defaults to `"flex"`, `enabled` defaults to `true`).
- The `spec` field must be exactly `"aisp-1.2"` (a Zod literal). Any other value is rejected.

---

## Adding a New Section Type

Follow these steps to add a new section type (e.g., `testimonials`):

### Step 1: Add the type to the enum

In `src/lib/schemas/section.ts`, add the new type to `sectionTypeSchema`:

```ts
export const sectionTypeSchema = z.enum([
  'hero', 'features', 'pricing', 'cta', 'footer',
  'testimonials', 'faq', 'value_props',
  'your_new_type',  // <-- add here
])
```

### Step 2: Define the content schema

In the same file, create a Zod schema for the section content:

```ts
export const yourNewTypeContentSchema = z.object({
  title: z.string().default('Default Title'),
  // ... add fields specific to this section type
})
```

### Step 3: Export the schema

In `src/lib/schemas/index.ts`, add the export:

```ts
export { yourNewTypeContentSchema } from './section'
```

### Step 4: Create the renderer component

Create a React component in `src/components/preview/` that accepts the section data and renders it.

### Step 5: Register in the section renderer

Add a case for the new type in the section renderer switch/map so the preview knows how to render it.

### Step 6: Add a default section to the JSON

Optionally add a default instance to `src/data/default-config.json` in the `sections` array.

### Step 7: Write tests

Add tests in `tests/` to validate:
- The Zod schema accepts valid content and rejects invalid content.
- The renderer component renders correctly with default and custom data.
