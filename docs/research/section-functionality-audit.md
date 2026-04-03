# Section Functionality Audit

**Date:** 2026-04-02
**Tested on:** http://localhost:5173/builder
**Method:** Playwright automated test (`tests/section-audit.mjs`) + code review of all template renderers and right-panel editors

---

## Summary

| Metric | Count |
|--------|-------|
| Section types defined in schema | 9 |
| Template renderers | 15 files across 7 directories |
| Right-panel editors | 9 type-specific editors + 1 fallback |
| Variant switchers (layout pickers) | 4 sections have them (hero, features, cta, faq) |
| Critical bugs found | 3 |
| Missing features | 8 (mostly image support) |

---

## Results Table

| Section Type | Variant/Check | Works? | Notes |
|-------------|--------------|--------|-------|
| **navbar** | editor-loads | OK | Elements + Content accordions present |
| navbar | logo-edit | OK | Logo text editable via `NavbarSectionSimple` |
| navbar | cta-edit | OK | CTA button text editable |
| navbar | variants | OK | Single variant (`NavbarSimple`) -- no switcher needed |
| navbar | image-support | NO | Text-only brand name, no logo image upload |
| **hero** | editor-loads | OK | Layout/Elements/Media/Content accordions present |
| hero | Full Photo | OK | `HeroOverlay` renders with dark gradient overlay |
| hero | Full Video | OK | `HeroCentered` with background video |
| hero | Clean | OK | `HeroMinimal` renders with 600px min height |
| hero | Simple | OK | `HeroCentered` renders centered layout |
| hero | Photo Right | OK | `HeroSplit` renders two-column with image right |
| hero | Photo Left | OK | `HeroSplit` renders with `order-2` for text column |
| hero | Video Below | OK | `HeroCentered` with inline video below content |
| hero | Photo Below | OK | `HeroCentered` with inline image below content |
| hero | image-support | OK | `ImagePicker` shown for all photo layout presets |
| **features** | editor-loads | OK | Layout + Content accordions present |
| features | 2 Columns | **BROKEN** | Editor sets `layout.columns=2` but `FeaturesGrid` hardcodes `md:grid-cols-3` |
| features | 3 Columns | OK | Matches hardcoded value (works by coincidence) |
| features | 4 Columns | **BROKEN** | Editor sets `layout.columns=4` but renderer ignores it |
| features | Card Style | OK | Switches from `FeaturesGrid` to `FeaturesCards` template |
| features | add-card | OK | Add Another button present (max 6 cards) |
| features | image-support | NO | Only icon slug + title + description, no image upload |
| **cta** | editor-loads | OK | Layout/Elements/Content accordions present (note: CTA is disabled by default in config, must be enabled first) |
| cta | Centered | OK | `CTASimple` renders centered text + button |
| cta | Side by Side | OK | `CTASplit` renders two-column with gradient placeholder |
| cta | image-support | NO | `CTASplit` shows a hardcoded gradient box, not a user-uploadable image |
| **pricing** | editor-loads | OK | Elements + Content accordions present |
| pricing | variants | OK | Single variant (`PricingTiers`) -- auto-adapts grid based on tier count |
| pricing | content-editing | OK | Name, price, period, features (CSV), CTA text/URL all editable |
| pricing | image-support | NO | No image support |
| **testimonials** | editor-loads | OK | Elements + Content accordions present |
| testimonials | variants | OK | Single variant (`TestimonialsCards`) -- 3-column card grid |
| testimonials | content-editing | OK | Quote, author, role all editable |
| testimonials | image-support | NO | Uses first-letter avatar circle, no photo upload |
| **faq** | editor-loads | OK | Layout + Content accordions present |
| faq | Expandable | OK | `FAQAccordion` renders with collapsible Q&A items |
| faq | Side by Side | OK | `FAQTwoCol` renders 2-column grid with "Frequently Asked Questions" heading |
| faq | image-support | NO | Q&A text only |
| **value_props** | editor-loads | OK | Elements + Content accordions present |
| value_props | variants | OK | Single variant (`ValuePropsGrid`) -- 2-col mobile, 4-col desktop |
| value_props | content-editing | OK | Value, label, description all editable |
| value_props | image-support | NO | Numbers/text only |
| **footer** | editor-loads | OK | Elements + Content accordions present |
| footer | variants | OK | Single variant (`FooterSimple`) -- 4-column grid |
| footer | content-editing | OK | Brand text, 3 link columns (CSV), copyright all editable |
| footer | image-support | NO | Text brand only, no logo image |

---

## Critical Bugs

### 1. Features column count is broken (2-col and 4-col do nothing)

**Location:** `src/templates/features/FeaturesGrid.tsx` line 43

The editor (`FeaturesSectionSimple`) correctly writes `layout.columns` to the config store when the user picks 2 Columns, 3 Columns, or 4 Columns. However, `FeaturesGrid` **hardcodes** `md:grid-cols-3` and never reads `section.layout.columns`:

```tsx
// FeaturesGrid.tsx line 43 — hardcoded, ignores layout.columns
<div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
```

`FeaturesCards` has the same issue (line 22):

```tsx
// FeaturesCards.tsx line 22 — also hardcoded
<div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
```

**Fix:** Both renderers should read `section.layout.columns` and use it dynamically:
```tsx
const cols = section.layout.columns ?? 3
// Then use template literal: `md:grid-cols-${cols}`
```

### 2. Features "Card Style" variant detection inconsistent

The `renderSection` function in `RealityTab.tsx` checks `section.variant === 'cards'` to switch between `FeaturesGrid` and `FeaturesCards`. The editor sets variant to `'cards'`, which works correctly. However, `FeaturesCards` is visually almost identical to `FeaturesGrid` (same 3-col grid, similar card styling) making the switch feel like it does nothing.

### 3. CTA section disabled by default, not easily discoverable

The CTA section exists in the default config but is disabled (`enabled: false`). Users must expand the "hidden sections" disclosure in the left panel and click the eye icon to enable it. This makes CTA less discoverable than sections that can be added fresh via "Add Section."

---

## Missing Features (by section)

### Image Support Gaps

| Section | Current State | What's Missing |
|---------|--------------|----------------|
| navbar | Text brand only | Logo image upload (e.g., company logo SVG/PNG) |
| hero | ImagePicker works | Fully functional -- no gap |
| features | Icon slugs only (9 Lucide icons) | Feature card images or custom icon upload |
| cta | Gradient placeholder in CTASplit | User-uploadable image for the visual side |
| pricing | None | Tier header images or icons |
| testimonials | Letter-initial circle | Avatar photo upload per testimonial |
| faq | None | Not critical -- FAQ rarely needs images |
| value_props | None | Optional icon or image per stat |
| footer | None | Logo image, social media icons |

### Other Missing Features

1. **No add/remove for FAQ items** -- The FAQ editor shows existing items but has no "Add Another" button to add new Q&A pairs
2. **No add/remove for testimonials** -- Same issue: shows existing testimonials but no way to add more
3. **No add/remove for value props** -- Same pattern
4. **No add/remove for pricing tiers** -- Locked to whatever the theme provides
5. **Footer link columns are fixed** -- Always 3 columns, no way to add/remove columns
6. **Testimonials have no layout variants** -- Only card grid, no carousel/list/marquee option
7. **Value props have no layout variants** -- Only 4-column grid, no alternative layouts
8. **Pricing has no layout variants** -- Only tier cards, no comparison table option

---

## Variant Switcher Audit

### Sections WITH working variant switchers (4 of 9):

| Section | Variants Available | Both Switch Correctly? |
|---------|-------------------|----------------------|
| hero | 8 layout presets (Full Photo, Full Video, Clean, Simple, Photo Right, Photo Left, Video Below, Photo Below) | YES -- all 8 switch renderer and/or media correctly |
| features | 4 variants (2-col, 3-col, 4-col, Card Style) | PARTIAL -- Grid/Cards switch works, but column count is ignored by renderer |
| cta | 2 variants (Centered, Side by Side) | YES -- switches between CTASimple and CTASplit |
| faq | 2 variants (Expandable, Side by Side) | YES -- switches between FAQAccordion and FAQTwoCol |

### Sections WITHOUT variant switchers (5 of 9):

| Section | Templates Available | Should Have Variants? |
|---------|-------------------|---------------------|
| navbar | NavbarSimple only | Maybe (transparent, solid, centered logo) |
| pricing | PricingTiers only | Maybe (comparison table, toggle monthly/annual) |
| testimonials | TestimonialsCards only | Yes (carousel, list, marquee, single featured) |
| value_props | ValuePropsGrid only | Maybe (horizontal bar, icon grid) |
| footer | FooterSimple only | Maybe (minimal, centered, multi-section) |

---

## Column Count Behavior

The `layout.columns` field exists in the schema (`layoutSchema` in `src/lib/schemas/layout.ts`) and is correctly set by the Features editor. However, **no renderer reads it**.

- `FeaturesGrid` hardcodes `md:grid-cols-3`
- `FeaturesCards` hardcodes `md:grid-cols-3`
- `TestimonialsCards` hardcodes `md:grid-cols-3`
- `ValuePropsGrid` hardcodes `grid-cols-2 md:grid-cols-4`
- `PricingTiers` dynamically calculates based on tier count (2 or 3), which is correct
- `FooterSimple` hardcodes `grid-cols-2 md:grid-cols-4`

---

## Architecture Notes

### Renderer Selection (`RealityTab.tsx` renderSection function)

The variant-to-renderer mapping in `renderSection()` is a switch/if chain:

- `hero` variant: `split-right`/`split-left` -> HeroSplit, `overlay` -> HeroOverlay, `minimal` -> HeroMinimal, default -> HeroCentered
- `features` variant: `cards` -> FeaturesCards, default -> FeaturesGrid
- `cta` variant: `split` -> CTASplit, default -> CTASimple
- `faq` variant: `two-column` -> FAQTwoCol, default -> FAQAccordion
- All others: single template (no variant switching)

### Editor Selection (`SimpleTab.tsx`)

Each section type maps to a dedicated editor component. All 9 types have editors. The fallback `SectionSimple` (hero editor) is used for unknown types.

### Default Config

Only 4 sections ship in `default-config.json`:
- navbar (enabled)
- hero (enabled)
- features (disabled)
- cta (disabled)

All other sections must be added via "Add Section," which clones from the current theme's section templates.

---

## Recommendations (Priority Order)

1. **Fix FeaturesGrid/FeaturesCards column count** -- Read `section.layout.columns` instead of hardcoding `md:grid-cols-3`
2. **Add CTA to default config as enabled** -- Or at least make the hidden sections toggle more prominent
3. **Add image support to testimonials** -- Avatar photos are expected by users
4. **Add image support to navbar** -- Logo image is standard for any landing page
5. **Add add/remove buttons to FAQ, testimonials, value props, and pricing** -- Currently locked to theme-provided items
6. **Add more variant templates** -- Especially for testimonials (carousel) and pricing (comparison table)
