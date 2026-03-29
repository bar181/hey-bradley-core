# ADR-022: Section Type Registry

**Date:** 2026-03-29 | **Status:** ACCEPTED

## Context

Hey Bradley needs a standardized registry of website section types. Phase 1.0-1.4 implemented hero (4 variants), features (1 variant), and CTA (1 variant). The remaining section types (pricing, footer, testimonials, FAQ, value_props) lack Zod schemas, renderers, JSON templates, and SIMPLE tab editors.

The existing `sectionTypeSchema` in `src/lib/schemas/section.ts` already enumerates 8 types:
```ts
z.enum(['hero', 'features', 'pricing', 'cta', 'footer', 'testimonials', 'faq', 'value_props'])
```

Each section type needs four artifacts to be fully supported: a Zod schema, variant renderers, a SIMPLE tab editor, and JSON template entries in theme files.

## Decision

### Hey Bradley supports 8 section types, each with a Zod schema, JSON template, renderer, and SIMPLE tab editor.

### Architecture Pattern

Each section type follows a consistent four-file pattern:

```
src/templates/{type}/schema.ts                          → Zod schema
src/templates/{type}/{Variant}.tsx                      → Renderer(s)
src/components/right-panel/simple/Section{Type}Simple.tsx → SIMPLE tab editor
src/data/themes/*.json                                  → sections[] entry
```

### Section Types, Variants, and Component Sets

#### 1. Hero (implemented)

| Variant | Renderer | Status |
|---------|----------|--------|
| `centered` | `HeroCentered.tsx` | Done |
| `overlay` | `HeroOverlay.tsx` | Done |
| `split-right`, `split-left` | `HeroSplit.tsx` | Done |
| `minimal` | `HeroMinimal.tsx` | Done |

**Components:** eyebrow (badge), headline (heading), subtitle (text), primaryCta (button), secondaryCta (button), heroImage (image), backgroundImage (image), heroVideo (video), trustBadges (trust).

**Editor:** `SectionSimple.tsx` (existing, handles hero only).

---

#### 2. Features (partially implemented)

| Variant | Renderer | Status |
|---------|----------|--------|
| `grid-3col` | `FeaturesGrid.tsx` | Done |
| `grid-4col` | `FeaturesGrid4.tsx` | Planned |
| `alternating` | `FeaturesAlternating.tsx` | Planned |
| `icon-list` | `FeaturesIconList.tsx` | Planned |

**Components per feature card:**
- `icon` (string, optional) — Lucide icon slug
- `title` (string, required) — max 60 chars
- `description` (string, required) — max 200 chars

**Section-level components:** sectionTitle (heading, optional), sectionSubtitle (text, optional), featureCards[] (3-6 feature-card items).

**Editor:** `SectionFeaturesSimple.tsx` — edit card title/description/icon, add/remove/reorder cards, toggle section title.

---

#### 3. Pricing

| Variant | Renderer |
|---------|----------|
| `3-tier` | `Pricing3Tier.tsx` |
| `2-tier` | `Pricing2Tier.tsx` |
| `comparison` | `PricingComparison.tsx` |

**Components per pricing tier:**
- `tierName` (string, required) — max 20 chars
- `price` (string, required) — "$0", "$29", "Custom"
- `period` (string, optional) — "/month", "/year"
- `description` (string, optional) — max 100 chars
- `features[]` (array of string, required) — included features list
- `ctaButton` (button, required) — text + URL + style
- `highlighted` (boolean, optional) — recommended badge
- `badge` (string, optional) — "Most Popular", "Best Value"

**Section-level components:** sectionTitle, sectionSubtitle, billingToggle (monthly/annual), tiers[] (2-3 pricing-tier items).

**Editor:** `SectionPricingSimple.tsx` — edit tier names/prices/features, toggle highlight, manage billing toggle.

---

#### 4. CTA (partially implemented)

| Variant | Renderer | Status |
|---------|----------|--------|
| `simple` | `CTASimple.tsx` | Done |
| `split` | `CTASplit.tsx` | Planned |
| `gradient` | `CTAGradient.tsx` | Planned |
| `newsletter` | `CTANewsletter.tsx` | Planned |

**Components:**
- `heading` (string, required) — max 80 chars
- `subtitle` (string, optional) — max 200 chars
- `primaryButton` (button, required) — text + URL
- `secondaryButton` (button, optional)
- `backgroundImage` (image, optional)
- `emailInput` (input, optional) — newsletter variant only

**Editor:** `SectionCTASimple.tsx` — edit heading/subtitle/buttons, toggle background image.

---

#### 5. Footer

| Variant | Renderer |
|---------|----------|
| `multi-column` | `FooterMultiColumn.tsx` |
| `simple` | `FooterSimple.tsx` |
| `minimal` | `FooterMinimal.tsx` |

**Components:**
- `logo` (image/text, optional)
- `tagline` (string, optional) — max 100 chars
- `columns[]` (array of link-column, required) — 3-5 columns, each with heading + links[]
- `socialIcons[]` (array of social-link, optional) — platform + URL
- `copyright` (string, required) — e.g. "(c) 2026 Company. All rights reserved."
- `legalLinks[]` (array of link, optional) — Privacy Policy, Terms

**Editor:** `SectionFooterSimple.tsx` — edit column headings/links, manage social icons, edit copyright.

---

#### 6. Testimonials

| Variant | Renderer |
|---------|----------|
| `card-grid` | `TestimonialsCardGrid.tsx` |
| `single-quote` | `TestimonialsSingleQuote.tsx` |
| `carousel` | `TestimonialsCarousel.tsx` |
| `logo-wall` | `TestimonialsLogoWall.tsx` |

**Components per testimonial:**
- `quote` (string, required) — max 300 chars
- `authorName` (string, required)
- `authorRole` (string, optional) — "CEO at Acme"
- `avatar` (image URL, optional)
- `rating` (number 1-5, optional)
- `companyLogo` (image URL, optional)

**Section-level components:** sectionTitle, sectionSubtitle, testimonials[] (3-5 testimonial items).

**Editor:** `SectionTestimonialsSimple.tsx` — edit quotes/authors, add/remove testimonials, toggle avatars/ratings.

---

#### 7. FAQ

| Variant | Renderer |
|---------|----------|
| `accordion` | `FAQAccordion.tsx` |
| `two-column` | `FAQTwoColumn.tsx` |
| `plain-list` | `FAQPlainList.tsx` |

**Components per FAQ item:**
- `question` (string, required) — max 120 chars
- `answer` (string, required) — supports basic formatting, max 500 chars

**Section-level components:** sectionTitle, sectionSubtitle, faqItems[] (4-8 faq-item items).

**Editor:** `SectionFAQSimple.tsx` — edit questions/answers, add/remove items, reorder.

---

#### 8. Value Props (Stats/Numbers)

| Variant | Renderer |
|---------|----------|
| `stats-bar` | `ValuePropsStatsBar.tsx` |
| `icon-grid` | `ValuePropsIconGrid.tsx` |
| `big-numbers` | `ValuePropsBigNumbers.tsx` |

**Components per stat item:**
- `value` (string, required) — "500+", "99.9%", "$2B"
- `label` (string, required) — "Customers", "Uptime"
- `description` (string, optional) — max 100 chars
- `icon` (Lucide icon slug, optional)
- `prefix` (string, optional) — "$", "#"
- `suffix` (string, optional) — "+", "%", "x"

**Section-level components:** sectionTitle, sectionSubtitle, stats[] (3-4 stat-items).

**Editor:** `SectionValuePropsSimple.tsx` — edit values/labels/descriptions, add/remove stats.

---

### Default Variants Per Theme

When a theme JSON includes a section, it specifies a default variant. The renderer dispatches to the correct component:

```ts
// src/templates/renderSection.ts
export function renderSection(section: Section) {
  const key = `${section.type}/${section.variant}`
  // e.g. "features/grid-3col" → FeaturesGrid
  // e.g. "pricing/3-tier" → Pricing3Tier
  return RENDERER_MAP[key]?.(section) ?? null
}
```

### JSON Template Shape

Every section in `src/data/themes/*.json` follows the existing pattern established by hero, features, and CTA:

```json
{
  "type": "testimonials",
  "id": "testimonials-01",
  "enabled": true,
  "order": 4,
  "variant": "card-grid",
  "layout": { "display": "grid", "columns": 3, "gap": "32px", "padding": "64px 24px" },
  "style": { "background": "#12122a", "color": "#f8fafc" },
  "components": [
    { "id": "t1", "type": "testimonial", "enabled": true, "order": 0, "props": { "quote": "...", "authorName": "...", "authorRole": "..." } },
    { "id": "t2", "type": "testimonial", "enabled": true, "order": 1, "props": { "quote": "...", "authorName": "...", "authorRole": "..." } },
    { "id": "t3", "type": "testimonial", "enabled": true, "order": 2, "props": { "quote": "...", "authorName": "...", "authorRole": "..." } }
  ]
}
```

## Consequences

**Positive:**
- Every section type has a predictable 4-file structure (schema, renderer, editor, JSON)
- New variants can be added without changing the registry or schema
- SIMPLE tab editors follow the same Field/Toggle/CharDot pattern established by hero
- JSON templates are self-describing; AI agents can generate new sections from the schema
- The `components[]` array pattern (ADR-016) extends consistently to all section types

**Negative:**
- 8 types x ~3 variants each = ~24 renderer files to build
- Feature parity across all themes requires each theme JSON to include all 8 sections
- Some variants (carousel, comparison table) have higher implementation complexity

**Migration:** Existing hero, features, and CTA renderers do not change. New sections are additive.
