# JSON Template Guide

Step-by-step repeatable process for creating each JSON file type in Hey Bradley.

**Reference schemas:** `src/lib/schemas/masterConfig.ts`, `section.ts`, `layout.ts`, `style.ts`

---

## Theme JSON Template

### Full Example

See `src/data/themes/saas.json` for the canonical reference. A theme file has three top-level keys:

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
      "bgPrimary": "#0a0a1a", "bgSecondary": "#12122a",
      "textPrimary": "#f8fafc", "textSecondary": "#94a3b8",
      "accentPrimary": "#6366f1", "accentSecondary": "#818cf8"
    },
    "alternativePalettes": [
      { "name": "Blue Steel", "bgPrimary": "#0f172a", "bgSecondary": "#1e293b",
        "textPrimary": "#f1f5f9", "textSecondary": "#94a3b8",
        "accentPrimary": "#3b82f6", "accentSecondary": "#60a5fa" }
    ],
    "typography": { "fontFamily": "Inter", "headingFamily": "Inter",
      "headingWeight": 700, "baseSize": "16px", "lineHeight": 1.7 },
    "spacing": { "sectionPadding": "80px", "containerMaxWidth": "1200px",
      "componentGap": "24px" },
    "borderRadius": "12px",
    "alternatePalette": {
      "bgPrimary": "#ffffff", "bgSecondary": "#f8fafc",
      "textPrimary": "#09090b", "textSecondary": "#71717a",
      "accentPrimary": "#6366f1", "accentSecondary": "#818cf8"
    }
  },
  "sections": [
    { "type": "menu", "id": "navbar-01", "enabled": true, "order": -1,
      "variant": "simple",
      "layout": { "display": "flex", "padding": "0" },
      "style": { "background": "#0a0a1a", "color": "#f8fafc" },
      "components": [
        { "id": "logo", "type": "text", "enabled": true, "order": 0,
          "props": { "text": "Site Name" } },
        { "id": "cta", "type": "button", "enabled": true, "order": 1,
          "props": { "text": "Get Started", "url": "#pricing" } }
      ] },
    { "type": "hero", "id": "hero-01", "enabled": true, "order": 0,
      "variant": "centered", "...": "see saas.json for full hero components" },
    { "type": "columns", "id": "features-01", "enabled": false, "order": 1,
      "variant": "grid-3col", "...": "disabled sections available to toggle on" }
  ]
}
```

### Schema Reference

| Field | Schema | Source File |
|-------|--------|-------------|
| `meta` | `themeMetaSchema` | `masterConfig.ts` |
| `theme` | `themeSchema` | `masterConfig.ts` |
| `theme.palette` | `paletteSchema` (6-slot, ADR-019) | `masterConfig.ts` |
| `theme.alternativePalettes[]` | `alternativePaletteSchema` | `masterConfig.ts` |
| `theme.typography` | `themeTypographySchema` | `masterConfig.ts` |
| `theme.spacing` | `themeSpacingSchema` | `masterConfig.ts` |
| `sections[]` | `sectionSchema` | `section.ts` |
| `sections[].components[]` | `componentSchema` | `section.ts` |

### Step-by-Step Creation

1. **Pick a slug.** Kebab-case, one word preferred. Becomes filename and `meta.slug`.
2. **Define meta.** Name, description, tags (4-6), mood (2-3 words), heroVariant.
3. **Design palette.** Start with bgPrimary; build: bgSecondary lighter/darker, text high contrast, accent brand color.
4. **Add alternativePalettes.** 2-4 variants, each with a `name`. Provide variety.
5. **Set typography.** Google Fonts family. Weight 700. Base 16px. Line height 1.6-1.8.
6. **Set spacing.** Section padding 64-96px. Container 1100-1400px. Gap 20-32px.
7. **Build sections.** Minimum: menu + hero. All other types with `enabled: false`.
8. **Build alternatePalette.** Light/dark mode inverse.
9. **Validate.** Parse through `themeMetaSchema`, `themeSchema`, `sectionSchema`.
10. **Register.** Add import to `src/data/themes/index.ts`.

### Common Mistakes

- Missing `alternatePalette` -- breaks light/dark toggle
- Palette colors without `#` prefix -- must be hex strings
- `meta.slug` not matching filename -- `saas.json` needs `"slug": "saas"`
- Sections without unique `id` -- every section needs one (e.g., `"hero-01"`)
- Missing `order` on components -- causes unpredictable render sequence
- No disabled sections -- themes should include all types with `enabled: false`
- `heroVariant` mismatch -- must be one of: `centered`, `split`, `overlay`, `minimal`

---

## Example JSON Template

### Structure

See `src/data/examples/bakery.json` for the canonical reference. Examples have `site` + `theme` + `sections`:

```json
{
  "site": {
    "title": "Sweet Spot Bakery",
    "description": "Artisan bakery serving handcrafted pastries",
    "author": "Sweet Spot Bakery",
    "email": "hello@sweetspotbakery.com",
    "domain": "sweetspotbakery.com",
    "project": "sweet-spot-bakery",
    "version": "1.0.0-RC1",
    "spec": "aisp-1.2"
  },
  "theme": { "preset": "wellness", "mode": "dark", "palette": { "...": "6-slot" },
    "alternatePalette": { "...": "6-slot inverse" },
    "typography": { "...": "font config" },
    "spacing": { "...": "spacing config" }, "borderRadius": "16px" },
  "sections": [
    { "type": "menu", "id": "navbar-01", "...": "nav components" },
    { "type": "hero", "id": "hero-01", "...": "hero components" },
    { "type": "columns", "id": "features-01", "...": "feature cards with images" },
    { "type": "quotes", "id": "testimonials-01", "...": "testimonial cards" },
    { "type": "numbers", "id": "numbers-01", "...": "value-prop counters" },
    { "type": "footer", "id": "footer-01", "...": "footer columns" }
  ]
}
```

### How to Add a New Example

1. Choose a business type not already covered.
2. Copy skeleton from above into `src/data/examples/<slug>.json`.
3. Fill `site` metadata: title, description, project slug.
4. Set `theme.preset` to an existing theme slug. Copy that theme's palette/typography.
5. Customize section content with business-specific copy. Use Unsplash URLs.
6. Enable sections relevant to the business; disable others.
7. Validate against `masterConfigSchema`.
8. Register in `src/data/examples/index.ts`.

### Required vs Optional Fields

**Site (required):** `title`, `description`, `project`, `version` ("1.0.0-RC1"), `spec` ("aisp-1.2")
**Site (optional):** `author`, `email`, `domain`, `favicon`, `ogImage`

**Section (required):** `type` (enum of 15 types), `id` (unique string), `layout` (has `display`), `style` (has `background`, `color`)
**Section (optional):** `enabled` (default true), `order`, `variant`, `content`, `components[]`

**Component (required):** `id` (unique within section), `type` (string)
**Component (optional):** `enabled` (default true), `order` (default 0), `props` (default `{}`)

---

## AISP Crystal Atom Template

### Complete Platinum-Tier Section-Level Atom

```
hero.atom@1.0.0
gamma := aisp.section.hero
rho := <Omega, Sigma, Gamma, Lambda, Epsilon>
|-ND ^ CAT ^ PI-SIGMA ^ mu

;; --- Omega: FOUNDATION ---
[[Omega:Foundation]]{
  A := {T, F, ^, v, not, ->, <->, forall, exists, exists!, lambda,
        PI, SIGMA, :=, ==, =/=, in, notin, subset, union, intersect,
        compose, <>, [[]], |-, |=, |->}
  forall D in AISP: Ambig(D) < 0.02
  Ambig := lambda D. 1 - |Parse_u(D)| / |Parse_t(D)|
}

;; --- Sigma: TYPE DECLARATIONS ---
[[Sigma:Types]]{
  HeroVariant := enum{"centered", "split", "overlay", "minimal"}
  HeroSection := Record{
    type: Literal("hero"), id: String, enabled: Bool := true,
    order: Nat := 0, variant: HeroVariant,
    layout: LayoutSchema, style: StyleSchema,
    components: List<HeroComponent>
  }
  HeroComponent := Sum{
    Badge{id: String, type: Literal("badge"),
      props: {text: String, icon: String, variant: String}},
    Heading{id: String, type: Literal("heading"),
      props: {text: String, level: Fin(6), size: String, weight: Nat}},
    Text{id: String, type: Literal("text"), props: {text: String}},
    Button{id: String, type: Literal("button"),
      props: {text: String, url: String, style: String, size: String}},
    Image{id: String, type: Literal("image"),
      props: {url: String, alt: String, aspect: String}},
    Video{id: String, type: Literal("video"),
      props: {url: String, autoplay: Bool}},
    Trust{id: String, type: Literal("trust"),
      props: {text: String, show: Bool}}
  }
}

;; --- Gamma: STRUCTURAL RULES ---
[[Gamma:Rules]]{
  forall h: HeroSection. exists! c in h.components: c.type == "heading"
  forall h: HeroSection. |{c in h.components | c.type == "button"}| >= 1
  forall h: HeroSection. forall c1, c2 in h.components:
    c1.order < c2.order -> render_before(c1, c2)
  h.variant == "overlay" ->
    exists c in h.components: c.id == "backgroundImage" ^ c.enabled == true
  h.variant == "centered" -> h.layout.align == "center"
  forall h: HeroSection. forall c1, c2 in h.components:
    c1 =/= c2 -> c1.id =/= c2.id
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
    (type_ok ^ has_heading ^ has_cta ^ ids_unique)

  resolve_content: HeroSection -> HeroContent
  resolve_content := lambda h.
    |h.components| > 0 -> components_to_hero_content(h.components)
    | h.content as HeroContent
}

;; --- Epsilon: EVIDENCE ---
[[Epsilon:Evidence]]{
  Theorem validate_sound:
    forall h: HeroSection. validate(h) == true ->
      h.type == "hero" ^ (exists c in h.components: c.type == "heading")
      ^ (exists c in h.components: c.type == "button")
      ^ (forall c1 c2: c1 =/= c2 -> c1.id =/= c2.id)
  Proof: By case analysis on validate definition. QED.

  density(hero.atom) >= 0.75
  tier(hero.atom) == Platinum
  Ambig(hero.atom) < 0.02
}
```

### Component Reference

| Block | Symbol | Purpose |
|-------|--------|---------|
| **Omega** | `[[Omega:Foundation]]` | Metalogic: symbol alphabet, ambiguity function |
| **Sigma** | `[[Sigma:Types]]` | Type declarations: enums, records, sum types |
| **Gamma** | `[[Gamma:Rules]]` | Structural rules: existence, uniqueness, ordering, variants |
| **Lambda** | `[[Lambda:Core]]` | Functions: validation, resolution, transformation |
| **Epsilon** | `[[Epsilon:Evidence]]` | Proofs: soundness theorems, tier evidence, ambiguity score |

### Symbol Reference Table

| Symbol | Name | Meaning |
|--------|------|---------|
| `forall` | Universal quantifier | "for all" elements |
| `exists` | Existential quantifier | "there exists" at least one |
| `exists!` | Unique existence | "there exists exactly one" |
| `in` / `notin` | Membership | Element belongs / does not belong |
| `subset` | Subset | Set contained within another |
| `union` / `intersect` | Set ops | Combined / common elements |
| `:=` | Definition | Assigns a definition |
| `==` / `=/=` | Equality | Equal / not equal |
| `->` | Implication / Function | "implies" or type arrow |
| `<->` | Biconditional | "if and only if" |
| `\|->` | Maps to | Function mapping |
| `\|-` / `\|=` | Proves / Models | Syntactic / semantic entailment |
| `lambda` | Lambda | Anonymous function |
| `PI` / `SIGMA` | Dependent types | Product / sum |
| `T` / `F` | Top / Bottom | True / false |
| `^` / `v` / `not` | Connectives | AND / OR / NOT |
| `compose` | Composition | Function composition |
| `QED` | Proof complete | End of proof |

### How to Validate

```bash
# Validate structure (must pass with zero errors)
aisp_validate <atom-content>

# Check tier (target: Platinum / diamond-plus-plus, density >= 0.75)
aisp_tier <atom-content>
```

**Rules:** All 5 blocks required. Every Gamma type must exist in Sigma. Every Lambda function needs a type signature. Epsilon needs at least one theorem with proof. Zero prose inside blocks. Ambiguity <2%.

---

## Spec Generator Template

### Template JSON Shape

Each of the 6 templates in `src/data/templates/` follows this structure:

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
      "id": "intro", "type": "intro", "heading": "# Title",
      "required": true,
      "fields": [
        { "key": "projectName", "type": "string", "required": true },
        { "key": "date", "type": "date", "required": true },
        { "key": "version", "type": "string", "required": false, "default": "1.0.0" }
      ],
      "template": "# {{projectName}}\n\n**Date:** {{date}}\n\n---"
    },
    {
      "id": "body", "type": "body", "heading": "## Main Content",
      "required": true,
      "subsections": [
        { "id": "overview", "heading": "### Overview",
          "fields": [{ "key": "summary", "type": "text", "required": true }],
          "template": "### Overview\n\n{{summary}}" }
      ]
    },
    {
      "id": "appendix", "type": "appendix", "heading": "## Appendix",
      "required": false,
      "fields": [{ "key": "references", "type": "list", "required": false }]
    }
  ],
  "formatting": {
    "headingStyle": "atx", "listStyle": "dash", "codeBlockStyle": "fenced",
    "lineWidth": 80, "sectionSeparator": "\n---\n"
  }
}
```

### The 6 Generators

| Generator | Template File | Purpose | Key Sections |
|-----------|--------------|---------|-------------|
| **North Star** | `north-star.json` | Product vision + strategy | Goals, audience, metrics, landscape |
| **SADD** | `sadd.json` | Architecture + design | Components, data flow, APIs, deploy |
| **Build Plan** | `build-plan.json` | Sprint implementation plan | Phases, sprints, tasks, dependencies |
| **Features** | `features.json` | Feature catalog + criteria | Feature list, priority, user stories |
| **Human Spec** | `human-spec.json` | Plain-language spec | What it does, how it works, glossary |
| **AISP Spec** | `aisp-spec.json` | Formal AISP specification | Omega, Sigma, Gamma, Lambda, Epsilon |

### Markdown Conventions

- **H1** for document title (one per document)
- **H2** for major sections (intro, body subsections, appendix)
- **H3** for subsections within body
- **Bold** for key terms and labels
- **Tables** for structured data (metrics, comparisons)
- **Code blocks** for technical content (fenced with triple backticks)
- **Task lists** for actionable items (Build Plan only)
- **Blockquotes** for user stories (Features only)

### Required Sections (All Templates)

1. **Intro** (`type: "intro"`) -- title, metadata, context
2. **Body** (`type: "body"`) -- substantive content with subsections
3. **Appendix** (`type: "appendix"`) -- optional supporting material

The `formatting` object ensures visual consistency across all 6 generators.
