# JSON Template Guide

Step-by-step repeatable process for creating each JSON file type in Hey Bradley.

**Reference schemas:** `src/lib/schemas/masterConfig.ts`, `section.ts`, `layout.ts`, `style.ts`

---

## Theme JSON Template

### Full Example

```json
{
  "meta": {
    "name": "Theme Display Name",
    "slug": "theme-slug",
    "description": "One sentence describing ideal use case",
    "tags": ["dark", "centered", "gradient", "technical"],
    "mood": "Premium and technical",
    "heroVariant": "centered"
  },
  "theme": {
    "preset": "theme-slug",
    "mode": "dark",
    "palette": {
      "bgPrimary": "#0a0a1a",
      "bgSecondary": "#12122a",
      "textPrimary": "#f8fafc",
      "textSecondary": "#94a3b8",
      "accentPrimary": "#6366f1",
      "accentSecondary": "#818cf8"
    },
    "alternativePalettes": [
      {
        "name": "Palette Variant Name",
        "bgPrimary": "#0f172a",
        "bgSecondary": "#1e293b",
        "textPrimary": "#f1f5f9",
        "textSecondary": "#94a3b8",
        "accentPrimary": "#3b82f6",
        "accentSecondary": "#60a5fa"
      }
    ],
    "typography": {
      "fontFamily": "Inter",
      "headingFamily": "Inter",
      "headingWeight": 700,
      "baseSize": "16px",
      "lineHeight": 1.7
    },
    "spacing": {
      "sectionPadding": "80px",
      "containerMaxWidth": "1200px",
      "componentGap": "24px"
    },
    "borderRadius": "12px",
    "alternatePalette": {
      "bgPrimary": "#ffffff",
      "bgSecondary": "#f8fafc",
      "textPrimary": "#09090b",
      "textSecondary": "#71717a",
      "accentPrimary": "#6366f1",
      "accentSecondary": "#818cf8"
    }
  },
  "sections": [
    {
      "type": "menu",
      "id": "navbar-01",
      "enabled": true,
      "order": -1,
      "variant": "simple",
      "layout": { "display": "flex", "padding": "0" },
      "style": { "background": "#0a0a1a", "color": "#f8fafc" },
      "components": [
        {
          "id": "logo",
          "type": "text",
          "enabled": true,
          "order": 0,
          "props": { "text": "Site Name" }
        },
        {
          "id": "cta",
          "type": "button",
          "enabled": true,
          "order": 1,
          "props": { "text": "Get Started", "url": "#pricing" }
        }
      ]
    },
    {
      "type": "hero",
      "id": "hero-01",
      "enabled": true,
      "order": 0,
      "variant": "centered",
      "layout": {
        "display": "flex",
        "direction": "column",
        "align": "center",
        "gap": "24px",
        "padding": "80px 24px",
        "maxWidth": "1200px"
      },
      "style": {
        "background": "#0a0a1a",
        "color": "#f8fafc",
        "fontFamily": "Inter",
        "borderRadius": "0px"
      },
      "components": [
        {
          "id": "eyebrow",
          "type": "badge",
          "enabled": true,
          "order": 0,
          "props": { "text": "Badge Text", "icon": "sparkles", "variant": "pill" }
        },
        {
          "id": "headline",
          "type": "heading",
          "enabled": true,
          "order": 1,
          "props": { "text": "Main Headline", "level": 1, "size": "56px", "weight": 700 }
        },
        {
          "id": "subtitle",
          "type": "text",
          "enabled": true,
          "order": 2,
          "props": { "text": "Supporting subtitle text." }
        },
        {
          "id": "primaryCta",
          "type": "button",
          "enabled": true,
          "order": 3,
          "props": { "text": "Primary Action", "url": "#pricing", "style": "filled", "size": "lg" }
        },
        {
          "id": "secondaryCta",
          "type": "button",
          "enabled": true,
          "order": 4,
          "props": { "text": "Secondary Action", "url": "#about", "style": "outline", "size": "lg" }
        },
        {
          "id": "heroImage",
          "type": "image",
          "enabled": false,
          "order": 5,
          "props": {}
        },
        {
          "id": "backgroundImage",
          "type": "image",
          "enabled": false,
          "order": 6,
          "props": {}
        },
        {
          "id": "heroVideo",
          "type": "video",
          "enabled": false,
          "order": 7,
          "props": {}
        },
        {
          "id": "trustBadges",
          "type": "trust",
          "enabled": true,
          "order": 8,
          "props": { "text": "Trusted by 500+ teams worldwide", "show": true }
        }
      ]
    }
  ]
}
```

### Schema Reference

| Field | Schema | Location |
|-------|--------|----------|
| `meta` | `themeMetaSchema` | `src/lib/schemas/masterConfig.ts` |
| `meta.slug` | `z.string()` | Must match filename (e.g., `saas.json` has slug `"saas"`) |
| `theme` | `themeSchema` | `src/lib/schemas/masterConfig.ts` |
| `theme.palette` | `paletteSchema` (6-slot, ADR-019) | `src/lib/schemas/masterConfig.ts` |
| `theme.alternativePalettes[]` | `alternativePaletteSchema` | `src/lib/schemas/masterConfig.ts` |
| `theme.typography` | `themeTypographySchema` | `src/lib/schemas/masterConfig.ts` |
| `theme.spacing` | `themeSpacingSchema` | `src/lib/schemas/masterConfig.ts` |
| `sections[]` | `sectionSchema` | `src/lib/schemas/section.ts` |
| `sections[].components[]` | `componentSchema` | `src/lib/schemas/section.ts` |

### Step-by-Step Creation Process

1. **Pick a slug.** Kebab-case, one word preferred. This becomes the filename and `meta.slug`.
2. **Define meta.** Name (display), description (one sentence), tags (4-6 keywords), mood (2-3 words), heroVariant (which hero layout suits this theme).
3. **Design the palette.** Start with `bgPrimary`. Build outward: bgSecondary slightly lighter/darker, textPrimary high contrast, textSecondary muted, accentPrimary brand color, accentSecondary lighter variant of accent.
4. **Add alternativePalettes.** Minimum 2, maximum 4. Each must have a `name` field. Provide variety: different hue, monochrome option, complementary color.
5. **Set typography.** Choose `fontFamily` from Google Fonts. `headingFamily` can differ. Weight 700 for headings is standard. Base size 16px, line height 1.6-1.8.
6. **Set spacing.** Section padding 64-96px. Container max width 1100-1400px. Component gap 20-32px.
7. **Build sections array.** Every theme needs at minimum: menu, hero. Additional sections (columns, pricing, action, quotes, questions, numbers, footer) should have `enabled: false` with placeholder content so users can toggle them on.
8. **Build alternatePalette.** This is the light/dark mode inverse. If theme mode is dark, alternatePalette should be light colors and vice versa.
9. **Validate.** Run through `themeMetaSchema` for meta, `themeSchema` for theme, `sectionSchema` for each section.
10. **Register.** Add the import to `src/data/themes/index.ts`.

### Common Mistakes to Avoid

- **Missing `alternatePalette`.** Required for mode toggle. Omitting it breaks the light/dark switch.
- **Palette colors without `#` prefix.** All 6 palette slots must be hex strings starting with `#`.
- **`meta.slug` not matching filename.** `saas.json` must have `"slug": "saas"`.
- **Sections without `id`.** Every section needs a unique `id` string (e.g., `"hero-01"`).
- **Components without `order`.** Components render in `order` sequence. Missing order causes unpredictable layout.
- **Forgetting disabled sections.** Themes should include all section types with `"enabled": false` so users can activate them.
- **`heroVariant` not matching any section variant.** The hero section's `variant` must match one the renderer supports: `centered`, `split`, `overlay`, `minimal`.

---

## Example JSON Template

### Full Example (with multiple section types populated)

```json
{
  "site": {
    "title": "Business Name",
    "description": "One-sentence business description",
    "author": "Business Name",
    "email": "hello@example.com",
    "domain": "example.com",
    "project": "business-slug",
    "version": "1.0.0-RC1",
    "spec": "aisp-1.2"
  },
  "theme": {
    "preset": "wellness",
    "mode": "dark",
    "palette": {
      "bgPrimary": "#0a1a14",
      "bgSecondary": "#132a1f",
      "textPrimary": "#f0fdf4",
      "textSecondary": "#bbf7d0",
      "accentPrimary": "#22c55e",
      "accentSecondary": "#4ade80"
    },
    "alternatePalette": {
      "bgPrimary": "#ffffff",
      "bgSecondary": "#f0fdf4",
      "textPrimary": "#09090b",
      "textSecondary": "#6b7280",
      "accentPrimary": "#22c55e",
      "accentSecondary": "#4ade80"
    },
    "typography": {
      "fontFamily": "Georgia",
      "headingFamily": "Georgia",
      "headingWeight": 700,
      "baseSize": "16px",
      "lineHeight": 1.7
    },
    "spacing": {
      "sectionPadding": "80px",
      "containerMaxWidth": "1200px",
      "componentGap": "24px"
    },
    "borderRadius": "16px"
  },
  "sections": [
    {
      "type": "menu",
      "id": "navbar-01",
      "enabled": true,
      "order": -1,
      "variant": "simple",
      "layout": { "display": "flex", "padding": "0" },
      "style": { "background": "#0a1a14", "color": "#f0fdf4" },
      "components": [
        { "id": "logo", "type": "text", "enabled": true, "order": 0, "props": { "text": "Business Name" } },
        { "id": "cta", "type": "button", "enabled": true, "order": 1, "props": { "text": "Order Now", "url": "#cta" } }
      ]
    },
    {
      "type": "hero",
      "id": "hero-01",
      "enabled": true,
      "order": 0,
      "variant": "overlay",
      "layout": { "display": "flex", "direction": "column", "align": "center", "gap": "24px", "padding": "80px 24px", "maxWidth": "1200px" },
      "style": { "background": "#0a1a14", "color": "#f0fdf4", "fontFamily": "Georgia", "borderRadius": "0px" },
      "components": [
        { "id": "eyebrow", "type": "badge", "enabled": true, "order": 0, "props": { "text": "Tagline Badge", "icon": "sparkles", "variant": "pill" } },
        { "id": "headline", "type": "heading", "enabled": true, "order": 1, "props": { "text": "Main Hero Headline", "level": 1, "size": "56px", "weight": 700 } },
        { "id": "subtitle", "type": "text", "enabled": true, "order": 2, "props": { "text": "Detailed subtitle paragraph describing the business value." } },
        { "id": "primaryCta", "type": "button", "enabled": true, "order": 3, "props": { "text": "Primary CTA", "url": "#features", "style": "filled", "size": "lg" } },
        { "id": "secondaryCta", "type": "button", "enabled": true, "order": 4, "props": { "text": "Secondary CTA", "url": "#cta", "style": "outline", "size": "lg" } },
        { "id": "heroImage", "type": "image", "enabled": false, "order": 5, "props": {} },
        { "id": "backgroundImage", "type": "image", "enabled": true, "order": 6, "props": { "url": "https://images.unsplash.com/photo-EXAMPLE", "alt": "Descriptive alt text", "aspect": "16:9" } },
        { "id": "heroVideo", "type": "video", "enabled": false, "order": 7, "props": {} },
        { "id": "trustBadges", "type": "trust", "enabled": true, "order": 8, "props": { "text": "Social proof statement", "show": true } }
      ]
    },
    {
      "type": "columns",
      "id": "features-01",
      "enabled": true,
      "order": 1,
      "variant": "image-cards",
      "layout": { "display": "grid", "columns": 3, "gap": "32px", "padding": "64px 24px" },
      "style": { "background": "#132a1f", "color": "#f0fdf4" },
      "components": [
        { "id": "f1", "type": "feature-card", "enabled": true, "order": 0, "props": { "icon": "icon-name", "title": "Feature One", "description": "Feature description.", "image": "https://...", "imageAlt": "Alt text" } },
        { "id": "f2", "type": "feature-card", "enabled": true, "order": 1, "props": { "icon": "icon-name", "title": "Feature Two", "description": "Feature description.", "image": "https://...", "imageAlt": "Alt text" } },
        { "id": "f3", "type": "feature-card", "enabled": true, "order": 2, "props": { "icon": "icon-name", "title": "Feature Three", "description": "Feature description.", "image": "https://...", "imageAlt": "Alt text" } }
      ],
      "content": { "heading": "Section Heading", "subheading": "Section subheading" }
    },
    {
      "type": "quotes",
      "id": "testimonials-01",
      "enabled": true,
      "order": 2,
      "variant": "cards",
      "layout": { "display": "grid", "columns": 3, "gap": "24px", "padding": "64px 24px" },
      "style": { "background": "#0a1a14", "color": "#f0fdf4" },
      "components": [
        { "id": "t-1", "type": "testimonial", "enabled": true, "order": 0, "props": { "quote": "Testimonial text.", "author": "Author Name", "role": "Title, Company", "rating": 5 } }
      ],
      "content": { "heading": "Testimonials Heading", "subheading": "Testimonials subheading" }
    },
    {
      "type": "numbers",
      "id": "numbers-01",
      "enabled": true,
      "order": 3,
      "variant": "counters",
      "layout": { "display": "grid", "columns": 4, "gap": "32px", "padding": "64px 24px" },
      "style": { "background": "#0a1a14", "color": "#f0fdf4" },
      "components": [
        { "id": "n-1", "type": "value-prop", "enabled": true, "order": 0, "props": { "value": "2,000+", "label": "Metric Label", "description": "Metric context" } }
      ],
      "content": { "heading": "Numbers Heading", "subheading": "Numbers subheading" }
    },
    {
      "type": "footer",
      "id": "footer-01",
      "enabled": true,
      "order": 4,
      "variant": "multi-column",
      "layout": { "display": "grid", "columns": 4, "gap": "32px", "padding": "48px 24px" },
      "style": { "background": "#0a1a14", "color": "#f0fdf4" },
      "components": [
        { "id": "brand", "type": "footer-brand", "enabled": true, "order": 0, "props": { "text": "Business Name" } },
        { "id": "col-1", "type": "footer-column", "enabled": true, "order": 1, "props": { "heading": "Column 1", "links": "Link1,Link2,Link3" } },
        { "id": "copyright", "type": "footer-copyright", "enabled": true, "order": 4, "props": { "text": "c 2026 Business Name. All rights reserved." } }
      ]
    }
  ]
}
```

### How to Add a New Example

1. **Choose the business type.** Pick something not already covered by existing examples.
2. **Copy the template above** into a new file at `src/data/examples/<slug>.json`.
3. **Fill in `site` metadata.** Title, description, author, email, domain, project slug.
4. **Choose a theme preset.** Set `theme.preset` to one of the existing theme slugs (saas, wellness, portfolio, etc.). Copy that theme's palette, typography, and spacing.
5. **Customize section content.** Replace all placeholder text with business-specific copy. Use real Unsplash image URLs (append `?w=600&auto=format&q=80`).
6. **Enable relevant sections.** Not every example needs all section types. Enable the ones that make sense for the business type.
7. **Validate.** The entire file must pass `masterConfigSchema` from `src/lib/schemas/masterConfig.ts`.
8. **Register.** Add the import to `src/data/examples/index.ts`.

### Required vs Optional Fields

**Required in `site`:**
- `title` (string) -- business name
- `description` (string) -- one-sentence description
- `project` (string) -- slug identifier
- `version` (string, default `"1.0.0-RC1"`)
- `spec` (literal `"aisp-1.2"`)

**Optional in `site`:**
- `author`, `email`, `domain` -- all strings, default to empty
- `favicon`, `ogImage` -- string URLs, optional

**Required in each section:**
- `type` -- one of the 15 section type enum values
- `id` -- unique string identifier
- `layout` -- object with at minimum `display`
- `style` -- object with at minimum `background`, `color`

**Optional in each section:**
- `enabled` -- boolean, defaults to `true`
- `order` -- number, determines render sequence
- `variant` -- string, selects visual variant
- `content` -- record, legacy structure (use `components[]` instead)
- `components[]` -- array of component objects (preferred structure)

**Required in each component:**
- `id` -- unique within parent section
- `type` -- component type string

**Optional in each component:**
- `enabled` -- boolean, defaults to `true`
- `order` -- number, defaults to `0`
- `props` -- record of key-value pairs, defaults to `{}`

---

## AISP Crystal Atom Template

### Complete Platinum-Tier Section-Level Atom Example

The following is a complete Crystal Atom for the `hero` section type. Every component (Omega, Sigma, Gamma, Lambda, Epsilon) is shown with explanations.

```
hero.atom@1.0.0
gamma := aisp.section.hero
rho := <Omega, Sigma, Gamma, Lambda, Epsilon>
|-ND ^ CAT ^ PI-SIGMA ^ mu

;; --- Omega: FOUNDATION ---
[[Omega:Foundation]]{
  A := {T, F, ^, v, not, ->, <->, forall, exists, exists!, lambda, PI, SIGMA, :=, ==, =/=, in, notin, subset, union, intersect, compose, <>, [[]], |- , |=, |->}
  forall D in AISP: Ambig(D) < 0.02
  Ambig := lambda D. 1 - |Parse_u(D)| / |Parse_t(D)|
}

;; --- Sigma: TYPE DECLARATIONS ---
[[Sigma:Types]]{
  HeroVariant := enum{"centered", "split", "overlay", "minimal"}
  HeroSection := Record{
    type: Literal("hero"),
    id: String,
    enabled: Bool := true,
    order: Nat := 0,
    variant: HeroVariant,
    layout: LayoutSchema,
    style: StyleSchema,
    components: List<HeroComponent>
  }
  HeroComponent := Sum{
    Badge{id: String, type: Literal("badge"), props: {text: String, icon: String, variant: String}},
    Heading{id: String, type: Literal("heading"), props: {text: String, level: Fin(6), size: String, weight: Nat}},
    Text{id: String, type: Literal("text"), props: {text: String}},
    Button{id: String, type: Literal("button"), props: {text: String, url: String, style: String, size: String}},
    Image{id: String, type: Literal("image"), props: {url: String, alt: String, aspect: String}},
    Video{id: String, type: Literal("video"), props: {url: String, autoplay: Bool}},
    Trust{id: String, type: Literal("trust"), props: {text: String, show: Bool}}
  }
  LayoutSchema := Record{display: String, direction: String?, align: String?, gap: String?, padding: String, maxWidth: String?}
  StyleSchema := Record{background: String, color: String, fontFamily: String?, borderRadius: String?}
}

;; --- Gamma: STRUCTURAL RULES ---
[[Gamma:Rules]]{
  ;; Component existence rules
  forall h: HeroSection. exists! c in h.components: c.type == "heading"
  forall h: HeroSection. |{c in h.components | c.type == "heading"}| == 1
  forall h: HeroSection. |{c in h.components | c.type == "button"}| >= 1

  ;; Ordering rules
  forall h: HeroSection. forall c1, c2 in h.components:
    c1.order < c2.order -> render_before(c1, c2)

  ;; Variant constraints
  h.variant == "overlay" -> exists c in h.components: c.id == "backgroundImage" ^ c.enabled == true
  h.variant == "centered" -> h.layout.align == "center"
  h.variant == "split" -> h.layout.display == "grid"

  ;; ID uniqueness
  forall h: HeroSection. forall c1, c2 in h.components:
    c1 =/= c2 -> c1.id =/= c2.id

  ;; Type literal constraint
  forall h: HeroSection. h.type == "hero"
}

;; --- Lambda: CORE FUNCTIONS ---
[[Lambda:Core]]{
  validate: HeroSection -> Validation
  validate := lambda h.
    let type_ok = h.type == "hero" in
    let has_heading = exists c in h.components: c.type == "heading" in
    let has_cta = exists c in h.components: c.type == "button" in
    let ids_unique = |h.components| == |{c.id | c in h.components}| in
    let ordered = is_sorted(map(lambda c. c.order, h.components)) in
    (type_ok ^ has_heading ^ has_cta ^ ids_unique ^ ordered)

  resolve_content: HeroSection -> HeroContent
  resolve_content := lambda h.
    |h.components| > 0
      -> components_to_hero_content(h.components)
      |  h.content as HeroContent

  components_to_hero_content: List<HeroComponent> -> HeroContent
  components_to_hero_content := lambda cs.
    let find = lambda id. head({c | c in cs, c.id == id}) in
    Record{
      heading: find("headline").props,
      subheading: find("subtitle").props.text,
      cta: find("primaryCta").props,
      badge: find("eyebrow")?.props,
      image: find("heroImage")?.props,
      trustBadges: find("trustBadges")?.props
    }
}

;; --- Epsilon: EVIDENCE ---
[[Epsilon:Evidence]]{
  ;; Proof that validate catches all required constraints
  Theorem validate_sound:
    forall h: HeroSection. validate(h) == true
      -> h.type == "hero"
       ^ (exists c in h.components: c.type == "heading")
       ^ (exists c in h.components: c.type == "button")
       ^ (forall c1 c2 in h.components: c1 =/= c2 -> c1.id =/= c2.id)
  Proof: By case analysis on validate definition. QED.

  ;; Evidence of tier qualification
  density(hero.atom) >= 0.75
  tier(hero.atom) == Platinum
  Ambig(hero.atom) < 0.02
}
```

### Component Reference

| Block | Symbol | Purpose |
|-------|--------|---------|
| **Omega** | `[[Omega:Foundation]]` | Metalogic: symbol alphabet, ambiguity function, document structure |
| **Sigma** | `[[Sigma:Types]]` | Type declarations: enums, records, sum types, dependent types |
| **Gamma** | `[[Gamma:Rules]]` | Structural rules: existence, uniqueness, ordering, variant constraints |
| **Lambda** | `[[Lambda:Core]]` | Functions: validation, resolution, transformation |
| **Epsilon** | `[[Epsilon:Evidence]]` | Proofs: soundness theorems, tier evidence, ambiguity measurement |

### Symbol Reference Table

| Symbol | Name | Meaning |
|--------|------|---------|
| `forall` | Universal quantifier | "for all" -- every element satisfies the property |
| `exists` | Existential quantifier | "there exists" -- at least one element satisfies |
| `exists!` | Unique existence | "there exists exactly one" |
| `in` | Membership | Element belongs to a set or collection |
| `notin` | Non-membership | Element does not belong |
| `subset` | Subset | One set contained within another |
| `union` | Union | Combined elements of two sets |
| `intersect` | Intersection | Common elements of two sets |
| `:=` | Definition | Assigns a definition to a name |
| `==` | Equality | Structural or value equality |
| `=/=` | Inequality | Not equal |
| `->` | Implication / Function | "implies" or function type arrow |
| `<->` | Biconditional | "if and only if" |
| `\|->` | Maps to | Function mapping |
| `\|-` | Proves | Syntactic derivability |
| `\|=` | Models | Semantic entailment |
| `lambda` | Lambda | Anonymous function constructor |
| `PI` | Dependent product | Universal dependent type |
| `SIGMA` | Dependent sum | Existential dependent type |
| `T` | Top / True | Truth, success, valid |
| `F` | Bottom / False | Falsity, failure, crash |
| `^` | Conjunction | Logical AND |
| `v` | Disjunction | Logical OR |
| `not` | Negation | Logical NOT |
| `compose` | Composition | Function composition |
| `QED` | Proof complete | Marks end of a proof |

### How to Validate

```bash
# Validate syntax and structure
aisp_validate <atom-content>

# Check tier classification (target: Platinum / diamond-plus-plus)
aisp_tier <atom-content>
```

**Validation rules:**
1. Must have all 5 blocks: Omega, Sigma, Gamma, Lambda, Epsilon
2. Every type referenced in Gamma must be declared in Sigma
3. Every function in Lambda must have a type signature
4. Epsilon must contain at least one theorem with proof
5. Zero English prose inside block bodies (comments with `;;` are allowed)
6. Ambiguity score must be <2% (0.02)

**Target:** Every atom must achieve `Platinum` tier (diamond-plus-plus, density >= 0.75).

---

## Spec Generator Template

### Overview

Hey Bradley has 6 spec generators. Each produces a markdown document from a JSON template file. The template defines the document structure; the generator fills in project-specific content.

### Template JSON Structure

Each template in `src/data/templates/` follows this shape:

```json
{
  "_meta": {
    "name": "Template Display Name",
    "generator": "generator-function-name",
    "version": "1.0.0",
    "description": "What this spec document covers"
  },
  "sections": [
    {
      "id": "intro",
      "type": "intro",
      "heading": "# Document Title",
      "required": true,
      "fields": [
        { "key": "projectName", "type": "string", "required": true },
        { "key": "date", "type": "date", "required": true },
        { "key": "version", "type": "string", "required": false, "default": "1.0.0" }
      ],
      "template": "# {{projectName}}\n\n**Date:** {{date}} | **Version:** {{version}}\n\n---"
    },
    {
      "id": "body",
      "type": "body",
      "heading": "## Main Content",
      "required": true,
      "subsections": [
        {
          "id": "overview",
          "heading": "### Overview",
          "fields": [
            { "key": "summary", "type": "text", "required": true }
          ],
          "template": "### Overview\n\n{{summary}}"
        }
      ]
    },
    {
      "id": "appendix",
      "type": "appendix",
      "heading": "## Appendix",
      "required": false,
      "fields": [
        { "key": "references", "type": "list", "required": false }
      ]
    }
  ],
  "formatting": {
    "headingStyle": "atx",
    "listStyle": "dash",
    "codeBlockStyle": "fenced",
    "lineWidth": 80,
    "sectionSeparator": "\n---\n"
  }
}
```

### The 6 Generators

#### 1. North Star (`north-star.json`)

**Purpose:** High-level product vision and strategy document.

**Required sections:**
- Intro: project name, vision statement, date
- Body: product goals, target audience, success metrics, competitive landscape
- Appendix: references, prior art

**Markdown conventions:** H1 for title, H2 for major sections, H3 for subsections. Bold for key terms. Tables for metrics.

#### 2. SADD (`sadd.json`)

**Purpose:** Software Architecture and Design Document.

**Required sections:**
- Intro: project name, architecture overview, tech stack
- Body: system components, data flow, API contracts, deployment
- Appendix: ADR references, dependency list

**Markdown conventions:** H1 for title, H2 for architecture layers. Code blocks for API examples. Mermaid diagrams where supported.

#### 3. Build Plan (`build-plan.json`)

**Purpose:** Sprint-by-sprint implementation plan.

**Required sections:**
- Intro: project name, timeline, team
- Body: phases, sprints, tasks with estimates, dependencies
- Appendix: risk matrix, resource allocation

**Markdown conventions:** H1 for title, H2 per phase, H3 per sprint. Task lists with checkboxes. Tables for estimates.

#### 4. Features (`features.json`)

**Purpose:** Feature catalog with acceptance criteria.

**Required sections:**
- Intro: product name, feature summary
- Body: feature list with descriptions, priority, acceptance criteria, user stories
- Appendix: deferred features, future considerations

**Markdown conventions:** H1 for title, H2 per feature category, H3 per feature. Bold for priority labels. Blockquotes for user stories.

#### 5. Human Spec (`human-spec.json`)

**Purpose:** Plain-language specification for non-technical stakeholders.

**Required sections:**
- Intro: project name, purpose, audience
- Body: what it does (plain language), how it works (simplified), what the user sees
- Appendix: glossary, FAQ

**Markdown conventions:** H1 for title, H2 for major topics. No code blocks. Short paragraphs. Bullet lists for features.

#### 6. AISP Spec (`aisp-spec.json`)

**Purpose:** Formal AISP specification for AI-to-AI communication.

**Required sections:**
- Intro: AISP header (version, gamma, rho)
- Body: Omega (foundation), Sigma (types), Gamma (rules), Lambda (functions), Epsilon (evidence)
- No appendix (the AISP format is self-contained)

**Markdown conventions:** Code blocks for AISP notation. No prose inside AISP blocks. Symbol table as reference.

### Required Sections for All Templates

Every template must include:

1. **Intro section** (`type: "intro"`) -- title, metadata, context
2. **Body section** (`type: "body"`) -- the substantive content
3. **Appendix section** (`type: "appendix"`) -- optional but must be declared

The `formatting` object controls output style and is shared across all templates to ensure visual consistency.
