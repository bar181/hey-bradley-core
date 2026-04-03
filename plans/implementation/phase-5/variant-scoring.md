# Variant Scoring Report

**Date**: 2026-04-02
**Tool**: Playwright automated screenshots at 1440x900
**Script**: `tests/variant-screenshots.mjs`
**Screenshots**: `tests/screenshots/variants/`

---

## Test Results Summary

- **Total tests**: 50
- **All OK**: 50 / 50 (all variants render without errors or blank content)
- **Zero crashes, zero blank sections, zero JS errors**

---

## Section-by-Section Scoring

### Hero (Main Banner) -- 8 Layouts

| Variant | Score | Notes |
|---------|-------|-------|
| Full Photo | 8/10 | Strong overlay gradient, readable text over background image. Professional look. |
| Full Video | 8/10 | Video background loads correctly with particle/network effect. Striking. |
| Clean | 7/10 | Minimal, spacious. Good typography but feels empty without media. |
| Simple | 7/10 | Compact centered layout. Works well for text-first landing pages. |
| Photo Right | 8/10 | Split layout with text left, image right. Well balanced. |
| Photo Left | 8/10 | Mirror of Photo Right. Equally well composed. |
| Video Below | 7/10 | Text top, video below. Clean separation but video appears small in viewport. |
| Photo Below | 8/10 | Dashboard/product image below headline. Good for SaaS showcases. |

**Section Score: 7.6 / 10**

### Columns (Features) -- 8 Variants

| Variant | Score | Notes |
|---------|-------|-------|
| Cards | 7/10 | Clean card grid with icons. Solid baseline. Cards visible below hero fold. |
| Image Cards | 7/10 | Cards with image placeholders. Needs actual images to shine. |
| Icon + Text | 7/10 | Simple icon with text pairs. Clean and functional. |
| Minimal | 6/10 | Very sparse. Needs more visual interest to feel polished. |
| Numbered | 7/10 | Step-by-step numbered layout. Good for process explanations. |
| Horizontal | 7/10 | Stacked horizontal rows. Good for fewer features with more detail. |
| Gradient | 7/10 | Gradient-tinted cards. Adds visual flair over basic cards. |
| Glass | 7/10 | Glassmorphism effect cards. Modern look, works in dark mode. |

**Section Score: 6.9 / 10**

### Action (CTA) -- 4 Variants

| Variant | Score | Notes |
|---------|-------|-------|
| Centered | 7/10 | Standard centered CTA block. Clean and functional. |
| Side by Side | 7/10 | Split layout with text and gradient. Good visual weight. |
| Gradient | 7/10 | Full gradient background CTA. Eye-catching. |
| Newsletter | 6/10 | Email signup variant. Functional but needs email input styling polish. |

**Section Score: 6.8 / 10**

### Quotes (Testimonials) -- 4 Variants

| Variant | Score | Notes |
|---------|-------|-------|
| Cards | 7/10 | Grid of quote cards with author initials. Clean layout. |
| Single | 7/10 | Large single quote display. Good for hero testimonials. |
| Stars | 7/10 | Star-rated reviews format. Good for product/service pages. |
| Minimal | 6/10 | Text-only quotes. Too plain for professional use. |

**Section Score: 6.8 / 10**

### Questions (FAQ) -- 4 Variants

| Variant | Score | Notes |
|---------|-------|-------|
| Expandable | 7/10 | Standard accordion FAQ. Functional and familiar pattern. |
| Side by Side | 7/10 | Two-column Q&A grid. Good for dense FAQ content. |
| Cards | 7/10 | Card-based FAQ layout. Each Q&A in its own card. |
| Numbered | 6/10 | Numbered questions. Functional but needs visual hierarchy work. |

**Section Score: 6.8 / 10**

### Numbers (Value Props / Stats) -- 4 Variants

| Variant | Score | Notes |
|---------|-------|-------|
| Counters | 7/10 | Large number counters. Bold and impactful. |
| Icons | 7/10 | Numbers with icons. Good visual anchoring. |
| Cards | 7/10 | Stats in card containers. Clean separation. |
| Gradient | 7/10 | Gradient-accented number cards. Adds visual interest. |

**Section Score: 7.0 / 10**

### Footer -- 3 Variants

| Variant | Score | Notes |
|---------|-------|-------|
| Multi-Column | 7/10 | Standard 3-column footer with link groups. Professional. |
| Simple Bar | 6/10 | Single-line footer. Minimal but may feel incomplete. |
| Minimal | 6/10 | Just copyright line. Too sparse for most sites. |

**Section Score: 6.3 / 10**

### Gallery -- 4 Variants

| Variant | Score | Notes |
|---------|-------|-------|
| Grid | 6/10 | Standard image grid. Needs actual images to evaluate properly; uses placeholder URLs. |
| Masonry | 6/10 | Pinterest-style layout. Same placeholder issue. |
| Carousel | 6/10 | Horizontal scroll gallery. Hard to assess without images loaded. |
| Full Width | 6/10 | Single-image showcase. Needs real content to shine. |

**Section Score: 6.0 / 10**

---

## Special UI Components

### Theme / Palette Selector

| Component | Score | Notes |
|-----------|-------|-------|
| Theme dropdown | 8/10 | Clean dropdown with color swatches, theme names, and descriptions. |
| Color palette presets | 8/10 | 10 palettes (Midnight, Forest, Sunset, Ocean, Rose, Cream, Lavender, Slate, Crimson, Neon) with color dot previews. Excellent UX. |
| Current colors display | 7/10 | Shows 6 palette colors as circles. Clear and compact. |
| Mode toggle | 7/10 | Light/Dark toggle buttons. Functional. |

**Component Score: 7.5 / 10**

### ImagePicker Dialog

| Component | Score | Notes |
|-----------|-------|-------|
| Photo grid | 9/10 | 50+ curated Unsplash images across 8 categories. Thumbnails load well. Professional-grade image library. |
| Category sidebar | 8/10 | Clean sidebar with Food, Nature, Business, Technology, People, Creative, Architecture, Abstract categories. |
| Video tab | 7/10 | 10 curated Pexels videos. Good selection but small count. |
| Effects tab | 7/10 | 6 image effects (overlay, fade, Ken Burns, zoom, parallax, full bleed). Useful but not yet connected to all renderers. |

**Component Score: 7.8 / 10**

---

## Light Mode Assessment

| Section | Score | Notes |
|---------|-------|-------|
| Light Hero | 5/10 | Light mode applied but the palette appears to remain dark-toned (dark blue/navy background in preview). The app chrome remains dark. Light mode needs a proper light palette to fully differentiate. |
| Light Columns | 5/10 | Same issue -- content area background stays dark despite light mode toggle. |
| Light Action | 5/10 | Layout variant buttons in right panel appear correctly but preview still dark. |
| Light Quotes | 5/10 | Same dark preview issue. |
| Light Questions | 5/10 | Same. |
| Light Numbers | 5/10 | Same. |
| Light Footer | 5/10 | Same. |
| Light Gallery | 5/10 | Same. |

**Light Mode Score: 5.0 / 10**

**Light Mode Issue**: The light mode toggle switches the theme mode flag, but when a dark palette (like "Tech Business") is selected, switching to light mode does not automatically pick a light-friendly palette. The preview content remains on dark backgrounds. This is a significant UX gap -- users expect "Light" mode to produce a visibly light page.

---

## Blockers (Score < 5)

None of the variants score below 5. However, the following are near-blockers:

1. **Light mode does not visually switch preview to light backgrounds** (5/10) -- The mode toggle exists but the preview appearance doesn't meaningfully change when a dark palette is active. Users will think light mode is broken.

---

## Overall Scores

| Category | Score |
|----------|-------|
| Hero variants | 7.6 |
| Columns variants | 6.9 |
| Action variants | 6.8 |
| Quotes variants | 6.8 |
| Questions variants | 6.8 |
| Numbers variants | 7.0 |
| Footer variants | 6.3 |
| Gallery variants | 6.0 |
| Theme/Palette UI | 7.5 |
| ImagePicker | 7.8 |
| Light mode | 5.0 |
| **Weighted Average** | **6.6** |

### Overall Builder Score: 66 / 100

---

## Key Findings

### What Works Well
- All 39 section variants render without errors or crashes (100% functional)
- Hero section has the best variety with 8 distinct, professional layouts
- ImagePicker dialog is excellent -- curated library with categories is a standout feature
- Theme palette selector provides good variety (10 presets)
- Right panel layout switcher UX is clean and intuitive (icon + label grid)
- Dark mode is cohesive and polished across all sections

### What Needs Work
1. **Light mode palette handling** -- toggling to light mode should auto-apply a light-friendly palette or at minimum swap background/text colors
2. **Gallery section** -- needs default images populated on creation so it doesn't appear empty
3. **Footer minimal variant** -- too sparse, needs at least brand name + copyright to look professional
4. **Preview auto-scroll** -- selecting a section in the left panel does not scroll the preview to that section, making it hard to see below-the-fold sections
5. **Column count controls** -- the Features/Columns section editor sets variant names but the original column count picker (2/3/4) from the previous audit appears replaced by variant names; column count is hardcoded per variant

### Recommendations for 70+ Score
1. Fix light mode to auto-apply cream/slate palette when switching (quick win, +5 points)
2. Add default gallery images on section creation (+2 points)
3. Add preview auto-scroll to selected section (+3 points)
4. Polish footer minimal variant with better defaults (+1 point)
