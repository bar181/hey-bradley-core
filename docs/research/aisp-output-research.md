# AISP Output Research -- Phase 6

**Date:** 2026-04-02
**Purpose:** Define how to transform the MasterConfig JSON into two output formats -- a HUMAN-readable spec document and a machine-readable AISP Crystal Atom spec.

---

## 1. MasterConfig Structure Summary

The MasterConfig is a three-level hierarchy defined in `src/lib/schemas/masterConfig.ts`:

```
MasterConfig
  site        -- Level 1: global metadata (title, description, author, email, domain, project, version, spec)
  theme       -- Level 2: visual defaults (preset, mode, palette, typography, spacing, borderRadius)
  sections[]  -- Level 3: ordered array of section blocks
```

Each section (`src/lib/schemas/section.ts`) contains:

```
Section
  type        -- enum: hero|menu|columns|pricing|action|footer|quotes|questions|numbers|gallery|logos|team|image|divider|text
  id          -- unique identifier
  enabled     -- boolean visibility toggle
  order       -- optional sort index
  variant     -- optional variant name (e.g., "centered", "split")
  layout      -- display, direction, align, justify, gap, padding, maxWidth, columns
  content     -- flexible record (legacy content fields like heading, subheading)
  style       -- background, color, fontFamily, borderRadius
  components  -- array of Component objects (new structure)
```

Each Component:

```
Component
  id          -- identifier within the section (e.g., "headline", "primaryCta")
  type        -- component type (e.g., "text", "button", "image", "team-member")
  enabled     -- boolean
  order       -- sort index
  props       -- flexible key/value props (text, url, imageUrl, description, etc.)
```

---

## 2. HUMAN View -- Structured Markdown Spec Document

The HUMAN view renders MasterConfig as a clean, readable specification document that a client, developer, or project manager can review.

### Output Structure

```markdown
# [site.title] -- Website Specification
**Version:** [site.version]
**Spec:** [site.spec]
**Author:** [site.author]
**Contact:** [site.email]
**Domain:** [site.domain]

## Project Overview
[site.description]

## Design System

### Color Mode
[theme.mode] mode

### Color Palette
| Slot             | Value              |
|------------------|--------------------|
| Background       | [palette.bgPrimary]     |
| Surface          | [palette.bgSecondary]   |
| Text             | [palette.textPrimary]   |
| Text Secondary   | [palette.textSecondary] |
| Accent           | [palette.accentPrimary] |
| Accent Secondary | [palette.accentSecondary] |

### Typography
- **Font Family:** [typography.fontFamily]
- **Heading Family:** [typography.headingFamily]
- **Heading Weight:** [typography.headingWeight]
- **Base Size:** [typography.baseSize]
- **Line Height:** [typography.lineHeight]

### Spacing
- **Section Padding:** [spacing.sectionPadding]
- **Container Max Width:** [spacing.containerMaxWidth]
- **Component Gap:** [spacing.componentGap]
- **Border Radius:** [theme.borderRadius]

## Sections

### 1. [section.type] (ID: [section.id])
- **Status:** [enabled ? "Active" : "Hidden"]
- **Variant:** [section.variant ?? "default"]
- **Layout:** [layout.display], gap [layout.gap], padding [layout.padding]
- **Background:** [style.background]
- **Text Color:** [style.color]

#### Content
[For each component in components[]:
  - **[component.id]** ([component.type]): [component.props.text ?? component.props.name ?? ""]
    [If props.url: Link: [props.url]]
    [If props.imageUrl: Image: [props.imageUrl]]
    [If props.description: [props.description]]
]

[Repeat for each section]
```

### Field Mapping: MasterConfig to HUMAN View

| MasterConfig Path | HUMAN Output Location |
|---|---|
| `site.title` | Document title, H1 |
| `site.description` | Project Overview paragraph |
| `site.author` | Author field in header |
| `site.email` | Contact field in header |
| `site.domain` | Domain field in header |
| `site.version` | Version badge in header |
| `site.spec` | Spec version in header |
| `theme.mode` | Design System > Color Mode |
| `theme.palette.*` | Design System > Color Palette table |
| `theme.typography.*` | Design System > Typography list |
| `theme.spacing.*` | Design System > Spacing list |
| `theme.borderRadius` | Design System > Spacing list |
| `sections[n].type` | Section heading |
| `sections[n].enabled` | Status indicator |
| `sections[n].variant` | Variant label |
| `sections[n].layout.*` | Layout details |
| `sections[n].style.*` | Style details |
| `sections[n].components[m].id` | Component name |
| `sections[n].components[m].type` | Component type label |
| `sections[n].components[m].props.*` | Component content details |

---

## 3. AISP View -- @aisp Crystal Atom Format

The AISP view renders MasterConfig as a formal AISP 5.1 specification using Crystal Atom notation `⟦Ω, Σ, Γ, Λ, Ε⟧`.

### AISP Crystal Atom Structure

```
@aisp
⟦
  Ω := { Website specification: [site.title] }

  Σ := {
    Site : { title:𝕊, description:𝕊, author:𝕊, email:𝕊, domain:𝕊, version:𝕊, spec:𝕊 },
    Theme : { preset:𝕊, mode:𝕊∈{light,dark}, palette:Palette, typography:Typography, spacing:Spacing },
    Palette : { bgPrimary:𝕊, bgSecondary:𝕊, textPrimary:𝕊, textSecondary:𝕊, accentPrimary:𝕊, accentSecondary:𝕊 },
    Typography : { fontFamily:𝕊, headingFamily:𝕊, headingWeight:ℤ, baseSize:𝕊, lineHeight:ℝ },
    Spacing : { sectionPadding:𝕊, containerMaxWidth:𝕊, componentGap:𝕊 },
    Section : { type:SectionType, id:𝕊, enabled:𝔹, variant:𝕊, layout:Layout, style:Style, components:𝕃⟨Component⟩ },
    SectionType : 𝕊∈{hero,menu,columns,pricing,action,footer,quotes,questions,numbers,gallery,logos,team,image,divider,text},
    Layout : { display:𝕊∈{flex,grid}, gap:𝕊, padding:𝕊, columns:ℤ },
    Style : { background:𝕊, color:𝕊, fontFamily:𝕊, borderRadius:𝕊 },
    Component : { id:𝕊, type:𝕊, enabled:𝔹, order:ℤ, props:Record⟨𝕊,⊤⟩ }
  }

  Γ := {
    R1: ∀ s∈sections : s.type ∈ SectionType,
    R2: ∀ s∈sections : s.enabled = true ⟹ render(s),
    R3: ∀ s∈sections : s.style.background := theme.palette.bgPrimary IF ¬gradient(s.style.background),
    R4: ∀ c∈s.components : c.enabled = true ⟹ render(c),
    R5: sections.order ⟹ render_sequence(sections)
  }

  Λ := {
    site.title := "[site.title]",
    site.author := "[site.author]",
    site.domain := "[site.domain]",
    theme.mode := "[theme.mode]",
    theme.preset := "[theme.preset]",
    theme.palette.bgPrimary := "[palette.bgPrimary]",
    theme.palette.accentPrimary := "[palette.accentPrimary]",
    sections := 𝕃⟨[section summaries]⟩
  }

  Ε := {
    V1: VERIFY ∀ s∈sections : s.id is unique,
    V2: VERIFY site.spec = "aisp-1.2",
    V3: VERIFY |sections| >= 1,
    V4: VERIFY theme.palette ⊂ { bgPrimary, bgSecondary, textPrimary, textSecondary, accentPrimary, accentSecondary }
  }
⟧
```

### Field Mapping: MasterConfig to AISP

| MasterConfig Path | AISP Location |
|---|---|
| `site.*` | Λ (bindings) for values, Σ for type definition |
| `theme.mode` | Λ binding |
| `theme.palette.*` | Λ bindings, Σ Palette type |
| `theme.typography.*` | Σ Typography type |
| `theme.spacing.*` | Σ Spacing type |
| `sections[n].type` | Γ R1 (type validation), Σ SectionType enum |
| `sections[n].enabled` | Γ R2 (render rule) |
| `sections[n].id` | Ε V1 (uniqueness verification) |
| `sections[n].components[]` | Σ Component type, Γ R4 (render rule) |

---

## 4. Example Output: Bakery Website

### Source MasterConfig (abbreviated)

```json
{
  "site": {
    "title": "Golden Crust Bakery",
    "description": "Artisan breads and pastries baked fresh daily in Portland, Oregon.",
    "author": "Maria Santos",
    "email": "maria@goldencrust.com",
    "domain": "goldencrust.com",
    "project": "golden-crust-website",
    "version": "1.0.0",
    "spec": "aisp-1.2"
  },
  "theme": {
    "preset": "wellness",
    "mode": "light",
    "palette": {
      "bgPrimary": "#FFF8F0",
      "bgSecondary": "#F5E6D3",
      "textPrimary": "#2D1810",
      "textSecondary": "#6B4C3B",
      "accentPrimary": "#C45D2C",
      "accentSecondary": "#8B4513"
    },
    "typography": {
      "fontFamily": "Playfair Display",
      "headingFamily": "Playfair Display",
      "headingWeight": 700,
      "baseSize": "16px",
      "lineHeight": 1.7
    },
    "spacing": {
      "sectionPadding": "64px",
      "containerMaxWidth": "1280px",
      "componentGap": "24px"
    },
    "borderRadius": "12px"
  },
  "sections": [
    {
      "type": "hero",
      "id": "hero-bakery",
      "enabled": true,
      "variant": "centered",
      "layout": { "display": "flex", "gap": "24px", "padding": "64px" },
      "content": {},
      "style": { "background": "#FFF8F0", "color": "#2D1810" },
      "components": [
        { "id": "headline", "type": "text", "enabled": true, "order": 0, "props": { "text": "Baked with Love, Every Morning" } },
        { "id": "subtitle", "type": "text", "enabled": true, "order": 1, "props": { "text": "Artisan sourdough, croissants, and pastries made from locally sourced ingredients." } },
        { "id": "primaryCta", "type": "button", "enabled": true, "order": 2, "props": { "text": "View Our Menu", "url": "#menu" } }
      ]
    },
    {
      "type": "menu",
      "id": "menu-bakery",
      "enabled": true,
      "layout": { "display": "grid", "gap": "24px", "padding": "64px", "columns": 3 },
      "content": { "heading": "Our Menu", "subheading": "Fresh from the oven" },
      "style": { "background": "#F5E6D3", "color": "#2D1810" },
      "components": [
        { "id": "item-1", "type": "menu-item", "enabled": true, "order": 0, "props": { "title": "Sourdough Loaf", "description": "Traditional 24-hour ferment", "price": "$8" } },
        { "id": "item-2", "type": "menu-item", "enabled": true, "order": 1, "props": { "title": "Butter Croissant", "description": "French-style laminated dough", "price": "$4.50" } },
        { "id": "item-3", "type": "menu-item", "enabled": true, "order": 2, "props": { "title": "Cinnamon Roll", "description": "With cream cheese frosting", "price": "$5" } }
      ]
    },
    {
      "type": "action",
      "id": "cta-bakery",
      "enabled": true,
      "layout": { "display": "flex", "gap": "24px", "padding": "64px" },
      "content": {},
      "style": { "background": "#C45D2C", "color": "#FFF8F0" },
      "components": [
        { "id": "headline", "type": "text", "enabled": true, "order": 0, "props": { "text": "Order for Pickup" } },
        { "id": "primaryCta", "type": "button", "enabled": true, "order": 1, "props": { "text": "Place an Order", "url": "/order" } }
      ]
    },
    {
      "type": "footer",
      "id": "footer-bakery",
      "enabled": true,
      "layout": { "display": "flex", "gap": "24px", "padding": "48px" },
      "content": {},
      "style": { "background": "#2D1810", "color": "#F5E6D3" },
      "components": [
        { "id": "copyright", "type": "text", "enabled": true, "order": 0, "props": { "text": "2026 Golden Crust Bakery. All rights reserved." } }
      ]
    }
  ]
}
```

### HUMAN View Output

```markdown
# Golden Crust Bakery -- Website Specification

**Version:** 1.0.0
**Spec:** aisp-1.2
**Author:** Maria Santos
**Contact:** maria@goldencrust.com
**Domain:** goldencrust.com

## Project Overview

Artisan breads and pastries baked fresh daily in Portland, Oregon.

## Design System

### Color Mode
Light mode

### Color Palette
| Slot             | Value   |
|------------------|---------|
| Background       | #FFF8F0 |
| Surface          | #F5E6D3 |
| Text             | #2D1810 |
| Text Secondary   | #6B4C3B |
| Accent           | #C45D2C |
| Accent Secondary | #8B4513 |

### Typography
- **Font Family:** Playfair Display
- **Heading Weight:** 700
- **Base Size:** 16px
- **Line Height:** 1.7

### Spacing
- **Section Padding:** 64px
- **Container Max Width:** 1280px
- **Component Gap:** 24px
- **Border Radius:** 12px

## Sections

### 1. Hero (ID: hero-bakery)
- **Status:** Active
- **Variant:** centered
- **Layout:** flex, gap 24px, padding 64px

#### Components
- **headline** (text): "Baked with Love, Every Morning"
- **subtitle** (text): "Artisan sourdough, croissants, and pastries made from locally sourced ingredients."
- **primaryCta** (button): "View Our Menu" -> #menu

---

### 2. Menu (ID: menu-bakery)
- **Status:** Active
- **Heading:** Our Menu
- **Subheading:** Fresh from the oven
- **Layout:** grid, 3 columns, gap 24px, padding 64px

#### Components
- **item-1** (menu-item): Sourdough Loaf -- Traditional 24-hour ferment -- $8
- **item-2** (menu-item): Butter Croissant -- French-style laminated dough -- $4.50
- **item-3** (menu-item): Cinnamon Roll -- With cream cheese frosting -- $5

---

### 3. Action (ID: cta-bakery)
- **Status:** Active
- **Layout:** flex, gap 24px, padding 64px

#### Components
- **headline** (text): "Order for Pickup"
- **primaryCta** (button): "Place an Order" -> /order

---

### 4. Footer (ID: footer-bakery)
- **Status:** Active
- **Layout:** flex, gap 24px, padding 48px

#### Components
- **copyright** (text): "2026 Golden Crust Bakery. All rights reserved."
```

### AISP View Output

```
@aisp
⟦
  Ω := { Website specification: Golden Crust Bakery }

  Σ := {
    Site : { title:𝕊, description:𝕊, author:𝕊, email:𝕊, domain:𝕊, version:𝕊, spec:𝕊 },
    Theme : { preset:𝕊, mode:𝕊∈{light,dark}, palette:Palette, typography:Typography, spacing:Spacing },
    Palette : { bgPrimary:𝕊, bgSecondary:𝕊, textPrimary:𝕊, textSecondary:𝕊, accentPrimary:𝕊, accentSecondary:𝕊 },
    Section : { type:SectionType, id:𝕊, enabled:𝔹, variant:𝕊, layout:Layout, style:Style, components:𝕃⟨Component⟩ },
    SectionType : 𝕊∈{hero,menu,columns,pricing,action,footer,quotes,questions,numbers,gallery,logos,team,image,divider,text},
    Component : { id:𝕊, type:𝕊, enabled:𝔹, order:ℤ, props:Record⟨𝕊,⊤⟩ }
  }

  Γ := {
    R1: ∀ s∈sections : s.type ∈ SectionType,
    R2: ∀ s∈sections : s.enabled = true ⟹ render(s),
    R3: sections ⟹ render_sequence([hero-bakery, menu-bakery, cta-bakery, footer-bakery]),
    R4: ∀ c∈s.components : c.enabled = true ⟹ render(c),
    R5: theme.mode = "light" ⟹ apply_palette(light)
  }

  Λ := {
    site.title := "Golden Crust Bakery",
    site.description := "Artisan breads and pastries baked fresh daily in Portland, Oregon.",
    site.author := "Maria Santos",
    site.domain := "goldencrust.com",
    theme.mode := "light",
    theme.preset := "wellness",
    theme.palette.bgPrimary := "#FFF8F0",
    theme.palette.accentPrimary := "#C45D2C",
    theme.typography.fontFamily := "Playfair Display",
    sections := 𝕃⟨
      ⟨hero, "hero-bakery", "Baked with Love, Every Morning", cta:"View Our Menu"⟩,
      ⟨menu, "menu-bakery", heading:"Our Menu", items:3⟩,
      ⟨action, "cta-bakery", "Order for Pickup", cta:"Place an Order"⟩,
      ⟨footer, "footer-bakery", "2026 Golden Crust Bakery"⟩
    ⟩
  }

  Ε := {
    V1: VERIFY ∀ s∈sections : s.id is unique,
    V2: VERIFY site.spec = "aisp-1.2",
    V3: VERIFY |sections| = 4,
    V4: VERIFY theme.palette ⊂ { bgPrimary, bgSecondary, textPrimary, textSecondary, accentPrimary, accentSecondary }
  }
⟧
```

---

## 5. Implementation Notes

### Transformer Architecture

The output generation should be implemented as two pure functions:

```typescript
function configToHumanSpec(config: MasterConfig): string
function configToAispSpec(config: MasterConfig): string
```

Both functions take a `MasterConfig` and return a string. They should live in `src/lib/output/` with no side effects.

### XAI DOCS Tab Integration

The DOCS tab in the builder should have two sub-views:

1. **HUMAN** -- renders the markdown output, ideally with a markdown renderer for preview
2. **AISP** -- renders the Crystal Atom output with syntax highlighting for AISP symbols

Both views should update reactively when the config store changes. A "Copy to Clipboard" button should be provided for each view.

### Section Content Resolution

When generating output, the transformer must handle both content paths:

1. **Components path** (preferred): iterate `section.components[]` and extract props
2. **Legacy content path** (fallback): read directly from `section.content.*`

Use the existing `resolveHeroContent()` pattern from `section.ts` as a model for resolving content from either source.

### AISP Symbol Reference

| Symbol | Meaning | Usage in Output |
|--------|---------|-----------------|
| `⟦⟧` | Crystal Atom | Wraps entire spec |
| `Ω` | Objective | Top-level purpose statement |
| `Σ` | Types | Schema definitions |
| `Γ` | Rules | Rendering and validation rules |
| `Λ` | Bindings | Actual config values |
| `Ε` | Evidence | Verification criteria |
| `𝕊` | String type | Field type declarations |
| `𝔹` | Boolean type | Field type declarations |
| `ℤ` | Integer type | Field type declarations |
| `ℝ` | Real number type | Field type declarations |
| `𝕃` | List type | Array field declarations |
| `∀` | For all | Universal quantifier in rules |
| `⟹` | Implies | Conditional rules |
| `⊂` | Subset | Set membership checks |
| `⟨⟩` | Tuple | Inline data tuples |
